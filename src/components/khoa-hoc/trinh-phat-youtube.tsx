"use client";

import { useState } from "react";
import Image from "next/image";
import { Play } from "lucide-react";
import { layIdYoutube } from "@/lib/utils/youtube";

interface TrinhPhatYouTubeProps {
  url: string | null | undefined;
  tieuDe?: string;
  anhBia?: string | null;
  className?: string;
}

export function TrinhPhatYouTube({
  url,
  tieuDe = "Video bài học",
  anhBia,
  className,
}: TrinhPhatYouTubeProps) {
  const [daBatDau, setDaBatDau] = useState(false);
  const videoId = url ? layIdYoutube(url) : null;

  if (!videoId) {
    return (
      <div className={`relative aspect-16/9 w-full overflow-hidden rounded-xl bg-muted flex items-center justify-center text-sm text-muted-foreground ${className || ""}`}>
        Video chưa khả dụng hoặc đường dẫn không đúng
      </div>
    );
  }

  const anhThumbnail =
    anhBia || `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

  if (!daBatDau) {
    return (
      <div
        className={`group relative aspect-16/9 w-full cursor-pointer overflow-hidden rounded-xl bg-black ${className || ""}`}
        onClick={() => setDaBatDau(true)}
      >
        <Image
          src={anhThumbnail}
          alt={tieuDe}
          fill
          className="object-cover opacity-90 transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/25 flex items-center justify-center transition-opacity group-hover:bg-black/35">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-xl transition-transform duration-300 group-hover:scale-110">
            <Play className="h-7 w-7 fill-current ml-1" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative aspect-16/9 w-full overflow-hidden rounded-xl bg-black ${className || ""}`}>
      <iframe
        src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
        title={tieuDe}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="absolute inset-0 h-full w-full border-0"
      />
    </div>
  );
}
