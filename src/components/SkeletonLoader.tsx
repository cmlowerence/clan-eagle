export default function SkeletonLoader() {
  return (
    <div className="w-full h-full animate-pulse space-y-4">
      {/* Header Skeleton */}
      <div className="bg-skin-surface/50 h-32 rounded-xl w-full relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]"></div>
      </div>
      
      {/* Content Grid Skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
         {[...Array(8)].map((_, i) => (
           <div key={i} className="bg-skin-surface/50 h-24 rounded-lg relative overflow-hidden">
             <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]"></div>
           </div>
         ))}
      </div>
    </div>
  );
}
