import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { total, correct, questions } = await req.json();

  const mistakeList = questions
    .filter((q: any) => q.userAnswer !== q.correctAnswer)
    .map((q: any) => `Q: ${q.question}\n你選擇: ${q.userAnswer}，正確答案: ${q.correctAnswer}`)
    .join("\n\n");

  const prompt = `
你是一位教育助教，請針對以下作答紀錄給出簡要的總結與學習建議。

答題總數：${total}
答對數：${correct}

以下是答錯的題目摘要：

${mistakeList || "全部答對，無錯題。"}

請用以下 JSON 格式回覆：
{
  "summary": "一句簡短摘要",
  "suggestions": ["建議一", "建議二", ...]
}
  `;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4", // 或 gpt-3.5-turbo
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    }),
  });

  const data = await response.json();
  const text = data.choices?.[0]?.message?.content || "";

  try {
    const parsed = JSON.parse(text);
    return NextResponse.json(parsed);
  } catch (err) {
    console.error("⚠ GPT 回傳格式錯誤", err);
    return NextResponse.json({ summary: "AI 分析回傳異常", suggestions: [] });
  }
}
