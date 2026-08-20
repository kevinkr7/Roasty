import { motion } from "framer-motion";

interface Attempt {
  id: string;
  commonName: string;
  botanicalName: string;
  isCorrect: boolean;
  position: { x: number; y: number };
  side: "left" | "right";
}

interface MemoryBubbleProps {
  attempt: Attempt;
  index: number;
}

const MemoryBubble = ({ attempt, index }: MemoryBubbleProps) => {
  // Bubbles are now larger and more transparent to hold text
  const bubbleBaseColor = attempt.isCorrect 
    ? "bg-green-500/10 border-green-400/30 shadow-green-500/20" 
    : "bg-rose-500/10 border-rose-400/30 shadow-rose-500/20";

  const textColor = attempt.isCorrect 
    ? "text-green-600" 
    : "text-rose-500";

  const emoji = attempt.isCorrect ? "🌿" : "🥀";

  // Randomize float
  const floatDuration = 5 + Math.random() * 2;
  const floatDelay = Math.random() * 2;

  return (
    <motion.div
      className="absolute pointer-events-auto z-10 select-none"
      initial={{ 
        scale: 0, 
        opacity: 0,
        x: attempt.side === "left" ? "-50%" : "50%",
        y: attempt.position.y 
      }}
      animate={{ 
        scale: 1, 
        opacity: 1,
        x: attempt.position.x,
        y: attempt.position.y
      }}
      transition={{ 
        type: "spring",
        stiffness: 40,
        damping: 12,
        delay: 0.1 
      }}
      style={{
        left: attempt.side === "left" ? "0" : "auto",
        right: attempt.side === "right" ? "0" : "auto",
        top: "50%", 
      }}
    >
      <motion.div
        animate={{
          y: [-6, 6, -6],
          scale: [1, 1.01, 0.99, 1],
        }}
        transition={{
          duration: floatDuration,
          ease: "easeInOut",
          repeat: Infinity,
          delay: floatDelay,
        }}
        // Increased size to w-36 h-36 to fit text comfortably
        className={`relative w-36 h-36 rounded-full backdrop-blur-[3px] border ${bubbleBaseColor} flex flex-col items-center justify-center p-2 text-center`}
        style={{
          boxShadow: `
            inset 0 0 30px rgba(255, 255, 255, 0.25), 
            inset 10px 10px 30px rgba(255, 255, 255, 0.1), 
            0 15px 35px rgba(0, 0, 0, 0.15)
          `
        }}
      >
        {/* Specular Highlight */}
        <div className="absolute top-[12%] left-[12%] w-[25%] h-[15%] bg-gradient-to-br from-white/90 to-transparent rounded-full -rotate-45 blur-[1px]" />
        
        {/* Bounce Light */}
        <div className="absolute bottom-[10%] right-[10%] w-[40%] h-[40%] bg-gradient-to-tl from-white/20 to-transparent rounded-full blur-md" />

        {/* --- CONTENT INSIDE BUBBLE --- */}
        
        {/* Emoji */}
        <span className="text-2xl mb-1 filter drop-shadow-sm opacity-90">
          {emoji}
        </span>

        {/* Question (Common Name) */}
        <span className="text-[10px] uppercase tracking-wider text-muted-foreground/80 font-bold leading-tight mb-0.5">
          {attempt.commonName}
        </span>

        {/* Divider */}
        <div className={`w-8 h-[1px] my-1 opacity-30 ${attempt.isCorrect ? 'bg-green-500' : 'bg-rose-500'}`} />

        {/* Answer (Botanical Name) */}
        <span className={`text-[11px] font-bold italic ${textColor} leading-tight px-1`}>
          {attempt.botanicalName}
        </span>

      </motion.div>
    </motion.div>
  );
};

export default MemoryBubble;