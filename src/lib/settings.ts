// lib/settings.ts

export interface QuizSettings {
    difficulty: "簡單" | "普通" | "挑戰";
    questionType: "記憶型" | "理解型" | "素養型";
    tone: "正式" | "親切" | "創意";
    length: "精簡" | "中等" | "詳細";
    numQuestions: number;
  }
  
  export const defaultSettings: QuizSettings = JSON.parse(
    typeof window !== "undefined" && localStorage.getItem("quizSettings") ||
      JSON.stringify({
        difficulty: "普通",
        questionType: "理解型",
        tone: "正式",
        length: "中等",
        numQuestions: 3,
      })
  );
  
  export function saveSettings(settings: QuizSettings) {
    if (typeof window !== "undefined") {
      localStorage.setItem("quizSettings", JSON.stringify(settings));
    }
  }
  