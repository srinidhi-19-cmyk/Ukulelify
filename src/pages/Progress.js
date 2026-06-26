import { useState, useEffect } from 'react';
import songs from '../songs';
import { getLearned } from '../utils/progress';

function Progress() {
  const [learned, setLearned] = useState(() => getLearned());

  const [streak, setStreak] = useState(() => {
    const saved = localStorage.getItem('streak');
    return saved ? JSON.parse(saved) : { count: 0, lastDate: null };
  });

  useEffect(() => {
    setLearned(getLearned());
  }, []);

  useEffect(() => {
    const today = new Date().toDateString();
    if (streak.lastDate !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const newCount = streak.lastDate === yesterday.toDateString() ? streak.count + 1 : 1;
      const newStreak = { count: newCount, lastDate: today };
      setStreak(newStreak);
      localStorage.setItem('streak', JSON.stringify(newStreak));
    }
  }, []);

  const toggleLearned = (songName) => {
    setLearned(prev =>
      prev.includes(songName)
        ? prev.filter(s => s !== songName)
        : [...prev, songName]
    );
  };

  const percentage = Math.round((learned.length / songs.length) * 100);

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>📈 Progress Tracker</h1>

      <div style={styles.statsRow}>
        <div style={styles.statCard}>
          <div style={styles.statNumber}>{streak.count}</div>
          <div style={styles.statLabel}>🔥 Day Streak</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statNumber}>{learned.length}</div>
          <div style={styles.statLabel}>🎵 Songs Learned</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statNumber}>{percentage}%</div>
          <div style={styles.statLabel}>✅ Complete</div>
        </div>
      </div>

      <div style={styles.progressBarContainer}>
        <div style={{ ...styles.progressBar, width: `${percentage}%` }} />
      </div>
      <p style={styles.progressText}>{learned.length} of {songs.length} songs learned</p>

      <div style={styles.list}>
        {songs.map((song, index) => {
          const isLearned = learned.includes(song.name);
          return (
            <div key={index} style={{
              ...styles.songCard,
              borderColor: isLearned ? '#2ecc71' : '#0f3460'
            }}>
              <div style={styles.songInfo}>
                <h3 style={styles.songName}>{song.name}</h3>
                <p style={styles.songArtist}>{song.artist} • {song.difficulty}</p>
              </div>
              <div style={{
                ...styles.learnedBadge,
                backgroundColor: isLearned ? '#2ecc71' : '#16213e',
                border: `1px solid ${isLearned ? '#2ecc71' : '#0f3460'}`
              }}>
                {isLearned ? '✅ Learned' : '⏳ Pending'}
              </div>
            </div>
          );
        })}
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
    color: 'white'
  },
  title: {
    textAlign: 'center',
    fontSize: '36px',
    color: '#e94560',
    marginBottom: '30px'
  },
  statsRow: {
    display: 'flex',
    justifyContent: 'center',
    gap: '20px',
    marginBottom: '30px',
    flexWrap: 'wrap'
  },
  statCard: {
    backgroundColor: '#16213e',
    borderRadius: '12px',
    padding: '20px 30px',
    textAlign: 'center',
    border: '1px solid #0f3460',
    minWidth: '100px'
  },
  statNumber: {
    fontSize: '36px',
    fontWeight: 'bold',
    color: '#e94560'
  },
  statLabel: {
    fontSize: '13px',
    color: '#a8a8b3',
    marginTop: '5px'
  },
  progressBarContainer: {
    width: '100%',
    maxWidth: '500px',
    height: '10px',
    backgroundColor: '#16213e',
    borderRadius: '10px',
    margin: '0 auto 10px auto',
    overflow: 'hidden'
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#e94560',
    borderRadius: '10px',
    transition: 'width 0.3s ease'
  },
  progressText: {
    textAlign: 'center',
    color: '#a8a8b3',
    fontSize: '14px',
    marginBottom: '30px'
  },
  list: {
    maxWidth: '600px',
    margin: '0 auto'
  },
  songCard: {
    backgroundColor: '#16213e',
    borderRadius: '12px',
    padding: '15px 20px',
    marginBottom: '12px',
    border: '1px solid',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  songInfo: {
    textAlign: 'left'
  },
  songName: {
    fontSize: '16px',
    color: 'white',
    marginBottom: '4px'
  },
  songArtist: {
    fontSize: '13px',
    color: '#a8a8b3'
  },
  learnedBadge: {
    padding: '8px 16px',
    borderRadius: '20px',
    color: 'white',
    fontSize: '13px',
    whiteSpace: 'nowrap'
  }
};

export default Progress;