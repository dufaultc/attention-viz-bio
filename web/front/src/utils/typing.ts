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
    }
    export interface AttentionData {
        head: number;
        layer: number;
        tokens: AttnCoordinate[];
    }
    export interface AttnCoordinate {
        attention: number[];
    }
    export interface TokenData { // shared by all heads and layers
        position: number;
        pos_int: number;
        length: number;
        sentence: string;
        type: string;
        value: string;
    }

    export interface Point {
        coordinate: [number, number];
        color: number[];
        msg: string;
        layer: number;
        head: number;
        index: number;
    }
    export interface PlotHead {
        layer: number;
        head: number;
        title: string;
        coordinate: Point2D;
    }
    export interface Projection {
        points: Point[];
        headings: PlotHead[];
        range: {
            x: [number, number];
            y: [number, number];
        }
    }

    export interface AttnByToken {
        attns: number[][];
        token: TokenData
    }
}