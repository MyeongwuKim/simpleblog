"use client";

import React, { createContext, useContext, useState } from "react";

type PostDetailContextType = {
  collectionOpen: boolean;
  setCollectionOpen: (open: boolean) => void;
};

const PostDetailContext = createContext<PostDetailContextType | null>(null);

export default function PostDetailProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // 🔥 기본값: 닫힘 (velog랑 동일)
  const [collectionOpen, setCollectionOpen] = useState(false);

  return (
    <PostDetailContext.Provider value={{ collectionOpen, setCollectionOpen }}>
      {children}
    </PostDetailContext.Provider>
  );
}

export function usePostDetailContext() {
  const ctx = useContext(PostDetailContext);
  if (!ctx) {
    throw new Error(
      "usePostDetailContext must be used within PostDetailProvider"
    );
  }
  return ctx;
}
