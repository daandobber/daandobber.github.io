function createSampler(id, url, baseFreq, label, icon) {
    return {
        id,
        url,
        baseFreq,
        label,
        icon,
        buffer: null,
        reversedBuffer: null,
        isLoaded: false,
        loadFailed: false,
    };
}

const SAMPLER_DEFINITIONS = [
    createSampler("marimba", "marimba_c3.mp3", 130.81, "Marimba", "🪵"),
    createSampler("piano", "piano_c4.mp3", 261.63, "Piano", "🎹"),
    createSampler("flute", "flute_c5.mp3", 523.25, "Flute", "🌬️"),
    createSampler("acoustic_bass", "accoustic_bass_c2.mp3", 65.41, "Bass", "🎸"),
    createSampler("biwa", "biwa_c4.mp3", 261.63, "Biwa", "🪕"),
    createSampler("harp", "harp_c3.mp3", 130.81, "Harp", "🎶"),
    createSampler("kalimba", "kalimba_c4.mp3", 261.63, "Kalimba", "✨"),
    createSampler("ocarina", "ocarina_c5.mp3", 523.25, "Ocarina", "🏺"),
    createSampler("harpsilute", "harpsilute_c5.mp3", 523.25, "Harpsilute", "🎼"),
    createSampler("musicbox", "musicbox_c4.mp3", 261.63, "Music Box", "🎁"),
    createSampler("bomtempi", "bomtempi_c6.mp3", 1046.5, "Bomtempi", "🎹"),
    createSampler("harpsicord", "harpsicord_c4.mp3", 261.63, "Harpsicord", "🎶"),
    createSampler("nightvox", "nightvox_c3.mp3", 130.81, "Nightvox", "🎤"),
];
