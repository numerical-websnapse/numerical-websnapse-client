import { Graph, extend, Extensions, Util } from '@antv/g6';
import { neuronAction, getModal } from '../../stores/modals.js';
import { setNeuron } from '../../stores/graph.js';

class editNodeClick extends Extensions.BaseBehavior {
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
        if (ev.itemType === 'node') {
            neuronAction('edit');
            setNeuron(ev.itemId);
            getModal('nodeModal').show();
        }
    };
}

export { editNodeClick };