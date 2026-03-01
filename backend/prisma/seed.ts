// Seeds the word_bank table with common English words for typing tests
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const words = [
  "the", "be", "to", "of", "and", "a", "in", "that", "have", "it",
  "for", "not", "on", "with", "he", "as", "you", "do", "at", "this",
  "but", "his", "by", "from", "they", "we", "say", "her", "she", "or",
  "an", "will", "my", "one", "all", "would", "there", "their", "what", "so",
  "up", "out", "if", "about", "who", "get", "which", "go", "me", "when",
  "make", "can", "like", "time", "no", "just", "him", "know", "take", "people",
  "into", "year", "your", "good", "some", "could", "them", "see", "other", "than",
  "then", "now", "look", "only", "come", "its", "over", "think", "also", "back",
  "after", "use", "two", "how", "our", "work", "first", "well", "way", "even",
  "new", "want", "because", "any", "these", "give", "day", "most", "us", "great",
  "world", "place", "water", "light", "strong", "quick", "jump", "play", "read", "write",
  "house", "learn", "plant", "earth", "found", "still", "stand", "own", "page", "should",
  "home", "big", "high", "every", "near", "add", "food", "between", "state", "keep",
  "never", "start", "city", "run", "while", "press", "close", "night", "real", "life",
  "few", "north", "open", "seem", "next", "walk", "ease", "both", "mark", "often",
  "until", "mile", "river", "car", "feet", "care", "second", "book", "carry", "took",
  "rain", "eat", "room", "friend", "began", "idea", "fish", "stop", "once", "base",
  "hear", "horse", "cut", "sure", "watch", "color", "face", "wood", "main", "enough",
  "plain", "girl", "usual", "young", "ready", "above", "ever", "red", "list", "though",
  "feel", "talk", "bird", "soon", "body", "dog", "music", "those", "told", "very",
  "hand", "left", "long", "best", "much", "name", "live", "move", "right", "kind",
  "old", "help", "line", "turn", "last", "need", "hard", "set", "mean", "end",
  "did", "try", "ask", "men", "went", "form", "small", "part", "made", "off",
  "point", "love", "head", "show", "story", "call", "build", "class", "clear", "deep",
  "dark", "free", "full", "game", "grow", "half", "late", "more", "song", "true",
];

async function main() {
  const result = await prisma.word.createMany({
    data: words.map((w) => ({ word: w })),
    skipDuplicates: true,
  });
  console.log(`Seeded ${result.count} words into word_bank`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
