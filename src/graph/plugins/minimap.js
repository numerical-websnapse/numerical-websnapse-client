import { getCanvasSize } from '../utils/canvas-size.js';

const minimap = (edgeCount = 0) => {
    const { width, height } = getCanvasSize(0.17,0.20);
    const hideEdge = edgeCount > 128 ? true : false;

    return {
        key: 'nsnp-minimap',
        type: 'minimap',
        mode: 'keyShape',
        className: 'g6-minimap-custom',
        viewportClassName: 'g6-minimap-viewport-custom',
        container: 'canvas',
        hideEdge: hideEdge,
        size: [width, height],
    };
}

export { minimap };