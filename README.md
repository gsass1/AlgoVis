# AlgoVis

AlgoVis is an algorithm visualizer designed to simulate complex algorithms using different data structures. It could have potential use in aiding computer science student's in their comprehension in algorithms and datastructure courses.

![AlgoVis running Kruskal](https://user-images.githubusercontent.com/4589491/60400540-908ab880-9b75-11e9-9d26-5b83879fa758.PNG)
![AlgoVis running Quicksort](https://user-images.githubusercontent.com/4589491/60400575-fa0ac700-9b75-11e9-8a7e-e9c0961df66a.PNG)
![AlgoVis running DFS](https://user-images.githubusercontent.com/4589491/60400576-00993e80-9b76-11e9-9fcb-96a835dbf7c2.PNG)

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
