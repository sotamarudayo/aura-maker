const voteSentListeners = new Set<() => void>();

function voteSentKey(userId: string) {
  return `aura-voted:${userId}`;
}

export function readVoteSent(userId: string): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(voteSentKey(userId)) === "1";
}

export function markVoteSent(userId: string) {
  localStorage.setItem(voteSentKey(userId), "1");
  voteSentListeners.forEach((listener) => listener());
}

export function subscribeVoteSent(callback: () => void) {
  voteSentListeners.add(callback);
  return () => {
    voteSentListeners.delete(callback);
  };
}
