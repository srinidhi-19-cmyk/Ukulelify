import { useState, useEffect, useRef } from 'react';

const UKULELE_STRINGS = [
  { name: 'G', frequency: 392.0 },
  { name: 'C', frequency: 261.6 },
  { name: 'E', frequency: 329.6 },
  { name: 'A', frequency: 440.0 },
];

function getClosestString(frequency) {
  return UKULELE_STRINGS.reduce((prev, curr) =>
    Math.abs(curr.frequency - frequency) < Math.abs(prev.frequency - frequency) ? curr : prev
  );
}

function getNote(frequency) {
  const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  const noteNum = 12 * (Math.log(frequency / 440) / Math.log(2));
  return notes[(Math.round(noteNum) + 69) % 12];
}

function autocorrelate(buffer, sampleRate) {
  let SIZE = buffer.length;
  let rms = 0;
  for (let i = 0; i < SIZE; i++) rms += buffer[i] * buffer[i];
  rms = Math.sqrt(rms / SIZE);
  if (rms < 0.01) return -1;

  let r1 = 0, r2 = SIZE - 1;
  for (let i = 0; i < SIZE / 2; i++) if (Math.abs(buffer[i]) < 0.2) { r1 = i; break; }
  for (let i = 1; i < SIZE / 2; i++) if (Math.abs(buffer[SIZE - i]) < 0.2) { r2 = SIZE - i; break; }
  buffer = buffer.slice(r1, r2);
  SIZE = buffer.length;

  let c = new Array(SIZE).fill(0);
  for (let i = 0; i < SIZE; i++)
    for (let j = 0; j < SIZE - i; j++)
      c[i] = c[i] + buffer[j] * buffer[j + i];

  let d = 0;
  while (c[d] > c[d + 1]) d++;
  let maxval = -1, maxpos = -1;
  for (let i = d; i < SIZE; i++) {
    if (c[i] > maxval) { maxval = c[i]; maxpos = i; }
  }
  let T0 = maxpos;
  let x1 = c[T0 - 1], x2 = c[T0], x3 = c[T0 + 1];
  let a = (x1 + x3 - 2 * x2) / 2;
  let b = (x3 - x1) / 2;
  if (a) T0 = T0 - b / (2 * a);
  return sampleRate / T0;
}

function Tuner() {
  const [mode, setMode] = useState('auto');
  const [isListening, setIsListening] = useState(false);
  const [pitch, setPitch] = useState(null);
  const [note, setNote] = useState(null);
  const [status, setStatus] = useState('');
  const [cents, setCents] = useState(0);
  const [selectedString, setSelectedString] = useState(UKULELE_STRINGS[3]);
  const [detectedString, setDetectedString] = useState(null);

  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const animationRef = useRef(null);
  const streamRef = useRef(null);
  const pitchHistoryRef = useRef([]);

  const startListening = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    streamRef.current = stream;
    audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    analyserRef.current = audioContextRef.current.createAnalyser();
    const source = audioContextRef.current.createMediaStreamSource(stream);
    source.connect(analyserRef.current);
    analyserRef.current.fftSize = 4096;
    setIsListening(true);
    detect();
  };

  const stopListening = () => {
    if (animationRef.current) cancelAnimationFrame(animationRef.current);
    if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
    if (audioContextRef.current) audioContextRef.current.close();
    setIsListening(false);
    setPitch(null);
    setNote(null);
    setStatus('');
    setCents(0);
    pitchHistoryRef.current = [];
  };

  const detect = () => {
    const buffer = new Float32Array(analyserRef.current.fftSize);
    analyserRef.current.getFloatTimeDomainData(buffer);
    const frequency = autocorrelate(buffer, audioContextRef.current.sampleRate);

    if (frequency !== -1) {
      pitchHistoryRef.current.push(frequency);
      if (pitchHistoryRef.current.length > 8) pitchHistoryRef.current.shift();
      const smoothed = pitchHistoryRef.current.reduce((a, b) => a + b) / pitchHistoryRef.current.length;

      setPitch(Math.round(smoothed));
      setNote(getNote(smoothed));

      const target = mode === 'auto' ? getClosestString(smoothed) : selectedString;
      if (mode === 'auto') setDetectedString(target);

      const diff = smoothed - target.frequency;
      const centsOff = Math.round((diff / target.frequency) * 1200);
      setCents(Math.max(-50, Math.min(50, centsOff)));

      if (Math.abs(diff) < 5) setStatus('in tune');
      else if (diff > 0) setStatus('too high');
      else setStatus('too low');
    }

    animationRef.current = requestAnimationFrame(detect);
  };

  useEffect(() => { return () => stopListening(); }, []);

  const needleLeft = 50 + cents;
  const isInTune = status === 'in tune';
  const activeString = mode === 'auto' ? detectedString : selectedString;

  return (
    <div style={styles.container}>

      {/* Needle Section */}
      <div style={styles.needleSection}>
        <div style={styles.needleTrack}>
          {[-40, -20, 0, 20, 40].map(pos => (
            <div key={pos} style={{ ...styles.tick, left: `${50 + pos}%` }}>
              <div style={styles.tickLine} />
              <span style={styles.tickLabel}>{pos === 0 ? '♭' : pos === 40 ? '♯' : pos}</span>
            </div>
          ))}
          {isListening && pitch && (
            <div style={{
              ...styles.needle,
              left: `${needleLeft}%`,
              backgroundColor: isInTune ? '#2ecc71' : 'white'
            }} />
          )}
        </div>
      </div>

      {/* Note Display */}
      <div style={styles.noteSection}>
        <div style={{ ...styles.noteLetter, color: isInTune ? '#2ecc71' : 'white' }}>
          {note || '-'}
        </div>
        <div style={styles.freqText}>
          {pitch ? `${pitch} Hz` : 'Play a string...'}
        </div>
        {activeString && isListening && (
          <div style={styles.targetText}>
            Target: {activeString.name} — {activeString.frequency} Hz
          </div>
        )}
        <div style={{
          ...styles.statusText,
          color: isInTune ? '#2ecc71' : status === 'too high' ? '#e74c3c' : '#f39c12'
        }}>
          {status === 'in tune' ? '✅ In Tune' :
           status === 'too high' ? '⬆️ Too High' :
           status === 'too low' ? '⬇️ Too Low' : ''}
        </div>
      </div>

      {/* String Buttons — left and right like real tuner */}
      <div style={styles.stringsLayout}>
        <div style={styles.leftStrings}>
          <button
            style={{ ...styles.stringBtn, backgroundColor: activeString?.name === 'C' ? '#e94560' : '#2a2a3e' }}
            onClick={() => { setSelectedString(UKULELE_STRINGS[1]); setMode('manual'); }}
          >
            <span style={styles.stringName}>C</span>
            <span style={styles.stringFreq}>261.6</span>
          </button>
          <button
            style={{ ...styles.stringBtn, backgroundColor: activeString?.name === 'G' ? '#e94560' : '#2a2a3e' }}
            onClick={() => { setSelectedString(UKULELE_STRINGS[0]); setMode('manual'); }}
          >
            <span style={styles.stringName}>G</span>
            <span style={styles.stringFreq}>392.0</span>
          </button>
        </div>

        {/* Center Start Button */}
        <button
          style={{
            ...styles.mainBtn,
            backgroundColor: isListening ? '#e74c3c' : '#e94560'
          }}
          onClick={isListening ? stopListening : startListening}
        >
          {isListening ? '⏹ Stop' : '▶ Start'}
        </button>

        <div style={styles.rightStrings}>
          <button
            style={{ ...styles.stringBtn, backgroundColor: activeString?.name === 'E' ? '#e94560' : '#2a2a3e' }}
            onClick={() => { setSelectedString(UKULELE_STRINGS[2]); setMode('manual'); }}
          >
            <span style={styles.stringName}>E</span>
            <span style={styles.stringFreq}>329.6</span>
          </button>
          <button
            style={{ ...styles.stringBtn, backgroundColor: activeString?.name === 'A' ? '#e94560' : '#2a2a3e' }}
            onClick={() => { setSelectedString(UKULELE_STRINGS[3]); setMode('manual'); }}
          >
            <span style={styles.stringName}>A</span>
            <span style={styles.stringFreq}>440.0</span>
          </button>
        </div>
      </div>

      {/* Mode Toggle */}
      <div style={styles.modeRow}>
        {['auto', 'manual'].map(m => (
          <button
            key={m}
            style={{
              ...styles.modeBtn,
              backgroundColor: mode === m ? '#e94560' : 'transparent',
              border: '1px solid #e94560'
            }}
            onClick={() => setMode(m)}
          >
            {m.charAt(0).toUpperCase() + m.slice(1)}
          </button>
        ))}
      </div>

    </div>
  );
}

const styles = {
  container: {
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#12121f',
    minHeight: '100vh',
    color: 'white',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px'
  },
  needleSection: {
    width: '100%',
    maxWidth: '500px',
    marginBottom: '10px',
    marginTop: '20px'
  },
  needleTrack: {
    position: 'relative',
    height: '80px',
    backgroundColor: '#1e1e2e',
    borderRadius: '8px',
    overflow: 'hidden'
  },
  tick: {
    position: 'absolute',
    transform: 'translateX(-50%)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    top: 0,
    height: '100%'
  },
  tickLine: {
    width: '1px',
    height: '50%',
    backgroundColor: '#555'
  },
  tickLabel: {
    fontSize: '11px',
    color: '#888',
    marginTop: '4px'
  },
  needle: {
    position: 'absolute',
    top: 0,
    width: '3px',
    height: '100%',
    transform: 'translateX(-50%)',
    borderRadius: '3px',
    transition: 'left 0.15s ease'
  },
  noteSection: {
    margin: '20px 0',
  },
  noteLetter: {
    fontSize: '90px',
    fontWeight: 'bold',
    lineHeight: 1
  },
  freqText: {
    fontSize: '16px',
    color: '#888',
    margin: '8px 0'
  },
  targetText: {
    fontSize: '13px',
    color: '#666',
    marginBottom: '6px'
  },
  statusText: {
    fontSize: '20px',
    fontWeight: 'bold',
    marginTop: '6px'
  },
  stringsLayout: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '30px',
    margin: '30px 0'
  },
  leftStrings: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px'
  },
  rightStrings: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px'
  },
  stringBtn: {
    width: '70px',
    height: '70px',
    borderRadius: '50%',
    border: 'none',
    color: 'white',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '3px'
  },
  stringName: {
    fontSize: '22px',
    fontWeight: 'bold'
  },
  stringFreq: {
    fontSize: '10px',
    color: '#ccc'
  },
  mainBtn: {
    width: '100px',
    height: '100px',
    borderRadius: '50%',
    border: 'none',
    color: 'white',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 'bold'
  },
  modeRow: {
    display: 'flex',
    gap: '10px',
    marginTop: '10px'
  },
  modeBtn: {
    padding: '8px 24px',
    borderRadius: '20px',
    color: 'white',
    cursor: 'pointer',
    fontSize: '14px'
  }
};

export default Tuner;