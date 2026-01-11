import { Play, Video } from "lucide-react";

interface VideoPlayerProps {
  url: string;
  isPlaying: boolean;
  onPlay: () => void;
}

export default function VideoPlayer({ url, isPlaying, onPlay }: VideoPlayerProps) {
  // Helper: Extract ID from various YouTube URL formats
  const getYoutubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const videoId = getYoutubeId(url);

  if (!videoId) return null;

  return (
    <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black border border-white/10 shadow-2xl group-hover:border-white/20 transition-all mt-4">
      {isPlaying ? (
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
          className="w-full h-full"
          allow="autoplay; encrypted-media"
          allowFullScreen
        ></iframe>
      ) : (
        <button onClick={onPlay} className="group/video w-full h-full relative flex items-center justify-center">
          <img
            src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
            className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover/video:opacity-100 transition-opacity duration-500"
            alt="Video Thumbnail"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

          <div className="relative flex flex-col items-center gap-3 transition-transform duration-300 group-hover/video:scale-105">
            {/* YouTube Style Play Button */}
            <div className="w-16 h-11 bg-[#FF0000] rounded-xl flex items-center justify-center shadow-[0_10px_20px_rgba(0,0,0,0.5)]">
              <Play size={24} className="text-white fill-white ml-0.5" />
            </div>
            <span className="text-xs font-bold text-white uppercase tracking-widest drop-shadow-md flex items-center gap-2">
              <Video size={12} /> Watch Guide
            </span>
          </div>
        </button>
      )}
    </div>
  );
}
