import { playUkuleleString } from './sound';

const MESSAGES = [
  "🎵 Your ukulele misses you. Like really misses you.",
  "🌟 Ranbir practiced today. Will you let him win?",
  "🎸 5 minutes of practice beats 0 minutes every time.",
  "🔥 Your streak is alive. Keep it that way.",
  "🎵 Kesariya won't play itself. Open Ukulelify.",
  "🌙 Night practice hits different. Try it.",
  "💪 Every legend started with one chord. Play one today.",
  "🎶 Your fingers forgot what G chord feels like. Remind them.",
  "⚡ Sid Sriram didn't take days off. Just saying.",
  "🎵 One song. That's all. You can do that.",
];

const STREAK_MESSAGES = [
  "⚠️ Your streak ends in 2 hours. Don't let it die!",
  "🔥 2 hours left to save your streak. Open Ukulelify now!",
  "😱 Your streak is about to break. 2 hours remaining!",
];

export function getRandomMessage() {
  return MESSAGES[Math.floor(Math.random() * MESSAGES.length)];
}

export function getStreakWarning() {
  return STREAK_MESSAGES[Math.floor(Math.random() * STREAK_MESSAGES.length)];
}

export function sendNotification(title, body) {
  if (Notification.permission !== 'granted') return;
  playUkuleleString();
  setTimeout(() => {
    new Notification(title, {
      body,
      icon: '/favicon.ico'
    });
  }, 500);
}

export function startNotificationScheduler(streakLastDate) {
  // Every 6 hours notification
  const sixHourInterval = setInterval(() => {
    sendNotification('🎵 Ukulelify', getRandomMessage());
  }, 6 * 60 * 60 * 1000);

  // Check streak every minute
  const streakInterval = setInterval(() => {
    if (!streakLastDate) return;
    const now = new Date();
    const lastPractice = new Date(streakLastDate);
    const midnight = new Date();
    midnight.setHours(23, 59, 59, 999);
    const timeLeftMs = midnight - now;
    const twoHoursMs = 2 * 60 * 60 * 1000;

    if (timeLeftMs <= twoHoursMs && timeLeftMs > twoHoursMs - 60000) {
      const today = now.toDateString();
      if (lastPractice.toDateString() !== today) {
        sendNotification('⚠️ Streak Warning', getStreakWarning());
      }
    }
  }, 60000);

  return () => {
    clearInterval(sixHourInterval);
    clearInterval(streakInterval);
  };
}