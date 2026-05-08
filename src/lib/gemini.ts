import { GoogleGenerativeAI, Part } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

/**
 * 1. EMBEDDING GENERATION
 * Converts text into a vector (768 dimensions) for RAG.
 */
export async function getEmbedding(text: string) {
  const model = genAI.getGenerativeModel({ model: "text-embedding-004" });
  const result = await model.embedContent(text);
  return result.embedding.values;
}

/**
 * 2. RAG GENERATION
 * Takes a user question and a list of retrieved "knowledge snippets".
 * Augments the prompt with this context.
 */
export async function generateRAGResponse(question: string, contextSnippets: string[]) {
  const model = genAI.getGenerativeModel({ 
    model: "gemini-1.5-flash",
    systemInstruction: "You are a Traditional Knowledge Guide. Use only the provided context to answer. If the answer is not in the context, say you don't know based on our records, but suggest related cultural wisdom."
  });

  const contextText = contextSnippets.join("\n\n---\n\n");
  const prompt = `
    CONTEXT FROM TRADITIONAL KNOWLEDGE DATABASE:
    ${contextText}

    USER QUESTION:
    ${question}
  `;

  const result = await model.generateContent(prompt);
  return result.response.text();
}

/**
 * 3. CONTEXTUAL CHAT (Task-Aware)
 * Starts a chat session that is "primed" with the current task's context.
 * This is used for interactive deep-dives while the user is doing an activity.
 */
export function startContextualChat(taskTitle: string, taskContent: string) {
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    systemInstruction: `
      You are an interactive guide for the activity: "${taskTitle}".
      Here is the information the user is currently looking at:
      "${taskContent}"
      
      Your goal:
      - Help the user explore this specific tradition.
      - Connect this tradition to modern sustainability and ethical living.
      - Be encouraging, respectful of indigenous wisdom, and interactive.
    `,
  });

  return model.startChat({
    history: [], // History starts empty, but systemInstruction provides the "soul"
  });
}

/**
 * 4. EMBEDDING MULTIPLE CHUNKS (Batch)
 * Useful for when you have a long story and need to break it into pieces.
 */
export async function embedKnowledgeChunks(chunks: string[]) {
  const model = genAI.getGenerativeModel({ model: "text-embedding-004" });
  const result = await model.batchEmbedContents({
    requests: chunks.map((text) => ({
      content: { role: "user", parts: [{ text }] },
    })),
  });
  return result.embeddings.map(e => e.values);
}
