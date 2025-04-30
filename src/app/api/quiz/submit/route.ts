import { NextResponse } from "next/server";
import { OpenAI } from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { user, questions } = body;

    if (!user || !questions || !Array.isArray(questions)) {
      return NextResponse.json({ error: "缺少必要欄位" }, { status: 400 });
    }

    const total = questions.length;
    const correct = questions.filter((q: any) => q.userAnswer === q.correctAnswer).length;
    const wrong = questions.filter((q: any) => q.userAnswer !== q.correctAnswer);

    const gptSummary = await generateFeedbackWithGPT(user.name, wrong);

    return NextResponse.json({
      score: correct,
      total,
      feedback: gptSummary,
    });
  } catch (error) {
    console.error("[API QUIZ SUBMIT ERROR]", error);
    return NextResponse.json({ error: "提交失敗" }, { status: 500 });
  }
}

async function generateFeedbackWithGPT(username: string, wrongQuestions: any[]) {
  if (!wrongQuestions.length) {
    return {
      summary: `🎉 恭喜 ${username} 全部答對！繼續保持，太棒了！`,
      suggestions: [],
    };
  }

  const formattedList = wrongQuestions
    .map((q, i) => `第 ${i + 1} 題：${q.question}\n你的答案：${q.userAnswer}\n正確答案：${q.correctAnswer}\n解析：${q.explanation || "略"}\n`)
    .join("\n");

  const prompt = `
以下是使用者錯誤作答的題目與正確解釋，請幫助他完成以下任務：
1. 濃縮三點錯誤觀念與補充建議
2. 用親切口吻鼓勵他持續練習
3. 僅輸出 JSON 格式（不能多加說明文字）

JSON 格式為：
{
  "summary": "...",
  "suggestions": ["建議一", "建議二", "建議三"]
}

使用者名稱：${username}
錯誤題目明細：
${formattedList}
`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7,
  });

  const raw = response.choices?.[0]?.message?.content || "{}";

  try {
    const parsed = JSON.parse(raw);
    return parsed;
  } catch (err) {
    console.warn("[GPT 回應 JSON 解析失敗]", raw);
    return {
      summary: "⚠️ 無法解析 GPT 回應，可能格式錯誤。",
      suggestions: [],
    };
  }
}
