export function getYouTubeEmbedUrl(url) {
  try {
    const parsed = new URL(url);
    let videoId = null;

    if (parsed.hostname.includes("youtu.be")) {
      videoId = parsed.pathname.slice(1);
    } else if (parsed.pathname.startsWith("/embed/")) {
      videoId = parsed.pathname.split("/embed/")[1];
    } else if (parsed.pathname.startsWith("/shorts/")) {
      videoId = parsed.pathname.split("/shorts/")[1];
    } else {
      videoId = parsed.searchParams.get("v");
    }

    return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
  } catch {
    return null;
  }
}
