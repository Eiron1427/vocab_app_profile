import Link from "next/link";
import { Settings } from "lucide-react";
import { Poppins } from "next/font/google";
import BottomNav from "./BottomNav";

const poppins = Poppins({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

// The image comes from public/bg-park.jpg.
// If the file isn't there yet, the sky-and-grass gradient underneath shows instead.
const SCENE_BACKGROUND =
  "url('/bg-park.jpg') center / cover no-repeat," +
  "radial-gradient(circle at 30% 8%, #ffe27a 0 40px, transparent 41px)," +
  "linear-gradient(to bottom, #8fd0f2 0%, #bfe6f7 45%, #a5d97a 62%, #6fbf4a 100%)";

type PhoneShellProps = {
  children: React.ReactNode;
  /** Hides the Settings button and the bottom nav (used by the lesson screen). */
  bare?: boolean;
};

export default function PhoneShell({ children, bare = false }: PhoneShellProps) {
  return (
    <main
      className={`${poppins.className} flex min-h-screen items-center justify-center bg-neutral-200 p-4 text-black`}
    >
      <div
        className="relative flex min-h-[620px] w-[400px] max-w-full flex-col justify-between gap-4 overflow-hidden rounded-[28px] p-[22px] shadow-xl"
        style={{ background: SCENE_BACKGROUND }}
      >
        {!bare && (
          <Link
            href="/settings"
            aria-label="Settings"
            className="absolute right-[22px] top-[22px] z-10 flex h-11 w-11 items-center justify-center rounded-xl bg-white text-black transition-colors hover:bg-neutral-200 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
          >
            <Settings className="h-6 w-6" strokeWidth={2.2} aria-hidden="true" />
          </Link>
        )}

        {children}
        {!bare && <BottomNav />}
      </div>
    </main>
  );
}