import { MusicTrack, NISFY_MUSIC_CATALOG, getAllAvailableTracks } from '../data/musicThemes';

export type AudioPlaybackState = 'playing' | 'paused' | 'stopped';

type MusicEventListener = (track: MusicTrack | null, state: AudioPlaybackState, currentTime: number) => void;

class MusicAudioEngine {
  private ctx: AudioContext | null = null;
  private currentTrack: MusicTrack | null = null;
  private playbackState: AudioPlaybackState = 'stopped';
  private audioElem: HTMLAudioElement | null = null;
  private youtubeIframe: HTMLIFrameElement | null = null;
  private synthInterval: number | null = null;
  private isMuted: boolean = false;
  private volume: number = 0.7;
  private listeners: Set<MusicEventListener> = new Set();
  private currentTime: number = 0;
  private duration: number = 30;
  private timerRef: number | null = null;

  constructor() {
    // Lazy initialized on first user gesture
  }

  private initAudioContext() {
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public subscribe(listener: MusicEventListener): () => void {
    this.listeners.add(listener);
    listener(this.currentTrack, this.playbackState, this.currentTime);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach((listener) => {
      listener(this.currentTrack, this.playbackState, this.currentTime);
    });
  }

  public getCurrentTrack(): MusicTrack | null {
    return this.currentTrack;
  }

  public getPlaybackState(): AudioPlaybackState {
    return this.playbackState;
  }

  public isSoundMuted(): boolean {
    return this.isMuted;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (this.audioElem) {
      this.audioElem.muted = muted;
    }
    if (this.youtubeIframe && this.youtubeIframe.contentWindow) {
      const command = muted
        ? '{"event":"command","func":"mute","args":""}'
        : '{"event":"command","func":"unMute","args":""}';
      this.youtubeIframe.contentWindow.postMessage(command, '*');
    }
    this.notify();
  }

  public toggleMute(): boolean {
    this.setMuted(!this.isMuted);
    return this.isMuted;
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.audioElem) {
      this.audioElem.volume = this.volume;
    }
    if (this.youtubeIframe && this.youtubeIframe.contentWindow) {
      const command = JSON.stringify({
        event: 'command',
        func: 'setVolume',
        args: [Math.round(this.volume * 100)],
      });
      this.youtubeIframe.contentWindow.postMessage(command, '*');
    }
  }

  public play(track: MusicTrack) {
    this.playTrack(track);
  }

  public playTrack(track: MusicTrack) {
    this.initAudioContext();

    if (this.currentTrack?.id === track.id && this.playbackState === 'playing') {
      return;
    }

    this.stop();
    this.currentTrack = track;
    this.playbackState = 'playing';
    this.currentTime = 0;
    this.duration = track.duration || 45;

    // Handle YouTube Video Playback if track is from YouTube
    if (track.youtubeId) {
      this.playYouTubeTrack(track.youtubeId);
    } else {
      // Start Synthesizer Rhythm Engine + Web Audio harmonic loop
      this.startSynthMelody(track);

      // Also attempt HTMLAudio fallback if network allows
      if (track.audioUrl) {
        try {
          if (!this.audioElem) {
            this.audioElem = new Audio();
            this.audioElem.crossOrigin = 'anonymous';
          }
          this.audioElem.src = track.audioUrl;
          this.audioElem.volume = this.volume * 0.4;
          this.audioElem.muted = this.isMuted;
          this.audioElem.loop = true;
          this.audioElem.play().catch(() => {
            // Audio elements might be blocked, the WebAudio synth will continue smoothly
          });
        } catch {
          // Continue with synth
        }
      }
    }

    this.startTimer();
    this.notify();
  }

  private playYouTubeTrack(youtubeId: string) {
    this.cleanupYouTubePlayer();

    try {
      let container = document.getElementById('nisfy-yt-player-container');
      if (!container) {
        container = document.createElement('div');
        container.id = 'nisfy-yt-player-container';
        container.style.position = 'fixed';
        container.style.bottom = '0';
        container.style.right = '0';
        container.style.width = '1px';
        container.style.height = '1px';
        container.style.opacity = '0.01';
        container.style.pointerEvents = 'none';
        container.style.zIndex = '-999';
        document.body.appendChild(container);
      }

      const iframe = document.createElement('iframe');
      iframe.id = 'nisfy-yt-iframe';
      iframe.width = '1';
      iframe.height = '1';
      iframe.src = `https://www.youtube.com/embed/${youtubeId}?enablejsapi=1&autoplay=1&controls=0&disablekb=1&fs=0&loop=1&playsinline=1&origin=${encodeURIComponent(window.location.origin)}`;
      iframe.allow = 'autoplay; encrypted-media';
      iframe.style.border = 'none';

      container.innerHTML = '';
      container.appendChild(iframe);
      this.youtubeIframe = iframe;
    } catch {
      // YouTube fallback
    }
  }

  private cleanupYouTubePlayer() {
    if (this.youtubeIframe) {
      try {
        if (this.youtubeIframe.contentWindow) {
          this.youtubeIframe.contentWindow.postMessage('{"event":"command","func":"stopVideo","args":""}', '*');
        }
      } catch {
        // Ignored
      }
      this.youtubeIframe.remove();
      this.youtubeIframe = null;
    }
    const container = document.getElementById('nisfy-yt-player-container');
    if (container) {
      container.innerHTML = '';
    }
  }

  public pause() {
    if (this.playbackState === 'playing') {
      this.playbackState = 'paused';
      this.stopSynth();
      if (this.audioElem) {
        this.audioElem.pause();
      }
      if (this.youtubeIframe && this.youtubeIframe.contentWindow) {
        this.youtubeIframe.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
      }
      this.stopTimer();
      this.notify();
    }
  }

  public resume() {
    if (this.currentTrack && this.playbackState === 'paused') {
      if (this.currentTrack.youtubeId && this.youtubeIframe && this.youtubeIframe.contentWindow) {
        this.youtubeIframe.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
        this.playbackState = 'playing';
        this.startTimer();
        this.notify();
      } else {
        this.playTrack(this.currentTrack);
      }
    }
  }

  public togglePlay(track?: MusicTrack) {
    const allTracks = getAllAvailableTracks();
    const target = track || this.currentTrack || allTracks[0] || NISFY_MUSIC_CATALOG[0];
    if (this.currentTrack?.id === target.id) {
      if (this.playbackState === 'playing') {
        this.pause();
      } else {
        this.resume();
      }
    } else {
      this.playTrack(target);
    }
  }

  public stop() {
    this.playbackState = 'stopped';
    this.stopSynth();
    if (this.audioElem) {
      this.audioElem.pause();
      this.audioElem.currentTime = 0;
    }
    this.cleanupYouTubePlayer();
    this.stopTimer();
    this.currentTime = 0;
    this.notify();
  }

  private startTimer() {
    this.stopTimer();
    this.timerRef = window.setInterval(() => {
      this.currentTime += 0.5;
      if (this.currentTime >= this.duration) {
        this.currentTime = 0; // loop
      }
      this.notify();
    }, 500);
  }

  private stopTimer() {
    if (this.timerRef !== null) {
      clearInterval(this.timerRef);
      this.timerRef = null;
    }
  }

  // --- Realtime Algorithmic Algerian & Romantic Wedding Synth ---
  private startSynthMelody(track: MusicTrack) {
    this.stopSynth();
    if (!this.ctx || this.isMuted) return;

    let step = 0;
    const intervalMs = Math.round((60 / (track.bpm || 110)) * 250); // 16th note approx

    // Scale presets
    const PRESETS = {
      zorna_bendir: [587.33, 659.25, 739.99, 783.99, 880.0, 987.77, 1174.66], // Hijaz / Oriental festive scale
      chaabi_mandole: [440.0, 493.88, 523.25, 587.33, 659.25, 698.46, 783.99], // Bayati / Dorian Chaabi
      malouf_oud: [392.0, 440.0, 493.88, 523.25, 659.25, 783.99], // Andalou Malouf Nouba
      romantic_piano: [261.63, 329.63, 392.0, 493.88, 523.25, 659.25], // C Maj7 Sweet Wedding
      mediterranean_lounge: [329.63, 392.0, 440.0, 493.88, 587.33, 659.25], // Chill Paella Lounge
      kabyle_fete: [440.0, 493.88, 554.37, 659.25, 739.99, 880.0], // Kabyle folklore festive
      rai_electro: [293.66, 329.63, 349.23, 392.0, 440.0, 523.25, 587.33], // Oran Rai bassline
      cortege_royal: [523.25, 587.33, 659.25, 783.99, 880.0, 1046.5], // Ceremonial Wedding
    };

    const synthPresetKey = track.synthPreset || 'chaabi_mandole';
    const scale = PRESETS[synthPresetKey] || PRESETS.chaabi_mandole;

    this.synthInterval = window.setInterval(() => {
      if (!this.ctx || this.isMuted || this.playbackState !== 'playing') return;

      try {
        const now = this.ctx.currentTime;
        const noteFreq = scale[step % scale.length];
        const isBendirBeat = step % 4 === 0 || step % 4 === 2;

        // 1. Percussion (Bendir / Darbouka click)
        if (isBendirBeat) {
          const noiseBuffer = this.ctx.createBuffer(1, this.ctx.sampleRate * 0.05, this.ctx.sampleRate);
          const output = noiseBuffer.getChannelData(0);
          for (let i = 0; i < noiseBuffer.length; i++) {
            output[i] = Math.random() * 2 - 1;
          }
          const whiteNoise = this.ctx.createBufferSource();
          whiteNoise.buffer = noiseBuffer;

          const filter = this.ctx.createBiquadFilter();
          filter.type = step % 4 === 0 ? 'lowpass' : 'bandpass';
          filter.frequency.setValueAtTime(step % 4 === 0 ? 120 : 800, now);

          const gainNode = this.ctx.createGain();
          gainNode.gain.setValueAtTime(this.volume * (step % 4 === 0 ? 0.06 : 0.03), now);
          gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.05);

          whiteNoise.connect(filter);
          filter.connect(gainNode);
          gainNode.connect(this.ctx.destination);

          whiteNoise.start(now);
          whiteNoise.stop(now + 0.05);
        }

        // 2. Melody Note (Zorna / Mandole / Piano simulation)
        if (step % 2 === 0 || Math.random() > 0.4) {
          const osc = this.ctx.createOscillator();
          const osc2 = this.ctx.createOscillator();
          const noteGain = this.ctx.createGain();

          osc.type = track.synthPreset === 'romantic_piano' ? 'sine' : track.synthPreset === 'zorna_bendir' ? 'sawtooth' : 'triangle';
          osc.frequency.setValueAtTime(noteFreq, now);

          // Subtle harmonic detuning for rich acoustic texture
          osc2.type = 'sine';
          osc2.frequency.setValueAtTime(noteFreq * 1.002, now);

          const baseVolume = this.volume * 0.035;
          noteGain.gain.setValueAtTime(baseVolume, now);
          noteGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.3);

          osc.connect(noteGain);
          osc2.connect(noteGain);
          noteGain.connect(this.ctx.destination);

          osc.start(now);
          osc2.start(now);
          osc.stop(now + 0.35);
          osc2.stop(now + 0.35);
        }

        step++;
      } catch {
        // Audio fallback
      }
    }, intervalMs);
  }

  private stopSynth() {
    if (this.synthInterval !== null) {
      clearInterval(this.synthInterval);
      this.synthInterval = null;
    }
  }
}

export const musicAudioEngine = new MusicAudioEngine();

