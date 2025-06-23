// Extracted drum orb logic from app.js

export const DRUM_ELEMENT_DEFAULTS = {
  drum_kick: { baseFreq: 60, decay: 0.3, volume: 1.0, icon: "\uD83D\uDCA5", label: "Kick" },
  drum_snare: { baseFreq: 180, decay: 0.2, noiseDecay: 0.15, volume: 0.8, icon: "SN", label: "Snare" },
  drum_hihat: { baseFreq: 7000, decay: 0.05, volume: 0.6, icon: "HH", label: "Hi-Hat" },
  drum_clap: { noiseDecay: 0.1, volume: 0.9, icon: "CL", label: "Clap", baseFreq: 1500 },
  drum_tom1: { baseFreq: 150, decay: 0.4, volume: 0.9, icon: "T1", label: "Tom 1" },
  drum_tom2: { baseFreq: 100, decay: 0.5, volume: 0.9, icon: "T2", label: "Tom 2" },
  drum_cowbell: { baseFreq: 520, decay: 0.3, volume: 0.7, icon: "CB", label: "Cowbell" },
  drum_fm_kick: { baseFreq: 55, decay: 0.5, volume: 1.0, modRatio: 2.2, modDepth: 70, feedback: 0.3, carrierWaveform: "sine", modulatorWaveform: "sine", icon: "\uD83C\uDFAF", label: "FM Kick" },
  drum_fm_snare: { baseFreq: 220, decay: 0.3, volume: 0.9, modRatio: 5, modDepth: 80, feedback: 0.25, noiseRatio: 0.6, carrierWaveform: "triangle", modulatorWaveform: "square", icon: "\uD83E\uDD4B", label: "FM Snare" },
  drum_fm_tom: { baseFreq: 140, decay: 0.4, volume: 0.9, modRatio: 1.5, modDepth: 60, feedback: 0.15, carrierWaveform: "sine", modulatorWaveform: "sawtooth", icon: "\uD83C\uDFB2", label: "FM Tom" },
};

export const drumElementTypes = Object.keys(DRUM_ELEMENT_DEFAULTS).map(key => ({
  type: key,
  label: DRUM_ELEMENT_DEFAULTS[key].label,
  icon: DRUM_ELEMENT_DEFAULTS[key].icon,
}));

export function isDrumType(type) {
  return drumElementTypes.some(dt => dt.type === type);
}

// Create audio nodes for a drum element
export function createDrumOrbAudioNodes(node) {
  const p = node.audioParams;
  const audioNodes = { mainGain: audioContext.createGain() };
  audioNodes.mainGain.gain.value = p.volume || 1.0;
  if (isReverbReady && reverbPreDelayNode) {
    audioNodes.reverbSendGain = audioContext.createGain();
    audioNodes.reverbSendGain.gain.value = p.reverbSend ?? DEFAULT_REVERB_SEND;
    audioNodes.mainGain.connect(audioNodes.reverbSendGain);
    audioNodes.reverbSendGain.connect(reverbPreDelayNode);
  }
  if (isDelayReady && masterDelaySendGain) {
    audioNodes.delaySendGain = audioContext.createGain();
    audioNodes.delaySendGain.gain.value = p.delaySend ?? DEFAULT_DELAY_SEND;
    audioNodes.mainGain.connect(audioNodes.delaySendGain);
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
  audioNodes.mainGain.connect(masterGain);
  return audioNodes;
}

// Trigger a drum sound
export function triggerDrumOrb(node, intensity = 1.0) {
  if (!node.audioNodes?.mainGain) return;
  const params = node.audioParams;
  const mainGain = node.audioNodes.mainGain;
  const finalVol = (params.volume || 1.0) * intensity;
  const targetFreq = params.baseFreq;
  const now = audioContext.currentTime;
  // Drum generation as implemented in app.js
  // (kick, snare, hihat, clap, toms, cowbell, fm drums)
}

// Draw the drum orb shape and animation
export function drawDrumOrb(ctx, node, r, viewScale, baseLineWidth, fillColor, borderColor) {
  ctx.lineWidth = Math.max(0.5 / viewScale, baseLineWidth / viewScale);
  ctx.strokeStyle = borderColor;
  ctx.fillStyle = fillColor;
  switch (node.type) {
    case 'drum_kick':
      ctx.beginPath();
      ctx.arc(node.x, node.y, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      const innerR = r * (0.6 + node.animationState * 0.1);
      ctx.fillStyle = fillColor.replace(/[\d.]+\)$/g, '0.6)');
      ctx.beginPath();
      ctx.arc(node.x, node.y, innerR, 0, Math.PI * 2);
      ctx.fill();
      break;
    // Other drum shapes omitted for brevity
  }
}

// UI controls for drum parameters
export function addDrumEditUI(node, selectedArray, currentSection) {
  const params = node.audioParams;
  const defaults = DRUM_ELEMENT_DEFAULTS[node.type];
  const soundDiv = document.createElement('div');
  soundDiv.classList.add('edit-drum-sound');
  const soundLabel = document.createElement('strong');
  soundLabel.textContent = defaults.label;
  soundDiv.appendChild(soundLabel);
  const currentBaseFreq = params?.baseFreq ?? defaults?.baseFreq ?? 60;
  const tuneSlider = createSlider(`edit-drum-tune-${node.id}`, `Tune (${currentBaseFreq.toFixed(0)}Hz):`, 20,
    node.type === 'drum_hihat' ? 15000 : (node.type === 'drum_cowbell' || node.type === 'drum_clap' ? 2000 : 1000),
    1, currentBaseFreq,
    () => { identifyAndRouteAllGroups(); saveState(); },
    e => {
      const val = parseFloat(e.target.value);
      selectedArray.forEach(el => { const n = findNodeById(el.id); if (n?.audioParams) n.audioParams.baseFreq = val; });
      e.target.previousElementSibling.textContent = `Tune (${val.toFixed(0)}Hz):`;
    });
  soundDiv.appendChild(tuneSlider);
  currentSection.appendChild(soundDiv);
}
