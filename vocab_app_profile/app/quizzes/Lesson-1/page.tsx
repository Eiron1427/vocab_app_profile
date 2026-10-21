
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle, RotateCcw } from "lucide-react";
import PhoneShell from "../../components/PhoneShell";
import { saveLessonResult } from "../../lib/progress";

const questions = [
  {
    question: "What does HTML stand for?",
    options: [
      "Hyper Text Markup Language",
      "High Tech Modern Language",
      "Home Tool Markup Language",
      "Hyper Transfer Machine Language",
    ],
    answer: 0,
  },
  {
    question: "Which language is used to style web pages?",
    options: ["HTML", "CSS", "SQL", "Python"],
    answer: 1,
  },
  {
    question: "Which tag creates a paragraph in HTML?",
    options: ["<h1>", "<div>", "<p>", "<img>"],
    answer: 2,
  },
  {
    question: "Which tag creates a hyperlink?",
    options: ["<a>", "<p>", "<linktext>", "<href>"],
    answer: 0,
  },
  {
    question: "Which symbol starts a CSS class selector?",
    options: ["#", ".", "@", "&"],
    answer: 1,
  },
  {
    question: "Which HTML tag displays an image?",
    options: ["<picturetext>", "<src>", "<image>", "<img>"],
    answer: 3,
  },
  {
    question: "Which property changes text color in CSS?",
    options: ["font-style", "background", "color", "text-size"],
    answer: 2,
  },
  {
    question: "Which HTML tag creates the largest default heading?",
    options: ["<h6>", "<head>", "<h1>", "<heading>"],
    answer: 2,
  },
  {
    question: "Which attribute provides an image's file path?",
    options: ["href", "src", "alt", "class"],
    answer: 1,
  },
  {
    question: "Which language adds interactivity to web pages?",
    options: ["JavaScript", "SQL", "XML", "CSS"],
    answer: 0,
  },
];

export default function Lesson1QuizPage() {
  const router = useRouter();

  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [finalScore, setFinalScore] = useState<number | null>(null);
  const [message, setMessage] = useState("");

  const submitted = finalScore !== null;
  const completed = finalScore === questions.length;

  function selectAnswer(questionIndex: number, optionIndex: number) {
    if (submitted) return;

    setAnswers((current) => ({
      ...current,
      [questionIndex]: optionIndex,
    }));
  }

  function submitQuiz() {
    if (Object.keys(answers).length !== questions.length) {
      setMessage("Please answer all 10 questions first.");
      return;
    }

    const score = questions.reduce(
      (total, question, index) =>
        total + (answers[index] === question.answer ? 1 : 0),
      0
    );

    saveLessonResult(1, score, questions.length);
    setFinalScore(score);
    setMessage("");
  }

  function retryQuiz() {
    setAnswers({});
    setFinalScore(null);
    setMessage("");
  }

  return (
    <PhoneShell>
      <section className="flex min-h-0 flex-1 flex-col gap-3 pt-12">
        <header className="shrink-0 rounded-2xl bg-white/95 p-3 shadow-md">
          <div className="flex items-center justify-between">
            <Link
              href="/lessons"
              className="flex items-center gap-1 text-sm font-semibold"
            >
              <ArrowLeft className="h-4 w-4" />
              Lessons
            </Link>
            <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-bold">
              Lesson 1
            </span>
          </div>

          <h1 className="mt-3 text-xl font-bold">Web Basics Quiz</h1>
          <p className="text-sm text-neutral-600">
            Answer all 10 questions. You need 10/10 to complete this lesson.
          </p>
        </header>

        {!submitted ? (
          <div className="min-h-0 flex-1 space-y-3 overflow-y-auto pb-2">
            {questions.map((question, questionIndex) => (
              <article
                key={question.question}
                className="rounded-2xl bg-white/95 p-3 shadow-md"
              >
                <h2 className="text-sm font-bold">
                  {questionIndex + 1}. {question.question}
                </h2>

                <div className="mt-3 space-y-2">
                  {question.options.map((option, optionIndex) => {
                    const selected =
                      answers[questionIndex] === optionIndex;

                    return (
                      <button
                        key={option}
                        type="button"
                        onClick={() =>
                          selectAnswer(questionIndex, optionIndex)
                        }
                        className={`w-full rounded-xl border p-3 text-left text-sm transition ${
                          selected
                            ? "border-black bg-black text-white"
                            : "border-neutral-200 bg-white hover:bg-neutral-100"
                        }`}
                      >
                        {String.fromCharCode(65 + optionIndex)}. {option}
                      </button>
                    );
                  })}
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto rounded-2xl bg-white/95 p-5 shadow-md">
            <div className="text-center">
              {completed ? (
                <CheckCircle className="mx-auto h-14 w-14 text-green-600" />
              ) : (
                <div className="text-5xl font-bold">{finalScore}/10</div>
              )}

              <h2 className="mt-3 text-2xl font-bold">
                Your Score: {finalScore}/10
              </h2>

              {completed ? (
                <>
                  <p className="mt-2 font-bold text-green-700">
                    Completed!
                  </p>
                  <p className="mt-2 text-sm text-neutral-600">
                    Great job! Lesson 2 is now unlocked.
                  </p>
                </>
              ) : (
                <p className="mt-2 text-sm font-semibold text-orange-700">
                  Not completed yet. You need a perfect score of 10/10 to
                  unlock Lesson 2.
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={retryQuiz}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-neutral-300 p-3 font-bold hover:bg-neutral-100"
            >
              <RotateCcw className="h-4 w-4" />
              Try Again
            </button>

            {completed && (
              <button
                type="button"
                onClick={() => router.push("/quizzes/lesson-2")}
                className="mt-3 w-full rounded-xl bg-black p-3 font-bold text-white hover:bg-neutral-700"
              >
                Go to Lesson 2
              </button>
            )}
          </div>
        )}

        {!submitted && (
          <div className="shrink-0 rounded-2xl bg-white/95 p-3 shadow-md">
            <div className="mb-2 flex items-center justify-between text-xs font-semibold">
              <span>Progress</span>
              <span>{Object.keys(answers).length}/10 answered</span>
            </div>

            <div className="h-2 overflow-hidden rounded-full bg-neutral-200">
              <div
                className="h-full rounded-full bg-black transition-all"
                style={{
                  width: `${(Object.keys(answers).length / 10) * 100}%`,
                }}
              />
            </div>

            {message && (
              <p className="mt-2 text-sm font-semibold text-red-600">
                {message}
              </p>
            )}

            <button
              type="button"
              onClick={submitQuiz}
              className="mt-3 w-full rounded-xl bg-black p-3 font-bold text-white hover:bg-neutral-700"
            >
              Submit Quiz
            </button>
          </div>
        )}
      </section>
    </PhoneShell>
  );
}