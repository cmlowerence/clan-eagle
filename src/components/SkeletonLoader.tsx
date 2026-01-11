export default function SkeletonLoader() {
  const shimmer = "absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_1s_infinite]";

  return (
    <div className="w-full space-y-6 p-4 animate-pulse">
      {/* Banner Area */}
      <div className="bg-skin-surface h-48 rounded-2xl w-full relative overflow-hidden border border-skin-primary/20">
        <div className={shimmer}></div>
      </div>
      
      {/* Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
         {[...Array(8)].map((_, i) => (
           <div key={i} className="bg-skin-surface h-20 rounded-lg relative overflow-hidden border border-skin-primary/10 flex items-center p-2 gap-3">
             <div className="w-12 h-12 bg-skin-bg rounded relative overflow-hidden shrink-0"></div>
             <div className="flex-1 space-y-2">
                <div className="h-3 bg-skin-bg rounded w-3/4"></div>
                <div className="h-2 bg-skin-bg rounded w-1/2"></div>
             </div>
             <div className={shimmer}></div>
           </div>
         ))}
      </div>
    </div>
  );
}
