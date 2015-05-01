/// <reference path="typings/tsd.d.ts" />
import xml = require('xml');

module dgml {

    class LabeledElement {
        constructor(public id: string, public label?: string) { }
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

    interface IStyleProp {
        name: string;
        value: string;
    }

    export class Style {
        constructor(public targetType: string, public groupLabel: string, public valueLabel: string, public condition: string, public props: IStyleProp[]) { }
    }

    export class DirectedGraph {
        nodes: Node[] = [];
        links: Link[] = [];
        categories: Category[] = [];
        styles: Style[] = [];

        addExternalNodes(category: string, cb?: (n: Node) => void) {
            var targets: { [key: string]: Node } = {},
                nodeMap: { [key: string]: Node } = {},
                cat: Category = new Category(category);

            this.nodes.forEach(n=> {
                nodeMap[n.id] = n;
            });

            this.links.forEach(l=> {
                targets[l.targetId] = nodeMap[l.targetId];
            });

            for (var tname in targets) {
                if (nodeMap[tname] === void 0) {
                    var newNode = new Node(tname);
                    nodeMap[tname] = newNode;
                    newNode.category = cat.id;
                    this.nodes.push(newNode);
                    typeof cb === 'function' && cb(newNode);
                }
            }
            this.categories.push(cat);
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
        interface INodeXmlObject {
            DirectedGraph: any[];
        }

        interface INodeXmlOptions {
            declaration?: boolean;
            indent?: boolean;
        }

        export class Serializer extends ASerializer {
            constructor(graph: DirectedGraph, options: INodeXmlOptions = { declaration: true, indent: false }) {
                super(graph,() => xml(this.nodeXmlObject(), options));
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
                        Id: node.id
                    }
                };
                if (node.label !== void 0) {
                    a._attr.Label = node.label;
                }
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
                            Nodes: this.graph.nodes.map((node) => { return { Node: this.someAttributes(node) } })
                        },
                        {
                            Links: this.graph.links.map((link) => { return { Link: this.linkAttributes(link) } })
                        },
                        {
                            Categories: this.graph.categories.map((category) => { return { Category: this.someAttributes(category) } })
                        },
                        {
                            Styles: this.graph.styles.map((style) => {
                                return {
                                    Style: [
                                        {
                                            _attr: {
                                                TargetType: style.targetType,
                                                GroupLabel: style.groupLabel,
                                                ValueLabel: style.valueLabel
                                            }
                                        },
                                        {
                                            Condition: {
                                                _attr: {
                                                    Expression: style.condition
                                                }
                                            }
                                        },
                                        {
                                            Setter: {
                                                _attr: {
                                                    Property: style.props[0].name,
                                                    Value: style.props[0].value
                                                }
                                            }
                                        },
                                    ]
                                }
                            })
                        }
                    ]
                };

                if (this.graph.styles.length === 0) {
                    dg.DirectedGraph.splice(4, 1);
                }
                if (this.graph.categories.length === 0) {
                    dg.DirectedGraph.splice(3, 1);
                }
                return dg;
            }
        }
    }
}
export = dgml;