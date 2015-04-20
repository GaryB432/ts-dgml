import xml = require('xml');

module dgml {

    export class Node {
        constructor(public id: string, public label: string) { }
    }

    export class Link {
        public source: Node;
        public target: Node;
    }

    export class DirectedGraph {
        public nodes: Node[] = [];
        public links: Link[] = [];

        createLink(srcId: string, targetId: string) {
            var link = new Link();
            link.source = this.findNode(srcId);
            link.target = this.findNode(targetId);
            if (!link.target) throw new Error('target not found');
            if (!link.source) throw new Error('source not found');
            return link;
        }
        private findNode(id: string): Node {
            for (var i = 0; i < this.nodes.length; i++) {
                var value = this.nodes[i];
                if (value.id === id) {
                    return value;
                }
            }
            return undefined;
        }
    }

    export class ASerializer {
        constructor(protected graph: DirectedGraph, private toXml: () => string) {
        }
        toDgml() {
            return this.toXml();
        }
    }

    export module nodeXml {
        export class Serializer extends ASerializer {
            constructor(graph: DirectedGraph) {
                super(graph, () => xml(this.nodeXmlObject(), { declaration: true }));
            }
            private nodeXmlObject() {
                return {
                    DirectedGraph:
                    [
                        {
                            _attr: { xmlns: 'http://schemas.microsoft.com/vs/2009/dgml' }
                        },
                        {
                            Nodes: this.graph.nodes.map((n) => { return { Node: { _attr: { Id: n.id, Label: n.label } } } })
                        },
                        {
                            Links: this.graph.links.map((n) => { return { Link: { _attr: { Source: n.source.id, Target: n.target.id } } } })
                        }
                    ]
                };
            }
        }
    }

}
export = dgml;