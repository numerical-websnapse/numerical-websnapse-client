import { Graph as BaseGraph, Extensions, Util, extend } from '@antv/g6';

class ToolbarCanvas extends Extensions.Toolbar {
    insertStyle() {
        if (typeof document !== 'undefined') {
            const styles = `
                .g6-component-toolbar {
                    position: absolute;
                    list-style-type: none;
                    padding: 6px;
                    top:2.5vh;
                    right:2.5vw;
                    background-color: rgba(255, 255, 255, 0.9);
                    border: 1px solid #e2e2e2;
                    border-radius: 4px;
                    font-size: 12px;
                    color: #545454;
                    margin: 0;
                }
                .g6-component-toolbar li {
                    float: left;
                    text-align: center;
                    width: 35px;
                    height: 24px;
                    cursor: pointer;
                    list-style-type:none;
                    list-style: none;
                    margin-left: 0px;
                }
                .g6-component-toolbar li .icon {
                    opacity: 0.7;
                }
                .g6-component-toolbar li .icon:hover {
                    opacity: 1;
                }
            `

            const StyleSheet = document.createElement('style');
            StyleSheet.innerText = styles;
            document.head.appendChild(StyleSheet);
        }
    }
}

class ToolbarAction extends Extensions.Toolbar {
    insertStyle() {
        if (typeof document !== 'undefined') {
            const styles = `
                .g6-component-toolbar-action {
                    position: absolute;
                    list-style-type: none;
                    padding: 6px;
                    top:2.5vh;
                    left:2.5vw;
                    background-color: rgba(255, 255, 255, 0.9);
                    border: 1px solid #e2e2e2;
                    border-radius: 4px;
                    font-size: 12px;
                    color: #545454;
                    margin: 0;
                }
                .g6-component-toolbar-action li {
                    float: left;
                    text-align: center;
                    width: 35px;
                    height: 24px;
                    cursor: pointer;
                    list-style-type:none;
                    list-style: none;
                    margin-left: 0px;
                }
                .g6-component-toolbar-action li .icon {
                    opacity: 0.7;
                }
                .g6-component-toolbar-action li .icon:hover {
                    opacity: 1;
                }
            `

            const StyleSheet = document.createElement('style');
            StyleSheet.innerText = styles;
            document.head.appendChild(StyleSheet);
        }
    }
}

const toolbarCanvas = {
    type: 'toolbar-canvas',
    key: 'toolbar-1',
    container: 'canvas',
    // className: 'g6-component-toolbar',
    zoomSensitivity: 50,
}

const toolbarAction = {
    type: 'toolbar-action',
    key: 'toolbar-2',
    container: 'canvas',
    className: 'g6-component-toolbar-action',
    getContent: (graph) => { // NOTE: no newline at the start of the return string
        return `<ul class='g6-component-toolbar-action'>
            <li code='select'>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="feather feather-mouse-pointer"><path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z"/><path d="M13 13l6 6"/></svg>
            </li>
            <li code="edit">
                <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round" class="css-i6dzq1"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
            </li>
            <li code="move">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M14 3.5V11V4.5C14 3.67157 14.6716 3 15.5 3C16.3284 3 17 3.67157 17 4.5V11V7.5C17 6.67157 17.6716 6 18.5 6C19.3284 6 20 6.67157 20 7.5V16C20 19.3137 17.3137 22 14 22H12.8727C11.3483 22 9.88112 21.4198 8.76904 20.3772L3.81045 15.7285C3.09365 15.0565 3.0754 13.9246 3.77016 13.2298C4.44939 12.5506 5.55063 12.5506 6.22985 13.2298L8.00001 15V6.5C8.00001 5.67157 8.67158 5 9.50001 5C10.3284 5 11 5.67157 11 6.5V11V3.5C11 2.67157 11.6716 2 12.5 2C13.3284 2 14 2.67157 14 3.5Z"/>
                </svg>
            </li>
            <li code="delete">
                <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round" class="css-i6dzq1"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
            </li>
        </ul>`;
    },
    handleClick:(code) => {
        console.log(code);
    },
}

export { ToolbarCanvas, toolbarCanvas, ToolbarAction, toolbarAction };