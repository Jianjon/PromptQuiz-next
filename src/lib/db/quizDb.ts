// /src/lib/db/quizDb.ts

type Quiz = {
    id: string;
    title: string;
    description: string;
    createdAt: string;
    isPublic: boolean;
  };
  
  const quizzes: Quiz[] = []; // 簡易記憶體暫存（正式版可改Supabase）
  
  export async function saveQuiz(quiz: Quiz) {
    quizzes.push(quiz);
  }
  
  export async function getAllQuizzes(): Promise<Quiz[]> {
    return quizzes;
  }
  
  export async function getQuizById(id: string): Promise<Quiz | undefined> {
    return quizzes.find(q => q.id === id);
  }
  
  export async function deleteQuiz(id: string) {
    const index = quizzes.findIndex(q => q.id === id);
    if (index !== -1) {
      quizzes.splice(index, 1);
    }
  }
  