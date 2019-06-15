# API Documentation

Due to limitation of the interpreter using, AlgoVis only has a C-like API. The user
receives opaque objects and functions have to be used even for simple data-retrieval.

Therefore one has to write `listSize(list)` instead of simply writing `list.size` or `list.getSize()`.
A new interpreter or a transpiler that could convert the latter to the former could be a possible solution.

## Objects

Objects are always referenced by their name, a string.


## Lists

### listCreate(name, size)

>Creates a new shuffled list with the specified name and size. Returns `name`.

### listGet(list, i)

>Returns the ith element of `list`

### listSet(list, i, value)

>Sets the ith element of `list` to `value`

### listSwap(list, a, b)

>Swaps the ath and bth elements of `list`

### listAdd(list, value)

>Appends `value` to `list`

### listSize(list)

>Returns the size of `list`

### listLength(list)

>Returns the size of `list`

## Trees

### treeCreate(name)

>Creates a new tree with the specified name and one root node with a value of 0.

### randomTree(name, opt:depth, opt:maxChildCount)

>Creates a new random tree with the specified name, a maximum branch depth of `depth`, with children as many as `maxChildCount`.

### randomBinaryTree(name, opt:depth)

>Same as above with maxChildCount = 2

### treeRoot(tree)

>Returns the root node of `tree`

## Binary Nodes

### nodeLeft(node)

>Returns the left child of `node`. Synonymous with `nodeGetChild(node, 0)`

### nodeRight(node)

>Returns the right child of `node`. Synonymous with `nodeGetChild(node, 1)`

### nodeSetLeft(node, value)

>Sets the left children's value of `node` to `value`.

### nodeSetRight(node, value)

>Sets the right children's value of `node` to `value`.

### nodeSetLeftFromRef(node, ref)

>Sets the left children to the node referenced by `ref`

### nodeSetRightFromRef(node, ref)

>Sets the right children to the node referenced by `ref`

### nodeRemoveLeft(node)

>Removes the left children of `node`

### nodeRemoveRight(node)

>Removes the right children of `node`

## Nodes

### nodeValue(node)

>Returns the value of `node`.

### nodeSet(node, value)

>Sets the value of `node` to `value`.

### nodeChildCount(node)

>Removes the amount of children of node

### nodeGetChild(node, i)

>Returns a reference to the ith child of `node`

### nodeAddChild(node, value)

>Adds a new child-node to `node` with the value `value`

## Queues


### queueCreate(name)

>Creates a new queue with name `name`

### enqueue(q, obj)

>Appends `obj` to the queue `q`

### dequeue(q)

>Returns the object that is first in the queue.

### queueSize(q)

>Returns the amount of objects in the queue `q`

## Graphs

### graphCreate(name)

>Creates a new empty graph. Returns `name`.

### graphEdgeCount(graph)

>Returns the amount of edges of `graph`

### graphVertexCount(graph)

>Returns the amount of vertices of `graph`

### graphGetEdge(graph, i)

>Returns the ith edge of `graph`

## Vertices

### addVertex(graph, name, opt:x, opt:y)

>Creates a new vertex and adds it to the graph. Returns `name`.

### vertexGetId(vertex)

>Returns the ID of `vertex`

## Edges

### edgeGetWeight(edge)

>Returns the weight of `edge`

### edgeGetSource(edge)

>Returns the source vertex reference of `edge`

### edgeGetDest(edge)

>Returns the destination vertex reference of `edge`

### edgeMark(edge)

## Debugging

### log(msg)

>Prints `msg` to the console

### debugbreak()

>Stops execution until it is resumed again
