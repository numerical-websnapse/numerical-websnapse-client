import { Graph as BaseGraph, Extensions, Util, extend } from '@antv/g6';
import { getCanvasSize } from '../utils/canvas-size.js';

const minimap = () => {
    return {
        key: 'nsnp-minimap',
        type: 'minimap',
        mode: 'keyShape',
        className: 'g6-minimap-custom',
        viewportClassName: 'g6-minimap-viewport-custom',
        container: 'canvas',
        size: Object.values(getCanvasSize(0.2,0.2)),
    };
}

export { minimap };