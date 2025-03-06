// Effect controls
const filterFrequencyControl = document.getElementById('filterFrequency');
const filterQControl = document.getElementById('filterQ');
const reverbWetnessControl = document.getElementById('reverbWetness');

// UI elements
const attackControl = document.getElementById('attack');
const releaseControl = document.getElementById('release');
const bpmSlider = document.getElementById('bpm');
const bpmValueDisplay = document.getElementById('bpmValue');
const tapTempoButton = document.getElementById('tapTempo');
const timerDisplay = document.getElementById('timerDisplay');
const globalKeySelect = document.getElementById('globalKey');
const globalScaleSelect = document.getElementById('globalScale');

// BPM slider update
bpmSlider.addEventListener("input", () => {
  bpmValueDisplay.textContent = bpmSlider.value;
});
function getBPM() {
  return parseFloat(bpmSlider.value);
}

// Tap Tempo
let lastTapTime = 0;
let tapIntervals = [];
tapTempoButton.addEventListener('click', () => {
  const now = performance.now();
  if (lastTapTime !== 0) {
    const interval = now - lastTapTime;
    tapIntervals.push(interval);
    if (tapIntervals.length > 4) tapIntervals.shift();
    const avgInterval = tapIntervals.reduce((a, b) => a + b, 0) / tapIntervals.length;
    const newBPM = (60 * 1000) / avgInterval;
    bpmSlider.value = Math.round(newBPM);
    bpmValueDisplay.textContent = bpmSlider.value;
  }
  lastTapTime = now;
});

// Toonladder: bereken toonladder op basis van key en scale
function getScale(key, scaleType) {
  const semitoneNames = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
  const intervals = scaleType === "major" ? [0,2,4,5,7,9,11] : [0,2,3,5,7,8,10];
  const keyIndex = semitoneNames.indexOf(key);
  const baseFreqs = {
    "C": 261.63,
    "C#": 277.18,
    "D": 293.66,
    "D#": 311.13,
    "E": 329.63,
    "F": 349.23,
    "F#": 369.99,
    "G": 392.00,
    "G#": 415.30,
    "A": 440.00,
    "A#": 466.16,
    "B": 493.88
  };
  return intervals.map(interval => {
    const noteIndex = (keyIndex + interval) % 12;
    const noteName = semitoneNames[noteIndex];
    const freq = baseFreqs[noteName];
    return { name: noteName, freq: freq.toFixed(2) };
  });
}

// Channels
const channelIds = [0, 1, 2];
const channels = channelIds.map(i => {
  const waveForms = [];
  ['sine','square','sawtooth','triangle'].forEach(type => {
    const el = document.getElementById(`channel${i}-wave-${type}`);
    if (el) waveForms.push(el);
  });
  return {
    waveCheckboxes: waveForms,
    offset: document.getElementById(`channel${i}-offset`),
    segmentsInput: document.getElementById(`channel${i}-segments`),
    noteCountInput: document.getElementById(`channel${i}-noteCount`),
    sequenceDiv: document.getElementById(`sequence${i}`),
    sequenceData: null,
    currentStep: 0,
    prevLocalTime: 0,
    triggered: []
  };
});

// updateSequence: bouwt per kanaal de piano roll met maximaal 8 noten
function updateSequence(channel, channelIndex) {
  const count = parseInt(channel.noteCountInput.value);
  const scale = getScale(globalKeySelect.value, globalScaleSelect.value);
  if (!channel.sequenceData) {
    channel.sequenceData = [];
    for (let i = 0; i < count; i++) {
      channel.sequenceData.push({ note: scale[i % scale.length].freq, octave: "0" });
    }
  } else {
    if (count > channel.sequenceData.length) {
      for (let i = channel.sequenceData.length; i < count; i++) {
        channel.sequenceData.push({ note: scale[i % scale.length].freq, octave: "0" });
      }
    } else if (count < channel.sequenceData.length) {
      channel.sequenceData = channel.sequenceData.slice(0, count);
    }
    for (let i = 0; i < channel.sequenceData.length; i++) {
      const newNote = scale[i % scale.length];
      channel.sequenceData[i].note = newNote.freq;
    }
  }
  
  let html = "";
  for (let i = 0; i < channel.sequenceData.length; i++) {
    const data = channel.sequenceData[i];
    html += `<div class="note">`;
    html += `<select class="note-select">`;
    scale.forEach(n => {
      html += `<option value="${n.freq}" ${n.freq === data.note ? "selected" : ""}>${n.name}</option>`;
    });
    html += `</select>`;
    html += `<label class="note-octave-label">Octaaf:
               <select class="note-octave">
                 <option value="-2" ${data.octave === "-2" ? "selected" : ""}>-2</option>
                 <option value="-1" ${data.octave === "-1" ? "selected" : ""}>-1</option>
                 <option value="0" ${data.octave === "0" ? "selected" : ""}>0</option>
                 <option value="1" ${data.octave === "1" ? "selected" : ""}>+1</option>
                 <option value="2" ${data.octave === "2" ? "selected" : ""}>+2</option>
               </select>
             </label>`;
    html += `</div>`;
  }
  channel.sequenceDiv.innerHTML = html;
  channel.steps = Array.from(channel.sequenceDiv.getElementsByClassName("note"));
  if (channel.currentStep >= channel.steps.length) {
    channel.currentStep = 0;
  }
}

channels.forEach((ch, idx) => {
  updateSequence(ch, idx);
  ch.noteCountInput.addEventListener("input", () => updateSequence(ch, idx));
});
globalKeySelect.addEventListener("change", () => {
  channels.forEach((ch, idx) => updateSequence(ch, idx));
});
globalScaleSelect.addEventListener("change", () => {
  channels.forEach((ch, idx) => updateSequence(ch, idx));
});

// Canvas setup
const canvas = document.getElementById('sequencerCanvas');
const ctx = canvas.getContext('2d');
function resizeCanvas() {
  canvas.width = document.querySelector('.canvas-container').clientWidth;
  canvas.height = document.querySelector('.canvas-container').clientHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// AudioContext en effectketen
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
const dryGain = audioCtx.createGain();
const wetGain = audioCtx.createGain();
dryGain.connect(audioCtx.destination);
wetGain.connect(audioCtx.destination);

const masterFilter = audioCtx.createBiquadFilter();
masterFilter.type = "lowpass";
masterFilter.frequency.value = parseFloat(filterFrequencyControl.value);
masterFilter.Q.value = parseFloat(filterQControl.value);

const convolver = audioCtx.createConvolver();
convolver.buffer = createImpulseResponse(3, 2);

masterFilter.connect(dryGain);
masterFilter.connect(convolver);
convolver.connect(wetGain);

// playOscillator: stuurt oscillator via gain naar masterFilter
function playOscillator(frequency, waveform) {
  const osc = audioCtx.createOscillator();
  osc.type = waveform;
  osc.frequency.value = frequency;
  const gainNode = audioCtx.createGain();
  gainNode.gain.value = 0.3;
  osc.connect(gainNode);
  gainNode.connect(masterFilter);
  const now = audioCtx.currentTime;
  const attack = parseFloat(attackControl.value);
  const release = parseFloat(releaseControl.value);
  gainNode.gain.cancelScheduledValues(now);
  gainNode.gain.setValueAtTime(0, now);
  gainNode.gain.linearRampToValueAtTime(0.3, now + attack);
  gainNode.gain.linearRampToValueAtTime(0, now + attack + release);
  osc.start(now);
  osc.stop(now + attack + release);
}

// Helper: per kanaal geselecteerde wavevormen
function getSelectedWaveforms(chan) {
  return chan.waveCheckboxes.filter(cb => cb.checked).map(cb => cb.value);
}

// Globale fase en update-loop op basis van BPM (16 bars cyclus, nu BPM/960)
let internalPhase = 0;
let lastUpdateTime = performance.now();
function initTriggered(chan) {
  const segCount = Math.max(1, parseInt(chan.segmentsInput.value));
  chan.triggered = new Array(segCount).fill(false);
}
channels.forEach(chan => initTriggered(chan));

function update() {
  const now = performance.now();
  const delta = (now - lastUpdateTime) / 1000;
  lastUpdateTime = now;
  const bpm = getBPM();
  internalPhase += (bpm / 960) * delta;
  internalPhase %= 1;
  
  masterFilter.frequency.value = parseFloat(filterFrequencyControl.value);
  masterFilter.Q.value = parseFloat(filterQControl.value);
  const wet = parseFloat(reverbWetnessControl.value);
  wetGain.gain.value = wet;
  dryGain.gain.value = 1 - wet;
  
  timerDisplay.textContent = internalPhase.toFixed(2);
  
  channels.forEach(chan => {
    const offset = parseFloat(chan.offset.value);
    let localTime = internalPhase + offset;
    localTime = ((localTime % 1) + 1) % 1;
    if (localTime < chan.prevLocalTime) {
      chan.currentStep = 0;
      initTriggered(chan);
    }
    chan.prevLocalTime = localTime;
    const segCount = Math.max(1, parseInt(chan.segmentsInput.value));
    if (chan.triggered.length !== segCount) initTriggered(chan);
    for (let j = 0; j < segCount; j++) {
      let threshold = (j + 1) / segCount;
      if (localTime >= threshold && !chan.triggered[j]) {
        if (chan.steps.length === 0) continue;
        if (chan.currentStep >= chan.steps.length) chan.currentStep = 0;
        const noteContainer = chan.steps[chan.currentStep];
        if (!noteContainer) continue;
        const noteSelect = noteContainer.querySelector(".note-select");
        const noteOctave = noteContainer.querySelector(".note-octave");
        if (!noteSelect || !noteOctave) continue;
        const baseFreq = parseFloat(noteSelect.value);
        const octaveOffset = parseInt(noteOctave.value);
        const freq = baseFreq * Math.pow(2, octaveOffset);
        const waveforms = getSelectedWaveforms(chan);
        if (waveforms.length === 0) waveforms.push("sine");
        waveforms.forEach(wf => {
          playOscillator(freq, wf);
        });
        chan.triggered[j] = true;
        chan.currentStep = (chan.currentStep + 1) % chan.steps.length;
      }
    }
  });
  draw();
  requestAnimationFrame(update);
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const margin = 50;
  const usableWidth = canvas.width - 2 * margin;
  const channelHeight = (canvas.height - 2 * margin) / channels.length;
  channels.forEach((chan, i) => {
    const yCenter = margin + i * channelHeight + channelHeight / 3;
    ctx.strokeStyle = '#fff';
    ctx.beginPath();
    ctx.moveTo(margin, yCenter);
    ctx.lineTo(canvas.width - margin, yCenter);
    ctx.stroke();
    const segCount = Math.max(1, parseInt(chan.segmentsInput.value));
    for (let j = 1; j < segCount; j++) {
      const x = margin + (j / segCount) * usableWidth;
      ctx.strokeStyle = '#888';
      ctx.beginPath();
      ctx.moveTo(x, yCenter - 15);
      ctx.lineTo(x, yCenter + 15);
      ctx.stroke();
    }
    const localTime = ((internalPhase + parseFloat(chan.offset.value)) % 1 + 1) % 1;
    const indicatorX = margin + (localTime * usableWidth);
    ctx.strokeStyle = '#ff0';
    ctx.beginPath();
    ctx.moveTo(indicatorX, yCenter - 20);
    ctx.lineTo(indicatorX, yCenter + 20);
    ctx.stroke();
  });
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();
document.body.addEventListener('click', () => {
  if (audioCtx.state !== 'running') audioCtx.resume();
});
update();

// Randomize knop: randomiseert per kanaal de segments, noteCount, offset en de sequenceData
document.getElementById('randomize').addEventListener('click', () => {
  channels.forEach(chan => {
    // Random segments: minimaal 1 tot 16
    chan.segmentsInput.value = Math.floor(Math.random() * 16) + 1;
    // Random noteCount: minimaal 1 tot 8
    chan.noteCountInput.value = Math.floor(Math.random() * 8) + 1;
    // Random offset: tussen -0.5 en 0.5, afgerond op 2 decimalen
    chan.offset.value = (Math.random() - 0.5).toFixed(2);
    // Randomize sequenceData: voor elke noot een random noot en random octave
    const scale = getScale(globalKeySelect.value, globalScaleSelect.value);
    const count = parseInt(chan.noteCountInput.value);
    if (!chan.sequenceData) chan.sequenceData = [];
    for (let i = 0; i < count; i++) {
      const randomNote = scale[Math.floor(Math.random() * scale.length)];
      const randomOctave = (Math.floor(Math.random() * 5) - 2).toString();
      if (chan.sequenceData[i]) {
        chan.sequenceData[i].note = randomNote.freq;
        chan.sequenceData[i].octave = randomOctave;
      } else {
        chan.sequenceData.push({ note: randomNote.freq, octave: randomOctave });
      }
    }
    if (chan.sequenceData.length > count) {
      chan.sequenceData = chan.sequenceData.slice(0, count);
    }
    updateSequence(chan);
  });
});

// Canvas resize
function resizeCanvas() {
  canvas.width = document.querySelector('.canvas-container').clientWidth;
  canvas.height = document.querySelector('.canvas-container').clientHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// Helper: maak impulse response voor reverb
function createImpulseResponse(duration, decay) {
  const sampleRate = audioCtx.sampleRate;
  const length = sampleRate * duration;
  const impulse = audioCtx.createBuffer(2, length, sampleRate);
  for (let channel = 0; channel < impulse.numberOfChannels; channel++){
    const channelData = impulse.getChannelData(channel);
    for (let i = 0; i < length; i++){
      channelData[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, decay);
    }
  }
  return impulse;
}
