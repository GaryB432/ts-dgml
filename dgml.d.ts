declare module dgml {
    class Node {
        id: string;
        label: string;
        constructor(id: string, label: string);
    }
    class Link {
        source: Node;
        target: Node;
    }
    class DirectedGraph {
        nodes: Node[];
        links: Link[];
        createLink(srcId: string, targetId: string): Link;
        private findNode(id);
    }
    class ASerializer {
        protected graph: DirectedGraph;
        private toXml;
        constructor(graph: DirectedGraph, toXml: () => string);
        toDgml(): string;
    }
    module nodeXml {
        class Serializer extends ASerializer {
            constructor(graph: DirectedGraph);
            private nodeXmlObject();
        }
    }
}
export = dgml;
