# DGML for Node

[![Build Status](https://travis-ci.org/GaryB432/ts-dgml.svg?branch=master)](https://travis-ci.org/GaryB432/ts-dgml)

[![NPM](https://nodei.co/npm/ts-dgml.png)](https://nodei.co/npm/ts-dgml/)

Tools for [Directed Graph Markup Language](http://en.wikipedia.org/wiki/DGML).

## Install

$ npm install ts-dgml

## API

###Basic Serialization
```js
var dgml = require('dgml');
var graph = new dgml.DirectedGraph();
graph.nodes.push(new dgml.Node("H-3941", "heater"));
graph.nodes.push(new dgml.Node("timer"));
graph.nodes.push(new dgml.Node("coffee-maker"));
graph.links.push(new dgml.Link("coffee-maker", "H-3941"));
graph.links.push(new dgml.Link("coffee-maker", "timer"));
var ds = new dgml.nodeXml.Serializer(graph, {
    indent: true, declaration: true
});
console.log(ds.toDgml());
```
produces this
```xml
<?xml version="1.0" encoding="UTF-8"?>
<DirectedGraph xmlns="http://schemas.microsoft.com/vs/2009/dgml">
    <Nodes>
        <Node Id="H-3941" Label="heater"/>
        <Node Id="timer"/>
        <Node Id="coffee-maker"/>
    </Nodes>
    <Links>
        <Link Source="coffee-maker" Target="H-3941"/>
        <Link Source="coffee-maker" Target="timer"/>
    </Links>
</DirectedGraph>
```

###Including Categories
```js
var dgml = require('dgml');
var graph = new dgml.DirectedGraph();
graph.nodes.push(new dgml.Node("H-3941", "heater"));
graph.nodes.push(new dgml.Node("timer"));
graph.nodes.push(new dgml.Node("coffee-maker"));
graph.links.push(new dgml.Link("coffee-maker", "H-3941"));
graph.links.push(new dgml.Link("coffee-maker", "timer"));
graph.categories.push(new dgml.Category("Appliances"));
var ds = new dgml.nodeXml.Serializer(graph, {
    indent: true, declaration: true
});
console.log(ds.toDgml());
```
produces this
```xml
<?xml version="1.0" encoding="UTF-8"?>
<DirectedGraph xmlns="http://schemas.microsoft.com/vs/2009/dgml">
    <Nodes>
        <Node Id="H-3941" Label="heater"/>
        <Node Id="timer"/>
        <Node Id="coffee-maker"/>
    </Nodes>
    <Links>
        <Link Source="coffee-maker" Target="H-3941"/>
        <Link Source="coffee-maker" Target="timer"/>
    </Links>
    <Categories>
        <Category Id="Appliances"/>
    </Categories>
</DirectedGraph>
```

###Including More Properties
```js
var dgml = require('dgml');
var graph = new dgml.DirectedGraph();
var heater = new dgml.Node("H-3941", "heater");
heater.moreProps = { Background: 'Red' };
graph.nodes.push(heater);
graph.nodes.push(new dgml.Node("timer"));
graph.nodes.push(new dgml.Node("coffee-maker"));
graph.links.push(new dgml.Link("coffee-maker", "H-3941"));
graph.links.push(new dgml.Link("coffee-maker", "timer"));
var ds = new dgml.nodeXml.Serializer(graph, {
    indent: true, declaration: true
});
console.log(ds.toDgml());
```
produces this
```xml
<?xml version="1.0" encoding="UTF-8"?>
<DirectedGraph xmlns="http://schemas.microsoft.com/vs/2009/dgml">
    <Nodes>
        <Node Id="H-3941" Label="heater" Background="Red"/>
        <Node Id="timer"/>
        <Node Id="coffee-maker"/>
    </Nodes>
    <Links>
        <Link Source="coffee-maker" Target="H-3941"/>
        <Link Source="coffee-maker" Target="timer"/>
    </Links>
</DirectedGraph>
```

###Including Category Properties
```js
var dgml = require('dgml');
var graph = new dgml.DirectedGraph();
var heater = new dgml.Node("H-3941", "heater");
heater.moreProps = { Background: 'Red' };
graph.nodes.push(heater);
graph.nodes.push(new dgml.Node("timer"));
graph.nodes.push(new dgml.Node("coffee-maker"));
graph.links.push(new dgml.Link("coffee-maker", "H-3941"));
graph.links.push(new dgml.Link("coffee-maker", "timer"));
var electronics = new dgml.Category("c1", "Electronic", {
    Fun: 'True', NonStringIgnored: true, Tests: 'OK'
});
heater.category = electronics.id;
graph.categories.push(electronics);
var ds = new dgml.nodeXml.Serializer(graph, {
    indent: true, declaration: true
});
console.log(ds.toDgml());
```
produces this
```xml
<?xml version="1.0" encoding="UTF-8"?>
<DirectedGraph xmlns="http://schemas.microsoft.com/vs/2009/dgml">
    <Nodes>
        <Node Id="H-3941" Label="heater" Category="c1" Background="Red"/>
        <Node Id="timer"/>
        <Node Id="coffee-maker"/>
    </Nodes>
    <Links>
        <Link Source="coffee-maker" Target="H-3941"/>
        <Link Source="coffee-maker" Target="timer"/>
    </Links>
    <Categories>
        <Category Id="c1" Label="Electronic" Fun="True" Tests="OK"/>
    </Categories>
</DirectedGraph>
```

###Including Styles
```js
var dgml = require('dgml');
var graph = new dgml.DirectedGraph();
var heater = new dgml.Node("H-3941", "heater");
heater.moreProps = { Background: 'Red' };
graph.nodes.push(heater);
graph.nodes.push(new dgml.Node("timer"));
graph.nodes.push(new dgml.Node("coffee-maker"));
graph.links.push(new dgml.Link("coffee-maker", "H-3941"));
graph.links.push(new dgml.Link("coffee-maker", "timer"));
var electronics = new dgml.Category("c1", "Electronic", { 
    Fun: 'True', NonStringIgnored: true, Tests: 'OK'
});
heater.category = electronics.id;
graph.categories.push(electronics);
graph.styles.push(new dgml.Style('Node', 'Wires', 'True', "HasCategory('c1')", [{
    name: "Background", value: "Blue"
}]));
var ds = new dgml.nodeXml.Serializer(graph, {
    indent: true, declaration: true
});
console.log(ds.toDgml());
```
produces this
```xml
<?xml version="1.0" encoding="UTF-8"?>
<DirectedGraph xmlns="http://schemas.microsoft.com/vs/2009/dgml">
    <Nodes>
        <Node Id="H-3941" Label="heater" Category="c1" Background="Red"/>
        <Node Id="timer"/>
        <Node Id="coffee-maker"/>
    </Nodes>
    <Links>
        <Link Source="coffee-maker" Target="H-3941"/>
        <Link Source="coffee-maker" Target="timer"/>
    </Links>
    <Categories>
        <Category Id="c1" Label="Electronic" Fun="True" Tests="OK"/>
    </Categories>
    <Styles>
        <Style TargetType="Node" GroupLabel="Wires" ValueLabel="True">
            <Condition Expression="HasCategory(&apos;c1&apos;)"/>
            <Setter Property="Background" Value="Blue"/>
        </Style>
    </Styles>
</DirectedGraph>
```

###Including Styles but no Categories
```js
var dgml = require('dgml');
var graph = new dgml.DirectedGraph();
graph.nodes.push(new dgml.Node("H-3941", "heater"));
graph.nodes.push(new dgml.Node("timer"));
graph.nodes.push(new dgml.Node("coffee-maker"));
graph.links.push(new dgml.Link("coffee-maker", "H-3941"));
graph.links.push(new dgml.Link("coffee-maker", "timer"));
graph.styles.push(new dgml.Style('Node', 'Wires', 'True', "HasCategory('c1')", [{
    name: "Background", value: "Blue"
}]));
var ds = new dgml.nodeXml.Serializer(graph, {
    indent: true, declaration: true
});
console.log(ds.toDgml());
```
produces this
```xml
<?xml version="1.0" encoding="UTF-8"?>
<DirectedGraph xmlns="http://schemas.microsoft.com/vs/2009/dgml">
    <Nodes>
        <Node Id="H-3941" Label="heater"/>
        <Node Id="timer"/>
        <Node Id="coffee-maker"/>
    </Nodes>
    <Links>
        <Link Source="coffee-maker" Target="H-3941"/>
        <Link Source="coffee-maker" Target="timer"/>
    </Links>
    <Styles>
        <Style TargetType="Node" GroupLabel="Wires" ValueLabel="True">
            <Condition Expression="HasCategory(&apos;c1&apos;)"/>
            <Setter Property="Background" Value="Blue"/>
        </Style>
    </Styles>
</DirectedGraph>
```

## Tests

Tests included use Mocha. Use `npm test` to run the tests.

    $ npm test

# Contributing

Contributions to the project are welcome. Feel free to fork and improve. I accept pull requests and issues, especially when tests are included.

# License

## Internet Systems Consortium license
Copyright (c) 2015, Gary Bortosky and contributers

Permission to use, copy, modify, and/or distribute this software for any purpose
with or without fee is hereby granted, provided that the above copyright notice
and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND
FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS
OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER
TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF
THIS SOFTWARE.
