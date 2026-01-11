import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function SearchHeader() {
  return (
    <div className="relative text-center space-y-2">
      <Link href="/" className="absolute left-0 top-1/2 -translate-y-1/2 p-2 bg-white/5 hover:bg-white/10 text-skin-muted hover:text-white rounded-xl transition-colors group">
          <ArrowLeft size={24} className="group-hover:-translate-x-1 transition-transform"/>
      </Link>
      <h1 className="text-3xl md:text-5xl font-clash text-white uppercase tracking-wide">Find a Clan</h1>
      <p className="text-skin-muted text-sm">Search by name (min 3 chars)</p>
    </div>
  );
}
