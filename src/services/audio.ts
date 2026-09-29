// Audio services: Speech Synthesis for Ishant, Web Audio ambient sounds, Speech recognition helper

class AudioService {
  private audioCtx: AudioContext | null = null;
  private currentSource: AudioNode | null = null;
  private isPlayingAmbient = false;
  private ambientType: string | null = null;

  // Speech synthesis for Ishant
  public speak(text: string, onEnd?: () => void): void {
    if (!('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel(); // cancel any active speech

    // Clean markdown/symbols
    const cleanText = text
      .replace(/[*_#`~]/g, '')
      .replace(/\[.*?\]\(.*?\)/g, '')
      .replace(/\n+/g, ' ');

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 0.95; // gentle, relaxed pace
    utterance.pitch = 1.0;

    const voices = window.speechSynthesis.getVoices();
    // Prefer Indian English or Hindi or soft natural voices
    const preferredVoice = voices.find(
      (v) =>
        v.lang.includes('en-IN') ||
        v.lang.includes('hi-IN') ||
        v.name.toLowerCase().includes('india') ||
        v.name.toLowerCase().includes('natural')
    );

    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    if (onEnd) {
      utterance.onend = onEnd;
      utterance.onerror = onEnd;
    }

    window.speechSynthesis.speak(utterance);
  }

  public stopSpeaking(): void {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }

  // Play peaceful chime using Web Audio
  public playGentleChime(): void {
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      // Chord frequencies: D minor / serene pentatonic
      const freqs = [293.66, 369.99, 440.0, 587.33];

      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.12);

        gain.gain.setValueAtTime(0.001, now);
        gain.gain.exponentialRampToValueAtTime(0.08, now + idx * 0.12 + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.12 + 2.5);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.12);
        osc.stop(now + idx * 0.12 + 2.8);
      });
    } catch (e) {
      console.warn('Audio chime error:', e);
    }
  }

  // Ambient sound generator (Rain / Serene Breeze / Tibetan bowl)
  public toggleAmbientSound(type: 'rain' | 'breeze' | 'bowl'): boolean {
    if (this.isPlayingAmbient && this.ambientType === type) {
      this.stopAmbientSound();
      return false;
    }

    this.stopAmbientSound();
    const ctx = this.getAudioContext();
    if (!ctx) return false;

    if (type === 'rain') {
      // Synthesize soothing gentle rain using filtered white noise
      const bufferSize = ctx.sampleRate * 2;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(800, ctx.currentTime);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.06, ctx.currentTime);

      whiteNoise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      whiteNoise.start();
      this.currentSource = whiteNoise;
    } else if (type === 'breeze') {
      // Gentle warm resonant wind
      const bufferSize = ctx.sampleRate * 3;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        output[i] = (lastOut + 0.02 * white) / 1.02;
        lastOut = output[i];
        output[i] *= 3.5;
      }

      const brownNoise = ctx.createBufferSource();
      brownNoise.buffer = noiseBuffer;
      brownNoise.loop = true;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(320, ctx.currentTime);
      filter.Q.setValueAtTime(1.5, ctx.currentTime);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.12, ctx.currentTime);

      brownNoise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      brownNoise.start();
      this.currentSource = brownNoise;
    } else {
      // Singing bowl drone
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(216, ctx.currentTime); // 432Hz harmonic
      gain.gain.setValueAtTime(0.08, ctx.currentTime);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      this.currentSource = osc;
    }

    this.isPlayingAmbient = true;
    this.ambientType = type;
    return true;
  }

  public stopAmbientSound(): void {
    if (this.currentSource) {
      try {
        (this.currentSource as any).stop?.();
      } catch {
        // ignore
      }
      this.currentSource = null;
    }
    this.isPlayingAmbient = false;
    this.ambientType = null;
  }

  public getIsPlayingAmbient(): boolean {
    return this.isPlayingAmbient;
  }

  public getAmbientType(): string | null {
    return this.ambientType;
  }

  private getAudioContext(): AudioContext | null {
    if (!this.audioCtx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.audioCtx = new AudioCtx();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    return this.audioCtx;
  }
}

export const audioService = new AudioService();
