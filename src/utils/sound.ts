let ctx: AudioContext | null = null;

function getCtx() {
  if (!ctx) ctx = new AudioContext();
  if (ctx.state === "suspended") ctx.resume();
  return ctx;
}

export function playVictory() {
  try {
    const ac = getCtx();
    const now = ac.currentTime;

    // Ascending arpeggio: C5 → E5 → G5 → C6, then a held chord
    const notes = [523.25, 659.25, 783.99, 1046.5];
    const arpeggioGap = 0.12;

    notes.forEach((freq, i) => {
      const t = now + i * arpeggioGap;
      const osc = ac.createOscillator();
      const gain = ac.createGain();
      osc.type = "triangle";
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.18, t + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);
      osc.connect(gain);
      gain.connect(ac.destination);
      osc.start(t);
      osc.stop(t + 0.35);
    });

    // Sustained chord after arpeggio
    const chordStart = now + notes.length * arpeggioGap + 0.05;
    [523.25, 659.25, 783.99].forEach((freq) => {
      const osc = ac.createOscillator();
      const gain = ac.createGain();
      osc.type = "sine";
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.12, chordStart);
      gain.gain.exponentialRampToValueAtTime(0.001, chordStart + 1.2);
      osc.connect(gain);
      gain.connect(ac.destination);
      osc.start(chordStart);
      osc.stop(chordStart + 1.2);
    });
  } catch {}
}

export function playTick() {
  try {
    const ac = getCtx();
    const now = ac.currentTime;

    // Noise burst — crisp click transient
    const bufferSize = Math.floor(ac.sampleRate * 0.035);
    const buffer = ac.createBuffer(1, bufferSize, ac.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;

    const noise = ac.createBufferSource();
    noise.buffer = buffer;

    const noiseFilter = ac.createBiquadFilter();
    noiseFilter.type = "highpass";
    noiseFilter.frequency.value = 2000;

    const noiseGain = ac.createGain();
    noiseGain.gain.setValueAtTime(0.08, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.025);

    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(ac.destination);
    noise.start(now);

    // Sine tone — body / thock
    const osc = ac.createOscillator();
    const oscGain = ac.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(1100, now);
    osc.frequency.exponentialRampToValueAtTime(700, now + 0.04);

    oscGain.gain.setValueAtTime(0.12, now);
    oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

    osc.connect(oscGain);
    oscGain.connect(ac.destination);
    osc.start(now);
    osc.stop(now + 0.04);
  } catch {}
}
