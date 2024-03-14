import { Graph, extend, Extensions, Util } from '@antv/g6';
import { neuronAction, getModal } from '../../stores/modals.js';
import { resetNeuron } from '../../stores/graph.js';

class createNodeClick extends Extensions.BaseBehavior {
    getEvents() {
        this.graph.canvas
          .getContextService()
          .getDomElement()
          .addEventListener('click', (e) => {
            e.preventDefault();
          });

        return {
          click: this.onClick,
        };
    }

    onClick = (ev) => {
        const x = ev.canvas.x;
        const y = ev.canvas.y;

        if (ev.itemType === 'canvas') {
            resetNeuron(x, y);
            neuronAction('create');
            getModal('nodeModal').show();
        }
    };
}

export { createNodeClick };