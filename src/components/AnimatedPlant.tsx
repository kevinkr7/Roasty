import { motion } from "framer-motion";

interface AnimatedPlantProps {
  mood: "idle" | "happy" | "sad" | "waiting";
}

const AnimatedPlant = ({ mood }: AnimatedPlantProps) => {
  const getAnimation = () => {
    switch (mood) {
      case "happy":
        return {
          rotate: [0, -5, 5, -3, 3, 0],
          scale: [1, 1.08, 1.05, 1.08, 1],
          y: [0, -8, -4, -8, 0],
        };
      case "sad":
        return {
          rotate: [0, -12, -8],
          scale: [1, 0.92, 0.95],
          y: [0, 15, 10],
        };
      case "waiting":
        return {
          rotate: [0, -1, 1, 0],
          y: [0, -3, 0],
        };
      default:
        return {
          rotate: [0, -2, 2, 0],
          y: [0, -4, 0],
        };
    }
  };

  const getTransition = () => {
    switch (mood) {
      case "happy":
        return {
          duration: 0.8,
          ease: [0.34, 1.56, 0.64, 1] as const,
        };
      case "sad":
        return {
          duration: 0.6,
          ease: "easeOut" as const,
        };
      case "waiting":
        return {
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut" as const,
        };
      default:
        return {
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut" as const,
        };
    }
  };

  return (
    <motion.div
      className="plant-shadow select-none"
      animate={getAnimation()}
      transition={getTransition()}
      style={{ transformOrigin: "bottom center" }}
    >
      <svg
        width="120"
        height="160"
        viewBox="0 0 120 160"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-lg"
      >
        {/* Pot */}
        <path
          d="M35 140 L40 160 L80 160 L85 140 Z"
          fill="hsl(25, 60%, 35%)"
          className="transition-colors duration-300"
        />
        <path
          d="M30 130 L35 140 L85 140 L90 130 Z"
          fill="hsl(25, 55%, 45%)"
        />
        <ellipse cx="60" cy="130" rx="30" ry="6" fill="hsl(25, 50%, 30%)" />
        
        {/* Stem */}
        <path
          d="M60 130 Q60 100 58 70 Q56 50 60 30"
          stroke="hsl(152, 40%, 30%)"
          strokeWidth="6"
          strokeLinecap="round"
          fill="none"
        />
        
        {/* Left Leaf */}
        <motion.path
          d="M58 90 Q30 85 20 60 Q25 75 40 85 Q50 90 58 90"
          fill="hsl(152, 45%, 35%)"
          animate={mood === "happy" ? { rotate: [0, 5, 0] } : {}}
          transition={{ duration: 0.4 }}
          style={{ transformOrigin: "58px 90px" }}
        />
        
        {/* Right Leaf */}
        <motion.path
          d="M62 80 Q90 70 100 45 Q92 65 78 78 Q68 85 62 80"
          fill="hsl(152, 50%, 40%)"
          animate={mood === "happy" ? { rotate: [0, -5, 0] } : {}}
          transition={{ duration: 0.4, delay: 0.1 }}
          style={{ transformOrigin: "62px 80px" }}
        />
        
        {/* Top Leaf */}
        <motion.path
          d="M60 30 Q50 10 35 5 Q55 15 60 30 Q65 15 85 5 Q70 10 60 30"
          fill="hsl(82, 45%, 55%)"
          animate={mood === "happy" ? { scale: [1, 1.1, 1], y: [0, -5, 0] } : {}}
          transition={{ duration: 0.5 }}
          style={{ transformOrigin: "60px 25px" }}
        />
        
        {/* Small accent leaves */}
        <path
          d="M55 60 Q40 55 35 45 Q45 55 55 60"
          fill="hsl(152, 40%, 45%)"
        />
        <path
          d="M65 55 Q80 48 88 35 Q78 50 65 55"
          fill="hsl(82, 40%, 50%)"
        />
      </svg>
    </motion.div>
  );
};

export default AnimatedPlant;
