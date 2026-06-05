import api from "../Api/api.js";
import * as Speech from "expo-speech";
import { Audio } from "expo-av";

const GROQ_API_KEY = process.env.EXPO_PUBLIC_GROQ_API_KEY;

let recordingInstance = null;
let isRecording = false;
let recordingTimeout = null;
let transcriptionResolver = null;
let transcriptionRejecter = null;

export const sendMessage = async (message) => {
    try {
        const response = await api.post("/chatbot/query", { message });
        return response.data;
    } catch (error) {
        throw (
            error?.response?.data?.message ||
            error?.message ||
            "Something went wrong"
        );
    }
};

export const startListening = async () => {
    if (isRecording) return;

    try {
        isRecording = true;

        if (recordingInstance) {
            try {
                await recordingInstance.stopAndUnloadAsync();
            } catch {}
            recordingInstance = null;
        }

        const { granted } = await Audio.requestPermissionsAsync();

        if (!granted) {
            isRecording = false;
            throw new Error("Microphone  permission Denied");
        }

        await Audio.setAudioModeAsync({
            allowsRecordingIOS: true,
            playsInSilentModeIOS: true,
        });

        const { recording } = await Audio.Recording.createAsync(
            Audio.RecordingOptionsPresets.HIGH_QUALITY
        );

        recordingInstance = recording;

        return new Promise((resolve, reject) => {
            transcriptionResolver = resolve;
            transcriptionRejecter = reject;

            recordingTimeout = setTimeout(async () => {
                try {
                    const transcript = await stopAndTranscribe();
                    resolve(transcript);
                } catch (err) {
                    reject(err);
                }
            }, 8000);
        });
    } catch (err) {
        isRecording = false;
        recordingInstance = null;
        throw new Error(err.message || "Recording Didnt Started.");
    }
};

export const stopListening = async () => {
    if (recordingTimeout) {
        clearTimeout(recordingTimeout);
        recordingTimeout = null;
    }

    if (!recordingInstance) return null;

    try {
        const transcript = await stopAndTranscribe();

        if (transcriptionResolver) {
            transcriptionResolver(transcript);
            transcriptionResolver = null;
            transcriptionRejecter = null;
        }

        return transcript;
    } catch (err) {
        if (transcriptionRejecter) {
            transcriptionRejecter(err);
            transcriptionResolver = null;
            transcriptionRejecter = null;
        }

        throw err;
    }
};

const stopAndTranscribe = async () => {
    if (recordingTimeout) {
        clearTimeout(recordingTimeout);
        recordingTimeout = null;
    }

    if (!recordingInstance) return null;

    try {
        await recordingInstance.stopAndUnloadAsync();
        await Audio.setAudioModeAsync({
            allowsRecordingIOS: false,
        });

        const uri = recordingInstance.getURI();

        recordingInstance = null;
        isRecording = false;

        if (!uri) throw new Error("Audio is Missing.");

        const formData = new FormData();

        formData.append("file", {
            uri,
            type: "audio/m4a",
            name: "voice.m4a",
        });

        formData.append("model", "whisper-large-v3-turbo");
        formData.append("language", "en");
        formData.append("response_format", "text");

        const response = await fetch(
            "https://api.groq.com/openai/v1/audio/transcriptions",
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${GROQ_API_KEY}`,
                },
                body: formData,
            }
        );

        if (!response.ok) {
            const err = await response.text();
            throw new Error(`Groq Whisper error: ${err}`);
        }

        const transcript = await response.text();

        if (!transcript?.trim()) {
            throw new Error("Kuch nahi suna, dobara try karein.");
        }

        return transcript.trim();
    } catch (err) {
        recordingInstance = null;
        isRecording = false;
        throw new Error(err.message || "Transcription fail hui.");
    }
};

export const speakResponse = (text) => {
    return new Promise((resolve) => {
        Speech.stop();

        Speech.speak(text, {
            language: "en-UK",
            rate: 1.0,
            pitch: 0.5,
            volume: 1.0,
            onDone: resolve,
            onError: resolve,
        });
    });
};

export const stopSpeaking = () => {
    Speech.stop();
};