import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

export const model = new ChatGoogleGenerativeAI({
  model: "gemini-3.6-flash", // Updated from gemini-2.0-flash
  temperature: 0.7,
  responseMimeType:'application/json',  //Force gemini to return pure json
});