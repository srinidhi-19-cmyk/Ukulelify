import { useState, useEffect } from 'react';
import { getLearned } from '../utils/progress';
import songs from '../songs';
import { sendNotification, getRandomMessage, startNotificationScheduler } from '../utils/notifications';
import { playUkuleleString } from '../utils/sound';

function getSmartTime() {
  const learned = getLearned();
  const total = songs.length;
  const percentage = (learned.length / total) * 100;
  if (percentage < 20) return { time: '08:00', reason: 'Early morning — best for beginners building habit' };
  if (percentage < 50) return { time: '17:00', reason: 'Evening — good for intermediate practice sessions' };
  return { time: '20:00', reason: 'Night — advanced players prefer focused late sessions' };
}

function StreakTimer() {
  const [timeLeft, setTimeLeft] = useState('');
  const streak = JSON.parse(localStorage.getItem('streak') || '{"count":0}');
  const learned = getLearned();
  const practicedToday = learned.length > 0;

  useEffect(() => {
    const update = () => {
      const now = new Date();
      const midnight = new Date();
      midnight.setHours(23, 59, 59, 999);
      const diff = midnight - now;
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      setTimeLeft(`${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`);
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={styles.streakInner}>
      <div style={styles.streakCount}>🔥 {streak.count} day streak</div>
      {practicedToday ? (
        <div style={styles.streakSafe}>✅ Streak safe for today!</div>
      ) : (
        <>
          <div style={styles.streakDanger}>⚠️ Practice to keep your streak!</div>
          <div style={styles.streakTimer}>{timeLeft}</div>
          <div style={styles.streakLabel}>remaining today</div>
        </>
      )}
    </div>
  );
}

function Reminders() {
  const [mode, setMode] = useState(() => localStorage.getItem('reminderMode') || 'manual');
  const [time, setTime] = useState(() => localStorage.getItem('reminderTime') || '18:00');
  const [enabled, setEnabled] = useState(() => localStorage.getItem('reminderEnabled') === 'true');
  const [permission, setPermission] = useState(Notification.permission);
  const [saved, setSaved] = useState(false);
  const smartSchedule = getSmartTime();

  const requestPermission = async () => {
    const result = await Notification.requestPermission();
    setPermission(result);
  };

  const saveReminder = () => {
    const finalTime = mode === 'smart' ? smartSchedule.time : time;
    localStorage.setItem('reminderTime', finalTime);
    localStorage.setItem('reminderEnabled', enabled);
    localStorage.setItem('reminderMode', mode);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const testNotification = () => {
    playUkuleleString();
    setTimeout(() => {
      sendNotification('🎵 Ukulelify', getRandomMessage());
    }, 500);
  };

  useEffect(() => {
    if (!enabled || permission !== 'granted') return;
    const streak = JSON.parse(localStorage.getItem('streak') || '{}');
    const cleanup = startNotificationScheduler(streak.lastDate);
    return cleanup;
  }, [enabled, permission]);

  useEffect(() => {
    if (!enabled || permission !== 'granted') return;
    const activeTime = mode === 'smart' ? smartSchedule.time : time;

    const interval = setInterval(() => {
      const now = new Date();
      const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      if (currentTime === activeTime) {
        sendNotification('🎵 Ukulelify', getRandomMessage());
      }
    }, 60000);

    return () => clearInterval(interval);
  }, [enabled, time, mode, permission]);

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>⏰ Practice Reminders</h1>
      <p style={styles.subtitle}>Set a daily reminder to practice ukulele</p>

      {permission !== 'granted' && (
        <div style={styles.card}>
          <p style={styles.permissionText}>
            Allow notifications to receive practice reminders
          </p>
          <button style={styles.primaryBtn} onClick={requestPermission}>
            Allow Notifications
          </button>
        </div>
      )}

      {permission === 'granted' && (
        <div style={styles.card}>
          <div style={styles.row}>
            <span style={styles.label}>Daily Reminder</span>
            <div
              style={{
                ...styles.toggle,
                backgroundColor: enabled ? '#e94560' : '#0f3460'
              }}
              onClick={() => setEnabled(!enabled)}
            >
              <div style={{
                ...styles.toggleDot,
                transform: enabled ? 'translateX(24px)' : 'translateX(2px)'
              }} />
            </div>
          </div>

          <div style={styles.modeRow}>
            <button
              style={{
                ...styles.modeBtn,
                backgroundColor: mode === 'manual' ? '#e94560' : '#0f3460'
              }}
              onClick={() => setMode('manual')}
            >
              Manual
            </button>
            <button
              style={{
                ...styles.modeBtn,
                backgroundColor: mode === 'smart' ? '#e94560' : '#0f3460'
              }}
              onClick={() => setMode('smart')}
            >
              ✨ Smart
            </button>
          </div>

          {mode === 'manual' && (
            <div style={styles.row}>
              <span style={styles.label}>Reminder Time</span>
              <input
                type="time"
                value={time}
                onChange={e => setTime(e.target.value)}
                style={styles.timePicker}
                disabled={!enabled}
              />
            </div>
          )}

          {mode === 'smart' && (
            <div style={styles.smartBox}>
              <div style={styles.smartTime}>{smartSchedule.time}</div>
              <p style={styles.smartReason}>{smartSchedule.reason}</p>
              <p style={styles.smartNote}>
                Based on your progress — {getLearned().length} of {songs.length} songs learned
              </p>
            </div>
          )}

          <button
            style={{ ...styles.primaryBtn, opacity: !enabled ? 0.5 : 1 }}
            onClick={saveReminder}
            disabled={!enabled}
          >
            {saved ? '✅ Saved!' : 'Save Reminder'}
          </button>

          <button style={styles.secondaryBtn} onClick={testNotification}>
            Test Notification
          </button>
        </div>
      )}

      {/* Streak Timer */}
      <div style={styles.streakCard}>
        <p style={styles.streakTitle}>🔥 Today's Streak Status</p>
        <StreakTimer />
      </div>

      <div style={styles.infoCard}>
        <p style={styles.infoTitle}>💡 Tips for consistent practice</p>
        <p style={styles.infoText}>• Practice for at least 15 minutes daily</p>
        <p style={styles.infoText}>• Morning practice builds muscle memory faster</p>
        <p style={styles.infoText}>• Start with chord transitions before full songs</p>
        <p style={styles.infoText}>• Track your streak in the Progress page</p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: '40px 20px',
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#1a1a2e',
    minHeight: '100vh',
    color: 'white',
    textAlign: 'center'
  },
  title: { fontSize: '36px', color: '#e94560', marginBottom: '10px' },
  subtitle: { color: '#a8a8b3', fontSize: '14px', marginBottom: '30px' },
  card: {
    backgroundColor: '#16213e',
    borderRadius: '12px',
    padding: '30px',
    maxWidth: '400px',
    margin: '0 auto 30px auto',
    border: '1px solid #0f3460'
  },
  row: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
  label: { fontSize: '16px', color: 'white' },
  toggle: { width: '50px', height: '26px', borderRadius: '13px', cursor: 'pointer', position: 'relative', transition: 'background 0.2s' },
  toggleDot: { position: 'absolute', top: '3px', width: '20px', height: '20px', borderRadius: '50%', backgroundColor: 'white', transition: 'transform 0.2s' },
  modeRow: { display: 'flex', gap: '10px', marginBottom: '20px' },
  modeBtn: { flex: 1, padding: '10px', borderRadius: '8px', border: 'none', color: 'white', cursor: 'pointer', fontSize: '14px' },
  timePicker: { padding: '8px 12px', borderRadius: '8px', border: '1px solid #e94560', backgroundColor: '#1a1a2e', color: 'white', fontSize: '16px' },
  smartBox: { backgroundColor: '#1a1a2e', borderRadius: '8px', padding: '15px', marginBottom: '20px', textAlign: 'center' },
  smartTime: { fontSize: '40px', fontWeight: 'bold', color: '#e94560', marginBottom: '8px' },
  smartReason: { color: '#a8a8b3', fontSize: '13px', marginBottom: '6px' },
  smartNote: { color: '#555', fontSize: '12px' },
  primaryBtn: { width: '100%', padding: '12px', borderRadius: '8px', border: 'none', backgroundColor: '#e94560', color: 'white', cursor: 'pointer', fontSize: '16px', marginBottom: '10px' },
  secondaryBtn: { width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e94560', backgroundColor: 'transparent', color: 'white', cursor: 'pointer', fontSize: '16px' },
  permissionText: { color: '#a8a8b3', marginBottom: '15px' },
  streakCard: { backgroundColor: '#16213e', borderRadius: '12px', padding: '20px', maxWidth: '400px', margin: '0 auto 30px auto', border: '1px solid #0f3460' },
  streakTitle: { color: '#e94560', fontSize: '16px', marginBottom: '15px' },
  streakInner: { textAlign: 'center' },
  streakCount: { fontSize: '24px', fontWeight: 'bold', color: 'white', marginBottom: '10px' },
  streakSafe: { color: '#2ecc71', fontSize: '15px' },
  streakDanger: { color: '#f39c12', fontSize: '15px', marginBottom: '10px' },
  streakTimer: { fontSize: '48px', fontWeight: 'bold', color: '#e94560', fontFamily: 'monospace' },
  streakLabel: { color: '#a8a8b3', fontSize: '13px', marginTop: '5px' },
  infoCard: { backgroundColor: '#16213e', borderRadius: '12px', padding: '20px', maxWidth: '400px', margin: '0 auto', border: '1px solid #0f3460', textAlign: 'left' },
  infoTitle: { fontSize: '15px', color: '#e94560', marginBottom: '12px' },
  infoText: { color: '#a8a8b3', fontSize: '13px', marginBottom: '8px' }
};

export default Reminders;