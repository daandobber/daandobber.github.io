# resonautweb

The application now features a **Parallax Starfield** background by default.
This animated wallpaper reacts to incoming audio, changing colour and motion
depending on the dominant frequencies. Louder peaks briefly create extra
connections that glow and then fade away. The colours adapt to the active musical
scale so the visuals match the selected theme.

Louder sections of music cause extra nodes to sprout near existing ones, giving
the network a bacterial growth vibe. Its hues also blend with the orb colours
for a more unified look.

## Radio Sampler

Use the **Radio** button in the top menu bar to open the sampler panel. Tune stations with the slider — you will hear static that gently fades in and out when not locked onto a channel, and it falls silent when the radio stops or locks to a stream. Each pad in the 3×3 grid has its own **Rec** button underneath for capturing a snippet directly from the radio. The dot next to it shows whether the pad will trigger on the currently selected step and can be clicked to toggle that step. Trim recordings with the waveform editor.

Program patterns by clicking the 16-step bar below the pads. Each step toggles the selected pad on or off for that position. The sequence loops automatically and a highlight shows the current playhead. You can still record pads live with **Record Sequence** if you want. A metronome toggle in the menu bar plays a short click on every beat.

Several built‑in streams are available including Dutch public radio and a few SomaFM channels such as Groove Salad, Lush, Drone Zone and Secret Agent.

Pads now respond immediately using WebAudio buffers and light up while they play. Drag the start and end markers directly on the waveform to quickly set loop points.
FX pad movements can be recorded from the Effects tab and will loop automatically over 16 steps. Use Delete FX to clear a recording.

## Timeline

Open the timeline from the menu bar to arrange audio clips on multiple tracks. Click **Add Track** to create a new one. Segments can be dragged and trimmed. Press the **Delete** key or use the ✖ button on a segment to remove it. Tracks include a ✖ button in the header to delete the entire track.

## SpaceRadar

Use the **Space Radar** button in the toolbar to add a circular radar. It behaves like a radial timeline grid: a sweep line starts at the top (12 o'clock) and rotates clockwise, triggering any orb it crosses. Internal divisions can be displayed to help line up orbs on the radar.
Each SpaceRadar can sync its rotation to the global tempo or run at a custom speed. You can also change its radius, number of divisions and whether nodes snap to those lines when dragging.
Radars support three motion modes: **Normal** (always clockwise), **Reverse Sweep** (switches direction after each revolution) and **Pendulum** (slows down like a Newton's cradle until restarting).
