import { motion, AnimatePresence } from "framer-motion";

interface RoastDisplayProps {
  roast: string;
  isCorrect: boolean | null;
  correctAnswer?: string;
  show: boolean;
}

const RoastDisplay = ({ roast, isCorrect, correctAnswer, show }: RoastDisplayProps) => {
  return (
    <AnimatePresence mode="wait">
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ 
            duration: 0.5, 
            ease: [0.34, 1.56, 0.64, 1]
          }}
          className="text-center space-y-3"
        >
          <motion.p 
            className="roast-display roast-text"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {roast}
          </motion.p>
          
          {!isCorrect && correctAnswer && (
            <motion.p 
              className="correct-answer-reveal"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              It was <span className="text-primary font-semibold italic">{correctAnswer}</span>, by the way.
            </motion.p>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default RoastDisplay;
