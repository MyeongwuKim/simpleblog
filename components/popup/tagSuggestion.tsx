import { AnimatePresence, motion } from "framer-motion";
import TagItem from "../ui/items/tagItem";

export default function TagSuggestionPopup({
  suggestions,
  visible,
  className,
  onSelectItem,
}: {
  suggestions: string[];
  visible: boolean;
  className?: string;
  onSelectItem: (value: string) => void;
}) {
  return (
    <AnimatePresence>
      {visible && suggestions.length > 0 && (
        <motion.div
          data-testid="suggestion-popup"
          key="suggestion-popup"
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
          className={`left-0 bottom-full mb-3 flex flex-wrap gap-2 p-3
          max-w-xs max-h-48 w-auto rounded-lg shadow-lg relative z-20
          bg-background2 text-gray-200 overflow-visible ${className ?? ""}`}
        >
          <div
            className="absolute z-10 top-[-9px] left-[16px] w-0 h-0 border-b-[9px]"
            style={{
              borderLeft: "9px solid transparent",
              borderRight: "9px solid transparent",
              borderBottomColor: "var(--color-background2)",
            }}
          />
          {suggestions.map((item) => (
            <TagItem id="" mode="normal" text={item} key={item} clickEvt={() => onSelectItem(item)} />
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
