#!/usr/bin/env node

import * as readlineSync from "readline-sync";

type Difficulty = {
  label: string;
  chances: number;
};

const difficulties: Record<number, Difficulty> = {
  1: { label: "Easy", chances: 10 },
  2: { label: "Medium", chances: 5 },
  3: { label: "Hard", chances: 3 },
};

// high scores by levels
const highScores: Record<string, number> = {};

function generateHint(guess: number, target: number): string {
  const hints = [];
  const distance = target - guess;

  // distance-based hint
  if (distance < 10) {
    hints.push("🔥You are very close!");
  } else {
    hints.push("💨You are quite far off.");
  }

  // range hint
  const lowerBound = Math.max(target - 5, 1);
  const upperBound = Math.min(target + 5, 100);
  hints.push(
    `📏The target is somewhere between ${lowerBound} and ${upperBound}.`,
  );

  // divisibility hint
  if (target % 3 === 0) {
    hints.push("The number is divisible by 3.");
  } else {
    hints.push("The number is not divisible by 3.");
  }

  hints.push(target % 2 === 0 ? "It's an even number" : "It's an odd number.");

  // return 1 random hint at a time
  return hints[Math.floor(Math.random() * hints.length)];
}

function playGame() {
  console.log("🎉 Welcome to the Number Guessing Game!");
  console.log("I'm thinking of a number between 1 and 100...");
  console.log("Choose your difficulty level to begin:\n");

  console.log("1. Easy (10 chances)");
  console.log("2. Medium (5 chances)");
  console.log("3. Hard (3 chances)");

  const choice = readlineSync.questionInt("Enter your choice(1/2/3): ");
  const difficulty = difficulties[choice as keyof typeof difficulties];

  if (!difficulty) {
    console.log("❌ Invalid choice. Exiting game...");
    process.exit(1);
  }

  console.log(
    `\n ✅ Great! You've selected the ${difficulty.label} difficulty level.`,
  );
  console.log("Let's start the game!\n");

  const targetNumber = Math.floor(Math.random() * 100) + 1;
  let attempts = 0;
  let won = false;

  const startTime = Date.now();

  while (attempts < difficulty.chances) {
    const guess = readlineSync.questionInt(
      `Attempt ${attempts + 1}/${difficulty.chances}: Enter your guess: `,
    );
    attempts++;

    if (guess === targetNumber) {
      const timeTaken = ((Date.now() - startTime) / 1000).toFixed(2);
      console.log(
        `🎉 Congratulations! You guessed the correct number in ${attempts} attempts! Time taken: ${timeTaken}s.`,
      );

      // update high scores
      const currentHighScores = highScores[difficulty.label] || Infinity;
      if (!currentHighScores || attempts < currentHighScores) {
        highScores[difficulty.label] = attempts;
        console.log(
          `🏆 New high score for ${difficulty.label} difficulty: ${attempts} attempt(s)!`,
        );
      }

      won = true;
      break;
    } else if (guess > targetNumber) {
      console.log(`📈 Too high! The number is less than ${guess}.`);
    } else {
      console.log(`📉 Too low! The number is greater than ${guess}.`);
    }

    // show hints every 2 incorrect guesses
    if (attempts % 2 === 0 && !won) {
      console.log(`💡 Hints: ${generateHint(guess, targetNumber)}`);
    }
  }

  if (!won) {
    console.log(
      `💥 You've run out of chances! The number was ${targetNumber}.`,
    );
  }

  const willPlayAgain = readlineSync
    .question("\n 🔁 Do you want to play again? (yes/no): ")
    .toLowerCase();

  if (willPlayAgain.trim().toLowerCase() === "yes") {
    playGame();
  } else {
    console.log("\n👋 Thanks for playing! Goodbye!");
  }
  console.log("\n🏅 High Scores:");
  for (const key in highScores) {
    console.log(`- ${key}: ${highScores[key]} attempt(s)`);
  }
}

playGame();
