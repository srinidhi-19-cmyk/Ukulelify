export function getLearned() {
  const saved = localStorage.getItem('learnedSongs');
  return saved ? JSON.parse(saved) : [];
}

export function markLearned(songName) {
  const learned = getLearned();
  if (!learned.includes(songName)) {
    learned.push(songName);
    localStorage.setItem('learnedSongs', JSON.stringify(learned));
  }
}