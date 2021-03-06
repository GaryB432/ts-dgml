﻿/// <reference path="../typings/tsd.d.ts" />

import assert = require("assert");
import dgml = require("../dgml");

describe("dgml serializer", () => {

    it("serializes properly", () => {
        let graph: dgml.DirectedGraph = new dgml.DirectedGraph();

        graph.nodes.push(new dgml.Node("H-3941", "heater"));
        graph.nodes.push(new dgml.Node("timer"));
        graph.nodes.push(new dgml.Node("coffee-maker"));

        graph.links.push(new dgml.Link("coffee-maker", "H-3941"));
        graph.links.push(new dgml.Link("coffee-maker", "timer"));

        let ds: dgml.ASerializer = new dgml.nodeXml.Serializer(graph);

        let expectedDgml: string = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>"
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

        assert.equal(ds.toDgml(), expectedDgml);
    });

    describe("external categories", () => {
        let graph: dgml.DirectedGraph;
        beforeEach(() => {
            graph = new dgml.DirectedGraph();
            graph.nodes.push(new dgml.Node("H-3941", "heater"));
            graph.nodes.push(new dgml.Node("timer"));
            graph.nodes.push(new dgml.Node("coffee-maker"));

            graph.links.push(new dgml.Link("coffee-maker", "H-3941"));
            graph.links.push(new dgml.Link("coffee-maker", "timer"));

            graph.categories.push(new dgml.Category("Appliances"));
        });
        it("with callback", (done: MochaDone) => {
            graph.links.push(new dgml.Link("other", "external_thing"));

            graph.addExternalNodes("external_stuff", (newNode: dgml.Node) => {
                assert.equal(newNode.id, "external_thing");
                assert.equal(newNode.category, "external_stuff");
                assert.equal(newNode.label, undefined);
                done();
            });
            let expectedDgml: string = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>"
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
            assert.equal(new dgml.nodeXml.Serializer(graph).toDgml(), expectedDgml);
        });

        it("without callback", () => {
            graph.addExternalNodes("external_stuff");

            let expectedDgml: string = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>"
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
            assert.equal(new dgml.nodeXml.Serializer(graph).toDgml(), expectedDgml);
        });

        it("does not duplicate existing category", () => {
            graph.addExternalNodes("Appliances");

            let expectedDgml: string = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>"
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
            assert.equal(new dgml.nodeXml.Serializer(graph).toDgml(), expectedDgml);
        });
    });

    it("includes categories", () => {
        let graph: dgml.DirectedGraph = new dgml.DirectedGraph();

        graph.nodes.push(new dgml.Node("H-3941", "heater"));
        graph.nodes.push(new dgml.Node("timer"));
        graph.nodes.push(new dgml.Node("coffee-maker"));

        graph.links.push(new dgml.Link("coffee-maker", "H-3941"));
        graph.links.push(new dgml.Link("coffee-maker", "timer"));

        graph.categories.push(new dgml.Category("Appliances"));

        let expectedDgml: string = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>"
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

        assert.equal(new dgml.nodeXml.Serializer(graph).toDgml(), expectedDgml);
    });

    it("includes more props", () => {
        let graph: dgml.DirectedGraph = new dgml.DirectedGraph();

        let heater: dgml.Node = new dgml.Node("H-3941", "heater");
        heater.moreProps = { Background: "Red" };

        graph.nodes.push(heater);

        graph.nodes.push(new dgml.Node("timer"));
        graph.nodes.push(new dgml.Node("coffee-maker"));

        graph.links.push(new dgml.Link("coffee-maker", "H-3941"));
        graph.links.push(new dgml.Link("coffee-maker", "timer"));

        let ds: dgml.ASerializer = new dgml.nodeXml.Serializer(graph);

        let expectedDgml: string = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>"
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
        assert.equal(ds.toDgml(), expectedDgml);
    });

    it("includes category props", () => {
        let graph: dgml.DirectedGraph = new dgml.DirectedGraph();

        let heater: dgml.Node = new dgml.Node("H-3941", "heater");
        heater.moreProps = { Background: "Red" };

        graph.nodes.push(heater);

        graph.nodes.push(new dgml.Node("timer"));
        graph.nodes.push(new dgml.Node("coffee-maker"));

        graph.links.push(new dgml.Link("coffee-maker", "H-3941"));
        graph.links.push(new dgml.Link("coffee-maker", "timer"));

        let electronics: dgml.Category = new dgml.Category("c1", "Electronic", { Fun: "True", NonStringIgnored: true, Tests: "OK" });
        heater.category = electronics.id;

        graph.categories.push(electronics);

        let ds: dgml.ASerializer = new dgml.nodeXml.Serializer(graph);

        let expectedDgml: string = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>"
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

        assert.equal(ds.toDgml(), expectedDgml);
    });

    it("includes styles", () => {
        let graph: dgml.DirectedGraph = new dgml.DirectedGraph();

        let heater: dgml.Node = new dgml.Node("H-3941", "heater");
        heater.moreProps = { Background: "Red" };

        graph.nodes.push(heater);

        graph.nodes.push(new dgml.Node("timer"));
        graph.nodes.push(new dgml.Node("coffee-maker"));

        graph.links.push(new dgml.Link("coffee-maker", "H-3941"));
        graph.links.push(new dgml.Link("coffee-maker", "timer"));

        let electronics: dgml.Category = new dgml.Category("c1", "Electronic", { Fun: "True", NonStringIgnored: true, Tests: "OK" });
        heater.category = electronics.id;

        graph.categories.push(electronics);

        graph.styles.push(new dgml.Style("Node", "Wires", "True", "HasCategory('c1')", [{ name: "Background", value: "Blue" }]));

        let ds: dgml.ASerializer = new dgml.nodeXml.Serializer(graph);

        let expectedDgml: string = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>"
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

        assert.equal(ds.toDgml(), expectedDgml);
    });

    it("includes styles no categories", () => {
        let graph: dgml.DirectedGraph = new dgml.DirectedGraph();

        graph.nodes.push(new dgml.Node("H-3941", "heater"));
        graph.nodes.push(new dgml.Node("timer"));
        graph.nodes.push(new dgml.Node("coffee-maker"));

        graph.links.push(new dgml.Link("coffee-maker", "H-3941"));
        graph.links.push(new dgml.Link("coffee-maker", "timer"));

        graph.styles.push(new dgml.Style("Node", "Wires", "True", "HasCategory('c1')", [{ name: "Background", value: "Blue" }]));

        let ds: dgml.ASerializer = new dgml.nodeXml.Serializer(graph);

        let expectedDgml: string = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>"
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

        assert.equal(ds.toDgml(), expectedDgml);
    });
});
