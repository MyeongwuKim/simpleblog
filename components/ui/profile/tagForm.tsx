"use client";
import { useState } from "react";
import { FaTrash } from "react-icons/fa";

interface Tag {
  id: string;
  body: string;
  count: number; // 글 개수
}

export function TagForm() {
  const [tags, setTags] = useState<Tag[]>([
    { id: "1", body: "React", count: 12 },
    { id: "2", body: "Next.js", count: 5 },
    { id: "3", body: "Node.js", count: 0 },
  ]);

  // 태그 삭제 (글 개수가 0일 때만 가능)
  const handleDelete = (id: string) => {
    setTags((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div className="rounded-xl shadow  space-y-4">
      <h2 className="text-lg font-bold text-text1 mb-2">태그 관리</h2>

      {tags.length === 0 ? (
        <p className="text-gray-400 text-sm">등록된 태그가 없습니다.</p>
      ) : (
        tags.map((tag) => (
          <div
            key={tag.id}
            className="flex items-center justify-between border-b pb-3 last:border-b-0"
          >
            <div>
              <span className="font-medium text-text1">{tag.body}</span>
              <span className="ml-2 text-sm text-gray-400">
                ({tag.count} 개 글)
              </span>
            </div>

            {/* 글이 없는 태그만 삭제 버튼 */}
            {tag.count === 0 && (
              <button
                onClick={() => handleDelete(tag.id)}
                className="flex items-center gap-1 text-red-500 hover:text-red-600 text-sm"
              >
                <FaTrash /> 삭제
              </button>
            )}
          </div>
        ))
      )}
    </div>
  );
}
