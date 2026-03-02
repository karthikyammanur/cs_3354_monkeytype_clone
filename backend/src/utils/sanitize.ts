import type { User, TypingTest } from "@prisma/client";

export function sanitizeUser(user: User) {
  return {
    id: user.id,
    email: user.email,
    username: user.username,
    createdAt: user.createdAt,
  };
}

export function sanitizeTest(test: TypingTest) {
  return {
    id: test.id,
    wpm: test.wpm,
    accuracy: test.accuracy,
    duration: test.duration,
    totalChars: test.totalChars,
    correctChars: test.correctChars,
    createdAt: test.createdAt,
  };
}
