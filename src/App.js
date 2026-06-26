import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Search from './pages/Search';
import Tuner from './pages/Tuner';
import ChordVisualizer from './pages/ChordVisualizer';
import Progress from './pages/Progress';
import SongDetail from './pages/SongDetail';
import ChordSimplifier from './pages/ChordSimplifier';
import Reminders from './pages/Reminders';

function Navbar() {
  const location = useLocation();

  const links = [
    { path: '/', label: '🏠 Home' },
    { path: '/search', label: '🔍 Search' },
    { path: '/tuner', label: '🎸 Tuner' },
    { path: '/chords', label: '🎼 Chords' },
    { path: '/progress', label: '📈 Progress' },
    { path: '/simplifier', label: '🔁 Simplifier' },
    { path: '/reminders', label: '⏰ Reminders' },
  ];

  return (
    <nav style={styles.nav}>
      <span style={styles.logo}>🎵 Ukulelify</span>
      <div style={styles.links}>
        {links.map(link => (
          <Link
            key={link.path}
            to={link.path}
            style={{
              ...styles.link,
              backgroundColor: location.pathname === link.path ? '#e94560' : 'transparent',
              color: 'white'
            }}
          >
            {link.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/simplifier" element={<ChordSimplifier />} />
        <Route path="/search" element={<Search />} />
        <Route path="/tuner" element={<Tuner />} />
        <Route path="/chords" element={<ChordVisualizer />} />
        <Route path="/progress" element={<Progress />} />
        <Route path="/song" element={<SongDetail />} />
        <Route path="/reminders" element={<Reminders />} />
      </Routes>
    </BrowserRouter>
  );
}

const styles = {
  nav: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 30px',
    height: '60px',
    backgroundColor: '#12121f',
    borderBottom: '1px solid #e94560',
    position: 'sticky',
    top: 0,
    zIndex: 100
  },
  logo: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#e94560',
    fontFamily: 'Arial, sans-serif'
  },
  links: {
    display: 'flex',
    gap: '8px'
  },
  link: {
    padding: '6px 14px',
    borderRadius: '20px',
    fontSize: '13px',
    textDecoration: 'none',
    fontFamily: 'Arial, sans-serif',
    transition: 'background 0.2s'
  }
};

export default App;