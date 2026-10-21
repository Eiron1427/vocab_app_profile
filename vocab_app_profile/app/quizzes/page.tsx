"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import PhoneShell from "../components/PhoneShell";
import { Check, Gamepad2, Lock } from "lucide-react";

// Quiz progress is saved in the browser, like the lesson progress.
// Shape: { "1": 8 }  →  lesson 1's quiz has 8 of 10 quizzes done.
// The future quiz page should save its results under this same key.
const QUIZ_STORAGE_KEY = "vocab_quiz_progress_v1";
const MAX_QUIZ = 10;
const LESSON_IDS = Array.from({ length: 10 }, (_, i) => i + 1);

type QuizProgress = Record<string, number>;

function loadQuizProgress(): QuizProgress {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(QUIZ_STORAGE_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : {};
    return parsed && typeof parsed === "object" ? (parsed as QuizProgress) : {};
  } catch {
    return {};
  }
}

export default function QuizzesPage() {
  const [progress, setProgress] = useState<QuizProgress>({});

  // Read the saved progress once the page is in the browser.
  useEffect(() => {
    setProgress(loadQuizProgress());
  }, []);

  return (
    <PhoneShell>
      <section className="rounded-[26px] bg-white/90 px-4 pb-5 pt-12 backdrop-blur-sm">
        <h1 className="text-center text-[30px] font-bold leading-none text-black">Select Quizzes</h1>
        <p className="mx-auto mt-2 max-w-[300px] text-center text-[13px] font-semibold leading-tight text-black">
          Please complete previous lesson&apos;s Quizzes to unlock next Lesson&apos;s Quiz
        </p>

        <ul className="mt-3 space-y-2.5">
          {LESSON_IDS.map((id) => {
            const done = progress[String(id)] ?? 0;
            const completed = done >= MAX_QUIZ;
            // Lesson 1's quizzes are always open; the others open when the previous lesson's quizzes are done.
            const unlocked = id === 1 || (progress[String(id - 1)] ?? 0) >= MAX_QUIZ;

            const rowClass =
              "flex items-center justify-between rounded-xl border border-black px-3 py-1.5 text-[15px] font-bold";

            const content = (
              <>
                <span className="flex items-center gap-2">
                  <Gamepad2 className="h-7 w-7" strokeWidth={2} aria-hidden="true" />
                  Lesson {id}
                </span>
                {!unlocked && <Lock className="h-6 w-6 text-black" strokeWidth={2} aria-label="Locked" />}
                <span className="flex items-center gap-1">
                  {completed && <Check className="h-5 w-5 text-green-800" strokeWidth={3} aria-label="Completed" />}
                  Quizzes {unlocked ? done : 0}/{MAX_QUIZ}
                </span>
              </>
            );

            return (
              <li key={id}>
                {unlocked ? (
                  <Link
                    href={`/quizzes/${id}`}
                    className={`${rowClass} ${
                      completed
                        ? "bg-[#c8f0c4] hover:bg-[#b6e8b1]"
                        : "bg-[#fde0b0] hover:bg-[#fbd59a]"
                    } text-black transition-colors active:scale-[0.98]`}
                  >
                    {content}
                  </Link>
                ) : (
                  <div aria-disabled="true" className={`${rowClass} bg-neutral-400/60 text-neutral-500`}>
                    {content}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </section>
    </PhoneShell>
  );
}