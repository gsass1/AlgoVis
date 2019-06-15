# AlgoVis

AlgoVis is an algorithm visualizer designed to simulate complex algorithms using different data structures. It could have potential use in aiding computer science student's in their comprehension in algorithms and datastructure courses.

![AlgoVis](/uploads/81c16e23b72bc327e64b10c52e1d6cff/Capture.PNG)

The current goal is to implement the following data structures using integer data values:

User code is written in JavaScript which is interpreted by [JS-Interpreter](https://github.com/NeilFraser/JS-Interpreter). All simulation and interpretation is handled on the client-side, making this app serverless.

## Development

Install the required the packages with `yarn`

Then run the webpack server with `yarn run serv`

## Using AlgoVis

You can think of AlgoVis as a "visual debugger", meaning you can write code and instantly observe its effects.

Several algorithms have already been implemented, try the "Examples" button on the top right.
* Lists
  1. Bubble Sort
  2. Insertion Sort
  3. Quick Sort
* Trees
  1. Depth-First Search
  2. Breadth-First Search
  3. Binary Search Trees
* Graphs
  1. Kruskal's minimum spanning tree

AlgoVis currently supports visualizing the following data structures:

1. Lists
2. Trees
3. Queues
4. Graphs

If you want to know more about programming in AlgoVis, check out [API.md](/API.md).
