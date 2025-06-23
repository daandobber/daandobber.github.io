// Extracted PrOrb orb logic from app.js

export const DEFAULT_PRORB_PARAMS = {
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

export function createPrOrbAudioNodes(node) {
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

export const prorbMenuConfig = {
  AMP: [
    { id: 'ampEnvAttack', label: 'Attack', min: 0.005, max: 2.0, step: 0.001, format: v => v.toFixed(2) },
    { id: 'ampEnvDecay', label: 'Decay', min: 0.01, max: 2.0, step: 0.01, format: v => v.toFixed(2) },
    { id: 'ampEnvSustain', label: 'Sustain', min: 0, max: 1, step: 0.01, format: v => v.toFixed(2) },
    { id: 'ampEnvRelease', label: 'Release', min: 0.01, max: 4.0, step: 0.01, format: v => v.toFixed(2) },
  ],
  FILTER: [
    { id: 'filterCutoff', label: 'Cutoff', min: 20, max: 20000, step: 1, format: v => `${v.toFixed(0)}` },
    { id: 'filterResonance', label: 'Reso', min: 0, max: 30, step: 0.1, format: v => v.toFixed(1) },
    { id: 'filterEnvAmount', label: 'Env Amt', min: 0, max: 8000, step: 10, format: v => `${v.toFixed(0)}` },
    { id: 'filterEnvAttack', label: 'Env Atk', min: 0.01, max: 2.0, step: 0.01, format: v => v.toFixed(2) },
    { id: 'filterEnvDecay', label: 'Env Dec', min: 0.01, max: 2.0, step: 0.01, format: v => v.toFixed(2) },
    { id: 'filterEnvSustain', label: 'Env Sus', min: 0, max: 1, step: 0.01, format: v => v.toFixed(2) },
    { id: 'filterEnvRelease', label: 'Env Rel', min: 0.01, max: 4.0, step: 0.01, format: v => v.toFixed(2) },
  ],
  OSC: [
    { id: 'osc1Level', label: 'Gain 1', min: 0, max: 1, step: 0.01, format: v => v.toFixed(2) },
    { id: 'osc2Level', label: 'Gain 2', min: 0, max: 1, step: 0.01, format: v => v.toFixed(2) },
    { id: 'osc1Octave', label: 'Oct 1', min: -2, max: 2, step: 1, format: v => (v>0?'+':'')+v },
    { id: 'osc2Octave', label: 'Oct 2', min: -2, max: 2, step: 1, format: v => (v>0?'+':'')+v },
    { id: 'osc2Detune', label: 'Detune 2', min: -100, max: 100, step: 1, format: v => v.toFixed(0) },
  ],
  MOD: [
    { id: 'lfoRate', label: 'LFO Rate', min: 0, max: 20, step: 0.1, format: v => v.toFixed(1) },
    { id: 'lfoAmount', label: 'LFO Amt', min: 0, max: 5000, step: 10, format: v => v.toFixed(0) },
    { id: 'lfo2Rate', label: 'LFO2 Rate', min: 0, max: 20, step: 0.1, format: v => v.toFixed(1) },
    { id: 'lfo2Amount', label: 'LFO2 Amt', min: 0, max: 5000, step: 10, format: v => v.toFixed(0) },
  ],
};

export let currentPrOrbSection = 'OSC';

export function updateWaveformOrbHighlights(container, selected) {
  const orbs = container.querySelectorAll('canvas');
  orbs.forEach(orb => {
    const wf = orb.dataset.waveform;
    const ctx = orb.getContext('2d');
    const active = wf === selected;
    drawWaveformButton(ctx, wf, active);
    orb.classList.toggle('active', active);
  });
}

export function drawWaveformButton(ctx, type, active) {
  ctx.clearRect(0, 0, 20, 20);
  const color = active ? '#0f0' : '#ccc';
  const shape = prorbShapeForWaveform(type);
  ctx.save();
  ctx.beginPath();
  drawPrOrbShapePath(ctx, 10, 10, 8, shape);
  ctx.clip();
  drawWaveform(ctx, type, color, 0.8, 20, 20);
  ctx.restore();
  ctx.strokeStyle = color;
  ctx.beginPath();
  drawPrOrbShapePath(ctx, 10, 10, 8, shape);
  ctx.stroke();
}

export function drawWaveform(ctx, type, color, amp, width, height) {
  if (type && type.startsWith('analog_')) {
    type = type.replace('analog_', '');
  }
  ctx.beginPath();
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;
  const midY = height / 2;
  if (type === 'square') {
    ctx.moveTo(0, midY);
    ctx.lineTo(width * 0.25, midY - amp * midY);
    ctx.lineTo(width * 0.75, midY - amp * midY);
    ctx.lineTo(width * 0.75, midY + amp * midY);
    ctx.lineTo(width, midY + amp * midY);
  } else if (type === 'triangle') {
    ctx.moveTo(0, midY);
    ctx.lineTo(width * 0.5, midY - amp * midY);
    ctx.lineTo(width, midY);
  } else if (type === 'sawtooth') {
    ctx.moveTo(0, midY + amp * midY);
    ctx.lineTo(width, midY - amp * midY);
    ctx.lineTo(width, midY + amp * midY);
  } else {
    for (let x = 0; x <= width; x++) {
      const t = (x / width) * 2 * Math.PI;
      const y = Math.sin(t) * amp * midY;
      if (x === 0) ctx.moveTo(x, midY - y);
      else ctx.lineTo(x, midY - y);
    }
  }
  ctx.stroke();
}

export function prorbShapeForWaveform(type) {
  if (!type) return 'circle';
  if (type.startsWith('analog_')) type = type.replace('analog_', '');
  switch (type) {
    case 'square':
      return 'square';
    case 'triangle':
      return 'triangle';
    case 'sawtooth':
      return 'saw';
    default:
      return 'circle';
  }
}

export function drawPrOrbShapePath(ctx, x, y, r, shape) {
  if (shape === 'square') {
    ctx.rect(x - r, y - r, r * 2, r * 2);
  } else if (shape === 'triangle') {
    ctx.moveTo(x, y - r);
    ctx.lineTo(x + r, y + r);
    ctx.lineTo(x - r, y + r);
    ctx.closePath();
  } else if (shape === 'saw') {
    ctx.moveTo(x - r, y + r);
    ctx.lineTo(x - r, y - r);
    ctx.lineTo(x + r, y + r);
    ctx.closePath();
  } else {
    ctx.arc(x, y, r, 0, Math.PI * 2);
  }
}

export function drawAmpEnv(ctx, params, width, height) {
  ctx.beginPath();
  ctx.strokeStyle = '#0f0';
  ctx.lineWidth = 1;
  const total = params.ampEnvAttack + params.ampEnvDecay + params.ampEnvRelease + 0.2;
  const unit = width / total;
  const startY = height;
  ctx.moveTo(0, startY);
  let x = params.ampEnvAttack * unit;
  ctx.lineTo(x, 0);
  const sustainY = height * (1 - params.ampEnvSustain);
  let x2 = x + params.ampEnvDecay * unit;
  ctx.lineTo(x2, sustainY);
  let x3 = x2 + 0.2 * unit;
  ctx.lineTo(x3, sustainY);
  let x4 = x3 + params.ampEnvRelease * unit;
  ctx.lineTo(x4, height);
  ctx.stroke();
}

export function drawPrOrbDisplay(node, section) {
  const container = document.getElementById('prorb-orbital-container');
  if (!container) return;
  const canvas = container.querySelector('.prorb-display-screen');
  if (!canvas) return;
  const ctxd = canvas.getContext('2d');
  ctxd.clearRect(0, 0, canvas.width, canvas.height);
  const params = node.audioParams;
  if (section === 'OSC') {
    drawWaveform(ctxd, params.osc2Waveform, 'rgba(150,150,220,0.9)', 1.1, canvas.width, canvas.height);
    drawWaveform(ctxd, params.osc1Waveform, 'rgba(220,220,255,0.9)', 1.0, canvas.width, canvas.height);
  } else if (section === 'AMP') {
    drawAmpEnv(ctxd, params, canvas.width, canvas.height);
  } else if (section === 'MOD') {
    drawWaveform(ctxd, params.lfo2Waveform, 'rgba(150,255,150,0.9)', 1.0, canvas.width, canvas.height);
    drawWaveform(ctxd, params.lfoWaveform, 'rgba(220,255,220,0.9)', 1.0, canvas.width, canvas.height);
  }
}

export function hidePrOrbMenu() {
  const existing = document.getElementById('prorb-orbital-container');
  if (existing) existing.remove();
  const legacy = document.getElementById('prorb-menu');
  if (legacy) legacy.remove();
  if (prorbPanelContent) prorbPanelContent.innerHTML = '';
}

export function positionPrOrbPanel(node) {
  if (!prorbPanel) return;
  const coords = getScreenCoords(node.x, node.y);
  const offsetX = 80;
  prorbPanel.style.position = 'fixed';
  prorbPanel.style.left = `${coords.x + offsetX}px`;
  prorbPanel.style.top = `${coords.y}px`;
  prorbPanel.style.right = 'auto';
  prorbPanel.style.transform = 'translate(0, -50%)';
}

export function showPrOrbPanel(node) {
  if (!prorbPanel) return;
  prorbPanel.classList.remove('hidden');
  prorbPanel.dataset.nodeId = node.id;
  positionPrOrbPanel(node);
}

export function hidePrOrbPanel() {
  if (prorbPanel) prorbPanel.classList.add('hidden');
}

export function showPrOrbMenu(node, section = 'OSC') {
  hidePrOrbMenu();
  if (typeof hideSamplerOrbMenu === 'function') hideSamplerOrbMenu();
  if (!node || node.type !== PRORB_TYPE) return;
  currentPrOrbSection = section;
  showPrOrbPanel(node);
  if (!prorbPanelContent) return;
  const container = document.createElement('div');
  container.id = 'prorb-orbital-container';
  container.className = 'op1-panel';
  container.dataset.nodeId = node.id;
  prorbPanelContent.innerHTML = '';
  prorbPanelContent.appendChild(container);

  const tabRow = document.createElement('div');
  tabRow.className = 'op1-tab-row';
  Object.keys(prorbMenuConfig).forEach(cat => {
    const t = document.createElement('button');
    t.textContent = cat;
    if (cat === section) t.classList.add('active');
    t.addEventListener('click', () => showPrOrbMenu(node, cat));
    tabRow.appendChild(t);
  });
  container.appendChild(tabRow);

  const controls = prorbMenuConfig[section] || [];
  const topRow = document.createElement('div');
  topRow.className = 'prorb-hbar-row';
  for (let i = 0; i < 2; i++) {
    const info = controls[i] || controls[controls.length - 1];
    if (!info) continue;
    const barEl = createOp1HBar(`prorb-top-${info.id}-${i}-${node.id}`, info, node);
    topRow.appendChild(barEl);
  }
  container.appendChild(topRow);

  const secondTopIndex = 2;
  const displayRow = document.createElement('div');
  displayRow.className = 'op1-display-row';
  const orbStack1 = document.createElement('div');
  const orbStack2 = document.createElement('div');
  orbStack1.className = 'op1-orb-stack';
  orbStack2.className = 'op1-orb-stack';
  if (section === 'OSC') {
    const waveforms = ['square','sine','triangle','sawtooth'];
    waveforms.forEach(wf => {
      const orb = document.createElement('canvas');
      orb.width = 20; orb.height = 20;
      orb.dataset.waveform = wf;
      orb.addEventListener('click', () => {
        node.audioParams.osc1Waveform = wf;
        updateNodeAudioParams(node);
        drawPrOrbDisplay(node, section);
        updateWaveformOrbHighlights(orbStack1, wf);
        if (typeof saveState === 'function') saveState();
      });
      orbStack1.appendChild(orb);
    });
    waveforms.forEach(wf => {
      const orb = document.createElement('canvas');
      orb.width = 20; orb.height = 20;
      orb.dataset.waveform = wf;
      orb.addEventListener('click', () => {
        node.audioParams.osc2Waveform = wf;
        updateNodeAudioParams(node);
        drawPrOrbDisplay(node, section);
        updateWaveformOrbHighlights(orbStack2, wf);
        if (typeof saveState === 'function') saveState();
      });
      orbStack2.appendChild(orb);
    });
  } else {
    for (let i = 0; i < 4; i++) {
      const orb1 = document.createElement('canvas');
      orb1.width = 20; orb1.height = 20;
      orb1.dataset.waveform = node.audioParams.osc1Waveform;
      drawWaveformButton(orb1.getContext('2d'), node.audioParams.osc1Waveform, false);
      orbStack1.appendChild(orb1);
      const orb2 = document.createElement('canvas');
      orb2.width = 20; orb2.height = 20;
      orb2.dataset.waveform = node.audioParams.osc2Waveform;
      drawWaveformButton(orb2.getContext('2d'), node.audioParams.osc2Waveform, false);
      orbStack2.appendChild(orb2);
    }
  }

  const displayWrap = document.createElement('div');
  displayWrap.className = 'op1-display';
  const disp = document.createElement('canvas');
  disp.className = 'prorb-display-screen';
  disp.width = 260;
  disp.height = 100;
  displayWrap.appendChild(disp);
  displayRow.appendChild(orbStack1);
  displayRow.appendChild(displayWrap);
  displayRow.appendChild(orbStack2);
  container.appendChild(displayRow);
  if (section === 'OSC') {
    updateWaveformOrbHighlights(orbStack1, node.audioParams.osc1Waveform);
    updateWaveformOrbHighlights(orbStack2, node.audioParams.osc2Waveform);
  }

  const barRow = document.createElement('div');
  barRow.className = 'prorb-bar-row';
  for (let i = secondTopIndex; i < secondTopIndex + 6; i++) {
    const info = controls[i] || controls[controls.length - 1];
    if (!info) continue;
    const wrap = document.createElement('div');
    wrap.className = 'prorb-bar-wrapper';
    const bar = document.createElement('div');
    bar.className = 'prorb-bar';
    const val = node.audioParams[info.id];
    const percent = ((val - info.min) / (info.max - info.min)) * 100;
    bar.style.height = `${Math.max(2, Math.min(100, percent))}%`;
    wrap.appendChild(bar);
    let isDragging = false;
    const updateFromPos = (y) => {
      const rect = wrap.getBoundingClientRect();
      const rel = rect.bottom - y;
      let ratio = rel / rect.height;
      ratio = Math.max(0, Math.min(1, ratio));
      const newVal = info.min + ratio * (info.max - info.min);
      node.audioParams[info.id] = newVal;
      const pct = ((newVal - info.min) / (info.max - info.min)) * 100;
      bar.style.height = `${Math.max(2, Math.min(100, pct))}%`;
      updateNodeAudioParams(node);
      drawPrOrbDisplay(node, section);
    };
    wrap.addEventListener('mousedown', (e) => {
      isDragging = true;
      updateFromPos(e.clientY);
      const moveHandler = (ev) => {
        if (isDragging) updateFromPos(ev.clientY);
      };
      const upHandler = () => {
        if (isDragging) {
          isDragging = false;
          if (typeof saveState === 'function') saveState();
        }
        document.removeEventListener('mousemove', moveHandler);
        document.removeEventListener('mouseup', upHandler);
      };
      document.addEventListener('mousemove', moveHandler);
      document.addEventListener('mouseup', upHandler);
    });
    barRow.appendChild(wrap);
  }
  container.appendChild(barRow);

  drawPrOrbDisplay(node, section);
  positionPrOrbPanel(node);
}
