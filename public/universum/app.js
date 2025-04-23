const canvas = document.getElementById('mainCanvas');
const ctx = canvas.getContext('2d');
const startMessage = document.getElementById('startMessage');
const loadingIndicator = document.getElementById('loadingIndicator');
const scaleSelect = document.getElementById('scaleSelect');
const groupControlsDiv = document.getElementById('groupControls');
const groupVolumeSlider = document.getElementById('groupVolumeSlider');
const groupFluctuateToggle = document.getElementById('groupFluctuateToggle');
const groupFluctuateAmount = document.getElementById('groupFluctuateAmount');
const groupNodeCountSpan = document.getElementById('groupNodeCount');
const gridControlsDiv = document.getElementById('gridControls');
const gridOptionsDiv = document.getElementById('gridOptions');
const gridToggleBtn = document.getElementById('gridToggleBtn');
const gridTypeBtn = document.getElementById('gridTypeBtn');
const gridSnapBtn = document.getElementById('gridSnapBtn');
const gridSizeSlider = document.getElementById('gridSizeSlider');
const toggleInfoTextBtn = document.getElementById('toggleInfoTextBtn');
const transportControlsDiv = document.getElementById('transportControls');
const globalSyncToggleBtn = document.getElementById('globalSyncToggleBtn');
const bpmControlsDiv = document.getElementById('bpmControls');
const globalBpmInput = document.getElementById('globalBpmInput');
const restartPulsarsBtn = document.getElementById('restartPulsarsBtn');
const playPauseBtn = document.getElementById('playPauseBtn');
const beatIndicatorElement = document.getElementById('beatIndicator');

const toolbar = document.getElementById('toolbar');
const addSoundStarBtn = document.getElementById('addSoundStarBtn');
const addNebulaBtn = document.getElementById('addNebulaBtn');
const addPulsarBtn = document.getElementById('addPulsarBtn');
const addGateBtn = document.getElementById('addGateBtn');
const addProbabilityGateBtn = document.getElementById('addProbabilityGateBtn');
const addPitchShiftBtn = document.getElementById('addPitchShiftBtn');
const addSpeedBtn = document.getElementById('addSpeedBtn');
const editBtn = document.getElementById('editBtn');
const connectBtn = document.getElementById('connectBtn');
const deleteBtn = document.getElementById('deleteBtn');
const undoBtn = document.getElementById('undoBtn');
const redoBtn = document.getElementById('redoBtn');
const hamburgerBtn = document.getElementById('hamburgerBtn');
const hamburgerMenuPanel = document.getElementById('hamburgerMenuPanel');
const sideToolbar = document.getElementById('sideToolbar');
const sideToolbarTitle = document.getElementById('sideToolbarTitle');
const sideToolbarContent = document.getElementById('sideToolbarContent');

let audioContext;
let masterGain;
let reverbNode;
let reverbWetGain;
let isReverbReady = false;
const REVERB_IR_URL = 'reverb.wav';

const MARIMBA_SAMPLE_URL = 'marimba_c3.wav';
const MARIMBA_BASE_FREQ = 130.81;
const PIANO_SAMPLE_URL = 'piano_c4.wav';
const PIANO_BASE_FREQ = 261.63;
const FLUTE_SAMPLE_URL = 'flute_c5.wav';
const FLUTE_BASE_FREQ = 523.25;

let marimbaBuffer = null, pianoBuffer = null, fluteBuffer = null;
let isMarimbaLoaded = false, isPianoLoaded = false, isFluteLoaded = false;
let isMarimbaLoading = false, isPianoLoading = false, isFluteLoading = false;
let totalSamples = 3;
let samplesLoadedCount = 0;

let nodes = [];
let connections = [];
let activePulses = [];
let activeParticles = [];
let windParticles = [];
let nodeIdCounter = 0; let connectionIdCounter = 0; let pulseIdCounter = 0; let particleIdCounter = 0;
let isAudioReady = false; let currentGlobalPulseId = 0;
let previousFrameTime = 0;
let bgAngle = Math.random() * Math.PI * 2;

const NODE_RADIUS_BASE = 12;
const MIN_NODE_SIZE = 0.6; const MAX_NODE_SIZE = 1.8;
const MIN_FILTER_FREQ = 350; const MAX_FILTER_FREQ = 16000;
const DEFAULT_REVERB_SEND = 0.4; const DEFAULT_TRIGGER_INTERVAL = 2.5;
const DELAY_FACTOR = 0.005;
const PULSE_SIZE = 3;
const SNOWBALL_HOPS = 5;

const GATE_ROTATION_SPEED = 0.025;
const GATE_ANGLE_SIZE = Math.PI / 2.5;

const GATE_MODES = ['1/2', '1/3', '1/4', '2/3', '3/4', 'RAND'];
const DEFAULT_GATE_MODE_INDEX = 0;
const GATE_RANDOM_THRESHOLD = 0.5;

const DEFAULT_PROBABILITY = 0.5;

const PITCH_SHIFT_AMOUNTS = [1, 2, 3, 4, 5, 7, 12, -1, -2, -3, -4, -5, -7, -12];
const DEFAULT_PITCH_SHIFT_INDEX = 6;

const NEBULA_ROTATION_SPEED_OUTER = 0.001;
const NEBULA_ROTATION_SPEED_INNER = -0.002;
const NEBULA_PULSE_SPEED = 0.08;
const NEBULA_BASE_FREQ_FACTOR = 0.4;
const NEBULA_OSC_INTERVALS = [0, 7, 12];
const NEBULA_OSC_DETUNE = 7;
const NEBULA_FILTER_LFO_RATE = 0.04;
const NEBULA_FILTER_LFO_DEPTH_FACTOR = 6;
const NEBULA_VOL_LFO_RATE = 0.08;
const NEBULA_VOL_LFO_DEPTH = 0.18;
const NEBULA_VOL_SCALING = 0.09;
const NEBULA_MAX_VOL = 0.28;
const NEBULA_FILTER_Q = 2.5;

let currentTool = 'edit';
let nodeTypeToAdd = null;
let waveformToAdd = null;
let noteIndexToAdd = -1; // -1 for Random
let noteSelectElement = null; // Reference to the select dropdown
let noteSelectContainer = null; // Reference to the container div for the note selector

let isDragging = false;
let isConnecting = false; let isResizing = false;
let nodeClickedAtMouseDown = null;
let connectingNode = null;
let resizeStartSize = 1.0; let resizeStartY = 0;
let mousePos = { x: 0, y: 0 };
let screenMousePos = { x: 0, y: 0 };
let didDrag = false;
let mouseDownPos = { x: 0, y: 0 };
let selectedNodes = new Set();
let isSelecting = false;
let selectionRect = { startX: 0, startY: 0, endX: 0, endY: 0, active: false };
let nodeDragOffsets = new Map();
let dragStartPos = { x: 0, y: 0 };

const HUE_STEP = 30;
const scales = {
    major_pentatonic: { name: "Deep Space", notes: [0, 2, 4, 7, 9], theme: "theme-major-pentatonic", baseFreq: 130.81, baseHSL: { h: 220, s: 75, l: 65 } },
    minor_pentatonic: { name: "Nebula", notes: [0, 3, 5, 7, 10], theme: "theme-minor-pentatonic", baseFreq: 110.00, baseHSL: { h: 280, s: 70, l: 68 } },
    major: { name: "Aurora", notes: [0, 2, 4, 5, 7, 9, 11], theme: "theme-major", baseFreq: 130.81, baseHSL: { h: 150, s: 70, l: 60 } },
    minor: { name: "Sunset", notes: [0, 2, 3, 5, 7, 8, 10], theme: "theme-minor", baseFreq: 110.00, baseHSL: { h: 25, s: 80, l: 65 } },
    chromatic: { name: "Starfield", notes: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], theme: "theme-chromatic", baseFreq: 130.81, baseHSL: { h: 0, s: 0, l: 75 } }
};
let currentScale = scales.major_pentatonic;
const noteNames = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
const MIN_SCALE_INDEX = -24;
const MAX_SCALE_INDEX = 36;
const TEMPO_FACTORS = [0.25, 0.5, 1, 1.5, 2, 3, 4];

let tapTempoTimes = [];
const MAX_TAP_INTERVAL = 2000;
const MAX_TAP_TIMES = 4;

let currentConstellationGroup = new Set();
let groupVolumeGain = null;
const CONSTELLATION_NODE_TYPES = ['sound'];

let isGridVisible = false;
let gridType = 'lines';
let isSnapEnabled = false;
let gridSize = 50;
let isInfoTextVisible = true;

let viewOffsetX = 0;
let viewOffsetY = 0;
let viewScale = 1.0;
const MIN_ZOOM = 0.2;
const MAX_ZOOM = 3.0;
const ZOOM_SENSITIVITY = 0.001;
const PAN_SPEED = 10;
let isPanning = false;
let panStart = { x: 0, y: 0 };
let isSpacebarDown = false;

const MAX_HISTORY_SIZE = 50;
let historyStack = [];
let historyIndex = -1;
let isPerformingUndoRedo = false;

let isGlobalSyncEnabled = false;
let globalBPM = 120;
const subdivisionOptions = [ { label: '1/32', value: 0.125 }, { label: '1/16', value: 0.25 }, { label: '1/8', value: 0.5 }, { label: '1/4', value: 1 }, { label: '1/2', value: 2 }, { label: '1/1', value: 4 } ];
const DEFAULT_SUBDIVISION_INDEX = 3;

let isPlaying = false;
let animationFrameId = null;
let userHasInteracted = false;
let lastBeatTime = 0;

const pulsarTypes = [
    { type: 'start', label: 'Pulsar', icon: '🔆' }
];

const waveformTypes = [
     { type: 'fmBell', label: 'Bell', icon: '🔔' },
     { type: 'fmXylo', label: 'Xylo', icon: '🥁' },
     { type: 'sine', label: 'Sine', icon: '○' },
     { type: 'triangle', label: 'Triangle', icon: '△' },
     { type: 'square', label: 'Square', icon: '□' },
     { type: 'sawtooth', label: 'Saw', icon: '📈' },
     { type: 'sampler_marimba', label: 'Marimba', icon: '🛰️', loadFailed: false },
     { type: 'sampler_piano', label: 'Piano', icon: '🛰️', loadFailed: false },
     { type: 'sampler_flute', label: 'Flute', icon: '🛰️', loadFailed: false }
];


function getFrequency(scaleDef, index, oct = 0) { const notes = scaleDef.notes; const noteIdx = index % notes.length; const octOffset = Math.floor(index / notes.length) + oct; const semitones = notes[noteIdx] + (octOffset * 12); return scaleDef.baseFreq * Math.pow(2, semitones / 12); }
function getNoteName(absoluteSemitone) { const baseNoteIndex = 0; const baseOctave = 3; const totalSemitonesFromC0 = 36 + absoluteSemitone; const noteIndex = totalSemitonesFromC0 % 12; const octave = Math.floor(totalSemitonesFromC0 / 12); return noteNames[noteIndex] + octave; }
function getNoteNameFromScaleIndex(scaleDef, index) { const notes = scaleDef.notes; const noteIdx = index % notes.length; const octOffset = Math.floor(index / notes.length); const semitones = notes[noteIdx] + (octOffset * 12); return getNoteName(semitones); }
function distance(x1, y1, x2, y2) { const dx = x1 - x2; const dy = y1 - y2; return Math.sqrt(dx * dx + dy * dy); }
function lerp(a, b, t) { return a + (b - a) * t; }
function findNodeAt(worldX, worldY) { for (let i = nodes.length - 1; i >= 0; i--) { const n = nodes[i]; const apparentRadius = (NODE_RADIUS_BASE * n.size * 1.15) / viewScale; const d = distance(worldX, worldY, n.x, n.y); if (d < apparentRadius) { return n; } } return null; }
function findNodeById(id) { return nodes.find(n => n.id === id); }
function findConnectionById(id) { return connections.find(c => c.id === id); }
function hslToRgba(h, s, l, a = 1) { let r, g, b; s /= 100; l /= 100; if (s == 0) { r = g = b = l; } else { const hue2rgb = (p, q, t) => { if (t < 0) t += 1; if (t > 1) t -= 1; if (t < 1 / 6) return p + (q - p) * 6 * t; if (t < 1 / 2) return q; if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6; return p; }; const q = l < 0.5 ? l * (1 + s) : l + s - l * s; const p = 2 * l - q; h /= 360; r = hue2rgb(p, q, h + 1 / 3); g = hue2rgb(p, q, h); b = hue2rgb(p, q, h - 1 / 3); } return `rgba(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)}, ${a})`; }
function getWorldCoords(screenX, screenY) { return { x: (screenX - viewOffsetX) / viewScale, y: (screenY - viewOffsetY) / viewScale }; }
function getScreenCoords(worldX, worldY) { return { x: worldX * viewScale + viewOffsetX, y: worldY * viewScale + viewOffsetY }; }

function updateLoadingIndicator() {
    const percent = totalSamples > 0 ? Math.round((samplesLoadedCount / totalSamples) * 100) : 100;
    loadingIndicator.textContent = `Loading Samples... ${percent}%`;
    if (samplesLoadedCount === totalSamples) {
        loadingIndicator.style.display = 'none';
    } else {
        loadingIndicator.style.display = 'block';
    }
}

async function loadSample(url, sampleName) {
    updateLoadingIndicator();
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status} for ${url}`);
        const arrayBuffer = await response.arrayBuffer();
        let decodedBuffer = null;

        if (typeof audioContext.decodeAudioData === 'function' && audioContext.decodeAudioData.length !== 1) {
             decodedBuffer = await audioContext.decodeAudioData(arrayBuffer);
        } else {
             decodedBuffer = await new Promise((resolve, reject) => {
                 audioContext.decodeAudioData(arrayBuffer, buffer => {
                     resolve(buffer);
                 }, error => {
                     reject(error);
                 });
             });
        }

        samplesLoadedCount++;
        updateLoadingIndicator();
        return { name: sampleName, buffer: decodedBuffer, success: true };

    } catch (error) {
        updateLoadingIndicator();
        const waveformName = `sampler_${sampleName.toLowerCase()}`;
        const wfType = waveformTypes.find(w => w.type === waveformName);
        if (wfType) wfType.loadFailed = true;
        return { name: sampleName, buffer: null, success: false };
    }
}


async function setupAudio() {
    if (audioContext) return audioContext;
    try {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        masterGain = audioContext.createGain();
        masterGain.gain.value = 0.8;
        masterGain.connect(audioContext.destination);
        if (audioContext.state !== 'running') { }
        reverbNode = audioContext.createConvolver();
        reverbWetGain = audioContext.createGain();
        reverbWetGain.gain.value = 0.5;
        reverbNode.connect(reverbWetGain);
        reverbWetGain.connect(masterGain);
        try {
            const r=await fetch(REVERB_IR_URL); if(!r.ok)throw new Error(`E ${r.status}`);const ab=await r.arrayBuffer(); if(audioContext.decodeAudioData.length===1){await new Promise((res,rej)=>{audioContext.decodeAudioData(ab,b=>{reverbNode.buffer=b;isReverbReady=true;res();},e=>{isReverbReady=false;rej(e);});});}else{const b=await audioContext.decodeAudioData(ab);reverbNode.buffer=b;isReverbReady=true;}
        } catch (e) { isReverbReady = false; }

        samplesLoadedCount = 0;
        totalSamples = 3;
        updateLoadingIndicator();

        const sampleLoadPromises = [
            loadSample(MARIMBA_SAMPLE_URL, 'Marimba'),
            loadSample(PIANO_SAMPLE_URL, 'Piano'),
            loadSample(FLUTE_SAMPLE_URL, 'Flute')
        ];

        const loadResults = await Promise.all(sampleLoadPromises);

        loadResults.forEach(result => {
            if (result.success) {
                switch (result.name) {
                    case 'Marimba':
                        marimbaBuffer = result.buffer;
                        isMarimbaLoaded = true;
                        break;
                    case 'Piano':
                        pianoBuffer = result.buffer;
                        isPianoLoaded = true;
                        break;
                    case 'Flute':
                        fluteBuffer = result.buffer;
                        isFluteLoaded = true;
                        break;
                }
            } else {
                 switch (result.name) {
                    case 'Marimba': isMarimbaLoaded = false; break;
                    case 'Piano': isPianoLoaded = false; break;
                    case 'Flute': isFluteLoaded = false; break;
                }
            }
        });

        updateLoadingIndicator();

        isAudioReady = true;

        resetSideToolbars();
        changeScale(scaleSelect.value);
        updateSyncUI();
        updateGroupControlsUI();
        updateInfoToggleUI();
        if (historyStack.length === 0) saveState();
        return audioContext;
    } catch (e) {
        startMessage.textContent = "Audio Context Error";
        startMessage.style.display = 'block';
        return null;
    }
}


function updateNodeAudioParams(node) { if (!node.audioNodes || !isAudioReady) return; const now = audioContext.currentTime; const params = node.audioParams; try { if (node.type === 'sound') { const { oscillator, lowPassFilter, reverbSendGain, modulatorOsc, modulatorGain, volLfoGain } = node.audioNodes; if (!lowPassFilter) return; if (params.waveform && !params.waveform.startsWith('sampler_') && oscillator) { oscillator.frequency.setTargetAtTime(params.pitch, now, 0.02); oscillator.type = (params.waveform === 'fmBell' || params.waveform === 'fmXylo') ? 'sine' : params.waveform; if ((params.waveform === 'fmBell' || params.waveform === 'fmXylo') && modulatorOsc && modulatorGain) { const modRatio = (params.waveform === 'fmBell') ? 1.4 : 3.5; const modDepthFactor = (params.waveform === 'fmBell') ? 4 : 10; modulatorOsc.frequency.setTargetAtTime(params.pitch * modRatio, now, 0.02); const modDepth = params.pitch * modDepthFactor * params.fmModDepthScale; modulatorGain.gain.setTargetAtTime(modDepth, now, 0.02); } } const sizeRange = MAX_NODE_SIZE - MIN_NODE_SIZE; const freqRange = MAX_FILTER_FREQ - MIN_FILTER_FREQ; const normalizedSize = (node.size - MIN_NODE_SIZE) / (sizeRange || 1); params.lowPassFreq = MIN_FILTER_FREQ + normalizedSize * freqRange; lowPassFilter.frequency.setTargetAtTime(params.lowPassFreq, now, 0.02); if (isReverbReady && reverbSendGain) { reverbSendGain.gain.setTargetAtTime(params.reverbSend, now, 0.02); } const groupFluctActive = groupFluctuateToggle.checked && currentConstellationGroup.has(node.id); const targetLfoDepth = groupFluctActive ? parseFloat(groupFluctuateAmount.value) : node.audioParams.volLfoDepth; if (volLfoGain) { volLfoGain.gain.setTargetAtTime(targetLfoDepth, now, 0.1); } } else if (node.type === 'nebula') {
        const { gainNode, filterNode, filterLfoGain, volLfoGain, oscillators } = node.audioNodes; if (!gainNode || !filterNode || !oscillators) return; const targetVol = Math.min(NEBULA_MAX_VOL, node.size * NEBULA_VOL_SCALING); gainNode.gain.setTargetAtTime(targetVol, now, 0.1); const sizeRange = MAX_NODE_SIZE - MIN_NODE_SIZE; const normalizedSize = (node.size - MIN_NODE_SIZE) / (sizeRange || 1); const baseFreq = params.pitch;
        const filterFreq = baseFreq * 2 + normalizedSize * baseFreq * 8;
        filterNode.frequency.setTargetAtTime(filterFreq, now, 0.1);
        if (filterLfoGain) { filterLfoGain.gain.setTargetAtTime(baseFreq * NEBULA_FILTER_LFO_DEPTH_FACTOR, now, 0.1); }
        if (volLfoGain) { volLfoGain.gain.setTargetAtTime(NEBULA_VOL_LFO_DEPTH, now, 0.1); }
        oscillators.forEach((osc, i) => {
            const interval = NEBULA_OSC_INTERVALS[i];
            const freq = baseFreq * Math.pow(2, interval / 12);
            osc.frequency.setTargetAtTime(freq, now, 0.1);
            const desiredWaveform = (node.audioParams.waveform === 'fmBell' || node.audioParams.waveform === 'fmXylo') ? 'sine' : (node.audioParams.waveform || 'sawtooth');
            if (osc.type !== desiredWaveform) { osc.type = desiredWaveform; }
        });
    } } catch (e) { } }
function createAudioNodesForNode(node) { if (!audioContext || (node.type !== 'sound' && node.type !== 'nebula')) return null;
    const now = audioContext.currentTime; const startDelay = now + 0.02; try { if (node.type === 'sound') { const gainNode = audioContext.createGain(); gainNode.gain.setValueAtTime(0, now); const lowPassFilter = audioContext.createBiquadFilter(); lowPassFilter.type = 'lowpass'; lowPassFilter.Q.value = 1.2; let reverbSendGain = null; if (isReverbReady && reverbNode) { reverbSendGain = audioContext.createGain(); reverbSendGain.gain.value = node.audioParams.reverbSend; } const volLfo = audioContext.createOscillator(); volLfo.type = 'sine'; volLfo.frequency.setValueAtTime(node.audioParams.volLfoRate, now); const volLfoGain = audioContext.createGain(); volLfoGain.gain.value = node.audioParams.volLfoDepth; volLfo.connect(volLfoGain); volLfoGain.connect(gainNode.gain); let oscillator = null; let modulatorOsc = null; let modulatorGain = null; if (node.audioParams.waveform && !node.audioParams.waveform.startsWith('sampler_')) { oscillator = audioContext.createOscillator(); oscillator.type = node.audioParams.waveform; if (node.audioParams.waveform === 'fmBell' || node.audioParams.waveform === 'fmXylo') { oscillator.type = 'sine'; modulatorOsc = audioContext.createOscillator(); modulatorOsc.type = 'sine'; modulatorGain = audioContext.createGain(); modulatorOsc.connect(modulatorGain); modulatorGain.connect(oscillator.frequency); } oscillator.connect(lowPassFilter); } lowPassFilter.connect(gainNode); gainNode.connect(masterGain); if (reverbSendGain) { gainNode.connect(reverbSendGain); reverbSendGain.connect(reverbNode); } try { volLfo.start(startDelay); } catch(e){} if (oscillator) { try { oscillator.start(startDelay); } catch(e){} } if (modulatorOsc) { try { modulatorOsc.start(startDelay); } catch(e){} } return { oscillator, gainNode, lowPassFilter, reverbSendGain, modulatorOsc, modulatorGain, volLfo, volLfoGain }; } else if (node.type === 'nebula') {
        const gainNode = audioContext.createGain(); gainNode.gain.value = 0; const filterNode = audioContext.createBiquadFilter(); filterNode.type = 'lowpass'; filterNode.Q.value = NEBULA_FILTER_Q; const baseFreq = node.audioParams.pitch;
        const filterLfo = audioContext.createOscillator(); filterLfo.type = 'sine'; filterLfo.frequency.setValueAtTime(NEBULA_FILTER_LFO_RATE, now); const filterLfoGain = audioContext.createGain(); filterLfoGain.gain.setValueAtTime(baseFreq * NEBULA_FILTER_LFO_DEPTH_FACTOR, now); filterLfo.connect(filterLfoGain); filterLfoGain.connect(filterNode.frequency); const volLfo = audioContext.createOscillator(); volLfo.type = 'sine'; volLfo.frequency.setValueAtTime(NEBULA_VOL_LFO_RATE, now); const volLfoGain = audioContext.createGain(); volLfoGain.gain.value = NEBULA_VOL_LFO_DEPTH; volLfo.connect(volLfoGain); volLfoGain.connect(gainNode.gain); const oscillators = []; const baseWaveform = node.audioParams.waveform || 'sawtooth'; const waveformType = (baseWaveform === 'fmBell' || baseWaveform === 'fmXylo') ? 'sine' : baseWaveform; NEBULA_OSC_INTERVALS.forEach((interval, i) => { const osc = audioContext.createOscillator(); const freq = baseFreq * Math.pow(2, interval / 12); osc.frequency.setValueAtTime(freq, now); osc.detune.setValueAtTime((i % 2 === 0 ? 1 : -1) * NEBULA_OSC_DETUNE * (i + 1), now); osc.type = waveformType; osc.connect(filterNode); oscillators.push(osc); }); filterNode.connect(gainNode); gainNode.connect(masterGain); const sizeRange = MAX_NODE_SIZE - MIN_NODE_SIZE; const normalizedSize = (node.size - MIN_NODE_SIZE) / (sizeRange || 1); const initialVol = Math.min(NEBULA_MAX_VOL, node.size * NEBULA_VOL_SCALING); const initialFilterFreq = baseFreq * 2 + normalizedSize * baseFreq * 8; filterNode.frequency.setValueAtTime(initialFilterFreq, now); gainNode.gain.linearRampToValueAtTime(initialVol, now + 0.5); try { filterLfo.start(startDelay); } catch(e) {} try { volLfo.start(startDelay); } catch(e) {} oscillators.forEach(osc => { try { osc.start(startDelay); } catch(e) {} }); return { gainNode, filterNode, filterLfo, filterLfoGain, volLfo, volLfoGain, oscillators }; } } catch (e) { return null; } return null; }

function triggerNodeEffect(node) {
    if (node.type !== 'sound' || !node.audioNodes?.gainNode || !isAudioReady) return;
    node.isTriggered = true;
    node.animationState = 1;
    const now = audioContext.currentTime;
    const { gainNode, lowPassFilter, modulatorGain } = node.audioNodes;
    const params = node.audioParams;
    if (!gainNode || !lowPassFilter) {
        node.isTriggered = false;
        node.animationState = 0;
        return;
    }
    const targetVolume = 0.1 + (node.size / MAX_NODE_SIZE) * 0.6;
    const clampedVolume = Math.max(0.05, Math.min(0.9, targetVolume));
    let releaseTime = 0.3 + (node.size * 0.2);
    try {
        gainNode.gain.cancelScheduledValues(now);
        gainNode.gain.setValueAtTime(0, now);
        gainNode.gain.linearRampToValueAtTime(clampedVolume, now + 0.015);
        if (params.waveform === 'fmBell') releaseTime = 0.8 + (node.size * 0.4);
        else if (params.waveform === 'fmXylo') releaseTime = 0.5 + (node.size * 0.2);
        else if (params.waveform && params.waveform.startsWith('sampler_')) {
            releaseTime = 0.6 + (node.size * 0.3);
        }
        gainNode.gain.setTargetAtTime(0, now + 0.015, releaseTime / 4);
        const soundEndTime = now + 0.015 + releaseTime * 1.1;

        if (params.waveform && params.waveform.startsWith('sampler_')) {
            let bufferToPlay = null;
            let baseFreq = 1;
            switch (params.waveform) {
                case 'sampler_marimba': bufferToPlay = marimbaBuffer; baseFreq = MARIMBA_BASE_FREQ; break;
                case 'sampler_piano': bufferToPlay = pianoBuffer; baseFreq = PIANO_BASE_FREQ; break;
                case 'sampler_flute': bufferToPlay = fluteBuffer; baseFreq = FLUTE_BASE_FREQ; break;
            }

            if (bufferToPlay) {
                const source = audioContext.createBufferSource();
                source.buffer = bufferToPlay;
                const desiredFreq = params.pitch;
                 if (isNaN(desiredFreq) || desiredFreq <= 0) {
                    source.playbackRate.value = 1;
                } else {
                    source.playbackRate.value = Math.max(0.1, Math.min(4, desiredFreq / baseFreq));
                }
                source.connect(lowPassFilter);
                source.start(now);
                source.onended = () => {
                    const stillNode = findNodeById(node.id);
                    if (stillNode) stillNode.isTriggered = false;
                };
            } else {
                gainNode.gain.cancelScheduledValues(now);
                gainNode.gain.setValueAtTime(0, now);
                node.isTriggered = false;
                node.animationState = 0;
                return;
            }
        } else {
            if ((params.waveform === 'fmBell' || params.waveform === 'fmXylo') && modulatorGain) {
                const modDepth = params.pitch * ((params.waveform === 'fmBell') ? 4 : 10) * params.fmModDepthScale;
                modulatorGain.gain.cancelScheduledValues(now); modulatorGain.gain.setValueAtTime(0, now); modulatorGain.gain.linearRampToValueAtTime(modDepth * 1.8, now + 0.01); modulatorGain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
            }
            setTimeout(() => {
                const stillNode = findNodeById(node.id);
                if (stillNode) stillNode.isTriggered = false;
            }, (soundEndTime - now) * 1000);
        }
    } catch (e) {
        node.isTriggered = false;
        node.animationState = 0;
    }
    createParticles(node.x, node.y, 5 + Math.floor(node.size * 3));
}


function propagateTrigger(targetNode, incomingDelay, pulseId, sourceNodeId = -1, hopsRemaining = Infinity, incomingPulse = { type: 'trigger', data: {} }) {
    if (!targetNode || targetNode.type === 'nebula' || targetNode.lastTriggerPulseId === pulseId || hopsRemaining <= 0) { return; }
    if (incomingPulse.type !== 'trigger') { return; }

    const sourceNode = findNodeById(sourceNodeId);
    if (sourceNode && sourceNode.isStartNode && targetNode.id === sourceNode.pulseOriginNodeId && sourceNodeId !== -1) {
         targetNode.lastTriggerPulseId = pulseId;
         return;
    }

    targetNode.lastTriggerPulseId = pulseId;
    let delayMultiplier = 1.0; if (targetNode.type === 'speed') { delayMultiplier = targetNode.audioParams.tempoFactor || 1.0; }
    const actualTriggerDelay = incomingDelay;
    setTimeout(() => {
        const currentNode = findNodeById(targetNode.id); if (!currentNode) return;
        let canPropagate = true; let triggerAudioEffect = false; let triggerVisualEffect = true; let stateChangedForUndo = false;

        if (currentNode.isStartNode && sourceNodeId !== -1) {
             currentNode.isEnabled = !currentNode.isEnabled;
             stateChangedForUndo = true;
             currentNode.animationState = 1;
             triggerAudioEffect = false;
             canPropagate = false;
        } else if (currentNode.type === 'gate') {
            triggerAudioEffect = false; const counterBefore = currentNode.gateCounter || 0; currentNode.gateCounter = counterBefore + 1; const modeIndex = currentNode.gateModeIndex || 0; const mode = GATE_MODES[modeIndex]; canPropagate = false;
            switch (mode) { case '1/2': if (currentNode.gateCounter % 2 === 0) canPropagate = true; break; case '1/3': if (currentNode.gateCounter % 3 === 0) canPropagate = true; break; case '1/4': if (currentNode.gateCounter % 4 === 0) canPropagate = true; break; case '2/3': if (currentNode.gateCounter % 3 !== 0) canPropagate = true; break; case '3/4': if (currentNode.gateCounter % 4 !== 0) canPropagate = true; break; case 'RAND': const randomCheck = Math.random() < GATE_RANDOM_THRESHOLD; currentNode.lastRandomGateResult = randomCheck; if (randomCheck) canPropagate = true; break; }
            currentNode.animationState = 1;
        } else if (currentNode.type === 'probabilityGate') {
             triggerAudioEffect = false;
             canPropagate = false;
             if (Math.random() < (currentNode.audioParams.probability ?? DEFAULT_PROBABILITY)) {
                 canPropagate = true;
             }
             currentNode.animationState = 1;
        } else if (currentNode.type === 'pitchShift') {
            triggerAudioEffect = false; canPropagate = true; currentNode.animationState = 1; const shiftIndex = currentNode.pitchShiftIndex ?? DEFAULT_PITCH_SHIFT_INDEX; let shiftAmount = PITCH_SHIFT_AMOUNTS[shiftIndex];
            if (currentNode.pitchShiftAlternating) { shiftAmount *= (currentNode.pitchShiftDirection || 1); currentNode.pitchShiftDirection = (currentNode.pitchShiftDirection || 1) * -1; stateChangedForUndo = true; }
            let pitchActuallyChanged = false;
            currentNode.connections.forEach(neighborId => { if (neighborId === sourceNodeId) return; const neighborNode = findNodeById(neighborId); if (neighborNode && (neighborNode.type === 'sound' || neighborNode.type === 'nebula')) {
                const oldIndex = neighborNode.audioParams.scaleIndex; neighborNode.audioParams.scaleIndex = Math.max(MIN_SCALE_INDEX, Math.min(MAX_SCALE_INDEX, oldIndex + shiftAmount)); neighborNode.audioParams.pitch = getFrequency(currentScale, neighborNode.audioParams.scaleIndex); updateNodeAudioParams(neighborNode); if (oldIndex !== neighborNode.audioParams.scaleIndex) { pitchActuallyChanged = true; neighborNode.animationState = 0.7; setTimeout(() => { const checkNode = findNodeById(neighborId); if (checkNode && !checkNode.isTriggered) checkNode.animationState = 0; }, 150); } } });
            if (pitchActuallyChanged) { stateChangedForUndo = true; }
        } else if (currentNode.type === 'sound') {
            triggerAudioEffect = true; canPropagate = true; triggerVisualEffect = false;
        } else if (currentNode.type === 'start' || currentNode.type === 'speed') {
            triggerAudioEffect = false; canPropagate = true; currentNode.animationState = 1;
        } else {
             canPropagate = false; triggerVisualEffect = false;
        }

        if (triggerAudioEffect && currentNode.type === 'sound') { triggerNodeEffect(currentNode); }
        if (triggerVisualEffect && currentNode.type !== 'sound' && !currentNode.isStartNode) { setTimeout(() => { const nodeCheck = findNodeById(currentNode.id); if (nodeCheck) nodeCheck.animationState = 0; }, 150); }
        if (stateChangedForUndo) { saveState(); }
        if (canPropagate) {
            const nextHops = (hopsRemaining === Infinity) ? Infinity : hopsRemaining - 1;
            if (nextHops > 0 || nextHops === Infinity) {
                currentNode.connections.forEach(neighborId => {
                    if (neighborId === sourceNodeId) return;
                    const neighborNode = findNodeById(neighborId);
                    const connection = connections.find(c => (c.nodeAId === currentNode.id && c.nodeBId === neighborId) || (c.nodeAId === neighborId && c.nodeBId === currentNode.id));
                    if (neighborNode && neighborNode.type !== 'nebula' && connection && neighborNode.lastTriggerPulseId !== pulseId) {
                         const baseTravelTime = connection.length * DELAY_FACTOR;
                         let outgoingDelayMultiplier = 1.0;
                         if(neighborNode.type === 'speed') { outgoingDelayMultiplier = neighborNode.audioParams.tempoFactor || 1.0; }
                         const outgoingTravelTime = baseTravelTime * outgoingDelayMultiplier;
                         createVisualPulse(connection.id, outgoingTravelTime, currentNode.id, nextHops, 'trigger');
                         propagateTrigger(neighborNode, outgoingTravelTime, pulseId, currentNode.id, nextHops, incomingPulse);
                    }
                });
            }
        }
    }, actualTriggerDelay * 1000);
}

function createParticles(x, y, count) { const baseColor = getComputedStyle(document.documentElement).getPropertyValue('--particle-color').trim() || 'rgba(220, 240, 255, 0.7)'; for(let i=0; i < count; i++){ const angle = Math.random() * Math.PI * 2; const speed = 1 + Math.random() * 1.5; const life = 0.6 + Math.random() * 0.6; activeParticles.push({ id: particleIdCounter++, x: x + (Math.random() - 0.5) * 5, y: y + (Math.random() - 0.5) * 5, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, life: life, maxLife: life, radius: 1 + Math.random() * 2, color: baseColor }); } }
function createWindParticles(count) { const windColor = getComputedStyle(document.documentElement).getPropertyValue('--wind-particle-color').trim() || 'rgba(180, 210, 230, 0.3)'; for(let i=0; i < count; i++){ const angle = Math.PI * 0.7 + Math.random() * Math.PI * 0.6; const speed = 0.3 + Math.random() * 0.4; windParticles.push({ id: particleIdCounter++, x: Math.random() * canvas.width * 1.2 - canvas.width * 0.1, y: -10, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, life: 20 + Math.random() * 20, maxLife: 40, radius: 0.5 + Math.random() * 1.0, color: windColor }); } }
function updateAndDrawParticles(deltaTime, now) { activeParticles = activeParticles.filter(p => { p.x += p.vx * (deltaTime * 60); p.y += p.vy * (deltaTime * 60); p.vy += 0.02; p.life -= deltaTime; if (p.life <= 0) return false; const alpha = Math.max(0, (p.life / p.maxLife) * 0.9); try { ctx.fillStyle = p.color.replace(/[\d\.]+\)$/g, `${alpha})`); ctx.beginPath(); ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2); ctx.fill(); } catch(e){} return true; }); if (Math.random() < 0.25) createWindParticles(1); windParticles.forEach(p => { p.x += p.vx * (deltaTime * 60); p.y += p.vy * (deltaTime * 60); const padding = 10; const worldTopLeft = getWorldCoords(-padding, -padding); const worldBottomRight = getWorldCoords(canvas.width + padding, canvas.height + padding); const worldWidth = worldBottomRight.x - worldTopLeft.x; const worldHeight = worldBottomRight.y - worldTopLeft.y; if (p.y > worldBottomRight.y) { p.y = worldTopLeft.y; p.x = worldTopLeft.x + Math.random() * worldWidth; } else if (p.y < worldTopLeft.y) { p.y = worldBottomRight.y; p.x = worldTopLeft.x + Math.random() * worldWidth; } if (p.x > worldBottomRight.x) { p.x = worldTopLeft.x; p.y = worldTopLeft.y + Math.random() * worldHeight; } else if (p.x < worldTopLeft.x) { p.x = worldBottomRight.x; p.y = worldTopLeft.y + Math.random() * worldHeight; } const alpha = 0.3; try { ctx.fillStyle = p.color.replace(/[\d\.]+\)$/g, `${alpha})`); ctx.beginPath(); ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2); ctx.fill(); } catch(e){} }); }
function createVisualPulse(connId, dur, startId, hopsLeft = Infinity, pulseType = 'trigger') { if (!isAudioReady || dur <= 0) return; const p = { id: pulseIdCounter++, connectionId: connId, startTime: audioContext.currentTime, duration: dur, startNodeId: startId, hopsLeft: hopsLeft, type: pulseType }; activePulses.push(p); }
function updateAndDrawPulses(now) { const pulseBaseColor = getComputedStyle(document.documentElement).getPropertyValue('--pulse-visual-color').trim() || 'rgba(255, 255, 255, 1)'; activePulses = activePulses.filter(p => { const elapsedTime = now - p.startTime; if (elapsedTime >= p.duration) return false; const connection = findConnectionById(p.connectionId); if (!connection) return false; const nodeA = findNodeById(connection.nodeAId); const nodeB = findNodeById(connection.nodeBId); if (!nodeA || !nodeB) return false; const startNode = (p.startNodeId === nodeA.id) ? nodeA : nodeB; const endNode = (p.startNodeId === nodeA.id) ? nodeB : nodeA; const progress = Math.min(1.0, elapsedTime / p.duration); const midX = (startNode.x + endNode.x) / 2 + connection.controlPointOffsetX; const midY = (startNode.y + endNode.y) / 2 + connection.controlPointOffsetY; const pX = lerp(lerp(startNode.x, midX, progress), lerp(midX, endNode.x, progress), progress); const pY = lerp(lerp(startNode.y, midY, progress), lerp(midY, endNode.y, progress), progress); const prevProgress = Math.max(0, progress - 0.02); const prevX = lerp(lerp(startNode.x, midX, prevProgress), lerp(midX, endNode.x, prevProgress), prevProgress); const prevY = lerp(lerp(startNode.y, midY, prevProgress), lerp(midY, endNode.y, prevProgress), prevProgress); const angle = Math.atan2(pY - prevY, pX - prevX); const tailLength = 5 + p.duration * 30; const colorToUse = pulseBaseColor; ctx.fillStyle = colorToUse; ctx.shadowColor = colorToUse; ctx.shadowBlur = 8; ctx.beginPath(); ctx.arc(pX, pY, PULSE_SIZE, 0, Math.PI * 2); ctx.fill(); ctx.beginPath(); ctx.moveTo(pX + Math.cos(angle + Math.PI * 0.8) * PULSE_SIZE * 0.5, pY + Math.sin(angle + Math.PI * 0.8) * PULSE_SIZE * 0.5); ctx.lineTo(pX + Math.cos(angle + Math.PI) * tailLength, pY + Math.sin(angle + Math.PI) * tailLength); ctx.lineTo(pX + Math.cos(angle - Math.PI * 0.8) * PULSE_SIZE * 0.5, pY + Math.sin(angle - Math.PI * 0.8) * PULSE_SIZE * 0.5); ctx.closePath(); const tailGradient = ctx.createLinearGradient(pX, pY, pX + Math.cos(angle + Math.PI) * tailLength, pY + Math.sin(angle + Math.PI) * tailLength); const alpha = Math.max(0, 1.0 - progress); try { tailGradient.addColorStop(0, colorToUse.replace(/[\d\.]+\)$/g, `${alpha})`)); tailGradient.addColorStop(1, colorToUse.replace(/[\d\.]+\)$/g, '0)')); } catch(e){} ctx.fillStyle = tailGradient; ctx.fill(); ctx.shadowBlur = 0; return true; }); }

function addNode(x, y, type, waveform) {
    if (!isAudioReady) { return null; }
    let currentEvent = window.event;
    let applySnap = isSnapEnabled && !(currentEvent && currentEvent.shiftKey);
    let finalPos = applySnap ? snapToGrid(x, y) : { x: x, y: y };
    const isStartNode = (type === 'start');
    const nodeType = type;
    let initialScaleIndex = 0;
    let initialPitch = 0;
    if (type === 'sound' || type === 'nebula') {
        if (noteIndexToAdd !== -1) {
            initialScaleIndex = noteIndexToAdd;
        } else {
            initialScaleIndex = Math.floor(Math.random() * currentScale.notes.length * 2); // Default random
        }
        initialScaleIndex = Math.max(MIN_SCALE_INDEX, Math.min(MAX_SCALE_INDEX, initialScaleIndex));
        initialPitch = getFrequency(currentScale, initialScaleIndex);
         if (isNaN(initialPitch)) {
             initialScaleIndex = 0; // Fallback
             initialPitch = getFrequency(currentScale, 0);
         }
    }
    const initialTempoIndex = TEMPO_FACTORS.indexOf(1.0);
    let nodeWaveform = null;
    if (type === 'sound' || type === 'nebula') {
        if (type === 'nebula' && waveform && waveform.startsWith('sampler_')) {
             nodeWaveform = 'sawtooth';
        } else {
            nodeWaveform = waveform || (type === 'sound' ? 'fmBell' : 'sawtooth');
        }
    }
    const randomSize = (type === 'start') ? (MIN_NODE_SIZE + Math.random() * (MAX_NODE_SIZE - MIN_NODE_SIZE) * 0.7) : 1.0;
    const starPoints = (type === 'start') ? 5 + Math.floor(Math.random() * 4) : 6;
    const newNode = { id: nodeIdCounter++, x: finalPos.x, y: finalPos.y, size: randomSize, radius: NODE_RADIUS_BASE, type: nodeType, connections: new Set(), isSelected: false, isInConstellation: false, audioParams: { triggerInterval: DEFAULT_TRIGGER_INTERVAL, tempoFactor: TEMPO_FACTORS[initialTempoIndex], tempoIndex: initialTempoIndex, waveform: nodeWaveform, reverbSend: DEFAULT_REVERB_SEND, lowPassFreq: MAX_FILTER_FREQ, fmModDepthScale: 1.0, pitch: initialPitch, scaleIndex: initialScaleIndex, volLfoRate: 0.1 + Math.random() * 0.2, volLfoDepth: 0, probability: DEFAULT_PROBABILITY }, audioNodes: null, isStartNode: isStartNode, isTriggered: false, lastTriggerPulseId: -1, animationState: 0, lastTriggerTime: -1, currentAngle: (type === 'gate' || type === 'nebula' || (type === 'sound' && waveform && waveform.startsWith('sampler_'))) ? Math.random() * Math.PI * 2 : 0, innerAngle: (type === 'nebula') ? Math.random() * Math.PI * 2 : 0, pulsePhase: (type === 'nebula') ? Math.random() * Math.PI * 2 : 0, gateModeIndex: (type === 'gate') ? DEFAULT_GATE_MODE_INDEX : 0, gateCounter: 0, lastRandomGateResult: true, pitchShiftIndex: (type === 'pitchShift') ? DEFAULT_PITCH_SHIFT_INDEX : 0, pitchShiftAmount: (type === 'pitchShift') ? PITCH_SHIFT_AMOUNTS[DEFAULT_PITCH_SHIFT_INDEX] : 0, pitchShiftAlternating: false, pitchShiftDirection: 1, syncSubdivisionIndex: DEFAULT_SUBDIVISION_INDEX, nextSyncTriggerTime: 0, starPoints: starPoints, isEnabled: true, pulseOriginNodeId: -1 };
    newNode.audioNodes = createAudioNodesForNode(newNode);
    if (newNode.audioNodes) { updateNodeAudioParams(newNode); }
    else if (type === 'sound' || type === 'nebula') { }
    nodes.push(newNode);

    if (typeof newNode.x !== 'undefined' && typeof newNode.y !== 'undefined') { }
    else { }
    saveState(); return newNode;
}

function removeNode(nodeToRemove) { if (!nodeToRemove) return; const nodeIdsToRemove = new Set([nodeToRemove.id]); if (selectedNodes.has(nodeToRemove.id) && selectedNodes.size > 1) { selectedNodes.forEach(id => nodeIdsToRemove.add(id)); } let stateChanged = false; nodeIdsToRemove.forEach(id => { const node = findNodeById(id); if (!node) return; stateChanged = true; if (node.type === 'sound' && node.audioNodes) { try { node.audioNodes.oscillator?.stop(); } catch (e) {} try { node.audioNodes.modulatorOsc?.stop(); } catch (e) {} try { node.audioNodes.volLfo?.stop(); } catch (e) {} try { node.audioNodes.reverbSendGain?.disconnect(); } catch (e) {} try { node.audioNodes.volLfoGain?.disconnect(); } catch (e) {} try { node.audioNodes.volLfo?.disconnect(); } catch (e) {} try { node.audioNodes.gainNode?.disconnect(); } catch (e) {} try { node.audioNodes.lowPassFilter?.disconnect(); } catch (e) {} try { node.audioNodes.modulatorGain?.disconnect(); } catch(e){} try { node.audioNodes.modulatorOsc?.disconnect(); } catch(e){} try { node.audioNodes.oscillator?.disconnect(); } catch (e) {} } else if (node.type === 'nebula' && node.audioNodes) {
        try { node.audioNodes.filterLfo?.stop(); } catch(e){} try { node.audioNodes.volLfo?.stop(); } catch(e){} node.audioNodes.oscillators?.forEach(osc => { try { osc.stop(); } catch(e) {} }); try { node.audioNodes.filterLfoGain?.disconnect(); } catch(e){} try { node.audioNodes.volLfoGain?.disconnect(); } catch(e){} try { node.audioNodes.filterLfo?.disconnect(); } catch(e){} try { node.audioNodes.volLfo?.disconnect(); } catch(e){} try { node.audioNodes.gainNode?.disconnect(); } catch(e){} try { node.audioNodes.filterNode?.disconnect(); } catch(e){} node.audioNodes.oscillators?.forEach(osc => { try { osc.disconnect(); } catch(e) {} }); } const connectionsToRemove = connections.filter(conn => conn.nodeAId === id || conn.nodeBId === id); connectionsToRemove.forEach(conn => removeConnection(conn, false)); nodes = nodes.filter(n => n.id !== id); selectedNodes.delete(id); currentConstellationGroup.delete(id); }); if (stateChanged) { updateConstellationGroup(); saveState(); } }
function connectNodes(nodeA, nodeB) { if (!nodeA || !nodeB || nodeA === nodeB || nodeA.type === 'nebula' || nodeB.type === 'nebula') return;
    const exists = connections.some(c => (c.nodeAId === nodeA.id && c.nodeBId === nodeB.id) || (c.nodeAId === nodeB.id && c.nodeBId === nodeA.id)); if (exists) return; nodeA.connections.add(nodeB.id); nodeB.connections.add(nodeA.id); const dx = nodeB.x - nodeA.x; const dy = nodeB.y - nodeA.y; const len = Math.sqrt(dx*dx + dy*dy) || 1; const offsetScale = Math.min(len * 0.4, 60); const ctrlOffsetX = (-dy / len) * (Math.random() * offsetScale - offsetScale / 2); const ctrlOffsetY = (dx / len) * (Math.random() * offsetScale - offsetScale / 2); const newConnection = { id: connectionIdCounter++, nodeAId: nodeA.id, nodeBId: nodeB.id, length: len, controlPointOffsetX: ctrlOffsetX, controlPointOffsetY: ctrlOffsetY }; connections.push(newConnection); updateConstellationGroup(); saveState(); }
function removeConnection(connToRemove, updateGroup = true) { if (!connToRemove) return; const nodeA = findNodeById(connToRemove.nodeAId); const nodeB = findNodeById(connToRemove.nodeBId); if (nodeA) nodeA.connections.delete(connToRemove.nodeBId); if (nodeB) nodeB.connections.delete(connToRemove.nodeAId); connections = connections.filter(c => c.id !== connToRemove.id); activePulses = activePulses.filter(p => p.connectionId !== connToRemove.id); if (updateGroup) { updateConstellationGroup(); saveState(); } }

function findConstellation(startNodeId) { const constellationNodes = new Set(); const queue = [startNodeId]; const visited = new Set([startNodeId]); const startNode = findNodeById(startNodeId); if (!startNode || startNode.type !== 'sound') { return constellationNodes; } while (queue.length > 0) { const currentNodeId = queue.shift(); const currentNode = findNodeById(currentNodeId); if (!currentNode) continue; if (currentNode.type === 'sound') { constellationNodes.add(currentNodeId); } currentNode.connections.forEach(neighborId => { if (!visited.has(neighborId)) { visited.add(neighborId); const neighborNode = findNodeById(neighborId); if(neighborNode && neighborNode.type === 'sound') { queue.push(neighborId); } } }); } return constellationNodes; }
function updateConstellationGroup() { if (!isAudioReady) return; const previousConstellationGroup = new Set(currentConstellationGroup); currentConstellationGroup.clear(); nodes.forEach(n => n.isInConstellation = false); if (selectedNodes.size > 0 && currentTool === 'edit') { const firstSelectedId = selectedNodes.values().next().value; const firstSelectedNode = findNodeById(firstSelectedId); if (firstSelectedNode && firstSelectedNode.type === 'sound') { const potentialConstellation = findConstellation(firstSelectedId); let allSelectedInConstellation = true; selectedNodes.forEach(id => { const selectedNode = findNodeById(id); if (!selectedNode || !potentialConstellation.has(id)) { allSelectedInConstellation = false; } }); if (allSelectedInConstellation && potentialConstellation.size > 0) { potentialConstellation.forEach(id => { const node = findNodeById(id); if (node) node.isInConstellation = true; }); currentConstellationGroup = potentialConstellation; } } } const nodesToRouteToGroup = new Set(); const nodesToRouteToMaster = new Set(); previousConstellationGroup.forEach(id => { if (!currentConstellationGroup.has(id)) nodesToRouteToMaster.add(id); }); currentConstellationGroup.forEach(id => { if (!previousConstellationGroup.has(id)) nodesToRouteToGroup.add(id); }); if (currentConstellationGroup.size > 0 && !groupVolumeGain) { groupVolumeGain = audioContext.createGain(); groupVolumeGain.gain.setValueAtTime(parseFloat(groupVolumeSlider.value), audioContext.currentTime); groupVolumeGain.connect(masterGain); } nodesToRouteToMaster.forEach(id => rerouteAudioForNode(findNodeById(id), masterGain)); nodesToRouteToGroup.forEach(id => rerouteAudioForNode(findNodeById(id), groupVolumeGain)); if (currentConstellationGroup.size === 0 && groupVolumeGain) { try { groupVolumeGain.disconnect(); } catch(e){} groupVolumeGain = null; } updateGroupControlsUI(); applyGroupFluctuationSettings(); }
function rerouteAudioForNode(node, destinationNode) { if (!node || node.type !== 'sound' || !node.audioNodes?.gainNode || !isAudioReady) return; const gainNode = node.audioNodes.gainNode; const reverbSendGain = node.audioNodes.reverbSendGain; try { gainNode.disconnect(); if (destinationNode) { gainNode.connect(destinationNode); } else { gainNode.connect(masterGain); } if (reverbSendGain && isReverbReady && reverbNode) { gainNode.connect(reverbSendGain); try { reverbSendGain.disconnect(reverbNode); } catch(e){} reverbSendGain.connect(reverbNode); } } catch (e) { try { gainNode.disconnect(); gainNode.connect(masterGain); if (reverbSendGain) gainNode.connect(reverbSendGain); } catch (e2) {} } }
function updateGroupControlsUI() { const shouldShow = currentTool === 'edit' && currentConstellationGroup.size > 0 && groupVolumeGain; if (shouldShow) { groupControlsDiv.classList.remove('hidden'); groupNodeCountSpan.textContent = currentConstellationGroup.size; if (groupVolumeGain) groupVolumeSlider.value = groupVolumeGain.gain.value; } else { groupControlsDiv.classList.add('hidden'); groupNodeCountSpan.textContent = 0; } updateRestartPulsarsButtonVisibility(); }
function applyGroupFluctuationSettings() { if (!isAudioReady) return; const fluctuationEnabled = groupFluctuateToggle.checked; const fluctuationAmount = parseFloat(groupFluctuateAmount.value); const now = audioContext.currentTime; currentConstellationGroup.forEach(id => { const node = findNodeById(id); if (node && node.type === 'sound' && node.audioNodes?.volLfoGain) { const targetDepth = fluctuationEnabled ? fluctuationAmount : node.audioParams.volLfoDepth; try { node.audioNodes.volLfoGain.gain.setTargetAtTime(targetDepth, now, 0.1); } catch (e) { } } }); nodes.forEach(node => { if (!currentConstellationGroup.has(node.id) && node.type === 'sound' && node.audioNodes?.volLfoGain) { try { node.audioNodes.volLfoGain.gain.setTargetAtTime(node.audioParams.volLfoDepth, now, 0.1); } catch (e) { } } }); }

function snapToGrid(x, y) { if (!isSnapEnabled || gridSize <= 0) { return { x: x, y: y }; } const snappedX = Math.round(x / gridSize) * gridSize; const snappedY = Math.round(y / gridSize) * gridSize; return { x: snappedX, y: snappedY }; }
function drawGrid() { if (!isGridVisible || gridSize <= 0) return; ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--grid-color').trim() || 'rgba(100, 130, 180, 0.15)'; ctx.lineWidth = 0.5 / viewScale; ctx.fillStyle = ctx.strokeStyle; const worldTopLeft = getWorldCoords(0, 0); const worldBottomRight = getWorldCoords(canvas.width, canvas.height); const startX = Math.floor(worldTopLeft.x / gridSize) * gridSize; const startY = Math.floor(worldTopLeft.y / gridSize) * gridSize; const endX = Math.ceil(worldBottomRight.x / gridSize) * gridSize; const endY = Math.ceil(worldBottomRight.y / gridSize) * gridSize; if (gridType === 'lines') { ctx.beginPath(); for (let x = startX; x < endX; x += gridSize) { ctx.moveTo(x, worldTopLeft.y); ctx.lineTo(x, worldBottomRight.y); } for (let y = startY; y < endY; y += gridSize) { ctx.moveTo(worldTopLeft.x, y); ctx.lineTo(worldBottomRight.x, y); } ctx.stroke(); } else { const dotSize = 2 / viewScale; const dotOffset = dotSize / 2; ctx.beginPath(); for (let x = startX; x < endX; x += gridSize) { for (let y = startY; y < endY; y += gridSize) { ctx.fillRect(x - dotOffset, y - dotOffset, dotSize, dotSize); } } } }

function drawConnection(conn) { const nA=findNodeById(conn.nodeAId); const nB=findNodeById(conn.nodeBId); if(!nA || !nB)return; const mX=(nA.x+nB.x)/2; const mY=(nA.y+nB.y)/2; const cX=mX+conn.controlPointOffsetX; const cY=mY+conn.controlPointOffsetY; const clr=getComputedStyle(document.documentElement).getPropertyValue('--connection-color').trim(); ctx.strokeStyle=clr||'#8AC'; const thickness = (1.0 + 1.5 * (1 - Math.min(1, conn.length / 500))) / viewScale; ctx.lineWidth = Math.max(0.5, thickness); ctx.beginPath(); ctx.moveTo(nA.x,nA.y); ctx.quadraticCurveTo(cX,cY,nB.x,nB.y); ctx.stroke(); }

function drawStarShape(ctx, x, y, points, outerR, innerR) {
    ctx.beginPath();
    const numPoints = Math.max(3, Math.round(points));
    for (let i = 0; i < numPoints * 2; i++) {
        const radius = (i % 2 === 0) ? innerR : outerR;
        const angle = (i / (numPoints * 2)) * Math.PI * 2 - Math.PI / 2 + (Math.PI / numPoints);
        const px = x + Math.cos(angle) * radius;
        const py = y + Math.sin(angle) * radius;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
    }
    ctx.closePath();
}

function drawSatelliteShape(ctx, x, y, r, arms = 1) {
    const coreRadius = r * 0.5;
    const armLength = r * 1.1;
    const armWidth = r * 0.2;
    const armAngleOffset = Math.PI / 4;

    ctx.beginPath();
    ctx.arc(x, y, coreRadius, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    for (let i = 0; i < arms; i++) {
        const angle = (i / arms) * Math.PI * 2 + armAngleOffset;
        const armStartX = x + Math.cos(angle) * coreRadius * 1.1;
        const armStartY = y + Math.sin(angle) * coreRadius * 1.1;
        const armEndX = x + Math.cos(angle) * armLength;
        const armEndY = y + Math.sin(angle) * armLength;

        const anglePerp = angle + Math.PI / 2;
        const halfWidth = armWidth / 2;

        ctx.beginPath();
        ctx.moveTo(armStartX + Math.cos(anglePerp) * halfWidth, armStartY + Math.sin(anglePerp) * halfWidth);
        ctx.lineTo(armEndX + Math.cos(anglePerp) * halfWidth, armEndY + Math.sin(anglePerp) * halfWidth);
        ctx.lineTo(armEndX - Math.cos(anglePerp) * halfWidth, armEndY - Math.sin(anglePerp) * halfWidth);
        ctx.lineTo(armStartX - Math.cos(anglePerp) * halfWidth, armStartY - Math.sin(anglePerp) * halfWidth);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    }
}


function drawNode(node) {
    ctx.shadowBlur = 0;
    const isSelectedAndOutlineNeeded = node.isSelected && currentTool === 'edit';
    const flashDuration = 0.1;
    let preTriggerFlash = 0;
    if (isPlaying && isGlobalSyncEnabled && node.isStartNode && isSelectedAndOutlineNeeded && node.nextSyncTriggerTime > 0) {
        const timeToNext = node.nextSyncTriggerTime - audioContext.currentTime;
        if (timeToNext > 0 && timeToNext < flashDuration) { preTriggerFlash = (1.0 - (timeToNext / flashDuration)) * 0.6; }
    }
    if (node.animationState > 0 && !node.isTriggered) { node.animationState -= (node.type === 'sound' || node.type === 'nebula' ? 0.05 : 0.1); }
    node.animationState = Math.max(0, node.animationState);

    const bloomFactor = 1 + node.animationState * 0.5 + preTriggerFlash * 0.6;
    const currentRadius = NODE_RADIUS_BASE * node.size * bloomFactor;
    let fillColor, borderColor, glowColor;
    const styles = getComputedStyle(document.documentElement);
    const scaleBase = currentScale.baseHSL || { h: 200, s: 70, l: 70 };
    const isStartNodeDisabled = node.isStartNode && !node.isEnabled;

    if (node.type === 'start') {
        fillColor = isStartNodeDisabled ? styles.getPropertyValue('--start-node-disabled-color').trim() : styles.getPropertyValue('--start-node-color').trim();
        borderColor = isStartNodeDisabled ? styles.getPropertyValue('--start-node-disabled-border').trim() : styles.getPropertyValue('--start-node-border').trim();
        glowColor = isStartNodeDisabled ? 'transparent' : borderColor;
    } else if (node.type === 'snowballStart') {
        fillColor = isStartNodeDisabled ? styles.getPropertyValue('--snowball-start-disabled-color').trim() : styles.getPropertyValue('--snowball-start-color').trim();
        borderColor = isStartNodeDisabled ? styles.getPropertyValue('--snowball-start-disabled-border').trim() : styles.getPropertyValue('--snowball-start-border').trim();
        glowColor = isStartNodeDisabled ? 'transparent' : borderColor;
    }
    else if (node.type === 'gate') { fillColor = styles.getPropertyValue('--gate-node-color').trim(); borderColor = styles.getPropertyValue('--gate-node-border').trim(); glowColor = borderColor; }
    else if (node.type === 'probabilityGate') { fillColor = styles.getPropertyValue('--probability-gate-node-color').trim(); borderColor = styles.getPropertyValue('--probability-gate-node-border').trim(); glowColor = borderColor; }
    else if (node.type === 'pitchShift') { fillColor = styles.getPropertyValue('--pitch-node-color').trim(); borderColor = styles.getPropertyValue('--pitch-node-border').trim(); glowColor = borderColor; }
    else if (node.type === 'speed') { const factorIndex = node.audioParams.tempoIndex; const lightnessFactor = 0.7 + (factorIndex / (TEMPO_FACTORS.length -1)) * 0.5; const baseHSL = { h: 120, s: 70, l: 70 }; fillColor = hslToRgba(baseHSL.h, baseHSL.s, baseHSL.l * lightnessFactor, 0.7); borderColor = hslToRgba(baseHSL.h, baseHSL.s * 0.8, baseHSL.l * lightnessFactor * 0.6, 0.9); glowColor = borderColor; }
    else if (node.type === 'sound' || node.type === 'nebula') {
        const noteIndex = node.audioParams.scaleIndex % currentScale.notes.length;
        const hue = (scaleBase.h + noteIndex * HUE_STEP) % 360;
        const lightness = scaleBase.l * (0.8 + node.size * 0.2);
        const saturation = scaleBase.s * (node.type === 'nebula' ? 0.7 : 1.0);
        const alpha = (node.type === 'nebula' ? 0.5 : 0.6) + node.size * 0.3;
        fillColor = hslToRgba(hue, saturation, lightness, Math.min(0.95, alpha));
        borderColor = hslToRgba(hue, saturation * 0.8, lightness * 0.6, 0.9);
        glowColor = hslToRgba(hue, saturation, lightness * 1.1, 1.0);
    }
    else { fillColor = 'grey'; borderColor = 'darkgrey'; glowColor = 'white'; }

    ctx.fillStyle = fillColor; ctx.strokeStyle = borderColor;
    const baseLineWidth = (node.isStartNode ? 2.5 : 1.5) / viewScale;
    ctx.lineWidth = Math.max(0.5, isSelectedAndOutlineNeeded ? baseLineWidth + (1.5 / viewScale) : baseLineWidth);

    let needsRestore = false;
    if ((node.type === 'gate' || node.type === 'nebula' || node.type === 'sound' && node.audioParams.waveform && node.audioParams.waveform.startsWith('sampler_')) && node.currentAngle !== undefined) {
        ctx.save(); ctx.translate(node.x, node.y);
        if (node.type === 'nebula') { ctx.rotate(node.currentAngle); }
        else if (node.type === 'gate') { ctx.rotate(node.currentAngle); }
        else if (node.type === 'sound' && node.audioParams.waveform.startsWith('sampler_')) {
            node.currentAngle = (node.currentAngle + 0.005 * (performance.now() * 0.01)) % (Math.PI * 2);
            ctx.rotate(node.currentAngle);
        }
        ctx.translate(-node.x, -node.y); needsRestore = true;
    }


    if (node.isInConstellation && currentTool === 'edit') {
        const highlightRadius = (NODE_RADIUS_BASE * node.size) + (5 / viewScale);
        ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--constellation-highlight').trim() || 'rgba(255, 255, 150, 0.15)';
        ctx.beginPath(); ctx.arc(node.x, node.y, highlightRadius, 0, Math.PI * 2); ctx.fill();
    }

    if ((node.animationState > 0 || preTriggerFlash > 0 || isSelectedAndOutlineNeeded || node.type === 'nebula') && !isStartNodeDisabled) {
        ctx.shadowColor = glowColor; let glowAmount = (node.isStartNode || node.type === 'nebula' ? 5 : 0) + (node.animationState + preTriggerFlash) * 15 + (isSelectedAndOutlineNeeded ? 5 : 0);
        if ((node.type === 'gate' || node.type === 'probabilityGate' || node.type === 'pitchShift') && node.animationState > 0) { glowAmount = 10 + node.animationState * 10 + (isSelectedAndOutlineNeeded ? 5 : 0); }
        else if(isSelectedAndOutlineNeeded && (node.type === 'gate' || node.type === 'probabilityGate' || node.type === 'pitchShift')) { glowAmount = 5; }
        else if (node.type === 'nebula') { const pulseEffect = (Math.sin(node.pulsePhase) * 0.5 + 0.5) * 10; glowAmount = 5 + pulseEffect + (isSelectedAndOutlineNeeded ? 5 : 0); }
        ctx.shadowBlur = Math.min(30, glowAmount) / viewScale;
    } else { ctx.shadowBlur = 0; }

    if (node.type === 'sound') {
        const waveform = node.audioParams.waveform;
        const r = currentRadius;
        switch (waveform) {
            case 'sine': ctx.beginPath(); ctx.arc(node.x, node.y, r, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); break;
            case 'square': ctx.beginPath(); ctx.rect(node.x - r * 0.9, node.y - r * 0.9, r * 1.8, r * 1.8); ctx.fill(); ctx.stroke(); break;
            case 'triangle': case 'sawtooth': ctx.beginPath(); ctx.moveTo(node.x, node.y - r); ctx.lineTo(node.x + r * 0.866, node.y + r * 0.5); ctx.lineTo(node.x - r * 0.866, node.y + r * 0.5); ctx.closePath(); ctx.fill(); ctx.stroke(); break;
            case 'fmBell': case 'fmXylo': drawStarShape(ctx, node.x, node.y, 5, r, r * 0.5); ctx.fill(); ctx.stroke(); break;
            case 'sampler_marimba': drawSatelliteShape(ctx, node.x, node.y, r, 1); break;
            case 'sampler_piano': drawSatelliteShape(ctx, node.x, node.y, r, 2); break;
            case 'sampler_flute': drawSatelliteShape(ctx, node.x, node.y, r * 0.9, 3); break;
            default: ctx.beginPath(); ctx.arc(node.x, node.y, r, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); break;
        }
    } else if (node.type === 'gate') {
        const r = NODE_RADIUS_BASE * node.size; const innerRadius = r * 0.4; const shieldRadius = r * 0.85; const openingStartAngle = -GATE_ANGLE_SIZE / 2; const openingEndAngle = GATE_ANGLE_SIZE / 2;
        ctx.beginPath(); ctx.arc(node.x, node.y, r, 0, Math.PI * 2); ctx.stroke(); ctx.fillStyle = fillColor + '90'; ctx.fill(); ctx.fillStyle = borderColor + 'A0'; ctx.beginPath(); ctx.moveTo(node.x + Math.cos(openingEndAngle) * innerRadius, node.y + Math.sin(openingEndAngle) * innerRadius); ctx.lineTo(node.x + Math.cos(openingEndAngle) * shieldRadius, node.y + Math.sin(openingEndAngle) * shieldRadius); ctx.arc(node.x, node.y, shieldRadius, openingEndAngle, openingStartAngle + Math.PI * 2, false); ctx.lineTo(node.x + Math.cos(openingStartAngle) * innerRadius, node.y + Math.sin(openingStartAngle) * innerRadius); ctx.arc(node.x, node.y, innerRadius, openingStartAngle + Math.PI*2, openingEndAngle, true); ctx.closePath(); ctx.fill();
        let shouldPassVisual = false; const mode = GATE_MODES[node.gateModeIndex || 0]; if (mode === 'RAND') { shouldPassVisual = node.lastRandomGateResult; } else { const counterCheck = node.gateCounter || 0; switch (mode) { case '1/2': if (counterCheck % 2 === 0) shouldPassVisual = true; break; case '1/3': if (counterCheck % 3 === 0) shouldPassVisual = true; break; case '1/4': if (counterCheck % 4 === 0) shouldPassVisual = true; break; case '2/3': if (counterCheck % 3 !== 0) shouldPassVisual = true; break; case '3/4': if (counterCheck % 4 !== 0) shouldPassVisual = true; break; } }
        if (node.animationState > 0 && shouldPassVisual) { ctx.save(); ctx.strokeStyle = styles.getPropertyValue('--pulse-visual-color').trim() || 'rgba(255, 255, 255, 0.9)'; ctx.lineWidth = Math.max(1, 2.5 / viewScale); ctx.shadowColor = glowColor; ctx.shadowBlur = 10 / viewScale; ctx.beginPath(); ctx.arc(node.x, node.y, r * 0.9, openingStartAngle, openingEndAngle); ctx.stroke(); ctx.restore(); }
    } else if (node.type === 'probabilityGate') {
         const r = NODE_RADIUS_BASE * node.size;
         ctx.beginPath(); ctx.arc(node.x, node.y, r, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
         const fontSize = Math.max(8, r * 0.8 / viewScale);
         ctx.font = `bold ${fontSize}px sans-serif`;
         ctx.fillStyle = borderColor;
         ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
         ctx.fillText('%', node.x, node.y + fontSize * 0.1);
    } else if (node.type === 'pitchShift') {
        const r = NODE_RADIUS_BASE * node.size; ctx.beginPath(); ctx.arc(node.x, node.y, r, 0, Math.PI * 2); ctx.stroke(); ctx.fillStyle = fillColor + '90'; ctx.fill(); if(node.animationState < 0.5) { ctx.fillStyle = borderColor; ctx.beginPath(); const arrowSize = r * 0.5; const arrowY = node.y - arrowSize * 0.3; ctx.moveTo(node.x, arrowY - arrowSize / 2); ctx.lineTo(node.x - arrowSize / 2, arrowY + arrowSize / 2); ctx.lineTo(node.x + arrowSize / 2, arrowY + arrowSize / 2); ctx.closePath(); ctx.fill(); }
    } else if (node.type === 'speed') {
        const r = NODE_RADIUS_BASE * node.size; ctx.arc(node.x, node.y, r, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); ctx.beginPath(); const tempoIndex = node.audioParams.tempoIndex; const numFactors = TEMPO_FACTORS.length; const angle = (tempoIndex / (numFactors > 1 ? numFactors - 1 : 1)) * Math.PI * 1.5 - Math.PI * 0.75 - Math.PI / 2; ctx.moveTo(node.x, node.y); ctx.lineTo(node.x + Math.cos(angle) * r * 0.7, node.y + Math.sin(angle) * r * 0.7); ctx.lineWidth = Math.max(0.5, 2.5 / viewScale); ctx.strokeStyle = borderColor; ctx.stroke();
    } else if (node.type === 'nebula') {
        const numRings = 5; const baseRadius = NODE_RADIUS_BASE * node.size * 0.8; const pulseFactor = 1 + Math.sin(node.pulsePhase) * 0.15;
        for (let i = 0; i < numRings; i++) { const ringRadius = baseRadius * pulseFactor * (1 - i * 0.15); const alpha = 0.1 + (1 - i / numRings) * 0.4; const lightness = scaleBase.l * (0.6 + (i / numRings) * 0.6); ctx.strokeStyle = hslToRgba(scaleBase.h, scaleBase.s, lightness, alpha); ctx.lineWidth = Math.max(0.5, (1 + (numRings - i) * 0.5) / viewScale); ctx.beginPath(); ctx.arc(node.x, node.y, ringRadius, 0, Math.PI * 2); ctx.stroke(); }
        if(needsRestore){ ctx.restore(); needsRestore = false; } ctx.save(); ctx.translate(node.x, node.y); ctx.rotate(node.innerAngle); ctx.translate(-node.x, -node.y); const coreRadius = baseRadius * 0.4 * pulseFactor; ctx.fillStyle = hslToRgba(scaleBase.h, scaleBase.s, scaleBase.l * 1.2, 0.8); ctx.beginPath(); ctx.arc(node.x, node.y, coreRadius, 0, Math.PI * 2); ctx.fill(); ctx.restore();
    } else if (node.isStartNode) {
        const points = node.starPoints || 6;
        const outerR = currentRadius;
        const innerR = outerR * 0.4;
        drawStarShape(ctx, node.x, node.y, points, outerR, innerR);
        ctx.fill(); ctx.stroke();
    } else {
        ctx.beginPath(); ctx.arc(node.x, node.y, currentRadius, 0, Math.PI*2); ctx.fill(); ctx.stroke();
    }

    if (isSelectedAndOutlineNeeded) {
        ctx.save(); ctx.shadowBlur = 0; ctx.strokeStyle = 'rgba(255, 255, 0, 0.9)'; ctx.lineWidth = Math.max(0.5, 1.5 / viewScale); ctx.beginPath();
        const outlineRadius = (NODE_RADIUS_BASE * node.size * (node.type === 'sound' && node.audioParams.waveform && node.audioParams.waveform.startsWith('sampler_') ? 1.2 : 1.0) * bloomFactor) + (2 / viewScale);
        ctx.arc(node.x, node.y, outlineRadius, 0, Math.PI * 2);
        ctx.stroke(); ctx.restore();
    }
    if (needsRestore) { ctx.restore(); }

    ctx.shadowBlur = 0;
    if (isInfoTextVisible) {
        const fontSize = Math.max(8, 10 / viewScale);
        ctx.font = `bold ${fontSize}px sans-serif`;
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        let labelText = '';
        const baseRadiusForLabel = NODE_RADIUS_BASE * node.size;
        let labelYOffset = baseRadiusForLabel * ((node.type === 'sound' || node.type === 'nebula') && node.audioParams.waveform && node.audioParams.waveform.startsWith('sampler_') ? 1.3 : 1.1) + (fontSize / 1.5) + (2 / viewScale);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';

        if (node.type === 'sound' || node.type === 'nebula') { labelText = getNoteNameFromScaleIndex(currentScale, node.audioParams.scaleIndex); }
        else if (node.isStartNode) {
            if (isGlobalSyncEnabled) { labelText = subdivisionOptions[node.syncSubdivisionIndex]?.label || '?'; }
            else { labelText = `${(node.audioParams.triggerInterval || DEFAULT_TRIGGER_INTERVAL).toFixed(1)}s`; }
             if (!node.isEnabled) labelText += " (Off)";
        }
        else if (node.type === 'gate') { labelText = GATE_MODES[node.gateModeIndex || 0]; }
        else if (node.type === 'probabilityGate') { labelText = `${(node.audioParams.probability * 100).toFixed(0)}%`; }
        else if (node.type === 'pitchShift') { const amount = PITCH_SHIFT_AMOUNTS[node.pitchShiftIndex || 0]; labelText = (amount > 0 ? '+' : '') + amount + (node.pitchShiftAlternating ? ' ⇄' : ''); labelYOffset = fontSize * 0.1; }
        else if (node.type === 'speed') { labelText = `x${node.audioParams.tempoFactor || 1.0}`; }

        if (labelText) { ctx.fillText(labelText, node.x, node.y + labelYOffset); }
    }
    ctx.shadowBlur = 0;
}

function drawTemporaryConnection() { if (isConnecting && connectingNode) { ctx.beginPath(); ctx.moveTo(connectingNode.x, connectingNode.y); ctx.lineTo(mousePos.x, mousePos.y); ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)'; ctx.lineWidth = 1 / viewScale; ctx.setLineDash([5 / viewScale, 5 / viewScale]); ctx.stroke(); ctx.setLineDash([]); } }
function drawSelectionRect() { if (isSelecting && selectionRect.active) { const x=Math.min(selectionRect.startX,selectionRect.endX); const y=Math.min(selectionRect.startY,selectionRect.endY); const w=Math.abs(selectionRect.startX-selectionRect.endX); const h=Math.abs(selectionRect.startY-selectionRect.endY); const rectColor = getComputedStyle(document.documentElement).getPropertyValue('--selection-rect-color').trim() || 'rgba(150,200,255,0.3)'; ctx.fillStyle = rectColor; ctx.fillRect(x,y,w,h); ctx.strokeStyle='rgba(255,255,255,0.6)'; ctx.lineWidth= 1 / viewScale; ctx.strokeRect(x,y,w,h); } }
function drawBackground(now) { bgAngle += 0.0002; const topLeft = getWorldCoords(0, 0); const bottomRight = getWorldCoords(canvas.width, canvas.height); const worldWidth = bottomRight.x - topLeft.x; const worldHeight = bottomRight.y - topLeft.y; const worldCenterX = topLeft.x + worldWidth / 2; const worldCenterY = topLeft.y + worldHeight / 2; const diagonal = Math.sqrt(worldWidth*worldWidth + worldHeight*worldHeight) * 0.7; const gradX1 = worldCenterX + Math.cos(bgAngle) * diagonal; const gradY1 = worldCenterY + Math.sin(bgAngle) * diagonal; const gradX2 = worldCenterX + Math.cos(bgAngle + Math.PI) * diagonal; const gradY2 = worldCenterY + Math.sin(bgAngle + Math.PI) * diagonal; const color1 = getComputedStyle(document.documentElement).getPropertyValue('--bg-gradient-stop-1').trim() || '#1a2a40'; const color2 = getComputedStyle(document.documentElement).getPropertyValue('--bg-gradient-stop-2').trim() || '#2c3a5f'; const gradient = ctx.createLinearGradient(gradX1, gradY1, gradX2, gradY2); gradient.addColorStop(0, color1); gradient.addColorStop(1, color2); ctx.fillStyle = gradient; ctx.fillRect(topLeft.x, topLeft.y, worldWidth, worldHeight); }
function draw() { const now = audioContext ? audioContext.currentTime : performance.now() / 1000; const deltaTime = Math.max(0, Math.min(0.1, now - (previousFrameTime || now))); ctx.save(); ctx.clearRect(0, 0, canvas.width, canvas.height); ctx.translate(viewOffsetX, viewOffsetY); ctx.scale(viewScale, viewScale); drawBackground(now); drawGrid(); updateAndDrawParticles(deltaTime, now); connections.forEach(drawConnection); nodes.forEach(drawNode); updateAndDrawPulses(now); if (currentTool === 'connect') { drawTemporaryConnection(); } drawSelectionRect(); ctx.restore(); previousFrameTime = now; ctx.setLineDash([]);
}

function updateMousePos(event) { const rect = canvas.getBoundingClientRect(); screenMousePos = { x: event.clientX - rect.left, y: event.clientY - rect.top }; mousePos = getWorldCoords(screenMousePos.x, screenMousePos.y); }
function handlePitchCycle(node) { if (!node || (node.type !== 'sound' && node.type !== 'nebula')) return; const oldIndex = node.audioParams.scaleIndex; node.audioParams.scaleIndex = Math.min(MAX_SCALE_INDEX, (node.audioParams.scaleIndex ?? 0) + 1); node.audioParams.pitch = getFrequency(currentScale, node.audioParams.scaleIndex); updateNodeAudioParams(node); node.animationState = 0.1; setTimeout(() => { const checkNode = findNodeById(node.id); if (checkNode && !checkNode.isTriggered) checkNode.animationState = 0; }, 150); if (oldIndex !== node.audioParams.scaleIndex) saveState(); }
function handlePitchCycleDown(node) { if (!node || (node.type !== 'sound' && node.type !== 'nebula')) return; const oldIndex = node.audioParams.scaleIndex; node.audioParams.scaleIndex = Math.max(MIN_SCALE_INDEX, (node.audioParams.scaleIndex ?? 0) - 1); node.audioParams.pitch = getFrequency(currentScale, node.audioParams.scaleIndex); updateNodeAudioParams(node); node.animationState = 0.1; setTimeout(() => { const checkNode = findNodeById(node.id); if (checkNode && !checkNode.isTriggered) checkNode.animationState = 0; }, 150); if (oldIndex !== node.audioParams.scaleIndex) saveState(); }
function handleTapTempo(node) { if (!isAudioReady || !node || !node.isStartNode || isGlobalSyncEnabled) return; const oldInterval = node.audioParams.triggerInterval; const nowMs = performance.now(); if (tapTempoTimes.length > 0 && (nowMs - tapTempoTimes[tapTempoTimes.length - 1]) > MAX_TAP_INTERVAL) { tapTempoTimes = []; } tapTempoTimes.push(nowMs); if (tapTempoTimes.length > MAX_TAP_TIMES) { tapTempoTimes.shift(); } if (tapTempoTimes.length > 1) { let totalInterval = 0; for (let i = 1; i < tapTempoTimes.length; i++) { totalInterval += (tapTempoTimes[i] - tapTempoTimes[i-1]); } const avgIntervalMs = totalInterval / (tapTempoTimes.length - 1); const newIntervalSec = avgIntervalMs / 1000; node.audioParams.triggerInterval = Math.max(0.1, Math.min(10.0, newIntervalSec)); node.animationState = 0.5; setTimeout(() => { const checkNode = findNodeById(node.id); if (checkNode && !checkNode.isTriggered) checkNode.animationState = 0; }, 100); if (oldInterval !== node.audioParams.triggerInterval) saveState(); } else { node.animationState = 0.2; setTimeout(() => { const checkNode = findNodeById(node.id); if (checkNode && !checkNode.isTriggered) checkNode.animationState = 0; }, 100); } }
function handleTempoCycle(node) { if (!node || node.type !== 'speed') return; const oldIndex = node.audioParams.tempoIndex; node.audioParams.tempoIndex = (node.audioParams.tempoIndex + 1) % TEMPO_FACTORS.length; node.audioParams.tempoFactor = TEMPO_FACTORS[node.audioParams.tempoIndex]; node.animationState = 0.5; setTimeout(() => { const checkNode = findNodeById(node.id); if(checkNode) checkNode.animationState = 0; }, 150); if (oldIndex !== node.audioParams.tempoIndex) saveState(); }
function handleSubdivisionCycle(node) { if (!node || !node.isStartNode || !isGlobalSyncEnabled) return; const oldIndex = node.syncSubdivisionIndex; node.syncSubdivisionIndex = (node.syncSubdivisionIndex + 1) % subdivisionOptions.length; node.nextSyncTriggerTime = 0; node.animationState = 0.3; setTimeout(() => { const checkNode = findNodeById(node.id); if (checkNode && !checkNode.isTriggered) checkNode.animationState = 0; }, 100); if (oldIndex !== node.syncSubdivisionIndex) saveState(); }
function handleGateCycle(node) { if (!node || node.type !== 'gate') return; const oldIndex = node.gateModeIndex; node.gateModeIndex = (node.gateModeIndex + 1) % GATE_MODES.length; node.gateCounter = 0; node.animationState = 0.3; setTimeout(() => { const checkNode = findNodeById(node.id); if(checkNode) checkNode.animationState = 0; }, 100); if (oldIndex !== node.gateModeIndex) saveState(); }
function handleProbabilityCycle(node) {
    if (!node || node.type !== 'probabilityGate') return;
    const oldProbability = node.audioParams.probability;
    let newProbability = Math.round((oldProbability + 0.1) * 10) / 10;
    if (newProbability > 1.0) {
        newProbability = 0.1;
    }
    node.audioParams.probability = newProbability;
    node.animationState = 0.3;
    setTimeout(() => { const checkNode = findNodeById(node.id); if (checkNode) checkNode.animationState = 0; }, 100);
    if (oldProbability !== node.audioParams.probability) saveState();
}
function handlePitchShiftCycle(node) { if (!node || node.type !== 'pitchShift') return; const oldIndex = node.pitchShiftIndex; node.pitchShiftIndex = (node.pitchShiftIndex + 1) % PITCH_SHIFT_AMOUNTS.length; node.pitchShiftAmount = PITCH_SHIFT_AMOUNTS[node.pitchShiftIndex]; node.animationState = 0.3; setTimeout(() => { const checkNode = findNodeById(node.id); if(checkNode) checkNode.animationState = 0; }, 100); if (oldIndex !== node.pitchShiftIndex) saveState(); }

function handleWaveformCycle(node) {
    if (!node || node.type !== 'nebula') return;
    const nonSamplerWaveforms = waveformTypes.filter(w => !w.type.startsWith('sampler_')).map(w => w.type);
    const currentWaveform = node.audioParams.waveform || 'sawtooth';
    const currentIndex = nonSamplerWaveforms.indexOf(currentWaveform);
    const nextIndex = (currentIndex + 1) % nonSamplerWaveforms.length;
    const newWaveform = nonSamplerWaveforms[nextIndex];

    node.audioParams.waveform = newWaveform;

    if (node.audioNodes) {
        const desiredWaveformType = (newWaveform === 'fmBell' || newWaveform === 'fmXylo') ? 'sine' : newWaveform;
        node.audioNodes.oscillators.forEach(osc => { if (osc.type !== desiredWaveformType) osc.type = desiredWaveformType; });
    }

    updateNodeAudioParams(node);
    node.animationState = 0.3; setTimeout(() => { const checkNode = findNodeById(node.id); if (checkNode && !checkNode.isTriggered) checkNode.animationState = 0; }, 150);
    saveState();
}


function handleTogglePitchShiftAlternating(node) { if (!node || node.type !== 'pitchShift') return; node.pitchShiftAlternating = !node.pitchShiftAlternating; node.pitchShiftDirection = 1; node.animationState = 0.3; setTimeout(() => { const checkNode = findNodeById(node.id); if(checkNode) checkNode.animationState = 0; }, 150); saveState(); }
function handleMouseDown(event) {
    if (!isPlaying && event.target === canvas) { togglePlayPause(); return; }
    if (!isAudioReady) return;
    if (hamburgerMenuPanel.contains(event.target) || sideToolbar.contains(event.target) || gridControlsDiv.contains(event.target) || transportControlsDiv.contains(event.target)) { return; }

    updateMousePos(event);
    nodeClickedAtMouseDown = findNodeAt(mousePos.x, mousePos.y);
    mouseDownPos = { ...mousePos };
    isDragging = false; isConnecting = false; isResizing = false; isSelecting = false; isPanning = false; didDrag = false; selectionRect.active = false;

    if (event.button === 1 || (isSpacebarDown && event.button === 0)) { isPanning = true; panStart = { ...screenMousePos }; canvas.style.cursor = 'grabbing'; nodeClickedAtMouseDown = null; return; }

    if (nodeClickedAtMouseDown) { const node = nodeClickedAtMouseDown; if (event.shiftKey && currentTool === 'edit') { isResizing = true; resizeStartSize = node.size; resizeStartY = screenMousePos.y; canvas.style.cursor = 'ns-resize'; } else if (event.shiftKey && currentTool !== 'edit') { if (selectedNodes.has(node.id)) { selectedNodes.delete(node.id); node.isSelected = false; } else { selectedNodes.add(node.id); node.isSelected = true; } if (currentTool === 'edit') updateConstellationGroup(); else updateGroupControlsUI(); nodeClickedAtMouseDown = null; } else if (event.altKey && currentTool === 'edit' && (node.type === 'sound' || node.type === 'nebula' || node.type === 'pitchShift')) {
        nodeClickedAtMouseDown = node; } else { if (currentTool === 'connect') { if (node.type !== 'nebula') { isConnecting = true; connectingNode = node; canvas.style.cursor = 'grabbing'; } } else if (currentTool === 'delete') { removeNode(node); nodeClickedAtMouseDown = null; } else if (currentTool === 'edit') { if (!selectedNodes.has(node.id)) { selectedNodes.forEach(id => { const n = findNodeById(id); if (n) n.isSelected = false; }); selectedNodes.clear(); selectedNodes.add(node.id); node.isSelected = true; updateConstellationGroup(); } isDragging = true; dragStartPos = { ...mousePos }; nodeDragOffsets.clear(); selectedNodes.forEach(id => { const n = findNodeById(id); if (n) nodeDragOffsets.set(id, { x: n.x - mousePos.x, y: n.y - mousePos.y }); }); canvas.style.cursor = 'move'; } }
    } else {
        if (currentTool === 'edit') {
            isSelecting = true; selectionRect = { startX: mousePos.x, startY: mousePos.y, endX: mousePos.x, endY: mousePos.y, active: false }; if (!event.shiftKey) { if (selectedNodes.size > 0) { selectedNodes.forEach(id => { const n = findNodeById(id); if (n) n.isSelected = false; }); selectedNodes.clear(); updateConstellationGroup(); } }
        } else if (currentTool === 'add' && nodeTypeToAdd !== null) {
              if ((nodeTypeToAdd === 'sound' || nodeTypeToAdd === 'nebula') && waveformToAdd === null) {

              } else {

                  addNode(mousePos.x, mousePos.y, nodeTypeToAdd, waveformToAdd);

              }
        } else if (currentTool !== 'connect' && currentTool !== 'delete' ) {
             if (selectedNodes.size > 0) { selectedNodes.forEach(id => { const n = findNodeById(id); if (n) n.isSelected = false; }); selectedNodes.clear(); updateGroupControlsUI(); }
        }
    }
}
function handleMouseMove(event) { if (!isAudioReady) return; updateMousePos(event); if (!didDrag && (isDragging || isResizing || isConnecting || isSelecting || isPanning) && (distance(screenMousePos.x, screenMousePos.y, mouseDownPos.x * viewScale + viewOffsetX, mouseDownPos.y * viewScale + viewOffsetY) > 3)) { didDrag = true; if (isSelecting) { selectionRect.active = true; } } if (isPanning) { const dx = screenMousePos.x - panStart.x; const dy = screenMousePos.y - panStart.y; viewOffsetX += dx; viewOffsetY += dy; panStart = { ...screenMousePos }; canvas.style.cursor = 'grabbing'; } else if (isResizing && nodeClickedAtMouseDown) { const dy_screen = screenMousePos.y - resizeStartY; const sf = 1 + (dy_screen / 100); const targetNode = findNodeById(nodeClickedAtMouseDown.id); if(targetNode){ targetNode.size=Math.max(MIN_NODE_SIZE, Math.min(MAX_NODE_SIZE, resizeStartSize*sf)); updateNodeAudioParams(targetNode); } canvas.style.cursor='ns-resize'; } else if (isConnecting) { canvas.style.cursor = 'grabbing'; } else if (isSelecting && didDrag) { selectionRect.endX = mousePos.x; selectionRect.endY = mousePos.y; canvas.style.cursor = 'crosshair'; } else if (isDragging && didDrag && selectedNodes.size > 0) { const dx_world = mousePos.x - dragStartPos.x; const dy_world = mousePos.y - dragStartPos.y; const effectiveSnap = isSnapEnabled && !event.shiftKey; selectedNodes.forEach(id => { const n = findNodeById(id); const offset = nodeDragOffsets.get(id); if (n && offset) { let targetX = dragStartPos.x + offset.x + dx_world; let targetY = dragStartPos.y + offset.y + dy_world; if (effectiveSnap) { const snapped = snapToGrid(targetX, targetY); targetX = snapped.x; targetY = snapped.y; } n.x = targetX; n.y = targetY; } }); connections.forEach(conn => { if (selectedNodes.has(conn.nodeAId) || selectedNodes.has(conn.nodeBId)) { const nA=findNodeById(conn.nodeAId); const nB=findNodeById(conn.nodeBId); if(nA && nB) conn.length = distance(nA.x, nA.y, nB.x, nB.y); } }); canvas.style.cursor = 'move'; } else { const hN=findNodeAt(mousePos.x, mousePos.y); if (currentTool === 'edit' && event.altKey && (hN?.type === 'sound' || hN?.type === 'nebula' || hN?.type === 'pitchShift')) { canvas.style.cursor = 'pointer'; } else if (currentTool === 'edit' && event.shiftKey && hN) { canvas.style.cursor='ns-resize'; } else if (currentTool === 'connect' && hN && hN.type !== 'nebula') { canvas.style.cursor='grab'; } else if (currentTool === 'delete' && hN) { canvas.style.cursor='pointer'; } else if (currentTool === 'edit' && hN) { canvas.style.cursor='move'; } else if (currentTool === 'add') { canvas.style.cursor = 'copy'; } else { canvas.style.cursor='crosshair'; } } }

function handleMouseUp(event) {
    if (!isAudioReady) return;
    if (hamburgerMenuPanel.contains(event.target) || sideToolbar.contains(event.target) || gridControlsDiv.contains(event.target) || transportControlsDiv.contains(event.target)) {
        isDragging = false; isConnecting = false; isResizing = false; isSelecting = false; isPanning = false; selectionRect.active = false; connectingNode = null; nodeClickedAtMouseDown = null;
        canvas.style.cursor = 'crosshair';
        return;
    }

    updateMousePos(event);
    const nodeUnderCursor = findNodeAt(mousePos.x, mousePos.y);
    const wasResizing=isResizing; const wasConnecting=isConnecting; const wasDragging=isDragging; const wasSelecting=isSelecting; const wasPanning = isPanning;
    const nodeUnderCursorAtStart = nodeClickedAtMouseDown;
    let stateWasChanged = false;

    isResizing=false; isConnecting=false; isDragging=false; isSelecting=false; isPanning=false;
    selectionRect.active=false; canvas.style.cursor='crosshair';

    if (wasConnecting) {
        if (connectingNode && nodeUnderCursor && nodeUnderCursor !== connectingNode && nodeUnderCursor.type !== 'nebula') {
            connectNodes(connectingNode, nodeUnderCursor);
            stateWasChanged = true;
        }
        connectingNode = null;
    }

    if (wasPanning) {}
    else if (wasResizing && nodeClickedAtMouseDown) { stateWasChanged = true; }

    else if (wasSelecting && didDrag) { const x1=Math.min(selectionRect.startX,selectionRect.endX); const y1=Math.min(selectionRect.startY,selectionRect.endY); const x2=Math.max(selectionRect.startX,selectionRect.endX); const y2=Math.max(selectionRect.startY,selectionRect.endY); let newlySelected = false; nodes.forEach(n => { if (n.x>=x1&&n.x<=x2&&n.y>=y1&&n.y<=y2) { if (!selectedNodes.has(n.id)) { selectedNodes.add(n.id); n.isSelected = true; newlySelected = true;} } }); if (newlySelected && currentTool === 'edit') updateConstellationGroup(); else if (currentTool !== 'edit') updateGroupControlsUI(); }
    else if (currentTool === 'edit') { const startNode = findNodeById(nodeUnderCursorAtStart?.id); if (startNode && !didDrag && !event.shiftKey) {
            if (event.altKey && (startNode.type === 'sound' || startNode.type === 'nebula')) { handlePitchCycleDown(startNode); stateWasChanged = true; }
            else if (event.altKey && startNode.type === 'pitchShift') { handleTogglePitchShiftAlternating(startNode); stateWasChanged = true; }
            else if (!event.altKey) {
                if (startNode.isStartNode) {
                     if (isGlobalSyncEnabled) { handleSubdivisionCycle(startNode); } else { handleTapTempo(startNode); }
                     stateWasChanged = true;
                } else if (startNode.type === 'sound' || startNode.type === 'nebula') { handlePitchCycle(startNode); stateWasChanged = true; }
                else if (startNode.type === 'speed') { handleTempoCycle(startNode); stateWasChanged = true;}
                else if (startNode.type === 'gate') { handleGateCycle(startNode); stateWasChanged = true;}
                else if (startNode.type === 'probabilityGate') { handleProbabilityCycle(startNode); stateWasChanged = true;}
                else if (startNode.type === 'pitchShift') { handlePitchShiftCycle(startNode); stateWasChanged = true;}

            } } else if (startNode && didDrag && wasDragging) { stateWasChanged = true; } else if (!startNode && !didDrag && !event.altKey && !event.shiftKey) { } }
    else if (currentTool === 'delete') { if (nodeUnderCursorAtStart && !didDrag) { removeNode(nodeUnderCursorAtStart); stateWasChanged = true; } else if (!nodeUnderCursorAtStart && selectedNodes.size > 0 && !didDrag) { removeNode(findNodeById(selectedNodes.values().next().value)); selectedNodes.clear(); updateGroupControlsUI(); stateWasChanged = true; } }

    if (stateWasChanged) {
         saveState();
    }
    didDrag = false; nodeClickedAtMouseDown = null; nodeDragOffsets.clear(); panStart = { x: 0, y: 0 }; updateGroupControlsUI();
}

function handleWheel(event) { event.preventDefault(); const zoomAmount = event.deltaY * ZOOM_SENSITIVITY; const worldCoords = getWorldCoords(event.clientX, event.clientY); const oldScale = viewScale; viewScale -= zoomAmount; viewScale = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, viewScale)); if (oldScale !== viewScale) { viewOffsetX = event.clientX - worldCoords.x * viewScale; viewOffsetY = event.clientY - worldCoords.y * viewScale; } }

function deepCopyState(stateToCopy) { if (!stateToCopy) return null; try { const stringified = JSON.stringify(stateToCopy, (key, value) => { if (value instanceof Set) { return Array.from(value); } return value; }); const parsed = JSON.parse(stringified); if (parsed.nodes) { parsed.nodes.forEach(node => { node.connections = node.connections ? new Set(node.connections) : new Set(); }); } parsed.selectedNodes = parsed.selectedNodes ? new Set(parsed.selectedNodes) : new Set(); return parsed; } catch (e) { return null; } }
function saveState() { if (isPerformingUndoRedo) return; const currentState = { nodes: nodes, connections: connections, selectedNodes: selectedNodes, nodeIdCounter: nodeIdCounter, connectionIdCounter: connectionIdCounter, isGlobalSyncEnabled: isGlobalSyncEnabled, globalBPM: globalBPM }; const copiedState = deepCopyState(currentState); if (!copiedState) return; if (historyIndex < historyStack.length - 1) { historyStack = historyStack.slice(0, historyIndex + 1); } historyStack.push(copiedState); if (historyStack.length > MAX_HISTORY_SIZE) { historyStack.shift(); } historyIndex = historyStack.length - 1; }
function loadState(stateToLoad) { if (!stateToLoad || !stateToLoad.nodes || !stateToLoad.connections) { return; } isPerformingUndoRedo = true; nodes.forEach(node => { if (node.audioNodes) { if (node.type === 'sound') { try { node.audioNodes.oscillator?.stop(); } catch (e) {} try { node.audioNodes.modulatorOsc?.stop(); } catch (e) {} try { node.audioNodes.volLfo?.stop(); } catch (e) {} try { node.audioNodes.reverbSendGain?.disconnect(); } catch (e) {} try { node.audioNodes.volLfoGain?.disconnect(); } catch (e) {} try { node.audioNodes.volLfo?.disconnect(); } catch (e) {} try { node.audioNodes.gainNode?.disconnect(); } catch (e) {} try { node.audioNodes.lowPassFilter?.disconnect(); } catch (e) {} try { node.audioNodes.modulatorGain?.disconnect(); } catch(e){} try { node.audioNodes.modulatorOsc?.disconnect(); } catch(e){} try { node.audioNodes.oscillator?.disconnect(); } catch (e) {} } else if (node.type === 'nebula' && node.audioNodes) {
        try { node.audioNodes.filterLfo?.stop(); } catch(e){} try { node.audioNodes.volLfo?.stop(); } catch(e){} node.audioNodes.oscillators?.forEach(osc => { try { osc.stop(); } catch(e) {} }); try { node.audioNodes.filterLfoGain?.disconnect(); } catch(e){} try { node.audioNodes.volLfoGain?.disconnect(); } catch(e){} try { node.audioNodes.filterLfo?.disconnect(); } catch(e){} try { node.audioNodes.volLfo?.disconnect(); } catch(e){} try { node.audioNodes.gainNode?.disconnect(); } catch(e){} try { node.audioNodes.filterNode?.disconnect(); } catch(e){} node.audioNodes.oscillators?.forEach(osc => { try { osc.disconnect(); } catch(e) {} }); } } }); nodes = stateToLoad.nodes; connections = stateToLoad.connections; selectedNodes = stateToLoad.selectedNodes; nodeIdCounter = stateToLoad.nodeIdCounter; connectionIdCounter = stateToLoad.connectionIdCounter; isGlobalSyncEnabled = stateToLoad.isGlobalSyncEnabled ?? false; globalBPM = stateToLoad.globalBPM ?? 120; nodes.forEach(node => { node.audioNodes = null; node.connections = node.connections ? new Set(node.connections) : new Set(); node.isSelected = selectedNodes.has(node.id);
     if (node.type === 'start') { node.isStartNode = true; } else { node.isStartNode = false; }
     if (node.isStartNode && (typeof node.syncSubdivisionIndex !== 'number')) { node.syncSubdivisionIndex = DEFAULT_SUBDIVISION_INDEX; } if (node.isStartNode && (typeof node.isEnabled !== 'boolean')) { node.isEnabled = true; } if (node.isStartNode && (typeof node.pulseOriginNodeId !== 'number')) { node.pulseOriginNodeId = -1; } if (typeof node.nextSyncTriggerTime !== 'number') { node.nextSyncTriggerTime = 0; } if (node.type === 'gate' && typeof node.gateModeIndex !== 'number') node.gateModeIndex = DEFAULT_GATE_MODE_INDEX; if (node.type === 'gate' && typeof node.gateCounter !== 'number') node.gateCounter = 0; if (node.type === 'gate' && typeof node.lastRandomGateResult !== 'boolean') node.lastRandomGateResult = true; if (node.type === 'probabilityGate' && typeof node.audioParams.probability !== 'number') { if (!node.audioParams) node.audioParams = {}; node.audioParams.probability = DEFAULT_PROBABILITY; } if (node.type === 'pitchShift' && typeof node.pitchShiftIndex !== 'number') node.pitchShiftIndex = DEFAULT_PITCH_SHIFT_INDEX; if (node.type === 'pitchShift' && typeof node.pitchShiftAmount !== 'number') node.pitchShiftAmount = PITCH_SHIFT_AMOUNTS[node.pitchShiftIndex ?? DEFAULT_PITCH_SHIFT_INDEX]; if (node.type === 'pitchShift' && typeof node.pitchShiftAlternating !== 'boolean') node.pitchShiftAlternating = false; if (node.type === 'pitchShift' && typeof node.pitchShiftDirection !== 'number') node.pitchShiftDirection = 1; if (node.type === 'nebula' && typeof node.currentAngle !== 'number') node.currentAngle = Math.random() * Math.PI * 2; if (node.type === 'nebula' && typeof node.innerAngle !== 'number') node.innerAngle = Math.random() * Math.PI * 2; if (node.type === 'nebula' && typeof node.pulsePhase !== 'number') node.pulsePhase = Math.random() * Math.PI * 2; if (node.type === 'nebula' && typeof node.audioParams?.waveform !== 'string') { if(!node.audioParams) node.audioParams = {}; node.audioParams.waveform = 'sawtooth'; } if (node.type === 'sound' || node.type === 'nebula') {
        node.audioParams.scaleIndex = Math.max(MIN_SCALE_INDEX, Math.min(MAX_SCALE_INDEX, node.audioParams.scaleIndex ?? 0));
        node.audioParams.pitch = getFrequency(currentScale, node.audioParams.scaleIndex);
         if (isNaN(node.audioParams.pitch)) {
             node.audioParams.scaleIndex = 0;
             node.audioParams.pitch = getFrequency(currentScale, 0);
         }
    } if (node.type === 'sound' || node.type === 'nebula') {
        node.audioNodes = createAudioNodesForNode(node); if (node.audioNodes) { updateNodeAudioParams(node); } else { } } }); updateSyncUI(); updateConstellationGroup(); isPerformingUndoRedo = false; }
function undo() { if (historyIndex > 0) { historyIndex--; const stateToLoad = deepCopyState(historyStack[historyIndex]); if (stateToLoad) { loadState(stateToLoad); } else { historyIndex++; } } else { } resetSideToolbars(); setActiveTool('edit'); }
function redo() { if (historyIndex < historyStack.length - 1) { historyIndex++; const stateToLoad = deepCopyState(historyStack[historyIndex]); if (stateToLoad) { loadState(stateToLoad); } else { historyIndex--; } } else { } resetSideToolbars(); setActiveTool('edit'); }

function removeNoteSelector() {
    if (noteSelectContainer && noteSelectContainer.parentNode) {
        noteSelectContainer.parentNode.removeChild(noteSelectContainer);
    }
    noteSelectElement = null;
    noteSelectContainer = null;
}

function createNoteSelector() {
    removeNoteSelector(); // Remove existing one if present

    const container = document.createElement('div');
    container.style.marginTop = '15px'; // Add some space above

    const label = document.createElement('label');
    label.textContent = 'Start Note:';
    label.htmlFor = 'noteSelect';
    container.appendChild(label);

    const select = document.createElement('select');
    select.id = 'noteSelect';

    const randomOpt = document.createElement('option');
    randomOpt.value = -1;
    randomOpt.textContent = 'Random';
    select.appendChild(randomOpt);

    const numNotes = currentScale.notes.length;
    const octavesToShow = 2;
    for (let i = 0; i < numNotes * octavesToShow; i++) {
        const noteName = getNoteNameFromScaleIndex(currentScale, i);
        if (noteName) { // Only add if a valid name is generated
            const opt = document.createElement('option');
            opt.value = i;
            opt.textContent = noteName;
            select.appendChild(opt);
        }
    }

    select.value = noteIndexToAdd;
    select.addEventListener('change', (e) => {
        noteIndexToAdd = parseInt(e.target.value, 10);
    });

    container.appendChild(select);
    sideToolbarContent.appendChild(container);
    noteSelectElement = select;
    noteSelectContainer = container;
}


function resetSideToolbars() {
    sideToolbar.classList.add('hidden');
    hamburgerMenuPanel.classList.add('hidden');
    hamburgerBtn.classList.remove('active');
    const sideButtons = sideToolbarContent.querySelectorAll('.type-button, .waveform-button');
    sideButtons.forEach(btn => btn.classList.remove('selected'));
    removeNoteSelector(); // Remove note selector when toolbars reset
}

function setActiveTool(toolName) {
    if (currentTool === 'add' && toolName !== 'add') {
        nodeTypeToAdd = null;
        waveformToAdd = null;
        noteIndexToAdd = -1; // Reset note selection
        resetSideToolbars();
        const addButtons = toolbar.querySelectorAll('#toolbar-add-elements button');
        addButtons.forEach(btn => btn.classList.remove('active'));
    }

    currentTool = toolName;
    connectingNode = null;

    editBtn.classList.toggle('active', toolName === 'edit');
    connectBtn.classList.toggle('active', toolName === 'connect');
    deleteBtn.classList.toggle('active', toolName === 'delete');

    if (toolName !== 'add') {
        const addButtons = toolbar.querySelectorAll('#toolbar-add-elements button');
        addButtons.forEach(btn => btn.classList.remove('active'));
        resetSideToolbars();
    } else {
        editBtn.classList.remove('active');
        connectBtn.classList.remove('active');
        deleteBtn.classList.remove('active');
        hamburgerMenuPanel.classList.add('hidden');
        hamburgerBtn.classList.remove('active');
        // Note selector is handled by populateSideToolbar
    }

    isConnecting = false;
    isResizing = false;
    isSelecting = false;
    selectionRect.active = false;
    isPanning = false;

    updateGroupControlsUI();
    updateRestartPulsarsButtonVisibility();
}

function populateSideToolbar(contentType, title) {
    sideToolbarContent.innerHTML = ''; // Clear previous content first
    noteSelectElement = null;      // Reset references
    noteSelectContainer = null;

    const groupDiv = document.createElement('div');
    groupDiv.classList.add('type-group');

    if (contentType === 'waveforms') {
        const isNebula = nodeTypeToAdd === 'nebula';
        sideToolbarTitle.textContent = title || (isNebula ? "Nebula Sounds" : "Sounds");
        waveformTypes.forEach(wf => {
            const button = document.createElement('button');
            button.classList.add('waveform-button');
            button.dataset.waveform = wf.type;
            button.innerHTML = `<span class="type-icon">${wf.icon}</span>${wf.label}`;
            button.disabled = (isNebula && wf.type.startsWith('sampler_')) || wf.loadFailed;
            if (isNebula && wf.type.startsWith('sampler_')) {
                button.title = 'Samplers not available for Nebulas';
            } else if (wf.loadFailed) {
                button.title = `${wf.label} sample failed to load`;
                button.classList.add('disabled');
            }
             if (waveformToAdd === wf.type) button.classList.add('selected');
            button.addEventListener('click', () => handleWaveformSelect(button, wf.type));
            groupDiv.appendChild(button);
        });
        sideToolbarContent.appendChild(groupDiv);
        createNoteSelector(); // Add the note selector below waveforms

    } else if (contentType === 'pulsarTypes') {
         sideToolbarTitle.textContent = title || "Pulsars";
         pulsarTypes.forEach(pt => {
             const button = document.createElement('button');
             button.classList.add('type-button');
             button.dataset.type = pt.type;
             button.innerHTML = `<span class="type-icon">${pt.icon}</span>${pt.label}`;
             if (nodeTypeToAdd === pt.type) button.classList.add('selected');
             button.addEventListener('click', () => handleElementTypeSelect(button, pt.type));
             groupDiv.appendChild(button);
         });
         sideToolbarContent.appendChild(groupDiv);
    }

    sideToolbar.classList.remove('hidden');
}

function handleElementTypeSelect(button, elementType) {
    nodeTypeToAdd = elementType;
    waveformToAdd = null; // Reset waveform when selecting a non-waveform type
    noteIndexToAdd = -1; // Reset note index too

    const currentTypeButtons = sideToolbarContent.querySelectorAll('.type-button');
    currentTypeButtons.forEach(btn => btn.classList.remove('selected'));
    button.classList.add('selected');
    // Keep side toolbar open, do not remove note selector here
}

function handleWaveformSelect(button, waveformType) {
    if (nodeTypeToAdd !== 'sound' && nodeTypeToAdd !== 'nebula') return;
    waveformToAdd = waveformType;

    const currentWaveButtons = sideToolbarContent.querySelectorAll('.waveform-button');
    currentWaveButtons.forEach(btn => btn.classList.remove('selected'));
    button.classList.add('selected');
    // Keep side toolbar open, note selector remains
}

function changeScale(scaleKey) {
    if (!scales[scaleKey]) return;
    currentScale = scales[scaleKey];
    document.body.className = currentScale.theme;
    nodes.forEach(node => {
        if (node.type === 'sound' || node.type === 'nebula') {
            node.audioParams.scaleIndex = Math.max(MIN_SCALE_INDEX, Math.min(MAX_SCALE_INDEX, node.audioParams.scaleIndex ?? 0));
            node.audioParams.pitch = getFrequency(currentScale, node.audioParams.scaleIndex);
             if (isNaN(node.audioParams.pitch)) {
                 node.audioParams.scaleIndex = 0;
                 initialPitch = getFrequency(currentScale, 0);
             }
            updateNodeAudioParams(node);
        }
    });
    // Update note selector if it's currently visible
    if (noteSelectElement && !sideToolbar.classList.contains('hidden') && (nodeTypeToAdd === 'sound' || nodeTypeToAdd === 'nebula')) {
        noteIndexToAdd = -1; // Reset selection to random on scale change
        createNoteSelector();
    }
    saveState();
}
function updateSyncUI() { globalSyncToggleBtn.textContent = `Sync: ${isGlobalSyncEnabled ? 'ON' : 'OFF'}`; globalSyncToggleBtn.classList.toggle('active', isGlobalSyncEnabled); bpmControlsDiv.classList.toggle('hidden', !isGlobalSyncEnabled); globalBpmInput.value = globalBPM; updateRestartPulsarsButtonVisibility(); }
function updateRestartPulsarsButtonVisibility() { let showButton = false; if (currentTool === 'edit' && !isGlobalSyncEnabled && selectedNodes.size > 0) { for (const id of selectedNodes) { const node = findNodeById(id); if (node && node.isStartNode) { showButton = true; break; } } } restartPulsarsBtn.classList.toggle('hidden', !showButton); }
function updateInfoToggleUI() { toggleInfoTextBtn.textContent = `Info: ${isInfoTextVisible ? 'ON' : 'OFF'}`; toggleInfoTextBtn.classList.toggle('active', isInfoTextVisible); }

function togglePlayPause() { userHasInteracted = true; if (!isAudioReady) { setupAudio().then(context => { if (context) { if (context.state !== 'running') { context.resume().then(() => { isPlaying = true; playPauseBtn.textContent = 'Pause ⏸'; startMessage.style.display = 'none'; startAnimationLoop(); resetStartNodeTimers(); }).catch(e => {}); } else { isPlaying = true; playPauseBtn.textContent = 'Pause ⏸'; startMessage.style.display = 'none'; startAnimationLoop(); resetStartNodeTimers(); } } else { } }); } else if (audioContext.state === 'running') { audioContext.suspend().then(() => { isPlaying = false; playPauseBtn.textContent = 'Play ▶'; if (animationFrameId) { cancelAnimationFrame(animationFrameId); animationFrameId = null; } }).catch(e => {}); } else if (audioContext.state === 'suspended') { audioContext.resume().then(() => { isPlaying = true; playPauseBtn.textContent = 'Pause ⏸'; startMessage.style.display = 'none'; startAnimationLoop(); resetStartNodeTimers(); }).catch(e => {}); } }
function resetStartNodeTimers() { const now = audioContext ? audioContext.currentTime : 0; nodes.forEach(node => { if (node.isStartNode) { node.lastTriggerTime = -1; node.nextSyncTriggerTime = 0; } }); lastBeatTime = 0; }

playPauseBtn.addEventListener('click', togglePlayPause);

hamburgerBtn.addEventListener('click', () => {
    const isOpen = !hamburgerMenuPanel.classList.contains('hidden');
    resetSideToolbars();
    if (!isOpen) {
        hamburgerMenuPanel.classList.remove('hidden');
        setActiveTool('edit');
        hamburgerBtn.classList.add('active');
    } else {
         hamburgerMenuPanel.classList.add('hidden');
         hamburgerBtn.classList.remove('active');

    }
});

scaleSelect.addEventListener('change', (e) => changeScale(e.target.value));
groupVolumeSlider.addEventListener('input', (e) => { if (groupVolumeGain && isAudioReady) { try { groupVolumeGain.gain.setTargetAtTime(parseFloat(e.target.value), audioContext.currentTime, 0.02); } catch(er){} } });
groupVolumeSlider.addEventListener('change', saveState);
groupFluctuateToggle.addEventListener('change', () => { applyGroupFluctuationSettings(); saveState(); });
groupFluctuateAmount.addEventListener('input', applyGroupFluctuationSettings);
groupFluctuateAmount.addEventListener('change', saveState);
gridToggleBtn.addEventListener('click', () => { isGridVisible = !isGridVisible; gridToggleBtn.textContent = `Grid: ${isGridVisible ? 'ON' : 'OFF'}`; gridToggleBtn.classList.toggle('active', isGridVisible); gridOptionsDiv.classList.toggle('hidden', !isGridVisible); });
gridTypeBtn.addEventListener('click', () => { gridType = (gridType === 'lines') ? 'dots' : 'lines'; gridTypeBtn.textContent = `Type: ${gridType === 'lines' ? 'Lines' : 'Dots'}`; });
gridSnapBtn.addEventListener('click', () => { isSnapEnabled = !isSnapEnabled; gridSnapBtn.textContent = `Snap: ${isSnapEnabled ? 'ON' : 'OFF'}`; gridSnapBtn.classList.toggle('active', isSnapEnabled); });
toggleInfoTextBtn.addEventListener('click', () => { isInfoTextVisible = !isInfoTextVisible; updateInfoToggleUI(); });
gridSizeSlider.addEventListener('input', (e) => { gridSize = parseInt(e.target.value, 10); });
globalSyncToggleBtn.addEventListener('click', () => { isGlobalSyncEnabled = !isGlobalSyncEnabled; nodes.forEach(n => { if (n.isStartNode) { n.lastTriggerTime = -1; n.nextSyncTriggerTime = 0; } }); updateSyncUI(); saveState(); });
globalBpmInput.addEventListener('change', (e) => { const newBPM = parseInt(e.target.value, 10); if (!isNaN(newBPM) && newBPM >= 30 && newBPM <= 300) { globalBPM = newBPM; nodes.forEach(n => { if (n.isStartNode) { n.nextSyncTriggerTime = 0; } }); saveState(); } else { globalBpmInput.value = globalBPM; } });
restartPulsarsBtn.addEventListener('click', () => { if (!isAudioReady || isGlobalSyncEnabled) return; const now = audioContext.currentTime; let restarted = false; selectedNodes.forEach(id => { const node = findNodeById(id); if (node && node.isStartNode) { node.lastTriggerTime = now; node.isEnabled = true; node.animationState = 0.5; setTimeout(() => { const checkNode = findNodeById(node.id); if (checkNode) checkNode.animationState = 0; }, 150); restarted = true; } }); if (restarted) { saveState(); } });


function setupAddTool(buttonElement, type, requiresSubmenu = false, submenuType = null, submenuTitle = '') {
     setActiveTool('add');

     const addButtons = toolbar.querySelectorAll('#toolbar-add-elements button');
     addButtons.forEach(btn => {
         if (btn !== buttonElement) btn.classList.remove('active');
     });
     buttonElement.classList.add('active');

     nodeTypeToAdd = type;
     waveformToAdd = null;
     noteIndexToAdd = -1; // Reset note index when changing main add type
     resetSideToolbars(); // Close first, populate will reopen if needed

     if (requiresSubmenu && submenuType) {
         populateSideToolbar(submenuType, submenuTitle);
     } else {
        // No submenu, ready to place
     }
}

addSoundStarBtn.addEventListener('click', (e) => {
    setupAddTool(e.currentTarget, 'sound', true, 'waveforms', 'Sounds');
});
addNebulaBtn.addEventListener('click', (e) => {
     setupAddTool(e.currentTarget, 'nebula', true, 'waveforms', 'Nebula Sounds');
});
addPulsarBtn.addEventListener('click', (e) => {
     // Set nodeTypeToAdd to null initially, let the submenu selection set it.
     setupAddTool(e.currentTarget, null, true, 'pulsarTypes', 'Pulsars');
});
addGateBtn.addEventListener('click', (e) => {
     setupAddTool(e.currentTarget, 'gate');
});
addProbabilityGateBtn.addEventListener('click', (e) => {
     setupAddTool(e.currentTarget, 'probabilityGate');
});
addPitchShiftBtn.addEventListener('click', (e) => {
     setupAddTool(e.currentTarget, 'pitchShift');
});
addSpeedBtn.addEventListener('click', (e) => {
     setupAddTool(e.currentTarget, 'speed');
});



editBtn.addEventListener('click', () => setActiveTool('edit'));
connectBtn.addEventListener('click', () => setActiveTool('connect'));
deleteBtn.addEventListener('click', () => setActiveTool('delete'));
undoBtn.addEventListener('click', () => { undo(); });
redoBtn.addEventListener('click', () => { redo(); });

window.addEventListener('keydown', (e) => {
    const targetTagName = e.target.tagName.toLowerCase();
    if (targetTagName === 'input' || targetTagName === 'select' || targetTagName === 'textarea') return;

    if (e.code === 'Space' && !isSpacebarDown) { isSpacebarDown = true; e.preventDefault(); }
    const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
    const undoKeyPressed = (isMac ? e.metaKey : e.ctrlKey) && e.key.toLowerCase() === 'z' && !e.shiftKey;
    const redoKeyPressed = (isMac ? e.metaKey : e.ctrlKey) && (e.key.toLowerCase() === 'y' || (e.key.toLowerCase() === 'z' && e.shiftKey));

    let panX = 0; let panY = 0;
    switch(e.key) {
        case 'ArrowUp': panY = PAN_SPEED; break;
        case 'ArrowDown': panY = -PAN_SPEED; break;
        case 'ArrowLeft': panX = PAN_SPEED; break;
        case 'ArrowRight': panX = -PAN_SPEED; break;
    }

    if (panX !== 0 || panY !== 0) {
        viewOffsetX += panX;
        viewOffsetY += panY;
        e.preventDefault();
    }
    else if (undoKeyPressed) { e.preventDefault(); undo(); }
    else if (redoKeyPressed) { e.preventDefault(); redo(); }
    else if (e.key.toLowerCase() === 'y' && !isMac && !e.ctrlKey && !e.metaKey) { globalSyncToggleBtn.click(); e.preventDefault(); }
    else if (e.key.toLowerCase() === 'g') { gridToggleBtn.click(); e.preventDefault(); }
    else if (isGridVisible && e.key.toLowerCase() === 't' && !e.ctrlKey && !e.metaKey && !e.altKey) { gridTypeBtn.click(); e.preventDefault(); }
    else if (isGridVisible && e.key.toLowerCase() === 's' && !e.ctrlKey && !e.metaKey && !e.altKey) { gridSnapBtn.click(); e.preventDefault(); }
    else if (e.key.toLowerCase() === 'i') { toggleInfoTextBtn.click(); e.preventDefault(); }
    else if ((e.key === 'Delete' || e.key === 'Backspace') && selectedNodes.size > 0 && currentTool === 'edit') { removeNode(findNodeById(selectedNodes.values().next().value)); }
    else if (e.key.toLowerCase() === 'e') { setActiveTool('edit'); e.preventDefault(); }
    else if (e.key.toLowerCase() === 'c') { setActiveTool('connect'); e.preventDefault(); }

    else if (e.key.toLowerCase() === 's') { addSoundStarBtn.click(); e.preventDefault(); }
    else if (e.key.toLowerCase() === 'w') { addNebulaBtn.click(); e.preventDefault(); }
    else if (e.key.toLowerCase() === 'p') { addPulsarBtn.click(); e.preventDefault(); }


    else if (e.key.toLowerCase() === 'm') { hamburgerBtn.click(); e.preventDefault(); }
    else if (e.altKey && currentTool === 'edit') { e.preventDefault(); }
});
window.addEventListener('keyup', (e) => { if (e.code === 'Space') { isSpacebarDown = false; } if (e.altKey && currentTool === 'edit') { e.preventDefault(); } });
canvas.addEventListener('wheel', handleWheel, { passive: false });
canvas.addEventListener('mousedown', handleMouseDown);
canvas.addEventListener('mousemove', handleMouseMove);
canvas.addEventListener('mouseup', handleMouseUp);
canvas.addEventListener('contextmenu', (e) => e.preventDefault());

function animationLoop() { animationFrameId = requestAnimationFrame(animationLoop); if (!isAudioReady || !isPlaying) return; const now = audioContext.currentTime; const deltaTime = Math.max(0, Math.min(0.1, now - (previousFrameTime || now))); if (isGlobalSyncEnabled && beatIndicatorElement) { const beatDuration = 60 / globalBPM; if (now >= lastBeatTime + beatDuration) { beatIndicatorElement.classList.add('active'); setTimeout(() => beatIndicatorElement.classList.remove('active'), 50); lastBeatTime = Math.floor(now / beatDuration) * beatDuration; } } else if(beatIndicatorElement && beatIndicatorElement.classList.contains('active')) { beatIndicatorElement.classList.remove('active'); lastBeatTime = 0; } nodes.forEach(node => { if (node.isStartNode && node.isEnabled) { if (isGlobalSyncEnabled) { if (node.nextSyncTriggerTime === 0) { const beatDuration = 60 / globalBPM; const subdivisionDuration = beatDuration * subdivisionOptions[node.syncSubdivisionIndex].value; const beatsElapsed = now / beatDuration; const beatsPerSubdivision = subdivisionOptions[node.syncSubdivisionIndex].value; const currentSubdivisionCount = Math.floor(beatsElapsed / beatsPerSubdivision); node.nextSyncTriggerTime = (currentSubdivisionCount + 1) * beatsPerSubdivision * beatDuration; if (node.nextSyncTriggerTime <= now + 0.01) { node.nextSyncTriggerTime += subdivisionDuration; } } if (now >= node.nextSyncTriggerTime) { currentGlobalPulseId++; let initialHops = Infinity;
                node.pulseOriginNodeId = node.id; propagateTrigger(node, 0, currentGlobalPulseId, -1, initialHops, { type: 'trigger', data: {} }); const beatDuration = 60 / globalBPM; const subdivisionDuration = beatDuration * subdivisionOptions[node.syncSubdivisionIndex].value; node.nextSyncTriggerTime += subdivisionDuration; if (node.nextSyncTriggerTime <= now) { node.nextSyncTriggerTime = now + subdivisionDuration; } } } else { if (node.lastTriggerTime < 0) node.lastTriggerTime = now - Math.random() * (node.audioParams.triggerInterval || DEFAULT_TRIGGER_INTERVAL); if (now - node.lastTriggerTime >= (node.audioParams.triggerInterval || DEFAULT_TRIGGER_INTERVAL)) { currentGlobalPulseId++; let initialHops = Infinity;
                node.pulseOriginNodeId = node.id; propagateTrigger(node, 0, currentGlobalPulseId, -1, initialHops, { type: 'trigger', data: {} }); node.lastTriggerTime = now; } } } else if (node.type === 'gate') { node.currentAngle += GATE_ROTATION_SPEED * (deltaTime * 60); node.currentAngle %= (2 * Math.PI); } else if (node.type === 'nebula') {
            node.currentAngle += NEBULA_ROTATION_SPEED_OUTER * (deltaTime * 60); node.currentAngle %= (2 * Math.PI); node.innerAngle += NEBULA_ROTATION_SPEED_INNER * (deltaTime * 60); node.innerAngle %= (2 * Math.PI); node.pulsePhase += NEBULA_PULSE_SPEED * (deltaTime * 60); node.pulsePhase %= (2 * Math.PI); } }); draw(); previousFrameTime = now; }
function startAnimationLoop() { if (!animationFrameId) { previousFrameTime = audioContext ? audioContext.currentTime : performance.now() / 1000; animationLoop(); } }

function updateToolbarHeightVar() {
    const toolbarHeight = toolbar.offsetHeight;
    document.documentElement.style.setProperty('--toolbar-height', `${toolbarHeight}px`);
}

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    updateToolbarHeightVar();
});

window.addEventListener('load', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    updateToolbarHeightVar();
    Object.keys(scales).forEach(key => {
        const o = document.createElement('option');
        o.value = key;
        o.textContent = scales[key].name;
        scaleSelect.appendChild(o);
    });
    scaleSelect.value = 'major_pentatonic';
    globalBpmInput.value = globalBPM;
    gridSizeSlider.value = gridSize;
    setActiveTool('edit');
    startMessage.style.display = 'block';
    resetSideToolbars();
    noteSelectElement = null; // Ensure reset on load
    noteSelectContainer = null;
});