type Question = {
  id: string;
  quizId: string;
  text: string;
  options: string[];
  correctAnswers: string[];
  explanation?: string;
  createdAt: string;
};

const questions: Question[] = []; // in-memory

export async function saveQuestions(newQuestions: Question[]) {
  questions.push(...newQuestions);
}

export async function getQuestionsByQuizId(quizId: string): Promise<Question[]> {
  return questions.filter(q => q.quizId === quizId);
}

export async function deleteQuestion(id: string) {
  const index = questions.findIndex(q => q.id === id);
  if (index !== -1) {
    questions.splice(index, 1);
  }
}
