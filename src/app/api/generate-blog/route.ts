import { google } from "@ai-sdk/google";
import { generateObject } from "ai";
import { BlogSchema } from "@/models/ai/zod/Blog";

export async function GET() {
  try {
    console.log("🚀 Initializing Structured Generation via Vercel AI SDK...");

    const { object: blog } = await generateObject({
      // Using gemini-2.5-pro for complex nested blog layouts
      model: google("gemini-2.5-flash"), 
      schema: BlogSchema, // Pass the Zod schema directly! No conversions needed.
      prompt: `
You are an expert SEO content writer and real estate analyst writing ONLY for https://www.saharanpurprice.in.

Generate a complete SEO blog that exactly matches the provided response schema structure.

Rules:
- The blog must focus ONLY on Saharanpur, Uttar Pradesh.
- Mention Saharanpur naturally throughout the article.
- Use local areas like Delhi Road, Ambala Road, Behat Road, Civil Lines, Janakpuri, Hakikat Nagar, Deoband, Gangoh, Sarsawa, Nakur, Rampur Maniharan, etc. only when relevant.
- If LATEST_SAHARANPUR_NEWS contains useful news, explain how it may affect Saharanpur's property market.
- If the news is unrelated or unavailable, ignore it and write an evergreen educational blog.
- Never invent news, statistics, government announcements, or facts.
- Explain topics such as property prices, land prices, buying, selling, investment, infrastructure, legal verification, registry, circle rates, and future growth.
- Write in simple, natural English. Avoid fluff and repetition.
- Generate an SEO-friendly title, slug, summary, category, tags, and realistic read time.
- Set featuredImage.url to an empty string.
- featuredImage.altText should describe an ideal thumbnail.
- Author name: Shivansh
- Author URL: https://www.saharanpurprice.in/about
- Use only these body block types: heading, paragraph, and list.
- Create 10–15 sections.
- End the article with an FAQ list block.

LATEST_SAHARANPUR_NEWS:
{{LATEST_NEWS}}

GOOGLE_TRENDS:
{{GOOGLE_TRENDS}}

BLOG_TOPIC:
{{BLOG_TOPIC}}
`,
    });

    console.log("✅ Successfully generated and validated blog structural schema!");

    // The SDK automatically parses and validates using your Zod schema
    return Response.json({ blog });

  } catch (error: any) {
    console.error("💥 Vercel AI SDK Generation Error:", error);
    return Response.json(
      { 
        error: "Generation or structural validation failed.", 
        message: error.message || error 
      }, 
      { status: 500 }
    );
  }
}