
function generateGrid(rows = 30, columns = 30, mapper = () => Boolean(Math.floor(Math.random() * 2))) {
    return Array(rows)
        .fill()
        .map(() => Array(columns)
            .fill()
            .map(mapper))
}

const newGolGrid = (rows, columns, mapper) => generateGrid(rows, columns, mapper);

const deepClone = x => JSON.parse(JSON.stringify(x));

const countActiveNeighbours = (rowIdx, colIdx, indexedGrid) => {
    let count = 0;
    indexedGrid[`row${rowIdx - 1}col${colIdx - 1}`] && count++;
    indexedGrid[`row${rowIdx - 1}col${colIdx}`] && count++;
    indexedGrid[`row${rowIdx - 1}col${colIdx + 1}`] && count++;
    indexedGrid[`row${rowIdx}col${colIdx - 1}`] && count++;
    indexedGrid[`row${rowIdx}col${colIdx + 1}`] && count++;
    indexedGrid[`row${rowIdx + 1}col${colIdx - 1}`] && count++;
    indexedGrid[`row${rowIdx + 1}col${colIdx}`] && count++;
    indexedGrid[`row${rowIdx + 1}col${colIdx + 1}`] && count++;
    return count;
};

const frameRateProps = {MIN: 50, MAX: 1000, STEP: 10};

const getOppositeFramerate = (frameRateProps, input) => {
    const { MIN, MAX } = frameRateProps;
    return MIN + MAX - Number(input);
}

export {
    generateGrid,
    newGolGrid,
    deepClone,
    countActiveNeighbours,
    frameRateProps,
    getOppositeFramerate
}