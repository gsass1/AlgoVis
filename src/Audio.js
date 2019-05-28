import Tone from 'tone';

window.onmousedown = () => {
    if (Tone.context.state !== 'running') {
        console.log('resume');
        Tone.context.resume();
    }
}

export default {
    synth: new Tone.Synth().toMaster()
}