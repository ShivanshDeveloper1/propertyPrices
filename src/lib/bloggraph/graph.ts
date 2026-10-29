import {
  StateGraph,
  START,
  END,
} from "@langchain/langgraph";

import { BlogState } from "./state";

import {
  generateBlogNode,
  generateImageNode,
  generateCoverNode,
} from "./node";

const workflow = new StateGraph(BlogState)
  // Nodes
  .addNode("generateBlog", generateBlogNode)
  .addNode("generateImage", generateImageNode)
  .addNode("generateCover", generateCoverNode)

  // Flow: generateBlog -> generateImage -> generateCover
  .addEdge(START, "generateBlog")
  .addEdge("generateBlog", "generateImage")
  .addEdge("generateImage", "generateCover")
  .addEdge("generateCover", END);

export const blogGraph = workflow.compile();