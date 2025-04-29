export default function EditorPage() {
    const [generatedQuestions, setGeneratedQuestions] = useState<any[]>([]);
  
    const handleQuestionsGenerated = (questions: any[]) => {
      setGeneratedQuestions(questions);
      // 你也可以把它塞到原本的編輯器區塊狀態中
    };
  
    return (
      <div className="flex">
        <div className="flex-1 p-6">
          <h2 className="text-xl font-bold mb-4">目前題組編輯器</h2>
          {/* 這裡放你現有的題目編輯器區域 */}
          {/* 可以顯示 generatedQuestions */}
        </div>
  
        <QuestionSettingSidebar onQuestionsGenerated={handleQuestionsGenerated} />
      </div>
    );
  }
  