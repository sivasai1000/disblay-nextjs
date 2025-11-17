import React, { useState } from "react";

const isYouTubeUrl = (url) =>
  url?.includes("youtube.com") || url?.includes("youtu.be");

const getYouTubeEmbedUrl = (url) => {
  if (!url) return "";
  try {
    let videoId = "";
    const patterns = [
      /youtube\.com\/watch\?v=([^&]+)/,   // normal watch
      /youtu\.be\/([^?]+)/,               // short link
      /youtube\.com\/shorts\/([^?]+)/,    // shorts
      /youtube\.com\/embed\/([^?]+)/,     // already embed
    ];

    for (const p of patterns) {
      const m = url.match(p);
      if (m && m[1]) {
        videoId = m[1];
        break;
      }
    }
    if (!videoId && url.includes("v=")) {
      videoId = new URL(url).searchParams.get("v");
    }
    return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
  } catch {
    return url;
  }
};

const ImageVideoCarousel = ({ poster, videoUrl, name }) => {
  const slides = [];
  if (poster) slides.push({ type: "image", src: poster });
  if (videoUrl) {
    slides.push({
      type: isYouTubeUrl(videoUrl) ? "youtube" : "video",
      src: videoUrl,
    });
  }

  const [active, setActive] = useState(0);

  return (
    <div className="position-relative text-center">
      {/* Active Slide */}
      <div style={{ minHeight: "320px" }}>
        {slides[active].type === "image" && (
          <img
            src={slides[active].src}
            alt={name}
            style={{
              width: "100%",
              height: "320px",
              borderRadius: "12px",
              objectFit: "cover",
            }}
          />
        )}

        {slides[active].type === "youtube" && (
          <iframe
            src={getYouTubeEmbedUrl(slides[active].src)}
            width="100%"
            height="320"
            style={{
              borderRadius: "12px",
              zIndex: 10,
              position: "relative",
              pointerEvents: "auto", // makes sure clicks work
            }}
            title="Package Video"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        )}

        {slides[active].type === "video" && (
          <video
            controls
            width="100%"
            height="320"
            style={{
              borderRadius: "12px",
              zIndex: 10,
              position: "relative",
            }}
          >
            <source src={slides[active].src} />
          </video>
        )}
      </div>

      {/* Dots */}
      {slides.length > 1 && (
        <div className="d-flex justify-content-center mt-2">
          {slides.map((_, i) => (
            <span
              key={i}
              onClick={() => setActive(i)}
              style={{
                height: "10px",
                width: "10px",
                borderRadius: "50%",
                margin: "0 5px",
                backgroundColor: i === active ? "#000" : "#bbb",
                cursor: "pointer",
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageVideoCarousel;
