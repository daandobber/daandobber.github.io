// Minimal timeline functionality for arranging and recording clips
const PIXELS_PER_SECOND = 100;

let timelineTracksData = [];
let trackIdCounter = 0;
let activeResize = null;
let activeDrag = null;
let selectedSegment = null;
let copiedSegment = null;
let playheadEl;
let playheadAnimating = false;
let playheadStartTime = 0;
let playheadDuration = 0;
let playingSources = [];
let loopSelection = null;
let loopTimeout = null;
let loopActive = false;
let selectingLoop = false;
let loopStartX = 0;
let loopRegionEl;
let loopBarEl;
let scrollContainer;
let playheadOffsetPx = 0;

// live recording helpers
const MAX_RECORD_SECONDS = 60;

function updateTrackVolumes() {
  const anySolo = timelineTracksData.some((t) => t.solo);
  timelineTracksData.forEach((t) => {
    if (!t.gainNode) return;
    let vol = t.volume;
    if (t.muted) vol = 0;
    if (anySolo && !t.solo) vol = 0;
    t.gainNode.gain.value = vol;
    if (t.panNode) t.panNode.pan.value = t.pan;
  });
}

function getGroupName(group) {
  return group.userDefined
    ? `User ${group.id.replace('userGroup_', '')}`
    : `Const. ${group.id.replace('autoGroup_', '')}`;
}

function populateSourceOptions(selectEl) {
  if (!selectEl) return;
  selectEl.innerHTML = '';
  const masterOpt = document.createElement('option');
  masterOpt.value = 'master';
  masterOpt.textContent = 'Master (All)';
  selectEl.appendChild(masterOpt);

  const micOpt = document.createElement('option');
  micOpt.value = 'mic';
  micOpt.textContent = 'Microphone';
  selectEl.appendChild(micOpt);

  if (typeof identifiedGroups !== 'undefined' && Array.isArray(identifiedGroups)) {
    identifiedGroups.forEach((g) => {
      if (!g.gainNode) return;
      const opt = document.createElement('option');
      opt.value = g.id;
      opt.textContent = getGroupName(g);
      selectEl.appendChild(opt);
    });
  }
}

function refreshAllTrackSources() {
  document.querySelectorAll('.track-source-select').forEach((sel) => {
    const current = sel.value;
    populateSourceOptions(sel);
    if (Array.from(sel.options).some((o) => o.value === current)) {
      sel.value = current;
    }
  });
}

function drawTimelineWaveform(canvas, audioBuffer) {
  const { width, height } = canvas;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#222';
  ctx.fillRect(0, 0, width, height);
  ctx.strokeStyle = '#0af';
  ctx.lineWidth = 1;
  ctx.beginPath();
  const data = audioBuffer.getChannelData(0);
  const step = Math.max(1, Math.floor(data.length / width));
  const amp = height / 2;
  for (let i = 0; i < width; i++) {
    let min = 1.0;
    let max = -1.0;
    for (let j = 0; j < step; j++) {
      const v = data[i * step + j] || 0;
      if (v < min) min = v;
      if (v > max) max = v;
    }
    ctx.moveTo(i, (1 - max) * amp);
    ctx.lineTo(i, (1 - min) * amp);
  }
  ctx.stroke();
}

function createRecordingSegment() {
  const segmentEl = document.createElement('div');
  segmentEl.className = 'timeline-segment recording';
  segmentEl.style.width = '0px';
  segmentEl.style.left = '0px';

  const canvas = document.createElement('canvas');
  canvas.width = MAX_RECORD_SECONDS * PIXELS_PER_SECOND;
  canvas.height = 60;
  canvas.className = 'waveform-canvas';
  canvas.style.width = canvas.width + 'px';
  canvas.style.height = canvas.height + 'px';
  segmentEl.appendChild(canvas);

  return {
    buffer: null,
    start: 0,
    trimStart: 0,
    trimEnd: 0,
    el: segmentEl,
    canvas,
    track: null,
    recording: true,
    drawX: 0,
  };
}

function startRecordingVisualizer(track) {
  if (!track.analyser || !track.recordingSegment) return;
  const canvas = track.recordingSegment.canvas;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#222';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  const data = new Uint8Array(track.analyser.fftSize);
  const mid = canvas.height / 2;

  const draw = () => {
    if (!track.recorder || track.recorder.state !== 'recording') return;
    const elapsed = (audioContext ? audioContext.currentTime : 0) - track.recordingStartTime;
    const x = Math.floor(elapsed * PIXELS_PER_SECOND);
    while (track.recordingSegment.drawX <= x && track.recordingSegment.drawX < canvas.width) {
      track.analyser.getByteTimeDomainData(data);
      let min = 255, max = 0;
      for (let i = 0; i < data.length; i++) {
        const v = data[i];
        if (v < min) min = v;
        if (v > max) max = v;
      }
      const yMax = mid - ((max - 128) / 128) * mid;
      const yMin = mid - ((min - 128) / 128) * mid;
      ctx.strokeStyle = '#0af';
      ctx.beginPath();
      ctx.moveTo(track.recordingSegment.drawX, yMin);
      ctx.lineTo(track.recordingSegment.drawX, yMax);
      ctx.stroke();
      track.recordingSegment.drawX++;
    }
    const widthPx = Math.min(x, canvas.width);
    track.recordingSegment.el.style.width = widthPx + 'px';
    track.recordingAnimationId = requestAnimationFrame(draw);
  };
  track.recordingAnimationId = requestAnimationFrame(draw);
}

function stopRecordingVisualizer(track) {
  if (track.recordingAnimationId) {
    cancelAnimationFrame(track.recordingAnimationId);
    track.recordingAnimationId = null;
  }
  if (track.analyser && track.analyserSource) {
    try { track.analyserSource.disconnect(track.analyser); } catch (e) {}
  }
  track.analyser = null;
  track.analyserSource = null;
}

function selectSegment(seg) {
  document.querySelectorAll('.timeline-segment.selected').forEach((el) =>
    el.classList.remove('selected')
  );
  if (seg && seg.el) {
    seg.el.classList.add('selected');
    selectedSegment = seg;
  } else {
    selectedSegment = null;
  }
}

function updateLoopRegion() {
  if (!loopRegionEl) return;
  if (!loopSelection) {
    loopRegionEl.classList.add('hidden');
    return;
  }
  const startPx = loopSelection.start * PIXELS_PER_SECOND;
  const widthPx = (loopSelection.end - loopSelection.start) * PIXELS_PER_SECOND;
  loopRegionEl.style.left = startPx + 'px';
  loopRegionEl.style.width = widthPx + 'px';
  loopRegionEl.classList.toggle('hidden', widthPx <= 0);
}

function populateTimeGrid(bodyEl) {
  const grid = document.createElement('div');
  grid.className = 'time-grid';
  const maxSeconds = 60;
  for (let i = 0; i <= maxSeconds; i++) {
    const line = document.createElement('div');
    line.className = 'time-grid-line';
    line.style.left = `${i * PIXELS_PER_SECOND}px`;
    grid.appendChild(line);
  }
  bodyEl.appendChild(grid);
  bodyEl.style.width = `${maxSeconds * PIXELS_PER_SECOND}px`;
}

function toggleTimeline(show) {
  const timelineView = document.getElementById('timelineView');
  const mainCanvas = document.getElementById('mainCanvas');
  const toolbar = document.getElementById('toolbar');
  if (!timelineView) return;
  if (show === undefined) show = timelineView.classList.contains('hidden');
  if (show) {
    timelineView.classList.remove('hidden');
    if (mainCanvas) mainCanvas.style.display = 'none';
    if (toolbar) toolbar.style.display = 'none';
    refreshAllTrackSources();
  } else {
    timelineView.classList.add('hidden');
    if (mainCanvas) mainCanvas.style.display = '';
    if (toolbar) toolbar.style.display = '';
    stopTimeline();
  }
}

function createTrack() {
  const tracksContainer = document.getElementById('timelineTracks');
  if (!tracksContainer) return;
  const trackEl = document.createElement('div');
  trackEl.className = 'timeline-track';
  trackEl.dataset.trackId = trackIdCounter;
  trackEl.innerHTML = `
    <div class="track-header">
      <span class="track-label">Track ${trackIdCounter + 1}</span>
      <select class="track-source-select"></select>
      <button class="track-rec-btn">Rec</button>
      <button class="track-stop-btn" disabled>Stop</button>
      <button class="track-mute-btn">M</button>
      <button class="track-solo-btn">S</button>
      <label class="slider-wrapper"><span>Vol</span><input type="range" class="track-volume" min="0" max="1" step="0.01" value="1" title="Volume"></label>
      <label class="slider-wrapper"><span>Pan</span><input type="range" class="track-pan" min="-1" max="1" step="0.01" value="0" title="Pan"></label>
      <button class="track-del-btn" title="Delete Track">✖</button>
    </div>
    <div class="track-body"></div>
  `;
  tracksContainer.appendChild(trackEl);
  const gainNode = audioContext ? audioContext.createGain() : null;
  const panNode = audioContext ? audioContext.createStereoPanner() : null;
  if (gainNode && panNode && masterGain) {
    gainNode.connect(panNode);
    panNode.connect(masterGain);
  }
  const trackData = {
    el: trackEl,
    segments: [],
    recorder: null,
    chunks: [],
    source: 'master',
    tapNode: null,
    tapSourceNode: null,
    gainNode,
    panNode,
    volume: 1,
    pan: 0,
    muted: false,
    solo: false,
  };
  timelineTracksData.push(trackData);
  const recBtn = trackEl.querySelector('.track-rec-btn');
  const stopBtn = trackEl.querySelector('.track-stop-btn');
  const muteBtn = trackEl.querySelector('.track-mute-btn');
  const soloBtn = trackEl.querySelector('.track-solo-btn');
  const delBtn = trackEl.querySelector('.track-del-btn');
  const volInput = trackEl.querySelector('.track-volume');
  const panInput = trackEl.querySelector('.track-pan');
  const sourceSelect = trackEl.querySelector('.track-source-select');
  const bodyEl = trackEl.querySelector('.track-body');
  if (bodyEl) populateTimeGrid(bodyEl);
  if (sourceSelect) {
    populateSourceOptions(sourceSelect);
    trackData.source = sourceSelect.value;
    sourceSelect.addEventListener('change', () => {
      trackData.source = sourceSelect.value;
    });
  }
  recBtn.addEventListener('click', () => startTrackRecording(trackData));
  stopBtn.addEventListener('click', () => stopTrackRecording(trackData));
  muteBtn.addEventListener('click', () => {
    trackData.muted = !trackData.muted;
    muteBtn.classList.toggle('active', trackData.muted);
    updateTrackVolumes();
  });
  soloBtn.addEventListener('click', () => {
    trackData.solo = !trackData.solo;
    soloBtn.classList.toggle('active', trackData.solo);
    updateTrackVolumes();
  });
  if (delBtn) {
    delBtn.addEventListener('click', () => deleteTrack(trackData));
  }
  if (volInput) {
    volInput.addEventListener('input', () => {
      trackData.volume = parseFloat(volInput.value);
      updateTrackVolumes();
    });
  }
  if (panInput && panNode) {
    panInput.addEventListener('input', () => {
      trackData.pan = parseFloat(panInput.value);
      if (panNode) panNode.pan.value = trackData.pan;
    });
  }
  if (bodyEl) {
    // no-op placeholder to allow segment dragging using custom handlers
  }
  trackIdCounter++;
  updateTrackVolumes();
}

function deleteTrack(track) {
  stopTrackRecording(track);
  track.segments.forEach((seg) => {
    if (seg.el && seg.el.parentNode) seg.el.parentNode.removeChild(seg.el);
  });
  track.segments = [];
  const idx = timelineTracksData.indexOf(track);
  if (idx !== -1) timelineTracksData.splice(idx, 1);
  if (track.el && track.el.parentNode) track.el.parentNode.removeChild(track.el);
  updateTrackVolumes();
}

function startTrackRecording(track) {
  const recBtn = track.el.querySelector('.track-rec-btn');
  const stopBtn = track.el.querySelector('.track-stop-btn');

  // prepare recording segment and analyser
  const bodyEl = track.el.querySelector('.track-body');
  if (track.recordingSegment) {
    bodyEl.removeChild(track.recordingSegment.el);
    track.recordingSegment = null;
  }
  const recSeg = createRecordingSegment();
  recSeg.track = track;
  track.recordingSegment = recSeg;
  if (bodyEl) bodyEl.appendChild(recSeg.el);
  if (recBtn) recBtn.classList.add('recording');

  track.analyser = audioContext ? audioContext.createAnalyser() : null;
  track.analyserSource = null;
  track.recordingStartTime = audioContext ? audioContext.currentTime : 0;

  const setupAnalyserForStream = (stream) => {
    if (!audioContext || !track.analyser) return;
    try {
      const src = audioContext.createMediaStreamSource(stream);
      src.connect(track.analyser);
      track.analyserSource = src;
    } catch (e) {}
    startRecordingVisualizer(track);
  };

  const startRecorder = (stream) => {
    const options = { mimeType: 'audio/webm' };
    const recorder = new MediaRecorder(stream, options);
    track.recorder = recorder;
    track.chunks = [];
    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) track.chunks.push(e.data);
    };
    recorder.onstop = () => {
      stopRecordingVisualizer(track);
      const blob = new Blob(track.chunks, { type: recorder.mimeType });
      decodeSegment(blob).then((segment) => {
        segment.track = track;
        if (track.recordingSegment && track.recordingSegment.el.parentNode) {
          track.recordingSegment.el.parentNode.removeChild(track.recordingSegment.el);
        }
        track.recordingSegment = null;
        track.segments.push(segment);
        track.el.querySelector('.track-body').appendChild(segment.el);
        selectSegment(segment);
      });
      if (recBtn) {
        recBtn.disabled = false;
        recBtn.classList.remove('recording');
      }
      if (stopBtn) stopBtn.disabled = true;
      if (track.tapNode && track.tapSourceNode) {
        try { track.tapSourceNode.disconnect(track.tapNode); } catch (e) {}
        track.tapNode = null;
        track.tapSourceNode = null;
      }
    };
    recorder.start();
    if (recBtn) recBtn.disabled = true;
    if (stopBtn) stopBtn.disabled = false;
  };

  if (track.source === 'mic') {
    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      startRecorder(stream);
      setupAnalyserForStream(stream);
    });
  } else {
    if (!audioContext || !masterGain) {
      console.warn('Audio engine not ready for recording');
      return;
    }
    if (audioContext.state === 'suspended') {
      audioContext.resume().catch(() => {});
    }
    const tapNode = audioContext.createMediaStreamDestination();
    let sourceNode = masterGain;
    if (track.source !== 'master') {
      const g =
        typeof identifiedGroups !== 'undefined'
          ? identifiedGroups.find((gr) => gr.id === track.source)
          : null;
      if (g && g.gainNode) sourceNode = g.gainNode;
    }
    track.tapNode = tapNode;
    track.tapSourceNode = sourceNode;
    try {
      sourceNode.connect(tapNode);
      if (track.analyser) sourceNode.connect(track.analyser);
    } catch (e) {
      console.error('Tap connect failed', e);
    }
    startRecorder(tapNode.stream);
    startRecordingVisualizer(track);
  }
}

function stopTrackRecording(track) {
  if (track.recorder && track.recorder.state !== 'inactive') {
    track.recorder.stop();
  }
  if (track.tapNode && track.tapSourceNode) {
    try {
      track.tapSourceNode.disconnect(track.tapNode);
    } catch (e) {}
    track.tapNode = null;
    track.tapSourceNode = null;
  }
  stopRecordingVisualizer(track);
  if (track.recordingSegment) {
    track.recordingSegment.el.remove();
    track.recordingSegment = null;
  }
  const recBtn = track.el.querySelector('.track-rec-btn');
  const stopBtn = track.el.querySelector('.track-stop-btn');
  if (recBtn) {
    recBtn.disabled = false;
    recBtn.classList.remove('recording');
  }
  if (stopBtn) stopBtn.disabled = true;
}

function buildSegment(audioBuffer) {
  const segmentEl = document.createElement('div');
  segmentEl.className = 'timeline-segment';
  segmentEl.style.width = `${audioBuffer.duration * PIXELS_PER_SECOND}px`;
  segmentEl.style.left = '0px';
  segmentEl.dataset.origWidth = audioBuffer.duration * PIXELS_PER_SECOND;

  const canvas = document.createElement('canvas');
  canvas.width = audioBuffer.duration * PIXELS_PER_SECOND;
  canvas.height = 60;
  canvas.className = 'waveform-canvas';
  canvas.style.width = `${audioBuffer.duration * PIXELS_PER_SECOND}px`;
  segmentEl.appendChild(canvas);

  const leftHandle = document.createElement('div');
  leftHandle.className = 'segment-handle left';
  const rightHandle = document.createElement('div');
  rightHandle.className = 'segment-handle right';
  segmentEl.appendChild(leftHandle);
  segmentEl.appendChild(rightHandle);

  const delBtn = document.createElement('div');
  delBtn.className = 'segment-delete-btn';
  delBtn.textContent = '✖';
  segmentEl.appendChild(delBtn);

  drawTimelineWaveform(canvas, audioBuffer);

  const segmentData = {
    buffer: audioBuffer,
    start: 0,
    trimStart: 0,
    trimEnd: audioBuffer.duration,
    el: segmentEl,
    canvas,
    track: null,
  };

  segmentEl.addEventListener('mousedown', (e) => {
    if (e.target.closest('.segment-handle')) return;
    e.preventDefault();
    activeDrag = {
      segment: segmentData,
      offsetX: e.offsetX,
    };
    segmentEl.classList.add('dragging');
    selectSegment(segmentData);
    document.addEventListener('mousemove', onDocumentMouseMove);
    document.addEventListener('mouseup', onDocumentMouseUp);
  });

  segmentEl.addEventListener('click', () => selectSegment(segmentData));

  leftHandle.addEventListener('mousedown', (e) => {
    e.stopPropagation();
    activeResize = {
      segment: segmentData,
      handle: 'left',
      startX: e.clientX,
      origTrimStart: segmentData.trimStart,
      origLeft: parseFloat(segmentEl.style.left),
    };
  });
  rightHandle.addEventListener('mousedown', (e) => {
    e.stopPropagation();
    activeResize = {
      segment: segmentData,
      handle: 'right',
      startX: e.clientX,
      origTrimEnd: segmentData.trimEnd,
    };
  });

  delBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    deleteSegment(segmentData);
  });

  return segmentData;
}

function duplicateSegment(seg) {
  const newSeg = buildSegment(seg.buffer);
  newSeg.trimStart = seg.trimStart;
  newSeg.trimEnd = seg.trimEnd;
  newSeg.start = seg.start + 0.1;
  newSeg.el.style.left = newSeg.start * PIXELS_PER_SECOND + 'px';
  newSeg.el.style.width =
    (newSeg.trimEnd - newSeg.trimStart) * PIXELS_PER_SECOND + 'px';
  newSeg.canvas.style.left = -newSeg.trimStart * PIXELS_PER_SECOND + 'px';
  return newSeg;
}

function deleteSegment(seg) {
  if (seg.track) {
    seg.track.segments = seg.track.segments.filter((s) => s !== seg);
  }
  if (seg.el && seg.el.parentNode) seg.el.parentNode.removeChild(seg.el);
  if (selectedSegment === seg) selectSegment(null);
}

function onDocumentMouseMove(e) {
  if (!activeDrag) return;
  const seg = activeDrag.segment;
  const elements = document.elementsFromPoint(e.clientX, e.clientY);
  const bodyEl = elements.find((el) => el.classList && el.classList.contains('track-body'));
  const trackData = timelineTracksData.find((t) => t.el.querySelector('.track-body') === bodyEl);
  if (bodyEl && trackData) {
    if (seg.track && seg.track !== trackData) {
      seg.track.segments = seg.track.segments.filter((s) => s !== seg);
    }
    if (seg.track !== trackData) {
      trackData.segments.push(seg);
      bodyEl.appendChild(seg.el);
      seg.track = trackData;
    }
    const rect = bodyEl.getBoundingClientRect();
    let newLeft = e.clientX - rect.left - activeDrag.offsetX;
    if (newLeft < 0) newLeft = 0;
    seg.el.style.left = newLeft + 'px';
    seg.start = newLeft / PIXELS_PER_SECOND;
  }
}

function onDocumentMouseUp() {
  if (!activeDrag) return;
  activeDrag.segment.el.classList.remove('dragging');
  activeDrag = null;
  document.removeEventListener('mousemove', onDocumentMouseMove);
  document.removeEventListener('mouseup', onDocumentMouseUp);
}

function decodeSegment(blob) {
  return blob
    .arrayBuffer()
    .then((buf) => audioContext.decodeAudioData(buf))
    .then((audioBuffer) => buildSegment(audioBuffer));
}

function schedulePlayback(start, end) {
  if (!audioContext) return;
  stopTimeline();
  playingSources = [];
  const now = audioContext.currentTime;
  playheadDuration = end - start;
  timelineTracksData.forEach((track) => {
    track.segments.forEach((seg) => {
      const segStart = seg.start;
      const segEnd = seg.start + (seg.trimEnd - seg.trimStart);
      if (segEnd <= start || segStart >= end) return;
      const source = audioContext.createBufferSource();
      source.buffer = seg.buffer;
      if (track.gainNode) {
        source.connect(track.gainNode);
      } else {
        source.connect(masterGain);
      }
      const offset = Math.max(start - segStart, 0);
      const playStart = Math.max(segStart - start, 0);
      const duration = Math.min(segEnd, end) - Math.max(segStart, start);
      source.start(now + playStart, seg.trimStart + offset, duration);
      playingSources.push(source);
    });
  });
  if (playheadEl) {
    playheadEl.classList.remove('hidden');
    playheadEl.style.left = start * PIXELS_PER_SECOND + 'px';
    playheadStartTime = now;
    playheadOffsetPx = start * PIXELS_PER_SECOND;
    playheadAnimating = true;
    requestAnimationFrame(updatePlayhead);
  }
  const stopButton = document.getElementById('stopTimelineBtn');
  const playButton = document.getElementById('playTimelineBtn');
  if (stopButton) stopButton.disabled = false;
  if (playButton) playButton.disabled = true;
  if (loopActive && loopSelection) {
    loopTimeout = setTimeout(() => schedulePlayback(start, end), playheadDuration * 1000);
  }
}

function playTimeline() {
  const start = loopSelection ? loopSelection.start : 0;
  const end = loopSelection ? loopSelection.end : getTimelineLength();
  schedulePlayback(start, end);
}

function stopTimeline() {
  playingSources.forEach((s) => {
    try { s.stop(); } catch (e) {}
  });
  playingSources = [];
  if (loopTimeout) { clearTimeout(loopTimeout); loopTimeout = null; }
  playheadAnimating = false;
  playheadOffsetPx = 0;
  if (playheadEl) playheadEl.classList.add('hidden');
  const stopButton = document.getElementById('stopTimelineBtn');
  const playButton = document.getElementById('playTimelineBtn');
  if (stopButton) stopButton.disabled = true;
  if (playButton) playButton.disabled = false;
}

function getTimelineLength() {
  let len = 0;
  timelineTracksData.forEach((track) => {
    track.segments.forEach((seg) => {
      const end = seg.start + (seg.trimEnd - seg.trimStart);
      if (end > len) len = end;
    });
  });
  return len;
}

function snapToNearestBoundary(time) {
  let nearest = time;
  let minDist = Infinity;
  timelineTracksData.forEach((track) => {
    track.segments.forEach((seg) => {
      const boundaries = [seg.start, seg.start + (seg.trimEnd - seg.trimStart)];
      boundaries.forEach((b) => {
        const d = Math.abs(b - time);
        if (d < minDist) {
          minDist = d;
          nearest = b;
        }
      });
    });
  });
  return nearest;
}

function updatePlayhead() {
  if (!playheadAnimating || !playheadEl) return;
  const elapsed = audioContext.currentTime - playheadStartTime;
  playheadEl.style.left = `${playheadOffsetPx + elapsed * PIXELS_PER_SECOND}px`;
  if (elapsed >= playheadDuration) {
    playheadAnimating = false;
    playheadEl.classList.add('hidden');
    return;
  }
  requestAnimationFrame(updatePlayhead);
}

document.addEventListener('DOMContentLoaded', () => {
  const toggleBtn = document.getElementById('app-menu-toggle-timeline-btn');
  const closeBtn = document.getElementById('closeTimelineBtn');
  const addBtn = document.getElementById('addTrackBtn');
  const playBtn = document.getElementById('playTimelineBtn');
  const stopBtn = document.getElementById('stopTimelineBtn');
  loopRegionEl = document.getElementById('timelineLoopRegion');
  const loopToggle = document.getElementById('timelineLoopToggle');
  const tracksEl = document.getElementById('timelineTracks');
  loopBarEl = document.getElementById('timelineLoopBar');
  scrollContainer = document.getElementById('timelineScroll');
  playheadEl = document.getElementById('timelinePlayhead');
  if (toggleBtn) toggleBtn.addEventListener('click', () => toggleTimeline());
  if (closeBtn) closeBtn.addEventListener('click', () => toggleTimeline(false));
  if (addBtn) addBtn.addEventListener('click', createTrack);
  if (playBtn) playBtn.addEventListener('click', playTimeline);
  if (stopBtn) stopBtn.addEventListener('click', stopTimeline);
  if (loopToggle) loopToggle.addEventListener('change', () => {
    loopActive = loopToggle.checked;
  });
  window.addEventListener('groups-updated', refreshAllTrackSources);

  if (loopBarEl) {
    loopBarEl.addEventListener('mousedown', (e) => {
      selectingLoop = true;
      const rect = loopBarEl.getBoundingClientRect();
      const scrollLeft = scrollContainer ? scrollContainer.scrollLeft : 0;
      loopStartX = e.clientX - rect.left + scrollLeft;
      loopSelection = {
        start: loopStartX / PIXELS_PER_SECOND,
        end: loopStartX / PIXELS_PER_SECOND,
      };
      updateLoopRegion();
    });
  }

  document.addEventListener('mousemove', (e) => {
    if (selectingLoop) {
      const rect = loopBarEl.getBoundingClientRect();
      const scrollLeft = scrollContainer ? scrollContainer.scrollLeft : 0;
      const currentX = e.clientX - rect.left + scrollLeft;
      loopSelection.end = currentX / PIXELS_PER_SECOND;
      if (loopSelection.end < loopSelection.start) {
        const tmp = loopSelection.start;
        loopSelection.start = loopSelection.end;
        loopSelection.end = tmp;
      }
      updateLoopRegion();
    }
    if (!activeResize) return;
    const seg = activeResize.segment;
    const dx = e.clientX - activeResize.startX;
    if (activeResize.handle === 'left') {
      let newTrimStart = activeResize.origTrimStart + dx / PIXELS_PER_SECOND;
      if (newTrimStart < 0) newTrimStart = 0;
      if (newTrimStart > seg.trimEnd - 0.1) newTrimStart = seg.trimEnd - 0.1;
      seg.trimStart = newTrimStart;
      seg.el.style.left = activeResize.origLeft + (seg.trimStart - activeResize.origTrimStart) * PIXELS_PER_SECOND + 'px';
      seg.el.style.width = (seg.trimEnd - seg.trimStart) * PIXELS_PER_SECOND + 'px';
      seg.canvas.style.left = -seg.trimStart * PIXELS_PER_SECOND + 'px';
      seg.start = parseFloat(seg.el.style.left) / PIXELS_PER_SECOND;
    } else if (activeResize.handle === 'right') {
      let newTrimEnd = activeResize.origTrimEnd + dx / PIXELS_PER_SECOND;
      if (newTrimEnd > seg.buffer.duration) newTrimEnd = seg.buffer.duration;
      if (newTrimEnd < seg.trimStart + 0.1) newTrimEnd = seg.trimStart + 0.1;
      seg.trimEnd = newTrimEnd;
      seg.el.style.width = (seg.trimEnd - seg.trimStart) * PIXELS_PER_SECOND + 'px';
    }
  });

  document.addEventListener('mouseup', () => {
    if (selectingLoop) {
      selectingLoop = false;
      if (Math.abs(loopSelection.end - loopSelection.start) < 0.01) {
        loopSelection = null;
      } else {
        loopSelection.start = snapToNearestBoundary(loopSelection.start);
        loopSelection.end = snapToNearestBoundary(loopSelection.end);
        if (loopSelection.end < loopSelection.start) {
          const t = loopSelection.start;
          loopSelection.start = loopSelection.end;
          loopSelection.end = t;
        }
      }
      updateLoopRegion();
    }
    activeResize = null;
  });

  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.code === 'KeyC') {
      if (selectedSegment) {
        copiedSegment = selectedSegment;
      }
      e.preventDefault();
    } else if ((e.ctrlKey || e.metaKey) && e.code === 'KeyV') {
      if (copiedSegment) {
        const dup = duplicateSegment(copiedSegment);
        const track = (selectedSegment && selectedSegment.track) || copiedSegment.track || timelineTracksData[0];
        dup.track = track;
        track.segments.push(dup);
        track.el.querySelector('.track-body').appendChild(dup.el);
        selectSegment(dup);
      }
      e.preventDefault();
    } else if (e.code === 'Delete' || e.code === 'Backspace') {
      if (selectedSegment) {
        deleteSegment(selectedSegment);
      }
      e.preventDefault();
    }
  });
});
