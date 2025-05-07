export const FetchSongPosterUrl = async (title) => {
    const query = encodeURIComponent(title);
    const url = `https://itunes.apple.com/search?term=${query}&limit=1&entity=song`;
    try {
        const res = await fetch(url);
        const data = await res.json();
        const result = (data.results && data.results[0]) || {};
        return result.artworkUrl100 || ""; // Return only the image URL
    } catch (err) {
        console.warn(`Failed to fetch poster for "${title}":`, err);
        return "";
    }
}