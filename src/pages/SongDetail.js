import { useLocation, useNavigate } from 'react-router-dom';

function SongDetail() {
  const location = useLocation();
  const navigate = useNavigate();
  const song = location.state;

  if (!song) {
    navigate('/search');
    return null;
  }

  return (
    <div style={styles.container}>
      <button style={styles.back} onClick={() => navigate('/search')}>← Back</button>

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
        <h3 style={styles.sectionTitle}>YouTube Reference</h3>
        <a href={song.youtube} target="_blank" rel="noreferrer" style={styles.link}>
          Watch on YouTube ↗
        </a>
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
  link: {
    color: '#e94560',
    fontSize: '16px'
  }
};

export default SongDetail;