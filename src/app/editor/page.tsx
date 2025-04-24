"use client";

import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const initialQuestions = [
  { id: "q1", content: "🌱 題目一：地球的溫室效應是由什麼造成？" },
  { id: "q2", content: "🌎 題目二：ESG 中的 S 是什麼意思？" },
  { id: "q3", content: "🌿 題目三：企業碳中和策略有哪些方法？" },
];

export default function EditorPage() {
  const [questions, setQuestions] = useState(initialQuestions);

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(questions);
    const [movedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, movedItem);

    setQuestions(items);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
        ✏️ 題目編輯器（拖拉排序）
      </h1>
      <div className="max-w-xl mx-auto">
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="questionList">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="space-y-4"
              >
                {questions.map((q, index) => (
                  <Draggable key={q.id} draggableId={q.id} index={index}>
                    {(provided) => (
                      <div
                        className="bg-white p-4 rounded shadow border flex items-center justify-between"
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        {q.content}
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    </div>
  );
}
