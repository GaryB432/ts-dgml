var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/// <reference path="typings/tsd.d.ts" />
var xml = require('xml');
var dgml;
(function (dgml) {
    var LabeledElement = (function () {
        function LabeledElement(id, label) {
            this.id = id;
            this.label = label;
        }
        return LabeledElement;
    })();
    dgml.LabeledElement = LabeledElement;
    var Node = (function (_super) {
        __extends(Node, _super);
        function Node(id, label, category, moreProps) {
            _super.call(this, id, label);
            this.category = category;
            this.moreProps = moreProps;
        }
        return Node;
    })(LabeledElement);
    dgml.Node = Node;
    var Category = (function (_super) {
        __extends(Category, _super);
        function Category(id, label, moreProps) {
            _super.call(this, id, label);
            this.moreProps = moreProps;
        }
        return Category;
    })(LabeledElement);
    dgml.Category = Category;
    var Link = (function () {
        function Link(srcId, targetId, category) {
            this.srcId = srcId;
            this.targetId = targetId;
            this.category = category;
        }
        return Link;
    })();
    dgml.Link = Link;
    var Style = (function () {
        function Style(targetType, groupLabel, valueLabel, condition, props) {
            this.targetType = targetType;
            this.groupLabel = groupLabel;
            this.valueLabel = valueLabel;
            this.condition = condition;
            this.props = props;
        }
        return Style;
    })();
    dgml.Style = Style;
    var DirectedGraph = (function () {
        function DirectedGraph() {
            this.nodes = [];
            this.links = [];
            this.categories = [];
            this.styles = [];
        }
        DirectedGraph.prototype.addExternalNodes = function (category, cb) {
            var targets = {}, nodeMap = {}, cat = new Category(category);
            this.nodes.forEach(function (n) {
                nodeMap[n.id] = n;
            });
            this.links.forEach(function (l) {
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
        };
        return DirectedGraph;
    })();
    dgml.DirectedGraph = DirectedGraph;
    var ASerializer = (function () {
        function ASerializer(graph, toXml) {
            this.graph = graph;
            this.toXml = toXml;
        }
        ASerializer.prototype.toDgml = function () {
            return this.toXml();
        };
        return ASerializer;
    })();
    dgml.ASerializer = ASerializer;
    var nodeXml;
    (function (nodeXml) {
        var Serializer = (function (_super) {
            __extends(Serializer, _super);
            function Serializer(graph, options) {
                var _this = this;
                if (options === void 0) { options = { declaration: true, indent: false }; }
                _super.call(this, graph, function () { return xml(_this.nodeXmlObject(), options); });
            }
            Serializer.prototype.extend = function (o1, o2) {
                if (o2 !== void 0) {
                    for (var p in o2) {
                        if (o2.hasOwnProperty(p) && typeof o2[p] === 'string') {
                            o1[p] = o2[p];
                        }
                    }
                }
                return o1;
            };
            Serializer.prototype.someAttributes = function (node) {
                var a = {
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
            };
            Serializer.prototype.linkAttributes = function (link) {
                var a = {
                    _attr: {
                        Source: link.srcId, Target: link.targetId
                    }
                };
                if (link.category !== void 0) {
                    a._attr.Category = link.category;
                }
                return a;
            };
            Serializer.prototype.nodeXmlObject = function () {
                var _this = this;
                var dg = {
                    DirectedGraph: [
                        {
                            _attr: { xmlns: 'http://schemas.microsoft.com/vs/2009/dgml' }
                        },
                        {
                            Nodes: this.graph.nodes.map(function (node) { return { Node: _this.someAttributes(node) }; })
                        },
                        {
                            Links: this.graph.links.map(function (link) { return { Link: _this.linkAttributes(link) }; })
                        },
                        {
                            Categories: this.graph.categories.map(function (category) { return { Category: _this.someAttributes(category) }; })
                        },
                        {
                            Styles: this.graph.styles.map(function (style) {
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
            };
            return Serializer;
        })(ASerializer);
        nodeXml.Serializer = Serializer;
    })(nodeXml = dgml.nodeXml || (dgml.nodeXml = {}));
})(dgml || (dgml = {}));
module.exports = dgml;
