import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Search from './pages/Search';
import Tuner from './pages/Tuner';
import ChordVisualizer from './pages/ChordVisualizer';
import Progress from './pages/Progress';

function App() {
  return (
    <BrowserRouter>
      <nav>
        <Link to="/">Home</Link> |
        <Link to="/search"> Search</Link> |
        <Link to="/tuner"> Tuner</Link> |
        <Link to="/chords"> Chords</Link> |
        <Link to="/progress"> Progress</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<Search />} />
        <Route path="/tuner" element={<Tuner />} />
        <Route path="/chords" element={<ChordVisualizer />} />
        <Route path="/progress" element={<Progress />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;