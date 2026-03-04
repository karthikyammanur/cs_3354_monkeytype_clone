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

const sentences = [
  "The quick brown fox jumps over the lazy dog.",
  "She sells seashells by the seashore every morning.",
  "A journey of a thousand miles begins with a single step.",
  "Practice makes perfect, but nobody is perfect.",
  "The early bird catches the worm, but the second mouse gets the cheese.",
  "Every great achievement was once considered impossible.",
  "Time flies when you are having fun with friends.",
  "Actions speak louder than words in every situation.",
  "Knowledge is power, and power brings responsibility.",
  "The best time to plant a tree was twenty years ago.",
  "You miss every shot that you do not take.",
  "Hard work beats talent when talent does not work hard.",
  "The only way to do great work is to love what you do.",
  "Success is not final, and failure is not fatal.",
  "Life is what happens when you are busy making other plans.",
  "In the middle of difficulty lies great opportunity.",
  "The pen is mightier than the sword in many cases.",
  "Those who dare to fail greatly can achieve greatly.",
  "A picture is worth a thousand words, they say.",
  "Where there is a will, there is always a way forward.",
  "The world is a book, and those who do not travel read only one page.",
  "Creativity is intelligence having fun with new ideas.",
  "Do not judge each day by the harvest you reap, but by the seeds you plant.",
  "It does not matter how slowly you go, as long as you do not stop.",
  "The future belongs to those who believe in the beauty of their dreams.",
  "Happiness is not something ready made, it comes from your own actions.",
  "The only impossible journey is the one you never begin.",
  "What you get by achieving your goals is not as important as what you become.",
  "Tell me and I forget, teach me and I remember, involve me and I learn.",
  "If you want to go fast, go alone. If you want to go far, go together.",
  "The greatest glory in living lies not in never falling, but in rising every time we fall.",
  "Believe you can and you are halfway there already.",
  "Keep your face always toward the sunshine, and shadows will fall behind you.",
  "It is during our darkest moments that we must focus to see the light.",
  "Whoever is happy will make others happy too, that is certain.",
  "Life is really simple, but we insist on making it complicated.",
  "The purpose of our lives is to be happy and to help others.",
  "You only live once, but if you do it right, once is enough.",
  "Many of life's failures are people who did not realize how close they were to success.",
  "If you look at what you have in life, you will always have more to give.",
  "The mind is everything. What you think, you become over time.",
  "An unexamined life is not worth living, according to the wise.",
  "Turn your wounds into wisdom, and your struggles into strength.",
  "The best revenge is massive success in everything you pursue.",
  "Strive not to be a success, but rather to be of value to others.",
  "I have not failed. I have just found ten thousand ways that do not work.",
  "A person who never made a mistake never tried anything new.",
  "The only limit to our realization of tomorrow is our doubts of today.",
  "Everything you have ever wanted is on the other side of fear.",
  "It always seems impossible until it is done and finished.",
  "What lies behind us and what lies before us are tiny matters compared to what lies within us.",
  "The secret of getting ahead is simply getting started on the work.",
  "Education is the most powerful weapon you can use to change the world.",
  "Not everything that is faced can be changed, but nothing can be changed until it is faced.",
  "Life is either a daring adventure or nothing at all.",
  "The way to get started is to quit talking and begin doing.",
  "Your time is limited, so do not waste it living someone else's life.",
  "If you set your goals ridiculously high and it is a failure, you will fail above everyone else.",
  "You must be the change you wish to see in the world around you.",
  "Spread love everywhere you go. Let no one ever come to you without leaving happier.",
  "Always remember that you are absolutely unique, just like everyone else.",
  "The best and most beautiful things in the world cannot be seen or even touched.",
  "Do what you can, with what you have, where you are right now.",
  "Nothing is impossible. The word itself says I am possible.",
  "The only person you are destined to become is the person you decide to be.",
  "Go confidently in the direction of your dreams and live the life you imagined.",
  "When you reach the end of your rope, tie a knot in it and hang on.",
  "The best preparation for tomorrow is doing your best work today.",
  "We may encounter many defeats, but we must not be defeated by them.",
  "I think, therefore I am, and I choose to keep moving forward.",
];

async function main() {
  const wordResult = await prisma.word.createMany({
    data: words.map((w) => ({ word: w })),
    skipDuplicates: true,
  });
  console.log(`Seeded ${wordResult.count} words into word_bank`);

  const sentenceResult = await prisma.sentence.createMany({
    data: sentences.map((s) => ({ text: s })),
    skipDuplicates: true,
  });
  console.log(`Seeded ${sentenceResult.count} sentences into sentences`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
