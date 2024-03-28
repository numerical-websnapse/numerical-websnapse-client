import { Extensions } from '@antv/g6';
import { minimap } from '../plugins/minimap';
import { setGraphLocalData } from '../../stores/graph';
import { deleteImage } from '../../stores/data';

class deleteClick extends Extensions.BaseBehavior {
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
        const itemType = this.graph.getTypeById(ev.itemId);
        
        if (ev.itemType === 'node' || ev.itemType === 'edge') {
            this.graph.removeData(itemType, ev.itemId);
            ev.itemType === 'node' ? deleteImage(ev.itemId) : null;
            this.graph.updatePlugin(minimap(
              this.graph.getAllEdgesData().length
            ));
            setGraphLocalData();
        }
    };
}

export { deleteClick };