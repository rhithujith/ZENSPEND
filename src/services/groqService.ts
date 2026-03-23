import Groq from "groq-sdk";

let groqClient: Groq | null = null;

const getGroqClient = () => {
  if (!groqClient) {
    const apiKey = import.meta.env.VITE_GROQ_API_KEY;
    if (!apiKey) return null;
    groqClient = new Groq({ apiKey, dangerouslyAllowBrowser: true });
  }
  return groqClient;
};

export const getFinancialAdvice = async (prompt: string) => {
  try {
    const client = getGroqClient();
    if (!client) return "Set up your Groq API key to get AI-powered financial advice! 🔑";

    const chatCompletion = await client.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a savvy Gen Z financial advisor. You give punchy, realistic, and encouraging advice. Use emojis and keep it brief."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      model: "llama-3.3-70b-versatile",
    });

    return chatCompletion.choices[0]?.message?.content || "Keep grinding! Your future self will thank you. 💸";
  } catch (error) {
    console.error("Groq Advice Error:", error);
    return "Budgeting is a marathon, not a sprint. You got this! 🏃‍♂️💨";
  }
};
