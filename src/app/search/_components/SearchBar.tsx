import { Search, Loader2 } from "lucide-react";

interface SearchBarProps {
  term: string;
  setTerm: (term: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  loading: boolean;
  hasResults: boolean;
}

export default function SearchBar({ term, setTerm, onSubmit, loading, hasResults }: SearchBarProps) {
  return (
    <form onSubmit={onSubmit} className="relative group max-w-lg mx-auto z-10">
        <div className="absolute -inset-1 bg-gradient-to-r from-skin-primary to-skin-secondary rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
        <div className="relative flex bg-[#1f2937] rounded-xl overflow-hidden border border-white/10 p-1">
          <input 
            type="text" 
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            placeholder="e.g. The Unbeatables" 
            className="w-full bg-transparent px-4 py-3 focus:outline-none text-white font-bold placeholder:text-skin-muted/50" 
          />
          <button 
            type="submit" 
            disabled={loading && !hasResults} 
            className="bg-skin-primary text-black px-6 rounded-lg font-clash hover:bg-skin-secondary transition-colors flex items-center gap-2 disabled:opacity-50"
          >
             {loading && !hasResults ? <Loader2 size={20} className="animate-spin"/> : <Search size={20}/>}
          </button>
        </div>
    </form>
  );
}
