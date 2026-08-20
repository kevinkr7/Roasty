import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AnimatedPlant from "./AnimatedPlant";
import RoastDisplay from "./RoastDisplay";
import ProgressDisplay from "./ProgressDisplay";
import MemoryBubblesContainer, { Attempt } from "./MemoryBubblesContainer";
import { checkAnswer, getRandomRoast } from "@/data/plants";

type PlantMood = "idle" | "happy" | "sad" | "waiting";

// --- CUSTOM 5-QUESTION LIST ---
const CUSTOM_PLANTS = [
  { commonName: "Mango", botanicalName: "Mangifera indica" },
  { commonName: "Potato", botanicalName: "Solanum tuberosum" },
  { commonName: "Tomato", botanicalName: "Solanum lycopersicum" },
  { commonName: "Sunflower", botanicalName: "Helianthus annuus" },
  { commonName: "Rose", botanicalName: "Rosa" }
];

// Simple shuffle
const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// INCREASED RADIUS (Bubbles are now 144px/2 = ~72px, plus padding)
const BUBBLE_RADIUS = 85; 
const SCREEN_PADDING = 50; 

const generateBubblePosition = (
  side: "left" | "right",
  existingAttempts: Attempt[]
): { x: number; y: number } => {
  const maxAttempts = 50;
  
  for (let i = 0; i < maxAttempts; i++) {
    const y = (Math.random() * 550) - 275; 
    const xBase = Math.random() * 180 + SCREEN_PADDING; 
    const x = side === "left" ? xBase : -xBase;

    const hasCollision = existingAttempts.some(attempt => {
      if (attempt.side !== side) return false;
      const dx = x - attempt.position.x;
      const dy = y - attempt.position.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      return distance < (BUBBLE_RADIUS * 2); 
    });

    if (!hasCollision) return { x, y };
  }

  return { x: side === "left" ? 60 : -60, y: (Math.random() * 500) - 250 };
};

const BotanicalQuiz = () => {
  // Use CUSTOM_PLANTS instead of importing full list
  const [shuffledPlants] = useState(() => shuffleArray(CUSTOM_PLANTS));
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [plantMood, setPlantMood] = useState<PlantMood>("idle");
  const [showRoast, setShowRoast] = useState(false);
  const [currentRoast, setCurrentRoast] = useState("");
  const [lastResult, setLastResult] = useState<boolean | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [streak, setStreak] = useState(0);
  const [isCorrectStreak, setIsCorrectStreak] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [quizComplete, setQuizComplete] = useState(false);
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [pendingBubble, setPendingBubble] = useState<Omit<Attempt, "id" | "position" | "side"> | null>(null);

  const currentPlant = shuffledPlants[currentIndex];

  const handleSubmit = useCallback(() => {
    if (!userAnswer.trim() || isSubmitting || showRoast) return;

    setIsSubmitting(true);
    setPlantMood("waiting");

    const isCorrect = checkAnswer(userAnswer, currentPlant.botanicalName);
    
    setTimeout(() => {
      setLastResult(isCorrect);
      
      if (isCorrect) {
        setCorrectCount(prev => prev + 1);
        setPlantMood("happy");
        if (isCorrectStreak) {
          setStreak(prev => prev + 1);
        } else {
          setStreak(1);
          setIsCorrectStreak(true);
        }
      } else {
        setPlantMood("sad");
        if (!isCorrectStreak) {
          setStreak(prev => prev + 1);
        } else {
          setStreak(1);
          setIsCorrectStreak(false);
        }
      }

      const roast = getRandomRoast(isCorrect, streak);
      setCurrentRoast(roast);
      setShowRoast(true);
      setIsSubmitting(false);
      
      setPendingBubble({
        commonName: currentPlant.commonName,
        botanicalName: currentPlant.botanicalName,
        isCorrect,
      });
    }, 600);
  }, [userAnswer, isSubmitting, showRoast, currentPlant, isCorrectStreak, streak]);

  // Bubble Spawning
  useEffect(() => {
    if (pendingBubble && showRoast) {
      const timer = setTimeout(() => {
        const side: "left" | "right" = attempts.length % 2 === 0 ? "left" : "right";
        const position = generateBubblePosition(side, attempts);
        
        const newAttempt: Attempt = {
          id: `attempt-${Date.now()}`,
          ...pendingBubble,
          position,
          side,
        };
        
        setAttempts(prev => [...prev, newAttempt]);
        setPendingBubble(null);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [pendingBubble, showRoast, attempts]);

  const handleNext = useCallback(() => {
    if (currentIndex >= shuffledPlants.length - 1) {
      setQuizComplete(true);
      return;
    }

    setShowRoast(false);
    setUserAnswer("");
    setLastResult(null);
    
    setTimeout(() => {
      setCurrentIndex(prev => prev + 1);
      setPlantMood("idle");
    }, 300);
  }, [currentIndex, shuffledPlants.length]);

  // Global Key Listener
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" && showRoast) {
        e.preventDefault();
        handleNext();
      }
    };
    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => window.removeEventListener("keydown", handleGlobalKeyDown);
  }, [showRoast, handleNext]);

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !showRoast) {
      handleSubmit();
    }
  };

  const resetQuiz = () => {
    setCurrentIndex(0);
    setUserAnswer("");
    setPlantMood("idle");
    setShowRoast(false);
    setCurrentRoast("");
    setLastResult(null);
    setCorrectCount(0);
    setStreak(0);
    setIsCorrectStreak(true);
    setQuizComplete(false);
    setAttempts([]);
    setPendingBubble(null);
  };

  useEffect(() => {
    if (!showRoast && !quizComplete) {
      const timer = setTimeout(() => setPlantMood("idle"), 100);
      return () => clearTimeout(timer);
    }
  }, [showRoast, quizComplete]);

  if (quizComplete) {
    const ratio = correctCount / shuffledPlants.length;
    let finalVerdict = "";
    if (ratio >= 0.9) finalVerdict = "Suspiciously competent. The plants accept you. 🌿";
    else if (ratio >= 0.7) finalVerdict = "Not bad. You might actually keep a cactus alive.";
    else if (ratio >= 0.5) finalVerdict = "Mediocre. Your botany teacher is crying somewhere.";
    else if (ratio >= 0.3) finalVerdict = "Concerning. Do not touch the exhibits.";
    else finalVerdict = "A botanical tragedy. Please leave the greenhouse.";

    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden">
        <MemoryBubblesContainer attempts={attempts} />
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-8 z-20 bg-background/80 backdrop-blur-md p-12 rounded-3xl border shadow-xl"
        >
          <AnimatedPlant mood={ratio >= 0.5 ? "happy" : "sad"} />
          
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-primary">
              Quiz Complete
            </h1>
            <p className="text-2xl font-mono text-muted-foreground">
              {correctCount} / {shuffledPlants.length} Correct
            </p>
            <p className="roast-display max-w-md mx-auto text-lg">
              {finalVerdict}
            </p>
          </div>

          <button
            onClick={resetQuiz}
            className="px-8 py-3 bg-primary text-primary-foreground font-medium rounded-lg
                     hover:opacity-90 transition-opacity duration-200 shadow-lg hover:shadow-primary/20"
          >
            Try Again
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12 relative overflow-hidden">
      
      <MemoryBubblesContainer attempts={attempts} />
      
      <div className="w-full max-w-2xl flex flex-col items-center space-y-12 relative z-10 pb-20">
        
        <ProgressDisplay 
          current={currentIndex} 
          total={shuffledPlants.length}
          correctCount={correctCount}
        />

        <div className="py-6 scale-110">
          <AnimatedPlant mood={plantMood} />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="text-center space-y-3"
          >
            <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground font-mono">
              What is the botanical name for?
            </p>
            <h1 className="plant-name-display text-primary text-4xl md:text-5xl">
              {currentPlant.commonName}
            </h1>
          </motion.div>
        </AnimatePresence>

        <div className="w-full flex flex-col items-center min-h-[160px] justify-center relative">
          <AnimatePresence mode="wait">
            {!showRoast ? (
              <motion.div
                key="input"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                className="w-full flex flex-col items-center"
              >
                <input
                  type="text"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  onKeyDown={handleInputKeyDown}
                  placeholder="Type latin name..."
                  className="input-botanical text-center text-2xl py-4"
                  autoFocus
                  disabled={isSubmitting}
                  autoComplete="off"
                  autoCapitalize="off"
                  spellCheck="false"
                />
                <p className="mt-6 text-sm text-muted-foreground/60 font-mono animate-pulse">
                  Press Enter to submit
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="roast"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full flex flex-col items-center"
              >
                <RoastDisplay
                  roast={currentRoast}
                  isCorrect={lastResult}
                  correctAnswer={currentPlant.botanicalName}
                  show={showRoast}
                />
                
                <motion.button 
                  className="mt-8 px-6 py-2 rounded-full bg-background/50 border border-border/50 
                           text-sm text-muted-foreground font-mono hover:bg-muted/50 
                           transition-all hover:scale-105 active:scale-95 cursor-pointer backdrop-blur-sm"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  onClick={handleNext}
                >
                  Press Enter ↵
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <motion.p 
          className="text-[10px] text-muted-foreground/30 font-mono tracking-[0.2em] fixed bottom-4 select-none pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          BOTANICAL EXAMINER v1.0
        </motion.p>
      </div>
    </div>
  );
};

export default BotanicalQuiz;