import { NextResponse } from "next/server";
import { ChatCompletionMessageParam } from "openai/resources";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { topic, examScope, referenceExample, numQuestions, difficulty } = body;

    if (!topic || !examScope || !numQuestions) {
      return NextResponse.json({ error: "缺少必要欄位" }, { status: 400 });
    }

    const systemPrompt = `你是一位專業出題 AI，請根據使用者提供的考試主題與範圍，產生 ${numQuestions} 題單選題，難度為 ${difficulty}，格式如下：

Question: 題目文字
Options: A.選項1;B.選項2;C.選項3;D.選項4
CorrectAnswer: 正確答案代號（A、B、C 或 D）
Explanation: （可選）解析文字

請以 JSON 陣列格式回傳，例如：
[
  {
    "question": "什麼是碳中和？",
    "options": "A.完全不排放;B.排放減半;C.排放等於吸收;D.只在歐盟適用",
    "correctAnswer": "C",
    "explanation": "碳中和是指總排放量等於碳吸收量。"
  },
  ...
]`;

    const userPrompt = `主題：${topic}
考試範圍：${examScope}
${referenceExample ? `樣題參考：${referenceExample}` : ""}`;

    const messages: ChatCompletionMessageParam[] = [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ];

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages,
      temperature: 0.7,
    });

    const content = completion.choices[0]?.message?.content;
    const questions = JSON.parse(content || "[]");

    return NextResponse.json({ questions });
  } catch (err) {
    console.error("[GPT Question Error]", err);
    return NextResponse.json({ error: "出題失敗，請稍後再試" }, { status: 500 });
  }
}
