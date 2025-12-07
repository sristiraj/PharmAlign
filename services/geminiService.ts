import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { Territory, HCP } from "../types";

const SYSTEM_INSTRUCTION = `
You are the AI Territory Advisor for PharmaAlign, an advanced pharma commercial operations platform.
Your audience is Sales Directors and Commercial Operations Managers.
You have access to data regarding Territories, Health Care Professionals (HCPs), and Workload Balance.

Key Responsibilities:
1. Suggest territory realignments to balance workload and maximize potential.
2. Identify "White Space" opportunities (high potential, low coverage).
3. Draft call plans for field representatives.
4. Analyze performance trends.

When responding:
- Be concise, professional, and data-driven.
- Use bullet points for recommendations.
- If asked about specific metrics (like TRx or NRx), explain them in the context of pharma sales performance.
- Assume the user wants actionable insights.
`;

class GeminiService {
  private ai: GoogleGenAI;
  private chatSession: Chat | null = null;

  constructor() {
    // API Key is injected via process.env.API_KEY
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  }

  public async initializeChat(contextData?: { territories: Territory[]; hcps: HCP[] }) {
    let contextPrompt = "";
    if (contextData) {
      contextPrompt = `
      Current Data Context:
      Territories: ${JSON.stringify(contextData.territories.map(t => ({ name: t.name, workload: t.workloadIndex, potential: t.totalPotential })))}
      Top HCPs Sample: ${JSON.stringify(contextData.hcps.slice(0, 5).map(h => ({ name: h.name, specialty: h.specialty, potential: h.potentialScore })))}
      `;
    }

    this.chatSession = this.ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: SYSTEM_INSTRUCTION + contextPrompt,
        temperature: 0.7,
      },
    });
  }

  public async *sendMessageStream(message: string): AsyncGenerator<string, void, unknown> {
    if (!this.chatSession) {
      await this.initializeChat();
    }

    if (!this.chatSession) {
        throw new Error("Failed to initialize chat session.");
    }

    try {
      const result = await this.chatSession.sendMessageStream({ message });
      
      for await (const chunk of result) {
        const c = chunk as GenerateContentResponse;
        if (c.text) {
          yield c.text;
        }
      }
    } catch (error) {
      console.error("Gemini API Error:", error);
      yield "I'm having trouble connecting to the AI service right now. Please check your API key configuration.";
    }
  }
}

export const geminiService = new GeminiService();