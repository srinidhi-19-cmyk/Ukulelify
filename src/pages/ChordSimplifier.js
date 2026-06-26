import { useState } from 'react';

const SIMPLIFY_MAP = {
  'E': 'Em',
  'B': 'Bm',
  'F#': 'F',
  'C#': 'C',
  'Db': 'C',
  'Eb': 'D',
  'Ab': 'Am',
  'Bb': 'A',
  'E7': 'Em',
  'A7': 'Am',
  'G7': 'G',
  'B7': 'Bm',
  'Gm': 'G',
};

const BEGINNER_CHORDS = ['C', 'D', 'Em', 'F', 'G', 'Am', 'Dm', 'A'];

function simplifyChord(chord) {
  if (BEGINNER_CHORDS.includes(chord)) return chord;
  return SIMPLIFY_MAP[chord] || chord;
}

function ChordSimplifier() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState(null);

  const simplify = () => {
    if (!input.trim()) return;
    const chords = input.split('-').map(c => c.trim());
    const simplified = chords.map(chord => ({
      original: chord,
      simplified: simplifyChord(chord),
      changed: simplifyChord(chord) !== chord
    }));
    setResult(simplified);
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>🔁 Chord Simplifier</h1>
      <p style={styles.subtitle}>Enter chords separated by dashes — get beginner friendly version</p>

      <div style={styles.inputRow}>
        <input
          style={styles.input}
          placeholder="e.g. Am-F-C-G-E7-Dm"
          value={input}
          onChange={e => setInput(e.target.value)}
        />
        <button style={styles.btn} onClick={simplify}>Simplify</button>
      </div>

      {result && (
        <div style={styles.result}>
          <h3 style={styles.resultTitle}>Simplified Chords</h3>

          <div style={styles.chordRow}>
            {result.map((item, i) => (
              <div key={i} style={styles.chordCard}>
                <div style={styles.originalChord}>{item.original}</div>
                {item.changed && (
                  <div style={styles.arrow}>↓</div>
                )}
                <div style={{
                  ...styles.simplifiedChord,
                  backgroundColor: item.changed ? '#e94560' : '#2ecc71'
                }}>
                  {item.simplified}
                </div>
                {item.changed && (
                  <div style={styles.changedLabel}>simplified</div>
                )}
              </div>
            ))}
          </div>

          <div style={styles.progressionBox}>
            <p style={styles.progressionLabel}>Your simplified progression:</p>
            <p style={styles.progression}>
              {result.map(r => r.simplified).join(' → ')}
            </p>
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
    marginBottom: '10px'
  },
  subtitle: {
    color: '#a8a8b3',
    fontSize: '14px',
    marginBottom: '30px'
  },
  inputRow: {
    display: 'flex',
    justifyContent: 'center',
    gap: '10px',
    marginBottom: '30px',
    flexWrap: 'wrap'
  },
  input: {
    padding: '12px 20px',
    fontSize: '16px',
    borderRadius: '8px',
    border: '1px solid #e94560',
    backgroundColor: '#16213e',
    color: 'white',
    outline: 'none',
    width: '300px'
  },
  btn: {
    padding: '12px 24px',
    fontSize: '16px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: '#e94560',
    color: 'white',
    cursor: 'pointer'
  },
  result: {
    backgroundColor: '#16213e',
    borderRadius: '16px',
    padding: '30px',
    maxWidth: '600px',
    margin: '0 auto',
    border: '1px solid #0f3460'
  },
  resultTitle: {
    fontSize: '20px',
    color: '#e94560',
    marginBottom: '20px'
  },
  chordRow: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: '15px',
    marginBottom: '25px'
  },
  chordCard: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '4px'
  },
  originalChord: {
    fontSize: '16px',
    color: '#a8a8b3'
  },
  arrow: {
    fontSize: '12px',
    color: '#a8a8b3'
  },
  simplifiedChord: {
    padding: '10px 16px',
    borderRadius: '8px',
    fontSize: '20px',
    fontWeight: 'bold',
    color: 'white',
    minWidth: '50px',
    textAlign: 'center'
  },
  changedLabel: {
    fontSize: '10px',
    color: '#a8a8b3'
  },
  progressionBox: {
    backgroundColor: '#1a1a2e',
    borderRadius: '8px',
    padding: '15px',
    marginTop: '10px'
  },
  progressionLabel: {
    color: '#a8a8b3',
    fontSize: '13px',
    marginBottom: '8px'
  },
  progression: {
    color: 'white',
    fontSize: '20px',
    fontWeight: 'bold',
    letterSpacing: '2px'
  }
};

export default ChordSimplifier;