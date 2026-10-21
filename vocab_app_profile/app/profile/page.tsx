import PhoneShell from "../components/PhoneShell";
import {
  BookOpen,
  ListChecks,
  Star,
  BarChart3,
  Target,
  Trophy,
  User,
  Check,
} from "lucide-react";

function Bar({ pct }: { pct: number }) {
  return (
    <div className="h-[18px] w-full rounded-full bg-[#ffb98a]/80">
      <div className="h-full rounded-full bg-[#ffa500]" style={{ width: `${pct}%` }} />
    </div>
  );
}

const stats = [
  { icon: BookOpen, value: "25", label: "Lessons\nCompleted" },
  { icon: ListChecks, value: "85%", label: "Average\nScore" },
  { icon: Star, value: "45", label: "Quiz\nTaken" },
  { icon: BarChart3, value: "Lv. 4", label: "Progress\nLevel" },
];

const progress = [
  { icon: BookOpen, label: "Vocabulary Lesson", pct: 80, right: "20/25" },
  { icon: ListChecks, label: "Quizzes Completed", pct: 60, right: "42/60" },
  { icon: Target, label: "Average Score", pct: 85, right: "85%" },
  { icon: Trophy, label: "Current Streak", pct: 47, right: "7 Days" },
];

export default function ProfilePage() {
  return (
    <PhoneShell>
      <section className="rounded-[26px] bg-white/55 p-5 pt-14 backdrop-blur-sm">
        <div className="-mt-1 flex items-center gap-3">
          <div className="flex h-[60px] w-[60px] shrink-0 items-center justify-center rounded-full border-[3px] border-black bg-white">
            <User className="h-9 w-9 fill-black" strokeWidth={0} />
          </div>
          <div className="flex-1">
            <h1 className="text-[30px] font-bold leading-none text-black">EJ Ramores</h1>
            <div className="mt-2 flex items-center gap-3">
              <div className="h-[18px] flex-1 rounded-full bg-[#f8e0d8]">
                <div className="h-full w-[45%] rounded-full bg-[#ffa500]" />
              </div>
              <span className="text-xs text-neutral-600">45%</span>
            </div>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-4 gap-2.5">
          {stats.map(({ icon: Icon, value, label }) => (
            <div key={label} className="flex flex-col items-center rounded-2xl bg-white px-1 py-2 shadow-md">
              <Icon className="h-8 w-8" strokeWidth={1.8} />
              <span className="mt-1 text-[15px] font-bold leading-tight">{value}</span>
              <span className="whitespace-pre-line text-center text-[10px] font-medium leading-tight">{label}</span>
            </div>
          ))}
        </div>

        <div className="mt-4 space-y-2.5 rounded-2xl bg-white p-3 shadow-md">
          {progress.map(({ icon: Icon, label, pct, right }) => (
            <div key={label} className="flex items-center gap-2">
              <Icon className="h-8 w-8 shrink-0" strokeWidth={1.8} />
              <div className="flex-1">
                <span className="text-[10px] leading-none">{label}</span>
                <Bar pct={pct} />
              </div>
              <span className="w-12 text-right text-xs">{right}</span>
            </div>
          ))}
        </div>

        <div className="mt-4 rounded-2xl bg-white p-3 shadow-md">
          <div className="flex items-center justify-between">
            <h2 className="text-base">Recent Activity</h2>
            <button className="text-sm font-medium">View All &gt;</button>
          </div>

          <div className="mt-2 flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-green-500">
              <Check className="h-5 w-5 text-white" strokeWidth={3} />
            </div>
            <div className="flex-1 text-xs leading-tight">
              Completed Lesson: Fruit
              <br />
              July 18, 2025 10:30 AM
            </div>
            <span className="text-sm">+100 Xp</span>
          </div>

          <div className="mt-2 flex items-center gap-3">
            <Trophy className="h-9 w-9" strokeWidth={2} />
            <div className="flex-1 text-xs leading-tight">
              Quiz: Food Vocabulary
              <br />
              July 18, 2025 11:30 AM
            </div>
            <span className="text-sm">Score: 90%</span>
          </div>
        </div>
      </section>
    </PhoneShell>
  );
}