/// <reference path="../typings/tsd.d.ts" />

import xml = require('xml');
import chai = require('chai');
import dgml = require('../dgml');

describe('dgml serializer', function () {

    it('serializes properly',() => {
        var graph = new dgml.DirectedGraph();

        graph.nodes.push(new dgml.Node("car", "car"));
        graph.nodes.push(new dgml.Node("truck", "truck-label"));
        graph.links.push(new dgml.Link("car", "truck", "wheeled"));

        var ds = new dgml.nodeXml.Serializer(graph);

        chai.expect(ds.toDgml()).to.equal('<?xml version=\"1.0\" encoding=\"UTF-8\"?><DirectedGraph xmlns=\"http://schemas.microsoft.com/vs/2009/dgml\"><Nodes><Node Id=\"car\" Label=\"car\"/><Node Id=\"truck\" Label=\"truck-label\"/></Nodes><Links><Link Source=\"car\" Target=\"truck\" Category=\"wheeled\"/></Links></DirectedGraph>');
    });

    it('includes categories',() => {
        var graph = new dgml.DirectedGraph();

        var car = new dgml.Node("car", "car");
        graph.nodes.push(car);
        graph.nodes.push(new dgml.Node("truck", "truck-label"));
        graph.links.push(new dgml.Link("car", "truck"));
        graph.categories.push(new dgml.Category("a", "a"));

        var ds = new dgml.nodeXml.Serializer(graph);

        chai.expect(ds.toDgml()).to.equal('<?xml version=\"1.0\" encoding=\"UTF-8\"?><DirectedGraph xmlns=\"http://schemas.microsoft.com/vs/2009/dgml\"><Nodes><Node Id=\"car\" Label=\"car\"/><Node Id=\"truck\" Label=\"truck-label\"/></Nodes><Links><Link Source=\"car\" Target=\"truck\"/></Links><Categories><Category Id=\"a\" Label=\"a\"/></Categories></DirectedGraph>');
    });

    it('includes more props',() => {
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

    it('includes category props',() => {
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

    it('includes styles',() => {
        var graph = new dgml.DirectedGraph();

        graph.nodes.push(new dgml.Node("car", "car"));
        graph.nodes.push(new dgml.Node("truck", "truck-label"));
        graph.links.push(new dgml.Link("car", "truck"));
        graph.categories.push(new dgml.Category("a", "a", { Stuff: 'here' }));
        graph.styles.push(new dgml.Style('Node', 'Service', 'True', "HasCategory('Service')", [{ name: "Background", value: "Blue" }]));

        var ds = new dgml.nodeXml.Serializer(graph);

        chai.expect(ds.toDgml()).to.equal('<?xml version=\"1.0\" encoding=\"UTF-8\"?><DirectedGraph xmlns=\"http://schemas.microsoft.com/vs/2009/dgml\"><Nodes><Node Id=\"car\" Label=\"car\"/><Node Id=\"truck\" Label=\"truck-label\"/></Nodes><Links><Link Source=\"car\" Target=\"truck\"/></Links><Categories><Category Id=\"a\" Label=\"a\" Stuff=\"here\"/></Categories><Styles><Style TargetType=\"Node\" GroupLabel=\"Service\" ValueLabel=\"True\"><Condition Expression=\"HasCategory(&apos;Service&apos;)\"/><Setter Property=\"Background\" Value=\"Blue\"/></Style></Styles></DirectedGraph>');
    });

    it('includes styles no categories',() => {
        var graph = new dgml.DirectedGraph();

        graph.nodes.push(new dgml.Node("car", "car"));
        graph.nodes.push(new dgml.Node("truck", "truck-label"));
        graph.links.push(new dgml.Link("car", "truck"));
        graph.styles.push(new dgml.Style('Node', 'Service', 'True', "HasCategory('Service')", [{ name: "Background", value: "Blue" }]));

        var ds = new dgml.nodeXml.Serializer(graph);

        chai.expect(ds.toDgml()).to.equal('<?xml version=\"1.0\" encoding=\"UTF-8\"?><DirectedGraph xmlns=\"http://schemas.microsoft.com/vs/2009/dgml\"><Nodes><Node Id=\"car\" Label=\"car\"/><Node Id=\"truck\" Label=\"truck-label\"/></Nodes><Links><Link Source=\"car\" Target=\"truck\"/></Links><Styles><Style TargetType=\"Node\" GroupLabel=\"Service\" ValueLabel=\"True\"><Condition Expression=\"HasCategory(&apos;Service&apos;)\"/><Setter Property=\"Background\" Value=\"Blue\"/></Style></Styles></DirectedGraph>');
    });

    
    //it('throws on invalid link node',() => {
    //    var graph = new dgml.DirectedGraph();
    //    graph.nodes.push(new dgml.Node("car", "automobile"));
    //    chai.expect(graph.createLink.bind(graph, 'X', 'Y')).to.throw();
    //});

});
