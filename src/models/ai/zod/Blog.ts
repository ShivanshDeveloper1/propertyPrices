import { z } from "zod";

// 1. Keep your individual block definitions as they are
const HeadingBlock = z.object({ type: z.literal("heading"), level: z.number().min(1).max(6).default(2), content: z.string() });
const ParagraphBlock = z.object({ type: z.literal("paragraph"), content: z.string() });
const ListBlock = z.object({ type: z.literal("list"), items: z.array(z.string()) });
const HtmlBlock = z.object({ type: z.literal("html"), content: z.string() });
const PdfBlock = z.object({ type: z.literal("pdf"), title: z.string(), url: z.string() });

// 2. Define the Discriminated Union
const FlatBlock = z.discriminatedUnion("type", [
  HeadingBlock,
  ParagraphBlock,
  ListBlock,
  HtmlBlock,
  PdfBlock,
]);

// 3. Define SectionBlock, but keep it simple
const SectionBlock = z.object({
  type: z.literal("section"),
  heading: z.string().optional(),
  content: z.array(FlatBlock),
});

// 4. Final Body Union
const BodyBlock = z.discriminatedUnion("type", [
  HeadingBlock,
  ParagraphBlock,
  ListBlock,
  HtmlBlock,
  PdfBlock,
  SectionBlock, // Include it here directly
]);

// 5. Export as before
export const BlogSchema = z.object({
  metadata: z.any(),
  body: z.array(BodyBlock),
});