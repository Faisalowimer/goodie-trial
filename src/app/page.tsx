import { ModeToggle } from "@/components/ui/theme/mode-toggle";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <ModeToggle />
      <h1>Hello goodie</h1>
    </div>
  );
}
