// Procedural Web Audio API sound generator for ALTRON OS
// 100% standalone procedural audio with zero external asset dependencies

class AltronSoundEngine {
  private ctx: AudioContext | null = null;
  private isMusicPlaying: boolean = false;
  private musicInterval: any = null;
  private musicGain: GainNode | null = null;
  private ringtoneInterval: any = null;
  private currentTrackIndex: number = 0;
  private stepIndex: number = 0;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Sci-fi boot / startup hum
  public playBoot() {
    this.initContext();
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'sawtooth';
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(200, this.ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(1200, this.ctx.currentTime + 0.6);

    osc.frequency.setValueAtTime(110, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(440, this.ctx.currentTime + 0.5);

    gain.gain.setValueAtTime(0.01, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.2, this.ctx.currentTime + 0.2);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.8);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.85);
  }

  // Alexa / ChatGPT style Voice listening wake chime
  public playWakeChime() {
    this.initContext();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const tones = [
      { f: 440.00, t: 0, dur: 0.2, vol: 0.15 }, // A4
      { f: 659.25, t: 0.08, dur: 0.28, vol: 0.2 }, // E5
    ];
    tones.forEach(({ f, t, dur, vol }) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, now + t);
      gain.gain.setValueAtTime(0.001, now + t);
      gain.gain.linearRampToValueAtTime(vol, now + t + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + t + dur);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + t);
      osc.stop(now + t + dur + 0.02);
    });
  }

  // Affirmative command acknowledgement chime
  public playAcknowledge() {
    this.initContext();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const tones = [
      { f: 523.25, t: 0, dur: 0.18, vol: 0.14 }, // C5
      { f: 659.25, t: 0.06, dur: 0.22, vol: 0.16 }, // E5
      { f: 783.99, t: 0.12, dur: 0.28, vol: 0.18 }, // G5
    ];
    tones.forEach(({ f, t, dur, vol }) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, now + t);
      gain.gain.setValueAtTime(0.001, now + t);
      gain.gain.linearRampToValueAtTime(vol, now + t + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.001, now + t + dur);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + t);
      osc.stop(now + t + dur + 0.02);
    });
  }

  // Subtle tactile UI click
  public playClick() {
    this.initContext();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.exponentialRampToValueAtTime(400, now + 0.03);
    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.035);
  }

  // Camera shutter sound
  public playCameraClick() {
    this.initContext();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const bufferSize = this.ctx.sampleRate * 0.05;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = 1000;
    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);
    noise.start(now);
  }

  // Keypad DTMF touch tone
  public playKeypadTone(digit: string) {
    this.initContext();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const frequencies: { [k: string]: [number, number] } = {
      '1': [697, 1209], '2': [697, 1336], '3': [697, 1477],
      '4': [770, 1209], '5': [770, 1336], '6': [770, 1477],
      '7': [852, 1209], '8': [852, 1336], '9': [852, 1477],
      '*': [941, 1209], '0': [941, 1336], '#': [941, 1477]
    };
    const pair = frequencies[digit] || [770, 1336];
    pair.forEach(f => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = f;
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.15);
    });
  }

  // Ringtone step
  public playRingtoneStep() {
    this.initContext();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    [440, 480].forEach(f => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = f;
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.setValueAtTime(0.12, now + 0.8);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.9);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.95);
    });
  }

  public startRingtone() {
    this.stopRingtone();
    this.playRingtoneStep();
    this.ringtoneInterval = setInterval(() => {
      this.playRingtoneStep();
    }, 2800);
  }

  public stopRingtone() {
    if (this.ringtoneInterval) {
      clearInterval(this.ringtoneInterval);
      this.ringtoneInterval = null;
    }
  }

  // HIGH-ENERGY PROCEDURAL MUSIC SEQUENCER (Synthwave / Cyber Beat)
  // Plays rich synth lines, bass grooves, and rhythmic pulses frequently
  public toggleMusic(on?: boolean): boolean {
    this.initContext();
    if (!this.ctx) return false;

    const target = on !== undefined ? on : !this.isMusicPlaying;

    if (!target) {
      this.stopMusic();
      return false;
    }

    if (this.isMusicPlaying) return true;

    // Master Music Gain
    this.musicGain = this.ctx.createGain();
    this.musicGain.gain.setValueAtTime(0.01, this.ctx.currentTime);
    this.musicGain.gain.linearRampToValueAtTime(0.18, this.ctx.currentTime + 0.8);
    this.musicGain.connect(this.ctx.destination);

    // Bassline and Arpeggio scales (C minor pentatonic / Cyberpunk Dorian)
    const bassNotes = [65.41, 65.41, 77.78, 87.31, 65.41, 98.00, 87.31, 77.78]; // C2, Eb2, F2, G2
    const leadNotes = [261.63, 311.13, 392.00, 466.16, 523.25, 466.16, 392.00, 311.13]; // C4, Eb4, G4, Bb4, C5

    this.stepIndex = 0;
    this.isMusicPlaying = true;

    // Step sequencer running at 130 BPM (approx 115ms per 16th note)
    const stepDuration = 0.23; // Eighth note tempo
    this.musicInterval = setInterval(() => {
      if (!this.ctx || !this.musicGain || !this.isMusicPlaying) return;

      const now = this.ctx.currentTime;
      const step = this.stepIndex % 8;

      // 1. Kick Drum on step 0, 4
      if (step === 0 || step === 4) {
        const kickOsc = this.ctx.createOscillator();
        const kickGain = this.ctx.createGain();
        kickOsc.frequency.setValueAtTime(140, now);
        kickOsc.frequency.exponentialRampToValueAtTime(45, now + 0.08);
        kickGain.gain.setValueAtTime(0.25, now);
        kickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
        kickOsc.connect(kickGain);
        kickGain.connect(this.musicGain);
        kickOsc.start(now);
        kickOsc.stop(now + 0.2);
      }

      // 2. Hi-Hat on offbeats (1, 3, 5, 7)
      if (step % 2 !== 0) {
        const bufSize = this.ctx.sampleRate * 0.03;
        const buf = this.ctx.createBuffer(1, bufSize, this.ctx.sampleRate);
        const data = buf.getChannelData(0);
        for (let i = 0; i < bufSize; i++) data[i] = Math.random() * 2 - 1;
        const hat = this.ctx.createBufferSource();
        hat.buffer = buf;
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'highpass';
        filter.frequency.value = 6000;
        const hatGain = this.ctx.createGain();
        hatGain.gain.setValueAtTime(0.08, now);
        hatGain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
        hat.connect(filter);
        filter.connect(hatGain);
        hatGain.connect(this.musicGain);
        hat.start(now);
      }

      // 3. Cyber Synth Bass
      const bassOsc = this.ctx.createOscillator();
      const bassFilter = this.ctx.createBiquadFilter();
      const bassEnv = this.ctx.createGain();
      bassOsc.type = 'sawtooth';
      bassOsc.frequency.setValueAtTime(bassNotes[step], now);
      bassFilter.type = 'lowpass';
      bassFilter.frequency.setValueAtTime(600, now);
      bassEnv.gain.setValueAtTime(0.15, now);
      bassEnv.gain.exponentialRampToValueAtTime(0.001, now + stepDuration * 0.9);
      bassOsc.connect(bassFilter);
      bassFilter.connect(bassEnv);
      bassEnv.connect(this.musicGain);
      bassOsc.start(now);
      bassOsc.stop(now + stepDuration);

      // 4. Melodic Arp Lead
      const leadOsc = this.ctx.createOscillator();
      const leadGain = this.ctx.createGain();
      leadOsc.type = 'sine';
      leadOsc.frequency.setValueAtTime(leadNotes[(step + 2) % 8], now);
      leadGain.gain.setValueAtTime(0.1, now);
      leadGain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
      leadOsc.connect(leadGain);
      leadGain.connect(this.musicGain);
      leadOsc.start(now);
      leadOsc.stop(now + 0.22);

      this.stepIndex++;
    }, stepDuration * 1000);

    return true;
  }

  public stopMusic() {
    if (this.musicInterval) {
      clearInterval(this.musicInterval);
      this.musicInterval = null;
    }
    if (this.musicGain && this.ctx) {
      this.musicGain.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + 0.3);
    }
    setTimeout(() => {
      this.isMusicPlaying = false;
      this.stepIndex = 0;
    }, 350);
  }

  public getMusicPlayingState(): boolean {
    return this.isMusicPlaying;
  }
}

export const soundEngine = new AltronSoundEngine();
