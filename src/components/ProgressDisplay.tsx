import { motion } from "framer-motion";

interface ProgressDisplayProps {
  current: number;
  total: number;
  correctCount: number;
}

const getJudgmentText = (correct: number, attempted: number): string => {
  if (attempted === 0) return "Awaiting judgment...";
  
  const ratio = correct / attempted;
  
  if (ratio >= 0.9) return "Suspiciously competent";
  if (ratio >= 0.7) return "Reluctantly impressed";
  if (ratio >= 0.5) return "Mediocre at best";
  if (ratio >= 0.3) return "Concerning";
  if (ratio > 0) return "Disappointing";
  return "A botanical tragedy";
};

const ProgressDisplay = ({ current, total, correctCount }: ProgressDisplayProps) => {
  const attempted = current;
  
  return (
    <motion.div 
      className="progress-judgment text-muted-foreground"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3 }}
    >
      <span className="text-primary font-semibold">{getJudgmentText(correctCount, attempted)}</span>
      <span className="mx-3 opacity-40">·</span>
      <span>{correctCount}/{attempted} correct</span>
      <span className="mx-3 opacity-40">·</span>
      <span>Question {Math.min(current + 1, total)}/{total}</span>
    </motion.div>
  );
};

export default ProgressDisplay;
