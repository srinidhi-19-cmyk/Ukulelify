import { useState } from 'react';
import { getLearned } from '../utils/progress';
import songs from '../songs';

function WeeklyProgress() {
  const learned = getLearned();
  const streak = JSON.parse(localStorage.getItem('streak') || '{"count":0}');
  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const today = new Date().getDay();
  const practicedDays = Math.min(streak.count, 7);

  const weekData = weekDays.map((day, i) => ({
    day,
    practiced: i >= 7 - practicedDays
  }));

  const thisWeekLearned = learned.slice(-7);

  return (
    <div>
      <div style={styles.weekGrid}>
        {weekData.map((d, i) => (
          <div key={i} style={styles.dayCol}>
            <div style={{
              ...styles.dayDot,
              backgroundColor: d.practiced ? '#e94560' : '#0f3460'
            }} />
            <span style={styles.dayLabel}>{d.day}</span>
          </div>
        ))}
      </div>
      <div style={styles.weekStats}>
        <div style={styles.weekStat}>
          <span style={styles.weekStatNum}>{practicedDays}</span>
          <span style={styles.weekStatLabel}>Days practiced</span>
        </div>
        <div style={styles.weekStat}>
          <span style={styles.weekStatNum}>{thisWeekLearned.length}</span>
          <span style={styles.weekStatLabel}>Songs this week</span>
        </div>
        <div style={styles.weekStat}>
          <span style={styles.weekStatNum}>{streak.count}</span>
          <span style={styles.weekStatLabel}>Day streak</span>
        </div>
      </div>
    </div>
  );
}

function Settings() {
  const [reminderEnabled, setReminderEnabled] = useState(
    () => localStorage.getItem('reminderEnabled') === 'true'
  );
  const [smartEnabled, setSmartEnabled] = useState(
    () => localStorage.getItem('reminderMode') === 'smart'
  );
  const [reminderTime, setReminderTime] = useState(
    () => localStorage.getItem('reminderTime') || '18:00'
  );
  const [feedback, setFeedback] = useState('');
  const [feedbackSaved, setFeedbackSaved] = useState(false);
  const [reminderSaved, setReminderSaved] = useState(false);

  const saveReminder = () => {
    localStorage.setItem('reminderEnabled', reminderEnabled);
    localStorage.setItem('reminderMode', smartEnabled ? 'smart' : 'manual');
    localStorage.setItem('reminderTime', reminderTime);
    setReminderSaved(true);
    setTimeout(() => setReminderSaved(false), 2000);
  };

  const saveFeedback = () => {
    const existing = JSON.parse(localStorage.getItem('feedbackList') || '[]');
    existing.push({ text: feedback, date: new Date().toLocaleDateString() });
    localStorage.setItem('feedbackList', JSON.stringify(existing));
    setFeedback('');
    setFeedbackSaved(true);
    setTimeout(() => setFeedbackSaved(false), 2000);
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>⚙️ Settings</h1>

      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>🔔 Notifications</h2>
        <div style={styles.row}>
          <span style={styles.label}>Daily Reminder</span>
          <div
            style={{ ...styles.toggle, backgroundColor: reminderEnabled ? '#e94560' : '#0f3460' }}
            onClick={() => setReminderEnabled(!reminderEnabled)}
          >
            <div style={{ ...styles.toggleDot, transform: reminderEnabled ? 'translateX(24px)' : 'translateX(2px)' }} />
          </div>
        </div>

        {reminderEnabled && (
          <>
            <div style={styles.row}>
              <span style={styles.label}>Smart Scheduling</span>
              <div
                style={{ ...styles.toggle, backgroundColor: smartEnabled ? '#e94560' : '#0f3460' }}
                onClick={() => setSmartEnabled(!smartEnabled)}
              >
                <div style={{ ...styles.toggleDot, transform: smartEnabled ? 'translateX(24px)' : 'translateX(2px)' }} />
              </div>
            </div>

            {!smartEnabled && (
              <div style={styles.row}>
                <span style={styles.label}>Reminder Time</span>
                <input
                  type="time"
                  value={reminderTime}
                  onChange={e => setReminderTime(e.target.value)}
                  style={styles.timePicker}
                />
              </div>
            )}
          </>
        )}

        <button style={styles.saveBtn} onClick={saveReminder}>
          {reminderSaved ? '✅ Saved!' : 'Save Notification Settings'}
        </button>
      </div>

      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>📊 Weekly Progress</h2>
        <WeeklyProgress />
      </div>

      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>💬 Feedback</h2>
        <p style={styles.feedbackSubtitle}>Found a bug or have a suggestion? Let us know.</p>
        <textarea
          style={styles.textarea}
          placeholder="Write your feedback here..."
          value={feedback}
          onChange={e => setFeedback(e.target.value)}
          rows={4}
        />
        <button
          style={{ ...styles.saveBtn, opacity: !feedback.trim() ? 0.5 : 1 }}
          onClick={saveFeedback}
          disabled={!feedback.trim()}
        >
          {feedbackSaved ? '✅ Feedback Saved!' : 'Submit Feedback'}
        </button>
      </div>

      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>ℹ️ About</h2>
        <div style={styles.aboutRow}>
          <span style={styles.aboutLabel}>App</span>
          <span style={styles.aboutValue}>Ukulelify</span>
        </div>
        <div style={styles.aboutRow}>
          <span style={styles.aboutLabel}>Version</span>
          <span style={styles.aboutValue}>1.0.0</span>
        </div>
        <div style={styles.aboutRow}>
          <span style={styles.aboutLabel}>Developer</span>
          <span style={styles.aboutValue}>Nidhi</span>
        </div>
        <div style={styles.aboutRow}>
          <span style={styles.aboutLabel}>Songs</span>
          <span style={styles.aboutValue}>{songs.length} songs</span>
        </div>
        <div style={styles.aboutRow}>
          <span style={styles.aboutLabel}>GitHub</span>
          <span style={styles.aboutValue}>srinidhi-19-cmyk/Ukulelify</span>
        </div>
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
    maxWidth: '600px',
    margin: '0 auto'
  },
  title: {
    fontSize: '36px',
    color: '#e94560',
    marginBottom: '30px',
    textAlign: 'center'
  },
  section: {
    backgroundColor: '#16213e',
    borderRadius: '12px',
    padding: '24px',
    marginBottom: '20px',
    border: '1px solid #0f3460'
  },
  sectionTitle: {
    fontSize: '18px',
    color: '#e94560',
    marginBottom: '20px'
  },
  row: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px'
  },
  label: {
    fontSize: '15px',
    color: 'white'
  },
  toggle: {
    width: '50px',
    height: '26px',
    borderRadius: '13px',
    cursor: 'pointer',
    position: 'relative',
    transition: 'background 0.2s'
  },
  toggleDot: {
    position: 'absolute',
    top: '3px',
    width: '20px',
    height: '20px',
    borderRadius: '50%',
    backgroundColor: 'white',
    transition: 'transform 0.2s'
  },
  timePicker: {
    padding: '8px 12px',
    borderRadius: '8px',
    border: '1px solid #e94560',
    backgroundColor: '#1a1a2e',
    color: 'white',
    fontSize: '15px'
  },
  saveBtn: {
    width: '100%',
    padding: '12px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: '#e94560',
    color: 'white',
    cursor: 'pointer',
    fontSize: '15px',
    marginTop: '10px'
  },
  weekGrid: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '20px'
  },
  dayCol: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px'
  },
  dayDot: {
    width: '36px',
    height: '36px',
    borderRadius: '50%'
  },
  dayLabel: {
    fontSize: '12px',
    color: '#a8a8b3'
  },
  weekStats: {
    display: 'flex',
    justifyContent: 'space-around',
    marginTop: '10px'
  },
  weekStat: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '4px'
  },
  weekStatNum: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#e94560'
  },
  weekStatLabel: {
    fontSize: '12px',
    color: '#a8a8b3'
  },
  feedbackSubtitle: {
    color: '#a8a8b3',
    fontSize: '13px',
    marginBottom: '12px'
  },
  textarea: {
    width: '100%',
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid #0f3460',
    backgroundColor: '#1a1a2e',
    color: 'white',
    fontSize: '14px',
    resize: 'vertical',
    outline: 'none',
    boxSizing: 'border-box'
  },
  aboutRow: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '10px 0',
    borderBottom: '1px solid #0f3460'
  },
  aboutLabel: {
    color: '#a8a8b3',
    fontSize: '14px'
  },
  aboutValue: {
    color: 'white',
    fontSize: '14px'
  }
};

export default Settings;