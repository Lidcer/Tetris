export type SynthEngineOscillator = 'sawtooth' | 'sine' | 'square' | 'triangle';

export type Note = 'A0' | 'A#0' | 'B0' | 'C1' | 'C#1' | 'D1' | 'D#1' | 'E1' | 'F1' | 'F#1' | 'G1' | 'G#1' |
'A1' | 'A#1' | 'B1' | 'C2' | 'C#2' | 'D2' | 'D#2' | 'E2' | 'F2' | 'F#2' | 'G2' | 'G#2' | 'A2' | 'A#2' | 'B2' |
'C3' | 'C#3' | 'D3' | 'D#3' | 'E3' | 'F3' | 'F#3' | 'G3' | 'G#3' | 'A3' | 'A#3' | 'B3' | 'C4' | 'C#4' | 'D4' |
'D#4' | 'E4' | 'F4' | 'F#4' | 'G4' | 'G#4' | 'A4' | 'A#4' | 'B4' | 'C5' | 'C#5' | 'D5' | 'D#5' | 'E5' | 'F5' |
'F#5' | 'G5' | 'G#5' | 'A5' | 'A#5' | 'B5' | 'C6' | 'C#6' | 'D6' | 'D#6' | 'E6' | 'F6' | 'F#6' | 'G6' | 'G#6' |
'A6' | 'A#6' | 'B6' | 'C7' | 'C#7' | 'D7' | 'D#7' | 'E7' | 'F7' | 'F#7' | 'G7' | 'G#7' | 'A7' | 'A#7' | 'B7' |
'C8' | 'C#8' | 'D8' | 'D#8' | 'E8' | 'F8' | 'F#8' | 'G8' | 'G#8' | 'A8' | 'A#8' | 'B8' | 'C9' | 'C#9' | 'D9' |
'D#9' | 'E9' | 'F9' | 'F#9' | 'G9';

export const notes: { [key in Note]: number } = {
    "G9": 12543.85,
    "F#9": 11839.82,
    "F9": 11175.30,
    "E9": 10548.08,
    "D#9": 9956.06,
    "D9": 9397.27,
    "C#9": 8869.84,
    "C9": 8372.02,
    "B8": 7902.13,
    "A#8": 7458.62,
    "A8": 7040.00,
    "G#8": 6644.88,
    "G8": 6271.93,
    "F#8": 5919.91,
    "F8": 5587.65,
    "E8": 5274.04,
    "D#8": 4978.03,
    "D8": 4698.64,
    "C#8": 4434.92,
    "C8": 4186.01,
    "B7": 3951.07,
    "A#7": 3729.31,
    "A7": 3520.00,
    "G#7": 3322.44,
    "G7": 3135.96,
    "F#7": 2959.96,
    "F7": 2793.83,
    "E7": 2637.02,
    "D#7": 2489.02,
    "D7": 2349.32,
    "C#7": 2217.46,
    "C7": 2093.00,
    "B6": 1975.53,
    "A#6": 1864.66,
    "A6": 1760.00,
    "G#6": 1661.22,
    "G6": 1567.98,
    "F#6": 1479.98,
    "F6": 1396.91,
    "E6": 1318.51,
    "D#6": 1244.51,
    "D6": 1174.66,
    "C#6": 1108.73,
    "C6": 1046.50,
    "B5": 987.77,
    "A#5": 932.33,
    "A5": 880.00,
    "G#5": 830.61,
    "G5": 783.99,
    "F#5": 739.99,
    "F5": 698.46,
    "E5": 659.26,
    "D#5": 622.25,
    "D5": 587.33,
    "C#5": 554.37,
    "C5": 523.25,
    "B4": 493.88,
    "A#4": 466.16,
    "A4": 440.00,
    "G#4": 415.30,
    "G4": 392.00,
    "F#4": 369.99,
    "F4": 349.23,
    "E4": 329.63,
    "D#4": 311.13,
    "D4": 293.66,
    "C#4": 277.18,
    "C4": 261.63,
    "B3": 246.94,
    "A#3": 233.08,
    "A3": 220.00,
    "G#3": 207.65,
    "G3": 196.00,
    "F#3": 185.00,
    "F3": 174.61,
    "E3": 164.81,
    "D#3": 155.56,
    "D3": 146.83,
    "C#3": 138.59,
    "C3": 130.81,
    "B2": 123.47,
    "A#2": 116.54,
    "A2": 110.00,
    "G#2": 103.83,
    "G2": 98.00,
    "F#2": 92.50,
    "F2": 87.31,
    "E2": 82.41,
    "D#2": 77.78,
    "D2": 73.42,
    "C#2": 69.30,
    "C2": 65.41,
    "B1": 61.74,
    "A#1": 58.27,
    "A1": 55.00,
    "G#1": 51.91,
    "G1": 49.00,
    "F#1": 46.25,
    "F1": 43.65,
    "E1": 41.20,
    "D#1": 38.89,
    "D1": 36.71,
    "C#1": 34.65,
    "C1": 32.70,
    "B0": 30.87,
    "A#0": 29.14,
    "A0": 27.50,
};


export class SmoothSync {
    private audioCtx: AudioContext;
    volume = 0.25;
    private createOscillatorBase(frequency: number, shapeType: OscillatorType = 'square') {
        this.audioCtx = this.audioCtx || new AudioContext;
        const oscillator = this.audioCtx.createOscillator();
        const gainNode = this.audioCtx.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(this.audioCtx.destination);
        oscillator.type = shapeType;
        oscillator.frequency.value = frequency;
        return {
            oscillator : oscillator,
            gainNode : gainNode
        };
    }
    private initialize() {
        this.audioCtx = this.audioCtx || new AudioContext;
    }
    beepSmooth(frequency: number, duration: number, osc1freq = 1, shapeType?: OscillatorType, offset = 0) {
        const {
            oscillator : osc,
            gainNode : gainNode
        } = this.createOscillatorBase(frequency, shapeType);
        const now = this.audioCtx.currentTime;
        gainNode.gain.setValueAtTime(0, now);
        gainNode.gain.linearRampToValueAtTime(osc1freq, now + duration / 100);
        gainNode.gain.exponentialRampToValueAtTime(.001, now + duration);
        osc.start(now + offset);
        osc.stop(now + duration);
    }
}
