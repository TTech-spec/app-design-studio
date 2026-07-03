import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowLeft, MoreVertical, Share2, Heart, MessageCircle,
  Flag, Download, ChevronLeft, ChevronRight,
} from "lucide-react";
import { FarmImage } from "@/components/mobile/ui";

type SearchParams = { seed?: string; sender?: string; total?: number; index?: number };

export const Route = createFileRoute("/image-viewer")({
  head: () => ({ meta: [{ title: "Agricon NG — Image Viewer" }] }),
  validateSearch: (s: Record<string, unknown>): SearchParams => ({
    seed: typeof s.seed === "string" ? s.seed : undefined,
    sender: typeof s.sender === "string" ? s.sender : undefined,
    total: typeof s.total === "number" ? s.total : 4,
    index: typeof s.index === "number" ? s.index : 0,
  }),
  component: ImageViewerPage,
});

function ImageViewerPage() {
  const { seed, sender, total = 4, index = 0 } = Route.useSearch();
  const navigate = useNavigate();
  const [currentIdx, setCurrentIdx] = useState(index);
  const [liked, setLiked] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const baseSeed = seed ?? "cassava-photo";
  const displaySender = sender ?? "Adekunle Kolawole";
  const totalPhotos = total;

  function goBack() {
    navigate({ to: "/chat" });
  }

  function handleShare() {
    navigator.share?.({
      title: `Photo from ${displaySender}`,
      url: window.location.href,
    });
  }

  function handleDownload() {
    // In a real app this would download the image
    setShowMenu(false);
  }

  return (
    <div className="relative flex h-screen w-full flex-col bg-black">
      {/* Top bar */}
      <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between bg-gradient-to-b from-black/70 to-transparent px-4 pt-4 pb-8">
        <button
          type="button"
          onClick={goBack}
          className="grid h-10 w-10 place-items-center rounded-full bg-white/10 backdrop-blur text-white"
          aria-label="Go back"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>

        <div className="text-center text-white">
          <p className="text-sm font-semibold">{displaySender}</p>
          <p className="text-[11px] opacity-70">
            Photo {currentIdx + 1} of {totalPhotos}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowMenu((s) => !s)}
          className="grid h-10 w-10 place-items-center rounded-full bg-white/10 backdrop-blur text-white"
          aria-label="More options"
        >
          <MoreVertical className="h-5 w-5" />
        </button>
      </div>

      {/* More options menu */}
      {showMenu && (
        <div
          className="absolute top-16 right-4 z-30 min-w-40 rounded-2xl bg-white shadow-pop overflow-hidden"
          onClick={() => setShowMenu(false)}
        >
          <button
            type="button"
            onClick={handleShare}
            className="flex w-full items-center gap-3 px-4 py-3 text-sm font-semibold text-foreground hover:bg-secondary"
          >
            <Share2 className="h-4 w-4 text-primary" /> Share photo
          </button>
          <button
            type="button"
            onClick={handleDownload}
            className="flex w-full items-center gap-3 px-4 py-3 text-sm font-semibold text-foreground hover:bg-secondary"
          >
            <Download className="h-4 w-4 text-primary" /> Save to device
          </button>
          <button
            type="button"
            className="flex w-full items-center gap-3 px-4 py-3 text-sm font-semibold text-destructive hover:bg-secondary"
          >
            <Flag className="h-4 w-4" /> Report photo
          </button>
        </div>
      )}

      {/* Main image */}
      <div className="flex flex-1 items-center justify-center px-2 relative">
        {/* Prev button */}
        {currentIdx > 0 && (
          <button
            type="button"
            onClick={() => setCurrentIdx((i) => i - 1)}
            className="absolute left-3 z-10 grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white backdrop-blur"
            aria-label="Previous photo"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
        )}

        <FarmImage
          seed={`${baseSeed}-${currentIdx}`}
          className="aspect-square w-full max-w-sm rounded-xl"
        />

        {/* Next button */}
        {currentIdx < totalPhotos - 1 && (
          <button
            type="button"
            onClick={() => setCurrentIdx((i) => i + 1)}
            className="absolute right-3 z-10 grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white backdrop-blur"
            aria-label="Next photo"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        )}
      </div>

      {/* Dot indicators */}
      <div className="flex justify-center gap-1.5 pb-2">
        {Array.from({ length: totalPhotos }).map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setCurrentIdx(i)}
            className={`h-1.5 rounded-full transition-all ${
              i === currentIdx ? "w-5 bg-white" : "w-1.5 bg-white/40"
            }`}
            aria-label={`Go to photo ${i + 1}`}
          />
        ))}
      </div>

      {/* Bottom action bar */}
      <div className="bg-gradient-to-t from-black/70 to-transparent px-4 pb-6 pt-6">
        <div className="flex items-center justify-around text-white">
          <button
            type="button"
            onClick={handleShare}
            className="flex flex-col items-center gap-1"
            aria-label="Share"
          >
            <div className="grid h-11 w-11 place-items-center rounded-full hover:bg-white/10">
              <Share2 className="h-5 w-5" />
            </div>
            <span className="text-[10px] opacity-70">Share</span>
          </button>

          <button
            type="button"
            onClick={() => setLiked((l) => !l)}
            className="flex flex-col items-center gap-1"
            aria-label={liked ? "Unlike" : "Like"}
          >
            <div className="grid h-11 w-11 place-items-center rounded-full hover:bg-white/10">
              <Heart className={`h-5 w-5 ${liked ? "fill-red-400 text-red-400" : ""}`} />
            </div>
            <span className="text-[10px] opacity-70">{liked ? "Liked" : "Like"}</span>
          </button>

          <button
            type="button"
            onClick={goBack}
            className="flex flex-col items-center gap-1"
            aria-label="Reply in chat"
          >
            <div className="grid h-11 w-11 place-items-center rounded-full hover:bg-white/10">
              <MessageCircle className="h-5 w-5" />
            </div>
            <span className="text-[10px] opacity-70">Reply</span>
          </button>

          <button
            type="button"
            className="flex flex-col items-center gap-1"
            aria-label="Report"
          >
            <div className="grid h-11 w-11 place-items-center rounded-full hover:bg-white/10">
              <Flag className="h-5 w-5" />
            </div>
            <span className="text-[10px] opacity-70">Report</span>
          </button>
        </div>
      </div>
    </div>
  );
}
