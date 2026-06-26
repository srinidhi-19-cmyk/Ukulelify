import { useState } from 'react';

const CHORDS = {
  'C':  { fingers: [[3, 4]], barre: null, frets: [0, 0, 0, 3] },
  'Am': { fingers: [[2, 1]], barre: null, frets: [2, 0, 0, 0] },
  'F':  { fingers: [[1, 1], [2, 2]], barre: null, frets: [2, 0, 1, 0] },
  'G':  { fingers: [[1, 2], [2, 3], [3, 4]], barre: null, frets: [0, 2, 3, 2] },
  'Em': { fingers: [[4, 2], [3, 3]], barre: null, frets: [0, 4, 3, 2] },
  'Dm': { fingers: [[1, 2], [2, 3], [3, 4]], barre: null, frets: [2, 2, 1, 0] },
  'E':  { fingers: [[1, 1], [2, 2], [3, 2]], barre: null, frets: [4, 4, 4, 2] },
  'A':  { fingers: [[1, 1]], barre: null, frets: [2, 1, 0, 0] },
  'D':  { fingers: [[1, 2], [2, 2], [3, 2]], barre: null, frets: [2, 2, 2, 0] },
  'Gm': { fingers: [[1, 2], [2, 3]], barre: null, frets: [0, 2, 3, 1] },
  'Cm': { fingers: [[1, 3], [2, 4], [3, 4]], barre: null, frets: [0, 3, 3, 3] },
  'Bm': { fingers: [[1, 2], [2, 3], [3, 4]], barre: null, frets: [4, 2, 2, 2] },
};

function FretBoard({ frets }) {
  const strings = ['G', 'C', 'E', 'A'];
  
  const maxFret = Math.max(...frets);
  const startFret = maxFret > 4 ? maxFret - 3 : 1;

  return (
    <svg width="160" height="180" viewBox="0 0 160 180">
      {/* Nut */}
      <rect x="20" y="20" width="120" height="6" fill={startFret === 1 ? 'white' : '#555'} rx="2" />

      {/* Fret lines */}
      {[0, 1, 2, 3, 4].map(f => (
        <line key={f} x1="20" y1={26 + f * 36} x2="140" y2={26 + f * 36} stroke="#555" strokeWidth="1" />
      ))}

      {/* String lines */}
      {[0, 1, 2, 3].map(s => (
        <line key={s} x1={20 + s * 40} y1="20" x2={20 + s * 40} y2="170" stroke="#888" strokeWidth="1.5" />
      ))}

      {/* String labels */}
      {strings.map((s, i) => (
        <text key={s} x={20 + i * 40} y="14" textAnchor="middle" fill="#a8a8b3" fontSize="11">{s}</text>
      ))}

      {/* Finger dots */}
      {frets.map((fret, stringIndex) => {
        if (fret === 0) return (
          <text key={stringIndex} x={20 + stringIndex * 40} y="185" textAnchor="middle" fill="#2ecc71" fontSize="13">○</text>
        );
        const fretPos = fret - startFret + 1;
        const cy = 26 + (fretPos - 0.5) * 36;
        return (
          <circle key={stringIndex} cx={20 + stringIndex * 40} cy={cy} r="12" fill="#e94560" />
        );
      })}
    </svg>
  );
}

function ChordVisualizer() {
  const [selected, setSelected] = useState('C');
  const [search, setSearch] = useState('');

  const chordNames = Object.keys(CHORDS);
  const filtered = chordNames.filter(c => c.toLowerCase().includes(search.toLowerCase()));

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>🎼 Chord Visualizer</h1>

      <input
        style={styles.input}
        placeholder="Search chord (e.g. Am, G, Dm)..."
        value={search}
        onChange={e => setSearch(e.target.value)}
      />

      <div style={styles.chordGrid}>
        {filtered.map(chord => (
          <button
            key={chord}
            style={{
              ...styles.chordBtn,
              backgroundColor: selected === chord ? '#e94560' : '#16213e',
              border: selected === chord ? '1px solid #e94560' : '1px solid #0f3460'
            }}
            onClick={() => setSelected(chord)}
          >
            {chord}
          </button>
        ))}
      </div>

      {selected && CHORDS[selected] && (
        <div style={styles.display}>
          <h2 style={styles.chordName}>{selected} Chord</h2>
          <FretBoard frets={CHORDS[selected].frets} />
          <div style={styles.fretNumbers}>
            {CHORDS[selected].frets.map((f, i) => (
              <span key={i} style={styles.fretNum}>
                {f === 0 ? 'Open' : `Fret ${f}`}
              </span>
            ))}
          </div>
        </div>
      )}
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
  title: {
    fontSize: '36px',
    color: '#e94560',
    marginBottom: '20px'
  },
  input: {
    display: 'block',
    width: '100%',
    maxWidth: '400px',
    margin: '0 auto 20px auto',
    padding: '12px 20px',
    fontSize: '16px',
    borderRadius: '8px',
    border: '1px solid #e94560',
    backgroundColor: '#16213e',
    color: 'white',
    outline: 'none'
  },
  chordGrid: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: '10px',
    maxWidth: '500px',
    margin: '0 auto 30px auto'
  },
  chordBtn: {
    padding: '10px 18px',
    borderRadius: '8px',
    color: 'white',
    cursor: 'pointer',
    fontSize: '15px',
    fontWeight: 'bold'
  },
  display: {
    backgroundColor: '#16213e',
    borderRadius: '16px',
    padding: '30px',
    maxWidth: '280px',
    margin: '0 auto',
    border: '1px solid #0f3460'
  },
  chordName: {
    fontSize: '24px',
    color: '#e94560',
    marginBottom: '20px'
  },
  fretNumbers: {
    display: 'flex',
    justifyContent: 'space-around',
    marginTop: '15px'
  },
  fretNum: {
    fontSize: '11px',
    color: '#a8a8b3'
  }
};

export default ChordVisualizer;