import { useEffect, useRef, useState } from "react";

export type DragFileType = "image" | "video" | "file" | null;

const detectDragType = (e: DragEvent): DragFileType => {
  const items = e.dataTransfer?.items;
  if (!items || items.length === 0) return "file";

  const firstFileItem = Array.from(items).find((item) => item.kind === "file");
  const mime = firstFileItem?.type ?? "";
  if (mime.startsWith("image/")) return "image";
  if (mime.startsWith("video/")) return "video";
  return "file";
};

export function useGlobalDragDrop(onFileDrop: (file: File) => void) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragType, setDragType] = useState<DragFileType>(null);
  const dragCounter = useRef(0);

  useEffect(() => {
    const handleDragEnter = (e: DragEvent) => {
      e.preventDefault();
      dragCounter.current += 1;
      if (e.dataTransfer?.types?.includes("Files")) {
        setIsDragging(true);
        setDragType(detectDragType(e));
      }
    };

    const handleDragLeave = (e: DragEvent) => {
      e.preventDefault();
      dragCounter.current -= 1;
      if (dragCounter.current <= 0) {
        setIsDragging(false);
        setDragType(null);
      }
    };

    const handleDragOver = (e: DragEvent) => {
      e.preventDefault();
      if (e.dataTransfer?.types?.includes("Files")) {
        setIsDragging(true);
      } 
      setDragType(detectDragType(e));
    };

    const handleDrop = (e: DragEvent) => {
      e.preventDefault();
      dragCounter.current = 0;
      setIsDragging(false);
      setDragType(null);

      const files = e.dataTransfer?.files;
      if (!files?.length) return;

      for (const file of files) {
        onFileDrop(file);
      }
    };

    window.addEventListener("dragenter", handleDragEnter);
    window.addEventListener("dragleave", handleDragLeave);
    window.addEventListener("dragover", handleDragOver);
    window.addEventListener("drop", handleDrop);

    return () => {
      window.removeEventListener("dragenter", handleDragEnter);
      window.removeEventListener("dragleave", handleDragLeave);
      window.removeEventListener("dragover", handleDragOver);
      window.removeEventListener("drop", handleDrop);
    };
  }, [onFileDrop]);

  return { isDragging, dragType };
}
