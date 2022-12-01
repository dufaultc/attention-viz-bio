# -*- coding: UTF-8 -*-
from typing import Set
from app import app
from app.dataService.dataService import DataService
import json
import os
import numpy as np
from flask import send_file, request, jsonify, send_from_directory
from datetime import datetime
from os.path import dirname, abspath, join

# Alter: abspath('') is called from back/run.py
rootDir = dirname(abspath(''))
# print('here', rootDir)

# _current_dir = os.path.dirname(os.path.abspath(__file__))
dataService = DataService()


def default(o):
    if isinstance(o, np.int_):
        return int(o)
    raise TypeError


@app.route('/')
def _index():
    return json.dumps("back end")


@app.route("/get_raw_data", methods=['GET'])
def test():
    data = dataService.get_raw_data()
    return data

# @app.route("/test", methods=['GET'])
# def test():
#     return send_file(
#             join(rootDir, 'data', 'douyin_images', '13', 'output_0001.jpg'),
#             as_attachment=True,
#             attachment_filename='test.jpg',
#             mimetype='image/jpeg'
#         )

# @app.route('/getVideoById/<id>', methods=['GET'])
# def _get_video_by_id(id):
#     return dataService.get_video_by_id(id)

# @app.route('/getVideoList')
# def _get_video_list():
#     return dataService.get_video_list()

# @app.route('/saveCurrentVideo', methods=['POST'])
# def _save_video():
#     post_data = json.loads(request.data.decode())
#     return dataService.save_video(post_data)

# @app.route('/saveVideoList', methods=['POST'])
# def _save_video_list():
#     post_data = json.loads(request.data.decode())
#     return dataService.save_video_list(post_data)

# @app.route('/getReviewByID/<id>', methods=['GET'])
# def _get_review_by_id(id):
#     return dataService.get_review_by_id(id)

# @app.route('/download', methods=['GET'])
# def _download():
#     data = dataService.get_archive()
#     return send_file(data, attachment_filename='archive.zip', as_attachment=True)

# @app.route('/queryVideos', methods=['POST'])
# def _query_videos():
#     post_data = json.loads(request.data.decode())
#     return dataService.query_videos(post_data)


if __name__ == '__main__':
    pass
