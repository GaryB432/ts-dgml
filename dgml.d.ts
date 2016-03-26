/// <reference path="typings/tsd.d.ts" />
declare namespace dgml {
    class LabeledElement {
        id: string;
        label: string;
        constructor(id: string, label?: string);
    }
    class Node extends LabeledElement {
        category: string;
        moreProps: any;
        constructor(id: string, label?: string, category?: string, moreProps?: any);
    }
    class Category extends LabeledElement {
        moreProps: any;
        constructor(id: string, label?: string, moreProps?: any);
    }
    class Link {
        srcId: string;
        targetId: string;
        category: string;
        constructor(srcId: string, targetId: string, category?: string);
    }
    interface IStyleProp {
        name: string;
        value: string;
    }
    class Style {
        targetType: string;
        groupLabel: string;
        valueLabel: string;
        condition: string;
        props: IStyleProp[];
        constructor(targetType: string, groupLabel: string, valueLabel: string, condition: string, props: IStyleProp[]);
    }
    class DirectedGraph {
        nodes: Node[];
        links: Link[];
        categories: Category[];
        styles: Style[];
        addExternalNodes(catId: string, cb?: (n: Node) => void): void;
        private mergeCategory(id);
    }
    class ASerializer {
        protected graph: DirectedGraph;
        private toXml;
        constructor(graph: DirectedGraph, toXml: () => string);
        toDgml(): string;
    }
    namespace nodeXml {
        interface INodeXmlObject {
            DirectedGraph: any[];
        }
        interface INodeXmlOptions {
            declaration?: boolean;
            indent?: boolean;
        }
        class Serializer extends ASerializer {
            constructor(graph: DirectedGraph, options?: INodeXmlOptions);
            private extend(o1, o2);
            private someAttributes(node);
            private linkAttributes(link);
            private nodeXmlObject();
        }
    }
}
export = dgml;
