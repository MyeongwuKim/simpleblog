"use client";

interface TagItemProps {
  text: string;
  callback?: () => void;
}

const TagItem = ({ text, callback }: TagItemProps) => {
  return (
    <div
      className="py-1.5 px-3 rounded-full text-base
    w-auto relative inline-block bg-background5 text-text5 "
    >
      <span className={`relative`}>{text}</span>
    </div>
  );
};

export default TagItem;
