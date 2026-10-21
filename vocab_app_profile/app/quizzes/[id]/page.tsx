"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import PhoneShell from "../../components/PhoneShell";
import LessonReport from "../../components/LessonReport";
import { ArrowLeft } from "lucide-react";

type Question = {
  /** Wrap a word in ** ** to highlight it, e.g. "What is the other word for **happy**?" */
  prompt: string;
  options: string[];
  /** Index (0-3) of the correct option. */
  answer: number;
};

// Quiz questions per lesson.
// Lesson 1 = Fruit, Lesson 2 = Feelings. Add more lessons here ("3": [...], and so on).
const QUIZZES: Record<string, Question[]> = {
  "1": [
    { prompt: "Which fruit is long and yellow?", options: ["Apple", "Banana", "Grapes", "Lemon"], answer: 1 },
    { prompt: "Which fruit is red and grows on trees?", options: ["Banana", "Lemon", "Apple", "Pear"], answer: 2 },
    { prompt: "Which fruit tastes sour?", options: ["Lemon", "Orange", "Mango", "Watermelon"], answer: 0 },
    { prompt: "Which fruit grows in bunches?", options: ["Mango", "Pear", "Lemon", "Grapes"], answer: 3 },
    { prompt: "Which fruit is green outside and red inside?", options: ["Pineapple", "Watermelon", "Mango", "Orange"], answer: 1 },
    { prompt: "Which fruit has spiky skin?", options: ["Pineapple", "Strawberry", "Pear", "Orange"], answer: 0 },
    { prompt: "Which fruit has tiny seeds on the outside?", options: ["Mango", "Grapes", "Strawberry", "Lemon"], answer: 2 },
    { prompt: "Which sweet tropical fruit has a big seed?", options: ["Orange", "Banana", "Pear", "Mango"], answer: 3 },
    { prompt: "Which fruit has orange skin and is juicy?", options: ["Pear", "Orange", "Apple", "Lemon"], answer: 1 },
    { prompt: "Which fruit is wide at the bottom and narrow at the top?", options: ["Apple", "Lemon", "Pear", "Grapes"], answer: 2 },
  ],
  "2": [
    { prompt: "What is the other word for happy?", options: ["Sad", "Angry", "Joyful", "Tired"], answer: 2 },
    { prompt: "What is the opposite of happy?", options: ["Sad", "Joyful", "Glad", "Cheerful"], answer: 0 },
    { prompt: "How do you feel when you are very sleepy?", options: ["Tired", "Excited", "Brave", "Proud"], answer: 0 },
    { prompt: "Which word means very angry?", options: ["Calm", "Furious", "Sleepy", "Shy"], answer: 1 },
    { prompt: "What is the other word for scared?", options: ["Afraid", "Proud", "Happy", "Silly"], answer: 0 },
    { prompt: "How do you feel when you win a game?", options: ["Sad", "Bored", "Proud", "Lonely"], answer: 2 },
    { prompt: "What is the opposite of calm?", options: ["Peaceful", "Relaxed", "Worried", "Quiet"], answer: 2 },
    { prompt: "What is the other word for glad?", options: ["Upset", "Pleased", "Angry", "Afraid"], answer: 1 },
    { prompt: "How do you feel when you have nothing to do?", options: ["Bored", "Excited", "Surprised", "Thankful"], answer: 0 },
    { prompt: "Which word describes someone who feels nervous around new people?", options: ["Brave", "Loud", "Shy", "Proud"], answer: 2 },
  ],
};

const LETTERS = ["A", "B", "C", "D"];

// Number of questions answered per lesson. The quiz list (app/quizzes/page.tsx) reads this key.
const QUIZ_STORAGE_KEY = "vocab_quiz_progress_v1";
const MAX_QUIZ = 10;

// Where the learner stopped, so they can leave and come back later.
// Shape: { "2": { answered: 4, score: 3 } }
const SESSION_KEY = "vocab_quiz_session_v1";

type Session = { answered: number; score: number };

function readStore<T>(key: string): Record<string, T> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(key);
    const parsed: unknown = raw ? JSON.parse(raw) : {};
    return parsed && typeof parsed === "object" ? (parsed as Record<string, T>) : {};
  } catch {
    return {};
  }
}

function writeStore(key: string, value: unknown) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage can be blocked (private mode); progress just won't be saved.
  }
}

function saveQuizProgress(lessonId: string, answered: number) {
  const progress = readStore<number>(QUIZ_STORAGE_KEY);
  const next = Math.min(MAX_QUIZ, Math.max(progress[lessonId] ?? 0, answered));
  writeStore(QUIZ_STORAGE_KEY, { ...progress, [lessonId]: next });
}

function saveSession(lessonId: string, session: Session) {
  writeStore(SESSION_KEY, { ...readStore<Session>(SESSION_KEY), [lessonId]: session });
}

function clearSession(lessonId: string) {
  const sessions = readStore<Session>(SESSION_KEY);
  delete sessions[lessonId];
  writeStore(SESSION_KEY, sessions);
}

function Prompt({ text }: { text: string }) {
  return (
    <>
      {text.split("**").map((part, i) =>
        i % 2 === 1 ? (
          <span key={i} className="text-[#3b0ca8]">
            {part}
          </span>
        ) : (
          part
        ),
      )}
    </>
  );
}

export default function QuizPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [ready, setReady] = useState(false);

  const questions = QUIZZES[id];
  const total = questions ? questions.length : 0;

  // Come back where you left off.
  useEffect(() => {
    const saved = readStore<Session>(SESSION_KEY)[id];
    if (saved && total > 0 && saved.answered > 0) {
      setScore(saved.score);
      if (saved.answered >= total) {
        // Left right after the last answer: show the result, then start fresh next time.
        setFinished(true);
        clearSession(id);
      } else {
        setIndex(saved.answered);
      }
    }
    setReady(true);
  }, [id, total]);

  if (!questions) {
    return (
      <PhoneShell bare>
        <section className="flex flex-1 flex-col items-center justify-center gap-4 rounded-[26px] bg-white/80 p-6 text-center backdrop-blur-sm">
          <h1 className="text-2xl font-bold">Quiz not available yet</h1>
          <Link href="/quizzes" className="rounded-xl bg-black px-4 py-2 text-sm font-semibold text-white">
            Back to quizzes
          </Link>
        </section>
      </PhoneShell>
    );
  }

  if (!ready) {
    return (
      <PhoneShell bare>
        <section className="flex flex-1 items-center justify-center rounded-[26px] bg-white/80 text-sm font-semibold backdrop-blur-sm">
        </section>
      </PhoneShell>
    );
  }

  // ---------- Result screen (after the last question) ----------
  if (finished) {
    return <LessonReport score={score} total={total} onContinue={() => router.push("/quizzes")} />;
  }

  // ---------- Question screen ----------
  const q = questions[index];
  const isLast = index === total - 1;

  function handleSelect(i: number) {
    if (!submitted) setSelected(i);
  }

  function handleSubmit() {
    if (selected === null || submitted) return;
    const newScore = selected === q.answer ? score + 1 : score;
    setSubmitted(true);
    setScore(newScore);
    // Save right away, so leaving now (back arrow, browser back, reload) keeps this answer.
    saveQuizProgress(id, index + 1);
    saveSession(id, { answered: index + 1, score: newScore });
  }

  function handleNext() {
    if (isLast) {
      clearSession(id);
      setFinished(true);
    } else {
      setIndex(index + 1);
      setSelected(null);
      setSubmitted(false);
    }
  }

  function optionClass(i: number) {
    if (!submitted) {
      return selected === i
        ? "border-blue-600 bg-[#8d8df7]"
        : "border-black/80 bg-[#ffdcb0] hover:bg-[#fed0a0]";
    }
    if (i === q.answer) return "border-green-700 bg-[#b8efb4]";
    if (i === selected) return "border-red-700 bg-[#f7b4b4]";
    return "border-black/80 bg-[#ffdcb0] opacity-60";
  }

  return (
    <PhoneShell bare>
      <section className="relative flex flex-1 flex-col rounded-[26px] bg-white/85 px-5 pb-6 pt-5 backdrop-blur-sm">
        <Link
          href="/quizzes"
          aria-label="Back to quizzes"
          className="absolute left-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-neutral-200 text-black transition-transform hover:bg-neutral-300 active:scale-95"
        >
          <ArrowLeft className="h-5 w-5" strokeWidth={2.4} aria-hidden="true" />
        </Link>

        <div className="text-center">
          <div className="text-[64px] leading-none" role="img" aria-label="Idea">
          </div>
          <p className="mt-1 text-[12px] font-semibold text-neutral-600">
            Question {index + 1} of {total}
          </p>
          <h1 className="mt-1 text-[22px] font-bold leading-tight text-black">
            <Prompt text={q.prompt} />
          </h1>
        </div>

        <div className="mt-5 space-y-3">
          {q.options.map((option, i) => (
            <button
              key={option}
              type="button"
              onClick={() => handleSelect(i)}
              disabled={submitted}
              aria-pressed={selected === i}
              className={`flex w-full items-center rounded-lg border p-1 text-left transition-colors active:scale-[0.99] ${optionClass(i)}`}
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#1d1df0] text-[20px] font-bold text-white">
                {LETTERS[i]}
              </span>
              <span className="flex-1 pr-10 text-center text-[20px] font-bold text-black">{option}</span>
            </button>
          ))}
        </div>

        <p aria-live="polite" className="mt-3 min-h-5 text-center text-[14px] font-semibold">
          {submitted && (selected === q.answer ? "Correct!" : `Not quite. The answer is ${q.options[q.answer]}.`)}
        </p>

        <div className="mt-auto pt-4 text-center">
          {submitted ? (
            <button
              type="button"
              onClick={handleNext}
              className="rounded-full bg-[#5b0ee0] px-10 py-2 text-[20px] font-extrabold tracking-wide text-white transition-transform hover:bg-[#4d0bc4] active:scale-95"
            >
              {isLast ? "FINISH" : "NEXT"}
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={selected === null}
              className="rounded-full bg-[#5b0ee0] px-10 py-2 text-[20px] font-extrabold tracking-wide text-white transition-transform hover:bg-[#4d0bc4] active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
            >
              SUBMIT
            </button>
          )}
        </div>
      </section>
    </PhoneShell>
  );
}
