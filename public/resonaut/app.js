const canvas = document.getElementById("mainCanvas")
const ctx = canvas.getContext("2d")
const startMessage = document.getElementById("startMessage")
const loadingIndicator = document.getElementById("loadingIndicator")
const scaleSelectTransport = document.getElementById("scaleSelectTransport")
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
const mixerPanel = document.getElementById("mixerPanel")
const masterVolumeSlider = document.getElementById("masterVolumeSlider")
const masterVolumeValue = document.getElementById("masterVolumeValue")
const delaySendSlider = document.getElementById("delaySendSlider")
const delaySendValue = document.getElementById("delaySendValue")
const delayTimeSlider = document.getElementById("delayTimeSlider")
const delayTimeValue = document.getElementById("delayTimeValue")
const delayFeedbackSlider = document.getElementById("delayFeedbackSlider")
const delayFeedbackValue = document.getElementById("delayFeedbackValue")
const midiInSelect = document.getElementById("midiInSelect")
const midiOutSelect = document.getElementById("midiOutSelect")
const toolbar = document.getElementById("toolbar")
const addSoundStarBtn = document.getElementById("addSoundStarBtn")
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
const deleteBtn = document.getElementById("deleteBtn")
const undoBtn = document.getElementById("undoBtn")
const redoBtn = document.getElementById("redoBtn")
const hamburgerBtn = document.getElementById("hamburgerBtn")
const hamburgerMenuPanel = document.getElementById("hamburgerMenuPanel")
const editPanelContent = document.getElementById("editPanelContent")
const sideToolbar = document.getElementById("sideToolbar")
const sideToolbarTitle = document.getElementById("sideToolbarTitle")
const sideToolbarContent = document.getElementById("sideToolbarContent")

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
let pianoRollCanvas = null; // Declareren als globale variabele, initieel null
let pianoRollCtx = null;    // Declareren als globale variabele, initieel null

const MARIMBA_SAMPLE_URL = "marimba_c3.wav"
const MARIMBA_BASE_FREQ = 130.81
const PIANO_SAMPLE_URL = "piano_c4.wav"
const PIANO_BASE_FREQ = 261.63
const FLUTE_SAMPLE_URL = "flute_c5.wav"
const FLUTE_BASE_FREQ = 523.25

let marimbaBuffer = null,
  pianoBuffer = null,
  fluteBuffer = null
let isMarimbaLoaded = false,
  isPianoLoaded = false,
  isFluteLoaded = false
let isMarimbaLoading = false,
  isPianoLoading = false,
  isFluteLoading = false
let totalSamples = 3
let samplesLoadedCount = 0

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
const NEBULA_ROTATION_SPEED_OUTER = 0.001
const NEBULA_ROTATION_SPEED_INNER = -0.002
const NEBULA_PULSE_SPEED = 0.08
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
let currentConstellationGroup = new Set()
const CONSTELLATION_NODE_TYPES = ["sound"]
let fluctuatingGroupNodeIDs = new Set()

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
  { type: "pulsar_triggerable", label: "Triggerable", icon: "⚡🔆" }
]
const waveformTypes = [
  { type: "fmBell", label: "Bell", icon: "🔔" },
  { type: "fmXylo", label: "Xylo", icon: "🥁" },
  { type: "sine", label: "Sine", icon: "○" },
  { type: "triangle", label: "Triangle", icon: "△" },
  { type: "square", label: "Square", icon: "□" },
  { type: "sawtooth", label: "Saw", icon: "📈" },
  { type: "sampler_marimba", label: "Marimba", icon: "🛰️", loadFailed: false },
  { type: "sampler_piano", label: "Piano", icon: "🛰️", loadFailed: false },
  { type: "sampler_flute", label: "Flute", icon: "🛰️", loadFailed: false }
]
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
function getNoteName(absoluteSemitone) {
  const baseNoteIndex = 0
  const baseOctave = 3
  const totalSemitonesFromC0 = 36 + absoluteSemitone
  const noteIndex = totalSemitonesFromC0 % 12
  const octave = Math.floor(totalSemitonesFromC0 / 12)
  return noteNames[noteIndex] + octave
}
function getNoteNameFromScaleIndex(scaleDef, index) {
  const notes = scaleDef.notes
  const noteIdx = index % notes.length
  const octOffset = Math.floor(index / notes.length)
  const semitones = notes[noteIdx] + octOffset * 12
  const finalSemitones = semitones + currentRootNote + globalTransposeOffset
  return getNoteName(finalSemitones)
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
  if (audioContext) return audioContext
  try {
    audioContext = new (window.AudioContext || window.webkitAudioContext)()
    masterGain = audioContext.createGain()
    masterGain.gain.value = parseFloat(masterVolumeSlider.value)
    masterGain.connect(audioContext.destination)
    reverbNode = audioContext.createConvolver()
    reverbWetGain = audioContext.createGain()
    reverbWetGain.gain.value = 0.5
    reverbNode.connect(reverbWetGain)
    reverbWetGain.connect(masterGain)
    delayNode = audioContext.createDelay(1.0)
    delayFeedbackGain = audioContext.createGain()
    masterDelaySendGain = audioContext.createGain()
    masterDelaySendGain.gain.value = parseFloat(delaySendSlider.value)
    delayNode.delayTime.value = parseFloat(delayTimeSlider.value)
    delayFeedbackGain.gain.value = parseFloat(delayFeedbackSlider.value)
    masterDelaySendGain.connect(delayNode)
    delayNode.connect(delayFeedbackGain)
    delayFeedbackGain.connect(delayNode)
    delayNode.connect(masterGain)
    isDelayReady = true
    try {
      const r = await fetch(REVERB_IR_URL)
      if (!r.ok) throw new Error(`E ${r.status}`)
      const ab = await r.arrayBuffer()
      if (audioContext.decodeAudioData.length === 1) {
        await new Promise((res, rej) => {
          audioContext.decodeAudioData(
            ab,
            (b) => {
              reverbNode.buffer = b
              isReverbReady = true
              res()
            },
            (e) => {
              isReverbReady = false
              rej(e)
            }
          )
        })
      } else {
        const b = await audioContext.decodeAudioData(ab)
        reverbNode.buffer = b
        isReverbReady = true
      }
    } catch (e) {
      isReverbReady = false
    }
    samplesLoadedCount = 0
    totalSamples = 3
    updateLoadingIndicator()
    const sampleLoadPromises = [
      loadSample(MARIMBA_SAMPLE_URL, "Marimba"),
      loadSample(PIANO_SAMPLE_URL, "Piano"),
      loadSample(FLUTE_SAMPLE_URL, "Flute")
    ]
    const loadResults = await Promise.all(sampleLoadPromises)
    loadResults.forEach((result) => {
      if (result.success) {
        switch (result.name) {
          case "Marimba":
            marimbaBuffer = result.buffer
            isMarimbaLoaded = true
            break
          case "Piano":
            pianoBuffer = result.buffer
            isPianoLoaded = true
            break
          case "Flute":
            fluteBuffer = result.buffer
            isFluteLoaded = true
            break
        }
      } else {
        switch (result.name) {
          case "Marimba":
            isMarimbaLoaded = false
            break
          case "Piano":
            isPianoLoaded = false
            break
          case "Flute":
            isFluteLoaded = false
            break
        }
      }
    })
    updateLoadingIndicator()
    isAudioReady = true
    resetSideToolbars()
    changeScale(scaleSelectTransport.value)
    updateSyncUI()
    updateGroupControlsUI()
    updateInfoToggleUI()
    setupMIDI()
    if (historyStack.length === 0) saveState()
    return audioContext
  } catch (e) {
    startMessage.textContent = "Audio Context Error"
    startMessage.style.display = "block"
    return null
  }
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
      } = node.audioNodes
      if (!gainNode || !filterNode || !oscillators) return
      const targetVol = Math.min(NEBULA_MAX_VOL, node.size * NEBULA_VOL_SCALING)
      gainNode.gain.setTargetAtTime(targetVol, now, 0.1)
      const sizeRange = MAX_NODE_SIZE - MIN_NODE_SIZE
      const normalizedSize = (node.size - MIN_NODE_SIZE) / (sizeRange || 1)
      const baseFreq = params.pitch
      const filterFreq = baseFreq * 2 + normalizedSize * baseFreq * 8
      filterNode.frequency.setTargetAtTime(filterFreq, now, 0.1)
      if (filterLfoGain) {
        filterLfoGain.gain.setTargetAtTime(
          baseFreq * NEBULA_FILTER_LFO_DEPTH_FACTOR,
          now,
          0.1
        )
      }
      if (volLfoGain) {
        volLfoGain.gain.setTargetAtTime(NEBULA_VOL_LFO_DEPTH, now, 0.1)
      }
      oscillators.forEach((osc, i) => {
        const interval = NEBULA_OSC_INTERVALS[i]
        const freq = baseFreq * Math.pow(2, interval / 12)
        osc.frequency.setTargetAtTime(freq, now, 0.1)
        const desiredWaveform =
          node.audioParams.waveform === "fmBell" ||
          node.audioParams.waveform === "fmXylo"
            ? "sine"
            : node.audioParams.waveform || "sawtooth"
        if (osc.type !== desiredWaveform) {
          osc.type = desiredWaveform
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
  if (
    !audioContext ||
    (!["sound", "nebula"].includes(node.type) && !isDrumType(node.type))
  )
    return null
  const now = audioContext.currentTime
  const startDelay = now + 0.02
  try {
    if (node.type === "sound") {
      const gainNode = audioContext.createGain()
      gainNode.gain.setValueAtTime(0, now)
      const lowPassFilter = audioContext.createBiquadFilter()
      lowPassFilter.type = "lowpass"
      lowPassFilter.Q.value = 1.2
      let reverbSendGain = null
      if (isReverbReady && reverbNode) {
        reverbSendGain = audioContext.createGain()
        reverbSendGain.gain.value = node.audioParams.reverbSend
      }
      let delaySendGain = null
      if (isDelayReady && masterDelaySendGain) {
        delaySendGain = audioContext.createGain()
        delaySendGain.gain.value = node.audioParams.delaySend
      }
      const volLfo = audioContext.createOscillator()
      volLfo.type = "sine"
      volLfo.frequency.setValueAtTime(node.audioParams.volLfoRate, now)
      const volLfoGain = audioContext.createGain()
      volLfoGain.gain.value = fluctuatingGroupNodeIDs.has(node.id)
        ? parseFloat(groupFluctuateAmount.value)
        : node.audioParams.volLfoDepth || 0
      volLfo.connect(volLfoGain)
      volLfoGain.connect(gainNode.gain)
      let oscillator = null
      let modulatorOsc = null
      let modulatorGain = null
      if (
        node.audioParams.waveform &&
        !node.audioParams.waveform.startsWith("sampler_")
      ) {
        oscillator = audioContext.createOscillator()
        oscillator.type = node.audioParams.waveform
        if (
          node.audioParams.waveform === "fmBell" ||
          node.audioParams.waveform === "fmXylo"
        ) {
          oscillator.type = "sine"
          modulatorOsc = audioContext.createOscillator()
          modulatorOsc.type = "sine"
          modulatorGain = audioContext.createGain()
          modulatorOsc.connect(modulatorGain)
          modulatorGain.connect(oscillator.frequency)
        }
        oscillator.connect(lowPassFilter)
      }
      lowPassFilter.connect(gainNode)
      gainNode.connect(masterGain)
      if (reverbSendGain) {
        gainNode.connect(reverbSendGain)
        reverbSendGain.connect(reverbNode)
      }
      if (delaySendGain) {
        gainNode.connect(delaySendGain)
        delaySendGain.connect(masterDelaySendGain)
      }
      try {
        volLfo.start(startDelay)
      } catch (e) {}
      if (oscillator) {
        try {
          oscillator.start(startDelay)
        } catch (e) {}
      }
      if (modulatorOsc) {
        try {
          modulatorOsc.start(startDelay)
        } catch (e) {}
      }
      return {
        oscillator,
        gainNode,
        lowPassFilter,
        reverbSendGain,
        delaySendGain,
        modulatorOsc,
        modulatorGain,
        volLfo,
        volLfoGain
      }
    } else if (node.type === "nebula") {
      const gainNode = audioContext.createGain()
      gainNode.gain.value = 0
      const filterNode = audioContext.createBiquadFilter()
      filterNode.type = "lowpass"
      filterNode.Q.value = NEBULA_FILTER_Q
      const baseFreq = node.audioParams.pitch
      const filterLfo = audioContext.createOscillator()
      filterLfo.type = "sine"
      filterLfo.frequency.setValueAtTime(NEBULA_FILTER_LFO_RATE, now)
      const filterLfoGain = audioContext.createGain()
      filterLfoGain.gain.setValueAtTime(
        baseFreq * NEBULA_FILTER_LFO_DEPTH_FACTOR,
        now
      )
      filterLfo.connect(filterLfoGain)
      filterLfoGain.connect(filterNode.frequency)
      const volLfo = audioContext.createOscillator()
      volLfo.type = "sine"
      volLfo.frequency.setValueAtTime(NEBULA_VOL_LFO_RATE, now)
      const volLfoGain = audioContext.createGain()
      volLfoGain.gain.value = NEBULA_VOL_LFO_DEPTH
      volLfo.connect(volLfoGain)
      volLfoGain.connect(gainNode.gain)
      const oscillators = []
      const baseWaveform = node.audioParams.waveform || "sawtooth"
      const waveformType =
        baseWaveform === "fmBell" || baseWaveform === "fmXylo"
          ? "sine"
          : baseWaveform
      NEBULA_OSC_INTERVALS.forEach((interval, i) => {
        const osc = audioContext.createOscillator()
        const freq = baseFreq * Math.pow(2, interval / 12)
        osc.frequency.setValueAtTime(freq, now)
        osc.detune.setValueAtTime(
          (i % 2 === 0 ? 1 : -1) * NEBULA_OSC_DETUNE * (i + 1),
          now
        )
        osc.type = waveformType
        osc.connect(filterNode)
        oscillators.push(osc)
      })
      filterNode.connect(gainNode)
      gainNode.connect(masterGain)
      let reverbSendGain = null
      if (isReverbReady && reverbNode) {
        reverbSendGain = audioContext.createGain()
        reverbSendGain.gain.value = node.audioParams.reverbSend
        gainNode.connect(reverbSendGain)
        reverbSendGain.connect(reverbNode)
      }
      let delaySendGain = null
      if (isDelayReady && masterDelaySendGain) {
        delaySendGain = audioContext.createGain()
        delaySendGain.gain.value = node.audioParams.delaySend
        gainNode.connect(delaySendGain)
        delaySendGain.connect(masterDelaySendGain)
      }
      const sizeRange = MAX_NODE_SIZE - MIN_NODE_SIZE
      const normalizedSize = (node.size - MIN_NODE_SIZE) / (sizeRange || 1)
      const initialVol = Math.min(
        NEBULA_MAX_VOL,
        node.size * NEBULA_VOL_SCALING
      )
      const initialFilterFreq = baseFreq * 2 + normalizedSize * baseFreq * 8
      filterNode.frequency.setValueAtTime(initialFilterFreq, now)
      gainNode.gain.linearRampToValueAtTime(initialVol, now + 0.5)
      try {
        filterLfo.start(startDelay)
      } catch (e) {}
      try {
        volLfo.start(startDelay)
      } catch (e) {}
      oscillators.forEach((osc) => {
        try {
          osc.start(startDelay)
        } catch (e) {}
      })
      return {
        gainNode,
        filterNode,
        filterLfo,
        filterLfoGain,
        volLfo,
        volLfoGain,
        oscillators,
        reverbSendGain,
        delaySendGain
      }
    } else if (isDrumType(node.type)) {
      const mainGain = audioContext.createGain()
      mainGain.gain.value = node.audioParams.volume
      mainGain.connect(masterGain)
      let reverbSendGain = null
      if (isReverbReady && reverbNode) {
        reverbSendGain = audioContext.createGain()
        reverbSendGain.gain.value = node.audioParams.reverbSend
        mainGain.connect(reverbSendGain)
        reverbSendGain.connect(reverbNode)
      }
      let delaySendGain = null
      if (isDelayReady && masterDelaySendGain) {
        delaySendGain = audioContext.createGain()
        delaySendGain.gain.value = node.audioParams.delaySend
        mainGain.connect(delaySendGain)
        delaySendGain.connect(masterDelaySendGain)
      }
      return { mainGain, reverbSendGain, delaySendGain }
    }
  } catch (e) {
    return null
  }
  return null
}
function createAudioNodesForConnection(connection) {
  if (!audioContext || connection.type !== "string_violin") return null
  const now = audioContext.currentTime
  const startDelay = now + 0.02
  try {
    const params = connection.audioParams
    const gainNode = audioContext.createGain()
    gainNode.gain.value = 0
    const filterNode = audioContext.createBiquadFilter()
    filterNode.type = "lowpass"
    filterNode.frequency.value =
      params.pitch *
      (params.filterFreqFactor ?? STRING_VIOLIN_DEFAULTS.filterFreqFactor)
    filterNode.Q.value = params.filterQ ?? STRING_VIOLIN_DEFAULTS.filterQ
    const vibratoLfo = audioContext.createOscillator()
    vibratoLfo.type = "sine"
    vibratoLfo.frequency.value =
      params.vibratoRate ?? STRING_VIOLIN_DEFAULTS.vibratoRate
    const vibratoGain = audioContext.createGain()
    vibratoGain.gain.value =
      params.vibratoDepth ?? STRING_VIOLIN_DEFAULTS.vibratoDepth
    vibratoLfo.connect(vibratoGain)
    const oscillators = []
    const numOsc = params.numOsc ?? STRING_VIOLIN_DEFAULTS.numOsc
    for (let i = 0; i < numOsc; i++) {
      const osc = audioContext.createOscillator()
      osc.type = "sawtooth"
      const freq = params.pitch
      const detuneAmount =
        i === 0
          ? 0
          : (i % 2 === 1 ? 1 : -1) *
            Math.ceil(i / 2) *
            (params.detune ?? STRING_VIOLIN_DEFAULTS.detune)
      osc.frequency.value = freq
      osc.detune.value = detuneAmount
      vibratoGain.connect(osc.detune)
      osc.connect(filterNode)
      oscillators.push(osc)
    }
    filterNode.connect(gainNode)
    gainNode.connect(masterGain)
    let reverbSendGain = null
    if (isReverbReady && reverbNode) {
      reverbSendGain = audioContext.createGain()
      reverbSendGain.gain.value = params.reverbSend ?? DEFAULT_REVERB_SEND
      gainNode.connect(reverbSendGain)
      reverbSendGain.connect(reverbNode)
    }
    let delaySendGain = null
    if (isDelayReady && masterDelaySendGain) {
      delaySendGain = audioContext.createGain()
      delaySendGain.gain.value = params.delaySend ?? DEFAULT_DELAY_SEND
      gainNode.connect(delaySendGain)
      delaySendGain.connect(masterDelaySendGain)
    }
    try {
      vibratoLfo.start(startDelay)
    } catch (e) {}
    oscillators.forEach((osc) => {
      try {
        osc.start(startDelay)
      } catch (e) {}
    })
    return {
      gainNode,
      filterNode,
      oscillators,
      vibratoLfo,
      vibratoGain,
      reverbSendGain,
      delaySendGain
    }
  } catch (e) {
    return null
  }
}
function triggerNodeEffect(node, pulseData = {}) {
  if (!isAudioReady || !node) return
  const now = audioContext.currentTime
  const params = node.audioParams
  const intensity = pulseData.intensity ?? 1.0
  if (node.type === "sound") {
    if (!node.audioNodes?.gainNode) return
    node.isTriggered = true
    node.animationState = 1
    const { gainNode, lowPassFilter, modulatorGain } = node.audioNodes
    if (!gainNode || !lowPassFilter) {
      node.isTriggered = false
      node.animationState = 0
      return
    }
    const baseVolume = 0.6
    const targetVolume = baseVolume * intensity
    const clampedVolume = Math.max(0.01, Math.min(1.0, targetVolume))
    let releaseTime = 0.3 + node.size * 0.2
    try {
      gainNode.gain.cancelScheduledValues(now)
      gainNode.gain.setValueAtTime(0, now)
      gainNode.gain.linearRampToValueAtTime(clampedVolume, now + 0.015)
      if (params.waveform === "fmBell") releaseTime = 0.8 + node.size * 0.4
      else if (params.waveform === "fmXylo") releaseTime = 0.5 + node.size * 0.2
      else if (params.waveform && params.waveform.startsWith("sampler_")) {
        releaseTime = 0.6 + node.size * 0.3
      }
      gainNode.gain.setTargetAtTime(0, now + 0.015, releaseTime / 4)
      const soundEndTime = now + 0.015 + releaseTime * 1.1
      if (params.waveform && params.waveform.startsWith("sampler_")) {
        let bufferToPlay = null
        let baseFreq = 1
        switch (params.waveform) {
          case "sampler_marimba":
            bufferToPlay = marimbaBuffer
            baseFreq = MARIMBA_BASE_FREQ
            break
          case "sampler_piano":
            bufferToPlay = pianoBuffer
            baseFreq = PIANO_BASE_FREQ
            break
          case "sampler_flute":
            bufferToPlay = fluteBuffer
            baseFreq = FLUTE_BASE_FREQ
            break
        }
        if (bufferToPlay) {
          const source = audioContext.createBufferSource()
          source.buffer = bufferToPlay
          const desiredFreq = params.pitch
          if (isNaN(desiredFreq) || desiredFreq <= 0) {
            source.playbackRate.value = 1
          } else {
            source.playbackRate.value = Math.max(
              0.1,
              Math.min(4, desiredFreq / baseFreq)
            )
          }
          source.connect(lowPassFilter)
          source.start(now)
          source.onended = () => {
            const stillNode = findNodeById(node.id)
            if (stillNode) stillNode.isTriggered = false
          }
        } else {
          gainNode.gain.cancelScheduledValues(now)
          gainNode.gain.setValueAtTime(0, now)
          node.isTriggered = false
          node.animationState = 0
          return
        }
      } else {
        if (
          (params.waveform === "fmBell" || params.waveform === "fmXylo") &&
          modulatorGain
        ) {
          const modDepth =
            params.pitch *
            (params.waveform === "fmBell" ? 4 : 10) *
            params.fmModDepthScale
          modulatorGain.gain.cancelScheduledValues(now)
          modulatorGain.gain.setValueAtTime(0, now)
          modulatorGain.gain.linearRampToValueAtTime(modDepth * 1.8, now + 0.01)
          modulatorGain.gain.exponentialRampToValueAtTime(0.001, now + 0.15)
        }
        setTimeout(() => {
          const stillNode = findNodeById(node.id)
          if (stillNode) stillNode.isTriggered = false
        }, (soundEndTime - now) * 1000)
      }
    } catch (e) {
      node.isTriggered = false
      node.animationState = 0
    }
    const particleCount = Math.round(
      5 + Math.floor(node.size * 3) * (pulseData.particleMultiplier ?? 1.0)
    )
    createParticles(node.x, node.y, particleCount)
  } else if (isDrumType(node.type)) {
    if (!node.audioNodes?.mainGain) return
    node.isTriggered = true
    node.animationState = 1
    const soundParams = node.audioParams
    const mainGain = node.audioNodes.mainGain
    const finalVol = soundParams.volume * intensity
    try {
      if (node.type === "drum_kick") {
        const osc = audioContext.createOscillator()
        const gain = audioContext.createGain()
        osc.frequency.setValueAtTime(soundParams.baseFreq * 2.5, now)
        osc.frequency.exponentialRampToValueAtTime(
          soundParams.baseFreq,
          now + 0.05
        )
        gain.gain.setValueAtTime(finalVol, now)
        gain.gain.exponentialRampToValueAtTime(0.001, now + soundParams.decay)
        osc.connect(gain)
        gain.connect(mainGain)
        osc.start(now)
        osc.stop(now + soundParams.decay + 0.05)
      } else if (node.type === "drum_snare") {
        const noiseDur = soundParams.noiseDecay ?? 0.15
        const bodyDecay = soundParams.decay ?? 0.2
        const noise = audioContext.createBufferSource()
        const noiseBuffer = audioContext.createBuffer(
          1,
          audioContext.sampleRate * noiseDur,
          audioContext.sampleRate
        )
        const output = noiseBuffer.getChannelData(0)
        for (let i = 0; i < output.length; i++) {
          output[i] = Math.random() * 2 - 1
        }
        noise.buffer = noiseBuffer
        const noiseFilter = audioContext.createBiquadFilter()
        noiseFilter.type = "highpass"
        noiseFilter.frequency.value = 1500
        const noiseGain = audioContext.createGain()
        noiseGain.gain.setValueAtTime(finalVol * 0.8, now)
        noiseGain.gain.exponentialRampToValueAtTime(0.001, now + noiseDur)
        noise.connect(noiseFilter)
        noiseFilter.connect(noiseGain)
        noiseGain.connect(mainGain)
        noise.start(now)
        noise.stop(now + noiseDur + 0.01)
        const osc = audioContext.createOscillator()
        const gain = audioContext.createGain()
        osc.type = "triangle"
        osc.frequency.setValueAtTime(soundParams.baseFreq, now)
        gain.gain.setValueAtTime(finalVol * 0.7, now)
        gain.gain.exponentialRampToValueAtTime(0.01, now + bodyDecay)
        osc.connect(gain)
        gain.connect(mainGain)
        osc.start(now)
        osc.stop(now + bodyDecay + 0.01)
      } else if (node.type === "drum_hihat") {
        const decay = soundParams.decay ?? 0.05
        const noise = audioContext.createBufferSource()
        const noiseBuffer = audioContext.createBuffer(
          1,
          audioContext.sampleRate * decay,
          audioContext.sampleRate
        )
        const output = noiseBuffer.getChannelData(0)
        for (let i = 0; i < output.length; i++) {
          output[i] = Math.random() * 2 - 1
        }
        noise.buffer = noiseBuffer
        const noiseFilter = audioContext.createBiquadFilter()
        noiseFilter.type = "highpass"
        noiseFilter.frequency.value = soundParams.baseFreq
        const noiseGain = audioContext.createGain()
        noiseGain.gain.setValueAtTime(finalVol, now)
        noiseGain.gain.exponentialRampToValueAtTime(0.001, now + decay)
        noise.connect(noiseFilter)
        noiseFilter.connect(noiseGain)
        noiseGain.connect(mainGain)
        noise.start(now)
        noise.stop(now + decay + 0.01)
      } else if (node.type === "drum_clap") {
        const decay = soundParams.noiseDecay ?? 0.1
        const noise = audioContext.createBufferSource()
        const noiseBuffer = audioContext.createBuffer(
          1,
          audioContext.sampleRate * decay * 1.5,
          audioContext.sampleRate
        )
        const output = noiseBuffer.getChannelData(0)
        for (let i = 0; i < output.length; i++) {
          output[i] = Math.random() * 2 - 1
        }
        noise.buffer = noiseBuffer
        const noiseFilter = audioContext.createBiquadFilter()
        noiseFilter.type = "bandpass"
        noiseFilter.frequency.value = soundParams.baseFreq ?? 1500
        noiseFilter.Q.value = 1.5
        const noiseGain = audioContext.createGain()
        noiseGain.gain.setValueAtTime(0, now)
        noiseGain.gain.linearRampToValueAtTime(finalVol, now + 0.002)
        noiseGain.gain.setValueAtTime(finalVol, now + 0.002)
        noiseGain.gain.linearRampToValueAtTime(finalVol * 0.7, now + 0.01)
        noiseGain.gain.setValueAtTime(finalVol * 0.7, now + 0.01)
        noiseGain.gain.linearRampToValueAtTime(finalVol * 0.9, now + 0.015)
        noiseGain.gain.setValueAtTime(finalVol * 0.9, now + 0.015)
        noiseGain.gain.exponentialRampToValueAtTime(0.001, now + decay)
        noise.connect(noiseFilter)
        noiseFilter.connect(noiseGain)
        noiseGain.connect(mainGain)
        noise.start(now)
        noise.stop(now + decay + 0.05)
      } else if (node.type === "drum_tom1" || node.type === "drum_tom2") {
        const decay = soundParams.decay ?? 0.4
        const osc = audioContext.createOscillator()
        const gain = audioContext.createGain()
        osc.type = "sine"
        osc.frequency.setValueAtTime(soundParams.baseFreq * 1.8, now)
        osc.frequency.exponentialRampToValueAtTime(
          soundParams.baseFreq,
          now + 0.08
        )
        gain.gain.setValueAtTime(finalVol, now)
        gain.gain.exponentialRampToValueAtTime(0.001, now + decay)
        osc.connect(gain)
        gain.connect(mainGain)
        osc.start(now)
        osc.stop(now + decay + 0.01)
      } else if (node.type === "drum_cowbell") {
        const decay = soundParams.decay ?? 0.3
        const osc1 = audioContext.createOscillator()
        const osc2 = audioContext.createOscillator()
        const gain = audioContext.createGain()
        osc1.type = "square"
        osc2.type = "square"
        osc1.frequency.value = soundParams.baseFreq
        osc2.frequency.value = soundParams.baseFreq * 1.5
        gain.gain.setValueAtTime(finalVol * 0.6, now)
        gain.gain.exponentialRampToValueAtTime(0.001, now + decay)
        osc1.connect(gain)
        osc2.connect(gain)
        gain.connect(mainGain)
        osc1.start(now)
        osc1.stop(now + decay)
        osc2.start(now)
        osc2.stop(now + decay)
      }
    } catch (e) {}
    setTimeout(() => {
      const stillNode = findNodeById(node.id)
      if (stillNode) stillNode.isTriggered = false
    }, 150)
    createParticles(node.x, node.y, 3)
  }
}

function propagateTrigger(
  targetNode,
  incomingDelay,
  pulseId,
  sourceNodeId = -1,
  hopsRemaining = Infinity,
  incomingPulse = { type: "trigger", data: {} }
) {
  if (
    !targetNode ||
    targetNode.type === "nebula" ||
    targetNode.lastTriggerPulseId === pulseId ||
    hopsRemaining <= 0
  ) {
    return
  }
  const sourceNode = findNodeById(sourceNodeId)
  if (targetNode.id === sourceNodeId) {
    return
  }
  targetNode.lastTriggerPulseId = pulseId
  const actualTriggerDelay = incomingDelay

  setTimeout(() => {
    const currentNode = findNodeById(targetNode.id)
    if (!currentNode) return

    let canPropagate = true
    let triggerAudioEffect = false
    let triggerVisualEffect = true
    let stateChangedForUndo = false
    let pulseDataForNext = { ...incomingPulse.data }
    const incomingConnection = connections.find(
      (c) =>
        (c.nodeAId === sourceNodeId && c.nodeBId === currentNode.id) ||
        (c.nodeAId === currentNode.id && c.nodeBId === sourceNodeId)
    )

    if (isPulsarType(currentNode.type)) {
      if (currentNode.type === "pulsar_triggerable") {
        if (sourceNodeId !== -1 && sourceNodeId !== currentNode.id) {
          currentNode.isEnabled = !currentNode.isEnabled
          if (currentNode.isEnabled) {
            currentNode.lastTriggerTime = -1
            currentNode.nextSyncTriggerTime = 0
            currentNode.nextGridTriggerTime = 0
            const nowTime = audioContext
              ? audioContext.currentTime
              : performance.now() / 1000
            currentNode.nextRandomTriggerTime =
              nowTime +
              (Math.random() * 2) / PULSAR_RANDOM_TIMING_CHANCE_PER_SEC
          }
          stateChangedForUndo = true
          currentNode.animationState = 1
          triggerAudioEffect = false
          canPropagate = false
          triggerVisualEffect = false
        } else {
          canPropagate = false
          triggerVisualEffect = false
        }
      } else {
        triggerAudioEffect = false
        canPropagate = true
        currentNode.animationState = 1
        pulseDataForNext = { ...incomingPulse.data }
        pulseDataForNext.color = currentNode.color ?? null
        if (sourceNode && sourceNode.type === "pulsar_random_volume") {
          pulseDataForNext.intensity = incomingPulse.data.intensity
        } else {
          pulseDataForNext.intensity =
            currentNode.audioParams.pulseIntensity ?? DEFAULT_PULSE_INTENSITY
        }
        pulseDataForNext.particleMultiplier =
          incomingPulse.data.particleMultiplier ?? 1.0
        triggerVisualEffect = false
      }
    } else if (currentNode.type === "gate") {
      triggerAudioEffect = false
      const counterBefore = currentNode.gateCounter || 0
      currentNode.gateCounter = counterBefore + 1
      const modeIndex = currentNode.gateModeIndex || 0
      const mode = GATE_MODES[modeIndex]
      canPropagate = false
      switch (mode) {
        case "1/2":
          if (currentNode.gateCounter % 2 === 0) canPropagate = true
          break
        case "1/3":
          if (currentNode.gateCounter % 3 === 0) canPropagate = true
          break
        case "1/4":
          if (currentNode.gateCounter % 4 === 0) canPropagate = true
          break
        case "2/3":
          if (currentNode.gateCounter % 3 !== 0) canPropagate = true
          break
        case "3/4":
          if (currentNode.gateCounter % 4 !== 0) canPropagate = true
          break
        case "RAND":
          const randomCheck = Math.random() < GATE_RANDOM_THRESHOLD
          currentNode.lastRandomGateResult = randomCheck
          if (randomCheck) canPropagate = true
          break
      }
      currentNode.animationState = 1
      triggerVisualEffect = false
    } else if (currentNode.type === "probabilityGate") {
      triggerAudioEffect = false
      canPropagate = false
      if (
        Math.random() <
        (currentNode.audioParams.probability ?? DEFAULT_PROBABILITY)
      ) {
        canPropagate = true
      }
      currentNode.animationState = 1
      triggerVisualEffect = false
    } else if (currentNode.type === "pitchShift") {
      triggerAudioEffect = false
      canPropagate = true
      currentNode.animationState = 1
      triggerVisualEffect = false
      const shiftIndex =
        currentNode.pitchShiftIndex ?? DEFAULT_PITCH_SHIFT_INDEX
      let shiftAmount = PITCH_SHIFT_AMOUNTS[shiftIndex]
      if (currentNode.pitchShiftAlternating) {
        shiftAmount *= currentNode.pitchShiftDirection || 1
        currentNode.pitchShiftDirection =
          (currentNode.pitchShiftDirection || 1) * -1
        stateChangedForUndo = true
      }
      let pitchActuallyChanged = false

      currentNode.connections.forEach((neighborId) => {
        if (neighborId === sourceNodeId) return
        const neighborNode = findNodeById(neighborId)
        if (
          neighborNode &&
          (neighborNode.type === "sound" || neighborNode.type === "nebula")
        ) {
          const oldIndex = neighborNode.audioParams.scaleIndex
          neighborNode.audioParams.scaleIndex = Math.max(
            MIN_SCALE_INDEX,
            Math.min(MAX_SCALE_INDEX, oldIndex + shiftAmount)
          )
          neighborNode.audioParams.pitch = getFrequency(
            currentScale,
            neighborNode.audioParams.scaleIndex
          )
          updateNodeAudioParams(neighborNode)
          if (oldIndex !== neighborNode.audioParams.scaleIndex) {
            pitchActuallyChanged = true
            neighborNode.animationState = 0.7
            setTimeout(() => {
              const checkNode = findNodeById(neighborId)
              if (checkNode && !checkNode.isTriggered)
                checkNode.animationState = 0
            }, 150)
          }
        }
        const neighborConn = connections.find(
          (c) =>
            c.type === "string_violin" &&
            ((c.nodeAId === currentNode.id && c.nodeBId === neighborId) ||
              (c.nodeAId === neighborId && c.nodeBId === currentNode.id))
        )
        if (neighborConn) {
          const oldIndex = neighborConn.audioParams.scaleIndex
          neighborConn.audioParams.scaleIndex = Math.max(
            MIN_SCALE_INDEX,
            Math.min(MAX_SCALE_INDEX, oldIndex + shiftAmount)
          )
          neighborConn.audioParams.pitch = getFrequency(
            currentScale,
            neighborConn.audioParams.scaleIndex
          )
          updateConnectionAudioParams(neighborConn)
          if (oldIndex !== neighborConn.audioParams.scaleIndex) {
            pitchActuallyChanged = true
            neighborConn.animationState = 0.7
            setTimeout(() => {
              const checkConn = findConnectionById(neighborConn.id)
              if (checkConn) checkConn.animationState = 0
            }, 150)
          }
        }
      })

      if (pitchActuallyChanged) {
        stateChangedForUndo = true
      }
    } else if (currentNode.type === "relay") {
      triggerAudioEffect = false
      canPropagate = true
      currentNode.animationState = 1
      triggerVisualEffect = false
    } else if (currentNode.type === "reflector") {
      triggerAudioEffect = false
      canPropagate = false
      triggerVisualEffect = true
      currentNode.animationState = 1
      if (sourceNode && incomingConnection) {
        const baseTravelTime = incomingConnection.length * DELAY_FACTOR
        const outgoingTravelTime = baseTravelTime
        const pulseColor = pulseDataForNext.color
        createVisualPulse(
          incomingConnection.id,
          outgoingTravelTime,
          currentNode.id,
          hopsRemaining - 1,
          "trigger",
          pulseColor,
          pulseDataForNext.intensity
        )
        propagateTrigger(
          sourceNode,
          outgoingTravelTime,
          pulseId,
          currentNode.id,
          hopsRemaining - 1,
          { type: "trigger", data: pulseDataForNext }
        )
      }
    } else if (currentNode.type === "switch") {
      triggerAudioEffect = false
      canPropagate = false
      triggerVisualEffect = true
      currentNode.animationState = 1
      if (incomingConnection) {
        if (
          currentNode.primaryInputConnectionId === null ||
          currentNode.primaryInputConnectionId === undefined
        ) {
          currentNode.primaryInputConnectionId = incomingConnection.id
          stateChangedForUndo = true
        }
        if (incomingConnection.id === currentNode.primaryInputConnectionId) {
          canPropagate = true
        } else {
          canPropagate = false
          triggerVisualEffect = false
        }
      } else {
        canPropagate = false // No incoming connection found? Stop.
      }
    } else if (currentNode.type === "sound") {
      triggerAudioEffect = true
      canPropagate = true
      triggerVisualEffect = false
    } else if (isDrumType(currentNode.type)) {
      triggerAudioEffect = true
      canPropagate = true
      triggerVisualEffect = false
      pulseDataForNext = { ...pulseDataForNext }
    } else {
      canPropagate = false
      triggerVisualEffect = false
    }

    if (
      triggerAudioEffect &&
      (currentNode.type === "sound" || isDrumType(currentNode.type))
    ) {
      triggerNodeEffect(currentNode, pulseDataForNext)
    }

    if (triggerVisualEffect) {
      setTimeout(() => {
        const nodeCheck = findNodeById(currentNode.id)
        if (nodeCheck && !nodeCheck.isTriggered) nodeCheck.animationState = 0
      }, 150)
    }

    if (
      !isPulsarType(currentNode.type) &&
      currentNode.type !== "sound" &&
      !isDrumType(currentNode.type) &&
      currentNode.type !== "relay" &&
      currentNode.type !== "reflector" &&
      currentNode.type !== "switch" &&
      currentNode.animationState > 0
    ) {
      setTimeout(() => {
        const nodeCheck = findNodeById(currentNode.id)
        if (nodeCheck && !nodeCheck.isTriggered) nodeCheck.animationState = 0
      }, 150)
    }
    if (isPulsarType(currentNode.type) && currentNode.animationState > 0) {
      setTimeout(() => {
        const nodeCheck = findNodeById(currentNode.id)
        if (nodeCheck) nodeCheck.animationState = 0
      }, 150)
    }

    if (stateChangedForUndo) {
      populateEditPanel()
      saveState()
    }

    if (canPropagate) {
      const nextHops = hopsRemaining === Infinity ? Infinity : hopsRemaining - 1
      if (nextHops > 0 || nextHops === Infinity) {
        currentNode.connections.forEach((neighborId) => {
          if (neighborId === sourceNodeId) return
          const neighborNode = findNodeById(neighborId)
          const connection = connections.find(
            (c) =>
              (c.nodeAId === currentNode.id && c.nodeBId === neighborId) ||
              (c.nodeAId === neighborId && c.nodeBId === currentNode.id)
          )
          if (
            neighborNode &&
            neighborNode.type !== "nebula" &&
            connection &&
            neighborNode.lastTriggerPulseId !== pulseId
          ) {
            const baseTravelTime = connection.length * DELAY_FACTOR
            const outgoingTravelTime = baseTravelTime
            const pulseColor = pulseDataForNext.color
            createVisualPulse(
              connection.id,
              outgoingTravelTime,
              currentNode.id,
              nextHops,
              "trigger",
              pulseColor,
              pulseDataForNext.intensity
            )
            propagateTrigger(
              neighborNode,
              outgoingTravelTime,
              pulseId,
              currentNode.id,
              nextHops,
              { type: "trigger", data: pulseDataForNext }
            )
          }
        })
      }
    }
  }, actualTriggerDelay * 1000)
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
function createVisualPulse(
  connId,
  dur,
  startId,
  hopsLeft = Infinity,
  pulseType = "trigger",
  pulseColor = null,
  intensity = 1.0
) {
  if (!isAudioReady || dur <= 0) return
  const p = {
    id: pulseIdCounter++,
    connectionId: connId,
    startTime: audioContext.currentTime,
    duration: dur,
    startNodeId: startId,
    hopsLeft: hopsLeft,
    type: pulseType,
    color: pulseColor,
    intensity: intensity
  }
  const connection = findConnectionById(connId)
  if (connection && connection.type === "string_violin") {
    p.audioStartTime = audioContext.currentTime
    p.audioEndTime = audioContext.currentTime + dur
    startStringSound(connection, p.intensity)
  }
  activePulses.push(p)
}
function updateAndDrawPulses(now) {
  const defaultPulseColor =
    getComputedStyle(document.documentElement)
      .getPropertyValue("--pulse-visual-color")
      .trim() || "rgba(255, 255, 255, 1)"
  activePulses = activePulses.filter((p) => {
    const elapsedTime = now - p.startTime
    const connection = findConnectionById(p.connectionId)
    if (!connection || elapsedTime >= p.duration) {
      if (
        connection &&
        connection.type === "string_violin" &&
        p.audioStartTime
      ) {
        stopStringSound(connection)
      }
      return false
    }
    const nodeA = findNodeById(connection.nodeAId)
    const nodeB = findNodeById(connection.nodeBId)
    if (!nodeA || !nodeB) return false
    const startNode = p.startNodeId === nodeA.id ? nodeA : nodeB
    const endNode = p.startNodeId === nodeA.id ? nodeB : nodeA
    const progress = Math.min(1.0, elapsedTime / p.duration)
    const midX = (startNode.x + endNode.x) / 2 + connection.controlPointOffsetX
    const midY = (startNode.y + endNode.y) / 2 + connection.controlPointOffsetY
    const pX = lerp(
      lerp(startNode.x, midX, progress),
      lerp(midX, endNode.x, progress),
      progress
    )
    const pY = lerp(
      lerp(startNode.y, midY, progress),
      lerp(midY, endNode.y, progress),
      progress
    )
    const prevProgress = Math.max(0, progress - 0.02)
    const prevX = lerp(
      lerp(startNode.x, midX, prevProgress),
      lerp(midX, endNode.x, prevProgress),
      prevProgress
    )
    const prevY = lerp(
      lerp(startNode.y, midY, prevProgress),
      lerp(midY, endNode.y, prevProgress),
      prevProgress
    )
    const angle = Math.atan2(pY - prevY, pX - prevX)
    const tailLength = 5 + p.duration * 30
    const colorToUse =
      p.color ||
      (connection.type === "string_violin"
        ? getComputedStyle(document.documentElement)
            .getPropertyValue("--string-violin-pulse-color")
            .trim() || "#ffccaa"
        : defaultPulseColor)
    ctx.fillStyle = colorToUse
    ctx.shadowColor = colorToUse
    ctx.shadowBlur = 8
    ctx.beginPath()
    ctx.arc(pX, pY, PULSE_SIZE, 0, Math.PI * 2)
    ctx.fill()
    ctx.beginPath()
    ctx.moveTo(
      pX + Math.cos(angle + Math.PI * 0.8) * PULSE_SIZE * 0.5,
      pY + Math.sin(angle + Math.PI * 0.8) * PULSE_SIZE * 0.5
    )
    ctx.lineTo(
      pX + Math.cos(angle + Math.PI) * tailLength,
      pY + Math.sin(angle + Math.PI) * tailLength
    )
    ctx.lineTo(
      pX + Math.cos(angle - Math.PI * 0.8) * PULSE_SIZE * 0.5,
      pY + Math.sin(angle - Math.PI * 0.8) * PULSE_SIZE * 0.5
    )
    ctx.closePath()
    const tailGradient = ctx.createLinearGradient(
      pX,
      pY,
      pX + Math.cos(angle + Math.PI) * tailLength,
      pY + Math.sin(angle + Math.PI) * tailLength
    )
    const alpha = Math.max(0, 1.0 - progress)
    try {
      tailGradient.addColorStop(
        0,
        colorToUse.replace(/[\d\.]+\)$/g, `${alpha})`)
      )
      tailGradient.addColorStop(1, colorToUse.replace(/[\d\.]+\)$/g, "0)"))
    } catch (e) {}
    ctx.fillStyle = tailGradient
    ctx.fill()
    ctx.shadowBlur = 0
    return true
  })
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
  if (!isAudioReady) return null
  let currentEvent = window.event
  let applySnap = isSnapEnabled && !(currentEvent && currentEvent.shiftKey)
  let finalPos = applySnap ? snapToGrid(x, y) : { x: x, y: y }
  const isStartNodeType = isPulsarType(type)
  const nodeType = type
  let initialScaleIndex = 0
  let initialPitch = 0
  let nodeSubtype = subtype
  if (type === "sound" || type === "nebula") {
    if (noteIndexToAdd !== -1) {
      initialScaleIndex = noteIndexToAdd
    } else {
      initialScaleIndex = Math.floor(
        Math.random() * currentScale.notes.length * 2
      )
    }
    initialScaleIndex = Math.max(
      MIN_SCALE_INDEX,
      Math.min(MAX_SCALE_INDEX, initialScaleIndex)
    )
    initialPitch = getFrequency(currentScale, initialScaleIndex)
    if (isNaN(initialPitch)) {
      initialScaleIndex = 0
      initialPitch = getFrequency(currentScale, 0)
    }
    if (
      type === "nebula" &&
      nodeSubtype &&
      nodeSubtype.startsWith("sampler_")
    ) {
      nodeSubtype = "sawtooth"
    } else if (type === "sound") {
      nodeSubtype = nodeSubtype || "fmBell"
    }
  }
  const randomSize =
    isStartNodeType || isDrumType(type)
      ? MIN_NODE_SIZE + Math.random() * (MAX_NODE_SIZE - MIN_NODE_SIZE) * 0.7
      : type === "relay" || type === "reflector" || type === "switch"
      ? 0.7
      : 1.0
  const starPoints = isStartNodeType ? 6 : 6
  const drumDefaults = isDrumType(type) ? DRUM_ELEMENT_DEFAULTS[type] : {}
  const newNode = {
    id: nodeIdCounter++,
    x: finalPos.x,
    y: finalPos.y,
    size: randomSize,
    radius: NODE_RADIUS_BASE,
    type: nodeType,
    connections: new Set(),
    isSelected: false,
    isInConstellation: false,
    audioParams: {
      triggerInterval: DEFAULT_TRIGGER_INTERVAL,
      waveform: nodeSubtype,
      reverbSend: DEFAULT_REVERB_SEND,
      delaySend: DEFAULT_DELAY_SEND,
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
      volume: drumDefaults?.volume ?? 1.0
    },
    color: null,
    audioNodes: null,
    isStartNode: isStartNodeType,
    isTriggered: false,
    lastTriggerPulseId: -1,
    animationState: 0,
    lastTriggerTime: -1,
    currentAngle:
      type === "gate" ||
      type === "nebula" ||
      (type === "sound" && nodeSubtype && nodeSubtype.startsWith("sampler_"))
        ? Math.random() * Math.PI * 2
        : 0,
    innerAngle: type === "nebula" ? Math.random() * Math.PI * 2 : 0,
    pulsePhase: type === "nebula" ? Math.random() * Math.PI * 2 : 0,
    gateModeIndex: type === "gate" ? DEFAULT_GATE_MODE_INDEX : 0,
    gateCounter: 0,
    lastRandomGateResult: true,
    pitchShiftIndex: type === "pitchShift" ? DEFAULT_PITCH_SHIFT_INDEX : 0,
    pitchShiftAmount:
      type === "pitchShift"
        ? PITCH_SHIFT_AMOUNTS[DEFAULT_PITCH_SHIFT_INDEX]
        : 0,
    pitchShiftAlternating: false,
    pitchShiftDirection: 1,
    syncSubdivisionIndex: DEFAULT_SUBDIVISION_INDEX,
    nextSyncTriggerTime: 0,
    nextRandomTriggerTime: 0,
    starPoints: starPoints,
    isEnabled: type !== "pulsar_triggerable",
    pulseOriginNodeId: -1,
    midiOutEnabled: false,
    midiChannel: 1,
    midiNote: 60,
    primaryInputConnectionId: type === "switch" ? null : undefined
  }
  newNode.audioNodes = createAudioNodesForNode(newNode)
  if (newNode.audioNodes) {
    updateNodeAudioParams(newNode)
  }
  nodes.push(newNode)
  saveState()
  return newNode
}
function stopNodeAudio(node) {
  if (!node || !node.audioNodes) return
  try {
    if (node.type === "sound") {
      node.audioNodes.oscillator?.stop()
      node.audioNodes.modulatorOsc?.stop()
      node.audioNodes.volLfo?.stop()
      node.audioNodes.reverbSendGain?.disconnect()
      node.audioNodes.delaySendGain?.disconnect()
      node.audioNodes.volLfoGain?.disconnect()
      node.audioNodes.volLfo?.disconnect()
      node.audioNodes.gainNode?.disconnect()
      node.audioNodes.lowPassFilter?.disconnect()
      node.audioNodes.modulatorGain?.disconnect()
      node.audioNodes.modulatorOsc?.disconnect()
      node.audioNodes.oscillator?.disconnect()
    } else if (node.type === "nebula") {
      node.audioNodes.filterLfo?.stop()
      node.audioNodes.volLfo?.stop()
      node.audioNodes.oscillators?.forEach((osc) => osc.stop())
      node.audioNodes.reverbSendGain?.disconnect()
      node.audioNodes.delaySendGain?.disconnect()
      node.audioNodes.filterLfoGain?.disconnect()
      node.audioNodes.volLfoGain?.disconnect()
      node.audioNodes.filterLfo?.disconnect()
      node.audioNodes.volLfo?.disconnect()
      node.audioNodes.gainNode?.disconnect()
      node.audioNodes.filterNode?.disconnect()
      node.audioNodes.oscillators?.forEach((osc) => osc.disconnect())
    } else if (isDrumType(node.type)) {
      node.audioNodes.reverbSendGain?.disconnect()
      node.audioNodes.delaySendGain?.disconnect()
      node.audioNodes.mainGain?.disconnect()
    }
  } catch (e) {}
  node.audioNodes = null
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
function connectNodes(nodeA, nodeB, type = "standard") {
  if (
    !nodeA ||
    !nodeB ||
    nodeA === nodeB ||
    nodeA.type === "nebula" ||
    nodeB.type === "nebula"
  )
    return
  const exists = connections.some(
    (c) =>
      (c.nodeAId === nodeA.id && c.nodeBId === nodeB.id) ||
      (c.nodeAId === nodeB.id && c.nodeBId === nodeA.id)
  )
  if (exists) return
  nodeA.connections.add(nodeB.id)
  nodeB.connections.add(nodeA.id)
  const dx = nodeB.x - nodeA.x
  const dy = nodeB.y - nodeA.y
  const len = Math.sqrt(dx * dx + dy * dy) || 1
  const offsetScale = Math.min(len * 0.4, 60)
  const ctrlOffsetX =
    (-dy / len) * (Math.random() * offsetScale - offsetScale / 2)
  const ctrlOffsetY =
    (dx / len) * (Math.random() * offsetScale - offsetScale / 2)
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
    animationState: 0
  }
  if (type === "string_violin") {
    let initialScaleIndex = 0
    if (noteIndexToAdd !== -1) {
      initialScaleIndex = noteIndexToAdd
    } else {
      initialScaleIndex = Math.floor(
        Math.random() * currentScale.notes.length * 2
      )
    }
    initialScaleIndex = Math.max(
      MIN_SCALE_INDEX,
      Math.min(MAX_SCALE_INDEX, initialScaleIndex)
    )
    let initialPitch = getFrequency(currentScale, initialScaleIndex)
    if (isNaN(initialPitch)) {
      initialScaleIndex = 0
      initialPitch = getFrequency(currentScale, 0)
    }
    newConnection.audioParams = {
      ...STRING_VIOLIN_DEFAULTS,
      scaleIndex: initialScaleIndex,
      pitch: initialPitch
    }
    newConnection.audioNodes = createAudioNodesForConnection(newConnection)
    if (newConnection.audioNodes) {
      updateConnectionAudioParams(newConnection)
    }
  }
  connections.push(newConnection)
  updateConstellationGroup()
  saveState()
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
  }
}

function findConstellation(startNodeId) {
  const constellationNodes = new Set()
  const queue = [startNodeId]
  const visited = new Set([startNodeId])
  const startNode = findNodeById(startNodeId)
  if (!startNode || !CONSTELLATION_NODE_TYPES.includes(startNode.type)) {
    return constellationNodes
  }
  while (queue.length > 0) {
    const currentNodeId = queue.shift()
    const currentNode = findNodeById(currentNodeId)
    if (!currentNode) continue
    if (CONSTELLATION_NODE_TYPES.includes(currentNode.type)) {
      constellationNodes.add(currentNodeId)
    }
    currentNode.connections.forEach((neighborId) => {
      if (!visited.has(neighborId)) {
        visited.add(neighborId)
        const neighborNode = findNodeById(neighborId)
        const connection = connections.find(
          (c) =>
            c.type !== "string_violin" &&
            ((c.nodeAId === currentNodeId && c.nodeBId === neighborId) ||
              (c.nodeAId === neighborId && c.nodeBId === currentNodeId))
        )
        if (
          neighborNode &&
          CONSTELLATION_NODE_TYPES.includes(neighborNode.type) &&
          connection
        ) {
          queue.push(neighborId)
        }
      }
    })
  }
  return constellationNodes
}
function updateConstellationGroup() {
  if (!isAudioReady) return
  const previousConstellationGroup = new Set(currentConstellationGroup)
  currentConstellationGroup.clear()
  nodes.forEach((n) => (n.isInConstellation = false))
  const selectedNodeIds = new Set(
    [...selectedElements].filter((el) => el.type === "node").map((el) => el.id)
  )
  if (selectedNodeIds.size > 0 && currentTool === "edit") {
    const firstSelectedId = selectedNodeIds.values().next().value
    const firstSelectedNode = findNodeById(firstSelectedId)
    if (
      firstSelectedNode &&
      CONSTELLATION_NODE_TYPES.includes(firstSelectedNode.type)
    ) {
      const potentialConstellation = findConstellation(firstSelectedId)
      let allSelectedInConstellation = true
      selectedNodeIds.forEach((id) => {
        const selectedNode = findNodeById(id)
        if (!selectedNode || !potentialConstellation.has(id)) {
          allSelectedInConstellation = false
        }
      })
      if (allSelectedInConstellation && potentialConstellation.size > 0) {
        potentialConstellation.forEach((id) => {
          const node = findNodeById(id)
          if (node) node.isInConstellation = true
        })
        currentConstellationGroup = potentialConstellation
      }
    }
  }
  const nodesToRouteToGroup = new Set()
  const nodesToRouteToMaster = new Set()
  previousConstellationGroup.forEach((id) => {
    if (!currentConstellationGroup.has(id)) nodesToRouteToMaster.add(id)
  })
  currentConstellationGroup.forEach((id) => {
    if (!previousConstellationGroup.has(id)) nodesToRouteToGroup.add(id)
  })
  if (currentConstellationGroup.size > 0 && !groupVolumeGain) {
    groupVolumeGain = audioContext.createGain()
    groupVolumeGain.gain.setValueAtTime(
      parseFloat(groupVolumeSlider.value),
      audioContext.currentTime
    )
    groupVolumeGain.connect(masterGain)
  }
  nodesToRouteToMaster.forEach((id) =>
    rerouteAudioForNode(findNodeById(id), masterGain)
  )
  nodesToRouteToGroup.forEach((id) =>
    rerouteAudioForNode(findNodeById(id), groupVolumeGain)
  )
  if (currentConstellationGroup.size === 0 && groupVolumeGain) {
    try {
      groupVolumeGain.disconnect()
    } catch (e) {}
    groupVolumeGain = null
  }
  updateGroupControlsUI()
  updateFluctuatingNodesLFO()
}
function rerouteAudioForNode(node, destinationNode) {
  if (
    !node ||
    !node.audioNodes ||
    !["sound", "nebula"].includes(node.type) ||
    !isAudioReady
  )
    return
  const gainNode = node.audioNodes.gainNode || node.audioNodes.mainGain
  if (!gainNode) return
  const reverbSendGain = node.audioNodes.reverbSendGain
  const delaySendGain = node.audioNodes.delaySendGain
  try {
    gainNode.disconnect()
    if (destinationNode) {
      gainNode.connect(destinationNode)
    } else {
      gainNode.connect(masterGain)
    }
    if (reverbSendGain && isReverbReady && reverbNode) {
      gainNode.connect(reverbSendGain)
      try {
        reverbSendGain.disconnect(reverbNode)
      } catch (e) {}
      reverbSendGain.connect(reverbNode)
    }
    if (delaySendGain && isDelayReady && masterDelaySendGain) {
      gainNode.connect(delaySendGain)
      try {
        delaySendGain.disconnect(masterDelaySendGain)
      } catch (e) {}
      delaySendGain.connect(masterDelaySendGain)
    }
  } catch (e) {
    try {
      gainNode.disconnect()
      gainNode.connect(masterGain)
      if (reverbSendGain) gainNode.connect(reverbSendGain)
      if (delaySendGain) gainNode.connect(delaySendGain)
    } catch (e2) {}
  }
}
function updateGroupControlsUI() {
  const shouldShow =
    currentTool === "edit" && currentConstellationGroup.size > 0
  if (shouldShow) {
    groupControlsDiv.classList.remove("hidden")
    groupNodeCountSpan.textContent = currentConstellationGroup.size
    if (groupVolumeGain) groupVolumeSlider.value = groupVolumeGain.gain.value
    let isGroupFluctuating = false
    if (currentConstellationGroup.size > 0) {
      const firstNodeId = currentConstellationGroup.values().next().value
      if (fluctuatingGroupNodeIDs.has(firstNodeId)) {
        isGroupFluctuating = true
      }
    }
    groupFluctuateToggle.checked = isGroupFluctuating
    groupFluctuateAmount.disabled = !isGroupFluctuating
  } else {
    groupControlsDiv.classList.add("hidden")
    groupNodeCountSpan.textContent = 0
  }
  updateRestartPulsarsButtonVisibility()
}
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
  const nA = findNodeById(conn.nodeAId)
  const nB = findNodeById(conn.nodeBId)
  if (!nA || !nB) return
  const mX = (nA.x + nB.x) / 2
  const mY = (nA.y + nB.y) / 2
  const cX = mX + conn.controlPointOffsetX
  const cY = mY + conn.controlPointOffsetY
  const isSelected = isElementSelected("connection", conn.id)
  let clr
  let thickness
  let dash = []
  if (conn.type === "string_violin") {
    clr =
      getComputedStyle(document.documentElement)
        .getPropertyValue("--string-violin-connection-color")
        .trim() || "#ffccaa"
    thickness = (1.5 + 2.0 * (1 - Math.min(1, conn.length / 500))) / viewScale
    dash = [5 / viewScale, 3 / viewScale]
  } else {
    clr =
      getComputedStyle(document.documentElement)
        .getPropertyValue("--connection-color")
        .trim() || "#8AC"
    thickness = (1.0 + 1.5 * (1 - Math.min(1, conn.length / 500))) / viewScale
  }
  ctx.strokeStyle = isSelected ? "rgba(255, 255, 0, 0.9)" : clr
  ctx.lineWidth = Math.max(0.5, thickness) + (isSelected ? 2 / viewScale : 0)
  ctx.setLineDash(dash)
  ctx.beginPath()
  ctx.moveTo(nA.x, nA.y)
  ctx.quadraticCurveTo(cX, cY, nB.x, nB.y)
  ctx.stroke()
  ctx.setLineDash([])
  if (conn.animationState > 0) {
    conn.animationState -= 0.1
    conn.animationState = Math.max(0, conn.animationState)
    ctx.shadowColor = clr
    ctx.shadowBlur = (conn.animationState * 15) / viewScale
    ctx.stroke()
    ctx.shadowBlur = 0
  }
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

function drawPianoRoll() {
  if (
    !pianoRollCtx ||
    !pianoRollCanvas /* || pianoRollPanel.classList.contains('hidden') */
  ) {
    // Panel check is niet meer nodig straks
    // console.log("Skipping drawPianoRoll: context missing or panel hidden");
    return
  }

  const canvasWidth = pianoRollCanvas.width
  const canvasHeight = pianoRollCanvas.height
  pianoRollCtx.clearRect(0, 0, canvasWidth, canvasHeight)
  pianoRollHexagons = [] // Reset

  const scaleNotes = currentScale.notes
  const rootNoteModulo = currentRootNote % 12

  // --- Hexagon parameters (blijven grotendeels hetzelfde) ---
  const numNotesToDraw = 12 // Expliciet 1 octaaf (C t/m B)
  const numHexColumnsApprox = 12 // Aantal hexagons per rij
  const horizontalMargin = 10 // Iets minder marge voor toolbar
  const verticalMargin = 5
  const availableWidth = canvasWidth - 2 * horizontalMargin

  let hexRadius = availableWidth / (numHexColumnsApprox * 1.5)
  hexRadius = Math.max(8, Math.min(18, hexRadius)) // Max grootte voor toolbar
  const hexWidth = 2 * hexRadius
  const hexHeight = Math.sqrt(3) * hexRadius
  const verticalSpacing = hexHeight * 0.9 // Nog dichter op elkaar
  const horizontalSpacing = (hexWidth * 3) / 4
  let startX = horizontalMargin + hexRadius
  let startY = verticalMargin + hexHeight / 2

  let hexCol = 0
  let hexRow = 0 // Altijd maar 1 rij nu?
  const maxCols = Math.floor(
    (canvasWidth - horizontalMargin - hexRadius) / horizontalSpacing
  )

  // --- AANGEPASTE LOOP ---
  for (let i = 0; i < numNotesToDraw; i++) {
    // Loop 12 keer voor C t/m B
    const noteInOctave = i // Dit IS nu de chromatische noot (0-11)

    const posX = startX + hexCol * horizontalSpacing
    // Altijd rij 0 voor een enkele horizontale balk
    const posY = startY + (hexCol % 2 !== 0 ? verticalSpacing / 2 : 0) // Zigzag blijft

    // Check of het past (vooral horizontaal nu belangrijk)
    if (posX + hexRadius > canvasWidth - horizontalMargin / 2) {
      console.log(`Hex ${noteNames[noteInOctave]} past niet meer.`)
      break // Stop als het niet meer past
    }

    const noteRelativeToRoot = (noteInOctave - rootNoteModulo + 12) % 12
    const isScaleNote = scaleNotes.includes(noteRelativeToRoot)
    const isRootNote = noteInOctave === rootNoteModulo

    // Kleur bepalen (zelfde logica)
    let fillStyle = "rgba(50, 60, 90, 0.6)"
    if (isScaleNote) fillStyle = "rgba(150, 180, 220, 0.6)"
    if (isRootNote) fillStyle = "rgba(255, 255, 150, 0.7)"

    pianoRollCtx.fillStyle = fillStyle
    pianoRollCtx.strokeStyle = "rgba(255, 255, 255, 0.2)"
    pianoRollCtx.lineWidth = 1

    // Teken hexagon (zelfde logica)
    pianoRollCtx.beginPath()
    for (let side = 0; side < 6; side++) {
      pianoRollCtx.lineTo(
        posX + hexRadius * Math.cos((side * 2 * Math.PI) / 6 + Math.PI / 6),
        posY + hexRadius * Math.sin((side * 2 * Math.PI) / 6 + Math.PI / 6)
      )
    }
    pianoRollCtx.closePath()
    pianoRollCtx.fill()
    pianoRollCtx.stroke()

    // Tekst (nootnaam)
    pianoRollCtx.fillStyle = "#ddeeff"
    pianoRollCtx.font = `bold ${Math.max(
      7,
      Math.min(10, hexRadius * 0.7)
    )}px sans-serif`
    pianoRollCtx.textAlign = "center"
    pianoRollCtx.textBaseline = "middle"
    pianoRollCtx.fillText(noteNames[noteInOctave], posX, posY)

    // Sla hexagon data op
    pianoRollHexagons.push({
      x: posX,
      y: posY,
      radius: hexRadius,
      semitone: noteInOctave // Sla de chromatische waarde (0-11) op
    })

    // Volgende positie (alleen kolom nu)
    hexCol++
    // if (hexCol >= maxCols) { // Rij wisselen is niet meer nodig voor 1 octaaf
    //     hexCol = 0;
    //     hexRow++;
    // }
  }
}

function drawNode(node) {
  ctx.shadowBlur = 0
  const isSelected = isElementSelected("node", node.id)
  const isSelectedAndOutlineNeeded = isSelected && currentTool === "edit"
  const flashDuration = 0.1
  let preTriggerFlash = 0
  if (
    isPlaying &&
    isGlobalSyncEnabled &&
    node.isStartNode &&
    isSelectedAndOutlineNeeded &&
    node.nextSyncTriggerTime > 0 &&
    node.type !== "pulsar_random_particles"
  ) {
    const timeToNext =
      node.nextSyncTriggerTime - (audioContext?.currentTime ?? 0)
    if (timeToNext > 0 && timeToNext < flashDuration) {
      preTriggerFlash = (1.0 - timeToNext / flashDuration) * 0.6
    }
  }
  if (node.animationState > 0 && !node.isTriggered) {
    node.animationState -=
      ["sound", "nebula"].includes(node.type) || isDrumType(node.type)
        ? 0.05
        : 0.1
  }
  node.animationState = Math.max(0, node.animationState)
  const bloomFactor = 1 + node.animationState * 0.5 + preTriggerFlash * 0.6
  const currentRadius = NODE_RADIUS_BASE * node.size * bloomFactor
  let fillColor, borderColor, glowColor
  const styles = getComputedStyle(document.documentElement)
  const scaleBase = currentScale.baseHSL || { h: 200, s: 70, l: 70 }
  const isStartNodeDisabled = node.isStartNode && !node.isEnabled
  const disabledFillColorGeneral = styles
    .getPropertyValue("--start-node-disabled-color")
    .trim()
  const disabledBorderColorGeneral = styles
    .getPropertyValue("--start-node-disabled-border")
    .trim()
  if (isPulsarType(node.type)) {
    const cssVarBase = `--${node.type.replace("_", "-")}`
    const defaultFillVar = `${cssVarBase}-color`
    const defaultBorderVar = `${cssVarBase}-border`
    const defaultFill = styles
      .getPropertyValue(
        defaultFillVar,
        styles.getPropertyValue("--start-node-color")
      )
      .trim()
    const defaultBorder = styles
      .getPropertyValue(
        defaultBorderVar,
        styles.getPropertyValue("--start-node-border")
      )
      .trim()
    fillColor = isStartNodeDisabled
      ? disabledFillColorGeneral
      : node.color || defaultFill
    borderColor = isStartNodeDisabled
      ? disabledBorderColorGeneral
      : node.color
      ? node.color.replace(/[\d\.]+\)$/g, "1)")
      : defaultBorder
    glowColor = isStartNodeDisabled ? "transparent" : borderColor
  } else if (isDrumType(node.type)) {
    const typeName = node.type.replace("_", "-")
    fillColor = styles.getPropertyValue(`--${typeName}-color`).trim()
    borderColor = styles.getPropertyValue(`--${typeName}-border`).trim()
    glowColor = borderColor
  } else if (node.type === "gate") {
    fillColor = styles.getPropertyValue("--gate-node-color").trim()
    borderColor = styles.getPropertyValue("--gate-node-border").trim()
    glowColor = borderColor
  } else if (node.type === "probabilityGate") {
    fillColor = styles.getPropertyValue("--probability-gate-node-color").trim()
    borderColor = styles
      .getPropertyValue("--probability-gate-node-border")
      .trim()
    glowColor = borderColor
  } else if (node.type === "pitchShift") {
    fillColor = styles.getPropertyValue("--pitch-node-color").trim()
    borderColor = styles.getPropertyValue("--pitch-node-border").trim()
    glowColor = borderColor
  } else if (node.type === "relay") {
    fillColor = styles.getPropertyValue("--relay-node-color").trim()
    borderColor = styles.getPropertyValue("--relay-node-border").trim()
    glowColor = borderColor
  } else if (node.type === "reflector") {
    fillColor = styles.getPropertyValue("--reflector-node-color").trim()
    borderColor = styles.getPropertyValue("--reflector-node-border").trim()
    glowColor = borderColor
  } else if (node.type === "switch") {
    fillColor = styles.getPropertyValue("--switch-node-color").trim()
    borderColor = styles.getPropertyValue("--switch-node-border").trim()
    glowColor = borderColor
  } else if (node.type === "sound" || node.type === "nebula") {
    const noteIndex = node.audioParams.scaleIndex % currentScale.notes.length
    const hue = (scaleBase.h + noteIndex * HUE_STEP) % 360
    const lightness = scaleBase.l * (0.8 + node.size * 0.2)
    const saturation = scaleBase.s * (node.type === "nebula" ? 0.7 : 1.0)
    const alpha = (node.type === "nebula" ? 0.5 : 0.6) + node.size * 0.3
    fillColor = hslToRgba(hue, saturation, lightness, Math.min(0.95, alpha))
    borderColor = hslToRgba(hue, saturation * 0.8, lightness * 0.6, 0.9)
    glowColor = hslToRgba(hue, saturation, lightness * 1.1, 1.0)
  } else {
    fillColor = "grey"
    borderColor = "darkgrey"
    glowColor = "white"
  }
  ctx.fillStyle = fillColor
  ctx.strokeStyle = borderColor
  const baseLineWidth =
    (node.isStartNode
      ? 2.5
      : node.type === "relay" ||
        node.type === "reflector" ||
        node.type === "switch"
      ? 1.0
      : 1.5) / viewScale
  ctx.lineWidth = Math.max(
    0.5,
    isSelectedAndOutlineNeeded ? baseLineWidth + 1.5 / viewScale : baseLineWidth
  )
  let needsRestore = false
  if (
    (node.type === "gate" ||
      node.type === "nebula" ||
      (node.type === "sound" &&
        node.audioParams.waveform &&
        node.audioParams.waveform.startsWith("sampler_"))) &&
    node.currentAngle !== undefined
  ) {
    ctx.save()
    ctx.translate(node.x, node.y)
    if (node.type === "nebula") {
      ctx.rotate(node.currentAngle)
    } else if (node.type === "gate") {
      ctx.rotate(node.currentAngle)
    } else if (
      node.type === "sound" &&
      node.audioParams.waveform.startsWith("sampler_")
    ) {
      node.currentAngle =
        (node.currentAngle + 0.005 * (performance.now() * 0.01)) % (Math.PI * 2)
      ctx.rotate(node.currentAngle)
    }
    ctx.translate(-node.x, -node.y)
    needsRestore = true
  }
  if (node.isInConstellation && currentTool === "edit") {
    const highlightRadius = NODE_RADIUS_BASE * node.size + 5 / viewScale
    ctx.fillStyle =
      getComputedStyle(document.documentElement)
        .getPropertyValue("--constellation-highlight")
        .trim() || "rgba(255, 255, 150, 0.15)"
    ctx.beginPath()
    ctx.arc(node.x, node.y, highlightRadius, 0, Math.PI * 2)
    ctx.fill()
  }
  if (
    (node.animationState > 0 ||
      preTriggerFlash > 0 ||
      isSelectedAndOutlineNeeded ||
      node.type === "nebula") &&
    !isStartNodeDisabled
  ) {
    ctx.shadowColor = glowColor
    let glowAmount =
      (node.isStartNode || node.type === "nebula" || isDrumType(node.type)
        ? 5
        : 0) +
      (node.animationState + preTriggerFlash) * 15 +
      (isSelectedAndOutlineNeeded ? 5 : 0)
    if (
      (node.type === "gate" ||
        node.type === "probabilityGate" ||
        node.type === "pitchShift" ||
        node.type === "relay" ||
        node.type === "reflector" ||
        node.type === "switch") &&
      node.animationState > 0
    ) {
      glowAmount =
        10 + node.animationState * 10 + (isSelectedAndOutlineNeeded ? 5 : 0)
    } else if (
      isSelectedAndOutlineNeeded &&
      (node.type === "gate" ||
        node.type === "probabilityGate" ||
        node.type === "pitchShift" ||
        node.type === "relay" ||
        node.type === "reflector" ||
        node.type === "switch")
    ) {
      glowAmount = 5
    } else if (node.type === "nebula") {
      const pulseEffect = (Math.sin(node.pulsePhase) * 0.5 + 0.5) * 10
      glowAmount = 5 + pulseEffect + (isSelectedAndOutlineNeeded ? 5 : 0)
    }
    ctx.shadowBlur = Math.min(30, glowAmount) / viewScale
  } else {
    ctx.shadowBlur = 0
  }
  const r = currentRadius
  if (node.type === "sound") {
    const waveform = node.audioParams.waveform
    switch (waveform) {
      case "sine":
        ctx.beginPath()
        ctx.arc(node.x, node.y, r, 0, Math.PI * 2)
        ctx.fill()
        ctx.stroke()
        break
      case "square":
        ctx.beginPath()
        ctx.rect(node.x - r * 0.9, node.y - r * 0.9, r * 1.8, r * 1.8)
        ctx.fill()
        ctx.stroke()
        break
      case "triangle":
      case "sawtooth":
        ctx.beginPath()
        ctx.moveTo(node.x, node.y - r)
        ctx.lineTo(node.x + r * 0.866, node.y + r * 0.5)
        ctx.lineTo(node.x - r * 0.866, node.y + r * 0.5)
        ctx.closePath()
        ctx.fill()
        ctx.stroke()
        break
      case "fmBell":
      case "fmXylo":
        drawStarShape(ctx, node.x, node.y, 5, r, r * 0.5)
        ctx.fill()
        ctx.stroke()
        break
      case "sampler_marimba":
        drawSatelliteShape(ctx, node.x, node.y, r, 1)
        break
      case "sampler_piano":
        drawSatelliteShape(ctx, node.x, node.y, r, 2)
        break
      case "sampler_flute":
        drawSatelliteShape(ctx, node.x, node.y, r * 0.9, 3)
        break
      default:
        ctx.beginPath()
        ctx.arc(node.x, node.y, r, 0, Math.PI * 2)
        ctx.fill()
        ctx.stroke()
        break
    }
  } else if (node.type === "gate") {
    const innerRadius = r * 0.4
    const shieldRadius = r * 0.85
    const openingStartAngle = -GATE_ANGLE_SIZE / 2
    const openingEndAngle = GATE_ANGLE_SIZE / 2
    ctx.beginPath()
    ctx.arc(node.x, node.y, r, 0, Math.PI * 2)
    ctx.stroke()
    ctx.fillStyle = fillColor + "90"
    ctx.fill()
    ctx.fillStyle = borderColor + "A0"
    ctx.beginPath()
    ctx.moveTo(
      node.x + Math.cos(openingEndAngle) * innerRadius,
      node.y + Math.sin(openingEndAngle) * innerRadius
    )
    ctx.lineTo(
      node.x + Math.cos(openingEndAngle) * shieldRadius,
      node.y + Math.sin(openingEndAngle) * shieldRadius
    )
    ctx.arc(
      node.x,
      node.y,
      shieldRadius,
      openingEndAngle,
      openingStartAngle + Math.PI * 2,
      false
    )
    ctx.lineTo(
      node.x + Math.cos(openingStartAngle) * innerRadius,
      node.y + Math.sin(openingStartAngle) * innerRadius
    )
    ctx.arc(
      node.x,
      node.y,
      innerRadius,
      openingStartAngle + Math.PI * 2,
      openingEndAngle,
      true
    )
    ctx.closePath()
    ctx.fill()
    let shouldPassVisual = false
    const mode = GATE_MODES[node.gateModeIndex || 0]
    if (mode === "RAND") {
      shouldPassVisual = node.lastRandomGateResult
    } else {
      const counterCheck = node.gateCounter || 0
      switch (mode) {
        case "1/2":
          if (counterCheck % 2 === 0) shouldPassVisual = true
          break
        case "1/3":
          if (counterCheck % 3 === 0) shouldPassVisual = true
          break
        case "1/4":
          if (counterCheck % 4 === 0) shouldPassVisual = true
          break
        case "2/3":
          if (counterCheck % 3 !== 0) shouldPassVisual = true
          break
        case "3/4":
          if (counterCheck % 4 !== 0) shouldPassVisual = true
          break
      }
    }
    if (node.animationState > 0 && shouldPassVisual) {
      ctx.save()
      ctx.strokeStyle =
        styles.getPropertyValue("--pulse-visual-color").trim() ||
        "rgba(255, 255, 255, 0.9)"
      ctx.lineWidth = Math.max(1, 2.5 / viewScale)
      ctx.shadowColor = glowColor
      ctx.shadowBlur = 10 / viewScale
      ctx.beginPath()
      ctx.arc(node.x, node.y, r * 0.9, openingStartAngle, openingEndAngle)
      ctx.stroke()
      ctx.restore()
    }
  } else if (node.type === "probabilityGate") {
    ctx.beginPath()
    ctx.arc(node.x, node.y, r, 0, Math.PI * 2)
    ctx.fill()
    ctx.stroke()
    const fontSize = Math.max(8, (r * 0.8) / viewScale)
    ctx.font = `bold ${fontSize}px sans-serif`
    ctx.fillStyle = borderColor
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.fillText("%", node.x, node.y + fontSize * 0.1)
  } else if (node.type === "pitchShift") {
    ctx.beginPath()
    ctx.arc(node.x, node.y, r, 0, Math.PI * 2)
    ctx.stroke()
    ctx.fillStyle = fillColor + "90"
    ctx.fill()
    if (node.animationState < 0.5) {
      ctx.fillStyle = borderColor
      ctx.beginPath()
      const arrowSize = r * 0.5
      const arrowY = node.y - arrowSize * 0.3
      ctx.moveTo(node.x, arrowY - arrowSize / 2)
      ctx.lineTo(node.x - arrowSize / 2, arrowY + arrowSize / 2)
      ctx.lineTo(node.x + arrowSize / 2, arrowY + arrowSize / 2)
      ctx.closePath()
      ctx.fill()
    }
  } else if (node.type === "relay") {
    ctx.beginPath()
    ctx.arc(node.x, node.y, r * 0.6, 0, Math.PI * 2)
    ctx.fill()
    ctx.stroke()
  } else if (node.type === "reflector") {
    ctx.beginPath()
    ctx.arc(node.x, node.y, r, 0, Math.PI * 2)
    ctx.fill()
    ctx.stroke()
    const fontSize = Math.max(8, (r * 0.9) / viewScale)
    ctx.font = `${fontSize}px sans-serif`
    ctx.fillStyle = borderColor
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.fillText("⟲", node.x, node.y + fontSize * 0.1)
  } else if (node.type === "switch") {
    ctx.beginPath()
    ctx.moveTo(node.x - r * 0.8, node.y + r * 0.8)
    ctx.lineTo(node.x, node.y - r)
    ctx.lineTo(node.x + r * 0.8, node.y + r * 0.8)
    ctx.closePath()
    ctx.fill()
    ctx.stroke()
  } else if (node.type === "nebula") {
    const numRings = 5
    const baseRadius = NODE_RADIUS_BASE * node.size * 0.8
    const pulseFactor = 1 + Math.sin(node.pulsePhase) * 0.15
    for (let i = 0; i < numRings; i++) {
      const ringRadius = baseRadius * pulseFactor * (1 - i * 0.15)
      const alpha = 0.1 + (1 - i / numRings) * 0.4
      const lightness = scaleBase.l * (0.6 + (i / numRings) * 0.6)
      ctx.strokeStyle = hslToRgba(scaleBase.h, scaleBase.s, lightness, alpha)
      ctx.lineWidth = Math.max(0.5, (1 + (numRings - i) * 0.5) / viewScale)
      ctx.beginPath()
      ctx.arc(node.x, node.y, ringRadius, 0, Math.PI * 2)
      ctx.stroke()
    }
    if (needsRestore) {
      ctx.restore()
      needsRestore = false
    }
    ctx.save()
    ctx.translate(node.x, node.y)
    ctx.rotate(node.innerAngle)
    ctx.translate(-node.x, -node.y)
    const coreRadius = baseRadius * 0.4 * pulseFactor
    ctx.fillStyle = hslToRgba(scaleBase.h, scaleBase.s, scaleBase.l * 1.2, 0.8)
    ctx.beginPath()
    ctx.arc(node.x, node.y, coreRadius, 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()
  } else if (isDrumType(node.type)) {
    const icon = DRUM_ELEMENT_DEFAULTS[node.type]?.icon || "?"
    const fontSize = Math.max(8, (r * 0.9) / viewScale)
    ctx.font = `bold ${fontSize}px sans-serif`
    ctx.fillStyle = borderColor
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.beginPath()
    ctx.rect(node.x - r, node.y - r, r * 2, r * 2)
    ctx.fill()
    ctx.stroke()
    ctx.fillStyle = fillColor.replace(/[\d\.]+\)$/g, "1)")
    ctx.fillText(icon, node.x, node.y + fontSize * 0.1)
  } else if (node.isStartNode) {
    const points = node.starPoints || 6
    const outerR = currentRadius
    const innerR = outerR * 0.4
    drawStarShape(ctx, node.x, node.y, points, outerR, innerR)
    ctx.fill()
    ctx.stroke()
    if (node.type === "pulsar_triggerable") {
      const lockSize = outerR * 0.5
      ctx.fillStyle = isStartNodeDisabled
        ? disabledFillColorGeneral
        : borderColor
      ctx.strokeStyle = isStartNodeDisabled
        ? disabledBorderColorGeneral
        : fillColor
      ctx.lineWidth = baseLineWidth * 0.5
      ctx.beginPath()
      ctx.rect(
        node.x - lockSize * 0.3,
        node.y - lockSize * 0.25,
        lockSize * 0.6,
        lockSize * 0.5
      )
      ctx.moveTo(node.x - lockSize * 0.3, node.y - lockSize * 0.25)
      ctx.arc(node.x, node.y - lockSize * 0.25, lockSize * 0.4, Math.PI, 0)
      ctx.fill()
      ctx.stroke()
    }
  } else {
    ctx.beginPath()
    ctx.arc(node.x, node.y, currentRadius, 0, Math.PI * 2)
    ctx.fill()
    ctx.stroke()
  }
  if (isSelectedAndOutlineNeeded) {
    ctx.save()
    ctx.shadowBlur = 0
    ctx.strokeStyle = "rgba(255, 255, 0, 0.9)"
    ctx.lineWidth = Math.max(0.5, 1.5 / viewScale)
    ctx.beginPath()
    const outlineRadius =
      NODE_RADIUS_BASE *
        node.size *
        (node.type === "sound" &&
        node.audioParams.waveform &&
        node.audioParams.waveform.startsWith("sampler_")
          ? 1.2
          : 1.0) *
        bloomFactor +
      2 / viewScale
    ctx.arc(node.x, node.y, outlineRadius, 0, Math.PI * 2)
    ctx.stroke()
    ctx.restore()
  }
  if (needsRestore) {
    ctx.restore()
  }
  ctx.shadowBlur = 0
  if (isInfoTextVisible) {
    const fontSize = Math.max(8, 10 / viewScale)
    ctx.font = `bold ${fontSize}px sans-serif`
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    let labelText = ""
    let secondLineText = ""
    const baseRadiusForLabel = NODE_RADIUS_BASE * node.size
    let labelYOffset =
      baseRadiusForLabel *
        ((node.type === "sound" || node.type === "nebula") &&
        node.audioParams.waveform &&
        node.audioParams.waveform.startsWith("sampler_")
          ? 1.3
          : 1.1) +
      fontSize / 1.5 +
      2 / viewScale
    ctx.fillStyle = "rgba(255, 255, 255, 0.8)"
    if (node.type === "sound" || node.type === "nebula") {
      labelText = getNoteNameFromScaleIndex(
        currentScale,
        node.audioParams.scaleIndex
      )
    } else if (isPulsarType(node.type)) {
      let typeLabel =
        pulsarTypes.find((pt) => pt.type === node.type)?.label || "Pulsar"
      labelText = typeLabel
      if (!node.isEnabled) labelText += " (Off)"
      if (node.type === "pulsar_random_volume") {
        secondLineText = `Int: Random`
      } else {
        if (node.type === "pulsar_random_particles") {
          secondLineText = "Timing: Random"
        } else if (isGlobalSyncEnabled) {
          const subdiv = subdivisionOptions[node.syncSubdivisionIndex]
          secondLineText = `Sync: ${subdiv?.label ?? "?"}`
        } else {
          secondLineText = `Intv: ${(
            node.audioParams.triggerInterval || DEFAULT_TRIGGER_INTERVAL
          ).toFixed(1)}s`
        }
        if (node.type !== "pulsar_random_volume") {
          secondLineText += ` | Int: ${(
            node.audioParams.pulseIntensity ?? DEFAULT_PULSE_INTENSITY
          ).toFixed(1)}`
        }
      }
      if (secondLineText) {
        labelYOffset += fontSize * 0.5
      }
    } else if (isDrumType(node.type)) {
      labelText = DRUM_ELEMENT_DEFAULTS[node.type]?.label || "Drum"
      labelYOffset = fontSize * 0.1 + r * 1.1
    } else if (node.type === "gate") {
      labelText = GATE_MODES[node.gateModeIndex || 0]
    } else if (node.type === "probabilityGate") {
      labelText = `${(node.audioParams.probability * 100).toFixed(0)}%`
    } else if (node.type === "pitchShift") {
      const amount = PITCH_SHIFT_AMOUNTS[node.pitchShiftIndex || 0]
      labelText =
        (amount > 0 ? "+" : "") +
        amount +
        (node.pitchShiftAlternating ? " ⇄" : "")
      labelYOffset = fontSize * 0.1
    } else if (node.type === "relay") {
      labelText = "Relay"
    } else if (node.type === "reflector") {
      labelText = "Reflector"
    } else if (node.type === "switch") {
      labelText = "Switch"
    }
    if (labelText) {
      ctx.fillText(labelText, node.x, node.y + labelYOffset)
    }
    if (secondLineText) {
      ctx.fillText(
        secondLineText,
        node.x,
        node.y + labelYOffset + fontSize * 1.1
      )
    }
  }
  ctx.shadowBlur = 0
}

function drawTemporaryConnection() {
  if (isConnecting && connectingNode) {
    ctx.beginPath()
    ctx.moveTo(connectingNode.x, connectingNode.y)
    ctx.lineTo(mousePos.x, mousePos.y)
    ctx.strokeStyle =
      connectionTypeToAdd === "string_violin"
        ? getComputedStyle(document.documentElement)
            .getPropertyValue("--string-violin-connection-color")
            .trim() || "#ffccaa"
        : "rgba(255, 255, 255, 0.5)"
    ctx.lineWidth =
      connectionTypeToAdd === "string_violin" ? 2 / viewScale : 1 / viewScale
    ctx.setLineDash(
      connectionTypeToAdd === "string_violin"
        ? [5 / viewScale, 3 / viewScale]
        : [5 / viewScale, 5 / viewScale]
    )
    ctx.stroke()
    ctx.setLineDash([])
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
  const now = audioContext ? audioContext.currentTime : performance.now() / 1000
  const deltaTime = Math.max(0, Math.min(0.1, now - (previousFrameTime || now)))
  ctx.save()
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  ctx.translate(viewOffsetX, viewOffsetY)
  ctx.scale(viewScale, viewScale)
  drawBackground(now)
  drawGrid()
  updateFluctuatingNodesLFO()
  updateAndDrawParticles(deltaTime, now)
  connections.forEach(drawConnection)
  nodes.forEach((node) => drawNode(node))
  updateAndDrawPulses(now)
  if (currentTool === "connect" || currentTool === "connect_string") {
    drawTemporaryConnection()
  }
  drawSelectionRect()
  ctx.restore()
  previousFrameTime = now
  ctx.setLineDash([])
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

function handleMouseDown(event) {
  if (!isPlaying && event.target === canvas) {
    togglePlayPause()
    return
  }
  if (!isAudioReady) return
  // --- CORRECTIE: pianoRollPanel check verwijderd ---
  const targetIsPanelControl =
    hamburgerMenuPanel.contains(event.target) ||
    sideToolbar.contains(event.target) ||
    gridControlsDiv.contains(event.target) ||
    transportControlsDiv.contains(event.target) ||
    mixerPanel.contains(event.target);
  // --- Einde Correctie ---

  if (targetIsPanelControl) {
    return
  }

  updateMousePos(event)
  nodeClickedAtMouseDown = findNodeAt(mousePos.x, mousePos.y)
  connectionClickedAtMouseDown = !nodeClickedAtMouseDown
    ? findConnectionNear(mousePos.x, mousePos.y)
    : null
  let elementClickedAtMouseDown = null
  if (nodeClickedAtMouseDown)
    elementClickedAtMouseDown = { type: "node", id: nodeClickedAtMouseDown.id }
  else if (connectionClickedAtMouseDown)
    elementClickedAtMouseDown = {
      type: "connection",
      id: connectionClickedAtMouseDown.id
    }

  nodeWasSelectedAtMouseDown = nodeClickedAtMouseDown
    ? isElementSelected("node", nodeClickedAtMouseDown.id)
    : false // Keep track of node selection specifically for drag logic

  mouseDownPos = { ...mousePos }
  isDragging = false
  isConnecting = false
  isResizing = false
  isSelecting = false
  isPanning = false
  didDrag = false
  selectionRect.active = false

  if (event.button === 1 || (isSpacebarDown && event.button === 0)) {
    isPanning = true
    panStart = { ...screenMousePos }
    canvas.style.cursor = "grabbing"
    nodeClickedAtMouseDown = null
    connectionClickedAtMouseDown = null
    elementClickedAtMouseDown = null
    return
  }

  if (elementClickedAtMouseDown) {
    const element = elementClickedAtMouseDown
    const node = element.type === "node" ? nodeClickedAtMouseDown : null
    const connection =
      element.type === "connection" ? connectionClickedAtMouseDown : null

    if (event.shiftKey && currentTool === "edit" && node) {
      isResizing = true
      resizeStartSize = node.size
      resizeStartY = screenMousePos.y
      canvas.style.cursor = "ns-resize"
    } else if (event.shiftKey && currentTool !== "edit") {
      if (isElementSelected(element.type, element.id)) {
        selectedElements = new Set(
          [...selectedElements].filter(
            (el) => !(el.type === element.type && el.id === element.id)
          )
        )
      } else {
        selectedElements.add(element)
      }
      if (currentTool === "edit") updateConstellationGroup()
      updateGroupControlsUI()
      populateEditPanel()
      nodeClickedAtMouseDown = null // Prevent triggering single click actions
      connectionClickedAtMouseDown = null
    } else if (
      event.altKey &&
      currentTool === "edit" &&
      node &&
      (node.type === "sound" ||
        node.type === "nebula" ||
        node.type === "pitchShift")
    ) {
      /* Handled in MouseUp */
    } else if (
      event.altKey &&
      currentTool === "edit" &&
      connection &&
      connection.type === "string_violin"
    ) {
      /* Handled in MouseUp */
    } else {
      if (currentTool === "connect" || currentTool === "connect_string") {
        if (node && !["nebula"].includes(node.type)) {
          isConnecting = true
          connectingNode = node
          connectionTypeToAdd =
            currentTool === "connect_string" ? "string_violin" : "standard"
          canvas.style.cursor = "grabbing"
        }
      } else if (currentTool === "delete") {
        if (node) removeNode(node)
        else if (connection) removeConnection(connection)
        nodeClickedAtMouseDown = null
        connectionClickedAtMouseDown = null
      } else if (currentTool === "edit") {
        let selectionChanged = false
        if (!isElementSelected(element.type, element.id)) {
          if (!event.shiftKey) selectedElements.clear() // Clear only if shift is not pressed
          selectedElements.add(element)
          selectionChanged = true
        } else if (event.shiftKey) {
          // If already selected and shift is pressed, deselect
          selectedElements = new Set(
            [...selectedElements].filter(
              (el) => !(el.type === element.type && el.id === element.id)
            )
          )
          selectionChanged = true
        }

        if (node) {
          // Only allow dragging nodes for now
          isDragging = true
          dragStartPos = { ...mousePos }
          nodeDragOffsets.clear()
          selectedElements.forEach((el) => {
            if (el.type === "node") {
              const n = findNodeById(el.id)
              if (n)
                nodeDragOffsets.set(el.id, {
                  x: n.x - mousePos.x,
                  y: n.y - mousePos.y
                })
            }
          })
          canvas.style.cursor = "move"
        }

        if (selectionChanged) {
          updateConstellationGroup()
          populateEditPanel()
        }
      }
    }
  } else {
    // Clicked on empty space
    if (currentTool === "edit") {
      isSelecting = true
      selectionRect = {
        startX: mousePos.x,
        startY: mousePos.y,
        endX: mousePos.x,
        endY: mousePos.y,
        active: false
      }
      if (!event.shiftKey) {
        if (selectedElements.size > 0) {
          selectedElements.clear()
          updateConstellationGroup()
          populateEditPanel()
        }
      }
    } else if (currentTool === "add" && nodeTypeToAdd !== null) {
      const requiresSubmenu = ["sound", "nebula", null].includes(nodeTypeToAdd)
      const specificTypeSelected = waveformToAdd !== null
      const directAddTypes = [
        "gate",
        "probabilityGate",
        "pitchShift",
        "relay",
        "reflector",
        "switch"
      ]
      const canAddNode =
        directAddTypes.includes(nodeTypeToAdd) ||
        (requiresSubmenu && specificTypeSelected) ||
        (nodeTypeToAdd && !requiresSubmenu)

      if (canAddNode) {
        const newNode = addNode(
          mousePos.x,
          mousePos.y,
          nodeTypeToAdd,
          waveformToAdd
        )
        if (newNode) {
          if (directAddTypes.includes(nodeTypeToAdd)) {
            setActiveTool("edit")
          }
        }
      }
    } else if (!["connect", "connect_string", "delete"].includes(currentTool)) {
      if (selectedElements.size > 0 && !event.shiftKey) {
        selectedElements.clear()
        updateGroupControlsUI()
        populateEditPanel()
      }
    }
  }
  hideBottomPanels()
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
function handleMouseUp(event) {
  if (!isAudioReady) return
  // --- CORRECTIE: pianoRollPanel check verwijderd ---
  const targetIsPanelControl =
    hamburgerMenuPanel.contains(event.target) ||
    sideToolbar.contains(event.target) ||
    gridControlsDiv.contains(event.target) ||
    transportControlsDiv.contains(event.target) ||
    mixerPanel.contains(event.target);
  // --- Einde Correctie ---

  if (targetIsPanelControl) {
    isDragging = false
    isConnecting = false
    isResizing = false
    isSelecting = false
    isPanning = false
    selectionRect.active = false
    connectingNode = null
    nodeClickedAtMouseDown = null
    connectionClickedAtMouseDown = null
    canvas.style.cursor = "crosshair"
    return
  }
  updateMousePos(event)
  const nodeUnderCursor = findNodeAt(mousePos.x, mousePos.y)
  const connectionUnderCursor = !nodeUnderCursor
    ? findConnectionNear(mousePos.x, mousePos.y)
    : null
  let elementUnderCursor = null
  if (nodeUnderCursor)
    elementUnderCursor = { type: "node", id: nodeUnderCursor.id }
  else if (connectionUnderCursor)
    elementUnderCursor = { type: "connection", id: connectionUnderCursor.id }
  const wasResizing = isResizing
  const wasConnecting = isConnecting
  const wasDragging = isDragging
  const wasSelecting = isSelecting
  const wasPanning = isPanning
  const nodeClickedStart = nodeClickedAtMouseDown
  const connectionClickedStart = connectionClickedAtMouseDown
  const elementClickedStart = nodeClickedStart
    ? { type: "node", id: nodeClickedStart.id }
    : connectionClickedStart
    ? { type: "connection", id: connectionClickedStart.id }
    : null
  const wasSelectedAtStart = nodeWasSelectedAtMouseDown
  let stateWasChanged = false
  isResizing = false
  isConnecting = false
  isDragging = false
  isSelecting = false
  isPanning = false
  selectionRect.active = false
  canvas.style.cursor = "crosshair"
  if (wasConnecting) {
    if (
      connectingNode &&
      nodeUnderCursor &&
      nodeUnderCursor !== connectingNode &&
      !["nebula"].includes(nodeUnderCursor.type)
    ) {
      connectNodes(connectingNode, nodeUnderCursor, connectionTypeToAdd)
      stateWasChanged = true
    }
    connectingNode = null
  } else if (wasPanning) {
    // No action needed on mouse up after panning
  } else if (wasResizing && nodeClickedStart) {
    stateWasChanged = true
    populateEditPanel()
  } else if (wasSelecting && didDrag) {
    const x1 = Math.min(selectionRect.startX, selectionRect.endX)
    const y1 = Math.min(selectionRect.startY, selectionRect.endY)
    const x2 = Math.max(selectionRect.startX, selectionRect.endX)
    const y2 = Math.max(selectionRect.startY, selectionRect.endY)
    let newlySelected = false
    nodes.forEach((n) => {
      if (n.x >= x1 && n.x <= x2 && n.y >= y1 && n.y <= y2) {
        const el = { type: "node", id: n.id }
        if (!isElementSelected(el.type, el.id)) {
          selectedElements.add(el)
          newlySelected = true
        }
      }
    })
    connections.forEach((c) => {
      const nA = findNodeById(c.nodeAId)
      const nB = findNodeById(c.nodeBId)
      if (nA && nB) {
        const midX = (nA.x + nB.x) / 2 + c.controlPointOffsetX
        const midY = (nA.y + nB.y) / 2 + c.controlPointOffsetY
        const curveMidX = lerp(
          lerp(nA.x, midX, 0.5),
          lerp(midX, nB.x, 0.5),
          0.5
        )
        const curveMidY = lerp(
          lerp(nA.y, midY, 0.5),
          lerp(midY, nB.y, 0.5),
          0.5
        )
        if (
          curveMidX >= x1 &&
          curveMidX <= x2 &&
          curveMidY >= y1 &&
          curveMidY <= y2
        ) {
          const el = { type: "connection", id: c.id }
          if (!isElementSelected(el.type, el.id)) {
            selectedElements.add(el)
            newlySelected = true
          }
        }
      }
    })
    if (newlySelected) {
      if (currentTool === "edit") updateConstellationGroup()
      updateGroupControlsUI()
      populateEditPanel()
    }
  } else if (currentTool === "edit") {
    if (
      elementClickedStart &&
      elementUnderCursor &&
      elementClickedStart.type === elementUnderCursor.type &&
      elementClickedStart.id === elementUnderCursor.id &&
      !didDrag &&
      !event.shiftKey
    ) {
      // Single click on an element without dragging or shift key
      const targetElement = elementClickedStart
      if (event.altKey) {
        // Alt-click actions
        if (
          targetElement.type === "node" &&
          (nodeClickedStart.type === "sound" ||
            nodeClickedStart.type === "nebula" ||
            nodeClickedStart.type === "pitchShift")
        ) {
          handlePitchCycleDown(targetElement)
          stateWasChanged = true
        } else if (
          targetElement.type === "connection" &&
          connectionClickedStart.type === "string_violin"
        ) {
          handlePitchCycleDown(targetElement)
          stateWasChanged = true
        }
      } else if (!event.altKey) {
        // Regular click actions
        if (targetElement.type === "node") {
          if (nodeClickedStart.isStartNode) {
            if (
              nodeClickedStart.type !== "pulsar_triggerable" &&
              nodeClickedStart.type !== "pulsar_random_particles"
            ) {
              if (isGlobalSyncEnabled) {
                handleSubdivisionCycle(nodeClickedStart)
              } else {
                handleTapTempo(nodeClickedStart)
              }
              stateWasChanged = true
            }
          } else if (
            nodeClickedStart.type === "sound" ||
            nodeClickedStart.type === "nebula"
          ) {
            handlePitchCycle(targetElement)
            stateWasChanged = true
          } else if (nodeClickedStart.type === "gate") {
            handleGateCycle(nodeClickedStart)
            stateWasChanged = true
          } else if (nodeClickedStart.type === "probabilityGate") {
            handleProbabilityCycle(nodeClickedStart)
            stateWasChanged = true
          } else if (nodeClickedStart.type === "pitchShift") {
            handlePitchShiftCycle(nodeClickedStart)
            stateWasChanged = true
          } else if (isDrumType(nodeClickedStart.type)) {
            triggerNodeEffect(nodeClickedStart)
            stateWasChanged = false // Triggering effect doesn't change state for undo
          }
        } else if (
          targetElement.type === "connection" &&
          connectionClickedStart.type === "string_violin"
        ) {
          handlePitchCycle(targetElement)
          stateWasChanged = true
        }
      }
    } else if (wasDragging && nodeClickedStart) {
      // Finished dragging selected nodes
      stateWasChanged = true
    }
    // If it wasn't a single click on the same element,
    // the selection logic was handled in mouseDown/mouseMove (shift/drag select)
    // No state change needed here solely for selection in this case.
  } else if (currentTool === "delete") {
    if (elementClickedStart && !didDrag) {
      // Clicked on an element to delete
      if (elementClickedStart.type === "node") removeNode(nodeClickedStart)
      else if (elementClickedStart.type === "connection")
        removeConnection(connectionClickedStart)
      stateWasChanged = true
    } else if (!elementClickedStart && selectedElements.size > 0 && !didDrag) {
      // Clicked on empty space while elements were selected in delete mode
      // (This might be unexpected behavior, maybe clear selection instead?)
      const firstElement = selectedElements.values().next().value
      if (firstElement.type === "node")
        removeNode(findNodeById(firstElement.id))
      else if (firstElement.type === "connection")
        removeConnection(findConnectionById(firstElement.id))
      selectedElements.clear()
      updateGroupControlsUI()
      populateEditPanel()
      stateWasChanged = true
    }
  }

  // Save state if any meaningful changes occurred
  if (stateWasChanged && !isPerformingUndoRedo) {
    saveState()
  }

  // Reset states
  didDrag = false
  nodeClickedAtMouseDown = null
  connectionClickedAtMouseDown = null
  nodeWasSelectedAtStart = false // Reset this tracking variable
  nodeDragOffsets.clear()
  panStart = { x: 0, y: 0 } // Reset pan start position
  updateGroupControlsUI() // Update UI based on final selection state
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
  if (isPerformingUndoRedo) return
  const currentState = {
    nodes: nodes,
    connections: connections,
    selectedElements: Array.from(selectedElements),
    fluctuatingGroupNodeIDs: fluctuatingGroupNodeIDs,
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
  const copiedState = deepCopyState(currentState)
  if (!copiedState) return
  if (historyIndex < historyStack.length - 1) {
    historyStack = historyStack.slice(0, historyIndex + 1)
  }
  historyStack.push(copiedState)
  if (historyStack.length > MAX_HISTORY_SIZE) {
    historyStack.shift()
  }
  historyIndex = historyStack.length - 1
}
function loadState(stateToLoad) {
  if (!stateToLoad || !stateToLoad.nodes || !stateToLoad.connections) {
    return
  }
  isPerformingUndoRedo = true
  nodes.forEach((node) => stopNodeAudio(node))
  connections.forEach((conn) => stopConnectionAudio(conn))
  nodes = stateToLoad.nodes
  connections = stateToLoad.connections
  selectedElements = stateToLoad.selectedElements
    ? new Set(stateToLoad.selectedElements)
    : new Set()
  fluctuatingGroupNodeIDs = stateToLoad.fluctuatingGroupNodeIDs
    ? new Set(stateToLoad.fluctuatingGroupNodeIDs)
    : new Set()
  nodeIdCounter = stateToLoad.nodeIdCounter
  connectionIdCounter = stateToLoad.connectionIdCounter
  isGlobalSyncEnabled = stateToLoad.isGlobalSyncEnabled ?? false
  globalBPM = stateToLoad.globalBPM ?? 120
  currentScaleKey = stateToLoad.currentScaleKey ?? "major_pentatonic"
  currentRootNote = stateToLoad.currentRootNote ?? 0
  globalTransposeOffset = stateToLoad.globalTransposeOffset ?? 0
  if (masterGain) masterGain.gain.value = stateToLoad.masterVolume ?? 0.8
  if (masterDelaySendGain)
    masterDelaySendGain.gain.value = stateToLoad.delaySend ?? 0.3
  if (delayNode) delayNode.delayTime.value = stateToLoad.delayTime ?? 0.25
  if (delayFeedbackGain)
    delayFeedbackGain.gain.value = stateToLoad.delayFeedback ?? 0.4
  viewOffsetX = stateToLoad.viewOffsetX ?? 0
  viewOffsetY = stateToLoad.viewOffsetY ?? 0
  viewScale = stateToLoad.viewScale ?? 1.0
  nodes.forEach((node) => {
    node.audioNodes = null
    node.connections = node.connections ? new Set(node.connections) : new Set()
    node.isSelected = isElementSelected("node", node.id)
    node.isStartNode = isPulsarType(node.type)
    node.isEnabled =
      node.isEnabled !== undefined
        ? node.isEnabled
        : node.type !== "pulsar_triggerable"
    node.primaryInputConnectionId =
      node.primaryInputConnectionId ??
      (node.type === "switch" ? null : undefined)
    if (!node.audioParams) node.audioParams = {}
    node.audioParams.reverbSend =
      node.audioParams.reverbSend ?? DEFAULT_REVERB_SEND
    node.audioParams.delaySend =
      node.audioParams.delaySend ?? DEFAULT_DELAY_SEND
    node.audioParams.probability =
      node.audioParams.probability ?? DEFAULT_PROBABILITY
    node.audioParams.pulseIntensity =
      node.audioParams.pulseIntensity ?? DEFAULT_PULSE_INTENSITY
    node.audioParams.triggerInterval =
      node.audioParams.triggerInterval ?? DEFAULT_TRIGGER_INTERVAL
    node.syncSubdivisionIndex =
      node.syncSubdivisionIndex ?? DEFAULT_SUBDIVISION_INDEX
    node.gateModeIndex = node.gateModeIndex ?? DEFAULT_GATE_MODE_INDEX
    node.pitchShiftIndex = node.pitchShiftIndex ?? DEFAULT_PITCH_SHIFT_INDEX
    if (isDrumType(node.type)) {
      const defaults = DRUM_ELEMENT_DEFAULTS[node.type]
      node.audioParams.baseFreq =
        node.audioParams.baseFreq ?? defaults?.baseFreq
      node.audioParams.decay = node.audioParams.decay ?? defaults?.decay
      node.audioParams.volume = node.audioParams.volume ?? defaults?.volume
      if (node.type === "drum_snare" || node.type === "drum_clap")
        node.audioParams.noiseDecay =
          node.audioParams.noiseDecay ?? defaults?.noiseDecay
    }
    if (["sound", "nebula"].includes(node.type)) {
      node.audioParams.scaleIndex = Math.max(
        MIN_SCALE_INDEX,
        Math.min(MAX_SCALE_INDEX, node.audioParams.scaleIndex ?? 0)
      )
      node.audioParams.pitch = getFrequency(
        scales[currentScaleKey],
        node.audioParams.scaleIndex
      )
      if (isNaN(node.audioParams.pitch)) {
        node.audioParams.scaleIndex = 0
        node.audioParams.pitch = getFrequency(scales[currentScaleKey], 0)
      }
    }
    node.audioNodes = createAudioNodesForNode(node)
    if (node.audioNodes) {
      updateNodeAudioParams(node)
    }
  })
  connections.forEach((conn) => {
    conn.isSelected = isElementSelected("connection", conn.id)
    if (conn.type === "string_violin") {
      if (!conn.audioParams) conn.audioParams = {}
      const defaults = STRING_VIOLIN_DEFAULTS
      Object.keys(defaults).forEach((key) => {
        conn.audioParams[key] = conn.audioParams[key] ?? defaults[key]
      })
      conn.audioParams.scaleIndex = Math.max(
        MIN_SCALE_INDEX,
        Math.min(MAX_SCALE_INDEX, conn.audioParams.scaleIndex ?? 0)
      )
      conn.audioParams.pitch = getFrequency(
        scales[currentScaleKey],
        conn.audioParams.scaleIndex
      )
      if (isNaN(conn.audioParams.pitch)) {
        conn.audioParams.scaleIndex = 0
        conn.audioParams.pitch = getFrequency(scales[currentScaleKey], 0)
      }
      conn.audioNodes = createAudioNodesForConnection(conn)
      if (conn.audioNodes) {
        updateConnectionAudioParams(conn)
      }
    } else {
      conn.audioNodes = null
    }
  })
  updateSyncUI()
  updateScaleAndTransposeUI()
  updateMixerUI()
  updateConstellationGroup()
  populateEditPanel()
  isPerformingUndoRedo = false
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
function createNoteSelector(
  parentElement = sideToolbarContent,
  targetElementsData = []
) {
  removeNoteSelector()
  const container = document.createElement("div")
  container.classList.add("panel-section")
  const label = document.createElement("label")
  label.textContent = "Note:"
  label.htmlFor = "noteSelect"
  container.appendChild(label)
  const select = document.createElement("select")
  select.id = "noteSelect"

  let initialValue = -2 // Use a value outside the normal range to detect lack of consensus
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

  if (hasMultipleValues || !firstValueFound) {
    const multiOpt = document.createElement("option")
    multiOpt.value = "-2" // Special value for multiple/unset
    multiOpt.textContent = "---"
    multiOpt.disabled = true
    multiOpt.selected = true
    select.appendChild(multiOpt)
    initialValue = -2 // Ensure this is selected
  } else if (parentElement !== sideToolbarContent) {
    // Only use Random default in side toolbar
    select.value = initialValue
  }

  const randomOpt = document.createElement("option")
  randomOpt.value = -1
  randomOpt.textContent = "Random"
  select.appendChild(randomOpt)
  const numNotes = currentScale.notes.length
  const octavesToShow = 3
  for (
    let i = MIN_SCALE_INDEX;
    i < MAX_SCALE_INDEX && i < numNotes * octavesToShow;
    i++
  ) {
    const noteName = getNoteNameFromScaleIndex(currentScale, i)
    if (noteName) {
      const opt = document.createElement("option")
      opt.value = i
      opt.textContent = noteName
      if (i === initialValue && !hasMultipleValues) {
        opt.selected = true
      }
      select.appendChild(opt)
    }
  }

  if (initialValue === -1 && !hasMultipleValues && firstValueFound) {
    randomOpt.selected = true
  } else if (parentElement === sideToolbarContent && initialValue === -2) {
    // Default to random in side panel if unset
    randomOpt.selected = true
    noteIndexToAdd = -1
  }

  select.addEventListener("change", (e) => {
    const newIndex = parseInt(e.target.value, 10)
    if (newIndex === -2) return // Ignore the '---' selection

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
function setActiveTool(toolName) {
  if (currentTool === "add" && toolName !== "add") {
    nodeTypeToAdd = null
    waveformToAdd = null
    noteIndexToAdd = -1
    resetSideToolbars()
    const addButtons = toolbar.querySelectorAll("#toolbar-add-elements button")
    addButtons.forEach((btn) => btn.classList.remove("active"))
  }
  currentTool = toolName
  connectingNode = null
  isConnecting = false
  connectionTypeToAdd = "standard"
  editBtn.classList.toggle("active", toolName === "edit")
  connectBtn.classList.toggle("active", toolName === "connect")
  connectStringBtn.classList.toggle("active", toolName === "connect_string")
  deleteBtn.classList.toggle("active", toolName === "delete")
  if (toolName !== "add") {
    const addButtons = toolbar.querySelectorAll("#toolbar-add-elements button")
    addButtons.forEach((btn) => btn.classList.remove("active"))
    resetSideToolbars()
  } else {
    hamburgerMenuPanel.classList.add("hidden")
    hamburgerBtn.classList.remove("active")
    editPanelContent.innerHTML = ""
  }
  isResizing = false
  isSelecting = false
  selectionRect.active = false
  isPanning = false
  updateGroupControlsUI()
  updateRestartPulsarsButtonVisibility()
  hideBottomPanels()
  if (toolName === "edit") populateEditPanel()
}

function populateSideToolbar(contentType, title) {
  sideToolbarContent.innerHTML = ""
  noteSelectElement = null
  noteSelectContainer = null
  const groupDiv = document.createElement("div")
  groupDiv.classList.add("type-group")
  if (contentType === "waveforms") {
    const isNebula = nodeTypeToAdd === "nebula"
    sideToolbarTitle.textContent =
      title || (isNebula ? "Nebula Sounds" : "Sounds")
    waveformTypes.forEach((wf) => {
      const button = document.createElement("button")
      button.classList.add("waveform-button")
      button.dataset.waveform = wf.type
      button.innerHTML = `<span class="type-icon">${wf.icon}</span>${wf.label}`
      button.disabled =
        (isNebula && wf.type.startsWith("sampler_")) || wf.loadFailed
      if (isNebula && wf.type.startsWith("sampler_")) {
        button.title = "Samplers not available for Nebulas"
      } else if (wf.loadFailed) {
        button.title = `${wf.label} sample failed to load`
        button.classList.add("disabled")
      }
      if (waveformToAdd === wf.type) button.classList.add("selected")
      button.addEventListener("click", () =>
        handleWaveformSelect(button, wf.type)
      )
      groupDiv.appendChild(button)
    })
    sideToolbarContent.appendChild(groupDiv)
    createNoteSelector(sideToolbarContent)
  } else if (contentType === "pulsarTypes") {
    sideToolbarTitle.textContent = title || "Pulsars"
    pulsarTypes.forEach((pt) => {
      const button = document.createElement("button")
      button.classList.add("type-button")
      button.dataset.type = pt.type
      button.innerHTML = `<span class="type-icon">${pt.icon}</span>${pt.label}`
      if (nodeTypeToAdd === pt.type) button.classList.add("selected")
      button.addEventListener("click", () =>
        handleElementTypeSelect(button, pt.type)
      )
      groupDiv.appendChild(button)
    })
    sideToolbarContent.appendChild(groupDiv)
  } else if (contentType === "drumElements") {
    sideToolbarTitle.textContent = title || "Drum Elements"
    drumElementTypes.forEach((dt) => {
      const button = document.createElement("button")
      button.classList.add("drum-element-button")
      button.dataset.type = dt.type
      button.innerHTML = `<span class="type-icon">${dt.icon}</span>${dt.label}`
      if (nodeTypeToAdd === dt.type) button.classList.add("selected")
      button.addEventListener("click", () =>
        handleElementTypeSelect(button, dt.type)
      )
      groupDiv.appendChild(button)
    })
    sideToolbarContent.appendChild(groupDiv)
  }
  sideToolbar.classList.remove("hidden")
  hamburgerMenuPanel.classList.add("hidden")
  hamburgerBtn.classList.remove("active")
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
  if (!noteSelectContainer) createNoteSelector(sideToolbarContent)
}

function updateScaleAndTransposeUI() {
  if (scaleSelectTransport) scaleSelectTransport.value = currentScaleKey;
 }

/**
 * Wijzigt de globale toonladder en update alle afhankelijke elementen.
 * @param {string} scaleKey - De key van de nieuwe toonladder (bijv. 'major_pentatonic').
 * @param {boolean} [skipNodeUpdate=false] - Indien true, worden de pitches van bestaande nodes/connecties niet bijgewerkt (bv. bij laden state).
 */
function changeScale(scaleKey, skipNodeUpdate = false) {
  // 1. Valideer of de toonladder bestaat
  if (!scales[scaleKey]) {
    console.warn(`Ongeldige toonladder key: ${scaleKey}`)
    return
  }

  // 2. Update globale variabelen voor toonladder
  currentScaleKey = scaleKey
  currentScale = scales[scaleKey]

  // 3. Update het CSS thema op de body
  document.body.className = currentScale.theme // Behoud het wisselen van thema

  // 4. Update de waarde van de dropdown in de transportbalk
  if (scaleSelectTransport) {
    // Check of het element bestaat
    scaleSelectTransport.value = scaleKey
  } else {
    // Dit zou niet moeten gebeuren als de HTML correct is
    console.warn(
      "Element #scaleSelectTransport niet gevonden tijdens changeScale"
    )
  }

  // 5. Update de pitch van nodes en connecties (tenzij overgeslagen)
  if (!skipNodeUpdate) {
    nodes.forEach((node) => {
      // Alleen nodes die een toonhoogte hebben gebaseerd op de toonladder
      if (node.type === "sound" || node.type === "nebula") {
        // Zorg dat scaleIndex geldig is (extra check)
        node.audioParams.scaleIndex = Math.max(
          MIN_SCALE_INDEX,
          Math.min(MAX_SCALE_INDEX, node.audioParams.scaleIndex ?? 0)
        )
        // Herbereken de pitch met de NIEUWE currentScale
        node.audioParams.pitch = getFrequency(
          currentScale,
          node.audioParams.scaleIndex
        )
        // Fallback voor het geval de berekening NaN oplevert
        if (isNaN(node.audioParams.pitch)) {
          console.warn(`Pitch NaN voor node ${node.id}, index gereset.`)
          node.audioParams.scaleIndex = 0
          node.audioParams.pitch = getFrequency(currentScale, 0)
        }
        updateNodeAudioParams(node) // Pas de wijziging toe op de Web Audio API node
      }
      // Andere node types (pulsar, drum, utility) worden hier niet beïnvloed
    })

    connections.forEach((conn) => {
      // Alleen connecties die een toonhoogte hebben
      if (conn.type === "string_violin") {
        conn.audioParams.scaleIndex = Math.max(
          MIN_SCALE_INDEX,
          Math.min(MAX_SCALE_INDEX, conn.audioParams.scaleIndex ?? 0)
        )
        conn.audioParams.pitch = getFrequency(
          currentScale,
          conn.audioParams.scaleIndex
        )
        // Fallback
        if (isNaN(conn.audioParams.pitch)) {
          console.warn(`Pitch NaN voor connectie ${conn.id}, index gereset.`)
          conn.audioParams.scaleIndex = 0
          conn.audioParams.pitch = getFrequency(currentScale, 0)
        }
        updateConnectionAudioParams(conn) // Pas wijziging toe
      }
    })
  }

  // 6. Herteken de piano roll om de highlights van de nieuwe toonladder te tonen
  drawPianoRoll()

  // 7. Update het edit panel (rechter hamburger menu) als het open is,
  //    omdat de getoonde nootnamen/indices kunnen veranderen.
  populateEditPanel() // Deze functie moet controleren of het panel zichtbaar is

  // 8. Sla de staat op als de nodes daadwerkelijk zijn bijgewerkt
  if (!skipNodeUpdate) {
    saveState()
  }
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
  if (masterGain) masterVolumeSlider.value = masterGain.gain.value
  masterVolumeValue.textContent = parseFloat(masterVolumeSlider.value).toFixed(
    2
  )
  if (masterDelaySendGain)
    delaySendSlider.value = masterDelaySendGain.gain.value
  delaySendValue.textContent = parseFloat(delaySendSlider.value).toFixed(2)
  if (delayNode) delayTimeSlider.value = delayNode.delayTime.value
  delayTimeValue.textContent =
    parseFloat(delayTimeSlider.value).toFixed(2) + "s"
  if (delayFeedbackGain)
    delayFeedbackSlider.value = delayFeedbackGain.gain.value
  delayFeedbackValue.textContent = parseFloat(
    delayFeedbackSlider.value
  ).toFixed(2)
}
function hideBottomPanels() {
  mixerPanel.classList.add("hidden")
  mixerBtn.classList.remove("active")
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
scaleSelectTransport.addEventListener("change", (e) =>
  changeScale(e.target.value)
)

groupVolumeSlider.addEventListener("input", (e) => {
  const newVol = parseFloat(e.target.value)
  if (groupVolumeGain) {
    groupVolumeGain.gain.setTargetAtTime(newVol, audioContext.currentTime, 0.01)
  }
})
groupVolumeSlider.addEventListener("change", saveState)
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

function setupAddTool(
  buttonElement,
  type,
  requiresSubmenu = false,
  submenuType = null,
  submenuTitle = ""
) {
  setActiveTool("add")
  const addButtons = toolbar.querySelectorAll("#toolbar-add-elements button")
  addButtons.forEach((btn) => {
    if (btn !== buttonElement) btn.classList.remove("active")
  })
  if (buttonElement) buttonElement.classList.add("active")
  nodeTypeToAdd = type
  waveformToAdd = null
  noteIndexToAdd = -1
  if (requiresSubmenu && submenuType) {
    populateSideToolbar(submenuType, submenuTitle)
  } else {
    resetSideToolbars()
    sideToolbar.classList.add("hidden")
    waveformToAdd = type
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
  const isOpen = !mixerPanel.classList.contains("hidden")
  resetSideToolbars()
  hideBottomPanels()
  if (!isOpen) {
    mixerPanel.classList.remove("hidden")
    mixerBtn.classList.add("active")
    updateMixerUI()
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
  )
  const bottomPanelOpen =
    !mixerPanel.classList.contains("hidden") ||
    !pianoRollPanel.classList.contains("hidden")
  if (targetIsInput && bottomPanelOpen) return
  if (targetIsInput && !bottomPanelOpen && e.key !== "Escape") return
  if (e.code === "Space" && !isSpacebarDown) {
    isSpacebarDown = true
    e.preventDefault()
  }
  const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0
  const undoKeyPressed =
    (isMac ? e.metaKey : e.ctrlKey) &&
    e.key.toLowerCase() === "z" &&
    !e.shiftKey
  const redoKeyPressed =
    (isMac ? e.metaKey : e.ctrlKey) &&
    (e.key.toLowerCase() === "y" || (e.key.toLowerCase() === "z" && e.shiftKey))
  let panX = 0
  let panY = 0
  switch (e.key) {
    case "ArrowUp":
      panY = PAN_SPEED
      break
    case "ArrowDown":
      panY = -PAN_SPEED
      break
    case "ArrowLeft":
      panX = PAN_SPEED
      break
    case "ArrowRight":
      panX = -PAN_SPEED
      break
  }
  if (panX !== 0 || panY !== 0) {
    viewOffsetX += panX
    viewOffsetY += panY
    e.preventDefault()
  } else if (undoKeyPressed) {
    e.preventDefault()
    undo()
  } else if (redoKeyPressed) {
    e.preventDefault()
    redo()
  } else if (
    e.key.toLowerCase() === "y" &&
    !isMac &&
    !e.ctrlKey &&
    !e.metaKey
  ) {
    globalSyncToggleBtn.click()
    e.preventDefault()
  } else if (e.key.toLowerCase() === "g") {
    gridToggleBtn.click()
    e.preventDefault()
  } else if (
    isGridVisible &&
    e.key.toLowerCase() === "x" &&
    !e.ctrlKey &&
    !e.metaKey &&
    !e.altKey
  ) {
    gridTypeBtn.click()
    e.preventDefault()
  } else if (
    isGridVisible &&
    e.key.toLowerCase() === "n" &&
    !e.ctrlKey &&
    !e.metaKey &&
    !e.altKey
  ) {
    gridSnapBtn.click()
    e.preventDefault()
  } else if (e.key.toLowerCase() === "i") {
    toggleInfoTextBtn.click()
    e.preventDefault()
  } else if (
    (e.key === "Delete" || e.key === "Backspace") &&
    selectedElements.size > 0 &&
    currentTool === "edit"
  ) {
    const elementsToRemove = [...selectedElements]
    selectedElements.clear()
    elementsToRemove.forEach((el) => {
      if (el.type === "node") removeNode(findNodeById(el.id))
      else if (el.type === "connection")
        removeConnection(findConnectionById(el.id))
    })
    populateEditPanel()
  } else if (e.key.toLowerCase() === "e") {
    setActiveTool("edit")
    e.preventDefault()
  } else if (e.key.toLowerCase() === "c") {
    setActiveTool("connect")
    e.preventDefault()
  } else if (e.key.toLowerCase() === "v" && !targetIsInput) {
    setActiveTool("connect_string")
    e.preventDefault()
  } else if (e.key.toLowerCase() === "r" && !targetIsInput) {
    addRelayBtn.click()
    e.preventDefault()
  } else if (e.key.toLowerCase() === "d" && !targetIsInput) {
    addDrumElementBtn.click()
    e.preventDefault()
  } else if (e.key.toLowerCase() === "s" && !targetIsInput) {
    addSoundStarBtn.click()
    e.preventDefault()
  } else if (e.key.toLowerCase() === "w") {
    addNebulaBtn.click()
    e.preventDefault()
  } else if (e.key.toLowerCase() === "p") {
    addPulsarBtn.click()
    e.preventDefault()
  } else if (e.key.toLowerCase() === "m") {
    hamburgerBtn.click()
    e.preventDefault()
  } else if (e.key === "Escape") {
    selectedElements.clear()
    populateEditPanel()
    setActiveTool("edit")
    resetSideToolbars()
    hideBottomPanels()
  } else if (e.altKey && currentTool === "edit") {
    e.preventDefault()
  }
})
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

function animationLoop() {
  animationFrameId = requestAnimationFrame(animationLoop)
  if (!isAudioReady || !isPlaying) return
  const now = audioContext.currentTime
  const deltaTime = Math.max(0, Math.min(0.1, now - (previousFrameTime || now)))
  const secondsPerBeat = 60.0 / globalBPM
  if (isGlobalSyncEnabled && beatIndicatorElement) {
    if (now >= lastBeatTime + secondsPerBeat) {
      beatIndicatorElement.classList.add("active")
      setTimeout(() => beatIndicatorElement.classList.remove("active"), 50)
      lastBeatTime = Math.floor(now / secondsPerBeat) * secondsPerBeat
    }
  } else if (
    beatIndicatorElement &&
    beatIndicatorElement.classList.contains("active")
  ) {
    beatIndicatorElement.classList.remove("active")
    lastBeatTime = 0
  }
  nodes.forEach((node) => {
    if (node.isStartNode && node.isEnabled) {
      let shouldPulse = false
      let pulseData = {}
      if (node.type === "pulsar_random_particles") {
        if (node.nextRandomTriggerTime === 0) {
          node.nextRandomTriggerTime =
            now + (Math.random() * 2) / PULSAR_RANDOM_TIMING_CHANCE_PER_SEC
        }
        if (now >= node.nextRandomTriggerTime) {
          shouldPulse = true
          node.nextRandomTriggerTime =
            now + (Math.random() * 2) / PULSAR_RANDOM_TIMING_CHANCE_PER_SEC
        }
      } else {
        if (isGlobalSyncEnabled) {
          const subdiv = subdivisionOptions[node.syncSubdivisionIndex]
          const nodeIntervalSeconds = secondsPerBeat * subdiv.value
          if (node.nextSyncTriggerTime === 0) {
            const currentBeat = now / secondsPerBeat
            const currentSubdivision = Math.floor(currentBeat / subdiv.value)
            node.nextSyncTriggerTime =
              (currentSubdivision + 1) * nodeIntervalSeconds
            if (node.nextSyncTriggerTime <= now + 0.005)
              node.nextSyncTriggerTime += nodeIntervalSeconds
          }
          if (now >= node.nextSyncTriggerTime) {
            shouldPulse = true
            node.nextSyncTriggerTime += nodeIntervalSeconds
            if (node.nextSyncTriggerTime <= now) {
              node.nextSyncTriggerTime = now + nodeIntervalSeconds
            }
          }
        } else {
          if (node.lastTriggerTime < 0)
            node.lastTriggerTime =
              now -
              Math.random() *
                (node.audioParams.triggerInterval || DEFAULT_TRIGGER_INTERVAL)
          if (
            now - node.lastTriggerTime >=
            (node.audioParams.triggerInterval || DEFAULT_TRIGGER_INTERVAL)
          ) {
            shouldPulse = true
            node.lastTriggerTime = now
          }
        }
      }
      if (shouldPulse) {
        pulseData = {
          intensity: node.audioParams.pulseIntensity ?? DEFAULT_PULSE_INTENSITY,
          color: node.color ?? null,
          particleMultiplier: 1.0
        }
        if (node.type === "pulsar_random_volume") {
          pulseData.intensity =
            MIN_PULSE_INTENSITY +
            Math.random() * (MAX_PULSE_INTENSITY - MIN_PULSE_INTENSITY)
        }
        currentGlobalPulseId++
        node.animationState = 1
        setTimeout(() => {
          const checkNode = findNodeById(node.id)
          if (checkNode) checkNode.animationState = 0
        }, 150)
        node.connections.forEach((neighborId) => {
          const neighborNode = findNodeById(neighborId)
          const connection = connections.find(
            (c) =>
              (c.nodeAId === node.id && c.nodeBId === neighborId) ||
              (c.nodeAId === neighborId && c.nodeBId === node.id)
          )
          if (
            neighborNode &&
            neighborNode.type !== "nebula" &&
            connection &&
            neighborNode.lastTriggerPulseId !== currentGlobalPulseId
          ) {
            const baseTravelTime = connection.length * DELAY_FACTOR
            const outgoingTravelTime = baseTravelTime
            const pulseColor = pulseData.color
            createVisualPulse(
              connection.id,
              outgoingTravelTime,
              node.id,
              Infinity,
              "trigger",
              pulseColor,
              pulseData.intensity
            )
            propagateTrigger(
              neighborNode,
              outgoingTravelTime,
              currentGlobalPulseId,
              node.id,
              Infinity,
              { type: "trigger", data: pulseData }
            )
          }
        })
      }
    } else if (node.type === "gate") {
      node.currentAngle += GATE_ROTATION_SPEED * (deltaTime * 60)
      node.currentAngle %= 2 * Math.PI
    } else if (node.type === "nebula") {
      node.currentAngle += NEBULA_ROTATION_SPEED_OUTER * (deltaTime * 60)
      node.currentAngle %= 2 * Math.PI
      node.innerAngle += NEBULA_ROTATION_SPEED_INNER * (deltaTime * 60)
      node.innerAngle %= 2 * Math.PI
      node.pulsePhase += NEBULA_PULSE_SPEED * (deltaTime * 60)
      node.pulsePhase %= 2 * Math.PI
    }
  })
  draw()
  previousFrameTime = now
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
    createNoteSelector(fragment, targetDataForNoteSelector)
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
  if (cmd === 0x90 && velocity > 0) {
    const newTranspose = note - 60
    globalTransposeOffset = Math.max(-12, Math.min(12, newTranspose))
    updateScaleAndTransposeUI()
    nodes.forEach((node) => {
      if (node.type === "sound" || node.type === "nebula") {
        node.audioParams.pitch = getFrequency(
          currentScale,
          node.audioParams.scaleIndex
        )
        updateNodeAudioParams(node)
      }
    })
    connections.forEach((conn) => {
      if (conn.type === "string_violin") {
        conn.audioParams.pitch = getFrequency(
          currentScale,
          conn.audioParams.scaleIndex
        )
        updateConnectionAudioParams(conn)
      }
    })
    saveState()
  }
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

saveStateBtn.addEventListener("click", triggerSave)
loadStateBtn.addEventListener("click", triggerLoad)
loadStateInput.addEventListener("change", handleFileLoad)
window.addEventListener("resize", () => {
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
  updateToolbarHeightVar()
})

function setRootNote(newRootNote) {
  if (currentRootNote === newRootNote) return; // Geen verandering

  currentRootNote = newRootNote % 12; // Zorg dat het 0-11 is
  console.log("New Root Note:", noteNames[currentRootNote]);


  updateScaleAndTransposeUI();

  // Update pitch van alle relevante nodes en connecties
  nodes.forEach((node) => {
      if (node.type === "sound" || node.type === "nebula") {
          node.audioParams.pitch = getFrequency(currentScale, node.audioParams.scaleIndex);
          updateNodeAudioParams(node);
      }
  });
  connections.forEach((conn) => {
      if (conn.type === "string_violin") {
          conn.audioParams.pitch = getFrequency(currentScale, conn.audioParams.scaleIndex);
          updateConnectionAudioParams(conn);
      }
  });

  // Herteken de piano roll om de nieuwe highlight te tonen
  drawPianoRoll();

  // Update edit panel als dat open is
  populateEditPanel();

  // Sla de nieuwe staat op
  saveState();
}

// Event listener voor klikken op de piano roll canvas
function handlePianoRollClick(event) {
  if (!pianoRollCanvas) return; // Check of canvas bestaat

  const rect = pianoRollCanvas.getBoundingClientRect();
  // Bereken de relatieve muispositie op het canvas element
  const canvasX = event.clientX - rect.left;
  const canvasY = event.clientY - rect.top;



  let clickedSemitone = -1;

  for (const hex of pianoRollHexagons) {
      const dx = canvasX - hex.x;
      const dy = canvasY - hex.y;
      // Check of de klik binnen de (geschatte) radius van het hexagon centrum valt
      if (Math.sqrt(dx * dx + dy * dy) < hex.radius * 0.85) { // *0.85 marge voor klikbaarheid
          clickedSemitone = hex.semitone;
          console.log(`Clicked on hexagon for note: ${noteNames[clickedSemitone]} (${clickedSemitone})`); // Debug
          break;
      }
  }

  if (clickedSemitone !== -1) {
      setRootNote(clickedSemitone);
  } else {
      console.log("Click outside any detected hexagon."); // Debug
  }
}


window.addEventListener("load", () => {
  // 1. Initiële Canvas Setup
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
  updateToolbarHeightVar()

  // --- CORRECTIE: Initialiseer pianoRollCanvas en pianoRollCtx ---
  pianoRollCanvas = document.getElementById('pianoRollCanvas');
  if (pianoRollCanvas) {
      pianoRollCtx = pianoRollCanvas.getContext('2d');
  } else {
      console.error("#pianoRollCanvas element not found!");
  }
  // --- Einde Correctie ---


  // 2. Populeer Scale Dropdown in Transport Bar (#scaleSelectTransport)
  const scaleDropdown = scaleSelectTransport // Gebruik de juiste variabele (gedefinieerd bovenaan)
  if (scaleDropdown) {
    Object.keys(scales).forEach((key) => {
      const o = document.createElement("option")
      o.value = key
      // Gebruik een kortere naam ipv scales[key].name
      o.textContent = key.replace("_", " ").replace("pentatonic", "penta")
      scaleDropdown.appendChild(o) // **CORRECTIE: Gebruik scaleDropdown**
    })
    scaleDropdown.value = currentScaleKey // **CORRECTIE: Gebruik scaleDropdown**
    // Listener voor als de gebruiker een andere schaal kiest
    scaleDropdown.addEventListener("change", (e) => changeScale(e.target.value))
  } else {
    console.error("#scaleSelectTransport element not found!")
  }

  // 3. Listener voor klikken op de Piano Roll Canvas
  if (pianoRollCanvas) {
    pianoRollCanvas.addEventListener("mousedown", handlePianoRollClick)
  } else {
    // Deze console.error zou nu niet meer moeten triggeren door de eerdere check
    console.error("#pianoRollCanvas element not found for click listener!")
  }

  // 4. Overige UI Element Listeners (zorg dat listeners voor niet-bestaande elementen weg zijn)
  if (playPauseBtn) playPauseBtn.addEventListener("click", togglePlayPause)
  if (globalSyncToggleBtn)
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
  if (globalBpmInput)
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
  if (restartPulsarsBtn)
    restartPulsarsBtn.addEventListener("click", () => {
      if (!isAudioReady || isGlobalSyncEnabled)
        return
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
  if (mixerBtn)
    mixerBtn.addEventListener("click", () => {
      const isOpen = !mixerPanel.classList.contains("hidden")
      resetSideToolbars()
      hideBottomPanels()
      if (!isOpen) {
        mixerPanel.classList.remove("hidden")
        mixerBtn.classList.add("active")
        updateMixerUI()
        // populateMixerPanel() // Assuming this function exists elsewhere
      }
    })
  if (gridToggleBtn)
    gridToggleBtn.addEventListener("click", () => {
      isGridVisible = !isGridVisible
      gridToggleBtn.textContent = `Grid: ${isGridVisible ? "ON" : "OFF"}`
      gridToggleBtn.classList.toggle("active", isGridVisible)
      gridOptionsDiv.classList.toggle("hidden", !isGridVisible)
    })
  if (gridTypeBtn)
    gridTypeBtn.addEventListener("click", () => {
      gridType = gridType === "lines" ? "dots" : "lines"
      gridTypeBtn.textContent = `Type: ${
        gridType === "lines" ? "Lines" : "Dots"
      }`
    })
  if (gridSnapBtn)
    gridSnapBtn.addEventListener("click", () => {
      isSnapEnabled = !isSnapEnabled
      gridSnapBtn.textContent = `Snap: ${isSnapEnabled ? "ON" : "OFF"}`
      gridSnapBtn.classList.toggle("active", isSnapEnabled)
    })
  if (toggleInfoTextBtn)
    toggleInfoTextBtn.addEventListener("click", () => {
      isInfoTextVisible = !isInfoTextVisible
      updateInfoToggleUI()
    })
  if (addSoundStarBtn)
    addSoundStarBtn.addEventListener("click", (e) => {
      setupAddTool(e.currentTarget, "sound", true, "waveforms", "Sounds")
    })
  if (addNebulaBtn)
    addNebulaBtn.addEventListener("click", (e) => {
      setupAddTool(
        e.currentTarget,
        "nebula",
        true,
        "waveforms",
        "Nebula Sounds"
      )
    })
  if (addPulsarBtn)
    addPulsarBtn.addEventListener("click", (e) => {
      setupAddTool(e.currentTarget, null, true, "pulsarTypes", "Pulsars")
    })
  if (addDrumElementBtn)
    addDrumElementBtn.addEventListener("click", (e) => {
      setupAddTool(e.currentTarget, null, true, "drumElements", "Drum Elements")
    })
  if (addGateBtn)
    addGateBtn.addEventListener("click", (e) => {
      setupAddTool(e.currentTarget, "gate")
    })
  if (addProbabilityGateBtn)
    addProbabilityGateBtn.addEventListener("click", (e) => {
      setupAddTool(e.currentTarget, "probabilityGate")
    })
  if (addPitchShiftBtn)
    addPitchShiftBtn.addEventListener("click", (e) => {
      setupAddTool(e.currentTarget, "pitchShift")
    })
  if (addRelayBtn)
    addRelayBtn.addEventListener("click", (e) => {
      setupAddTool(e.currentTarget, "relay")
    })
  if (addReflectorBtn)
    addReflectorBtn.addEventListener("click", (e) => {
      setupAddTool(e.currentTarget, "reflector")
    })
  if (addSwitchBtn)
    addSwitchBtn.addEventListener("click", (e) => {
      setupAddTool(e.currentTarget, "switch")
    })
  if (editBtn) editBtn.addEventListener("click", () => setActiveTool("edit"))
  if (connectBtn)
    connectBtn.addEventListener("click", () => setActiveTool("connect"))
  if (connectStringBtn)
    connectStringBtn.addEventListener("click", () =>
      setActiveTool("connect_string")
    )
  // if (glideToolButton) glideToolButton.addEventListener('click', () => setActiveTool('connect_glide')); // Als je glide hebt
  if (deleteBtn)
    deleteBtn.addEventListener("click", () => setActiveTool("delete"))
  if (undoBtn)
    undoBtn.addEventListener("click", () => {
      undo()
    })
  if (redoBtn)
    redoBtn.addEventListener("click", () => {
      redo()
    })
  if (hamburgerBtn)
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
  if (masterVolumeSlider) {
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
  }
  if (delaySendSlider) {
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
  }
  if (delayTimeSlider) {
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
  }
  if (delayFeedbackSlider) {
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
  }
  const showSingleNodesToggle = document.getElementById(
    "showSingleNodeGroupsToggle"
  )
  if (showSingleNodesToggle) {
    showSingleNodesToggle.addEventListener("change", (e) => {
      // showSingleNodeGroups = e.target.checked // Assuming showSingleNodeGroups exists
      // populateMixerPanel() // Assuming this function exists elsewhere
    })
  }
  if (saveStateBtn) saveStateBtn.addEventListener("click", triggerSave)
  if (loadStateBtn) loadStateBtn.addEventListener("click", triggerLoad)
  if (loadStateInput) loadStateInput.addEventListener("change", handleFileLoad)
  if (midiInSelect)
    midiInSelect.addEventListener("change", (e) =>
      selectMIDIInput(e.target.value)
    )
  if (midiOutSelect)
    midiOutSelect.addEventListener("change", (e) =>
      selectMIDIOutput(e.target.value)
    )

  // Dit is de listener die eerder werd toegevoegd, maar nu binnen de if-check staat
  // als pianoRollCanvas correct is geïnitialiseerd:
  // if (pianoRollCanvas) {
  //   pianoRollCanvas.addEventListener('mousedown', handlePianoRollClick);
  // }

  // 5. Initiële Staat & UI Updates
  setActiveTool("edit")
  startMessage.style.display = "block"
  resetSideToolbars()
  noteSelectElement = null
  noteSelectContainer = null
  hideBottomPanels()
  updateMixerUI()
  updateScaleAndTransposeUI()
  drawPianoRoll() // Zorg dat dit wordt aangeroepen *nadat* pianoRollCtx is geïnitialiseerd

  // Forceer een eerste tekening
  requestAnimationFrame(draw)
})