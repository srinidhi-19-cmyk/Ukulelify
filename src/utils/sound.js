export function playUkuleleString() {
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  
  // Create oscillator for the pluck sound
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  const filter = audioContext.createBiquadFilter();

  oscillator.connect(filter);
  filter.connect(gainNode);
  gainNode.connect(audioContext.destination);

  // Ukulele A string sound
  oscillator.frequency.setValueAtTime(440, audioContext.currentTime);
  oscillator.frequency.exponentialRampToValueAtTime(430, audioContext.currentTime + 0.1);
  oscillator.type = 'triangle';

  // Filter to make it sound more like ukulele
  filter.type = 'bandpass';
  filter.frequency.value = 1000;
  filter.Q.value = 0.5;

  // Pluck envelope — quick attack, slow decay
  gainNode.gain.setValueAtTime(0, audioContext.currentTime);
  gainNode.gain.linearRampToValueAtTime(0.8, audioContext.currentTime + 0.01);
  gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 1.5);

  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + 1.5);
}