# DGML for Node

Tools for [Directed Graph Markup Language](http://en.wikipedia.org/wiki/DGML).


## Install

$ npm install ts-dgml

## API
```js
var graph = new Dgml.DirectedGraph();
graph.nodes.push(new Dgml.Node("car", "car"));
graph.nodes.push(new Dgml.Node("truck", "truck"));
graph.links.push(graph.createLink("car", "here"));
console.log(Dgml.DgmlSerializer(graph).toDgml());
```
produces this
```xml
<?xml version="1.0" encoding="UTF-8"?>
<DirectedGraph xmlns="http://schemas.microsoft.com/vs/2009/dgml">
    <Nodes>
        <Node Id="car" Label="car"/>
        <Node Id="truck" Label="truck"/>
    </Nodes>
    <Links>
        <Link Source="car" Target="truck"/>
    </Links>
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
