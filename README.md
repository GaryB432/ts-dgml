# DGML for Node

Tools for [Directed Graph Markup Language](http://en.wikipedia.org/wiki/DGML).


## Install

$ npm install ts-dgml

## API
```js
var graph = new dgml.DirectedGraph();
graph.nodes.push(new dgml.Node("car", "car"));
graph.nodes.push(new dgml.Node("truck", "truck-label"));
graph.links.push(new dgml.Link("car", "truck", "wheeled"));
var ds = new dgml.nodeXml.Serializer(graph);
console.log(ds.toDgml());
```
produces this
```xml
<?xml version="1.0" encoding="UTF-8"?>
<DirectedGraph xmlns="http://schemas.microsoft.com/vs/2009/dgml">
    <Nodes>
        <Node Id="car" Label="car"/>
        <Node Id="truck" Label="truck-label"/>
    </Nodes>
    <Links>
        <Link Source="car" Target="truck" Category="wheeled"/>
    </Links>
</DirectedGraph>
```
### More Advanced
```js
var graph = new dgml.DirectedGraph();
var car = new dgml.Node("car", "car");
car.moreProps = { Background: 'Orange' };
graph.nodes.push(car);
graph.nodes.push(new dgml.Node("truck", "truck-label"));
graph.links.push(new dgml.Link("car", "auto"));
graph.categories.push(new dgml.Category("a", "a", 
    {
        Fun: 'True', NonStringIgnored: true, Tests: 'OK'
    }));
var ds = new dgml.nodeXml.Serializer(graph);
console.log(ds.toDgml());
```
produces this
```xml
<?xml version="1.0" encoding="UTF-8"?>
<DirectedGraph xmlns="http://schemas.microsoft.com/vs/2009/dgml">
    <Nodes>
        <Node Id="car" Label="car" Background="Orange"/>
        <Node Id="truck" Label="truck-label"/>
    </Nodes>
    <Links>
        <Link Source="car" Target="auto"/>
    </Links>
    <Categories>
        <Category Id="a" Label="a" Fun="True" Tests="OK"/>
    </Categories>
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
