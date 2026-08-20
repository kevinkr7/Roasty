import { AnimatePresence } from "framer-motion";
import MemoryBubble from "./MemoryBubble";

export interface Attempt {
  id: string;
  commonName: string;
  botanicalName: string;
  isCorrect: boolean;
  position: { x: number; y: number };
  side: "left" | "right";
}

interface MemoryBubblesContainerProps {
  attempts: Attempt[];
}

const MemoryBubblesContainer = ({ attempts }: MemoryBubblesContainerProps) => {
  return (
    // pointer-events-none allows clicking THROUGH the empty space
    // The bubbles themselves have pointer-events-auto
    <div className="fixed inset-0 overflow-visible pointer-events-none z-0">
      <AnimatePresence>
        {attempts.map((attempt, index) => (
          <MemoryBubble key={attempt.id} attempt={attempt} index={index} />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default MemoryBubblesContainer;