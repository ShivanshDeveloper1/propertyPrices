import satori from "satori";
import React from "react";

type CoverOptions = {
  title?: string;
  category?: string;
  backgroundImage?: string;
  author?: string;
};

export async function generateCover({
  title,
  category,
  backgroundImage,
  author,
}: CoverOptions) {
  // Ensure non-empty fallback strings
  const safeTitle = title?.trim() ? title : "Industry Insights & Analysis";
  const safeCategory = category?.trim() ? category : "Industry Insights";
  const safeAuthor = author?.trim() ? author : "AutoBlog";

  console.log("[Satori] Fetching fonts...");
  const [fontBold, fontMedium] = await Promise.all([
    fetch(
      "https://cdn.jsdelivr.net/fontsource/fonts/inter@latest/latin-700-normal.ttf"
    ).then((res) => res.arrayBuffer()),
    fetch(
      "https://cdn.jsdelivr.net/fontsource/fonts/inter@latest/latin-500-normal.ttf"
    ).then((res) => res.arrayBuffer()),
  ]);

  // Calculate dynamic font size safely
  const fontSize =
    safeTitle.length > 60
      ? "40px"
      : safeTitle.length > 40
      ? "48px"
      : "56px";

  console.log("[Satori] Rendering SVG cover...");
  const svg = await satori(
    <div
      style={{
        width: "1200px",
        height: "630px",
        display: "flex",
        position: "relative",
        overflow: "hidden",
        backgroundColor: "#09090b",
        fontFamily: "Inter",
      }}
    >
      {/* 1. Background Image */}
      {backgroundImage && (
        <img
          src={backgroundImage}
          width="1200"
          height="630"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "1200px",
            height: "630px",
            objectFit: "cover",
          }}
        />
      )}

      {/* 2. Left-to-Right Scrim */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "1200px",
          height: "630px",
          display: "flex",
          backgroundImage:
            "linear-gradient(to right, rgba(9, 9, 11, 0.95) 0%, rgba(9, 9, 11, 0.75) 45%, rgba(9, 9, 11, 0.15) 100%)",
        }}
      />

      {/* 3. Bottom-to-Top Scrim */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "1200px",
          height: "630px",
          display: "flex",
          backgroundImage:
            "linear-gradient(to top, rgba(9, 9, 11, 0.9) 0%, rgba(9, 9, 11, 0.2) 60%, transparent 100%)",
        }}
      />

      {/* 4. Glassmorphic Border */}
      <div
        style={{
          position: "absolute",
          top: "24px",
          left: "24px",
          right: "24px",
          bottom: "24px",
          display: "flex",
          border: "1px solid rgba(255, 255, 255, 0.12)",
          borderRadius: "16px",
        }}
      />

      {/* 5. Content Container */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "1200px",
          height: "630px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px",
          boxSizing: "border-box",
        }}
      >
        {/* Top Bar: Category + Author */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          {/* Category Badge */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              backgroundColor: "rgba(99, 102, 241, 0.22)",
              border: "1px solid rgba(129, 140, 248, 0.45)",
              borderRadius: "9999px",
              padding: "10px 22px",
            }}
          >
            <div
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                backgroundColor: "#818cf8",
                marginRight: "10px",
                display: "flex",
              }}
            />
            <span
              style={{
                fontSize: "16px",
                fontWeight: 600,
                color: "#e0e7ff",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
              }}
            >
              {safeCategory}
            </span>
          </div>

          {/* Author / Brand Tag */}
          <div
            style={{
              display: "flex",
              fontSize: "16px",
              fontWeight: 500,
              color: "rgba(255, 255, 255, 0.6)",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            {safeAuthor}
          </div>
        </div>

        {/* Title Section */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "980px",
          }}
        >
          <div style={{ display: "flex", alignItems: "flex-start", width: "100%" }}>
            <div
              style={{
                width: "6px",
                minHeight: "72px",
                alignSelf: "stretch",
                backgroundColor: "#6366f1",
                borderRadius: "4px",
                marginRight: "24px",
                display: "flex",
              }}
            />
            <div
              style={{
                display: "flex",
                flex: "1 1 0%",
                minWidth: 0,
                fontSize,
                fontWeight: 700,
                lineHeight: 1.15,
                color: "#ffffff",
                letterSpacing: "-0.02em",
              }}
            >
              {safeTitle}
            </div>
          </div>
        </div>
      </div>
    </div>,
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: "Inter",
          data: fontBold,
          weight: 700,
          style: "normal",
        },
        {
          name: "Inter",
          data: fontMedium,
          weight: 500,
          style: "normal",
        },
      ],
    }
  );

  console.log("[Satori] SVG generated successfully.");
  return svg;
}