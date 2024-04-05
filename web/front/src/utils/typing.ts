// define the types here
export namespace Typing {
    export interface MatrixData {
        head: number;
        layer: number;
        tokens: TokenCoordinate[];
    }
    export interface TokenCoordinate { // depends on head and layer
        tsne_x: number;
        tsne_y: number;
        umap_x: number;
        umap_y: number;
        norm: number;
        pca_x: number;
        pca_y: number;
    }
    export interface TokenData { // shared by all heads and layers
        position: number;
        pos_int: number;
        sent_pos: number;
        num_sent: number;
        region_type: string;
        genomic_element: string;
        length: number;
        sentence: string;
        type: string;
        value: string;
        imagePath: string;
        originalPatchPath: string;
        originalImagePath: string;
    }
    export interface PointCoordinate {
        tsne: [number, number];
        umap: [number, number];
        pca: [number, number];
    }
    export interface PointColor {
        query_key: number[];
        position: number[];
        pos_mod_5: number[];
        special_tokens: number[];
        region_type: number[];
        sent_pos: number[];
        embed_norm: number[];
        //token_length: number[];
        sent_length: number[];
        token_freq: number[];
        row: number[];
        column: number[];
        qk_map: number[];
        no_outline: number[];
    }
    export interface PointMsg {
        position: string;
        region: string;
        categorical: string;
        norm: string;
        length: string;
        freq: string;
    }
    export interface Point {
        coordinate: PointCoordinate;
        color: PointColor;
        msg: PointMsg;
        layer: number;
        head: number;
        index: number;
        value: string;
        type: string;
        normScaled: number;
        imagePath: string;
        originalPatchPath: string;
    }
    export interface PlotHead {
        layer: number;
        head: number;
        title: [string, string];
        coordinate: [number, number];
    }
    export interface Projection {
        points: Point[];
        headings: PlotHead[];
        range: {
            x: [number, number];
            y: [number, number];
        },
        unique: string[]
    }
    export interface AttnByToken {
        layer: number;
        head: number;
        attns: number[][];
        agg_attns: number[][];
        norms: number[];
        agg_norms: number[];
        token: TokenData
    }
}