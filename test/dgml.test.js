/// <reference path="../typings/tsd.d.ts" />
var chai = require('chai');
var dgml = require('../dgml');
describe('dgml serializer', function () {
    it('serializes properly', function () {
        var graph = new dgml.DirectedGraph();
        graph.nodes.push(new dgml.Node("car", "car"));
        graph.nodes.push(new dgml.Node("truck", "truck-label"));
        graph.links.push(new dgml.Link("car", "truck", "wheeled"));
        var ds = new dgml.nodeXml.Serializer(graph);
        chai.expect(ds.toDgml()).to.equal('<?xml version=\"1.0\" encoding=\"UTF-8\"?><DirectedGraph xmlns=\"http://schemas.microsoft.com/vs/2009/dgml\"><Nodes><Node Id=\"car\" Label=\"car\"/><Node Id=\"truck\" Label=\"truck-label\"/></Nodes><Links><Link Source=\"car\" Target=\"truck\" Category=\"wheeled\"/></Links></DirectedGraph>');
    });
    it('includes categories', function () {
        var graph = new dgml.DirectedGraph();
        var car = new dgml.Node("car", "car");
        graph.nodes.push(car);
        graph.nodes.push(new dgml.Node("truck", "truck-label"));
        graph.links.push(new dgml.Link("car", "truck"));
        graph.categories.push(new dgml.Category("a", "a"));
        var ds = new dgml.nodeXml.Serializer(graph);
        chai.expect(ds.toDgml()).to.equal('<?xml version=\"1.0\" encoding=\"UTF-8\"?><DirectedGraph xmlns=\"http://schemas.microsoft.com/vs/2009/dgml\"><Nodes><Node Id=\"car\" Label=\"car\"/><Node Id=\"truck\" Label=\"truck-label\"/></Nodes><Links><Link Source=\"car\" Target=\"truck\"/></Links><Categories><Category Id=\"a\" Label=\"a\"/></Categories></DirectedGraph>');
    });
    it('includes more props', function () {
        var graph = new dgml.DirectedGraph();
        var car = new dgml.Node("car", "car");
        car.moreProps = { Background: 'Orange' };
        graph.nodes.push(car);
        graph.nodes.push(new dgml.Node("truck", "truck-label"));
        graph.links.push(new dgml.Link("car", "truck"));
        graph.categories.push(new dgml.Category("a", "a"));
        var ds = new dgml.nodeXml.Serializer(graph);
        chai.expect(ds.toDgml()).to.equal('<?xml version=\"1.0\" encoding=\"UTF-8\"?><DirectedGraph xmlns=\"http://schemas.microsoft.com/vs/2009/dgml\"><Nodes><Node Id=\"car\" Label=\"car\" Background=\"Orange\"/><Node Id=\"truck\" Label=\"truck-label\"/></Nodes><Links><Link Source=\"car\" Target=\"truck\"/></Links><Categories><Category Id=\"a\" Label=\"a\"/></Categories></DirectedGraph>');
    });
    it('includes category props', function () {
        var graph = new dgml.DirectedGraph();
        var car = new dgml.Node("car", "car");
        car.moreProps = { Background: 'Orange' };
        graph.nodes.push(car);
        graph.nodes.push(new dgml.Node("truck", "truck-label"));
        graph.links.push(new dgml.Link("car", "truck"));
        graph.categories.push(new dgml.Category("a", "a", { Fun: 'True', NonStringIgnored: true, Tests: 'OK' }));
        var ds = new dgml.nodeXml.Serializer(graph);
        chai.expect(ds.toDgml()).to.equal('<?xml version=\"1.0\" encoding=\"UTF-8\"?><DirectedGraph xmlns=\"http://schemas.microsoft.com/vs/2009/dgml\"><Nodes><Node Id=\"car\" Label=\"car\" Background=\"Orange\"/><Node Id=\"truck\" Label=\"truck-label\"/></Nodes><Links><Link Source=\"car\" Target=\"truck\"/></Links><Categories><Category Id=\"a\" Label=\"a\" Fun=\"True\" Tests=\"OK\"/></Categories></DirectedGraph>');
    });
});
