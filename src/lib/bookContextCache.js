const PREFIX = "book-context:";

export function getCachedContext(bookName) {
  try {
    const raw = localStorage.getItem(PREFIX + bookName);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setCachedContext(bookName, context) {
  try {
    localStorage.setItem(PREFIX + bookName, JSON.stringify(context));
  } catch {
    // localStorage unavailable or quota exceeded
  }
}
