const canvas = document.getElementById("mainCanvas")
const ctx = canvas.getContext("2d")
const startMessage = document.getElementById("startMessage")
const loadingIndicator = document.getElementById("loadingIndicator")
const scaleSelectPianoRoll = document.getElementById("scaleSelectPianoRoll")
const groupControlsDiv = document.getElementById("groupControls")
const groupVolumeSlider = document.getElementById("groupVolumeSlider")
const groupFluctuateToggle = document.getElementById("groupFluctuateToggle")
const groupFluctuateAmount = document.getElementById("groupFluctuateAmount")
const groupNodeCountSpan = document.getElementById("groupNodeCount")
const gridControlsDiv = document.getElementById("gridControls")
const gridOptionsDiv = document.getElementById("gridOptions")
const gridToggleBtn = document.getElementById("gridToggleBtn")
const gridTypeBtn = document.getElementById("gridTypeBtn")
const gridSnapBtn = document.getElementById("gridSnapBtn")
const toggleInfoTextBtn = document.getElementById("toggleInfoTextBtn")
const transportControlsDiv = document.getElementById("transportControls")
const globalSyncToggleBtn = document.getElementById("globalSyncToggleBtn")
const bpmControlsDiv = document.getElementById("bpmControls")
const globalBpmInput = document.getElementById("globalBpmInput")
const restartPulsarsBtn = document.getElementById("restartPulsarsBtn")
const playPauseBtn = document.getElementById("playPauseBtn")
const beatIndicatorElement = document.getElementById("beatIndicator")
const saveStateBtn = document.getElementById("saveStateBtn")
const loadStateBtn = document.getElementById("loadStateBtn")
const loadStateInput = document.getElementById("loadStateInput")
const mixerBtn = document.getElementById("mixerBtn")
const pianoRollBtn = document.getElementById("pianoRollBtn")
const mixerPanel = document.getElementById("mixerPanel")
const pianoRollPanel = document.getElementById("pianoRollPanel")
const masterVolumeSlider = document.getElementById("masterVolumeSlider")
const masterVolumeValue = document.getElementById("masterVolumeValue")
const delaySendSlider = document.getElementById("delaySendSlider")
const delaySendValue = document.getElementById("delaySendValue")
const delayTimeSlider = document.getElementById("delayTimeSlider")
const delayTimeValue = document.getElementById("delayTimeValue")
const delayFeedbackSlider = document.getElementById("delayFeedbackSlider")
const delayFeedbackValue = document.getElementById("delayFeedbackValue")
const mixerGroupControlsContainer = document.getElementById("mixerGroupControlsContainer");
const midiInSelect = document.getElementById("midiInSelect")
const midiOutSelect = document.getElementById("midiOutSelect")
const toolbar = document.getElementById("toolbar")
const addSoundStarBtn = document.getElementById("addSoundStarBtn")
const addSamplerBtn = document.getElementById("addSamplerBtn");
const addNebulaBtn = document.getElementById("addNebulaBtn")
const addPulsarBtn = document.getElementById("addPulsarBtn")
const addDrumElementBtn = document.getElementById("addDrumElementBtn")
const addGateBtn = document.getElementById("addGateBtn")
const addProbabilityGateBtn = document.getElementById("addProbabilityGateBtn")
const addPitchShiftBtn = document.getElementById("addPitchShiftBtn")
const addRelayBtn = document.getElementById("addRelayBtn")
const addReflectorBtn = document.getElementById("addReflectorBtn")
const addSwitchBtn = document.getElementById("addSwitchBtn")
const editBtn = document.getElementById("editBtn")
const connectBtn = document.getElementById("connectBtn")
const connectStringBtn = document.getElementById("connectStringBtn")
const glideToolButton = document.getElementById("glide-tool-button")
const GLIDE_LINE_COLOR = 'rgba(255, 180, 255, 0.8)'; // Roze-achtige kleur voor glide lijn
const GLIDE_LINE_WIDTH = 2.5; // Lijn dikte
const deleteBtn = document.getElementById("deleteBtn")
const undoBtn = document.getElementById("undoBtn")
const redoBtn = document.getElementById("redoBtn")
const hamburgerBtn = document.getElementById("hamburgerBtn")
const hamburgerMenuPanel = document.getElementById("hamburgerMenuPanel")
const editPanelContent = document.getElementById("editPanelContent")
const sideToolbar = document.getElementById("sideToolbar")
const sideToolbarTitle = document.getElementById("sideToolbarTitle")
const sideToolbarContent = document.getElementById("sideToolbarContent")
const A4_FREQ = 440.0;
const A4_MIDI_NOTE = 69;
const PORTAL_NEBULA_TYPE = 'portal_nebula';

let audioContext
let masterGain
let reverbNode
let reverbWetGain
let delayNode
let delayFeedbackGain
let masterDelaySendGain
let isReverbReady = false
let isDelayReady = false
const REVERB_IR_URL = "reverb.wav"

let nodes = []
let connections = []
let activePulses = []
let activeParticles = []
let windParticles = []
let nodeIdCounter = 0
let connectionIdCounter = 0
let pulseIdCounter = 0
let particleIdCounter = 0
let isAudioReady = false
let currentGlobalPulseId = 0
let previousFrameTime = 0
let bgAngle = Math.random() * Math.PI * 2
let pianoRollCanvas = null;
let pianoRollCtx = null;
let pianoRollHexagons = []; 
let activeNebulaInteractions = new Map(); 
let portalGroupGain = null;
let originalNebulaGroupGain = null;

const NODE_RADIUS_BASE = 12
const MIN_NODE_SIZE = 0.6
const MAX_NODE_SIZE = 1.8
const MIN_FILTER_FREQ = 350
const MAX_FILTER_FREQ = 16000
const DEFAULT_REVERB_SEND = 0.4
const DEFAULT_DELAY_SEND = 0.3
const DEFAULT_TRIGGER_INTERVAL = 2.5
const DEFAULT_PULSE_INTENSITY = 0.7
const MIN_PULSE_INTENSITY = 0.1
const MAX_PULSE_INTENSITY = 1.5
const PULSAR_RANDOM_TIMING_CHANCE_PER_SEC = 0.4
const DELAY_FACTOR = 0.005
const PULSE_SIZE = 3
const SNOWBALL_HOPS = 5
const GATE_ROTATION_SPEED = 0.025
const GATE_ANGLE_SIZE = Math.PI / 2.5
const GATE_MODES = ["1/2", "1/3", "1/4", "2/3", "3/4", "RAND"]
const DEFAULT_GATE_MODE_INDEX = 0
const GATE_RANDOM_THRESHOLD = 0.5
const DEFAULT_PROBABILITY = 0.5
const PITCH_SHIFT_AMOUNTS = [1, 2, 3, 4, 5, 7, 12, -1, -2, -3, -4, -5, -7, -12]
const DEFAULT_PITCH_SHIFT_INDEX = 6
const NEBULA_ROTATION_SPEED_OUTER = 0.0001
const NEBULA_ROTATION_SPEED_INNER = -0.0002
const NEBULA_PULSE_SPEED = 0.026
const NEBULA_BASE_FREQ_FACTOR = 0.4
const NEBULA_OSC_INTERVALS = [0, 7, 12]
const NEBULA_OSC_DETUNE = 7
const NEBULA_FILTER_LFO_RATE = 0.04
const NEBULA_FILTER_LFO_DEPTH_FACTOR = 6
const NEBULA_VOL_LFO_RATE = 0.08
const NEBULA_VOL_LFO_DEPTH = 0.18
const NEBULA_VOL_SCALING = 0.09
const NEBULA_MAX_VOL = 0.28
const NEBULA_FILTER_Q = 2.5
const STRING_VIOLIN_DEFAULTS = {
  type: "string_violin",
  numOsc: 3,
  detune: 8,
  attack: 0.05,
  release: 1.5,
  filterFreqFactor: 2.5,
  filterQ: 1.5,
  vibratoRate: 4,
  vibratoDepth: 5,
  volume: 0.4,
  scaleIndex: 0,
  pitch: 0,
  reverbSend: DEFAULT_REVERB_SEND,
  delaySend: DEFAULT_DELAY_SEND
}

const DRUM_ELEMENT_DEFAULTS = {
  drum_kick: {
    baseFreq: 60,
    decay: 0.3,
    volume: 1.0,
    icon: "💥",
    label: "Kick"
  },
  drum_snare: {
    baseFreq: 180,
    decay: 0.2,
    noiseDecay: 0.15,
    volume: 0.8,
    icon: "SN",
    label: "Snare"
  },
  drum_hihat: {
    baseFreq: 7000,
    decay: 0.05,
    volume: 0.6,
    icon: "HH",
    label: "Hi-Hat"
  },
  drum_clap: {
    noiseDecay: 0.1,
    volume: 0.9,
    icon: "CL",
    label: "Clap",
    baseFreq: 1500
  },
  drum_tom1: {
    baseFreq: 150,
    decay: 0.4,
    volume: 0.9,
    icon: "T1",
    label: "Tom 1"
  },
  drum_tom2: {
    baseFreq: 100,
    decay: 0.5,
    volume: 0.9,
    icon: "T2",
    label: "Tom 2"
  },
  drum_cowbell: {
    baseFreq: 520,
    decay: 0.3,
    volume: 0.7,
    icon: "CB",
    label: "Cowbell"
  }
}

const PORTAL_NEBULA_DEFAULTS = {
  droneBaseFreq: 40.0, // Lage drone frequentie (bv. E1)
  numHarmonics: 5,     // Aantal boventonen
  harmonicSpread: 0.8, // Hoe ver de boventonen van elkaar liggen (octaven etc.)
  harmonicBaseGain: 0.04, // Volume van de boventonen (laag!)
  shimmerRate: 0.15,    // Snelheid van 'glinster' LFO
  shimmerDepth: 0.02,   // Diepte van 'glinster' LFO
  baseColorHue: 280,   // Startkleur (paarsig)
  pulseSpeed: 0.5,     // Snelheid van visuele puls iris/ringen
  // Voeg eventueel meer defaults toe voor visuals/audio
};


let currentTool = "edit"
let nodeTypeToAdd = null
let waveformToAdd = null
let noteIndexToAdd = -1
let connectionTypeToAdd = "standard"
let noteSelectElement = null
let noteSelectContainer = null
let isDragging = false
let isConnecting = false
let isResizing = false
let nodeClickedAtMouseDown = null
let nodeWasSelectedAtMouseDown = false
let connectionClickedAtMouseDown = null
let connectingNode = null
let resizeStartSize = 1.0
let resizeStartY = 0
let mousePos = { x: 0, y: 0 }
let screenMousePos = { x: 0, y: 0 }
let didDrag = false
let mouseDownPos = { x: 0, y: 0 }
let selectedElements = new Set()
let isSelecting = false
let selectionRect = { startX: 0, startY: 0, endX: 0, endY: 0, active: false }
let nodeDragOffsets = new Map()
let dragStartPos = { x: 0, y: 0 }
let brushNodeType = 'sound'; // Default type om te schilderen (bv. sound star)
let brushWaveform = 'fmBell'; // Default subtype (indien van toepassing)
let brushStartWithPulse = true; // Default: start met puls?
let isBrushing = false;         // Zijn we bezig met een keten?
let lastBrushNode = null;       // De laatst geplaatste node in de keten

const HUE_STEP = 30
const scales = {
  major_pentatonic: {
    name: "Deep Space",
    notes: [0, 2, 4, 7, 9],
    theme: "theme-major-pentatonic",
    baseFreq: 130.81,
    baseHSL: { h: 220, s: 75, l: 65 }
  },
  minor_pentatonic: {
    name: "Nebula",
    notes: [0, 3, 5, 7, 10],
    theme: "theme-minor-pentatonic",
    baseFreq: 110.0,
    baseHSL: { h: 280, s: 70, l: 68 }
  },
  major: {
    name: "Aurora",
    notes: [0, 2, 4, 5, 7, 9, 11],
    theme: "theme-major",
    baseFreq: 130.81,
    baseHSL: { h: 150, s: 70, l: 60 }
  },
  minor: {
    name: "Sunset",
    notes: [0, 2, 3, 5, 7, 8, 10],
    theme: "theme-minor",
    baseFreq: 110.0,
    baseHSL: { h: 25, s: 80, l: 65 }
  },
  chromatic: {
    name: "Starfield",
    notes: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    theme: "theme-chromatic",
    baseFreq: 130.81,
    baseHSL: { h: 0, s: 0, l: 75 }
  }
}
let currentScaleKey = "major_pentatonic"
let currentScale = scales[currentScaleKey]
let currentRootNote = 0
let globalTransposeOffset = 0
const noteNames = [
  "C",
  "C#",
  "D",
  "D#",
  "E",
  "F",
  "F#",
  "G",
  "G#",
  "A",
  "A#",
  "B"
]
const MIN_SCALE_INDEX = -24
const MAX_SCALE_INDEX = 36

let tapTempoTimes = []
const MAX_TAP_INTERVAL = 2000
const MAX_TAP_TIMES = 4
const CONSTELLATION_NODE_TYPES = ["sound", "drum_kick", "drum_snare", "drum_hihat", "drum_clap", "drum_tom1", "drum_tom2", "drum_cowbell"];
let identifiedGroups = []; 
let currentConstellationGroup = new Set();
let fluctuatingGroupNodeIDs = new Set();

let isGridVisible = false
let gridType = "lines"
let isSnapEnabled = false
const DEFAULT_GRID_SIZE_PX = 50
const REFERENCE_BPM = 120
const PIXELS_PER_SIXTEENTH_AT_REF_BPM = 50
let isInfoTextVisible = true
let viewOffsetX = 0
let viewOffsetY = 0
let viewScale = 1.0
const MIN_ZOOM = 0.2
const MAX_ZOOM = 3.0
const ZOOM_SENSITIVITY = 0.001
const PAN_SPEED = 10
let isPanning = false
let panStart = { x: 0, y: 0 }
let isSpacebarDown = false
const MAX_HISTORY_SIZE = 50
let historyStack = []
let historyIndex = -1
let isPerformingUndoRedo = false
let isGlobalSyncEnabled = false
let globalBPM = 120
const subdivisionOptions = [
  { label: "1/32", value: 0.125 },
  { label: "1/16", value: 0.25 },
  { label: "1/8", value: 0.5 },
  { label: "1/4", value: 1 },
  { label: "1/2", value: 2 },
  { label: "1/1", value: 4 }
]
const DEFAULT_SUBDIVISION_INDEX = 3

let isPlaying = false
let animationFrameId = null
let userHasInteracted = false
let lastBeatTime = 0
let midiAccess = null
let activeMidiInput = null
let activeMidiOutput = null

const pulsarTypes = [
  { type: "pulsar_standard", label: "Standard", icon: "🔆" },
  { type: "pulsar_random_volume", label: "Random Volume", icon: "🔀🔆" },
  { type: "pulsar_random_particles", label: "Random Timing", icon: "🎲🔆" },
  { type: "pulsar_triggerable", label: "Triggerable", icon: "⚡🔆" },
  { type: "pulsar_manual", label: "Manual", icon: "👆" }
];
// Definieer non-sampler types direct
const nonSamplerWaveformTypes = [
  { type: "fmBell", label: "Bell", icon: "🔔" },
  { type: "fmXylo", label: "Xylo", icon: "🥁" },
  { type: "sine", label: "Sine", icon: "○" },
  { type: "triangle", label: "Triangle", icon: "△" },
  { type: "square", label: "Square", icon: "□" },
  { type: "sawtooth", label: "Saw", icon: "📈" },
];

// Genereer sampler types uit SAMPLER_DEFINITIONS (uit samplers.js)
// Zorg ervoor dat samplers.js geladen is VOOR app.js in je HTML!
const samplerWaveformTypes = (typeof SAMPLER_DEFINITIONS !== 'undefined')
  ? SAMPLER_DEFINITIONS.map(sampler => ({
      type: `sampler_${sampler.id}`, // Maak het type string, bijv. "sampler_piano"
      label: sampler.label,
      icon: sampler.icon,
      loadFailed: sampler.loadFailed // Gebruik de status uit de definitie
  }))
  : []; // Lege array als SAMPLER_DEFINITIONS niet gevonden is

if (samplerWaveformTypes.length === 0 && typeof SAMPLER_DEFINITIONS === 'undefined') {
  console.error("SAMPLER_DEFINITIONS is niet gevonden. Zorg dat samplers.js correct geladen wordt vóór app.js in index.html.");
}

// Combineer de lijsten
const waveformTypes = [...nonSamplerWaveformTypes, ...samplerWaveformTypes];
const drumElementTypes = Object.keys(DRUM_ELEMENT_DEFAULTS).map((key) => ({
  type: key,
  label: DRUM_ELEMENT_DEFAULTS[key].label,
  icon: DRUM_ELEMENT_DEFAULTS[key].icon
}))
const stringTypes = [{ type: "string_violin", label: "Violin", icon: "🎻" }]
const connectionTypes = ["standard", "string_violin"]

function isPulsarType(type) {
  return pulsarTypes.some((pt) => pt.type === type)
}
function isDrumType(type) {
  return drumElementTypes.some((dt) => dt.type === type)
}

function getFrequency(scaleDef, index, oct = 0) {
  const notes = scaleDef.notes
  const noteIdx = index % notes.length
  const octOffset = Math.floor(index / notes.length) + oct
  const semitones = notes[noteIdx] + octOffset * 12
  const finalSemitones = semitones + currentRootNote + globalTransposeOffset
  const baseFreq = scaleDef.baseFreq
  return baseFreq * Math.pow(2, finalSemitones / 12)
}
function frequencyToMidi(frequency) {
  if (frequency <= 0) return NaN;
  return Math.round(A4_MIDI_NOTE + 12 * Math.log2(frequency / A4_FREQ));
}
function getNoteName(midiNoteNumber) {
  const note = Math.round(midiNoteNumber);
  if (isNaN(note)) return "?";
  const octave = Math.floor(note / 12) - 1;
  const noteIndex = note % 12;
  const correctedNoteIndex = (noteIndex < 0) ? noteIndex + 12 : noteIndex;
  const noteNameBase = noteNames[correctedNoteIndex] || "?";
  return noteNameBase + octave;
}
function getNoteNameFromScaleIndex(scaleDef, index) {
  const notes = scaleDef.notes;
  if (!notes || notes.length === 0) return "?";
  const numNotesInScale = notes.length;
  const noteIdx = index % numNotesInScale;
  const effectiveNoteIndex = (noteIdx < 0) ? noteIdx + numNotesInScale : noteIdx;
  const octOffset = Math.floor(index / numNotesInScale);
  const semitonesInScale = notes[effectiveNoteIndex];
  if (semitonesInScale === undefined || semitonesInScale === null) return "?";
  const totalSemitonesFromScaleBase = semitonesInScale + octOffset * 12;
  const baseFreqWithOffsets = scaleDef.baseFreq * Math.pow(2, (currentRootNote + globalTransposeOffset) / 12);
  const baseMidiNote = frequencyToMidi(baseFreqWithOffsets);
  if (isNaN(baseMidiNote)) {
      return "?";
  }
  const finalAbsoluteMidiNote = baseMidiNote + totalSemitonesFromScaleBase;
  return getNoteName(finalAbsoluteMidiNote);
}
function distance(x1, y1, x2, y2) {
  const dx = x1 - x2
  const dy = y1 - y2
  return Math.sqrt(dx * dx + dy * dy)
}
function lerp(a, b, t) {
  return a + (b - a) * t
}
function findNodeAt(worldX, worldY) {
  for (let i = nodes.length - 1; i >= 0; i--) {
    const n = nodes[i]
    const apparentRadius = (NODE_RADIUS_BASE * n.size * 1.15) / viewScale
    const d = distance(worldX, worldY, n.x, n.y)
    if (d < apparentRadius) {
      return n
    }
  }
  return null
}
function findNodeById(id) {
  return nodes.find((n) => n.id === id)
}
function findConnectionById(id) {
  return connections.find((c) => c.id === id)
}
function findConnectionNear(worldX, worldY, threshold = 10) {
  const screenThreshold = threshold / viewScale
  for (const conn of connections) {
    const nA = findNodeById(conn.nodeAId)
    const nB = findNodeById(conn.nodeBId)
    if (!nA || !nB) continue
    const midX = (nA.x + nB.x) / 2 + conn.controlPointOffsetX
    const midY = (nA.y + nB.y) / 2 + conn.controlPointOffsetY
    const curveMidX = lerp(lerp(nA.x, midX, 0.5), lerp(midX, nB.x, 0.5), 0.5)
    const curveMidY = lerp(lerp(nA.y, midY, 0.5), lerp(midY, nB.y, 0.5), 0.5)
    const d = distance(worldX, worldY, curveMidX, curveMidY)
    if (d < screenThreshold) {
      return conn
    }
  }
  return null
}
function isElementSelected(type, id) {
  for (const elem of selectedElements) {
    if (elem.type === type && elem.id === id) {
      return true
    }
  }
  return false
}

function hslToRgba(h, s, l, a = 1) {
  let r, g, b
  s /= 100
  l /= 100
  if (s == 0) {
    r = g = b = l
  } else {
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1
      if (t > 1) t -= 1
      if (t < 1 / 6) return p + (q - p) * 6 * t
      if (t < 1 / 2) return q
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
      return p
    }
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s
    const p = 2 * l - q
    h /= 360
    r = hue2rgb(p, q, h + 1 / 3)
    g = hue2rgb(p, q, h)
    b = hue2rgb(p, q, h - 1 / 3)
  }
  return `rgba(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(
    b * 255
  )}, ${a})`
}
function getWorldCoords(screenX, screenY) {
  return {
    x: (screenX - viewOffsetX) / viewScale,
    y: (screenY - viewOffsetY) / viewScale
  }
}
function getScreenCoords(worldX, worldY) {
  return {
    x: worldX * viewScale + viewOffsetX,
    y: worldY * viewScale + viewOffsetY
  }
}

function updateLoadingIndicator() {
  const percent =
    totalSamples > 0
      ? Math.round((samplesLoadedCount / totalSamples) * 100)
      : 100
  loadingIndicator.textContent = `Loading Samples... ${percent}%`
  if (samplesLoadedCount === totalSamples) {
    loadingIndicator.style.display = "none"
  } else {
    loadingIndicator.style.display = "block"
  }
}
async function loadSample(url, sampleName) {
  updateLoadingIndicator()
  try {
    const response = await fetch(url)
    if (!response.ok)
      throw new Error(`HTTP error! status: ${response.status} for ${url}`)
    const arrayBuffer = await response.arrayBuffer()
    let decodedBuffer = null
    if (
      typeof audioContext.decodeAudioData === "function" &&
      audioContext.decodeAudioData.length !== 1
    ) {
      decodedBuffer = await audioContext.decodeAudioData(arrayBuffer)
    } else {
      decodedBuffer = await new Promise((resolve, reject) => {
        audioContext.decodeAudioData(
          arrayBuffer,
          (buffer) => {
            resolve(buffer)
          },
          (error) => {
            reject(error)
          }
        )
      })
    }
    samplesLoadedCount++
    updateLoadingIndicator()
    return { name: sampleName, buffer: decodedBuffer, success: true }
  } catch (error) {
    updateLoadingIndicator()
    const waveformName = `sampler_${sampleName.toLowerCase()}`
    const wfType = waveformTypes.find((w) => w.type === waveformName)
    if (wfType) wfType.loadFailed = true
    return { name: sampleName, buffer: null, success: false }
  }
}

async function setupAudio() {
  if (audioContext) return audioContext;
  try {
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
      masterGain = audioContext.createGain();
      masterGain.gain.value = parseFloat(masterVolumeSlider.value);
      masterGain.connect(audioContext.destination);

      portalGroupGain = audioContext.createGain();
      portalGroupGain.gain.value = 0.7;
      portalGroupGain.connect(masterGain);
      console.log("DEBUG setupAudio: portalGroupGain aangemaakt:", portalGroupGain ? 'JA' : 'NEE');

      originalNebulaGroupGain = audioContext.createGain();
      originalNebulaGroupGain.gain.value = 0.8;
      originalNebulaGroupGain.connect(masterGain);
      console.log("DEBUG setupAudio: originalNebulaGroupGain aangemaakt:", originalNebulaGroupGain ? 'JA' : 'NEE');

      reverbNode = audioContext.createConvolver();
      reverbWetGain = audioContext.createGain();
      reverbWetGain.gain.value = 0.5;
      reverbNode.connect(reverbWetGain);
      reverbWetGain.connect(masterGain);

      delayNode = audioContext.createDelay(1.0);
      delayFeedbackGain = audioContext.createGain();
      masterDelaySendGain = audioContext.createGain();
      masterDelaySendGain.gain.value = parseFloat(delaySendSlider.value);
      delayNode.delayTime.value = parseFloat(delayTimeSlider.value);
      delayFeedbackGain.gain.value = parseFloat(delayFeedbackSlider.value);
      masterDelaySendGain.connect(delayNode);
      delayNode.connect(delayFeedbackGain);
      delayFeedbackGain.connect(delayNode);
      delayNode.connect(masterGain);
      isDelayReady = true;

      try {
          const r = await fetch(REVERB_IR_URL);
          if (!r.ok) throw new Error(`HTTP error! status: ${r.status} for ${REVERB_IR_URL}`);
          const ab = await r.arrayBuffer();
          if (audioContext.decodeAudioData.length === 1) {
              await new Promise((res, rej) => {
                  audioContext.decodeAudioData(ab, (b) => {
                      reverbNode.buffer = b;
                      isReverbReady = true;
                      res();
                  }, (e) => {
                      isReverbReady = false;
                      rej(e);
                  });
              });
          } else {
              const b = await audioContext.decodeAudioData(ab);
              reverbNode.buffer = b;
              isReverbReady = true;
          }
      } catch (e) {
          console.error("Failed to load or process reverb IR:", e);
          isReverbReady = false;
      }

      samplesLoadedCount = 0;
      totalSamples = (typeof SAMPLER_DEFINITIONS !== 'undefined') ? SAMPLER_DEFINITIONS.length : 0;
      updateLoadingIndicator();

      const sampleLoadPromises = (typeof SAMPLER_DEFINITIONS !== 'undefined')
          ? SAMPLER_DEFINITIONS.map(sampler =>
              loadSample(sampler.url, sampler.id)
            )
          : [];

      if (sampleLoadPromises.length === 0 && totalSamples > 0) {
           console.error("Kon geen sample laad-promises maken, maar totalSamples > 0. Is samplers.js geladen?");
      }

      const loadResults = await Promise.all(sampleLoadPromises);

      if (typeof SAMPLER_DEFINITIONS !== 'undefined') {
          loadResults.forEach((result) => {
              const definition = SAMPLER_DEFINITIONS.find(s => s.id === result.name);
              if (!definition) {
                  console.error(`Kon sampler definitie niet vinden voor geladen sample: ${result.name}`);
                  return;
              }
              if (result.success) {
                  definition.buffer = result.buffer;
                  definition.isLoaded = true;
                  definition.loadFailed = false;
              } else {
                  definition.buffer = null;
                  definition.isLoaded = false;
                  definition.loadFailed = true;
                  const wfType = waveformTypes.find(w => w.type === `sampler_${definition.id}`);
                  if (wfType) wfType.loadFailed = true;
                  console.warn(`Failed to load sample: ${definition.label} from ${definition.url}`);
              }
          });
      }

      updateLoadingIndicator();
      isAudioReady = true;
      resetSideToolbars();
      changeScale(scaleSelectPianoRoll.value, true);
      updateSyncUI();
      updateGroupControlsUI();
      updateInfoToggleUI();
      setupMIDI();

      if (historyStack.length === 0) {
           saveState();
      }
      identifyAndRouteAllGroups();
      updateMixerGUI();
      drawPianoRoll();

      return audioContext;

  } catch (e) {
      startMessage.textContent = "Audio Context Error";
      startMessage.style.display = "block";
      console.error("Fout tijdens setupAudio:", e);
      isAudioReady = false;
      return null;
  }
}

function setGroupVolume(volume, sourceSliderId) {
  if (!groupVolumeGain || !audioContext) return;

  const newVol = Math.max(0, Math.min(1.5, parseFloat(volume)));

  groupVolumeGain.gain.setTargetAtTime(newVol, audioContext.currentTime, 0.01);

  const originalSlider = document.getElementById("groupVolumeSlider");
  if (originalSlider && sourceSliderId !== "groupVolumeSlider") {
      originalSlider.value = newVol;
  }

  const mixerSlider = document.getElementById("mixerGroupSlider"); // Gebruik vaste ID voor de dynamische slider
  const mixerValueSpan = document.getElementById("mixerGroupValue");
  if (mixerSlider && sourceSliderId !== "mixerGroupSlider") {
      mixerSlider.value = newVol;
  }
  if (mixerValueSpan) {
      mixerValueSpan.textContent = newVol.toFixed(2);
  }

  const originalLabel = document.querySelector('label[for="groupVolumeSlider"]');
  if (originalLabel && originalLabel.textContent.includes('(')) {
       originalLabel.textContent = `Group Volume (${newVol.toFixed(2)}):`;
  }
}


function identifyAndRouteAllGroups() {
  if (!isAudioReady) return;
  // console.log("--- Running identifyAndRouteAllGroups (Send After Group) ---"); // Logging uit

  // Stappen 1-4: Vind groepen, maak gains, ruim oude op, update lijst (blijft hetzelfde)
  const visitedNodes = new Set();
  const newGroups = [];
  let nextGroupId = 0;
  const oldGainNodes = identifiedGroups.map(g => g.gainNode).filter(gn => gn);

  nodes.forEach(node => {
      if (CONSTELLATION_NODE_TYPES.includes(node.type) && !visitedNodes.has(node.id)) {
          const constellationNodeIds = findConstellation(node.id);
          if (constellationNodeIds.size > 0) {
              constellationNodeIds.forEach(id => visitedNodes.add(id));
              newGroups.push({ id: nextGroupId++, nodeIds: constellationNodeIds, gainNode: null });
          }
      }
  });

  newGroups.forEach(newGroup => {
      const gainNode = audioContext.createGain();
      gainNode.gain.value = 1.0;
      newGroup.gainNode = gainNode;
  });

  oldGainNodes.forEach(oldGain => { if (oldGain) { try { oldGain.disconnect(); } catch(e){} } });

  identifiedGroups = newGroups;

  // Stap 5a: Routeer Nodes (sound/drum) met NIEUWE send logica
  nodes.forEach(node => {
      if (CONSTELLATION_NODE_TYPES.includes(node.type)) {
          const outputNode = node.audioNodes?.gainNode || node.audioNodes?.mainGain;
          const delaySendGain = node.audioNodes?.delaySendGain;
          const reverbSendGain = node.audioNodes?.reverbSendGain;

          if (!outputNode) return;

          const targetGroup = findGroupContainingNode(node.id);
          // destinationNode is NU de Group Gain Node of de Master Gain Node
          const destinationNode = targetGroup ? targetGroup.gainNode : masterGain;

          // --- Disconnect eerst alles van de output en sends ---
          try { outputNode.disconnect(); } catch(e){}
          if(delaySendGain) { try {delaySendGain.disconnect();} catch(e){} } // Disconnect input & output
          if(reverbSendGain) { try {reverbSendGain.disconnect();} catch(e){} } // Disconnect input & output

          // --- Verbind Hoofd Pad ---
          outputNode.connect(destinationNode); // Altijd Output -> Group/Master

          // --- Verbind Sends (Tap NU VANAF destinationNode!) ---
          if (reverbSendGain && isReverbReady && reverbNode) {
              // Verbind Group/Master -> Send INPUT
              destinationNode.connect(reverbSendGain);
              // Verbind Send OUTPUT -> Effect
              reverbSendGain.connect(reverbNode);
          }
          if (delaySendGain && isDelayReady && masterDelaySendGain) {
              // Verbind Group/Master -> Send INPUT
              destinationNode.connect(delaySendGain);
              // Verbind Send OUTPUT -> Master Send INPUT
              delaySendGain.connect(masterDelaySendGain);
          }
      } else if (node.type === 'nebula') {
          // Nebula's worden niet gegroepeerd, dus hun sends moeten direct van hun output komen
          // (We gaan ervan uit dat de verbindingen in createAudioNodesForNode correct en stabiel zijn)
           const outputNode = node.audioNodes?.gainNode;
           const delaySendGain = node.audioNodes?.delaySendGain;
           const reverbSendGain = node.audioNodes?.reverbSendGain;
           if(outputNode) {
               // Zorg dat de hoofd output naar master gaat (als niet al verbonden)
               // TODO: Robuustere check nodig als verbindingen elders verbroken kunnen worden
               // Voor nu, vertrouw op initiële verbinding + sends uit createAudioNodesForNode

               // Zorg dat sends correct verbonden blijven (herverbind voor zekerheid)
               if (reverbSendGain && isReverbReady && reverbNode) {
                  try { outputNode.disconnect(reverbSendGain); } catch(e){}
                  try { reverbSendGain.disconnect(reverbNode); } catch(e){}
                  outputNode.connect(reverbSendGain);
                  reverbSendGain.connect(reverbNode);
               }
               if (delaySendGain && isDelayReady && masterDelaySendGain) {
                  try { outputNode.disconnect(delaySendGain); } catch(e){}
                  try { delaySendGain.disconnect(masterDelaySendGain); } catch(e){}
                  outputNode.connect(delaySendGain);
                  delaySendGain.connect(masterDelaySendGain);
               }
           }
      }
  });

  // Stap 5b: String Connections (Implementeer dezelfde NIEUWE logica)
   connections.forEach(conn => {
      if (conn.type === 'string_violin' && conn.audioNodes) {
          const outputNode = conn.audioNodes.gainNode;
          const delaySendGain = conn.audioNodes.delaySendGain;
          const reverbSendGain = conn.audioNodes.reverbSendGain;
          if (!outputNode) return;

          const nodeA = findNodeById(conn.nodeAId);
          const nodeB = findNodeById(conn.nodeBId);
          const groupA = nodeA ? findGroupContainingNode(nodeA.id) : null;
          const groupB = nodeB ? findGroupContainingNode(nodeB.id) : null;
          const targetGroup = (groupA && groupB && groupA === groupB) ? groupA : null;
          const destinationNode = targetGroup ? targetGroup.gainNode : masterGain;

          // Disconnect
          try { outputNode.disconnect(); } catch(e){}
          if(delaySendGain) { try {delaySendGain.disconnect();} catch(e){} }
          if(reverbSendGain) { try {reverbSendGain.disconnect();} catch(e){} }

          // Verbind Hoofd Pad
          outputNode.connect(destinationNode);

           // Verbind Sends (vanaf destinationNode)
          if (reverbSendGain && isReverbReady && reverbNode) {
              destinationNode.connect(reverbSendGain);
              reverbSendGain.connect(reverbNode);
          }
          if (delaySendGain && isDelayReady && masterDelaySendGain) {
               destinationNode.connect(delaySendGain);
               delaySendGain.connect(masterDelaySendGain);
          }
      }
  });

  // Stap 5c: Verbind Group Gains met Master (blijft hetzelfde)
   identifiedGroups.forEach(group => {
        if(group.gainNode) {
             try { group.gainNode.disconnect(masterGain); } catch(e) {}
             group.gainNode.connect(masterGain);
        }
   });

  // Stap 6: Update de Mixer UI (blijft hetzelfde)
  updateMixerGUI();
}

function createAudioNodesForNode(node) {
  if (!audioContext || (!["sound", "nebula", PORTAL_NEBULA_TYPE].includes(node.type) && !isDrumType(node.type))) {
      return null;
  }
  const now = audioContext.currentTime;
  const startDelay = now + 0.02;
  try {
      if (node.type === "sound") {
          const gainNode = audioContext.createGain();
          gainNode.gain.setValueAtTime(0, now);
          const lowPassFilter = audioContext.createBiquadFilter();
          lowPassFilter.type = "lowpass";
          lowPassFilter.Q.value = 1.2;
          let reverbSendGain = null;
          if (isReverbReady && reverbNode) {
              reverbSendGain = audioContext.createGain();
              reverbSendGain.gain.value = node.audioParams.reverbSend;
              reverbSendGain.connect(reverbNode);
          }
          let delaySendGain = null;
          if (isDelayReady && masterDelaySendGain) {
              delaySendGain = audioContext.createGain();
              delaySendGain.gain.value = node.audioParams.delaySend;
              delaySendGain.connect(masterDelaySendGain);
          }
          const volLfo = audioContext.createOscillator();
          volLfo.type = "sine";
          volLfo.frequency.setValueAtTime(node.audioParams.volLfoRate, now);
          const volLfoGain = audioContext.createGain();
          volLfoGain.gain.value = fluctuatingGroupNodeIDs.has(node.id) ? parseFloat(groupFluctuateAmount.value) : (node.audioParams.volLfoDepth || 0);
          volLfo.connect(volLfoGain);
          volLfoGain.connect(gainNode.gain);
          let oscillator = null;
          let modulatorOsc = null;
          let modulatorGain = null;
          if (node.audioParams.waveform && !node.audioParams.waveform.startsWith("sampler_")) {
              oscillator = audioContext.createOscillator();
              oscillator.type = node.audioParams.waveform;
              if (node.audioParams.waveform === "fmBell" || node.audioParams.waveform === "fmXylo") {
                  oscillator.type = "sine";
                  modulatorOsc = audioContext.createOscillator();
                  modulatorOsc.type = "sine";
                  modulatorGain = audioContext.createGain();
                  modulatorOsc.connect(modulatorGain);
                  modulatorGain.connect(oscillator.frequency);
              }
              oscillator.connect(lowPassFilter);
          }
          lowPassFilter.connect(gainNode);

          if (reverbSendGain) {
              gainNode.connect(reverbSendGain);
          }
          if (delaySendGain) {
              gainNode.connect(delaySendGain);
          }

          try { volLfo.start(startDelay); } catch (e) {}
          if (oscillator) { try { oscillator.start(startDelay); } catch (e) {} }
          if (modulatorOsc) { try { modulatorOsc.start(startDelay); } catch (e) {} }

          return { oscillator, gainNode, lowPassFilter, reverbSendGain, delaySendGain, modulatorOsc, modulatorGain, volLfo, volLfoGain };

      } else if (node.type === "nebula") {
          const gainNode = audioContext.createGain();
          gainNode.gain.value = 0;
          const filterNode = audioContext.createBiquadFilter(); filterNode.type = "lowpass"; filterNode.Q.value = NEBULA_FILTER_Q;
          const baseFreq = node.audioParams.pitch;
          const filterLfo = audioContext.createOscillator(); filterLfo.type = "sine"; filterLfo.frequency.setValueAtTime(NEBULA_FILTER_LFO_RATE, now);
          const filterLfoGain = audioContext.createGain(); filterLfoGain.gain.setValueAtTime(baseFreq * NEBULA_FILTER_LFO_DEPTH_FACTOR * (node.audioParams.lfoDepthFactor || 1), now); filterLfo.connect(filterLfoGain); filterLfoGain.connect(filterNode.frequency);
          const volLfo = audioContext.createOscillator(); volLfo.type = "sine"; volLfo.frequency.setValueAtTime(NEBULA_VOL_LFO_RATE, now);
          const volLfoGain = audioContext.createGain(); volLfoGain.gain.value = NEBULA_VOL_LFO_DEPTH; volLfo.connect(volLfoGain); volLfoGain.connect(gainNode.gain);
          const oscillators = [];
          const baseWaveform = node.audioParams.waveform || "sawtooth"; const waveformType = baseWaveform === "fmBell" || baseWaveform === "fmXylo" ? "sine" : baseWaveform;
          NEBULA_OSC_INTERVALS.forEach((interval, i) => {
              const osc = audioContext.createOscillator(); const freq = baseFreq * Math.pow(2, interval / 12); osc.frequency.setValueAtTime(freq, now); osc.detune.setValueAtTime((i % 2 === 0 ? 1 : -1) * (node.audioParams.detune || NEBULA_OSC_DETUNE) * (i + 1), now); osc.type = waveformType; osc.connect(filterNode); oscillators.push(osc);
          });
          filterNode.connect(gainNode);

          let reverbSendGain = null; if (isReverbReady && reverbNode) { reverbSendGain = audioContext.createGain(); reverbSendGain.gain.value = node.audioParams.reverbSend; gainNode.connect(reverbSendGain); reverbSendGain.connect(reverbNode); }
          let delaySendGain = null; if (isDelayReady && masterDelaySendGain) { delaySendGain = audioContext.createGain(); delaySendGain.gain.value = node.audioParams.delaySend; gainNode.connect(delaySendGain); delaySendGain.connect(masterDelaySendGain); }

          const sizeRange = MAX_NODE_SIZE - MIN_NODE_SIZE; const normalizedSize = (node.size - MIN_NODE_SIZE) / (sizeRange || 1);
          const initialVol = Math.min(NEBULA_MAX_VOL, node.size * NEBULA_VOL_SCALING);
          const initialFilterFreq = baseFreq * 2 + normalizedSize * baseFreq * (node.audioParams.filterFreqFactor || 12);
          filterNode.frequency.setValueAtTime(initialFilterFreq, now);
          gainNode.gain.linearRampToValueAtTime(initialVol, now + 0.5);

          try { filterLfo.start(startDelay); } catch (e) {}
          try { volLfo.start(startDelay); } catch (e) {}
          oscillators.forEach((osc) => { try { osc.start(startDelay); } catch (e) {} });

          // <<< VERBIND ORIGINELE NEBULA NAAR ZIJN EIGEN GROEP >>>
          if (originalNebulaGroupGain) {
              gainNode.connect(originalNebulaGroupGain);
          } else {
              gainNode.connect(masterGain); // Fallback
              console.error("Original Nebula kon niet verbinden met originalNebulaGroupGain!");
          }

          return { gainNode, filterNode, filterLfo, filterLfoGain, volLfo, volLfoGain, oscillators, reverbSendGain, delaySendGain };

      } else if (node.type === PORTAL_NEBULA_TYPE) {
          const params = node.audioParams;
          const defaults = PORTAL_NEBULA_DEFAULTS;

          const mainGain = audioContext.createGain();
          mainGain.gain.setValueAtTime(0, now);
          mainGain.gain.linearRampToValueAtTime(params.volume, now + 1.0);

          const droneOsc = audioContext.createOscillator();
          droneOsc.type = 'triangle';
          droneOsc.frequency.setValueAtTime(params.pitch, now);

          const droneFreqLfo = audioContext.createOscillator();
          droneFreqLfo.type = 'sine';
          droneFreqLfo.frequency.setValueAtTime(0.05 + Math.random() * 0.05, now);
          const droneFreqLfoGain = audioContext.createGain();
          droneFreqLfoGain.gain.setValueAtTime(0.5 + Math.random() * 0.5, now);
          droneFreqLfo.connect(droneFreqLfoGain);
          droneFreqLfoGain.connect(droneOsc.frequency);
          droneOsc.connect(mainGain);

          const harmonics = [];
          const harmonicGain = audioContext.createGain();
          harmonicGain.gain.setValueAtTime(defaults.harmonicBaseGain, now);
          const shimmerLfo = audioContext.createOscillator();
          shimmerLfo.type = 'sine';
          shimmerLfo.frequency.setValueAtTime(defaults.shimmerRate, now);
          const shimmerLfoGain = audioContext.createGain();
          shimmerLfoGain.gain.setValueAtTime(defaults.shimmerDepth, now);
          shimmerLfo.connect(shimmerLfoGain);
          shimmerLfoGain.connect(harmonicGain.gain);

          for (let i = 0; i < defaults.numHarmonics; i++) {
              const harmonicOsc = audioContext.createOscillator();
              harmonicOsc.type = 'sine';
              const freqMultiplier = Math.pow(2, (i + 1) * defaults.harmonicSpread * 0.5 + Math.random() * 0.1);
              harmonicOsc.frequency.setValueAtTime(params.pitch * freqMultiplier, now);
              harmonicOsc.detune.setValueAtTime((Math.random() - 0.5) * 15, now);
              harmonicOsc.connect(harmonicGain);
              harmonics.push(harmonicOsc);
          }
          harmonicGain.connect(mainGain);

          let reverbSendGain = null;
          if (isReverbReady && reverbNode) {
               reverbSendGain = audioContext.createGain();
               reverbSendGain.gain.value = params.reverbSend;
               mainGain.connect(reverbSendGain);
               reverbSendGain.connect(reverbNode);
          }
          let delaySendGain = null;
          if (isDelayReady && masterDelaySendGain) {
               delaySendGain = audioContext.createGain();
               delaySendGain.gain.value = params.delaySend;
               mainGain.connect(delaySendGain);
               delaySendGain.connect(masterDelaySendGain);
          }

          try { droneOsc.start(now); } catch (e) {}
          try { droneFreqLfo.start(now); } catch (e) {}
          try { shimmerLfo.start(now); } catch (e) {}
          harmonics.forEach(osc => { try { osc.start(now); } catch (e) {} });

          // <<< PORTAL BLIJFT NAAR ZIJN EIGEN GROEP GAAN >>>
          if (portalGroupGain) {
              mainGain.connect(portalGroupGain);
          } else {
              mainGain.connect(masterGain);
              console.error("Portal kon niet verbinden met portalGroupGain!");
          }

          return { mainGain, droneOsc, droneFreqLfo, droneFreqLfoGain, harmonics, harmonicGain, shimmerLfo, shimmerLfoGain, reverbSendGain, delaySendGain };

      } else if (isDrumType(node.type)) {
          const mainGain = audioContext.createGain();
          mainGain.gain.value = node.audioParams.volume;
          let reverbSendGain = null;
          if (isReverbReady && reverbNode) {
              reverbSendGain = audioContext.createGain();
              reverbSendGain.gain.value = node.audioParams.reverbSend ?? DEFAULT_REVERB_SEND;
              mainGain.connect(reverbSendGain);
              reverbSendGain.connect(reverbNode);
          }
          let delaySendGain = null;
          if (isDelayReady && masterDelaySendGain) {
              delaySendGain = audioContext.createGain();
              delaySendGain.gain.value = node.audioParams.delaySend ?? DEFAULT_DELAY_SEND;
              mainGain.connect(delaySendGain);
              delaySendGain.connect(masterDelaySendGain);
          }
          return { mainGain, reverbSendGain, delaySendGain };
      }
  } catch (e) {
      console.error(`Error creating audio nodes for node ${node.id} (${node.type}):`, e);
      return null;
  }
  return null;
}

/**
 * Hulpfunctie om te checken of een node ID in een van de geïdentificeerde groepen zit.
 */
function isInAnyIdentifiedGroup(nodeId) {
  return identifiedGroups.some(group => group.nodeIds.has(nodeId));
}

function setSpecificGroupDelaySend(groupId, level) {
  const group = identifiedGroups.find(g => g.id === groupId);
  // Voeg audioContext check toe
  if (!group || !group.gainNode || !audioContext) {
       console.warn(`setSpecificGroupDelaySend: Group ${groupId} or its gainNode not found, or audioContext not ready.`);
       return;
  }

  const newLevel = Math.max(0, Math.min(1.0, parseFloat(level)));
  const now = audioContext.currentTime;
  console.log(`Setting Group ${groupId} Delay Send to: ${newLevel.toFixed(2)}`); // LOG 1

  // Update de delaySend parameter en de gain voor elke node in de groep
  group.nodeIds.forEach(nodeId => {
      const node = findNodeById(nodeId);
      // Pas aan voor nodes die een delaySendGain hebben (sound, drum)
      if (node && node.audioParams && node.audioNodes) {
           // Update de parameter in het node object zelf (voor save/load)
          node.audioParams.delaySend = newLevel;

          // Pas de daadwerkelijke gain node aan (indien aanwezig)
          const delaySendGain = node.audioNodes.delaySendGain;
          if (delaySendGain) {
              console.log(`  - Node ${nodeId}: Updating delaySendGain to ${newLevel.toFixed(2)}`); // LOG 2
              delaySendGain.gain.cancelScheduledValues(now);
              delaySendGain.gain.setTargetAtTime(newLevel, now, 0.01);
          } else {
               console.log(`  - Node ${nodeId}: No delaySendGain found.`); // LOG 3
          }
      }
  });

  // Update de UI (span waarde) in de mixer
  const delayValueSpan = document.getElementById(`mixerGroupDelayValue_${groupId}`);
  if (delayValueSpan) {
      delayValueSpan.textContent = newLevel.toFixed(2);
  }
  // Update de corresponderende slider waarde (redundant door input event, maar voor zekerheid)
  const delaySlider = document.getElementById(`mixerGroupDelaySlider_${groupId}`);
   if (delaySlider) {
        delaySlider.value = newLevel; // Let op: was 'newVol' in oude code, moet 'newLevel' zijn.
   }

  // saveState() wordt aangeroepen door de 'change' event listener op de slider
}

function setSpecificGroupVolume(groupId, volume) {
  const group = identifiedGroups.find(g => g.id === groupId);
  if (!group || !group.gainNode || !audioContext) return;

  const newVol = Math.max(0, Math.min(1.5, parseFloat(volume)));

  // Pas de gain van deze specifieke groep aan
  group.gainNode.gain.setTargetAtTime(newVol, audioContext.currentTime, 0.01);

  // Update alleen de UI elementen in de mixer voor deze groep
  const mixerSlider = document.getElementById(`mixerGroupSlider_${groupId}`);
  const mixerValueSpan = document.getElementById(`mixerGroupValue_${groupId}`);

  if (mixerSlider) {
      mixerSlider.value = newVol;
  }
  if (mixerValueSpan) {
      mixerValueSpan.textContent = newVol.toFixed(2);
  }
  // De oude #groupVolumeSlider wordt hier NIET bijgewerkt.
}

function setSpecificGroupReverbSend(groupId, level) {
  const group = identifiedGroups.find(g => g.id === groupId);
  if (!group || !group.gainNode || !audioContext || !isReverbReady) { // Check ook isReverbReady
       // console.warn(`setSpecificGroupReverbSend: Group ${groupId}, gainNode, audioContext, or Reverb not ready.`);
       return;
  }

  const newLevel = Math.max(0, Math.min(1.0, parseFloat(level)));
  const now = audioContext.currentTime;
  // console.log(`Setting Group ${groupId} Reverb Send to: ${newLevel.toFixed(2)}`);

  group.nodeIds.forEach(nodeId => {
      const node = findNodeById(nodeId);
      // Pas aan voor nodes die een reverbSendGain hebben (sound, drum, nebula)
      if (node && node.audioParams && node.audioNodes) {
          node.audioParams.reverbSend = newLevel; // Update stored value

          const reverbSendGain = node.audioNodes.reverbSendGain; // Pak de reverb send gain
          if (reverbSendGain) {
              // console.log(`  - Node ${nodeId}: Updating reverbSendGain to ${newLevel.toFixed(2)}`);
              reverbSendGain.gain.cancelScheduledValues(now);
              reverbSendGain.gain.setTargetAtTime(newLevel, now, 0.01); // Pas de gain aan
          } else {
              // console.log(`  - Node ${nodeId}: No reverbSendGain found.`);
          }
      }
  });

  // Update de UI span in de mixer
  const reverbValueSpan = document.getElementById(`mixerGroupReverbValue_${groupId}`);
  if (reverbValueSpan) {
      reverbValueSpan.textContent = newLevel.toFixed(2);
  }
  // Update slider waarde (voor consistentie)
  const reverbSlider = document.getElementById(`mixerGroupReverbSlider_${groupId}`);
   if (reverbSlider) {
        reverbSlider.value = newLevel;
   }
}

function updateMixerGUI() {
  if (!mixerGroupControlsContainer || !isAudioReady) {
      mixerGroupControlsContainer.innerHTML = '<small>(Mixer niet klaar...)</small>';
      return;
  }
  mixerGroupControlsContainer.innerHTML = '';
  const fragment = document.createDocumentFragment();
  const now = audioContext ? audioContext.currentTime : 0;
  const timeConstant = 0.01;

  if (portalGroupGain) {
       const portalContainer = document.createElement('div');
       portalContainer.classList.add('mixer-group-control-section');
       portalContainer.style.borderLeft = "3px solid var(--pulsar-triggerable-border, #aaf)"; // Visueel onderscheid

       const portalVolControlDiv = document.createElement('div');
       portalVolControlDiv.classList.add('mixer-control-item');
       const portalVolLabel = document.createElement("label");
       portalVolLabel.htmlFor = "mixerPortalGroupSlider";
       portalVolLabel.textContent = `Portal Volume:`;
       portalVolControlDiv.appendChild(portalVolLabel);
       const portalVolSlider = document.createElement("input");
       portalVolSlider.type = "range"; portalVolSlider.id = "mixerPortalGroupSlider";
       portalVolSlider.min = "0"; portalVolSlider.max = "1.5"; portalVolSlider.step = "0.01";
       try { portalVolSlider.value = portalGroupGain.gain.value.toFixed(2); } catch(e) { portalVolSlider.value = "0.7"; }
       portalVolSlider.title = `Volume for all Portal Drones`;
       portalVolSlider.addEventListener("input", (e) => {
           const newVol = parseFloat(e.target.value);
           if (portalGroupGain && audioContext) {
               portalGroupGain.gain.setTargetAtTime(newVol, audioContext.currentTime, timeConstant);
           }
           const span = document.getElementById("mixerPortalGroupValue");
           if(span) span.textContent = newVol.toFixed(2);
       });
       portalVolSlider.addEventListener("change", saveState);
       portalVolControlDiv.appendChild(portalVolSlider);
       const portalVolValueSpan = document.createElement("span");
       portalVolValueSpan.id = "mixerPortalGroupValue";
       portalVolValueSpan.textContent = portalVolSlider.value;
       portalVolControlDiv.appendChild(portalVolValueSpan);
       portalContainer.appendChild(portalVolControlDiv);

       const portalDelayControlDiv = document.createElement('div');
       portalDelayControlDiv.classList.add('mixer-control-item');
       const portalDelayLabel = document.createElement("label");
       portalDelayLabel.htmlFor = "mixerPortalDelaySlider";
       portalDelayLabel.textContent = `Portal Delay Send:`;
       portalDelayControlDiv.appendChild(portalDelayLabel);
       const portalDelaySlider = document.createElement("input");
       portalDelaySlider.type = "range"; portalDelaySlider.id = "mixerPortalDelaySlider";
       portalDelaySlider.min = "0"; portalDelaySlider.max = "1"; portalDelaySlider.step = "0.01";
       let initialPortalDelay = DEFAULT_DELAY_SEND * 1.2; // Default uit addNode
       const firstPortal = nodes.find(n => n.type === PORTAL_NEBULA_TYPE);
       if (firstPortal && firstPortal.audioParams) initialPortalDelay = firstPortal.audioParams.delaySend;
       portalDelaySlider.value = initialPortalDelay.toFixed(2);
       portalDelaySlider.title = `Delay Send for all Portal Drones`;
       portalDelaySlider.addEventListener("input", (e) => {
           const newSend = parseFloat(e.target.value);
           nodes.forEach(node => {
               if (node.type === PORTAL_NEBULA_TYPE && node.audioNodes?.delaySendGain?.gain) {
                   node.audioParams.delaySend = newSend; // Update parameter voor saveState
                   node.audioNodes.delaySendGain.gain.setTargetAtTime(newSend, now, timeConstant);
               }
           });
           const span = document.getElementById("mixerPortalDelayValue");
           if(span) span.textContent = newSend.toFixed(2);
       });
       portalDelaySlider.addEventListener("change", saveState);
       portalDelayControlDiv.appendChild(portalDelaySlider);
       const portalDelayValueSpan = document.createElement("span");
       portalDelayValueSpan.id = "mixerPortalDelayValue";
       portalDelayValueSpan.textContent = portalDelaySlider.value;
       portalDelayControlDiv.appendChild(portalDelayValueSpan);
       portalContainer.appendChild(portalDelayControlDiv);

       if (isReverbReady) {
          const portalReverbControlDiv = document.createElement('div');
          portalReverbControlDiv.classList.add('mixer-control-item');
          const portalReverbLabel = document.createElement("label");
          portalReverbLabel.htmlFor = "mixerPortalReverbSlider";
          portalReverbLabel.textContent = `Portal Reverb Send:`;
          portalReverbControlDiv.appendChild(portalReverbLabel);
          const portalReverbSlider = document.createElement("input");
          portalReverbSlider.type = "range"; portalReverbSlider.id = "mixerPortalReverbSlider";
          portalReverbSlider.min = "0"; portalReverbSlider.max = "1"; portalReverbSlider.step = "0.01";
          let initialPortalReverb = DEFAULT_REVERB_SEND * 1.5; // Default uit addNode
          if (firstPortal && firstPortal.audioParams) initialPortalReverb = firstPortal.audioParams.reverbSend;
           portalReverbSlider.value = initialPortalReverb.toFixed(2);
          portalReverbSlider.title = `Reverb Send for all Portal Drones`;
          portalReverbSlider.addEventListener("input", (e) => {
              const newSend = parseFloat(e.target.value);
              nodes.forEach(node => {
                  if (node.type === PORTAL_NEBULA_TYPE && node.audioNodes?.reverbSendGain?.gain) {
                      node.audioParams.reverbSend = newSend; // Update parameter voor saveState
                      node.audioNodes.reverbSendGain.gain.setTargetAtTime(newSend, now, timeConstant);
                  }
              });
              const span = document.getElementById("mixerPortalReverbValue");
              if(span) span.textContent = newSend.toFixed(2);
          });
          portalReverbSlider.addEventListener("change", saveState);
          portalReverbControlDiv.appendChild(portalReverbSlider);
          const portalReverbValueSpan = document.createElement("span");
          portalReverbValueSpan.id = "mixerPortalReverbValue";
          portalReverbValueSpan.textContent = portalReverbSlider.value;
          portalReverbControlDiv.appendChild(portalReverbValueSpan);
          portalContainer.appendChild(portalReverbControlDiv);
       }
       fragment.appendChild(portalContainer);
  }

  if (originalNebulaGroupGain) {
       const nebulaContainer = document.createElement('div');
       nebulaContainer.classList.add('mixer-group-control-section');
       nebulaContainer.style.borderLeft = "3px solid var(--nebula-border, #adf)"; // Visueel onderscheid

       const nebulaVolControlDiv = document.createElement('div');
       nebulaVolControlDiv.classList.add('mixer-control-item');
       const nebulaVolLabel = document.createElement("label");
       nebulaVolLabel.htmlFor = "mixerNebulaGroupSlider";
       nebulaVolLabel.textContent = `Nebula Sounds Vol:`;
       nebulaVolControlDiv.appendChild(nebulaVolLabel);
       const nebulaVolSlider = document.createElement("input");
       nebulaVolSlider.type = "range"; nebulaVolSlider.id = "mixerNebulaGroupSlider";
       nebulaVolSlider.min = "0"; nebulaVolSlider.max = "1.5"; nebulaVolSlider.step = "0.01";
       try { nebulaVolSlider.value = originalNebulaGroupGain.gain.value.toFixed(2); } catch(e) { nebulaVolSlider.value = "0.8"; }
       nebulaVolSlider.title = `Volume for all original Nebula sounds`;
       nebulaVolSlider.addEventListener("input", (e) => {
           const newVol = parseFloat(e.target.value);
           if (originalNebulaGroupGain && audioContext) {
               originalNebulaGroupGain.gain.setTargetAtTime(newVol, audioContext.currentTime, timeConstant);
           }
           const span = document.getElementById("mixerNebulaGroupValue");
           if(span) span.textContent = newVol.toFixed(2);
       });
       nebulaVolSlider.addEventListener("change", saveState);
       nebulaVolControlDiv.appendChild(nebulaVolSlider);
       const nebulaVolValueSpan = document.createElement("span");
       nebulaVolValueSpan.id = "mixerNebulaGroupValue";
       nebulaVolValueSpan.textContent = nebulaVolSlider.value;
       nebulaVolControlDiv.appendChild(nebulaVolValueSpan);
       nebulaContainer.appendChild(nebulaVolControlDiv);

       const nebulaDelayControlDiv = document.createElement('div');
       nebulaDelayControlDiv.classList.add('mixer-control-item');
       const nebulaDelayLabel = document.createElement("label");
       nebulaDelayLabel.htmlFor = "mixerNebulaDelaySlider";
       nebulaDelayLabel.textContent = `Nebula Delay Send:`;
       nebulaDelayControlDiv.appendChild(nebulaDelayLabel);
       const nebulaDelaySlider = document.createElement("input");
       nebulaDelaySlider.type = "range"; nebulaDelaySlider.id = "mixerNebulaDelaySlider";
       nebulaDelaySlider.min = "0"; nebulaDelaySlider.max = "1"; nebulaDelaySlider.step = "0.01";
       let initialNebulaDelay = DEFAULT_DELAY_SEND;
       const firstNebula = nodes.find(n => n.type === "nebula");
       if (firstNebula && firstNebula.audioParams) initialNebulaDelay = firstNebula.audioParams.delaySend;
       nebulaDelaySlider.value = initialNebulaDelay.toFixed(2);
       nebulaDelaySlider.title = `Delay Send for all Nebula sounds`;
       nebulaDelaySlider.addEventListener("input", (e) => {
           const newSend = parseFloat(e.target.value);
           nodes.forEach(node => {
               if (node.type === "nebula" && node.audioNodes?.delaySendGain?.gain) {
                   node.audioParams.delaySend = newSend;
                   node.audioNodes.delaySendGain.gain.setTargetAtTime(newSend, now, timeConstant);
               }
           });
           const span = document.getElementById("mixerNebulaDelayValue");
           if(span) span.textContent = newSend.toFixed(2);
       });
       nebulaDelaySlider.addEventListener("change", saveState);
       nebulaDelayControlDiv.appendChild(nebulaDelaySlider);
       const nebulaDelayValueSpan = document.createElement("span");
       nebulaDelayValueSpan.id = "mixerNebulaDelayValue";
       nebulaDelayValueSpan.textContent = nebulaDelaySlider.value;
       nebulaDelayControlDiv.appendChild(nebulaDelayValueSpan);
       nebulaContainer.appendChild(nebulaDelayControlDiv);

       if (isReverbReady) {
          const nebulaReverbControlDiv = document.createElement('div');
          nebulaReverbControlDiv.classList.add('mixer-control-item');
          const nebulaReverbLabel = document.createElement("label");
          nebulaReverbLabel.htmlFor = "mixerNebulaReverbSlider";
          nebulaReverbLabel.textContent = `Nebula Reverb Send:`;
          nebulaReverbControlDiv.appendChild(nebulaReverbLabel);
          const nebulaReverbSlider = document.createElement("input");
          nebulaReverbSlider.type = "range"; nebulaReverbSlider.id = "mixerNebulaReverbSlider";
          nebulaReverbSlider.min = "0"; nebulaReverbSlider.max = "1"; nebulaReverbSlider.step = "0.01";
           let initialNebulaReverb = DEFAULT_REVERB_SEND;
          if (firstNebula && firstNebula.audioParams) initialNebulaReverb = firstNebula.audioParams.reverbSend;
          nebulaReverbSlider.value = initialNebulaReverb.toFixed(2);
          nebulaReverbSlider.title = `Reverb Send for all Nebula sounds`;
          nebulaReverbSlider.addEventListener("input", (e) => {
              const newSend = parseFloat(e.target.value);
              nodes.forEach(node => {
                  if (node.type === "nebula" && node.audioNodes?.reverbSendGain?.gain) {
                      node.audioParams.reverbSend = newSend;
                      node.audioNodes.reverbSendGain.gain.setTargetAtTime(newSend, now, timeConstant);
                  }
              });
              const span = document.getElementById("mixerNebulaReverbValue");
              if(span) span.textContent = newSend.toFixed(2);
          });
          nebulaReverbSlider.addEventListener("change", saveState);
          nebulaReverbControlDiv.appendChild(nebulaReverbSlider);
          const nebulaReverbValueSpan = document.createElement("span");
          nebulaReverbValueSpan.id = "mixerNebulaReverbValue";
          nebulaReverbValueSpan.textContent = nebulaReverbSlider.value;
          nebulaReverbControlDiv.appendChild(nebulaReverbValueSpan);
          nebulaContainer.appendChild(nebulaReverbControlDiv);
       }
       fragment.appendChild(nebulaContainer);
  }

  identifiedGroups.forEach((group, index) => {
       if (!group.gainNode) return;
       const groupContainer = document.createElement('div');
       groupContainer.classList.add('mixer-group-control-section');
       groupContainer.dataset.groupId = group.id;

       const volumeControlDiv = document.createElement('div');
       volumeControlDiv.classList.add('mixer-control-item');
       const volumeLabel = document.createElement("label");
       const volumeSliderId = `mixerGroupSlider_${group.id}`;
       volumeLabel.htmlFor = volumeSliderId;
       volumeLabel.appendChild(document.createTextNode(`Group ${index + 1} (`));
       volumeLabel.appendChild(document.createTextNode(String(group.nodeIds?.size ?? 'N/A')));
       volumeLabel.appendChild(document.createTextNode(` nodes) Vol:`));
       volumeControlDiv.appendChild(volumeLabel);
       const volumeSlider = document.createElement("input");
       volumeSlider.type = "range"; volumeSlider.id = volumeSliderId;
       volumeSlider.min = "0"; volumeSlider.max = "1.5"; volumeSlider.step = "0.01";
       try { volumeSlider.value = group.gainNode.gain.value.toFixed(2); } catch(e) { volumeSlider.value = "1.0"; }
       volumeSlider.title = `Volume for Group ${index + 1}`;
       volumeSlider.addEventListener("input", (e) => { setSpecificGroupVolume(group.id, parseFloat(e.target.value)); });
       volumeSlider.addEventListener("change", saveState);
       volumeControlDiv.appendChild(volumeSlider);
       const volumeValueSpan = document.createElement("span");
       volumeValueSpan.id = `mixerGroupValue_${group.id}`; volumeValueSpan.textContent = volumeSlider.value;
       volumeControlDiv.appendChild(volumeValueSpan);
       groupContainer.appendChild(volumeControlDiv);

       const delayControlDiv = document.createElement('div');
       delayControlDiv.classList.add('mixer-control-item');
       const delayLabel = document.createElement("label");
       const delaySliderId = `mixerGroupDelaySlider_${group.id}`;
       delayLabel.htmlFor = delaySliderId;
       delayLabel.textContent = `Delay Send:`;
       delayControlDiv.appendChild(delayLabel);
       const delaySlider = document.createElement("input");
       delaySlider.type = "range"; delaySlider.id = delaySliderId;
       delaySlider.min = "0"; delaySlider.max = "1"; delaySlider.step = "0.01";
       delaySlider.title = `Delay Send for Group ${index + 1}`;
       let initialDelaySend = DEFAULT_DELAY_SEND;
       if (group.nodeIds.size > 0) {
           const firstNodeId = group.nodeIds.values().next().value;
           const firstNode = findNodeById(firstNodeId);
           if (firstNode && firstNode.audioParams) { initialDelaySend = firstNode.audioParams.delaySend ?? DEFAULT_DELAY_SEND; }
       }
       delaySlider.value = initialDelaySend.toFixed(2);
       delaySlider.addEventListener("input", (e) => { setSpecificGroupDelaySend(group.id, parseFloat(e.target.value)); });
       delaySlider.addEventListener("change", saveState);
       delayControlDiv.appendChild(delaySlider);
       const delayValueSpan = document.createElement("span");
       delayValueSpan.id = `mixerGroupDelayValue_${group.id}`; delayValueSpan.textContent = delaySlider.value;
       delayControlDiv.appendChild(delayValueSpan);
       groupContainer.appendChild(delayControlDiv);

      if (isReverbReady) {
           const reverbControlDiv = document.createElement('div');
           reverbControlDiv.classList.add('mixer-control-item');
           const reverbLabel = document.createElement("label");
           const reverbSliderId = `mixerGroupReverbSlider_${group.id}`;
           reverbLabel.htmlFor = reverbSliderId;
           reverbLabel.textContent = `Reverb Send:`;
           reverbControlDiv.appendChild(reverbLabel);
           const reverbSlider = document.createElement("input");
           reverbSlider.type = "range"; reverbSlider.id = reverbSliderId;
           reverbSlider.min = "0"; reverbSlider.max = "1"; reverbSlider.step = "0.01";
           reverbSlider.title = `Reverb Send for Group ${index + 1}`;
           let initialReverbSend = DEFAULT_REVERB_SEND;
           if (group.nodeIds.size > 0) {
                const firstNodeId = group.nodeIds.values().next().value;
                const firstNode = findNodeById(firstNodeId);
                if (firstNode && firstNode.audioParams) { initialReverbSend = firstNode.audioParams.reverbSend ?? DEFAULT_REVERB_SEND; }
           }
           reverbSlider.value = initialReverbSend.toFixed(2);
           reverbSlider.addEventListener("input", (e) => { setSpecificGroupReverbSend(group.id, parseFloat(e.target.value)); });
           reverbSlider.addEventListener("change", saveState);
           reverbControlDiv.appendChild(reverbSlider);
           const reverbValueSpan = document.createElement("span");
           reverbValueSpan.id = `mixerGroupReverbValue_${group.id}`; reverbValueSpan.textContent = reverbSlider.value;
           reverbControlDiv.appendChild(reverbValueSpan);
           groupContainer.appendChild(reverbControlDiv);
      }
       fragment.appendChild(groupContainer);
  });

  mixerGroupControlsContainer.appendChild(fragment);

  if (mixerGroupControlsContainer.childElementCount === 0) {
      const noGroupMsg = document.createElement('small');
      noGroupMsg.textContent = '(No mixer controls available)';
      mixerGroupControlsContainer.appendChild(noGroupMsg);
  }
  mixerGroupControlsContainer.style.display = 'block';
}

function updateNodeAudioParams(node) {
  if (!node.audioNodes || !isAudioReady) return
  const now = audioContext.currentTime
  const params = node.audioParams
  try {
    if (node.type === "sound") {
      const {
        oscillator,
        lowPassFilter,
        reverbSendGain,
        delaySendGain,
        modulatorOsc,
        modulatorGain,
        volLfoGain
      } = node.audioNodes
      if (!lowPassFilter) return
      if (
        params.waveform &&
        !params.waveform.startsWith("sampler_") &&
        oscillator
      ) {
        oscillator.frequency.setTargetAtTime(params.pitch, now, 0.02)
        oscillator.type =
          params.waveform === "fmBell" || params.waveform === "fmXylo"
            ? "sine"
            : params.waveform
        if (
          (params.waveform === "fmBell" || params.waveform === "fmXylo") &&
          modulatorOsc &&
          modulatorGain
        ) {
          const modRatio = params.waveform === "fmBell" ? 1.4 : 3.5
          const modDepthFactor = params.waveform === "fmBell" ? 4 : 10
          modulatorOsc.frequency.setTargetAtTime(
            params.pitch * modRatio,
            now,
            0.02
          )
          const modDepth =
            params.pitch * modDepthFactor * params.fmModDepthScale
          modulatorGain.gain.setTargetAtTime(modDepth, now, 0.02)
        }
      }
      const sizeRange = MAX_NODE_SIZE - MIN_NODE_SIZE
      const freqRange = MAX_FILTER_FREQ - MIN_FILTER_FREQ
      const normalizedSize = (node.size - MIN_NODE_SIZE) / (sizeRange || 1)
      params.lowPassFreq = MIN_FILTER_FREQ + normalizedSize * freqRange
      lowPassFilter.frequency.setTargetAtTime(params.lowPassFreq, now, 0.02)
      if (isReverbReady && reverbSendGain) {
        reverbSendGain.gain.setTargetAtTime(params.reverbSend, now, 0.02)
      }
      if (isDelayReady && delaySendGain) {
        delaySendGain.gain.setTargetAtTime(params.delaySend, now, 0.02)
      }
      const shouldFluctuate = fluctuatingGroupNodeIDs.has(node.id)
      const fluctuationAmount = parseFloat(groupFluctuateAmount.value)
      const targetLfoDepth = shouldFluctuate
        ? fluctuationAmount
        : params.volLfoDepth || 0
      if (volLfoGain) {
        volLfoGain.gain.setTargetAtTime(targetLfoDepth, now, 0.1)
      }
    } else if (node.type === "nebula") {
      const {
        gainNode,
        filterNode,
        filterLfoGain,
        volLfoGain,
        oscillators
      } = node.audioNodes;
      if (!gainNode || !filterNode || !oscillators) return;
    
      const sizeRange = MAX_NODE_SIZE - MIN_NODE_SIZE;
      const normalizedSize = (node.size - MIN_NODE_SIZE) / (sizeRange || 1);
    
      const targetVol = Math.min(NEBULA_MAX_VOL, node.size * NEBULA_VOL_SCALING * 1.5);
      gainNode.gain.setTargetAtTime(targetVol, now, 0.1);
    
      const baseFreq = params.pitch;
      const filterFreq = baseFreq * 2 + normalizedSize * baseFreq * 12;
      filterNode.frequency.setTargetAtTime(filterFreq, now, 0.1);
    
      if (filterLfoGain) {
        const lfoDepth = baseFreq * NEBULA_FILTER_LFO_DEPTH_FACTOR * (node.audioParams.lfoDepthFactor || 1);
        filterLfoGain.gain.setTargetAtTime(lfoDepth, now, 0.1);
      }
    
      if (volLfoGain) {
        volLfoGain.gain.setTargetAtTime(NEBULA_VOL_LFO_DEPTH, now, 0.1);
      }
    
      oscillators.forEach((osc, i) => {
        const interval = NEBULA_OSC_INTERVALS[i];
        const freq = baseFreq * Math.pow(2, interval / 12);
        osc.frequency.setTargetAtTime(freq, now, 0.1);
    
        const detuneAmount = node.audioParams.detune || NEBULA_OSC_DETUNE || 7;
        osc.detune.setTargetAtTime((i % 2 === 0 ? 1 : -1) * detuneAmount * (i + 1), now, 0.1);
    
        const desiredWaveform =
          node.audioParams.waveform === "fmBell" || node.audioParams.waveform === "fmXylo"
            ? "sine"
            : node.audioParams.waveform || "sawtooth";
        if (osc.type !== desiredWaveform) {
          osc.type = desiredWaveform;
        }
      })
    
    } else if (isDrumType(node.type)) {
      const { mainGain, reverbSendGain, delaySendGain } = node.audioNodes
      if (mainGain) mainGain.gain.setTargetAtTime(params.volume, now, 0.01)
      if (isReverbReady && reverbSendGain) {
        reverbSendGain.gain.setTargetAtTime(params.reverbSend, now, 0.02)
      }
      if (isDelayReady && delaySendGain) {
        delaySendGain.gain.setTargetAtTime(params.delaySend, now, 0.02)
      }
    }
  } catch (e) {}
}
function updateConnectionAudioParams(connection) {
  if (
    !connection.audioNodes ||
    connection.type !== "string_violin" ||
    !isAudioReady
  )
    return
  const now = audioContext.currentTime
  const params = connection.audioParams
  try {
    const {
      gainNode,
      filterNode,
      reverbSendGain,
      delaySendGain,
      oscillators,
      vibratoLfo,
      vibratoGain
    } = connection.audioNodes
    if (!gainNode || !filterNode || !oscillators || !vibratoLfo || !vibratoGain)
      return
    oscillators.forEach((osc, i) => {
      const freq = params.pitch
      const detuneAmount =
        i === 0
          ? 0
          : (i % 2 === 1 ? 1 : -1) *
            Math.ceil(i / 2) *
            (params.detune ?? STRING_VIOLIN_DEFAULTS.detune)
      osc.frequency.setTargetAtTime(freq, now, 0.02)
      osc.detune.setTargetAtTime(detuneAmount, now, 0.02)
    })
    filterNode.frequency.setTargetAtTime(
      params.pitch *
        (params.filterFreqFactor ?? STRING_VIOLIN_DEFAULTS.filterFreqFactor),
      now,
      0.02
    )
    filterNode.Q.setTargetAtTime(
      params.filterQ ?? STRING_VIOLIN_DEFAULTS.filterQ,
      now,
      0.02
    )
    vibratoLfo.frequency.setTargetAtTime(
      params.vibratoRate ?? STRING_VIOLIN_DEFAULTS.vibratoRate,
      now,
      0.02
    )
    vibratoGain.gain.setTargetAtTime(
      params.vibratoDepth ?? STRING_VIOLIN_DEFAULTS.vibratoDepth,
      now,
      0.02
    )
    if (isReverbReady && reverbSendGain) {
      reverbSendGain.gain.setTargetAtTime(
        params.reverbSend ?? DEFAULT_REVERB_SEND,
        now,
        0.02
      )
    }
    if (isDelayReady && delaySendGain) {
      delaySendGain.gain.setTargetAtTime(
        params.delaySend ?? DEFAULT_DELAY_SEND,
        now,
        0.02
      )
    }
  } catch (e) {}
}
function createAudioNodesForNode(node) {
  if (!audioContext || (!["sound", "nebula", PORTAL_NEBULA_TYPE].includes(node.type) && !isDrumType(node.type))) {
      return null;
  }
  const now = audioContext.currentTime;
  const startDelay = now + 0.02;
  try {
      if (node.type === "sound") {
          const gainNode = audioContext.createGain();
          gainNode.gain.setValueAtTime(0, now);
          const lowPassFilter = audioContext.createBiquadFilter();
          lowPassFilter.type = "lowpass";
          lowPassFilter.Q.value = 1.2;
          let reverbSendGain = null;
          if (isReverbReady && reverbNode) {
              reverbSendGain = audioContext.createGain();
              reverbSendGain.gain.value = node.audioParams.reverbSend;
              reverbSendGain.connect(reverbNode);
          }
          let delaySendGain = null;
          if (isDelayReady && masterDelaySendGain) {
              delaySendGain = audioContext.createGain();
              delaySendGain.gain.value = node.audioParams.delaySend;
              delaySendGain.connect(masterDelaySendGain);
          }
          const volLfo = audioContext.createOscillator();
          volLfo.type = "sine";
          volLfo.frequency.setValueAtTime(node.audioParams.volLfoRate, now);
          const volLfoGain = audioContext.createGain();
          volLfoGain.gain.value = fluctuatingGroupNodeIDs.has(node.id) ? parseFloat(groupFluctuateAmount.value) : (node.audioParams.volLfoDepth || 0);
          volLfo.connect(volLfoGain);
          volLfoGain.connect(gainNode.gain);
          let oscillator = null;
          let modulatorOsc = null;
          let modulatorGain = null;
          if (node.audioParams.waveform && !node.audioParams.waveform.startsWith("sampler_")) {
              oscillator = audioContext.createOscillator();
              oscillator.type = node.audioParams.waveform;
              if (node.audioParams.waveform === "fmBell" || node.audioParams.waveform === "fmXylo") {
                  oscillator.type = "sine";
                  modulatorOsc = audioContext.createOscillator();
                  modulatorOsc.type = "sine";
                  modulatorGain = audioContext.createGain();
                  modulatorOsc.connect(modulatorGain);
                  modulatorGain.connect(oscillator.frequency);
              }
              oscillator.connect(lowPassFilter);
          }
          lowPassFilter.connect(gainNode);

          if (reverbSendGain) {
              gainNode.connect(reverbSendGain);
          }
          if (delaySendGain) {
              gainNode.connect(delaySendGain);
          }

          try { volLfo.start(startDelay); } catch (e) {}
          if (oscillator) { try { oscillator.start(startDelay); } catch (e) {} }
          if (modulatorOsc) { try { modulatorOsc.start(startDelay); } catch (e) {} }

          return { oscillator, gainNode, lowPassFilter, reverbSendGain, delaySendGain, modulatorOsc, modulatorGain, volLfo, volLfoGain };

      } else if (node.type === "nebula") {
          const gainNode = audioContext.createGain();
          gainNode.gain.value = 0;
          const filterNode = audioContext.createBiquadFilter(); filterNode.type = "lowpass"; filterNode.Q.value = NEBULA_FILTER_Q;
          const baseFreq = node.audioParams.pitch;
          const filterLfo = audioContext.createOscillator(); filterLfo.type = "sine"; filterLfo.frequency.setValueAtTime(NEBULA_FILTER_LFO_RATE, now);
          const filterLfoGain = audioContext.createGain(); filterLfoGain.gain.setValueAtTime(baseFreq * NEBULA_FILTER_LFO_DEPTH_FACTOR * (node.audioParams.lfoDepthFactor || 1), now); filterLfo.connect(filterLfoGain); filterLfoGain.connect(filterNode.frequency);
          const volLfo = audioContext.createOscillator(); volLfo.type = "sine"; volLfo.frequency.setValueAtTime(NEBULA_VOL_LFO_RATE, now);
          const volLfoGain = audioContext.createGain(); volLfoGain.gain.value = NEBULA_VOL_LFO_DEPTH; volLfo.connect(volLfoGain); volLfoGain.connect(gainNode.gain);
          const oscillators = [];
          const baseWaveform = node.audioParams.waveform || "sawtooth"; const waveformType = baseWaveform === "fmBell" || baseWaveform === "fmXylo" ? "sine" : baseWaveform;
          NEBULA_OSC_INTERVALS.forEach((interval, i) => {
              const osc = audioContext.createOscillator(); const freq = baseFreq * Math.pow(2, interval / 12); osc.frequency.setValueAtTime(freq, now); osc.detune.setValueAtTime((i % 2 === 0 ? 1 : -1) * (node.audioParams.detune || NEBULA_OSC_DETUNE) * (i + 1), now); osc.type = waveformType; osc.connect(filterNode); oscillators.push(osc);
          });
          filterNode.connect(gainNode);

          let reverbSendGain = null; if (isReverbReady && reverbNode) { reverbSendGain = audioContext.createGain(); reverbSendGain.gain.value = node.audioParams.reverbSend; gainNode.connect(reverbSendGain); reverbSendGain.connect(reverbNode); }
          let delaySendGain = null; if (isDelayReady && masterDelaySendGain) { delaySendGain = audioContext.createGain(); delaySendGain.gain.value = node.audioParams.delaySend; gainNode.connect(delaySendGain); delaySendGain.connect(masterDelaySendGain); }

          const sizeRange = MAX_NODE_SIZE - MIN_NODE_SIZE; const normalizedSize = (node.size - MIN_NODE_SIZE) / (sizeRange || 1);
          const initialVol = Math.min(NEBULA_MAX_VOL, node.size * NEBULA_VOL_SCALING);
          const initialFilterFreq = baseFreq * 2 + normalizedSize * baseFreq * (node.audioParams.filterFreqFactor || 12);
          filterNode.frequency.setValueAtTime(initialFilterFreq, now);
          gainNode.gain.linearRampToValueAtTime(initialVol, now + 0.5);

          try { filterLfo.start(startDelay); } catch (e) {}
          try { volLfo.start(startDelay); } catch (e) {}
          oscillators.forEach((osc) => { try { osc.start(startDelay); } catch (e) {} });

          if (originalNebulaGroupGain) {
              console.log(`DEBUG createAudioNodes: Nebula ${node.id} verbinden met originalNebulaGroupGain.`);
              gainNode.connect(originalNebulaGroupGain);
          } else {
              console.error(`FOUT: originalNebulaGroupGain niet gevonden voor Nebula ${node.id}! Verbind met master als fallback.`);
              gainNode.connect(masterGain);
          }

          return { gainNode, filterNode, filterLfo, filterLfoGain, volLfo, volLfoGain, oscillators, reverbSendGain, delaySendGain };

      } else if (node.type === PORTAL_NEBULA_TYPE) {
          const params = node.audioParams;
          const defaults = PORTAL_NEBULA_DEFAULTS;

          const mainGain = audioContext.createGain();
          mainGain.gain.setValueAtTime(0, now);
          mainGain.gain.linearRampToValueAtTime(params.volume, now + 1.0);

          const droneOsc = audioContext.createOscillator();
          droneOsc.type = 'triangle';
          droneOsc.frequency.setValueAtTime(params.pitch, now);

          const droneFreqLfo = audioContext.createOscillator();
          droneFreqLfo.type = 'sine';
          droneFreqLfo.frequency.setValueAtTime(0.05 + Math.random() * 0.05, now);
          const droneFreqLfoGain = audioContext.createGain();
          droneFreqLfoGain.gain.setValueAtTime(0.5 + Math.random() * 0.5, now);
          droneFreqLfo.connect(droneFreqLfoGain);
          droneFreqLfoGain.connect(droneOsc.frequency);
          droneOsc.connect(mainGain);

          const harmonics = [];
          const harmonicGain = audioContext.createGain();
          harmonicGain.gain.setValueAtTime(defaults.harmonicBaseGain, now);
          const shimmerLfo = audioContext.createOscillator();
          shimmerLfo.type = 'sine';
          shimmerLfo.frequency.setValueAtTime(defaults.shimmerRate, now);
          const shimmerLfoGain = audioContext.createGain();
          shimmerLfoGain.gain.setValueAtTime(defaults.shimmerDepth, now);
          shimmerLfo.connect(shimmerLfoGain);
          shimmerLfoGain.connect(harmonicGain.gain);

          for (let i = 0; i < defaults.numHarmonics; i++) {
              const harmonicOsc = audioContext.createOscillator();
              harmonicOsc.type = 'sine';
              const freqMultiplier = Math.pow(2, (i + 1) * defaults.harmonicSpread * 0.5 + Math.random() * 0.1);
              harmonicOsc.frequency.setValueAtTime(params.pitch * freqMultiplier, now);
              harmonicOsc.detune.setValueAtTime((Math.random() - 0.5) * 15, now);
              harmonicOsc.connect(harmonicGain);
              harmonics.push(harmonicOsc);
          }
          harmonicGain.connect(mainGain);

          let reverbSendGain = null;
          if (isReverbReady && reverbNode) {
               reverbSendGain = audioContext.createGain();
               reverbSendGain.gain.value = params.reverbSend;
               mainGain.connect(reverbSendGain);
               reverbSendGain.connect(reverbNode);
          }
          let delaySendGain = null;
          if (isDelayReady && masterDelaySendGain) {
               delaySendGain = audioContext.createGain();
               delaySendGain.gain.value = params.delaySend;
               mainGain.connect(delaySendGain);
               delaySendGain.connect(masterDelaySendGain);
          }

          try { droneOsc.start(now); } catch (e) {}
          try { droneFreqLfo.start(now); } catch (e) {}
          try { shimmerLfo.start(now); } catch (e) {}
          harmonics.forEach(osc => { try { osc.start(now); } catch (e) {} });

          if (portalGroupGain) {
              console.log(`DEBUG createAudioNodes: Portal ${node.id} verbinden met portalGroupGain.`);
              mainGain.connect(portalGroupGain);
          } else {
              console.error(`FOUT: portalGroupGain niet gevonden voor Portal ${node.id}! Verbind met master als fallback.`);
              mainGain.connect(masterGain);
          }

          return { mainGain, droneOsc, droneFreqLfo, droneFreqLfoGain, harmonics, harmonicGain, shimmerLfo, shimmerLfoGain, reverbSendGain, delaySendGain };

      } else if (isDrumType(node.type)) {
          const mainGain = audioContext.createGain();
          mainGain.gain.value = node.audioParams.volume;
          let reverbSendGain = null;
          if (isReverbReady && reverbNode) {
              reverbSendGain = audioContext.createGain();
              reverbSendGain.gain.value = node.audioParams.reverbSend ?? DEFAULT_REVERB_SEND;
              mainGain.connect(reverbSendGain);
              reverbSendGain.connect(reverbNode);
          }
          let delaySendGain = null;
          if (isDelayReady && masterDelaySendGain) {
              delaySendGain = audioContext.createGain();
              delaySendGain.gain.value = node.audioParams.delaySend ?? DEFAULT_DELAY_SEND;
              mainGain.connect(delaySendGain);
              delaySendGain.connect(masterDelaySendGain);
          }
          return { mainGain, reverbSendGain, delaySendGain };
      }
  } catch (e) {
      console.error(`Error creating audio nodes for node ${node.id} (${node.type}):`, e);
      return null;
  }
  return null;
}
function createAudioNodesForConnection(connection) {
  if (!audioContext || connection.type !== "string_violin") return null;
  const now = audioContext.currentTime;
  const startDelay = now + 0.02;
  try {
      const params = connection.audioParams;
      const gainNode = audioContext.createGain(); // Hoofd output van de string
      gainNode.gain.value = 0;
      const filterNode = audioContext.createBiquadFilter();
      filterNode.type = "lowpass";
      filterNode.frequency.value = params.pitch * (params.filterFreqFactor ?? STRING_VIOLIN_DEFAULTS.filterFreqFactor);
      filterNode.Q.value = params.filterQ ?? STRING_VIOLIN_DEFAULTS.filterQ;
      const vibratoLfo = audioContext.createOscillator();
      vibratoLfo.type = "sine";
      vibratoLfo.frequency.value = params.vibratoRate ?? STRING_VIOLIN_DEFAULTS.vibratoRate;
      const vibratoGain = audioContext.createGain();
      vibratoGain.gain.value = params.vibratoDepth ?? STRING_VIOLIN_DEFAULTS.vibratoDepth;
      vibratoLfo.connect(vibratoGain);
      const oscillators = [];
      const numOsc = params.numOsc ?? STRING_VIOLIN_DEFAULTS.numOsc;
      for (let i = 0; i < numOsc; i++) {
          const osc = audioContext.createOscillator();
          osc.type = "sawtooth";
          const freq = params.pitch;
          const detuneAmount = i === 0 ? 0 : ((i % 2 === 1 ? 1 : -1) * Math.ceil(i / 2) * (params.detune ?? STRING_VIOLIN_DEFAULTS.detune));
          osc.frequency.value = freq;
          osc.detune.value = detuneAmount;
          vibratoGain.connect(osc.detune);
          osc.connect(filterNode);
          oscillators.push(osc);
      }
      filterNode.connect(gainNode); // Oscillators -> Filter -> Hoofd Gain

      // Maak de send nodes, maar verbind ze nog NIET met master effects
      let reverbSendGain = null;
      if (isReverbReady && reverbNode) {
          reverbSendGain = audioContext.createGain();
          reverbSendGain.gain.value = params.reverbSend ?? DEFAULT_REVERB_SEND;
          // gainNode.connect(reverbSendGain); // NIET HIER VERBINDEN
          // reverbSendGain.connect(reverbNode); // NIET HIER VERBINDEN
      }
      let delaySendGain = null;
      if (isDelayReady && masterDelaySendGain) {
          delaySendGain = audioContext.createGain();
          delaySendGain.gain.value = params.delaySend ?? DEFAULT_DELAY_SEND;
          // gainNode.connect(delaySendGain); // NIET HIER VERBINDEN
          // delaySendGain.connect(masterDelaySendGain); // NIET HIER VERBINDEN
      }

      try { vibratoLfo.start(startDelay); } catch (e) {}
      oscillators.forEach((osc) => { try { osc.start(startDelay); } catch (e) {} });

      // Geef ook de losse send gains mee terug
      return { gainNode, filterNode, oscillators, vibratoLfo, vibratoGain, reverbSendGain, delaySendGain };
  } catch (e) {
      console.error(`Error creating audio nodes for connection ${connection.id}:`, e);
      return null;
  }
}
function triggerNodeEffect(node, pulseData = {}, startFrequency = null, glideDuration = 0.3) {
  // 'startFrequency' en 'glideDuration' zijn nu alleen relevant voor de aparte 'startTravelingGlideSound'
  // We geven ze hier niet meer direct door aan de core audio node creatie.

  if (!isAudioReady || !node) return;
  const now = audioContext.currentTime;
  const params = node.audioParams;
  const intensity = pulseData.intensity ?? 1.0; // Gebruik intensiteit van puls data

  if (node.type === 'sound') {
      if (!node.audioNodes?.gainNode) return; // Check of audio nodes bestaan
      node.isTriggered = true; // Markeer als actief getriggered
      node.animationState = 1; // Start visuele animatie (oplichten)
      const { gainNode, lowPassFilter, oscillator, modulatorGain } = node.audioNodes; // Haal relevante nodes op
      if (!gainNode || !lowPassFilter) {
           node.isTriggered = false; node.animationState = 0; return; // Stop als basis nodes missen
      }

      const baseVolume = 0.6; // Standaard volume
      const targetVolume = baseVolume * intensity; // Schaal met puls intensiteit
      const clampedVolume = Math.max(0.01, Math.min(1.0, targetVolume)); // Volume binnen 0.01-1.0
      let releaseTime = 0.3 + (node.size * 0.2); // Release tijd afhankelijk van grootte

      try {
          // Volume envelope (attack/decay/sustain/release)
          gainNode.gain.cancelScheduledValues(now); // Annuleer vorige volume ramps
          gainNode.gain.setValueAtTime(0, now); // Start op 0 volume
          gainNode.gain.linearRampToValueAtTime(clampedVolume, now + 0.015); // Snelle attack naar target volume

          // Pas release tijd aan voor specifieke waveforms
          if (params.waveform === 'fmBell') releaseTime = 0.8 + (node.size * 0.4);
          else if (params.waveform === 'fmXylo') releaseTime = 0.5 + (node.size * 0.2);
          else if (params.waveform && params.waveform.startsWith('sampler_')) {
              releaseTime = 0.6 + (node.size * 0.3); // Gebruik deze release voor samplers
          }
          // Plan de release (fade out)
          gainNode.gain.setTargetAtTime(0, now + 0.015, releaseTime / 4); // Start release na attack, exponentiele curve
          const soundEndTime = now + 0.015 + releaseTime * 1.1; // Tijdstip wanneer geluid ongeveer stil is

          // Pitch / Sample Playback Logic
          if (params.waveform && params.waveform.startsWith('sampler_')) {
               // --- NIEUWE Sampler Logic (gebruikt SAMPLER_DEFINITIONS) ---
              const samplerId = params.waveform.replace('sampler_', ''); // Haal ID uit type string (bv. "piano")
              // Zoek de definitie op in de globale array (uit samplers.js)
              const definition = (typeof SAMPLER_DEFINITIONS !== 'undefined')
                  ? SAMPLER_DEFINITIONS.find(s => s.id === samplerId)
                  : null;

              if (definition && definition.isLoaded && definition.buffer) {
                  const bufferToPlay = definition.buffer;
                  const baseFreq = definition.baseFreq; // Haal uit definitie

                  if (!bufferToPlay || !(baseFreq > 0)) { // Extra check
                       console.error(`Ongeldige buffer of baseFreq voor sampler ${samplerId}`);
                       node.isTriggered = false; node.animationState = 0; return;
                  }

                  const source = audioContext.createBufferSource();
                  source.buffer = bufferToPlay;
                  
                  const targetFreq = params.pitch;
                  let targetRate = 1;
                  
                  if (!isNaN(targetFreq) && targetFreq > 0) {
                      targetRate = Math.max(0.1, Math.min(4, targetFreq / baseFreq));
                  }
                  source.playbackRate.setValueAtTime(targetRate, now);
                  
                  // 🎚 Dynamisch volume en filtering zoals bij soundstars
                  const sizeRange = MAX_NODE_SIZE - MIN_NODE_SIZE;
                  const freqRange = MAX_FILTER_FREQ - MIN_FILTER_FREQ;
                  const normalizedSize = (node.size - MIN_NODE_SIZE) / (sizeRange || 1);
                  const cutoffFreq = MIN_FILTER_FREQ + normalizedSize * freqRange;
                  const vol = 1.0 * intensity;
                  
                  // 🔊 Gain + filter chain per trigger
                  const triggerGain = audioContext.createGain();
                  triggerGain.gain.value = vol;
                  
                  const triggerFilter = audioContext.createBiquadFilter();
                  triggerFilter.type = "lowpass";
                  triggerFilter.Q.value = 1.2;
                  triggerFilter.frequency.setValueAtTime(cutoffFreq, now);
                  
                  // Connect chain
                  source.connect(triggerFilter);
                  triggerFilter.connect(triggerGain);
                  triggerGain.connect(lowPassFilter); // Gebruik bestaande node-filter als output-stage
                  
                  source.start(now);
                  

                  source.onended = () => {
                       // Optioneel: reset node trigger state hier als nodig
                       // const stillNode = findNodeById(node.id);
                       // if (stillNode) stillNode.isTriggered = false;
                  };

              } else {
                  // Kon definitie niet vinden, of sample was niet geladen
                  console.warn(`Sampler ${params.waveform} not found, not loaded, or buffer missing.`);
                  gainNode.gain.cancelScheduledValues(now); gainNode.gain.setValueAtTime(0, now);
                  node.isTriggered = false; node.animationState = 0; return;
              }
              // --- EINDE NIEUWE Sampler Logic ---

          } else if (oscillator) {
              // --- Oscillator Logic ---
              const targetFreq = params.pitch; // Eigen pitch van de node

              // Zet frequentie direct (of gebruik setTarget voor soepeler gevoel?)
              oscillator.frequency.cancelScheduledValues(now); // Annuleer vorige pitch ramps
              oscillator.frequency.setTargetAtTime(targetFreq, now, 0.005); // Kleine smoothing

               // FM logic (blijft hetzelfde)
               if ((params.waveform === 'fmBell' || params.waveform === 'fmXylo') && modulatorGain) {
                   const modDepth = params.pitch * ((params.waveform === 'fmBell') ? 4 : 10) * params.fmModDepthScale;
                   modulatorGain.gain.cancelScheduledValues(now);
                   modulatorGain.gain.setValueAtTime(0, now);
                   modulatorGain.gain.linearRampToValueAtTime(modDepth * 1.8, now + 0.01);
                   modulatorGain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
               }
          }

          // Timeout om trigger state te resetten (geldt voor oscillators en samplers)
           setTimeout(() => {
               const stillNode = findNodeById(node.id);
               // Reset alleen als het NIET een sampler is (die stopt via onended)
               // Of reset altijd, afhankelijk van gewenst gedrag
               if (stillNode && !(params.waveform && params.waveform.startsWith('sampler_'))) {
                    stillNode.isTriggered = false;
               } else if (stillNode) {
                   // Voor samplers, misschien alleen animatie resetten?
                   // stillNode.isTriggered = false; // Kan conflicteren met onended
               }
           }, (soundEndTime - now) * 1000);

      } catch (e) { // Error handling
          node.isTriggered = false; node.animationState = 0;
          console.error("Error in triggerNodeEffect (sound):", e);
      }
      // Particle effect (blijft hetzelfde)
      const particleCount = Math.round(5 + Math.floor(node.size * 3) * (pulseData.particleMultiplier ?? 1.0));
      createParticles(node.x, node.y, particleCount);

  } else if (isDrumType(node.type)) {
      // --- Drum Logic ---
      // (Deze logica is grotendeels ongewijzigd gebleven, gebruikt geen aparte sampler defs)
      if (!node.audioNodes?.mainGain) return;
      node.isTriggered = true; node.animationState = 1;
      const soundParams = node.audioParams; const mainGain = node.audioNodes.mainGain;
      const finalVol = soundParams.volume * intensity;
      const targetFreq = soundParams.baseFreq; // Gebruikt eigen baseFreq

      try {
          // Drum sound creatie (Kick, Snare, Hat, etc.)
           if (node.type === 'drum_kick') {
              const osc = audioContext.createOscillator(); const gain = audioContext.createGain();
              const kickStartFreq = targetFreq * 2.5;
              osc.frequency.setValueAtTime(kickStartFreq, now);
              osc.frequency.exponentialRampToValueAtTime(targetFreq, now + 0.05);
              gain.gain.setValueAtTime(finalVol, now); gain.gain.exponentialRampToValueAtTime(0.001, now + soundParams.decay);
              osc.connect(gain); gain.connect(mainGain); osc.start(now); osc.stop(now + soundParams.decay + 0.05);
            } else if (node.type === "drum_snare") {
              const noiseDur = soundParams.noiseDecay ?? 0.15;
              const bodyDecay = soundParams.decay ?? 0.2;
              const noise = audioContext.createBufferSource();
              const noiseBuffer = audioContext.createBuffer(1, audioContext.sampleRate * noiseDur, audioContext.sampleRate);
              const output = noiseBuffer.getChannelData(0);
              for (let i = 0; i < output.length; i++) { output[i] = Math.random() * 2 - 1; }
              noise.buffer = noiseBuffer;
              const noiseFilter = audioContext.createBiquadFilter(); noiseFilter.type = 'highpass'; noiseFilter.frequency.value = 1500;
              const noiseGain = audioContext.createGain(); noiseGain.gain.setValueAtTime(finalVol * 0.8, now); noiseGain.gain.exponentialRampToValueAtTime(0.001, now + noiseDur);
              noise.connect(noiseFilter); noiseFilter.connect(noiseGain); noiseGain.connect(mainGain); noise.start(now); noise.stop(now + noiseDur + 0.01);
              const osc = audioContext.createOscillator(); const gain = audioContext.createGain();
              osc.type = 'triangle'; osc.frequency.setValueAtTime(soundParams.baseFreq, now);
              gain.gain.setValueAtTime(finalVol * 0.7, now); gain.gain.exponentialRampToValueAtTime(0.01, now + bodyDecay);
              osc.connect(gain); gain.connect(mainGain); osc.start(now); osc.stop(now + bodyDecay + 0.01);
          } else if (node.type === 'drum_hihat') {
               const decay = soundParams.decay ?? 0.05; const noise = audioContext.createBufferSource(); const noiseBuffer = audioContext.createBuffer(1, audioContext.sampleRate * decay, audioContext.sampleRate); const output = noiseBuffer.getChannelData(0); for (let i = 0; i < output.length; i++) { output[i] = Math.random() * 2 - 1; } noise.buffer = noiseBuffer; const noiseFilter = audioContext.createBiquadFilter(); noiseFilter.type = 'highpass'; noiseFilter.frequency.value = soundParams.baseFreq; const noiseGain = audioContext.createGain(); noiseGain.gain.setValueAtTime(finalVol, now); noiseGain.gain.exponentialRampToValueAtTime(0.001, now + decay); noise.connect(noiseFilter); noiseFilter.connect(noiseGain); noiseGain.connect(mainGain); noise.start(now); noise.stop(now + decay + 0.01);
          } else if (node.type === 'drum_clap') {
               const decay = soundParams.noiseDecay ?? 0.1; const noise = audioContext.createBufferSource(); const noiseBuffer = audioContext.createBuffer(1, audioContext.sampleRate * decay * 1.5, audioContext.sampleRate); const output = noiseBuffer.getChannelData(0); for (let i = 0; i < output.length; i++) { output[i] = Math.random() * 2 - 1; } noise.buffer = noiseBuffer; const noiseFilter = audioContext.createBiquadFilter(); noiseFilter.type = 'bandpass'; noiseFilter.frequency.value = soundParams.baseFreq ?? 1500; noiseFilter.Q.value = 1.5; const noiseGain = audioContext.createGain(); noiseGain.gain.setValueAtTime(0, now); noiseGain.gain.linearRampToValueAtTime(finalVol, now + 0.002); noiseGain.gain.setValueAtTime(finalVol, now + 0.002); noiseGain.gain.linearRampToValueAtTime(finalVol * 0.7, now + 0.01); noiseGain.gain.setValueAtTime(finalVol * 0.7, now + 0.01); noiseGain.gain.linearRampToValueAtTime(finalVol * 0.9, now + 0.015); noiseGain.gain.setValueAtTime(finalVol * 0.9, now + 0.015); noiseGain.gain.exponentialRampToValueAtTime(0.001, now + decay); noise.connect(noiseFilter); noiseFilter.connect(noiseGain); noiseGain.connect(mainGain); noise.start(now); noise.stop(now + decay + 0.05);
          } else if (node.type === 'drum_tom1' || node.type === 'drum_tom2') {
              const decay = soundParams.decay ?? (node.type === 'drum_tom1' ? 0.4 : 0.5);
              const osc = audioContext.createOscillator(); const gain = audioContext.createGain();
              osc.type = 'sine';
              const tomStartFreq = targetFreq * 1.8;
              osc.frequency.setValueAtTime(tomStartFreq, now);
              osc.frequency.exponentialRampToValueAtTime(targetFreq, now + 0.08);
              gain.gain.setValueAtTime(finalVol, now); gain.gain.exponentialRampToValueAtTime(0.001, now + decay);
              osc.connect(gain); gain.connect(mainGain); osc.start(now); osc.stop(now + decay + 0.01);
          } else if (node.type === 'drum_cowbell') {
               const decay = soundParams.decay ?? 0.3; const osc1 = audioContext.createOscillator(); const osc2 = audioContext.createOscillator(); const gain = audioContext.createGain(); osc1.type = 'square'; osc2.type = 'square'; osc1.frequency.value = soundParams.baseFreq; osc2.frequency.value = soundParams.baseFreq * 1.5; gain.gain.setValueAtTime(finalVol * 0.6, now); gain.gain.exponentialRampToValueAtTime(0.001, now + decay); osc1.connect(gain); osc2.connect(gain); gain.connect(mainGain); osc1.start(now); osc1.stop(now + decay); osc2.start(now); osc2.stop(now + decay);
          }
      } catch(e) { // Error handling
           node.isTriggered = false; node.animationState = 0;
           console.error(`Error in triggerNodeEffect (${node.type}):`, e);
      }
      // Reset trigger state na korte tijd
      setTimeout(() => {
          const stillNode = findNodeById(node.id);
          if (stillNode) stillNode.isTriggered = false;
      }, 150);
      // Particle effect
      createParticles(node.x, node.y, 3);
  }
}
// Voeg 'incomingConnection' toe als parameter
function propagateTrigger(targetNode, incomingDelay, pulseId, sourceNodeId = -1, hopsRemaining = Infinity, incomingPulse = { type: 'trigger', data: {} }, incomingConnection = null) {
  if (!targetNode || targetNode.id === sourceNodeId) {
      return;
  }
  if (targetNode.lastTriggerPulseId === pulseId) {
      if (targetNode.type !== 'reflector' || sourceNodeId === -1) {
           return;
      }
  }
   if (hopsRemaining <= 0 && hopsRemaining !== Infinity) {
       return;
   }
   if (targetNode.type === 'nebula') { // Oude nebula blockt nog steeds
       return;
   }
   if (targetNode.type === PORTAL_NEBULA_TYPE) { // Portal blockt en doet eigen ding
       const actualTriggerDelay = incomingDelay;
       setTimeout(() => {
           const portalNode = findNodeById(targetNode.id);
           if (portalNode) {
               portalNode.animationState = 1.2;
               // triggerPortalAbsorbSound(portalNode, incomingPulse.data); // Roep eventuele geluidsfunctie aan
               if (incomingPulse.data?.color) {
                    // Simpele hue shift als voorbeeld van interactie
                    portalNode.baseHue = (portalNode.baseHue + 30) % 360;
               }
               setTimeout(() => {
                   const pNodeCheck = findNodeById(portalNode.id);
                   if (pNodeCheck) pNodeCheck.animationState = 0;
               }, 250);
           }
       }, actualTriggerDelay * 1000);
       return; // Stop propagatie hier
   }

  const sourceNode = findNodeById(sourceNodeId);
  targetNode.lastTriggerPulseId = pulseId;
  const actualTriggerDelay = incomingDelay;

  setTimeout(() => {
      const currentNode = findNodeById(targetNode.id);
      if (!currentNode) return;

      let canPropagate = true;
      let triggerAudioEffect = false;
      let triggerVisualEffect = true;
      let stateChangedForUndo = false;
      let pulseDataForNext = { ...incomingPulse.data };
      let isGlideArrival = false;

      if (incomingConnection && incomingConnection.type === 'glide' && sourceNode && sourceNode.audioParams && (currentNode.type === 'sound' || isDrumType(currentNode.type))) {
          isGlideArrival = true;
          triggerAudioEffect = true;
          canPropagate = true;
          triggerVisualEffect = false;
      }

      if (!isGlideArrival) {
           if (currentNode.type === 'sound' || isDrumType(currentNode.type)) {
               triggerAudioEffect = true;
           }
      }

      if (isPulsarType(currentNode.type)) {
           if (currentNode.type === 'pulsar_triggerable') { if (sourceNodeId !== -1 && sourceNodeId !== currentNode.id) { currentNode.isEnabled = !currentNode.isEnabled; if (currentNode.isEnabled) { currentNode.lastTriggerTime = -1; currentNode.nextSyncTriggerTime = 0; currentNode.nextGridTriggerTime = 0; const nowTime = audioContext ? audioContext.currentTime : performance.now() / 1000; currentNode.nextRandomTriggerTime = nowTime + (Math.random() * 2 / PULSAR_RANDOM_TIMING_CHANCE_PER_SEC); } stateChangedForUndo = true; currentNode.animationState = 1; triggerAudioEffect = false; canPropagate = false; triggerVisualEffect = false; } else { canPropagate = false; triggerVisualEffect = false; } } else { triggerAudioEffect = false; canPropagate = true; currentNode.animationState = 1; pulseDataForNext = { ...incomingPulse.data }; pulseDataForNext.color = currentNode.color ?? null; if (sourceNode && sourceNode.type === 'pulsar_random_volume') { pulseDataForNext.intensity = incomingPulse.data.intensity; } else { pulseDataForNext.intensity = currentNode.audioParams.pulseIntensity ?? DEFAULT_PULSE_INTENSITY; } pulseDataForNext.particleMultiplier = incomingPulse.data.particleMultiplier ?? 1.0; triggerVisualEffect = false; }
      } else if (currentNode.type === 'gate') {
           triggerAudioEffect = false; const counterBefore = currentNode.gateCounter || 0; currentNode.gateCounter = counterBefore + 1; const modeIndex = currentNode.gateModeIndex || 0; const mode = GATE_MODES[modeIndex]; canPropagate = false; switch (mode) { case '1/2': if (currentNode.gateCounter % 2 === 0) canPropagate = true; break; case '1/3': if (currentNode.gateCounter % 3 === 0) canPropagate = true; break; case '1/4': if (currentNode.gateCounter % 4 === 0) canPropagate = true; break; case '2/3': if (currentNode.gateCounter % 3 !== 0) canPropagate = true; break; case '3/4': if (currentNode.gateCounter % 4 !== 0) canPropagate = true; break; case 'RAND': const randomCheck = Math.random() < GATE_RANDOM_THRESHOLD; currentNode.lastRandomGateResult = randomCheck; if (randomCheck) canPropagate = true; break; } currentNode.animationState = 1; triggerVisualEffect = false;
      } else if (currentNode.type === 'probabilityGate') {
          triggerAudioEffect = false; canPropagate = false; if (Math.random() < (currentNode.audioParams.probability ?? DEFAULT_PROBABILITY)) { canPropagate = true; } currentNode.animationState = 1; triggerVisualEffect = false;
      } else if (currentNode.type === 'pitchShift') {
          triggerAudioEffect = false; canPropagate = true; currentNode.animationState = 1; triggerVisualEffect = false; const shiftIndex = currentNode.pitchShiftIndex ?? DEFAULT_PITCH_SHIFT_INDEX; let shiftAmount = PITCH_SHIFT_AMOUNTS[shiftIndex]; if (currentNode.pitchShiftAlternating) { shiftAmount *= (currentNode.pitchShiftDirection || 1); currentNode.pitchShiftDirection = (currentNode.pitchShiftDirection || 1) * -1; stateChangedForUndo = true; } let pitchActuallyChanged = false; currentNode.connections.forEach(neighborId => { if (neighborId === sourceNodeId) return; const neighborNode = findNodeById(neighborId); if (neighborNode && (neighborNode.type === 'sound' || neighborNode.type === 'nebula')) { const oldIndex = neighborNode.audioParams.scaleIndex; neighborNode.audioParams.scaleIndex = Math.max(MIN_SCALE_INDEX, Math.min(MAX_SCALE_INDEX, oldIndex + shiftAmount)); neighborNode.audioParams.pitch = getFrequency(currentScale, neighborNode.audioParams.scaleIndex); updateNodeAudioParams(neighborNode); if (oldIndex !== neighborNode.audioParams.scaleIndex) { pitchActuallyChanged = true; neighborNode.animationState = 0.7; setTimeout(() => { const checkNode = findNodeById(neighborId); if (checkNode && !checkNode.isTriggered) checkNode.animationState = 0; }, 150); } } const neighborConn = connections.find(c => c.type === 'string_violin' && ((c.nodeAId === currentNode.id && c.nodeBId === neighborId) || (c.nodeAId === neighborId && c.nodeBId === currentNode.id))); if (neighborConn) { const oldIndex = neighborConn.audioParams.scaleIndex; neighborConn.audioParams.scaleIndex = Math.max(MIN_SCALE_INDEX, Math.min(MAX_SCALE_INDEX, oldIndex + shiftAmount)); neighborConn.audioParams.pitch = getFrequency(currentScale, neighborConn.audioParams.scaleIndex); updateConnectionAudioParams(neighborConn); if (oldIndex !== neighborConn.audioParams.scaleIndex) { pitchActuallyChanged = true; neighborConn.animationState = 0.7; setTimeout(() => { const checkConn = findConnectionById(neighborConn.id); if (checkConn) checkConn.animationState = 0; }, 150); } } }); if (pitchActuallyChanged) { stateChangedForUndo = true; }
      } else if (currentNode.type === 'relay') {
          triggerAudioEffect = false; canPropagate = true; currentNode.animationState = 1; triggerVisualEffect = false;
      } else if (currentNode.type === 'reflector') {
           triggerAudioEffect = false; canPropagate = false; triggerVisualEffect = true; currentNode.animationState = 1; if (sourceNode && incomingConnection) { const baseTravelTime = incomingConnection.length * DELAY_FACTOR; const outgoingTravelTime = baseTravelTime; const pulseColor = pulseDataForNext.color; createVisualPulse(incomingConnection.id, outgoingTravelTime, currentNode.id, hopsRemaining - 1, 'trigger', pulseColor, pulseDataForNext.intensity); propagateTrigger(sourceNode, outgoingTravelTime, pulseId, currentNode.id, hopsRemaining - 1, { type: 'trigger', data: pulseDataForNext }, null); }
      } else if (currentNode.type === 'switch') {
           triggerAudioEffect = false; canPropagate = false; triggerVisualEffect = true; currentNode.animationState = 1; if (incomingConnection) { if (currentNode.primaryInputConnectionId === null || currentNode.primaryInputConnectionId === undefined) { currentNode.primaryInputConnectionId = incomingConnection.id; stateChangedForUndo = true; } if (incomingConnection.id === currentNode.primaryInputConnectionId) { canPropagate = true; } else { canPropagate = false; triggerVisualEffect = false; } } else { canPropagate = false; }
      } else if (currentNode.type === 'sound' || isDrumType(currentNode.type)) {
          canPropagate = true;
          triggerVisualEffect = false;
          if (isDrumType(currentNode.type)) pulseDataForNext = { ...pulseDataForNext };
      } else {
          canPropagate = false;
          triggerVisualEffect = false;
      }

      if (triggerAudioEffect && (currentNode.type === 'sound' || isDrumType(currentNode.type))) {
          triggerNodeEffect(currentNode, pulseDataForNext);
      }

      if (triggerVisualEffect) {
           setTimeout(() => {
               const nodeCheck = findNodeById(currentNode.id);
               if (nodeCheck && !nodeCheck.isTriggered) nodeCheck.animationState = 0;
           }, 150);
       }

      if (!isPulsarType(currentNode.type) && currentNode.type !== 'sound' && !isDrumType(currentNode.type) && currentNode.type !== 'relay' && currentNode.type !== 'reflector' && currentNode.type !== 'switch' && currentNode.animationState > 0) {
          setTimeout(() => {
              const nodeCheck = findNodeById(currentNode.id);
              if (nodeCheck && !nodeCheck.isTriggered) nodeCheck.animationState = 0;
          }, 150);
      }
      if (isPulsarType(currentNode.type) && currentNode.animationState > 0) {
          setTimeout(() => {
              const nodeCheck = findNodeById(currentNode.id);
              if (nodeCheck) nodeCheck.animationState = 0;
          }, 150);
      }

      if (stateChangedForUndo) {
          populateEditPanel();
          saveState();
      }

      if (canPropagate) {
          const nextHops = (hopsRemaining === Infinity) ? Infinity : hopsRemaining - 1;
          if (nextHops > 0 || nextHops === Infinity) {
              currentNode.connections.forEach(neighborId => {
                  if (neighborId === sourceNodeId) return;
                  const neighborNode = findNodeById(neighborId);
                  const connection = connections.find(c => (c.nodeAId === currentNode.id && c.nodeBId === neighborId) || (c.nodeAId === neighborId && c.nodeBId === currentNode.id));

                  // Propagate niet naar nebula of portal
                  if (neighborNode && neighborNode.type !== 'nebula' && neighborNode.type !== PORTAL_NEBULA_TYPE && connection && neighborNode.lastTriggerPulseId !== pulseId) {
                      const baseTravelTime = connection.length * DELAY_FACTOR;
                      const outgoingTravelTime = baseTravelTime;
                      const pulseColor = pulseDataForNext.color;
                      createVisualPulse(connection.id, outgoingTravelTime, currentNode.id, nextHops, 'trigger', pulseColor, pulseDataForNext.intensity);
                      propagateTrigger(neighborNode, outgoingTravelTime, pulseId, currentNode.id, nextHops, { type: 'trigger', data: pulseDataForNext }, connection);
                  }
              });
          }
      }
  }, actualTriggerDelay * 1000);
}



function createParticles(x, y, count) {
  const baseColor =
    getComputedStyle(document.documentElement)
      .getPropertyValue("--particle-color")
      .trim() || "rgba(220, 240, 255, 0.7)"
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2
    const speed = 1 + Math.random() * 1.5
    const life = 0.6 + Math.random() * 0.6
    activeParticles.push({
      id: particleIdCounter++,
      x: x + (Math.random() - 0.5) * 5,
      y: y + (Math.random() - 0.5) * 5,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: life,
      maxLife: life,
      radius: 1 + Math.random() * 2,
      color: baseColor
    })
  }
}
function createWindParticles(count) {
  const windColor =
    getComputedStyle(document.documentElement)
      .getPropertyValue("--wind-particle-color")
      .trim() || "rgba(180, 210, 230, 0.3)"
  for (let i = 0; i < count; i++) {
    const angle = Math.PI * 0.7 + Math.random() * Math.PI * 0.6
    const speed = 0.3 + Math.random() * 0.4
    windParticles.push({
      id: particleIdCounter++,
      x: Math.random() * canvas.width * 1.2 - canvas.width * 0.1,
      y: -10,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 20 + Math.random() * 20,
      maxLife: 40,
      radius: 0.5 + Math.random() * 1.0,
      color: windColor
    })
  }
}
function updateAndDrawParticles(deltaTime, now) {
  activeParticles = activeParticles.filter((p) => {
    p.x += p.vx * (deltaTime * 60)
    p.y += p.vy * (deltaTime * 60)
    p.vy += 0.02
    p.life -= deltaTime
    if (p.life <= 0) return false
    const alpha = Math.max(0, (p.life / p.maxLife) * 0.9)
    try {
      ctx.fillStyle = p.color.replace(/[\d\.]+\)$/g, `${alpha})`)
      ctx.beginPath()
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
      ctx.fill()
    } catch (e) {}
    return true
  })
  if (Math.random() < 0.25) createWindParticles(1)
  windParticles.forEach((p) => {
    p.x += p.vx * (deltaTime * 60)
    p.y += p.vy * (deltaTime * 60)
    const padding = 10
    const worldTopLeft = getWorldCoords(-padding, -padding)
    const worldBottomRight = getWorldCoords(
      canvas.width + padding,
      canvas.height + padding
    )
    const worldWidth = worldBottomRight.x - worldTopLeft.x
    const worldHeight = worldBottomRight.y - worldTopLeft.y
    if (p.y > worldBottomRight.y) {
      p.y = worldTopLeft.y
      p.x = worldTopLeft.x + Math.random() * worldWidth
    } else if (p.y < worldTopLeft.y) {
      p.y = worldBottomRight.y
      p.x = worldTopLeft.x + Math.random() * worldWidth
    }
    if (p.x > worldBottomRight.x) {
      p.x = worldTopLeft.x
      p.y = worldTopLeft.y + Math.random() * worldHeight
    } else if (p.x < worldTopLeft.x) {
      p.x = worldBottomRight.x
      p.y = worldTopLeft.y + Math.random() * worldHeight
    }
    const alpha = 0.3
    try {
      ctx.fillStyle = p.color.replace(/[\d\.]+\)$/g, `${alpha})`)
      ctx.beginPath()
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
      ctx.fill()
    } catch (e) {}
  })
}
function createVisualPulse(connId, dur, startNodeId, hopsLeft = Infinity, pulseType = 'trigger', pulseColor = null, intensity = 1.0) { // pulseStyleOptions verwijderd
  if (!isAudioReady || dur <= 0) return;
  const connection = findConnectionById(connId);
  if (!connection) return;

  const targetNodeId = (connection.nodeAId === startNodeId) ? connection.nodeBId : connection.nodeAId;

  const visualPulse = {
      id: pulseIdCounter++,
      connectionId: connId,
      startTime: audioContext.currentTime,
      duration: dur,
      startNodeId: startNodeId,
      hopsLeft: hopsLeft,
      type: pulseType,
      color: pulseColor,
      intensity: intensity
      // style: 'standard' // Niet meer nodig tenzij je andere styles wilt
  };
  activePulses.push(visualPulse);

  if (connection.type === 'string_violin') {
      visualPulse.audioStartTime = audioContext.currentTime;
      visualPulse.audioEndTime = audioContext.currentTime + dur;
      startStringSound(connection, visualPulse.intensity);
  }
  if (connection.type === 'glide') {
    const sourceNode = findNodeById(startNodeId);
    const targetNode = findNodeById(targetNodeId);
    if (sourceNode && targetNode) {
        try {
            const sourceFreq = sourceNode.audioParams.pitch;
            const targetFreq = targetNode.audioParams.pitch;
            const glideDuration = dur;
            startTravelingGlideSound(sourceNode, targetFreq, glideDuration, intensity);
        } catch (e) {
            console.warn("Glide kon niet worden gestart:", e);
        }
    }
}

}

function startTravelingGlideSound(sourceNode, targetFrequency, duration, intensity = 1.0) {
  if (!isAudioReady || !sourceNode || !sourceNode.audioNodes || !sourceNode.audioParams) return;

  const now = audioContext.currentTime;
  const waveform = sourceNode.audioParams.waveform;

  if (waveform && waveform.startsWith("sampler_")) {
    console.log("Sampler glide gestart:", waveform, sourceNode.audioParams.pitch, "→", targetFrequency);
    startSamplerGlide_Granular(sourceNode, targetFrequency, duration, 0.14, 0.04, intensity);
    return;
}

  const {
      oscillator,
      gainNode,
      lowPassFilter
  } = sourceNode.audioNodes;

  const startFreq = sourceNode.audioParams.pitch;
  const baseVol = 0.6;
  const clampedIntensity = Math.max(0.01, Math.min(1.0, intensity));
  const targetVol = baseVol * clampedIntensity;

  try {
      // Volume fade-in
      gainNode.gain.cancelScheduledValues(now);
      gainNode.gain.setValueAtTime(0, now);
      gainNode.gain.linearRampToValueAtTime(targetVol, now + 0.02);

      // Pitch glide (alleen voor oscillator nodes)
      if (oscillator) {
          oscillator.frequency.cancelScheduledValues(now);
          oscillator.frequency.setValueAtTime(startFreq, now);
          oscillator.frequency.linearRampToValueAtTime(targetFrequency, now + duration);
      }

      // Volume fade-out
      gainNode.gain.setTargetAtTime(0.0001, now + duration * 0.9, duration * 0.2);
  } catch (e) {
      console.error("startTravelingGlideSound error:", e);
  }
}



function updateAndDrawPulses(now) {
  const defaultPulseColor = getComputedStyle(document.documentElement).getPropertyValue('--pulse-visual-color').trim() || 'rgba(255, 255, 255, 1)';
  // sequentialPulseColor is niet meer nodig hier
  const stringPulseColor = getComputedStyle(document.documentElement).getPropertyValue('--string-violin-pulse-color').trim() || '#ffccaa';

  activePulses = activePulses.filter((p) => {
      const elapsedTime = now - p.startTime;
      const connection = findConnectionById(p.connectionId);
      if (!connection || elapsedTime >= p.duration) {
          if (connection && connection.type === "string_violin" && p.audioStartTime) { stopStringSound(connection); }
          return false;
      }
      const nodeA = findNodeById(connection.nodeAId);
      const nodeB = findNodeById(connection.nodeBId);
      if (!nodeA || !nodeB) return false;

      const startNodeForDraw = p.startNodeId === nodeA.id ? nodeA : nodeB;
      const endNodeForDraw = p.startNodeId === nodeA.id ? nodeB : nodeA;
      const progress = Math.min(1.0, elapsedTime / p.duration);
      const midX = (startNodeForDraw.x + endNodeForDraw.x) / 2 + connection.controlPointOffsetX;
      const midY = (startNodeForDraw.y + endNodeForDraw.y) / 2 + connection.controlPointOffsetY;
      const pX = lerp(lerp(startNodeForDraw.x, midX, progress), lerp(midX, endNodeForDraw.x, progress), progress);
      const pY = lerp(lerp(startNodeForDraw.y, midY, progress), lerp(midY, endNodeForDraw.y, progress), progress);
      const prevProgress = Math.max(0, progress - 0.02);
      const prevX = lerp(lerp(startNodeForDraw.x, midX, prevProgress), lerp(midX, endNodeForDraw.x, prevProgress), prevProgress);
      const prevY = lerp(lerp(startNodeForDraw.y, midY, prevProgress), lerp(midY, endNodeForDraw.y, prevProgress), prevProgress);
      const angle = Math.atan2(pY - prevY, pX - prevX);
      const tailLength = 5 + p.duration * 30;

      let colorToUse = p.color || defaultPulseColor;
      let pulseSize = PULSE_SIZE;
      let shadowBlurSize = 8;

      // Alleen nog check voor string type connectie
      if (connection.type === 'string_violin') {
          colorToUse = p.color || stringPulseColor;
          pulseSize *= 0.9;
          shadowBlurSize = 6;
      }

      ctx.fillStyle = colorToUse;
      ctx.shadowColor = colorToUse;
      ctx.shadowBlur = shadowBlurSize / viewScale;

      ctx.beginPath();
      ctx.arc(pX, pY, pulseSize, 0, Math.PI * 2);
      ctx.fill();

      // Teken staart
      ctx.beginPath();
      ctx.moveTo(pX + Math.cos(angle + Math.PI * 0.8) * pulseSize * 0.5, pY + Math.sin(angle + Math.PI * 0.8) * pulseSize * 0.5);
      ctx.lineTo(pX + Math.cos(angle + Math.PI) * tailLength, pY + Math.sin(angle + Math.PI) * tailLength);
      ctx.lineTo(pX + Math.cos(angle - Math.PI * 0.8) * pulseSize * 0.5, pY + Math.sin(angle - Math.PI * 0.8) * pulseSize * 0.5);
      ctx.closePath();
      const tailGradient = ctx.createLinearGradient(pX, pY, pX + Math.cos(angle + Math.PI) * tailLength, pY + Math.sin(angle + Math.PI) * tailLength);
      const alpha = Math.max(0, 1.0 - progress);
      try {
          tailGradient.addColorStop(0, colorToUse.replace(/[\d\.]+\)$/g, `${alpha})`));
          tailGradient.addColorStop(1, colorToUse.replace(/[\d\.]+\)$/g, "0)"));
      } catch (e) {}
      ctx.fillStyle = tailGradient;
      ctx.fill();

      ctx.shadowBlur = 0;
      return true;
  });
}

function startSamplerGlide_Granular(sourceNode, targetFreq, duration, grainDuration = 0.15, overlap = 0.05, intensity = 1.0) {
    if (!isAudioReady || !sourceNode || !sourceNode.audioParams || !sourceNode.audioParams.waveform.startsWith("sampler_")) return;

    const samplerId = sourceNode.audioParams.waveform.replace("sampler_", "");
    const def = SAMPLER_DEFINITIONS?.find(s => s.id === samplerId);
    if (!def?.isLoaded || !def.buffer || !def.baseFreq) return;

    const now = audioContext.currentTime;
    const baseFreq = def.baseFreq;
    const fromFreq = sourceNode.audioParams.pitch;
    const grains = Math.ceil(duration / (grainDuration - overlap));

    for (let i = 0; i < grains; i++) {
        const t = i / (grains - 1);
        const interpFreq = fromFreq + (targetFreq - fromFreq) * t;
        const rate = Math.max(0.1, Math.min(4, interpFreq / baseFreq));
        const startTime = now + i * (grainDuration - overlap);

        const src = audioContext.createBufferSource();
        src.buffer = def.buffer;
        src.playbackRate.setValueAtTime(rate, startTime);

        const g = audioContext.createGain();
        const baseVol = 0.8 + sourceNode.size * 0.3; // bijvoorbeeld
const vol = baseVol * intensity * (1 - Math.abs(0.5 - t));
        g.gain.setValueAtTime(vol, startTime);
        g.gain.linearRampToValueAtTime(0.001, startTime + grainDuration);

        src.connect(g);
        const target = sourceNode.audioNodes?.lowPassFilter || sourceNode.audioNodes?.gainNode || masterGain;
g.connect(target);
        src.start(startTime);
        src.stop(startTime + grainDuration + 0.02);
    }
}


function startStringSound(connection, intensity = 1.0) {
  if (!connection.audioNodes || connection.type !== "string_violin") return
  const now = audioContext.currentTime
  const { gainNode } = connection.audioNodes
  const params = connection.audioParams
  const defaults = STRING_VIOLIN_DEFAULTS
  const attackTime = params.attack ?? defaults.attack
  const baseVolume = params.volume ?? defaults.volume
  const targetVolume = baseVolume * intensity
  const clampedVolume = Math.max(0.01, Math.min(1.0, targetVolume))
  try {
    gainNode.gain.cancelScheduledValues(now)
    gainNode.gain.setValueAtTime(gainNode.gain.value, now)
    gainNode.gain.linearRampToValueAtTime(clampedVolume, now + attackTime)
  } catch (e) {}
}
function stopStringSound(connection) {
  if (!connection.audioNodes || connection.type !== "string_violin") return
  const now = audioContext.currentTime
  const { gainNode } = connection.audioNodes
  const params = connection.audioParams
  const defaults = STRING_VIOLIN_DEFAULTS
  const releaseTime = params.release ?? defaults.release
  try {
    gainNode.gain.cancelScheduledValues(now)
    gainNode.gain.setTargetAtTime(0, now, releaseTime / 3)
  } catch (e) {}
}

function addNode(x, y, type, subtype = null) {
  if (!isAudioReady) return null;
  let currentEvent = window.event;
  let applySnap = isSnapEnabled && !(currentEvent && currentEvent.shiftKey);
  let finalPos = applySnap ? snapToGrid(x, y) : { x: x, y: y };
  const isStartNodeType = isPulsarType(type);
  let nodeType = type;
  let initialScaleIndex = 0;
  let initialPitch = 0;
  let nodeSubtype = subtype;
  let initialBaseHue = null;

  if (type === "sound" || type === "nebula" || type === PORTAL_NEBULA_TYPE) {
      if (type !== PORTAL_NEBULA_TYPE) {
          if (noteIndexToAdd !== -1) {
              initialScaleIndex = noteIndexToAdd;
          } else {
              initialScaleIndex = Math.floor(Math.random() * currentScale.notes.length * 2);
          }
          initialScaleIndex = Math.max(MIN_SCALE_INDEX, Math.min(MAX_SCALE_INDEX, initialScaleIndex));
          initialPitch = getFrequency(currentScale, initialScaleIndex);
          if (isNaN(initialPitch)) {
              initialScaleIndex = 0;
              initialPitch = getFrequency(currentScale, 0);
          }
      }

      if (type === "nebula") {
          initialBaseHue = Math.random() * 360;
          if (nodeSubtype && nodeSubtype.startsWith("sampler_")) { nodeSubtype = "sawtooth"; }
      } else if (type === PORTAL_NEBULA_TYPE) {
          initialBaseHue = PORTAL_NEBULA_DEFAULTS.baseColorHue + (Math.random() - 0.5) * 40;
          initialPitch = PORTAL_NEBULA_DEFAULTS.droneBaseFreq;
          nodeSubtype = null;
      }

      if (type === "sound" && !nodeSubtype) {
           nodeSubtype = 'fmBell';
      } else if (type === "sound" && nodeSubtype && nodeSubtype.startsWith('sampler_') && !(typeof SAMPLER_DEFINITIONS !== 'undefined' && SAMPLER_DEFINITIONS.find(s => s.id === nodeSubtype.replace('sampler_', '')))) {
          nodeSubtype = 'fmBell';
      }
  }

  const drumDefaults = isDrumType(type) ? DRUM_ELEMENT_DEFAULTS[type] : {};
  const randomSize = (isStartNodeType || isDrumType(type) || type === PORTAL_NEBULA_TYPE)
      ? MIN_NODE_SIZE + Math.random() * (MAX_NODE_SIZE - MIN_NODE_SIZE) * 0.7
      : (type === "relay" || type === "reflector" || type === "switch" ? 0.7 : 1.0);
  const starPoints = isStartNodeType ? 6 : 5;

  const newNode = {
      id: nodeIdCounter++,
      x: finalPos.x,
      y: finalPos.y,
      size: randomSize,
      radius: NODE_RADIUS_BASE,
      type: nodeType,
      baseHue: initialBaseHue,
      connections: new Set(),
      isSelected: false,
      isInConstellation: false,
      audioParams: {
          triggerInterval: DEFAULT_TRIGGER_INTERVAL,
          waveform: nodeSubtype,
          reverbSend: type === PORTAL_NEBULA_TYPE ? (DEFAULT_REVERB_SEND * 1.5) : DEFAULT_REVERB_SEND,
          delaySend: type === PORTAL_NEBULA_TYPE ? (DEFAULT_DELAY_SEND * 1.2) : DEFAULT_DELAY_SEND,
          lowPassFreq: MAX_FILTER_FREQ,
          fmModDepthScale: 1.0,
          pitch: initialPitch,
          scaleIndex: initialScaleIndex,
          volLfoRate: 0.1 + Math.random() * 0.2,
          volLfoDepth: 0,
          probability: DEFAULT_PROBABILITY,
          pulseIntensity: DEFAULT_PULSE_INTENSITY,
          baseFreq: drumDefaults?.baseFreq,
          decay: drumDefaults?.decay,
          noiseDecay: drumDefaults?.noiseDecay,
          volume: drumDefaults?.volume ?? (type === PORTAL_NEBULA_TYPE ? 0.6 : 1.0),
          detune: 7,
          lfoDepthFactor: 1
      },
      color: null,
      audioNodes: null,
      isStartNode: isStartNodeType,
      isTriggered: false,
      lastTriggerPulseId: -1,
      animationState: 0,
      lastTriggerTime: -1,
      currentAngle: (type === "gate" || (type === "sound" && nodeSubtype?.startsWith("sampler_"))) ? Math.random() * Math.PI * 2 : 0, // Portal gebruikt dit nu niet direct
      innerAngle: 0, // Alleen voor oude nebula stijl
      pulsePhase: type === "nebula" || type === PORTAL_NEBULA_TYPE ? Math.random() * Math.PI * 2 : 0,
      gateModeIndex: type === "gate" ? DEFAULT_GATE_MODE_INDEX : 0,
      gateCounter: 0,
      lastRandomGateResult: true,
      pitchShiftIndex: type === "pitchShift" ? DEFAULT_PITCH_SHIFT_INDEX : 0,
      pitchShiftAmount: type === "pitchShift" ? PITCH_SHIFT_AMOUNTS[DEFAULT_PITCH_SHIFT_INDEX] : 0,
      pitchShiftAlternating: false,
      pitchShiftDirection: 1,
      syncSubdivisionIndex: DEFAULT_SUBDIVISION_INDEX,
      nextSyncTriggerTime: 0,
      nextRandomTriggerTime: 0,
      starPoints: starPoints,
      isEnabled: true,
      pulseOriginNodeId: -1,
      midiOutEnabled: false,
      midiChannel: 1,
      midiNote: 60,
      primaryInputConnectionId: type === "switch" ? null : undefined
  };

  newNode.audioNodes = createAudioNodesForNode(newNode);
  if (newNode.audioNodes) {
      // updateNodeAudioParams moet misschien later portal type herkennen
      // voor nu zou het geen kwaad moeten kunnen
      updateNodeAudioParams(newNode);
  }
  nodes.push(newNode);
  saveState();
  identifyAndRouteAllGroups();
  return newNode;
}
function stopNodeAudio(node) {
  if (!node || !node.audioNodes) return;
  try {
      if (node.type === "sound") {
          node.audioNodes.oscillator?.stop();
          node.audioNodes.modulatorOsc?.stop();
          node.audioNodes.volLfo?.stop();
          node.audioNodes.reverbSendGain?.disconnect();
          node.audioNodes.delaySendGain?.disconnect();
          node.audioNodes.volLfoGain?.disconnect();
          node.audioNodes.volLfo?.disconnect();
          node.audioNodes.gainNode?.disconnect();
          node.audioNodes.lowPassFilter?.disconnect();
          node.audioNodes.modulatorGain?.disconnect();
          node.audioNodes.modulatorOsc?.disconnect();
          node.audioNodes.oscillator?.disconnect();
      } else if (node.type === "nebula") {
          node.audioNodes.filterLfo?.stop();
          node.audioNodes.volLfo?.stop();
          node.audioNodes.oscillators?.forEach((osc) => { try { osc.stop(); } catch(e){} });
          node.audioNodes.reverbSendGain?.disconnect();
          node.audioNodes.delaySendGain?.disconnect();
          node.audioNodes.filterLfoGain?.disconnect();
          node.audioNodes.volLfoGain?.disconnect();
          node.audioNodes.filterLfo?.disconnect();
          node.audioNodes.volLfo?.disconnect();
          node.audioNodes.gainNode?.disconnect();
          node.audioNodes.filterNode?.disconnect();
          node.audioNodes.oscillators?.forEach((osc) => { try { osc.disconnect(); } catch(e){} });
      } else if (node.type === PORTAL_NEBULA_TYPE) {
           // Stop alle portal oscillatoren
           try { node.audioNodes.droneOsc?.stop(); } catch(e){}
           try { node.audioNodes.droneFreqLfo?.stop(); } catch(e){}
           try { node.audioNodes.shimmerLfo?.stop(); } catch(e){}
           node.audioNodes.harmonics?.forEach(osc => { try { osc.stop(); } catch(e){} });

           // Koppel alle portal nodes los
           node.audioNodes.reverbSendGain?.disconnect();
           node.audioNodes.delaySendGain?.disconnect();
           node.audioNodes.shimmerLfoGain?.disconnect();
           node.audioNodes.shimmerLfo?.disconnect();
           node.audioNodes.harmonicGain?.disconnect();
           node.audioNodes.harmonics?.forEach(osc => { try { osc.disconnect(); } catch(e){} });
           node.audioNodes.droneFreqLfoGain?.disconnect();
           node.audioNodes.droneFreqLfo?.disconnect();
           node.audioNodes.droneOsc?.disconnect();
           node.audioNodes.mainGain?.disconnect(); // Belangrijkste output loskoppelen
      } else if (isDrumType(node.type)) {
          node.audioNodes.reverbSendGain?.disconnect();
          node.audioNodes.delaySendGain?.disconnect();
          node.audioNodes.mainGain?.disconnect();
      }
  } catch (e) {
       console.error(`Error stopping audio for node ${node.id}:`, e);
  }
  node.audioNodes = null;
}
function stopConnectionAudio(connection) {
  if (
    !connection ||
    !connection.audioNodes ||
    connection.type !== "string_violin"
  )
    return
  try {
    connection.audioNodes.vibratoLfo?.stop()
    connection.audioNodes.oscillators?.forEach((osc) => osc.stop())
    connection.audioNodes.reverbSendGain?.disconnect()
    connection.audioNodes.delaySendGain?.disconnect()
    connection.audioNodes.vibratoGain?.disconnect()
    connection.audioNodes.vibratoLfo?.disconnect()
    connection.audioNodes.gainNode?.disconnect()
    connection.audioNodes.filterNode?.disconnect()
    connection.audioNodes.oscillators?.forEach((osc) => osc.disconnect())
  } catch (e) {}
  connection.audioNodes = null
}
function removeNode(nodeToRemove) {
  if (!nodeToRemove) return
  const nodeIdsToRemove = new Set([nodeToRemove.id])
  selectedElements.forEach((el) => {
    if (
      el.type === "node" &&
      el.id === nodeToRemove.id &&
      selectedElements.size > 1
    ) {
      selectedElements.forEach((selEl) => {
        if (selEl.type === "node") nodeIdsToRemove.add(selEl.id)
      })
    }
  })
  let stateChanged = false
  nodeIdsToRemove.forEach((id) => {
    const node = findNodeById(id)
    if (!node) return
    stateChanged = true
    stopNodeAudio(node)
    const connectionsToRemove = connections.filter(
      (conn) => conn.nodeAId === id || conn.nodeBId === id
    )
    connectionsToRemove.forEach((conn) => removeConnection(conn, false))
    nodes = nodes.filter((n) => n.id !== id)
    selectedElements = new Set(
      [...selectedElements].filter(
        (el) => !(el.type === "node" && el.id === id)
      )
    )
    currentConstellationGroup.delete(id)
    fluctuatingGroupNodeIDs.delete(id)
  })
  if (stateChanged) {
    updateConstellationGroup()
    populateEditPanel()
    saveState()
  }
}
function connectNodes(nodeA, nodeB, type = 'standard') {
  if (!nodeA || !nodeB || nodeA === nodeB || nodeA.type === 'nebula' || nodeB.type === 'nebula' || nodeA.type === PORTAL_NEBULA_TYPE || nodeB.type === PORTAL_NEBULA_TYPE ) return;
  const exists = connections.some(c => (c.nodeAId === nodeA.id && c.nodeBId === nodeB.id) || (c.nodeAId === nodeB.id && c.nodeBId === nodeA.id));
  if (exists) return;

  nodeA.connections.add(nodeB.id);
  nodeB.connections.add(nodeA.id);
  const dx = nodeB.x - nodeA.x;
  const dy = nodeB.y - nodeA.y;
  const len = Math.sqrt(dx*dx + dy*dy) || 1;
  const anglePerp = Math.atan2(dx, -dy);
  const ctrlOffsetMagnitude = Math.min(len * 0.15, 30);
  const ctrlOffsetX = Math.cos(anglePerp) * ctrlOffsetMagnitude;
  const ctrlOffsetY = Math.sin(anglePerp) * ctrlOffsetMagnitude;

  const newConnection = {
      id: connectionIdCounter++,
      nodeAId: nodeA.id,
      nodeBId: nodeB.id,
      length: len,
      controlPointOffsetX: ctrlOffsetX,
      controlPointOffsetY: ctrlOffsetY,
      type: type,
      isSelected: false,
      audioParams: {},
      audioNodes: null,
      animationState: 0,
  };

  if (type === 'string_violin') {
      let initialScaleIndex = 0;
      if (noteIndexToAdd !== -1 && noteIndexToAdd >= MIN_SCALE_INDEX && noteIndexToAdd <= MAX_SCALE_INDEX) {
           initialScaleIndex = noteIndexToAdd;
      } else {
           initialScaleIndex = Math.floor(Math.random() * currentScale.notes.length * 2);
      }
      initialScaleIndex = Math.max(MIN_SCALE_INDEX, Math.min(MAX_SCALE_INDEX, initialScaleIndex));
      let initialPitch = getFrequency(currentScale, initialScaleIndex);
      if (isNaN(initialPitch)) {
          initialScaleIndex = 0;
          initialPitch = getFrequency(currentScale, 0);
      }
      newConnection.audioParams = { ...STRING_VIOLIN_DEFAULTS, scaleIndex: initialScaleIndex, pitch: initialPitch };
      newConnection.audioNodes = createAudioNodesForConnection(newConnection);
      if (newConnection.audioNodes) {
          updateConnectionAudioParams(newConnection);
      }
  }

  connections.push(newConnection);
  createParticles(nodeB.x, nodeB.y, 15);

  updateConstellationGroup();
  identifyAndRouteAllGroups();
}
function removeConnection(connToRemove, updateGroup = true) {
  if (!connToRemove) return
  stopConnectionAudio(connToRemove)
  const nodeA = findNodeById(connToRemove.nodeAId)
  const nodeB = findNodeById(connToRemove.nodeBId)
  if (nodeA) nodeA.connections.delete(connToRemove.nodeBId)
  if (nodeB) nodeB.connections.delete(connToRemove.nodeAId)
  connections.forEach((c) => {
    if (c.type === "switch" && c.primaryInputConnectionId === connToRemove.id) {
      c.primaryInputConnectionId = null
    }
  })
  nodes.forEach((n) => {
    if (n.type === "switch" && n.primaryInputConnectionId === connToRemove.id) {
      n.primaryInputConnectionId = null
    }
  })
  connections = connections.filter((c) => c.id !== connToRemove.id)
  activePulses = activePulses.filter((p) => p.connectionId !== connToRemove.id)
  selectedElements = new Set(
    [...selectedElements].filter(
      (el) => !(el.type === "connection" && el.id === connToRemove.id)
    )
  )
  if (updateGroup) {
    updateConstellationGroup()
    saveState()
    identifyAndRouteAllGroups();
  }
}

function findConstellation(startNodeId) {
  const constellationNodes = new Set();
  const queue = [startNodeId];
  const visited = new Set([startNodeId]);
  const startNode = findNodeById(startNodeId);
  // Require starting from a node type that can be in a constellation
  if (!startNode || !CONSTELLATION_NODE_TYPES.includes(startNode.type)) {
      return constellationNodes;
  }

  while (queue.length > 0) {
      const currentNodeId = queue.shift();
      const currentNode = findNodeById(currentNodeId);
      if (!currentNode) continue;

      // Add node to constellation if it's the right type
      if (CONSTELLATION_NODE_TYPES.includes(currentNode.type)) {
          constellationNodes.add(currentNodeId);
      }

      // Check neighbours via ANY connection type now
      currentNode.connections.forEach((neighborId) => {
          if (!visited.has(neighborId)) {
              visited.add(neighborId);
              const neighborNode = findNodeById(neighborId);
              // Check if neighbor exists and is a type that should be grouped
              if (neighborNode && CONSTELLATION_NODE_TYPES.includes(neighborNode.type)) {
                  // Geen check meer op connection type hier, elke verbinding telt
                   queue.push(neighborId);
              }
          }
      });
  }
  return constellationNodes;
}

function findGroupContainingNode(nodeId) {
  if (nodeId === null || nodeId === undefined) return null;
  return identifiedGroups.find(group => group.nodeIds.has(nodeId));
}

function updateConstellationGroup() {

  if (!isAudioReady) return;

  const previousSelectedNodes = new Set(currentConstellationGroup); // Onthoud vorige selectie
  currentConstellationGroup.clear();
  nodes.forEach(n => n.isInConstellation = false);

  const selectedNodeElements = [...selectedElements].filter(el => el.type === 'node');
  const selectedNodeIds = new Set(selectedNodeElements.map(el => el.id));

  if (selectedNodeIds.size > 0 && currentTool === 'edit') {
      const firstSelectedId = selectedNodeIds.values().next().value;
      const firstSelectedNode = findNodeById(firstSelectedId);

      if (firstSelectedNode && CONSTELLATION_NODE_TYPES.includes(firstSelectedNode.type)) {
          const potentialConstellation = findConstellation(firstSelectedId);
          let allSelectedInGroup = true;
          selectedNodeIds.forEach(id => {
              if (!potentialConstellation.has(id)) {
                  allSelectedInGroup = false;
              }
          });

          if (allSelectedInGroup && potentialConstellation.size > 0) {
              potentialConstellation.forEach(id => {
                  const node = findNodeById(id);
                  if (node) node.isInConstellation = true; // Zet highlight flag
              });
              currentConstellationGroup = potentialConstellation; // Update de selectie set
          } else {
              // Als niet alle geselecteerde nodes in dezelfde groep zitten,
              // behandel het dan alsof er geen geldige groep geselecteerd is
              // voor de fluctuate controls. Laat currentConstellationGroup leeg.
          }
      }
  }

  // Update de UI voor het hamburger paneel (fluctuate controls)
  updateGroupControlsUI(); // Deze functie toont/verbergt #groupControls

  // Update de LFO's van de nodes die nu wel/niet moeten fluctueren
  // We moeten alle nodes doorlopen omdat de selectie veranderd kan zijn
   updateFluctuatingNodesLFO();

  // GEEN routing of gain management hier meer.
}
function rerouteAudioForNode(node, destinationNode) {
  if (!node || !node.audioNodes || !isAudioReady || !destinationNode) return;

  // Vind de hoofd gain node van de node (verschilt per type)
  const outputNode = node.audioNodes.gainNode || node.audioNodes.mainGain;
  if (!outputNode) return;

  const reverbSendGain = node.audioNodes.reverbSendGain;
  const delaySendGain = node.audioNodes.delaySendGain;

  try {
      // Verbreek *alle* bestaande verbindingen van de output node
      outputNode.disconnect();

      // Verbind met de nieuwe bestemming (master of group gain)
      outputNode.connect(destinationNode);

      // Verbind opnieuw met de effect sends (die gaan altijd naar de master effecten)
      if (reverbSendGain && isReverbReady && reverbNode) {
          outputNode.connect(reverbSendGain); // Output -> Reverb Send Gain
          try { reverbSendGain.disconnect(); } catch(e) {} // Zeker weten loskoppelen
          reverbSendGain.connect(reverbNode); // Reverb Send Gain -> Master Reverb
      }
      if (delaySendGain && isDelayReady && masterDelaySendGain) {
          outputNode.connect(delaySendGain); // Output -> Delay Send Gain
          try { delaySendGain.disconnect(); } catch(e) {} // Zeker weten loskoppelen
          delaySendGain.connect(masterDelaySendGain); // Delay Send Gain -> Master Delay Send Input
      }
       // console.log(`Node ${node.id} rerouted to destination ${destinationNode === masterGain ? 'Master' : 'Group Gain'}`);

  } catch (e) {
      console.error(`Error rerouting node ${node.id}:`, e);
      // Fallback: probeer opnieuw te verbinden met master gain als alles faalt
      try {
           outputNode.disconnect();
           outputNode.connect(masterGain);
           if (reverbSendGain && isReverbReady && reverbNode) outputNode.connect(reverbSendGain);
           if (delaySendGain && isDelayReady && masterDelaySendGain) outputNode.connect(delaySendGain);
      } catch (e2) {
           console.error(`Fallback rerouting for node ${node.id} also failed:`, e2);
      }
  }
}
function updateGroupControlsUI() {
  const selectionIsGroup = currentConstellationGroup.size > 0;
  if (groupControlsDiv) {
       groupControlsDiv.classList.toggle('hidden', !selectionIsGroup);
       if (selectionIsGroup) {
           groupNodeCountSpan.textContent = currentConstellationGroup.size;

           // Vind de overeenkomende geïdentificeerde groep voor de huidige selectie
           const firstSelectedNodeId = currentConstellationGroup.values().next().value;
           const selectedGroup = findGroupContainingNode(firstSelectedNodeId);

           // Stel de waarde en label van de hamburger slider in op die van de groep
           if (selectedGroup && selectedGroup.gainNode && groupVolumeSlider) {
               const currentGroupVol = selectedGroup.gainNode.gain.value;
               groupVolumeSlider.value = currentGroupVol;
               const originalLabel = document.querySelector('label[for="groupVolumeSlider"]');
               if (originalLabel && originalLabel.textContent.includes('(')) {
                    originalLabel.textContent = `Group Volume (${currentGroupVol.toFixed(2)}):`;
               }
           } else if (groupVolumeSlider) {
                // Geen overeenkomende groep gevonden of gain node mist
               groupVolumeSlider.value = 1.0; // Reset naar default?
               const originalLabel = document.querySelector('label[for="groupVolumeSlider"]');
                if (originalLabel && originalLabel.textContent.includes('(')) {
                    originalLabel.textContent = `Group Volume (--.--):`; // Geef onbekend aan
                }
           }

           // Update fluctuate controls (logica blijft grotendeels hetzelfde)
           let isGroupFluctuating = false;
           if (currentConstellationGroup.size > 0) {
                // Check of de geselecteerde nodes in de fluctuating set zitten
                // We checken hier alle nodes in de selectie voor consistentie
                isGroupFluctuating = [...currentConstellationGroup].some(id => fluctuatingGroupNodeIDs.has(id));
                // Of simpeler, alleen de eerste:
                // isGroupFluctuating = fluctuatingGroupNodeIDs.has(firstSelectedNodeId);
           }
           groupFluctuateToggle.checked = isGroupFluctuating;
           groupFluctuateAmount.disabled = !isGroupFluctuating;

       }
  }
  updateRestartPulsarsButtonVisibility();
}

function applyGroupFluctuationSettings() {
  updateFluctuatingNodesLFO(); // Roep de bijgewerkte versie aan
  // saveState(); // Wordt al gedaan bij change event van de slider/toggle
}

/**
* Werkt de LFO gain bij voor individuele nodes die in fluctuatingGroupNodeIDs staan.
*/
function updateFluctuatingNodesLFO() {
  if (!isAudioReady) return;
  const fluctuationAmount = parseFloat(groupFluctuateAmount.value);
  const now = audioContext.currentTime;

  nodes.forEach((node) => {
      // We richten ons op de individuele LFO die bij 'sound' nodes hoort
      if (node.type === "sound" && node.audioNodes?.volLfoGain) {
          // Moet deze specifieke node fluctueren?
          const shouldFluctuate = fluctuatingGroupNodeIDs.has(node.id);
          // Bepaal de LFO diepte: amount als hij moet fluctueren, anders 0
          const targetLfoDepth = shouldFluctuate ? fluctuationAmount : 0;

          try {
              // Pas de gain van de individuele volume LFO van de node aan
              node.audioNodes.volLfoGain.gain.setTargetAtTime(targetLfoDepth, now, 0.1);
          } catch (e) {
              console.error(`Error setting LFO gain for node ${node.id}:`, e);
          }
      }
      // Nebulas hebben hun eigen ingebouwde LFOs, die raken we hier niet aan.
      // Drums hebben geen volume LFO in de huidige setup.
  });
}

// Event Listeners voor Fluctuate Controls (zorg dat deze aanwezig zijn)
groupFluctuateToggle.addEventListener("change", (e) => {
   const isChecked = e.target.checked;
   // Pas de fluctuatingGroupNodeIDs aan op basis van de HUIDIGE selectie
   currentConstellationGroup.forEach(nodeId => {
        if (isChecked) {
            fluctuatingGroupNodeIDs.add(nodeId);
        } else {
            fluctuatingGroupNodeIDs.delete(nodeId);
        }
   });
   updateFluctuatingNodesLFO(); // Werk de LFOs bij
   groupFluctuateAmount.disabled = !isChecked;
   saveState(); // Sla de set met IDs op
});
groupFluctuateAmount.addEventListener("input", applyGroupFluctuationSettings);
groupFluctuateAmount.addEventListener("change", saveState);
function applyGroupFluctuationSettings() {
  updateFluctuatingNodesLFO()
  saveState()
}
function updateFluctuatingNodesLFO() {
  if (!isAudioReady) return
  const fluctuationAmount = parseFloat(groupFluctuateAmount.value)
  const now = audioContext.currentTime
  nodes.forEach((node) => {
    if (node.type === "sound" && node.audioNodes?.volLfoGain) {
      const shouldFluctuate = fluctuatingGroupNodeIDs.has(node.id)
      const targetDepth = shouldFluctuate
        ? fluctuationAmount
        : node.audioParams.volLfoDepth || 0
      try {
        node.audioNodes.volLfoGain.gain.setTargetAtTime(targetDepth, now, 0.1)
      } catch (e) {}
    }
  })
}

function calculateGridSpacing() {
  if (isGlobalSyncEnabled) {
    const pixelsPerBeat =
      PIXELS_PER_SIXTEENTH_AT_REF_BPM * 4 * (REFERENCE_BPM / globalBPM)
    return Math.max(5, pixelsPerBeat / 4)
  } else {
    return DEFAULT_GRID_SIZE_PX
  }
}
function snapToGrid(x, y) {
  const spacing = calculateGridSpacing()
  if (!isSnapEnabled || spacing <= 0) {
    return { x: x, y: y }
  }
  const snappedX = Math.round(x / spacing) * spacing
  const snappedY = Math.round(y / spacing) * spacing
  return { x: snappedX, y: snappedY }
}
function drawGrid() {
  const spacing = calculateGridSpacing()
  if (!isGridVisible || spacing <= 0) return
  ctx.strokeStyle =
    getComputedStyle(document.documentElement)
      .getPropertyValue("--grid-color")
      .trim() || "rgba(100, 130, 180, 0.15)"
  ctx.lineWidth = 0.5 / viewScale
  ctx.fillStyle = ctx.strokeStyle
  const worldTopLeft = getWorldCoords(0, 0)
  const worldBottomRight = getWorldCoords(canvas.width, canvas.height)
  const startX = Math.floor(worldTopLeft.x / spacing) * spacing
  const startY = Math.floor(worldTopLeft.y / spacing) * spacing
  const endX = Math.ceil(worldBottomRight.x / spacing) * spacing
  const endY = Math.ceil(worldBottomRight.y / spacing) * spacing
  if (gridType === "lines") {
    ctx.beginPath()
    for (let x = startX; x < endX; x += spacing) {
      ctx.moveTo(x, worldTopLeft.y)
      ctx.lineTo(x, worldBottomRight.y)
    }
    for (let y = startY; y < endY; y += spacing) {
      ctx.moveTo(worldTopLeft.x, y)
      ctx.lineTo(worldBottomRight.x, y)
    }
    ctx.stroke()
  } else {
    const dotSize = 2 / viewScale
    const dotOffset = dotSize / 2
    ctx.beginPath()
    for (let x = startX; x < endX; x += spacing) {
      for (let y = startY; y < endY; y += spacing) {
        ctx.fillRect(x - dotOffset, y - dotOffset, dotSize, dotSize)
      }
    }
  }
}

function drawConnection(conn) {
    const nA = findNodeById(conn.nodeAId);
    const nB = findNodeById(conn.nodeBId);
    if (!nA || !nB || !ctx) return; // Voeg ctx check toe

    const mX = (nA.x + nB.x) / 2;
    const mY = (nA.y + nB.y) / 2;
    const cX = mX + conn.controlPointOffsetX;
    const cY = mY + conn.controlPointOffsetY;
    const isSelected = isElementSelected('connection', conn.id);
    let clr;
    let thickness;
    let dash = [];

    // Bepaal stijl op basis van connectie type
    if (conn.type === 'string_violin') {
        clr = getComputedStyle(document.documentElement).getPropertyValue('--string-violin-connection-color').trim() || '#ffccaa';
        thickness = (1.5 + 2.0 * (1 - Math.min(1, conn.length / 500))) / viewScale;
        dash = [5 / viewScale, 3 / viewScale];
    } else if (conn.type === 'glide') {
        clr = GLIDE_LINE_COLOR; // Gebruik de roze-achtige kleur (gedefinieerd bovenaan)
        thickness = (GLIDE_LINE_WIDTH + 1.5 * (1 - Math.min(1, conn.length / 500))) / viewScale; // Gebruik glide dikte
        dash = [8 / viewScale, 4 / viewScale]; // Ander stippelpatroon
    } else { // Standaard connectie
        clr = getComputedStyle(document.documentElement).getPropertyValue('--connection-color').trim() || '#8AC';
        thickness = (1.0 + 1.5 * (1 - Math.min(1, conn.length / 500))) / viewScale;
        // dash = []; // Geen stippels voor standaard
    }

    // Bewaar huidige context staat
    ctx.save();

    ctx.strokeStyle = isSelected ? 'rgba(255, 255, 0, 0.9)' : clr;
    ctx.lineWidth = Math.max(0.5, thickness) + (isSelected ? (2 / viewScale) : 0);
    ctx.setLineDash(dash); // Pas stippellijn toe

    ctx.beginPath();
    ctx.moveTo(nA.x, nA.y);
    ctx.quadraticCurveTo(cX, cY, nB.x, nB.y);
    ctx.stroke();

    // Animatie voor string (kan blijven) - of misschien ook voor glide?
    if (conn.animationState > 0) {
        conn.animationState -= 0.1;
        conn.animationState = Math.max(0, conn.animationState);
        ctx.shadowColor = clr;
        ctx.shadowBlur = conn.animationState * 15 / viewScale;
        ctx.stroke(); // Teken nogmaals met schaduw
        ctx.shadowBlur = 0; // Reset schaduw
    }

    // Herstel context staat (inclusief line dash)
    ctx.restore();
}
function drawStarShape(ctx, x, y, points, outerR, innerR) {
  ctx.beginPath()
  const numPoints = Math.max(3, Math.round(points))
  for (let i = 0; i < numPoints * 2; i++) {
    const radius = i % 2 === 0 ? innerR : outerR
    const angle =
      (i / (numPoints * 2)) * Math.PI * 2 - Math.PI / 2 + Math.PI / numPoints
    const px = x + Math.cos(angle) * radius
    const py = y + Math.sin(angle) * radius
    if (i === 0) ctx.moveTo(px, py)
    else ctx.lineTo(px, py)
  }
  ctx.closePath()
}
function drawSatelliteShape(ctx, x, y, r, arms = 1) {
  const coreRadius = r * 0.5
  const armLength = r * 1.1
  const armWidth = r * 0.2
  const armAngleOffset = Math.PI / 4
  ctx.beginPath()
  ctx.arc(x, y, coreRadius, 0, Math.PI * 2)
  ctx.fill()
  ctx.stroke()
  for (let i = 0; i < arms; i++) {
    const angle = (i / arms) * Math.PI * 2 + armAngleOffset
    const armStartX = x + Math.cos(angle) * coreRadius * 1.1
    const armStartY = y + Math.sin(angle) * coreRadius * 1.1
    const armEndX = x + Math.cos(angle) * armLength
    const armEndY = y + Math.sin(angle) * armLength
    const anglePerp = angle + Math.PI / 2
    const halfWidth = armWidth / 2
    ctx.beginPath()
    ctx.moveTo(
      armStartX + Math.cos(anglePerp) * halfWidth,
      armStartY + Math.sin(anglePerp) * halfWidth
    )
    ctx.lineTo(
      armEndX + Math.cos(anglePerp) * halfWidth,
      armEndY + Math.sin(anglePerp) * halfWidth
    )
    ctx.lineTo(
      armEndX - Math.cos(anglePerp) * halfWidth,
      armEndY - Math.sin(anglePerp) * halfWidth
    )
    ctx.lineTo(
      armStartX - Math.cos(anglePerp) * halfWidth,
      armStartY + Math.sin(anglePerp) * halfWidth
    )
    ctx.closePath()
    ctx.fill()
    ctx.stroke()
  }
}

function drawNode(node) {
  ctx.shadowBlur = 0;
  const isSelected = isElementSelected("node", node.id);
  const isSelectedAndOutlineNeeded = isSelected && currentTool === "edit";
  const flashDuration = 0.1;
  let preTriggerFlash = 0;
  let wobbleX = 0, wobbleY = 0;
  const now = audioContext ? audioContext.currentTime : performance.now() / 1000;

  if (
      isPlaying &&
      isGlobalSyncEnabled &&
      node.isStartNode &&
      isSelectedAndOutlineNeeded &&
      node.nextSyncTriggerTime > 0 &&
      node.type !== "pulsar_random_particles"
  ) {
      const timeToNext =
          node.nextSyncTriggerTime - (audioContext?.currentTime ?? 0);
      if (timeToNext > 0 && timeToNext < flashDuration) {
          preTriggerFlash = (1.0 - timeToNext / flashDuration) * 0.6;
      }
  }

  if (node.animationState > 0 && !node.isTriggered) {
      node.animationState -=
          ["sound", "nebula", PORTAL_NEBULA_TYPE].includes(node.type) || isDrumType(node.type)
              ? 0.05
              : 0.1;
  }
  node.animationState = Math.max(0, node.animationState);
  const bloomFactor = 1 + node.animationState * 0.5 + preTriggerFlash * 0.6;
  const currentRadius = NODE_RADIUS_BASE * node.size * bloomFactor;
  let fillColor, borderColor, glowColor;
  const styles = getComputedStyle(document.documentElement);
  const scaleBase = currentScale.baseHSL || { h: 200, s: 70, l: 70 };
  const isStartNodeDisabled = node.isStartNode && !node.isEnabled;
  const disabledFillColorGeneral = styles
      .getPropertyValue("--start-node-disabled-color")
      .trim();
  const disabledBorderColorGeneral = styles
      .getPropertyValue("--start-node-disabled-border")
      .trim();

  if (isPulsarType(node.type)) {
      const cssVarBase = `--${node.type.replace("_", "-")}`;
      const defaultFillVar = `${cssVarBase}-color`;
      const defaultBorderVar = `${cssVarBase}-border`;
      const defaultFill = styles.getPropertyValue(defaultFillVar, styles.getPropertyValue("--start-node-color")).trim();
      const defaultBorder = styles.getPropertyValue(defaultBorderVar, styles.getPropertyValue("--start-node-border")).trim();
      fillColor = isStartNodeDisabled ? disabledFillColorGeneral : node.color || defaultFill;
      borderColor = isStartNodeDisabled ? disabledBorderColorGeneral : node.color ? node.color.replace(/[\d\.]+\)$/g, "1)") : defaultBorder;
      glowColor = isStartNodeDisabled ? "transparent" : borderColor;
  } else if (isDrumType(node.type)) {
      const typeName = node.type.replace("_", "-");
      fillColor = styles.getPropertyValue(`--${typeName}-color`).trim();
      borderColor = styles.getPropertyValue(`--${typeName}-border`).trim();
      glowColor = borderColor;
  } else if (node.type === "gate") {
      fillColor = styles.getPropertyValue("--gate-node-color").trim();
      borderColor = styles.getPropertyValue("--gate-node-border").trim();
      glowColor = borderColor;
  } else if (node.type === "probabilityGate") {
      fillColor = styles.getPropertyValue("--probability-gate-node-color").trim();
      borderColor = styles.getPropertyValue("--probability-gate-node-border").trim();
      glowColor = borderColor;
  } else if (node.type === "pitchShift") {
      fillColor = styles.getPropertyValue("--pitch-node-color").trim();
      borderColor = styles.getPropertyValue("--pitch-node-border").trim();
      glowColor = borderColor;
  } else if (node.type === "relay") {
      fillColor = styles.getPropertyValue("--relay-node-color").trim();
      borderColor = styles.getPropertyValue("--relay-node-border").trim();
      glowColor = borderColor;
  } else if (node.type === "reflector") {
      fillColor = styles.getPropertyValue("--reflector-node-color").trim();
      borderColor = styles.getPropertyValue("--reflector-node-border").trim();
      glowColor = borderColor;
  } else if (node.type === "switch") {
      fillColor = styles.getPropertyValue("--switch-node-color").trim();
      borderColor = styles.getPropertyValue("--switch-node-border").trim();
      glowColor = borderColor;
  } else if (node.type === "sound" || node.type === "nebula" || node.type === PORTAL_NEBULA_TYPE) {
      const nodeBaseHue = ( (node.type === "nebula" || node.type === PORTAL_NEBULA_TYPE) && node.baseHue !== null && node.baseHue !== undefined)
          ? node.baseHue
          : (scaleBase.h + (node.audioParams.scaleIndex % currentScale.notes.length) * HUE_STEP) % 360;
      const lightness = scaleBase.l * (0.8 + node.size * 0.2);
      const saturation = scaleBase.s * (node.type === "nebula" ? 0.7 : (node.type === PORTAL_NEBULA_TYPE ? 0.9 : 1.0));
      const alpha = (node.type === "nebula" ? 0.5 : (node.type === PORTAL_NEBULA_TYPE ? 0.7 : 0.6)) + node.size * 0.3;
      fillColor = hslToRgba(nodeBaseHue, saturation, lightness, Math.min(0.95, alpha));
      borderColor = hslToRgba(nodeBaseHue, saturation * 0.8, lightness * 0.6, 0.9);
      glowColor = hslToRgba(nodeBaseHue, saturation, lightness * 1.1, 1.0);
  } else {
      fillColor = "grey"; borderColor = "darkgrey"; glowColor = "white";
  }

  ctx.fillStyle = fillColor;
  ctx.strokeStyle = borderColor;
  const baseLineWidth =
      (node.isStartNode ? 2.5 : node.type === "relay" || node.type === "reflector" || node.type === "switch" ? 1.0 : 1.5) / viewScale;
  ctx.lineWidth = Math.max(0.5, isSelectedAndOutlineNeeded ? baseLineWidth + 1.5 / viewScale : baseLineWidth);

  let needsRestore = false;
  if (
      (node.type === "gate" || (node.type === "sound" && node.audioParams.waveform?.startsWith("sampler_"))) &&
      node.currentAngle !== undefined
  ) {
      ctx.save();
      ctx.translate(node.x, node.y);
      if (node.type === "gate") {
          ctx.rotate(node.currentAngle);
      } else if (node.type === "sound" && node.audioParams.waveform.startsWith("sampler_")) {
          node.currentAngle = (node.currentAngle + 0.005 * (performance.now() * 0.01)) % (Math.PI * 2);
          ctx.rotate(node.currentAngle);
      }
      ctx.translate(-node.x, -node.y);
      needsRestore = true;
  }

  if (node.isInConstellation && currentTool === "edit") {
      const highlightRadius = NODE_RADIUS_BASE * node.size + 5 / viewScale;
      ctx.fillStyle = styles.getPropertyValue("--constellation-highlight").trim() || "rgba(255, 255, 150, 0.15)";
      ctx.beginPath();
      ctx.arc(node.x, node.y, highlightRadius, 0, Math.PI * 2);
      ctx.fill();
  }

  if (
      (node.animationState > 0 || preTriggerFlash > 0 || isSelectedAndOutlineNeeded || node.type === "nebula" || node.type === PORTAL_NEBULA_TYPE) &&
      !isStartNodeDisabled
  ) {
      ctx.shadowColor = glowColor;
      let glowAmount = (node.isStartNode || node.type === "nebula" || node.type === PORTAL_NEBULA_TYPE || isDrumType(node.type) ? 5 : 0) + (node.animationState + preTriggerFlash) * 15 + (isSelectedAndOutlineNeeded ? 5 : 0);
      if ((node.type === "gate"|| node.type === "probabilityGate" || node.type === "pitchShift" || node.type === "relay" || node.type === "reflector" || node.type === "switch") && node.animationState > 0) {
          glowAmount = 10 + node.animationState * 10 + (isSelectedAndOutlineNeeded ? 5 : 0);
      } else if (isSelectedAndOutlineNeeded && (node.type === "gate"|| node.type === "probabilityGate" || node.type === "pitchShift" || node.type === "relay" || node.type === "reflector" || node.type === "switch")) {
          glowAmount = 5;
      } else if (node.type === "nebula") {
          const pulseEffect = (Math.sin(node.pulsePhase) * 0.5 + 0.5) * 8;
          glowAmount = 3 + pulseEffect + (isSelectedAndOutlineNeeded ? 5 : 0);
      } else if (node.type === PORTAL_NEBULA_TYPE) {
           const pulseEffectGlow = (Math.sin(node.pulsePhase * 0.8) * 0.5 + 0.5) * 15;
           glowAmount = 10 + pulseEffectGlow + (isSelectedAndOutlineNeeded ? 5 : 0);
      }
      ctx.shadowBlur = Math.min(40, glowAmount) / viewScale; // Increased max glow slightly
  } else {
      ctx.shadowBlur = 0;
  }

  const r = currentRadius;

  if (node.type === "sound") {
      const waveform = node.audioParams.waveform;
      switch (waveform) {
          case "sine": ctx.beginPath(); ctx.arc(node.x, node.y, r, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); break;
          case "square": ctx.beginPath(); ctx.rect(node.x - r * 0.9, node.y - r * 0.9, r * 1.8, r * 1.8); ctx.fill(); ctx.stroke(); break;
          case "triangle": case "sawtooth": ctx.beginPath(); ctx.moveTo(node.x, node.y - r); ctx.lineTo(node.x + r * 0.866, node.y + r * 0.5); ctx.lineTo(node.x - r * 0.866, node.y + r * 0.5); ctx.closePath(); ctx.fill(); ctx.stroke(); break;
          case "fmBell": case "fmXylo": drawStarShape(ctx, node.x, node.y, 5, r, r * 0.5); ctx.fill(); ctx.stroke(); break;
          case "sampler_marimba": drawSatelliteShape(ctx, node.x, node.y, r, 1); break;
          case "sampler_piano": drawSatelliteShape(ctx, node.x, node.y, r, 2); break;
          case "sampler_flute": drawSatelliteShape(ctx, node.x, node.y, r * 0.9, 3); break;
          default: ctx.beginPath(); ctx.arc(node.x, node.y, r, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); break;
      }
  } else if (node.type === "gate") {
      const innerRadius = r * 0.4; const shieldRadius = r * 0.85; const openingStartAngle = -GATE_ANGLE_SIZE / 2; const openingEndAngle = GATE_ANGLE_SIZE / 2; ctx.beginPath(); ctx.arc(node.x, node.y, r, 0, Math.PI * 2); ctx.stroke(); ctx.fillStyle = fillColor + "90"; ctx.fill(); ctx.fillStyle = borderColor + "A0"; ctx.beginPath(); ctx.moveTo(node.x + Math.cos(openingEndAngle) * innerRadius, node.y + Math.sin(openingEndAngle) * innerRadius); ctx.lineTo(node.x + Math.cos(openingEndAngle) * shieldRadius, node.y + Math.sin(openingEndAngle) * shieldRadius); ctx.arc(node.x, node.y, shieldRadius, openingEndAngle, openingStartAngle + Math.PI * 2, false); ctx.lineTo(node.x + Math.cos(openingStartAngle) * innerRadius, node.y + Math.sin(openingStartAngle) * innerRadius); ctx.arc(node.x, node.y, innerRadius, openingStartAngle + Math.PI * 2, openingEndAngle, true); ctx.closePath(); ctx.fill();
      let shouldPassVisual = false; const mode = GATE_MODES[node.gateModeIndex || 0]; if (mode === "RAND") { shouldPassVisual = node.lastRandomGateResult; } else { const counterCheck = node.gateCounter || 0; switch (mode) { case "1/2": if (counterCheck % 2 === 0) shouldPassVisual = true; break; case "1/3": if (counterCheck % 3 === 0) shouldPassVisual = true; break; case "1/4": if (counterCheck % 4 === 0) shouldPassVisual = true; break; case "2/3": if (counterCheck % 3 !== 0) shouldPassVisual = true; break; case "3/4": if (counterCheck % 4 !== 0) shouldPassVisual = true; break; } }
      if (node.animationState > 0 && shouldPassVisual) { ctx.save(); ctx.strokeStyle = styles.getPropertyValue("--pulse-visual-color").trim() || "rgba(255, 255, 255, 0.9)"; ctx.lineWidth = Math.max(1, 2.5 / viewScale); ctx.shadowColor = glowColor; ctx.shadowBlur = 10 / viewScale; ctx.beginPath(); ctx.arc(node.x, node.y, r * 0.9, openingStartAngle, openingEndAngle); ctx.stroke(); ctx.restore(); }
  } else if (node.type === "probabilityGate") {
      ctx.beginPath(); ctx.arc(node.x, node.y, r, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); const fontSize = Math.max(8, (r * 0.8) / viewScale); ctx.font = `bold ${fontSize}px sans-serif`; ctx.fillStyle = borderColor; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText("%", node.x, node.y + fontSize * 0.1);
  } else if (node.type === "pitchShift") {
      ctx.beginPath(); ctx.arc(node.x, node.y, r, 0, Math.PI * 2); ctx.stroke(); ctx.fillStyle = fillColor + "90"; ctx.fill(); if (node.animationState < 0.5) { ctx.fillStyle = borderColor; ctx.beginPath(); const arrowSize = r * 0.5; const arrowY = node.y - arrowSize * 0.3; ctx.moveTo(node.x, arrowY - arrowSize / 2); ctx.lineTo(node.x - arrowSize / 2, arrowY + arrowSize / 2); ctx.lineTo(node.x + arrowSize / 2, arrowY + arrowSize / 2); ctx.closePath(); ctx.fill(); }
  } else if (node.type === "relay") {
      ctx.beginPath(); ctx.arc(node.x, node.y, r * 0.6, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  } else if (node.type === "reflector") {
      ctx.beginPath(); ctx.arc(node.x, node.y, r, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); const fontSize = Math.max(8, (r * 0.9) / viewScale); ctx.font = `${fontSize}px sans-serif`; ctx.fillStyle = borderColor; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText("⟲", node.x, node.y + fontSize * 0.1);
  } else if (node.type === "switch") {
      ctx.beginPath(); ctx.moveTo(node.x - r * 0.8, node.y + r * 0.8); ctx.lineTo(node.x, node.y - r); ctx.lineTo(node.x + r * 0.8, node.y + r * 0.8); ctx.closePath(); ctx.fill(); ctx.stroke();
  }
  else if (node.type === "nebula") {
      wobbleX = Math.sin(now * 0.1 + node.id) * (2 / viewScale);
      wobbleY = Math.cos(now * 0.07 + node.id * 2) * (2 / viewScale);
      const nodeBaseHue = (node.baseHue !== null && node.baseHue !== undefined) ? node.baseHue : (scaleBase.h + (node.audioParams.scaleIndex % currentScale.notes.length) * HUE_STEP) % 360;
      const baseSaturation = scaleBase.s * 0.8;
      const baseLightness = scaleBase.l * (0.7 + node.size * 0.2);
      const hueShiftSpeed = 10;
      const currentHue = (nodeBaseHue + (now * hueShiftSpeed)) % 360;
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      ctx.translate(node.x + wobbleX, node.y + wobbleY);
      const numBlobs = 5;
      const baseRadius = NODE_RADIUS_BASE * node.size * 1.1;
      for (let i = 0; i < numBlobs; i++) {
          const angleOffset = (now * (0.1 + i * 0.02) + node.id + i * 1.1);
          const distFactor = 0.15 + ((Math.sin(now * 0.15 + i * 0.9) + 1) / 2) * 0.25;
          const offsetX = Math.cos(angleOffset) * baseRadius * distFactor;
          const offsetY = Math.sin(angleOffset) * baseRadius * distFactor;
          const radiusFactor = 0.6 + ((Math.cos(now * 0.2 + i * 1.3) + 1) / 2) * 0.4;
          const blobRadius = baseRadius * radiusFactor * 0.7;
          const blobAlpha = 0.15 + ((Math.sin(now * 0.25 + i * 1.5) + 1) / 2) * 0.15;
          const blobLightness = baseLightness * (0.95 + ((Math.cos(now * 0.18 + i) + 1) / 2) * 0.15);
          const blobSaturation = baseSaturation * (0.9 + ((Math.sin(now * 0.22 + i * 0.5) + 1) / 2) * 0.15);
          const finalBlobAlpha = Math.min(1.0, blobAlpha * 1.5);
          ctx.fillStyle = hslToRgba(currentHue, blobSaturation, blobLightness, finalBlobAlpha);
          ctx.beginPath();
          ctx.arc(offsetX, offsetY, blobRadius, 0, Math.PI * 2);
          ctx.fill();
      }
      const coreRadius = baseRadius * 0.3;
      const coreAlpha = 0.3;
      ctx.fillStyle = hslToRgba(currentHue, baseSaturation * 1.1, baseLightness * 1.1, coreAlpha);
      ctx.beginPath();
      ctx.arc(0, 0, coreRadius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      ctx.save();
      const currentGlowColor = hslToRgba(currentHue, baseSaturation, baseLightness * 1.1, 1.0); // Gebruik berekende glowColor
      ctx.shadowColor = currentGlowColor;
      const pulseEffect = (Math.sin(node.pulsePhase) * 0.5 + 0.5) * 8;
      const currentGlowAmount = 3 + pulseEffect + (isSelectedAndOutlineNeeded ? 5 : 0);
      ctx.shadowBlur = Math.min(20, currentGlowAmount) / viewScale;
      ctx.fillStyle = "rgba(0,0,0,0)";
      ctx.beginPath();
      ctx.arc(node.x + wobbleX, node.y + wobbleY, baseRadius * 0.8, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

  } else if (node.type === PORTAL_NEBULA_TYPE) {
      const defaults = PORTAL_NEBULA_DEFAULTS;
      const pulseSpeed = defaults.pulseSpeed;
      const baseRadius = NODE_RADIUS_BASE * node.size;
      const nodeBaseHue = node.baseHue ?? defaults.baseColorHue;
      const hueShiftSpeed = 5;
      const currentHue = (nodeBaseHue + (now * hueShiftSpeed)) % 360;
      const saturation = scaleBase.s * 0.9;
      const lightness = scaleBase.l * 1.1;
      ctx.save();
      const currentGlowColor = hslToRgba(currentHue, saturation, lightness * 1.2, 0.8);
      ctx.shadowColor = currentGlowColor;
      const pulseEffectGlow = (Math.sin(node.pulsePhase * 0.8) * 0.5 + 0.5) * 15;
      const currentGlowAmount = 10 + pulseEffectGlow + (isSelectedAndOutlineNeeded ? 5 : 0);
      ctx.shadowBlur = Math.min(40, currentGlowAmount) / viewScale;
      const irisRadiusFactor = 0.4 + Math.sin(node.pulsePhase * pulseSpeed) * 0.1;
      const irisRadius = baseRadius * irisRadiusFactor;
      const irisAlpha = 0.7 + Math.sin(node.pulsePhase * pulseSpeed) * 0.2;
      ctx.fillStyle = hslToRgba(currentHue, saturation * 1.1, lightness * 1.2, irisAlpha);
      ctx.beginPath();
      ctx.arc(node.x, node.y, Math.max(1, irisRadius), 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      const numRings = 4;
      const originalLineWidth = ctx.lineWidth; // Bewaar originele lijndikte
      ctx.lineWidth = Math.max(0.5, 1.5 / viewScale);
      for (let i = 1; i <= numRings; i++) {
          const ringPulsePhase = node.pulsePhase * (pulseSpeed * (1 + i * 0.1));
          const ringRadiusFactor = 0.6 + i * 0.25 + Math.sin(ringPulsePhase) * 0.08;
          const ringRadius = baseRadius * ringRadiusFactor;
          const ringAlpha = 0.1 + (1 - i / numRings) * 0.3 + Math.sin(ringPulsePhase) * 0.05;
          const ringLightness = lightness * (1.0 - i * 0.1);
          ctx.strokeStyle = hslToRgba(currentHue, saturation * (1.0 - i*0.05), ringLightness, ringAlpha);
          ctx.beginPath();
          if (ringRadius > 0) {
              ctx.arc(node.x, node.y, ringRadius, 0, Math.PI * 2);
              ctx.stroke();
          }
      }
       ctx.lineWidth = originalLineWidth; // Herstel lijndikte

  } else if (isDrumType(node.type)) {
      const icon = DRUM_ELEMENT_DEFAULTS[node.type]?.icon || "?"; const fontSize = Math.max(8, (r * 0.9) / viewScale); ctx.font = `bold ${fontSize}px sans-serif`; ctx.fillStyle = borderColor; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.beginPath(); ctx.rect(node.x - r, node.y - r, r * 2, r * 2); ctx.fill(); ctx.stroke(); try { ctx.fillStyle = fillColor.replace(/[\d\.]+\)$/g, "1)"); } catch(e) { ctx.fillStyle = '#ffffff'; } ctx.fillText(icon, node.x, node.y + fontSize * 0.1);
  } else if (node.isStartNode) {
      const points = node.starPoints || 6; const outerR = r; const innerR = outerR * 0.4; drawStarShape(ctx, node.x, node.y, points, outerR, innerR); ctx.fill(); ctx.stroke();
      if (node.type === "pulsar_triggerable") { const lockSize = outerR * 0.5; ctx.fillStyle = isStartNodeDisabled ? disabledFillColorGeneral : borderColor; ctx.strokeStyle = isStartNodeDisabled ? disabledBorderColorGeneral : fillColor; ctx.lineWidth = baseLineWidth * 0.5; ctx.beginPath(); ctx.rect(node.x - lockSize * 0.3, node.y - lockSize * 0.25, lockSize * 0.6, lockSize * 0.5); ctx.moveTo(node.x + lockSize * 0.3, node.y - lockSize * 0.25); ctx.arc(node.x, node.y - lockSize * 0.25, lockSize * 0.4, 0, Math.PI, true); ctx.stroke(); }
  } else {
      ctx.beginPath(); ctx.arc(node.x, node.y, r, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  }

  if (isSelectedAndOutlineNeeded) {
      ctx.save();
      ctx.shadowBlur = 0;
      ctx.strokeStyle = "rgba(255, 255, 0, 0.9)";
      ctx.lineWidth = Math.max(0.5, 1.5 / viewScale);
      ctx.beginPath();
      const outlineRadius = NODE_RADIUS_BASE * node.size + 2 / viewScale;
      const finalOutlineX = node.x + wobbleX; // Gebruik wobble voor nebula/portal outline
      const finalOutlineY = node.y + wobbleY;
      ctx.arc(finalOutlineX, finalOutlineY, outlineRadius, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
  }

  if (needsRestore) {
      ctx.restore();
  }
  ctx.shadowBlur = 0;

  if (isInfoTextVisible) {
      const fontSize = Math.max(8, 10 / viewScale);
      ctx.font = `bold ${fontSize}px sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      let labelText = "";
      let secondLineText = "";
      const baseRadiusForLabel = NODE_RADIUS_BASE * node.size;
      let labelYOffset = baseRadiusForLabel * 1.1 + fontSize / 1.5 + 2 / viewScale;
      ctx.fillStyle = "rgba(255, 255, 255, 0.8)";

      if (node.type === "sound" || node.type === "nebula") {
          labelText = getNoteNameFromScaleIndex(currentScale, node.audioParams.scaleIndex);
           if (node.type === "sound" && node.audioParams.waveform?.startsWith("sampler_")) {
               labelYOffset = baseRadiusForLabel * 1.3 + fontSize / 1.5 + 2 / viewScale;
           } else if (node.type === "nebula") {
              labelYOffset = (baseRadiusForLabel * 1.1) * 1.2 + fontSize / 1.5 + 2 / viewScale; // Iets lager voor blob
           }
      } else if (node.type === PORTAL_NEBULA_TYPE) {
           labelText = "Portal";
           labelYOffset = (baseRadiusForLabel * 1.1) + fontSize / 1.5 + 2 / viewScale; // Onder portal
      } else if (isPulsarType(node.type)) {
          let typeLabel = pulsarTypes.find((pt) => pt.type === node.type)?.label || "Pulsar";
          labelText = typeLabel; if (!node.isEnabled) labelText += " (Off)";
          if (node.type === "pulsar_random_volume") { secondLineText = `Int: Random`; }
          else { if (node.type === "pulsar_random_particles") { secondLineText = "Timing: Random"; } else if (isGlobalSyncEnabled) { const subdiv = subdivisionOptions[node.syncSubdivisionIndex]; secondLineText = `Sync: ${subdiv?.label ?? "?"}`; } else { secondLineText = `Intv: ${(node.audioParams.triggerInterval || DEFAULT_TRIGGER_INTERVAL).toFixed(1)}s`; } if (node.type !== "pulsar_random_volume") { secondLineText += ` | Int: ${(node.audioParams.pulseIntensity ?? DEFAULT_PULSE_INTENSITY).toFixed(1)}`; } }
          if (secondLineText) labelYOffset += fontSize * 0.5;
      } else if (isDrumType(node.type)) {
          labelText = DRUM_ELEMENT_DEFAULTS[node.type]?.label || "Drum";
          labelYOffset = baseRadiusForLabel + fontSize / 1.5 + 2 / viewScale;
      } else if (node.type === "gate") { labelText = GATE_MODES[node.gateModeIndex || 0];
      } else if (node.type === "probabilityGate") { labelText = `${(node.audioParams.probability * 100).toFixed(0)}%`;
      } else if (node.type === "pitchShift") { const amount = PITCH_SHIFT_AMOUNTS[node.pitchShiftIndex || 0]; labelText = (amount > 0 ? "+" : "") + amount + (node.pitchShiftAlternating ? " ⇄" : "");
      } else if (node.type === "relay") { labelText = "Relay"; labelYOffset = (baseRadiusForLabel * 0.6) + fontSize / 1.5 + 2 / viewScale;
      } else if (node.type === "reflector") { labelText = "Reflector";
      } else if (node.type === "switch") { labelText = "Switch"; labelYOffset = baseRadiusForLabel * 0.9 + fontSize / 1.5 + 2 / viewScale;
      }

      const finalLabelX = node.x + wobbleX;
      const finalLabelYBase = node.y + wobbleY;
      if (labelText) { ctx.fillText(labelText, finalLabelX, finalLabelYBase + labelYOffset); }
      if (secondLineText) { ctx.fillText(secondLineText, finalLabelX, finalLabelYBase + labelYOffset + fontSize * 1.1); }
  }
  ctx.shadowBlur = 0;
}






function drawTemporaryConnection() {
    // Alleen tekenen als we daadwerkelijk een connectie aan het slepen zijn
    if (isConnecting && connectingNode) {
        ctx.beginPath();
        ctx.moveTo(connectingNode.x, connectingNode.y); // Van start node
        ctx.lineTo(mousePos.x, mousePos.y); // Naar huidige muispositie

        // Kies stijl op basis van connectionTypeToAdd (bepaald in handleMouseDown)
        let strokeStyle = 'rgba(255, 255, 255, 0.5)'; // Default (voor standaard connect)
        let lineWidth = 1 / viewScale;
        let lineDash = [5 / viewScale, 5 / viewScale];

        if (connectionTypeToAdd === 'string_violin') {
            strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--string-violin-connection-color').trim() || '#ffccaa';
            lineWidth = 2 / viewScale;
            lineDash = [5 / viewScale, 3 / viewScale];
        } else if (connectionTypeToAdd === 'glide') {
            // Gebruik de constanten die we eerder hebben gedefinieerd
            strokeStyle = GLIDE_LINE_COLOR;
            lineWidth = GLIDE_LINE_WIDTH / viewScale;
            lineDash = [8 / viewScale, 4 / viewScale]; // Specifiek patroon voor glide
        }

        // Bewaar context staat (belangrijk!)
        ctx.save();
        ctx.strokeStyle = strokeStyle;
        ctx.lineWidth = Math.max(0.5, lineWidth); // Zorg voor minimale dikte
        ctx.setLineDash(lineDash);
        ctx.stroke();
        // Herstel context staat (reset lineDash etc.)
        ctx.restore();
    }
}

function drawSelectionRect() {
  if (isSelecting && selectionRect.active) {
    const x = Math.min(selectionRect.startX, selectionRect.endX)
    const y = Math.min(selectionRect.startY, selectionRect.endY)
    const w = Math.abs(selectionRect.startX - selectionRect.endX)
    const h = Math.abs(selectionRect.startY - selectionRect.endY)
    const rectColor =
      getComputedStyle(document.documentElement)
        .getPropertyValue("--selection-rect-color")
        .trim() || "rgba(150,200,255,0.3)"
    ctx.fillStyle = rectColor
    ctx.fillRect(x, y, w, h)
    ctx.strokeStyle = "rgba(255,255,255,0.6)"
    ctx.lineWidth = 1 / viewScale
    ctx.strokeRect(x, y, w, h)
  }
}
function drawBackground(now) {
  bgAngle += 0.0002
  const topLeft = getWorldCoords(0, 0)
  const bottomRight = getWorldCoords(canvas.width, canvas.height)
  const worldWidth = bottomRight.x - topLeft.x
  const worldHeight = bottomRight.y - topLeft.y
  const worldCenterX = topLeft.x + worldWidth / 2
  const worldCenterY = topLeft.y + worldHeight / 2
  const diagonal =
    Math.sqrt(worldWidth * worldWidth + worldHeight * worldHeight) * 0.7
  const gradX1 = worldCenterX + Math.cos(bgAngle) * diagonal
  const gradY1 = worldCenterY + Math.sin(bgAngle) * diagonal
  const gradX2 = worldCenterX + Math.cos(bgAngle + Math.PI) * diagonal
  const gradY2 = worldCenterY + Math.sin(bgAngle + Math.PI) * diagonal
  const color1 =
    getComputedStyle(document.documentElement)
      .getPropertyValue("--bg-gradient-stop-1")
      .trim() || "#1a2a40"
  const color2 =
    getComputedStyle(document.documentElement)
      .getPropertyValue("--bg-gradient-stop-2")
      .trim() || "#2c3a5f"
  const gradient = ctx.createLinearGradient(gradX1, gradY1, gradX2, gradY2)
  gradient.addColorStop(0, color1)
  gradient.addColorStop(1, color2)
  ctx.fillStyle = gradient
  ctx.fillRect(topLeft.x, topLeft.y, worldWidth, worldHeight)
}
function draw() {
  const now = audioContext ? audioContext.currentTime : performance.now() / 1000;
  const deltaTime = Math.max(0, Math.min(0.1, now - (previousFrameTime || now)));
  ctx.save();
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.translate(viewOffsetX, viewOffsetY);
  ctx.scale(viewScale, viewScale);
  drawBackground(now);
  drawGrid();
  updateFluctuatingNodesLFO();
  updateAndDrawParticles(deltaTime, now);
  connections.forEach(drawConnection);
  nodes.forEach((node) => drawNode(node));

  const nebulas = nodes.filter(n => n.type === "nebula");
  for (let i = 0; i < nebulas.length; i++) {
      for (let j = i + 1; j < nebulas.length; j++) {
          const a = nebulas[i];
          const b = nebulas[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
              const alpha = 0.35 * Math.max(0, (1 - dist / 120));
              drawPlasmaBridge(ctx, a, b, alpha);
          }
      }
  }

  updateAndDrawPulses(now);

  if (currentTool === 'brush' && isBrushing && lastBrushNode) {
      ctx.save();
      let lineColor = 'rgba(255, 255, 100, 0.6)';
      const pulseAlpha = 0.3 + (Math.sin(now * 6) + 1) * 0.25;
      const finalLineColor = lineColor.replace(/[\d\.]+\)$/g, `${pulseAlpha})`);
      ctx.strokeStyle = finalLineColor;
      ctx.lineWidth = Math.max(0.8, 1.5 / viewScale);
      ctx.setLineDash([5 / viewScale, 3 / viewScale]);
      ctx.beginPath();
      ctx.moveTo(lastBrushNode.x, lastBrushNode.y);
      ctx.lineTo(mousePos.x, mousePos.y);
      ctx.stroke();
      ctx.restore();
  }

  if (currentTool === 'connect' || currentTool === 'connect_string' || currentTool === 'connect_glide') {
      drawTemporaryConnection();
  }
  drawSelectionRect();

  ctx.restore();
  previousFrameTime = now;
  ctx.setLineDash([]);
}
function updateNebulaInteractionAudio() {
    // Check of audio context etc. klaar zijn (zoals voorheen)
    if (!audioContext || !nodes || nodes.length < 2) return;

    const now = audioContext.currentTime;
    const interactionTimeConstant = 0.1; // Soepelheid van overgangen
    const nebulas = nodes.filter(n => n.type === "nebula");
    const currentInteractingKeys = new Set();
    const previouslyCloseKeys = new Set(activeNebulaInteractions.keys());

    // Stap 1: Vind huidige interacties
    for (let i = 0; i < nebulas.length; i++) {
        for (let j = i + 1; j < nebulas.length; j++) {
            const a = nebulas[i];
            const b = nebulas[j];
            // Extra checks of alle benodigde audio nodes bestaan!
            if (!a.audioNodes?.filterNode || !b.audioNodes?.filterNode ||
                !a.audioNodes.oscillators || !b.audioNodes.oscillators ||
                !a.audioNodes.filterLfo?.frequency || !b.audioNodes.filterLfo?.frequency // Check of LFO en frequency param bestaan
               ) continue;

            const dx = a.x - b.x;
            const dy = a.y - b.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const pairKey = `${Math.min(a.id, b.id)}-${Math.max(a.id, b.id)}`;

            if (dist < 120) {
                currentInteractingKeys.add(pairKey);
                // Modulatie factor: 0 = ver weg (120), 1 = heel dichtbij (0)
                const modFactor = Math.max(0, Math.min(1, 1.0 - (dist / 120.0)));
                activeNebulaInteractions.set(pairKey, { a, b, modFactor }); // Sla staat op

                try {
                    // --- A. Filter Cutoff Modulatie (bestaand) ---
                    const baseFreqA = a.audioParams.pitch;
                    const sizeRangeA = MAX_NODE_SIZE - MIN_NODE_SIZE;
                    const normalizedSizeA = (a.size - MIN_NODE_SIZE) / (sizeRangeA || 1);
                    // Herbereken de 'normale' filter frequentie zoals in updateNodeAudioParams
                    const defaultFilterFreqA = baseFreqA * 2 + normalizedSizeA * baseFreqA * (a.audioParams.filterFreqFactor || 12); // Gebruik factor uit params indien aanwezig
                    // Verlaag frequentie tot max 60% als ze dichtbij zijn (meer effect)
                    const targetFilterFreqA = defaultFilterFreqA - modFactor * (defaultFilterFreqA * 0.60);
                    a.audioNodes.filterNode.frequency.setTargetAtTime(Math.max(20, targetFilterFreqA), now, interactionTimeConstant); // Zorg dat freq > 0 blijft

                    const baseFreqB = b.audioParams.pitch;
                    const sizeRangeB = MAX_NODE_SIZE - MIN_NODE_SIZE;
                    const normalizedSizeB = (b.size - MIN_NODE_SIZE) / (sizeRangeB || 1);
                    const defaultFilterFreqB = baseFreqB * 2 + normalizedSizeB * baseFreqB * (b.audioParams.filterFreqFactor || 12);
                    const targetFilterFreqB = defaultFilterFreqB - modFactor * (defaultFilterFreqB * 0.60);
                    b.audioNodes.filterNode.frequency.setTargetAtTime(Math.max(20, targetFilterFreqB), now, interactionTimeConstant);

                    // --- B. Oscillator Detune Versterking (Unison Effect) ---
                    const baseDetune = a.audioParams.detune || NEBULA_OSC_DETUNE || 7; // Gebruik node's eigen instelling of default
                    const maxAdditionalDetune = baseDetune * 2.0; // Flink meer detune mogelijk (factor 2 extra)
                    const targetDetune = baseDetune + modFactor * maxAdditionalDetune;

                    // Pas detune aan voor alle oscillatoren (behalve de eerste) in beide nodes
                    a.audioNodes.oscillators.forEach((osc, osc_idx) => {
                        if (osc_idx > 0 && osc.detune) {
                           const direction = (osc_idx % 2 === 0 ? 1 : -1) * Math.ceil(osc_idx / 2); // Richting zoals in createAudioNodes
                           osc.detune.setTargetAtTime(direction * targetDetune, now, interactionTimeConstant);
                        }
                    });
                     b.audioNodes.oscillators.forEach((osc, osc_idx) => {
                        if (osc_idx > 0 && osc.detune) {
                           const direction = (osc_idx % 2 === 0 ? 1 : -1) * Math.ceil(osc_idx / 2);
                           osc.detune.setTargetAtTime(direction * targetDetune, now, interactionTimeConstant);
                        }
                    });

                    // --- C. Filter LFO Snelheid Variatie ---
                    const baseLfoRate = NEBULA_FILTER_LFO_RATE; // Basis snelheid uit constante
                    const maxLfoRateVariation = baseLfoRate * 2.0; // Max 200% sneller
                    // Laat A sneller gaan, B langzamer als ze dichterbij komen
                    const targetLfoRateA = baseLfoRate + modFactor * maxLfoRateVariation;
                    const targetLfoRateB = baseLfoRate - modFactor * (baseLfoRate * 0.75); // Max 75% langzamer

                    a.audioNodes.filterLfo.frequency.setTargetAtTime(Math.max(0.01, targetLfoRateA), now, interactionTimeConstant);
                    b.audioNodes.filterLfo.frequency.setTargetAtTime(Math.max(0.01, targetLfoRateB), now, interactionTimeConstant);

                    // --- D. Optioneel: Lichte Volume Dip ---
                    // Kan helpen om te voorkomen dat het te modderig wordt
                    // const baseVolA = Math.min(NEBULA_MAX_VOL, a.size * NEBULA_VOL_SCALING * 1.5); // Basis volume
                    // const targetVolA = baseVolA - modFactor * (baseVolA * 0.15); // Max 15% zachter
                    // if (a.audioNodes.gainNode?.gain) {
                    //     a.audioNodes.gainNode.gain.setTargetAtTime(targetVolA, now, interactionTimeConstant);
                    // }
                    // // Idem voor B...


                } catch (e) { console.error(`Error applying interaction effect for ${pairKey}:`, e); }
            }
        }
    }

    // Stap 3: Reset effecten voor paren die niet meer interacteren
    activeNebulaInteractions.forEach((interactionData, pairKey) => {
        if (!currentInteractingKeys.has(pairKey)) {
            const { a, b } = interactionData;
            try {
                 // Zorg dat nodes nog bestaan en audioNodes hebben
                 if (a?.audioNodes && b?.audioNodes) {
                    // --- Reset Filter A ---
                    if(a.audioNodes.filterNode?.frequency) {
                        const baseFreqA = a.audioParams.pitch; const sizeRangeA = MAX_NODE_SIZE - MIN_NODE_SIZE; const normalizedSizeA = (a.size - MIN_NODE_SIZE) / (sizeRangeA || 1); const defaultFilterFreqA = baseFreqA * 2 + normalizedSizeA * baseFreqA * (a.audioParams.filterFreqFactor || 12);
                        a.audioNodes.filterNode.frequency.setTargetAtTime(defaultFilterFreqA, now, interactionTimeConstant);
                    }
                    // --- Reset Filter B ---
                    if(b.audioNodes.filterNode?.frequency) {
                        const baseFreqB = b.audioParams.pitch; const sizeRangeB = MAX_NODE_SIZE - MIN_NODE_SIZE; const normalizedSizeB = (b.size - MIN_NODE_SIZE) / (sizeRangeB || 1); const defaultFilterFreqB = baseFreqB * 2 + normalizedSizeB * baseFreqB * (b.audioParams.filterFreqFactor || 12);
                        b.audioNodes.filterNode.frequency.setTargetAtTime(defaultFilterFreqB, now, interactionTimeConstant);
                    }
                    // --- Reset Detune A ---
                    const baseDetuneA = a.audioParams.detune || NEBULA_OSC_DETUNE || 7;
                    a.audioNodes.oscillators?.forEach((osc, osc_idx) => {
                         if (osc_idx > 0 && osc.detune) { const direction = (osc_idx % 2 === 0 ? 1 : -1) * Math.ceil(osc_idx / 2); osc.detune.setTargetAtTime(direction * baseDetuneA, now, interactionTimeConstant); }
                    });
                    // --- Reset Detune B ---
                     const baseDetuneB = b.audioParams.detune || NEBULA_OSC_DETUNE || 7;
                     b.audioNodes.oscillators?.forEach((osc, osc_idx) => {
                         if (osc_idx > 0 && osc.detune) { const direction = (osc_idx % 2 === 0 ? 1 : -1) * Math.ceil(osc_idx / 2); osc.detune.setTargetAtTime(direction * baseDetuneB, now, interactionTimeConstant); }
                    });
                    // --- Reset LFO Rate A ---
                    if (a.audioNodes.filterLfo?.frequency) {
                        a.audioNodes.filterLfo.frequency.setTargetAtTime(NEBULA_FILTER_LFO_RATE, now, interactionTimeConstant);
                    }
                    // --- Reset LFO Rate B ---
                    if (b.audioNodes.filterLfo?.frequency) {
                        b.audioNodes.filterLfo.frequency.setTargetAtTime(NEBULA_FILTER_LFO_RATE, now, interactionTimeConstant);
                    }
                    // --- Reset Volume A/B (als je dat had toegevoegd) ---
                    // if (a.audioNodes.gainNode?.gain) { ... reset gain ... }
                 }
            } catch(e) { console.error(`Error resetting interaction effect for ${pairKey}:`, e); }

            activeNebulaInteractions.delete(pairKey); // Verwijder uit actieve lijst
        }
    });
}

// In app.js

function drawPlasmaBridge(ctx, nodeA, nodeB, alpha) { // Alpha is nu basis intensiteit
  const midX = (nodeA.x + nodeB.x) / 2;
  const midY = (nodeA.y + nodeB.y) / 2;
  const now = audioContext ? audioContext.currentTime : performance.now() / 1000;

  ctx.save();

  // 1. Kleur bepalen op basis van beide nodes
  const scaleBase = currentScale.baseHSL || { h: 200, s: 70, l: 70 };
  const noteIndexA = nodeA.audioParams.scaleIndex % currentScale.notes.length;
  const hueA = (scaleBase.h + noteIndexA * HUE_STEP) % 360;
  const lightnessA = scaleBase.l * (0.8 + nodeA.size * 0.2);
  const saturationA = scaleBase.s * 0.7; // Gebruik nebula saturation

  const noteIndexB = nodeB.audioParams.scaleIndex % currentScale.notes.length;
  const hueB = (scaleBase.h + noteIndexB * HUE_STEP) % 360;
  const lightnessB = scaleBase.l * (0.8 + nodeB.size * 0.2);
  const saturationB = scaleBase.s * 0.7;

  // Simpele mix: gemiddelde hue (rekening houdend met cirkel), gemiddelde S/L
  // Correcter hue gemiddelde nemen (ingewikkelder)
  let avgHue = (hueA + hueB) / 2;
  if (Math.abs(hueA - hueB) > 180) { // Als ze aan andere kant van de cirkel liggen
       avgHue = (hueA + hueB + 360) / 2 % 360;
  }
  const avgSaturation = (saturationA + saturationB) / 2;
  const avgLightness = (lightnessA + lightnessB) / 2 * 1.1; // Iets lichter maken

  // 2. Animatie toevoegen (bv. pulserende radius)
  const pulseSpeed = 2.5;
  const minRadiusFactor = 0.8;
  const maxRadiusFactor = 1.1;
  const pulseRange = maxRadiusFactor - minRadiusFactor;
  const pulseFactor = minRadiusFactor + ((Math.sin(now * pulseSpeed) + 1) / 2) * pulseRange; // Factor tussen 0.8 en 1.1

  const baseOuterRadius = 60; // Iets kleiner dan origineel
  const outerRadius = baseOuterRadius * pulseFactor;
  const innerRadius = 10 * pulseFactor; // Binnenste radius pulseert ook

  // 3. Gradient maken met gemixte kleur en pulserende radius
  try {
      const grad = ctx.createRadialGradient(midX, midY, innerRadius, midX, midY, outerRadius);
      // Binnenkleur (helderder, meer solide alpha)
      grad.addColorStop(0, hslToRgba(avgHue, avgSaturation, avgLightness * 1.1, alpha * 0.9));
      // Middenkleur
      grad.addColorStop(0.5, hslToRgba(avgHue, avgSaturation, avgLightness, alpha * 0.5));
      // Buitenkleur (volledig transparant)
      grad.addColorStop(1, hslToRgba(avgHue, avgSaturation, avgLightness * 0.9, 0));

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(midX, midY, outerRadius, 0, Math.PI * 2); // Gebruik pulserende radius
      ctx.fill();

  } catch (e) {
       console.error("Error creating/drawing plasma gradient:", e);
       // Fallback: teken simpele cirkel als gradient faalt
       ctx.fillStyle = hslToRgba(avgHue, avgSaturation, avgLightness, alpha * 0.3);
       ctx.beginPath();
       ctx.arc(midX, midY, baseOuterRadius * 0.5, 0, Math.PI * 2);
       ctx.fill();
  }

  ctx.restore();
}

function updateMousePos(event) {
  const rect = canvas.getBoundingClientRect()
  screenMousePos = { x: event.clientX - rect.left, y: event.clientY - rect.top }
  mousePos = getWorldCoords(screenMousePos.x, screenMousePos.y)
}
function handlePitchCycle(element) {
  let node, connection
  if (element.type === "node") node = findNodeById(element.id)
  else if (element.type === "connection")
    connection = findConnectionById(element.id)
  if (!node && !connection) return
  const target = node || connection
  if (
    (node && !["sound", "nebula"].includes(node.type)) ||
    (connection && connection.type !== "string_violin")
  )
    return
  const oldIndex = target.audioParams.scaleIndex
  target.audioParams.scaleIndex = Math.min(
    MAX_SCALE_INDEX,
    (target.audioParams.scaleIndex ?? 0) + 1
  )
  target.audioParams.pitch = getFrequency(
    currentScale,
    target.audioParams.scaleIndex
  )
  if (node) updateNodeAudioParams(node)
  else updateConnectionAudioParams(connection)
  target.animationState = 0.1
  setTimeout(() => {
    const checkElem = node
      ? findNodeById(node.id)
      : findConnectionById(connection.id)
    if (checkElem && checkElem.animationState > 0 && !checkElem.isTriggered)
      checkElem.animationState = 0
  }, 150)
  if (oldIndex !== target.audioParams.scaleIndex) {
    populateEditPanel()
    saveState()
  }
}
function handlePitchCycleDown(element) {
  let node, connection
  if (element.type === "node") node = findNodeById(element.id)
  else if (element.type === "connection")
    connection = findConnectionById(element.id)
  if (!node && !connection) return
  const target = node || connection
  if (
    (node && !["sound", "nebula"].includes(node.type)) ||
    (connection && connection.type !== "string_violin")
  )
    return
  const oldIndex = target.audioParams.scaleIndex
  target.audioParams.scaleIndex = Math.max(
    MIN_SCALE_INDEX,
    (target.audioParams.scaleIndex ?? 0) - 1
  )
  target.audioParams.pitch = getFrequency(
    currentScale,
    target.audioParams.scaleIndex
  )
  if (node) updateNodeAudioParams(node)
  else updateConnectionAudioParams(connection)
  target.animationState = 0.1
  setTimeout(() => {
    const checkElem = node
      ? findNodeById(node.id)
      : findConnectionById(connection.id)
    if (checkElem && checkElem.animationState > 0 && !checkElem.isTriggered)
      checkElem.animationState = 0
  }, 150)
  if (oldIndex !== target.audioParams.scaleIndex) {
    populateEditPanel()
    saveState()
  }
}
function handleTapTempo(node) {
  if (
    !isAudioReady ||
    !node ||
    !node.isStartNode ||
    isGlobalSyncEnabled ||
    node.type === "pulsar_triggerable" ||
    node.type === "pulsar_random_particles"
  )
    return
  const oldInterval = node.audioParams.triggerInterval
  const nowMs = performance.now()
  if (
    tapTempoTimes.length > 0 &&
    nowMs - tapTempoTimes[tapTempoTimes.length - 1] > MAX_TAP_INTERVAL
  ) {
    tapTempoTimes = []
  }
  tapTempoTimes.push(nowMs)
  if (tapTempoTimes.length > MAX_TAP_TIMES) {
    tapTempoTimes.shift()
  }
  if (tapTempoTimes.length > 1) {
    let totalInterval = 0
    for (let i = 1; i < tapTempoTimes.length; i++) {
      totalInterval += tapTempoTimes[i] - tapTempoTimes[i - 1]
    }
    const avgIntervalMs = totalInterval / (tapTempoTimes.length - 1)
    const newIntervalSec = avgIntervalMs / 1000
    node.audioParams.triggerInterval = Math.max(
      0.1,
      Math.min(10.0, newIntervalSec)
    )
    node.animationState = 0.5
    setTimeout(() => {
      const checkNode = findNodeById(node.id)
      if (checkNode && !checkNode.isTriggered) checkNode.animationState = 0
    }, 100)
    if (oldInterval !== node.audioParams.triggerInterval) {
      populateEditPanel()
      saveState()
    }
  } else {
    node.animationState = 0.2
    setTimeout(() => {
      const checkNode = findNodeById(node.id)
      if (checkNode && !checkNode.isTriggered) checkNode.animationState = 0
    }, 100)
  }
}
function handleSubdivisionCycle(node) {
  if (
    !node ||
    !node.isStartNode ||
    !isGlobalSyncEnabled ||
    node.type === "pulsar_triggerable" ||
    node.type === "pulsar_random_particles"
  )
    return
  const oldIndex = node.syncSubdivisionIndex
  node.syncSubdivisionIndex =
    (node.syncSubdivisionIndex + 1) % subdivisionOptions.length
  node.nextSyncTriggerTime = 0
  node.animationState = 0.3
  setTimeout(() => {
    const checkNode = findNodeById(node.id)
    if (checkNode && !checkNode.isTriggered) checkNode.animationState = 0
  }, 100)
  if (oldIndex !== node.syncSubdivisionIndex) {
    populateEditPanel()
    saveState()
  }
}
function handleGateCycle(node) {
  if (!node || node.type !== "gate") return
  const oldIndex = node.gateModeIndex
  node.gateModeIndex = (node.gateModeIndex + 1) % GATE_MODES.length
  node.gateCounter = 0
  node.animationState = 0.3
  setTimeout(() => {
    const checkNode = findNodeById(node.id)
    if (checkNode) checkNode.animationState = 0
  }, 100)
  if (oldIndex !== node.gateModeIndex) {
    populateEditPanel()
    saveState()
  }
}
function handleProbabilityCycle(node) {
  if (!node || node.type !== "probabilityGate") return
  const oldProbability = node.audioParams.probability
  let newProbability = Math.round((oldProbability + 0.1) * 10) / 10
  if (newProbability > 1.0) {
    newProbability = 0.1
  }
  node.audioParams.probability = newProbability
  node.animationState = 0.3
  setTimeout(() => {
    const checkNode = findNodeById(node.id)
    if (checkNode) checkNode.animationState = 0
  }, 100)
  if (oldProbability !== node.audioParams.probability) {
    populateEditPanel()
    saveState()
  }
}
function handlePitchShiftCycle(node) {
  if (!node || node.type !== "pitchShift") return
  const oldIndex = node.pitchShiftIndex
  node.pitchShiftIndex = (node.pitchShiftIndex + 1) % PITCH_SHIFT_AMOUNTS.length
  node.pitchShiftAmount = PITCH_SHIFT_AMOUNTS[node.pitchShiftIndex]
  node.animationState = 0.3
  setTimeout(() => {
    const checkNode = findNodeById(node.id)
    if (checkNode) checkNode.animationState = 0
  }, 100)
  if (oldIndex !== node.pitchShiftIndex) {
    populateEditPanel()
    saveState()
  }
}
function handleWaveformCycle(node) {
  if (!node || node.type !== "nebula") return
  const nonSamplerWaveforms = waveformTypes
    .filter((w) => !w.type.startsWith("sampler_"))
    .map((w) => w.type)
  const currentWaveform = node.audioParams.waveform || "sawtooth"
  const currentIndex = nonSamplerWaveforms.indexOf(currentWaveform)
  const nextIndex = (currentIndex + 1) % nonSamplerWaveforms.length
  const newWaveform = nonSamplerWaveforms[nextIndex]
  node.audioParams.waveform = newWaveform
  if (node.audioNodes) {
    const desiredWaveformType =
      newWaveform === "fmBell" || newWaveform === "fmXylo"
        ? "sine"
        : newWaveform
    node.audioNodes.oscillators.forEach((osc) => {
      if (osc.type !== desiredWaveformType) osc.type = desiredWaveformType
    })
  }
  updateNodeAudioParams(node)
  node.animationState = 0.3
  setTimeout(() => {
    const checkNode = findNodeById(node.id)
    if (checkNode && !checkNode.isTriggered) checkNode.animationState = 0
  }, 150)
  populateEditPanel()
  saveState()
}
function handleTogglePitchShiftAlternating(node) {
  if (!node || node.type !== "pitchShift") return
  node.pitchShiftAlternating = !node.pitchShiftAlternating
  node.pitchShiftDirection = 1
  node.animationState = 0.3
  setTimeout(() => {
    const checkNode = findNodeById(node.id)
    if (checkNode) checkNode.animationState = 0
  }, 150)
  populateEditPanel()
  saveState()
}
function handlePulsarTriggerToggle(node) {
  if (!node || !isPulsarType(node.type)) return
  node.isEnabled = !node.isEnabled
  if (!node.isEnabled && node.type !== "pulsar_triggerable") {
    node.lastTriggerTime = -1
    node.nextSyncTriggerTime = 0
    node.nextGridTriggerTime = 0
  } else if (node.isEnabled && node.type === "pulsar_triggerable") {
    node.lastTriggerTime = -1
    node.nextSyncTriggerTime = 0
    node.nextGridTriggerTime = 0
    if (node.type === "pulsar_random_particles") {
      const nowTime = audioContext
        ? audioContext.currentTime
        : performance.now() / 1000
      node.nextRandomTriggerTime =
        nowTime + (Math.random() * 2) / PULSAR_RANDOM_TIMING_CHANCE_PER_SEC
    }
  }
  node.animationState = 0.3
  setTimeout(() => {
    const checkNode = findNodeById(node.id)
    if (checkNode) checkNode.animationState = 0
  }, 150)
  populateEditPanel()
  saveState()
}

let _tempWasSelectedAtMouseDown = false;

function handleMouseDown(event) {
  console.log(`DEBUG handleMouseDown Start: currentTool='${currentTool}', nodeTypeToAdd='${nodeTypeToAdd}'`);

  if (!isPlaying && event.target === canvas) { togglePlayPause(); return; }
  if (!isAudioReady) return;

  const targetIsPanelControl = hamburgerMenuPanel.contains(event.target) || sideToolbar.contains(event.target) || gridControlsDiv.contains(event.target) || transportControlsDiv.contains(event.target) || mixerPanel.contains(event.target) || pianoRollPanel.contains(event.target);
  if (targetIsPanelControl) { return; }

  updateMousePos(event);

  _tempWasSelectedAtMouseDown = false;
  const potentialNodeClicked = findNodeAt(mousePos.x, mousePos.y);
  const potentialConnectionClicked = !potentialNodeClicked ? findConnectionNear(mousePos.x, mousePos.y) : null;
  let potentialElementClicked = null;

  if (potentialNodeClicked) {
      potentialElementClicked = { type: 'node', id: potentialNodeClicked.id };
      _tempWasSelectedAtMouseDown = isElementSelected('node', potentialNodeClicked.id);
  } else if (potentialConnectionClicked) {
      potentialElementClicked = { type: 'connection', id: potentialConnectionClicked.id };
      _tempWasSelectedAtMouseDown = isElementSelected('connection', potentialConnectionClicked.id);
  }

  nodeClickedAtMouseDown = potentialNodeClicked;
  connectionClickedAtMouseDown = potentialConnectionClicked;
  elementClickedAtMouseDown = potentialElementClicked;
  nodeWasSelectedAtMouseDown = nodeClickedAtMouseDown ? _tempWasSelectedAtMouseDown : false;

  mouseDownPos = { ...mousePos };
  isDragging = false; isConnecting = false; isResizing = false; isSelecting = false; isPanning = false; didDrag = false; selectionRect.active = false;

  if (event.button === 1 || (isSpacebarDown && event.button === 0)) {
      isPanning = true;
      panStart = { ...screenMousePos };
      canvas.style.cursor = 'grabbing';
      nodeClickedAtMouseDown = null;
      connectionClickedAtMouseDown = null;
      elementClickedAtMouseDown = null;
      return;
  }

  if (elementClickedAtMouseDown) {
      const element = elementClickedAtMouseDown;
      const node = element.type === 'node' ? nodeClickedAtMouseDown : null;
      const connection = element.type === 'connection' ? connectionClickedAtMouseDown : null;

      if (event.shiftKey && currentTool === 'edit' && node) {
          isResizing = true;
          resizeStartSize = node.size;
          resizeStartY = screenMousePos.y;
          canvas.style.cursor = 'ns-resize';
      } else if (event.shiftKey && currentTool !== 'edit') {
          if (isElementSelected(element.type, element.id)) {
              selectedElements = new Set([...selectedElements].filter(el => !(el.type === element.type && el.id === element.id)));
          } else {
              selectedElements.add(element);
          }
          if (currentTool === 'edit') updateConstellationGroup();
          updateGroupControlsUI();
          populateEditPanel();
          nodeClickedAtMouseDown = null;
          connectionClickedAtMouseDown = null;
      } else if (event.altKey && currentTool === 'edit' && node && (node.type === 'sound' || node.type === 'nebula' || node.type === 'pitchShift')) {
           // Action in MouseUp
      } else if (event.altKey && currentTool === 'edit' && connection && connection.type === 'string_violin') {
           // Action in MouseUp
      } else {
          if (currentTool === 'connect' || currentTool === 'connect_string' || currentTool === 'connect_glide') {
              if (node && !['nebula', PORTAL_NEBULA_TYPE].includes(node.type)) { // Prevent connecting from portal too
                  isConnecting = true;
                  connectingNode = node;
                  if (currentTool === 'connect_string') {
                      connectionTypeToAdd = 'string_violin';
                  } else if (currentTool === 'connect_glide') {
                      connectionTypeToAdd = 'glide';
                  } else {
                      connectionTypeToAdd = 'standard';
                  }
                  canvas.style.cursor = 'grabbing';
              }
          } else if (currentTool === 'delete') {
              if (node) removeNode(node);
              else if (connection) removeConnection(connection);
              nodeClickedAtMouseDown = null;
              connectionClickedAtMouseDown = null;
          } else if (currentTool === 'edit') {
              let selectionChanged = false;
              if (!isElementSelected(element.type, element.id)) {
                  if (!event.shiftKey) selectedElements.clear();
                  selectedElements.add(element);
                  selectionChanged = true;
               } else if (event.shiftKey) {
                  selectedElements = new Set([...selectedElements].filter(el => !(el.type === element.type && el.id === element.id)));
                  selectionChanged = true;
               }

              if (node) {
                  isDragging = true;
                  dragStartPos = { ...mousePos };
                  nodeDragOffsets.clear();
                  selectedElements.forEach(el => {
                       if (el.type === 'node') {
                           const n = findNodeById(el.id);
                           if (n) nodeDragOffsets.set(el.id, { x: n.x - mousePos.x, y: n.y - mousePos.y });
                       }
                  });
                  canvas.style.cursor = 'move';
              }

              if (selectionChanged) {
                  updateConstellationGroup();
                  populateEditPanel();
               }
          }
      }
  } else {
      if (currentTool === 'edit') {
          isSelecting = true;
          selectionRect = { startX: mousePos.x, startY: mousePos.y, endX: mousePos.x, endY: mousePos.y, active: false };
          if (!event.shiftKey) {
              if (selectedElements.size > 0) {
                  selectedElements.clear();
                  updateConstellationGroup();
                  populateEditPanel();
              }
          }
      } else if (currentTool === 'add' && nodeTypeToAdd !== null) {
          console.log(`DEBUG handleMouseDown: In 'add' mode check, type='${nodeTypeToAdd}'`);

          const directAddTypes = ['gate', 'probabilityGate', 'pitchShift', 'relay', 'reflector', 'switch'];
          const canAddNode = directAddTypes.includes(nodeTypeToAdd) ||
                             (nodeTypeToAdd === 'sound' && waveformToAdd) ||
                             (nodeTypeToAdd === 'nebula' && waveformToAdd) ||
                             (isPulsarType(nodeTypeToAdd)) ||
                             (isDrumType(nodeTypeToAdd)) ||
                             (nodeTypeToAdd === PORTAL_NEBULA_TYPE);

          console.log(`DEBUG handleMouseDown: Check 'canAddNode' = ${canAddNode}`);

          if (canAddNode) {
              console.log(`DEBUG handleMouseDown: Poging tot aanroepen addNode...`);
              const newNode = addNode(mousePos.x, mousePos.y, nodeTypeToAdd, waveformToAdd);
              console.log(`DEBUG handleMouseDown: addNode gaf terug:`, newNode);
              if (newNode) {
                  if (!event.shiftKey) selectedElements.clear();
                  selectedElements.add({type: 'node', id: newNode.id});
                  populateEditPanel();
              } else {
                  console.error("DEBUG handleMouseDown: addNode gaf null terug!");
              }
          } else {
               console.log(`DEBUG handleMouseDown: canAddNode is false, node wordt NIET toegevoegd.`);
          }
      } else if (!['connect', 'connect_string', 'connect_glide', 'delete'].includes(currentTool) ) {
           if (selectedElements.size > 0 && !event.shiftKey) {
               selectedElements.clear();
               updateGroupControlsUI();
               populateEditPanel();
           }
      }
  }
  hideBottomPanels();
}


function handleMouseUp(event) {
    if (!isAudioReady) return;
    const targetIsPanelControl = hamburgerMenuPanel.contains(event.target) || sideToolbar.contains(event.target) || gridControlsDiv.contains(event.target) || transportControlsDiv.contains(event.target) || mixerPanel.contains(event.target) || pianoRollPanel.contains(event.target);
    if (targetIsPanelControl) {
        isDragging = false; isConnecting = false; isResizing = false; isSelecting = false; isPanning = false;
        selectionRect.active = false; connectingNode = null; nodeClickedAtMouseDown = null; connectionClickedAtMouseDown = null;
        canvas.style.cursor = 'crosshair';
        return;
    }

    updateMousePos(event);
    const nodeUnderCursor = findNodeAt(mousePos.x, mousePos.y);
    const connectionUnderCursor = !nodeUnderCursor ? findConnectionNear(mousePos.x, mousePos.y) : null;
    let elementUnderCursor = null;
    if (nodeUnderCursor) elementUnderCursor = { type: 'node', id: nodeUnderCursor.id };
    else if (connectionUnderCursor) elementUnderCursor = { type: 'connection', id: connectionUnderCursor.id };

    const wasSelectedAtStart = _tempWasSelectedAtMouseDown;
    _tempWasSelectedAtMouseDown = false;

    const wasResizing = isResizing;
    const wasConnecting = isConnecting;
    const wasDragging = isDragging;
    const wasSelecting = isSelecting;
    const wasPanning = isPanning;
    const nodeClickedStart = nodeClickedAtMouseDown;
    const connectionClickedStart = connectionClickedAtMouseDown;
    const elementClickedStart = nodeClickedStart ? { type: 'node', id: nodeClickedStart.id } : (connectionClickedStart ? { type: 'connection', id: connectionClickedStart.id } : null);
    let stateWasChanged = false;

    isResizing = false;
    isConnecting = false;
    isDragging = false;
    isSelecting = false;
    isPanning = false;
    selectionRect.active = false;
    canvas.style.cursor = 'crosshair';

    if (wasConnecting) {
        if (connectingNode && nodeUnderCursor && nodeUnderCursor !== connectingNode && !['nebula', PORTAL_NEBULA_TYPE].includes(nodeUnderCursor.type)) {
            connectNodes(connectingNode, nodeUnderCursor, connectionTypeToAdd);
            stateWasChanged = true;
        }
        connectingNode = null;
        connectionTypeToAdd = 'standard';
    }
    else if (!wasDragging && !wasPanning && !wasResizing) {
        if (currentTool === 'brush') {
            if (!elementUnderCursor) {
                let typeToPlace = brushNodeType; // Default: het geselecteerde type
                let subtypeToPlace = (brushNodeType === 'sound') ? brushWaveform : null; // Alleen subtype voor sound

                if (!isBrushing && brushStartWithPulse) {
                    // Eerste klik EN vinkje aan: plaats een pulsar!
                    typeToPlace = 'pulsar_standard'; // Overschrijf type
                    subtypeToPlace = null; // Pulsar heeft geen waveform subtype
                    console.log("Brush: Placing Pulsar as first node.");
                } else {
                     // Tweede+ klik OF vinkje uit: plaats het geselecteerde type
                     console.log(`Brush: Placing selected type: ${brushNodeType} / ${subtypeToPlace}`);
                }

                 const newNode = addNode(mousePos.x, mousePos.y, typeToPlace, subtypeToPlace);

                 if (newNode) {
                     stateWasChanged = true; // Node is toegevoegd
                     if (isBrushing && lastBrushNode) {
                         // Verbind met vorige node (kan pulsar of sound zijn)
                         connectNodes(lastBrushNode, newNode, 'standard');
                     }
                     // De startpuls logica van hiervoor is nu niet meer nodig,
                     // de pulsar doet zijn werk vanzelf als hij geplaatst is.

                     lastBrushNode = newNode;
                     isBrushing = true;
                     selectedElements.clear();
                     selectedElements.add({ type: 'node', id: newNode.id });
                     populateEditPanel();
                 }
            } else {
                 console.log("Brush: Chain ended by clicking existing element.");
                 isBrushing = false;
                 lastBrushNode = null;
                 if (!isElementSelected(elementUnderCursor.type, elementUnderCursor.id)) {
                     if (!event.shiftKey) selectedElements.clear();
                     selectedElements.add(elementUnderCursor);
                     updateConstellationGroup();
                     populateEditPanel();
                     stateWasChanged = true;
                 }
            }
        } else if (currentTool === 'edit') {
            if (elementClickedStart && elementUnderCursor && elementClickedStart.type === elementUnderCursor.type && elementClickedStart.id === elementUnderCursor.id) {
                 const targetElement = elementClickedStart;
                 const node = targetElement.type === 'node' ? nodeClickedStart : null;
                 const connection = targetElement.type === 'connection' ? connectionClickedStart : null;
                 if (event.button === 0) {
                     if (event.altKey) {
                         if (node && (node.type === 'sound' || node.type === 'nebula' || node.type === 'pitchShift')) { handlePitchCycleDown(targetElement); stateWasChanged = true; }
                         else if (connection && connection.type === 'string_violin') { handlePitchCycleDown(targetElement); stateWasChanged = true; }
                     } else if (!event.shiftKey) {
                         if (wasSelectedAtStart) {
                             if (node) {
                                 if (node.type === 'pulsar_manual') { triggerManualPulsar(node); }
                                 else if (node.isStartNode && node.type !== 'pulsar_triggerable' && node.type !== 'pulsar_random_particles') { if (isGlobalSyncEnabled) { handleSubdivisionCycle(node); } else { handleTapTempo(node); } stateWasChanged = true; }
                                 else if (node.type === 'sound' || node.type === 'nebula') { handlePitchCycle(targetElement); stateWasChanged = true; }
                                 else if (node.type === 'gate') { handleGateCycle(node); stateWasChanged = true; }
                                 else if (node.type === 'probabilityGate') { handleProbabilityCycle(node); stateWasChanged = true; }
                                 else if (node.type === 'pitchShift') { handlePitchShiftCycle(node); stateWasChanged = true; }
                                 else if (isDrumType(node.type)) { triggerNodeEffect(node); }
                             } else if (connection && connection.type === 'string_violin') { handlePitchCycle(targetElement); stateWasChanged = true; }
                         } else {
                             if (!isElementSelected(targetElement.type, targetElement.id) || selectedElements.size > 1) { selectedElements.clear(); selectedElements.add(targetElement); updateConstellationGroup(); populateEditPanel(); stateWasChanged = true; }
                         }
                     }
                 }
            } else if (!elementClickedStart && !event.shiftKey) {
                 if (selectedElements.size > 0) { selectedElements.clear(); updateConstellationGroup(); populateEditPanel(); stateWasChanged = true; }
                 isBrushing = false;
                 lastBrushNode = null;
            }
        } else {
             isBrushing = false;
             lastBrushNode = null;
             if (currentTool === 'add' && !elementClickedStart) {
                 const directAddTypes = ['gate', 'probabilityGate', 'pitchShift', 'relay', 'reflector', 'switch'];
                 const canAddNode = directAddTypes.includes(nodeTypeToAdd) || (nodeTypeToAdd === 'sound' && waveformToAdd) || (nodeTypeToAdd === 'nebula' && waveformToAdd) || (isPulsarType(nodeTypeToAdd)) || (isDrumType(nodeTypeToAdd)) || (nodeTypeToAdd === PORTAL_NEBULA_TYPE);
                 if (canAddNode) {
                     const newNode = addNode(mousePos.x, mousePos.y, nodeTypeToAdd, waveformToAdd);
                     if (newNode) { if (!event.shiftKey) selectedElements.clear(); selectedElements.add({type: 'node', id: newNode.id}); populateEditPanel(); stateWasChanged = true; }
                 }
             } else if (currentTool === 'delete' && elementClickedStart) {
                  if (elementClickedStart.type === 'node') removeNode(nodeClickedStart);
                  else if (elementClickedStart.type === 'connection') removeConnection(connectionClickedStart);
             } else if (!elementClickedStart && !event.shiftKey) {
                  if (selectedElements.size > 0) { selectedElements.clear(); updateGroupControlsUI(); populateEditPanel(); stateWasChanged = true;}
             }
        }
    }

    didDrag = false;
    nodeClickedAtMouseDown = null;
    connectionClickedAtMouseDown = null;
    nodeWasSelectedAtMouseDown = false;
    nodeDragOffsets.clear();
    panStart = { x: 0, y: 0 };
    connectionTypeToAdd = 'standard';
    if (stateWasChanged && !isPerformingUndoRedo) {
        saveState();
    }
    updateGroupControlsUI();
}
function handleMouseMove(event) {
  if (!isAudioReady) return
  updateMousePos(event)
  if (
    !didDrag &&
    (isDragging || isResizing || isConnecting || isSelecting || isPanning) &&
    distance(
      screenMousePos.x,
      screenMousePos.y,
      mouseDownPos.x * viewScale + viewOffsetX,
      mouseDownPos.y * viewScale + viewOffsetY
    ) > 3
  ) {
    didDrag = true
    if (isSelecting) {
      selectionRect.active = true
    }
  }
  if (isPanning) {
    const dx = screenMousePos.x - panStart.x
    const dy = screenMousePos.y - panStart.y
    viewOffsetX += dx
    viewOffsetY += dy
    panStart = { ...screenMousePos }
    canvas.style.cursor = "grabbing"
  } else if (isResizing && nodeClickedAtMouseDown) {
    const dy_screen = screenMousePos.y - resizeStartY
    const sf = 1 + dy_screen / 100
    const targetNode = findNodeById(nodeClickedAtMouseDown.id)
    if (targetNode) {
      targetNode.size = Math.max(
        MIN_NODE_SIZE,
        Math.min(MAX_NODE_SIZE, resizeStartSize * sf)
      )
      updateNodeAudioParams(targetNode)
    }
    canvas.style.cursor = "ns-resize"
  } else if (isConnecting) {
    canvas.style.cursor = "grabbing"
  } else if (isSelecting && didDrag) {
    selectionRect.endX = mousePos.x
    selectionRect.endY = mousePos.y
    canvas.style.cursor = "crosshair"
  } else if (isDragging && didDrag) {
    const dx_world = mousePos.x - dragStartPos.x
    const dy_world = mousePos.y - dragStartPos.y
    const effectiveSnap = isSnapEnabled && !event.shiftKey
    selectedElements.forEach((el) => {
      if (el.type === "node") {
        const n = findNodeById(el.id)
        const offset = nodeDragOffsets.get(el.id)
        if (n && offset) {
          let targetX = dragStartPos.x + offset.x + dx_world
          let targetY = dragStartPos.y + offset.y + dy_world
          if (effectiveSnap) {
            const snapped = snapToGrid(targetX, targetY)
            targetX = snapped.x
            targetY = snapped.y
          }
          n.x = targetX
          n.y = targetY
        }
      }
    })
    connections.forEach((conn) => {
      const nodeASelected = isElementSelected("node", conn.nodeAId)
      const nodeBSelected = isElementSelected("node", conn.nodeBId)
      if (nodeASelected || nodeBSelected) {
        const nA = findNodeById(conn.nodeAId)
        const nB = findNodeById(conn.nodeBId)
        if (nA && nB) conn.length = distance(nA.x, nA.y, nB.x, nB.y)
      }
    })
    canvas.style.cursor = "move"
  } else {
    const hN = findNodeAt(mousePos.x, mousePos.y)
    const hC = !hN ? findConnectionNear(mousePos.x, mousePos.y) : null
    if (
      currentTool === "edit" &&
      event.altKey &&
      hN &&
      (hN.type === "sound" || hN.type === "nebula" || hN.type === "pitchShift")
    ) {
      canvas.style.cursor = "pointer"
    } else if (
      currentTool === "edit" &&
      event.altKey &&
      hC &&
      hC.type === "string_violin"
    ) {
      canvas.style.cursor = "pointer"
    } else if (currentTool === "edit" && event.shiftKey && hN) {
      canvas.style.cursor = "ns-resize"
    } else if (
      (currentTool === "connect" || currentTool === "connect_string") &&
      hN &&
      !["nebula"].includes(hN.type)
    ) {
      canvas.style.cursor = "grab"
    } else if (currentTool === "delete" && (hN || hC)) {
      canvas.style.cursor = "pointer"
    } else if (currentTool === "edit" && (hN || hC)) {
      canvas.style.cursor = "move"
    } else if (currentTool === "add") {
      canvas.style.cursor = "copy"
    } else {
      canvas.style.cursor = "crosshair"
    }
  }
}
function handleWheel(event) {
  event.preventDefault()
  const zoomAmount = event.deltaY * ZOOM_SENSITIVITY
  const worldCoords = getWorldCoords(event.clientX, event.clientY)
  const oldScale = viewScale
  viewScale -= zoomAmount
  viewScale = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, viewScale))
  if (oldScale !== viewScale) {
    viewOffsetX = event.clientX - worldCoords.x * viewScale
    viewOffsetY = event.clientY - worldCoords.y * viewScale
  }
}

function deepCopyState(stateToCopy) {
  if (!stateToCopy) return null
  try {
    const stringified = JSON.stringify(stateToCopy, (key, value) => {
      if (value instanceof Set) {
        return Array.from(value)
      }
      if (key === "audioNodes") return undefined
      return value
    })
    const parsed = JSON.parse(stringified)
    if (parsed.nodes) {
      parsed.nodes.forEach((node) => {
        node.connections = node.connections
          ? new Set(node.connections)
          : new Set()
      })
    }
    parsed.selectedElements = parsed.selectedElements
      ? new Set(parsed.selectedElements.map((el) => ({ ...el })))
      : new Set()
    parsed.fluctuatingGroupNodeIDs = parsed.fluctuatingGroupNodeIDs
      ? new Set(parsed.fluctuatingGroupNodeIDs)
      : new Set()
    return parsed
  } catch (e) {
    return null
  }
}
function saveState() {
  if (isPerformingUndoRedo) return;
  const currentState = {
      nodes: nodes,
      connections: connections,
      selectedElements: Array.from(selectedElements),
      fluctuatingGroupNodeIDs: Array.from(fluctuatingGroupNodeIDs),
      nodeIdCounter: nodeIdCounter,
      connectionIdCounter: connectionIdCounter,
      isGlobalSyncEnabled: isGlobalSyncEnabled,
      globalBPM: globalBPM,
      viewOffsetX: viewOffsetX,
      viewOffsetY: viewOffsetY,
      viewScale: viewScale,
      currentScaleKey: currentScaleKey,
      currentRootNote: currentRootNote,
      globalTransposeOffset: globalTransposeOffset,
      masterVolume: masterGain?.gain.value ?? 0.8,
      delaySend: masterDelaySendGain?.gain.value ?? 0.3,
      delayTime: delayNode?.delayTime.value ?? 0.25,
      delayFeedback: delayFeedbackGain?.gain.value ?? 0.4,
      portalVolume: portalGroupGain?.gain.value ?? 0.7,
      originalNebulaVolume: originalNebulaGroupGain?.gain.value ?? 0.8
  };
  const copiedState = deepCopyState(currentState);
  if (!copiedState) return;
  if (historyIndex < historyStack.length - 1) {
      historyStack = historyStack.slice(0, historyIndex + 1);
  }
  historyStack.push(copiedState);
  if (historyStack.length > MAX_HISTORY_SIZE) {
      historyStack.shift();
  }
  historyIndex = historyStack.length - 1;
}
function loadState(stateToLoad) {
  if (!stateToLoad || !stateToLoad.nodes || !stateToLoad.connections) {
      console.error("Ongeldige of incomplete state data om te laden.");
      return;
  }
  isPerformingUndoRedo = true;

  nodes.forEach((node) => stopNodeAudio(node));
  connections.forEach((conn) => stopConnectionAudio(conn));

  nodes = stateToLoad.nodes;
  connections = stateToLoad.connections;
  selectedElements = stateToLoad.selectedElements ? new Set(stateToLoad.selectedElements.map(el => ({...el}))) : new Set();
  fluctuatingGroupNodeIDs = stateToLoad.fluctuatingGroupNodeIDs ? new Set(stateToLoad.fluctuatingGroupNodeIDs) : new Set();
  nodeIdCounter = stateToLoad.nodeIdCounter ?? nodeIdCounter;
  connectionIdCounter = stateToLoad.connectionIdCounter ?? connectionIdCounter;
  isGlobalSyncEnabled = stateToLoad.isGlobalSyncEnabled ?? false;
  globalBPM = stateToLoad.globalBPM ?? 120;
  currentScaleKey = stateToLoad.currentScaleKey ?? "major_pentatonic";
  currentRootNote = stateToLoad.currentRootNote ?? 0;
  globalTransposeOffset = stateToLoad.globalTransposeOffset ?? 0;
  viewOffsetX = stateToLoad.viewOffsetX ?? 0;
  viewOffsetY = stateToLoad.viewOffsetY ?? 0;
  viewScale = stateToLoad.viewScale ?? 1.0;

  if (isAudioReady) {
      const now = audioContext.currentTime;
      const loadTimeConstant = 0.01;

      if (masterGain) masterGain.gain.setTargetAtTime(stateToLoad.masterVolume ?? 0.8, now, loadTimeConstant);
      if (masterDelaySendGain) masterDelaySendGain.gain.setTargetAtTime(stateToLoad.delaySend ?? 0.3, now, loadTimeConstant);
      if (delayNode) delayNode.delayTime.setTargetAtTime(stateToLoad.delayTime ?? 0.25, now, loadTimeConstant);
      if (delayFeedbackGain) delayFeedbackGain.gain.setTargetAtTime(stateToLoad.delayFeedback ?? 0.4, now, loadTimeConstant);

      if (portalGroupGain) {
           portalGroupGain.gain.setTargetAtTime(stateToLoad.portalVolume ?? 0.7, now, loadTimeConstant);
      }
      if (originalNebulaGroupGain) {
           originalNebulaGroupGain.gain.setTargetAtTime(stateToLoad.originalNebulaVolume ?? 0.8, now, loadTimeConstant);
      }
  }

  nodes.forEach((node) => {
      node.audioNodes = null;
      node.connections = node.connections ? new Set(node.connections) : new Set();
      node.isSelected = isElementSelected("node", node.id);
      node.isStartNode = isPulsarType(node.type);
      node.isEnabled = node.isEnabled !== undefined ? node.isEnabled : node.type !== "pulsar_triggerable";
      if (node.type === 'pulsar_manual') node.isEnabled = true;
      node.primaryInputConnectionId = node.primaryInputConnectionId ?? (node.type === "switch" ? null : undefined);
      node.baseHue = node.baseHue ?? null;

      if (!node.audioParams) node.audioParams = {};
      node.audioParams.reverbSend = node.audioParams.reverbSend ?? DEFAULT_REVERB_SEND;
      node.audioParams.delaySend = node.audioParams.delaySend ?? DEFAULT_DELAY_SEND;
      node.audioParams.probability = node.audioParams.probability ?? DEFAULT_PROBABILITY;
      node.audioParams.pulseIntensity = node.audioParams.pulseIntensity ?? DEFAULT_PULSE_INTENSITY;
      node.audioParams.triggerInterval = node.audioParams.triggerInterval ?? DEFAULT_TRIGGER_INTERVAL;
      node.audioParams.syncSubdivisionIndex = node.syncSubdivisionIndex ?? node.audioParams.syncSubdivisionIndex ?? DEFAULT_SUBDIVISION_INDEX;
      node.audioParams.gateModeIndex = node.gateModeIndex ?? node.audioParams.gateModeIndex ?? DEFAULT_GATE_MODE_INDEX;
      node.audioParams.pitchShiftIndex = node.pitchShiftIndex ?? node.audioParams.pitchShiftIndex ?? DEFAULT_PITCH_SHIFT_INDEX;
      node.audioParams.volume = node.audioParams.volume ?? 1.0;

      if (isDrumType(node.type)) {
          const defaults = DRUM_ELEMENT_DEFAULTS[node.type] || {};
          node.audioParams.baseFreq = node.audioParams.baseFreq ?? defaults?.baseFreq;
          node.audioParams.decay = node.audioParams.decay ?? defaults?.decay;
          node.audioParams.volume = node.audioParams.volume ?? defaults?.volume;
          if (node.type === "drum_snare" || node.type === "drum_clap") {
               node.audioParams.noiseDecay = node.audioParams.noiseDecay ?? defaults?.noiseDecay;
           }
      }
      if (["sound", "nebula"].includes(node.type)) {
          node.audioParams.scaleIndex = Math.max(MIN_SCALE_INDEX, Math.min(MAX_SCALE_INDEX, node.audioParams.scaleIndex ?? 0));
          node.audioParams.pitch = getFrequency(scales[currentScaleKey], node.audioParams.scaleIndex);
          if (isNaN(node.audioParams.pitch)) {
              node.audioParams.scaleIndex = 0;
              node.audioParams.pitch = getFrequency(scales[currentScaleKey], 0);
          }
      }
      if (node.type === PORTAL_NEBULA_TYPE) {
           node.audioParams.pitch = node.audioParams.pitch ?? PORTAL_NEBULA_DEFAULTS.droneBaseFreq;
           node.audioParams.volume = node.audioParams.volume ?? 0.6;
      }


      if (isAudioReady) {
          node.audioNodes = createAudioNodesForNode(node);
          if (node.audioNodes) {
              updateNodeAudioParams(node);
          }
      }
  });

  connections.forEach((conn) => {
      conn.isSelected = isElementSelected("connection", conn.id);
      if (conn.type === "string_violin") {
         if (!conn.audioParams) conn.audioParams = {};
         const defaults = STRING_VIOLIN_DEFAULTS;
         Object.keys(defaults).forEach((key) => { conn.audioParams[key] = conn.audioParams[key] ?? defaults[key]; });
         conn.audioParams.scaleIndex = Math.max(MIN_SCALE_INDEX, Math.min(MAX_SCALE_INDEX, conn.audioParams.scaleIndex ?? 0));
         conn.audioParams.pitch = getFrequency(scales[currentScaleKey], conn.audioParams.scaleIndex);
         if (isNaN(conn.audioParams.pitch)) { conn.audioParams.scaleIndex = 0; conn.audioParams.pitch = getFrequency(scales[currentScaleKey], 0); }
         if (isAudioReady) {
             conn.audioNodes = createAudioNodesForConnection(conn);
             if (conn.audioNodes) { updateConnectionAudioParams(conn); }
         } else { conn.audioNodes = null; }
      } else { conn.audioNodes = null; }
  });

  updateSyncUI();
  updateScaleAndTransposeUI();
  if(isAudioReady) updateMixerUI();
  updateConstellationGroup();
  populateEditPanel();
  drawPianoRoll();
  identifyAndRouteAllGroups();

  isPerformingUndoRedo = false;
}
function undo() {
  if (historyIndex > 0) {
    historyIndex--
    const stateToLoad = deepCopyState(historyStack[historyIndex])
    if (stateToLoad) {
      loadState(stateToLoad)
    } else {
      historyIndex++
    }
  } else {
  }
  resetSideToolbars()
  setActiveTool("edit")
}
function redo() {
  if (historyIndex < historyStack.length - 1) {
    historyIndex++
    const stateToLoad = deepCopyState(historyStack[historyIndex])
    if (stateToLoad) {
      loadState(stateToLoad)
    } else {
      historyIndex--
    }
  } else {
  }
  resetSideToolbars()
  setActiveTool("edit")
}

function removeNoteSelector() {
  if (noteSelectContainer && noteSelectContainer.parentNode) {
    noteSelectContainer.parentNode.removeChild(noteSelectContainer)
  }
  noteSelectElement = null
  noteSelectContainer = null
}
function createNoteSelector(parentElement = sideToolbarContent, targetElementsData = []) {
  removeNoteSelector()
  const container = document.createElement("div")
  container.classList.add("panel-section")
  const label = document.createElement("label")
  label.textContent = "Note:"
  label.htmlFor = "noteSelect"
  container.appendChild(label)
  const select = document.createElement("select")
  select.id = "noteSelect"
  let initialValue = -2
  let hasMultipleValues = false
  let firstValueFound = false

  if (targetElementsData.length > 0) {
    targetElementsData.forEach((elData) => {
      const el =
        elData.type === "node"
          ? findNodeById(elData.id)
          : findConnectionById(elData.id)
      if (
        el &&
        el.audioParams &&
        typeof el.audioParams.scaleIndex === "number"
      ) {
        if (!firstValueFound) {
          initialValue = el.audioParams.scaleIndex
          firstValueFound = true
        } else if (el.audioParams.scaleIndex !== initialValue) {
          hasMultipleValues = true
        }
      }
    })
  }

  const optionsArray = [];
  const numNotes = currentScale.notes.length;
  const octavesToCover = 4;
  const startingScaleIndex = MIN_SCALE_INDEX;
  const endingScaleIndex = Math.min(MAX_SCALE_INDEX, startingScaleIndex + numNotes * octavesToCover);

  for (let i = startingScaleIndex; i < endingScaleIndex; i++) {
    const noteName = getNoteNameFromScaleIndex(currentScale, i);
    if (noteName && noteName !== "?") {
        const notes = currentScale.notes;
        const numNotesInScale = notes.length;
        const noteIdx = i % numNotesInScale;
        const effectiveNoteIndex = (noteIdx < 0) ? noteIdx + numNotesInScale : noteIdx;
        const octOffset = Math.floor(i / numNotesInScale);
        const semitonesInScale = notes[effectiveNoteIndex];
        const totalSemitonesFromScaleBase = semitonesInScale + octOffset * 12;
        const baseFreqWithOffsets = currentScale.baseFreq * Math.pow(2, (currentRootNote + globalTransposeOffset) / 12);
        const baseMidiNote = frequencyToMidi(baseFreqWithOffsets);
        const finalAbsoluteMidiNote = !isNaN(baseMidiNote) ? (baseMidiNote + totalSemitonesFromScaleBase) : NaN;
        if (!isNaN(finalAbsoluteMidiNote)) {
             optionsArray.push({
               value: i,
               text: noteName,
               midi: Math.round(finalAbsoluteMidiNote)
             });
        }
    }
  }

  optionsArray.sort((a, b) => a.midi - b.midi);

  if (hasMultipleValues || !firstValueFound) {
    const multiOpt = document.createElement("option")
    multiOpt.value = "-2"
    multiOpt.textContent = "---"
    multiOpt.disabled = true
    multiOpt.selected = true
    select.appendChild(multiOpt)
  }

  const randomOpt = document.createElement("option")
  randomOpt.value = -1
  randomOpt.textContent = "Random"
  select.appendChild(randomOpt)

  optionsArray.forEach(optionData => {
    const opt = document.createElement("option");
    opt.value = optionData.value;
    opt.textContent = optionData.text;
    select.appendChild(opt);
  });

  select.value = hasMultipleValues || !firstValueFound ? "-2" : (initialValue === -1 ? "-1" : initialValue.toString());
  if (parentElement === sideToolbarContent && initialValue === -2) {
      select.value = "-1";
      noteIndexToAdd = -1;
  }


  select.addEventListener("change", (e) => {
    const newIndex = parseInt(e.target.value, 10)
    if (newIndex === -2) return
    if (targetElementsData.length > 0) {
      let changed = false
      targetElementsData.forEach((elData) => {
        const element =
          elData.type === "node"
            ? findNodeById(elData.id)
            : findConnectionById(elData.id)
        if (
          element &&
          element.audioParams &&
          typeof element.audioParams.scaleIndex === "number"
        ) {
          element.audioParams.scaleIndex = newIndex
          element.audioParams.pitch = getFrequency(currentScale, newIndex)
          if (elData.type === "node") updateNodeAudioParams(element)
          else if (elData.type === "connection")
            updateConnectionAudioParams(element)
          element.animationState = 0.1
          setTimeout(() => {
            const checkElem =
              elData.type === "node"
                ? findNodeById(elData.id)
                : findConnectionById(elData.id)
            if (
              checkElem &&
              checkElem.animationState > 0 &&
              !checkElem.isTriggered
            )
              checkElem.animationState = 0
          }, 150)
          changed = true
        }
      })
      if (changed) saveState()
    } else {
      noteIndexToAdd = newIndex
    }
  })
  container.appendChild(select)
  parentElement.appendChild(container)
  noteSelectElement = select
  noteSelectContainer = container
} 

function createHexNoteSelectorDOM(parentElement = sideToolbarContent, targetElementsData = []) {
  removeNoteSelector();
  const existingHexContainer = parentElement.querySelector('#hexNoteSelectorContainer');
  if (existingHexContainer) {
      existingHexContainer.remove();
  }
  const existingToggleButton = parentElement.querySelector('#hexRandomToggleBtn');
   if (existingToggleButton) {
       existingToggleButton.remove();
   }

  const container = document.createElement("div");
  container.id = "hexNoteSelectorContainer";
  container.classList.add("hex-note-container");

  let initialScaleIndex = -2;
  let hasMultipleValues = false;
  let firstValueFound = false;
  let currentSelectedValue = null;
  let isEditing = targetElementsData.length > 0;
  let isRandomActive = !isEditing;

  if (isEditing) {
      targetElementsData.forEach((elData) => {
           const el = elData.type === "node" ? findNodeById(elData.id) : findConnectionById(elData.id);
           if (el && el.audioParams && typeof el.audioParams.scaleIndex === "number") {
               if (!firstValueFound) {
                   initialScaleIndex = el.audioParams.scaleIndex;
                   firstValueFound = true;
               } else if (el.audioParams.scaleIndex !== initialScaleIndex) {
                   hasMultipleValues = true;
               }
           }
      });
      if (!hasMultipleValues && firstValueFound) {
          currentSelectedValue = initialScaleIndex;
          isRandomActive = false;
      } else {
           isRandomActive = false;
           currentSelectedValue = null;
      }
  } else {
       if (noteIndexToAdd !== -1) {
           currentSelectedValue = noteIndexToAdd;
           isRandomActive = false;
       } else {
           currentSelectedValue = null;
           isRandomActive = true;
           noteIndexToAdd = -1;
       }
  }

  const randomToggleButton = document.createElement("button");
  randomToggleButton.id = "hexRandomToggleBtn";
  randomToggleButton.classList.add("hex-random-toggle");
  randomToggleButton.textContent = "Random Note";
  randomToggleButton.classList.toggle('active', isRandomActive);
  randomToggleButton.type = "button";

  randomToggleButton.addEventListener("click", () => {
      isRandomActive = !isRandomActive;
      randomToggleButton.classList.toggle('active', isRandomActive);
      container.querySelectorAll('.hexagon-note.hex-selected').forEach(hex => hex.classList.remove('hex-selected'));
      currentSelectedValue = null;

      if (isRandomActive) {
          noteIndexToAdd = -1;
      } else {
          let defaultScaleIndex = 0;
          let foundRoot = false;
          const rootMidiBase = Math.round(frequencyToMidi(currentScale.baseFreq * Math.pow(2, (currentRootNote) / 12)));
          const firstRootHex = container.querySelector(`.hexagon-note.hex-root:not(.hex-disabled)`);

          if(firstRootHex && firstRootHex.dataset.scaleIndex !== undefined) {
              defaultScaleIndex = parseInt(firstRootHex.dataset.scaleIndex, 10);
              firstRootHex.classList.add('hex-selected');
              currentSelectedValue = defaultScaleIndex;
              foundRoot = true;
          } else {
               const firstAvailableInScaleHex = container.querySelector('.hexagon-note.hex-in-scale:not(.hex-disabled)');
               if (firstAvailableInScaleHex && firstAvailableInScaleHex.dataset.scaleIndex !== undefined) {
                    defaultScaleIndex = parseInt(firstAvailableInScaleHex.dataset.scaleIndex, 10);
                    firstAvailableInScaleHex.classList.add('hex-selected');
                    currentSelectedValue = defaultScaleIndex;
               } else {
                    const firstHex = container.querySelector('.hexagon-note:not(.hex-disabled)');
                    if (firstHex && firstHex.dataset.scaleIndex !== undefined) {
                         defaultScaleIndex = parseInt(firstHex.dataset.scaleIndex, 10);
                         firstHex.classList.add('hex-selected');
                         currentSelectedValue = defaultScaleIndex;
                    }
               }
          }
           noteIndexToAdd = defaultScaleIndex;

          if (isEditing && targetElementsData.length > 0) {
               applyScaleIndexToSelection(defaultScaleIndex, targetElementsData);
          }
      }
  });
  parentElement.insertBefore(randomToggleButton, parentElement.firstChild);

  const midiStartNote = 24;
  const octavesToDisplay = 3;
  const noteCount = 12 * octavesToDisplay + 1;
  const hexColumnsLayout = [5, 6, 6, 7, 6, 6, 5];
  let currentHexIndex = 0;
  const scaleIndexToMidiMap = new Map();

  const relevantStartIndex = -12;
  const relevantEndIndex = 36;
  for (let i = relevantStartIndex; i < relevantEndIndex; i++) {
    const midi = Math.round(frequencyToMidi(getFrequency(currentScale, i)));
    if (!isNaN(midi)) {
        scaleIndexToMidiMap.set(i, midi);
    }
  }

  for (const [colIndex, hexesInColumn] of hexColumnsLayout.entries()) {
      const columnDiv = document.createElement("div");
      columnDiv.classList.add("hex-column");
      columnDiv.style.setProperty('--column', colIndex + 1);

      for (let i = 0; i < hexesInColumn; i++) {
          if (currentHexIndex >= noteCount) break;
          const midiNote = midiStartNote + currentHexIndex;
          const noteName = getNoteName(midiNote);
          const hexDiv = document.createElement("div");
          hexDiv.classList.add("hexagon-note");
          hexDiv.textContent = noteName;
          hexDiv.dataset.midiNote = midiNote;

          const noteModulo = midiNote % 12;
          const rootModulo = currentRootNote % 12;
          const intervalFromRoot = (noteModulo - rootModulo + 12) % 12;
          const isRoot = noteModulo === rootModulo;
          const isInScale = currentScale.notes.includes(intervalFromRoot);
          let closestScaleIndex = null;
          let minDiff = Infinity;

          for (const [scaleIndex, scaleMidi] of scaleIndexToMidiMap.entries()) {
              const diff = Math.abs(midiNote - scaleMidi);
              if (diff === 0) {
                  minDiff = diff;
                  closestScaleIndex = scaleIndex;
                  break;
              }
              if (diff < minDiff) {
                  minDiff = diff;
                  closestScaleIndex = scaleIndex;
              }
          }

          if (closestScaleIndex === null) closestScaleIndex = 0;
          hexDiv.dataset.scaleIndex = closestScaleIndex;

          if (isRoot) {
            hexDiv.classList.add("hex-root");
          } else if (isInScale) {
            hexDiv.classList.add("hex-in-scale");
          } else {
            hexDiv.classList.add("hex-disabled");
          }

          if (!isRandomActive && closestScaleIndex === currentSelectedValue && !hexDiv.classList.contains('hex-disabled')) {
              hexDiv.classList.add("hex-selected");
          }

          hexDiv.addEventListener("mousedown", (e) => {
              e.stopPropagation();
              if (e.currentTarget.classList.contains('hex-disabled')) {
                   console.log("Clicked disabled hex. Ignoring.");
                  return;
              }

              const clickedScaleIndexStr = e.currentTarget.dataset.scaleIndex;
              const clickedMidiNote = e.currentTarget.dataset.midiNote;

              if (clickedScaleIndexStr === undefined || clickedScaleIndexStr === null) {
                   console.error("Clicked hex is missing data-scale-index attribute.");
                   return;
              }
              const clickedScaleIndex = parseInt(clickedScaleIndexStr, 10);
              console.log(`Hex Click Detected. MIDI: ${clickedMidiNote}, ScaleIndex: ${clickedScaleIndex}`);


              isRandomActive = false;
              randomToggleButton.classList.remove('active');
              currentSelectedValue = clickedScaleIndex;

              if (isEditing) {
                  console.log(`Applying scale index ${clickedScaleIndex} to selection.`);
                  applyScaleIndexToSelection(clickedScaleIndex, targetElementsData);
              } else {
                  console.log(`Setting noteIndexToAdd to ${clickedScaleIndex}.`);
                  noteIndexToAdd = clickedScaleIndex;
              }

              console.log("Updating visual selection...");
              const previouslySelected = container.querySelectorAll('.hexagon-note.hex-selected');

              previouslySelected.forEach(selectedHex => {
                  console.log("Removing .hex-selected from MIDI:", selectedHex.dataset.midiNote);
                  selectedHex.classList.remove('hex-selected');
              });

              console.log("Adding .hex-selected to MIDI:", clickedMidiNote);
              e.currentTarget.classList.add('hex-selected');
              console.log("Visual selection update complete.");
          });
          columnDiv.appendChild(hexDiv);
          currentHexIndex++;
      }
      if (columnDiv.hasChildNodes()) {
           container.appendChild(columnDiv);
      }
      if (currentHexIndex >= noteCount) break;
  }
  parentElement.appendChild(container);
}

// De hulpfunctie applyScaleIndexToSelection blijft ongewijzigd
function applyScaleIndexToSelection(scaleIndex, targetElementsData) {
  let changed = false;
  targetElementsData.forEach((elData) => {
      const element = elData.type === "node" ? findNodeById(elData.id) : findConnectionById(elData.id);
       if (element && element.audioParams) {
           if (element.audioParams.scaleIndex !== scaleIndex) {
               element.audioParams.scaleIndex = scaleIndex;
               element.audioParams.pitch = getFrequency(currentScale, scaleIndex);
               if (elData.type === "node") updateNodeAudioParams(element);
               else if (elData.type === "connection") updateConnectionAudioParams(element);
               changed = true;
               element.animationState = 0.1
               setTimeout(() => {
                 const checkElem = elData.type === "node" ? findNodeById(elData.id) : findConnectionById(elData.id);
                 if (checkElem && checkElem.animationState > 0 && !checkElem.isTriggered) {
                      checkElem.animationState = 0;
                 }
               }, 150);
           }
       }
  });
  if (changed) {
      saveState();
  }
}

function resetSideToolbars() {
  sideToolbar.classList.add("hidden")
  hamburgerMenuPanel.classList.add("hidden")
  hamburgerBtn.classList.remove("active")
  const sideButtons = sideToolbarContent.querySelectorAll(
    ".type-button, .waveform-button, .drum-element-button"
  )
  sideButtons.forEach((btn) => btn.classList.remove("selected"))
  removeNoteSelector()
  editPanelContent.innerHTML = ""
}
// Zorg dat deze constante bovenaan je app.js is gedefinieerd:
// const glideToolButton = document.getElementById('glide-tool-button');

function setActiveTool(toolName) {
  if (currentTool === 'brush' && toolName !== 'brush') {
      isBrushing = false;
      lastBrushNode = null;
      sideToolbar.classList.add("hidden");
      if (brushBtn) brushBtn.classList.remove('active'); // Zorg dat knop uit gaat
  }
  if (currentTool === "add" && toolName !== "add") {
      nodeTypeToAdd = null;
      waveformToAdd = null;
      noteIndexToAdd = -1;
      if (toolName !== 'brush') resetSideToolbars(); // Reset alleen als nieuwe tool niet brush is
      const addButtons = toolbar.querySelectorAll("#toolbar-add-elements button");
      addButtons.forEach((btn) => btn.classList.remove("active"));
  }

  currentTool = toolName;
  connectingNode = null;
  isConnecting = false;
  connectionTypeToAdd = 'standard';

  editBtn.classList.toggle("active", toolName === "edit");
  connectBtn.classList.toggle("active", toolName === "connect");
  connectStringBtn.classList.toggle("active", toolName === "connect_string");
  if (glideToolButton) {
    glideToolButton.classList.toggle('active', toolName === 'connect_glide');
  }
  deleteBtn.classList.toggle("active", toolName === "delete");
  if (brushBtn) { // Check of brushBtn bestaat
       brushBtn.classList.toggle('active', toolName === 'brush');
  }


  if (toolName !== "add" && toolName !== "brush") {
      const addButtons = toolbar.querySelectorAll("#toolbar-add-elements button");
      addButtons.forEach((btn) => btn.classList.remove("active"));
      resetSideToolbars();
  } else if (toolName === 'add') {
       // Als 'add' wordt geselecteerd, sluit andere panelen
       hamburgerMenuPanel.classList.add("hidden");
       hamburgerBtn.classList.remove("active");
       if (brushBtn) brushBtn.classList.remove('active'); // Deactiveer brush knop
       sideToolbar.classList.add('hidden'); // Verberg eventueel brush paneel
  } else if (toolName === 'brush') {
       // Als 'brush' wordt geselecteerd, sluit andere panelen/reset 'add' state
       nodeTypeToAdd = null; waveformToAdd = null; noteIndexToAdd = -1;
       const addButtons = toolbar.querySelectorAll("#toolbar-add-elements button");
       addButtons.forEach(btn => btn.classList.remove("active"));
       hamburgerMenuPanel.classList.add("hidden");
       hamburgerBtn.classList.remove("active");
       // Het tonen van het brush paneel gebeurt in de event listener van de knop
  }

  isResizing = false;
  isSelecting = false;
  selectionRect.active = false;
  isPanning = false;
  updateGroupControlsUI();
  updateRestartPulsarsButtonVisibility();
  hideBottomPanels();
  if (toolName === "edit") {
       populateEditPanel();
  } else {
       editPanelContent.innerHTML = ""; // Maak edit panel leeg als andere tool actief is
       // Als er elementen geselecteerd waren, deselecteer ze misschien?
       // selectedElements.clear();
       // updateConstellationGroup();
  }
}
  
  function populateSideToolbar(contentType, title) {
    sideToolbarContent.innerHTML = "";
    noteSelectElement = null;
    noteSelectContainer = null;
    const groupDiv = document.createElement("div");
    groupDiv.classList.add("type-group");

    if (contentType === "waveforms") {
        // Toon alleen non-sampler waveforms voor Sound Star / Nebula
        const isNebula = nodeTypeToAdd === "nebula";
        sideToolbarTitle.textContent = title || (isNebula ? "Nebula Sounds" : "Synth Sounds");
        const nonSamplerWaveforms = waveformTypes.filter(wf => !wf.type.startsWith('sampler_'));
        nonSamplerWaveforms.forEach((wf) => {
            const button = document.createElement("button");
            button.classList.add("waveform-button");
            button.dataset.waveform = wf.type;
            // <<< GEBRUIK BACKTICKS HIER >>>
            button.innerHTML = `<span class="type-icon">${wf.icon}</span>${wf.label}`;
            button.disabled = (isNebula && (wf.type === 'fmBell' || wf.type === 'fmXylo'));
             if (button.disabled) {
                 button.title = `${wf.label} not available for Nebulas`;
                 button.classList.add("disabled");
             }
            if (waveformToAdd === wf.type) button.classList.add("selected");
            button.addEventListener("click", () => handleWaveformSelect(button, wf.type));
            groupDiv.appendChild(button);
        });
        sideToolbarContent.appendChild(groupDiv);
        createHexNoteSelectorDOM(sideToolbarContent);

    } else if (contentType === "samplers") { // Handler voor de nieuwe sampler knop
        sideToolbarTitle.textContent = title || "Samplers";
        if (typeof SAMPLER_DEFINITIONS !== 'undefined') {
            SAMPLER_DEFINITIONS.forEach((sampler) => {
                const button = document.createElement("button");
                button.classList.add("waveform-button");
                const waveformType = `sampler_${sampler.id}`;
                button.dataset.waveform = waveformType;
                 // <<< GEBRUIK BACKTICKS HIER >>>
                button.innerHTML = `<span class="type-icon">${sampler.icon}</span>${sampler.label}`;
                button.disabled = sampler.loadFailed;
                if (sampler.loadFailed) {
                    button.title = `${sampler.label} sample failed to load`;
                    button.classList.add("disabled");
                }
                if (nodeTypeToAdd === "sound" && waveformToAdd === waveformType) {
                    button.classList.add("selected");
                }
                button.addEventListener("click", () => handleWaveformSelect(button, waveformType));
                groupDiv.appendChild(button);
            });
        } else {
             groupDiv.textContent = "Error: Sampler definitions not loaded.";
        }
        sideToolbarContent.appendChild(groupDiv);
        createHexNoteSelectorDOM(sideToolbarContent); // Ook noot selector voor samplers

    } else if (contentType === "pulsarTypes") {
        sideToolbarTitle.textContent = title || "Pulsars";
        pulsarTypes.forEach((pt) => {
            const button = document.createElement("button");
            button.classList.add("type-button");
            button.dataset.type = pt.type;
             // <<< GEBRUIK BACKTICKS HIER >>>
            button.innerHTML = `<span class="type-icon">${pt.icon}</span>${pt.label}`;
            if (nodeTypeToAdd === pt.type) button.classList.add("selected");
            button.addEventListener("click", () => handleElementTypeSelect(button, pt.type));
            groupDiv.appendChild(button);
        });
        sideToolbarContent.appendChild(groupDiv);

    } else if (contentType === "drumElements") {
        sideToolbarTitle.textContent = title || "Drum Elements";
        drumElementTypes.forEach((dt) => {
            const button = document.createElement("button");
            button.classList.add("drum-element-button");
            button.dataset.type = dt.type;
             // <<< GEBRUIK BACKTICKS HIER >>>
            button.innerHTML = `<span class="type-icon">${dt.icon}</span>${dt.label}`;
            if (nodeTypeToAdd === dt.type) button.classList.add("selected");
            button.addEventListener("click", () => handleElementTypeSelect(button, dt.type));
            groupDiv.appendChild(button);
        });
        sideToolbarContent.appendChild(groupDiv);
    }

    // Zorg dat de toolbar zichtbaar wordt etc.
    sideToolbar.classList.remove("hidden");
    hamburgerMenuPanel.classList.add("hidden");
    hamburgerBtn.classList.remove("active");
}

function populateBrushOptionsPanel() {
  sideToolbarContent.innerHTML = "";
  sideToolbarTitle.textContent = "Brush Options";
  noteSelectElement = null;
  noteSelectContainer = null; // Zorg dat oude noot selectoren weg zijn

  const nodeTypeGroup = document.createElement('div');
  nodeTypeGroup.classList.add('type-group');
  nodeTypeGroup.style.marginBottom = '15px';

  const soundStarHeader = document.createElement('p');
  soundStarHeader.textContent = "Synth Sounds:";
  soundStarHeader.style.fontWeight = 'bold';
  soundStarHeader.style.marginBottom = '5px';
  nodeTypeGroup.appendChild(soundStarHeader);

  const nonSamplerWaveforms = waveformTypes.filter(wf => !wf.type.startsWith('sampler_'));
  nonSamplerWaveforms.forEach(wf => {
      const button = document.createElement("button");
      button.classList.add("waveform-button");
      button.dataset.nodeType = 'sound';
      button.dataset.waveform = wf.type;
      button.innerHTML = `<span class="type-icon">${wf.icon}</span>${wf.label}`;
      if (brushNodeType === 'sound' && brushWaveform === wf.type) {
          button.classList.add("selected");
      }
      button.addEventListener("click", () => {
          brushNodeType = 'sound';
          brushWaveform = wf.type;
          nodeTypeGroup.querySelectorAll('.waveform-button, .sampler-button').forEach(btn => btn.classList.remove('selected'));
          button.classList.add('selected');
      });
      nodeTypeGroup.appendChild(button);
  });

   const samplerHeader = document.createElement('p');
   samplerHeader.textContent = "Samplers:";
   samplerHeader.style.fontWeight = 'bold';
   samplerHeader.style.marginTop = '10px';
   samplerHeader.style.marginBottom = '5px';
   nodeTypeGroup.appendChild(samplerHeader);

   const samplerWaveformTypes = (typeof SAMPLER_DEFINITIONS !== 'undefined')
      ? SAMPLER_DEFINITIONS.map(sampler => ({
          type: `sampler_${sampler.id}`,
          label: sampler.label,
          icon: sampler.icon,
          loadFailed: sampler.loadFailed,
          nodeType: 'sound'
      })) : [];

   samplerWaveformTypes.forEach((sampler) => {
      const button = document.createElement("button");
      button.classList.add("sampler-button", "waveform-button");
      button.dataset.nodeType = 'sound';
      button.dataset.waveform = sampler.type;
      button.innerHTML = `<span class="type-icon">${sampler.icon}</span>${sampler.label}`;
      button.disabled = sampler.loadFailed;
      if (sampler.loadFailed) {
          button.title = `${sampler.label} sample failed to load`;
          button.classList.add("disabled");
      }
      if (brushNodeType === 'sound' && brushWaveform === sampler.type) {
          button.classList.add("selected");
      }
      button.addEventListener("click", () => {
           if (button.disabled) return;
           brushNodeType = 'sound';
           brushWaveform = sampler.type;
           nodeTypeGroup.querySelectorAll('.waveform-button, .sampler-button').forEach(btn => btn.classList.remove('selected'));
           button.classList.add('selected');
      });
      nodeTypeGroup.appendChild(button);
   });

  sideToolbarContent.appendChild(nodeTypeGroup);

  const pulseOptionDiv = document.createElement('div');
  pulseOptionDiv.classList.add('panel-section');
  const pulseLabel = document.createElement('label');
  pulseLabel.htmlFor = 'brushStartPulseCheckbox';
  pulseLabel.style.display = 'inline-block';
  pulseLabel.style.marginRight = '5px';
  pulseLabel.textContent = 'Start keten met puls?';
  const pulseCheckbox = document.createElement('input');
  pulseCheckbox.type = 'checkbox';
  pulseCheckbox.id = 'brushStartPulseCheckbox';
  pulseCheckbox.checked = brushStartWithPulse;
  pulseCheckbox.style.verticalAlign = 'middle';
  pulseCheckbox.addEventListener('change', (e) => {
      brushStartWithPulse = e.target.checked;
  });
  pulseOptionDiv.appendChild(pulseLabel); // Label eerst
  pulseOptionDiv.appendChild(pulseCheckbox); // Dan checkbox

  sideToolbarContent.appendChild(pulseOptionDiv);

  sideToolbar.classList.remove("hidden");
  hamburgerMenuPanel.classList.add("hidden");
  hamburgerBtn.classList.remove("active");
}


  function handleElementTypeSelect(button, elementType) {
    nodeTypeToAdd = elementType
    waveformToAdd = elementType
    noteIndexToAdd = -1
    const currentTypeButtons = sideToolbarContent.querySelectorAll(
      ".type-button, .drum-element-button"
    )
    currentTypeButtons.forEach((btn) => btn.classList.remove("selected"))
    if (button) button.classList.add("selected")
    removeNoteSelector()
  }
  function handleWaveformSelect(button, waveformType) {
    if (nodeTypeToAdd !== "sound" && nodeTypeToAdd !== "nebula") return
    waveformToAdd = waveformType
    const currentWaveButtons = sideToolbarContent.querySelectorAll(
      ".waveform-button"
    )
    currentWaveButtons.forEach((btn) => btn.classList.remove("selected"))
    button.classList.add("selected")
    if (!noteSelectContainer) createHexNoteSelectorDOM(sideToolbarContent)
  }
   

  function updateScaleAndTransposeUI() {
    if (scaleSelectPianoRoll) scaleSelectPianoRoll.value = currentScaleKey;
  }
function changeScale(scaleKey, skipNodeUpdate = false) {
  if (!scales[scaleKey]) return
  currentScaleKey = scaleKey
  currentScale = scales[scaleKey]
  document.body.className = currentScale.theme
  scaleSelectPianoRoll.value = scaleKey
  if (!skipNodeUpdate) {
    nodes.forEach((node) => {
      if (node.type === "sound" || node.type === "nebula") {
        node.audioParams.scaleIndex = Math.max(
          MIN_SCALE_INDEX,
          Math.min(MAX_SCALE_INDEX, node.audioParams.scaleIndex ?? 0)
        )
        node.audioParams.pitch = getFrequency(
          currentScale,
          node.audioParams.scaleIndex
        )
        if (isNaN(node.audioParams.pitch)) {
          node.audioParams.scaleIndex = 0
          node.audioParams.pitch = getFrequency(currentScale, 0)
        }
        updateNodeAudioParams(node)
      }
    })
    connections.forEach((conn) => {
      if (conn.type === "string_violin") {
        conn.audioParams.scaleIndex = Math.max(
          MIN_SCALE_INDEX,
          Math.min(MAX_SCALE_INDEX, conn.audioParams.scaleIndex ?? 0)
        )
        conn.audioParams.pitch = getFrequency(
          currentScale,
          conn.audioParams.scaleIndex
        )
        if (isNaN(conn.audioParams.pitch)) {
          conn.audioParams.scaleIndex = 0
          conn.audioParams.pitch = getFrequency(currentScale, 0)
        }
        updateConnectionAudioParams(conn)
      }
    })
  }
  if (
    !sideToolbar.classList.contains("hidden") &&
    (nodeTypeToAdd === "sound" || nodeTypeToAdd === "nebula")
  ) {
    noteIndexToAdd = -1
    createHexNoteSelectorDOM(sideToolbarContent)
  }
  drawPianoRoll();
  populateEditPanel()
  if (!skipNodeUpdate) saveState()
}
function updateSyncUI() {
  globalSyncToggleBtn.textContent = `Sync: ${
    isGlobalSyncEnabled ? "ON" : "OFF"
  }`
  globalSyncToggleBtn.classList.toggle("active", isGlobalSyncEnabled)
  bpmControlsDiv.classList.toggle("hidden", !isGlobalSyncEnabled)
  globalBpmInput.value = globalBPM
  updateRestartPulsarsButtonVisibility()
  populateEditPanel()
}
function updateRestartPulsarsButtonVisibility() {
  let showButton = false
  if (
    currentTool === "edit" &&
    !isGlobalSyncEnabled &&
    selectedElements.size > 0
  ) {
    for (const el of selectedElements) {
      if (el.type === "node") {
        const node = findNodeById(el.id)
        if (node && node.isStartNode && node.type !== "pulsar_triggerable") {
          showButton = true
          break
        }
      }
    }
  }
  restartPulsarsBtn.classList.toggle("hidden", !showButton)
}
function updateInfoToggleUI() {
  toggleInfoTextBtn.textContent = `Info: ${isInfoTextVisible ? "ON" : "OFF"}`
  toggleInfoTextBtn.classList.toggle("active", isInfoTextVisible)
}

function updateMixerUI() {
  if (!isAudioReady) return;
  if (masterGain && masterVolumeSlider && masterVolumeValue) {
      masterVolumeSlider.value = masterGain.gain.value;
      masterVolumeValue.textContent = parseFloat(masterVolumeSlider.value).toFixed(2);
  }
  if (masterDelaySendGain && delaySendSlider && delaySendValue) {
      delaySendSlider.value = masterDelaySendGain.gain.value;
      delaySendValue.textContent = parseFloat(delaySendSlider.value).toFixed(2);
  }
  if (delayNode && delayTimeSlider && delayTimeValue) {
      delayTimeSlider.value = delayNode.delayTime.value;
      delayTimeValue.textContent = parseFloat(delayTimeSlider.value).toFixed(2) + "s";
  }
  if (delayFeedbackGain && delayFeedbackSlider && delayFeedbackValue) {
      delayFeedbackSlider.value = delayFeedbackGain.gain.value;
      delayFeedbackValue.textContent = parseFloat(delayFeedbackSlider.value).toFixed(2);
  }
}

function hideBottomPanels() {
  mixerPanel.classList.add("hidden")
  pianoRollPanel.classList.add("hidden")
  mixerBtn.classList.remove("active")
  pianoRollBtn.classList.remove("active")
}

function togglePlayPause() {
  userHasInteracted = true
  if (!isAudioReady) {
    setupAudio().then((context) => {
      if (context) {
        if (context.state !== "running") {
          context
            .resume()
            .then(() => {
              isPlaying = true
              playPauseBtn.textContent = "Pause ⏸"
              startMessage.style.display = "none"
              startAnimationLoop()
              resetStartNodeTimers()
            })
            .catch((e) => {})
        } else {
          isPlaying = true
          playPauseBtn.textContent = "Pause ⏸"
          startMessage.style.display = "none"
          startAnimationLoop()
          resetStartNodeTimers()
        }
      } else {
        // Handle audio context creation failure if necessary
      }
    })
  } else if (audioContext.state === "running") {
    audioContext
      .suspend()
      .then(() => {
        isPlaying = false
        playPauseBtn.textContent = "Play ▶"
        if (animationFrameId) {
          cancelAnimationFrame(animationFrameId)
          animationFrameId = null
        }
        activePulses.forEach((p) => {
          const conn = findConnectionById(p.connectionId)
          if (conn && conn.type === "string_violin") stopStringSound(conn)
        })
      })
      .catch((e) => {})
  } else if (audioContext.state === "suspended") {
    // <<< Continue from here
    audioContext
      .resume()
      .then(() => {
        isPlaying = true
        playPauseBtn.textContent = "Pause ⏸"
        startMessage.style.display = "none"
        startAnimationLoop()
        resetStartNodeTimers()
      })
      .catch((e) => {})
  }
}

function resetStartNodeTimers() {
  const nowTime = audioContext ? audioContext.currentTime : 0
  nodes.forEach((node) => {
    if (node.isStartNode) {
      node.lastTriggerTime = -1
      node.nextSyncTriggerTime = 0
      node.nextGridTriggerTime = 0
      node.nextRandomTriggerTime = 0
    }
  })
  lastBeatTime = 0
}

playPauseBtn.addEventListener("click", togglePlayPause)
hamburgerBtn.addEventListener("click", () => {
  const isOpen = !hamburgerMenuPanel.classList.contains("hidden")
  resetSideToolbars()
  hideBottomPanels()
  if (!isOpen) {
    hamburgerMenuPanel.classList.remove("hidden")
    setActiveTool("edit")
    hamburgerBtn.classList.add("active")
    populateEditPanel()
  } else {
    hamburgerMenuPanel.classList.add("hidden")
    hamburgerBtn.classList.remove("active")
  }
})
scaleSelectPianoRoll.addEventListener("change", (e) =>
  changeScale(e.target.value)
)
// VERVANG de bestaande 'input' listener voor groupVolumeSlider met deze:
if (groupVolumeSlider) { // Check of de slider bestaat
  groupVolumeSlider.addEventListener("input", (e) => {
      // Vind welke groep momenteel geselecteerd is
      if (currentConstellationGroup.size > 0) {
          // Pak het ID van de eerste node in de selectie (alle nodes in selectie horen bij dezelfde groep)
          const firstSelectedNodeId = currentConstellationGroup.values().next().value;
          // Zoek de volledige groep data op in onze lijst van alle groepen
          const selectedGroup = findGroupContainingNode(firstSelectedNodeId);

          if (selectedGroup) {
              // Roep setSpecificGroupVolume aan voor DEZE specifieke groep
              setSpecificGroupVolume(selectedGroup.id, parseFloat(e.target.value));
          } else {
               // Dit zou niet vaak moeten gebeuren als de selectie klopt
               console.warn("Selected group node ID not found in any identified group.");
          }
      } else {
           // Geen groep geselecteerd, de slider zou verborgen moeten zijn, maar doe voor de zekerheid niets.
      }

      // Update eventueel label direct voor snellere visuele feedback (optioneel)
      const vol = parseFloat(e.target.value);
      const originalLabel = document.querySelector('label[for="groupVolumeSlider"]');
      if (originalLabel && originalLabel.textContent.includes('(')) {
         originalLabel.textContent = `Group Volume (${vol.toFixed(2)}):`;
      }
  });

  // De 'change' listener voor saveState kan blijven zoals hij was:
  groupVolumeSlider.addEventListener("change", saveState);
}
groupFluctuateToggle.addEventListener("change", (e) => {
  const isChecked = e.target.checked
  const currentGroupIDs = Array.from(currentConstellationGroup)
  if (isChecked) {
    currentGroupIDs.forEach((id) => fluctuatingGroupNodeIDs.add(id))
  } else {
    currentGroupIDs.forEach((id) => fluctuatingGroupNodeIDs.delete(id))
  }
  updateFluctuatingNodesLFO()
  groupFluctuateAmount.disabled = !isChecked
  saveState()
})
groupFluctuateAmount.addEventListener("input", applyGroupFluctuationSettings)
groupFluctuateAmount.addEventListener("change", saveState)

gridToggleBtn.addEventListener("click", () => {
  isGridVisible = !isGridVisible
  gridToggleBtn.textContent = `Grid: ${isGridVisible ? "ON" : "OFF"}`
  gridToggleBtn.classList.toggle("active", isGridVisible)
  gridOptionsDiv.classList.toggle("hidden", !isGridVisible)
})
gridTypeBtn.addEventListener("click", () => {
  gridType = gridType === "lines" ? "dots" : "lines"
  gridTypeBtn.textContent = `Type: ${gridType === "lines" ? "Lines" : "Dots"}`
})
gridSnapBtn.addEventListener("click", () => {
  isSnapEnabled = !isSnapEnabled
  gridSnapBtn.textContent = `Snap: ${isSnapEnabled ? "ON" : "OFF"}`
  gridSnapBtn.classList.toggle("active", isSnapEnabled)
})
toggleInfoTextBtn.addEventListener("click", () => {
  isInfoTextVisible = !isInfoTextVisible
  updateInfoToggleUI()
})
globalSyncToggleBtn.addEventListener("click", () => {
  isGlobalSyncEnabled = !isGlobalSyncEnabled
  nodes.forEach((n) => {
    if (n.isStartNode) {
      n.lastTriggerTime = -1
      n.nextSyncTriggerTime = 0
      n.nextGridTriggerTime = 0
      n.nextRandomTriggerTime = 0
    }
  })
  lastBeatTime = 0
  updateSyncUI()
  saveState()
})
globalBpmInput.addEventListener("change", (e) => {
  const newBPM = parseInt(e.target.value, 10)
  if (!isNaN(newBPM) && newBPM >= 30 && newBPM <= 300) {
    globalBPM = newBPM
    nodes.forEach((n) => {
      if (n.isStartNode) {
        n.nextSyncTriggerTime = 0
        n.nextGridTriggerTime = 0
      }
    })
    saveState()
  } else {
    globalBpmInput.value = globalBPM
  }
})
restartPulsarsBtn.addEventListener("click", () => {
  if (!isAudioReady || isGlobalSyncEnabled) return
  const nowTime = audioContext.currentTime
  let restarted = false
  selectedElements.forEach((el) => {
    if (el.type === "node") {
      const node = findNodeById(el.id)
      if (node && node.isStartNode && node.type !== "pulsar_triggerable") {
        node.lastTriggerTime = nowTime
        node.isEnabled = true
        node.animationState = 0.5
        setTimeout(() => {
          const checkNode = findNodeById(node.id)
          if (checkNode) checkNode.animationState = 0
        }, 150)
        restarted = true
      }
    }
  })
  if (restarted) {
    saveState()
  }
})

function setupAddTool(buttonElement, type, requiresSubmenu = false, submenuType = null, submenuTitle = "") {
  setActiveTool("add");
  const addButtons = toolbar.querySelectorAll("#toolbar-add-elements button");
  addButtons.forEach((btn) => {
      if (btn !== buttonElement) btn.classList.remove("active");
  });
  if (buttonElement) buttonElement.classList.add("active");
  nodeTypeToAdd = type;
  console.log(`DEBUG setupAddTool: nodeTypeToAdd is nu gezet op: ${nodeTypeToAdd}`);
  waveformToAdd = null;
  noteIndexToAdd = -1;
  if (requiresSubmenu && submenuType) {
      populateSideToolbar(submenuType, submenuTitle);
  } else {
      resetSideToolbars();
      sideToolbar.classList.add("hidden");
  }
}
addSoundStarBtn.addEventListener("click", (e) => {
  setupAddTool(e.currentTarget, "sound", true, "waveforms", "Sounds")
})
addNebulaBtn.addEventListener("click", (e) => {
  setupAddTool(e.currentTarget, "nebula", true, "waveforms", "Nebula Sounds")
})
addPulsarBtn.addEventListener("click", (e) => {
  setupAddTool(e.currentTarget, null, true, "pulsarTypes", "Pulsars")
})
addDrumElementBtn.addEventListener("click", (e) => {
  setupAddTool(e.currentTarget, null, true, "drumElements", "Drum Elements")
})
const addPortalNebulaBtn = document.getElementById("addPortalNebulaBtn");
    if (addPortalNebulaBtn) {
        addPortalNebulaBtn.addEventListener('click', (e) => {
            setupAddTool(e.currentTarget, PORTAL_NEBULA_TYPE, false);
        });
    } else {
        console.warn("#addPortalNebulaBtn not found");
    }
    const brushBtn = document.getElementById("brushBtn");
    if (brushBtn) {
        brushBtn.addEventListener('click', (e) => {
            setActiveTool('brush');
            populateBrushOptionsPanel(); // Deze functie maken we later
        });
    } else {
        console.warn("#brushBtn not found");
    }
if (addSamplerBtn) { // Check of de knop gevonden is in de HTML
  addSamplerBtn.addEventListener("click", (e) => {
      // Voeg een log toe om te zien of de klik werkt:
      console.log("Sampler button clicked!");

      // Roep setupAddTool aan om de zijbalk te openen met sampler opties
      setupAddTool(e.currentTarget, "sound", true, "samplers", "Samplers");
  });
} else {
  // Deze melding zou je in de console moeten zien als de knop-ID fout is in HTML of JS
  console.error("#addSamplerBtn element niet gevonden!");
}
addGateBtn.addEventListener("click", (e) => {
  setupAddTool(e.currentTarget, "gate")
})
addProbabilityGateBtn.addEventListener("click", (e) => {
  setupAddTool(e.currentTarget, "probabilityGate")
})
addPitchShiftBtn.addEventListener("click", (e) => {
  setupAddTool(e.currentTarget, "pitchShift")
})
addRelayBtn.addEventListener("click", (e) => {
  setupAddTool(e.currentTarget, "relay")
})
addReflectorBtn.addEventListener("click", (e) => {
  setupAddTool(e.currentTarget, "reflector")
})
addSwitchBtn.addEventListener("click", (e) => {
  setupAddTool(e.currentTarget, "switch")
})

editBtn.addEventListener("click", () => setActiveTool("edit"))
connectBtn.addEventListener("click", () => setActiveTool("connect"))
connectStringBtn.addEventListener("click", () =>
  setActiveTool("connect_string")
)
deleteBtn.addEventListener("click", () => setActiveTool("delete"))
undoBtn.addEventListener("click", () => {
  undo()
})
redoBtn.addEventListener("click", () => {
  redo()
})
mixerBtn.addEventListener("click", () => {
  const isOpen = !mixerPanel.classList.contains("hidden");
  resetSideToolbars();
  hideBottomPanels(); // Sluit andere panelen

  if (!isOpen) {
      // Paneel openen
      mixerPanel.classList.remove("hidden");
      mixerBtn.classList.add("active");
      console.log("Mixer Knop Geklikt - Controleer isReverbReady:", isReverbReady); // LOG 1
      console.log("Mixer Knop Geklikt - Roep updateMixerGUI aan..."); // LOG 2
      updateMixerGUI(); // <<== Zorg dat DIT de functie is die we hebben bijgewerkt!
      // updateMixerUI(); // Verwijder deze regel als hij er stond, het is een oudere functie
  } else {
      // Paneel sluiten (gebeurt al door hideBottomPanels, maar zet knop uit)
      mixerBtn.classList.remove("active");
  }
});
pianoRollBtn.addEventListener("click", () => {
  const isOpen = !pianoRollPanel.classList.contains("hidden")
  resetSideToolbars()
  hideBottomPanels()
  if (!isOpen) {
    pianoRollPanel.classList.remove("hidden")
    pianoRollBtn.classList.add("active")
    updateScaleAndTransposeUI()
    // Zorg dat canvas dimensies correct zijn en teken opnieuw
    if (pianoRollCanvas && pianoRollCtx) {
      try {
           pianoRollCanvas.width = pianoRollCanvas.clientWidth;
           pianoRollCanvas.height = pianoRollCanvas.clientHeight;
           drawPianoRoll(); // <-- Zorg dat deze aanroep er staat
      } catch(e) {
           console.warn("Kon pianoRollCanvas niet tekenen bij openen paneel:", e);
      }
 }
  }
})
masterVolumeSlider.addEventListener("input", (e) => {
  if (masterGain)
    masterGain.gain.setTargetAtTime(
      parseFloat(e.target.value),
      audioContext.currentTime,
      0.01
    )
  masterVolumeValue.textContent = parseFloat(e.target.value).toFixed(2)
})
masterVolumeSlider.addEventListener("change", saveState)
delaySendSlider.addEventListener("input", (e) => {
  if (masterDelaySendGain)
    masterDelaySendGain.gain.setTargetAtTime(
      parseFloat(e.target.value),
      audioContext.currentTime,
      0.01
    )
  delaySendValue.textContent = parseFloat(e.target.value).toFixed(2)
})
delaySendSlider.addEventListener("change", saveState)
delayTimeSlider.addEventListener("input", (e) => {
  if (delayNode)
    delayNode.delayTime.setTargetAtTime(
      parseFloat(e.target.value),
      audioContext.currentTime,
      0.01
    )
  delayTimeValue.textContent = parseFloat(e.target.value).toFixed(2) + "s"
})
delayTimeSlider.addEventListener("change", saveState)
delayFeedbackSlider.addEventListener("input", (e) => {
  if (delayFeedbackGain)
    delayFeedbackGain.gain.setTargetAtTime(
      parseFloat(e.target.value),
      audioContext.currentTime,
      0.01
    )
  delayFeedbackValue.textContent = parseFloat(e.target.value).toFixed(2)
})
delayFeedbackSlider.addEventListener("change", saveState)

window.addEventListener("keydown", (e) => {
  const targetIsInput = ["input", "select", "textarea"].includes(
      e.target.tagName.toLowerCase()
  );
  const bottomPanelOpen =
      !mixerPanel.classList.contains("hidden") ||
      !pianoRollPanel.classList.contains("hidden");

  if (targetIsInput && bottomPanelOpen) return;
  if (targetIsInput && !bottomPanelOpen && e.key !== "Escape") return;

  if (e.code === "Space" && !isSpacebarDown) {
      isSpacebarDown = true;
      e.preventDefault();
  }

  const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;
  const undoKeyPressed = (isMac ? e.metaKey : e.ctrlKey) && e.key.toLowerCase() === "z" && !e.shiftKey;
  const redoKeyPressed = (isMac ? e.metaKey : e.ctrlKey) && (e.key.toLowerCase() === "y" || (e.key.toLowerCase() === "z" && e.shiftKey));
  let panX = 0;
  let panY = 0;

  switch (e.key) {
      case "ArrowUp": panY = PAN_SPEED; break;
      case "ArrowDown": panY = -PAN_SPEED; break;
      case "ArrowLeft": panX = PAN_SPEED; break;
      case "ArrowRight": panX = -PAN_SPEED; break;
  }

  if (panX !== 0 || panY !== 0) {
      viewOffsetX += panX;
      viewOffsetY += panY;
      e.preventDefault();
  } else if (undoKeyPressed) {
      e.preventDefault();
      undo();
  } else if (redoKeyPressed) {
      e.preventDefault();
      redo();
  } else if (e.key.toLowerCase() === 'y' && !isMac && !e.ctrlKey && !e.metaKey) {
      globalSyncToggleBtn.click();
      e.preventDefault();
  } else if (e.key.toLowerCase() === 'g') {
      gridToggleBtn.click();
      e.preventDefault();
  } else if (isGridVisible && e.key.toLowerCase() === 'x' && !e.ctrlKey && !e.metaKey && !e.altKey) {
      gridTypeBtn.click();
      e.preventDefault();
  } else if (isGridVisible && e.key.toLowerCase() === 'n' && !e.ctrlKey && !e.metaKey && !e.altKey) {
      gridSnapBtn.click();
      e.preventDefault();
  } else if (e.key.toLowerCase() === 'i') {
      toggleInfoTextBtn.click();
      e.preventDefault();
  } else if ((e.key === "Delete" || e.key === "Backspace") && selectedElements.size > 0 && currentTool === "edit") {
      const elementsToRemove = [...selectedElements];
      selectedElements.clear();
      elementsToRemove.forEach((el) => {
          if (el.type === "node") removeNode(findNodeById(el.id));
          else if (el.type === "connection") removeConnection(findConnectionById(el.id));
      });
      populateEditPanel();
       isBrushing = false; // Stop ook brush bij delete
       lastBrushNode = null;
  } else if (e.key.toLowerCase() === 'e') {
      setActiveTool("edit");
      e.preventDefault();
  } else if (e.key.toLowerCase() === 'c') {
      setActiveTool("connect");
      e.preventDefault();
  } else if (e.key.toLowerCase() === 'v' && !targetIsInput) {
      setActiveTool("connect_string");
      e.preventDefault();
  } else if (e.key.toLowerCase() === 'b' && !targetIsInput && brushBtn) { // Sneltoets B voor Brush
       brushBtn.click(); // Simuleer klik op knop
       e.preventDefault();
  } else if (e.key.toLowerCase() === 'r' && !targetIsInput) {
      addRelayBtn.click();
      e.preventDefault();
  } else if (e.key.toLowerCase() === 'd' && !targetIsInput) {
      addDrumElementBtn.click();
      e.preventDefault();
  } else if (e.key.toLowerCase() === 's' && !targetIsInput) {
      addSoundStarBtn.click();
      e.preventDefault();
  } else if (e.key.toLowerCase() === 'w' && !targetIsInput) {
      addNebulaBtn.click();
      e.preventDefault();
  } else if (e.key.toLowerCase() === 'p' && !targetIsInput) {
      addPulsarBtn.click();
      e.preventDefault();
  } else if (e.key.toLowerCase() === 'm' && !targetIsInput) { // Check targetInput ook hier
      hamburgerBtn.click();
      e.preventDefault();
  } else if (e.key === 'Escape') {
      if (isBrushing) { // <<< NIEUWE CHECK HIER
          isBrushing = false;
          lastBrushNode = null;
          console.log("Brush: Chain ended by Escape key.");
          // Optioneel: reset cursor of UI? setActiveTool('edit') misschien?
          setActiveTool('edit'); // Ga terug naar edit mode
          e.preventDefault(); // Voorkom verdere Escape acties
          return; // Stop verdere verwerking van Escape in dit geval
      }
      // Bestaande Escape logica: deselecteer / sluit panelen / ga naar edit mode
      if (selectedElements.size > 0) {
           selectedElements.clear();
           populateEditPanel();
           updateConstellationGroup();
      }
      setActiveTool("edit");
      resetSideToolbars();
      hideBottomPanels();
      e.preventDefault(); // Voorkom standaard browser escape acties
  } else if (e.altKey && currentTool === "edit") {
      e.preventDefault();
  }
});
window.addEventListener("keyup", (e) => {
  if (e.code === "Space") {
    isSpacebarDown = false
  }
  if (e.altKey && currentTool === "edit") {
    e.preventDefault()
  }
})
canvas.addEventListener("wheel", handleWheel, { passive: false })
canvas.addEventListener("mousedown", handleMouseDown)
canvas.addEventListener("mousemove", handleMouseMove)
canvas.addEventListener("mouseup", handleMouseUp)
canvas.addEventListener("contextmenu", (e) => e.preventDefault())
function handleContextMenu(event) {
  if (isBrushing) {
      isBrushing = false;
      lastBrushNode = null;
      console.log("Brush: Chain ended by right-click.");
      event.preventDefault(); // Voorkom standaard contextmenu
      // Optioneel: update cursor of UI hier indien nodig
  }
  // Voorkom standaard contextmenu altijd op canvas
  event.preventDefault();
}

canvas.addEventListener('contextmenu', handleContextMenu);

function animationLoop() {
  animationFrameId = requestAnimationFrame(animationLoop);
  if (!isAudioReady || !isPlaying) return;
  const now = audioContext.currentTime;
  const deltaTime = Math.max(0, Math.min(0.1, now - (previousFrameTime || now)));
  const secondsPerBeat = 60.0 / globalBPM;

  if (isGlobalSyncEnabled && beatIndicatorElement) {
      if (now >= lastBeatTime + secondsPerBeat) {
          beatIndicatorElement.classList.add("active");
          setTimeout(() => beatIndicatorElement.classList.remove("active"), 50);
          lastBeatTime = Math.floor(now / secondsPerBeat) * secondsPerBeat;
      }
  } else if (beatIndicatorElement && beatIndicatorElement.classList.contains("active")) {
      beatIndicatorElement.classList.remove("active");
      lastBeatTime = 0;
  }

  nodes.forEach((node) => {
      if (node.isStartNode && node.isEnabled &&
          (node.type === "pulsar_standard" || node.type === "pulsar_random_volume" || node.type === "pulsar_random_particles")) {

          let shouldPulse = false;
          let pulseData = {};

          if (node.type === "pulsar_random_particles") {
              if (node.nextRandomTriggerTime === 0) {
                  node.nextRandomTriggerTime = now + (Math.random() * 2) / PULSAR_RANDOM_TIMING_CHANCE_PER_SEC;
              }
              if (now >= node.nextRandomTriggerTime) {
                  shouldPulse = true;
                  node.nextRandomTriggerTime = now + (Math.random() * 2) / PULSAR_RANDOM_TIMING_CHANCE_PER_SEC;
              }
          } else {
              if (isGlobalSyncEnabled) {
                  const subdiv = subdivisionOptions[node.syncSubdivisionIndex];
                  const nodeIntervalSeconds = secondsPerBeat * subdiv.value;
                  if (node.nextSyncTriggerTime === 0) {
                      const currentBeat = now / secondsPerBeat;
                      const currentSubdivision = Math.floor(currentBeat / subdiv.value);
                      node.nextSyncTriggerTime = (currentSubdivision + 1) * nodeIntervalSeconds;
                      if (node.nextSyncTriggerTime <= now + 0.005) node.nextSyncTriggerTime += nodeIntervalSeconds;
                  }
                  if (now >= node.nextSyncTriggerTime) {
                      shouldPulse = true;
                      node.nextSyncTriggerTime += nodeIntervalSeconds;
                       if (node.nextSyncTriggerTime <= now) {
                          node.nextSyncTriggerTime = Math.ceil(now / nodeIntervalSeconds) * nodeIntervalSeconds;
                           if (node.nextSyncTriggerTime <= now) node.nextSyncTriggerTime += nodeIntervalSeconds;
                      }
                  }
              } else {
                  if (node.lastTriggerTime < 0) node.lastTriggerTime = now - Math.random() * (node.audioParams.triggerInterval || DEFAULT_TRIGGER_INTERVAL);
                  if (now - node.lastTriggerTime >= (node.audioParams.triggerInterval || DEFAULT_TRIGGER_INTERVAL)) {
                      shouldPulse = true;
                      node.lastTriggerTime = now;
                  }
              }
          }

          if (shouldPulse) {
              pulseData = {
                  intensity: node.audioParams.pulseIntensity ?? DEFAULT_PULSE_INTENSITY,
                  color: node.color ?? null,
                  particleMultiplier: 1.0,
              };
              if (node.type === "pulsar_random_volume") {
                  pulseData.intensity = MIN_PULSE_INTENSITY + Math.random() * (MAX_PULSE_INTENSITY - MIN_PULSE_INTENSITY);
              }

              currentGlobalPulseId++;
              node.animationState = 1;
              setTimeout(() => { const checkNode = findNodeById(node.id); if (checkNode) checkNode.animationState = 0; }, 150);

              node.connections.forEach(neighborId => {
                  const neighborNode = findNodeById(neighborId);
                  const connection = connections.find(c => (c.nodeAId === node.id && c.nodeBId === neighborId) || (c.nodeAId === neighborId && c.nodeBId === node.id));
                  if (neighborNode && neighborNode.type !== 'nebula' && neighborNode.type !== PORTAL_NEBULA_TYPE && connection && neighborNode.lastTriggerPulseId !== currentGlobalPulseId) {
                      const travelTime = connection.length * DELAY_FACTOR;
                      createVisualPulse(connection.id, travelTime, node.id, Infinity, 'trigger', pulseData.color, pulseData.intensity);
                      propagateTrigger(neighborNode, travelTime, currentGlobalPulseId, node.id, Infinity, { type: 'trigger', data: pulseData }, connection);
                  }
              });
          }

      } else if (node.type === "gate") {
          node.currentAngle += GATE_ROTATION_SPEED * (deltaTime * 60);
          node.currentAngle %= 2 * Math.PI;
      } else if (node.type === "nebula") {
           // Use the lowered speeds
           node.currentAngle += NEBULA_ROTATION_SPEED_OUTER * (deltaTime * 60);
           node.currentAngle %= 2 * Math.PI;
           node.innerAngle += NEBULA_ROTATION_SPEED_INNER * (deltaTime * 60);
           node.innerAngle %= 2 * Math.PI;
           node.pulsePhase += NEBULA_PULSE_SPEED * (deltaTime * 60);
           node.pulsePhase %= 2 * Math.PI;
       } else if (node.type === PORTAL_NEBULA_TYPE) {
           // Update portal pulse phase for visuals
           node.pulsePhase += (PORTAL_NEBULA_DEFAULTS.pulseSpeed || 0.5) * (deltaTime * 60);
           node.pulsePhase %= 2 * Math.PI;
       }
  });

  updateNebulaInteractionAudio();

  if (currentTool === 'brush' && isBrushing && lastBrushNode) {
      if (Math.random() < 0.3) {
          createParticles(lastBrushNode.x, lastBrushNode.y, 1);
      }
  }

  draw();
  previousFrameTime = now;
}
function startAnimationLoop() {
  if (!animationFrameId) {
    previousFrameTime = audioContext
      ? audioContext.currentTime
      : performance.now() / 1000
    animationLoop()
  }
}

function createSlider(
  id,
  labelText,
  min,
  max,
  step,
  value,
  changeHandler,
  inputHandler = null
) {
  const container = document.createElement("div")
  const label = document.createElement("label")
  label.htmlFor = id
  label.textContent = labelText
  container.appendChild(label)
  const slider = document.createElement("input")
  slider.type = "range"
  slider.id = id
  slider.min = min
  slider.max = max
  slider.step = step
  slider.value = value
  slider.addEventListener("input", (e) => {
    if (inputHandler) inputHandler(e)
    else
      label.textContent = `${labelText.split("(")[0]}(${parseFloat(
        e.target.value
      ).toFixed(
        step.toString().includes(".") ? step.toString().split(".")[1].length : 0
      )}):`
  })
  slider.addEventListener("change", (e) => {
    if (changeHandler) changeHandler(e)
    saveState()
  })
  container.appendChild(slider)
  return container
}

function populateEditPanel() {
  editPanelContent.innerHTML = ""
  if (currentTool !== "edit" || selectedElements.size === 0) {
    if (
      !hamburgerMenuPanel.classList.contains("hidden") &&
      selectedElements.size === 0
    ) {
      hamburgerMenuPanel.classList.add("hidden")
      hamburgerBtn.classList.remove("active")
    }
    return
  }

  const selectedArray = Array.from(selectedElements)
  const firstElementData = selectedArray[0]
  const fragment = document.createDocumentFragment()
  const title = document.createElement("p")

  const nodeTypes = new Set(
    selectedArray
      .filter((el) => el.type === "node")
      .map((el) => findNodeById(el.id)?.type)
  )
  const connectionTypesSet = new Set(
    selectedArray
      .filter((el) => el.type === "connection")
      .map((el) => findConnectionById(el.id)?.type)
  )

  let titleText = ""
  let allSameLogicalType = false
  let logicalType = ""

  if (selectedArray.length === 1) {
    const element =
      firstElementData.type === "node"
        ? findNodeById(firstElementData.id)
        : findConnectionById(firstElementData.id)
    if (element) {
      logicalType = element.type.replace(/_/g, " ")
      titleText = `Edit ${logicalType} #${element.id}`
      allSameLogicalType = true
    } else {
      titleText = "Edit Element"
    }
  } else {
    const types = new Set([...nodeTypes, ...connectionTypesSet])
    if (types.size === 1) {
      logicalType = [...types][0].replace(/_/g, " ")
      titleText = `Edit ${selectedArray.length} ${logicalType}s`
      allSameLogicalType = true
    } else {
      titleText = `Edit ${selectedArray.length} Elements (Mixed Types)`
      allSameLogicalType = false
    }
  }
  title.innerHTML = `<strong>${titleText}</strong>`
  fragment.appendChild(title)

  const elementsWithNote = selectedArray.filter((elData) => {
    const el =
      elData.type === "node"
        ? findNodeById(elData.id)
        : findConnectionById(elData.id)
    return (
      el &&
      (el.type === "sound" ||
        el.type === "nebula" ||
        (elData.type === "connection" && el.type === "string_violin"))
    )
  })

  if (elementsWithNote.length > 0) {
    const targetDataForNoteSelector = elementsWithNote.map((el) => ({
      type: el.type,
      id: el.id
    }))
    createHexNoteSelectorDOM(fragment, targetDataForNoteSelector)
  }

  if (allSameLogicalType) {
    if (firstElementData.type === "node") {
      const node = findNodeById(firstElementData.id)
      if (isPulsarType(node.type)) {
        const section = document.createElement("div")
        section.classList.add("panel-section")
        const enableLabel = document.createElement("label")
        enableLabel.htmlFor = `edit-pulsar-enable-${node.id}`
        enableLabel.textContent =
          node.type === "pulsar_triggerable" ? "Current State:" : "Enabled:"
        section.appendChild(enableLabel)
        const enableCheckbox = document.createElement("input")
        enableCheckbox.type = "checkbox"
        enableCheckbox.id = `edit-pulsar-enable-${node.id}`
        enableCheckbox.checked = node.isEnabled
        enableCheckbox.disabled = selectedArray.length > 1
        enableCheckbox.addEventListener("change", () =>
          handlePulsarTriggerToggle(node)
        )
        section.appendChild(enableCheckbox)
        section.appendChild(document.createElement("br"))

        if (node.type !== "pulsar_random_particles") {
          if (isGlobalSyncEnabled) {
            const subdivLabel = document.createElement("label")
            subdivLabel.htmlFor = `edit-pulsar-subdiv-${node.id}`
            subdivLabel.textContent = "Sync Subdivision:"
            section.appendChild(subdivLabel)
            const subdivSelect = document.createElement("select")
            subdivSelect.id = `edit-pulsar-subdiv-${node.id}`
            subdivSelect.disabled = selectedArray.length > 1
            subdivisionOptions.forEach((opt, index) => {
              const option = document.createElement("option")
              option.value = index
              option.textContent = opt.label
              if (index === node.syncSubdivisionIndex) option.selected = true
              subdivSelect.appendChild(option)
            })
            subdivSelect.addEventListener("change", (e) => {
              node.syncSubdivisionIndex = parseInt(e.target.value, 10)
              node.nextSyncTriggerTime = 0
              saveState()
            })
            section.appendChild(subdivSelect)
          } else {
            const intervalVal = node.audioParams.triggerInterval.toFixed(1)
            const intervalSlider = createSlider(
              `edit-pulsar-interval-${node.id}`,
              `Interval (${intervalVal}s):`,
              0.1,
              10.0,
              0.1,
              node.audioParams.triggerInterval,
              null,
              (e) => {
                const newInterval = parseFloat(e.target.value)
                selectedArray.forEach((elData) => {
                  const n = findNodeById(elData.id)
                  if (n) n.audioParams.triggerInterval = newInterval
                })
                e.target.previousElementSibling.textContent = `Interval (${newInterval.toFixed(
                  1
                )}s):`
              }
            )
            section.appendChild(intervalSlider)
          }
        } else {
          const timingInfo = document.createElement("small")
          timingInfo.textContent = `Timing: Random (~${PULSAR_RANDOM_TIMING_CHANCE_PER_SEC.toFixed(
            1
          )}/sec avg)`
          section.appendChild(timingInfo)
        }
        section.appendChild(document.createElement("br"))

        if (node.type !== "pulsar_random_volume") {
          const intensityVal = node.audioParams.pulseIntensity.toFixed(2)
          const intensitySlider = createSlider(
            `edit-pulsar-intensity-${node.id}`,
            `Pulse Intensity (${intensityVal}):`,
            MIN_PULSE_INTENSITY,
            MAX_PULSE_INTENSITY,
            0.01,
            node.audioParams.pulseIntensity,
            null,
            (e) => {
              const newIntensity = parseFloat(e.target.value)
              selectedArray.forEach((elData) => {
                const n = findNodeById(elData.id)
                if (n) n.audioParams.pulseIntensity = newIntensity
              })
              e.target.previousElementSibling.textContent = `Pulse Intensity (${newIntensity.toFixed(
                2
              )}):`
            }
          )
          section.appendChild(intensitySlider)
        } else {
          const intensityInfo = document.createElement("small")
          intensityInfo.textContent = `Intensity: Random (${MIN_PULSE_INTENSITY.toFixed(
            1
          )} - ${MAX_PULSE_INTENSITY.toFixed(1)})`
          section.appendChild(intensityInfo)
        }
        section.appendChild(document.createElement("br"))
        const colorLabel = document.createElement("label")
        colorLabel.htmlFor = `edit-pulsar-color-${node.id}`
        colorLabel.textContent = "Pulsar Color:"
        section.appendChild(colorLabel)
        const colorInput = document.createElement("input")
        colorInput.type = "color"
        colorInput.id = `edit-pulsar-color-${node.id}`
        const styles = getComputedStyle(document.documentElement)
        const defaultColorVar = `--${node.type.replace("_", "-")}-color`
        const fallbackColorVar = "--start-node-color"
        const defaultColorRgba =
          styles.getPropertyValue(defaultColorVar).trim() ||
          styles.getPropertyValue(fallbackColorVar).trim()
        const defaultColorHex = rgbaToHex(defaultColorRgba)
        colorInput.value = node.color ? rgbaToHex(node.color) : defaultColorHex
        colorInput.addEventListener("input", (e) => {
          const newColor = hexToRgba(e.target.value, 0.9)
          selectedArray.forEach((elData) => {
            const n = findNodeById(elData.id)
            if (n) n.color = newColor
          })
        })
        colorInput.addEventListener("change", saveState)
        section.appendChild(colorInput)
        fragment.appendChild(section)
      } else if (isDrumType(node.type)) {
        const section = document.createElement("div")
        section.classList.add("panel-section")
        const params = node.audioParams
        const defaults = DRUM_ELEMENT_DEFAULTS[node.type]
        const soundDiv = document.createElement("div")
        soundDiv.classList.add("edit-drum-sound")
        const soundLabel = document.createElement("strong")
        soundLabel.textContent = defaults.label
        soundDiv.appendChild(soundLabel)
        const tuneVal = params.baseFreq.toFixed(0)
        const tuneSlider = createSlider(
          `edit-drum-tune-${node.id}`,
          `Tune (${tuneVal}Hz):`,
          20,
          node.type === "drum_hihat"
            ? 15000
            : node.type === "drum_cowbell" || node.type === "drum_clap"
            ? 2000
            : 1000,
          1,
          params.baseFreq,
          null,
          (e) => {
            const newFreq = parseFloat(e.target.value)
            selectedArray.forEach((elData) => {
              const n = findNodeById(elData.id)
              if (n) n.audioParams.baseFreq = newFreq
            })
            e.target.previousElementSibling.textContent = `Tune (${newFreq.toFixed(
              0
            )}Hz):`
          }
        )
        soundDiv.appendChild(tuneSlider)
        if (params.decay !== undefined) {
          const decayVal = params.decay.toFixed(2)
          const decaySlider = createSlider(
            `edit-drum-decay-${node.id}`,
            `Decay (${decayVal}s):`,
            0.01,
            1.5,
            0.01,
            params.decay,
            null,
            (e) => {
              const newDecay = parseFloat(e.target.value)
              selectedArray.forEach((elData) => {
                const n = findNodeById(elData.id)
                if (n) n.audioParams.decay = newDecay
              })
              e.target.previousElementSibling.textContent = `Decay (${newDecay.toFixed(
                2
              )}s):`
            }
          )
          soundDiv.appendChild(decaySlider)
        }
        if (params.noiseDecay !== undefined) {
          const noiseDecayVal = params.noiseDecay.toFixed(2)
          const noiseDecaySlider = createSlider(
            `edit-drum-noisedecay-${node.id}`,
            `Noise Decay (${noiseDecayVal}s):`,
            0.01,
            0.5,
            0.01,
            params.noiseDecay,
            null,
            (e) => {
              const newNoiseDecay = parseFloat(e.target.value)
              selectedArray.forEach((elData) => {
                const n = findNodeById(elData.id)
                if (n) n.audioParams.noiseDecay = newNoiseDecay
              })
              e.target.previousElementSibling.textContent = `Noise Decay (${newNoiseDecay.toFixed(
                2
              )}s):`
            }
          )
          soundDiv.appendChild(noiseDecaySlider)
        }
        const volVal = params.volume.toFixed(2)
        const volSlider = createSlider(
          `edit-drum-vol-${node.id}`,
          `Volume (${volVal}):`,
          0,
          1.5,
          0.01,
          params.volume,
          saveState,
          (e) => {
            const newVol = parseFloat(e.target.value)
            selectedArray.forEach((elData) => {
              const n = findNodeById(elData.id)
              if (n) {
                n.audioParams.volume = newVol
                updateNodeAudioParams(n)
              }
            })
            e.target.previousElementSibling.textContent = `Volume (${newVol.toFixed(
              2
            )}):`
          }
        )
        soundDiv.appendChild(volSlider)
        section.appendChild(soundDiv)
        fragment.appendChild(section)
      } else if (node.type === "switch" && selectedArray.length === 1) {
        const section = document.createElement("div")
        section.classList.add("panel-section")
        const label = document.createElement("label")
        label.textContent = "Primary Input Connection:"
        section.appendChild(label)
        const select = document.createElement("select")
        select.id = `edit-switch-primary-${node.id}`
        const noneOpt = document.createElement("option")
        noneOpt.value = "null"
        noneOpt.textContent = "None (Set on next pulse)"
        select.appendChild(noneOpt)
        node.connections.forEach((connId) => {
          const conn = findConnectionById(connId)
          if (conn) {
            const otherNodeId =
              conn.nodeAId === node.id ? conn.nodeBId : conn.nodeAId
            const otherNode = findNodeById(otherNodeId)
            const option = document.createElement("option")
            option.value = conn.id
            option.textContent = `From Node #${otherNodeId} (${
              otherNode?.type || "?"
            })`
            if (conn.id === node.primaryInputConnectionId) {
              option.selected = true
            }
            select.appendChild(option)
          }
        })
        select.addEventListener("change", (e) => {
          node.primaryInputConnectionId =
            e.target.value === "null" ? null : parseInt(e.target.value, 10)
          saveState()
        })
        section.appendChild(select)
        fragment.appendChild(section)
      }
    } else if (firstElementData.type === "connection") {
      const connection = findConnectionById(firstElementData.id)
      if (connection.type === "string_violin") {
        const section = document.createElement("div")
        section.classList.add("panel-section")
        const params = connection.audioParams
        const defaults = STRING_VIOLIN_DEFAULTS
        const volVal = (params.volume ?? defaults.volume).toFixed(2)
        const volSlider = createSlider(
          `edit-string-vol-${connection.id}`,
          `Volume (${volVal}):`,
          0,
          1.0,
          0.01,
          params.volume ?? defaults.volume,
          saveState,
          (e) => {
            const newVol = parseFloat(e.target.value)
            selectedArray.forEach((elData) => {
              const c = findConnectionById(elData.id)
              if (c) c.audioParams.volume = newVol
            })
            e.target.previousElementSibling.textContent = `Volume (${newVol.toFixed(
              2
            )}):`
          }
        )
        section.appendChild(volSlider)
        const attackVal = (params.attack ?? defaults.attack).toFixed(2)
        const attackSlider = createSlider(
          `edit-string-attack-${connection.id}`,
          `Attack (${attackVal}s):`,
          0.01,
          1.0,
          0.01,
          params.attack ?? defaults.attack,
          saveState,
          (e) => {
            const newVal = parseFloat(e.target.value)
            selectedArray.forEach((elData) => {
              const c = findConnectionById(elData.id)
              if (c) c.audioParams.attack = newVal
            })
            e.target.previousElementSibling.textContent = `Attack (${newVal.toFixed(
              2
            )}s):`
          }
        )
        section.appendChild(attackSlider)
        const releaseVal = (params.release ?? defaults.release).toFixed(2)
        const releaseSlider = createSlider(
          `edit-string-release-${connection.id}`,
          `Release (${releaseVal}s):`,
          0.1,
          5.0,
          0.01,
          params.release ?? defaults.release,
          saveState,
          (e) => {
            const newVal = parseFloat(e.target.value)
            selectedArray.forEach((elData) => {
              const c = findConnectionById(elData.id)
              if (c) c.audioParams.release = newVal
            })
            e.target.previousElementSibling.textContent = `Release (${newVal.toFixed(
              2
            )}s):`
          }
        )
        section.appendChild(releaseSlider)
        fragment.appendChild(section)
      }
    }
  }

  editPanelContent.appendChild(fragment)
  if (!hamburgerMenuPanel.classList.contains("hidden")) {
  } else if (currentTool === "edit" && selectedElements.size >= 1) {
    hamburgerMenuPanel.classList.remove("hidden")
    hamburgerBtn.classList.add("active")
  }
  sideToolbar.classList.add("hidden")
}

// --- Functies voor Piano Roll ---

function drawPianoRoll() {
  if (!pianoRollCtx || !pianoRollCanvas || pianoRollPanel.classList.contains('hidden')) {
      return;
  }

  const canvasWidth = pianoRollCanvas.width;
  const canvasHeight = pianoRollCanvas.height;
  pianoRollCtx.clearRect(0, 0, canvasWidth, canvasHeight);
  pianoRollHexagons = [];

  const scaleNotes = currentScale.notes;
  const rootNoteModulo = currentRootNote % 12;

  const numNotesToDraw = 12;
  const horizontalMargin = 10;
  const verticalMargin = 5;
  const availableWidth = canvasWidth - 2 * horizontalMargin;

  let hexRadius = availableWidth / (numNotesToDraw * 1.5 + 0.5);
  hexRadius = Math.max(8, Math.min(16, hexRadius));

  const hexWidth = 2 * hexRadius;
  const hexHeight = Math.sqrt(3) * hexRadius;
  const verticalSpacing = hexHeight;
  const horizontalSpacing = hexWidth * 3 / 4;
  let startX = horizontalMargin + hexRadius;
  let startY = Math.max(verticalMargin + hexHeight / 2, canvasHeight / 2);

  let hexCol = 0;
  const maxCols = Math.floor((canvasWidth - 2 * horizontalMargin + horizontalSpacing / 4) / horizontalSpacing);

  for (let i = 0; i < numNotesToDraw; i++) {
      if (hexCol >= maxCols) break;

      const noteInOctave = i;
      const posX = startX + hexCol * horizontalSpacing;
      const posY = startY + (hexCol % 2 !== 0 ? hexRadius * 0.1 : -hexRadius * 0.1);

      const noteRelativeToRoot = (noteInOctave - rootNoteModulo + 12) % 12;
      const isScaleNote = scaleNotes.includes(noteRelativeToRoot);
      const isRootNote = noteInOctave === rootNoteModulo;

      let fillStyle = "rgba(40, 40, 50, 0.7)";
      let strokeStyle = "rgba(80, 80, 100, 0.5)";
      if (isScaleNote) {
          fillStyle = "rgba(120, 160, 230, 0.7)";
          strokeStyle = "rgba(160, 200, 255, 0.7)";
      }
      if (isRootNote) {
          fillStyle = "rgba(255, 230, 80, 0.8)";
          strokeStyle = "rgba(255, 240, 120, 0.9)";
      }

      pianoRollCtx.fillStyle = fillStyle;
      pianoRollCtx.strokeStyle = strokeStyle;
      pianoRollCtx.lineWidth = 1;

      pianoRollCtx.beginPath();
      for (let side = 0; side < 6; side++) {
          pianoRollCtx.lineTo(
              posX + hexRadius * Math.cos(side * Math.PI / 3),
              posY + hexRadius * Math.sin(side * Math.PI / 3)
          );
      }
      pianoRollCtx.closePath();
      pianoRollCtx.fill();
      pianoRollCtx.stroke();

      pianoRollCtx.fillStyle = "#ddeeff";
      pianoRollCtx.font = `bold ${Math.max(7, Math.min(10, hexRadius * 0.7))}px sans-serif`;
      pianoRollCtx.textAlign = "center";
      pianoRollCtx.textBaseline = "middle";
      pianoRollCtx.fillText(noteNames[noteInOctave], posX, posY + 1);

      pianoRollHexagons.push({
          x: posX,
          y: posY,
          radius: hexRadius,
          semitone: noteInOctave
      });

      hexCol++;
  }
}

function handlePianoRollClick(event) {
  if (!pianoRollCanvas || !pianoRollHexagons || pianoRollHexagons.length === 0) return;

  const rect = pianoRollCanvas.getBoundingClientRect();
  const scaleX = pianoRollCanvas.width / rect.width; // Verhouding voor canvas interne vs display grootte
  const scaleY = pianoRollCanvas.height / rect.height;
  const canvasX = (event.clientX - rect.left) * scaleX;
  const canvasY = (event.clientY - rect.top) * scaleY;

  let clickedSemitone = -1;

  // Zoek dichtstbijzijnde hexagon centrum (robuster dan radius check)
  let minDistSq = Infinity;
  for (const hex of pianoRollHexagons) {
      const dx = canvasX - hex.x;
      const dy = canvasY - hex.y;
      const distSq = dx * dx + dy * dy;
      // Klik moet binnen de hexagon zijn (ruwweg < radius^2)
      if (distSq < hex.radius * hex.radius && distSq < minDistSq) {
           minDistSq = distSq;
           clickedSemitone = hex.semitone;
      }
  }


  if (clickedSemitone !== -1) {
       console.log(`Piano Roll Click: Detected semitone <span class="math-inline">\{noteNames\[clickedSemitone\]\} \(</span>{clickedSemitone})`);
      setRootNote(clickedSemitone);
  } else {
       console.log("Piano Roll Click: Click outside any detected hexagon.");
  }
}

/**
* Stelt de globale grondtoon in, werkt UI en audio bij.
* @param {number} newRootNote - De nieuwe grondtoon (0-11).
*/
function setRootNote(newRootNote) {
  const newRootMod = newRootNote % 12;
  if (currentRootNote === newRootMod) { return; }
  currentRootNote = newRootMod;
  console.log("New Root Note set to:", noteNames[currentRootNote], `(${currentRootNote})`);

  // 2. Werk de toonhoogte (pitch) bij van alle relevante nodes
  nodes.forEach((node) => {
      if (node.type === "sound" || node.type === "nebula") {
           node.audioParams.scaleIndex = Math.max(
              MIN_SCALE_INDEX,
              Math.min(MAX_SCALE_INDEX, node.audioParams.scaleIndex ?? 0)
           );
          node.audioParams.pitch = getFrequency(currentScale, node.audioParams.scaleIndex);
          if (isNaN(node.audioParams.pitch)) {
              console.warn(`Pitch NaN voor node ${node.id} na root note change, index gereset.`);
              node.audioParams.scaleIndex = 0;
              node.audioParams.pitch = getFrequency(currentScale, 0);
          }
          updateNodeAudioParams(node);
      }
  });

  // 3. Werk de toonhoogte bij van alle relevante connecties (zoals violen)
  connections.forEach((conn) => {
      if (conn.type === "string_violin") {
          conn.audioParams.scaleIndex = Math.max(
              MIN_SCALE_INDEX,
              Math.min(MAX_SCALE_INDEX, conn.audioParams.scaleIndex ?? 0)
           );
          conn.audioParams.pitch = getFrequency(currentScale, conn.audioParams.scaleIndex);
          if (isNaN(conn.audioParams.pitch)) {
              console.warn(`Pitch NaN voor connectie ${conn.id} na root note change, index gereset.`);
              conn.audioParams.scaleIndex = 0;
              conn.audioParams.pitch = getFrequency(currentScale, 0);
          }
          updateConnectionAudioParams(conn);
      }
  });

  // 4. Herteken de piano roll
  drawPianoRoll();

  // 5. Update het edit panel
  populateEditPanel();

  // 6. Sla de nieuwe staat op
  saveState();
}

// --- Einde Functies voor Piano Roll ---

function rgbaToHex(rgba) {
  if (!rgba || !rgba.startsWith("rgba")) return "#ffffff"
  try {
    const parts = rgba
      .substring(rgba.indexOf("(") + 1, rgba.lastIndexOf(")"))
      .split(/,\s*/)
    if (parts.length < 3) return "#ffffff"
    const r = parseInt(parts[0]).toString(16).padStart(2, "0")
    const g = parseInt(parts[1]).toString(16).padStart(2, "0")
    const b = parseInt(parts[2]).toString(16).padStart(2, "0")
    return `#${r}${g}${b}`
  } catch (e) {
    return "#ffffff"
  }
}
function hexToRgba(hex, alpha = 1) {
  if (!hex || !hex.startsWith("#")) return null
  try {
    let bigint
    if (hex.length === 4) {
      bigint = parseInt(
        hex
          .slice(1)
          .split("")
          .map((char) => char + char)
          .join(""),
        16
      )
    } else if (hex.length === 7) {
      bigint = parseInt(hex.slice(1), 16)
    } else {
      return null
    }
    const r = (bigint >> 16) & 255
    const g = (bigint >> 8) & 255
    const b = bigint & 255
    return `rgba(${r}, ${g}, ${b}, ${alpha})`
  } catch (e) {
    return null
  }
}
function updateToolbarHeightVar() {
  const toolbarHeight = toolbar.offsetHeight
  document.documentElement.style.setProperty(
    "--toolbar-height",
    `${toolbarHeight}px`
  )
}

function triggerManualPulsar(node) {
  if (!node || node.type !== 'pulsar_manual' || !isAudioReady) return;

  console.log(`Manual Pulsar ${node.id} triggered by click.`);

  const pulseData = {
      intensity: node.audioParams.pulseIntensity ?? DEFAULT_PULSE_INTENSITY,
      color: node.color ?? null,
      particleMultiplier: 1.0
      // Geen speciale style nodig tenzij je dat wilt toevoegen
  };

  currentGlobalPulseId++;
  node.animationState = 1;
  setTimeout(() => {
      const checkNode = findNodeById(node.id);
      if (checkNode) checkNode.animationState = 0;
  }, 150);

  node.connections.forEach(neighborId => {
      const neighborNode = findNodeById(neighborId);
      const connection = connections.find(c => (c.nodeAId === node.id && c.nodeBId === neighborId) || (c.nodeAId === neighborId && c.nodeBId === node.id));

      if (neighborNode && neighborNode.type !== 'nebula' && connection && neighborNode.lastTriggerPulseId !== currentGlobalPulseId) {
          const travelTime = connection.length * DELAY_FACTOR;
          createVisualPulse(connection.id, travelTime, node.id, Infinity, 'trigger', pulseData.color, pulseData.intensity); // Geen style meegegeven
          propagateTrigger(neighborNode, travelTime, currentGlobalPulseId, node.id, Infinity, { type: 'trigger', data: pulseData }, connection);
      }
  });
}

function triggerSave() {
  try {
    const state = {
      nodes: nodes,
      connections: connections,
      fluctuatingGroupNodeIDs: Array.from(fluctuatingGroupNodeIDs),
      nodeIdCounter: nodeIdCounter,
      connectionIdCounter: connectionIdCounter,
      isGlobalSyncEnabled: isGlobalSyncEnabled,
      globalBPM: globalBPM,
      viewOffsetX: viewOffsetX,
      viewOffsetY: viewOffsetY,
      viewScale: viewScale,
      currentScaleKey: currentScaleKey,
      currentRootNote: currentRootNote,
      globalTransposeOffset: globalTransposeOffset,
      masterVolume: masterGain?.gain.value ?? 0.8,
      delaySend: masterDelaySendGain?.gain.value ?? 0.3,
      delayTime: delayNode?.delayTime.value ?? 0.25,
      delayFeedback: delayFeedbackGain?.gain.value ?? 0.4
    }
    const stateString = JSON.stringify(
      state,
      (key, value) => {
        if (value instanceof Set) {
          return Array.from(value)
        }
        if (
          key === "audioParams" &&
          value &&
          typeof value.pulseIntensity === "number"
        ) {
          value.pulseIntensity = parseFloat(value.pulseIntensity.toFixed(3))
        }
        if (key === "audioNodes") return undefined
        return value
      },
      2
    )
    const blob = new Blob([stateString], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    const timestamp = new Date()
      .toISOString()
      .slice(0, 16)
      .replace("T", "_")
      .replace(":", "-")
    a.download = `celestial-constellation_${timestamp}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  } catch (e) {}
}
function triggerLoad() {
  loadStateInput.click()
}
function handleFileLoad(event) {
  const file = event.target.files[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = (e) => {
    try {
      const loadedState = JSON.parse(e.target.result)
      if (loadedState && loadedState.nodes && loadedState.connections) {
        loadedState.selectedElements = new Set()
        loadState(loadedState)
        saveState()
      }
    } catch (err) {
    } finally {
      loadStateInput.value = ""
    }
  }
  reader.onerror = (e) => {
    loadStateInput.value = ""
  }
  reader.readAsText(file)
}

function setupMIDI() {
  if (navigator.requestMIDIAccess) {
    navigator
      .requestMIDIAccess({ sysex: false })
      .then(onMIDISuccess, onMIDIFailure)
  } else {
  }
}
function onMIDISuccess(access) {
  midiAccess = access
  populateMIDIDevices()
  midiAccess.onstatechange = populateMIDIDevices
}
function onMIDIFailure(msg) {}
function populateMIDIDevices() {
  if (!midiAccess) return
  midiInSelect.innerHTML = '<option value="">None</option>'
  midiOutSelect.innerHTML = '<option value="">None</option>'
  midiAccess.inputs.forEach((input) => {
    const option = document.createElement("option")
    option.value = input.id
    option.textContent = input.name
    midiInSelect.appendChild(option)
  })
  midiInSelect.value = activeMidiInput?.id || ""
  midiAccess.outputs.forEach((output) => {
    const option = document.createElement("option")
    option.value = output.id
    option.textContent = output.name
    midiOutSelect.appendChild(option)
  })
  midiOutSelect.value = activeMidiOutput?.id || ""
}
function selectMIDIInput(id) {
  if (!midiAccess) return
  if (activeMidiInput) activeMidiInput.onmidimessage = null
  activeMidiInput = midiAccess.inputs.get(id)
  if (activeMidiInput) {
    activeMidiInput.onmidimessage = handleMIDIMessage
  } else {
    activeMidiInput = null
  }
}
function selectMIDIOutput(id) {
  if (!midiAccess) return
  activeMidiOutput = midiAccess.outputs.get(id) || null
}
function handleMIDIMessage(message) {
  const [command, note, velocity] = message.data
  const midiChannel = (command & 0x0f) + 1
  const cmd = command & 0xf0
  // if (cmd === 0x90 && velocity > 0) {
  //   const newTranspose = note - 60
  //   globalTransposeOffset = Math.max(-12, Math.min(12, newTranspose))
 //    updateScaleAndTransposeUI()
  //   nodes.forEach((node) => {
  //     if (node.type === "sound" || node.type === "nebula") {
  //       node.audioParams.pitch = getFrequency(
  //         currentScale,
  //         node.audioParams.scaleIndex
 //        )
 //        updateNodeAudioParams(node)
 //      }
 //    })
  //   connections.forEach((conn) => {
  //     if (conn.type === "string_violin") {
  //       conn.audioParams.pitch = getFrequency(
  //         currentScale,
  //         conn.audioParams.scaleIndex
  //       )
  //       updateConnectionAudioParams(conn)
  //     }
  //   })
  //   drawPianoRoll();
 //    saveState()
//   }
}
function sendMidiMessage(messageArray) {
  if (activeMidiOutput && messageArray) {
    try {
      activeMidiOutput.send(messageArray)
    } catch (error) {}
  }
}
midiInSelect.addEventListener("change", (e) => selectMIDIInput(e.target.value))
midiOutSelect.addEventListener("change", (e) =>
  selectMIDIOutput(e.target.value)
)

// ========================================================================
// Functies voor StarSound Glide (Pitch + Crossfade + Lijn met CANVAS)
// ========================================================================

let glideStartStar = null
const glideDuration = 0.5 // Duur van de glide/crossfade in seconden

// --- Hulpfunctie: Haal AudioNode en GainNode voor een Ster ---
// !!! BELANGRIJK: Pas deze functie aan jouw code !!!
// (Deze functie blijft hetzelfde als voorheen - zorg dat hij correct is)
function getAudioNodesForStar(starElement) {
  // Voorbeeld implementatie - PAS DIT AAN!
  const starId = starElement.id
  // if (activeStars[starId]) {
  //     return {
  //         audioNode: activeStars[starId].audioNode,
  //         gainNode: activeStars[starId].gainNode
  //     };
  // }
  console.warn("getAudioNodesForStar() is niet correct geïmplementeerd!")
  return { audioNode: null, gainNode: null }
}

function getFrequency(scaleDef, index, oct = 0) {
  const notes = scaleDef.notes
  if (!notes || notes.length === 0) return scaleDef.baseFreq;
  const numNotesInScale = notes.length;
  const noteIdx = index % numNotesInScale
  const effectiveNoteIndex = (noteIdx < 0) ? noteIdx + numNotesInScale : noteIdx;
  const octOffset = Math.floor(index / numNotesInScale) + oct
  const semitonesInScale = notes[effectiveNoteIndex]
  if (semitonesInScale === undefined || semitonesInScale === null) return scaleDef.baseFreq;
  const totalSemitoneOffsetFromRoot = semitonesInScale + octOffset * 12;
  const finalFreq = scaleDef.baseFreq * Math.pow(2, (currentRootNote + globalTransposeOffset + totalSemitoneOffsetFromRoot) / 12);
  return finalFreq;
}


// --- Hulpfunctie: Bepaal of geluiden verschillend zijn ---
// !!! BELANGRIJK: Pas deze functie aan jouw code !!!
// (Deze functie blijft hetzelfde als voorheen - zorg dat hij correct is)
function areSoundsDifferent(star1Element, star2Element) {
  console.warn("areSoundsDifferent() checkt niet daadwerkelijk verschil.")
  return true
}


// Zorg dat de oude listener voor glideToolButton (die met isAddingGlide) verwijderd is.
if (glideToolButton) {
    glideToolButton.addEventListener('click', () => {
        // Roep setActiveTool aan met de NIEUWE tool naam
        setActiveTool('connect_glide');
        console.log("Connect Glide mode AAN (via setActiveTool). Sleep van start naar doel ster.");
        // Reset andere connect-states voor de zekerheid
        isConnecting = false; // Wordt beheerd in mousedown/move
        connectingNode = null;
    });
} else {
    console.warn("Knop met ID #glide-tool-button niet gevonden.");
}

// --- Event Listener voor StarSound Clicks (voor Glide) ---
// (Listener is aangepast om lijn *toe te voegen* aan de array, niet direct te tekenen)

// ========================================================================
// EINDE GLIDE FUNCTIES (CANVAS versie)
// ========================================================================

saveStateBtn.addEventListener("click", triggerSave)
loadStateBtn.addEventListener("click", triggerLoad)
loadStateInput.addEventListener("change", handleFileLoad)
window.addEventListener("resize", () => {
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
  updateToolbarHeightVar()
  // Piano roll resize en redraw
  if (pianoRollCanvas && pianoRollCtx) {
    try {
         pianoRollCanvas.width = pianoRollCanvas.clientWidth;
         pianoRollCanvas.height = pianoRollCanvas.clientHeight;
         drawPianoRoll();
    } catch (e) {
         console.warn("Kon pianoRollCanvas niet resizen/hertekenen:", e);
    }
}
})
window.addEventListener("load", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  updateToolbarHeightVar();

  // --- Piano Roll Canvas Initialisatie ---
  pianoRollCanvas = document.getElementById('pianoRollCanvas');
  if (pianoRollCanvas) {
      pianoRollCtx = pianoRollCanvas.getContext('2d');
      try {
           pianoRollCanvas.width = pianoRollCanvas.clientWidth;
           pianoRollCanvas.height = pianoRollCanvas.clientHeight;
      } catch (e) {
           console.warn("Kon pianoRollCanvas dimensies niet direct instellen:", e);
           pianoRollCanvas.width = 300; // Fallback size
           pianoRollCanvas.height = 80; // Fallback size
      }
      pianoRollCanvas.addEventListener('mousedown', handlePianoRollClick);
      // Teken initieel pas NADAT scales etc zijn ingesteld.
      // drawPianoRoll(); // Verplaatst naar na setupAudio
  } else {
      console.error("#pianoRollCanvas element not found during initialization!");
  }
  // --- Einde Piano Roll Initialisatie ---

  // Vul Scale dropdown
  Object.keys(scales).forEach((key) => {
      const o = document.createElement("option");
      o.value = key;
      o.textContent = scales[key].name; // Of korte naam: key.replace...
      scaleSelectPianoRoll.appendChild(o.cloneNode(true));
  });
  // Stel initiële waarden in voor UI elementen die *niet* van audioContext afhangen
  scaleSelectPianoRoll.value = currentScaleKey;
  globalBpmInput.value = globalBPM;

  // Reset UI states
  setActiveTool("edit");
  resetSideToolbars();
  hideBottomPanels();
  noteSelectElement = null;
  noteSelectContainer = null;

  startMessage.style.display = "block"; // Toon "Klik om te starten"

  // <<< --- Roep setupAudio asynchroon aan --- >>>
  setupAudio().then(context => {
    if (context) {
      console.log("Audio setup voltooid vanuit window.onload.");
      updateMixerUI(); // Update Master/Delay sliders
      updateScaleAndTransposeUI();
      identifyAndRouteAllGroups(); // Vind alle groepen en update mixer
      drawPianoRoll();
      setActiveTool("edit");
      resetSideToolbars();
      hideBottomPanels();
  } else {
      console.error("Audio setup mislukt vanuit window.onload.");
      startMessage.textContent = "Error loading audio.";
      startMessage.style.display = "block";
      loadingIndicator.style.display = 'none';
  }
}).catch(err => {
  console.error("Error tijdens setupAudio aanroep vanuit window.onload:", err);
  startMessage.textContent = "Error loading audio.";
  startMessage.style.display = "block";
  loadingIndicator.style.display = 'none';
  });
  // --- Einde setupAudio aanroep ---

}); // Einde window.addEventListener("load", ...)
