const canvas = document.getElementById("mainCanvas")
const ctx = canvas.getContext("2d")
const startMessage = document.getElementById("startMessage")
const loadingIndicator = document.getElementById("loadingIndicator")
const appMenuBar = document.getElementById("app-menu-bar");
const appMenuNew = document.getElementById("app-menu-new");
const appMenuLoad = document.getElementById("app-menu-load");
const appMenuSave = document.getElementById("app-menu-save");
const appMenuMidiSoon = document.getElementById("app-menu-midi-coming-soon");
const appMenuAdvancedSoon = document.getElementById("app-menu-advanced-coming-soon");
const appMenuUndoBtn = document.getElementById("app-menu-undo-btn");
const appMenuRedoBtn = document.getElementById("app-menu-redo-btn");
const appMenuAbletonLinkBtn = document.getElementById("app-menu-ableton-link-btn");
const appMenuGridToggleBtn = document.getElementById("app-menu-grid-toggle-btn");
const appMenuGridSnapBtn = document.getElementById("app-menu-grid-snap-btn");
const appMenuSyncToggleBtn = document.getElementById("app-menu-sync-toggle-btn");
const appMenuBpmControls = document.getElementById("app-menu-bpm-controls"); 
const appMenuBpmInput = document.getElementById("app-menu-bpm-input");
const appMenuPlayPauseBtn = document.getElementById("app-menu-play-pause-btn");
const appMenuRestartPulsarsBtn = document.getElementById("app-menu-restart-pulsars-btn");
const appMenuBeatIndicator = document.getElementById("app-menu-beat-indicator"); 
const appMenuHelpBtn = document.getElementById("app-menu-help-btn");
const helpPopup = document.getElementById("help-popup");
const closeHelpPopupBtn = document.getElementById("close-help-popup-btn");
const scaleSelectTransport = document.getElementById("scaleSelectTransport"); 
const closeHamburgerBtn = document.getElementById("closeHamburgerBtn");
const groupControlsDiv = document.getElementById("groupControls")
const groupVolumeSlider = document.getElementById("groupVolumeSlider")
const groupFluctuateToggle = document.getElementById("groupFluctuateToggle")
const groupFluctuateAmount = document.getElementById("groupFluctuateAmount")
const groupNodeCountSpan = document.getElementById("groupNodeCount")
const gridOptionsDiv = document.getElementById("gridOptions")
const toggleInfoTextBtn = document.getElementById("toggleInfoTextBtn")
const transportControlsDiv = document.getElementById("transportControls")
const restartPulsarsBtn = document.getElementById("restartPulsarsBtn")
const beatIndicatorElement = document.getElementById("app-menu-beat-indicator");
const mixerPanel = document.getElementById("mixerPanel")
const masterVolumeSlider = document.getElementById("masterVolumeSlider")
const masterVolumeValue = document.getElementById("masterVolumeValue")
const delaySendSlider = document.getElementById("delaySendSlider")
const delaySendValue = document.getElementById("delaySendValue")
const delayTimeSlider = document.getElementById("delayTimeSlider")
const delayTimeValue = document.getElementById("delayTimeValue")
const delayFeedbackSlider = document.getElementById("delayFeedbackSlider")
const delayFeedbackValue = document.getElementById("delayFeedbackValue")
const mixerGroupControlsContainer = document.getElementById("mixerGroupControlsContainer");
const addSoundStarBtn = document.getElementById("addSoundStarBtn")
const addSamplerBtn = document.getElementById("addSamplerBtn");
const addNebulaBtn = document.getElementById("addNebulaBtn")
const addPulsarBtn = document.getElementById("addPulsarBtn")
const addAnalogSynthBtn = document.getElementById("addAnalogSynthBtn");
const addFmSynthBtn = document.getElementById("addFmSynthBtn");
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
const connectWaveTrailBtn = document.getElementById("connectWaveTrailBtn");
const GLIDE_LINE_COLOR = 'rgba(255, 180, 255, 0.8)'; 
const GLIDE_LINE_WIDTH = 2.5; 
const deleteBtn = document.getElementById("deleteBtn")
const undoBtn = document.getElementById("undoBtn")
const redoBtn = document.getElementById("redoBtn")
const hamburgerBtn = document.getElementById("hamburgerBtn")
const hamburgerMenuPanel = document.getElementById("hamburgerMenuPanel")
const editPanelContent = document.getElementById("editPanelContent")
const sideToolbar = document.getElementById("sideToolbar")
const sideToolbarTitle = document.getElementById("sideToolbarTitle")
const sideToolbarContent = document.getElementById("sideToolbarContent")
const appMenuRecordBtn = document.getElementById("app-menu-record-btn");
const A4_FREQ = 440.0;
const A4_MIDI_NOTE = 69;
const PORTAL_NEBULA_TYPE = 'portal_nebula';
const GRAIN_DURATION = 0.09; 
const GRAIN_OVERLAP = 0.07;  
const GRAIN_INTERVAL = GRAIN_DURATION - GRAIN_OVERLAP; 
const toolbar = document.getElementById("toolbar");
const ROCKET_DEFAULT_SPEED = 150.0; 
const ROCKET_DEFAULT_RANGE = 400; 
const ROCKET_DEFAULT_GRAVITY = 50; 
const ROCKET_EXPLOSION_PARTICLES = 25;
const ROCKET_PULSE_VISUAL_SIZE = 4; 
const tapeLoopRecordBtn = document.getElementById('tapeLoopRecordBtn');
const tapeLoopPlayBtn = document.getElementById('tapeLoopPlayBtn');
const tapeLoopStopBtn = document.getElementById('tapeLoopStopBtn');
const tapeLoopClearBtn = document.getElementById('tapeLoopClearBtn');
const tapeLoopDurationInput = document.getElementById('tapeLoopDurationInput');
const tapeLoopStatusLabel = document.getElementById('tapeLoopStatusLabel');
const appMenuToggleTapeLooperBtn = document.getElementById('app-menu-toggle-tape-looper-btn');
const tapeLooperPanel = document.getElementById('tapeLooperPanel');
const closeTapeLooperPanelBtn = document.getElementById('closeTapeLooperPanelBtn');
const tapeReelLeft = document.getElementById('tapeReelLeft');
const tapeReelRight = document.getElementById('tapeReelRight');
let tapeReelAngle = 0;

let isAbletonLinkActive = false; 
let unsavedChanges = false;
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
let mediaRecorder;
let recordedChunks = [];
let isRecording = false;
let mediaStreamDestinationNode;
let originalMasterGainDestination = null;
let tapeLoopBuffer = null;
let tapeLoopSourceNode = null;
let isTapeLoopRecording = false;
let isTapeLoopPlaying = false;
let scriptNodeForTapeLoop = null;
let tapeLoopWritePosition = 0;
let configuredTapeLoopDurationSeconds = 4;
let tapeLoopRecordedAtBPM = 0;
let tapeLoopInputGate = null;
let actualTapeLoopRecordStartTime = 0;
let scheduledTapeLoopEvents = []; 
let tapeLoopRecordBtnClickable = true;

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
let activeRockets = []; 
let rocketIdCounter = 0; 
let isRotatingRocket = null; 
let rotationStartDetails = { screenX: 0, screenY: 0, initialAngleRad: 0 }; 

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
  droneBaseFreq: 40.0, 
  numHarmonics: 5,     
  harmonicSpread: 0.8, 
  harmonicBaseGain: 0.04, 
  shimmerRate: 0.15,    
  shimmerDepth: 0.02,   
  baseColorHue: 280,   
  pulseSpeed: 0.5,     
  
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
let brushNodeType = 'sound'; 
let brushWaveform = 'fmBell'; 
let brushStartWithPulse = true; 
let isBrushing = false;         
let lastBrushNode = null;       

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
  { label: "1/16 Triplet", value: 1/6 }, 
  { label: "1/16", value: 0.25 },     
  { label: "1/8 Triplet", value: 1/3 },  
  { label: "1/8", value: 0.5 },      
  { label: "1/4 Triplet", value: 2/3 },  
  { label: "1/4", value: 1 },        
  { label: "1/3 Beat", value: 1/3 * 4},                             
  { label: "1/2", value: 2 },        
  { label: "1/1 (Whole)", value: 4 },
  { label: "2/1 (2 Whole)", value: 8},
  { label: "1/3 Note", value: 4/3 },    
  { label: "1/5 Note", value: 4/5 },    
  { label: "1/6 Note", value: 4/6 },    
  { label: "1/9 Note", value: 4/9 },    
];


const DEFAULT_SUBDIVISION_INDEX = 8;

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
  { type: "pulsar_manual", label: "Manual", icon: "👆" },
  { type: "pulsar_rocket", label: "Rocket", icon: "🚀" } 
];




const analogWaveformPresets = [
  { type: "sine", label: "Sine", icon: "○", details: {
    visualStyle: "analog_sine",
    ampEnv: { attack: 0.005, decay: 0.2, sustain: 0.2, release: 0.2 }
  }
},
{ type: "square", label: "Square", icon: "□", details: {
    visualStyle: "analog_square",
    ampEnv: { attack: 0.005, decay: 0.2, sustain: 0.2, release: 0.2} 
  }
},
{ type: "sawtooth", label: "Saw", icon: "📈", details: {
    visualStyle: "analog_sawtooth",
    ampEnv: { attack: 0.005, decay: 0.2, sustain: 0.2, release: 0.2 }
  }
},
{ type: "triangle", label: "Triangle", icon: "△", details: {
    visualStyle: "analog_triangle",
    ampEnv: { attack: 0.005, decay: 0.2, sustain: 0.2, release: 0.2 }
  }
},
  {
    type: "venus", label: "Venus", icon: "♀️", details: {
      visualStyle: "planet_venus",
      osc1Type: "sawtooth", osc1Octave: 0,
      osc2Type: "sine", osc2Octave: -1, osc2Detune: 0, osc2Mix: 0.4,
      filterType: "lowpass", filterCutoff: 4000, filterResonance: 1.2, filterEnvAmount: 2000,
      ampEnv: { attack: 0.2, decay: 0.8, sustain: 0.6, release: 1.0 },
      lfo1Target: "filterCutoff", lfo1Rate: 0.5, lfo1Amount: 1500
    }
  },
  {
    type: "earth", label: "Earth", icon: "🜨", details: {
        visualStyle: "planet_earth",
        osc1Type: "sawtooth", osc1Octave: 0,
        osc2Type: "square", osc2Octave: -1, osc2Detune: 5, osc2Mix: 0.5,
        filterType: "lowpass", filterCutoff: 3500, filterResonance: 1.0, filterEnvAmount: 1500,
        ampEnv: { attack: 0.08, decay: 0.6, sustain: 0.7, release: 0.9 }
    }
  },
  {
    type: "mars", label: "Mars", icon: "♂️", details: {
        visualStyle: "planet_mars",
        osc1Type: "square", osc1Octave: 0,
        osc2Type: "sawtooth", osc2Octave: 0, osc2Detune: -7, osc2Mix: 0.3,
        filterType: "bandpass", filterCutoff: 2000, filterResonance: 2.5, filterEnvAmount: 4000,
        ampEnv: { attack: 0.02, decay: 0.3, sustain: 0.8, release: 0.4 }
    }
  },
  {
    type: "jupiter", label: "Jupiter", icon: "♃", details: {
        visualStyle: "planet_jupiter",
        osc1Type: "sawtooth", osc1Octave: -1, 
        osc2Type: "sawtooth", osc2Octave: -2, osc2Detune: 12, osc2Mix: 0.7,
        filterType: "lowpass", filterCutoff: 1000, filterResonance: 0.8, filterEnvAmount: 500,
        ampEnv: { attack: 0.3, decay: 1.5, sustain: 0.9, release: 2.5 }
    }
  },
  {
    type: "saturn", label: "Saturn", icon: "♄", details: {
        visualStyle: "planet_saturn",
        osc1Type: "triangle", osc1Octave: 0,
        osc2Type: "sine", osc2Octave: 1, osc2Detune: 0, osc2Mix: 0.6, 
        filterType: "lowpass", filterCutoff: 5000, filterResonance: 0.6, filterEnvAmount: 1000,
        ampEnv: { attack: 0.6, decay: 1.2, sustain: 0.5, release: 1.8 },
        lfo1Target: "amplitude", lfo1Rate: 0.2, lfo1Amount: 0.15 
    }
  },
  {
    type: "uranus", label: "Uranus", icon: "♅", details: {
        visualStyle: "planet_uranus",
        osc1Type: "sine", osc1Octave: 0,
        osc2Type: "noise", osc2Mix: 0.15, 
        filterType: "highpass", filterCutoff: 600, filterResonance: 1.0, 
        ampEnv: { attack: 0.4, decay: 1.5, sustain: 0.2, release: 2.0 }
    }
  },
  {
    type: "neptune", label: "Neptune", icon: "♆", details: {
        visualStyle: "planet_neptune",
        osc1Type: "sawtooth", osc1Octave: -1,
        osc2Type: "square", osc2Octave: -2, osc2Detune: -10, osc2Mix: 0.4,
        filterType: "lowpass", filterCutoff: 800, filterResonance: 2.0, filterEnvAmount: 600,
        ampEnv: { attack: 0.5, decay: 2.2, sustain: 0.8, release: 3.0 },
        lfo1Target: "filterCutoff", lfo1Rate: 0.08, lfo1Amount: 400
    }
  }
];

const fmSynthPresets = [
  { 
    type: "fmBell", label: "Bell", icon: "🔔", details: {
      visualStyle: "fm_bell",
      carrierWaveform: "sine", modulatorWaveform: "sine",
      carrierRatio: 1, modulatorRatio: 1.4, modulatorDepthScale: 4,
      carrierEnv: { attack: 0.005, decay: 0.8, sustain: 0, release: 0.5 },
      modulatorEnv: { attack: 0.005, decay: 0.15, sustain: 0, release: 0.2 }
    }
  },
  { 
    type: "fmXylo", label: "Xylo", icon: "🥁", details: {
      visualStyle: "fm_xylo",
      carrierWaveform: "sine", modulatorWaveform: "sine",
      carrierRatio: 1, modulatorRatio: 3.5, modulatorDepthScale: 10,
      carrierEnv: { attack: 0.002, decay: 0.2, sustain: 0, release: 0.2 },
      modulatorEnv: { attack: 0.002, decay: 0.05, sustain: 0, release: 0.1 }
    }
  },
  { 
    type: "fmGalaxy", label: "Galaxy Pad", icon: "🌠", details: {
      visualStyle: "fm_galaxy",
      carrierWaveform: "sine", modulatorWaveform: "sine",
      carrierRatio: 1, modulatorRatio: 0.5, modulatorDepthScale: 0.1, 
      carrierEnv: { attack: 1.5, decay: 2.0, sustain: 0.8, release: 3.0 },
      modulatorEnv: { attack: 2.0, decay: 1.5, sustain: 0.6, release: 2.5 }
    }
  },
  {
    type: "fmCrystal", label: "Crystal", icon: "💎", details: {
      visualStyle: "fm_crystal",
      carrierWaveform: "sine", modulatorWaveform: "sine",
      carrierRatio: 1, modulatorRatio: 2.8, modulatorDepthScale: 6, 
      carrierEnv: { attack: 0.01, decay: 1.0, sustain: 0.1, release: 1.0 },
      modulatorEnv: { attack: 0.01, decay: 0.3, sustain: 0, release: 0.5 }
    }
  },
  {
    type: "fmChime", label: "Chime", icon: "🎶", details: {
      visualStyle: "fm_chime",
      carrierWaveform: "sine", modulatorWaveform: "sine",
      carrierRatio: 1, modulatorRatio: 4.2, modulatorDepthScale: 5,
      carrierEnv: { attack: 0.001, decay: 1.2, sustain: 0, release: 1.2 },
      modulatorEnv: { attack: 0.001, decay: 0.8, sustain: 0, release: 0.8 }
    }
  },
  {
    type: "fmGlass", label: "Glass", icon: "🍸", details: {
      visualStyle: "fm_glass",
      carrierWaveform: "sine", modulatorWaveform: "triangle", 
      carrierRatio: 1, modulatorRatio: 1.77, modulatorDepthScale: 7,
      carrierEnv: { attack: 0.005, decay: 0.5, sustain: 0, release: 0.7 },
      modulatorEnv: { attack: 0.005, decay: 0.1, sustain: 0, release: 0.3 }
    }
  },
  {
    type: "fmOrgan", label: "Organ", icon: "🎹", details: {
      visualStyle: "fm_organ",
      carrierWaveform: "sine", modulatorWaveform: "sine",
      carrierRatio: 1, modulatorRatio: 2.0, modulatorDepthScale: 3, 
      carrierEnv: { attack: 0.05, decay: 0.1, sustain: 0.9, release: 0.3 },
      modulatorEnv: { attack: 0.05, decay: 0.1, sustain: 0.9, release: 0.3 }
    }
  },
  {
    type: "fmElectricPiano", label: "E-Piano", icon: "🎼", details: {
      visualStyle: "fm_epiano",
      carrierWaveform: "sine", modulatorWaveform: "sine",
      carrierRatio: 1, modulatorRatio: 1.0, modulatorDepthScale: 4.5, 
      carrierEnv: { attack: 0.01, decay: 1.5, sustain: 0, release: 1.0 },
      modulatorEnv: { attack: 0.01, decay: 0.6, sustain: 0, release: 0.5 }
    }
  },
   {
    type: "fmEthnic", label: "Ethnic", icon: "🏮", details: {
      visualStyle: "fm_ethnic",
      carrierWaveform: "sine", modulatorWaveform: "sawtooth", 
      carrierRatio: 1, modulatorRatio: 2.53, modulatorDepthScale: 5.5,
      carrierEnv: { attack: 0.02, decay: 0.4, sustain: 0, release: 0.6 },
      modulatorEnv: { attack: 0.02, decay: 0.15, sustain: 0, release: 0.3 }
    }
  },
  {
    type: "fmMetallic", label: "Metallic", icon: "🔩", details: {
      visualStyle: "fm_metallic",
      carrierWaveform: "square", modulatorWaveform: "square", 
      carrierRatio: 1, modulatorRatio: 5.1, modulatorDepthScale: 6.5,
      carrierEnv: { attack: 0.001, decay: 0.9, sustain: 0, release: 0.9 },
      modulatorEnv: { attack: 0.001, decay: 0.08, sustain: 0, release: 0.2 }
    }
  },
  {
    type: "fmHarmonic", label: "Harmonic", icon: "✨", details: {
      visualStyle: "fm_harmonic",
      carrierWaveform: "sine", modulatorWaveform: "triangle",
      carrierRatio: 1, modulatorRatio: 3.0, modulatorDepthScale: 3.5,
      carrierEnv: { attack: 0.1, decay: 1.0, sustain: 0.5, release: 1.0 },
      modulatorEnv: { attack: 0.1, decay: 0.5, sustain: 0.3, release: 0.8 }
    }
  },
  {
    type: "fmVoid", label: "Void", icon: "⚫", details: {
      visualStyle: "fm_void",
      carrierWaveform: "sine", modulatorWaveform: "sine",
      carrierRatio: 1, modulatorRatio: 0.25, modulatorDepthScale: 2.5, 
      carrierEnv: { attack: 2.0, decay: 3.0, sustain: 1.0, release: 4.0 },
      modulatorEnv: { attack: 2.5, decay: 2.5, sustain: 0.8, release: 3.5 }
    }
  }
];


const samplerWaveformTypes = (typeof SAMPLER_DEFINITIONS !== 'undefined')
? SAMPLER_DEFINITIONS.map(sampler => ({
    type: `sampler_${sampler.id}`,
    label: sampler.label,
    icon: sampler.icon,
    loadFailed: sampler.loadFailed
}))
: [];

if (samplerWaveformTypes.length === 0 && typeof SAMPLER_DEFINITIONS === 'undefined') {
console.error("SAMPLER_DEFINITIONS is niet gevonden. Zorg dat samplers.js correct geladen wordt vóór app.js in index.html.");
}




if (samplerWaveformTypes.length === 0 && typeof SAMPLER_DEFINITIONS === 'undefined') {
  console.error("SAMPLER_DEFINITIONS is niet gevonden. Zorg dat samplers.js correct geladen wordt vóór app.js in index.html.");
}


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
  updateLoadingIndicator();
  try {
    const response = await fetch(url);
    console.log(`[Sampler Load] Fetching ${url} - Status: ${response.status}`); // NIEUW
    if (!response.ok)
      throw new Error(`HTTP error! status: ${response.status} for ${url}`);
    const arrayBuffer = await response.arrayBuffer();
    let decodedBuffer = null;
    if (
      typeof audioContext.decodeAudioData === "function" &&
      audioContext.decodeAudioData.length !== 1
    ) {
      decodedBuffer = await audioContext.decodeAudioData(arrayBuffer);
    } else {
      decodedBuffer = await new Promise((resolve, reject) => {
        audioContext.decodeAudioData(
          arrayBuffer,
          (buffer) => {
            resolve(buffer);
          },
          (error) => {
            console.error(`[Sampler Load] DecodeAudioData (callback) error for ${sampleName}:`, error); // NIEUW
            reject(error);
          }
        );
      });
    }
    samplesLoadedCount++;
    updateLoadingIndicator();
    console.log(`[Sampler Load] Successfully decoded ${sampleName}, buffer length: ${decodedBuffer?.length}`); // NIEUW
    return { name: sampleName, buffer: decodedBuffer, success: true };
  } catch (error) {
    console.error(`[Sampler Load] CATCH error for sample ${sampleName} from ${url}:`, error); // AANGEPAST
    updateLoadingIndicator();
    const waveformName = `sampler_${sampleName.toLowerCase()}`;
    // Assuming waveformTypes is defined globally or accessible in this scope
    // If not, this line might need adjustment or removal depending on its actual usage.
    // const wfType = waveformTypes.find((w) => w.type === waveformName);
    // if (wfType) wfType.loadFailed = true;

    // Fallback: Mark the sampler definition itself as failed
    if (typeof SAMPLER_DEFINITIONS !== 'undefined') {
        const definition = SAMPLER_DEFINITIONS.find(s => s.id === sampleName);
        if (definition) {
            definition.loadFailed = true;
        }
    }
    // Also update samplerWaveformTypes if it's accessible and used
     if (typeof samplerWaveformTypes !== 'undefined') {
        const wfType = samplerWaveformTypes.find(w => w.type === `sampler_${sampleName}`);
        if (wfType) {
            wfType.loadFailed = true;
        }
    }

    return { name: sampleName, buffer: null, success: false };
  }
}

async function setupAudio() {
    if (audioContext) return audioContext;
    try {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        originalMasterGainDestination = audioContext.destination;

        masterGain = audioContext.createGain();
        masterGain.gain.value = parseFloat(masterVolumeSlider.value);
        masterGain.connect(originalMasterGainDestination);


        portalGroupGain = audioContext.createGain();
        portalGroupGain.gain.value = 0.7;
        portalGroupGain.connect(masterGain);

        originalNebulaGroupGain = audioContext.createGain();
        originalNebulaGroupGain.gain.value = 0.8;
        originalNebulaGroupGain.connect(masterGain);

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
                    const wfType = samplerWaveformTypes.find(w => w.type === `sampler_${definition.id}`);
                    if (wfType) wfType.loadFailed = true;
                    console.warn(`Failed to load sample: ${definition.label} from ${definition.url}`);
                }
            });
        }

        updateLoadingIndicator();
        isAudioReady = true;
        resetSideToolbars();
        changeScale(scaleSelectTransport.value, true);
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

function startRecording() {
    if (!audioContext || audioContext.state !== 'running' || !masterGain) {
        alert("Audio context is niet actief. Start of hervat audio via de Play knop.");
        return;
    }

    mediaStreamDestinationNodeForRecording = audioContext.createMediaStreamDestination();

    try {
        masterGain.connect(mediaStreamDestinationNodeForRecording);
    } catch (e) {
        console.error("FATALE FOUT: Kon masterGain niet verbinden met mediaStreamDestinationNodeForRecording (voor aftappen):", e);
        alert("Opnamefout: Kon audio-aftap niet instellen.");
        mediaStreamDestinationNodeForRecording = null;
        return;
    }

    let streamToRecord;
    try {
        streamToRecord = mediaStreamDestinationNodeForRecording.stream;
    } catch (e) {
        console.error("FATALE FOUT: Kon .stream eigenschap niet benaderen van mediaStreamDestinationNodeForRecording:", e);
        alert("Opnamefout: Kon audio stream niet verkrijgen na aftappen.");
        try { masterGain.disconnect(mediaStreamDestinationNodeForRecording); } catch (e2) {}
        mediaStreamDestinationNodeForRecording = null;
        return;
    }

    recordedChunks = [];
    const options = { mimeType: 'audio/wav' };
    try {
        mediaRecorder = new MediaRecorder(streamToRecord, options);
    } catch (e) {
        console.warn("Kon MediaRecorder niet initialiseren met audio/wav. Probeert standaard.", e);
        try {
            mediaRecorder = new MediaRecorder(streamToRecord);
        } catch (e2) {
            alert("MediaRecorder API wordt niet ondersteund of kon niet initialiseren: " + e2.message);
            console.error("MediaRecorder initialisatie mislukt:", e2);
            try { masterGain.disconnect(mediaStreamDestinationNodeForRecording); } catch (e3) {}
            mediaStreamDestinationNodeForRecording = null;
            return;
        }
    }

    mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
            recordedChunks.push(event.data);
        }
    };

    mediaRecorder.onstop = () => {
        const blob = new Blob(recordedChunks, { type: mediaRecorder.mimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        document.body.appendChild(a);
        a.style.display = 'none';
        a.href = url;
        const timestamp = new Date().toISOString().slice(0, 16).replace("T", "_").replace(":", "-");
        let fileExtension = ".wav";
        if (mediaRecorder.mimeType.includes("webm")) {
            fileExtension = ".webm";
        } else if (mediaRecorder.mimeType.includes("ogg")) {
            fileExtension = ".ogg";
        }
        a.download = `Resonaut_Sessie_${timestamp}${fileExtension}`;
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        recordedChunks = [];

        if (masterGain && mediaStreamDestinationNodeForRecording) {
            try {
                masterGain.disconnect(mediaStreamDestinationNodeForRecording);
            } catch (e) {
                console.warn("Fout bij loskoppelen van masterGain van opname-node na stop:", e);
            }
        }
        if (mediaStreamDestinationNodeForRecording) {
             try { mediaStreamDestinationNodeForRecording.disconnect(); } catch (e) {} 
        }
        mediaStreamDestinationNodeForRecording = null;
    };

    mediaRecorder.start();
    isRecording = true;
    if (appMenuRecordBtn) {
        appMenuRecordBtn.textContent = "◼ Stop";
        appMenuRecordBtn.classList.add("active");
    }
    console.log("Opname gestart (parallel tap). MimeType:", mediaRecorder.mimeType);
}

function stopRecording() {
    if (mediaRecorder && mediaRecorder.state !== "inactive") {
        mediaRecorder.stop();
    }
    isRecording = false;
    if (appMenuRecordBtn) {
        appMenuRecordBtn.textContent = "🔴 Record";
        appMenuRecordBtn.classList.remove("active");
    }
    console.log("Opname gestopt (parallel tap).");
}

function updateTapeLooperUI() {
    if (!tapeLoopRecordBtn || !tapeLoopPlayBtn || !tapeLoopStopBtn || !tapeLoopClearBtn || !tapeLoopStatusLabel) return;
    const recordIcon = '⏺️';
    const stopRecIcon = '⏹️&nbsp;REC';
    const armedIcon = '❗&nbsp;ARMED';
    const playIcon = '▶️';
    const stopIcon = '⏹️';

    tapeLoopRecordBtn.disabled = false;
    tapeLoopPlayBtn.disabled = true;
    tapeLoopStopBtn.disabled = true;
    tapeLoopClearBtn.disabled = true;

    if (tapeLoopRecordBtn.dataset.isArmed === 'true') {
        tapeLoopRecordBtn.innerHTML = armedIcon;
        tapeLoopRecordBtn.classList.add('active');
        tapeLoopStatusLabel.textContent = 'Armed (Wacht op tel...)';
        tapeLoopPlayBtn.disabled = true;
        tapeLoopStopBtn.disabled = true;
        tapeLoopClearBtn.disabled = true;
    } else if (isTapeLoopRecording) {
        tapeLoopRecordBtn.innerHTML = stopRecIcon;
        tapeLoopRecordBtn.classList.add('active');
        const sampleRate = audioContext?.sampleRate || 44100;
        const recordedTime = tapeLoopWritePosition / sampleRate;
        const totalDuration = tapeLoopBuffer ? tapeLoopBuffer.duration.toFixed(1) : configuredTapeLoopDurationSeconds.toFixed(1);
        tapeLoopStatusLabel.textContent = `REC ${recordedTime.toFixed(1)}/${totalDuration}s`;
        tapeLoopPlayBtn.disabled = true;
        tapeLoopStopBtn.disabled = false;
        tapeLoopClearBtn.disabled = true;
    } else if (isTapeLoopPlaying) {
        tapeLoopRecordBtn.innerHTML = recordIcon;
        tapeLoopRecordBtn.classList.remove('active');
        tapeLoopRecordBtn.disabled = true;
        tapeLoopPlayBtn.disabled = true;
        tapeLoopStopBtn.disabled = false;
        tapeLoopClearBtn.disabled = false;
        tapeLoopStatusLabel.textContent = 'LOOPING';
    } else {
        tapeLoopRecordBtn.innerHTML = recordIcon;
        tapeLoopRecordBtn.classList.remove('active');
        tapeLoopRecordBtn.disabled = false;
        tapeLoopRecordBtn.dataset.isArmed = 'false';
        tapeLoopPlayBtn.disabled = !tapeLoopBuffer;
        tapeLoopPlayBtn.innerHTML = playIcon;
        tapeLoopStopBtn.disabled = true;
        tapeLoopStopBtn.innerHTML = stopIcon;
        tapeLoopClearBtn.disabled = !tapeLoopBuffer;
        tapeLoopStatusLabel.textContent = tapeLoopBuffer ? 'READY' : 'IDLE';
    }
}

function getNextQuantizedTime(baseTime, beatsToQuantizeTo = 1) {
    if (!isGlobalSyncEnabled || !audioContext || globalBPM <= 0) {
        return audioContext.currentTime;
    }
    const secondsPerBeat = 60.0 / globalBPM;
    const quantizationIntervalSeconds = secondsPerBeat * beatsToQuantizeTo;
    const currentTime = baseTime || audioContext.currentTime;
    let nextTime = Math.ceil(currentTime / quantizationIntervalSeconds) * quantizationIntervalSeconds;
    if (nextTime <= currentTime + 0.020) {
        nextTime += quantizationIntervalSeconds;
    }
    return nextTime;
}

function startTapeLoopRecording() {
    if (!audioContext || audioContext.state !== 'running' || !masterGain) {
        alert("Audio context is niet actief. Start audio via Play.");
        return;
    }
    if (isTapeLoopRecording || isTapeLoopPlaying || (tapeLoopRecordBtn && tapeLoopRecordBtn.dataset.isArmed === 'true')) {
        console.warn("Kan geen nieuwe opname starten: looper is al bezig, armed, of speelt al af.");
        return;
    }

    configuredTapeLoopDurationSeconds = parseFloat(tapeLoopDurationInput.value) || 4;
    let actualCalculatedBufferDurationSeconds = configuredTapeLoopDurationSeconds;

    if (isGlobalSyncEnabled && globalBPM > 0) {
        tapeLoopRecordedAtBPM = globalBPM;
        const secondsPerBeat = 60.0 / globalBPM;
        const durationInBeats = Math.max(1, Math.round(configuredTapeLoopDurationSeconds / secondsPerBeat));
        actualCalculatedBufferDurationSeconds = durationInBeats * secondsPerBeat;
        console.log(`Sync: Loop duration quantized to ${durationInBeats} beats (${actualCalculatedBufferDurationSeconds.toFixed(2)}s)`);
    } else {
        tapeLoopRecordedAtBPM = 0;
    }

    tapeLoopWritePosition = 0;
    actualTapeLoopRecordStartTime = 0;

    if (!tapeLoopInputGate) {
        tapeLoopInputGate = audioContext.createGain();
        tapeLoopInputGate.gain.value = 0;
        masterGain.connect(tapeLoopInputGate);
    } else {
        tapeLoopInputGate.gain.cancelScheduledValues(audioContext.currentTime);
        tapeLoopInputGate.gain.setValueAtTime(0, audioContext.currentTime);
    }
    
    const logicToActuallyStartProcessingAndRecording = (startTime) => {
        const currentSampleRate = audioContext.sampleRate;
        const currentNumberOfChannels = 2;
        const bufferLengthInSamples = Math.floor(currentSampleRate * actualCalculatedBufferDurationSeconds);

        if (bufferLengthInSamples <= 0) {
            console.error("Bufferlengte voor tape loop is nul of negatief. Opname geannuleerd.", actualCalculatedBufferDurationSeconds);
            if (tapeLoopRecordBtn) tapeLoopRecordBtn.dataset.isArmed = 'false';
            tapeLoopRecordBtnClickable = true;
            updateTapeLooperUI();
            return;
        }
        tapeLoopBuffer = audioContext.createBuffer(currentNumberOfChannels, bufferLengthInSamples, currentSampleRate);
        tapeLoopWritePosition = 0;

        const scriptBufferSize = 4096;
        scriptNodeForTapeLoop = audioContext.createScriptProcessor(scriptBufferSize, currentNumberOfChannels, currentNumberOfChannels);

        scriptNodeForTapeLoop.onaudioprocess = (audioProcessingEvent) => {
            if (!isTapeLoopRecording || !tapeLoopBuffer) return;
            if (isGlobalSyncEnabled && actualTapeLoopRecordStartTime > 0 && audioContext.currentTime < actualTapeLoopRecordStartTime - 0.005) {
                return; 
            }

            const inputBuffer = audioProcessingEvent.inputBuffer;
            const currentBlockSize = inputBuffer.length;
            const localNumChannels = inputBuffer.numberOfChannels;
            let hasAnySignalInBlockThisIteration = false;

            for (let channel = 0; channel < localNumChannels; channel++) {
                const channelInputData = inputBuffer.getChannelData(channel);
                const tapeBufferData = tapeLoopBuffer.getChannelData(channel);

                if (channel === 0 && tapeLoopWritePosition < scriptBufferSize * 20) {
                    for(let k=0; k < currentBlockSize; k += Math.floor(currentBlockSize/8) || 1) {
                        if (Math.abs(channelInputData[k]) > 0.0001) { 
                            hasAnySignalInBlockThisIteration = true;
                            break;
                        }
                    }
                }

                for (let i = 0; i < currentBlockSize; i++) {
                    if (tapeLoopWritePosition + i < tapeBufferData.length) {
                        tapeBufferData[tapeLoopWritePosition + i] = channelInputData[i];
                    } else {
                        break; 
                    }
                }
            }
            
            if (tapeLoopWritePosition < scriptBufferSize * 20) { 
                if (hasAnySignalInBlockThisIteration) {
                    console.log(`TapeLooper ONAUDIOPROCESS: SIGNAAL in block (pos: ${tapeLoopWritePosition}, blocksize: ${currentBlockSize})`);
                } else {
                    console.log(`TapeLooper ONAUDIOPROCESS: STILTE in block (pos: ${tapeLoopWritePosition}, blocksize: ${currentBlockSize})`);
                }
            }

            tapeLoopWritePosition += currentBlockSize;

            const sampleRateForCalc = audioContext?.sampleRate || 44100;
            const recordedTime = tapeLoopWritePosition / sampleRateForCalc;
            if (tapeLoopStatusLabel && isTapeLoopRecording) {
                const totalDuration = tapeLoopBuffer ? tapeLoopBuffer.duration.toFixed(1) : actualCalculatedBufferDurationSeconds.toFixed(1);
                tapeLoopStatusLabel.textContent = `REC ${recordedTime.toFixed(1)}/${totalDuration}s`;
            }
        };
        
        tapeLoopInputGate.connect(scriptNodeForTapeLoop);
        scriptNodeForTapeLoop.connect(audioContext.destination);

        actualTapeLoopRecordStartTime = startTime;
        isTapeLoopRecording = true;
        if (tapeLoopRecordBtn) {
            tapeLoopRecordBtn.dataset.isArmed = 'false';
        }
        tapeLoopRecordBtnClickable = true; 
        
        if (tapeLoopInputGate) {
            tapeLoopInputGate.gain.setValueAtTime(1.0, startTime);
            console.log(`DEBUG: TapeLoopInputGate gain gezet op 1.0 op context tijd: ${startTime.toFixed(3)}`);
        }
        
        const bufferActualDuration = tapeLoopBuffer.duration;
        console.log(`Tape loop recording daadwerkelijk gestart op context tijd: ${startTime.toFixed(3)}. Buffer duur: ${bufferActualDuration.toFixed(2)}s`);
        updateTapeLooperUI();

        const stopTime = startTime + bufferActualDuration;
        if (tapeLoopInputGate) {
            tapeLoopInputGate.gain.setValueAtTime(0.0, stopTime);
            console.log(`DEBUG: TapeLoopInputGate gain gepland op 0.0 op context tijd: ${stopTime.toFixed(3)}`);
        }
        
        scheduledTapeLoopEvents = scheduledTapeLoopEvents.filter(e => e.action !== 'stopRecAndPlay');
        scheduledTapeLoopEvents.push({ time: stopTime, action: 'stopRecAndPlay' });
    };

    if (isGlobalSyncEnabled && globalBPM > 0) {
        const quantizedStartTime = getNextQuantizedTime(audioContext.currentTime, 1);
        if (tapeLoopRecordBtn) {
            tapeLoopRecordBtn.dataset.isArmed = 'true';
            tapeLoopRecordBtnClickable = false;
            setTimeout(() => { 
                if(tapeLoopRecordBtn && tapeLoopRecordBtn.dataset.isArmed === 'true'){
                    tapeLoopRecordBtnClickable = true; 
                }
            }, 350); 
        }
        updateTapeLooperUI();
        
        scheduledTapeLoopEvents = scheduledTapeLoopEvents.filter(e => e.action !== 'startRec');
        scheduledTapeLoopEvents.push({ 
            time: quantizedStartTime, 
            action: 'startRec',
            callback: logicToActuallyStartProcessingAndRecording 
        });
        console.log(`Tape loop armed. Zal opname starten op: ${quantizedStartTime.toFixed(3)} (geplande duur: ${actualCalculatedBufferDurationSeconds.toFixed(2)}s)`);
    } else {
        logicToActuallyStartProcessingAndRecording(audioContext.currentTime);
    }
}

function processScheduledTapeEvents() {
    const now = audioContext.currentTime;
    let nextEvents = [];
    for (let event of scheduledTapeLoopEvents) {
        if (now >= event.time - 0.010) {
            if (event.action === 'startRec') {
                if (tapeLoopRecordBtn && tapeLoopRecordBtn.dataset.isArmed === 'true') {
                    if (typeof event.callback === 'function') {
                        event.callback(event.time);
                    }
                } else {
                    console.log("Geplande opname overgeslagen, arming was al geannuleerd of knop niet gevonden.");
                }
                tapeLoopRecordBtnClickable = true;
            } else if (event.action === 'stopRecAndPlay') {
                if (isTapeLoopRecording) {
                    isTapeLoopRecording = false;
                    if (scriptNodeForTapeLoop) {
                        try { scriptNodeForTapeLoop.disconnect(); } catch(e){}
                        if (tapeLoopInputGate && scriptNodeForTapeLoop) {
                            try { tapeLoopInputGate.disconnect(scriptNodeForTapeLoop); } catch(e){}
                        }
                        scriptNodeForTapeLoop.onaudioprocess = null;
                        scriptNodeForTapeLoop = null;
                    }
                    console.log("Tape loop recording finished (scheduled).");
                    updateTapeLooperUI();
                    if (tapeLoopBuffer && tapeLoopWritePosition > (audioContext.sampleRate * 0.05)) {
                        playTapeLoop(event.time);
                    } else {
                         console.log("Te weinig data opgenomen in buffer, wordt niet afgespeeld, buffer gewist.");
                         clearTapeLoop();
                    }
                }
            } else if (event.action === 'startPlay') {
                 if(tapeLoopSourceNode) {
                    tapeLoopSourceNode.start(event.time);
                    isTapeLoopPlaying = true;
                    console.log("Tape loop playback started (scheduled) at: " + event.time.toFixed(3));
                    updateTapeLooperUI();
                 }
            }
        } else {
            nextEvents.push(event);
        }
    }
    scheduledTapeLoopEvents = nextEvents;
}

function playTapeLoop(scheduledPlayTime = 0) {
    if (!audioContext || !tapeLoopBuffer || isTapeLoopPlaying) {
        if (isTapeLoopPlaying) console.log("DEBUG: playTapeLoop aangeroepen, maar is al aan het spelen.");
        else if (!tapeLoopBuffer) console.log("DEBUG: playTapeLoop aangeroepen, maar geen buffer.");
        return;
    }
    if (isTapeLoopRecording) {
         console.warn("PlayTapeLoop called while still recording. Aborting play.");
         return;
    }

    if (tapeLoopSourceNode) {
        try { tapeLoopSourceNode.stop(); tapeLoopSourceNode.disconnect(); } catch(e){}
    }

    tapeLoopSourceNode = audioContext.createBufferSource();
    tapeLoopSourceNode.buffer = tapeLoopBuffer;
    tapeLoopSourceNode.loop = true;
    tapeLoopSourceNode.loopStart = 0;
    tapeLoopSourceNode.loopEnd = tapeLoopBuffer.duration;

    if (isGlobalSyncEnabled && tapeLoopRecordedAtBPM > 0 && globalBPM > 0) {
        tapeLoopSourceNode.playbackRate.value = globalBPM / tapeLoopRecordedAtBPM;
    } else {
        tapeLoopSourceNode.playbackRate.value = 1.0;
    }

    tapeLoopSourceNode.connect(masterGain);
    
    const now = audioContext.currentTime;
    let actualPlayTime = scheduledPlayTime > now ? scheduledPlayTime : now;

    if (isGlobalSyncEnabled && globalBPM > 0) {
        const quantizedPlayTime = getNextQuantizedTime(actualPlayTime, 1);
        actualPlayTime = quantizedPlayTime;
        
        scheduledTapeLoopEvents = scheduledTapeLoopEvents.filter(e => e.action !== 'startPlay');
        scheduledTapeLoopEvents.push({ time: actualPlayTime, action: 'startPlay' });
        
        if(tapeLoopStatusLabel) tapeLoopStatusLabel.textContent = `Armed (Wacht op tel voor play...)`;
        if(tapeLoopPlayBtn) tapeLoopPlayBtn.disabled = true; 
        console.log(`Tape loop playback armed. Will start at: ${actualPlayTime.toFixed(3)}`);

    } else {
        tapeLoopSourceNode.start(actualPlayTime);
        isTapeLoopPlaying = true;
        console.log("Tape loop playback started immediately at: " + actualPlayTime.toFixed(3));
        updateTapeLooperUI();
    }
}

function stopTapeLoopPlayback() {
    if(tapeLoopRecordBtn) tapeLoopRecordBtn.dataset.isArmed = 'false';
    tapeLoopRecordBtnClickable = true;
    scheduledTapeLoopEvents = scheduledTapeLoopEvents.filter(e => e.action !== 'startRec' && e.action !== 'startPlay' && e.action !== 'stopRecAndPlay');

    if (isTapeLoopPlaying && tapeLoopSourceNode) {
        try {
            tapeLoopSourceNode.stop(0);
            tapeLoopSourceNode.disconnect();
        } catch (e) {
            console.warn("Fout bij stoppen/loskoppelen tapeLoopSourceNode:", e);
        }
    }
    tapeLoopSourceNode = null;
    isTapeLoopPlaying = false;
    
    if(isTapeLoopRecording) {
        isTapeLoopRecording = false;
         if (scriptNodeForTapeLoop) {
            try { scriptNodeForTapeLoop.disconnect(); } catch(e) {}
            if (tapeLoopInputGate && scriptNodeForTapeLoop) {
                try { tapeLoopInputGate.disconnect(scriptNodeForTapeLoop); } catch(e) {}
            }
            scriptNodeForTapeLoop.onaudioprocess = null;
            scriptNodeForTapeLoop = null;
        }
        if(tapeLoopInputGate) {
            tapeLoopInputGate.gain.cancelScheduledValues(audioContext.currentTime);
            tapeLoopInputGate.gain.setValueAtTime(0.0, audioContext.currentTime);
        }
    }
    
    console.log("Tape loop playback/recording gestopt.");
    updateTapeLooperUI();
}

function clearTapeLoop() {
    stopTapeLoopPlayback();
    tapeLoopBuffer = null;
    tapeLoopWritePosition = 0;
    console.log("Tape loop cleared.");
    updateTapeLooperUI();
}

function stopTapeLoopRecordingAndPlay() {
    if (!isTapeLoopRecording) return;
    isTapeLoopRecording = false;

    if (scriptNodeForTapeLoop) {
        scriptNodeForTapeLoop.disconnect();
        scriptNodeForTapeLoop.onaudioprocess = null;
        scriptNodeForTapeLoop = null;
    }
    console.log("Tape loop recording finished.");
    updateTapeLooperUI();
    playTapeLoop();
}

function playTapeLoop() {
    if (!audioContext || !tapeLoopBuffer || isTapeLoopPlaying) return;
    if (isTapeLoopRecording) stopTapeLoopRecordingAndPlay();

    if (tapeLoopSourceNode) {
        try { tapeLoopSourceNode.stop(); tapeLoopSourceNode.disconnect(); } catch(e){}
    }

    tapeLoopSourceNode = audioContext.createBufferSource();
    tapeLoopSourceNode.buffer = tapeLoopBuffer;
    tapeLoopSourceNode.loop = true;
    tapeLoopSourceNode.loopStart = 0;
    tapeLoopSourceNode.loopEnd = tapeLoopBuffer.duration;

    tapeLoopSourceNode.connect(masterGain);
    tapeLoopSourceNode.start(0);
    isTapeLoopPlaying = true;
    console.log("Tape loop playback started.");
    updateTapeLooperUI();
}

function setGroupVolume(volume, sourceSliderId) {
  if (!groupVolumeGain || !audioContext) return;

  const newVol = Math.max(0, Math.min(1.5, parseFloat(volume)));

  groupVolumeGain.gain.setTargetAtTime(newVol, audioContext.currentTime, 0.01);

  const originalSlider = document.getElementById("groupVolumeSlider");
  if (originalSlider && sourceSliderId !== "groupVolumeSlider") {
      originalSlider.value = newVol;
  }

  const mixerSlider = document.getElementById("mixerGroupSlider"); 
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
  if (!isAudioReady || !audioContext) return;

  
  const existingGroupVolumes = new Map();
  identifiedGroups.forEach(group => {
      if (group.gainNode && group.nodeIds && group.nodeIds.size > 0) {
          const sortedNodeIds = Array.from(group.nodeIds).sort((a, b) => a - b);
          const canonicalKey = sortedNodeIds.join(',');
          existingGroupVolumes.set(canonicalKey, group.gainNode.gain.value);
          
      }
  });

  const visitedNodes = new Set();
  const newGroups = [];
  let nextGroupId = 0;

  
  identifiedGroups.forEach(g => {
      if (g.gainNode) {
          try { g.gainNode.disconnect(); } catch (e) {}
      }
  });
  identifiedGroups = []; 

  
  nodes.forEach(node => {
      if (CONSTELLATION_NODE_TYPES.includes(node.type) && !visitedNodes.has(node.id)) {
          const constellationNodeIds = findConstellation(node.id); 
          if (constellationNodeIds.size > 0) {
              constellationNodeIds.forEach(id => visitedNodes.add(id));

              const newGainNode = audioContext.createGain();
              const sortedNewNodeIds = Array.from(constellationNodeIds).sort((a, b) => a - b);
              const newCanonicalKey = sortedNewNodeIds.join(',');

              const savedVolume = existingGroupVolumes.get(newCanonicalKey);

              if (savedVolume !== undefined) {
                  newGainNode.gain.value = savedVolume;
                  
              } else {
                  newGainNode.gain.value = 1.0; 
                  
              }
              newGroups.push({ id: nextGroupId++, nodeIds: constellationNodeIds, gainNode: newGainNode });
          }
      }
  });

  identifiedGroups = newGroups;

  
  nodes.forEach(node => {
      const isRoutableAudioNode = (CONSTELLATION_NODE_TYPES.includes(node.type) ||
                                 node.type === 'nebula' ||
                                 node.type === PORTAL_NEBULA_TYPE) && node.audioNodes;

      if (isRoutableAudioNode) {
          const outputNode = node.audioNodes.gainNode || node.audioNodes.mainGain;
          if (!outputNode) return;

          let destinationNode;
          if (CONSTELLATION_NODE_TYPES.includes(node.type)) {
              const targetGroup = findGroupContainingNode(node.id);
              destinationNode = targetGroup ? targetGroup.gainNode : masterGain;
          } else if (node.type === 'nebula') {
              destinationNode = originalNebulaGroupGain || masterGain;
          } else if (node.type === PORTAL_NEBULA_TYPE) {
              destinationNode = portalGroupGain || masterGain;
          } else {
              destinationNode = masterGain; 
          }
          rerouteAudioForNode(node, destinationNode);
      }
  });

  connections.forEach(conn => {
      if (conn.type === 'string_violin' && conn.audioNodes) {
          const outputNode = conn.audioNodes.gainNode;
          if (!outputNode) return;

          const nodeA = findNodeById(conn.nodeAId);
          const nodeB = findNodeById(conn.nodeBId);
          const groupA = nodeA ? findGroupContainingNode(nodeA.id) : null;
          const groupB = nodeB ? findGroupContainingNode(nodeB.id) : null;
          let destinationNode = masterGain;
          if (groupA && groupA === groupB && CONSTELLATION_NODE_TYPES.includes(nodeA.type) && CONSTELLATION_NODE_TYPES.includes(nodeB.type)) {
               destinationNode = groupA.gainNode;
          }
          rerouteAudioForNode(conn, destinationNode);
      }
  });

  
  identifiedGroups.forEach(group => {
      if (group.gainNode) {
          
          try { group.gainNode.disconnect(masterGain); } catch(e) { /* Geen probleem als het nog niet verbonden was */ }
          group.gainNode.connect(masterGain);
      }
  });

  
  updateMixerGUI();
}

function createAudioNodesForNode(node) {
  if (!audioContext || (!["sound", "nebula", PORTAL_NEBULA_TYPE].includes(node.type) && !isDrumType(node.type))) {
      return null;
  }
  const now = audioContext.currentTime;
  const startDelay = now + 0.02;
  const params = node.audioParams;

  try {
      if (node.type === "sound") {
          const audioNodes = {
              gainNode: audioContext.createGain(),
              lowPassFilter: audioContext.createBiquadFilter(),
              reverbSendGain: null,
              delaySendGain: null,
              volLfo: audioContext.createOscillator(),
              volLfoGain: audioContext.createGain(),
              oscillator1: null,
              modulatorOsc1: null,
              modulatorGain1: null,
              oscillator2: null,
              osc2Gain: null,
              orbitoneOscillators: [],
              orbitoneIndividualGains: [],
              orbitoneModulatorOscs: [],
              orbitoneModulatorGains: []
          };

          audioNodes.gainNode.gain.setValueAtTime(0, now);
          audioNodes.lowPassFilter.type = params.filterType || "lowpass";
          audioNodes.lowPassFilter.Q.value = params.filterResonance || 1.2;
          audioNodes.lowPassFilter.connect(audioNodes.gainNode);

          if (isReverbReady && reverbNode) {
              audioNodes.reverbSendGain = audioContext.createGain();
              audioNodes.reverbSendGain.gain.value = params.reverbSend;
              audioNodes.gainNode.connect(audioNodes.reverbSendGain);
              audioNodes.reverbSendGain.connect(reverbNode);
          }
          if (isDelayReady && masterDelaySendGain) {
              audioNodes.delaySendGain = audioContext.createGain();
              audioNodes.delaySendGain.gain.value = params.delaySend;
              audioNodes.gainNode.connect(audioNodes.delaySendGain);
              audioNodes.delaySendGain.connect(masterDelaySendGain);
          }

          audioNodes.volLfo.type = params.lfo1Type || "sine";
          audioNodes.volLfo.frequency.setValueAtTime(params.volLfoRate || 0.2, now);
          audioNodes.volLfoGain.gain.value = fluctuatingGroupNodeIDs.has(node.id) ? parseFloat(groupFluctuateAmount.value) : (params.volLfoDepth || 0);
          audioNodes.volLfo.connect(audioNodes.volLfoGain);
          audioNodes.volLfoGain.connect(audioNodes.gainNode.gain);
          try { audioNodes.volLfo.start(startDelay); } catch (e) {}
          
          const osc1BaseWaveform = params.osc1Type || params.baseSoundType || params.carrierWaveform || params.actualOscillatorType || params.waveform || "sine";
          const validOscTypes = ["sine", "square", "sawtooth", "triangle"];
          const finalOsc1Waveform = validOscTypes.includes(osc1BaseWaveform) ? osc1BaseWaveform : (osc1BaseWaveform === "pulse" ? "square" : "sine");

          if (!(params.waveform && params.waveform.startsWith('sampler_'))) {
            audioNodes.oscillator1 = audioContext.createOscillator();
            audioNodes.oscillator1.type = finalOsc1Waveform;
            audioNodes.oscillator1.frequency.setValueAtTime(params.pitch, now);
            audioNodes.oscillator1.connect(audioNodes.lowPassFilter);
            try { audioNodes.oscillator1.start(startDelay); } catch (e) {}

            if (params.carrierWaveform && params.modulatorWaveform && audioNodes.oscillator1) { 
                audioNodes.modulatorOsc1 = audioContext.createOscillator();
                audioNodes.modulatorOsc1.type = params.modulatorWaveform;
                const modRatio = params.modulatorRatio || 1.0;
                audioNodes.modulatorOsc1.frequency.setValueAtTime(params.pitch * modRatio, now);
                audioNodes.modulatorGain1 = audioContext.createGain();
                audioNodes.modulatorGain1.gain.setValueAtTime(0, now);
                audioNodes.modulatorOsc1.connect(audioNodes.modulatorGain1);
                audioNodes.modulatorGain1.connect(audioNodes.oscillator1.frequency);
                try { audioNodes.modulatorOsc1.start(startDelay); } catch (e) {}
            }
             if (!params.orbitonesEnabled && params.osc2Type && !params.carrierWaveform && audioNodes.oscillator1) {
                 audioNodes.oscillator2 = audioContext.createOscillator();
                 audioNodes.oscillator2.type = validOscTypes.includes(params.osc2Type) ? params.osc2Type : (params.osc2Type === "pulse" ? "square" : "sine");
                 if (params.osc2Detune) audioNodes.oscillator2.detune.setValueAtTime(params.osc2Detune, now);
                 const osc2BaseFreq = params.pitch * Math.pow(2, (params.osc2Octave || 0));
                 audioNodes.oscillator2.frequency.setValueAtTime(osc2BaseFreq, now);
                 audioNodes.osc2Gain = audioContext.createGain();
                 audioNodes.osc2Gain.gain.value = params.osc2Mix || 0.5;
                 audioNodes.oscillator2.connect(audioNodes.osc2Gain);
                 audioNodes.osc2Gain.connect(audioNodes.lowPassFilter); 
                 try { audioNodes.oscillator2.start(startDelay); } catch (e) {}
            }
          }

          if (params.orbitonesEnabled && params.orbitoneCount > 0 && params.orbitoneIntervals) {
            const allFrequenciesForCreation = getOrbitoneFrequencies(
                params.scaleIndex, params.orbitoneCount, params.orbitoneIntervals,
                params.orbitoneSpread, currentScale, params.pitch
            );
            const actualOrbitoneFrequencies = allFrequenciesForCreation.slice(1);

            for (let i = 0; i < actualOrbitoneFrequencies.length; i++) {
                const freq = actualOrbitoneFrequencies[i];
                if (isNaN(freq) || freq <= 0) continue;

                if (!(params.waveform && params.waveform.startsWith('sampler_'))) {
                    const orbitOsc = audioContext.createOscillator();
                    orbitOsc.type = finalOsc1Waveform;
                    orbitOsc.frequency.setValueAtTime(freq, now);
                    
                    const orbitIndividualGainNode = audioContext.createGain();
                    const baseOrbitoneLevel = params.orbitoneMix !== undefined ? params.orbitoneMix : 0.5;
                    orbitIndividualGainNode.gain.setValueAtTime(baseOrbitoneLevel, now); 
                    
                    orbitOsc.connect(orbitIndividualGainNode);
                    orbitIndividualGainNode.connect(audioNodes.lowPassFilter);

                    try { orbitOsc.start(startDelay); } catch (e) {}
                    audioNodes.orbitoneOscillators.push(orbitOsc);
                    audioNodes.orbitoneIndividualGains.push(orbitIndividualGainNode);

                    if (params.carrierWaveform && params.modulatorWaveform) {
                        const modOsc = audioContext.createOscillator();
                        modOsc.type = params.modulatorWaveform;
                        const modRatio = params.modulatorRatio || 1.0; 
                        modOsc.frequency.setValueAtTime(freq * modRatio, now);
                        const modGain = audioContext.createGain();
                        modGain.gain.setValueAtTime(0, now); 
                        modOsc.connect(modGain);
                        modGain.connect(orbitOsc.frequency); 
                        try { modOsc.start(startDelay); } catch (e) {}
                        audioNodes.orbitoneModulatorOscs.push(modOsc);
                        audioNodes.orbitoneModulatorGains.push(modGain);
                    }
                }
            }
        }
          return audioNodes;
      } else if (node.type === "nebula") {
          const gainNode = audioContext.createGain(); gainNode.gain.value = 0;
          const filterNode = audioContext.createBiquadFilter();
          filterNode.type = params.filterType || "lowpass"; 
          filterNode.Q.value = params.filterResonance || NEBULA_FILTER_Q; 
          const baseFreq = params.pitch;
          const filterLfo = audioContext.createOscillator(); filterLfo.type = "sine"; filterLfo.frequency.setValueAtTime(NEBULA_FILTER_LFO_RATE, now);
          const filterLfoGain = audioContext.createGain(); filterLfoGain.gain.setValueAtTime(baseFreq * NEBULA_FILTER_LFO_DEPTH_FACTOR * (params.lfoDepthFactor || 1), now); filterLfo.connect(filterLfoGain); filterLfoGain.connect(filterNode.frequency);
          const volLfo = audioContext.createOscillator(); volLfo.type = "sine"; volLfo.frequency.setValueAtTime(NEBULA_VOL_LFO_RATE, now);
          const volLfoGain = audioContext.createGain(); volLfoGain.gain.value = NEBULA_VOL_LFO_DEPTH; volLfo.connect(volLfoGain); volLfoGain.connect(gainNode.gain);
          const oscillators = [];
          const baseWaveformForNebula = params.osc1Type || params.waveform || "sawtooth"; 
          const validOscTypes = ["sine", "square", "sawtooth", "triangle"];
          let waveformType = validOscTypes.includes(baseWaveformForNebula) ? baseWaveformForNebula : "sawtooth";
          if (baseWaveformForNebula === "fmBell" || baseWaveformForNebula === "fmXylo") waveformType = "sine";
          NEBULA_OSC_INTERVALS.forEach((interval, i) => {
              const osc = audioContext.createOscillator(); const freq = baseFreq * Math.pow(2, interval / 12); osc.frequency.setValueAtTime(freq, now); osc.detune.setValueAtTime((i % 2 === 0 ? 1 : -1) * (params.detune || NEBULA_OSC_DETUNE) * (i + 1), now); osc.type = waveformType; osc.connect(filterNode); oscillators.push(osc);
          });
          filterNode.connect(gainNode);
          let reverbSendGain = null; if (isReverbReady && reverbNode) { reverbSendGain = audioContext.createGain(); reverbSendGain.gain.value = params.reverbSend; gainNode.connect(reverbSendGain); reverbSendGain.connect(reverbNode); }
          let delaySendGain = null; if (isDelayReady && masterDelaySendGain) { delaySendGain = audioContext.createGain(); delaySendGain.gain.value = params.delaySend; gainNode.connect(delaySendGain); delaySendGain.connect(masterDelaySendGain); }
          const sizeRange = MAX_NODE_SIZE - MIN_NODE_SIZE; const normalizedSize = (node.size - MIN_NODE_SIZE) / (sizeRange || 1);
          const initialVol = Math.min(NEBULA_MAX_VOL, node.size * NEBULA_VOL_SCALING);
          const initialFilterFreq = params.filterCutoff || (baseFreq * 2 + normalizedSize * baseFreq * (params.filterFreqFactor || 12));
          filterNode.frequency.setValueAtTime(initialFilterFreq, now);
          gainNode.gain.linearRampToValueAtTime(initialVol, now + 0.5);
          try { filterLfo.start(startDelay); } catch (e) {}
          try { volLfo.start(startDelay); } catch (e) {}
          oscillators.forEach((osc) => { try { osc.start(startDelay); } catch (e) {} });
          if (originalNebulaGroupGain) { gainNode.connect(originalNebulaGroupGain); } else { gainNode.connect(masterGain); }
          return { gainNode, filterNode, filterLfo, filterLfoGain, volLfo, volLfoGain, oscillators, reverbSendGain, delaySendGain };
      } else if (node.type === PORTAL_NEBULA_TYPE) {
          const defaults = PORTAL_NEBULA_DEFAULTS;
          const mainGain = audioContext.createGain(); mainGain.gain.setValueAtTime(0, now); mainGain.gain.linearRampToValueAtTime(params.volume, now + 1.0); 
          const droneOsc = audioContext.createOscillator(); droneOsc.type = params.actualOscillatorType || 'triangle'; 
          droneOsc.frequency.setValueAtTime(params.pitch, now); 
          const droneFreqLfo = audioContext.createOscillator(); droneFreqLfo.type = 'sine'; droneFreqLfo.frequency.setValueAtTime(0.05 + Math.random() * 0.05, now);
          const droneFreqLfoGain = audioContext.createGain(); droneFreqLfoGain.gain.setValueAtTime(0.5 + Math.random() * 0.5, now); droneFreqLfo.connect(droneFreqLfoGain); droneFreqLfoGain.connect(droneOsc.frequency); droneOsc.connect(mainGain);
          const harmonics = []; const harmonicGain = audioContext.createGain(); harmonicGain.gain.setValueAtTime(defaults.harmonicBaseGain, now);
          const shimmerLfo = audioContext.createOscillator(); shimmerLfo.type = 'sine'; shimmerLfo.frequency.setValueAtTime(defaults.shimmerRate, now);
          const shimmerLfoGain = audioContext.createGain(); shimmerLfoGain.gain.setValueAtTime(defaults.shimmerDepth, now); shimmerLfo.connect(shimmerLfoGain); shimmerLfoGain.connect(harmonicGain.gain);
          for (let i = 0; i < defaults.numHarmonics; i++) {
              const harmonicOsc = audioContext.createOscillator(); harmonicOsc.type = 'sine';
              const freqMultiplier = Math.pow(2, (i + 1) * defaults.harmonicSpread * 0.5 + Math.random() * 0.1);
              harmonicOsc.frequency.setValueAtTime(params.pitch * freqMultiplier, now); 
              harmonicOsc.detune.setValueAtTime((Math.random() - 0.5) * 15, now); harmonicOsc.connect(harmonicGain); harmonics.push(harmonicOsc);
          }
          harmonicGain.connect(mainGain);
          let reverbSendGain = null; if (isReverbReady && reverbNode) { reverbSendGain = audioContext.createGain(); reverbSendGain.gain.value = params.reverbSend; mainGain.connect(reverbSendGain); reverbSendGain.connect(reverbNode); } 
          let delaySendGain = null; if (isDelayReady && masterDelaySendGain) { delaySendGain = audioContext.createGain(); delaySendGain.gain.value = params.delaySend; mainGain.connect(delaySendGain); delaySendGain.connect(masterDelaySendGain); } 
          try { droneOsc.start(startDelay); } catch (e) {}
          try { droneFreqLfo.start(startDelay); } catch (e) {}
          try { shimmerLfo.start(startDelay); } catch (e) {}
          harmonics.forEach(osc => { try { osc.start(startDelay); } catch (e) {} });
          if (portalGroupGain) { mainGain.connect(portalGroupGain); } else { mainGain.connect(masterGain); }
          return { mainGain, droneOsc, droneFreqLfo, droneFreqLfoGain, harmonics, harmonicGain, shimmerLfo, shimmerLfoGain, reverbSendGain, delaySendGain };
      } else if (isDrumType(node.type)) {
          const mainGain = audioContext.createGain(); mainGain.gain.value = params.volume; 
          let reverbSendGain = null; if (isReverbReady && reverbNode) { reverbSendGain = audioContext.createGain(); reverbSendGain.gain.value = params.reverbSend ?? DEFAULT_REVERB_SEND; mainGain.connect(reverbSendGain); reverbSendGain.connect(reverbNode); } 
          let delaySendGain = null; if (isDelayReady && masterDelaySendGain) { delaySendGain = audioContext.createGain(); delaySendGain.gain.value = params.delaySend ?? DEFAULT_DELAY_SEND; mainGain.connect(delaySendGain); delaySendGain.connect(masterDelaySendGain); } 
          return { mainGain, reverbSendGain, delaySendGain };
      }
  } catch (e) {
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
  
  if (!group || !group.gainNode || !audioContext) {
       console.warn(`setSpecificGroupDelaySend: Group ${groupId} or its gainNode not found, or audioContext not ready.`);
       return;
  }

  const newLevel = Math.max(0, Math.min(1.0, parseFloat(level)));
  const now = audioContext.currentTime;
  console.log(`Setting Group ${groupId} Delay Send to: ${newLevel.toFixed(2)}`); 

  
  group.nodeIds.forEach(nodeId => {
      const node = findNodeById(nodeId);
      
      if (node && node.audioParams && node.audioNodes) {
           
          node.audioParams.delaySend = newLevel;

          
          const delaySendGain = node.audioNodes.delaySendGain;
          if (delaySendGain) {
              console.log(`  - Node ${nodeId}: Updating delaySendGain to ${newLevel.toFixed(2)}`); 
              delaySendGain.gain.cancelScheduledValues(now);
              delaySendGain.gain.setTargetAtTime(newLevel, now, 0.01);
          } else {
               console.log(`  - Node ${nodeId}: No delaySendGain found.`); 
          }
      }
  });

  
  const delayValueSpan = document.getElementById(`mixerGroupDelayValue_${groupId}`);
  if (delayValueSpan) {
      delayValueSpan.textContent = newLevel.toFixed(2);
  }
  
  const delaySlider = document.getElementById(`mixerGroupDelaySlider_${groupId}`);
   if (delaySlider) {
        delaySlider.value = newLevel; 
   }

  
}

function setSpecificGroupVolume(groupId, volume) {
  const group = identifiedGroups.find(g => g.id === groupId);
  if (!group || !group.gainNode || !audioContext) return;

  const newVol = Math.max(0, Math.min(1.5, parseFloat(volume)));

  
  group.gainNode.gain.setTargetAtTime(newVol, audioContext.currentTime, 0.01);

  
  const mixerSlider = document.getElementById(`mixerGroupSlider_${groupId}`);
  const mixerValueSpan = document.getElementById(`mixerGroupValue_${groupId}`);

  if (mixerSlider) {
      mixerSlider.value = newVol;
  }
  if (mixerValueSpan) {
      mixerValueSpan.textContent = newVol.toFixed(2);
  }
  
}

function setSpecificGroupReverbSend(groupId, level) {
  const group = identifiedGroups.find(g => g.id === groupId);
  if (!group || !group.gainNode || !audioContext || !isReverbReady) { 
       
       return;
  }

  const newLevel = Math.max(0, Math.min(1.0, parseFloat(level)));
  const now = audioContext.currentTime;
  

  group.nodeIds.forEach(nodeId => {
      const node = findNodeById(nodeId);
      
      if (node && node.audioParams && node.audioNodes) {
          node.audioParams.reverbSend = newLevel; 

          const reverbSendGain = node.audioNodes.reverbSendGain; 
          if (reverbSendGain) {
              
              reverbSendGain.gain.cancelScheduledValues(now);
              reverbSendGain.gain.setTargetAtTime(newLevel, now, 0.01); 
          } else {
              
          }
      }
  });

  
  const reverbValueSpan = document.getElementById(`mixerGroupReverbValue_${groupId}`);
  if (reverbValueSpan) {
      reverbValueSpan.textContent = newLevel.toFixed(2);
  }
  
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
       portalContainer.style.borderLeft = "3px solid var(--pulsar-triggerable-border, #aaf)"; 

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
       let initialPortalDelay = DEFAULT_DELAY_SEND * 1.2; 
       const firstPortal = nodes.find(n => n.type === PORTAL_NEBULA_TYPE);
       if (firstPortal && firstPortal.audioParams) initialPortalDelay = firstPortal.audioParams.delaySend;
       portalDelaySlider.value = initialPortalDelay.toFixed(2);
       portalDelaySlider.title = `Delay Send for all Portal Drones`;
       portalDelaySlider.addEventListener("input", (e) => {
           const newSend = parseFloat(e.target.value);
           nodes.forEach(node => {
               if (node.type === PORTAL_NEBULA_TYPE && node.audioNodes?.delaySendGain?.gain) {
                   node.audioParams.delaySend = newSend; 
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
          let initialPortalReverb = DEFAULT_REVERB_SEND * 1.5; 
          if (firstPortal && firstPortal.audioParams) initialPortalReverb = firstPortal.audioParams.reverbSend;
           portalReverbSlider.value = initialPortalReverb.toFixed(2);
          portalReverbSlider.title = `Reverb Send for all Portal Drones`;
          portalReverbSlider.addEventListener("input", (e) => {
              const newSend = parseFloat(e.target.value);
              nodes.forEach(node => {
                  if (node.type === PORTAL_NEBULA_TYPE && node.audioNodes?.reverbSendGain?.gain) {
                      node.audioParams.reverbSend = newSend; 
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
       nebulaContainer.style.borderLeft = "3px solid var(--nebula-border, #adf)"; 

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
  if (!node.audioNodes || !isAudioReady) return;
  const now = audioContext.currentTime;
  const params = node.audioParams;
  const pitchUpdateTimeConstant = 0.05; 
  const generalUpdateTimeConstant = 0.02;
  const { 
      oscillator1, oscillator2, osc2Gain, 
      lowPassFilter, reverbSendGain, delaySendGain, 
      modulatorOsc1, modulatorGain1, 
      volLfoGain, 
      orbitoneOscillators, orbitoneIndividualGains, orbitoneModulatorOscs, orbitoneModulatorGains 
    } = node.audioNodes;

  try {
      if (node.type === "sound") {
          if (lowPassFilter) {
              const sizeRange = MAX_NODE_SIZE - MIN_NODE_SIZE;
              const freqRange = MAX_FILTER_FREQ - MIN_FILTER_FREQ;
              const normalizedSize = (node.size - MIN_NODE_SIZE) / (sizeRange || 1);
              const currentFilterFreq = MIN_FILTER_FREQ + normalizedSize * freqRange;
              params.lowPassFreq = currentFilterFreq;
              lowPassFilter.frequency.setTargetAtTime(params.lowPassFreq, now, generalUpdateTimeConstant);
          }
          if (isReverbReady && reverbSendGain) {
              reverbSendGain.gain.setTargetAtTime(params.reverbSend ?? DEFAULT_REVERB_SEND, now, generalUpdateTimeConstant);
          }
          if (isDelayReady && delaySendGain) {
              delaySendGain.gain.setTargetAtTime(params.delaySend ?? DEFAULT_DELAY_SEND, now, generalUpdateTimeConstant);
          }
          if (volLfoGain) {
              const shouldFluctuate = fluctuatingGroupNodeIDs.has(node.id);
              const fluctuationAmount = parseFloat(groupFluctuateAmount.value);
              const targetLfoDepth = shouldFluctuate ? fluctuationAmount : (params.volLfoDepth || 0);
              volLfoGain.gain.setTargetAtTime(targetLfoDepth, now, 0.1);
          }

        const allOutputFrequencies = getOrbitoneFrequencies(
            params.scaleIndex, 
            params.orbitonesEnabled ? params.orbitoneCount : 0,
            params.orbitoneIntervals, 
            params.orbitoneSpread, 
            currentScale, 
            params.pitch
        );
        const mainNoteFreq = allOutputFrequencies[0];
        const orbitoneBaseMixLevel = params.orbitoneMix !== undefined ? params.orbitoneMix : 0.5;


        if (oscillator1 && !isNaN(mainNoteFreq) && mainNoteFreq > 0) {
             oscillator1.frequency.setTargetAtTime(mainNoteFreq, now, pitchUpdateTimeConstant);
             if (audioNodes.oscillator1Gain) { 
                 audioNodes.oscillator1Gain.gain.setTargetAtTime(params.orbitonesEnabled ? (1.0 - orbitoneBaseMixLevel) : 1.0, now, generalUpdateTimeConstant);
             }
             if (modulatorOsc1 && params.carrierWaveform) {
                 const modRatio = params.modulatorRatio || 1.0;
                 modulatorOsc1.frequency.setTargetAtTime(mainNoteFreq * modRatio, now, pitchUpdateTimeConstant);
             }
             if(oscillator2 && osc2Gain && params.osc2Type && !params.carrierWaveform && !params.orbitonesEnabled) {
                const osc2BaseFreq = mainNoteFreq * Math.pow(2, (params.osc2Octave || 0));
                oscillator2.frequency.setTargetAtTime(osc2BaseFreq, now, pitchUpdateTimeConstant);
            }
        }

        if (params.orbitonesEnabled && orbitoneOscillators && orbitoneIndividualGains) {
            for (let i = 0; i < params.orbitoneCount; i++) {
                if ((i + 1) >= allOutputFrequencies.length || i >= orbitoneOscillators.length) continue; 
                const freq = allOutputFrequencies[i + 1]; 
                const orbitOsc = orbitoneOscillators[i];
                const orbitIndGain = orbitoneIndividualGains[i];

                if(orbitOsc && !isNaN(freq) && freq > 0) {
                    orbitOsc.frequency.setTargetAtTime(freq, now, pitchUpdateTimeConstant);
                    if (params.orbitoneDetune > 0) {
                         orbitOsc.detune.setTargetAtTime((Math.random() - 0.5) * 2 * params.orbitoneDetune, now, pitchUpdateTimeConstant);
                    }
                }
                if(orbitIndGain) {
                    let volMultiplier = orbitoneBaseMixLevel / Math.max(1, params.orbitoneCount);
                     if(params.orbitoneVolumeVariation > 0){
                        volMultiplier *= (1.0 - (Math.random() * params.orbitoneVolumeVariation));
                    }
                    orbitIndGain.gain.setTargetAtTime(Math.min(1.0, Math.max(0.01, volMultiplier)), now, generalUpdateTimeConstant);
                }
                if (orbitoneModulatorOscs && orbitoneModulatorOscs[i] && params.carrierWaveform && !isNaN(freq) && freq > 0) {
                    const modOsc = orbitoneModulatorOscs[i];
                    const modRatio = params.modulatorRatio || 1.0;
                    modOsc.frequency.setTargetAtTime(freq * modRatio, now, pitchUpdateTimeConstant);
                }
            }
        }
      } else if (node.type === "nebula") {
          const { gainNode, filterNode, filterLfoGain, volLfoGain: nebVolLfoGain, oscillators, reverbSendGain: nebReverbSend, delaySendGain: nebDelaySend } = node.audioNodes;
          if (!gainNode || !filterNode || !oscillators || !filterLfoGain || !nebVolLfoGain) return;
          const sizeRange = MAX_NODE_SIZE - MIN_NODE_SIZE;
          const normalizedSize = (node.size - MIN_NODE_SIZE) / (sizeRange || 1);
          const baseFreq = params.pitch; 
          const targetVol = Math.min(NEBULA_MAX_VOL, node.size * NEBULA_VOL_SCALING * 1.5);
          gainNode.gain.setTargetAtTime(targetVol, now, 0.1);
          const filterFreq = baseFreq * 2 + normalizedSize * baseFreq * (params.filterFreqFactor || 12);
          if (!isNaN(filterFreq) && filterFreq > 0) filterNode.frequency.setTargetAtTime(filterFreq, now, 0.1);
          const lfoDepth = baseFreq * NEBULA_FILTER_LFO_DEPTH_FACTOR * (params.lfoDepthFactor || 1);
          if (!isNaN(lfoDepth)) filterLfoGain.gain.setTargetAtTime(lfoDepth, now, 0.1);
          nebVolLfoGain.gain.setTargetAtTime(NEBULA_VOL_LFO_DEPTH, now, 0.1);
          oscillators.forEach((osc, i) => {
              const interval = NEBULA_OSC_INTERVALS[i];
              const freq = baseFreq * Math.pow(2, interval / 12);
              if (!isNaN(freq) && freq > 0) osc.frequency.setTargetAtTime(freq, now, 0.1); 
              const detuneAmount = params.detune || NEBULA_OSC_DETUNE || 7;
              osc.detune.setTargetAtTime((i % 2 === 0 ? 1 : -1) * detuneAmount * (i + 1), now, 0.1);
              const desiredWaveform = (params.waveform === "fmBell" || params.waveform === "fmXylo") ? "sine" : (params.waveform || "sawtooth");
              if (osc.type !== desiredWaveform) { osc.type = desiredWaveform; }
          });
          if (isReverbReady && nebReverbSend) {
              nebReverbSend.gain.setTargetAtTime(params.reverbSend ?? DEFAULT_REVERB_SEND, now, generalUpdateTimeConstant);
          }
          if (isDelayReady && nebDelaySend) {
              nebDelaySend.gain.setTargetAtTime(params.delaySend ?? DEFAULT_DELAY_SEND, now, generalUpdateTimeConstant);
          }
      } else if (isDrumType(node.type)) {
          const { mainGain, reverbSendGain: drumReverbSend, delaySendGain: drumDelaySend } = node.audioNodes;
          if (mainGain) mainGain.gain.setTargetAtTime(params.volume ?? 1.0, now, generalUpdateTimeConstant);
          if (isReverbReady && drumReverbSend) {
              drumReverbSend.gain.setTargetAtTime(params.reverbSend ?? DEFAULT_REVERB_SEND, now, generalUpdateTimeConstant);
          }
          if (isDelayReady && drumDelaySend) {
              drumDelaySend.gain.setTargetAtTime(params.delaySend ?? DEFAULT_DELAY_SEND, now, generalUpdateTimeConstant);
          }
      }
  } catch (e) {}
}

function updateConnectionAudioParams(connection) {
  if (!connection.audioNodes || connection.type !== "string_violin" || !isAudioReady) return;
  const now = audioContext.currentTime;
  const params = connection.audioParams;
  const timeConstantForPitch = 0.05; 

  try {
      const { gainNode, filterNode, reverbSendGain, delaySendGain, oscillators, vibratoLfo, vibratoGain } = connection.audioNodes;
      if (!gainNode || !filterNode || !oscillators || !vibratoLfo || !vibratoGain) return;

      oscillators.forEach((osc, i) => {
          const freq = params.pitch;
          const detuneAmount = i === 0 ? 0 : ((i % 2 === 1 ? 1 : -1) * Math.ceil(i / 2) * (params.detune ?? STRING_VIOLIN_DEFAULTS.detune));
          osc.frequency.setTargetAtTime(freq, now, timeConstantForPitch); 
          osc.detune.setTargetAtTime(detuneAmount, now, timeConstantForPitch); 
      });

      filterNode.frequency.setTargetAtTime(
          params.pitch * (params.filterFreqFactor ?? STRING_VIOLIN_DEFAULTS.filterFreqFactor),
          now,
          timeConstantForPitch 
      );
      filterNode.Q.setTargetAtTime(params.filterQ ?? STRING_VIOLIN_DEFAULTS.filterQ, now, 0.02); 

      vibratoLfo.frequency.setTargetAtTime(params.vibratoRate ?? STRING_VIOLIN_DEFAULTS.vibratoRate, now, 0.02); 
      vibratoGain.gain.setTargetAtTime(params.vibratoDepth ?? STRING_VIOLIN_DEFAULTS.vibratoDepth, now, 0.02); 

      if (isReverbReady && reverbSendGain) {
          reverbSendGain.gain.setTargetAtTime(params.reverbSend ?? DEFAULT_REVERB_SEND, now, 0.02);
      }
      if (isDelayReady && delaySendGain) {
          delaySendGain.gain.setTargetAtTime(params.delaySend ?? DEFAULT_DELAY_SEND, now, 0.02);
      }
  } catch (e) {
      console.error(`Error updating connection audio params for ${connection.id}:`, e);
  }
}

function createAudioNodesForConnection(connection) {
  if (!audioContext || connection.type !== "string_violin") return null;
  const now = audioContext.currentTime;
  const startDelay = now + 0.02;
  try {
      const params = connection.audioParams;
      const gainNode = audioContext.createGain(); 
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
      filterNode.connect(gainNode); 

      
      let reverbSendGain = null;
      if (isReverbReady && reverbNode) {
          reverbSendGain = audioContext.createGain();
          reverbSendGain.gain.value = params.reverbSend ?? DEFAULT_REVERB_SEND;
          
          
      }
      let delaySendGain = null;
      if (isDelayReady && masterDelaySendGain) {
          delaySendGain = audioContext.createGain();
          delaySendGain.gain.value = params.delaySend ?? DEFAULT_DELAY_SEND;
          
          
      }

      try { vibratoLfo.start(startDelay); } catch (e) {}
      oscillators.forEach((osc) => { try { osc.start(startDelay); } catch (e) {} });

      
      return { gainNode, filterNode, oscillators, vibratoLfo, vibratoGain, reverbSendGain, delaySendGain };
  } catch (e) {
      console.error(`Error creating audio nodes for connection ${connection.id}:`, e);
      return null;
  }
}
function triggerNodeEffect(node, pulseData = {}, startFrequency = null, glideDuration = 0.3) {
  if (!isAudioReady || !node || !node.audioParams) return;
  const now = audioContext.currentTime;
  const params = node.audioParams;
  const intensity = pulseData.intensity ?? 1.0;
  const ampEnv = params.ampEnv || { attack: 0.01, decay: 0.3, sustain: 0.7, release: 0.3 };

  if (node.type === 'sound') {
    if (!node.audioNodes || !node.audioNodes.gainNode || !node.audioNodes.lowPassFilter) {
        node.isTriggered = false; node.animationState = 0; return;
    }
    node.isTriggered = true;
    node.animationState = 1;
    const {
        gainNode, lowPassFilter,
        oscillator1, modulatorOsc1, modulatorGain1,
        oscillator2, osc2Gain,
        orbitoneOscillators, orbitoneModulatorOscs, orbitoneModulatorGains, orbitoneIndividualGains
    } = node.audioNodes;

    const baseVolume = 0.6;
    const targetVolume = baseVolume * intensity;
    const clampedVolume = Math.max(0.01, Math.min(1.0, targetVolume));

    gainNode.gain.cancelScheduledValues(now);
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(clampedVolume, now + ampEnv.attack);
    gainNode.gain.setTargetAtTime(clampedVolume * ampEnv.sustain, now + ampEnv.attack, ampEnv.decay / 3 + 0.001);

    const totalDurationForMainNodeEnvelope = (ampEnv.attack + ampEnv.decay + (ampEnv.sustain > 0 ? 0.5 : 0));
    const mainNodeReleaseTimeConstant = ampEnv.release / 3 + 0.001;
    setTimeout(() => {
      const stillNode = findNodeById(node.id);
      if (stillNode && stillNode.audioNodes?.gainNode) {
        const currentGainVal = stillNode.audioNodes.gainNode.gain.value;
        stillNode.audioNodes.gainNode.gain.cancelScheduledValues(audioContext.currentTime);
        stillNode.audioNodes.gainNode.gain.setValueAtTime(currentGainVal, audioContext.currentTime);
        stillNode.audioNodes.gainNode.gain.setTargetAtTime(0, audioContext.currentTime, mainNodeReleaseTimeConstant);
      }
      if (stillNode) stillNode.isTriggered = false;
    }, totalDurationForMainNodeEnvelope * 1000);

    if (params.waveform && params.waveform.startsWith('sampler_')) {
        console.log(`[Sampler Trigger AANGEPAST] Attempting sampler: ${params.waveform} for node ${node.id}`);
        const samplerId = params.waveform.replace('sampler_', '');
        const definition = SAMPLER_DEFINITIONS.find(s => s.id === samplerId);

        console.log(`[Sampler Trigger AANGEPAST] Definition for ${samplerId}: ${!!definition}, Loaded: ${definition?.isLoaded}, Buffer: ${!!definition?.buffer}`);

        if (definition && definition.isLoaded && definition.buffer) {
            console.log(`[Sampler Trigger AANGEPAST] Conditions MET for playing ${samplerId}`);

            const allOutputFrequencies = getOrbitoneFrequencies(
                params.scaleIndex,
                params.orbitonesEnabled ? params.orbitoneCount : 0,
                params.orbitoneIntervals,
                params.orbitoneSpread,
                currentScale,
                params.pitch
            );

            allOutputFrequencies.forEach((freq, index) => {
                if (isNaN(freq) || freq <= 0) {
                    console.warn(`[Sampler Play AANGEPAST] Invalid frequency for note ${index} of ${samplerId}: ${freq}`);
                    return;
                }
                const isMainNote = index === 0;
                const timingOffsetMs = isMainNote ? 0 : (params.orbitoneTimingOffsets && params.orbitoneTimingOffsets[index-1] !== undefined ? params.orbitoneTimingOffsets[index-1] : 0);
                const scheduledStartTime = now + (timingOffsetMs / 1000.0);

                const source = audioContext.createBufferSource();
                source.buffer = definition.buffer;
                let targetRate = 1;
                if (definition.baseFreq > 0) {
                    targetRate = Math.max(0.1, Math.min(8, freq / definition.baseFreq));
                }
                source.playbackRate.setValueAtTime(targetRate, scheduledStartTime);

                const perNoteSamplerGain = audioContext.createGain();

                // --- AANPASSING HIER ---
                let noteVolumeFactor;
                if (params.orbitonesEnabled && params.orbitoneCount > 0) {
                    // Als orbitones AAN staan, gebruik de mix logic
                    const orbitoneBaseMixLevel = params.orbitoneMix !== undefined ? params.orbitoneMix : 0.5;
                    noteVolumeFactor = isMainNote ? (1.0 - orbitoneBaseMixLevel) : (orbitoneBaseMixLevel / Math.max(1, params.orbitoneCount));
                } else {
                    // Als orbitones UIT staan, krijgt de hoofdnoot vol volume (factor 1.0), anderen 0
                    noteVolumeFactor = isMainNote ? 1.0 : 0;
                }
                // --- EINDE AANPASSING ---

                const finalNoteVolume = clampedVolume * noteVolumeFactor;

                console.log(`[Sampler Play AANGEPAST] Node: ${node.id}, Sampler: ${samplerId}, NoteIndex: ${index}, Freq: ${freq.toFixed(2)}, Rate: ${targetRate.toFixed(2)}, FinalVol: ${finalNoteVolume.toFixed(3)}, ClampedVol: ${clampedVolume.toFixed(3)}, Intensity: ${intensity.toFixed(3)}, NoteVolFactor: ${noteVolumeFactor.toFixed(3)}`);

                if (finalNoteVolume < 0.001 && isMainNote) { // Voeg check toe voor hoofdnoot
                    console.warn(`[Sampler Play AANGEPAST] Main note for ${samplerId} has near-zero volume. Skipping play.`);
                    return; // Skip als hoofdnoot te zacht is
                }
                 if (finalNoteVolume < 0.001 && !isMainNote) { // Orbitone is te zacht, skip deze specifieke orbitone
                    return;
                }


                perNoteSamplerGain.gain.setValueAtTime(0, scheduledStartTime);
                perNoteSamplerGain.gain.linearRampToValueAtTime(finalNoteVolume, scheduledStartTime + 0.005); // 5ms attack

                source.connect(perNoteSamplerGain);
                perNoteSamplerGain.connect(lowPassFilter);

                console.log(`[Sampler Play AANGEPAST] Starting source for ${samplerId} (note ${index}) at ${scheduledStartTime.toFixed(3)}`);
                source.start(scheduledStartTime);

                const estimatedEnvelopeDuration = ampEnv.attack + ampEnv.decay + (ampEnv.sustain > 0 ? 0.3 : 0);
                const bufferActualDuration = definition.buffer.duration / targetRate;
                const stopTime = scheduledStartTime + Math.min(bufferActualDuration, estimatedEnvelopeDuration + ampEnv.release * 0.5);

                perNoteSamplerGain.gain.setTargetAtTime(0.0001, scheduledStartTime + estimatedEnvelopeDuration, ampEnv.release / 4 + 0.001);
                if (bufferActualDuration < (estimatedEnvelopeDuration + ampEnv.release)) {
                     source.stop(stopTime);
                }
                source.onended = () => {
                    try {
                        perNoteSamplerGain.disconnect();
                        source.disconnect();
                        console.log(`[Sampler Play AANGEPAST] Sampler source ${samplerId} (note ${index}) ended and disconnected.`);
                    } catch(e){}
                };
            });
        } else {
            console.warn(`[Sampler Trigger AANGEPAST] Sampler conditions NOT MET for ${samplerId} AT TRIGGER TIME. Loaded: ${definition?.isLoaded}, Buffer: ${!!definition?.buffer}`);
            if (oscillator1) { // Fallback naar oscillator
              const fallbackFreq = params.pitch;
              oscillator1.frequency.cancelScheduledValues(now);
              oscillator1.frequency.setTargetAtTime(fallbackFreq, now, 0.005);
               if (modulatorOsc1 && modulatorGain1 && params.carrierWaveform) { /* ... FM fallback ... */ }
            }
        }
    } else if (oscillator1) { // Dit is voor niet-sampler 'sound' nodes (Oscillator-based)
        const targetFreq = params.pitch;
        oscillator1.frequency.cancelScheduledValues(now);
        oscillator1.frequency.setTargetAtTime(targetFreq, now, 0.005);

        if (oscillator2 && osc2Gain && params.osc2Type && !params.carrierWaveform && !params.orbitonesEnabled) {
            const osc2BaseFreq = targetFreq * Math.pow(2, (params.osc2Octave || 0));
            oscillator2.frequency.cancelScheduledValues(now);
            oscillator2.frequency.setTargetAtTime(osc2BaseFreq, now, 0.005);
        }

        if (modulatorOsc1 && modulatorGain1 && params.carrierWaveform) {
            const modRatio = params.modulatorRatio || 1.0;
            modulatorOsc1.frequency.cancelScheduledValues(now);
            modulatorOsc1.frequency.setTargetAtTime(targetFreq * modRatio, now, 0.005);
            const modEnv = params.modulatorEnv || { attack: 0.005, decay: 0.15, sustain: 0, release: 0.2 };
            const fmDepthScale = params.modulatorDepthScale !== undefined ? params.modulatorDepthScale : 2;
            const modDepth = targetFreq * fmDepthScale;
            modulatorGain1.gain.cancelScheduledValues(now);
            modulatorGain1.gain.setValueAtTime(0, now);
            modulatorGain1.gain.linearRampToValueAtTime(modDepth, now + modEnv.attack);
            const modSustainLevel = modEnv.sustain > 0 ? modDepth * modEnv.sustain : 0.0001;
            modulatorGain1.gain.setTargetAtTime(modSustainLevel, now + modEnv.attack, modEnv.decay / 3 + 0.001);
            const totalModDuration = (ampEnv.attack + ampEnv.decay + (ampEnv.sustain > 0 ? 0.3 : 0));
             setTimeout(() => {
                if (modulatorGain1 && audioContext && audioContext.state === 'running') {
                    const currentModGainVal = modulatorGain1.gain.value;
                    modulatorGain1.gain.cancelScheduledValues(audioContext.currentTime);
                    modulatorGain1.gain.setValueAtTime(currentModGainVal, audioContext.currentTime);
                    modulatorGain1.gain.setTargetAtTime(0.0001, audioContext.currentTime, (modEnv.release || 0.2) / 3 + 0.001);
                }
            }, totalModDuration * 1000);
        }
        // Hier zou de orbitone logic voor oscillator-based sounds ook moeten komen als je die later weer activeert
         if (params.orbitonesEnabled && orbitoneOscillators && orbitoneIndividualGains && !(params.waveform && params.waveform.startsWith('sampler_'))) {
            allOutputFrequencies.slice(1).forEach((freq, i) => { // Start vanaf index 1 voor orbitones
                const orbitOsc = orbitoneOscillators[i];
                const orbitIndGain = orbitoneIndividualGains[i];
                const modOsc = orbitoneModulatorOscs ? orbitoneModulatorOscs[i] : null;
                const modGain = orbitoneModulatorGains ? orbitoneModulatorGains[i] : null;
                const timingOffsetMs = params.orbitoneTimingOffsets && params.orbitoneTimingOffsets[i] !== undefined ? params.orbitoneTimingOffsets[i] : 0;
                const scheduledOrbitoneStartTime = now + (timingOffsetMs / 1000.0);

                if (orbitOsc && orbitIndGain && !isNaN(freq) && freq > 0) {
                    orbitOsc.frequency.cancelScheduledValues(scheduledOrbitoneStartTime);
                    orbitOsc.frequency.setTargetAtTime(freq, scheduledOrbitoneStartTime, 0.005);

                    const orbitoneBaseMixLevel = params.orbitoneMix !== undefined ? params.orbitoneMix : 0.5;
                    let volMultiplier = orbitoneBaseMixLevel / Math.max(1, params.orbitoneCount);
                    orbitIndGain.gain.cancelScheduledValues(scheduledOrbitoneStartTime);
                    orbitIndGain.gain.setTargetAtTime(Math.min(1.0, Math.max(0.01, volMultiplier * clampedVolume)), scheduledOrbitoneStartTime, 0.01);


                    if (modOsc && modGain && params.carrierWaveform) {
                        // Modulator logic voor orbitone
                        const modRatio = params.modulatorRatio || 1.0;
                        modOsc.frequency.cancelScheduledValues(scheduledOrbitoneStartTime);
                        modOsc.frequency.setTargetAtTime(freq * modRatio, scheduledOrbitoneStartTime, 0.005);
                        const modEnv = params.modulatorEnv || { attack: 0.005, decay: 0.15, sustain: 0, release: 0.2 };
                        const fmDepthScale = params.modulatorDepthScale !== undefined ? params.modulatorDepthScale : 2;
                        const modDepth = freq * fmDepthScale;
                        modGain.gain.cancelScheduledValues(scheduledOrbitoneStartTime);
                        modGain.gain.setValueAtTime(0, scheduledOrbitoneStartTime);
                        modGain.gain.linearRampToValueAtTime(modDepth, scheduledOrbitoneStartTime + modEnv.attack);
                        const modSustainLevel = modEnv.sustain > 0 ? modDepth * modEnv.sustain : 0.0001;
                        modGain.gain.setTargetAtTime(modSustainLevel, scheduledOrbitoneStartTime + modEnv.attack, modEnv.decay / 3 + 0.001);
                         const totalModDurationOrb = (ampEnv.attack + ampEnv.decay + (ampEnv.sustain > 0 ? 0.3 : 0));
                        setTimeout(() => {
                            if (modGain && audioContext && audioContext.state === 'running') {
                                 const currentModGainVal = modGain.gain.value;
                                 modGain.gain.cancelScheduledValues(audioContext.currentTime);
                                 modGain.gain.setValueAtTime(currentModGainVal, audioContext.currentTime);
                                 modGain.gain.setTargetAtTime(0.0001, audioContext.currentTime, (modEnv.release || 0.2) / 3 + 0.001);
                            }
                        }, (totalModDurationOrb + timingOffsetMs) * 1000);
                    }
                }
            });
        }
    }

    const particleCount = Math.round(5 + Math.floor(node.size * 3) * (pulseData.particleMultiplier ?? 1.0));
    createParticles(node.x, node.y, particleCount);

  } else if (isDrumType(node.type)) {
    // Drum logic (neem aan dat dit werkt zoals voorheen)
    if (!node.audioNodes?.mainGain) return;
    node.isTriggered = true; node.animationState = 1;
    const soundParams = params; const mainGain = node.audioNodes.mainGain;
    const finalVol = soundParams.volume * intensity;
    const targetFreq = soundParams.baseFreq;
    try {
      if (node.type === 'drum_kick') { const osc = audioContext.createOscillator(); const gain = audioContext.createGain(); const kickStartFreq = targetFreq * 2.5; osc.frequency.setValueAtTime(kickStartFreq, now); osc.frequency.exponentialRampToValueAtTime(targetFreq, now + 0.05); gain.gain.setValueAtTime(finalVol, now); gain.gain.exponentialRampToValueAtTime(0.001, now + soundParams.decay); osc.connect(gain); gain.connect(mainGain); osc.start(now); osc.stop(now + soundParams.decay + 0.05);
      } else if (node.type === "drum_snare") { const noiseDur = soundParams.noiseDecay ?? 0.15; const bodyDecay = soundParams.decay ?? 0.2; const noise = audioContext.createBufferSource(); const noiseBuffer = audioContext.createBuffer(1, audioContext.sampleRate * noiseDur, audioContext.sampleRate); const output = noiseBuffer.getChannelData(0); for (let i = 0; i < output.length; i++) { output[i] = Math.random() * 2 - 1; } noise.buffer = noiseBuffer; const noiseFilter = audioContext.createBiquadFilter(); noiseFilter.type = 'highpass'; noiseFilter.frequency.value = 1500; const noiseGain = audioContext.createGain(); noiseGain.gain.setValueAtTime(finalVol * 0.8, now); noiseGain.gain.exponentialRampToValueAtTime(0.001, now + noiseDur); noise.connect(noiseFilter); noiseFilter.connect(noiseGain); noiseGain.connect(mainGain); noise.start(now); noise.stop(now + noiseDur + 0.01); const osc = audioContext.createOscillator(); const gain = audioContext.createGain(); osc.type = 'triangle'; osc.frequency.setValueAtTime(soundParams.baseFreq, now); gain.gain.setValueAtTime(finalVol * 0.7, now); gain.gain.exponentialRampToValueAtTime(0.01, now + bodyDecay); osc.connect(gain); gain.connect(mainGain); osc.start(now); osc.stop(now + bodyDecay + 0.01);
      } else if (node.type === 'drum_hihat') { const decay = soundParams.decay ?? 0.05; const noise = audioContext.createBufferSource(); const noiseBuffer = audioContext.createBuffer(1, audioContext.sampleRate * decay, audioContext.sampleRate); const output = noiseBuffer.getChannelData(0); for (let i = 0; i < output.length; i++) { output[i] = Math.random() * 2 - 1; } noise.buffer = noiseBuffer; const noiseFilter = audioContext.createBiquadFilter(); noiseFilter.type = 'highpass'; noiseFilter.frequency.value = soundParams.baseFreq; const noiseGain = audioContext.createGain(); noiseGain.gain.setValueAtTime(finalVol, now); noiseGain.gain.exponentialRampToValueAtTime(0.001, now + decay); noise.connect(noiseFilter); noiseFilter.connect(noiseGain); noiseGain.connect(mainGain); noise.start(now); noise.stop(now + decay + 0.01);
      } else if (node.type === 'drum_clap') { const decay = soundParams.noiseDecay ?? 0.1; const noise = audioContext.createBufferSource(); const noiseBuffer = audioContext.createBuffer(1, audioContext.sampleRate * decay * 1.5, audioContext.sampleRate); const output = noiseBuffer.getChannelData(0); for (let i = 0; i < output.length; i++) { output[i] = Math.random() * 2 - 1; } noise.buffer = noiseBuffer; const noiseFilter = audioContext.createBiquadFilter(); noiseFilter.type = 'bandpass'; noiseFilter.frequency.value = soundParams.baseFreq ?? 1500; noiseFilter.Q.value = 1.5; const noiseGain = audioContext.createGain(); noiseGain.gain.setValueAtTime(0, now); noiseGain.gain.linearRampToValueAtTime(finalVol, now + 0.002); noiseGain.gain.setValueAtTime(finalVol, now + 0.002); noiseGain.gain.linearRampToValueAtTime(finalVol * 0.7, now + 0.01); noiseGain.gain.setValueAtTime(finalVol * 0.7, now + 0.01); noiseGain.gain.linearRampToValueAtTime(finalVol * 0.9, now + 0.015); noiseGain.gain.setValueAtTime(finalVol * 0.9, now + 0.015); noiseGain.gain.exponentialRampToValueAtTime(0.001, now + decay); noise.connect(noiseFilter); noiseFilter.connect(noiseGain); noiseGain.connect(mainGain); noise.start(now); noise.stop(now + decay + 0.05);
      } else if (node.type === 'drum_tom1' || node.type === 'drum_tom2') { const decay = soundParams.decay ?? (node.type === 'drum_tom1' ? 0.4 : 0.5); const osc = audioContext.createOscillator(); const gain = audioContext.createGain(); osc.type = 'sine'; const tomStartFreq = targetFreq * 1.8; osc.frequency.setValueAtTime(tomStartFreq, now); osc.frequency.exponentialRampToValueAtTime(targetFreq, now + 0.08); gain.gain.setValueAtTime(finalVol, now); gain.gain.exponentialRampToValueAtTime(0.001, now + decay); osc.connect(gain); gain.connect(mainGain); osc.start(now); osc.stop(now + decay + 0.01);
      } else if (node.type === 'drum_cowbell') { const decay = soundParams.decay ?? 0.3; const osc1 = audioContext.createOscillator(); const osc2 = audioContext.createOscillator(); const gain = audioContext.createGain(); osc1.type = 'square'; osc2.type = 'square'; osc1.frequency.value = soundParams.baseFreq; osc2.frequency.value = soundParams.baseFreq * 1.5; gain.gain.setValueAtTime(finalVol * 0.6, now); gain.gain.exponentialRampToValueAtTime(0.001, now + decay); osc1.connect(gain); osc2.connect(gain); gain.connect(mainGain); osc1.start(now); osc1.stop(now + decay); osc2.start(now); osc2.stop(now + decay); }
    } catch (e) {
      node.isTriggered = false; node.animationState = 0;
      console.error(`Error in triggerNodeEffect (${node.type}):`, e);
    }
    setTimeout(() => {
      const stillNode = findNodeById(node.id);
      if (stillNode) stillNode.isTriggered = false;
    }, 150);
    createParticles(node.x, node.y, 3);
  }
}
function startRetriggerSequence(node, originalPulseData) {
  if (!isAudioReady || !node || !node.audioParams || !node.audioParams.retriggerEnabled) {
      return;
  }
  
  if (node.activeRetriggers && node.activeRetriggers.length > 0) {
      node.activeRetriggers.forEach(clearTimeout);
  }
  node.activeRetriggers = [];
  node.currentRetriggerVisualIndex = -1; 

  const params = node.audioParams;
  
  const count = params.retriggerVolumeSteps ? params.retriggerVolumeSteps.length : 0;
  if (count === 0) return; 

  let baseIntervalMs;
  const useRetriggerSync = isGlobalSyncEnabled && !params.ignoreGlobalSync;

  if (useRetriggerSync && params.retriggerSyncSubdivisionIndex !== undefined) {
      const subdivOpt = subdivisionOptions[params.retriggerSyncSubdivisionIndex];
      if (subdivOpt && typeof subdivOpt.value === 'number' && globalBPM > 0) {
          const secondsPerBeat = 60.0 / globalBPM;
          baseIntervalMs = Math.max(20, (secondsPerBeat * subdivOpt.value) * 1000);
      } else {
          baseIntervalMs = Math.max(20, params.retriggerIntervalMs || 100);
      }
  } else {
      baseIntervalMs = Math.max(20, params.retriggerIntervalMs || 100);
  }

  const rateMode = params.retriggerRateMode || "constant";
  const now = audioContext.currentTime;
  let cumulativeTimeSeconds = 0;

  for (let i = 0; i < count; i++) {
      let currentIntervalMs;
      switch (rateMode) {
          case "accelerate":
              currentIntervalMs = baseIntervalMs * Math.pow(0.82, i);
              break;
          case "decelerate":
              currentIntervalMs = baseIntervalMs * Math.pow(1.18, i);
              break;
          case "random":
              currentIntervalMs = baseIntervalMs * (0.6 + Math.random() * 0.8);
              break;
          case "constant":
          default:
              currentIntervalMs = baseIntervalMs;
              break;
      }
      currentIntervalMs = Math.max(20, currentIntervalMs);

      const retriggerScheduledTime = now + cumulativeTimeSeconds;
      

      const retriggerId = setTimeout(() => {
          const currentNodeForRetrigger = findNodeById(node.id); 
          if (currentNodeForRetrigger) {
              currentNodeForRetrigger.currentRetriggerVisualIndex = i; 
              playSingleRetrigger(currentNodeForRetrigger, i, count, originalPulseData, retriggerScheduledTime);

              
              setTimeout(() => {
                  if (currentNodeForRetrigger && currentNodeForRetrigger.currentRetriggerVisualIndex === i) {
                       
                      if (i === count - 1) { 
                           currentNodeForRetrigger.currentRetriggerVisualIndex = -1;
                      }
                  }
              }, currentIntervalMs * 0.8); 
          }
          if (node.activeRetriggers) {
              node.activeRetriggers = node.activeRetriggers.filter(id => id !== retriggerId);
               if (node.activeRetriggers.length === 0 && i === count -1 ) { 
                  node.currentRetriggerVisualIndex = -1;
              }
          }
      }, cumulativeTimeSeconds * 1000);

      node.activeRetriggers.push(retriggerId);
      cumulativeTimeSeconds += (currentIntervalMs / 1000.0);
  }
}

function propagateTrigger(targetNode, incomingDelay, pulseId, sourceNodeId = -1, hopsRemaining = Infinity, incomingPulse = { type: 'trigger', data: {} }, incomingConnection = null) {
    if (!targetNode || targetNode.id === sourceNodeId) {
        return;
    }

    if (targetNode.type === 'nebula' || targetNode.type === PORTAL_NEBULA_TYPE) {
        const actualNebulaTriggerDelay = incomingDelay;
        setTimeout(() => {
            const nebulaNode = findNodeById(targetNode.id);
            if (nebulaNode) {
                nebulaNode.animationState = 1.2;
                if (incomingPulse.data?.color && nebulaNode.type === PORTAL_NEBULA_TYPE) {
                    nebulaNode.baseHue = (nebulaNode.baseHue + 30) % 360;
                }
                 setTimeout(() => {
                    const nNodeCheck = findNodeById(nebulaNode.id);
                    if (nNodeCheck) nNodeCheck.animationState = 0;
                }, 250);
            }
        }, actualNebulaTriggerDelay * 1000);
        return;
    }

    if (targetNode.lastTriggerPulseId === pulseId && targetNode.type !== 'reflector') {
        return;
    }
    if (hopsRemaining <= 0 && hopsRemaining !== Infinity) {
        return;
    }

    targetNode.lastTriggerPulseId = pulseId;
    const actualTriggerDelay = incomingDelay;

    setTimeout(() => {
        const currentNode = findNodeById(targetNode.id);
        if (!currentNode) return;

        let canPropagateOriginalPulseFurther = true;
        let playPrimaryAudioEffect = false;
        let pulseDataForNextPropagation = { ...incomingPulse.data };
        let isGlideArrival = false;

        if (incomingConnection && incomingConnection.type === 'glide' && sourceNodeId !== -1) {
            const sourceNodeForGlide = findNodeById(sourceNodeId);
            if (sourceNodeForGlide && sourceNodeForGlide.audioParams && (currentNode.type === 'sound' || isDrumType(currentNode.type))) {
                isGlideArrival = true;
                playPrimaryAudioEffect = true;
                canPropagateOriginalPulseFurther = true;
            }
        }

        if (!isGlideArrival) {
            if ((currentNode.type === 'sound' || isDrumType(currentNode.type))) {
                if (currentNode.audioParams && currentNode.audioParams.retriggerEnabled) {
                    startRetriggerSequence(currentNode, { ...incomingPulse.data });
                    playPrimaryAudioEffect = false;
                } else {
                    playPrimaryAudioEffect = true;
                }
            }
        }

        if (isPulsarType(currentNode.type)) {
            if (currentNode.type === 'pulsar_triggerable') {
                if (sourceNodeId !== -1 && sourceNodeId !== currentNode.id) {
                    currentNode.isEnabled = !currentNode.isEnabled;
                    if (currentNode.isEnabled) {
                        currentNode.lastTriggerTime = -1;
                        currentNode.nextSyncTriggerTime = 0;
                        const nowTime = audioContext ? audioContext.currentTime : performance.now() / 1000;
                        currentNode.nextRandomTriggerTime = nowTime + (Math.random() * 2 / PULSAR_RANDOM_TIMING_CHANCE_PER_SEC);
                    }
                    currentNode.animationState = 1;
                }
                canPropagateOriginalPulseFurther = false;
            } else {
                currentNode.animationState = 1;
                pulseDataForNextPropagation.color = currentNode.color ?? pulseDataForNextPropagation.color;
                const sourceNodeForIntensity = findNodeById(sourceNodeId);
                if (sourceNodeForIntensity && sourceNodeForIntensity.type === 'pulsar_random_volume') {
                    pulseDataForNextPropagation.intensity = incomingPulse.data.intensity;
                } else {
                    pulseDataForNextPropagation.intensity = currentNode.audioParams.pulseIntensity ?? DEFAULT_PULSE_INTENSITY;
                }
                pulseDataForNextPropagation.particleMultiplier = incomingPulse.data.particleMultiplier ?? 1.0;
            }
            playPrimaryAudioEffect = false;
        } else if (currentNode.type === 'gate') {
            const counterBefore = currentNode.gateCounter || 0;
            currentNode.gateCounter = counterBefore + 1;
            const modeIndex = currentNode.gateModeIndex || 0;
            const mode = GATE_MODES[modeIndex];
            canPropagateOriginalPulseFurther = false;
            switch (mode) {
                case '1/2': if (currentNode.gateCounter % 2 === 0) canPropagateOriginalPulseFurther = true; break;
                case '1/3': if (currentNode.gateCounter % 3 === 0) canPropagateOriginalPulseFurther = true; break;
                case '1/4': if (currentNode.gateCounter % 4 === 0) canPropagateOriginalPulseFurther = true; break;
                case '2/3': if (currentNode.gateCounter % 3 !== 0) canPropagateOriginalPulseFurther = true; break;
                case '3/4': if (currentNode.gateCounter % 4 !== 0) canPropagateOriginalPulseFurther = true; break;
                case 'RAND': const randomCheck = Math.random() < GATE_RANDOM_THRESHOLD; currentNode.lastRandomGateResult = randomCheck; if (randomCheck) canPropagateOriginalPulseFurther = true; break;
            }
            currentNode.animationState = 1;
            playPrimaryAudioEffect = false;
        } else if (currentNode.type === 'probabilityGate') {
            canPropagateOriginalPulseFurther = false;
            if (Math.random() < (currentNode.audioParams.probability ?? DEFAULT_PROBABILITY)) {
                canPropagateOriginalPulseFurther = true;
            }
            currentNode.animationState = 1;
            playPrimaryAudioEffect = false;
        } else if (currentNode.type === 'pitchShift') {
            currentNode.animationState = 1;
            playPrimaryAudioEffect = false;
            const shiftIndex = currentNode.pitchShiftIndex ?? DEFAULT_PITCH_SHIFT_INDEX;
            let shiftAmount = PITCH_SHIFT_AMOUNTS[shiftIndex];
            if (currentNode.pitchShiftAlternating) {
                shiftAmount *= (currentNode.pitchShiftDirection || 1);
                currentNode.pitchShiftDirection = (currentNode.pitchShiftDirection || 1) * -1;
            }
            currentNode.connections.forEach(neighborId => {
                if (neighborId === sourceNodeId) return;
                const neighborNode = findNodeById(neighborId);
                if (neighborNode && (neighborNode.type === 'sound' || neighborNode.type === 'nebula')) {
                    const oldIndex = neighborNode.audioParams.scaleIndex;
                    neighborNode.audioParams.scaleIndex = Math.max(MIN_SCALE_INDEX, Math.min(MAX_SCALE_INDEX, oldIndex + shiftAmount));
                    neighborNode.audioParams.pitch = getFrequency(currentScale, neighborNode.audioParams.scaleIndex);
                    updateNodeAudioParams(neighborNode);
                    if (oldIndex !== neighborNode.audioParams.scaleIndex) {
                         neighborNode.animationState = 0.7;
                         setTimeout(() => { const checkNode = findNodeById(neighborId); if (checkNode && !checkNode.isTriggered) checkNode.animationState = 0; }, 150);
                    }
                }
                const neighborConn = connections.find(c => c.type === 'string_violin' && ((c.nodeAId === currentNode.id && c.nodeBId === neighborId) || (c.nodeAId === neighborId && c.nodeBId === currentNode.id)));
                if (neighborConn) {
                    const oldIndex = neighborConn.audioParams.scaleIndex;
                    neighborConn.audioParams.scaleIndex = Math.max(MIN_SCALE_INDEX, Math.min(MAX_SCALE_INDEX, oldIndex + shiftAmount));
                    neighborConn.audioParams.pitch = getFrequency(currentScale, neighborConn.audioParams.scaleIndex);
                    updateConnectionAudioParams(neighborConn);
                    if (oldIndex !== neighborConn.audioParams.scaleIndex) {
                        neighborConn.animationState = 0.7;
                        setTimeout(() => { const checkConn = findConnectionById(neighborConn.id); if (checkConn) checkConn.animationState = 0; }, 150);
                    }
                }
            });
        } else if (currentNode.type === 'relay') {
            currentNode.animationState = 1;
            playPrimaryAudioEffect = false;
        } else if (currentNode.type === 'reflector') {
            playPrimaryAudioEffect = false;
            canPropagateOriginalPulseFurther = false;
            currentNode.animationState = 1;
            const sourceNodeForReflector = findNodeById(sourceNodeId);
            if (sourceNodeForReflector && incomingConnection) {
                const baseTravelTime = incomingConnection.length * DELAY_FACTOR;
                const outgoingTravelTime = baseTravelTime;
                const pulseColor = pulseDataForNextPropagation.color;
                createVisualPulse(incomingConnection.id, outgoingTravelTime, currentNode.id, hopsRemaining -1, 'trigger', pulseColor, pulseDataForNextPropagation.intensity);
                propagateTrigger(sourceNodeForReflector, outgoingTravelTime, pulseId + Math.random(), currentNode.id, hopsRemaining - 1, { type: 'trigger', data: pulseDataForNextPropagation }, null);
            }
        } else if (currentNode.type === 'switch') {
            playPrimaryAudioEffect = false;
            canPropagateOriginalPulseFurther = false;
            currentNode.animationState = 1;
            if (incomingConnection) {
                if (currentNode.primaryInputConnectionId === null || currentNode.primaryInputConnectionId === undefined) {
                    currentNode.primaryInputConnectionId = incomingConnection.id;
                }
                if (incomingConnection.id === currentNode.primaryInputConnectionId) {
                    canPropagateOriginalPulseFurther = true;
                }
            }
        } else if (isDrumType(currentNode.type)) {
            if (!(currentNode.audioParams && currentNode.audioParams.retriggerEnabled)) playPrimaryAudioEffect = true;
        }


        if (playPrimaryAudioEffect) {
            triggerNodeEffect(currentNode, pulseDataForNextPropagation);
        }

        if (currentNode.animationState > 0 && !currentNode.isTriggered) {
             setTimeout(() => {
                const nodeCheck = findNodeById(currentNode.id);
                if (nodeCheck && !nodeCheck.isTriggered) nodeCheck.animationState = 0;
            }, 150);
        }

        if (canPropagateOriginalPulseFurther) {
            const nextHops = (hopsRemaining === Infinity) ? Infinity : hopsRemaining - 1;
            if (nextHops >= 0) {
                currentNode.connections.forEach(neighborId => {
                    if (neighborId === sourceNodeId) return;
                    const neighborNode = findNodeById(neighborId);
                    const connection = connections.find(c => (c.nodeAId === currentNode.id && c.nodeBId === neighborId) || (c.nodeAId === neighborId && c.nodeBId === currentNode.id));

                    if (neighborNode && neighborNode.type !== 'nebula' && neighborNode.type !== PORTAL_NEBULA_TYPE && connection) {
                        const travelTime = connection.length * DELAY_FACTOR;
                        createVisualPulse(connection.id, travelTime, currentNode.id, nextHops, 'trigger', pulseDataForNextPropagation.color, pulseDataForNextPropagation.intensity);
                        propagateTrigger(neighborNode, travelTime, pulseId, currentNode.id, nextHops, { type: 'trigger', data: pulseDataForNextPropagation }, connection);
                    }
                });
            }
        }
    }, actualTriggerDelay * 1000);
}

function playSingleRetrigger(node, retriggerIndex, totalRetriggers, basePulseData, scheduledPlayTime) {
  if (!audioContext || !node || !node.audioParams) return;

  const params = node.audioParams;
  const audioNodes = node.audioNodes;
  const isMuted = params.retriggerMuteSteps && params.retriggerMuteSteps[retriggerIndex] === true;
  const activeTabButton = document.querySelector('#hamburgerMenuPanel .retrigger-tab-button.active');
  const activeParamTypeForHighlight = activeTabButton ? activeTabButton.dataset.paramType : "volume";
  const editorBarToHighlight = document.getElementById(`retrigger-bar-node${node.id}-param${activeParamTypeForHighlight}-step${retriggerIndex}`);

  if (editorBarToHighlight) {
      editorBarToHighlight.classList.add('playing');
      if (isMuted) {
          editorBarToHighlight.classList.add('muted-playing'); 
      }
      setTimeout(() => {
          editorBarToHighlight.classList.remove('playing');
          if (isMuted) {
              editorBarToHighlight.classList.remove('muted-playing');
          }
      }, Math.min(150, (params.retriggerIntervalMs || 100) * 0.8));
  }


  node.currentRetriggerVisualIndex = retriggerIndex; 

  if (isMuted) {
      
      node.animationState = 0.3; 
      setTimeout(() => {
          const stillNode = findNodeById(node.id);
          if (stillNode && stillNode.animationState > 0) {
              if (!stillNode.isTriggered && (!stillNode.activeRetriggers || stillNode.activeRetriggers.length === 0)) {
                   stillNode.animationState = 0;
              }
          }
           
          if (retriggerIndex === totalRetriggers - 1 && stillNode) {
              setTimeout(() => { 
                  if (stillNode.currentRetriggerVisualIndex === retriggerIndex) {
                      stillNode.currentRetriggerVisualIndex = -1;
                  }
              }, (params.retriggerIntervalMs || 100) * 0.9);
          }
      }, 120);
      return; 
  }

  
  let currentVolume = (params.retriggerVolumeSteps && params.retriggerVolumeSteps[retriggerIndex] !== undefined)
                        ? params.retriggerVolumeSteps[retriggerIndex]
                        : (basePulseData.intensity ?? 1.0);
  currentVolume *= 0.9;
  currentVolume = Math.max(0.005, currentVolume);

  let currentPitch = params.pitch;
  let pitchStepOffset = (params.retriggerPitchSteps && params.retriggerPitchSteps[retriggerIndex] !== undefined)
                          ? params.retriggerPitchSteps[retriggerIndex]
                          : 0;
  currentPitch = getFrequency(currentScale, params.scaleIndex + pitchStepOffset);
  currentPitch = Math.max(20, currentPitch);

  let currentFilterCutoff = params.lowPassFreq;
  if (audioNodes && audioNodes.lowPassFilter && audioNodes.lowPassFilter.frequency) {
       currentFilterCutoff = audioNodes.lowPassFilter.frequency.value;
  }
  let filterStepFactor = (params.retriggerFilterSteps && params.retriggerFilterSteps[retriggerIndex] !== undefined)
                          ? params.retriggerFilterSteps[retriggerIndex]
                          : 0;

  if (filterStepFactor !== 0) {
      const baseCutoffForArc = params.lowPassFreq;
      if (filterStepFactor > 0) {
          currentFilterCutoff = baseCutoffForArc + (MAX_FILTER_FREQ - baseCutoffForArc) * filterStepFactor;
      } else {
          currentFilterCutoff = baseCutoffForArc + (baseCutoffForArc - MIN_FILTER_FREQ) * filterStepFactor;
      }
  }
  currentFilterCutoff = Math.max(MIN_FILTER_FREQ, Math.min(MAX_FILTER_FREQ, currentFilterCutoff));

  const tempAudioParamsForRetrigger = { ...params, pitch: currentPitch, volume: currentVolume, lowPassFreq: currentFilterCutoff };

  if (node.type === 'sound' && audioNodes && audioNodes.oscillator1 && audioNodes.gainNode) {
      const { oscillator1, oscillator2, osc2Gain, gainNode, lowPassFilter, modulatorOsc, modulatorGain } = audioNodes;
      const nodeSpecificAmpEnv = tempAudioParamsForRetrigger.ampEnv;
      const generalAudibleDefaultEnv = { attack: 0.01, decay: 0.2, sustain: 0.3, release: 0.25 };
      const percussiveRetriggerEnv = { attack: 0.005, decay: 0.08, sustain: 0.0, release: 0.05 };
      let envToUse = (retriggerIndex === 0) ? (nodeSpecificAmpEnv || generalAudibleDefaultEnv) : percussiveRetriggerEnv;

      gainNode.gain.cancelScheduledValues(scheduledPlayTime);
      gainNode.gain.setValueAtTime(0, scheduledPlayTime);
      gainNode.gain.linearRampToValueAtTime(currentVolume, scheduledPlayTime + envToUse.attack);
      if (envToUse.sustain > 0.01 && envToUse.decay > 0.001) {
          gainNode.gain.setTargetAtTime(currentVolume * envToUse.sustain, scheduledPlayTime + envToUse.attack, envToUse.decay / 4 + 0.001);
          const sustainDurationForRetrigger = (retriggerIndex === 0 && envToUse.sustain > 0.1) ? (envToUse.sustain * 0.3 + envToUse.decay) : 0.05;
          const noteOffTime = scheduledPlayTime + envToUse.attack + envToUse.decay + sustainDurationForRetrigger;
          gainNode.gain.setTargetAtTime(0.0001, noteOffTime, envToUse.release / 4 + 0.001);
      } else {
          gainNode.gain.setTargetAtTime(0.0001, scheduledPlayTime + envToUse.attack, envToUse.decay / 3 + 0.001);
      }
      oscillator1.frequency.setValueAtTime(currentPitch, scheduledPlayTime);
      if (oscillator2 && osc2Gain) {
           const osc2Freq = currentPitch * Math.pow(2, (tempAudioParamsForRetrigger.osc2Octave || 0));
           oscillator2.frequency.setValueAtTime(osc2Freq, scheduledPlayTime);
      }
      if (modulatorOsc && modulatorGain && tempAudioParamsForRetrigger.carrierWaveform) {
          const modRatio = tempAudioParamsForRetrigger.modulatorRatio || 1.0;
          modulatorOsc.frequency.setValueAtTime(currentPitch * modRatio, scheduledPlayTime);
          const modEnv = tempAudioParamsForRetrigger.modulatorEnv || { attack: 0.002, decay: 0.03, sustain: 0, release: 0.03};
          const modDepthBaseFactor = tempAudioParamsForRetrigger.fmModDepthScale !== undefined ? tempAudioParamsForRetrigger.fmModDepthScale : (tempAudioParamsForRetrigger.waveform === 'fmBell' ? 4 : (tempAudioParamsForRetrigger.waveform === 'fmXylo' ? 10 : 3));
          const modDepth = currentPitch * modDepthBaseFactor;
          modulatorGain.gain.cancelScheduledValues(scheduledPlayTime);
          modulatorGain.gain.setValueAtTime(0, scheduledPlayTime);
          modulatorGain.gain.linearRampToValueAtTime(modDepth, scheduledPlayTime + modEnv.attack);
          modulatorGain.gain.setTargetAtTime(0.0001, scheduledPlayTime + modEnv.attack, modEnv.decay / 3 || 0.01);
      }
      if (lowPassFilter && lowPassFilter.frequency) {
          lowPassFilter.frequency.setValueAtTime(currentFilterCutoff, scheduledPlayTime);
      }
  } else if (node.type === 'sound' && tempAudioParamsForRetrigger.waveform && tempAudioParamsForRetrigger.waveform.startsWith('sampler_')) {
      const samplerId = tempAudioParamsForRetrigger.waveform.replace('sampler_', '');
      const definition = SAMPLER_DEFINITIONS.find(s => s.id === samplerId);
      if (definition && definition.isLoaded && definition.buffer) {
          const source = audioContext.createBufferSource();
          source.buffer = definition.buffer;
          let targetRate = 1.0;
          if (definition.baseFreq > 0 && currentPitch > 0) {
              targetRate = Math.max(0.1, Math.min(8, currentPitch / definition.baseFreq));
          }
          source.playbackRate.setValueAtTime(targetRate, scheduledPlayTime);
          const retriggerGain = audioContext.createGain();
          retriggerGain.gain.setValueAtTime(0, scheduledPlayTime);
          retriggerGain.gain.linearRampToValueAtTime(currentVolume, scheduledPlayTime + 0.005);
          retriggerGain.gain.setTargetAtTime(0.0001, scheduledPlayTime + 0.005, 0.05);
          source.connect(retriggerGain);
          const mainOutputTarget = audioNodes && (audioNodes.lowPassFilter || audioNodes.gainNode) ? (audioNodes.lowPassFilter || audioNodes.gainNode) : masterGain;
          retriggerGain.connect(mainOutputTarget);
          source.start(scheduledPlayTime);
          const sampleDuration = definition.buffer.duration / targetRate;
          const retriggerSoundDuration = Math.min(sampleDuration, 0.25);
          source.stop(scheduledPlayTime + retriggerSoundDuration);
          source.onended = () => { try { source.disconnect(); retriggerGain.disconnect(); } catch(e){} };
      }
  } else if (isDrumType(node.type)) {
      const tempNodeForDrumHit = { ...node, audioParams: { ...node.audioParams, ...tempAudioParamsForRetrigger }, audioNodes: node.audioNodes };
      triggerNodeEffect(tempNodeForDrumHit, { intensity: currentVolume, isRetrigger: true });
  }

  node.animationState = 0.6; 
  const finalRetriggerCleanup = () => {
      const stillNode = findNodeById(node.id);
      if (stillNode) {
          if (stillNode.animationState > 0 && !stillNode.isTriggered && (!stillNode.activeRetriggers || stillNode.activeRetriggers.length === 0)) {
              stillNode.animationState = 0;
          }
          if (retriggerIndex === totalRetriggers - 1 && stillNode.currentRetriggerVisualIndex === retriggerIndex) {
               
               setTimeout(() => {
                  if (stillNode.currentRetriggerVisualIndex === retriggerIndex) { 
                      stillNode.currentRetriggerVisualIndex = -1;
                  }
              }, (params.retriggerIntervalMs || 100) * 0.5); 
          }
      }
  };
  setTimeout(finalRetriggerCleanup, 120); 
}

function createRetriggerVisualEditor(node, selectedArray, paramType = "volume") {
  const editorContainer = document.createElement("div");
  editorContainer.classList.add("retrigger-editor-container");
  editorContainer.dataset.activeParamType = paramType;

  const barsArea = document.createElement("div");
  barsArea.classList.add("retrigger-bars-area");

  let currentDisplayNode = node;
  if (selectedArray && selectedArray.length > 0) {
      const firstNode = findNodeById(selectedArray[0].id);
      if (firstNode) currentDisplayNode = firstNode;
  }
  if (!currentDisplayNode.audioParams) currentDisplayNode.audioParams = {};

  let stepsArrayRef; 
  let muteStepsArrayRef = currentDisplayNode.audioParams.retriggerMuteSteps; 

  let valueMin, valueMax, valueStepInput, defaultValue, unit, barColorClass, tooltipSuffix;

  switch (paramType) {
      case "pitch":
          stepsArrayRef = currentDisplayNode.audioParams.retriggerPitchSteps;
          valueMin = -12; valueMax = 12; valueStepInput = 1; defaultValue = 0; unit = "semi";
          barColorClass = "retrigger-bar-pitch"; tooltipSuffix = " semitones";
          break;
      case "filter":
          stepsArrayRef = currentDisplayNode.audioParams.retriggerFilterSteps;
          valueMin = -1; valueMax = 1; valueStepInput = 0.01; defaultValue = 0; unit = "factor";
          barColorClass = "retrigger-bar-filter"; tooltipSuffix = "";
          break;
      case "volume":
      default:
          stepsArrayRef = currentDisplayNode.audioParams.retriggerVolumeSteps;
          valueMin = 0; valueMax = 1; valueStepInput = 0.01; defaultValue = 0.5; unit = "";
          barColorClass = "retrigger-bar-volume"; tooltipSuffix = "";
          break;
  }

  const referenceStepCount = (currentDisplayNode.audioParams.retriggerVolumeSteps || []).length;

  const ensureArraySync = (arrayName, currentArray, defaultVal, isBoolean = false) => {
      let targetArray = currentDisplayNode.audioParams[arrayName];
      if (!targetArray || !Array.isArray(targetArray) || targetArray.length !== referenceStepCount) {
          const newArr = Array(referenceStepCount).fill(null).map((_, i) => {
              
              if (targetArray && i < targetArray.length) {
                  return targetArray[i];
              }
              return isBoolean ? false : defaultVal; 
          });
          currentDisplayNode.audioParams[arrayName] = newArr; 
          
          
          selectedArray.forEach(elData => {
              const n = findNodeById(elData.id);
              if (n && n.audioParams && n.id !== currentDisplayNode.id) {
                  let otherNodeArray = n.audioParams[arrayName];
                  const newOtherNodeArray = Array(referenceStepCount).fill(null).map((_, i) => {
                       if (otherNodeArray && i < otherNodeArray.length) return otherNodeArray[i];
                       return isBoolean ? false : defaultVal;
                  });
                  n.audioParams[arrayName] = newOtherNodeArray;
              }
          });
          return newArr; 
      }
      return targetArray; 
  };

  stepsArrayRef = ensureArraySync(paramType === "volume" ? "retriggerVolumeSteps" : (paramType === "pitch" ? "retriggerPitchSteps" : "retriggerFilterSteps"), stepsArrayRef, defaultValue);
  muteStepsArrayRef = ensureArraySync("retriggerMuteSteps", muteStepsArrayRef, false, true);


  function renderBars() {
      barsArea.innerHTML = "";
      if (!stepsArrayRef || stepsArrayRef.length === 0) {
           barsArea.textContent = "Pas aantal stappen aan.";
           return;
      }

      stepsArrayRef.forEach((currentValue, index) => {
          const barWrapper = document.createElement("div");
          barWrapper.classList.add("retrigger-bar-wrapper");
          let displayValue = currentValue.toFixed(valueStepInput >= 1 ? 0 : 2);
          if(paramType === "pitch" && currentValue > 0) displayValue = "+" + displayValue;
          barWrapper.title = `Step ${index + 1}: ${paramType.charAt(0).toUpperCase() + paramType.slice(1)} ${displayValue}${tooltipSuffix}`;

          const barVisualContainer = document.createElement("div");
          barVisualContainer.classList.add("retrigger-bar-visual-container");

          const bar = document.createElement("div");
          bar.classList.add("retrigger-bar", barColorClass);
          bar.id = `retrigger-bar-node${currentDisplayNode.id}-param${paramType}-step${index}`;
          bar.dataset.index = index;

          let heightPercent;
          if (valueMin < 0) {
              heightPercent = ((currentValue - valueMin) / (valueMax - valueMin)) * 100;
          } else {
              heightPercent = (currentValue / valueMax) * 100;
          }
          bar.style.height = `${Math.max(2, Math.min(100, heightPercent))}%`;
          bar.style.opacity = (muteStepsArrayRef[index] || false) ? "0.3" : "1";

          barVisualContainer.appendChild(bar);
          barWrapper.appendChild(barVisualContainer);

          const muteToggleLabel = document.createElement("label");
          muteToggleLabel.classList.add("retrigger-step-mute-toggle-label");
          muteToggleLabel.title = `Mute step ${index + 1}`;
          muteToggleLabel.htmlFor = `retrigger-mute-node${currentDisplayNode.id}-param${paramType}-step${index}`;
          
          const muteToggleInput = document.createElement("input");
          muteToggleInput.type = "checkbox";
          muteToggleInput.classList.add("retrigger-step-mute-toggle-input"); 
          muteToggleInput.id = `retrigger-mute-node${currentDisplayNode.id}-param${paramType}-step${index}`;
          muteToggleInput.checked = !(muteStepsArrayRef[index] || false);
          muteToggleInput.dataset.index = index;

          muteToggleLabel.appendChild(muteToggleInput); 
          muteToggleLabel.appendChild(document.createElement("span")); 

          muteToggleLabel.addEventListener("click", (e) => {
              e.stopPropagation(); 
              const stepIndex = parseInt(muteToggleInput.dataset.index);
              const isNowChecked = muteToggleInput.checked; 
              const isMuted = !isNowChecked;

              selectedArray.forEach(elData => {
                  const n = findNodeById(elData.id);
                  if (n && n.audioParams && n.audioParams.retriggerMuteSteps && n.audioParams.retriggerMuteSteps[stepIndex] !== undefined) {
                      n.audioParams.retriggerMuteSteps[stepIndex] = isMuted;
                  }
              });
               if (muteStepsArrayRef[stepIndex] !== undefined) {
                  muteStepsArrayRef[stepIndex] = isMuted;
              }
              saveState();
              bar.style.opacity = isMuted ? "0.3" : "1";
              
          });
          
          barWrapper.appendChild(muteToggleLabel);
          barsArea.appendChild(barWrapper);
      });
  }

  renderBars();

  let activeDraggedBarIndex = -1;
  let initialMouseYForDrag;
  let initialValueForDrag;

  barsArea.addEventListener("mousedown", (e_down) => {
      const target = e_down.target;
      const barElement = target.classList.contains('retrigger-bar') ? target : null;

      if (barElement) {
          e_down.preventDefault();
          e_down.stopPropagation();
          activeDraggedBarIndex = parseInt(barElement.dataset.index);
          initialMouseYForDrag = e_down.clientY;
          initialValueForDrag = stepsArrayRef[activeDraggedBarIndex];

          document.addEventListener("mousemove", onBarDragMouseMove);
          document.addEventListener("mouseup", onBarDragMouseUp);
      }
  });

  function onBarDragMouseMove(e_move) {
      if (activeDraggedBarIndex === -1) return;
      e_move.preventDefault();

      const dy = e_move.clientY - initialMouseYForDrag;
      const barsAreaHeightPx = barsArea.querySelector('.retrigger-bar-visual-container').clientHeight; 
      
      let valueChangeRatio = -(dy / barsAreaHeightPx);
      let newValue = initialValueForDrag + valueChangeRatio * (valueMax - valueMin);
      
      newValue = parseFloat(newValue.toFixed(valueStepInput >= 1 ? 0 : 2));
      newValue = Math.max(valueMin, Math.min(valueMax, newValue));

      selectedArray.forEach(elData => {
          const n = findNodeById(elData.id);
          if (n && n.audioParams) {
              let targetStepsArrayToUpdate;
              if (paramType === "volume") targetStepsArrayToUpdate = n.audioParams.retriggerVolumeSteps;
              else if (paramType === "pitch") targetStepsArrayToUpdate = n.audioParams.retriggerPitchSteps;
              else if (paramType === "filter") targetStepsArrayToUpdate = n.audioParams.retriggerFilterSteps;

              if (targetStepsArrayToUpdate && targetStepsArrayToUpdate[activeDraggedBarIndex] !== undefined) {
                  targetStepsArrayToUpdate[activeDraggedBarIndex] = newValue;
              }
          }
      });
      if (stepsArrayRef && stepsArrayRef[activeDraggedBarIndex] !== undefined) {
          stepsArrayRef[activeDraggedBarIndex] = newValue;
      }

      const barToUpdate = barsArea.querySelector(`.retrigger-bar[data-index="${activeDraggedBarIndex}"]`);
      if (barToUpdate) {
          let heightPercent;
          if (valueMin < 0) { heightPercent = ((newValue - valueMin) / (valueMax - valueMin)) * 100; }
          else { heightPercent = (newValue / valueMax) * 100; }
          barToUpdate.style.height = `${Math.max(2, Math.min(100, heightPercent))}%`;
          
          let displayValue = newValue.toFixed(unit === "factor" || unit === "" ? 2 : 0);
          if(paramType === "pitch" && newValue > 0) displayValue = "+" + displayValue;
          barToUpdate.parentElement.parentElement.title = `Step ${activeDraggedBarIndex + 1}: ${paramType.charAt(0).toUpperCase() + paramType.slice(1)} ${displayValue}${tooltipSuffix}`;
      }
  }

  function onBarDragMouseUp() {
      if (activeDraggedBarIndex !== -1) {
          activeDraggedBarIndex = -1;
          saveState();
      }
      document.removeEventListener("mousemove", onBarDragMouseMove);
      document.removeEventListener("mouseup", onBarDragMouseUp);
  }

  editorContainer.appendChild(barsArea);
  return editorContainer;
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
function createVisualPulse(connId, dur, startNodeId, hopsLeft = Infinity, pulseType = 'trigger', pulseColor = null, intensity = 1.0) {
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
      intensity: intensity,
      
      granularGainNode: null, 
      lastGrainTime: 0        
      
  };

  
  if (connection.type === 'wavetrail' && connection.audioParams?.buffer && audioContext) {
      try {
          visualPulse.granularGainNode = audioContext.createGain();
          visualPulse.granularGainNode.connect(masterGain); 
          visualPulse.lastGrainTime = visualPulse.startTime; 
           
           visualPulse.granularGainNode.gain.setValueAtTime(intensity * 0.7, visualPulse.startTime); 
      } catch (e) {
          console.error("Error creating granular gain node:", e);
          visualPulse.granularGainNode = null; 
      }
  }
  


  activePulses.push(visualPulse);

  
  if (connection.type === 'string_violin') {
       visualPulse.audioStartTime = audioContext.currentTime; 
       visualPulse.audioEndTime = audioContext.currentTime + dur; 
      startStringSound(connection, visualPulse.intensity);
  }
  if (connection.type === 'glide') {
      const sourceNode = findNodeById(startNodeId);
      const targetNode = findNodeById(targetNodeId);
      if (sourceNode && targetNode && sourceNode.audioParams?.pitch && targetNode.audioParams?.pitch) {
          try {
              const sourceFreq = sourceNode.audioParams.pitch;
              const targetFreq = targetNode.audioParams.pitch;
              startTravelingGlideSound(sourceNode, targetFreq, dur, intensity);
          } catch (e) {
              console.warn("Glide kon niet worden gestart:", e);
          }
      }
  }
}

function startTravelingGlideSound(sourceNode, targetFrequency, duration, intensity = 1.0) {
  if (!isAudioReady || !sourceNode || !sourceNode.audioNodes || !sourceNode.audioParams) {
    console.warn("startTravelingGlideSound: Conditions not met (audio not ready, no source node/audionodes/audioparams).");
    return;
  }

  const now = audioContext.currentTime;
  const waveform = sourceNode.audioParams.waveform;

  
  if (waveform && waveform.startsWith("sampler_")) {
    console.log("Sampler glide triggered:", waveform, sourceNode.audioParams.pitch, "→", targetFrequency);
    
    
    if (typeof startSamplerGlide_Granular === "function") {
        startSamplerGlide_Granular(sourceNode, targetFrequency, duration, 0.14, 0.04, intensity);
    } else {
        console.warn("startSamplerGlide_Granular function is not defined.");
    }
    return; 
  }

  
  const mainOscillator = sourceNode.audioNodes.oscillator1 || sourceNode.audioNodes.oscillator; 
  const gainNodeToUse = sourceNode.audioNodes.gainNode;

  if (!mainOscillator || !gainNodeToUse) {
    console.warn(`startTravelingGlideSound: Main oscillator or gain node not found for node ${sourceNode.id}`);
    return;
  }

  const startFreq = sourceNode.audioParams.pitch;
  const baseVol = 0.5; 
  const clampedIntensity = Math.max(0.01, Math.min(1.0, intensity));
  const targetVol = baseVol * clampedIntensity;

  try {
    
    
    
    
    
    

    gainNodeToUse.gain.cancelScheduledValues(now);
    gainNodeToUse.gain.setValueAtTime(gainNodeToUse.gain.value, now); 
    gainNodeToUse.gain.linearRampToValueAtTime(targetVol, now + 0.02); 

    
    mainOscillator.frequency.cancelScheduledValues(now);
    mainOscillator.frequency.setValueAtTime(startFreq, now);
    mainOscillator.frequency.linearRampToValueAtTime(targetFrequency, now + duration);

    
    
    gainNodeToUse.gain.setTargetAtTime(0.0001, now + duration * 0.95, duration * 0.1); 

    
    
    setTimeout(() => {
        const stillSourceNode = findNodeById(sourceNode.id);
        if (stillSourceNode) {
            stillSourceNode.isTriggered = false;
            
            if (stillSourceNode.audioNodes && stillSourceNode.audioNodes.gainNode && (!sourceNode.audioParams.ampEnv || sourceNode.audioParams.ampEnv.sustain === 0)) {
                 stillSourceNode.audioNodes.gainNode.gain.setTargetAtTime(0, audioContext.currentTime, 0.01);
            }
        }
    }, (duration + 0.1) * 1000); 

  } catch (e) {
    console.error("startTravelingGlideSound error:", e);
  }
}



function updateAndDrawPulses(now) {
  const defaultPulseColor = getComputedStyle(document.documentElement).getPropertyValue('--pulse-visual-color').trim() || 'rgba(255, 255, 255, 1)';
  const stringPulseColor = getComputedStyle(document.documentElement).getPropertyValue('--string-violin-pulse-color').trim() || '#ffccaa';
  const wavetrailGlowColor = 'rgba(230, 255, 230, 0.7)';
  const envelopeResolution = 128;
  const hanningWindowCurve = createHanningWindow(envelopeResolution); 

  activePulses = activePulses.filter((p) => {
      const elapsedTime = now - p.startTime;
      const connection = findConnectionById(p.connectionId);

      if (!connection || elapsedTime >= p.duration) {
          
          if (connection && connection.type === "string_violin" && p.audioStartTime) { stopStringSound(connection); }
          if (connection && connection.type === 'wavetrail' && p.granularGainNode) {
              try {
                  p.granularGainNode.gain.cancelScheduledValues(now);
                  p.granularGainNode.gain.setTargetAtTime(0, now, 0.05);
                  setTimeout(() => { if (p.granularGainNode) p.granularGainNode.disconnect(); }, 60);
              } catch (e) { console.error("Error cleaning up granular gain node:", e); }
              p.granularGainNode = null;
          }
          return false;
      }

      const nodeA = findNodeById(connection.nodeAId);
      const nodeB = findNodeById(connection.nodeBId);
      if (!nodeA || !nodeB) return false;

      const progress = Math.min(1.0, elapsedTime / p.duration);

      
      let bufferDuration = 0;
      let pathData = null;
      let totalPathPoints = 0;
      let hasAudio = false;
      if (connection.type === 'wavetrail' && connection.audioParams?.buffer && connection.audioParams?.waveformPath) {
          bufferDuration = connection.audioParams.buffer.duration;
          pathData = connection.audioParams.waveformPath;
          totalPathPoints = pathData.length;
          hasAudio = true;
      }

      
      if (connection.type === 'wavetrail' && hasAudio && bufferDuration > 0) {
          
          if (!p.granularGainNode && audioContext) {
               try {
                  p.granularGainNode = audioContext.createGain();
                  p.granularGainNode.connect(masterGain);
                  p.lastGrainTime = p.startTime; 
                  
                  p.granularGainNode.gain.setValueAtTime((p.intensity || 1.0) * 0.7, p.startTime);
              } catch (e) { p.granularGainNode = null; }
          }

          if (p.granularGainNode) { 
              
              const grainDuration = connection.audioParams.grainDuration || 0.09;
              const grainOverlap = connection.audioParams.grainOverlap || 0.07;
              const grainInterval = Math.max(0.005, grainDuration - grainOverlap);
              const playbackRate = connection.audioParams.playbackRate || 1.0; 

              const startTimeOffset = connection.audioParams.startTimeOffset || 0;
              const endTimeOffset = connection.audioParams.endTimeOffset ?? bufferDuration;
              const actualEndTime = Math.max(startTimeOffset + 0.01, endTimeOffset);
              const effectiveDuration = actualEndTime - startTimeOffset;

              
              const isReverse = (p.startNodeId === connection.nodeBId);

              
              let currentBufferTime;
              if (isReverse) {
                  
                  currentBufferTime = startTimeOffset + (1.0 - progress) * effectiveDuration;
              } else {
                  
                  currentBufferTime = startTimeOffset + progress * effectiveDuration;
              }
              

              
              if (now - p.lastGrainTime >= grainInterval && effectiveDuration > 0) {
                  try {
                      const grainSource = audioContext.createBufferSource();
                      grainSource.buffer = connection.audioParams.buffer;
                      
                      grainSource.playbackRate.setValueAtTime(playbackRate, now);
                      

                      const grainGain = audioContext.createGain();
                      grainGain.gain.setValueAtTime(0, now);
                      grainGain.gain.setValueCurveAtTime(hanningWindowCurve, now, grainDuration);
                      grainSource.connect(grainGain);
                      grainGain.connect(p.granularGainNode);

                      const offset = Math.max(0, Math.min(bufferDuration - 0.001, currentBufferTime)); 
                      const duration = Math.min(grainDuration / playbackRate, bufferDuration - offset); 

                      if (duration > 0.001) {
                         grainSource.start(now, offset, duration);
                         grainSource.onended = () => { try { grainSource.disconnect(); grainGain.disconnect(); } catch(e) {} };
                      } else {
                           try { grainSource.disconnect(); grainGain.disconnect(); } catch(e) {}
                      }
                      p.lastGrainTime = now;
                  } catch (grainError) { console.error(`Error creating audio grain for pulse ${p.id}:`, grainError); }
              }
          }
      }
      

      
      const startNodeForDraw = p.startNodeId === nodeA.id ? nodeA : nodeB;
      const midX = (startNodeForDraw.x + (p.startNodeId === nodeA.id ? nodeB.x : nodeA.x)) / 2 + connection.controlPointOffsetX;
      const midY = (startNodeForDraw.y + (p.startNodeId === nodeA.id ? nodeB.y : nodeA.y)) / 2 + connection.controlPointOffsetY;
      const pX = lerp(lerp(startNodeForDraw.x, midX, progress), lerp(midX, (p.startNodeId === nodeA.id ? nodeB.x : nodeA.x), progress), progress);
      const pY = lerp(lerp(startNodeForDraw.y, midY, progress), lerp(midY, (p.startNodeId === nodeA.id ? nodeB.y : nodeA.y), progress), progress);

      if (connection.type === 'wavetrail' && hasAudio) {
          
          let currentAmplitude = 0;
          let positiveGlowAmplitude = 0;
          let negativeGlowAmplitude = 0;
          
          const startTimeOffset = connection.audioParams.startTimeOffset || 0;
          const endTimeOffset = connection.audioParams.endTimeOffset ?? bufferDuration;
          const actualEndTime = Math.max(startTimeOffset + 0.01, endTimeOffset);
          const effectiveDuration = actualEndTime - startTimeOffset;
          const isReverse = (p.startNodeId === connection.nodeBId); 
          let currentBufferTime;
          if (isReverse) { currentBufferTime = startTimeOffset + (1.0 - progress) * effectiveDuration; }
          else { currentBufferTime = startTimeOffset + progress * effectiveDuration; }
          const audioProgress = currentBufferTime / bufferDuration;
          const i = Math.max(0, Math.min(totalPathPoints - 1, Math.floor(audioProgress * totalPathPoints)));
          if (pathData[i]) {
              currentAmplitude = Math.abs(pathData[i].max - pathData[i].min);
              positiveGlowAmplitude = pathData[i].max > 0 ? pathData[i].max : 0;
              negativeGlowAmplitude = pathData[i].min < 0 ? pathData[i].min : 0;
          }

          if (currentAmplitude > 0.05) { 
               ctx.save();
               
               const glowLineWidth = (1.5 + currentAmplitude * 3.0) / viewScale;
               const glowAlpha = Math.min(0.7, 0.2 + currentAmplitude * 0.5);
               const glowBlur = (12 + currentAmplitude * 18) / viewScale;
               const maxVisualAmplitude = 15 / viewScale;
               const dx_glow = nodeB.x - nodeA.x; const dy_glow = nodeB.y - nodeA.y;
               const lineAngle_glow = Math.atan2(dy_glow, dx_glow);
               const perpAngle_glow = lineAngle_glow + Math.PI / 2;
               const topGlowOffsetX = Math.cos(perpAngle_glow) * positiveGlowAmplitude * maxVisualAmplitude * 1.1;
               const topGlowOffsetY = Math.sin(perpAngle_glow) * positiveGlowAmplitude * maxVisualAmplitude * 1.1;
               const bottomGlowOffsetX = Math.cos(perpAngle_glow) * negativeGlowAmplitude * maxVisualAmplitude * 1.1;
               const bottomGlowOffsetY = Math.sin(perpAngle_glow) * negativeGlowAmplitude * maxVisualAmplitude * 1.1;

               
               ctx.globalCompositeOperation = 'lighter';
               ctx.strokeStyle = wavetrailGlowColor.replace(/[\d\.]+\)$/g, `${glowAlpha})`);
               ctx.lineWidth = glowLineWidth;
               ctx.shadowColor = wavetrailGlowColor.replace(/[\d\.]+\)$/g, `${glowAlpha * 0.7})`);
               ctx.shadowBlur = glowBlur;
               ctx.lineCap = 'round';
               ctx.beginPath();
               ctx.moveTo(pX + bottomGlowOffsetX, pY + bottomGlowOffsetY);
               ctx.lineTo(pX + topGlowOffsetX, pY + topGlowOffsetY);
               ctx.stroke();

               ctx.restore();
          }
      } else {
          
          drawStandardPulseVisual(p, pX, pY, connection, progress); 
      }

      return true; 
  });
}

function playWaveTrailBuffer(connection) {
  if (!audioContext || !connection || connection.type !== 'wavetrail' || !connection.audioParams?.buffer) {
       if (connection?.audioParams && !connection.audioParams.buffer) {
           console.warn(`Attempted to play WaveTrail ${connection.id}, but no audio buffer is loaded.`);
       }
       return;
  }

  try {
      const source = audioContext.createBufferSource();
      source.buffer = connection.audioParams.buffer;
      source.connect(masterGain);
      source.start(0);
      console.log(`Playing WaveTrail ${connection.id} buffer.`);

       source.onended = () => {
           try {
               source.disconnect();
           } catch(e) {}
       };

  } catch (error) {
      console.error(`Error playing WaveTrail buffer for connection ${connection.id}:`, error);
  }
}

function drawStandardPulseVisual(p, pX, pY, connection, progress) {
  const defaultPulseColor = getComputedStyle(document.documentElement).getPropertyValue('--pulse-visual-color').trim() || 'rgba(255, 255, 255, 1)';
  const stringPulseColor = getComputedStyle(document.documentElement).getPropertyValue('--string-violin-pulse-color').trim() || '#ffccaa';

  let colorToUse = p.color || defaultPulseColor;
  let pulseSize = PULSE_SIZE / viewScale;
  let shadowBlurSize = 8 / viewScale;

  if (connection.type === 'string_violin') {
      colorToUse = p.color || stringPulseColor;
      pulseSize *= 0.9;
      shadowBlurSize = 6 / viewScale;
  }
  

  ctx.save();
  ctx.fillStyle = colorToUse;
  ctx.shadowColor = colorToUse;
  ctx.shadowBlur = shadowBlurSize;
  ctx.beginPath();
  ctx.arc(pX, pY, pulseSize, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;

  
  
  const nodeA = findNodeById(connection.nodeAId);
  const nodeB = findNodeById(connection.nodeBId);
  if(nodeA && nodeB) {
      const startNodeForDraw = p.startNodeId === nodeA.id ? nodeA : nodeB;
      const midX = (startNodeForDraw.x + (p.startNodeId === nodeA.id ? nodeB.x : nodeA.x)) / 2 + connection.controlPointOffsetX;
      const midY = (startNodeForDraw.y + (p.startNodeId === nodeA.id ? nodeB.y : nodeA.y)) / 2 + connection.controlPointOffsetY;

      const prevProgress = Math.max(0, progress - 0.02);
      const prevX = lerp(lerp(startNodeForDraw.x, midX, prevProgress), lerp(midX, (p.startNodeId === nodeA.id ? nodeB.x : nodeA.x), prevProgress), prevProgress);
      const prevY = lerp(lerp(startNodeForDraw.y, midY, prevProgress), lerp(midY, (p.startNodeId === nodeA.id ? nodeB.y : nodeA.y), prevProgress), prevProgress);
      const angle = Math.atan2(pY - prevY, pX - prevX);
      const tailLength = (5 + p.duration * 30) / viewScale;

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
  }
  ctx.restore();
}

function createHanningWindow(length) {
  const curve = new Float32Array(length);
  if (length <= 1) {
       if(length === 1) curve[0] = 1; 
       return curve;
   }
  for (let i = 0; i < length; i++) {
      
      curve[i] = 0.5 * (1 - Math.cos(2 * Math.PI * i / (length - 1)));
  }
  return curve;
}

function deepCopyState(stateToCopy) {
  if (!stateToCopy) return null;
  try {
      const stringified = JSON.stringify(stateToCopy, (key, value) => {
          if (value instanceof Set) {
              return Array.from(value);
          }
          if (key === "audioNodes" || (key === "buffer" && value instanceof AudioBuffer) || key === "activeRetriggers") {
              return undefined;
          }
          return value;
      });
      const parsed = JSON.parse(stringified);

      if (parsed.nodes) {
          parsed.nodes.forEach((node) => {
              node.connections = node.connections ? new Set(node.connections) : new Set();
               if (!node.audioParams) node.audioParams = {};
               node.activeRetriggers = [];
               node.currentRetriggerVisualIndex = -1;
          });
      }
      parsed.selectedElements = parsed.selectedElements ? new Set(parsed.selectedElements.map(el => ({...el}))) : new Set();
      parsed.fluctuatingGroupNodeIDs = parsed.fluctuatingGroupNodeIDs ? new Set(parsed.fluctuatingGroupNodeIDs) : new Set();

      if(parsed.connections) {
          parsed.connections.forEach(conn => {
               if (!conn.audioParams) conn.audioParams = {};
               if (conn.type === 'wavetrail' && conn.audioParams) {
                  conn.audioParams.buffer = null;
               }
          });
      }
      return parsed;
  } catch (e) {
      console.error("Error during deep copy/parse state:", e);
      return null;
  }
}

function saveState() {
  if (isPerformingUndoRedo) return;
  unsavedChanges = true;
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
  activeRockets.forEach(rocket => {
    if (rocket.audioNodes && rocket.audioNodes.engineSound) {
        try { rocket.audioNodes.engineSound.stop(); rocket.audioNodes.engineSound.disconnect(); } catch(e){}
    }
  });
  activeRockets = [];

  nodes = stateToLoad.nodes;
  connections = stateToLoad.connections;
  selectedElements = stateToLoad.selectedElements ? new Set(stateToLoad.selectedElements.map(el => ({...el}))) : new Set();
  fluctuatingGroupNodeIDs = stateToLoad.fluctuatingGroupNodeIDs ? new Set(stateToLoad.fluctuatingGroupNodeIDs) : new Set();
  nodeIdCounter = stateToLoad.nodeIdCounter ?? nodeIdCounter;
  connectionIdCounter = stateToLoad.connectionIdCounter ?? connectionIdCounter;
  isGlobalSyncEnabled = stateToLoad.isGlobalSyncEnabled ?? false;
  globalBPM = stateToLoad.globalBPM ?? 120;
  currentScaleKey = stateToLoad.currentScaleKey ?? "major_pentatonic";
  currentScale = scales[currentScaleKey] ?? scales["major_pentatonic"];
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
    if (portalGroupGain) portalGroupGain.gain.setTargetAtTime(stateToLoad.portalVolume ?? 0.7, now, loadTimeConstant);
    if (originalNebulaGroupGain) originalNebulaGroupGain.gain.setTargetAtTime(stateToLoad.originalNebulaVolume ?? 0.8, now, loadTimeConstant);
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
    node.activeRetriggers = [];
    node.currentRetriggerVisualIndex = -1;

    if (!node.audioParams) node.audioParams = {};

    const defaultVolumeSteps = [0.8, 0.65, 0.5];
    const numDefaultSteps = defaultVolumeSteps.length;

    const defaultRetriggerParams = {
      retriggerEnabled: false,
      retriggerVolumeSteps: [...defaultVolumeSteps],
      retriggerPitchSteps: Array(numDefaultSteps).fill(0),
      retriggerFilterSteps: Array(numDefaultSteps).fill(0),
      retriggerMuteSteps: Array(numDefaultSteps).fill(false),
      retriggerIntervalMs: 100,
      retriggerRateMode: "constant",
    };

    for (const key in defaultRetriggerParams) {
      if (node.audioParams[key] === undefined) {
        node.audioParams[key] = defaultRetriggerParams[key];
      }
    }

    if (node.audioParams.retriggerRate !== undefined) {
      if (node.audioParams.retriggerIntervalMs === defaultRetriggerParams.retriggerIntervalMs) {
        node.audioParams.retriggerIntervalMs = Math.max(20, Math.round(1000 / node.audioParams.retriggerRate));
      }
      delete node.audioParams.retriggerRate;
    }
    
    let currentStepCount = (node.audioParams.retriggerVolumeSteps || defaultRetriggerParams.retriggerVolumeSteps).length;

    if (node.audioParams.retriggerCount !== undefined || node.audioParams.retriggerVolumeDecay !== undefined) {
        const countFromOldParam = node.audioParams.retriggerCount || currentStepCount;
        const decayType = node.audioParams.retriggerVolumeDecay || "linear";
        const baseVol = 0.8;
        const newVolumeSteps = [];
        for (let i = 0; i < countFromOldParam; i++) {
            let vol = baseVol;
            if (decayType === "linear") vol *= Math.max(0, 1 - (i / Math.max(1, countFromOldParam -1)));
            else if (decayType === "exponential") vol *= Math.pow(0.75, i);
            newVolumeSteps.push(parseFloat(vol.toFixed(2)));
        }
        node.audioParams.retriggerVolumeSteps = newVolumeSteps.length > 0 ? newVolumeSteps : [...defaultRetriggerParams.retriggerVolumeSteps];
        currentStepCount = node.audioParams.retriggerVolumeSteps.length;

        delete node.audioParams.retriggerCount;
        delete node.audioParams.retriggerVolumeDecay;
    }
    
    const ensureStepArrayLength = (arrayName, defaultValue) => {
        if (!node.audioParams[arrayName] || !Array.isArray(node.audioParams[arrayName]) || node.audioParams[arrayName].length !== currentStepCount) {
            node.audioParams[arrayName] = Array(currentStepCount).fill(defaultValue);
        }
    };

    ensureStepArrayLength("retriggerPitchSteps", 0);
    ensureStepArrayLength("retriggerFilterSteps", 0);
    ensureStepArrayLength("retriggerMuteSteps", false);


    if (node.audioParams.retriggerFilterArcType !== undefined) {
      const oldType = node.audioParams.retriggerFilterArcType;
      const oldFactor = node.audioParams.retriggerFilterArcFactor;
      if (oldType === "open") {
        node.audioParams.retriggerFilterArcAmount = oldFactor !== undefined ? oldFactor : 0.5;
      } else if (oldType === "close") {
        node.audioParams.retriggerFilterArcAmount = oldFactor !== undefined ? -oldFactor : -0.5;
      } else {
        node.audioParams.retriggerFilterArcAmount = 0;
      }
      delete node.audioParams.retriggerFilterArcType;
      delete node.audioParams.retriggerFilterArcFactor;
    }

    if (node.audioParams.retriggerPitchArcType !== undefined) {
        if (["up", "down"].includes(node.audioParams.retriggerPitchArcType)) {
            const oldStepFactor = node.audioParams.retriggerPitchArcStep === undefined ? 0.03 : node.audioParams.retriggerPitchArcStep;
            const newType = "relative_factor";
            const newStep = node.audioParams.retriggerPitchArcType === "down" ? -Math.abs(oldStepFactor) : Math.abs(oldStepFactor);
            node.audioParams.retriggerPitchArcType = newType; 
            node.audioParams.retriggerPitchArcStep = newStep;
        } else if (node.audioParams.retriggerPitchArcType === "step") {
            node.audioParams.retriggerPitchArcType = "semitone_step";
        } else if (node.audioParams.retriggerPitchArcType === "none" && node.audioParams.retriggerPitchArcStep === undefined) {
             node.audioParams.retriggerPitchArcStep = 0;
        }
    }

    node.audioParams.reverbSend = node.audioParams.reverbSend ?? DEFAULT_REVERB_SEND;
    node.audioParams.delaySend = node.audioParams.delaySend ?? DEFAULT_DELAY_SEND;
    node.audioParams.probability = node.audioParams.probability ?? DEFAULT_PROBABILITY;
    node.audioParams.pulseIntensity = node.audioParams.pulseIntensity ?? DEFAULT_PULSE_INTENSITY;
    node.audioParams.triggerInterval = node.audioParams.triggerInterval ?? DEFAULT_TRIGGER_INTERVAL;
    node.audioParams.syncSubdivisionIndex = node.syncSubdivisionIndex ?? node.audioParams.syncSubdivisionIndex ?? DEFAULT_SUBDIVISION_INDEX;
    node.syncSubdivisionIndex = node.audioParams.syncSubdivisionIndex;
    node.audioParams.gateModeIndex = node.gateModeIndex ?? node.audioParams.gateModeIndex ?? DEFAULT_GATE_MODE_INDEX;
    node.gateModeIndex = node.audioParams.gateModeIndex;
    node.audioParams.pitchShiftIndex = node.pitchShiftIndex ?? node.audioParams.pitchShiftIndex ?? DEFAULT_PITCH_SHIFT_INDEX;
    node.pitchShiftIndex = node.audioParams.pitchShiftIndex;
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
      node.audioParams.pitch = getFrequency(currentScale, node.audioParams.scaleIndex);
      if (isNaN(node.audioParams.pitch)) {
        node.audioParams.scaleIndex = 0;
        node.audioParams.pitch = getFrequency(currentScale, 0);
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
    if (!conn.audioParams) conn.audioParams = {};

    if (conn.type === "string_violin") {
      const defaults = STRING_VIOLIN_DEFAULTS;
      Object.keys(defaults).forEach((key) => { conn.audioParams[key] = conn.audioParams[key] ?? defaults[key]; });
      conn.audioParams.scaleIndex = Math.max(MIN_SCALE_INDEX, Math.min(MAX_SCALE_INDEX, conn.audioParams.scaleIndex ?? 0));
      conn.audioParams.pitch = getFrequency(currentScale, conn.audioParams.scaleIndex);
      if (isNaN(conn.audioParams.pitch)) { conn.audioParams.scaleIndex = 0; conn.audioParams.pitch = getFrequency(currentScale, 0); }
      if (isAudioReady) {
        conn.audioNodes = createAudioNodesForConnection(conn);
        if (conn.audioNodes) { updateConnectionAudioParams(conn); }
      } else { conn.audioNodes = null; }
    } else if (conn.type === 'wavetrail') {
      conn.audioParams.buffer = null;
      conn.audioParams.waveformPath = null;
      conn.audioParams.fileName = conn.audioParams.fileName || null;
      conn.audioNodes = null;
    } else {
      conn.audioNodes = null;
    }
  });

  updateSyncUI();
  updateScaleAndTransposeUI();
  if(isAudioReady) updateMixerUI();
  updateConstellationGroup();
  populateEditPanel();
  drawPianoRoll();
  identifyAndRouteAllGroups();

  isPerformingUndoRedo = false;
  unsavedChanges = false;
  updateAbletonLinkButton();
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
        const baseVol = 0.8 + sourceNode.size * 0.3; 
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


function triggerNodeEffect(node, pulseData = {}, startFrequency = null, glideDuration = 0.3) {
  if (!isAudioReady || !node || !node.audioParams) return;
  const now = audioContext.currentTime;
  const params = node.audioParams;
  const intensity = pulseData.intensity ?? 1.0;
  const ampEnv = params.ampEnv || { attack: 0.01, decay: 0.3, sustain: 0.7, release: 0.3 };

  if (node.type === 'sound') {
    if (!node.audioNodes || !node.audioNodes.gainNode || !node.audioNodes.lowPassFilter) {
        console.warn(`[Sampler Trigger V6 Final] Node ${node.id} mist audioNodes.gainNode of lowPassFilter.`);
        node.isTriggered = false; node.animationState = 0; return;
    }
    node.isTriggered = true;
    node.animationState = 1;
    const {
        gainNode, lowPassFilter,
        oscillator1, modulatorOsc1, modulatorGain1,
        oscillator2, osc2Gain,
        orbitoneOscillators, orbitoneModulatorOscs, orbitoneModulatorGains, orbitoneIndividualGains
    } = node.audioNodes;

    // *** PAS DEZE WAARDE AAN OM OSCILLATORS ZACHTER TE MAKEN RELATIEF TOT SAMPLERS ***
    const baseVolume = 0.2; // Was 0.6. Probeer waarden tussen 0.4 en 0.55
    // *** EINDE AANPASSING baseVolume ***

    const targetVolume = baseVolume * intensity;
    // clampedVolume is het piekniveau voor de *hoofd* gainNode van deze 'sound' node
    const clampedVolume = Math.max(0.01, Math.min(1.0, targetVolume));

    // Envelope voor de HOOFD gainNode. Alle audio (osc of sampler) gaat hierdoorheen.
    gainNode.gain.cancelScheduledValues(now);
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(clampedVolume, now + ampEnv.attack);
    gainNode.gain.setTargetAtTime(clampedVolume * ampEnv.sustain, now + ampEnv.attack, ampEnv.decay / 3 + 0.001);

    const totalDurationForMainNodeEnvelope = (ampEnv.attack + ampEnv.decay + (ampEnv.sustain > 0 ? 0.5 : 0));
    const mainNodeReleaseTimeConstant = ampEnv.release / 3 + 0.001;
    setTimeout(() => {
      const stillNode = findNodeById(node.id);
      if (stillNode && stillNode.audioNodes?.gainNode) {
        const currentGainVal = stillNode.audioNodes.gainNode.gain.value;
        stillNode.audioNodes.gainNode.gain.cancelScheduledValues(audioContext.currentTime);
        stillNode.audioNodes.gainNode.gain.setValueAtTime(currentGainVal, audioContext.currentTime);
        stillNode.audioNodes.gainNode.gain.setTargetAtTime(0, audioContext.currentTime, mainNodeReleaseTimeConstant);
      }
      if (stillNode) stillNode.isTriggered = false;
    }, totalDurationForMainNodeEnvelope * 1000);


    if (params.waveform && params.waveform.startsWith('sampler_')) {
        console.log(`[Sampler Trigger - V6 Final] Node: ${node.id}, Sampler: ${params.waveform}, Orbitones Enabled: ${params.orbitonesEnabled}, Count: ${params.orbitoneCount}, Mix: ${params.orbitoneMix}`);
        const samplerId = params.waveform.replace('sampler_', '');
        const definition = SAMPLER_DEFINITIONS.find(s => s.id === samplerId);

        console.log(`[Sampler Trigger - V6 Final] Definition for ${samplerId}: ${!!definition}, Loaded: ${definition?.isLoaded}, Buffer: ${!!definition?.buffer}`);

        if (definition && definition.isLoaded && definition.buffer) {
            console.log(`[Sampler Trigger - V6 Final] Conditions MET for playing ${samplerId}`);

            const allOutputFrequencies = getOrbitoneFrequencies(
                params.scaleIndex,
                params.orbitonesEnabled ? params.orbitoneCount : 0,
                params.orbitoneIntervals,
                params.orbitoneSpread,
                currentScale,
                params.pitch
            );

            allOutputFrequencies.forEach((freq, index) => {
                if (isNaN(freq) || freq <= 0) {
                    console.warn(`[Sampler Play - V6 Final] Invalid frequency for note ${index} of ${samplerId}: ${freq}`);
                    return;
                }
                const isMainNote = index === 0;
                const timingOffsetMs = isMainNote ? 0 : (params.orbitoneTimingOffsets && params.orbitoneTimingOffsets[index-1] !== undefined ? params.orbitoneTimingOffsets[index-1] : 0);
                const scheduledStartTime = now + (timingOffsetMs / 1000.0);

                const source = audioContext.createBufferSource();
                source.buffer = definition.buffer;
                let targetRate = 1;
                if (definition.baseFreq > 0) {
                    targetRate = Math.max(0.1, Math.min(8, freq / definition.baseFreq));
                }
                source.playbackRate.setValueAtTime(targetRate, scheduledStartTime);

                const perNoteSamplerGain = audioContext.createGain();

                let noteVolumeFactor;
                const orbitoneBaseMixLevel = params.orbitoneMix !== undefined ? params.orbitoneMix : 0.5;

                if (!params.orbitonesEnabled || params.orbitoneCount === 0) {
                    noteVolumeFactor = isMainNote ? 1.0 : 0;
                } else {
                    const mainNoteVolWhenMixedOut = (orbitoneBaseMixLevel >= 0.99) ? 0.0 : (1.0 - orbitoneBaseMixLevel);
                    noteVolumeFactor = isMainNote ?
                        mainNoteVolWhenMixedOut :
                        (orbitoneBaseMixLevel / Math.max(1, params.orbitoneCount));
                }

                let finalSamplerSpecificVolume = clampedVolume * noteVolumeFactor;

                // *** VERHOOG DEZE WAARDE OM SAMPLERS LUİDER TE MAKEN ***
                const SAMPLER_GENERAL_BOOST = 5; // Stond op 1.8 of 2.0, probeer 2.2, 2.5 etc.
                finalSamplerSpecificVolume *= SAMPLER_GENERAL_BOOST;
                // Begrens het volume om clipping te voorkomen
                finalSamplerSpecificVolume = Math.min(finalSamplerSpecificVolume, 5); // Maximaal 1.5 bijvoorbeeld
                // *** EINDE AANPASSING SAMPLER BOOST ***

                console.log(`[Sampler Play - V6 Final] Node: ${node.id}, Sampler: ${samplerId}, NoteIdx: ${index}, FinalVol: ${finalSamplerSpecificVolume.toFixed(3)}, clampedVol: ${clampedVolume.toFixed(3)}, noteVolFactor: ${noteVolumeFactor.toFixed(3)}, BOOST: ${SAMPLER_GENERAL_BOOST}`);

                if (finalSamplerSpecificVolume < 0.001) {
                    if (isMainNote) console.warn(`[Sampler Play - V6 Final] Hoofdnoot ${samplerId} volume te laag (${finalSamplerSpecificVolume}). Overgeslagen.`);
                    return;
                }

                perNoteSamplerGain.gain.setValueAtTime(0, scheduledStartTime);
                perNoteSamplerGain.gain.linearRampToValueAtTime(finalSamplerSpecificVolume, scheduledStartTime + 0.005);

                source.connect(perNoteSamplerGain);
                perNoteSamplerGain.connect(lowPassFilter);

                console.log(`[Sampler Play - V6 Final] Starting source ${samplerId} (note ${index}) at ${scheduledStartTime.toFixed(3)}, gain: ${finalSamplerSpecificVolume.toFixed(3)}`);
                source.start(scheduledStartTime);

                // Parameters voor sampler-specifieke envelope (standaards als niet gedefinieerd op node)
                const samplerReleaseFactor = params.samplerReleaseFactor !== undefined ? params.samplerReleaseFactor : 0.5;
                const samplerSustainFactor = params.samplerSustainFactor !== undefined ? params.samplerSustainFactor : 0.8;

                const samplerSpecificReleaseTimeConstant = samplerReleaseFactor * (ampEnv.release / 4 + 0.001) ;
                const samplerEstimatedDuration = samplerSustainFactor * (ampEnv.attack + ampEnv.decay + (ampEnv.sustain > 0 ? 0.3 : 0));

                perNoteSamplerGain.gain.setTargetAtTime(0.0001, scheduledStartTime + samplerEstimatedDuration, samplerSpecificReleaseTimeConstant);

                const bufferActualDuration = definition.buffer.duration / targetRate;
                const stopTime = scheduledStartTime + Math.min(bufferActualDuration, samplerEstimatedDuration + (ampEnv.release * samplerReleaseFactor * 1.5) );
                if (bufferActualDuration < (samplerEstimatedDuration + (ampEnv.release * samplerReleaseFactor)) ) {
                     source.stop(stopTime);
                }

                source.onended = () => {
                    try {
                        perNoteSamplerGain.disconnect();
                        source.disconnect();
                    } catch(e){}
                };
            });
        } else {
            console.warn(`[Sampler Trigger - V6 Final] Sampler conditions NOT MET for ${samplerId} AT TRIGGER TIME. Loaded: ${definition?.isLoaded}, Buffer: ${!!definition?.buffer}`);
            if (oscillator1) { /* Fallback logic kan hier blijven als je dat wilt */ }
        }
    } else if (oscillator1) { // Dit is voor niet-sampler 'sound' nodes (Oscillator-based)
        console.log(`[Oscillator Trigger - V6 Final] Node: ${node.id}, Waveform: ${params.waveform}, Clamped Main Volume: ${clampedVolume.toFixed(3)}`);

        const targetFreq = params.pitch;
        oscillator1.frequency.cancelScheduledValues(now);
        oscillator1.frequency.setTargetAtTime(targetFreq, now, 0.005);

        if (oscillator2 && osc2Gain && params.osc2Type && !params.carrierWaveform && !params.orbitonesEnabled) {
            const osc2BaseFreq = targetFreq * Math.pow(2, (params.osc2Octave || 0));
            oscillator2.frequency.cancelScheduledValues(now);
            oscillator2.frequency.setTargetAtTime(osc2BaseFreq, now, 0.005);
            // De gain van osc2Gain (params.osc2Mix) is al ingesteld bij creatie en wordt meegeschaald door hoofd gainNode
        }

        if (modulatorOsc1 && modulatorGain1 && params.carrierWaveform) { // FM Synthese
            const modRatio = params.modulatorRatio || 1.0;
            modulatorOsc1.frequency.cancelScheduledValues(now);
            modulatorOsc1.frequency.setTargetAtTime(targetFreq * modRatio, now, 0.005);
            const modEnv = params.modulatorEnv || { attack: 0.005, decay: 0.15, sustain: 0, release: 0.2 };
            const fmDepthScale = params.modulatorDepthScale !== undefined ? params.modulatorDepthScale : 2;
            const modDepth = targetFreq * fmDepthScale;
            modulatorGain1.gain.cancelScheduledValues(now);
            modulatorGain1.gain.setValueAtTime(0, now);
            modulatorGain1.gain.linearRampToValueAtTime(modDepth, now + modEnv.attack);
            const modSustainLevel = modEnv.sustain > 0 ? modDepth * modEnv.sustain : 0.0001;
            modulatorGain1.gain.setTargetAtTime(modSustainLevel, now + modEnv.attack, modEnv.decay / 3 + 0.001);
            const totalModDuration = (ampEnv.attack + ampEnv.decay + (ampEnv.sustain > 0 ? 0.3 : 0));
             setTimeout(() => {
                if (modulatorGain1 && audioContext && audioContext.state === 'running') {
                    const currentModGainVal = modulatorGain1.gain.value;
                    modulatorGain1.gain.cancelScheduledValues(audioContext.currentTime);
                    modulatorGain1.gain.setValueAtTime(currentModGainVal, audioContext.currentTime);
                    modulatorGain1.gain.setTargetAtTime(0.0001, audioContext.currentTime, (modEnv.release || 0.2) / 3 + 0.001);
                }
            }, totalModDuration * 1000);
        }
         if (params.orbitonesEnabled && orbitoneOscillators && orbitoneIndividualGains && !(params.waveform && params.waveform.startsWith('sampler_'))) {
             const allOutputFrequencies = getOrbitoneFrequencies(
                params.scaleIndex,
                params.orbitoneCount,
                params.orbitoneIntervals,
                params.orbitoneSpread,
                currentScale,
                params.pitch
            );
            allOutputFrequencies.slice(1).forEach((freq, i) => {
                const orbitOsc = orbitoneOscillators[i];
                const orbitIndGain = orbitoneIndividualGains[i];
                const modOsc = orbitoneModulatorOscs ? orbitoneModulatorOscs[i] : null;
                const modGain = orbitoneModulatorGains ? orbitoneModulatorGains[i] : null;
                const timingOffsetMs = (params.orbitoneTimingOffsets && params.orbitoneTimingOffsets[i] !== undefined) ? params.orbitoneTimingOffsets[i] : 0;
                const scheduledOrbitoneStartTime = now + (timingOffsetMs / 1000.0);

                if (orbitOsc && orbitIndGain && !isNaN(freq) && freq > 0) {
                    orbitOsc.frequency.cancelScheduledValues(scheduledOrbitoneStartTime);
                    orbitOsc.frequency.setTargetAtTime(freq, scheduledOrbitoneStartTime, 0.005);

                    const orbitoneBaseMixLevel = params.orbitoneMix !== undefined ? params.orbitoneMix : 0.5;
                    let volMultiplier = (orbitoneBaseMixLevel / Math.max(1, params.orbitoneCount));
                    // Deze volMultiplier wordt ook geschaald door de hoofd `clampedVolume`
                    orbitIndGain.gain.cancelScheduledValues(scheduledOrbitoneStartTime);
                    orbitIndGain.gain.setValueAtTime(0, scheduledOrbitoneStartTime);
                    orbitIndGain.gain.linearRampToValueAtTime(Math.min(1.0, Math.max(0.01, volMultiplier * clampedVolume)), scheduledOrbitoneStartTime + ampEnv.attack);
                    orbitIndGain.gain.setTargetAtTime(0.0001, scheduledOrbitoneStartTime + totalDurationForMainNodeEnvelope - mainNodeReleaseTimeConstant, mainNodeReleaseTimeConstant);

                    if (modOsc && modGain && params.carrierWaveform) { // Modulator logica voor oscillator orbitonen
                        const modRatio = params.modulatorRatio || 1.0;
                        modOsc.frequency.cancelScheduledValues(scheduledOrbitoneStartTime);
                        modOsc.frequency.setTargetAtTime(freq * modRatio, scheduledOrbitoneStartTime, 0.005);
                        const modEnv = params.modulatorEnv || { attack: 0.005, decay: 0.15, sustain: 0, release: 0.2 };
                        const fmDepthScale = params.modulatorDepthScale !== undefined ? params.modulatorDepthScale : 2;
                        const modDepth = freq * fmDepthScale;
                        modGain.gain.cancelScheduledValues(scheduledOrbitoneStartTime);
                        modGain.gain.setValueAtTime(0, scheduledOrbitoneStartTime);
                        modGain.gain.linearRampToValueAtTime(modDepth, scheduledOrbitoneStartTime + modEnv.attack);
                        const modSustainLevel = modEnv.sustain > 0 ? modDepth * modEnv.sustain : 0.0001;
                        modGain.gain.setTargetAtTime(modSustainLevel, scheduledOrbitoneStartTime + modEnv.attack, modEnv.decay / 3 + 0.001);
                        const totalModDurationOrb = (ampEnv.attack + ampEnv.decay + (ampEnv.sustain > 0 ? 0.3 : 0));
                        setTimeout(() => {
                            if (modGain && audioContext && audioContext.state === 'running') {
                                 const currentModGainVal = modGain.gain.value;
                                 modGain.gain.cancelScheduledValues(audioContext.currentTime);
                                 modGain.gain.setValueAtTime(currentModGainVal, audioContext.currentTime);
                                 modGain.gain.setTargetAtTime(0.0001, audioContext.currentTime, (modEnv.release || 0.2) / 3 + 0.001);
                            }
                        }, (totalModDurationOrb + timingOffsetMs) * 1000);
                    }
                }
            });
        }
    }

    const particleCount = Math.round(5 + Math.floor(node.size * 3) * (pulseData.particleMultiplier ?? 1.0));
    createParticles(node.x, node.y, particleCount);

  } else if (isDrumType(node.type)) {
    if (!node.audioNodes?.mainGain) return;
    node.isTriggered = true; node.animationState = 1;
    const soundParams = params; const mainGain = node.audioNodes.mainGain;
    const finalVol = (soundParams.volume || 1.0) * intensity; // Drums gebruiken hun eigen volume param + intensity
    const targetFreq = soundParams.baseFreq;
    try {
      if (node.type === 'drum_kick') { const osc = audioContext.createOscillator(); const gain = audioContext.createGain(); const kickStartFreq = targetFreq * 2.5; osc.frequency.setValueAtTime(kickStartFreq, now); osc.frequency.exponentialRampToValueAtTime(targetFreq, now + 0.05); gain.gain.setValueAtTime(finalVol, now); gain.gain.exponentialRampToValueAtTime(0.001, now + soundParams.decay); osc.connect(gain); gain.connect(mainGain); osc.start(now); osc.stop(now + soundParams.decay + 0.05);
      } else if (node.type === "drum_snare") { const noiseDur = soundParams.noiseDecay ?? 0.15; const bodyDecay = soundParams.decay ?? 0.2; const noise = audioContext.createBufferSource(); const noiseBuffer = audioContext.createBuffer(1, audioContext.sampleRate * noiseDur, audioContext.sampleRate); const output = noiseBuffer.getChannelData(0); for (let i = 0; i < output.length; i++) { output[i] = Math.random() * 2 - 1; } noise.buffer = noiseBuffer; const noiseFilter = audioContext.createBiquadFilter(); noiseFilter.type = 'highpass'; noiseFilter.frequency.value = 1500; const noiseGain = audioContext.createGain(); noiseGain.gain.setValueAtTime(finalVol * 0.8, now); noiseGain.gain.exponentialRampToValueAtTime(0.001, now + noiseDur); noise.connect(noiseFilter); noiseFilter.connect(noiseGain); noiseGain.connect(mainGain); noise.start(now); noise.stop(now + noiseDur + 0.01); const osc = audioContext.createOscillator(); const gain = audioContext.createGain(); osc.type = 'triangle'; osc.frequency.setValueAtTime(soundParams.baseFreq, now); gain.gain.setValueAtTime(finalVol * 0.7, now); gain.gain.exponentialRampToValueAtTime(0.01, now + bodyDecay); osc.connect(gain); gain.connect(mainGain); osc.start(now); osc.stop(now + bodyDecay + 0.01);
      } else if (node.type === 'drum_hihat') { const decay = soundParams.decay ?? 0.05; const noise = audioContext.createBufferSource(); const noiseBuffer = audioContext.createBuffer(1, audioContext.sampleRate * decay, audioContext.sampleRate); const output = noiseBuffer.getChannelData(0); for (let i = 0; i < output.length; i++) { output[i] = Math.random() * 2 - 1; } noise.buffer = noiseBuffer; const noiseFilter = audioContext.createBiquadFilter(); noiseFilter.type = 'highpass'; noiseFilter.frequency.value = soundParams.baseFreq; const noiseGain = audioContext.createGain(); noiseGain.gain.setValueAtTime(finalVol, now); noiseGain.gain.exponentialRampToValueAtTime(0.001, now + decay); noise.connect(noiseFilter); noiseFilter.connect(noiseGain); noiseGain.connect(mainGain); noise.start(now); noise.stop(now + decay + 0.01);
      } else if (node.type === 'drum_clap') { const decay = soundParams.noiseDecay ?? 0.1; const noise = audioContext.createBufferSource(); const noiseBuffer = audioContext.createBuffer(1, audioContext.sampleRate * decay * 1.5, audioContext.sampleRate); const output = noiseBuffer.getChannelData(0); for (let i = 0; i < output.length; i++) { output[i] = Math.random() * 2 - 1; } noise.buffer = noiseBuffer; const noiseFilter = audioContext.createBiquadFilter(); noiseFilter.type = 'bandpass'; noiseFilter.frequency.value = soundParams.baseFreq ?? 1500; noiseFilter.Q.value = 1.5; const noiseGain = audioContext.createGain(); noiseGain.gain.setValueAtTime(0, now); noiseGain.gain.linearRampToValueAtTime(finalVol, now + 0.002); noiseGain.gain.setValueAtTime(finalVol, now + 0.002); noiseGain.gain.linearRampToValueAtTime(finalVol * 0.7, now + 0.01); noiseGain.gain.setValueAtTime(finalVol * 0.7, now + 0.01); noiseGain.gain.linearRampToValueAtTime(finalVol * 0.9, now + 0.015); noiseGain.gain.setValueAtTime(finalVol * 0.9, now + 0.015); noiseGain.gain.exponentialRampToValueAtTime(0.001, now + decay); noise.connect(noiseFilter); noiseFilter.connect(noiseGain); noiseGain.connect(mainGain); noise.start(now); noise.stop(now + decay + 0.05);
      } else if (node.type === 'drum_tom1' || node.type === 'drum_tom2') { const decay = soundParams.decay ?? (node.type === 'drum_tom1' ? 0.4 : 0.5); const osc = audioContext.createOscillator(); const gain = audioContext.createGain(); osc.type = 'sine'; const tomStartFreq = targetFreq * 1.8; osc.frequency.setValueAtTime(tomStartFreq, now); osc.frequency.exponentialRampToValueAtTime(targetFreq, now + 0.08); gain.gain.setValueAtTime(finalVol, now); gain.gain.exponentialRampToValueAtTime(0.001, now + decay); osc.connect(gain); gain.connect(mainGain); osc.start(now); osc.stop(now + decay + 0.01);
      } else if (node.type === 'drum_cowbell') { const decay = soundParams.decay ?? 0.3; const osc1 = audioContext.createOscillator(); const osc2 = audioContext.createOscillator(); const gain = audioContext.createGain(); osc1.type = 'square'; osc2.type = 'square'; osc1.frequency.value = soundParams.baseFreq; osc2.frequency.value = soundParams.baseFreq * 1.5; gain.gain.setValueAtTime(finalVol * 0.6, now); gain.gain.exponentialRampToValueAtTime(0.001, now + decay); osc1.connect(gain); osc2.connect(gain); gain.connect(mainGain); osc1.start(now); osc1.stop(now + decay); osc2.start(now); osc2.stop(now + decay); }
    } catch (e) {
      node.isTriggered = false; node.animationState = 0;
      console.error(`Error in triggerNodeEffect (${node.type}):`, e);
    }
    setTimeout(() => {
      const stillNode = findNodeById(node.id);
      if (stillNode) stillNode.isTriggered = false;
    }, 150);
    createParticles(node.x, node.y, 3);
  }
}

function stopNodeAudio(node) {
  if (!node || !node.audioNodes) return;
  try {
      if (node.type === "sound") {
          try { node.audioNodes.oscillator1?.stop(); node.audioNodes.oscillator1?.disconnect(); } catch(e){}
          try { node.audioNodes.modulatorOsc1?.stop(); node.audioNodes.modulatorOsc1?.disconnect(); } catch(e){}
          try { node.audioNodes.modulatorGain1?.disconnect(); } catch(e){}
          try { node.audioNodes.oscillator2?.stop(); node.audioNodes.oscillator2?.disconnect(); } catch(e){}
          try { node.audioNodes.osc2Gain?.disconnect(); } catch(e){}

          if (node.audioNodes.orbitoneOscillators) {
              node.audioNodes.orbitoneOscillators.forEach(osc => { try { osc.stop(); osc.disconnect(); } catch(e){} });
          }
          if (node.audioNodes.orbitoneIndividualGains) {
              node.audioNodes.orbitoneIndividualGains.forEach(g => { try { g.disconnect(); } catch(e){} });
          }
          if (node.audioNodes.orbitoneModulatorOscs) {
              node.audioNodes.orbitoneModulatorOscs.forEach(modOsc => { try { modOsc.stop(); modOsc.disconnect(); } catch(e){} });
          }
          if (node.audioNodes.orbitoneModulatorGains) {
              node.audioNodes.orbitoneModulatorGains.forEach(modGain => { try { modGain.disconnect(); } catch(e){} });
          }
           if (node.audioNodes.chordSamplerSources) { 
              node.audioNodes.chordSamplerSources.forEach(src => { try { src.stop(); src.disconnect(); } catch(e){} });
          }
          
          node.audioNodes.reverbSendGain?.disconnect();
          node.audioNodes.delaySendGain?.disconnect();
          try { node.audioNodes.volLfo?.stop(); } catch(e){}
          node.audioNodes.volLfo?.disconnect();
          node.audioNodes.volLfoGain?.disconnect();
          node.audioNodes.lowPassFilter?.disconnect();
          node.audioNodes.gainNode?.disconnect();

      } else if (node.type === "nebula") {
          try { node.audioNodes.filterLfo?.stop(); } catch(e){}
          try { node.audioNodes.volLfo?.stop(); } catch(e){}
          node.audioNodes.oscillators?.forEach((osc) => { try { osc.stop(); osc.disconnect(); } catch(e){} });
          node.audioNodes.reverbSendGain?.disconnect();
          node.audioNodes.delaySendGain?.disconnect();
          node.audioNodes.filterLfoGain?.disconnect();
          node.audioNodes.volLfoGain?.disconnect();
          node.audioNodes.filterLfo?.disconnect();
          node.audioNodes.volLfo?.disconnect();
          node.audioNodes.gainNode?.disconnect();
          node.audioNodes.filterNode?.disconnect();
      } else if (node.type === PORTAL_NEBULA_TYPE) {
           try { node.audioNodes.droneOsc?.stop(); } catch(e){}
           try { node.audioNodes.droneFreqLfo?.stop(); } catch(e){}
           try { node.audioNodes.shimmerLfo?.stop(); } catch(e){}
           node.audioNodes.harmonics?.forEach(osc => { try { osc.stop(); osc.disconnect(); } catch(e){} });
           node.audioNodes.reverbSendGain?.disconnect();
           node.audioNodes.delaySendGain?.disconnect();
           node.audioNodes.shimmerLfoGain?.disconnect();
           node.audioNodes.shimmerLfo?.disconnect();
           node.audioNodes.harmonicGain?.disconnect();
           node.audioNodes.droneFreqLfoGain?.disconnect();
           node.audioNodes.droneFreqLfo?.disconnect();
           node.audioNodes.droneOsc?.disconnect();
           node.audioNodes.mainGain?.disconnect(); 
      } else if (isDrumType(node.type)) {
          node.audioNodes.reverbSendGain?.disconnect();
          node.audioNodes.delaySendGain?.disconnect();
          node.audioNodes.mainGain?.disconnect();
      }
  } catch (e) {}
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
  } else if (type === 'wavetrail') {
      newConnection.audioParams = {
          buffer: null,
          fileName: null,
          waveformPath: null,
          startTimeOffset: 0,
          endTimeOffset: null,
          grainDuration: 0.09, 
          grainOverlap: 0.07,  
          playbackRate: 1.0   
      };
  }

  connections.push(newConnection);
  createParticles(nodeB.x, nodeB.y, 15);
  updateConstellationGroup();
  identifyAndRouteAllGroups();
  saveState();
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
  
  if (!startNode || !CONSTELLATION_NODE_TYPES.includes(startNode.type)) {
      return constellationNodes;
  }

  while (queue.length > 0) {
      const currentNodeId = queue.shift();
      const currentNode = findNodeById(currentNodeId);
      if (!currentNode) continue;

      
      if (CONSTELLATION_NODE_TYPES.includes(currentNode.type)) {
          constellationNodes.add(currentNodeId);
      }

      
      currentNode.connections.forEach((neighborId) => {
          if (!visited.has(neighborId)) {
              visited.add(neighborId);
              const neighborNode = findNodeById(neighborId);
              
              if (neighborNode && CONSTELLATION_NODE_TYPES.includes(neighborNode.type)) {
                  
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

  const previousSelectedNodes = new Set(currentConstellationGroup); 
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
                  if (node) node.isInConstellation = true; 
              });
              currentConstellationGroup = potentialConstellation; 
          } else {
              
              
              
          }
      }
  }

  
  updateGroupControlsUI(); 

  
  
   updateFluctuatingNodesLFO();

  
}
function rerouteAudioForNode(node, destinationNode) {
  if (!node || !node.audioNodes || !isAudioReady || !destinationNode) {
    return;
  }

  const outputNode = node.audioNodes.gainNode || node.audioNodes.mainGain;
  if (!outputNode) {
    return;
  }

  const reverbSendGain = node.audioNodes.reverbSendGain;
  const delaySendGain = node.audioNodes.delaySendGain;

  try {
    outputNode.disconnect();
    outputNode.connect(destinationNode);

    if (reverbSendGain && isReverbReady && reverbNode) {
      outputNode.connect(reverbSendGain);
    }
    if (delaySendGain && isDelayReady && masterDelaySendGain) {
      outputNode.connect(delaySendGain);
    }
  } catch (e) {
    try {
      outputNode.disconnect();
      outputNode.connect(masterGain);
      if (reverbSendGain && isReverbReady && reverbNode) outputNode.connect(reverbSendGain);
      if (delaySendGain && isDelayReady && masterDelaySendGain) outputNode.connect(delaySendGain);
    } catch (e2) {
      // Fallback failed
    }
  }
}
function updateGroupControlsUI() {
  const selectionIsGroup = currentConstellationGroup.size > 0;
  if (groupControlsDiv) {
       groupControlsDiv.classList.toggle('hidden', !selectionIsGroup);
       if (selectionIsGroup) {
           groupNodeCountSpan.textContent = currentConstellationGroup.size;

           
           const firstSelectedNodeId = currentConstellationGroup.values().next().value;
           const selectedGroup = findGroupContainingNode(firstSelectedNodeId);

           
           if (selectedGroup && selectedGroup.gainNode && groupVolumeSlider) {
               const currentGroupVol = selectedGroup.gainNode.gain.value;
               groupVolumeSlider.value = currentGroupVol;
               const originalLabel = document.querySelector('label[for="groupVolumeSlider"]');
               if (originalLabel && originalLabel.textContent.includes('(')) {
                    originalLabel.textContent = `Group Volume (${currentGroupVol.toFixed(2)}):`;
               }
           } else if (groupVolumeSlider) {
                
               groupVolumeSlider.value = 1.0; 
               const originalLabel = document.querySelector('label[for="groupVolumeSlider"]');
                if (originalLabel && originalLabel.textContent.includes('(')) {
                    originalLabel.textContent = `Group Volume (--.--):`; 
                }
           }

           
           let isGroupFluctuating = false;
           if (currentConstellationGroup.size > 0) {
                
                
                isGroupFluctuating = [...currentConstellationGroup].some(id => fluctuatingGroupNodeIDs.has(id));
                
                
           }
           groupFluctuateToggle.checked = isGroupFluctuating;
           groupFluctuateAmount.disabled = !isGroupFluctuating;

       }
  }
  updateRestartPulsarsButtonVisibility();
}

function applyGroupFluctuationSettings() {
  updateFluctuatingNodesLFO(); 
  
}

/**
* Werkt de LFO gain bij voor individuele nodes die in fluctuatingGroupNodeIDs staan.
*/
function updateFluctuatingNodesLFO() {
  if (!isAudioReady) return;
  const fluctuationAmount = parseFloat(groupFluctuateAmount.value);
  const now = audioContext.currentTime;

  nodes.forEach((node) => {
      
      if (node.type === "sound" && node.audioNodes?.volLfoGain) {
          
          const shouldFluctuate = fluctuatingGroupNodeIDs.has(node.id);
          
          const targetLfoDepth = shouldFluctuate ? fluctuationAmount : 0;

          try {
              
              node.audioNodes.volLfoGain.gain.setTargetAtTime(targetLfoDepth, now, 0.1);
          } catch (e) {
              console.error(`Error setting LFO gain for node ${node.id}:`, e);
          }
      }
      
      
  });
}


groupFluctuateToggle.addEventListener("change", (e) => {
   const isChecked = e.target.checked;
   
   currentConstellationGroup.forEach(nodeId => {
        if (isChecked) {
            fluctuatingGroupNodeIDs.add(nodeId);
        } else {
            fluctuatingGroupNodeIDs.delete(nodeId);
        }
   });
   updateFluctuatingNodesLFO(); 
   groupFluctuateAmount.disabled = !isChecked;
   saveState(); 
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
  if (!nA || !nB || !ctx) return;

  const isSelected = isElementSelected('connection', conn.id);
  let baseClr = 'grey';
  let thickness = 1 / viewScale;
  let dash = [];
  let drawAsWaveformBars = false;

  ctx.save();

  
  if (conn.type === 'string_violin') {
      baseClr = getComputedStyle(document.documentElement).getPropertyValue('--string-violin-connection-color').trim() || '#ffccaa';
      thickness = (1.5 + 2.0 * (1 - Math.min(1, conn.length / 500))) / viewScale;
      dash = [5 / viewScale, 3 / viewScale];
      ctx.setLineDash(dash);
  } else if (conn.type === 'glide') {
      baseClr = GLIDE_LINE_COLOR;
      thickness = (GLIDE_LINE_WIDTH + 1.5 * (1 - Math.min(1, conn.length / 500))) / viewScale;
      dash = [8 / viewScale, 4 / viewScale];
      ctx.setLineDash(dash);
  } else if (conn.type === 'wavetrail') {
      thickness = Math.max(0.5, 1.5 / viewScale); 
      dash = []; 
      if (conn.audioParams?.buffer && conn.audioParams?.waveformPath) {
          baseClr = 'rgba(180, 255, 180, 0.8)'; 
          drawAsWaveformBars = true; 
      } else {
          baseClr = 'rgba(200, 200, 200, 0.5)'; 
          dash = [4 / viewScale, 4 / viewScale]; 
          ctx.setLineDash(dash);
      }
  } else { 
      baseClr = getComputedStyle(document.documentElement).getPropertyValue('--connection-color').trim() || '#8AC';
      thickness = (1.0 + 1.5 * (1 - Math.min(1, conn.length / 500))) / viewScale;
      ctx.setLineDash(dash);
  }

  
  ctx.strokeStyle = isSelected ? 'rgba(255, 255, 0, 0.9)' : baseClr;
  ctx.lineWidth = Math.max(0.5, thickness) + (isSelected ? (2 / viewScale) : 0);
  ctx.globalAlpha = 1.0;
  ctx.shadowBlur = 0;


  if (drawAsWaveformBars) {
      
      const pathData = conn.audioParams.waveformPath;
      const totalPathPoints = pathData.length; 

      if (totalPathPoints > 0 && conn.audioParams.buffer) { 
          

          
          const bufferDuration = conn.audioParams.buffer.duration;
          const startTimeOffset = conn.audioParams.startTimeOffset || 0;
          const endTimeOffset = conn.audioParams.endTimeOffset ?? bufferDuration;
          const actualEndTime = Math.max(startTimeOffset + 0.01, endTimeOffset);

          
          const startSampleIndex = Math.max(0, Math.min(totalPathPoints - 1, Math.floor((startTimeOffset / bufferDuration) * totalPathPoints)));
          const endSampleIndex = Math.max(0, Math.min(totalPathPoints - 1, Math.ceil((actualEndTime / bufferDuration) * totalPathPoints)));
          
          const selectedDataPointCount = Math.max(1, endSampleIndex - startSampleIndex + 1);

          
          const maxAmplitude = 15 / viewScale; 
          const barWidth = Math.max(0.5, 1.5 / viewScale); 
          ctx.lineWidth = barWidth; 
          ctx.strokeStyle = isSelected ? 'rgba(220, 255, 220, 0.9)' : baseClr; 
          ctx.setLineDash([]); 

          
          const dx = nB.x - nA.x;
          const dy = nB.y - nA.y;
          const angle = Math.atan2(dy, dx);
          const perpAngle = angle + Math.PI / 2; 

          
          const visualBarCount = Math.min(selectedDataPointCount, 200);

          
          for (let j = 0; j < visualBarCount; j++) {
              
              const visualProgress = visualBarCount === 1 ? 0.5 : j / (visualBarCount - 1 || 1);

              
              const i = Math.round(startSampleIndex + visualProgress * (selectedDataPointCount - 1));
              const clamped_i = Math.max(startSampleIndex, Math.min(endSampleIndex, i));

              
              const lx = nA.x + dx * visualProgress;
              const ly = nA.y + dy * visualProgress;

              
              const waveData = pathData[clamped_i];
              if (!waveData) continue;

              
              const positiveAmplitude = waveData.max > 0 ? waveData.max : 0;
              const negativeAmplitude = waveData.min < 0 ? waveData.min : 0;
              const topOffsetX = Math.cos(perpAngle) * positiveAmplitude * maxAmplitude;
              const topOffsetY = Math.sin(perpAngle) * positiveAmplitude * maxAmplitude;
              const bottomOffsetX = Math.cos(perpAngle) * negativeAmplitude * maxAmplitude;
              const bottomOffsetY = Math.sin(perpAngle) * negativeAmplitude * maxAmplitude;

              
              ctx.beginPath();
              ctx.moveTo(lx + bottomOffsetX, ly + bottomOffsetY);
              ctx.lineTo(lx + topOffsetX, ly + topOffsetY);
              ctx.stroke();
          }
      } else {
           
           ctx.strokeStyle = baseClr;
           ctx.lineWidth = Math.max(0.5, thickness) + (isSelected ? (2 / viewScale) : 0);
           ctx.setLineDash(dash);
           ctx.beginPath();
           const mX = (nA.x + nB.x) / 2; const mY = (nA.y + nB.y) / 2;
           const cX = mX + conn.controlPointOffsetX; const cY = mY + conn.controlPointOffsetY;
           ctx.moveTo(nA.x, nA.y); ctx.quadraticCurveTo(cX, cY, nB.x, nB.y);
           ctx.stroke();
      }
      
  } else {
      
      ctx.strokeStyle = isSelected ? 'rgba(255, 255, 0, 0.9)' : baseClr;
      ctx.lineWidth = Math.max(0.5, thickness) + (isSelected ? (2 / viewScale) : 0);
      ctx.setLineDash(dash);
      ctx.beginPath();
      const mX = (nA.x + nB.x) / 2; const mY = (nA.y + nB.y) / 2;
      const cX = mX + conn.controlPointOffsetX; const cY = mY + conn.controlPointOffsetY;
      ctx.moveTo(nA.x, nA.y); ctx.quadraticCurveTo(cX, cY, nB.x, nB.y);
      ctx.stroke();
  }

  ctx.shadowBlur = 0;
  if (conn.animationState > 0 && conn.type === 'string_violin') {
      ctx.strokeStyle = isSelected ? 'rgba(255, 255, 0, 0.9)' : (getComputedStyle(document.documentElement).getPropertyValue('--string-violin-connection-color').trim() || '#ffccaa');
      ctx.lineWidth = Math.max(0.5, thickness) + (isSelected ? (2 / viewScale) : 0);
      ctx.setLineDash([5 / viewScale, 3 / viewScale]);
      ctx.shadowColor = isSelected ? 'rgba(255, 255, 0, 0.9)' : (getComputedStyle(document.documentElement).getPropertyValue('--string-violin-pulse-color').trim() || '#ffccaa');
      ctx.shadowBlur = conn.animationState * 15 / viewScale;
      ctx.beginPath();
      const mX = (nA.x + nB.x) / 2;
      const mY = (nA.y + nB.y) / 2;
      const cX = mX + conn.controlPointOffsetX;
      const cY = mY + conn.controlPointOffsetY;
      ctx.moveTo(nA.x, nA.y);
      ctx.quadraticCurveTo(cX, cY, nB.x, nB.y);
      ctx.stroke();
      ctx.shadowBlur = 0;
      conn.animationState -= 0.1;
      conn.animationState = Math.max(0, conn.animationState);
  }

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
  const flashDuration = 0.1; let preTriggerFlash = 0; let wobbleX = 0, wobbleY = 0;
  const now = audioContext ? audioContext.currentTime : performance.now() / 1000;
  const params = node.audioParams;

  if (isPlaying && isGlobalSyncEnabled && node.isStartNode && isSelectedAndOutlineNeeded && node.nextSyncTriggerTime > 0 && node.type !== "pulsar_random_particles") {
    const timeToNext = node.nextSyncTriggerTime - (audioContext?.currentTime ?? 0);
    if (timeToNext > 0 && timeToNext < flashDuration) { preTriggerFlash = (1.0 - timeToNext / flashDuration) * 0.6; }
  }

  let isActiveRetriggerVisual = node.activeRetriggers && node.activeRetriggers.length > 0 && node.currentRetriggerVisualIndex !== -1;

  if (node.animationState > 0 && !node.isTriggered && !isActiveRetriggerVisual) {
     node.animationState -= (["sound", "nebula", PORTAL_NEBULA_TYPE].includes(node.type) || isDrumType(node.type)) ? 0.03 : 0.08;
  }
  node.animationState = Math.max(0, node.animationState);

  const bloomFactor = 1 + node.animationState * 0.5 + preTriggerFlash * 0.6;
  const currentRadius = NODE_RADIUS_BASE * node.size * bloomFactor; 
  const r = currentRadius;
  let fillColor, borderColor, glowColor;
  const styles = getComputedStyle(document.documentElement);
  const scaleBase = currentScale.baseHSL || { h: 200, s: 70, l: 70 };
  const isStartNodeDisabled = node.isStartNode && !node.isEnabled;
  const disabledFillColorGeneral = styles.getPropertyValue("--start-node-disabled-color").trim();
  const disabledBorderColorGeneral = styles.getPropertyValue("--start-node-disabled-border").trim();
  const baseAlpha = (node.type === "nebula" ? 0.5 : (node.type === PORTAL_NEBULA_TYPE ? 0.7 : 0.6)) + node.size * 0.3;

  if (isPulsarType(node.type)) {
    const cssVarBase = `--${node.type.replace("_", "-")}`;
    fillColor = isStartNodeDisabled ? disabledFillColorGeneral : node.color || styles.getPropertyValue(`${cssVarBase}-color`, styles.getPropertyValue("--start-node-color")).trim();
    borderColor = isStartNodeDisabled ? disabledBorderColorGeneral : node.color ? node.color.replace(/[\d\.]+\)$/g, "1)") : styles.getPropertyValue(`${cssVarBase}-border`, styles.getPropertyValue("--start-node-border")).trim();
    glowColor = isStartNodeDisabled ? "transparent" : borderColor;
  } else if (isDrumType(node.type)) {
    const typeName = node.type.replace("_", "-");
    fillColor = styles.getPropertyValue(`--${typeName}-color`).trim() || 'grey';
    borderColor = styles.getPropertyValue(`--${typeName}-border`).trim() || 'darkgrey';
    glowColor = borderColor;
  } else if (node.type === "gate") { fillColor = styles.getPropertyValue("--gate-node-color").trim(); borderColor = styles.getPropertyValue("--gate-node-border").trim(); glowColor = borderColor; }
  else if (node.type === "probabilityGate") { fillColor = styles.getPropertyValue("--probability-gate-node-color").trim(); borderColor = styles.getPropertyValue("--probability-gate-node-border").trim(); glowColor = borderColor; }
  else if (node.type === "pitchShift") { fillColor = styles.getPropertyValue("--pitch-node-color").trim(); borderColor = styles.getPropertyValue("--pitch-node-border").trim(); glowColor = borderColor; }
  else if (node.type === "relay") { fillColor = styles.getPropertyValue("--relay-node-color").trim(); borderColor = styles.getPropertyValue("--relay-node-border").trim(); glowColor = borderColor; }
  else if (node.type === "reflector") { fillColor = styles.getPropertyValue("--reflector-node-color").trim(); borderColor = styles.getPropertyValue("--reflector-node-border").trim(); glowColor = borderColor; }
  else if (node.type === "switch") { fillColor = styles.getPropertyValue("--switch-node-color").trim(); borderColor = styles.getPropertyValue("--switch-node-border").trim(); glowColor = borderColor; }
  else if (node.type === "sound" || node.type === "nebula" || node.type === PORTAL_NEBULA_TYPE) {
    const nodeBaseHue = ((node.type === "nebula" || node.type === PORTAL_NEBULA_TYPE) && node.baseHue !== null && node.baseHue !== undefined) ? node.baseHue : (scaleBase.h + (params.scaleIndex % currentScale.notes.length) * HUE_STEP) % 360;
    const lightness = scaleBase.l * (0.8 + node.size * 0.2);
    const saturation = scaleBase.s * (node.type === "nebula" ? 0.7 : (node.type === PORTAL_NEBULA_TYPE ? 0.9 : 1.0));
    const alpha = baseAlpha;
    fillColor = hslToRgba(nodeBaseHue, saturation, lightness, Math.min(0.95, alpha));
    borderColor = hslToRgba(nodeBaseHue, saturation * 0.8, lightness * 0.6, 0.9);
    glowColor = hslToRgba(nodeBaseHue, saturation, lightness * 1.1, 1.0);
  } else { fillColor = "grey"; borderColor = "darkgrey"; glowColor = "white"; }

  ctx.fillStyle = fillColor;
  ctx.strokeStyle = borderColor;
  const baseLineWidth = (node.isStartNode ? 2.5 : node.type === "relay" || node.type === "reflector" || node.type === "switch" ? 1.0 : 1.5);
  ctx.lineWidth = Math.max(0.5 / viewScale, (isSelectedAndOutlineNeeded ? baseLineWidth + 1.5 : baseLineWidth) / viewScale);

  let needsRestore = false;
  if ((node.type === "gate" || (node.type === "sound" && params.waveform?.startsWith("sampler_"))) && node.currentAngle !== undefined) {
    ctx.save(); ctx.translate(node.x, node.y);
    if (node.type === "gate") { ctx.rotate(node.currentAngle); }
    else if (node.type === "sound" && params.waveform.startsWith("sampler_")) { node.currentAngle = (node.currentAngle + 0.005 * (performance.now() * 0.01)) % (Math.PI * 2); ctx.rotate(node.currentAngle); }
    ctx.translate(-node.x, -node.y); needsRestore = true;
  }

  if (node.isInConstellation && currentTool === "edit") {
    const highlightRadius = (NODE_RADIUS_BASE * node.size + 5); 
    ctx.fillStyle = styles.getPropertyValue("--constellation-highlight").trim() || "rgba(255, 255, 150, 0.15)";
    ctx.beginPath(); ctx.arc(node.x, node.y, highlightRadius, 0, Math.PI * 2); ctx.fill();
  }

  if ((node.animationState > 0 || preTriggerFlash > 0 || isSelectedAndOutlineNeeded || node.type === "nebula" || node.type === PORTAL_NEBULA_TYPE) && !isStartNodeDisabled) {
    ctx.shadowColor = glowColor;
    let glowAmount = (isPulsarType(node.type) || isDrumType(node.type) || node.type === "nebula" || node.type === PORTAL_NEBULA_TYPE ? 5 : 0) + (node.animationState + preTriggerFlash) * 15 + (isSelectedAndOutlineNeeded ? 5 : 0);
    if ((node.type === "gate" || node.type === "probabilityGate" || node.type === "pitchShift" || node.type === "relay" || node.type === "reflector" || node.type === "switch")) {
      glowAmount = (isSelectedAndOutlineNeeded ? 5 : 0) + (node.animationState > 0 ? (10 + node.animationState * 10) : 0);
    } else if (node.type === "nebula") {
      const pulseEffect = (Math.sin(node.pulsePhase) * 0.5 + 0.5) * 8; glowAmount = 3 + pulseEffect + (isSelectedAndOutlineNeeded ? 5 : 0);
    } else if (node.type === PORTAL_NEBULA_TYPE) {
      const pulseEffectGlow = (Math.sin(node.pulsePhase * 0.8) * 0.5 + 0.5) * 15; glowAmount = 10 + pulseEffectGlow + (isSelectedAndOutlineNeeded ? 5 : 0);
    }
    ctx.shadowBlur = Math.min(40, glowAmount) / viewScale;
  } else { ctx.shadowBlur = 0; }

  const visualStyle = params.visualStyle;

  if (node.type === "sound" && visualStyle) {
    const planetColors = {
        planet_mercury: { fill: hslToRgba(30, 10, 55, baseAlpha), border: hslToRgba(30, 10, 40, 0.9), craters: hslToRgba(30,10,35, baseAlpha) },
        planet_venus:   { fill: hslToRgba(45, 50, 70, baseAlpha), border: hslToRgba(45, 50, 55, 0.9), swirl1: hslToRgba(50, 55, 75, baseAlpha*0.7), swirl2: hslToRgba(40, 45, 65, baseAlpha*0.6)},
        planet_earth:   { fill: hslToRgba(210, 60, 55, baseAlpha), border: hslToRgba(210, 60, 40, 0.9), land: hslToRgba(120, 40,45,baseAlpha*1.2), cloud: hslToRgba(200,20,90,baseAlpha*0.5) },
        planet_mars:    { fill: hslToRgba(15, 70, 50, baseAlpha), border: hslToRgba(15, 70, 35, 0.9), cap: hslToRgba(0,0,90,baseAlpha) },
        planet_jupiter: { fill: hslToRgba(35, 60, 65, baseAlpha), border: hslToRgba(35, 60, 50, 0.9), spot: hslToRgba(10,70,55,baseAlpha), band1: hslToRgba(40,55,60,baseAlpha), band2: hslToRgba(30,65,70,baseAlpha) },
        planet_saturn:  { fill: hslToRgba(50, 55, 70, baseAlpha), border: hslToRgba(50, 55, 55, 0.9), ringOuter: hslToRgba(50,35,65,baseAlpha*0.7), ringInner: hslToRgba(50,30,60,baseAlpha*0.5) },
        planet_uranus:  { fill: hslToRgba(180, 50, 65, baseAlpha), border: hslToRgba(180, 50, 50, 0.9) },
        planet_neptune: { fill: hslToRgba(230, 70, 60, baseAlpha), border: hslToRgba(230, 70, 45, 0.9), darkSpot: hslToRgba(230,75,40,baseAlpha) },
        fm_galaxy:      { fill: hslToRgba(270, 70, 50, 0.7), border: hslToRgba(270, 70, 35, 0.9) },
        fm_crystal:     { fill: hslToRgba(180, 80, 75, 0.8), border: hslToRgba(180, 80, 60, 0.9) },
        fm_chime:       { fill: hslToRgba(60, 75, 65, 0.75), border: hslToRgba(60, 75, 50, 0.9) },
        fm_glass:       { fill: hslToRgba(190, 40, 80, 0.6), border: hslToRgba(190, 40, 65, 0.8) },
        fm_organ:       { fill: hslToRgba(30, 60, 60, 0.8), border: hslToRgba(30, 60, 45, 0.9) },
        fm_epiano:      { fill: hslToRgba(220, 50, 65, 0.7), border: hslToRgba(220, 50, 50, 0.9) },
        fm_ethnic:      { fill: hslToRgba(0, 65, 55, 0.75), border: hslToRgba(0, 65, 40, 0.9) },
        fm_metallic:    { fill: hslToRgba(210, 15, 60, 0.8), border: hslToRgba(210, 15, 45, 0.9) },
        fm_harmonic:    { fill: hslToRgba(150, 70, 60, 0.7), border: hslToRgba(150, 70, 45, 0.9) },
        fm_void:        { fill: hslToRgba(0, 0, 20, 0.85), border: hslToRgba(0, 0, 10, 0.9) },
    };
    const currentPlanetColors = planetColors[visualStyle];
    if (currentPlanetColors) {
        fillColor = currentPlanetColors.fill;
        borderColor = currentPlanetColors.border;
        ctx.fillStyle = fillColor;
        ctx.strokeStyle = borderColor;
    }

    ctx.beginPath();
    ctx.arc(node.x, node.y, r, 0, Math.PI * 2);
    ctx.fill();

    switch (visualStyle) {
      case "planet_mercury":
        for (let i = 0; i < 3; i++) { const cr = r * (0.1 + Math.random() * 0.15); const ca = Math.random() * Math.PI * 2; const cx = node.x + Math.cos(ca) * r * 0.5; const cy = node.y + Math.sin(ca) * r * 0.5; ctx.fillStyle = currentPlanetColors.craters; ctx.beginPath(); ctx.arc(cx, cy, cr, 0, Math.PI * 2); ctx.fill(); }
        break;
      case "planet_venus":
        ctx.save(); ctx.clip();
        for(let i=0; i<2; i++) { const sx = node.x + (Math.random()-0.5)*r*0.8; const sy = node.y + (Math.random()-0.5)*r*0.8; const sr1 = r*(0.4+Math.random()*0.3); const sr2 = r*(0.2+Math.random()*0.2); ctx.fillStyle = i%2===0 ? currentPlanetColors.swirl1 : currentPlanetColors.swirl2; ctx.beginPath(); ctx.ellipse(sx, sy, sr1, sr2, Math.random()*Math.PI,0,Math.PI*2); ctx.fill();}
        ctx.restore();
        break;
      case "planet_earth":
        ctx.save(); ctx.clip(); ctx.fillStyle = currentPlanetColors.land;
        ctx.beginPath(); ctx.ellipse(node.x - r*0.2, node.y + r*0.1, r*0.5, r*0.3, Math.PI/4, 0, Math.PI*2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(node.x + r*0.3, node.y - r*0.2, r*0.4, r*0.25, -Math.PI/6, 0, Math.PI*2); ctx.fill();
        ctx.fillStyle = currentPlanetColors.cloud;
        for(let i=0; i<3; i++) { ctx.beginPath(); ctx.arc(node.x + (Math.random()-0.5)*r, node.y + (Math.random()-0.5)*r, r*(0.15+Math.random()*0.2),0,Math.PI*2); ctx.fill();}
        ctx.restore();
        break;
      case "planet_mars":
        ctx.fillStyle = currentPlanetColors.cap;
        ctx.beginPath(); ctx.arc(node.x, node.y - r*0.8, r*0.3, 0, Math.PI*2); ctx.fill();
        break;
      case "planet_jupiter":
        ctx.save(); ctx.clip();
        ctx.fillStyle = currentPlanetColors.band1; ctx.fillRect(node.x-r, node.y - r*0.4, r*2, r*0.3);
        ctx.fillStyle = currentPlanetColors.band2; ctx.fillRect(node.x-r, node.y + r*0.1, r*2, r*0.25);
        ctx.fillStyle = currentPlanetColors.spot; ctx.beginPath(); ctx.ellipse(node.x + r*0.3, node.y + r*0.4, r*0.35, r*0.2, -Math.PI/5, 0, Math.PI*2); ctx.fill();
        ctx.restore();
        break;
      case "planet_saturn":
        ctx.strokeStyle = currentPlanetColors.ringOuter; ctx.lineWidth = (r * 0.25) / viewScale;
        ctx.beginPath(); ctx.ellipse(node.x, node.y, r * 1.6, r * 0.5, 0, 0, Math.PI * 2); ctx.stroke();
        ctx.strokeStyle = currentPlanetColors.ringInner; ctx.lineWidth = (r * 0.15) / viewScale;
        ctx.beginPath(); ctx.ellipse(node.x, node.y, r * 1.25, r * 0.4, 0, 0, Math.PI * 2); ctx.stroke();
        break;
      case "planet_neptune":
        ctx.fillStyle = currentPlanetColors.darkSpot; ctx.beginPath(); ctx.ellipse(node.x - r*0.3, node.y - r*0.2, r*0.4, r*0.25, Math.PI/6,0,Math.PI*2); ctx.fill();
        break;
      case "fm_galaxy": drawStarShape(ctx, node.x, node.y, 7, r, r * 0.4); ctx.fill(); break;
      case "fm_crystal":
        for(let i=0; i<5; i++){ const angle = (i/5)*Math.PI*2 + now*0.1; ctx.beginPath(); ctx.moveTo(node.x + Math.cos(angle)*r*0.3, node.y + Math.sin(angle)*r*0.3); ctx.lineTo(node.x + Math.cos(angle+Math.PI*0.15)*r, node.y + Math.sin(angle+Math.PI*0.15)*r); ctx.lineTo(node.x + Math.cos(angle-Math.PI*0.15)*r, node.y + Math.sin(angle-Math.PI*0.15)*r); ctx.closePath(); ctx.fill(); }
        break;
      case "fm_chime":
        for(let i=0; i<3; i++){ ctx.fillRect(node.x - r*0.1 + i*r*0.4 - r*0.4, node.y - r*0.8, r*0.2, r*1.6); }
        break;
      case "fm_glass": ctx.beginPath(); ctx.moveTo(node.x-r*0.7, node.y+r*0.7); ctx.lineTo(node.x-r*0.3, node.y-r*0.7); ctx.lineTo(node.x+r*0.3, node.y-r*0.7); ctx.lineTo(node.x+r*0.7, node.y+r*0.7); ctx.stroke(); break;
      case "fm_organ": drawStarShape(ctx, node.x, node.y, 4, r, r*0.8); ctx.fill(); ctx.stroke(); break;
      case "fm_epiano": ctx.beginPath(); ctx.ellipse(node.x, node.y, r, r*0.6, 0, 0, Math.PI*2); ctx.fill(); ctx.stroke(); break;
      case "fm_ethnic": ctx.beginPath(); ctx.arc(node.x, node.y, r, Math.PI*0.2, Math.PI*0.8); ctx.fill(); ctx.beginPath(); ctx.arc(node.x, node.y, r, Math.PI*1.2, Math.PI*1.8); ctx.fill(); break;
      case "fm_metallic": ctx.beginPath(); ctx.rect(node.x - r*0.7, node.y - r*0.7, r*1.4, r*1.4); ctx.fill(); ctx.stroke(); drawStarShape(ctx, node.x, node.y, 6, r*0.5, r*0.2); ctx.fillStyle=borderColor; ctx.fill(); break;
      case "fm_harmonic": ctx.beginPath(); ctx.arc(node.x, node.y, r, 0, Math.PI*2); ctx.fill(); for(let i=1; i<4; i++){ctx.beginPath(); ctx.arc(node.x,node.y,r*(1-i*0.2),0,Math.PI*2); ctx.stroke();} break;
      case "fm_void": ctx.beginPath(); ctx.arc(node.x, node.y, r, 0, Math.PI*2); ctx.fill(); ctx.stroke(); break;
      default:
        const waveform = params.waveform;
        if (waveform === "sine" || !waveform) { ctx.beginPath(); ctx.arc(node.x, node.y, r, 0, Math.PI * 2); }
        else if (waveform === "square") { ctx.beginPath(); ctx.rect(node.x - r * 0.9, node.y - r * 0.9, r * 1.8, r * 1.8); }
        else if (waveform === "triangle" || waveform === "sawtooth") { ctx.beginPath(); ctx.moveTo(node.x, node.y - r); ctx.lineTo(node.x + r * 0.866, node.y + r * 0.5); ctx.lineTo(node.x - r * 0.866, node.y + r * 0.5); ctx.closePath(); }
        else if (waveform === "fmBell" || waveform === "fmXylo") { drawStarShape(ctx, node.x, node.y, 5, r, r * 0.5); }
        else if (waveform?.startsWith("sampler_")) {
            let arms = 1;
            const samplerType = waveform.replace("sampler_", "");
            const samplerDef = SAMPLER_DEFINITIONS.find(s => s.id === samplerType);
            if (samplerDef && samplerDef.icon) {
                if (samplerDef.icon === "🎹") arms = 2;
                else if (samplerDef.icon === "🌬️") arms = 3;
                else if (samplerDef.icon === "🪵") arms = 4;
            }
            drawSatelliteShape(ctx, node.x, node.y, r, arms);
        }
        else { ctx.beginPath(); ctx.arc(node.x, node.y, r, 0, Math.PI * 2); }
        ctx.fill(); ctx.stroke();
        break;
    }
    ctx.stroke();

  } else if (isDrumType(node.type)) {
      ctx.lineWidth = Math.max(0.5 / viewScale, baseLineWidth / viewScale); ctx.strokeStyle = borderColor; ctx.fillStyle = fillColor;
      switch (node.type) {
          case 'drum_kick': ctx.beginPath(); ctx.arc(node.x, node.y, r, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); const innerKickR = r * (0.6 + node.animationState * 0.1); ctx.fillStyle = node.color ? hexToRgba(rgbaToHex(node.color), 0.6) : fillColor.replace(/[\d\.]+\)$/g, '0.6)'); ctx.beginPath(); ctx.arc(node.x, node.y, innerKickR, 0, Math.PI * 2); ctx.fill(); break;
          case 'drum_snare': ctx.beginPath(); ctx.arc(node.x, node.y, r, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); ctx.save(); ctx.strokeStyle = borderColor + '80'; ctx.lineWidth = Math.max(0.5 / viewScale, 1 / viewScale); const numWires = 3; for (let i = 0; i < numWires; i++) { const offset = (i - (numWires - 1) / 2) * (r * 0.4); ctx.beginPath(); ctx.moveTo(node.x - r * 0.7, node.y + offset); ctx.lineTo(node.x + r * 0.7, node.y + offset); ctx.stroke(); } ctx.restore(); break;
          case 'drum_hihat': const cymbalYOffset = r * 0.2; const cymbalWidth = r * 1.4; const cymbalControlY = r * 0.3; ctx.lineWidth = Math.max(0.5 / viewScale, baseLineWidth * 0.8 / viewScale); ctx.beginPath(); ctx.moveTo(node.x - cymbalWidth / 2, node.y - cymbalYOffset); ctx.quadraticCurveTo(node.x, node.y - cymbalYOffset - cymbalControlY, node.x + cymbalWidth / 2, node.y - cymbalYOffset); ctx.stroke(); const bottomY = node.y + cymbalYOffset + node.animationState * (r * 0.35); ctx.beginPath(); ctx.moveTo(node.x - cymbalWidth / 2, bottomY); ctx.quadraticCurveTo(node.x, bottomY + cymbalControlY, node.x + cymbalWidth / 2, bottomY); ctx.stroke(); const stickBaseY = node.y - r * 1.3; const stickTipY = node.y - r * 0.3 + node.animationState * (r * 0.7); const stickX = node.x + r * 0.6; ctx.save(); ctx.strokeStyle = borderColor; ctx.lineWidth = Math.max(1 / viewScale, 2.5 / viewScale); ctx.beginPath(); ctx.moveTo(stickX, stickBaseY); ctx.lineTo(stickX + r * 0.1, stickTipY); ctx.stroke(); ctx.restore(); break;
          case 'drum_clap': const handWidth = r * 0.8; const handHeight = r * 1.0; const minGap = r * 0.1; const maxGap = r * 0.7; const currentGap = minGap + (1 - node.animationState) * (maxGap - minGap); const yPos = node.y - handHeight / 2; const borderRadius = r * 0.25; ctx.lineWidth = Math.max(0.5 / viewScale, baseLineWidth / viewScale); drawRoundedRect(ctx, node.x - handWidth - currentGap / 2, yPos, handWidth, handHeight, borderRadius); ctx.fill(); ctx.stroke(); drawRoundedRect(ctx, node.x + currentGap / 2, yPos, handWidth, handHeight, borderRadius); ctx.fill(); ctx.stroke(); break;
          case 'drum_tom1': case 'drum_tom2': ctx.beginPath(); ctx.arc(node.x, node.y, r, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); ctx.save(); ctx.strokeStyle = borderColor + '90'; ctx.lineWidth = Math.max(0.5 / viewScale, 1 / viewScale); ctx.beginPath(); ctx.moveTo(node.x - r * 0.7, node.y); ctx.lineTo(node.x + r * 0.7, node.y); ctx.stroke(); ctx.restore(); break;
          case 'drum_cowbell': const topWidth = r * 0.8; const bottomWidth = r * 1.3; const cHeight = r * 1.1; ctx.beginPath(); ctx.moveTo(node.x - topWidth / 2, node.y - cHeight / 2); ctx.lineTo(node.x + topWidth / 2, node.y - cHeight / 2); ctx.lineTo(node.x + bottomWidth / 2, node.y + cHeight / 2); ctx.lineTo(node.x - bottomWidth / 2, node.y + cHeight / 2); ctx.closePath(); ctx.fill(); ctx.stroke(); break;
          default: ctx.beginPath(); ctx.rect(node.x - r * 0.8, node.y - r * 0.8, r * 1.6, r * 1.6); ctx.fill(); ctx.stroke(); break;
      }
  } else if (node.type === "gate") {
      const innerRadius = r * 0.4; const shieldRadius = r * 0.85; const openingStartAngle = -GATE_ANGLE_SIZE / 2; const openingEndAngle = GATE_ANGLE_SIZE / 2;
      ctx.beginPath(); ctx.arc(node.x, node.y, r, 0, Math.PI * 2); ctx.stroke();
      const gateBgFill = fillColor + "90"; ctx.fillStyle = gateBgFill; ctx.fill();
      ctx.fillStyle = borderColor + "A0"; ctx.beginPath();
      ctx.moveTo(node.x + Math.cos(openingEndAngle) * innerRadius, node.y + Math.sin(openingEndAngle) * innerRadius);
      ctx.lineTo(node.x + Math.cos(openingEndAngle) * shieldRadius, node.y + Math.sin(openingEndAngle) * shieldRadius);
      ctx.arc(node.x, node.y, shieldRadius, openingEndAngle, openingStartAngle + Math.PI * 2, false);
      ctx.lineTo(node.x + Math.cos(openingStartAngle) * innerRadius, node.y + Math.sin(openingStartAngle) * innerRadius);
      ctx.arc(node.x, node.y, innerRadius, openingStartAngle + Math.PI * 2, openingEndAngle, true);
      ctx.closePath(); ctx.fill();
      let shouldPassVisual = false; const mode = GATE_MODES[node.gateModeIndex || 0]; if (mode === "RAND") { shouldPassVisual = node.lastRandomGateResult; } else { const counterCheck = node.gateCounter || 0; switch (mode) { case "1/2": if (counterCheck % 2 === 0) shouldPassVisual = true; break; case "1/3": if (counterCheck % 3 === 0) shouldPassVisual = true; break; case "1/4": if (counterCheck % 4 === 0) shouldPassVisual = true; break; case "2/3": if (counterCheck % 3 !== 0) shouldPassVisual = true; break; case "3/4": if (counterCheck % 4 !== 0) shouldPassVisual = true; break; } }
      if (node.animationState > 0 && shouldPassVisual) { ctx.save(); ctx.strokeStyle = styles.getPropertyValue("--pulse-visual-color").trim() || "rgba(255, 255, 255, 0.9)"; ctx.lineWidth = Math.max(1 / viewScale, 2.5 / viewScale); ctx.shadowColor = glowColor; ctx.shadowBlur = 10 / viewScale; ctx.beginPath(); ctx.arc(node.x, node.y, r * 0.9, openingStartAngle, openingEndAngle); ctx.stroke(); ctx.restore(); }
  } else if (node.type === "probabilityGate") {
      ctx.beginPath(); ctx.arc(node.x, node.y, r, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      const fontSize = Math.max(8 / viewScale, (r * 0.8) / viewScale); ctx.font = `bold ${fontSize}px sans-serif`; ctx.fillStyle = borderColor; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText("%", node.x, node.y + fontSize * 0.1);
  } else if (node.type === "pitchShift") {
      ctx.beginPath(); ctx.arc(node.x, node.y, r, 0, Math.PI * 2); ctx.stroke();
      ctx.fillStyle = fillColor + "90"; ctx.fill();
      if (node.animationState < 0.5) { ctx.fillStyle = borderColor; ctx.beginPath(); const arrowSize = r * 0.5; const arrowY = node.y - arrowSize * 0.3; ctx.moveTo(node.x, arrowY - arrowSize / 2); ctx.lineTo(node.x - arrowSize / 2, arrowY + arrowSize / 2); ctx.lineTo(node.x + arrowSize / 2, arrowY + arrowSize / 2); ctx.closePath(); ctx.fill(); }
  } else if (node.type === "relay") { ctx.beginPath(); ctx.arc(node.x, node.y, r * 0.6, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); }
  else if (node.type === "reflector") {
      ctx.beginPath(); ctx.arc(node.x, node.y, r, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      const fontSize = Math.max(8 / viewScale, (r * 0.9) / viewScale); ctx.font = `${fontSize}px sans-serif`; ctx.fillStyle = borderColor; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText("⟲", node.x, node.y + fontSize * 0.1);
  } else if (node.type === "switch") { ctx.beginPath(); ctx.moveTo(node.x - r * 0.8, node.y + r * 0.8); ctx.lineTo(node.x, node.y - r); ctx.lineTo(node.x + r * 0.8, node.y + r * 0.8); ctx.closePath(); ctx.fill(); ctx.stroke(); }
  else if (node.type === "nebula") {
      wobbleX = Math.sin(now * 0.1 + node.id) * (2 / viewScale); wobbleY = Math.cos(now * 0.07 + node.id * 2) * (2 / viewScale);
      const nodeBaseHue = (node.baseHue !== null && node.baseHue !== undefined) ? node.baseHue : (scaleBase.h + (params.scaleIndex % currentScale.notes.length) * HUE_STEP) % 360;
      const baseSaturation = scaleBase.s * 0.8; const baseLightness = scaleBase.l * (0.7 + node.size * 0.2); const hueShiftSpeed = 10; const currentHue = (nodeBaseHue + (now * hueShiftSpeed)) % 360;
      ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.translate(node.x + wobbleX, node.y + wobbleY);
      const numBlobs = 5; const baseRadiusNeb = NODE_RADIUS_BASE * node.size * 1.1;
      for (let i = 0; i < numBlobs; i++) { const angleOffset = (now * (0.1 + i * 0.02) + node.id + i * 1.1); const distFactor = 0.15 + ((Math.sin(now * 0.15 + i * 0.9) + 1) / 2) * 0.25; const offsetX = Math.cos(angleOffset) * baseRadiusNeb * distFactor; const offsetY = Math.sin(angleOffset) * baseRadiusNeb * distFactor; const radiusFactor = 0.6 + ((Math.cos(now * 0.2 + i * 1.3) + 1) / 2) * 0.4; const blobRadius = baseRadiusNeb * radiusFactor * 0.7; const blobAlpha = 0.15 + ((Math.sin(now * 0.25 + i * 1.5) + 1) / 2) * 0.15; const blobLightness = baseLightness * (0.95 + ((Math.cos(now * 0.18 + i) + 1) / 2) * 0.15); const blobSaturation = baseSaturation * (0.9 + ((Math.sin(now * 0.22 + i * 0.5) + 1) / 2) * 0.15); const finalBlobAlpha = Math.min(1.0, blobAlpha * 1.5); ctx.fillStyle = hslToRgba(currentHue, blobSaturation, blobLightness, finalBlobAlpha); ctx.beginPath(); ctx.arc(offsetX, offsetY, blobRadius, 0, Math.PI * 2); ctx.fill(); }
      const coreRadius = baseRadiusNeb * 0.3; const coreAlpha = 0.3; ctx.fillStyle = hslToRgba(currentHue, baseSaturation * 1.1, baseLightness * 1.1, coreAlpha); ctx.beginPath(); ctx.arc(0, 0, coreRadius, 0, Math.PI * 2); ctx.fill(); ctx.restore();
      ctx.save(); const currentGlowColor = glowColor; ctx.shadowColor = currentGlowColor; const pulseEffect = (Math.sin(node.pulsePhase) * 0.5 + 0.5) * 8; const currentGlowAmount = 3 + pulseEffect + (isSelectedAndOutlineNeeded ? 5 : 0); ctx.shadowBlur = Math.min(20 / viewScale, currentGlowAmount / viewScale); ctx.fillStyle = "rgba(0,0,0,0)"; ctx.beginPath(); ctx.arc(node.x + wobbleX, node.y + wobbleY, baseRadiusNeb * 0.8, 0, Math.PI * 2); ctx.fill(); ctx.restore();
  } else if (node.type === PORTAL_NEBULA_TYPE) {
      const defaults = PORTAL_NEBULA_DEFAULTS; const pulseSpeed = defaults.pulseSpeed; const baseRadiusPortal = NODE_RADIUS_BASE * node.size; const nodeBaseHue = node.baseHue ?? defaults.baseColorHue; const hueShiftSpeed = 5; const currentHue = (nodeBaseHue + (now * hueShiftSpeed)) % 360; const saturation = scaleBase.s * 0.9; const lightness = scaleBase.l * 1.1;
      ctx.save(); const currentGlowColor = glowColor; ctx.shadowColor = currentGlowColor; const pulseEffectGlow = (Math.sin(node.pulsePhase * 0.8) * 0.5 + 0.5) * 15; const currentGlowAmount = 10 + pulseEffectGlow + (isSelectedAndOutlineNeeded ? 5 : 0); ctx.shadowBlur = Math.min(40 / viewScale, currentGlowAmount / viewScale);
      const irisRadiusFactor = 0.4 + Math.sin(node.pulsePhase * pulseSpeed) * 0.1; const irisRadius = baseRadiusPortal * irisRadiusFactor; const irisAlpha = 0.7 + Math.sin(node.pulsePhase * pulseSpeed) * 0.2; ctx.fillStyle = hslToRgba(currentHue, saturation * 1.1, lightness * 1.2, irisAlpha); ctx.beginPath(); ctx.arc(node.x, node.y, Math.max(1 / viewScale, irisRadius), 0, Math.PI * 2); ctx.fill(); ctx.restore();
      const numRings = 4; const originalLineWidth = ctx.lineWidth; ctx.lineWidth = Math.max(0.5 / viewScale, 1.5 / viewScale);
      for (let i = 1; i <= numRings; i++) { const ringPulsePhase = node.pulsePhase * (pulseSpeed * (1 + i * 0.1)); const ringRadiusFactor = 0.6 + i * 0.25 + Math.sin(ringPulsePhase) * 0.08; const ringRadius = baseRadiusPortal * ringRadiusFactor; const ringAlpha = 0.1 + (1 - i / numRings) * 0.3 + Math.sin(ringPulsePhase) * 0.05; const ringLightness = lightness * (1.0 - i * 0.1); ctx.strokeStyle = hslToRgba(currentHue, saturation * (1.0 - i * 0.05), ringLightness, ringAlpha); ctx.beginPath(); if (ringRadius > 0) { ctx.arc(node.x, node.y, ringRadius, 0, Math.PI * 2); ctx.stroke(); } }
      ctx.lineWidth = originalLineWidth;
  } else if (isPulsarType(node.type)) {
      const outerR = r;
      const innerR = outerR * 0.4;
      const points = node.starPoints || 6;

      if (node.type === "pulsar_rocket") {
          ctx.save();
          ctx.translate(node.x, node.y);
          const drawingAngleRad = (node.audioParams.rocketDirectionAngle || 0) - (Math.PI / 2);
          ctx.rotate(drawingAngleRad);
          ctx.beginPath();
          ctx.arc(0, 0, outerR * 0.9, 0, Math.PI * 2);
          ctx.fillStyle = fillColor;
          ctx.fill();
          ctx.strokeStyle = borderColor;
          ctx.lineWidth = Math.max(0.5 / viewScale, (isSelectedAndOutlineNeeded ? baseLineWidth + 1.5 / viewScale : baseLineWidth) * 0.8);
          ctx.stroke();
          const barrelLength = outerR * 1.4;
          const barrelWidth = outerR * 0.5;
          ctx.fillStyle = borderColor;
          ctx.strokeStyle = fillColor;
          ctx.lineWidth = Math.max(0.5 / viewScale, baseLineWidth * 0.5 / viewScale);
          ctx.beginPath();
          const barrelBaseOffset = outerR * 0.2;
          if (typeof ctx.roundRect === 'function') {
              ctx.roundRect(barrelBaseOffset, -barrelWidth / 2, barrelLength - barrelBaseOffset, barrelWidth, barrelWidth / 3);
          } else {
              ctx.rect(barrelBaseOffset, -barrelWidth / 2, barrelLength - barrelBaseOffset, barrelWidth);
          }
          ctx.fill();
          ctx.stroke();
          ctx.restore();

          if (isSelectedAndOutlineNeeded) {
              const handleOrbitRadius = outerR * 1.6;
              const drawingAngleForHandleRad = (node.audioParams.rocketDirectionAngle || 0) - (Math.PI / 2);
              const handleDisplayOffsetAngleRad = Math.PI / 4;
              const handleActualDisplayAngleRad = drawingAngleForHandleRad + handleDisplayOffsetAngleRad;
              const handleGripX = node.x + Math.cos(handleActualDisplayAngleRad) * handleOrbitRadius;
              const handleGripY = node.y + Math.sin(handleActualDisplayAngleRad) * handleOrbitRadius;
              const handleGripRadius = 6 / viewScale;
              ctx.beginPath();
              ctx.arc(handleGripX, handleGripY, handleGripRadius, 0, Math.PI * 2);
              ctx.fillStyle = 'rgba(255, 255, 0, 0.6)';
              ctx.fill();
              ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
              ctx.lineWidth = Math.max(0.5 / viewScale, 1.5 / viewScale);
              ctx.stroke();
              ctx.beginPath();
              ctx.arc(node.x, node.y, handleOrbitRadius * 0.9, drawingAngleForHandleRad - 0.5, drawingAngleForHandleRad + 0.5);
              ctx.strokeStyle = 'rgba(255, 255, 0, 0.7)';
              ctx.lineWidth = Math.max(0.5 / viewScale, 2 / viewScale);
              ctx.stroke();
          }
      } else {
          drawStarShape(ctx, node.x, node.y, points, outerR, innerR);
          ctx.fill();
          ctx.stroke();
          if (node.type === "pulsar_triggerable") {
               const lockSize = outerR * 0.5; ctx.fillStyle = isStartNodeDisabled ? disabledFillColorGeneral : borderColor; ctx.strokeStyle = isStartNodeDisabled ? disabledBorderColorGeneral : fillColor; ctx.lineWidth = baseLineWidth * 0.5 / viewScale; ctx.beginPath(); ctx.rect(node.x - lockSize * 0.3, node.y - lockSize * 0.25, lockSize * 0.6, lockSize * 0.5); ctx.moveTo(node.x + lockSize * 0.3, node.y - lockSize * 0.25); ctx.arc(node.x, node.y - lockSize * 0.25, lockSize * 0.4, 0, Math.PI, true); ctx.stroke();
          }
      }
  } else {
    ctx.beginPath(); ctx.arc(node.x, node.y, r, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  }

  if (isSelectedAndOutlineNeeded && node.type !== "pulsar_rocket") {
    ctx.save(); ctx.shadowBlur = 0; ctx.strokeStyle = "rgba(255, 255, 0, 0.9)";
    ctx.lineWidth = Math.max(0.5 / viewScale, 1.5 / viewScale); ctx.beginPath();
    const outlineRadius = (NODE_RADIUS_BASE * node.size + 2 ); 
    const finalOutlineX = node.x + wobbleX; const finalOutlineY = node.y + wobbleY;
    ctx.arc(finalOutlineX, finalOutlineY, outlineRadius, 0, Math.PI * 2); ctx.stroke(); ctx.restore();
  }
  if (needsRestore) { ctx.restore(); }
  ctx.shadowBlur = 0;

  if (params && params.retriggerEnabled && params.retriggerVolumeSteps && params.retriggerVolumeSteps.length > 0) {
    const steps = params.retriggerVolumeSteps;
    const count = steps.length;
    const activeVisualIndex = node.currentRetriggerVisualIndex;
    const nodeBaseDrawRadiusForVisuals = (NODE_RADIUS_BASE * node.size) ;
    const visualOffsetFromNodeEdgeScaled = nodeBaseDrawRadiusForVisuals * 0.35;
    const visualStartRadiusScaled = nodeBaseDrawRadiusForVisuals + visualOffsetFromNodeEdgeScaled;
    const totalAngleSpan = Math.PI * 1.9;
    const segmentAngle = count > 1 ? totalAngleSpan / Math.max(1, count -1) : 0;
    let nodeCanvasRotation = 0;
    if (node.type === "gate" && node.currentAngle !== undefined) {
        nodeCanvasRotation = node.currentAngle;
    }
    const startAngleRad = -Math.PI / 2 - (count > 1 ? totalAngleSpan / 2 : 0) + nodeCanvasRotation;
    for (let i = 0; i < count; i++) {
        const volumeFactor = steps[i] || 0;
        const isActive = (i === activeVisualIndex);
        const angle = startAngleRad + i * segmentAngle;
        const gasBaseLength = (6 / viewScale);
        const gasVolumeLength = (volumeFactor * 12 / viewScale);
        const totalVisualLength = gasBaseLength + gasVolumeLength;
        const gasWidth = Math.max(1 / viewScale, (3 / viewScale) + (volumeFactor * 6 / viewScale));
        const radialStartX = node.x + Math.cos(angle) * visualStartRadiusScaled;
        const radialStartY = node.y + Math.sin(angle) * visualStartRadiusScaled;
        const radialEndX = node.x + Math.cos(angle) * (visualStartRadiusScaled + totalVisualLength);
        const radialEndY = node.y + Math.sin(angle) * (visualStartRadiusScaled + totalVisualLength);
        ctx.save(); ctx.beginPath(); ctx.moveTo(radialStartX, radialStartY); ctx.lineTo(radialEndX, radialEndY);
        let Rval = 160, Gval = 190, Bval = 230; let nodeFillColor = fillColor;
        try {
            const rgbaMatch = nodeFillColor.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*[\d\.]+)?\)/);
            if(rgbaMatch) { Rval = parseInt(rgbaMatch[1]); Gval = parseInt(rgbaMatch[2]); Bval = parseInt(rgbaMatch[3]); }
        } catch(e){}
        if (isActive) { Rval = Math.min(255, Rval + 80); Gval = Math.min(255, Gval + 60); Bval = Math.max(30, Bval - 60); }
        const alphaVal = 0.25 + volumeFactor * 0.5 + (isActive ? 0.35 : 0);
        ctx.strokeStyle = `rgba(${Rval},${Gval},${Bval},${Math.min(0.9, alphaVal)})`;
        ctx.lineWidth = gasWidth; ctx.lineCap = 'round';
        ctx.shadowColor = `rgba(${Rval},${Gval},${Bval},${Math.min(0.7, alphaVal * 0.8)})`;
        ctx.shadowBlur = (isActive ? 10 : 5) / viewScale;
        ctx.stroke(); ctx.restore();
    }
  }

  if (node.type === 'sound' && params.orbitonesEnabled && params.orbitoneCount > 0 && node.audioNodes?.orbitoneOscillators) {
    const orbitBaseRadius = NODE_RADIUS_BASE * node.size * 1.5; 
    const orbitoneVisualSize = NODE_RADIUS_BASE * node.size * 0.25; 
    const numVisualOrbitones = params.orbitoneCount; 
    const mainNodeFillColor = fillColor; 
    const mainNodeBorderColor = borderColor;

    for (let i = 0; i < numVisualOrbitones; i++) {
        const angleIncrement = (Math.PI * 2) / numVisualOrbitones;
        const baseAngle = i * angleIncrement;
        const orbitSpeedFactor = 0.15 + (i * 0.03); 
        const currentAngle = baseAngle + (now * orbitSpeedFactor + node.id * 0.3); 
        const orbitRadiusVariation = Math.sin(now * 0.4 + i * 0.7) * (orbitBaseRadius * 0.1);
        const currentOrbitRadius = orbitBaseRadius + orbitRadiusVariation;
        const ox = node.x + Math.cos(currentAngle) * currentOrbitRadius;
        const oy = node.y + Math.sin(currentAngle) * currentOrbitRadius;
        let orbitFill = 'rgba(200, 220, 255, 0.3)';
        let orbitStroke = 'rgba(230, 240, 255, 0.5)';
        try {
            const mainRgbMatch = mainNodeFillColor.match(/\d+/g);
            if (mainRgbMatch && mainRgbMatch.length >=3) {
                const mainRgb = mainRgbMatch.map(Number);
                const baseAlphaOrbitone = 0.3 + params.orbitoneVolumeVariation * 0.2;
                orbitFill = `rgba(${Math.min(255, mainRgb[0] + i*5 + 10)}, ${Math.min(255, mainRgb[1] - i*3 + 5)}, ${Math.max(0, mainRgb[2] - i*8 + 15)}, ${baseAlphaOrbitone})`;
                orbitStroke = `rgba(${Math.min(255, mainRgb[0] + i*3 + 30)}, ${Math.min(255, mainRgb[1] + 15)}, ${Math.max(0, mainRgb[2] + 5)}, ${baseAlphaOrbitone + 0.2})`;
            }
        } catch(e) {}
        ctx.fillStyle = orbitFill; ctx.strokeStyle = orbitStroke;
        ctx.lineWidth = Math.max(0.5 / viewScale, 0.8 / viewScale); 
        ctx.beginPath();
        ctx.arc(ox, oy, Math.max(1 / viewScale, orbitoneVisualSize), 0, Math.PI * 2);
        ctx.fill();
        if (isSelectedAndOutlineNeeded || node.animationState > 0.05) { 
            ctx.shadowColor = orbitStroke;
            ctx.shadowBlur = (3 + node.animationState * 5) / viewScale;
            ctx.stroke();
            ctx.shadowBlur = 0;
        } else {
            ctx.stroke();
        }
    }
}

  if (isInfoTextVisible) {
    const fontSize = Math.max(8 / viewScale, 10 / viewScale); ctx.font = `bold ${fontSize}px sans-serif`;
    ctx.textAlign = "center"; ctx.textBaseline = "middle"; let labelText = ""; let secondLineText = "";
    const baseRadiusForLabel = NODE_RADIUS_BASE * node.size;
    let labelYOffset = baseRadiusForLabel * 1.1 + fontSize / 1.5 + 2 / viewScale;
    ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
    if (node.type === "sound" || node.type === "nebula") {
        labelText = getNoteNameFromScaleIndex(currentScale, params.scaleIndex);
        const presetDef = analogWaveformPresets.find(p => p.type === params.waveform) || fmSynthPresets.find(p => p.type === params.waveform);
        if (presetDef && presetDef.label !== labelText) {
            secondLineText = presetDef.label;
        }
        if (node.type === "sound" && params.orbitonesEnabled && params.orbitoneCount > 0) {
            secondLineText = (secondLineText ? secondLineText + " " : "") + `(+${params.orbitoneCount} Orb)`;
        }
        if (node.type === "sound" && params.waveform?.startsWith("sampler_")) { labelYOffset = baseRadiusForLabel * 1.3 + fontSize / 1.5 + 2 / viewScale; }
        else if (node.type === "nebula") { labelYOffset = (baseRadiusForLabel * 1.1) * 1.2 + fontSize / 1.5 + 2 / viewScale; }
    }
    else if (node.type === PORTAL_NEBULA_TYPE) { labelText = "Portal"; labelYOffset = (baseRadiusForLabel * 1.1) + fontSize / 1.5 + 2 / viewScale; }
    else if (isPulsarType(node.type)) {
        let typeLabel = pulsarTypes.find((pt) => pt.type === node.type)?.label || "Pulsar";
        labelText = typeLabel;
        if (!node.isEnabled && node.type !== "pulsar_manual") labelText += " (Off)";
        if (node.type === "pulsar_random_volume") { secondLineText = `Int: Random`; }
        else if (node.type === "pulsar_manual") { secondLineText = `Int: ${(params.pulseIntensity ?? DEFAULT_PULSE_INTENSITY).toFixed(1)}`;}
        else if (node.type !== "pulsar_rocket") {
            if (node.type === "pulsar_random_particles") { secondLineText = "Timing: Random"; }
            else if (isGlobalSyncEnabled && !node.audioParams.ignoreGlobalSync) {
                 const subdivIndexToUse = node.audioParams.syncSubdivisionIndex ?? DEFAULT_SUBDIVISION_INDEX;
                 const subdiv = subdivisionOptions[subdivIndexToUse];
                 secondLineText = `Sync: ${subdiv?.label ?? "?"}`;
            }
            else { secondLineText = `Intv: ${(params.triggerInterval || DEFAULT_TRIGGER_INTERVAL).toFixed(1)}s`; }
            if (node.type !== "pulsar_random_volume") { secondLineText += ` | Int: ${(params.pulseIntensity ?? DEFAULT_PULSE_INTENSITY).toFixed(1)}`; }
        } else if (node.type === "pulsar_rocket") {
            const angleDeg = ((params.rocketDirectionAngle || 0) * 180 / Math.PI).toFixed(0);
            secondLineText = `Dir: ${angleDeg}°`;
        }
    }
    else if (isDrumType(node.type)) { labelText = DRUM_ELEMENT_DEFAULTS[node.type]?.label || "Drum"; labelYOffset = baseRadiusForLabel + fontSize / 1.5 + 2 / viewScale; }
    else if (node.type === "gate") { labelText = GATE_MODES[node.gateModeIndex || 0]; }
    else if (node.type === "probabilityGate") { labelText = `${(params.probability * 100).toFixed(0)}%`; }
    else if (node.type === "pitchShift") { const amount = PITCH_SHIFT_AMOUNTS[node.pitchShiftIndex || 0]; labelText = (amount > 0 ? "+" : "") + amount + (node.pitchShiftAlternating ? " ⇄" : ""); }
    else if (node.type === "relay") { labelText = "Relay"; labelYOffset = (baseRadiusForLabel * 0.6) + fontSize / 1.5 + 2 / viewScale; }
    else if (node.type === "reflector") { labelText = "Reflector"; }
    else if (node.type === "switch") { labelText = "Switch"; labelYOffset = baseRadiusForLabel * 0.9 + fontSize / 1.5 + 2 / viewScale; }
    const finalLabelX = node.x + wobbleX; const finalLabelYBase = node.y + wobbleY;
    if (labelText) { ctx.fillText(labelText, finalLabelX, finalLabelYBase + labelYOffset); }
    if (secondLineText) { ctx.fillText(secondLineText, finalLabelX, finalLabelYBase + labelYOffset + fontSize * 1.1); }
  }
}

function drawRoundedRect(ctx, x, y, width, height, radius) {
  if (typeof ctx.roundRect === 'function') {
      ctx.beginPath();
      ctx.roundRect(x, y, width, height, radius);
  } else {
      radius = Math.min(radius, width / 2, height / 2);
      ctx.beginPath();
      ctx.moveTo(x + radius, y);
      ctx.lineTo(x + width - radius, y);
      ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
      ctx.lineTo(x + width, y + height - radius);
      ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
      ctx.lineTo(x + radius, y + height);
      ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
      ctx.lineTo(x, y + radius);
      ctx.quadraticCurveTo(x, y, x + radius, y);
      ctx.closePath();
  }
}

function drawTemporaryConnection() {
  if (isConnecting && connectingNode) {
      
      

      ctx.save(); 

      
      let strokeStyle = 'rgba(255, 255, 255, 0.5)';
      let lineWidth = 1 / viewScale;
      let lineDash = [5 / viewScale, 5 / viewScale];

      
      if (connectionTypeToAdd === 'string_violin') {
          strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--string-violin-connection-color').trim() || '#ffccaa';
          lineWidth = 2 / viewScale;
          lineDash = [5 / viewScale, 3 / viewScale];
      } else if (connectionTypeToAdd === 'glide') {
          strokeStyle = GLIDE_LINE_COLOR;
          lineWidth = GLIDE_LINE_WIDTH / viewScale;
          lineDash = [8 / viewScale, 4 / viewScale];
      } else if (connectionTypeToAdd === 'wavetrail') {
           
           strokeStyle = 'rgba(150, 255, 150, 1.0)'; 
           lineWidth = 3 / viewScale; 
           lineDash = []; 
           ctx.globalAlpha = 1.0; 
      }

      
      ctx.strokeStyle = strokeStyle;
      ctx.lineWidth = Math.max(0.5, lineWidth);
      ctx.setLineDash(lineDash);
      

      
      ctx.beginPath();
      ctx.moveTo(connectingNode.x, connectingNode.y);
      ctx.lineTo(mousePos.x, mousePos.y);
      ctx.stroke();

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
  
  
  
  
  
  
  const localDeltaTime = Math.max(0, Math.min(0.1, now - (previousFrameTime || now)));


  ctx.save();
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.translate(viewOffsetX, viewOffsetY);
  ctx.scale(viewScale, viewScale);

  drawBackground(now);
  drawGrid();
  updateAndDrawParticles(localDeltaTime, now); 

  
  updateAndDrawRockets(localDeltaTime, now); 

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


  if (isConnecting && (currentTool === 'connect' || currentTool === 'connect_string' || currentTool === 'connect_glide' || currentTool === 'connect_wavetrail')) {
      drawTemporaryConnection();
  } else if (currentTool === 'brush' && isBrushing && lastBrushNode) {
      ctx.save();
      const brushLineColor = 'rgba(255, 255, 100, 0.7)';
      const brushLineWidth = Math.max(0.6, 1.2 / viewScale);
      const brushLineDash = [5 / viewScale, 3 / viewScale];
      ctx.strokeStyle = brushLineColor;
      ctx.lineWidth = brushLineWidth;
      ctx.setLineDash(brushLineDash);
      ctx.beginPath();
      ctx.moveTo(lastBrushNode.x, lastBrushNode.y);
      ctx.lineTo(mousePos.x, mousePos.y);
      ctx.stroke();
      ctx.restore();
  }

  drawSelectionRect();
  ctx.restore();
  ctx.setLineDash([]);
}
function updateNebulaInteractionAudio() {
    
    if (!audioContext || !nodes || nodes.length < 2) return;

    const now = audioContext.currentTime;
    const interactionTimeConstant = 0.1; 
    const nebulas = nodes.filter(n => n.type === "nebula");
    const currentInteractingKeys = new Set();
    const previouslyCloseKeys = new Set(activeNebulaInteractions.keys());

    
    for (let i = 0; i < nebulas.length; i++) {
        for (let j = i + 1; j < nebulas.length; j++) {
            const a = nebulas[i];
            const b = nebulas[j];
            
            if (!a.audioNodes?.filterNode || !b.audioNodes?.filterNode ||
                !a.audioNodes.oscillators || !b.audioNodes.oscillators ||
                !a.audioNodes.filterLfo?.frequency || !b.audioNodes.filterLfo?.frequency 
               ) continue;

            const dx = a.x - b.x;
            const dy = a.y - b.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const pairKey = `${Math.min(a.id, b.id)}-${Math.max(a.id, b.id)}`;

            if (dist < 120) {
                currentInteractingKeys.add(pairKey);
                
                const modFactor = Math.max(0, Math.min(1, 1.0 - (dist / 120.0)));
                activeNebulaInteractions.set(pairKey, { a, b, modFactor }); 

                try {
                    
                    const baseFreqA = a.audioParams.pitch;
                    const sizeRangeA = MAX_NODE_SIZE - MIN_NODE_SIZE;
                    const normalizedSizeA = (a.size - MIN_NODE_SIZE) / (sizeRangeA || 1);
                    
                    const defaultFilterFreqA = baseFreqA * 2 + normalizedSizeA * baseFreqA * (a.audioParams.filterFreqFactor || 12); 
                    
                    const targetFilterFreqA = defaultFilterFreqA - modFactor * (defaultFilterFreqA * 0.60);
                    a.audioNodes.filterNode.frequency.setTargetAtTime(Math.max(20, targetFilterFreqA), now, interactionTimeConstant); 

                    const baseFreqB = b.audioParams.pitch;
                    const sizeRangeB = MAX_NODE_SIZE - MIN_NODE_SIZE;
                    const normalizedSizeB = (b.size - MIN_NODE_SIZE) / (sizeRangeB || 1);
                    const defaultFilterFreqB = baseFreqB * 2 + normalizedSizeB * baseFreqB * (b.audioParams.filterFreqFactor || 12);
                    const targetFilterFreqB = defaultFilterFreqB - modFactor * (defaultFilterFreqB * 0.60);
                    b.audioNodes.filterNode.frequency.setTargetAtTime(Math.max(20, targetFilterFreqB), now, interactionTimeConstant);

                    
                    const baseDetune = a.audioParams.detune || NEBULA_OSC_DETUNE || 7; 
                    const maxAdditionalDetune = baseDetune * 2.0; 
                    const targetDetune = baseDetune + modFactor * maxAdditionalDetune;

                    
                    a.audioNodes.oscillators.forEach((osc, osc_idx) => {
                        if (osc_idx > 0 && osc.detune) {
                           const direction = (osc_idx % 2 === 0 ? 1 : -1) * Math.ceil(osc_idx / 2); 
                           osc.detune.setTargetAtTime(direction * targetDetune, now, interactionTimeConstant);
                        }
                    });
                     b.audioNodes.oscillators.forEach((osc, osc_idx) => {
                        if (osc_idx > 0 && osc.detune) {
                           const direction = (osc_idx % 2 === 0 ? 1 : -1) * Math.ceil(osc_idx / 2);
                           osc.detune.setTargetAtTime(direction * targetDetune, now, interactionTimeConstant);
                        }
                    });

                    
                    const baseLfoRate = NEBULA_FILTER_LFO_RATE; 
                    const maxLfoRateVariation = baseLfoRate * 2.0; 
                    
                    const targetLfoRateA = baseLfoRate + modFactor * maxLfoRateVariation;
                    const targetLfoRateB = baseLfoRate - modFactor * (baseLfoRate * 0.75); 

                    a.audioNodes.filterLfo.frequency.setTargetAtTime(Math.max(0.01, targetLfoRateA), now, interactionTimeConstant);
                    b.audioNodes.filterLfo.frequency.setTargetAtTime(Math.max(0.01, targetLfoRateB), now, interactionTimeConstant);

                    
                    
                    
                    
                    
                    
                    
                    


                } catch (e) { console.error(`Error applying interaction effect for ${pairKey}:`, e); }
            }
        }
    }

    
    activeNebulaInteractions.forEach((interactionData, pairKey) => {
        if (!currentInteractingKeys.has(pairKey)) {
            const { a, b } = interactionData;
            try {
                 
                 if (a?.audioNodes && b?.audioNodes) {
                    
                    if(a.audioNodes.filterNode?.frequency) {
                        const baseFreqA = a.audioParams.pitch; const sizeRangeA = MAX_NODE_SIZE - MIN_NODE_SIZE; const normalizedSizeA = (a.size - MIN_NODE_SIZE) / (sizeRangeA || 1); const defaultFilterFreqA = baseFreqA * 2 + normalizedSizeA * baseFreqA * (a.audioParams.filterFreqFactor || 12);
                        a.audioNodes.filterNode.frequency.setTargetAtTime(defaultFilterFreqA, now, interactionTimeConstant);
                    }
                    
                    if(b.audioNodes.filterNode?.frequency) {
                        const baseFreqB = b.audioParams.pitch; const sizeRangeB = MAX_NODE_SIZE - MIN_NODE_SIZE; const normalizedSizeB = (b.size - MIN_NODE_SIZE) / (sizeRangeB || 1); const defaultFilterFreqB = baseFreqB * 2 + normalizedSizeB * baseFreqB * (b.audioParams.filterFreqFactor || 12);
                        b.audioNodes.filterNode.frequency.setTargetAtTime(defaultFilterFreqB, now, interactionTimeConstant);
                    }
                    
                    const baseDetuneA = a.audioParams.detune || NEBULA_OSC_DETUNE || 7;
                    a.audioNodes.oscillators?.forEach((osc, osc_idx) => {
                         if (osc_idx > 0 && osc.detune) { const direction = (osc_idx % 2 === 0 ? 1 : -1) * Math.ceil(osc_idx / 2); osc.detune.setTargetAtTime(direction * baseDetuneA, now, interactionTimeConstant); }
                    });
                    
                     const baseDetuneB = b.audioParams.detune || NEBULA_OSC_DETUNE || 7;
                     b.audioNodes.oscillators?.forEach((osc, osc_idx) => {
                         if (osc_idx > 0 && osc.detune) { const direction = (osc_idx % 2 === 0 ? 1 : -1) * Math.ceil(osc_idx / 2); osc.detune.setTargetAtTime(direction * baseDetuneB, now, interactionTimeConstant); }
                    });
                    
                    if (a.audioNodes.filterLfo?.frequency) {
                        a.audioNodes.filterLfo.frequency.setTargetAtTime(NEBULA_FILTER_LFO_RATE, now, interactionTimeConstant);
                    }
                    
                    if (b.audioNodes.filterLfo?.frequency) {
                        b.audioNodes.filterLfo.frequency.setTargetAtTime(NEBULA_FILTER_LFO_RATE, now, interactionTimeConstant);
                    }
                    
                    
                 }
            } catch(e) { console.error(`Error resetting interaction effect for ${pairKey}:`, e); }

            activeNebulaInteractions.delete(pairKey); 
        }
    });
}



function drawPlasmaBridge(ctx, nodeA, nodeB, alpha) { 
  const midX = (nodeA.x + nodeB.x) / 2;
  const midY = (nodeA.y + nodeB.y) / 2;
  const now = audioContext ? audioContext.currentTime : performance.now() / 1000;

  ctx.save();

  
  const scaleBase = currentScale.baseHSL || { h: 200, s: 70, l: 70 };
  const noteIndexA = nodeA.audioParams.scaleIndex % currentScale.notes.length;
  const hueA = (scaleBase.h + noteIndexA * HUE_STEP) % 360;
  const lightnessA = scaleBase.l * (0.8 + nodeA.size * 0.2);
  const saturationA = scaleBase.s * 0.7; 

  const noteIndexB = nodeB.audioParams.scaleIndex % currentScale.notes.length;
  const hueB = (scaleBase.h + noteIndexB * HUE_STEP) % 360;
  const lightnessB = scaleBase.l * (0.8 + nodeB.size * 0.2);
  const saturationB = scaleBase.s * 0.7;

  
  
  let avgHue = (hueA + hueB) / 2;
  if (Math.abs(hueA - hueB) > 180) { 
       avgHue = (hueA + hueB + 360) / 2 % 360;
  }
  const avgSaturation = (saturationA + saturationB) / 2;
  const avgLightness = (lightnessA + lightnessB) / 2 * 1.1; 

  
  const pulseSpeed = 2.5;
  const minRadiusFactor = 0.8;
  const maxRadiusFactor = 1.1;
  const pulseRange = maxRadiusFactor - minRadiusFactor;
  const pulseFactor = minRadiusFactor + ((Math.sin(now * pulseSpeed) + 1) / 2) * pulseRange; 

  const baseOuterRadius = 60; 
  const outerRadius = baseOuterRadius * pulseFactor;
  const innerRadius = 10 * pulseFactor; 

  
  try {
      const grad = ctx.createRadialGradient(midX, midY, innerRadius, midX, midY, outerRadius);
      
      grad.addColorStop(0, hslToRgba(avgHue, avgSaturation, avgLightness * 1.1, alpha * 0.9));
      
      grad.addColorStop(0.5, hslToRgba(avgHue, avgSaturation, avgLightness, alpha * 0.5));
      
      grad.addColorStop(1, hslToRgba(avgHue, avgSaturation, avgLightness * 0.9, 0));

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(midX, midY, outerRadius, 0, Math.PI * 2); 
      ctx.fill();

  } catch (e) {
       console.error("Error creating/drawing plasma gradient:", e);
       
       ctx.fillStyle = hslToRgba(avgHue, avgSaturation, avgLightness, alpha * 0.3);
       ctx.beginPath();
       ctx.arc(midX, midY, baseOuterRadius * 0.5, 0, Math.PI * 2);
       ctx.fill();
  }

  ctx.restore();
}

function generateWaveformPath(audioBuffer, targetPointCount = 200) {
  if (!audioBuffer || targetPointCount <= 0) {
      return null;
  }
  try {
      
      const channelData = audioBuffer.getChannelData(0);
      const totalSamples = channelData.length;
      const points = Math.min(targetPointCount, totalSamples); 
      if (points <= 0) return [{min: 0, max: 0}]; 

      const waveformPath = [];
      const samplesPerPoint = Math.floor(totalSamples / points);

      if (samplesPerPoint <= 0) { 
           for(let i = 0; i < points; i++) {
               const sampleIndex = Math.min(totalSamples - 1, Math.floor(i * (totalSamples / points)));
               const sample = channelData[sampleIndex] || 0;
               waveformPath.push({ min: sample, max: sample });
           }
           return waveformPath;
      }


      let currentSampleIndex = 0;
      for (let i = 0; i < points; i++) {
          const chunkEnd = Math.min(totalSamples, currentSampleIndex + samplesPerPoint);
          let chunkMin = 1.0;
          let chunkMax = -1.0;

          
          for (let j = currentSampleIndex; j < chunkEnd; j++) {
              const sample = channelData[j];
              if (sample < chunkMin) {
                  chunkMin = sample;
              }
              if (sample > chunkMax) {
                  chunkMax = sample;
              }
          }
           
           if (chunkMin > chunkMax) {
               const sample = channelData[currentSampleIndex] || 0;
               chunkMin = sample;
               chunkMax = sample;
           }

          waveformPath.push({ min: chunkMin, max: chunkMax });
          currentSampleIndex = chunkEnd; 
           
           if (samplesPerPoint === 0 && currentSampleIndex >= totalSamples) break;
      }

      
      while (waveformPath.length < targetPointCount && waveformPath.length > 0) {
           waveformPath.push({...waveformPath[waveformPath.length - 1]});
      }
       if(waveformPath.length === 0) return [{min: 0, max: 0}]; 

      return waveformPath;

  } catch (error) {
      console.error("Error generating waveform path:", error);
      return null;
  }
}

function launchRocket(pulsarNode, pulseData) {
  console.log(`%c[launchRocket] CALLED for pulsar: ${pulsarNode.id}, Type: ${pulsarNode.type}`, 'color: #00FF00; font-weight: bold;');
  if (!audioContext) {
      console.warn("[launchRocket] AudioContext not ready, aborting.");
      return;
  }
  const params = pulsarNode.audioParams;
  const directionAngleFromUI_rad = params.rocketDirectionAngle || 0; 
  const speed = params.rocketSpeed || ROCKET_DEFAULT_SPEED;

  
  
  
  const effectiveLaunchAngleRad = directionAngleFromUI_rad - (Math.PI / 2);

  console.log(`%c[launchRocket] UI Angle (0=up): ${directionAngleFromUI_rad.toFixed(2)} rad (${(directionAngleFromUI_rad * 180 / Math.PI).toFixed(1)}°). Effective Math Angle (0=right): ${effectiveLaunchAngleRad.toFixed(2)} rad (${(effectiveLaunchAngleRad * 180 / Math.PI).toFixed(1)}°)`, 'color: #00AAFF;');

  const rocket = {
    id: rocketIdCounter++,
    sourcePulsarId: pulsarNode.id,
    startX: pulsarNode.x,
    startY: pulsarNode.y,
    currentX: pulsarNode.x,
    currentY: pulsarNode.y,
    vx: speed * Math.cos(effectiveLaunchAngleRad), 
    vy: speed * Math.sin(effectiveLaunchAngleRad), 
    gravity: params.rocketGravity || ROCKET_DEFAULT_GRAVITY,
    speed: speed,
    range: params.rocketRange || ROCKET_DEFAULT_RANGE,
    creationTime: audioContext.currentTime,
    distanceTraveled: 0,
    pulseData: { ...pulseData, color: pulsarNode.color || pulseData.color || getComputedStyle(document.documentElement).getPropertyValue('--pulse-visual-color').trim() },
    maxLifeTime: (params.rocketRange || ROCKET_DEFAULT_RANGE) / speed,
    previousX: pulsarNode.x,
    previousY: pulsarNode.y
  };
  activeRockets.push(rocket);
  console.log(`%c[launchRocket] Rocket ${rocket.id} ADDED. vx: ${rocket.vx.toFixed(2)}, vy: ${rocket.vy.toFixed(2)}. Total active: ${activeRockets.length}`, 'color: #00FF00;');
}

function updateAndDrawRockets(deltaTime, now) {
  if (activeRockets.length > 0) {
      console.log(`%c[updateAndDrawRockets] CALLED. Active rockets: ${activeRockets.length}`, 'color: #FFA500;');
  }

  activeRockets = activeRockets.filter(rocket => {
    rocket.previousX = rocket.currentX;
    rocket.previousY = rocket.currentY;

    rocket.currentX += rocket.vx * deltaTime;
    rocket.currentY += rocket.vy * deltaTime;
    rocket.vy += rocket.gravity * deltaTime;
    rocket.distanceTraveled += Math.sqrt(Math.pow(rocket.vx * deltaTime, 2) + Math.pow(rocket.vy * deltaTime, 2));

    

    if (rocket.distanceTraveled >= rocket.range || (now - rocket.creationTime) > rocket.maxLifeTime * 1.1) {
      console.log(`%c[updateAndDrawRockets] Rocket ${rocket.id} EXPIRED (range/lifetime). Creating explosion.`, 'color: #FF6347;');
      createExplosionAnimation(rocket.currentX, rocket.currentY, rocket.pulseData.color);
      return false;
    }

    const hitNode = checkRocketNodeCollision(rocket);
    if (hitNode) {
      console.log(`%c[updateAndDrawRockets] Rocket ${rocket.id} HIT NODE ${hitNode.id}. Creating explosion.`, 'color: #FF6347;');
      createExplosionAnimation(rocket.currentX, rocket.currentY, rocket.pulseData.color);
      const uniquePulseIdForHit = currentGlobalPulseId + rocket.id + hitNode.id;
      propagateTrigger(hitNode, 0, uniquePulseIdForHit, rocket.sourcePulsarId, Infinity, { type: 'trigger', data: rocket.pulseData }, null);
      return false;
    }

    const hitConnection = checkRocketConnectionCollision(rocket);
    if (hitConnection) {
      console.log(`%c[updateAndDrawRockets] Rocket ${rocket.id} HIT CONNECTION ${hitConnection.id}. Creating explosion.`, 'color: #FF6347;');
      createExplosionAnimation(rocket.currentX, rocket.currentY, rocket.pulseData.color);
      const nodeA = findNodeById(hitConnection.nodeAId);
      const nodeB = findNodeById(hitConnection.nodeBId);
      if (nodeA && nodeB) {
        const uniquePulseIdForConnA = currentGlobalPulseId + rocket.id + nodeA.id + hitConnection.id;
        const uniquePulseIdForConnB = currentGlobalPulseId + rocket.id + nodeB.id + hitConnection.id;
        createVisualPulse(hitConnection.id, hitConnection.length * DELAY_FACTOR, nodeA.id, Infinity, 'trigger', rocket.pulseData.color, rocket.pulseData.intensity);
        propagateTrigger(nodeB, hitConnection.length * DELAY_FACTOR, uniquePulseIdForConnA, nodeA.id, Infinity, { type: 'trigger', data: rocket.pulseData }, hitConnection);
        createVisualPulse(hitConnection.id, hitConnection.length * DELAY_FACTOR, nodeB.id, Infinity, 'trigger', rocket.pulseData.color, rocket.pulseData.intensity);
        propagateTrigger(nodeA, hitConnection.length * DELAY_FACTOR, uniquePulseIdForConnB, nodeB.id, Infinity, { type: 'trigger', data: rocket.pulseData }, hitConnection);
      }
      return false;
    }

    ctx.save();
    const rocketColor = rocket.pulseData.color || 'rgba(255, 220, 150, 0.95)';
    const visualSize = ROCKET_PULSE_VISUAL_SIZE / viewScale;

    ctx.fillStyle = rocketColor;
    ctx.shadowColor = rocketColor;
    ctx.shadowBlur = 8 / viewScale;
    ctx.beginPath();
    ctx.arc(rocket.currentX, rocket.currentY, visualSize, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    const tailLength = Math.max(visualSize * 1.5, 15 / viewScale);
    const angle = Math.atan2(rocket.vy, rocket.vx);
    const tailGradient = ctx.createLinearGradient(
        rocket.currentX, rocket.currentY,
        rocket.currentX - tailLength * Math.cos(angle), rocket.currentY - tailLength * Math.sin(angle)
    );
    try {
        tailGradient.addColorStop(0, rocketColor.replace(/[\d\.]+\)$/g, '0.7)'));
        tailGradient.addColorStop(1, rocketColor.replace(/[\d\.]+\)$/g, '0)'));
    } catch(e) {}

    ctx.strokeStyle = tailGradient;
    ctx.lineWidth = Math.max(1, visualSize * 1.2);
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(rocket.currentX, rocket.currentY);
    ctx.lineTo(
        rocket.currentX - tailLength * Math.cos(angle) * 0.8,
        rocket.currentY - tailLength * Math.sin(angle) * 0.8
    );
    ctx.stroke();
    ctx.restore();

    return true;
  });
}

function checkRocketNodeCollision(rocket) {
  for (const node of nodes) {
    if (node.id === rocket.sourcePulsarId) continue;
    if (node.type === 'nebula' || node.type === PORTAL_NEBULA_TYPE) continue;

    const collisionRadius = NODE_RADIUS_BASE * node.size * 0.8;
    const dist = distance(rocket.currentX, rocket.currentY, node.x, node.y);

    

    if (dist < collisionRadius) {
      return node;
    }
  }
  return null;
}


function checkRocketConnectionCollision(rocket) {
  const collisionThreshold = 15 / viewScale; 
  for (const conn of connections) {
    const nA = findNodeById(conn.nodeAId);
    const nB = findNodeById(conn.nodeBId);
    if (!nA || !nB) continue;

    
    const midControlX = (nA.x + nB.x) / 2 + conn.controlPointOffsetX;
    const midControlY = (nA.y + nB.y) / 2 + conn.controlPointOffsetY;
    
    const curveMidX = lerp(lerp(nA.x, midControlX, 0.5), lerp(midControlX, nB.x, 0.5), 0.5);
    const curveMidY = lerp(lerp(nA.y, midControlY, 0.5), lerp(midControlY, nB.y, 0.5), 0.5);

    const distToMid = distance(rocket.currentX, rocket.currentY, curveMidX, curveMidY);

    if (distToMid < collisionThreshold + (conn.length / 15)) { 
        
        
        const lineMinX = Math.min(nA.x, nB.x) - collisionThreshold;
        const lineMaxX = Math.max(nA.x, nB.x) + collisionThreshold;
        const lineMinY = Math.min(nA.y, nB.y) - collisionThreshold;
        const lineMaxY = Math.max(nA.y, nB.y) + collisionThreshold;

        if (rocket.currentX >= lineMinX && rocket.currentX <= lineMaxX &&
            rocket.currentY >= lineMinY && rocket.currentY <= lineMaxY) {

            
            
            
            const dxToCurve = curveMidX - rocket.currentX;
            const dyToCurve = curveMidY - rocket.currentY;
            
            const dotProduct = rocket.vx * dxToCurve + rocket.vy * dyToCurve;

            if (dotProduct > 0) { 
                 return conn;
            }
        }
    }
  }
  return null;
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
  if (!node || node.type !== "nebula") return; 
  const nebulaBasicWaveforms = analogWaveformPresets
    .filter(preset => ["sine", "square", "sawtooth", "triangle"].includes(preset.type))
    .map(preset => preset.type);

  if (nebulaBasicWaveforms.length === 0) {
    console.warn("handleWaveformCycle: No basic analog waveforms found for Nebula.");
    return;
  }

  const currentWaveform = node.audioParams.waveform || "sawtooth"; 
  let currentIndex = nebulaBasicWaveforms.indexOf(currentWaveform);

  if (currentIndex === -1) {

    currentIndex = 0;
  }

  const nextIndex = (currentIndex + 1) % nebulaBasicWaveforms.length;
  const newWaveform = nebulaBasicWaveforms[nextIndex];

  node.audioParams.waveform = newWaveform;

  
  if (node.audioNodes && node.audioNodes.oscillators) {
    
    node.audioNodes.oscillators.forEach((osc) => {
      if (osc.type !== newWaveform) {
        try {
          osc.type = newWaveform;
        } catch (e) {
          console.error(`Error setting oscillator type to ${newWaveform} for Nebula:`, e);
          
          osc.type = "sawtooth";
          node.audioParams.waveform = "sawtooth";
        }
      }
    });
  }

  updateNodeAudioParams(node); 
  node.animationState = 0.3;
  setTimeout(() => {
    const checkNode = findNodeById(node.id);
    if (checkNode && !checkNode.isTriggered) checkNode.animationState = 0;
  }, 150);

  populateEditPanel(); 
  saveState();
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


function createExplosionAnimation(x, y, color) {
  const explosionColor = color || 'rgba(255, 180, 80, 0.9)'; 
  for (let i = 0; i < ROCKET_EXPLOSION_PARTICLES; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 1.0 + Math.random() * 2.5; 
    const life = 0.4 + Math.random() * 0.5;  
    activeParticles.push({
      id: particleIdCounter++, x: x, y: y,
      vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed,
      life: life, maxLife: life, radius: 1.5 + Math.random() * 2.0, color: explosionColor
    });
  }
}

let _tempWasSelectedAtMouseDown = false;

function handleMouseDown(event) {
  console.log(`DEBUG handleMouseDown Start: currentTool='${currentTool}', nodeTypeToAdd='${nodeTypeToAdd}'`);

  if (!isPlaying && event.target === canvas) { togglePlayPause(); return; }
  if (!isAudioReady) return;

  const targetIsPanelControl = hamburgerMenuPanel.contains(event.target) ||
                             sideToolbar.contains(event.target) ||
                             transportControlsDiv.contains(event.target) ||
                             mixerPanel.contains(event.target);
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
  isRotatingRocket = null;

  if (potentialNodeClicked && potentialNodeClicked.type === "pulsar_rocket" &&
      isElementSelected('node', potentialNodeClicked.id) && currentTool === 'edit') {
      const outerR = NODE_RADIUS_BASE * potentialNodeClicked.size * (1 + potentialNodeClicked.animationState * 0.5);
      const handleOrbitRadius = outerR * 1.6;
      const handleGripRadius = 7 / viewScale;
      const drawingAngleRad = (potentialNodeClicked.audioParams.rocketDirectionAngle || 0) - (Math.PI / 2);
      const handleDisplayAngleRad = drawingAngleRad + Math.PI / 4;
      const handleGripX_world = potentialNodeClicked.x + Math.cos(handleDisplayAngleRad) * handleOrbitRadius;
      const handleGripY_world = potentialNodeClicked.y + Math.sin(handleDisplayAngleRad) * handleOrbitRadius;
      const distToHandle = distance(mousePos.x, mousePos.y, handleGripX_world, handleGripY_world);

      if (distToHandle < handleGripRadius) {
          isRotatingRocket = potentialNodeClicked;
          isDragging = false;
          const initialMouseAngleToNodeCenterRad = Math.atan2(mousePos.y - isRotatingRocket.y, mousePos.x - isRotatingRocket.x);
          rotationStartDetails = {
              screenX: screenMousePos.x,
              screenY: screenMousePos.y,
              initialNodeUIAngleRad: isRotatingRocket.audioParams.rocketDirectionAngle || 0,
              initialMouseMathAngleRad: initialMouseAngleToNodeCenterRad
          };
          canvas.style.cursor = 'grabbing';
          console.log(`%c[MouseDown] Starting rotation for Rocket Pulsar ${isRotatingRocket.id}`, 'color: orange');
          nodeClickedAtMouseDown = null;
          elementClickedAtMouseDown = null;
          connectionClickedAtMouseDown = null;
      }
  }


  if (event.button === 1 || (isSpacebarDown && event.button === 0)) {
      isPanning = true;
      panStart = { ...screenMousePos };
      canvas.style.cursor = 'grabbing';
      nodeClickedAtMouseDown = null;
      connectionClickedAtMouseDown = null;
      elementClickedAtMouseDown = null;
      isRotatingRocket = null; 
      return;
  }

  if (isRotatingRocket) { 
      return;
  }

  if (elementClickedAtMouseDown) {
      const element = elementClickedAtMouseDown;
      const node = element.type === 'node' ? nodeClickedAtMouseDown : null;

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
      } else {
          if (currentTool === 'connect' || currentTool === 'connect_string' || currentTool === 'connect_glide' || currentTool === 'connect_wavetrail') {
              console.log("DEBUG MouseDown: Connect tool active. Clicked on node?", !!node);
              if (node && !['nebula', PORTAL_NEBULA_TYPE].includes(node.type)) {
                  console.log("DEBUG MouseDown: Starting connection from node", node.id);
                  isConnecting = true;
                  connectingNode = node;
                  if (currentTool === 'connect_string') {
                      connectionTypeToAdd = 'string_violin';
                  } else if (currentTool === 'connect_glide') {
                      connectionTypeToAdd = 'glide';
                  } else if (currentTool === 'connect_wavetrail') {
                      connectionTypeToAdd = 'wavetrail';
                  } else {
                      connectionTypeToAdd = 'standard';
                  }
                  console.log("DEBUG MouseDown: connectionTypeToAdd =", connectionTypeToAdd);
                  canvas.style.cursor = 'grabbing';
              } else if (node) {
                   console.log("DEBUG MouseDown: Cannot start connection from node type:", node.type);
              } else {
                   console.log("DEBUG MouseDown: Connect tool active but did not click on a node.");
              }
          } else if (currentTool === 'delete') {
              if (node) removeNode(node);
              else if (connectionClickedAtMouseDown) removeConnection(connectionClickedAtMouseDown);
              nodeClickedAtMouseDown = null;
              connectionClickedAtMouseDown = null;
          } else if (currentTool === 'edit') {
               let selectionChanged = false;
               if (!isElementSelected(element.type, element.id)) {
                   selectedElements.clear();
                   selectedElements.add(element);
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
           console.log(`DEBUG handleMouseDown: 'add' mode detected, node will be added on mouseUp.`);
           if (!event.shiftKey && selectedElements.size > 0) {
               selectedElements.clear();
               updateConstellationGroup();
               populateEditPanel();
           }
      } else if (!['connect', 'connect_string', 'connect_glide', 'connect_wavetrail', 'delete'].includes(currentTool)) {
          if (selectedElements.size > 0 && !event.shiftKey) {
              selectedElements.clear();
              updateGroupControlsUI();
              populateEditPanel();
          }
      }
  }
  hideOverlappingPanels();
}

function handleMouseUp(event) {
  if (!isAudioReady) return;
  const targetIsPanelControl = hamburgerMenuPanel.contains(event.target) || sideToolbar.contains(event.target) || transportControlsDiv.contains(event.target) || mixerPanel.contains(event.target);
  if (targetIsPanelControl) {
      isDragging = false; isConnecting = false; isResizing = false; isSelecting = false; isPanning = false; isRotatingRocket = null;
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
  const wasRotatingARocket = isRotatingRocket;

  const nodeClickedStart = nodeClickedAtMouseDown;
  const connectionClickedStart = connectionClickedAtMouseDown;
  const elementClickedStart = nodeClickedStart ? { type: 'node', id: nodeClickedStart.id } : (connectionClickedStart ? { type: 'connection', id: connectionClickedStart.id } : null);
  let stateWasChanged = false;

  isResizing = false;
  isConnecting = false;
  isDragging = false;
  isSelecting = false;
  isPanning = false;
  isRotatingRocket = null;
  selectionRect.active = false;
  canvas.style.cursor = 'crosshair';

  if (wasRotatingARocket) {
    console.log(`%c[MouseUp] Finished rotation for Rocket Pulsar ${wasRotatingARocket.id}`, 'color: orange');
    saveState();
    stateWasChanged = true;
  } else if (wasConnecting) {
      console.log(`%c[handleMouseUp - Connect] connectingNode: ${connectingNode?.id}, nodeUnderCursor: ${nodeUnderCursor?.id}, type: ${nodeUnderCursor?.type}`, 'color: orange');
      if (connectingNode && nodeUnderCursor && nodeUnderCursor !== connectingNode && !['nebula', PORTAL_NEBULA_TYPE].includes(nodeUnderCursor.type)) {
        console.log(`%c[handleMouseUp - Connect] Attempting to connect ${connectingNode.id} to ${nodeUnderCursor.id}`, 'color: lightgreen');
        connectNodes(connectingNode, nodeUnderCursor, connectionTypeToAdd);
        stateWasChanged = true;
      } else {
        console.log(`%c[handleMouseUp - Connect] Conditions not met for connection. connectingNode: ${!!connectingNode}, nodeUnderCursor: ${!!nodeUnderCursor}, different: ${nodeUnderCursor !== connectingNode}, valid type: ${!['nebula', PORTAL_NEBULA_TYPE].includes(nodeUnderCursor?.type)}`, 'color: red');
      }
      connectingNode = null;
      connectionTypeToAdd = 'standard';
  }
  else if (wasResizing) {
      stateWasChanged = true;
  }
  else if (wasDragging) {
       stateWasChanged = true;
       identifyAndRouteAllGroups();
  }
  else if (wasSelecting && didDrag) {
      const selX1 = Math.min(selectionRect.startX, selectionRect.endX);
      const selY1 = Math.min(selectionRect.startY, selectionRect.endY);
      const selX2 = Math.max(selectionRect.startX, selectionRect.endX);
      const selY2 = Math.max(selectionRect.startY, selectionRect.endY);
      if (!event.shiftKey) selectedElements.clear();
      nodes.forEach(n => {
          if (n.x >= selX1 && n.x <= selX2 && n.y >= selY1 && n.y <= selY2) {
              selectedElements.add({ type: 'node', id: n.id });
          }
      });
      connections.forEach(c => {
          const nA = findNodeById(c.nodeAId);
          const nB = findNodeById(c.nodeBId);
          if (nA && nB) {
              const midX = (nA.x + nB.x) / 2 + c.controlPointOffsetX;
              const midY = (nA.y + nB.y) / 2 + c.controlPointOffsetY;
              if (midX >= selX1 && midX <= selX2 && midY >= selY1 && midY <= selY2) {
                  selectedElements.add({ type: 'connection', id: c.id });
              }
          }
      });
      stateWasChanged = true;
      updateConstellationGroup();
      populateEditPanel();
  }
  else if (!wasDragging && !wasPanning && !wasResizing && !wasRotatingARocket) { 
      if (currentTool === 'brush') {
          if (!elementUnderCursor) {
              let typeToPlace = brushNodeType;
              let subtypeToPlace = (brushNodeType === 'sound') ? brushWaveform : null;
              if (!isBrushing && brushStartWithPulse) {
                  typeToPlace = 'pulsar_standard';
                  subtypeToPlace = null;
              }
              const newNode = addNode(mousePos.x, mousePos.y, typeToPlace, subtypeToPlace);
              if (newNode) {
                  stateWasChanged = true;
                  if (isBrushing && lastBrushNode) {
                      connectNodes(lastBrushNode, newNode, 'standard');
                  }
                  lastBrushNode = newNode;
                  isBrushing = true;
                  selectedElements.clear();
                  selectedElements.add({ type: 'node', id: newNode.id });
                  populateEditPanel();
              }
          } else {
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
                              else if (node.isStartNode && node.type !== 'pulsar_triggerable' && node.type !== 'pulsar_random_particles' && node.type !== "pulsar_rocket") { if (isGlobalSyncEnabled) { handleSubdivisionCycle(node); } else { handleTapTempo(node); } stateWasChanged = true; }
                              else if (node.type === 'sound' || node.type === 'nebula') { handlePitchCycle(targetElement); stateWasChanged = true; }
                              else if (node.type === 'gate') { handleGateCycle(node); stateWasChanged = true; }
                              else if (node.type === 'probabilityGate') { handleProbabilityCycle(node); stateWasChanged = true; }
                              else if (node.type === 'pitchShift') { handlePitchShiftCycle(node); stateWasChanged = true; }
                              else if (isDrumType(node.type)) { triggerNodeEffect(node); }
                          } else if (connection && connection.type === 'string_violin') { handlePitchCycle(targetElement); stateWasChanged = true; }
                      } else {
                          if (!isElementSelected(targetElement.type, targetElement.id) || selectedElements.size > 1) {
                              selectedElements.clear();
                              selectedElements.add(targetElement);
                              updateConstellationGroup();
                              populateEditPanel();
                              stateWasChanged = true;
                          }
                      }
                  }
              }
          } else if (!elementClickedStart && !event.shiftKey) {
               if (selectedElements.size > 0) {
                   selectedElements.clear();
                   updateConstellationGroup();
                   populateEditPanel();
                   stateWasChanged = true;
               }
               isBrushing = false;
               lastBrushNode = null;
          }
      } else {
          isBrushing = false;
          lastBrushNode = null;
          if (currentTool === 'add' && !elementClickedStart) {
              const directAddTypes = ['gate', 'probabilityGate', 'pitchShift', 'relay', 'reflector', 'switch'];
              const canAddNode = directAddTypes.includes(nodeTypeToAdd) ||
                                 (nodeTypeToAdd === 'sound' && waveformToAdd) ||
                                 (nodeTypeToAdd === 'nebula' && waveformToAdd) ||
                                 (isPulsarType(nodeTypeToAdd)) ||
                                 (isDrumType(nodeTypeToAdd)) ||
                                 (nodeTypeToAdd === PORTAL_NEBULA_TYPE);
              console.log(`DEBUG handleMouseUp: 'add' tool, canAddNode=${canAddNode}`);
              if (canAddNode) {
                  const newNode = addNode(mousePos.x, mousePos.y, nodeTypeToAdd, waveformToAdd);
                  if (newNode) {
                      console.log(`DEBUG handleMouseUp: Node added, id=${newNode.id}`);
                      if (!event.shiftKey) selectedElements.clear();
                      selectedElements.add({type: 'node', id: newNode.id});
                      populateEditPanel();
                      stateWasChanged = true;
                  } else {
                       console.error("DEBUG handleMouseUp: addNode failed!");
                  }
              }
          } else if (currentTool === 'delete' && elementClickedStart) {
              if (elementClickedStart.type === 'node') removeNode(nodeClickedStart);
              else if (elementClickedStart.type === 'connection') removeConnection(connectionClickedStart);
              stateWasChanged = true;
          } else if (!elementClickedStart && !event.shiftKey) {
               if (selectedElements.size > 0) {
                   selectedElements.clear();
                   updateGroupControlsUI();
                   populateEditPanel();
                   stateWasChanged = true;
               }
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
  if (!isAudioReady) return;
  updateMousePos(event);

  if (isRotatingRocket) {
    const dx = mousePos.x - isRotatingRocket.x;
    const dy = mousePos.y - isRotatingRocket.y;
    const currentMouseMathAngleRad = Math.atan2(dy, dx);
    let newUIAngleRad = currentMouseMathAngleRad + (Math.PI / 2);
    newUIAngleRad = (newUIAngleRad % (Math.PI * 2) + (Math.PI * 2)) % (Math.PI * 2);
    isRotatingRocket.audioParams.rocketDirectionAngle = newUIAngleRad;
    if (!hamburgerMenuPanel.classList.contains("hidden") && selectedElements.has({type: 'node', id: isRotatingRocket.id})) {
        populateEditPanel();
    }
    didDrag = true;
    canvas.style.cursor = 'grabbing';
    return;
  }

  const dragThreshold = 7;
  if (!didDrag && (isDragging || isResizing || isConnecting || isSelecting || isPanning) &&
      distance(
          screenMousePos.x, screenMousePos.y,
          mouseDownPos.x * viewScale + viewOffsetX,
          mouseDownPos.y * viewScale + viewOffsetY
      ) > dragThreshold
  ) {
      didDrag = true;
      if (isSelecting) {
          selectionRect.active = true;
      }
  }

  if (isPanning) {
      const dx = screenMousePos.x - panStart.x;
      const dy = screenMousePos.y - panStart.y;
      viewOffsetX += dx;
      viewOffsetY += dy;
      panStart = { ...screenMousePos };
      canvas.style.cursor = "grabbing";
  } else if (isResizing && nodeClickedAtMouseDown) {
      const dy_screen = screenMousePos.y - resizeStartY;
      const scaleFactor = 1 + dy_screen / 100;
      const targetNode = findNodeById(nodeClickedAtMouseDown.id);
      if (targetNode) {
          targetNode.size = Math.max(
              MIN_NODE_SIZE,
              Math.min(MAX_NODE_SIZE, resizeStartSize * scaleFactor)
          );
          updateNodeAudioParams(targetNode);
      }
      canvas.style.cursor = "ns-resize";
  } else if (isConnecting) {
      canvas.style.cursor = "grabbing";
  } else if (isSelecting && didDrag) {
      selectionRect.endX = mousePos.x;
      selectionRect.endY = mousePos.y;
      canvas.style.cursor = "crosshair";
  } else if (isDragging && didDrag) {
      const dx_world = mousePos.x - dragStartPos.x;
      const dy_world = mousePos.y - dragStartPos.y;
      const effectiveSnap = isSnapEnabled && !event.shiftKey;
      selectedElements.forEach((el) => {
          if (el.type === "node") {
              const n = findNodeById(el.id);
              const offset = nodeDragOffsets.get(el.id);
              if (n && offset) {
                  let targetX = dragStartPos.x + offset.x + dx_world;
                  let targetY = dragStartPos.y + offset.y + dy_world;
                  if (effectiveSnap) {
                      const snapped = snapToGrid(targetX, targetY);
                      targetX = snapped.x;
                      targetY = snapped.y;
                  }
                  n.x = targetX;
                  n.y = targetY;
              }
          }
      });
      connections.forEach((conn) => {
          const nodeASelected = isElementSelected("node", conn.nodeAId);
          const nodeBSelected = isElementSelected("node", conn.nodeBId);
          if (nodeASelected || nodeBSelected) {
              const nA = findNodeById(conn.nodeAId);
              const nB = findNodeById(conn.nodeBId);
              if (nA && nB) conn.length = distance(nA.x, nA.y, nB.x, nB.y);
          }
      });
      canvas.style.cursor = "move";
  } else {
      const hN = findNodeAt(mousePos.x, mousePos.y);
      const hC = !hN ? findConnectionNear(mousePos.x, mousePos.y) : null;
       if (currentTool === "edit" && event.altKey && hN && (hN.type === "sound" || hN.type === "nebula" || hN.type === "pitchShift")) { canvas.style.cursor = "pointer"; }
       else if (currentTool === "edit" && event.altKey && hC && hC.type === "string_violin") { canvas.style.cursor = "pointer"; }
       else if (currentTool === "edit" && event.shiftKey && hN && hN.type !== "pulsar_rocket") { canvas.style.cursor = "ns-resize"; }
       else if (currentTool === "edit" && hN && hN.type === "pulsar_rocket" && isElementSelected('node', hN.id)) {
            const outerR = NODE_RADIUS_BASE * hN.size * (1 + hN.animationState * 0.5);
            const handleOrbitRadius = outerR * 1.6;
            const handleGripRadiusView = 7 / viewScale; 
            const drawingAngleRad = (hN.audioParams.rocketDirectionAngle || 0) - (Math.PI / 2);
            const handleDisplayAngleRad = drawingAngleRad + Math.PI / 4;
            const handleGripX_world = hN.x + Math.cos(handleDisplayAngleRad) * handleOrbitRadius;
            const handleGripY_world = hN.y + Math.sin(handleDisplayAngleRad) * handleOrbitRadius;
            const distToHandle = distance(mousePos.x, mousePos.y, handleGripX_world, handleGripY_world);
            if (distToHandle < handleGripRadiusView * viewScale) { 
                 canvas.style.cursor = "grab"; 
            } else {
                 canvas.style.cursor = "move";
            }
       }
       else if ((currentTool === "connect" || currentTool === "connect_string" || currentTool === 'connect_glide' || currentTool === 'connect_wavetrail') && hN && !['nebula', PORTAL_NEBULA_TYPE].includes(hN.type)) { canvas.style.cursor = "grab"; }
       else if (currentTool === "delete" && (hN || hC)) { canvas.style.cursor = "pointer"; }
       else if (currentTool === "edit" && (hN || hC)) { canvas.style.cursor = "move"; }
       else if (currentTool === "add" || currentTool === 'brush') { canvas.style.cursor = "copy"; }
       else { canvas.style.cursor = "crosshair"; }
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




function setActiveTool(toolName) {
  if (currentTool === 'brush' && toolName !== 'brush') {
      isBrushing = false;
      lastBrushNode = null;
      if (brushBtn) brushBtn.classList.remove('active');
  }

  if ((currentTool === "add" || currentTool === "brush") && toolName !== "add" && toolName !== "brush") {
      nodeTypeToAdd = null;
      waveformToAdd = null;
      noteIndexToAdd = -1;
      const addAndSoundButtons = toolbar.querySelectorAll("#toolbar-pulsars button, #toolbar-logic-nodes button, #toolbar-environment-nodes button, #toolbar-sound-generators button");
      addAndSoundButtons.forEach((btn) => btn.classList.remove("active"));
      if (brushBtn) brushBtn.classList.remove("active");
  }

  currentTool = toolName;
  connectingNode = null;
  isConnecting = false;
  

  editBtn.classList.toggle("active", toolName === "edit");
  connectBtn.classList.toggle("active", toolName === "connect");
  connectStringBtn.classList.toggle("active", toolName === "connect_string");
  if (glideToolButton) glideToolButton.classList.toggle('active', toolName === 'connect_glide');
  if (connectWaveTrailBtn) connectWaveTrailBtn.classList.toggle('active', toolName === 'connect_wavetrail');
  deleteBtn.classList.toggle("active", toolName === "delete");
  if (brushBtn) brushBtn.classList.toggle('active', toolName === 'brush');


  if (toolName !== "add" && toolName !== "brush") {
      hideOverlappingPanels();
  } else if (toolName === 'add' || toolName === 'brush') {
      if (hamburgerMenuPanel) hamburgerMenuPanel.classList.add("hidden");
      if (hamburgerBtn) hamburgerBtn.classList.remove("active");
  }

  if (toolName !== 'edit' || (hamburgerMenuPanel && hamburgerMenuPanel.classList.contains('hidden'))) {
       if (sideToolbar && toolName !== 'add' && toolName !== 'brush') sideToolbar.classList.add("hidden");
       if (hamburgerMenuPanel) hamburgerMenuPanel.classList.add("hidden");
       if (hamburgerBtn) hamburgerBtn.classList.remove("active");
  }

  isResizing = false;
  isSelecting = false;
  selectionRect.active = false;
  isPanning = false;

  updateGroupControlsUI();
  updateRestartPulsarsButtonVisibility();

  if (toolName === "edit") {
      populateEditPanel();
  } else {
      if (editPanelContent) editPanelContent.innerHTML = "";
  }
}

function populateEditPanel() {
  editPanelContent.innerHTML = "";
  if (currentTool !== "edit" || selectedElements.size === 0) {
    if (hamburgerMenuPanel && !hamburgerMenuPanel.classList.contains("hidden") && selectedElements.size === 0) {
      hamburgerMenuPanel.classList.add("hidden");
      if (hamburgerBtn) hamburgerBtn.classList.remove("active");
    }
    return;
  }

  const selectedArray = Array.from(selectedElements);
  const firstElementData = selectedArray[0];
  const fragment = document.createDocumentFragment();
  const title = document.createElement("p");
  const nodeTypes = new Set(selectedArray.filter((el) => el.type === "node").map((el) => findNodeById(el.id)?.type));
  const connectionTypesSet = new Set(selectedArray.filter((el) => el.type === "connection").map((el) => findConnectionById(el.id)?.type));
  let titleText = ""; let allSameLogicalType = false; let logicalType = "";

  if (selectedArray.length === 1) {
    const element = firstElementData.type === "node" ? findNodeById(firstElementData.id) : findConnectionById(firstElementData.id);
    if (element) {
      logicalType = element.type.replace(/_/g, " ");
      titleText = `Edit ${logicalType} #${element.id}`;
      allSameLogicalType = true;
    } else {
      titleText = "Edit Element";
    }
  } else {
    const types = new Set([...nodeTypes, ...connectionTypesSet]);
    if (types.size === 1) {
      logicalType = [...types][0].replace(/_/g, " ");
      titleText = `Edit ${selectedArray.length} ${logicalType}s`;
      allSameLogicalType = true;
    } else {
      titleText = `Edit ${selectedArray.length} Elements (Mixed Types)`;
      allSameLogicalType = false;
    }
  }
  title.innerHTML = `<strong>${titleText}</strong>`;
  fragment.appendChild(title);

  const elementsWithNote = selectedArray.filter((elData) => {
    const el = elData.type === "node" ? findNodeById(elData.id) : findConnectionById(elData.id);
    return (el && (el.type === "sound" || el.type === "nebula" || (elData.type === "connection" && el.type === "string_violin")));
  });

  if (elementsWithNote.length > 0) {
    const targetDataForNoteSelector = elementsWithNote.map((el) => ({ type: el.type, id: el.id }));
    createHexNoteSelectorDOM(fragment, targetDataForNoteSelector);
  }

  if (allSameLogicalType) {
    if (firstElementData.type === "node") {
      const node = findNodeById(firstElementData.id);
      if (node && node.audioParams) {
        if (isPulsarType(node.type) || node.type === 'sound' || isDrumType(node.type)) {
            const syncIgnoreSection = document.createElement("div"); syncIgnoreSection.classList.add("panel-section");
            const ignoreSyncLabel = document.createElement("label"); ignoreSyncLabel.htmlFor = `edit-node-ignore-sync-${node.id}`;
            ignoreSyncLabel.textContent = "Ignore Global Sync:"; ignoreSyncLabel.style.marginRight = "5px";
            syncIgnoreSection.appendChild(ignoreSyncLabel);
            const ignoreSyncCheckbox = document.createElement("input"); ignoreSyncCheckbox.type = "checkbox";
            ignoreSyncCheckbox.id = `edit-node-ignore-sync-${node.id}`; ignoreSyncCheckbox.checked = node.audioParams.ignoreGlobalSync || false;
            ignoreSyncCheckbox.addEventListener("change", (e) => {
                selectedArray.forEach(elData => {
                    const n = findNodeById(elData.id);
                    if (n && n.audioParams) {
                        n.audioParams.ignoreGlobalSync = e.target.checked;
                         if (isPulsarType(n.type)) { n.lastTriggerTime = -1; n.nextSyncTriggerTime = 0; }
                    }
                });
                identifyAndRouteAllGroups(); saveState(); populateEditPanel();
            });
            syncIgnoreSection.appendChild(ignoreSyncCheckbox); fragment.appendChild(syncIgnoreSection);
        }
        if (isPulsarType(node.type)) {
            const section = document.createElement("div"); section.classList.add("panel-section");
            const enableLabel = document.createElement("label"); enableLabel.htmlFor = `edit-pulsar-enable-${node.id}`;
            enableLabel.textContent = node.type === "pulsar_triggerable" ? "Current State:" : "Enabled:";
            section.appendChild(enableLabel);
            const enableCheckbox = document.createElement("input"); enableCheckbox.type = "checkbox";
            enableCheckbox.id = `edit-pulsar-enable-${node.id}`; enableCheckbox.checked = node.isEnabled;
            enableCheckbox.disabled = selectedArray.length > 1 && node.type === "pulsar_triggerable";
            enableCheckbox.addEventListener("change", () => {handlePulsarTriggerToggle(node); identifyAndRouteAllGroups();});
            section.appendChild(enableCheckbox); section.appendChild(document.createElement("br"));
            const showSyncControls = isGlobalSyncEnabled && !node.audioParams.ignoreGlobalSync;
            if (node.type !== "pulsar_random_particles" && node.type !== "pulsar_manual") {
                if (showSyncControls) {
                    const subdivLabel = document.createElement("label"); subdivLabel.htmlFor = `edit-pulsar-subdiv-${node.id}`;
                    subdivLabel.textContent = "Sync Subdivision:"; section.appendChild(subdivLabel);
                    const subdivSelect = document.createElement("select"); subdivSelect.id = `edit-pulsar-subdiv-${node.id}`;
                    subdivSelect.disabled = selectedArray.length > 1;
                    subdivisionOptions.forEach((opt, index) => {
                        const option = document.createElement("option"); option.value = index; option.textContent = opt.label;
                        if (index === (node.audioParams.syncSubdivisionIndex ?? DEFAULT_SUBDIVISION_INDEX)) option.selected = true;
                        subdivSelect.appendChild(option);
                    });
                    subdivSelect.addEventListener("change", (e) => {
                        const newIndex = parseInt(e.target.value, 10);
                        selectedArray.forEach(elData => {
                            const n = findNodeById(elData.id);
                            if (n && n.audioParams && isPulsarType(n.type) && n.type !== "pulsar_random_particles" && n.type !== "pulsar_manual") {
                                n.audioParams.syncSubdivisionIndex = newIndex;
                                if(n.syncSubdivisionIndex !== undefined) n.syncSubdivisionIndex = newIndex;
                                n.nextSyncTriggerTime = 0;
                            }
                        });
                        identifyAndRouteAllGroups(); saveState();
                    });
                    section.appendChild(subdivSelect);
                } else {
                    const currentInterval = node.audioParams?.triggerInterval ?? DEFAULT_TRIGGER_INTERVAL;
                    const intervalVal = currentInterval.toFixed(1);
                    const intervalSliderContainer = createSlider(`edit-pulsar-interval-${node.id}`, `Interval (${intervalVal}s):`, 0.1, 10.0, 0.1, currentInterval, 
                    () => { identifyAndRouteAllGroups(); saveState(); }, 
                    (e_input) => {
                        const newInterval = parseFloat(e_input.target.value);
                        selectedArray.forEach((elData) => { const n = findNodeById(elData.id); if (n?.audioParams && n.type !== "pulsar_random_particles" && n.type !== "pulsar_manual") n.audioParams.triggerInterval = newInterval; });
                        e_input.target.previousElementSibling.textContent = `Interval (${newInterval.toFixed(1)}s):`;
                    });
                    section.appendChild(intervalSliderContainer);
                }
            } else if (node.type === "pulsar_random_particles") {
                const timingInfo = document.createElement("small");
                timingInfo.textContent = `Timing: Random (~${PULSAR_RANDOM_TIMING_CHANCE_PER_SEC.toFixed(1)}/sec avg)`;
                section.appendChild(timingInfo);
            }
            section.appendChild(document.createElement("br"));
            if (node.type !== "pulsar_random_volume") {
                const currentIntensity = node.audioParams?.pulseIntensity ?? DEFAULT_PULSE_INTENSITY;
                const intensityVal = currentIntensity.toFixed(2);
                const intensitySliderContainer = createSlider(`edit-pulsar-intensity-${node.id}`, `Pulse Intensity (${intensityVal}):`, MIN_PULSE_INTENSITY, MAX_PULSE_INTENSITY, 0.01, currentIntensity, 
                () => { identifyAndRouteAllGroups(); saveState(); }, 
                (e_input) => {
                    const newIntensity = parseFloat(e_input.target.value);
                    selectedArray.forEach((elData) => { const n = findNodeById(elData.id); if (n?.audioParams && n.type !== "pulsar_random_volume") n.audioParams.pulseIntensity = newIntensity; });
                    e_input.target.previousElementSibling.textContent = `Pulse Intensity (${newIntensity.toFixed(2)}):`;
                });
                section.appendChild(intensitySliderContainer);
            } else {
                const intensityInfo = document.createElement("small");
                intensityInfo.textContent = `Intensity: Random (${MIN_PULSE_INTENSITY.toFixed(1)} - ${MAX_PULSE_INTENSITY.toFixed(1)})`;
                section.appendChild(intensityInfo);
            }
            section.appendChild(document.createElement("br"));
            const colorLabel = document.createElement("label"); colorLabel.htmlFor = `edit-pulsar-color-${node.id}`;
            colorLabel.textContent = "Pulsar Color:"; section.appendChild(colorLabel);
            const colorInput = document.createElement("input"); colorInput.type = "color"; colorInput.id = `edit-pulsar-color-${node.id}`;
            const styles = getComputedStyle(document.documentElement);
            const defaultColorVar = `--${node.type.replace("_", "-")}-color`; const fallbackColorVar = "--start-node-color";
            const defaultColorRgba = styles.getPropertyValue(defaultColorVar).trim() || styles.getPropertyValue(fallbackColorVar).trim();
            const defaultColorHex = rgbaToHex(defaultColorRgba);
            colorInput.value = node.color ? rgbaToHex(node.color) : defaultColorHex;
            colorInput.addEventListener("input", (e) => {
                const newColor = hexToRgba(e.target.value, 0.9);
                selectedArray.forEach((elData) => { const n = findNodeById(elData.id); if (n) n.color = newColor; });
            });
            colorInput.addEventListener("change", () => { identifyAndRouteAllGroups(); saveState(); }); 
            section.appendChild(colorInput); fragment.appendChild(section);
            if (node.type === "pulsar_rocket") {
              const rocketSection = document.createElement("div"); rocketSection.classList.add("panel-section");
              const rocketTitle = document.createElement("p"); rocketTitle.innerHTML = "<strong>Rocket Settings:</strong>";
              rocketSection.appendChild(rocketTitle);
              let currentAngleDegVal = parseFloat(((node.audioParams.rocketDirectionAngle || 0) * 180 / Math.PI).toFixed(0));
              const dirSliderContainer = createSlider( `edit-rocket-dir-${node.id}`, `Direction (${currentAngleDegVal}°):`, 0, 359, 1, currentAngleDegVal, 
              () => { identifyAndRouteAllGroups(); saveState(); }, 
              (e_input) => {
                  const newAngleDeg = parseFloat(e_input.target.value);
                  selectedArray.forEach(elData => { const n = findNodeById(elData.id); if (n && n.type === "pulsar_rocket" && n.audioParams) { n.audioParams.rocketDirectionAngle = (newAngleDeg / 180) * Math.PI; } });
                  e_input.target.previousElementSibling.textContent = `Direction (${newAngleDeg.toFixed(0)}°):`;
              });
              rocketSection.appendChild(dirSliderContainer);
              let currentSpeedVal = parseFloat((node.audioParams.rocketSpeed || ROCKET_DEFAULT_SPEED).toFixed(1));
              const speedSliderContainer = createSlider( `edit-rocket-speed-${node.id}`, `Speed (${currentSpeedVal.toFixed(1)}):`, 50, 500, 1, currentSpeedVal, 
              () => { identifyAndRouteAllGroups(); saveState(); }, 
              (e_input) => {
                  const newSpeed = parseFloat(e_input.target.value);
                  selectedArray.forEach(elData => { const n = findNodeById(elData.id); if (n && n.type === "pulsar_rocket" && n.audioParams) { n.audioParams.rocketSpeed = newSpeed;} });
                  e_input.target.previousElementSibling.textContent = `Speed (${newSpeed.toFixed(1)}):`;
              });
              rocketSection.appendChild(speedSliderContainer);
              let currentRangeVal = parseFloat((node.audioParams.rocketRange || ROCKET_DEFAULT_RANGE).toFixed(0));
              const rangeSliderContainer = createSlider( `edit-rocket-range-${node.id}`, `Range (${currentRangeVal.toFixed(0)}):`, 50, 2000, 10, currentRangeVal, 
              () => { identifyAndRouteAllGroups(); saveState(); }, 
              (e_input) => {
                  const newRange = parseFloat(e_input.target.value);
                  selectedArray.forEach(elData => { const n = findNodeById(elData.id); if (n && n.type === "pulsar_rocket" && n.audioParams) { n.audioParams.rocketRange = newRange; } });
                  e_input.target.previousElementSibling.textContent = `Range (${newRange.toFixed(0)}):`;
              });
              rocketSection.appendChild(rangeSliderContainer);
              let currentGravityVal = parseFloat((node.audioParams.rocketGravity || ROCKET_DEFAULT_GRAVITY).toFixed(0));
              const gravitySliderContainer = createSlider( `edit-rocket-gravity-${node.id}`, `Gravity (${currentGravityVal.toFixed(0)}):`, -200, 200, 1, currentGravityVal, 
              () => { identifyAndRouteAllGroups(); saveState(); }, 
              (e_input) => {
                  const newGravity = parseFloat(e_input.target.value);
                  selectedArray.forEach(elData => { const n = findNodeById(elData.id); if (n && n.type === "pulsar_rocket" && n.audioParams) {n.audioParams.rocketGravity = newGravity;} });
                  e_input.target.previousElementSibling.textContent = `Gravity (${newGravity.toFixed(0)}):`;
              });
              rocketSection.appendChild(gravitySliderContainer); fragment.appendChild(rocketSection);
            }
        } else if (node && node.type === 'sound' && node.audioParams) {
            const orbitoneMainSection = document.createElement("div");
            orbitoneMainSection.classList.add("panel-section");
            orbitoneMainSection.innerHTML = "<p><strong>Orbitone Settings:</strong></p>"; 
            
            const enableOrbitonesLabel = document.createElement("label");
            enableOrbitonesLabel.htmlFor = `edit-node-orbitones-enable-${node.id}`;
            enableOrbitonesLabel.textContent = "Enable Orbitones:";
            enableOrbitonesLabel.style.marginRight = "8px";
            orbitoneMainSection.appendChild(enableOrbitonesLabel);
        
            const enableOrbitonesCheckbox = document.createElement("input");
            enableOrbitonesCheckbox.type = "checkbox";
            enableOrbitonesCheckbox.id = `edit-node-orbitones-enable-${node.id}`;
            enableOrbitonesCheckbox.checked = node.audioParams.orbitonesEnabled || false; 
            enableOrbitonesCheckbox.addEventListener("change", (e) => {
                const isEnabled = e.target.checked;
                selectedArray.forEach(elData => {
                    const n = findNodeById(elData.id);
                    if (n && n.audioParams && n.type === 'sound') {
                        n.audioParams.orbitonesEnabled = isEnabled; 
                        stopNodeAudio(n); 
                        n.audioNodes = createAudioNodesForNode(n);
                        if(n.audioNodes) updateNodeAudioParams(n); 
                    }
                });
                identifyAndRouteAllGroups(); saveState(); populateEditPanel(); 
            });
            orbitoneMainSection.appendChild(enableOrbitonesCheckbox);
            fragment.appendChild(orbitoneMainSection);
        
            if (node.audioParams.orbitonesEnabled) { 
                const orbitoneSettingsSection = document.createElement("div");
                orbitoneSettingsSection.classList.add("panel-section");
                orbitoneSettingsSection.style.paddingLeft = "15px";
                orbitoneSettingsSection.style.borderLeft = "2px solid var(--button-bg)";
                orbitoneSettingsSection.style.marginTop = "5px";
                
                const visualControllerPlaceholder = document.createElement("div");
                visualControllerPlaceholder.id = `orbitone-visual-controller-${node.id}`;
                visualControllerPlaceholder.innerHTML = "<em>Visual Orbitone Controller (Future)</em>";
                visualControllerPlaceholder.style.height = "auto"; 
                visualControllerPlaceholder.style.padding = "10px";
                visualControllerPlaceholder.style.border = "1px dashed var(--button-hover)";
                visualControllerPlaceholder.style.display = "flex";
                visualControllerPlaceholder.style.flexDirection = "column";
                visualControllerPlaceholder.style.alignItems = "center";
                visualControllerPlaceholder.style.justifyContent = "center";
                visualControllerPlaceholder.style.marginBottom = "15px";
                visualControllerPlaceholder.style.textAlign = "center";
                orbitoneSettingsSection.appendChild(visualControllerPlaceholder);

                const currentOrbitoneCount = node.audioParams.orbitoneCount || 0; 
                const orbitoneCountSliderContainer = createSlider(`edit-node-orbitone-count-${node.id}`, 
                    `Number of extra Orbitones (${currentOrbitoneCount}):`, 0, 5, 1, currentOrbitoneCount, 
                    (e_change_event) => { 
                        const newCount = parseInt(e_change_event.target.value);
                         selectedArray.forEach(elData => {
                            const n = findNodeById(elData.id);
                            if (n && n.audioParams && n.type === 'sound') {
                                n.audioParams.orbitoneCount = newCount; 
                                applyOrbitoneVoicingFromPhase(n); 
                                applyOrbitoneTimingFromPhase(n);
                                stopNodeAudio(n); n.audioNodes = createAudioNodesForNode(n); 
                                if(n.audioNodes) updateNodeAudioParams(n);
                            }
                        });
                        identifyAndRouteAllGroups(); saveState(); populateEditPanel(); 
                    },
                    (e_input) => { 
                        e_input.target.previousElementSibling.textContent = `Number of extra Orbitones (${e_input.target.value}):`; 
                    }
                );
                orbitoneSettingsSection.appendChild(orbitoneCountSliderContainer);
        
                if (node.audioParams.orbitoneCount > 0) {
                    const currentVoicingPhase = node.audioParams.orbitoneVoicingPhase || 0;
                    const voicingPhaseSlider = createSlider(`edit-orbitone-voicing-phase-${node.id}`,
                        `Orbitone Voicing Style (${currentVoicingPhase}):`, 0, 100, 1, currentVoicingPhase,
                        (e_change) => {
                            const val = parseInt(e_change.target.value);
                            selectedArray.forEach(el => { 
                                const n = findNodeById(el.id); 
                                if(n && n.audioParams && n.type === 'sound') {
                                    n.audioParams.orbitoneVoicingPhase = val;
                                    applyOrbitoneVoicingFromPhase(n);
                                    stopNodeAudio(n); n.audioNodes = createAudioNodesForNode(n);
                                    if(n.audioNodes) updateNodeAudioParams(n);
                                }
                            });
                            identifyAndRouteAllGroups(); saveState();
                            populateEditPanel(); // Kan nodig zijn als spread verandert door preset
                        },
                        (e_input) => { e_input.target.previousElementSibling.textContent = `Orbitone Voicing Style (${e_input.target.value}):`; }
                    );
                    orbitoneSettingsSection.appendChild(voicingPhaseSlider);

                    const currentTimingPhase = node.audioParams.orbitoneTimingPhase || 0;
                    const timingPhaseSlider = createSlider(`edit-orbitone-timing-phase-${node.id}`,
                        `Orbitone Timing Style (${currentTimingPhase}):`, 0, 100, 1, currentTimingPhase,
                        (e_change) => {
                             const val = parseInt(e_change.target.value);
                             selectedArray.forEach(el => { 
                                 const n = findNodeById(el.id); 
                                 if(n && n.audioParams && n.type === 'sound') {
                                     n.audioParams.orbitoneTimingPhase = val;
                                     applyOrbitoneTimingFromPhase(n);
                                     updateNodeAudioParams(n); 
                                 }
                             });
                             identifyAndRouteAllGroups(); saveState();
                        },
                        (e_input) => { e_input.target.previousElementSibling.textContent = `Orbitone Timing Style (${e_input.target.value}):`; }
                    );
                    orbitoneSettingsSection.appendChild(timingPhaseSlider);
                    
                    const currentMix = node.audioParams.orbitoneMix !== undefined ? node.audioParams.orbitoneMix : 0.5;
                    const mixSliderContainer = createSlider(`edit-node-orbitone-mix-${node.id}`,
                        `Orbitone Mix (Main <-> Orbitones) (${currentMix.toFixed(2)}):`, 0, 1, 0.05, currentMix,
                        (e_change_event) => {
                            const newMix = parseFloat(e_change_event.target.value);
                            selectedArray.forEach(elData => {
                                const n = findNodeById(elData.id);
                                if (n && n.audioParams && n.type === 'sound') {
                                    n.audioParams.orbitoneMix = newMix;
                                    updateNodeAudioParams(n);
                                }
                            });
                            identifyAndRouteAllGroups(); saveState();
                        },
                        (e_input) => {
                            e_input.target.previousElementSibling.textContent = `Orbitone Mix (Main <-> Orbitones) (${parseFloat(e_input.target.value).toFixed(2)}):`;
                        }
                    );
                    orbitoneSettingsSection.appendChild(mixSliderContainer);
                }
                fragment.appendChild(orbitoneSettingsSection);
            }
        } else if (node && isDrumType(node.type)) {
             const section = document.createElement("div"); section.classList.add("panel-section");
            const params = node.audioParams; const defaults = DRUM_ELEMENT_DEFAULTS[node.type];
            const soundDiv = document.createElement("div"); soundDiv.classList.add("edit-drum-sound");
            const soundLabel = document.createElement("strong"); soundLabel.textContent = defaults.label; soundDiv.appendChild(soundLabel);
            const currentBaseFreq = params?.baseFreq ?? defaults?.baseFreq ?? 60; const tuneVal = currentBaseFreq.toFixed(0);
            const tuneSliderContainer = createSlider( `edit-drum-tune-${node.id}`, `Tune (${tuneVal}Hz):`, 20, node.type === "drum_hihat" ? 15000 : node.type === "drum_cowbell" || node.type === "drum_clap" ? 2000 : 1000, 1, currentBaseFreq, 
            () => { identifyAndRouteAllGroups(); saveState(); }, 
            (e_input) => {
                const newFreq = parseFloat(e_input.target.value);
                selectedArray.forEach(elData => { const n = findNodeById(elData.id); if (n?.audioParams) n.audioParams.baseFreq = newFreq; });
                e_input.target.previousElementSibling.textContent = `Tune (${newFreq.toFixed(0)}Hz):`;
            });
            soundDiv.appendChild(tuneSliderContainer);
            if (params?.decay !== undefined || defaults?.decay !== undefined) {
                const currentDecay = params?.decay ?? defaults?.decay ?? 0.5; const decayVal = currentDecay.toFixed(2);
                const decaySliderContainer = createSlider( `edit-drum-decay-${node.id}`, `Decay (${decayVal}s):`, 0.01, 1.5, 0.01, currentDecay, 
                () => { identifyAndRouteAllGroups(); saveState(); }, 
                (e_input) => {
                    const newDecay = parseFloat(e_input.target.value);
                    selectedArray.forEach(elData => { const n = findNodeById(elData.id); if (n?.audioParams) n.audioParams.decay = newDecay; });
                    e_input.target.previousElementSibling.textContent = `Decay (${newDecay.toFixed(2)}s):`;
                });
                soundDiv.appendChild(decaySliderContainer);
            }
            if (params?.noiseDecay !== undefined || defaults?.noiseDecay !== undefined) {
                const currentNoiseDecay = params?.noiseDecay ?? defaults?.noiseDecay ?? 0.1; const noiseDecayVal = currentNoiseDecay.toFixed(2);
                const noiseDecaySliderContainer = createSlider( `edit-drum-noisedecay-${node.id}`, `Noise Decay (${noiseDecayVal}s):`, 0.01, 0.5, 0.01, currentNoiseDecay, 
                () => { identifyAndRouteAllGroups(); saveState(); }, 
                (e_input) => {
                    const newNoiseDecay = parseFloat(e_input.target.value);
                    selectedArray.forEach(elData => { const n = findNodeById(elData.id); if (n?.audioParams) n.audioParams.noiseDecay = newNoiseDecay; });
                    e_input.target.previousElementSibling.textContent = `Noise Decay (${newNoiseDecay.toFixed(2)}s):`;
                });
                soundDiv.appendChild(noiseDecaySliderContainer);
            }
            const currentVolume = params?.volume ?? defaults?.volume ?? 1.0; const volVal = currentVolume.toFixed(2);
            const volSliderContainer = createSlider( `edit-drum-vol-${node.id}`, `Volume (${volVal}):`, 0, 1.5, 0.01, currentVolume, 
            () => { identifyAndRouteAllGroups(); saveState(); }, 
            (e_input) => {
                const newVol = parseFloat(e_input.target.value);
                selectedArray.forEach((elData) => { const n = findNodeById(elData.id); if (n?.audioParams) { n.audioParams.volume = newVol; updateNodeAudioParams(n); } });
                e_input.target.previousElementSibling.textContent = `Volume (${newVol.toFixed(2)}):`;
            });
            soundDiv.appendChild(volSliderContainer); section.appendChild(soundDiv); fragment.appendChild(section);
        }
        else if (node && node.type === "switch" && selectedArray.length === 1) {
            const section = document.createElement("div"); section.classList.add("panel-section");
            const label = document.createElement("label"); label.textContent = "Primary Input Connection:"; section.appendChild(label);
            const select = document.createElement("select"); select.id = `edit-switch-primary-${node.id}`;
            const noneOpt = document.createElement("option"); noneOpt.value = "null"; noneOpt.textContent = "None (Set on next pulse)"; select.appendChild(noneOpt);
            node.connections.forEach((neighborId) => {
                const conn = connections.find(c => (c.nodeAId === node.id && c.nodeBId === neighborId) || (c.nodeAId === neighborId && c.nodeBId === node.id));
                if (conn) {
                    const otherNode = findNodeById(neighborId);
                    const option = document.createElement("option"); option.value = conn.id;
                    option.textContent = `From Node #${neighborId} (${otherNode?.type || "?"})`;
                    if (conn.id === node.primaryInputConnectionId) { option.selected = true; }
                    select.appendChild(option);
                }
            });
            select.addEventListener("change", (e) => {
                node.primaryInputConnectionId = e.target.value === "null" ? null : parseInt(e.target.value, 10);
                identifyAndRouteAllGroups(); saveState();
            });
            section.appendChild(select); fragment.appendChild(section);
        }
        if (node && node.audioParams && (node.type === 'sound' || isDrumType(node.type))) {
            const retriggerSection = document.createElement("div"); retriggerSection.classList.add("panel-section");
            retriggerSection.style.borderTop = "1px solid var(--button-bg)"; retriggerSection.style.paddingTop = "10px"; retriggerSection.style.marginTop = "10px";
            const retriggerToggleContainer = document.createElement("div"); retriggerToggleContainer.style.display = "flex";
            retriggerToggleContainer.style.alignItems = "center"; retriggerToggleContainer.style.marginBottom = "10px";
            const enabledCheckbox = document.createElement("input"); enabledCheckbox.type = "checkbox";
            enabledCheckbox.id = `edit-retrigger-enabled-${node.id}`; enabledCheckbox.checked = node.audioParams.retriggerEnabled || false;
            enabledCheckbox.style.marginRight = "8px";
            enabledCheckbox.addEventListener("change", (e) => {
              selectedArray.forEach(elData => {
                const n = findNodeById(elData.id); if (n && n.audioParams) n.audioParams.retriggerEnabled = e.target.checked;
              });
              identifyAndRouteAllGroups(); saveState(); populateEditPanel();
            });
            retriggerToggleContainer.appendChild(enabledCheckbox);
            const enabledLabel = document.createElement("label"); enabledLabel.htmlFor = `edit-retrigger-enabled-${node.id}`;
            enabledLabel.innerHTML = "<strong>Retrigger</strong>"; enabledLabel.style.cursor = "pointer";
            retriggerToggleContainer.appendChild(enabledLabel); retriggerSection.appendChild(retriggerToggleContainer);
            if (node.audioParams.retriggerEnabled) {
              const currentStepsArray = node.audioParams.retriggerVolumeSteps || []; const countVal = currentStepsArray.length;
              const countSliderContainer = createSlider( `edit-retrigger-count-${node.id}`, `Steps (${countVal}):`, 1, 16, 1, countVal, null, (e_input) => {
                  const newCount = parseInt(e_input.target.value); e_input.target.previousElementSibling.textContent = `Steps (${newCount}):`;
              });
              const countSliderInput = countSliderContainer.querySelector('input');
              countSliderInput.addEventListener('change', (e_change) => {
                  const newCount = parseInt(e_change.target.value);
                  selectedArray.forEach(elData => {
                      const n = findNodeById(elData.id);
                      if (n && n.audioParams) {
                          const arraysToSync = ["retriggerVolumeSteps", "retriggerPitchSteps", "retriggerFilterSteps", "retriggerMuteSteps"];
                          const defaultValues = { "retriggerVolumeSteps": 0.5, "retriggerPitchSteps": 0, "retriggerFilterSteps": 0, "retriggerMuteSteps": false };
                          arraysToSync.forEach(arrayName => {
                              let currentLocalSteps = n.audioParams[arrayName] || [];
                              const lastKnownValue = currentLocalSteps.length > 0 ? currentLocalSteps[currentLocalSteps.length -1] : defaultValues[arrayName];
                              if (newCount > currentLocalSteps.length) {
                                  for (let i = currentLocalSteps.length; i < newCount; i++) {
                                      let valToPush = defaultValues[arrayName];
                                      if (arrayName === "retriggerVolumeSteps" && i > 0 && currentLocalSteps.length > 0) valToPush = parseFloat((currentLocalSteps[currentLocalSteps.length -1 ] * 0.85).toFixed(2));
                                      else if (arrayName === "retriggerVolumeSteps") valToPush = 0.6;
                                      currentLocalSteps.push(valToPush);
                                  }
                              } else if (newCount < currentLocalSteps.length) {
                                  currentLocalSteps = currentLocalSteps.slice(0, newCount);
                              }
                              n.audioParams[arrayName] = currentLocalSteps;
                          });
                      }
                  });
                  identifyAndRouteAllGroups(); saveState(); populateEditPanel();
              });
              retriggerSection.appendChild(countSliderContainer);
              const retriggerEditorTabsContainer = document.createElement("div"); retriggerEditorTabsContainer.classList.add("retrigger-editor-tabs");
              const editorDisplayArea = document.createElement("div"); editorDisplayArea.classList.add("retrigger-editor-display-area");
              const createTabButton = (paramType, labelText) => {
                  const button = document.createElement("button"); button.textContent = labelText;
                  button.classList.add("retrigger-tab-button", "panel-button-like"); button.dataset.paramType = paramType;
                  button.addEventListener("click", () => {
                      retriggerEditorTabsContainer.querySelectorAll('.retrigger-tab-button').forEach(btn => btn.classList.remove('active'));
                      button.classList.add('active');
                      const visualEditor = createRetriggerVisualEditor(node, selectedArray, paramType);
                      editorDisplayArea.innerHTML = ""; editorDisplayArea.appendChild(visualEditor);
                  });
                  return button;
              };
              const volumeTab = createTabButton("volume", "Volume"); const pitchTab = createTabButton("pitch", "Pitch");
              const filterTab = createTabButton("filter", "Filter");
              retriggerEditorTabsContainer.appendChild(volumeTab); retriggerEditorTabsContainer.appendChild(pitchTab);
              retriggerEditorTabsContainer.appendChild(filterTab); retriggerSection.appendChild(retriggerEditorTabsContainer);
              retriggerSection.appendChild(editorDisplayArea); volumeTab.classList.add('active');
              const initialVisualEditor = createRetriggerVisualEditor(node, selectedArray, "volume");
              editorDisplayArea.appendChild(initialVisualEditor);
              const showRetriggerSyncControls = isGlobalSyncEnabled && !node.audioParams.ignoreGlobalSync;
              if (showRetriggerSyncControls) {
                const subdivRetriggerLabel = document.createElement("label"); subdivRetriggerLabel.htmlFor = `edit-retrigger-subdiv-${node.id}`;
                subdivRetriggerLabel.textContent = "Retrigger Sync:"; retriggerSection.appendChild(subdivRetriggerLabel);
                const subdivRetriggerSelect = document.createElement("select"); subdivRetriggerSelect.id = `edit-retrigger-subdiv-${node.id}`;
                subdivisionOptions.forEach((opt, index) => {
                    const option = document.createElement("option"); option.value = index; option.textContent = opt.label;
                    if (index === (node.audioParams.retriggerSyncSubdivisionIndex ?? DEFAULT_SUBDIVISION_INDEX)) option.selected = true;
                    subdivRetriggerSelect.appendChild(option);
                });
                subdivRetriggerSelect.addEventListener("change", (e) => {
                    const newIndex = parseInt(e.target.value, 10);
                    selectedArray.forEach(elData => { const n = findNodeById(elData.id); if (n?.audioParams) n.audioParams.retriggerSyncSubdivisionIndex = newIndex; });
                    identifyAndRouteAllGroups(); saveState();
                });
                retriggerSection.appendChild(subdivRetriggerSelect);
              } else {
                const intervalValMs = node.audioParams.retriggerIntervalMs || 100;
                const intervalSliderContainer = createSlider( `edit-retrigger-interval-${node.id}`, `Interval (${intervalValMs} ms):`, 20, 1000, 5, intervalValMs, 
                () => { identifyAndRouteAllGroups(); saveState(); }, 
                (e_input) => {
                    const newValMs = parseInt(e_input.target.value);
                    selectedArray.forEach(elData => { const n = findNodeById(elData.id); if (n?.audioParams) n.audioParams.retriggerIntervalMs = newValMs; });
                    e_input.target.previousElementSibling.textContent = `Interval (${newValMs} ms):`;
                });
                retriggerSection.appendChild(intervalSliderContainer);
              }
              const rateModeLabel = document.createElement("label"); rateModeLabel.htmlFor = `edit-retrigger-ratemode-${node.id}`;
              rateModeLabel.textContent = "Rate Mode:"; retriggerSection.appendChild(rateModeLabel);
              const rateModeSelect = document.createElement("select"); rateModeSelect.id = `edit-retrigger-ratemode-${node.id}`;
              ["constant", "accelerate", "decelerate", "random"].forEach(opt => {
                const option = document.createElement("option"); option.value = opt; option.textContent = opt.charAt(0).toUpperCase() + opt.slice(1);
                if ((node.audioParams.retriggerRateMode || "constant") === opt) option.selected = true;
                rateModeSelect.appendChild(option);
              });
              rateModeSelect.addEventListener("change", (e) => {
                selectedArray.forEach(elData => { const n = findNodeById(elData.id); if (n?.audioParams) n.audioParams.retriggerRateMode = e.target.value; });
                identifyAndRouteAllGroups(); saveState();
              });
              retriggerSection.appendChild(rateModeSelect);
            }
            fragment.appendChild(retriggerSection);
        }
      }
    } else if (firstElementData.type === "connection") {
      const connection = findConnectionById(firstElementData.id);
      if (connection) {
        if (connection.type === "string_violin") {
          const section = document.createElement("div"); section.classList.add("panel-section");
          const params = connection.audioParams; const defaults = STRING_VIOLIN_DEFAULTS;
          const currentVol = params?.volume ?? defaults.volume; const volVal = currentVol.toFixed(2);
          const volSliderContainer = createSlider( `edit-string-vol-${connection.id}`, `Volume (${volVal}):`, 0, 1.0, 0.01, currentVol, 
          () => { identifyAndRouteAllGroups(); saveState(); }, 
          (e_input) => {
              const newVol = parseFloat(e_input.target.value);
              selectedArray.forEach((elData) => { const c = findConnectionById(elData.id); if (c?.audioParams) c.audioParams.volume = newVol; });
              e_input.target.previousElementSibling.textContent = `Volume (${newVol.toFixed(2)}):`;
          });
          section.appendChild(volSliderContainer);
          const currentAttack = params?.attack ?? defaults.attack; const attackVal = currentAttack.toFixed(2);
          const attackSliderContainer = createSlider( `edit-string-attack-${connection.id}`, `Attack (${attackVal}s):`, 0.01, 1.0, 0.01, currentAttack, 
          () => { identifyAndRouteAllGroups(); saveState(); }, 
          (e_input) => {
              const newVal = parseFloat(e_input.target.value);
              selectedArray.forEach((elData) => { const c = findConnectionById(elData.id); if (c?.audioParams) c.audioParams.attack = newVal; });
              e_input.target.previousElementSibling.textContent = `Attack (${newVal.toFixed(2)}s):`;
          });
          section.appendChild(attackSliderContainer);
          const currentRelease = params?.release ?? defaults.release; const releaseVal = currentRelease.toFixed(2);
          const releaseSliderContainer = createSlider( `edit-string-release-${connection.id}`, `Release (${releaseVal}s):`, 0.1, 5.0, 0.01, currentRelease, 
          () => { identifyAndRouteAllGroups(); saveState(); }, 
          (e_input) => {
              const newVal = parseFloat(e_input.target.value);
              selectedArray.forEach((elData) => { const c = findConnectionById(elData.id); if (c?.audioParams) c.audioParams.release = newVal; });
              e_input.target.previousElementSibling.textContent = `Release (${newVal.toFixed(2)}s):`;
          });
          section.appendChild(releaseSliderContainer); fragment.appendChild(section);
        } else if (connection.type === 'wavetrail') {
          const section = document.createElement("div"); section.classList.add("panel-section");
          const fileLabel = document.createElement("label"); fileLabel.htmlFor = `edit-wavetrail-file-${connection.id}`;
          fileLabel.textContent = "Audio File:"; section.appendChild(fileLabel);
          const fileInput = document.createElement("input"); fileInput.type = "file"; fileInput.id = `edit-wavetrail-file-${connection.id}`;
          fileInput.accept = ".wav,.mp3,audio/*"; fileInput.style.marginBottom = '5px';
          fileInput.addEventListener('change', (e) => handleWaveTrailFileInputChange(e, connection)); section.appendChild(fileInput);
          const fileNameDisplay = document.createElement("small"); fileNameDisplay.id = `edit-wavetrail-filename-${connection.id}`;
          fileNameDisplay.textContent = `Current: ${connection.audioParams?.fileName || 'None selected'}`;
          fileNameDisplay.style.display = 'block'; section.appendChild(fileNameDisplay);
          if (connection.audioParams?.buffer) {
              const bufferDuration = connection.audioParams.buffer.duration;
              const currentOffset = connection.audioParams.startTimeOffset || 0;
              const currentEndOffset = connection.audioParams.endTimeOffset ?? bufferDuration;
              const currentStartOffset = connection.audioParams.startTimeOffset || 0;
              const currentGrainDuration = connection.audioParams.grainDuration || 0.09;
              const currentGrainOverlap = connection.audioParams.grainOverlap || 0.07;
              const currentPlaybackRate = connection.audioParams.playbackRate || 1.0;
              const offsetLabel = document.createElement("label"); offsetLabel.htmlFor = `edit-wavetrail-start-${connection.id}`;
              offsetLabel.style.marginTop = '10px'; offsetLabel.textContent = `Start Offset (${currentOffset.toFixed(2)}s):`; section.appendChild(offsetLabel);
              const offsetSlider = document.createElement("input"); offsetSlider.type = "range"; offsetSlider.id = `edit-wavetrail-start-${connection.id}`;
              offsetSlider.min = "0"; offsetSlider.max = bufferDuration.toFixed(3); offsetSlider.step = "0.01"; offsetSlider.value = currentOffset;
              offsetSlider.title = "Scrub Start Time";
              const offsetValueDisplay = document.createElement("span"); offsetValueDisplay.id = `edit-wavetrail-start-value-${connection.id}`;
              offsetValueDisplay.textContent = `${currentOffset.toFixed(2)}s`; offsetValueDisplay.style.cssText = 'font-size: 0.8em; margin-left: 5px; opacity: 0.8;';
              section.appendChild(offsetSlider); section.appendChild(offsetValueDisplay);
              const endOffsetLabel = document.createElement("label"); endOffsetLabel.htmlFor = `edit-wavetrail-end-${connection.id}`;
              endOffsetLabel.style.marginTop = '10px'; endOffsetLabel.textContent = `End Offset (${currentEndOffset.toFixed(2)}s):`; section.appendChild(endOffsetLabel);
              const endOffsetSlider = document.createElement("input"); endOffsetSlider.type = "range"; endOffsetSlider.id = `edit-wavetrail-end-${connection.id}`;
              endOffsetSlider.min = currentStartOffset.toFixed(3); endOffsetSlider.max = bufferDuration.toFixed(3); endOffsetSlider.step = "0.01"; endOffsetSlider.value = currentEndOffset;
              endOffsetSlider.title = "Scrub End Time";
              const endOffsetValueDisplay = document.createElement("span"); endOffsetValueDisplay.id = `edit-wavetrail-end-value-${connection.id}`;
              endOffsetValueDisplay.textContent = `${currentEndOffset.toFixed(2)}s`; endOffsetValueDisplay.style.cssText = 'font-size: 0.8em; margin-left: 5px; opacity: 0.8;';
              section.appendChild(endOffsetSlider); section.appendChild(endOffsetValueDisplay);
              offsetSlider.addEventListener('input', (e_input) => {
                  const newOffset = parseFloat(e_input.target.value); const maxOffset = Math.max(0, bufferDuration - 0.05);
                  const clampedOffset = Math.min(newOffset, maxOffset); const currentEndValue = parseFloat(endOffsetSlider.value);
                  if (connection.audioParams.startTimeOffset !== clampedOffset) {
                       connection.audioParams.startTimeOffset = clampedOffset;
                       offsetLabel.textContent = `Start Offset (${clampedOffset.toFixed(2)}s):`; offsetValueDisplay.textContent = `${clampedOffset.toFixed(2)}s`;
                       endOffsetSlider.min = (clampedOffset + 0.05).toFixed(3);
                        if (currentEndValue < clampedOffset + 0.05) {
                             const newEndValue = clampedOffset + 0.05; endOffsetSlider.value = newEndValue;
                             connection.audioParams.endTimeOffset = (bufferDuration - newEndValue < 0.01) ? null : newEndValue;
                             const displayValue = connection.audioParams.endTimeOffset ?? bufferDuration;
                             endOffsetLabel.textContent = `End Offset (${displayValue.toFixed(2)}s):`; endOffsetValueDisplay.textContent = `${displayValue.toFixed(2)}s`;
                        }
                  }
                   if (newOffset > maxOffset) { e_input.target.value = clampedOffset; }
              });
              offsetSlider.addEventListener('change', () => { identifyAndRouteAllGroups(); saveState(); });
              endOffsetSlider.addEventListener('input', (e_input) => {
                  const newEndOffset = parseFloat(e_input.target.value); const minEndOffset = (connection.audioParams.startTimeOffset || 0) + 0.05;
                  const clampedEndOffset = Math.max(minEndOffset, newEndOffset);
                  const finalEndOffset = (bufferDuration - clampedEndOffset < 0.01) ? null : clampedEndOffset;
                  if (connection.audioParams.endTimeOffset !== finalEndOffset) {
                      connection.audioParams.endTimeOffset = finalEndOffset; const displayValue = finalEndOffset ?? bufferDuration;
                      endOffsetLabel.textContent = `End Offset (${displayValue.toFixed(2)}s):`; endOffsetValueDisplay.textContent = `${displayValue.toFixed(2)}s`;
                  }
                   if (newEndOffset < minEndOffset) { e_input.target.value = minEndOffset; }
              });
              endOffsetSlider.addEventListener('change', () => { identifyAndRouteAllGroups(); saveState(); });
              const grainDurLabel = document.createElement("label"); grainDurLabel.htmlFor = `edit-wavetrail-graindur-${connection.id}`;
              grainDurLabel.style.marginTop = '15px'; grainDurLabel.textContent = `Grain Duration (${(currentGrainDuration * 1000).toFixed(0)}ms):`; section.appendChild(grainDurLabel);
              const grainDurSlider = document.createElement("input"); grainDurSlider.type = "range"; grainDurSlider.id = `edit-wavetrail-graindur-${connection.id}`;
              grainDurSlider.min = "0.01"; grainDurSlider.max = "0.3"; grainDurSlider.step = "0.005";
              grainDurSlider.value = currentGrainDuration; grainDurSlider.title = "Grain Duration";
              const grainDurValueDisplay = document.createElement("span"); grainDurValueDisplay.id = `edit-wavetrail-graindur-value-${connection.id}`;
              grainDurValueDisplay.textContent = `${(currentGrainDuration * 1000).toFixed(0)}ms`; grainDurValueDisplay.style.cssText = 'font-size: 0.8em; margin-left: 5px; opacity: 0.8;';
              section.appendChild(grainDurSlider); section.appendChild(grainDurValueDisplay);
              let grainOverlapSliderRefForDur = section.querySelector(`#edit-wavetrail-grainoverlap-${connection.id}`);
              grainDurSlider.addEventListener('input', (e_input) => {
                  const newDur = parseFloat(e_input.target.value); connection.audioParams.grainDuration = newDur;
                  grainDurLabel.textContent = `Grain Duration (${(newDur * 1000).toFixed(0)}ms):`; grainDurValueDisplay.textContent = `${(newDur * 1000).toFixed(0)}ms`;
                  grainOverlapSliderRefForDur = section.querySelector(`#edit-wavetrail-grainoverlap-${connection.id}`);
                  if (grainOverlapSliderRefForDur) {
                      const newMaxOverlap = Math.max(0, newDur - 0.005).toFixed(3); grainOverlapSliderRefForDur.max = newMaxOverlap;
                      const overlapValueDisplay = section.querySelector(`#edit-wavetrail-grainoverlap-value-${connection.id}`);
                      const overlapLabel = section.querySelector(`label[for=edit-wavetrail-grainoverlap-${connection.id}]`);
                      if (parseFloat(grainOverlapSliderRefForDur.value) > parseFloat(newMaxOverlap)) {
                           grainOverlapSliderRefForDur.value = newMaxOverlap; connection.audioParams.grainOverlap = parseFloat(newMaxOverlap);
                            if(overlapValueDisplay) overlapValueDisplay.textContent = `${(parseFloat(newMaxOverlap) * 1000).toFixed(0)}ms`;
                            if(overlapLabel) overlapLabel.textContent = `Grain Overlap (${(parseFloat(newMaxOverlap) * 1000).toFixed(0)}ms):`;
                      }
                  }
              });
              grainDurSlider.addEventListener('change', () => { identifyAndRouteAllGroups(); saveState(); });
              const grainOverlapLabel = document.createElement("label"); grainOverlapLabel.htmlFor = `edit-wavetrail-grainoverlap-${connection.id}`;
              grainOverlapLabel.textContent = `Grain Overlap (${(currentGrainOverlap * 1000).toFixed(0)}ms):`; section.appendChild(grainOverlapLabel);
              const grainOverlapSliderElement = document.createElement("input"); grainOverlapSliderElement.type = "range";
              grainOverlapSliderElement.id = `edit-wavetrail-grainoverlap-${connection.id}`; grainOverlapSliderElement.min = "0";
              grainOverlapSliderElement.max = (currentGrainDuration - 0.005).toFixed(3); grainOverlapSliderElement.step = "0.005";
              grainOverlapSliderElement.value = Math.min(currentGrainOverlap, parseFloat(grainOverlapSliderElement.max));
              grainOverlapSliderElement.title = "Grain Overlap";
              const grainOverlapValueDisplay = document.createElement("span"); grainOverlapValueDisplay.id = `edit-wavetrail-grainoverlap-value-${connection.id}`;
              grainOverlapValueDisplay.textContent = `${(parseFloat(grainOverlapSliderElement.value) * 1000).toFixed(0)}ms`; grainOverlapValueDisplay.style.cssText = 'font-size: 0.8em; margin-left: 5px; opacity: 0.8;';
              section.appendChild(grainOverlapSliderElement); section.appendChild(grainOverlapValueDisplay);
              grainOverlapSliderElement.addEventListener('input', (e_input) => {
                  const newOverlap = parseFloat(e_input.target.value); const maxOverlap = Math.max(0, (connection.audioParams.grainDuration || 0.09) - 0.005);
                  const clampedOverlap = Math.min(newOverlap, maxOverlap); connection.audioParams.grainOverlap = clampedOverlap;
                  grainOverlapLabel.textContent = `Grain Overlap (${(clampedOverlap * 1000).toFixed(0)}ms):`; grainOverlapValueDisplay.textContent = `${(clampedOverlap * 1000).toFixed(0)}ms`;
                   if (newOverlap > maxOverlap) { e_input.target.value = clampedOverlap; }
              });
              grainOverlapSliderElement.addEventListener('change', () => { identifyAndRouteAllGroups(); saveState(); });
              const rateLabel = document.createElement("label"); rateLabel.htmlFor = `edit-wavetrail-rate-${connection.id}`;
              rateLabel.style.marginTop = '15px'; rateLabel.textContent = `Playback Rate (${currentPlaybackRate.toFixed(2)}x):`; section.appendChild(rateLabel);
              const rateSlider = document.createElement("input"); rateSlider.type = "range"; rateSlider.id = `edit-wavetrail-rate-${connection.id}`;
              rateSlider.min = "0.25"; rateSlider.max = "4.0"; rateSlider.step = "0.01";
              rateSlider.value = currentPlaybackRate; rateSlider.title = "Playback Rate / Pitch";
              const rateValueDisplay = document.createElement("span"); rateValueDisplay.id = `edit-wavetrail-rate-value-${connection.id}`;
              rateValueDisplay.textContent = `${currentPlaybackRate.toFixed(2)}x`; rateValueDisplay.style.cssText = 'font-size: 0.8em; margin-left: 5px; opacity: 0.8;';
              section.appendChild(rateSlider); section.appendChild(rateValueDisplay);
              rateSlider.addEventListener('input', (e_input) => {
                  const newRate = parseFloat(e_input.target.value); connection.audioParams.playbackRate = newRate;
                  rateLabel.textContent = `Playback Rate (${newRate.toFixed(2)}x):`; rateValueDisplay.textContent = `${newRate.toFixed(2)}x`;
              });
              rateSlider.addEventListener('change', () => { identifyAndRouteAllGroups(); saveState(); });
              const resetButton = document.createElement('button'); resetButton.textContent = 'Reset Rate';
              resetButton.style.marginLeft = '10px'; resetButton.style.padding = '2px 6px'; resetButton.style.fontSize = '0.8em';
              resetButton.type = 'button';
              resetButton.addEventListener('click', () => {
                    connection.audioParams.playbackRate = 1.0; rateSlider.value = 1.0;
                    rateLabel.textContent = `Playback Rate (1.00x):`; rateValueDisplay.textContent = `1.00x`; 
                    identifyAndRouteAllGroups(); saveState();
               });
              section.appendChild(resetButton);
          }
          fragment.appendChild(section);
        }
      }
    }
  } else {
    const multiInfo = document.createElement("small");
    multiInfo.textContent = "Editing multiple elements of different types. Only common properties might be available if implemented.";
    fragment.appendChild(multiInfo);
  }

  editPanelContent.appendChild(fragment);

  if (hamburgerMenuPanel && hamburgerMenuPanel.classList.contains("hidden") && currentTool === 'edit' && selectedElements.size > 0) {
    hamburgerMenuPanel.classList.remove("hidden");
    if (hamburgerBtn) hamburgerBtn.classList.add("active");
  }
  if (sideToolbar && !sideToolbar.classList.contains("hidden")) {
    sideToolbar.classList.add("hidden");
    const addBrushButtons = toolbar.querySelectorAll("#toolbar-add-elements button, #toolbar-sound-generators button, #toolbar-pulsars button, #toolbar-logic-nodes button, #toolbar-environment-nodes button");
    addBrushButtons.forEach(btn => btn.classList.remove("active"));
    if (brushBtn) brushBtn.classList.remove("active");
  }
}

function populateSideToolbar(contentType, title) {
  if (!sideToolbarContent || !sideToolbarTitle || !sideToolbar) return; 

  sideToolbarContent.innerHTML = "";
  sideToolbarTitle.textContent = title || "Element Options";

  const groupDiv = document.createElement("div");
  groupDiv.classList.add("type-group");

  let targetPresetArray = [];
  let showNoteSelector = false;
  let currentSelectionKey = waveformToAdd; 
  if (contentType === "pulsarTypes" || contentType === "drumElements") {
    currentSelectionKey = nodeTypeToAdd;
  }


  switch (contentType) {
    case "analogWaveforms":
      targetPresetArray = analogWaveformPresets;
      showNoteSelector = true;
      if (nodeTypeToAdd !== "sound" || !analogWaveformPresets.some(w => w.type === waveformToAdd)) {
        waveformToAdd = analogWaveformPresets.length > 0 ? analogWaveformPresets[0].type : null;
        currentSelectionKey = waveformToAdd;
      }
      break;
    case "fmSynths":
      targetPresetArray = fmSynthPresets;
      showNoteSelector = true;
      if (nodeTypeToAdd !== "sound" || !fmSynthPresets.some(w => w.type === waveformToAdd)) {
        waveformToAdd = fmSynthPresets.length > 0 ? fmSynthPresets[0].type : null;
        currentSelectionKey = waveformToAdd;
      }
      break;
    case "samplers":
      if (typeof SAMPLER_DEFINITIONS !== 'undefined' && SAMPLER_DEFINITIONS.length > 0) {
        samplerWaveformTypes.forEach((sampler) => {
            const button = document.createElement("button");
            button.classList.add("waveform-button", "sampler-button");
            button.dataset.type = sampler.type; 
            button.innerHTML = `<span class="type-icon">${sampler.icon}</span>${sampler.label}`;
            button.disabled = sampler.loadFailed;
            if (sampler.loadFailed) {
                button.title = `${sampler.label} sample failed to load`;
                button.classList.add("disabled");
            }
            if (nodeTypeToAdd === "sound" && waveformToAdd === sampler.type) {
                button.classList.add("selected");
            }
            button.addEventListener("click", () => {
                if (!button.disabled) handleWaveformSelect(button, sampler.type);
            });
            groupDiv.appendChild(button);
        });
        if (nodeTypeToAdd === "sound" && (waveformToAdd === null || !samplerWaveformTypes.some(w => w.type === waveformToAdd && !w.loadFailed))) {
            const firstAvailableSampler = samplerWaveformTypes.find(s => !s.loadFailed);
            if (firstAvailableSampler) {
                 waveformToAdd = firstAvailableSampler.type;
                 currentSelectionKey = waveformToAdd;
            }
        }
      } else {
         const errorMsg = document.createElement('p');
         errorMsg.textContent = (typeof SAMPLER_DEFINITIONS !== 'undefined') ? "No samplers defined." : "Error: Sampler definitions not loaded.";
         errorMsg.style.opacity = '0.7';
         groupDiv.appendChild(errorMsg);
      }
      showNoteSelector = true;
      break;
    case "pulsarTypes":
      targetPresetArray = pulsarTypes;
      if (!pulsarTypes.some(p => p.type === nodeTypeToAdd)) {
        nodeTypeToAdd = pulsarTypes.length > 0 ? pulsarTypes[0].type : null;
        currentSelectionKey = nodeTypeToAdd;
      }
      break;
    case "drumElements":
      targetPresetArray = drumElementTypes;
      if (!drumElementTypes.some(d => d.type === nodeTypeToAdd)) {
        nodeTypeToAdd = drumElementTypes.length > 0 ? drumElementTypes[0].type : null;
        currentSelectionKey = nodeTypeToAdd;
      }
      break;
    case "waveforms": 
      const nebulaWaveforms = [
          { type: "sine", label: "Sine", icon: "○" },
          { type: "square", label: "Square", icon: "□" },
          { type: "sawtooth", label: "Saw", icon: "📈" },
          { type: "triangle", label: "Triangle", icon: "△" }
      ];
      targetPresetArray = nebulaWaveforms;
      showNoteSelector = true; 
      if (nodeTypeToAdd !== "nebula" || !nebulaWaveforms.some(w => w.type === waveformToAdd)) {
        waveformToAdd = nebulaWaveforms.length > 0 ? nebulaWaveforms[2].type : null; 
        currentSelectionKey = waveformToAdd;
      }
      break;
  }

  if (targetPresetArray.length > 0) {
      targetPresetArray.forEach((item) => {
          const button = document.createElement("button");
          let buttonClass = "type-button";
          if (contentType === "analogWaveforms" || contentType === "fmSynths" || contentType === "waveforms") {
              buttonClass = "waveform-button";
          } else if (contentType === "drumElements") {
              buttonClass = "drum-element-button";
          }

          button.classList.add(buttonClass);
          button.dataset.type = item.type;
          button.innerHTML = `<span class="type-icon">${item.icon || ""}</span>${item.label}`;

          if (item.type === currentSelectionKey) {
              button.classList.add("selected");
          }

          if (contentType === "pulsarTypes" || contentType === "drumElements") {
              button.addEventListener("click", () => handleElementTypeSelect(button, item.type));
          } else { 
              button.addEventListener("click", () => handleWaveformSelect(button, item.type));
          }
          groupDiv.appendChild(button);
      });
  }

  sideToolbarContent.appendChild(groupDiv);

  if (showNoteSelector) {
      createHexNoteSelectorDOM(sideToolbarContent, []);
  }

  sideToolbar.classList.remove("hidden");
  if (hamburgerMenuPanel) hamburgerMenuPanel.classList.add("hidden");
  if (hamburgerBtn) hamburgerBtn.classList.remove("active");
}

function handleNewWorkspace() {
  if (unsavedChanges) {
      if (!confirm("Are you sure you want to start a new workspace? Unsaved changes will be lost.")) {
          return; 
      }
  }

  console.log("Starting new workspace...");
  
  nodes.forEach(node => stopNodeAudio(node));
  connections.forEach(conn => stopConnectionAudio(conn));
  activePulses = []; 

  
  nodes = [];
  connections = [];
  selectedElements.clear();
  currentConstellationGroup.clear();
  fluctuatingGroupNodeIDs.clear();
  nodeIdCounter = 0;
  connectionIdCounter = 0;
  pulseIdCounter = 0;
  particleIdCounter = 0; 
  windParticles = [];

  
  historyStack = [];
  historyIndex = -1;
  saveState(); 
  unsavedChanges = false; 

  
  viewOffsetX = 0;
  viewOffsetY = 0;
  viewScale = 1.0;

  
  clearEditPanel();
  updateConstellationGroup();
  updateGroupControlsUI();
  if (isAudioReady) {
       identifyAndRouteAllGroups(); 
       updateMixerGUI();          
  }
  if (pianoRollCanvas && pianoRollCtx) drawPianoRoll();

  
  if (isPlaying && !animationFrameId) {
       startAnimationLoop();
  } else if (!isPlaying) {
       
       if (appMenuPlayPauseBtn) appMenuPlayPauseBtn.textContent = "Play ▶";
  }

  console.log("New workspace created.");
}

if (appMenuRecordBtn) {
    appMenuRecordBtn.addEventListener('click', () => {
        if (!userHasInteracted && !isAudioReady) {
             alert("Start alsjeblieft eerst de audio door op Play te klikken of de pagina te herladen als er een fout was.");
             return;
        }
        if (!isAudioReady) {
            alert("Audio is nog niet geïnitialiseerd. Probeer de pagina te vernieuwen of wacht even.");
            return;
        }
        if (audioContext.state === 'suspended') {
            alert("Audio is gepauzeerd. Hervat audio (Play) voordat je probeert op te nemen.");
            return;
        }

        if (isRecording) {
            stopRecording();
        } else {
            startRecording();
        }
    });
} else {
    console.error("#app-menu-record-btn niet gevonden in DOM!");
}

if (tapeLoopRecordBtn) {
    tapeLoopRecordBtn.addEventListener('click', () => {
        if (!tapeLoopRecordBtnClickable) {
            console.log("DEBUG: Tape Loop Record Knop klik genegeerd (te snel).");
            return;
        }
        console.log("DEBUG: Tape Loop Record Knop geklikt. Huidige staat: armed=", tapeLoopRecordBtn.dataset.isArmed, "isRecording=", isTapeLoopRecording, "isPlaying=", isTapeLoopPlaying);

        if (!audioContext || audioContext.state !== 'running') {
            alert("Audio context is nog niet klaar of is gepauzeerd. Activeer audio eerst.");
            return;
        }

        if (tapeLoopRecordBtn.dataset.isArmed === 'true') {
            console.log("DEBUG: Tape Looper was Armed. Annuleer arming nu.");
            tapeLoopRecordBtn.dataset.isArmed = 'false';
            tapeLoopRecordBtnClickable = true; 
            scheduledTapeLoopEvents = scheduledTapeLoopEvents.filter(e => e.action !== 'startRec');
            
            if (tapeLoopInputGate) {
                tapeLoopInputGate.gain.cancelScheduledValues(audioContext.currentTime);
                tapeLoopInputGate.gain.setValueAtTime(0, audioContext.currentTime);
            }
            isTapeLoopRecording = false; 
            console.log("Tape loop arming geannuleerd.");
            updateTapeLooperUI();

        } else if (isTapeLoopRecording) {
            console.log("DEBUG: Tape Looper was Recording. Stopt opname nu en start playback.");
            if (tapeLoopInputGate) {
                tapeLoopInputGate.gain.cancelScheduledValues(audioContext.currentTime);
                tapeLoopInputGate.gain.setValueAtTime(0.0, audioContext.currentTime);
            }
            scheduledTapeLoopEvents = scheduledTapeLoopEvents.filter(e => e.action !== 'stopRecAndPlay');
            
            isTapeLoopRecording = false;
            if (scriptNodeForTapeLoop) {
                try { scriptNodeForTapeLoop.disconnect(); } catch(e){}
                if (tapeLoopInputGate && scriptNodeForTapeLoop) {
                    try { tapeLoopInputGate.disconnect(scriptNodeForTapeLoop); } catch(e){}
                }
                scriptNodeForTapeLoop.onaudioprocess = null;
                scriptNodeForTapeLoop = null;
            }
            console.log("Tape loop recording direct gestopt door gebruiker.");
            updateTapeLooperUI();
            if (tapeLoopBuffer && tapeLoopWritePosition > (audioContext.sampleRate * 0.05)) {
                playTapeLoop(audioContext.currentTime);
            } else {
                console.log("DEBUG: Niet genoeg data opgenomen, buffer wordt gewist ipv afgespeeld.");
                clearTapeLoop(); 
            }
        } else if (!isTapeLoopPlaying) {
            console.log("DEBUG: Tape Looper is Idle/Ready. Start/Arm nieuwe opname.");
            clearTapeLoop(); 
            startTapeLoopRecording();
        } else {
             console.log("DEBUG: Tape loop is aan het spelen. Stop eerst playback om opnieuw op te nemen.");
        }
    });
}

if (tapeLoopPlayBtn) {
    tapeLoopPlayBtn.addEventListener('click', () => {
        if (tapeLoopBuffer && !isTapeLoopPlaying && !isTapeLoopRecording) {
            playTapeLoop();
        }
    });
}

if (tapeLoopStopBtn) {
    tapeLoopStopBtn.addEventListener('click', () => {
        if (isTapeLoopPlaying) {
            stopTapeLoopPlayback();
        }
    });
}

if (tapeLoopClearBtn) {
    tapeLoopClearBtn.addEventListener('click', () => {
        clearTapeLoop();
    });
}

if (tapeLoopDurationInput) {
    tapeLoopDurationInput.addEventListener('change', (e) => {
        const newDuration = parseFloat(e.target.value);
        if (!isNaN(newDuration) && newDuration > 0) {
            configuredTapeLoopDurationSeconds = newDuration;
            console.log(`Tape loop duration set to: ${configuredTapeLoopDurationSeconds}s`);
            if (!isTapeLoopRecording && !isTapeLoopPlaying) {
                updateTapeLooperUI();
            }
        } else {
            e.target.value = configuredTapeLoopDurationSeconds;
        }
    });
}

function clearEditPanel() {
  if (editPanelContent) {
      editPanelContent.innerHTML = "";
  }
  
  if (selectedElements.size === 0 && hamburgerMenuPanel && !hamburgerMenuPanel.classList.contains("hidden")) {
      hamburgerMenuPanel.classList.add("hidden");
      if (hamburgerBtn) hamburgerBtn.classList.remove("active");
  }
}

function showComingSoonAlert(event) {
  event.preventDefault(); 
  alert("Coming Soon!");
}

function toggleAbletonLink() {
  isAbletonLinkActive = !isAbletonLinkActive;
  console.log("Ableton Link Toggled:", isAbletonLinkActive);
  updateAbletonLinkButton();
  
  saveState(); 
}

function updateAbletonLinkButton() {
  if (appMenuAbletonLinkBtn) {
      appMenuAbletonLinkBtn.textContent = `Link: ${isAbletonLinkActive ? "ON" : "OFF"}`;
      appMenuAbletonLinkBtn.classList.toggle("active", isAbletonLinkActive);
  }
}

function toggleHelpPopup() {
  if (helpPopup) {
      helpPopup.classList.toggle('hidden');
  }
}


function populateBrushOptionsPanel() {
  sideToolbarContent.innerHTML = ""; 
  sideToolbarTitle.textContent = "Brush Options";

  
  const createBrushSection = (titleText) => {
      const sectionDiv = document.createElement('div');
      sectionDiv.classList.add('brush-tool-section');

      const header = document.createElement('p');
      header.textContent = titleText;
      header.classList.add('brush-section-header');
      sectionDiv.appendChild(header);

      const gridContainer = document.createElement('div');
      gridContainer.classList.add('brush-section-grid');
      sectionDiv.appendChild(gridContainer);

      sideToolbarContent.appendChild(sectionDiv);
      return gridContainer; 
  };

  
  const createBrushOptionButton = (item, nodeTypeForBrush, waveformValue, gridContainer) => {
      const button = document.createElement("button");
      button.classList.add("brush-option-icon-button");
      button.dataset.nodeType = nodeTypeForBrush; 
      button.dataset.waveform = waveformValue;   

      button.innerHTML = `<span class="type-icon">${item.icon || "❔"}</span>`;
      button.title = item.label;

      if (item.loadFailed) { 
          button.disabled = true;
          button.title = `${item.label} (sample failed to load)`;
          button.classList.add("disabled");
      }

      
      if (brushNodeType === nodeTypeForBrush && brushWaveform === waveformValue) {
          button.classList.add("selected");
      }

      button.addEventListener("click", () => {
          if (button.disabled) return;
          brushNodeType = nodeTypeForBrush;
          brushWaveform = waveformValue;

          
          sideToolbarContent.querySelectorAll('.brush-option-icon-button').forEach(btn => btn.classList.remove('selected'));
          button.classList.add('selected'); 
      });
      gridContainer.appendChild(button);
  };

  
  if (typeof analogWaveformPresets !== 'undefined' && analogWaveformPresets.length > 0) {
    const analogGrid = createBrushSection("Analog");
    analogWaveformPresets.forEach(preset => {
        
        createBrushOptionButton(preset, 'sound', preset.type, analogGrid);
    });
  }


const fmSynthPresets = [
  { 
    type: "fmBell", label: "Bell", icon: "🔔", details: {
      visualStyle: "fm_bell",
      carrierRatio: 1, modulatorRatio: 1.4, modulatorDepthScale: 4,
      carrierEnv: { attack: 0.005, decay: 0.8, sustain: 0, release: 0.5 },
      modulatorEnv: { attack: 0.005, decay: 0.15, sustain: 0, release: 0.2 }
    }
  },
  { 
    type: "fmXylo", label: "Xylo", icon: "🥁", details: {
      visualStyle: "fm_xylo",
      carrierRatio: 1, modulatorRatio: 3.5, modulatorDepthScale: 10,
      carrierEnv: { attack: 0.002, decay: 0.2, sustain: 0, release: 0.2 },
      modulatorEnv: { attack: 0.002, decay: 0.05, sustain: 0, release: 0.1 }
    }
  },
  { 
    type: "fmGalaxy", label: "Galaxy Pad", icon: "🌠", details: {
      visualStyle: "fm_galaxy",
      carrierWaveform: "sine", modulatorWaveform: "sine",
      carrierRatio: 1, modulatorRatio: 0.5, modulatorDepthScale: 0.1, 
      carrierEnv: { attack: 1.5, decay: 2.0, sustain: 0.8, release: 3.0 },
      modulatorEnv: { attack: 2.0, decay: 1.5, sustain: 0.6, release: 2.5 }
    }
  },
  {
    type: "fmCrystal", label: "Crystal", icon: "💎", details: {
      visualStyle: "fm_crystal",
      carrierWaveform: "sine", modulatorWaveform: "sine",
      carrierRatio: 1, modulatorRatio: 2.8, modulatorDepthScale: 3.5, 
      carrierEnv: { attack: 0.01, decay: 1.0, sustain: 0.1, release: 1.0 },
      modulatorEnv: { attack: 0.01, decay: 0.3, sustain: 0, release: 0.5 }
    }
  },
  {
    type: "fmChime", label: "Chime", icon: "🎶", details: {
      visualStyle: "fm_chime",
      carrierWaveform: "sine", modulatorWaveform: "sine",
      carrierRatio: 1, modulatorRatio: 4.2, modulatorDepthScale: 2.8, 
      carrierEnv: { attack: 0.001, decay: 1.2, sustain: 0, release: 1.2 },
      modulatorEnv: { attack: 0.001, decay: 0.8, sustain: 0, release: 0.8 }
    }
  },
  {
    type: "fmGlass", label: "Glass", icon: "🍸", details: {
      visualStyle: "fm_glass",
      carrierWaveform: "sine", modulatorWaveform: "sine",
      carrierRatio: 1, modulatorRatio: 1.77, modulatorDepthScale: 5.0, 
      carrierEnv: { attack: 0.005, decay: 0.5, sustain: 0, release: 0.7 },
      modulatorEnv: { attack: 0.005, decay: 0.1, sustain: 0, release: 0.3 }
    }
  },
  {
    type: "fmOrgan", label: "Organ", icon: "🎹", details: {
      visualStyle: "fm_organ",
      carrierWaveform: "sine", modulatorWaveform: "sine",
      carrierRatio: 1, modulatorRatio: 2.0, modulatorDepthScale: 1.5, 
      carrierEnv: { attack: 0.05, decay: 0.1, sustain: 0.9, release: 0.3 },
      modulatorEnv: { attack: 0.05, decay: 0.1, sustain: 0.9, release: 0.3 }
    }
  },
  {
    type: "fmElectricPiano", label: "E-Piano", icon: "🎼", details: {
      visualStyle: "fm_epiano",
      carrierWaveform: "sine", modulatorWaveform: "sine",
      carrierRatio: 1, modulatorRatio: 1.0, modulatorDepthScale: 2.5, 
      carrierEnv: { attack: 0.01, decay: 1.5, sustain: 0, release: 1.0 },
      modulatorEnv: { attack: 0.01, decay: 0.6, sustain: 0, release: 0.5 }
    }
  },
  {
    type: "fmEthnic", label: "Ethnic", icon: "🏮", details: {
      visualStyle: "fm_ethnic",
      carrierWaveform: "sine", modulatorWaveform: "sine",
      carrierRatio: 1, modulatorRatio: 2.53, modulatorDepthScale: 3.8,
      carrierEnv: { attack: 0.02, decay: 0.4, sustain: 0, release: 0.6 },
      modulatorEnv: { attack: 0.02, decay: 0.15, sustain: 0, release: 0.3 }
    }
  },
  {
    type: "fmMetallic", label: "Metallic", icon: "🔩", details: {
      visualStyle: "fm_metallic",
      carrierWaveform: "sine", modulatorWaveform: "sine",
      carrierRatio: 1, modulatorRatio: 5.1, modulatorDepthScale: 4.5,
      carrierEnv: { attack: 0.001, decay: 0.9, sustain: 0, release: 0.9 },
      modulatorEnv: { attack: 0.001, decay: 0.08, sustain: 0, release: 0.2 }
    }
  },
  {
    type: "fmHarmonic", label: "Harmonic", icon: "✨", details: {
      visualStyle: "fm_harmonic",
      carrierWaveform: "sine", modulatorWaveform: "sine",
      carrierRatio: 1, modulatorRatio: 3.0, modulatorDepthScale: 2.2,
      carrierEnv: { attack: 0.1, decay: 1.0, sustain: 0.5, release: 1.0 },
      modulatorEnv: { attack: 0.1, decay: 0.5, sustain: 0.3, release: 0.8 }
    }
  },
  {
    type: "fmVoid", label: "Void", icon: "⚫", details: {
      visualStyle: "fm_void",
      carrierWaveform: "sine", modulatorWaveform: "sine",
      carrierRatio: 1, modulatorRatio: 0.25, modulatorDepthScale: 1.8, 
      carrierEnv: { attack: 2.0, decay: 3.0, sustain: 1.0, release: 4.0 },
      modulatorEnv: { attack: 2.5, decay: 2.5, sustain: 0.8, release: 3.5 }
    }
  }
];

  
  
  
  
  
  if (typeof samplerWaveformTypes !== 'undefined' && samplerWaveformTypes.length > 0) {
    const samplerGrid = createBrushSection("Samplers");
    samplerWaveformTypes.forEach(samplerPreset => {
        
        createBrushOptionButton(samplerPreset, 'sound', samplerPreset.type, samplerGrid);
    });
  }

  
  
  
  
  
  if (typeof drumElementTypes !== 'undefined' && drumElementTypes.length > 0) {
    const drumGrid = createBrushSection("Drums");
    drumElementTypes.forEach(drumPreset => {
        
        
        createBrushOptionButton(drumPreset, drumPreset.type, drumPreset.type, drumGrid);
    });
  }

  
  const pulseOptionDiv = document.createElement('div');
  pulseOptionDiv.classList.add('panel-section');
  pulseOptionDiv.style.marginTop = '15px';
  const pulseLabel = document.createElement('label');
  pulseLabel.htmlFor = 'brushStartPulseCheckbox';
  pulseLabel.style.display = 'inline-block';
  pulseLabel.style.marginRight = '5px';
  pulseLabel.textContent = 'Start chain with Pulsar?';
  const pulseCheckbox = document.createElement('input');
  pulseCheckbox.type = 'checkbox';
  pulseCheckbox.id = 'brushStartPulseCheckbox';
  pulseCheckbox.checked = brushStartWithPulse;
  pulseCheckbox.style.verticalAlign = 'middle';
  pulseCheckbox.addEventListener('change', (e) => {
      brushStartWithPulse = e.target.checked;
  });
  pulseOptionDiv.appendChild(pulseCheckbox);
  pulseOptionDiv.appendChild(pulseLabel);
  sideToolbarContent.appendChild(pulseOptionDiv);

  sideToolbar.classList.remove("hidden");
  if (hamburgerMenuPanel) hamburgerMenuPanel.classList.add("hidden");
  if (hamburgerBtn) hamburgerBtn.classList.remove("active");
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
    if (nodeTypeToAdd !== "sound" && nodeTypeToAdd !== "nebula") {
      console.warn(`handleWaveformSelect called with unexpected nodeTypeToAdd: ${nodeTypeToAdd} for waveform ${waveformType}`);
      return;
    }
  
    waveformToAdd = waveformType;
    console.log(`%c[handleWaveformSelect] waveformToAdd SET TO: ${waveformToAdd} (for nodeType: ${nodeTypeToAdd})`, 'color: blue; font-weight: bold;'); 
  
    const currentWaveButtons = sideToolbarContent.querySelectorAll(
      ".waveform-button, .sampler-button"
    );
    currentWaveButtons.forEach((btn) => btn.classList.remove("selected"));
    if (button) button.classList.add("selected");
  
    if ((nodeTypeToAdd === "sound" || nodeTypeToAdd === "nebula") && !document.getElementById('hexNoteSelectorContainer')) {
      createHexNoteSelectorDOM(sideToolbarContent);
    }
  }

  function updateScaleAndTransposeUI() {
    if (scaleSelectTransport) scaleSelectTransport.value = currentScaleKey;}
  function changeScale(scaleKey, skipNodeUpdate = false) {
    if (!scales[scaleKey]) return;
    currentScaleKey = scaleKey;
    currentScale = scales[scaleKey];
    document.body.className = currentScale.theme;
    if (scaleSelectTransport) { 
         scaleSelectTransport.value = scaleKey;
    }

    if (!skipNodeUpdate) {
        nodes.forEach((node) => {
            if (node.type === "sound" || node.type === "nebula") {
                node.audioParams.scaleIndex = Math.max(
                    MIN_SCALE_INDEX,
                    Math.min(MAX_SCALE_INDEX, node.audioParams.scaleIndex ?? 0)
                );
                node.audioParams.pitch = getFrequency(
                    currentScale,
                    node.audioParams.scaleIndex
                );
                if (isNaN(node.audioParams.pitch)) {
                    node.audioParams.scaleIndex = 0;
                    node.audioParams.pitch = getFrequency(currentScale, 0);
                }
                updateNodeAudioParams(node);
            }
        });
        connections.forEach((conn) => {
            if (conn.type === "string_violin") {
                conn.audioParams.scaleIndex = Math.max(
                    MIN_SCALE_INDEX,
                    Math.min(MAX_SCALE_INDEX, conn.audioParams.scaleIndex ?? 0)
                );
                conn.audioParams.pitch = getFrequency(
                    currentScale,
                    conn.audioParams.scaleIndex
                );
                if (isNaN(conn.audioParams.pitch)) {
                    conn.audioParams.scaleIndex = 0;
                    conn.audioParams.pitch = getFrequency(currentScale, 0);
                }
                updateConnectionAudioParams(conn);
            }
        });
    }

    if (
        !sideToolbar.classList.contains("hidden") &&
        (nodeTypeToAdd === "sound" || nodeTypeToAdd === "nebula")
    ) {
        noteIndexToAdd = -1; 
        if (currentTool === 'add' || currentTool === 'brush') { 
            
            if (document.getElementById('hexNoteSelectorContainer')) { 
                 createHexNoteSelectorDOM(sideToolbarContent); 
            }
        }
    }

    drawPianoRoll();
    populateEditPanel(); 
    if (!skipNodeUpdate) {
        saveState();
    }
}
function updateSyncUI() {
  if (appMenuSyncToggleBtn) { 
    appMenuSyncToggleBtn.textContent = `Sync: ${isGlobalSyncEnabled ? "ON" : "OFF"}`;
    appMenuSyncToggleBtn.classList.toggle("active", isGlobalSyncEnabled);
  }
  if (appMenuBpmControls) { 
    appMenuBpmControls.classList.toggle("hidden", !isGlobalSyncEnabled);
  }
  if (appMenuBpmInput) { 
    appMenuBpmInput.value = globalBPM; 
}
  updateRestartPulsarsButtonVisibility(); 
  populateEditPanel(); 
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
  if (appMenuRestartPulsarsBtn) { 
     appMenuRestartPulsarsBtn.classList.toggle("hidden", !showButton);
  }
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

function hideOverlappingPanels() {
  
  
  const sideToolbar = document.getElementById("sideToolbar");
  const hamburgerMenuPanel = document.getElementById("hamburgerMenuPanel");
  const hamburgerBtn = document.getElementById("hamburgerBtn"); 

  if (sideToolbar) sideToolbar.classList.add("hidden");
  if (hamburgerMenuPanel) hamburgerMenuPanel.classList.add("hidden");
  if (hamburgerBtn) hamburgerBtn.classList.remove("active");
  
}

function togglePlayPause() { 
  console.log("TOGGLEPLAYPAUSE: Start. userHasInteracted:", userHasInteracted, "isAudioReady:", isAudioReady, "isPlaying:", isPlaying); 
  userHasInteracted = true;
  if (!isAudioReady) {
    console.log("TOGGLEPLAYPAUSE: Audio niet klaar, roept setupAudio() aan."); 
    setupAudio().then((context) => {
      console.log("TOGGLEPLAYPAUSE: setupAudio().then() binnen togglePlayPause - BEGIN. Context state:", context?.state); 
      if (context) {
        if (context.state !== "running") {
          context.resume().then(() => {
              console.log("TOGGLEPLAYPAUSE: Audio context resumed."); 
              isPlaying = true;
              if (appMenuPlayPauseBtn) appMenuPlayPauseBtn.textContent = "Pause ⏸"; 
              if (startMessage) startMessage.style.display = "none";
              startAnimationLoop();
              resetStartNodeTimers();
            }).catch(e => { console.error("TOGGLEPLAYPAUSE: Fout bij audio context resume:", e);}); 
        } else {
          console.log("TOGGLEPLAYPAUSE: Audio context was al running."); 
          isPlaying = true;
          if (appMenuPlayPauseBtn) appMenuPlayPauseBtn.textContent = "Pause ⏸"; 
          if (startMessage) startMessage.style.display = "none";
          startAnimationLoop();
          resetStartNodeTimers();
        }
      } else {
        console.error("TOGGLEPLAYPAUSE: setupAudio() in togglePlayPause gaf geen context terug."); 
      }
    }).catch(err => {console.error("TOGGLEPLAYPAUSE: Fout TIJDENS setupAudio() in togglePlayPause:", err);}); 
  } else if (audioContext.state === "running") {
    console.log("TOGGLEPLAYPAUSE: Audio context is running, suspending..."); 
    audioContext.suspend().then(() => {
        console.log("TOGGLEPLAYPAUSE: Audio context suspended."); 
        isPlaying = false;
        if (appMenuPlayPauseBtn) appMenuPlayPauseBtn.textContent = "Play ▶"; 
        if (animationFrameId) { cancelAnimationFrame(animationFrameId); animationFrameId = null; }
        activePulses.forEach((p) => { 
            const conn = findConnectionById(p.connectionId);
            if (conn && conn.type === "string_violin") stopStringSound(conn);
        });
      }).catch(e => { console.error("TOGGLEPLAYPAUSE: Fout bij audio context suspend:", e);}); 
  } else if (audioContext.state === "suspended") {
    console.log("TOGGLEPLAYPAUSE: Audio context is suspended, resuming..."); 
    audioContext.resume().then(() => {
        console.log("TOGGLEPLAYPAUSE: Audio context resumed (was suspended)."); 
        isPlaying = true;
        if (appMenuPlayPauseBtn) appMenuPlayPauseBtn.textContent = "Pause ⏸"; 
        if (startMessage) startMessage.style.display = "none";
        startAnimationLoop();
        resetStartNodeTimers();
      }).catch(e => { console.error("TOGGLEPLAYPAUSE: Fout bij audio context resume (was suspended):", e); }); 
  }
  console.log("TOGGLEPLAYPAUSE: Einde functie. isPlaying:", isPlaying); 
}

function recalculateOrbitoneArrays(node, selectedArray) {
  selectedArray.forEach(elData => {
      const n = findNodeById(elData.id);
      if (n && n.audioParams && n.type === 'sound' && n.audioParams.orbitonesEnabled && n.audioParams.orbitoneCount > 0) {
          const count = n.audioParams.orbitoneCount;
          const intervalBase = n.audioParams.orbitoneIntervalBase || 2;
          const intervalStep = n.audioParams.orbitoneIntervalStep || 2;
          const timingBase = n.audioParams.orbitoneTimingOffsetBase || 0;
          const timingStep = n.audioParams.orbitoneTimingOffsetStep || 50;

          n.audioParams.orbitoneIntervals = [];
          n.audioParams.orbitoneTimingOffsets = [];

          for (let i = 0; i < count; i++) {
              n.audioParams.orbitoneIntervals.push(intervalBase + (i * intervalStep));
              n.audioParams.orbitoneTimingOffsets.push(timingBase + (i * timingStep));
          }
          stopNodeAudio(n);
          n.audioNodes = createAudioNodesForNode(n);
          if (n.audioNodes) updateNodeAudioParams(n);
      }
  });
}

function getOrbitoneFrequencies(baseScaleIndex, orbitoneCount, orbitoneIntervals, orbitoneSpread, scaleDef, mainNodePitch) {
  const frequencies = [mainNodePitch]; // Start met de frequentie van de hoofdnoot
  const numNotesInScale = scaleDef.notes.length;

  if (orbitoneCount <= 0) {
      return [mainNodePitch];
  }

  for (let i = 0; i < orbitoneCount; i++) { 
      let currentIntervalOffsetInScaleSteps = orbitoneIntervals[i] !== undefined ? orbitoneIntervals[i] : ((i + 1) * 2);
      let noteOctaveOffsetFromSpread = 0;
      if (orbitoneSpread > 0) {
          noteOctaveOffsetFromSpread = orbitoneSpread; 
      }
      const targetScaleIndexForOrbitone = baseScaleIndex + currentIntervalOffsetInScaleSteps;
      const freq = getFrequency(scaleDef, targetScaleIndexForOrbitone, noteOctaveOffsetFromSpread);
      
      if (!isNaN(freq) && freq > 0) {
          frequencies.push(freq);
      } else {
          const fallbackSemitoneOffset = (i + 1) * 3; // bijv. kleine terts hoger als fallback
          frequencies.push(mainNodePitch * Math.pow(2, fallbackSemitoneOffset / 12));
      }
  }
  return frequencies.slice(0, 1 + orbitoneCount); // Hoofdnoot + aantal extra orbitones
}

function applyOrbitoneVoicingFromPhase(node) {
  if (!node || !node.audioParams || node.type !== 'sound') return;
  const phase = node.audioParams.orbitoneVoicingPhase || 0;
  const count = node.audioParams.orbitoneCount || 0;
  let intervals = []; 
  let calculatedSpread = 0; 

  if (count > 0) {
      if (phase <= 20) { 
          intervals = count > 0 ? [2] : []; 
          if (count > 1) intervals.push(3); 
          if (count > 2) intervals.push(1); 
          if (count > 3) intervals.push(4);
          if (count > 4) intervals.push(5);
          calculatedSpread = 0;
      } else if (phase <= 40) { 
          intervals = count > 0 ? [4] : []; 
          if (count > 1) intervals.push(count > 2 ? 3 : 2); 
          if (count > 2) intervals.push(1);
          if (count > 3) intervals.push(5);
          if (count > 4) intervals.push(2);
          calculatedSpread = 0;
      } else if (phase <= 60) { 
          intervals = count > 0 ? [2] : []; 
          if (count > 1) intervals.push(4); 
          if (count > 2) intervals.push(6); 
          if (count > 3) intervals.push(1);
          if (count > 4) intervals.push(3);
          calculatedSpread = 0;
      } else if (phase <= 80) { 
          intervals = count > 0 ? [0] : []; 
          if (count > 1) intervals.push(2); 
          if (count > 2) intervals.push(-2);
          if (count > 3) intervals.push(4);
          if (count > 4) intervals.push(-4);
          calculatedSpread = 1; 
      } else { 
          intervals = count > 0 ? [1 + Math.floor(Math.random()*2)] : [];
          if (count > 1) intervals.push(4 + Math.floor(Math.random()*3-1));
          if (count > 2) intervals.push(-1 + Math.floor(Math.random()*3-1));
          if (count > 3) intervals.push(5 + Math.floor(Math.random()*2-1));
          if (count > 4) intervals.push(-3 + Math.floor(Math.random()*3-1));
          calculatedSpread = Math.random() > 0.4 ? 1 : 0;
      }
  }
  node.audioParams.orbitoneIntervals = intervals.slice(0, count);
  node.audioParams.orbitoneSpread = calculatedSpread;
}

function applyOrbitoneTimingFromPhase(node) {
  if (!node || !node.audioParams || node.type !== 'sound') return;
  const phase = node.audioParams.orbitoneTimingPhase || 0;
  const count = node.audioParams.orbitoneCount || 0;
  let offsets = [];

  if (count > 0) {
      if (phase <= 10) { 
          for (let i = 0; i < count; i++) offsets.push(0);
      } else if (phase <= 30) { 
          for (let i = 0; i < count; i++) offsets.push(Math.floor(Math.random() * 25) + i * 5);
      } else if (phase <= 50) { 
          for (let i = 0; i < count; i++) offsets.push((i) * 30 + Math.floor(Math.random() * 20));
      } else if (phase <= 70) { 
          for (let i = 0; i < count; i++) offsets.push((i) * 80 + Math.floor(Math.random() * 40));
      } else if (phase <= 90) { 
          for (let i = 0; i < count; i++) offsets.push((i) * 150 + Math.floor(Math.random() * 50));
      } else { 
          for (let i = 0; i < count; i++) offsets.push(Math.floor(Math.random() * 200) + i * 15);
      }
  }
  node.audioParams.orbitoneTimingOffsets = offsets.slice(0, count);
}

function addNode(x, y, type, subtype = null) {
  if (!isAudioReady) return null;
  let currentEvent = window.event;
  let applySnap = isSnapEnabled && !(currentEvent && currentEvent.shiftKey);
  let finalPos = applySnap ? snapToGrid(x, y) : { x: x, y: y };
  const isStartNodeType = isPulsarType(type);
  let nodeTypeVisual = type;
  let initialScaleIndex = 0;
  let initialPitch = 0;
  let nodeSubtypeForAudioParams = subtype;
  let initialBaseHue = null;
  let visualStyle = null;
  let audioDetails = {};
  let selectedPreset = null;

  if (type === "sound") {
    selectedPreset = analogWaveformPresets.find(p => p.type === subtype) || fmSynthPresets.find(p => p.type === subtype);
  } else if (isPulsarType(type)) {
    nodeSubtypeForAudioParams = type;
    selectedPreset = pulsarTypes.find(p => p.type === type);
  }

  if (selectedPreset && selectedPreset.details) {
    visualStyle = selectedPreset.details.visualStyle || null;
    Object.keys(selectedPreset.details).forEach(key => {
        if (key !== 'visualStyle') audioDetails[key] = selectedPreset.details[key];
    });
  }

  if (type === "sound") {
    if (noteIndexToAdd !== -1 && noteIndexToAdd !== null && noteIndexToAdd >= MIN_SCALE_INDEX && noteIndexToAdd <= MAX_SCALE_INDEX) {
      initialScaleIndex = noteIndexToAdd;
    } else {
      initialScaleIndex = Math.floor(Math.random() * currentScale.notes.length * 2);
    }
    initialScaleIndex = Math.max(MIN_SCALE_INDEX, Math.min(MAX_SCALE_INDEX, initialScaleIndex));
    initialPitch = getFrequency(currentScale, initialScaleIndex);
    if (isNaN(initialPitch) || initialPitch <= 0) { 
        initialScaleIndex = 0; 
        initialPitch = getFrequency(currentScale, 0); 
        if (isNaN(initialPitch) || initialPitch <= 0) initialPitch = 261.63;
    }

    if (!nodeSubtypeForAudioParams) {
      nodeSubtypeForAudioParams = 'sine';
      selectedPreset = analogWaveformPresets.find(p => p.type === 'sine');
      if (selectedPreset && selectedPreset.details) {
          visualStyle = selectedPreset.details.visualStyle || 'analog_sine';
          audioDetails = {};
          Object.keys(selectedPreset.details).forEach(key => {
              if (key !== 'visualStyle') audioDetails[key] = selectedPreset.details[key];
          });
      }
    } else if (nodeSubtypeForAudioParams.startsWith('sampler_')) {
      const samplerId = nodeSubtypeForAudioParams.replace('sampler_', '');
      const definition = typeof SAMPLER_DEFINITIONS !== 'undefined' ? SAMPLER_DEFINITIONS.find(s => s.id === samplerId) : null;
      if (!definition || definition.loadFailed) {
        nodeSubtypeForAudioParams = 'sine';
        selectedPreset = analogWaveformPresets.find(p => p.type === 'sine');
        if (selectedPreset && selectedPreset.details) {
            visualStyle = selectedPreset.details.visualStyle || 'analog_sine';
            audioDetails = {};
            Object.keys(selectedPreset.details).forEach(key => {
              if (key !== 'visualStyle') audioDetails[key] = selectedPreset.details[key];
            });
        }
      } else {
        visualStyle = visualStyle || `sampler_${samplerId}`;
      }
    }
  } else if (type === "nebula") {
    initialBaseHue = Math.random() * 360;
    nodeSubtypeForAudioParams = waveformToAdd || audioDetails.osc1Type || "sawtooth";
    visualStyle = visualStyle || "nebula_default";
    initialPitch = getFrequency(currentScale, initialScaleIndex);
    if (isNaN(initialPitch) || initialPitch <= 0) initialPitch = getFrequency(scales.major_pentatonic, 0);
  } else if (type === PORTAL_NEBULA_TYPE) {
    initialBaseHue = PORTAL_NEBULA_DEFAULTS.baseColorHue + (Math.random() - 0.5) * 40;
    initialPitch = PORTAL_NEBULA_DEFAULTS.droneBaseFreq;
    nodeSubtypeForAudioParams = null;
    visualStyle = visualStyle || "portal_default";
    audioDetails.actualOscillatorType = "triangle";
  }

  const drumDefaults = isDrumType(type) ? DRUM_ELEMENT_DEFAULTS[type] : {};
  if (isDrumType(type) && !visualStyle) visualStyle = type;

  const randomSize = (isStartNodeType || isDrumType(type) || type === PORTAL_NEBULA_TYPE)
    ? MIN_NODE_SIZE + Math.random() * (MAX_NODE_SIZE - MIN_NODE_SIZE) * 0.7
    : (type === "relay" || type === "reflector" || type === "switch" ? 0.7 : 1.0);
  const starPoints = isStartNodeType ? 6 : 5;
  let defaultIsEnabled = true;
  const defaultVolumeSteps = [0.8, 0.65, 0.5];
  const numDefaultSteps = defaultVolumeSteps.length;
  const defaultOrbitoneCount = 0; // Default geen *extra* orbitones

  const newNode = {
    id: nodeIdCounter++, x: finalPos.x, y: finalPos.y, size: randomSize, radius: NODE_RADIUS_BASE,
    type: nodeTypeVisual, baseHue: initialBaseHue, connections: new Set(), isSelected: false, isInConstellation: false,
    audioParams: {
      waveform: nodeSubtypeForAudioParams, visualStyle: visualStyle, pitch: initialPitch, scaleIndex: initialScaleIndex,
      volume: drumDefaults?.volume ?? (type === PORTAL_NEBULA_TYPE ? 0.6 : 1.0),
      reverbSend: type === PORTAL_NEBULA_TYPE ? (DEFAULT_REVERB_SEND * 1.5) : DEFAULT_REVERB_SEND,
      delaySend: type === PORTAL_NEBULA_TYPE ? (DEFAULT_DELAY_SEND * 1.2) : DEFAULT_DELAY_SEND,
      lowPassFreq: MAX_FILTER_FREQ, ...audioDetails,
      triggerInterval: audioDetails.triggerInterval || DEFAULT_TRIGGER_INTERVAL,
      syncSubdivisionIndex: audioDetails.syncSubdivisionIndex || DEFAULT_SUBDIVISION_INDEX, 
      probability: audioDetails.probability || DEFAULT_PROBABILITY,
      pulseIntensity: audioDetails.pulseIntensity || DEFAULT_PULSE_INTENSITY,
      volLfoRate: audioDetails.volLfoRate || (0.1 + Math.random() * 0.2),
      volLfoDepth: audioDetails.volLfoDepth || 0,
      detune: audioDetails.detune || 7, lfoDepthFactor: audioDetails.lfoDepthFactor || 1,
      baseFreq: audioDetails.baseFreq || drumDefaults?.baseFreq,
      decay: audioDetails.decay || drumDefaults?.decay,
      noiseDecay: audioDetails.noiseDecay || drumDefaults?.noiseDecay,
      pitchShiftIndex: type === "pitchShift" ? (audioDetails.pitchShiftIndex || DEFAULT_PITCH_SHIFT_INDEX) : 0,
      pitchShiftAmount: type === "pitchShift" ? PITCH_SHIFT_AMOUNTS[audioDetails.pitchShiftIndex || DEFAULT_PITCH_SHIFT_INDEX] : 0,
      pitchShiftAlternating: type === "pitchShift" ? (audioDetails.pitchShiftAlternating || false) : false,
      pitchShiftDirection: type === "pitchShift" ? (audioDetails.pitchShiftDirection || 1) : 1,
      gateModeIndex: type === "gate" ? (audioDetails.gateModeIndex || DEFAULT_GATE_MODE_INDEX) : 0,
      gateCounter: 0, lastRandomGateResult: true,
      midiOutEnabled: false, midiChannel: 1, midiNote: 60,
      osc1Type: nodeSubtypeForAudioParams,
      
      orbitonesEnabled: false,
      orbitoneCount: defaultOrbitoneCount, 
      orbitoneVoicingPhase: 0, 
      orbitoneTimingPhase: 0,        
      orbitoneMix: 0.5,    
      orbitoneIntervals: [], 
      orbitoneTimingOffsets: [],
      orbitoneSpread: 0,

      retriggerEnabled: false, retriggerVolumeSteps: [...defaultVolumeSteps],
      retriggerPitchSteps: Array(numDefaultSteps).fill(0), retriggerFilterSteps: Array(numDefaultSteps).fill(0),
      retriggerMuteSteps: Array(numDefaultSteps).fill(false), retriggerIntervalMs: 100,
      retriggerRateMode: "constant", retriggerSyncSubdivisionIndex: DEFAULT_SUBDIVISION_INDEX, 
      ignoreGlobalSync: false, 
    },
    color: null, audioNodes: null, isStartNode: isStartNodeType, isTriggered: false, lastTriggerPulseId: -1, animationState: 0,
    isEnabled: defaultIsEnabled, starPoints: starPoints,
    currentAngle: (type === "gate" || (type === "sound" && nodeSubtypeForAudioParams?.startsWith("sampler_"))) ? Math.random() * Math.PI * 2 : 0,
    innerAngle: 0, pulsePhase: type === "nebula" || type === PORTAL_NEBULA_TYPE ? Math.random() * Math.PI * 2 : 0,
    primaryInputConnectionId: type === "switch" ? null : undefined, lastTriggerTime: -1, nextSyncTriggerTime: 0,
    activeRetriggers: [], currentRetriggerVisualIndex: -1,
  };
  
  applyOrbitoneVoicingFromPhase(newNode);
  applyOrbitoneTimingFromPhase(newNode);

  if (newNode.type === "pulsar_rocket") {
    newNode.audioParams.rocketDirectionAngle = 0; newNode.audioParams.rocketSpeed = ROCKET_DEFAULT_SPEED;
    newNode.audioParams.rocketRange = ROCKET_DEFAULT_RANGE; newNode.audioParams.rocketGravity = ROCKET_DEFAULT_GRAVITY;
  }

  if (isStartNodeType && newNode.isEnabled && audioContext) {
    const nowTime = audioContext.currentTime; const interval = newNode.audioParams.triggerInterval;
    if (newNode.type === 'pulsar_random_particles') {
      newNode.nextRandomTriggerTime = nowTime + (Math.random() * 2) / PULSAR_RANDOM_TIMING_CHANCE_PER_SEC;
    } else if (newNode.type !== 'pulsar_triggerable' && newNode.type !== 'pulsar_manual') {
      if (isGlobalSyncEnabled && !newNode.audioParams.ignoreGlobalSync) {
        const secondsPerBeat = 60.0 / (globalBPM || 120);
        const subdivIndex = newNode.audioParams.syncSubdivisionIndex;
        if (subdivIndex >= 0 && subdivIndex < subdivisionOptions.length) {
          const subdiv = subdivisionOptions[subdivIndex];
          if (subdiv && typeof subdiv.value === 'number' && secondsPerBeat > 0) {
            const nodeIntervalSeconds = secondsPerBeat * subdiv.value;
            if (nodeIntervalSeconds > 0) {
              newNode.nextSyncTriggerTime = Math.ceil(nowTime / nodeIntervalSeconds) * nodeIntervalSeconds;
              if (newNode.nextSyncTriggerTime <= nowTime + 0.01) newNode.nextSyncTriggerTime += nodeIntervalSeconds;
            }
          }
        }
      } else {
        newNode.lastTriggerTime = nowTime - interval * (0.8 + Math.random() * 0.19);
      }
    }
  }
  if (isAudioReady) {
    newNode.audioNodes = createAudioNodesForNode(newNode);
    if (newNode.audioNodes) updateNodeAudioParams(newNode);
  }
  nodes.push(newNode); saveState(); identifyAndRouteAllGroups(); return newNode;
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

function triggerLoad() {
  
  let dynamicLoadInput = document.getElementById("dynamicLoadStateInput");
  if (!dynamicLoadInput) {
    dynamicLoadInput = document.createElement("input");
    dynamicLoadInput.type = "file";
    dynamicLoadInput.id = "dynamicLoadStateInput"; 
    dynamicLoadInput.accept = ".json";
    dynamicLoadInput.style.display = "none"; 
    dynamicLoadInput.addEventListener("change", handleFileLoad); 
    document.body.appendChild(dynamicLoadInput); 
  }
  dynamicLoadInput.value = null; 
  dynamicLoadInput.click(); 
}

hamburgerBtn.addEventListener("click", () => {
  const isOpen = !hamburgerMenuPanel.classList.contains("hidden")
  resetSideToolbars()
  hideOverlappingPanels()
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

if (groupVolumeSlider) { 
  groupVolumeSlider.addEventListener("input", (e) => {
      
      if (currentConstellationGroup.size > 0) {
          
          const firstSelectedNodeId = currentConstellationGroup.values().next().value;
          
          const selectedGroup = findGroupContainingNode(firstSelectedNodeId);

          if (selectedGroup) {
              
              setSpecificGroupVolume(selectedGroup.id, parseFloat(e.target.value));
          } else {
               
               console.warn("Selected group node ID not found in any identified group.");
          }
      } else {
           
      }

      
      const vol = parseFloat(e.target.value);
      const originalLabel = document.querySelector('label[for="groupVolumeSlider"]');
      if (originalLabel && originalLabel.textContent.includes('(')) {
         originalLabel.textContent = `Group Volume (${vol.toFixed(2)}):`;
      }
  });

  
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


if (appMenuNew) appMenuNew.addEventListener("click", (e) => { e.preventDefault(); handleNewWorkspace(); });
if (appMenuLoad) appMenuLoad.addEventListener("click", (e) => { e.preventDefault(); triggerLoad(); });
if (appMenuSave) appMenuSave.addEventListener("click", (e) => { e.preventDefault(); triggerSave(); });
if (appMenuMidiSoon) appMenuMidiSoon.addEventListener("click", showComingSoonAlert);
if (appMenuAdvancedSoon) appMenuAdvancedSoon.addEventListener("click", showComingSoonAlert);
if (appMenuUndoBtn) appMenuUndoBtn.addEventListener("click", undo);
if (appMenuRedoBtn) appMenuRedoBtn.addEventListener("click", redo);
if (appMenuAbletonLinkBtn) appMenuAbletonLinkBtn.addEventListener("click", toggleAbletonLink);
if (appMenuToggleTapeLooperBtn) {
    appMenuToggleTapeLooperBtn.addEventListener('click', () => {
        if (tapeLooperPanel) {
            if (tapeLooperPanel.classList.contains('hidden')) {
                hideOverlappingPanels();
                tapeLooperPanel.classList.remove('hidden');
                appMenuToggleTapeLooperBtn.classList.add('active');
            } else {
                tapeLooperPanel.classList.add('hidden');
                appMenuToggleTapeLooperBtn.classList.remove('active');
            }
        }
    });
}

if (closeTapeLooperPanelBtn) {
    closeTapeLooperPanelBtn.addEventListener('click', () => {
        if (tapeLooperPanel) {
            tapeLooperPanel.classList.add('hidden');
        }
        if (appMenuToggleTapeLooperBtn) {
            appMenuToggleTapeLooperBtn.classList.remove('active');
        }
    });
}

if (appMenuGridToggleBtn) {
    appMenuGridToggleBtn.addEventListener("click", () => {
        isGridVisible = !isGridVisible;
        appMenuGridToggleBtn.textContent = `Grid: ${isGridVisible ? "ON" : "OFF"}`;
        appMenuGridToggleBtn.classList.toggle("active", isGridVisible);
        
    });
}
if (appMenuGridSnapBtn) {
    appMenuGridSnapBtn.addEventListener("click", () => {
        isSnapEnabled = !isSnapEnabled;
        appMenuGridSnapBtn.textContent = `Snap: ${isSnapEnabled ? "ON" : "OFF"}`;
        appMenuGridSnapBtn.classList.toggle("active", isSnapEnabled);
    });
}
if (appMenuSyncToggleBtn) {
    appMenuSyncToggleBtn.addEventListener("click", () => {
        isGlobalSyncEnabled = !isGlobalSyncEnabled;
        nodes.forEach((n) => {
            if (n.isStartNode) {
                n.lastTriggerTime = -1; n.nextSyncTriggerTime = 0; n.nextGridTriggerTime = 0; n.nextRandomTriggerTime = 0;
            }
        });
        lastBeatTime = 0;
        updateSyncUI();
        saveState();
    });
}
if (appMenuBpmInput) {
  appMenuBpmInput.addEventListener("change", (e) => {
      const newBPMValue = parseInt(e.target.value, 10);
      if (!isNaN(newBPMValue) && newBPMValue >= 30 && newBPMValue <= 300) {
          globalBPM = newBPMValue;
          saveState();
          console.log(`Global BPM is nu: ${globalBPM}`);

          if (isTapeLoopPlaying && tapeLoopSourceNode && tapeLoopRecordedAtBPM > 0 && isGlobalSyncEnabled && audioContext) {
              const newPlaybackRate = globalBPM / tapeLoopRecordedAtBPM;
              tapeLoopSourceNode.playbackRate.setTargetAtTime(newPlaybackRate, audioContext.currentTime, 0.05);
              console.log(`Tape loop playbackRate aangepast naar: ${newPlaybackRate.toFixed(2)}`);
          }
      } else {
          console.warn(`Ongeldige BPM input: ${e.target.value}. Reset naar ${globalBPM}.`);
          appMenuBpmInput.value = globalBPM;
      }
  });
}
if (appMenuPlayPauseBtn) appMenuPlayPauseBtn.addEventListener("click", togglePlayPause);
if (appMenuRestartPulsarsBtn) {
    appMenuRestartPulsarsBtn.addEventListener("click", () => {
         if (!isAudioReady || isGlobalSyncEnabled) return;
         const nowTime = audioContext.currentTime;
         let restarted = false;
         selectedElements.forEach((el) => {
             if (el.type === "node") {
                 const node = findNodeById(el.id);
                 if (node && node.isStartNode && node.type !== "pulsar_triggerable") {
                     node.lastTriggerTime = nowTime;
                     node.isEnabled = true; 
                     node.animationState = 0.5;
                     setTimeout(() => { const check = findNodeById(node.id); if(check) check.animationState = 0; }, 150);
                     restarted = true;
                 }
             }
         });
         if (restarted) saveState();
    });
}


if (appMenuHelpBtn) appMenuHelpBtn.addEventListener("click", toggleHelpPopup);
if (closeHelpPopupBtn) closeHelpPopupBtn.addEventListener("click", toggleHelpPopup);


if (closeHamburgerBtn) {
    closeHamburgerBtn.addEventListener("click", () => {
        if (hamburgerMenuPanel) hamburgerMenuPanel.classList.add("hidden");
        if (hamburgerBtn) hamburgerBtn.classList.remove("active");
    });
}

if (connectWaveTrailBtn) {
  connectWaveTrailBtn.addEventListener('click', () => {
      setActiveTool('connect_wavetrail'); 
      console.log("WaveTrail tool selected."); 
  });
} else {
  console.error("#connectWaveTrailBtn not found during listener setup!");
}
toggleInfoTextBtn.addEventListener("click", () => {
  isInfoTextVisible = !isInfoTextVisible
  updateInfoToggleUI()
})


function setupAddTool(buttonElement, type, requiresSubmenu = false, submenuType = null, submenuTitle = "") {
  setActiveTool("add");
  nodeTypeToAdd = type;

  if (currentTool !== "add" || nodeTypeToAdd !== type) {
      waveformToAdd = null;
      noteIndexToAdd = -1;
  }

  const addButtons = toolbar.querySelectorAll("#toolbar-sound-generators button, #toolbar-pulsars button, #toolbar-logic-nodes button, #toolbar-environment-nodes button");
  addButtons.forEach((btn) => {
      if (btn !== buttonElement) btn.classList.remove("active");
  });
  if (buttonElement) buttonElement.classList.add("active");

  if (requiresSubmenu && submenuType) {
      populateSideToolbar(submenuType, submenuTitle); 
  } else {
      resetSideToolbars();
      if (sideToolbar) sideToolbar.classList.add("hidden"); 
      if (type === PORTAL_NEBULA_TYPE) {
          waveformToAdd = null;
      }
  }
}
if (addAnalogSynthBtn) {
  addAnalogSynthBtn.addEventListener("click", (e) => {
      setupAddTool(e.currentTarget, "sound", true, "analogWaveforms", "Analog Synths");
  });
} else { console.error("#addAnalogSynthBtn niet gevonden!"); }

if (addFmSynthBtn) {
  addFmSynthBtn.addEventListener("click", (e) => {
      setupAddTool(e.currentTarget, "sound", true, "fmSynths", "FM Synths");
  });
} else { console.error("#addFmSynthBtn niet gevonden!"); }
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
            populateBrushOptionsPanel(); 
        });
    } else {
        console.warn("#brushBtn not found");
    }
if (addSamplerBtn) { 
  addSamplerBtn.addEventListener("click", (e) => {
      
      console.log("Sampler button clicked!");

      
      setupAddTool(e.currentTarget, "sound", true, "samplers", "Samplers");
  });
} else {
  
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
if (mixerToggleBtn) {
  mixerToggleBtn.addEventListener('click', () => {
      const mixerPanel = document.getElementById("mixerPanel"); 
      if (mixerPanel) { 
          const isHidden = mixerPanel.classList.contains('hidden');
          if (isHidden) {
              hideOverlappingPanels(); 
              mixerPanel.classList.remove('hidden');
              mixerToggleBtn.classList.add('active');
              updateMixerGUI(); 
          } else {
              mixerPanel.classList.add('hidden');
              mixerToggleBtn.classList.remove('active');
          }
      } else {
          console.error("#mixerPanel not found inside mixerToggleBtn listener!");
      }
  });
} else {
  console.error("#mixerToggleBtn not found during listener setup!");
}
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
      !mixerPanel.classList.contains("hidden")

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
      if (appMenuGridSnapBtn) { 
          appMenuGridSnapBtn.click();
      }
      e.preventDefault();
  }  else if (e.key.toLowerCase() === 'i') {
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
       isBrushing = false; 
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
  } else if (e.key.toLowerCase() === 'b' && !targetIsInput && brushBtn) { 
       brushBtn.click(); 
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
  } else if (e.key.toLowerCase() === 'm' && !targetIsInput) { 
      hamburgerBtn.click();
      e.preventDefault();
  } else if (e.key === 'Escape') {
      if (isBrushing) { 
          isBrushing = false;
          lastBrushNode = null;
          console.log("Brush: Chain ended by Escape key.");
          
          setActiveTool('edit'); 
          e.preventDefault(); 
          return; 
      }
      
      if (selectedElements.size > 0) {
           selectedElements.clear();
           populateEditPanel();
           updateConstellationGroup();
      }
      setActiveTool("edit");
      resetSideToolbars();
      hideOverlappingPanels();
      e.preventDefault(); 
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
      event.preventDefault(); 
      
  }
  
  event.preventDefault();
}

canvas.addEventListener('contextmenu', handleContextMenu);

function animationLoop() {
  animationFrameId = requestAnimationFrame(animationLoop);

  if (!isAudioReady || !isPlaying || !audioContext || audioContext.state !== 'running') {
      return;
  }

  processScheduledTapeEvents();

  const now = audioContext.currentTime;
  const deltaTime = Math.max(0, Math.min(0.1, now - (previousFrameTime || now)));
  const secondsPerBeat = 60.0 / (globalBPM || 120);

  if (isGlobalSyncEnabled && beatIndicatorElement && secondsPerBeat > 0) {
      const epsilon = 0.01;
      if (now >= lastBeatTime + secondsPerBeat - epsilon) {
          if (!beatIndicatorElement.classList.contains("active")) {
              beatIndicatorElement.classList.add("active");
              setTimeout(() => {
                  if (beatIndicatorElement) beatIndicatorElement.classList.remove("active");
              }, 50);
          }
          lastBeatTime = Math.floor(now / secondsPerBeat) * secondsPerBeat;
      }
  } else if (beatIndicatorElement && beatIndicatorElement.classList.contains("active")) {
      beatIndicatorElement.classList.remove("active");
      lastBeatTime = 0;
  }

  try {
      nodes.forEach((node) => {
          if (node.isStartNode && node.isEnabled && node.audioParams &&
              (node.type === "pulsar_standard" || node.type === "pulsar_random_volume" || node.type === "pulsar_random_particles" || node.type === "pulsar_rocket")) {

              let shouldPulse = false;
              let pulseData = {};

              if (node.type === "pulsar_random_particles") {
                  if (node.nextRandomTriggerTime === undefined || node.nextRandomTriggerTime === 0 || node.nextRandomTriggerTime < now - 10) {
                      node.nextRandomTriggerTime = now + (Math.random() * 2) / PULSAR_RANDOM_TIMING_CHANCE_PER_SEC;
                  }
                  if (now >= node.nextRandomTriggerTime) {
                      shouldPulse = true;
                      node.nextRandomTriggerTime = now + (Math.random() * 2) / PULSAR_RANDOM_TIMING_CHANCE_PER_SEC;
                  }
              } else { // Standard, Random Volume, Rocket Pulsars
                  if (isGlobalSyncEnabled && !node.audioParams.ignoreGlobalSync) {
                      const index = node.audioParams.syncSubdivisionIndex ?? DEFAULT_SUBDIVISION_INDEX;
                      if (index >= 0 && index < subdivisionOptions.length) {
                          const subdiv = subdivisionOptions[index];
                          if (subdiv && typeof subdiv.value === 'number' && secondsPerBeat > 0) {
                              const nodeIntervalSeconds = secondsPerBeat * subdiv.value;
                              if (nodeIntervalSeconds > 0) {
                                  if (node.nextSyncTriggerTime === undefined || node.nextSyncTriggerTime === 0 || node.nextSyncTriggerTime < now - nodeIntervalSeconds * 2) {
                                      const currentBeatEquivalent = now / nodeIntervalSeconds;
                                      node.nextSyncTriggerTime = (Math.floor(currentBeatEquivalent) + 1) * nodeIntervalSeconds;
                                      if (node.nextSyncTriggerTime <= now + 0.005) {
                                          node.nextSyncTriggerTime += nodeIntervalSeconds;
                                      }
                                  }
                                  if (now >= node.nextSyncTriggerTime - 0.005) {
                                      shouldPulse = true;
                                      node.nextSyncTriggerTime += nodeIntervalSeconds;
                                      if (node.nextSyncTriggerTime <= now) { // Zorg dat het altijd in de toekomst is
                                          node.nextSyncTriggerTime = Math.ceil(now / nodeIntervalSeconds) * nodeIntervalSeconds;
                                          if (node.nextSyncTriggerTime <= now) node.nextSyncTriggerTime += nodeIntervalSeconds;
                                      }
                                  }
                              }
                          }
                      }
                  } else { // Niet gesynchroniseerd of negeert sync
                      if (node.lastTriggerTime === undefined || node.lastTriggerTime < 0) {
                          node.lastTriggerTime = now - Math.random() * (node.audioParams.triggerInterval || DEFAULT_TRIGGER_INTERVAL);
                      }
                      const interval = node.audioParams.triggerInterval || DEFAULT_TRIGGER_INTERVAL;
                      if (interval > 0 && (now - node.lastTriggerTime >= interval - 0.005)) {
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

                  if (node.type === "pulsar_rocket") {
                      launchRocket(node, pulseData);
                  } else {
                      node.connections.forEach(neighborId => {
                          const neighborNode = findNodeById(neighborId);
                          const connection = connections.find(c => (c.nodeAId === node.id && c.nodeBId === neighborId) || (c.nodeAId === neighborId && c.nodeBId === node.id));
                          if (neighborNode && neighborNode.type !== 'nebula' && neighborNode.type !== PORTAL_NEBULA_TYPE && connection && neighborNode.lastTriggerPulseId !== currentGlobalPulseId) {
                              const travelTime = connection.length * DELAY_FACTOR;
                              try {
                                  createVisualPulse(connection.id, travelTime, node.id, Infinity, 'trigger', pulseData.color, pulseData.intensity);
                                  propagateTrigger(neighborNode, travelTime, currentGlobalPulseId, node.id, Infinity, { type: 'trigger', data: pulseData }, connection, now + travelTime);
                              } catch (propError) {}
                          }
                      });
                  }
              }
          } else if (node.type === "gate" && node.currentAngle !== undefined) {
              node.currentAngle += GATE_ROTATION_SPEED * (deltaTime * 60);
              node.currentAngle %= 2 * Math.PI;
          } else if (node.type === "nebula" && node.pulsePhase !== undefined) {
              node.currentAngle = (node.currentAngle || 0) + NEBULA_ROTATION_SPEED_OUTER * (deltaTime * 60);
              node.currentAngle %= 2 * Math.PI;
              node.innerAngle = (node.innerAngle || 0) + NEBULA_ROTATION_SPEED_INNER * (deltaTime * 60);
              node.innerAngle %= 2 * Math.PI;
              node.pulsePhase += NEBULA_PULSE_SPEED * (deltaTime * 60);
              node.pulsePhase %= 2 * Math.PI;
          } else if (node.type === PORTAL_NEBULA_TYPE && node.pulsePhase !== undefined) {
              node.pulsePhase += (PORTAL_NEBULA_DEFAULTS.pulseSpeed || 0.5) * (deltaTime * 60);
              node.pulsePhase %= 2 * Math.PI;
          }
      });

      try {
          updateNebulaInteractionAudio();
      } catch (nebError) {}

      if (currentTool === 'brush' && isBrushing && lastBrushNode) {
          if (Math.random() < 0.3) {
              createParticles(lastBrushNode.x, lastBrushNode.y, 1);
          }
      }

      if (isTapeLoopPlaying || isTapeLoopRecording || (tapeLoopRecordBtn && tapeLoopRecordBtn.dataset.isArmed === 'true')) {
          tapeReelAngle += 2 * (deltaTime * 60); //deltaTime factor for smoother animation
          if (tapeReelLeft) {
              tapeReelLeft.style.transform = `rotate(${tapeReelAngle}deg)`;
          }
          if (tapeReelRight) {
              tapeReelRight.style.transform = `rotate(${tapeReelAngle}deg)`;
          }
      }
      
      draw();

  } catch (loopError) {
      if (animationFrameId) {
          cancelAnimationFrame(animationFrameId);
          animationFrameId = null;
      }
  }
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

function handleWaveTrailFileInputChange(event, connection) {
  if (!connection || connection.type !== 'wavetrail') return;
  const file = event.target.files[0];
  const fileNameDisplay = document.getElementById(`edit-wavetrail-filename-${connection.id}`);

  if (file) {
      console.log(`File selected for WaveTrail ${connection.id}: ${file.name}`);
      if (fileNameDisplay) fileNameDisplay.textContent = `Loading: ${file.name}...`;

      const reader = new FileReader();
      reader.onload = (e) => {
          loadAndDecodeAudio(e.target.result, connection);
      };
      reader.onerror = (e) => {
          console.error("Error reading file:", e);
          if (fileNameDisplay) fileNameDisplay.textContent = `Error reading file.`;
          connection.audioParams.buffer = null;
          connection.audioParams.fileName = null;
      };
      reader.readAsArrayBuffer(file);
      connection.audioParams.fileName = file.name;
  }
  event.target.value = null;
}

async function loadAndDecodeAudio(arrayBuffer, connection) {
  if (!audioContext || !connection) return;
  const fileNameDisplay = document.getElementById(`edit-wavetrail-filename-${connection.id}`);
  try {
      let decodedBuffer;
      if (audioContext.decodeAudioData.length !== 1) {
          decodedBuffer = await audioContext.decodeAudioData(arrayBuffer);
      } else {
          decodedBuffer = await new Promise((resolve, reject) => {
              audioContext.decodeAudioData(arrayBuffer, resolve, reject);
          });
      }
      connection.audioParams.buffer = decodedBuffer; 

      
      connection.audioParams.waveformPath = generateWaveformPath(decodedBuffer, 200); 
      if (connection.audioParams.waveformPath) {
           console.log(`Waveform path generated for WaveTrail ${connection.id}, points: ${connection.audioParams.waveformPath.length}`);
      } else {
           console.warn(`Failed to generate waveform path for WaveTrail ${connection.id}`);
      }
      

      console.log(`Audio decoded successfully for WaveTrail ${connection.id}:`, connection.audioParams.buffer);
      if (fileNameDisplay) fileNameDisplay.textContent = `Current: ${connection.audioParams.fileName || 'Unnamed'}`;
      saveState(); 

  } catch (error) {
      console.error(`Error decoding audio data for WaveTrail ${connection.id}:`, error);
      if (fileNameDisplay) fileNameDisplay.textContent = `Error decoding: ${connection.audioParams.fileName || 'file'}`;
      connection.audioParams.buffer = null;
      connection.audioParams.waveformPath = null; 
      connection.audioParams.fileName = null; 
  }
}



function drawPianoRoll() {
  if (!pianoRollCtx || !pianoRollCanvas) {
      return;
  }

  try {
      if (pianoRollCanvas.clientWidth > 0 && pianoRollCanvas.width !== pianoRollCanvas.clientWidth) {
           pianoRollCanvas.width = pianoRollCanvas.clientWidth;
      }
       if (pianoRollCanvas.clientHeight <= 0 && pianoRollCanvas.height <= 0) {
           pianoRollCanvas.height = 60; 
       } else if (pianoRollCanvas.height !== pianoRollCanvas.clientHeight) {
          pianoRollCanvas.height = pianoRollCanvas.clientHeight;
       }
  } catch (e) {
       console.warn("Kon pianoRollCanvas dimensies niet correct instellen:", e);
       if(pianoRollCanvas.width <= 0 || pianoRollCanvas.height <= 0) return;
  }

  const canvasWidth = pianoRollCanvas.width;
  const canvasHeight = pianoRollCanvas.height;
  pianoRollCtx.clearRect(0, 0, canvasWidth, canvasHeight);
  pianoRollHexagons = [];

  const scaleNotes = currentScale.notes;
  const rootNoteModulo = currentRootNote % 12;
  const noteNameMap = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
  const naturalNotes = [0, 2, 4, 5, 7, 9, 11];
  const sharpNotes = [1, 3, 6, 8, 10];

  
  const numHexagons = 12; 
  const horizontalMargin = 6;
  const verticalMargin = 4;
  const availableWidth = canvasWidth - 2 * horizontalMargin;

  
  
  let hexRadius = availableWidth / ((numHexagons / 2 + 0.5) * 1.5);

  
  const hexHeight = Math.sqrt(3) * hexRadius;
  const maxRadiusH = (canvasHeight - 2 * verticalMargin) / (Math.sqrt(3));
  hexRadius = Math.max(5, Math.min(maxRadiusH, hexRadius, 15)); 

  
  const finalHexHeight = Math.sqrt(3) * hexRadius;
  const hSpacing = hexRadius * 1.5; 
  const vSpacing = finalHexHeight / 2; 

  
  const startX = horizontalMargin + hexRadius;
  const totalContentHeight = finalHexHeight; 
  const startY = (canvasHeight / 2); 

  pianoRollCtx.lineWidth = 1;
  pianoRollCtx.font = `bold ${Math.max(6, Math.min(9, hexRadius * 0.55))}px sans-serif`;
  pianoRollCtx.textAlign = "center";
  pianoRollCtx.textBaseline = "middle";

  let currentColumn = 0;
  for (let i = 0; i < numHexagons; i++) { 
      const noteModulo = i; 
      const isNatural = naturalNotes.includes(noteModulo);

      
      const posX = startX + currentColumn * hSpacing;
      const posY = startY + (currentColumn % 2 !== 0 ? vSpacing : 0); 

      const noteRelativeToRoot = (noteModulo - rootNoteModulo + 12) % 12;
      const isScaleNote = scaleNotes.includes(noteRelativeToRoot);
      const isRootNote = noteModulo === rootNoteModulo;

      
      let fillStyle, strokeStyle, textColor;
      if (isNatural) {
          fillStyle = "rgba(200, 210, 230, 0.8)";
          strokeStyle = "rgba(230, 240, 255, 0.7)";
          textColor = "#ddeeff";
          if (isScaleNote) { fillStyle = "rgba(220, 230, 250, 0.9)"; } 
          if (isRootNote) { fillStyle = "rgba(255, 230, 80, 0.9)"; textColor = "#332"; strokeStyle = "rgba(255, 240, 120, 1)"; }
      } else { 
          fillStyle = "rgba(40, 45, 55, 0.9)";
          strokeStyle = "rgba(70, 80, 95, 0.8)";
          textColor = "#cdd5e0";
           if (isScaleNote) { fillStyle = "rgba(80, 90, 110, 0.9)"; } 
           if (isRootNote) { fillStyle = "rgba(210, 190, 60, 0.9)"; textColor = "#332"; strokeStyle = "rgba(230, 210, 100, 1)"; }
      }

      
      pianoRollCtx.fillStyle = fillStyle;
      pianoRollCtx.strokeStyle = strokeStyle;
      pianoRollCtx.beginPath();
      for (let side = 0; side < 6; side++) {
          pianoRollCtx.lineTo(posX + hexRadius * Math.cos(side * Math.PI / 3), posY + hexRadius * Math.sin(side * Math.PI / 3));
      }
      pianoRollCtx.closePath();
      pianoRollCtx.fill();
      pianoRollCtx.stroke();

      
      pianoRollCtx.fillStyle = textColor;
      pianoRollCtx.fillText(noteNameMap[noteModulo], posX, posY + 1);

      pianoRollHexagons.push({ x: posX, y: posY, radius: hexRadius, semitone: noteModulo });
      currentColumn++;
  }
}

function handlePianoRollClick(event) {
  if (!pianoRollCanvas || !pianoRollHexagons || pianoRollHexagons.length === 0) return;

  const rect = pianoRollCanvas.getBoundingClientRect();
  const scaleX = pianoRollCanvas.width / rect.width; 
  const scaleY = pianoRollCanvas.height / rect.height;
  const canvasX = (event.clientX - rect.left) * scaleX;
  const canvasY = (event.clientY - rect.top) * scaleY;

  let clickedSemitone = -1;

  
  let minDistSq = Infinity;
  for (const hex of pianoRollHexagons) {
      const dx = canvasX - hex.x;
      const dy = canvasY - hex.y;
      const distSq = dx * dx + dy * dy;
      
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

  
  drawPianoRoll();

  
  populateEditPanel();

  
  saveState();
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

function triggerManualPulsar(node) {
  if (!node || node.type !== 'pulsar_manual' || !isAudioReady) return;

  console.log(`Manual Pulsar ${node.id} triggered by click.`);

  const pulseData = {
      intensity: node.audioParams.pulseIntensity ?? DEFAULT_PULSE_INTENSITY,
      color: node.color ?? null,
      particleMultiplier: 1.0
      
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
          createVisualPulse(connection.id, travelTime, node.id, Infinity, 'trigger', pulseData.color, pulseData.intensity); 
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
function handleFileLoad(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const loadedState = JSON.parse(e.target.result);
      if (loadedState && loadedState.nodes && loadedState.connections) {
        
        loadedState.selectedElements = new Set(loadedState.selectedElements || []);

        loadState(loadedState); 

        unsavedChanges = false; 
                                
        
        saveState(); 
        console.log("File loaded successfully. New history state created.");
        

      } else {
        console.error("Loaded file is not a valid ResonAut state object after parsing.");
        alert("Failed to load file. The file content is not a valid ResonAut project.");
      }
    } catch (err) {
      console.error("Error parsing or processing loaded file:", err);
      alert("Failed to load file. It might be corrupted or not in the correct JSON format.");
    } finally {
      
      event.target.value = ""; 
    }
  };
  reader.onerror = (error) => {
    console.error("Error reading file:", error);
    alert("An error occurred while trying to read the file.");
    event.target.value = ""; 
  };
  reader.readAsText(file);
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
  
  
  
 
  
  
  
  
  
 
 
 
 
  
  
  
  
  
  
  
  
  
  
 

}
function sendMidiMessage(messageArray) {
  if (activeMidiOutput && messageArray) {
    try {
      activeMidiOutput.send(messageArray)
    } catch (error) {}
  }
}





let glideStartStar = null
const glideDuration = 0.5 




function getAudioNodesForStar(starElement) {
  
  const starId = starElement.id
  
  
  
  
  
  
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





function areSoundsDifferent(star1Element, star2Element) {
  console.warn("areSoundsDifferent() checkt niet daadwerkelijk verschil.")
  return true
}



if (glideToolButton) {
    glideToolButton.addEventListener('click', () => {
        
        setActiveTool('connect_glide');
        console.log("Connect Glide mode AAN (via setActiveTool). Sleep van start naar doel ster.");
        
        isConnecting = false; 
        connectingNode = null;
    });
} else {
    console.warn("Knop met ID #glide-tool-button niet gevonden.");
}

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
  
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
    if (canvas.clientWidth > 0 && canvas.clientHeight > 0) {
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
    }
    console.log("LOAD: UI setup voor setupAudio() voltooid.");

    pianoRollCanvas = document.getElementById('pianoRollCanvas');
    if (pianoRollCanvas) {
        pianoRollCtx = pianoRollCanvas.getContext('2d');
        try {
            pianoRollCanvas.width = pianoRollCanvas.clientWidth;
            pianoRollCanvas.height = pianoRollCanvas.clientHeight;
        } catch (e) {
            console.warn("Kon pianoRollCanvas dimensies niet direct instellen:", e);
            pianoRollCanvas.width = 300;
            pianoRollCanvas.height = 80;
        }
        pianoRollCanvas.addEventListener('mousedown', handlePianoRollClick);
    } else {
        console.error("#pianoRollCanvas element not found during initialization!");
    }

    Object.keys(scales).forEach((key) => {
        const o = document.createElement("option");
        o.value = key;
        o.textContent = scales[key].name;
        scaleSelectTransport.appendChild(o.cloneNode(true));
    });

    scaleSelectTransport.value = currentScaleKey;

    setActiveTool("edit");
    resetSideToolbars();
    hideOverlappingPanels();
    noteSelectElement = null;
    noteSelectContainer = null;

    startMessage.style.display = "block";
    console.log("LOAD: Start message wordt getoond.");

    setupAudio().then(context => {
        console.log("LOAD: setupAudio().then() - BEGIN");
        if (context) {
            console.log("LOAD: Audio context verkregen.");
            isAudioReady = true;
            updateMixerUI();
            updateScaleAndTransposeUI();
            identifyAndRouteAllGroups();
            drawPianoRoll();
            setActiveTool("edit");
            resetSideToolbars();
            hideOverlappingPanels();
            updateTapeLooperUI();
            console.log("LOAD: setupAudio().then() - VOLTOOID, isAudioReady:", isAudioReady);
        } else {
            console.error("LOAD: Audio setup mislukt (context is null/undefined in .then()).");
            startMessage.textContent = "Error loading audio.";
            startMessage.style.display = "block";
            if(loadingIndicator) loadingIndicator.style.display = 'none';
        }
    }).catch(err => {
        console.error("LOAD: Fout TIJDENS setupAudio() (in .catch()):", err);
        startMessage.textContent = "Error loading audio.";
        startMessage.style.display = "block";
        if(loadingIndicator) loadingIndicator.style.display = 'none';
    });
    console.log("LOAD: Einde van load event listener (setupAudio is asynchroon gestart).");
});
