"use client";

export default function TripVideo() {
  const videos = [
    "d6biIIidvrg",
    "d51ii4RSwWE",
    "GLfdt9lZkYk",
    "eI90PobkLFI",
  ];

  const randomIndex = Math.floor(Math.random() * videos.length);
  const videoId = videos[randomIndex];

  const videoUrl = `https://www.youtube.com/embed/${videoId}?mute=1&autoplay=1&controls=1&loop=1&playlist=${videoId}`;

  return (
    <div className="rounded-xl m-auto flex items-center shadow-lg overflow-hidden">
      <iframe
        width="100%"
        height="500"
        src={videoUrl}
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
    </div>
  );
}
