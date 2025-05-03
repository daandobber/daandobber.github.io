// samplers.js

// Definieer alle sampler informatie op één centrale plek
const SAMPLER_DEFINITIONS = [
    {
        id: "marimba", // Gebruikt voor type string "sampler_marimba"
        url: "marimba_c3.wav",
        baseFreq: 130.81,
        label: "Marimba",
        icon: "🪵",
        buffer: null, // Wordt gevuld na laden
        isLoaded: false,
        loadFailed: false
    },
    {
        id: "piano",
        url: "piano_c4.wav",
        baseFreq: 261.63,
        label: "Piano",
        icon: "🎹",
        buffer: null,
        isLoaded: false,
        loadFailed: false
    },
    {
        id: "flute",
        url: "flute_c5.wav",
        baseFreq: 523.25,
        label: "Flute",
        icon: "🌬️",
        buffer: null,
        isLoaded: false,
        loadFailed: false
    },
    {
        id: "acoustic_bass",
        url: "accoustic_bass_c2.wav", // Let op: bestandsnaam was 'accOUstic'
        baseFreq: 65.41,
        label: "Bass",
        icon: "🎸",
        buffer: null,
        isLoaded: false,
        loadFailed: false
    },
    {
        id: "biwa",
        url: "biwa_c4.wav",
        baseFreq: 261.63,
        label: "Biwa",
        icon: "🪕",
        buffer: null,
        isLoaded: false,
        loadFailed: false
    },
    {
        id: "harp",
        url: "harp_c3.wav",
        baseFreq: 130.81,
        label: "Harp",
        icon: "🎶",
        buffer: null,
        isLoaded: false,
        loadFailed: false
    },
    {
        id: "kalimba",
        url: "kalimba_c4.wav",
        baseFreq: 261.63,
        label: "Kalimba",
        icon: "✨",
        buffer: null,
        isLoaded: false,
        loadFailed: false
    },
    {
        id: "ocarina",
        url: "ocarina_c5.wav",
        baseFreq: 523.25,
        label: "Ocarina",
        icon: "🏺",
        buffer: null,
        isLoaded: false,
        loadFailed: false
    }
    // Voeg hier eenvoudig toekomstige samplers toe
];

// Optionele hulpfuncties (kunnen ook in app.js blijven als je wilt)
function getSamplerBufferById(id) {
    const definition = SAMPLER_DEFINITIONS.find(s => s.id === id);
    return definition ? definition.buffer : null;
}

function getSamplerBaseFreqById(id) {
    const definition = SAMPLER_DEFINITIONS.find(s => s.id === id);
    // Geef null of een default terug als niet gevonden, voorkom NaN
    return definition ? definition.baseFreq : null;
}