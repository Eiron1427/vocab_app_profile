"use client";

import PhoneShell from "./PhoneShell";

type LessonReportProps = {
  /** How many the learner got right / completed. */
  score: number;
  /** Total number of items in the lesson. */
  total: number;
  /** Called when the CONTINUE button is pressed. */
  onContinue: () => void;
};

export default function LessonReport({ score, total, onContinue }: LessonReportProps) {
  return (
    <PhoneShell bare>
      <section className="flex flex-1 flex-col rounded-[26px] bg-white/80 px-6 pb-8 pt-6 backdrop-blur-sm">
        <div className="text-center">
          <div className="text-[84px] leading-none" role="img" aria-label="Celebration">
            🎉
          </div>
          <h1 className="mt-3 text-[22px] font-bold leading-tight">Congratulations!!!!</h1>
        </div>

        <div className="mt-8 flex items-center justify-between px-3 text-[16px] font-bold">
          <span>Progress</span>
          <span>
            {score}/{total}
          </span>
        </div>

        <div className="mt-auto text-center">
          <p className="text-[16px] font-bold leading-tight">You did great, Keep it Up!!</p>
          <button
            type="button"
            onClick={onContinue}
            className="mt-4 rounded-full bg-[#5b0ee0] px-8 py-2 text-[20px] font-extrabold tracking-wide text-white transition-transform hover:bg-[#4d0bc4] active:scale-95"
          >
            CONTINUE
          </button>
        </div>
      </section>
    </PhoneShell>
  );
}