import { GoogleGenAI } from "@google/genai";

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

const ai = new GoogleGenAI({
  apiKey: "",
});

async function aiWorkflow(ageRange, gender, goal, level) {
  const aiInput = `
You are a fitness challenge generator AI.

Input details:
- Age range: ${ageRange}
- Gender: ${gender}
- Fitness goal: ${goal} (e.g. overall fitness, weight loss, strength, flexibility)
- Current fitness level: ${level} (beginner, intermediate, advanced)

Your task:
1. Suggest 3-5 personalized fitness challenges suitable for this user.
2. Challenges must be safe, realistic, and aligned with their age, gender, goal, and level.
3. Keep challenges short and actionable. Example formats:
   - "Do 20 pushups at home"
   - "Run 100m in under 15 seconds"
   - "Practice 15 mins of yoga"
4. Output only JSON in this schema:

{
  "challenges": [
    { "title": "string", "description": "string" }
  ]
}
`;
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: aiInput,
  });
  let text =
    response?.candidates?.[0]?.content?.parts?.[0]?.text ||
    response?.candidates?.[0]?.text ||
    "";
  text = text.trim();
  if (text.startsWith("```json")) {
    text = text
      .replace(/^```json/, "")
      .replace(/```$/, "")
      .trim();
  } else if (text.startsWith("```")) {
    text = text.replace(/^```/, "").replace(/```$/, "").trim();
  }

  console.log("Workflow Output:", text);
  await runWorkflow(JSON.parse(text));
}

// Provide a default export for compatibility with default imports
export default aiWorkflow;
