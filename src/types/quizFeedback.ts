// 使用者填寫的基本資訊
export interface QuizUser {
    name: string;
    email?: string;
    organization?: string;
  }
  
  // 每一題的回答與正確資訊
  export interface SubmittedQuestion {
    question: string;
    userAnswer: string;
    correctAnswer: string;
    explanation?: string;
  }
  
  // GPT 分析回傳的結構
  export interface GPTFeedback {
    summary: string;
    suggestions: string[];
  }
  
  // API 輸入資料格式（POST /api/quiz/submit）
  export interface QuizSubmitRequest {
    user: QuizUser;
    questions: SubmittedQuestion[];
  }
  
  // API 回傳資料格式
  export interface QuizSubmitResponse {
    score: number;
    total: number;
    feedback: GPTFeedback;
  }
  