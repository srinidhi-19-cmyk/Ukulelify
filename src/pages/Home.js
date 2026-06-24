import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>🎵 Ukulelify</h1>
      <p style={styles.tagline}>Learn ukulele with Indian songs you love</p>

      <div style={styles.grid}>
        <button style={styles.card} onClick={() => navigate('/search')}>
          🔍 Song Search
        </button>
        <button style={styles.card} onClick={() => navigate('/tuner')}>
          🎸 Tuner
        </button>
        <button style={styles.card} onClick={() => navigate('/chords')}>
          🎼 Chord Visualizer
        </button>
        <button style={styles.card} onClick={() => navigate('/progress')}>
          📈 Progress Tracker
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    textAlign: 'center',
    padding: '50px 20px',
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#1a1a2e',
    minHeight: '100vh',
    color: 'white'
  },
  title: {
    fontSize: '48px',
    marginBottom: '10px',
    color: '#e94560'
  },
  tagline: {
    fontSize: '18px',
    color: '#a8a8b3',
    marginBottom: '50px'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '20px',
    maxWidth: '500px',
    margin: '0 auto'
  },
  card: {
    backgroundColor: '#16213e',
    color: 'white',
    border: '1px solid #e94560',
    borderRadius: '12px',
    padding: '30px 20px',
    fontSize: '16px',
    cursor: 'pointer',
  }
};

export default Home;