// Eerst audioCtx initialiseren
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

// EFFECT CONTROLS
const filterFrequencyControl = document.getElementById('filterFrequency');
const filterQControl = document.getElementById('filterQ');
const reverbWetnessControl = document.getElementById('reverbWetness');
const delayWetControl = document.getElementById('delayWet');
const delayTimeSlider = document.getElementById('delayTime');
const delayTimeValueDisplay = document.getElementById('delayTimeValue');
const delayFeedbackControl = document.getElementById('delayFeedback');
const delayFeedbackValueDisplay = document.getElementById('delayFeedbackValue');
delayFeedbackControl.addEventListener("input", () => {
  delayFeedbackValueDisplay.textContent = parseFloat(delayFeedbackControl.value).toFixed(2);
});
const delayTimeOptions = [
  { label: "1/32", factor: 1/8 },
  { label: "1/24", factor: 1/6 },
  { label: "1/16", factor: 1/4 },
  { label: "1/12", factor: 1/3 },
  { label: "1/8",  factor: 1/2 },
  { label: "1/4",  factor: 1 }
];
delayTimeSlider.addEventListener("input", () => {
  let index = parseInt(delayTimeSlider.value);
  delayTimeValueDisplay.textContent = delayTimeOptions[index].label;
});

// UI
const attackControl = document.getElementById('attack');
const releaseControl = document.getElementById('release');
const bpmSlider = document.getElementById('bpm');
const bpmValueDisplay = document.getElementById('bpmValue');
const tapTempoButton = document.getElementById('tapTempo');
const timerDisplay = document.getElementById('timerDisplay');
const globalKeySelect = document.getElementById('globalKey');
const globalScaleSelect = document.getElementById('globalScale');

bpmSlider.addEventListener("input", () => {
  bpmValueDisplay.textContent = bpmSlider.value;
});
function getBPM() {
  return parseFloat(bpmSlider.value);
}

// TAP TEMPO
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

// Toonladder
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

// Kanalen
const channelIds = [0, 1, 2];
const channels = channelIds.map(i => {
  const channelElement = document.getElementById(`channel${i}`);
  const waveForms = [];
  ['sine','square','sawtooth','triangle'].forEach(type => {
    const el = document.getElementById(`channel${i}-wave-${type}`);
    if (el) waveForms.push(el);
  });
  const setChordBtn = channelElement.querySelector('.setChord');
  const indicatorDirEl = channelElement.querySelector('.indicator-direction');
  return {
    waveCheckboxes: waveForms,
    offset: document.getElementById(`channel${i}-offset`),
    segmentsInput: document.getElementById(`channel${i}-segments`),
    noteCountInput: document.getElementById(`channel${i}-noteCount`),
    sequenceDiv: document.getElementById(`sequence${i}`),
    barChangeDiv: channelElement.querySelector('.bar-change'),
    // Indien aanwezig, indicator select per kanaal
    indicatorDirection: channelElement.querySelector('.indicator-direction'),
    sequenceData: null,
    currentStep: 0,
    prevLocalTime: 0,
    triggered: [],
    barChangeStep: 0,
    lastTriggeredSegment: null,
    glowTime: 0,
    lastTriggeredFreq: 0,
    // Voor individuele Set to Chord knop
    setChordBtn: setChordBtn,
    // Voor note order in pingpong mode
    stepDirection: 1
  };
});

// Voeg per kanaal eventlistener toe voor "Set to Chord" knop (individueel)
channels.forEach(chan => {
  chan.setChordBtn.addEventListener('click', () => {
    const scale = getScale(globalKeySelect.value, globalScaleSelect.value);
    const chord = [scale[0], scale[2], scale[4]]; // triade
    chan.noteCountInput.value = chord.length;
    chan.segmentsInput.value = chord.length;
    chan.sequenceData = chord.map(t => ({ note: t.freq, octave: "0" }));
    updateSequence(chan);
  });
});

// UpdateSequence behoudt bestaande sequenceData (randomisering) als deze al bestaat
function updateSequence(channel, channelIndex) {
  const count = parseInt(channel.noteCountInput.value);
  const scale = getScale(globalKeySelect.value, globalScaleSelect.value);
  if (!channel.sequenceData) {
    channel.sequenceData = [];
    for (let i = 0; i < count; i++) {
      channel.sequenceData.push({ note: scale[i % scale.length].freq, octave: "0" });
    }
  } else {
    // Als er meer noten nodig zijn, voeg dan random noten toe
    if (count > channel.sequenceData.length) {
      for (let i = channel.sequenceData.length; i < count; i++) {
        const randomNote = scale[Math.floor(Math.random() * scale.length)];
        const randomOctave = (Math.floor(Math.random() * 5) - 2).toString();
        channel.sequenceData.push({ note: randomNote.freq, octave: randomOctave });
      }
    } else if (count < channel.sequenceData.length) {
      channel.sequenceData = channel.sequenceData.slice(0, count);
    }
  }
  // Bouw de HTML op basis van sequenceData (laat bestaande waarden intact)
  let html = "";
  for (let i = 0; i < channel.sequenceData.length; i++) {
    const data = channel.sequenceData[i];
    html += `<div class="note">`;
    html += `<select class="note-select">`;
    scale.forEach(n => {
      // Laat de random waarde behouden
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
  channel.currentStep = 0;
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

// Voeg per kanaal een eigen indicator direction toe als extra
channels.forEach(chan => {
  if (!chan.indicatorDirection) {
    // Indien ontbreekt, maak een default select en voeg toe aan compact-row
    const sel = document.createElement("select");
    sel.classList.add("indicator-direction");
    sel.innerHTML = `<option value="ltr" selected>&rarr;</option>
                     <option value="rtl">&larr;</option>
                     <option value="pingpong">&harr;</option>`;
    chan.indicatorDirection = sel;
    chan.sequenceDiv.parentNode.insertBefore(sel, chan.sequenceDiv);
  }
  // Stel de standaard stepDirection in voor pingpong
  chan.stepDirection = 1;
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

// AUDIO GRAPH
// 1. Synth -> Lowpass Filter
const masterFilter = audioCtx.createBiquadFilter();
masterFilter.type = "lowpass";
masterFilter.frequency.value = parseFloat(filterFrequencyControl.value);
masterFilter.Q.value = parseFloat(filterQControl.value);

// 2. Delay-block: split in droog/wet en met feedback
const delayNode = audioCtx.createDelay();
const delayDryGain = audioCtx.createGain();
const delayWetGain = audioCtx.createGain();
const delayMixGain = audioCtx.createGain();
masterFilter.connect(delayDryGain);
masterFilter.connect(delayNode);
delayNode.connect(delayWetGain);
delayDryGain.connect(delayMixGain);
delayWetGain.connect(delayMixGain);
const delayFeedbackGain = audioCtx.createGain();
delayFeedbackGain.gain.value = parseFloat(delayFeedbackControl.value);
delayWetGain.connect(delayFeedbackGain);
delayFeedbackGain.connect(delayNode);

// 3. Reverb-block: delay output gaat naar convolver
const reverbConvolver = audioCtx.createConvolver();
reverbConvolver.buffer = createImpulseResponse(3, 2);
const reverbDryGain = audioCtx.createGain();
const reverbWetGain = audioCtx.createGain();
const reverbMixGain = audioCtx.createGain();
delayMixGain.connect(reverbDryGain);
delayMixGain.connect(reverbConvolver);
reverbConvolver.connect(reverbWetGain);
reverbDryGain.connect(reverbMixGain);
reverbWetGain.connect(reverbMixGain);
reverbMixGain.connect(audioCtx.destination);

// PLAY OSCILLATOR MET GLOW
function playOscillator(frequency, waveform, noteElement, chan, segmentIndex) {
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
  
  // Glow op de noot zelf
  if (noteElement) {
    const minFreq = 261.63, maxFreq = 987.77;
    let hue = ((frequency - minFreq) / (maxFreq - minFreq)) * 360;
    hue = Math.max(0, Math.min(360, hue));
    noteElement.style.transition = "background-color 0.3s ease";
    noteElement.style.backgroundColor = `hsl(${hue},70%,50%)`;
    setTimeout(() => { noteElement.style.backgroundColor = ""; }, 300);
  }
  
  // Sla triggerdata op voor glow op de scheidingslijn (rechterkant van segment)
  chan.lastTriggeredSegment = segmentIndex;
  chan.glowTime = performance.now();
  chan.lastTriggeredFreq = frequency;
}

// Haal geselecteerde wavevormen per kanaal op
function getSelectedWaveforms(chan) {
  return chan.waveCheckboxes.filter(cb => cb.checked).map(cb => cb.value);
}

// UPDATE-LOOP
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
  
  // Update delay parameters
  let delayIndex = parseInt(delayTimeSlider.value);
  delayNode.delayTime.value = (60 / bpm) * delayTimeOptions[delayIndex].factor;
  delayDryGain.gain.value = 1 - parseFloat(delayWetControl.value);
  delayWetGain.gain.value = parseFloat(delayWetControl.value);
  delayFeedbackGain.gain.value = parseFloat(delayFeedbackControl.value);
  
  // Update reverb parameters
  reverbDryGain.gain.value = 1 - parseFloat(reverbWetnessControl.value);
  reverbWetGain.gain.value = parseFloat(reverbWetnessControl.value);
  
  timerDisplay.textContent = internalPhase.toFixed(2);
  
  channels.forEach(chan => {
    const offset = parseFloat(chan.offset.value);
    let localTime = internalPhase + offset;
    localTime = ((localTime % 1) + 1) % 1;
    
    if (localTime < chan.prevLocalTime || localTime < 0.01) {
      if (chan.barChangeDiv) {
        const dropdowns = Array.from(chan.barChangeDiv.querySelectorAll('.bar-change-option'));
        if (dropdowns.length > 0) {
          dropdowns.forEach((dd, idx) => {
            dd.classList.toggle("active-dropdown", idx === chan.barChangeStep);
          });
          const change = parseInt(dropdowns[chan.barChangeStep].value);
          let newSeg = parseInt(chan.segmentsInput.value) + change;
          chan.segmentsInput.value = Math.max(1, Math.min(newSeg, 16));
          chan.barChangeStep = (chan.barChangeStep + 1) % dropdowns.length;
        }
      }
      initTriggered(chan);
    }
    chan.prevLocalTime = localTime;
    const segCount = Math.max(1, parseInt(chan.segmentsInput.value));
    if (chan.triggered.length !== segCount) initTriggered(chan);
    for (let j = 0; j < segCount; j++) {
      let threshold = (j + 1) / segCount;
      if (localTime >= threshold && !chan.triggered[j]) {
        if (chan.steps.length === 0) continue;
        const noteElement = chan.steps[chan.currentStep];
        if (!noteElement) continue;
        const noteSelect = noteElement.querySelector(".note-select");
        const noteOctave = noteElement.querySelector(".note-octave");
        if (!noteSelect || !noteOctave) continue;
        const baseFreq = parseFloat(noteSelect.value);
        const octaveOffset = parseInt(noteOctave.value);
        const freq = baseFreq * Math.pow(2, octaveOffset);
        const waveforms = getSelectedWaveforms(chan);
        if (waveforms.length === 0) waveforms.push("sine");
        waveforms.forEach(wf => playOscillator(freq, wf, noteElement, chan, j));
        chan.triggered[j] = true;
        // Update currentStep op basis van indicator direction per kanaal
        const dir = chan.indicatorDirection.value;
        if(dir === "ltr"){
          chan.currentStep = (chan.currentStep + 1) % chan.steps.length;
        } else if(dir === "rtl"){
          chan.currentStep = (chan.currentStep - 1 + chan.steps.length) % chan.steps.length;
        } else if(dir === "pingpong"){
          // Pingpong: wissel richting bij grenzen
          if(chan.currentStep === 0) chan.stepDirection = 1;
          if(chan.currentStep === chan.steps.length - 1) chan.stepDirection = -1;
          chan.currentStep = (chan.currentStep + chan.stepDirection + chan.steps.length) % chan.steps.length;
        }
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
    // Bereken indicatorpositie per kanaal op basis van diens indicator direction
    const offset = parseFloat(chan.offset.value);
    let localTime = internalPhase + offset;
    localTime = ((localTime % 1) + 1) % 1;
    const dir = chan.indicatorDirection.value;
    let pos;
    if(dir === "ltr"){
      pos = localTime;
    } else if(dir === "rtl"){
      pos = 1 - localTime;
    } else if(dir === "pingpong"){
      let t = localTime * 2;
      pos = t > 1 ? 2 - t : t;
    } else {
      pos = localTime;
    }
    const indicatorX = margin + pos * usableWidth;
    ctx.strokeStyle = '#ff0';
    ctx.beginPath();
    ctx.moveTo(indicatorX, yCenter - 20);
    ctx.lineTo(indicatorX, yCenter + 20);
    ctx.stroke();
    
    // Teken glow op de scheidingslijn van het laatst getriggerde segment
    if (performance.now() - chan.glowTime < 300 && chan.lastTriggeredSegment !== null) {
      const elapsed = performance.now() - chan.glowTime;
      const alpha = 1 - (elapsed / 300);
      const glowX = margin + ((chan.lastTriggeredSegment + 1) / segCount) * usableWidth;
      const minFreq = 261.63, maxFreq = 987.77;
      let hue = ((chan.lastTriggeredFreq - minFreq) / (maxFreq - minFreq)) * 360;
      hue = Math.max(0, Math.min(360, hue));
      ctx.save();
      ctx.beginPath();
      ctx.arc(glowX, yCenter, 10, 0, 2 * Math.PI);
      const gradient = ctx.createRadialGradient(glowX, yCenter, 0, glowX, yCenter, 10);
      gradient.addColorStop(0, `hsla(${hue},70%,50%,${alpha})`);
      gradient.addColorStop(1, `hsla(${hue},70%,50%,0)`);
      ctx.fillStyle = gradient;
      ctx.fill();
      ctx.restore();
    }
  });
}

document.body.addEventListener('click', () => {
  if (audioCtx.state !== 'running') audioCtx.resume();
});
update();

// "Randomize Sequences" knop – maak de noten random (en behoud de random waarden)
document.getElementById('randomize').addEventListener('click', () => {
  channels.forEach(chan => {
    chan.segmentsInput.value = Math.floor(Math.random() * 16) + 1;
    chan.noteCountInput.value = Math.floor(Math.random() * 8) + 1;
    chan.offset.value = (Math.random() - 0.5).toFixed(2);
    const scale = getScale(globalKeySelect.value, globalScaleSelect.value);
    const count = parseInt(chan.noteCountInput.value);
    // Maak een nieuwe sequenceData volledig random
    chan.sequenceData = [];
    for (let i = 0; i < count; i++) {
      const randomNote = scale[Math.floor(Math.random() * scale.length)];
      const randomOctave = (Math.floor(Math.random() * 5) - 2).toString();
      chan.sequenceData.push({ note: randomNote.freq, octave: randomOctave });
    }
    updateSequence(chan);
  });
});

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
