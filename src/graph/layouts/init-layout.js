class InitLayout {
    id = 'init-layout';

    constructor(options = {}) {
        this.options = options;
    }

    async execute(graph, options = {}) {
        return this.genericLayout(false, graph, options);
    }

    async assign(graph, options = {}) {
        this.genericLayout(true, graph, options);
    }

    async genericLayout(assign, graph, options = {}) {
        const nodes = graph.getAllNodes();
        const edges = graph.getAllEdges();

    
        const result = {
            nodes,
            edges,
        };
    
        if (assign) {
            layoutNodes.forEach((node) => {
                graph.mergeNodeData(node.id, {
                x: node.data.x,
                y: node.data.y,
                });
            });
        }

        return result;
    }
}

export { InitLayout };