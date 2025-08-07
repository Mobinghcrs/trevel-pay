import { GoogleGenAI, GenerateContentResponse, Type } from "@google/genai";
import { AiIntent } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const model = "gemini-2.5-flash";

const marketAnalystSystemInstruction = `You are a helpful and friendly financial market analyst for "TRAVEL PAY".
Your goal is to provide concise, easy-to-understand insights about cryptocurrency and fiat markets.
Do not give financial advice.
Always frame your answers as educational analysis based on publicly available data.
When asked about price predictions, speak in terms of possibilities and trends, not certainties.
Use markdown for formatting, especially bolding for key terms and bullet points for lists.`;

/**
 * Generates a market analysis for a given user query in a streaming fashion.
 * @param query The user's question about the market.
 * @returns An async generator that yields chunks of the response.
 */
export async function* generateMarketAnalysisStream(
  query: string
): AsyncGenerator<string> {
  try {
    const response = await ai.models.generateContentStream({
      model,
      contents: query,
      config: {
        systemInstruction: marketAnalystSystemInstruction,
      },
    });

    for await (const chunk of response) {
      yield chunk.text;
    }
  } catch (error) {
    console.error("Error generating content from Gemini API:", error);
    if (error instanceof Error) {
        if (error.message.includes('API_KEY_INVALID')) {
             yield "Error: The provided API key is invalid. Please check your configuration.";
        } else {
            yield `Error: Could not get analysis. ${error.message}`;
        }
    } else {
        yield "An unknown error occurred while contacting the AI analyst.";
    }
  }
}

const aiIntentSystemInstruction = (currentDate: string) => `You are an intelligent assistant for TRAVEL PAY. Your task is to understand user requests and translate them into a structured JSON format based on the provided schema. The services available are 'flights', 'hotel', 'exchange', 'car-rental', and 'shopping'. The current date is ${currentDate}.

- **service**: Must be one of: 'flights', 'hotel', 'exchange', 'car-rental', 'shopping', 'unknown'.
- **parameters**:
  - For **flights**: Extract 'origin', 'destination', and a specific 'date' (YYYY-MM-DD). Convert relative dates like 'tomorrow' or 'next Friday'.
  - For **hotel**: Extract 'destination', 'checkInDate', and 'checkOutDate'. If only one date is mentioned, assume it's the check-in date. If a duration is mentioned (e.g., 'for 3 nights'), calculate the check-out date.
  - For **exchange**: Identify 'fromCurrency' (3-letter code), 'toCurrency' (3-letter code), and 'amount'. Also, try to determine the specific exchange feature ('swap', 'bank', 'p2p') and set it as the 'tab' parameter. Default to 'swap' if unsure.
  - For **car-rental**: Extract 'destination' (as location), 'checkInDate' (as pickup date), and 'checkOutDate' (as dropoff date).
  - For **shopping**: Extract the user's search term into the 'query' parameter.
  - If the intent is unclear or not related to any service, set service to 'unknown'.
`;

const intentSchema = {
  type: Type.OBJECT,
  properties: {
    service: {
      type: Type.STRING,
      enum: ['flights', 'hotel', 'exchange', 'car-rental', 'shopping', 'unknown'],
      description: 'The service the user wants to use.'
    },
    parameters: {
      type: Type.OBJECT,
      properties: {
        origin: { type: Type.STRING, description: 'Origin city or airport code for flights.' },
        destination: { type: Type.STRING, description: 'Destination city for flights, hotels, or cars.' },
        date: { type: Type.STRING, description: 'Departure date for flights in YYYY-MM-DD format.' },
        checkInDate: { type: Type.STRING, description: 'Check-in date for hotels or pickup date for cars in YYYY-MM-DD format.' },
        checkOutDate: { type: Type.STRING, description: 'Check-out date for hotels or dropoff date for cars in YYYY-MM-DD format.' },
        fromCurrency: { type: Type.STRING, description: 'The currency to convert from (3-letter code).' },
        toCurrency: { type: Type.STRING, description: 'The currency to convert to (3-letter code).' },
        amount: { type: Type.NUMBER, description: 'The amount of currency to exchange.' },
        query: { type: Type.STRING, description: 'The search query for shopping.' },
        tab: { type: Type.STRING, enum: ['rates', 'p2p', 'bank', 'delivery', 'swap', 'ai-analyst'], description: 'The specific tab for the exchange service.'}
      },
    },
  },
  required: ['service', 'parameters']
};

export async function getIntentFromQuery(query: string): Promise<AiIntent> {
    const currentDate = new Date().toISOString().split('T')[0];
    try {
        const response = await ai.models.generateContent({
            model,
            contents: query,
            config: {
                systemInstruction: aiIntentSystemInstruction(currentDate),
                responseMimeType: "application/json",
                responseSchema: intentSchema,
            },
        });
        
        const jsonText = response.text.trim();
        return JSON.parse(jsonText) as AiIntent;

    } catch (error) {
        console.error("Error getting intent from Gemini:", error);
        throw new Error("Sorry, I couldn't understand that. Please try rephrasing your request.");
    }
}

/**
 * Generates a simple, beginner-friendly summary of a crypto asset.
 * @param assetName The name of the asset (e.g., "Bitcoin").
 * @returns A string containing the summary.
 */
export async function generateAssetSummary(assetName: string): Promise<string> {
    const systemInstruction = `You are a helpful assistant for TRAVEL PAY. Your goal is to explain complex financial topics in a simple, concise, and neutral way for beginners. Do not give financial advice.`;
    const prompt = `Provide a brief, beginner-friendly summary of what ${assetName} is and its primary purpose. Keep it under 100 words.`;
    
    try {
        const response: GenerateContentResponse = await ai.models.generateContent({
            model,
            contents: prompt,
            config: {
                systemInstruction,
                temperature: 0.2,
            },
        });
        return response.text;
    } catch (error) {
        console.error("Error generating asset summary from Gemini:", error);
        throw new Error(`Could not generate a summary for ${assetName}.`);
    }
}