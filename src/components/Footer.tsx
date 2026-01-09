import { Lock } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full py-8 mt-auto border-t border-skin-primary/10 bg-[#131b24] text-center">
        <div className="container mx-auto px-4 flex flex-col items-center gap-4">
            <h3 className="font-clash text-xl text-skin-muted">CLAN <span className="text-skin-primary">EAGLE</span></h3>
            <p className="text-xs text-skin-muted max-w-sm">
                This content is not affiliated with, endorsed, sponsored, or specifically approved by Supercell and Supercell is not responsible for it.
            </p>
            
            {/* Admin Link */}
            <Link href="/admin" className="text-[10px] text-skin-muted/30 hover:text-skin-primary flex items-center gap-1 transition-colors mt-4">
                <Lock size={10} /> Admin Access
            </Link>
        </div>
    </footer>
  );
}
