import PhoneShell from "../components/PhoneShell";

export default function LessonPage() {
  return (
    <PhoneShell>
      <section className="flex-1 rounded-[26px] bg-white/55 p-5 backdrop-blur-sm">
        <h1 className="text-[30px] font-bold">Lessons</h1>
        <p className="mt-2 text-sm">No lessons added.</p>
      </section>
    </PhoneShell>
  );
}