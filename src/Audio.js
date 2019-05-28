import Tone from 'tone';

window.onmousedown = () => {
    if (Tone.context.state !== 'running') {
        console.log('resume');
        Tone.context.resume();
    }
}

const synth = new Tone.Synth().toMaster();

export default {
    synth,
    beep: (value) => {
        const notes = ['C2', 'D2', 'E2', 'F2', 'G2', 'A2', 'B2', 'C3', 'D3', 'E3', 'F3', 'G3', 'A3', 'B3', 'C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4']//, 'C5', 'D5', 'E5', 'F5', 'G5', 'A5', 'B5'];
        const note = notes[Math.floor(value / 100.0 * notes.length)];

        synth.triggerAttackRelease(note, '4n');
    }
}