/// <reference path="../typings/xml/xml.d.ts" />
/// <reference path="../typings/tsd.d.ts" />
/*
    Run `npm test` to run tests
*/

import xml = require('xml');
import chai = require('chai');
import dgml = require('../dgml');

describe('dgml serializer', function () {

    it('serializes properly', () => {
        var graph = new dgml.DirectedGraph();

        graph.nodes.push(new dgml.Node("car", "car"));
        graph.nodes.push(new dgml.Node("truck", "truck-label"));
        graph.links.push(graph.createLink("car", "truck"));

        var ds = new dgml.nodeXml.Serializer(graph);

        chai.expect(ds.toDgml()).to.equal('<?xml version=\"1.0\" encoding=\"UTF-8\"?><DirectedGraph xmlns=\"http://schemas.microsoft.com/vs/2009/dgml\"><Nodes><Node Id=\"car\" Label=\"car\"/><Node Id=\"truck\" Label=\"truck-label\"/></Nodes><Links><Link Source=\"car\" Target=\"truck\"/></Links></DirectedGraph>');
    });

    it('throws on invalid link node', () => {
        var graph = new dgml.DirectedGraph();
        graph.nodes.push(new dgml.Node("car", "automobile"));
        chai.expect(graph.createLink.bind(graph, 'X', 'Y')).to.throw();
    });

});