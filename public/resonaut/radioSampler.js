document.addEventListener('DOMContentLoaded', () => {
  const panel = document.getElementById('radioSamplerPanel');
  const toggleBtn = document.getElementById('app-menu-radio-sampler-btn');
  const closeBtn = document.getElementById('closeRadioSamplerPanelBtn');
  const playBtn = document.getElementById('radioPlayBtn');
  const volumeSlider = document.getElementById('radioVolumeSlider');
  const seqRecordBtn = document.getElementById('radioRecordSeqBtn');
  const stationSlider = document.getElementById('radioStationSlider');
  const stepEls = Array.from(document.querySelectorAll('#radioSeqSteps .radio-step'));
  const metBtn = document.getElementById('metronomeToggleBtn');
  const pads = Array.from(document.querySelectorAll('#radioSamplerGrid .radio-pad'));
  const waveformCanvas = document.getElementById('radioWaveformCanvas');
  const startInput = document.getElementById('radioPadStart');
  const endInput = document.getElementById('radioPadEnd');
  const pitchSliderPad = document.getElementById('radioPadPitch');
  const volumeSliderPad = document.getElementById('radioPadVolume');
  const reverseToggle = document.getElementById('radioPadReverse');
  const waveformCtx = waveformCanvas.getContext('2d');
  const radioAudio = document.getElementById('radioStream');
  const editorDiv = document.getElementById('radioPadEditor');
  const tabButtons = Array.from(panel.querySelectorAll('.radio-tab'));
  const tabPads = document.getElementById('radioSamplerTabPads');
  const tabEffects = document.getElementById('radioSamplerTabEffects');
  const fxPad = document.getElementById('radioFxPad');
  const fxSelectX = Array.from(document.querySelectorAll('.radioFxSelectX'));
  const fxSelectY = Array.from(document.querySelectorAll('.radioFxSelectY'));
  const fxRecordBtn = document.getElementById('radioFxRecordBtn');
  const fxDeleteBtn = document.getElementById('radioFxDeleteBtn');

  const AudioContext = window.AudioContext || window.webkitAudioContext;
  const audioCtx = window.audioContext || (window.audioContext = new AudioContext());
  if (!window.radioGainNode) {
    window.radioGainNode = audioCtx.createGain();
    window.radioGainNode.gain.value = 1.0;
    window.radioGainNode._originalGainBeforeMute = window.radioGainNode.gain.value;
    window.radioMuteState = false;
    window.radioSoloState = false;
  }
  if (!window.radioAnalyserNode) {
    window.radioAnalyserNode = audioCtx.createAnalyser();
    window.radioAnalyserNode.fftSize = 256;
    window.radioAnalyserNode.smoothingTimeConstant = 0.7;
    window.radioGainNode.connect(window.radioAnalyserNode);
    window.radioAnalyserNode.connect(audioCtx.destination);
  }
  const source = audioCtx.createMediaElementSource(radioAudio);
  const dest = audioCtx.createMediaStreamDestination();
  source.connect(dest);
  const fxInput = audioCtx.createGain();
  const delayNode = audioCtx.createDelay(1.0);
  const delayFeedback = audioCtx.createGain();
  delayFeedback.gain.value = 0.3;
  delayNode.connect(delayFeedback).connect(delayNode);
  const filterNode = audioCtx.createBiquadFilter();
  filterNode.type = 'lowpass';
  filterNode.frequency.value = 10000;
  const distortionNode = audioCtx.createWaveShaper();
  distortionNode.curve = new Float32Array([0,0]);
  distortionNode.oversample = '4x';
  fxInput.connect(delayNode);
  delayNode.connect(filterNode);
  filterNode.connect(distortionNode);
  distortionNode.connect(window.radioGainNode);
  // Route radio through FX chain instead of bypassing
  source.connect(fxInput);
  const FX_MAX = { delay: 1.0, filter: 10000, distortion: 1.0, pitch: 12 };

  let isRadioPlaying = false;
  let isSequenceRecording = false;
  let mediaRecorder = null;
  const recordings = pads.map(() => null);
  const buffers = pads.map(() => null);
  const reversedBuffers = pads.map(() => null);
  const padStart = pads.map(() => 0);
  const padEnd = pads.map(() => 0);
  const padPitch = pads.map(() => 1);
  const padGain = pads.map(() => 1);
  const padReverse = pads.map(() => false);
  const activeSources = pads.map(() => null);
  const sequenceSteps = Array.from({ length: 16 }, () => []);
  let currentStep = 0;
  let stepTimeout = null;
  let selectedPad = 0;
  let isMetronomeOn = false;
  let draggingStart = false;
  let draggingEnd = false;
  let recordingPad = null;
  let recordingTimeout = null;
  let selectedStep = null;
  let fxX = 0;
  let fxY = 0;
  let pitchRate = 1;
  let isFxRecording = false;
  let isFxPlaying = false;
  let fxAutomation = [];
  let fxRecordStart = 0;
  let fxPlaybackStart = 0;
  let fxPlaybackIndex = 0;
  let fxLoopLength = 0;
  let fxLoopReq = null;
  function setDistortion(amount){
    const k = amount * 100;
    const n = 44100;
    const curve = new Float32Array(n);
    for(let i=0;i<n;i++){
      const x = i*2/n-1;
      curve[i]=(3+k)*x*20*Math.PI/180/(Math.PI+k*Math.abs(x));
    }
    distortionNode.curve = curve;
  }

  function applyFx(){
    const active = { delay:false, filter:false, distortion:false, pitch:false };
    const apply = (choice,val)=>{
      switch(choice){
        case 'delay':
          delayNode.delayTime.setTargetAtTime(val*FX_MAX.delay,audioCtx.currentTime,0.01);
          active.delay = true;
          break;
        case 'filter':
          const freq = 200+val*(FX_MAX.filter-200);
          filterNode.frequency.setTargetAtTime(freq,audioCtx.currentTime,0.01);
          active.filter = true;
          break;
        case 'distortion':
          setDistortion(val*FX_MAX.distortion);
          active.distortion = true;
          break;
        case 'pitch':
          const semis = (val*2-1)*FX_MAX.pitch;
          pitchRate = Math.pow(2, semis/12);
          active.pitch = true;
          break;
      }
    };
    fxSelectX.forEach(sel=>apply(sel.value,fxX));
    fxSelectY.forEach(sel=>apply(sel.value,fxY));
    if(!active.delay) delayNode.delayTime.setTargetAtTime(0,audioCtx.currentTime,0.01);
    if(!active.filter) filterNode.frequency.setTargetAtTime(FX_MAX.filter,audioCtx.currentTime,0.01);
    if(!active.distortion) setDistortion(0);
    if(!active.pitch) pitchRate = 1;
  }

  function drawFxPad(){
    if(!fxPad) return;
    const ctx=fxPad.getContext('2d');
    ctx.clearRect(0,0,fxPad.width,fxPad.height);
    ctx.fillStyle='#333';
    ctx.fillRect(0,0,fxPad.width,fxPad.height);
    ctx.fillStyle='#8af';
    ctx.beginPath();
    ctx.arc(fxX*fxPad.width,(1-fxY)*fxPad.height,5,0,Math.PI*2);
    ctx.fill();
  }

  function recordAutomationPoint(){
    if(!isFxRecording) return;
    const t = audioCtx.currentTime - fxRecordStart;
    fxAutomation.push({t,x:fxX,y:fxY});
  }

  function startFxLoop(){
    if(fxAutomation.length===0) return;
    isFxPlaying = true;
    fxPlaybackIndex = 0;
    fxPlaybackStart = (typeof getNextQuantizedTime==='function')
      ? getNextQuantizedTime(audioCtx.currentTime,4)
      : audioCtx.currentTime;
    fxLoopLength = getStepDuration()*16;
    if(fxLoopReq) cancelAnimationFrame(fxLoopReq);
    fxLoopReq = requestAnimationFrame(stepFxLoop);
  }

  function stopFxLoop(){
    isFxPlaying = false;
    if(fxLoopReq){
      cancelAnimationFrame(fxLoopReq);
      fxLoopReq = null;
    }
  }

  function stepFxLoop(){
    if(!isFxPlaying) return;
    if(audioCtx.currentTime < fxPlaybackStart){
      fxLoopReq = requestAnimationFrame(stepFxLoop);
      return;
    }
    const elapsed = audioCtx.currentTime - fxPlaybackStart;
    while(fxPlaybackIndex < fxAutomation.length && fxAutomation[fxPlaybackIndex].t <= elapsed){
      fxX = fxAutomation[fxPlaybackIndex].x;
      fxY = fxAutomation[fxPlaybackIndex].y;
      applyFx();
      drawFxPad();
      fxPlaybackIndex++;
    }
    if(elapsed >= fxLoopLength){
      fxPlaybackStart += fxLoopLength;
      fxPlaybackIndex = 0;
    }
    fxLoopReq = requestAnimationFrame(stepFxLoop);
  }

  function updatePadStepIndicators() {
    pads.forEach((pad, i) => {
      const ind = pad.querySelector('.pad-step-toggle');
      if (!ind) return;
      if (selectedStep === null) {
        ind.classList.remove('on');
      } else {
        ind.classList.toggle('on', sequenceSteps[selectedStep].includes(i));
      }
    });
  }

  if (volumeSlider) {
    volumeSlider.addEventListener('input', () => {
      const val = parseFloat(volumeSlider.value);
      window.radioGainNode.gain.setTargetAtTime(val, audioCtx.currentTime, 0.01);
      window.radioGainNode._originalGainBeforeMute = val;
    });
    volumeSlider.value = window.radioGainNode.gain.value;
  }

  function hidePanel() {
    panel.classList.add('hidden');
    if (toggleBtn) toggleBtn.classList.remove('active');
  }

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      if (panel.classList.contains('hidden')) {
        if (typeof hideOverlappingPanels === 'function') hideOverlappingPanels();
        panel.classList.remove('hidden');
        toggleBtn.classList.add('active');
      } else {
        hidePanel();
      }
    });
  }
  if (closeBtn) closeBtn.addEventListener('click', hidePanel);

  if (metBtn) {
    metBtn.addEventListener('click', () => {
      isMetronomeOn = !isMetronomeOn;
      metBtn.classList.toggle('active', isMetronomeOn);
    });
  }

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      tabButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      if (tabPads) tabPads.classList.add('hidden');
      if (tabEffects) tabEffects.classList.add('hidden');
      if (btn.dataset.tab === 'pads' && tabPads) tabPads.classList.remove('hidden');
      if (btn.dataset.tab === 'effects' && tabEffects) tabEffects.classList.remove('hidden');
    });
  });

  if (fxPad) {
    let draggingFx = false;
    const updateFromEvent = e => {
      const rect = fxPad.getBoundingClientRect();
      fxX = Math.min(Math.max(0, e.clientX - rect.left), rect.width) / rect.width;
      fxY = 1 - Math.min(Math.max(0, e.clientY - rect.top), rect.height) / rect.height;
      drawFxPad();
      applyFx();
      recordAutomationPoint();
    };
    fxPad.addEventListener('pointerdown', e => { draggingFx = true; updateFromEvent(e); fxPad.setPointerCapture(e.pointerId); });
    fxPad.addEventListener('pointermove', e => { if (draggingFx) updateFromEvent(e); });
    fxPad.addEventListener('pointerup', e => { draggingFx = false; fxPad.releasePointerCapture(e.pointerId); recordAutomationPoint(); });
    drawFxPad();
  }

  [...fxSelectX, ...fxSelectY].forEach(el => {
    el.addEventListener('input', applyFx);
  });

  function updateStepGrid() {
    stepEls.forEach((el, idx) => {
      el.classList.toggle('selected', sequenceSteps[idx].includes(selectedPad));
    });
  }

  stepEls.forEach((el, i) => {
    el.addEventListener('click', () => {
      selectedStep = i;
      const arr = sequenceSteps[i];
      const pos = arr.indexOf(selectedPad);
      if (pos === -1) arr.push(selectedPad); else arr.splice(pos, 1);
      updateStepGrid();
      updatePadStepIndicators();
    });
  });

  function updateTuning() {
    const val = parseFloat(stationSlider.value);
    if (!isRadioPlaying) {
      window.radioGainNode.gain.setTargetAtTime(0, audioCtx.currentTime, 0.05);
      noiseGain.gain.setTargetAtTime(0, audioCtx.currentTime, 0.05);
      lfoGain.gain.setTargetAtTime(0, audioCtx.currentTime, 0.05);
      return;
    }
    let nearest = stations[0];
    for (const st of stations) if (Math.abs(st.freq - val) < Math.abs(nearest.freq - val)) nearest = st;
    if (Math.abs(nearest.freq - val) < 0.2) {
      if (radioAudio.src !== nearest.url) {
        const wasPlaying = !radioAudio.paused;
        radioAudio.src = nearest.url;
        if (wasPlaying) radioAudio.play().catch(err => console.error('radio play', err));
      } else if (isRadioPlaying && radioAudio.paused) {
        radioAudio.play().catch(err => console.error('radio play', err));
      }
      const vol = volumeSlider ? parseFloat(volumeSlider.value) : window.radioGainNode._originalGainBeforeMute;
      window.radioGainNode.gain.setTargetAtTime(vol, audioCtx.currentTime, 0.05);
      noiseGain.gain.setTargetAtTime(0, audioCtx.currentTime, 0.05);
      lfoGain.gain.setTargetAtTime(0, audioCtx.currentTime, 0.05);
    } else {
      window.radioGainNode.gain.setTargetAtTime(0, audioCtx.currentTime, 0.05);
      noiseGain.gain.setTargetAtTime(0.25, audioCtx.currentTime, 0.05);
      lfoGain.gain.setTargetAtTime(0.25, audioCtx.currentTime, 0.05);
    }
  }

  playBtn.addEventListener('click', () => {
    if (isRadioPlaying) {
      radioAudio.pause();
    } else {
      radioAudio.play().catch(err => console.error('radio play', err));
    }
    isRadioPlaying = !isRadioPlaying;
    playBtn.textContent = isRadioPlaying ? 'Stop Radio' : 'Play Radio';
    updateTuning();
  });


  const stations = [
    {freq: 0, url: 'https://icecast.omroep.nl/radio1-bb-mp3'},
    {freq: 1, url: 'https://icecast.omroep.nl/radio2-bb-mp3'},
    {freq: 2, url: 'https://icecast.omroep.nl/3fm-bb-mp3'},
    {freq: 3, url: 'https://ice2.somafm.com/groovesalad-128-mp3'},
    {freq: 4, url: 'https://ice2.somafm.com/lush-128-mp3'},
    {freq: 5, url: 'https://ice2.somafm.com/dronezone-128-mp3'},
    {freq: 6, url: 'https://ice2.somafm.com/secretagent-128-mp3'}
  ];

  const noiseBuffer = audioCtx.createBuffer(1, audioCtx.sampleRate * 2, audioCtx.sampleRate);
  const noiseData = noiseBuffer.getChannelData(0);
  for (let i = 0; i < noiseData.length; i++) noiseData[i] = Math.random() * 2 - 1;
  const noiseSource = audioCtx.createBufferSource();
  noiseSource.buffer = noiseBuffer;
  noiseSource.loop = true;
  const noiseFilter = audioCtx.createBiquadFilter();
  noiseFilter.type = 'bandpass';
  noiseFilter.frequency.value = 4000;
  noiseFilter.Q.value = 0.5;
  const noiseGain = audioCtx.createGain();
  noiseGain.gain.value = 0;
  const lfo = audioCtx.createOscillator();
  const lfoGain = audioCtx.createGain();
  lfo.frequency.value = 0.7;
  // Start with no modulation to avoid static on page load
  lfoGain.gain.value = 0;
  lfo.connect(lfoGain).connect(noiseGain.gain);
  lfo.start();
  noiseSource.connect(noiseFilter).connect(noiseGain).connect(audioCtx.destination);
  noiseSource.start();

  stationSlider.addEventListener('input', updateTuning);


  function getStepDuration() {
    if (typeof isGlobalSyncEnabled !== 'undefined' && isGlobalSyncEnabled && typeof globalBPM === 'number') {
      return 60 / globalBPM / 4;
    }
    const bpmInput = document.getElementById('app-menu-bpm-input');
    const bpm = parseFloat(bpmInput ? bpmInput.value : 120);
    return 60 / bpm / 4; // 16th note
  }

  function startSequencer() {
    if (stepTimeout) clearTimeout(stepTimeout);
    const startTime = (typeof getNextQuantizedTime === 'function' && typeof isGlobalSyncEnabled !== 'undefined' && isGlobalSyncEnabled)
      ? getNextQuantizedTime(audioCtx.currentTime, 0.25)
      : audioCtx.currentTime;
    const startDelay = Math.max(0, startTime - audioCtx.currentTime);
    const scheduleStep = () => {
      const dur = getStepDuration();
      stepEls.forEach((el, i) => el.classList.toggle('active', i === currentStep));
      if (isMetronomeOn) playClick(currentStep % 4 === 0);
      sequenceSteps[currentStep].forEach(idx => playPad(idx));
      currentStep = (currentStep + 1) % 16;
      stepTimeout = setTimeout(scheduleStep, dur * 1000);
    };
    stepTimeout = setTimeout(scheduleStep, startDelay * 1000);
  }

  function stopSequencer() {
    if (stepTimeout) clearTimeout(stepTimeout);
    stepTimeout = null;
    stepEls.forEach(el => el.classList.remove('active'));
  }

  seqRecordBtn.addEventListener('click', () => {
    isSequenceRecording = !isSequenceRecording;
    seqRecordBtn.classList.toggle('active', isSequenceRecording);
    seqRecordBtn.textContent = isSequenceRecording ? 'Stop Sequence' : 'Record Sequence';
    if (isSequenceRecording) {
      sequenceSteps.forEach((_,i) => sequenceSteps[i] = []);
      currentStep = 0;
      startSequencer();
    }
  });

  if (fxRecordBtn) {
    fxRecordBtn.addEventListener('click', () => {
      if (isFxRecording) {
        fxAutomation.push({t: audioCtx.currentTime - fxRecordStart, x: fxX, y: fxY});
        isFxRecording = false;
        fxRecordBtn.classList.remove('active');
        fxRecordBtn.textContent = 'Record FX';
        fxDeleteBtn.disabled = fxAutomation.length === 0;
        startFxLoop();
      } else {
        stopFxLoop();
        fxAutomation = [{t:0,x:fxX,y:fxY}];
        fxRecordStart = audioCtx.currentTime;
        isFxRecording = true;
        fxRecordBtn.classList.add('active');
        fxRecordBtn.textContent = 'Stop FX';
        fxDeleteBtn.disabled = true;
      }
    });
  }

  if (fxDeleteBtn) {
    fxDeleteBtn.addEventListener('click', () => {
      stopFxLoop();
      fxAutomation = [];
      fxDeleteBtn.disabled = true;
    });
  }

  function drawPadWaveform(idx) {
    const canvas = pads[idx].querySelector('canvas');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const buf = buffers[idx];
    if (!buf) return;
    const data = buf.getChannelData(0);
    const step = Math.max(1, Math.floor(data.length / canvas.width));
    ctx.beginPath();
    for (let i = 0; i < canvas.width; i++) {
      const sample = data[i * step];
      const y = canvas.height / 2 - sample * canvas.height / 2;
      ctx.lineTo(i, y);
    }
    ctx.strokeStyle = '#88f';
    ctx.stroke();
  }

  function createReversedBuffer(buf) {
    const rev = audioCtx.createBuffer(buf.numberOfChannels, buf.length, buf.sampleRate);
    for (let ch = 0; ch < buf.numberOfChannels; ch++) {
      const src = buf.getChannelData(ch);
      const dest = rev.getChannelData(ch);
      for (let i = 0, j = src.length - 1; i < src.length; i++, j--) {
        dest[i] = src[j];
      }
    }
    return rev;
  }

  function drawEditor() {
    waveformCtx.clearRect(0, 0, waveformCanvas.width, waveformCanvas.height);
    const buf = buffers[selectedPad];
    if (!buf) return;
    const data = buf.getChannelData(0);
    const step = Math.max(1, Math.floor(data.length / waveformCanvas.width));
    waveformCtx.beginPath();
    for (let i = 0; i < waveformCanvas.width; i++) {
      const sample = data[i * step];
      const y = waveformCanvas.height / 2 - sample * waveformCanvas.height / 2;
      waveformCtx.lineTo(i, y);
    }
    waveformCtx.strokeStyle = '#88f';
    waveformCtx.stroke();
    const start = parseFloat(startInput.value) || 0;
    const end = parseFloat(endInput.value) || buf.duration;
    const startX = (start / buf.duration) * waveformCanvas.width;
    const endX = (end / buf.duration) * waveformCanvas.width;
    waveformCtx.fillStyle = 'rgba(200,200,255,0.3)';
    waveformCtx.fillRect(startX, 0, endX - startX, waveformCanvas.height);
    waveformCtx.fillStyle = '#f66';
    waveformCtx.fillRect(startX - 1, 0, 2, waveformCanvas.height);
    waveformCtx.fillRect(endX - 1, 0, 2, waveformCanvas.height);
  }

  function playPad(idx) {
    if (!buffers[idx]) return;
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const start = padStart[idx] || 0;
    const end = padEnd[idx] || buffers[idx].duration;
    if (activeSources[idx]) {
      try { activeSources[idx].stop(); } catch (e) {}
      activeSources[idx] = null;
    }
    if (window.radioGainNode && window.radioGainNode.gain.value === 0) {
      const vol = parseFloat(volumeSlider ? volumeSlider.value : 1);
      window.radioGainNode.gain.setTargetAtTime(vol, audioCtx.currentTime, 0.01);
    }
    const src = audioCtx.createBufferSource();
    const buf = padReverse[idx] ? reversedBuffers[idx] || buffers[idx] : buffers[idx];
    src.buffer = buf;
    const rate = pitchRate * (padPitch[idx] || 1);
    src.playbackRate.setValueAtTime(rate, audioCtx.currentTime);
    const gain = audioCtx.createGain();
    gain.gain.value = padGain[idx] || 1;
    src.connect(gain).connect(fxInput);
    src.onended = () => {
      if (activeSources[idx] === src) activeSources[idx] = null;
    };
    if (padReverse[idx]) {
      const dur = Math.max(0, end - start);
      const offset = buf.duration - end;
      src.start(0, offset, dur);
    } else {
      src.start(0, start, Math.max(0, end - start));
    }
    activeSources[idx] = src;
    pads[idx].classList.add('playing');
    setTimeout(() => pads[idx].classList.remove('playing'), Math.max(100, (end - start) * 1000));
  }

  function playClick(accent) {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.frequency.value = accent ? 1600 : 800;
    gain.gain.value = 0.3;
    osc.connect(gain).connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.05);
  }

  function startPadRecording(idx, btn) {
    if (mediaRecorder && mediaRecorder.state === 'recording') {
      if (recordingPad === idx) {
        mediaRecorder.stop();
        return;
      }
      mediaRecorder.stop();
    }
    const stream = dest.stream;
    mediaRecorder = new MediaRecorder(stream);
    const chunks = [];
    recordingPad = idx;
    mediaRecorder.ondataavailable = e => chunks.push(e.data);
    mediaRecorder.onstop = async () => {
      if (recordingTimeout) {
        clearTimeout(recordingTimeout);
        recordingTimeout = null;
      }
      const blob = new Blob(chunks, { type: 'audio/webm' });
      recordings[idx] = blob;
      const arr = await blob.arrayBuffer();
      buffers[idx] = await audioCtx.decodeAudioData(arr);
      reversedBuffers[idx] = createReversedBuffer(buffers[idx]);
      padStart[idx] = 0;
      padEnd[idx] = buffers[idx].duration;
      startInput.value = padStart[idx].toFixed(2);
      endInput.value = padEnd[idx].toFixed(2);
      drawPadWaveform(idx);
      drawEditor();
      if (btn) btn.classList.remove('recording');
      recordingPad = null;
    };
    mediaRecorder.start();
    if (btn) btn.classList.add('recording');
    recordingTimeout = setTimeout(() => {
      if (mediaRecorder && mediaRecorder.state === 'recording') {
        mediaRecorder.stop();
      }
    }, 5000);
  }

  pads.forEach((pad, idx) => {
    const recBtn = pad.querySelector('.pad-rec-btn');
    const stepToggle = pad.querySelector('.pad-step-toggle');
    const handleActivate = async () => {
      selectedPad = idx;
      startInput.value = padStart[idx].toFixed(2);
      endInput.value = padEnd[idx].toFixed(2);
      if (pitchSliderPad) pitchSliderPad.value = padPitch[idx].toString();
      if (volumeSliderPad) volumeSliderPad.value = padGain[idx].toString();
      if (reverseToggle) reverseToggle.checked = padReverse[idx];
      if (editorDiv) editorDiv.classList.remove('hidden');
      playPad(idx);
      drawEditor();
      updateStepGrid();
      updatePadStepIndicators();
    };
    pad.addEventListener('pointerdown', handleActivate);
    if (recBtn) {
      recBtn.addEventListener('click', e => {
        e.stopPropagation();
        startPadRecording(idx, recBtn);
      });
    }
    if (stepToggle) {
      stepToggle.addEventListener('click', e => {
        e.stopPropagation();
        if (selectedStep === null) return;
        const arr = sequenceSteps[selectedStep];
        const pos = arr.indexOf(idx);
        if (pos === -1) arr.push(idx); else arr.splice(pos, 1);
        updateStepGrid();
        updatePadStepIndicators();
      });
    }
  });

  startInput.addEventListener('input', () => {
    padStart[selectedPad] = parseFloat(startInput.value) || 0;
    drawEditor();
  });
  endInput.addEventListener('input', () => {
    padEnd[selectedPad] = parseFloat(endInput.value) || (buffers[selectedPad] ? buffers[selectedPad].duration : 0);
    drawEditor();
  });

  if (pitchSliderPad) {
    pitchSliderPad.addEventListener('input', () => {
      padPitch[selectedPad] = parseFloat(pitchSliderPad.value) || 1;
    });
  }
  if (volumeSliderPad) {
    volumeSliderPad.addEventListener('input', () => {
      padGain[selectedPad] = parseFloat(volumeSliderPad.value) || 1;
    });
  }
  if (reverseToggle) {
    reverseToggle.addEventListener('change', () => {
      padReverse[selectedPad] = reverseToggle.checked;
    });
  }

  waveformCanvas.addEventListener('pointerdown', e => {
    if (!buffers[selectedPad]) return;
    const rect = waveformCanvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const buf = buffers[selectedPad];
    const startX = (padStart[selectedPad] / buf.duration) * waveformCanvas.width;
    const endX = (padEnd[selectedPad] / buf.duration) * waveformCanvas.width;
    if (Math.abs(x - startX) < 10) {
      draggingStart = true;
    } else if (Math.abs(x - endX) < 10) {
      draggingEnd = true;
    } else {
      if (Math.abs(x - startX) < Math.abs(x - endX)) {
        draggingStart = true;
        padStart[selectedPad] = Math.min(Math.max(0, (x / waveformCanvas.width) * buf.duration), padEnd[selectedPad]);
        startInput.value = padStart[selectedPad].toFixed(2);
      } else {
        draggingEnd = true;
        padEnd[selectedPad] = Math.max(Math.min(buf.duration, (x / waveformCanvas.width) * buf.duration), padStart[selectedPad]);
        endInput.value = padEnd[selectedPad].toFixed(2);
      }
      drawEditor();
    }
    waveformCanvas.setPointerCapture(e.pointerId);
  });

  waveformCanvas.addEventListener('pointerup', e => {
    waveformCanvas.releasePointerCapture(e.pointerId);
  });

  waveformCanvas.addEventListener('pointermove', e => {
    if (!draggingStart && !draggingEnd) return;
    const rect = waveformCanvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const buf = buffers[selectedPad];
    const time = (x / waveformCanvas.width) * buf.duration;
    if (draggingStart) {
      padStart[selectedPad] = Math.min(Math.max(0, time), padEnd[selectedPad]);
      startInput.value = padStart[selectedPad].toFixed(2);
    } else if (draggingEnd) {
      padEnd[selectedPad] = Math.max(Math.min(buf.duration, time), padStart[selectedPad]);
      endInput.value = padEnd[selectedPad].toFixed(2);
    }
    drawEditor();
  });

  window.addEventListener('pointerup', () => {
    draggingStart = false;
    draggingEnd = false;
  });

  window.radioSamplerInfo = {
    get gainNode() { return window.radioGainNode; },
    get analyserNode() { return window.radioAnalyserNode; },
    get soloState() { return window.radioSoloState; },
    set soloState(v) { window.radioSoloState = v; },
    get muteState() { return window.radioMuteState; },
    set muteState(v) { window.radioMuteState = v; },
    get isPlaying() { return isRadioPlaying; },
    get hasRecording() { return buffers.some(b => b); }
  };
  window.radioSamplerPlayPad = playPad;
  updatePadStepIndicators();
  updateStepGrid();
  updateTuning();
  applyFx();
  drawFxPad();
  if (pitchSliderPad) pitchSliderPad.value = padPitch[selectedPad].toString();
  if (volumeSliderPad) volumeSliderPad.value = padGain[selectedPad].toString();
  if (reverseToggle) reverseToggle.checked = padReverse[selectedPad];
  startSequencer();
});
