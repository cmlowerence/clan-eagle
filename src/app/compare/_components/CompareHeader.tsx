import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function CompareHeader() {
  return (
    <div className="flex items-center gap-2 mb-4">
      <Link href="/" className="text-skin-muted hover:text-skin-primary flex items-center gap-1 text-sm font-bold">
        <ArrowLeft size={16} /> Back
      </Link>
      <h1 className="text-2xl font-clash text-skin-text uppercase ml-auto">Compare Players</h1>
    </div>
  );
}
