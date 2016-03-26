"use strict";
var chai = require('chai');
var dgml = require('../dgml');
describe('dgml serializer', function () {
    it('serializes properly', function () {
        var graph = new dgml.DirectedGraph();
        graph.nodes.push(new dgml.Node("H-3941", "heater"));
        graph.nodes.push(new dgml.Node("timer"));
        graph.nodes.push(new dgml.Node("coffee-maker"));
        graph.links.push(new dgml.Link("coffee-maker", "H-3941"));
        graph.links.push(new dgml.Link("coffee-maker", "timer"));
        var ds = new dgml.nodeXml.Serializer(graph);
        var expectedDgml = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>"
            + "<DirectedGraph xmlns=\"http://schemas.microsoft.com/vs/2009/dgml\">"
            + "<Nodes>"
            + "<Node Id=\"H-3941\" Label=\"heater\"/>"
            + "<Node Id=\"timer\"/>"
            + "<Node Id=\"coffee-maker\"/>"
            + "</Nodes>"
            + "<Links>"
            + "<Link Source=\"coffee-maker\" Target=\"H-3941\"/>"
            + "<Link Source=\"coffee-maker\" Target=\"timer\"/>"
            + "</Links>"
            + "</DirectedGraph>";
        chai.expect(ds.toDgml()).to.equal(expectedDgml);
    });
    describe("external categories", function () {
        var graph;
        beforeEach(function () {
            graph = new dgml.DirectedGraph();
            graph.nodes.push(new dgml.Node("H-3941", "heater"));
            graph.nodes.push(new dgml.Node("timer"));
            graph.nodes.push(new dgml.Node("coffee-maker"));
            graph.links.push(new dgml.Link("coffee-maker", "H-3941"));
            graph.links.push(new dgml.Link("coffee-maker", "timer"));
            graph.categories.push(new dgml.Category("Appliances"));
        });
        it('with callback', function (done) {
            graph.links.push(new dgml.Link("other", "external_thing"));
            graph.addExternalNodes("external_stuff", function (newNode) {
                chai.expect(newNode.id).to.equal("external_thing");
                chai.expect(newNode.category).to.equal("external_stuff");
                chai.expect(newNode.label).to.be.undefined;
                done();
            });
            var expectedDgml = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>"
                + "<DirectedGraph xmlns=\"http://schemas.microsoft.com/vs/2009/dgml\">"
                + "<Nodes>"
                + "<Node Id=\"H-3941\" Label=\"heater\"/>"
                + "<Node Id=\"timer\"/>"
                + "<Node Id=\"coffee-maker\"/>"
                + "<Node Id=\"external_thing\" Category=\"external_stuff\"/>"
                + "</Nodes>"
                + "<Links>"
                + "<Link Source=\"coffee-maker\" Target=\"H-3941\"/>"
                + "<Link Source=\"coffee-maker\" Target=\"timer\"/>"
                + "<Link Source=\"other\" Target=\"external_thing\"/>"
                + "</Links>"
                + "<Categories>"
                + "<Category Id=\"Appliances\"/>"
                + "<Category Id=\"external_stuff\"/>"
                + "</Categories>"
                + "</DirectedGraph>";
            chai.expect(new dgml.nodeXml.Serializer(graph).toDgml()).to.equal(expectedDgml);
        });
        it('without callback', function () {
            graph.addExternalNodes("external_stuff");
            var expectedDgml = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>"
                + "<DirectedGraph xmlns=\"http://schemas.microsoft.com/vs/2009/dgml\">"
                + "<Nodes>"
                + "<Node Id=\"H-3941\" Label=\"heater\"/>"
                + "<Node Id=\"timer\"/>"
                + "<Node Id=\"coffee-maker\"/>"
                + "</Nodes>"
                + "<Links>"
                + "<Link Source=\"coffee-maker\" Target=\"H-3941\"/>"
                + "<Link Source=\"coffee-maker\" Target=\"timer\"/>"
                + "</Links>"
                + "<Categories>"
                + "<Category Id=\"Appliances\"/>"
                + "<Category Id=\"external_stuff\"/>"
                + "</Categories>"
                + "</DirectedGraph>";
            chai.expect(new dgml.nodeXml.Serializer(graph).toDgml()).to.equal(expectedDgml);
        });
        it('does not duplicate existing category', function () {
            graph.addExternalNodes("Appliances");
            var expectedDgml = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>"
                + "<DirectedGraph xmlns=\"http://schemas.microsoft.com/vs/2009/dgml\">"
                + "<Nodes>"
                + "<Node Id=\"H-3941\" Label=\"heater\"/>"
                + "<Node Id=\"timer\"/>"
                + "<Node Id=\"coffee-maker\"/>"
                + "</Nodes>"
                + "<Links>"
                + "<Link Source=\"coffee-maker\" Target=\"H-3941\"/>"
                + "<Link Source=\"coffee-maker\" Target=\"timer\"/>"
                + "</Links>"
                + "<Categories>"
                + "<Category Id=\"Appliances\"/>"
                + "</Categories>"
                + "</DirectedGraph>";
            chai.expect(new dgml.nodeXml.Serializer(graph).toDgml()).to.equal(expectedDgml);
        });
    });
    it('includes categories', function () {
        var graph = new dgml.DirectedGraph();
        graph.nodes.push(new dgml.Node("H-3941", "heater"));
        graph.nodes.push(new dgml.Node("timer"));
        graph.nodes.push(new dgml.Node("coffee-maker"));
        graph.links.push(new dgml.Link("coffee-maker", "H-3941"));
        graph.links.push(new dgml.Link("coffee-maker", "timer"));
        graph.categories.push(new dgml.Category("Appliances"));
        var ds = new dgml.nodeXml.Serializer(graph);
        var expectedDgml = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>"
            + "<DirectedGraph xmlns=\"http://schemas.microsoft.com/vs/2009/dgml\">"
            + "<Nodes>"
            + "<Node Id=\"H-3941\" Label=\"heater\"/>"
            + "<Node Id=\"timer\"/>"
            + "<Node Id=\"coffee-maker\"/>"
            + "</Nodes>"
            + "<Links>"
            + "<Link Source=\"coffee-maker\" Target=\"H-3941\"/>"
            + "<Link Source=\"coffee-maker\" Target=\"timer\"/>"
            + "</Links>"
            + "<Categories>"
            + "<Category Id=\"Appliances\"/>"
            + "</Categories>"
            + "</DirectedGraph>";
        chai.expect(ds.toDgml()).to.equal(expectedDgml);
    });
    it('includes more props', function () {
        var graph = new dgml.DirectedGraph();
        var heater = new dgml.Node("H-3941", "heater");
        heater.moreProps = { Background: 'Red' };
        graph.nodes.push(heater);
        graph.nodes.push(new dgml.Node("timer"));
        graph.nodes.push(new dgml.Node("coffee-maker"));
        graph.links.push(new dgml.Link("coffee-maker", "H-3941"));
        graph.links.push(new dgml.Link("coffee-maker", "timer"));
        var ds = new dgml.nodeXml.Serializer(graph);
        var expectedDgml = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>"
            + "<DirectedGraph xmlns=\"http://schemas.microsoft.com/vs/2009/dgml\">"
            + "<Nodes>"
            + "<Node Id=\"H-3941\" Label=\"heater\" Background=\"Red\"/>"
            + "<Node Id=\"timer\"/>"
            + "<Node Id=\"coffee-maker\"/>"
            + "</Nodes>"
            + "<Links>"
            + "<Link Source=\"coffee-maker\" Target=\"H-3941\"/>"
            + "<Link Source=\"coffee-maker\" Target=\"timer\"/>"
            + "</Links>"
            + "</DirectedGraph>";
        chai.expect(ds.toDgml()).to.equal(expectedDgml);
    });
    it('includes category props', function () {
        var graph = new dgml.DirectedGraph();
        var heater = new dgml.Node("H-3941", "heater");
        heater.moreProps = { Background: 'Red' };
        graph.nodes.push(heater);
        graph.nodes.push(new dgml.Node("timer"));
        graph.nodes.push(new dgml.Node("coffee-maker"));
        graph.links.push(new dgml.Link("coffee-maker", "H-3941"));
        graph.links.push(new dgml.Link("coffee-maker", "timer"));
        var electronics = new dgml.Category("c1", "Electronic", { Fun: 'True', NonStringIgnored: true, Tests: 'OK' });
        heater.category = electronics.id;
        graph.categories.push(electronics);
        var ds = new dgml.nodeXml.Serializer(graph);
        var expectedDgml = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>"
            + "<DirectedGraph xmlns=\"http://schemas.microsoft.com/vs/2009/dgml\">"
            + "<Nodes>"
            + "<Node Id=\"H-3941\" Label=\"heater\" Category=\"c1\" Background=\"Red\"/>"
            + "<Node Id=\"timer\"/>"
            + "<Node Id=\"coffee-maker\"/>"
            + "</Nodes>"
            + "<Links>"
            + "<Link Source=\"coffee-maker\" Target=\"H-3941\"/>"
            + "<Link Source=\"coffee-maker\" Target=\"timer\"/>"
            + "</Links>"
            + "<Categories>"
            + "<Category Id=\"c1\" Label=\"Electronic\" Fun=\"True\" Tests=\"OK\"/>"
            + "</Categories>"
            + "</DirectedGraph>";
        chai.expect(ds.toDgml()).to.equal(expectedDgml);
    });
    it('includes styles', function () {
        var graph = new dgml.DirectedGraph();
        var heater = new dgml.Node("H-3941", "heater");
        heater.moreProps = { Background: 'Red' };
        graph.nodes.push(heater);
        graph.nodes.push(new dgml.Node("timer"));
        graph.nodes.push(new dgml.Node("coffee-maker"));
        graph.links.push(new dgml.Link("coffee-maker", "H-3941"));
        graph.links.push(new dgml.Link("coffee-maker", "timer"));
        var electronics = new dgml.Category("c1", "Electronic", { Fun: 'True', NonStringIgnored: true, Tests: 'OK' });
        heater.category = electronics.id;
        graph.categories.push(electronics);
        graph.styles.push(new dgml.Style('Node', 'Wires', 'True', "HasCategory('c1')", [{ name: "Background", value: "Blue" }]));
        var ds = new dgml.nodeXml.Serializer(graph);
        var expectedDgml = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>"
            + "<DirectedGraph xmlns=\"http://schemas.microsoft.com/vs/2009/dgml\">"
            + "<Nodes>"
            + "<Node Id=\"H-3941\" Label=\"heater\" Category=\"c1\" Background=\"Red\"/>"
            + "<Node Id=\"timer\"/>"
            + "<Node Id=\"coffee-maker\"/>"
            + "</Nodes>"
            + "<Links>"
            + "<Link Source=\"coffee-maker\" Target=\"H-3941\"/>"
            + "<Link Source=\"coffee-maker\" Target=\"timer\"/>"
            + "</Links>"
            + "<Categories>"
            + "<Category Id=\"c1\" Label=\"Electronic\" Fun=\"True\" Tests=\"OK\"/>"
            + "</Categories>"
            + "<Styles>"
            + "<Style TargetType=\"Node\" GroupLabel=\"Wires\" ValueLabel=\"True\">"
            + "<Condition Expression=\"HasCategory(&apos;c1&apos;)\"/>"
            + "<Setter Property=\"Background\" Value=\"Blue\"/>"
            + "</Style>"
            + "</Styles>"
            + "</DirectedGraph>";
        chai.expect(ds.toDgml()).to.equal(expectedDgml);
    });
    it('includes styles no categories', function () {
        var graph = new dgml.DirectedGraph();
        graph.nodes.push(new dgml.Node("H-3941", "heater"));
        graph.nodes.push(new dgml.Node("timer"));
        graph.nodes.push(new dgml.Node("coffee-maker"));
        graph.links.push(new dgml.Link("coffee-maker", "H-3941"));
        graph.links.push(new dgml.Link("coffee-maker", "timer"));
        graph.styles.push(new dgml.Style('Node', 'Wires', 'True', "HasCategory('c1')", [{ name: "Background", value: "Blue" }]));
        var ds = new dgml.nodeXml.Serializer(graph);
        var expectedDgml = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>"
            + "<DirectedGraph xmlns=\"http://schemas.microsoft.com/vs/2009/dgml\">"
            + "<Nodes>"
            + "<Node Id=\"H-3941\" Label=\"heater\"/>"
            + "<Node Id=\"timer\"/>"
            + "<Node Id=\"coffee-maker\"/>"
            + "</Nodes>"
            + "<Links>"
            + "<Link Source=\"coffee-maker\" Target=\"H-3941\"/>"
            + "<Link Source=\"coffee-maker\" Target=\"timer\"/>"
            + "</Links>"
            + "<Styles>"
            + "<Style TargetType=\"Node\" GroupLabel=\"Wires\" ValueLabel=\"True\">"
            + "<Condition Expression=\"HasCategory(&apos;c1&apos;)\"/>"
            + "<Setter Property=\"Background\" Value=\"Blue\"/>"
            + "</Style>"
            + "</Styles>"
            + "</DirectedGraph>";
        chai.expect(ds.toDgml()).to.equal(expectedDgml);
    });
});
