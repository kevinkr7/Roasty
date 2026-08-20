export interface Plant {
  commonName: string;
  botanicalName: string;
  hint?: string;
}

export const plants: Plant[] = [
  { commonName: "Mango", botanicalName: "Mangifera indica" },
  { commonName: "Neem", botanicalName: "Azadirachta indica" },
  { commonName: "Rose", botanicalName: "Rosa" },
  { commonName: "Tulsi", botanicalName: "Ocimum tenuiflorum" },
  { commonName: "Banyan", botanicalName: "Ficus benghalensis" },
  { commonName: "Peepal", botanicalName: "Ficus religiosa" },
  { commonName: "Sunflower", botanicalName: "Helianthus annuus" },
  { commonName: "Marigold", botanicalName: "Tagetes" },
  { commonName: "Jasmine", botanicalName: "Jasminum" },
  { commonName: "Bamboo", botanicalName: "Bambusoideae" },
  { commonName: "Lotus", botanicalName: "Nelumbo nucifera" },
  { commonName: "Hibiscus", botanicalName: "Hibiscus rosa-sinensis" },
  { commonName: "Aloe Vera", botanicalName: "Aloe barbadensis miller" },
  { commonName: "Mint", botanicalName: "Mentha" },
  { commonName: "Lavender", botanicalName: "Lavandula" },
  { commonName: "Cactus", botanicalName: "Cactaceae" },
  { commonName: "Eucalyptus", botanicalName: "Eucalyptus globulus" },
  { commonName: "Basil", botanicalName: "Ocimum basilicum" },
  { commonName: "Tomato", botanicalName: "Solanum lycopersicum" },
  { commonName: "Potato", botanicalName: "Solanum tuberosum" },
];

export const correctRoasts = [
  "Ok fine. You didn't embarrass yourself this time. 🙄",
  "Bro answered like the textbook was open 💀",
  "Ok wait—YOU actually know botany?",
  "Did you... did you just guess that correctly?",
  "The plant spirits are concerned about your knowledge.",
  "Even I had to double-check that one. Suspicious.",
  "Reluctantly impressed. Don't let it go to your head.",
  "You're making this less fun for me. Stop being smart.",
  "A broken clock is right twice a day. This was your moment.",
  "I'm not saying you cheated, but I'm not NOT saying it either.",
  "The greenhouse committee will hear about this.",
  "Ok botanical nerd, we get it. You read.",
  "That was disgustingly correct. How dare you.",
  "I wanted you to fail but here we are.",
  "Your ancestors who touched grass would be proud.",
];

export const wrongRoasts = [
  "Somewhere, a plant just wilted because of that answer. 🥀",
  "That was… confidently wrong. Respect.",
  "Plant taxonomy just left the chat.",
  "I've seen better answers from a Venus flytrap.",
  "The botanical gods are disappointed but not surprised.",
  "You typed that with such confidence. Bold move.",
  "That answer had the same energy as watering a cactus daily.",
  "Even a houseplant could've spelled that better.",
  "The audacity. The absolute audacity.",
  "This is why plants don't have feelings. Imagine the trauma.",
  "Were you perhaps thinking of a completely different species? Or language?",
  "That answer was so wrong, it's almost art.",
  "I'm going to pretend I didn't see that. For both our sakes.",
  "The local botanist felt a disturbance in the force.",
  "Chlorophyll is judging you silently.",
];

export const moodyCorrectRoasts = [
  "...Fine. You got another one. Whatever.",
  "Ok this is getting suspicious. Who are you?",
  "The streak continues. I'm uncomfortable.",
  "Are you a literal botanist? This isn't fair.",
  "I'm running out of ways to insult your correct answers.",
];

export const moodyWrongRoasts = [
  "*silence* ...I expected nothing and I'm still disappointed.",
  "Again? Really? We're doing this again?",
  "I no longer have the energy to roast you properly.",
  "The plants have collectively given up on you.",
  "*sighs in Latin nomenclature*",
];

export const getRandomRoast = (isCorrect: boolean, streak: number): string => {
  if (isCorrect) {
    if (streak >= 3) {
      return moodyCorrectRoasts[Math.floor(Math.random() * moodyCorrectRoasts.length)];
    }
    return correctRoasts[Math.floor(Math.random() * correctRoasts.length)];
  } else {
    if (streak >= 3) {
      return moodyWrongRoasts[Math.floor(Math.random() * moodyWrongRoasts.length)];
    }
    return wrongRoasts[Math.floor(Math.random() * wrongRoasts.length)];
  }
};

export const normalizeAnswer = (answer: string): string => {
  return answer
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ")
    .replace(/[.,;:!?]/g, "");
};

export const checkAnswer = (userAnswer: string, correctAnswer: string): boolean => {
  return normalizeAnswer(userAnswer) === normalizeAnswer(correctAnswer);
};
