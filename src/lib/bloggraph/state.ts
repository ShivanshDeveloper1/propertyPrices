import { Annotation } from "@langchain/langgraph";

export const BlogState = Annotation.Root({
  topic: Annotation(),

  blog: Annotation(),

  imagePrompt: Annotation(),

  backgroundImage: Annotation(),

  coverSvg: Annotation(),
});