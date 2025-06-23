// Extracted analog synth orb logic from app.js

export const analogWaveformPresets = [
  {
    type: "sine",
    label: "Sine",
    icon: "\u25CB",
    details: {
      visualStyle: "analog_sine",
      osc1Level: 1,
      osc2Level: 0,
      ampEnv: { attack: 0.01, decay: 0.1, sustain: 0.02, release: 0.2 },
    },
  },
  {
    type: "square",
    label: "Square",
    icon: "\u25A1",
    details: {
      visualStyle: "analog_square",
      osc1Level: 1,
      osc2Level: 0,
      ampEnv: { attack: 0.01, decay: 0.1, sustain: 0.01, release: 0.01 },
    },
  },
  {
    type: "sawtooth",
    label: "Saw",
    icon: "\uD83D\uDCC8",
    details: {
      visualStyle: "analog_sawtooth",
      osc1Level: 1,
      osc2Level: 0,
      ampEnv: { attack: 0.005, decay: 0.2, sustain: 0.2, release: 0.2 },
    },
  },
  {
    type: "triangle",
    label: "Triangle",
    icon: "\u25B3",
    details: {
      visualStyle: "analog_triangle",
      osc1Level: 1,
      osc2Level: 0,
      ampEnv: { attack: 0.005, decay: 0.2, sustain: 0.2, release: 0.2 },
    },
  },
];

export const DEFAULT_ANALOG_SYNTH_PARAMS = {
  osc1Waveform: 'sawtooth',
  osc1Octave: 0,
  osc1Level: 0.7,
  osc2Enabled: true,
  osc2Waveform: 'square',
  osc2Octave: -1,
  osc2Detune: 0,
  osc2Level: 0.7,
  filterType: 'lowpass',
  filterCutoff: 4000,
  filterResonance: 1.0,
  filterEnvAmount: 2500,
  ampEnvAttack: 0.02,
  ampEnvDecay: 0.3,
  ampEnvSustain: 0.6,
  ampEnvRelease: 0.4,
  filterEnvAttack: 0.05,
  filterEnvDecay: 0.2,
  filterEnvSustain: 0.3,
  filterEnvRelease: 0.5,
  lfoEnabled: false,
  lfoTarget: 'filter',
  lfoWaveform: 'sine',
  lfoRate: 5.0,
  lfoAmount: 1000,
  lfo2Enabled: false,
  lfo2Target: 'filter',
  lfo2Waveform: 'sine',
  lfo2Rate: 2.0,
  lfo2Amount: 500,
  reverbSend: 0.1,
  delaySend: 0.1,
  visualStyle: 'prorb_default',
  ignoreGlobalSync: false,
};

export function createAnalogSynthOrb(node) {
  const p = node.audioParams;
  const audioNodes = {
    osc1: audioContext.createOscillator(),
    osc1Gain: audioContext.createGain(),
    osc2: audioContext.createOscillator(),
    osc2Gain: audioContext.createGain(),
    filter: audioContext.createBiquadFilter(),
    ampEnvControl: audioContext.createGain(),
    filterEnvControl: audioContext.createGain(),
    lfo: audioContext.createOscillator(),
    lfoGain: audioContext.createGain(),
    lfo2: audioContext.createOscillator(),
    lfo2Gain: audioContext.createGain(),
    mainGain: audioContext.createGain(),
    reverbSendGain: audioContext.createGain(),
    delaySendGain: audioContext.createGain(),
  };

  audioNodes.osc1.type = p.osc1Waveform;
  audioNodes.osc1.connect(audioNodes.osc1Gain);
  audioNodes.osc1Gain.gain.value = p.osc1Level ?? 1.0;
  audioNodes.osc1Gain.connect(audioNodes.filter);

  audioNodes.osc2.type = p.osc2Waveform;
  audioNodes.osc2.detune.value = p.osc2Detune;
  audioNodes.osc2.connect(audioNodes.osc2Gain);
  audioNodes.osc2Gain.gain.value = p.osc2Enabled ? (p.osc2Level ?? 1.0) : 0;
  audioNodes.osc2Gain.connect(audioNodes.filter);

  audioNodes.filter.type = p.filterType;
  audioNodes.filter.frequency.value = p.filterCutoff;
  audioNodes.filter.Q.value = p.filterResonance;
  audioNodes.filter.connect(audioNodes.ampEnvControl);

  audioNodes.ampEnvControl.gain.value = 0;
  audioNodes.ampEnvControl.connect(audioNodes.mainGain);

  audioNodes.filterEnvControl.gain.value = p.filterEnvAmount;
  audioNodes.filterEnvControl.connect(audioNodes.filter.frequency);

  audioNodes.lfo.type = p.lfoWaveform;
  audioNodes.lfo.frequency.value = p.lfoRate;
  audioNodes.lfoGain.gain.value = p.lfoEnabled ? p.lfoAmount : 0;
  audioNodes.lfo.connect(audioNodes.lfoGain);
  audioNodes.lfoGain.connect(audioNodes.filter.frequency);

  audioNodes.lfo2.type = p.lfo2Waveform;
  audioNodes.lfo2.frequency.value = p.lfo2Rate;
  audioNodes.lfo2Gain.gain.value = p.lfo2Enabled ? p.lfo2Amount : 0;
  audioNodes.lfo2.connect(audioNodes.lfo2Gain);
  audioNodes.lfo2Gain.connect(audioNodes.filter.frequency);

  audioNodes.mainGain.gain.value = 1.0;
  audioNodes.reverbSendGain.gain.value = p.reverbSend;
  audioNodes.delaySendGain.gain.value = p.delaySend;
  audioNodes.mainGain.connect(audioNodes.reverbSendGain);
  audioNodes.mainGain.connect(audioNodes.delaySendGain);

  if (isReverbReady && reverbPreDelayNode) {
    audioNodes.reverbSendGain.connect(reverbPreDelayNode);
  }
  if (isDelayReady && masterDelaySendGain) {
    audioNodes.delaySendGain.connect(masterDelaySendGain);
  }
  if (mistEffectInput) {
    audioNodes.mistSendGain = audioContext.createGain();
    audioNodes.mistSendGain.gain.value = 0;
    audioNodes.mainGain.connect(audioNodes.mistSendGain);
    audioNodes.mistSendGain.connect(mistEffectInput);
  }
  if (crushEffectInput) {
    audioNodes.crushSendGain = audioContext.createGain();
    audioNodes.crushSendGain.gain.value = 0;
    audioNodes.mainGain.connect(audioNodes.crushSendGain);
    audioNodes.crushSendGain.connect(crushEffectInput);
  }

  const now = audioContext.currentTime;
  try { audioNodes.osc1.start(now); } catch {}
  try { audioNodes.osc2.start(now); } catch {}
  try { audioNodes.lfo.start(now); } catch {}
  try { audioNodes.lfo2.start(now); } catch {}

  return audioNodes;
}
