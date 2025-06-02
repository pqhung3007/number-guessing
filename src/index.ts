#!/usr/bin/env node

import * as readlineSync from "readline-sync";

console.log("🎉 Welcome to the Number Guessing Game!");
console.log("I'm thinking of a number between 1 and 100...");
console.log("Choose your difficulty level to begin:\n");

const difficulties = {
  1: { label: "Easy", chances: 10 },
  2: { label: "Medium", chances: 5 },
  3: { label: "Hard", chances: 3 },
};

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

while (attempts < difficulty.chances) {
  const guess = readlineSync.questionInt(
    `Attempt ${attempts + 1}/${difficulty.chances}: Enter your guess: `,
  );

  if (guess < targetNumber) {
    console.log(`📉 Too low! The number is greater than ${guess}.`);
  } else if (guess > targetNumber) {
    console.log(`📈 Too high! The number is less than ${guess}.`);
  } else {
    console.log(
      `🎉 Congratulations! You guessed the correct number in ${attempts} attempts!`,
    );
    won = true;
    break;
  }

  attempts++;
}

if (!won) {
  console.log(`💥 You've run out of chances! The number was ${targetNumber}.`);
}
