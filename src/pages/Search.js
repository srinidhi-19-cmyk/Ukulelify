import { useState } from 'react';
import songs from '../songs';

function Search() {
  const [query, setQuery] = useState('');

  const filtered = songs.filter(song =>
    song.name.toLowerCase().includes(query.toLowerCase()) ||
    song.artist.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>🔍 Song Search</h1>
      <input
        style={styles.input}
        type="text"
        placeholder="Search by song or artist..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      <div style={styles.list}>
        {filtered.map((song, index) => (
          <div key={index} style={styles.card}>
            <h3 style={styles.songName}>{song.name}</h3>
            <p style={styles.artist}>{song.artist}</p>
            <p style={styles.chords}>Chords: {song.chords}</p>
            <span style={{
              ...styles.badge,
              backgroundColor: song.difficulty === 'EASY' ? '#2ecc71' :
                song.difficulty === 'INTERMEDIATE' ? '#f39c12' : '#e74c3c'
            }}>
              {song.difficulty}
            </span>
          </div>
        ))}
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
  input: {
    display: 'block',
    width: '100%',
    maxWidth: '500px',
    margin: '0 auto 30px auto',
    padding: '12px 20px',
    fontSize: '16px',
    borderRadius: '8px',
    border: '1px solid #e94560',
    backgroundColor: '#16213e',
    color: 'white',
    outline: 'none'
  },
  list: {
    maxWidth: '500px',
    margin: '0 auto'
  },
  card: {
    backgroundColor: '#16213e',
    borderRadius: '12px',
    padding: '20px',
    marginBottom: '15px',
    border: '1px solid #0f3460'
  },
  songName: {
    fontSize: '18px',
    color: 'white',
    marginBottom: '5px'
  },
  artist: {
    color: '#a8a8b3',
    fontSize: '14px',
    marginBottom: '8px'
  },
  chords: {
    color: '#e94560',
    fontSize: '14px',
    marginBottom: '8px'
  },
  badge: {
    padding: '4px 10px',
    borderRadius: '20px',
    fontSize: '12px',
    color: 'white',
    fontWeight: 'bold'
  }
};

export default Search;