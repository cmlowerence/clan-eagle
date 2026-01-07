export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
      <div className="relative w-16 h-16">
        <div className="absolute top-0 left-0 w-full h-full border-4 border-skin-primary/30 rounded-full"></div>
        <div className="absolute top-0 left-0 w-full h-full border-4 border-t-skin-secondary rounded-full animate-spin"></div>
      </div>
      <p className="text-skin-muted animate-pulse font-mono">Summoning Troops...</p>
    </div>
  );
}
