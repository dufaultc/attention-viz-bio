# -*- coding: utf-8 -*-
from collections import OrderedDict
import os
import datetime
import math
import numpy as np
import pandas as pd
import re
import sys
import json
import itertools
from typing import List
from os.path import dirname, abspath, join, relpath
import copy
import io
from PIL import Image
from base64 import encodebytes
from glob import glob
from flask import jsonify
import zipfile
import json
import time

# get the /TableCharts
# Alter: abspath('') is called from back/run.py
rootDir = dirname(abspath(''))
print(rootDir)

# data unique to each layer/head (e.g., tsne/umap coordinates + norms)


def read_matrix_data(model):
    matrix_data = []
    time_start = time.time()

    for f in sorted(glob(join(rootDir, 'data', model, 'byLayerHead', '*.json'))):
        d = json.load(open(f, 'r'))
        matrix_data.append(d)

    print('{} MatrixData Done! Time elapsed: {} seconds'.format(
        model, time.time()-time_start))
    return matrix_data

# attention info for each layer/head


def read_attention_data(model):
    time_start = time.time()
    attention_data = []

    for f in sorted(glob(join(rootDir, 'data', model, 'attention', '*.json'))):
        d = json.load(open(f, 'r'))
        attention_data.append(d)

    print('{} AttentionData Done! Time elapsed: {} seconds'.format(model,
                                                                   time.time()-time_start))
    return attention_data

# data shared across attention heads (e.g., token value, type, sentence)


def read_token_data(model):
    time_start = time.time()
    d = json.load(open(join(rootDir, 'data', model, 'tokens.json')))
    print('{} TokenData Done! Time elapsed: {} seconds'.format(
        model, time.time()-time_start))
    return d

# aggregate attention info for each head


def read_agg_attn_data(model):
    time_start = time.time()
    d = json.load(open(join(rootDir, 'data', model, 'agg_attn.json')))
    print('{} AggAttnData Done! Time elapsed: {} seconds'.format(
        model, time.time()-time_start))
    return d

# helper function for normalizing aggregate attn data


def normalize_attn(data):
    normalized_data = []
    for row in data:
        row_sum = sum(row)
        normalized_row = [0 if r == 0 else round(
            (r / row_sum), 3) for r in row]
        normalized_data.append(normalized_row)
    return normalized_data


class DataService(object):
    def __init__(self):
        print('------inited------')
        # self.df = pd.read_csv(join(rootDir, 'prodata', 'pro_data_results.csv')) .h5 .npy
        # read data here

        # bert
        self.matrix_data_bert = read_matrix_data("bert")
        self.attention_data_bert = read_attention_data("bert")
        self.agg_att_data_bert = read_agg_attn_data("bert")
        self.token_data_bert = read_token_data("bert")

        # gpt
        self.matrix_data_gpt = read_matrix_data("gpt")
        self.attention_data_gpt = read_attention_data("gpt")
        self.agg_att_data_gpt = read_agg_attn_data("gpt")
        self.token_data_gpt = read_token_data("gpt")

        # VIT-32
        self.matrix_data_vit_32 = read_matrix_data("vit_32")
        self.token_data_vit_32 = read_token_data("vit_32")

        # VIT-16
        self.matrix_data_vit_16 = read_matrix_data("vit_16")
        self.token_data_vit_16 = read_token_data("vit_16")

        return None

    # def get_raw_data(self):
    #     # return data to the front end
    #     return self.data

    def get_matrix_data(self, model):
        if model == "bert":
            return self.matrix_data_bert
        elif model == "vit-16":
            return self.matrix_data_vit_16
        elif model == "vit-32":
            return self.matrix_data_vit_32
        return self.matrix_data_gpt

    # def get_attention_data(self, model):
    #     if model == "bert":
    #         return self.attention_data_bert
    #     return self.attention_data_gpt

    def get_token_data(self, model):
        if model == "bert":
            return self.token_data_bert
        elif model == "vit-16":
            # print(self.token_data_vit_16)
            return self.token_data_vit_16
        elif model == "vit-32":
            # print(self.token_data_vit_32)
            return self.token_data_vit_32
        return self.token_data_gpt

    def get_attention_by_token(self, token, model):
        layer = token['layer']
        head = token['head']
        index = token['index']

        # get info for the clicked on token
        if model == "bert":
            all_token_info = self.token_data_bert['tokens'][index]
            offset = len(self.token_data_bert['tokens']) / 2
        else:
            all_token_info = self.token_data_gpt['tokens'][index]
            offset = len(self.token_data_gpt['tokens']) / 2

        # find start/end position for sentence
        start = index - all_token_info['pos_int']
        if all_token_info['type'] == "key":  # pass same attn info for key
            start -= int(offset)
        num_tokens = all_token_info['length']
        end = start + num_tokens

        # now get attn info
        if model == "bert":
            attn_data = self.attention_data_bert
            agg_attns = self.agg_att_data_bert['{}_{}'.format(
                layer, head)][:num_tokens]
        else:
            attn_data = self.attention_data_gpt
            agg_attns = self.agg_att_data_gpt['{}_{}'.format(
                layer, head)][:num_tokens]

        for plot in attn_data:
            if plot['layer'] == layer and plot['head'] == head:
                attns = plot['tokens'][start:end]
                break

        attn = [t['attention'] for t in attns]
        agg_attn = [] if model not in ["bert", "gpt"] else normalize_attn([t['attention'][:num_tokens]
                                                                           for t in agg_attns])
        norms = [] if model != "gpt" else [t['value_norm'] for t in attns]
        agg_norms = [] if model != "gpt" else [t['value_norm'] for t in agg_attns]

        return {
            'layer': layer,
            'head': head,
            'attns': attn,
            'agg_attns': agg_attn,
            'norms': norms,
            'agg_norms': agg_norms,
            'token': all_token_info
        }


if __name__ == '__main__':
    print('start dataservice')
    dataService = DataService()
