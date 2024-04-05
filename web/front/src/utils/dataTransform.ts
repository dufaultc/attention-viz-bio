import { Typing } from "@/utils/typing";
import * as d3 from "d3";
import * as _ from "underscore";

/* Utility functions for helping render visualization */

const computeMatrixProjectionPoint = (matrixData: Typing.MatrixData[], tokenData: Typing.TokenData[], matrixCellWidth = 100, matrixCellHeight = 100, matrixCellMargin = 20) => {
    var results = [] as Typing.Point[];
    const values = tokenData.map(td => td.value);
    //const genomic_element_types = tokenData.map(td => td.genomic_element_type);
    const types = tokenData.map(td => td.type);
    const lengths = tokenData.map(td => td.length);

    const longestString = (arr: string[]) => {
        // find longest string for later
        return arr.reduce((max, name) => {
            return name.length > max.length ? name : max
        }, arr[0])
    }

    const shortestString = (arr: string[]) => {
        // find shortest string for later
        return arr.reduce((max, name) => {
            return name.length < max.length ? name : max
        }, arr[0])
    }

    const maxStringLength = longestString(values).length;
    const minStringLength = shortestString(values).length;
    const rangeStringLength = maxStringLength - minStringLength;
    const maxSentLength = lengths.reduce((a, b) => Math.max(a, b), -Infinity);
    const minSentLength = lengths.reduce((a, b) => Math.min(a, b), Infinity);
    const rangeSentLength = maxSentLength - minSentLength;

    // get token frequencies too
    let maxFreq = 0; // max token frequency

    const tokFreq = values.reduce((acc: any, curr: any) => {
        acc[curr] = (acc[curr] ?? 0) + 1;
        if (acc[curr] > maxFreq) {
            maxFreq = acc[curr];
        }
        return acc;
    }, {});

    const rangeFreq = maxFreq - 2;

    // compute colors for each token
    // by position
    const queryColor = d3.scaleSequential(function (t) {
        return d3.interpolateYlGn(t * 0.75 + 0.25);
    }).domain([0, 1]);
    const keyColor = d3.scaleSequential(function (t) {
        return d3.interpolatePuRd(t * 0.75 + 0.25);
    }).domain([0, 1]);
    const getColor = (td: Typing.TokenData) => {
        var colorstr = "rgb()";
        if (td.type === "query") {
            colorstr = queryColor(td.position);
        } else if (td.type === "key") {
            colorstr = keyColor(td.position);
        }
        const color = d3.color(colorstr)?.rgb();
        if (!color) return [0, 0, 0];
        return [color.r, color.g, color.b];
    };
    const colorsByPosition = tokenData.map((td) => getColor(td));


    const queryColorFreq = d3.scaleSequentialSqrt(function (t) {
        return d3.interpolateHslLong("purple", "orange")(t);
    }).domain([0, 1]);
    const keyColorFreq = d3.scaleSequentialSqrt(function (t) {
        return d3.interpolateHslLong("white", "black")(t);
    }).domain([0, 1]);

    const queryColorSentPos = d3.scaleSequential(function (t) {
        return d3.interpolateHslLong("purple", "orange")(t);
    }).domain([0, 1]);
    const keyColorSentPos = d3.scaleSequential(function (t) {
        return d3.interpolateHslLong("white", "black")(t);
    }).domain([0, 1]);    


    

    // by length
    const getLengthColor = (td: Typing.TokenData) => {
        var colorstr = "rgb()";
        if (td.type === "query") {
            colorstr = queryColor((td.value.length - minStringLength) / rangeStringLength);
        } else if (td.type === "key") {
            colorstr = keyColor((td.value.length - minStringLength) / rangeStringLength);
        }
        const color = d3.color(colorstr)?.rgb();
        if (!color) return [0, 0, 0];
        return [color.r, color.g, color.b];
    };
    const colorsByLength = tokenData.map((td) => getLengthColor(td));

    // by sentence length
    const getSentColor = (td: Typing.TokenData) => {
        var colorstr = "rgb()";
        if (td.type === "query") {
            colorstr = queryColor((td.length - minSentLength) / rangeSentLength);
        } else if (td.type === "key") {
            colorstr = keyColor((td.length - minSentLength) / rangeSentLength);
        }
        const color = d3.color(colorstr)?.rgb();
        if (!color) return [0, 0, 0];
        return [color.r, color.g, color.b];
    };
    const colorsBySentLength = tokenData.map((td) => getSentColor(td));

    // by token frequency
    const getFreqColor = (td: Typing.TokenData) => {
        var colorstr = "rgb()";
        const freq = tokFreq[td.value] - 2;
        if (td.type === "query") {
            colorstr = queryColorFreq(freq / rangeFreq);
        } else if (td.type === "key") {
            colorstr = keyColorFreq(freq / rangeFreq);
        }
        const color = d3.color(colorstr)?.rgb();
        if (!color) return [0, 0, 0];
        return [color.r, color.g, color.b];
    };
    const colorsByFreq = tokenData.map((td) => getFreqColor(td));

    const getSentPosColor = (td: Typing.TokenData) => {
        var colorstr = "rgb()";
        if (td.type === "query") {
            colorstr = queryColorSentPos(td.sent_pos);
        } else if (td.type === "key") {
            colorstr = keyColorSentPos(td.sent_pos);
        }
        const color = d3.color(colorstr)?.rgb();
        if (!color) return [0, 0, 0];
        return [color.r, color.g, color.b];
    };
    const colorsBySentPos = tokenData.map((td) => getSentPosColor(td));    
    
    

    // by categorical position
    const discreteColors = ["#F5C0CA", "#E3378F", "#F0D6A5", "#EDB50E", "#C4D6B8", "#5FB96C", "#C8DDED", "#528DDB", "#D6BAE3", "#A144DB"];
    const numDiscrete = discreteColors.length / 2;

    const getDiscreteColor = (td: Typing.TokenData) => {
        var colorstr = "rgb()";
        if (td.type === "query") {
            colorstr = discreteColors[2 * (td.pos_int % numDiscrete) + 1];
        } else if (td.type === "key") {
            colorstr = discreteColors[2 * (td.pos_int % numDiscrete)];
        }
        const color = d3.color(colorstr)?.rgb();
        if (!color) return [0, 0, 0];
        return [color.r, color.g, color.b];
    };
    const colorsByDiscretePosition = tokenData.map((td) => getDiscreteColor(td));

    // Function to get color based on genomic element type
    const getColorByRegionType = (td: Typing.TokenData) => {
        var colorstr = "rgb()";
        if (td.type === "query") {
            if (td.region_type == "exon") { colorstr = "#2E93D9" }
            else if (td.region_type == "intron") { colorstr = "#E15759" }
            else if (td.region_type == "ALU") { colorstr = "#F28E2B" }
            else if (td.region_type == "MIR") { colorstr = "#59A14F" }
            else if (td.region_type == "LINE") { colorstr = "#00ffff" }
            else if (td.region_type == "cls") { colorstr = "#E3378F" }
            else if (td.region_type == "sep") { colorstr = "#76B7B2" }
            else { colorstr = "#000000" }
        } else {
            if (td.region_type == "exon") { colorstr = "#beddf3" }
            else if (td.region_type == "intron") { colorstr = "#f0a8a9" }
            else if (td.region_type == "ALU") { colorstr = "#fad9b7" }
            else if (td.region_type == "MIR") { colorstr = "#bfddbb" }
            else if (td.region_type == "LINE") { colorstr = "#b3ffff" }
            else if (td.region_type == "cls") { colorstr = "#f5bcda" }
            else if (td.region_type == "sep") { colorstr = "#bcdcd9" }
            else { colorstr = "#808080" }
        }

        const color = d3.color(colorstr)?.rgb();
        if (!color) return [0, 0, 0];
        return [color.r, color.g, color.b];
    };
    // Map each token to its corresponding color based on genomic element type
    const colorsByRegionType = tokenData.map((td) => getColorByRegionType(td));

    // by special tokens vs. not
    // orange, pink, blue, green
    const specialTokenColors = ["#F39226", "#E3378F", "#2E93D9", "#5FB96C"];
    const getSpecialTokensColor = (td: Typing.TokenData) => {
        var colorstr = "rgb()";

        if (td.value == "[SEP]" || td.value == "[CLS]") {
            // token is only special tokens characters or special tokens
            colorstr = td.type === "query" ? specialTokenColors[3] : specialTokenColors[2]
        } else {
            // token has alphanumeric characters
            colorstr = td.type === "query" ? specialTokenColors[0] : specialTokenColors[1]
        }

        const color = d3.color(colorstr)?.rgb();
        if (!color) return [0, 0, 0];
        return [color.r, color.g, color.b];
    }
    const colorsBySpecialTokens = tokenData.map((td) => getSpecialTokensColor(td));

    // compute msgs for each token
    const reg_msgs = tokenData.map(
        (td) =>
            `<b class='${td.type}'>${td.value}</b> (<i>${td.type}</i>, pos: ${td.pos_int} of ${td.length - 1}, region: ${td.region_type})`
    );
    const sent_msgs = tokenData.map(
        (td) =>
            `<b class='${td.type}'>${td.value}</b> (<i>${td.type}</i>, pos: ${td.pos_int} of ${td.length - 1}, sentence: ${td.sent_pos}of ${td.num_sent})`
    );
    const pos_msgs = tokenData.map(
        (td) =>
            `<b class='${td.type}'>${td.value}</b> (<i>${td.type}</i>, pos: ${td.pos_int} of ${td.length - 1})`
    );
    const cat_msgs = tokenData.map(
        (td) =>
            `<b class='${td.type}'>${td.value}</b> (<i>${td.type}</i>, pos: ${td.pos_int} of ${td.length - 1}, pos % 5: ${td.pos_int % 5})`
    );
    const length_msgs = tokenData.map(
        (td) =>
            `<b class='${td.type}'>${td.value}</b> (<i>${td.type}</i>, pos: ${td.pos_int} of ${td.length - 1}, length: ${td.value.length})`
    );
    const freq_msgs = tokenData.map(
        (td) =>
            `<b class='${td.type}'>${td.value}</b> (<i>${td.type}</i>, pos: ${td.pos_int} of ${td.length - 1}, freq: ${tokFreq[td.value]})`
    );

    // for recording the x/y ranges
    let xs = [];
    let ys = [];

    // loop each plot (layer-head pair)
    for (const md of matrixData) {
        const { layer, head } = md;

        // compute plot-wise offset
        const xoffset = md.head * (matrixCellWidth + matrixCellMargin);
        const yoffset = -md.layer * (matrixCellHeight + matrixCellMargin);

        // compute coordinates for each token
        const data = md.tokens;
        const computeCoordinate = (projectionMethod: keyof Typing.PointCoordinate) => {
            const getX = (x: Typing.TokenCoordinate) => {
                if (projectionMethod === 'tsne') return x.tsne_x
                else if (projectionMethod === 'umap') return x.umap_x
                else if (projectionMethod === 'pca') return x.pca_x
                else throw Error('Invalid projection method')
            }
            const getY = (x: Typing.TokenCoordinate) => {
                if (projectionMethod === 'tsne') return x.tsne_y
                else if (projectionMethod === 'umap') return x.umap_y
                else if (projectionMethod === 'pca') return x.pca_y
                else throw Error('Invalid projection method')
            }

            // scale points to be within same range
            const xScale = d3
                .scaleLinear()
                .domain(d3.extent(data.map((x) => getX(x))) as any)
                .range([0, matrixCellWidth]);
            const yScale = d3
                .scaleLinear()
                .domain(d3.extent(data.map((x) => getY(x))) as any)
                .range([0, matrixCellHeight]);

            //if (projectionMethod === "tsne" || projectionMethod === "umap" || projectionMethod === "pca") { // 2d case
            return data.map(d => [+xScale(getX(d)).toFixed(3) + xoffset, +yScale(getY(d)).toFixed(3) + yoffset] as [number, number]);
            //}
            // 3d case
            //const zScale = d3
            //    .scaleLinear()
            //    .domain(d3.extent(data.map((x) => getZ(x))) as any)
            //    .range([0, matrixCellHeight]);
            //return data.map(d => [+xScale(getX(d)).toFixed(3) + xoffset,
            //+yScale(getY(d)).toFixed(3) + yoffset,
            //+zScale(getZ(d)).toFixed(3)] as [number, number, number]);
        }
        const pointsCoordinates = {
            'tsne': computeCoordinate('tsne'),
            'umap': computeCoordinate('umap'),
            'pca': computeCoordinate('pca')
        }

        // compute colors based on norms
        queryColor.domain(d3.extent(data.map(x => x.norm)) as [number, number]);
        keyColor.domain(d3.extent(data.map(x => x.norm)) as [number, number]);
        const colorsByNorm = data.map((x, index) => {
            const tokenType = tokenData[index].type;
            let colorstr = "rgb()";
            if (tokenType === 'query') {
                colorstr = queryColor(x.norm);
            } else if (tokenType === "key") {
                colorstr = keyColor(x.norm);
            }
            const color = d3.color(colorstr)?.rgb();
            if (!color) return [0, 0, 0];
            return [color.r, color.g, color.b];
        })

        const norm_msgs = data.map(
            (x, index) =>
                `<b class='${tokenData[index].type}'>${tokenData[index].value}</b> (<i>${tokenData[index].type}</i>, pos: ${tokenData[index].pos_int} of ${tokenData[index].length - 1}, norm: ${Math.round(x.norm * 100) / 100})`
        );

        const norms = data.map((x) => x.norm);
        const norm_range = d3.extent(norms) as [number, number];
        const min_norm = norm_range[0];
        const max_norm = norm_range[1];
        const range_norm = max_norm - min_norm;
        // round to 3 decimal places
        const norms_scaled = norms.map((x) => {
            let scaled = (x - min_norm) / range_norm;
            return +scaled.toFixed(3);
        });

        // color simply by type (key vs. query)
        const colorsByType = data.map((x, index) => {
            const tokenType = tokenData[index].type
            let colorstr = "rgb()";
            if (tokenType === "query") {
                colorstr = "rgb(95, 185, 108)";
            } else if (tokenType === "key") {
                colorstr = "rgb(227, 55, 143)";
            }
            const color = d3.color(colorstr)?.rgb();
            if (!color) return [0, 0, 0];
            return [color.r, color.g, color.b];
        })

        // synthesize all point information
        const points = data.map((d, index) => ({
            coordinate: {
                tsne: pointsCoordinates.tsne[index] as [number, number],
                umap: pointsCoordinates.umap[index] as [number, number],
                pca: pointsCoordinates.pca[index] as [number, number]
            },
            color: {
                query_key: colorsByType[index],
                position: colorsByPosition[index],
                pos_mod_5: colorsByDiscretePosition[index],
                special_tokens: colorsBySpecialTokens[index],
                region_type: colorsByRegionType[index],
                embed_norm: colorsByNorm[index],
                //token_length: colorsByLength[index],
                sent_length: colorsBySentLength[index],
                token_freq: colorsByFreq[index],
                sent_pos: colorsBySentPos[index],
                row: [0, 0, 0],
                column: [0, 0, 0],
                qk_map: [0, 0, 0],
                no_outline: [0, 0, 0],
            },
            msg: {
                position: pos_msgs[index],
                region: reg_msgs[index],
                categorical: cat_msgs[index],
                norm: norm_msgs[index],
                length: length_msgs[index],
                freq: freq_msgs[index]
            },
            layer,
            head,
            index,
            value: values[index],
            type: types[index],
            normScaled: norms_scaled[index],
            imagePath: "",
            originalPatchPath: "",
        }));

        xs.push(...[xoffset, matrixCellWidth + xoffset]);
        ys.push(...[yoffset, matrixCellHeight + yoffset]);

        results.push(...points);
    }

    return {
        'points': results,
        'range': {
            'x': d3.extent(xs) as [number, number],
            'y': d3.extent(ys) as [number, number]
        }
    }
};

/**
 * Compute text headings for each plot (head-layer)
 */
const computeMatrixProjectionLabel = (matrixData: Typing.MatrixData[], matrixCellWidth = 100, matrixCellHeight = 100, matrixCellMargin = 20) => {
    var results = [] as Typing.PlotHead[];

    for (const md of matrixData) {
        results.push({
            layer: md.layer,
            head: md.head,
            title: [`L${md.layer} H${md.head}`, `Layer ${md.layer} Head ${md.head}`],
            coordinate: [
                md.head * (matrixCellWidth + matrixCellMargin),
                -md.layer * (matrixCellHeight + matrixCellMargin),
            ],
        });
    }
    return results;
};

// compute projection for each point
const computeMatrixProjection = (matrixData: Typing.MatrixData[], tokenData: Typing.TokenData[], matrixCellWidth = 100, matrixCellHeight = 100, matrixCellMargin = 20): Typing.Projection => {
    const pts = computeMatrixProjectionPoint(matrixData, tokenData, matrixCellWidth, matrixCellHeight, matrixCellMargin)

    // get unique sentences
    const sentences = tokenData.map(td => td.sentence);
    const uniqueSentences = [...new Set(sentences)];
    return {
        'points': pts.points,
        'range': pts.range,
        'headings': computeMatrixProjectionLabel(matrixData, matrixCellWidth, matrixCellHeight, matrixCellMargin),
        'unique': uniqueSentences
    }
}

export {
    computeMatrixProjection
}