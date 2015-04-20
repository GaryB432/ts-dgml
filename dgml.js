var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var xml = require('xml');
var dgml;
(function (dgml) {
    var Node = (function () {
        function Node(id, label) {
            this.id = id;
            this.label = label;
        }
        return Node;
    })();
    dgml.Node = Node;
    var Link = (function () {
        function Link() {
        }
        return Link;
    })();
    dgml.Link = Link;
    var DirectedGraph = (function () {
        function DirectedGraph() {
            this.nodes = [];
            this.links = [];
        }
        DirectedGraph.prototype.createLink = function (srcId, targetId) {
            var link = new Link();
            link.source = this.findNode(srcId);
            link.target = this.findNode(targetId);
            if (!link.target)
                throw new Error('target not found');
            if (!link.source)
                throw new Error('source not found');
            return link;
        };
        DirectedGraph.prototype.findNode = function (id) {
            for (var i = 0; i < this.nodes.length; i++) {
                var value = this.nodes[i];
                if (value.id === id) {
                    return value;
                }
            }
            return undefined;
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
            function Serializer(graph) {
                var _this = this;
                _super.call(this, graph, function () { return xml(_this.nodeXmlObject(), { declaration: true }); });
            }
            Serializer.prototype.nodeXmlObject = function () {
                return {
                    DirectedGraph: [
                        {
                            _attr: { xmlns: 'http://schemas.microsoft.com/vs/2009/dgml' }
                        },
                        {
                            Nodes: this.graph.nodes.map(function (n) { return { Node: { _attr: { Id: n.id, Label: n.label } } }; })
                        },
                        {
                            Links: this.graph.links.map(function (n) { return { Link: { _attr: { Source: n.source.id, Target: n.target.id } } }; })
                        }
                    ]
                };
            };
            return Serializer;
        })(ASerializer);
        nodeXml.Serializer = Serializer;
    })(nodeXml = dgml.nodeXml || (dgml.nodeXml = {}));
})(dgml || (dgml = {}));
module.exports = dgml;
