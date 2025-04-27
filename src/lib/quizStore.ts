// 👉 原本的 Quiz 定義與 quizzes Map 保留
type Quiz = {
    id: string;
    createdAt: string;
    questions: any[];
    settings: any;
    meta: any;
  };
  
  const quizzes = new Map<string, Quiz>();
  
  export function saveQuiz(quiz: Quiz) {
    quizzes.set(quiz.id, quiz);
  }
  
  export function getQuiz(id: string) {
    return quizzes.get(id);
  }
  
  // ✅ 加入作答記錄儲存機制
  const submissions = new Map<string, any[]>(); // key = quizId
  
  export function saveSubmission(quizId: string, submission: any) {
    if (!submissions.has(quizId)) {
      submissions.set(quizId, []);
    }
    submissions.get(quizId)?.push(submission);
    console.log("✅ 已儲存作答紀錄：", submission);
  }
  
  export function getSubmissions(quizId: string) {
    return submissions.get(quizId) || [];
  }
  