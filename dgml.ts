/// <reference path="typings/tsd.d.ts" />
let xml: (input: any, options: any) => string = require("xml");

namespace dgml {

    "use strict";

    export class LabeledElement {
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

    export interface IStyleProp {
        name: string;
        value: string;
    }

    export class Style {
        constructor(
            public targetType: string,
            public groupLabel: string,
            public valueLabel: string,
            public condition: string,
            public props: IStyleProp[]) {

        }
    }

    export class DirectedGraph {
        public nodes: Node[] = [];
        public links: Link[] = [];
        public categories: Category[] = [];
        public styles: Style[] = [];

        public addExternalNodes(catId: string, cb?: (n: Node) => void): void {
            let targets: { [key: string]: Node } = {},
                nodeMap: { [key: string]: Node } = {},
                cat: Category = this.mergeCategory(catId);

            this.nodes.forEach(n => {
                nodeMap[n.id] = n;
            });
            this.links.forEach(l => {
                targets[l.targetId] = nodeMap[l.targetId];
            });
            for (let tname in targets) {
                if (nodeMap[tname] === void 0) {
                    let newNode: Node = new Node(tname);
                    nodeMap[tname] = newNode;
                    newNode.category = cat.id;
                    this.nodes.push(newNode);
                    if (cb) {
                        cb(newNode);
                    }
                }
            }
        }

        private mergeCategory(id: string): Category {
            let idCats = this.categories.filter((c) => c.id === id),
                tempCat: Category;
            if (idCats.length === 0) {
                tempCat = new Category(id);
                this.categories.push(tempCat)
            }
            else {
                tempCat = idCats[0];
            }
            return tempCat;
        }
    }

    export class ASerializer {
        constructor(protected graph: DirectedGraph, private toXml: () => string) {
        }
        public toDgml(): string {
            return this.toXml();
        }
    }

    export namespace nodeXml {
        export interface INodeXmlObject {
            DirectedGraph: any[];
        }

        export interface INodeXmlOptions {
            declaration?: boolean;
            indent?: boolean;
        }

        export class Serializer extends ASerializer {
            constructor(graph: DirectedGraph, options: INodeXmlOptions = { declaration: true, indent: false }) {
                super(graph, () => xml(this.nodeXmlObject(), options));
            }

            private extend(o1: any, o2: any): any {
                if (o2 !== void 0) {
                    for (let p in o2) {
                        if (o2.hasOwnProperty(p) && typeof o2[p] === "string") {
                            o1[p] = o2[p];
                        }
                    }
                }
                return o1;
            }

            private someAttributes(node: Node | Category): any {
                let a: any = {
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

            private linkAttributes(link: Link): any {
                let a: any = {
                    _attr: {
                        Source: link.srcId, Target: link.targetId
                    }
                };
                if (link.category !== void 0) {
                    a._attr.Category = link.category;
                }
                return a;
            }
            private nodeXmlObject(): INodeXmlObject {
                let dg: INodeXmlObject = {
                    DirectedGraph:
                    [
                        {
                            _attr: { xmlns: "http://schemas.microsoft.com/vs/2009/dgml" }
                        },
                        {
                            Nodes: this.graph.nodes.map((node) => { return { Node: this.someAttributes(node) }; })
                        },
                        {
                            Links: this.graph.links.map((link) => { return { Link: this.linkAttributes(link) }; })
                        },
                        {
                            Categories: this.graph.categories.map((category) => { return { Category: this.someAttributes(category) }; })
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
                                        }
                                    ]
                                };
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
