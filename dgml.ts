/// <reference path="typings/tsd.d.ts" />
import xml = require('xml');

module dgml {

    export class LabeledElement {
        constructor(public id: string, public label: string = id) { }
    }

    export class Node extends LabeledElement {
        constructor(id: string, label?: string, public category?: string, public moreProps?: any) {
            super(id, label);
        }
    }

    export class Category extends LabeledElement {
        constructor(id: string, label?: string, public moreProps?: any) {
            super(id, label);
        }
    }

    export class Link {
        constructor(public srcId: string, public targetId: string, public category?: string) { }
    }

    export interface IStyleProp {
        name: string;
        value: string;
    }

    export class DirectedGraph {
        public nodes: Node[] = [];
        public links: Link[] = [];
        public categories: Category[] = [];
    }

    export class ASerializer {
        constructor(protected graph: DirectedGraph, private toXml: () => string) {
        }
        toDgml() {
            return this.toXml();
        }
    }

    export module nodeXml {
        interface INodeXmlObject {
            DirectedGraph: any[];
        }


        export class Serializer extends ASerializer {
            constructor(graph: DirectedGraph) {
                super(graph,() => xml(this.nodeXmlObject(), { declaration: true }));
            }

            private extend(o1: any, o2: any): any {
                if (o2 !== void 0) {
                    for (var p in o2) {
                        if (o2.hasOwnProperty(p) && typeof o2[p] === 'string') {
                            o1[p] = o2[p];
                        }
                    }
                }
                return o1;
            }

            private someAttributes(node: Node|Category) {
                var a: any = {
                    _attr: {
                        Id: node.id, Label: node.label
                    }
                };
                if (node instanceof Node) {
                    if (node.category !== void 0) {
                        a._attr.Category = node.category;
                    }
                }
                this.extend(a._attr, node.moreProps);
                return a;
            }

            private linkAttributes(link: Link) {
                var a: any = {
                    _attr: {
                        Source: link.srcId, Target: link.targetId
                    }
                };
                if (link.category !== void 0) {
                    a._attr.Category = link.category;
                }
                return a;
            }
            private nodeXmlObject() {
                var dg: INodeXmlObject = {
                    DirectedGraph:
                    [
                        {
                            _attr: { xmlns: 'http://schemas.microsoft.com/vs/2009/dgml' }
                        },
                        {
                            Nodes: this.graph.nodes.map((n) => { return { Node: this.someAttributes(n) } })
                        },
                        {
                            Links: this.graph.links.map((n) => { return { Link: this.linkAttributes(n) } })
                        },
                        {
                            Categories: this.graph.categories.map((n) => { return { Category: this.someAttributes(n) } })
                        }
                    ]
                };

                if (this.graph.categories.length === 0) {
                    dg.DirectedGraph.splice(3, 1);
                }
                return dg;
            }
        }
    }
}
export = dgml;