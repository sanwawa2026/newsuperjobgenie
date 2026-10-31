const fs = require('fs');

const SAMPLE_RATE = 44100;
const BPM = 118;
const BEAT = 60.0 / BPM;
const SIXTEENTH = BEAT / 4.0;
const TOTAL_DURATION = 55.0;
const TOTAL_SAMPLES = Math.floor(SAMPLE_RATE * TOTAL_DURATION);

const NOTES = {
    'A1': 55.0, 'B1': 61.74, 'C2': 65.41, 'D2': 73.42, 'E2': 82.41, 'F2': 87.31, 'G2': 98.0,
    'A2': 110.0, 'B2': 123.47, 'C3': 130.81, 'D3': 146.83, 'E3': 164.81, 'F3': 174.61, 'G3': 196.0,
    'A3': 220.0, 'B3': 246.94, 'C4': 261.63, 'D4': 293.66, 'E4': 329.63, 'F4': 349.23, 'G4': 392.0,
    'A4': 440.0, 'B4': 493.88, 'C5': 523.25, 'D5': 587.33, 'E5': 659.25, 'F5': 698.46, 'G5': 783.99,
    'A5': 880.0
};

const CHORDS = [
    { bass: 'A2', pad: ['A3', 'C4', 'E4', 'A4'], arp: ['A4', 'C5', 'E5', 'A5'] },
    { bass: 'F2', pad: ['F3', 'A3', 'C4', 'F4'], arp: ['F4', 'A4', 'C5', 'F5'] },
    { bass: 'C2', pad: ['C3', 'E3', 'G3', 'C4'], arp: ['G4', 'C5', 'E5', 'G5'] },
    { bass: 'G2', pad: ['G3', 'B3', 'D4', 'G4'], arp: ['D4', 'G4', 'B4', 'D5'] }
];

const BAR_LEN = BEAT * 4.0;
const leftBuffer = new Float32Array(TOTAL_SAMPLES);
const rightBuffer = new Float32Array(TOTAL_SAMPLES);

const totalBars = Math.floor(TOTAL_DURATION / BAR_LEN) + 1;

for (let bar = 0; bar < totalBars; bar++) {
    const barStartTime = bar * BAR_LEN;
    const chord = CHORDS[bar % 4];
    const hasDrums = (bar >= 1 && barStartTime < TOTAL_DURATION - 3.5);

    for (let beat = 0; beat < 4; beat++) {
        const beatTime = barStartTime + beat * BEAT;
        if (beatTime >= TOTAL_DURATION) break;
        const beatSample = Math.floor(beatTime * SAMPLE_RATE);

        // Kick drum on beats 0 & 2
        if (hasDrums && (beat === 0 || beat === 2)) {
            const kickLen = Math.floor(0.24 * SAMPLE_RATE);
            const limit = Math.min(kickLen, TOTAL_SAMPLES - beatSample);
            for (let i = 0; i < limit; i++) {
                const t = i / SAMPLE_RATE;
                const env = Math.exp(-t * 16.0);
                const freq = 135.0 * Math.exp(-t * 26.0) + 40.0;
                const val = Math.sin(2.0 * Math.PI * freq * t) * env * 0.5;
                leftBuffer[beatSample + i] += val;
                rightBuffer[beatSample + i] += val;
            }
        }

        // Snare on beats 1 & 3
        if (hasDrums && (beat === 1 || beat === 3)) {
            const snareLen = Math.floor(0.20 * SAMPLE_RATE);
            const limit = Math.min(snareLen, TOTAL_SAMPLES - beatSample);
            for (let i = 0; i < limit; i++) {
                const t = i / SAMPLE_RATE;
                const env = Math.exp(-t * 22.0);
                const noise = (Math.random() * 2.0 - 1.0) * env * 0.22;
                const tone = Math.sin(2.0 * Math.PI * 180.0 * t) * Math.exp(-t * 30.0) * 0.18;
                const val = noise + tone;
                leftBuffer[beatSample + i] += val * 0.95;
                rightBuffer[beatSample + i] += val * 1.05;
            }
        }

        // Hi-Hats on 16th notes
        if (hasDrums) {
            for (let sixteenth = 0; sixteenth < 4; sixteenth++) {
                const hatTime = beatTime + sixteenth * SIXTEENTH;
                if (hatTime >= TOTAL_DURATION) break;
                const hatSample = Math.floor(hatTime * SAMPLE_RATE);
                const hatLen = Math.floor(0.045 * SAMPLE_RATE);
                const vel = (sixteenth === 0 || sixteenth === 2) ? 0.12 : 0.08;
                const limit = Math.min(hatLen, TOTAL_SAMPLES - hatSample);
                for (let i = 0; i < limit; i++) {
                    const t = i / SAMPLE_RATE;
                    const env = Math.exp(-t * 90.0);
                    const noise = (Math.random() * 2.0 - 1.0) * env * vel;
                    leftBuffer[hatSample + i] += noise * 0.8;
                    rightBuffer[hatSample + i] += noise * 1.2;
                }
            }
        }
    }

    // 2. Bassline (Rolling synthwave 16th bass)
    const bassFreq = NOTES[chord.bass];
    for (let sixteenth = 0; sixteenth < 16; sixteenth++) {
        const noteTime = barStartTime + sixteenth * SIXTEENTH;
        if (noteTime >= TOTAL_DURATION) break;
        const noteSample = Math.floor(noteTime * SAMPLE_RATE);
        const noteLen = Math.floor(SIXTEENTH * 0.85 * SAMPLE_RATE);
        const f = bassFreq * ((sixteenth === 4 || sixteenth === 10 || sixteenth === 14) ? 2.0 : 1.0);
        const bassVolume = bar >= 1 ? 0.26 : 0.10;
        const limit = Math.min(noteLen, TOTAL_SAMPLES - noteSample);

        for (let i = 0; i < limit; i++) {
            const t = i / SAMPLE_RATE;
            const env = Math.exp(-t * 14.0);
            const saw = (Math.sin(2 * Math.PI * f * t) + 0.5 * Math.sin(4 * Math.PI * f * t) + 0.25 * Math.sin(6 * Math.PI * f * t)) * 0.6;
            const sub = Math.sin(2 * Math.PI * (f * 0.5) * t) * 0.4;
            const val = (saw + sub) * env * bassVolume;
            leftBuffer[noteSample + i] += val;
            rightBuffer[noteSample + i] += val;
        }
    }

    // 3. Dreamy Analog Pad
    const padLen = Math.floor(BAR_LEN * SAMPLE_RATE);
    const barSample = Math.floor(barStartTime * SAMPLE_RATE);
    const padLimit = Math.min(padLen, TOTAL_SAMPLES - barSample);
    for (let i = 0; i < padLimit; i++) {
        const t = i / SAMPLE_RATE;
        let env = t < 0.4 ? Math.sin(Math.PI * (t / 0.8)) : 1.0;
        if (t > BAR_LEN - 0.3) {
            env *= Math.max(0.0, (BAR_LEN - t) / 0.3);
        }

        let valL = 0;
        let valR = 0;
        for (const nStr of chord.pad) {
            const freq = NOTES[nStr];
            valL += Math.sin(2 * Math.PI * (freq - 0.7) * t) * 0.045;
            valR += Math.sin(2 * Math.PI * (freq + 0.7) * t) * 0.045;
            valL += Math.sin(4 * Math.PI * freq * t) * 0.015;
            valR += Math.sin(4 * Math.PI * freq * t) * 0.015;
        }
        leftBuffer[barSample + i] += valL * env * 0.8;
        rightBuffer[barSample + i] += valR * env * 0.8;
    }

    // 4. Shimmering Tech Plucks
    const arpPattern = [0, 1, 2, 3, 2, 1, 0, 2, 1, 3, 2, 0, 1, 2, 3, 2];
    for (let idx = 0; idx < arpPattern.length; idx++) {
        const arpTime = barStartTime + idx * SIXTEENTH;
        if (arpTime >= TOTAL_DURATION) break;
        const arpSample = Math.floor(arpTime * SAMPLE_RATE);
        const arpLen = Math.floor(0.24 * SAMPLE_RATE);
        const f = NOTES[chord.arp[arpPattern[idx]]];
        const pan = Math.sin(idx * 0.6);
        const panL = 0.5 - 0.3 * pan;
        const panR = 0.5 + 0.3 * pan;
        const limit = Math.min(arpLen, TOTAL_SAMPLES - arpSample);

        for (let i = 0; i < limit; i++) {
            const t = i / SAMPLE_RATE;
            const env = Math.exp(-t * 18.0);
            const tone = (Math.sin(2 * Math.PI * f * t) + 0.3 * Math.sin(4 * Math.PI * f * t)) * env * 0.12;
            leftBuffer[arpSample + i] += tone * panL;
            rightBuffer[arpSample + i] += tone * panR;
        }
    }
}

// Fade in first 1.2s
const fadeInSamples = Math.floor(1.2 * SAMPLE_RATE);
for (let i = 0; i < fadeInSamples; i++) {
    const mult = i / fadeInSamples;
    leftBuffer[i] *= mult;
    rightBuffer[i] *= mult;
}

// Fade out last 3.5s
const fadeOutStart = Math.floor((TOTAL_DURATION - 3.5) * SAMPLE_RATE);
for (let i = fadeOutStart; i < TOTAL_SAMPLES; i++) {
    const mult = Math.max(0.0, (TOTAL_SAMPLES - i) / (TOTAL_SAMPLES - fadeOutStart));
    leftBuffer[i] *= mult;
    rightBuffer[i] *= mult;
}

// Find peak & normalize
let maxVal = 0.001;
for (let i = 0; i < TOTAL_SAMPLES; i++) {
    if (Math.abs(leftBuffer[i]) > maxVal) maxVal = Math.abs(leftBuffer[i]);
    if (Math.abs(rightBuffer[i]) > maxVal) maxVal = Math.abs(rightBuffer[i]);
}
const scale = (32767.0 * 0.85) / maxVal;

// Write WAV header and 16-bit PCM
const header = Buffer.alloc(44);
const dataSize = TOTAL_SAMPLES * 4;
header.write('RIFF', 0);
header.writeUInt32LE(36 + dataSize, 4);
header.write('WAVE', 8);
header.write('fmt ', 12);
header.writeUInt32LE(16, 16);
header.writeUInt16LE(1, 20); // PCM
header.writeUInt16LE(2, 22); // Stereo
header.writeUInt32LE(SAMPLE_RATE, 24);
header.writeUInt32LE(SAMPLE_RATE * 4, 28);
header.writeUInt16LE(4, 32);
header.writeUInt16LE(16, 34);
header.write('data', 36);
header.writeUInt32LE(dataSize, 40);

const pcmData = Buffer.alloc(dataSize);
let offset = 0;
for (let i = 0; i < TOTAL_SAMPLES; i++) {
    const l = Math.max(-32768, Math.min(32767, Math.floor(leftBuffer[i] * scale)));
    const r = Math.max(-32768, Math.min(32767, Math.floor(rightBuffer[i] * scale)));
    pcmData.writeInt16LE(l, offset);
    pcmData.writeInt16LE(r, offset + 2);
    offset += 4;
}

fs.writeFileSync('scripts/cyber_tech_bgm.wav', Buffer.concat([header, pcmData]));
console.log('cyber_tech_bgm.wav generated in pure node. Total duration:', TOTAL_DURATION);
