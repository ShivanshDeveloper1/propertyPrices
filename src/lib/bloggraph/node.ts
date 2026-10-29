import { model } from "@/lib/ai";
import { createBlogPrompt } from "@/lib/blogPrompt";
import { generateCover } from "@/lib/satori/generateCover";

// Helper to safely parse JSON from Gemini
function parseGeminiJson(content: any) {
  let clean = typeof content === "string" ? content : JSON.stringify(content);
  clean = clean.replace(/```json/gi, "").replace(/```/g, "").trim();

  const firstBrace = clean.indexOf("{");
  const lastBrace = clean.lastIndexOf("}");
  if (firstBrace !== -1 && lastBrace !== -1) {
    clean = clean.substring(firstBrace, lastBrace + 1);
  }

  return JSON.parse(clean);
}

// 1. GENERATE BLOG & IMAGE PROMPT (Single Gemini Call)
export async function generateBlogNode(state: any) {
  console.log("📝 Generating blog & image prompt with Gemini...");

  const blogPrompt = createBlogPrompt(state.topic);
  const response = await model.invoke(blogPrompt);

  let rawData: any = {};
  try {
    rawData = parseGeminiJson(response.content);
  } catch (err) {
    console.error("❌ Failed to parse Gemini JSON output:", err);
  }

  // Set blog object with safe fallback defaults
  const blog = {
    title: rawData.title || `${state.topic}: Complete Business Guide`,
    category: rawData.category || "Web Strategy",
    author: rawData.author || "WebContractor Editorial",
    whyItMatters: rawData.whyItMatters || "",
    comparison: rawData.comparison || [],
    consequences: rawData.consequences || [],
    realWorldExample: rawData.realWorldExample || "",
    callToAction: rawData.callToAction || "",
  };

  const imagePrompt =
    rawData.imagePrompt ||
    `Modern professional desk with laptop showing a sleek website dashboard, warm studio lighting, 8k resolution`;

  console.log("✅ Blog & image prompt ready:", blog.title);

  return { blog, imagePrompt };
}

// 2. GENERATE BACKGROUND IMAGE (Cloudflare FLUX)
export async function generateImageNode(state: any) {
  console.log("🖼️ Generating background image with Cloudflare FLUX...");

  const accountId = process.env.CF_ACCOUNT_ID;
  const apiToken = process.env.CF_API_TOKEN;

  if (!accountId || !apiToken) {
    throw new Error("Missing Cloudflare environment variables");
  }

  const response = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/run/@cf/black-forest-labs/flux-1-schnell`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: state.imagePrompt,
        steps: 4,
      }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Cloudflare FLUX error: ${errorText}`);
  }

  const data = await response.json();
  if (!data.result?.image) {
    throw new Error("No image data returned from Cloudflare");
  }

  const backgroundImage = `data:image/jpeg;base64,${data.result.image}`;
  console.log("✅ Background image generated");

  return { backgroundImage };
}

// 3. CREATE FINAL COVER (Satori)
export async function generateCoverNode(state: any) {
  console.log("✍️ Creating final Satori cover...");

  const coverSvg = await generateCover({
    title: state.blog.title,
    category: state.blog.category,
    author: state.blog.author,
    backgroundImage: state.backgroundImage,
  });

  console.log("✅ Cover SVG successfully created!");

  return { coverSvg };
}