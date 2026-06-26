import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { markLearned, getLearned } from '../utils/progress';

function SongDetail() {
  const location = useLocation();
  const navigate = useNavigate();
  const song = location.state;
  const bottomRef = useRef(null);
  const [isLearned, setIsLearned] = useState(false);
  const [showBadge, setShowBadge] = useState(false);

  useEffect(() => {
    if (song) {
      setIsLearned(getLearned().includes(song.name));
    }
  }, [song]);

  useEffect(() => {
    if (!song) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          markLearned(song.name);
          setIsLearned(true);
          setShowBadge(true);
        }
      },
      { threshold: 1.0 }
    );
    if (bottomRef.current) observer.observe(bottomRef.current);
    return () => observer.disconnect();
  }, [song]);

  if (!song) {
    navigate('/search');
    return null;
  }

  return (
    <div style={styles.container}>
      <button style={styles.back} onClick={() => navigate('/search')}>← Back</button>

      {isLearned && (
        <div style={styles.learnedBanner}>
          ✅ You have learned this song!
        </div>
      )}

      <h1 style={styles.title}>{song.name}</h1>
      <p style={styles.artist}>{song.artist}</p>

      <div style={styles.infoRow}>
        <span style={styles.badge}>{song.language}</span>
        <span style={styles.badge}>{song.key}</span>
        <span style={{
          ...styles.badge,
          backgroundColor: song.difficulty === 'EASY' ? '#2ecc71' :
            song.difficulty === 'INTERMEDIATE' ? '#f39c12' : '#e74c3c'
        }}>{song.difficulty}</span>
      </div>

      <div style={styles.card}>
        <h3 style={styles.sectionTitle}>Chords Used</h3>
        <div style={styles.chordRow}>
          {song.chords.split('-').map((chord, i) => (
            <div key={i} style={styles.chordBox}>{chord}</div>
          ))}
        </div>
      </div>

      <div style={styles.card}>
        <h3 style={styles.sectionTitle}>How To Play</h3>
        <p style={styles.hint}>Practice each chord individually, then try switching between them slowly.</p>
        <p style={styles.hint}>Chord order: {song.chords.split('-').join(' → ')}</p>
      </div>

      

      {/* Bottom marker — reaching here = learned */}
      <div ref={bottomRef} style={styles.bottomMarker}>
        🎵 Scroll complete — Song marked as learned!
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
  back: {
    backgroundColor: 'transparent',
    border: 'none',
    color: '#e94560',
    fontSize: '16px',
    cursor: 'pointer',
    marginBottom: '20px',
    padding: '0'
  },
  learnedBanner: {
    backgroundColor: '#2ecc71',
    color: 'white',
    padding: '10px',
    borderRadius: '8px',
    marginBottom: '20px',
    fontWeight: 'bold',
    textAlign: 'center'
  },
  title: {
    fontSize: '32px',
    color: 'white',
    marginBottom: '8px'
  },
  artist: {
    fontSize: '16px',
    color: '#a8a8b3',
    marginBottom: '20px'
  },
  infoRow: {
    display: 'flex',
    gap: '10px',
    marginBottom: '30px',
    flexWrap: 'wrap'
  },
  badge: {
    padding: '6px 14px',
    borderRadius: '20px',
    fontSize: '13px',
    backgroundColor: '#0f3460',
    color: 'white'
  },
  card: {
    backgroundColor: '#16213e',
    borderRadius: '12px',
    padding: '20px',
    marginBottom: '20px',
    border: '1px solid #0f3460'
  },
  sectionTitle: {
    fontSize: '16px',
    color: '#a8a8b3',
    marginBottom: '15px'
  },
  chordRow: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap'
  },
  chordBox: {
    backgroundColor: '#e94560',
    color: 'white',
    padding: '12px 18px',
    borderRadius: '8px',
    fontSize: '18px',
    fontWeight: 'bold'
  },
  hint: {
    color: '#a8a8b3',
    fontSize: '14px',
    marginBottom: '10px',
    lineHeight: '1.6'
  },
  link: {
    color: '#e94560',
    fontSize: '16px'
  },
  bottomMarker: {
    textAlign: 'center',
    color: '#2ecc71',
    padding: '20px',
    fontSize: '14px',
    marginTop: '20px'
  }
};

export default SongDetail;