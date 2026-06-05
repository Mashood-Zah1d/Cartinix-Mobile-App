import React, { useState, useRef } from 'react'
import {
    View, Text, StyleSheet, TextInput, TouchableOpacity,
    FlatList, KeyboardAvoidingView, Platform, ActivityIndicator
} from 'react-native'
import { sendMessage, startListening, stopListening, speakResponse, stopSpeaking } from '../Services/Chatbot.Service.js'

const C = {
    bg:     "#FFFFFF",
    ink:    "#0A0A0A",
    sub:    "#888888",
    border: "#F0F0F0",
    pill:   "#F4F4F4",
    gold:   "#C9A96E",
    red:    "#E05555",
}

export default function Chatbot() {
    const [messages, setMessages] = useState([
        { id: "1", role: "bot", text: "Hello! I'm Cartinix's assistant. Feel free to ask me anything about our watches." }
    ])
    const [input, setInput] = useState("")
    const [loading, setLoading] = useState(false)
    const [isListening, setIsListening] = useState(false)
    const [isSpeaking, setIsSpeaking] = useState(false)
    const listRef = useRef(null)

    // ─── Text send karna ──────────────────────────────────────
    const send = async () => {
        if (!input.trim() || loading) return

        const userMsg = { id: Date.now().toString(), role: "user", text: input.trim() }
        setMessages(prev => [...prev, userMsg])
        setInput("")
        setLoading(true)

        try {
            const res = await sendMessage(input.trim())
            const botMsg = { id: Date.now().toString() + "b", role: "bot", text: res.data.answer }
            setMessages(prev => [...prev, botMsg])

            setIsSpeaking(true)
            await speakResponse(res.data.answer)
            setIsSpeaking(false)

        } catch (err) {
            const errMsg = { id: Date.now().toString() + "e", role: "bot", text: "Kuch masla hua, dobara try karein." }
            setMessages(prev => [...prev, errMsg])
        } finally {
            setLoading(false)
            listRef.current?.scrollToEnd({ animated: true })
        }
    }

    // ─── Mic button ───────────────────────────────────────────
   const handleMic = async () => {
    if (loading) return;

    if (isListening) {
        try {
            const transcript = await stopListening();

            if (transcript) {
                setInput(transcript);
            }
        } catch (err) {
            console.warn("Mic error:", err.message);
        } finally {
            setIsListening(false);
        }

        return;
    }

    setIsListening(true);

    try {
        const transcript = await startListening();

        if (transcript) {
            setInput(transcript);
        }
    } catch (err) {
        console.warn("Mic error:", err.message);
    } finally {
        setIsListening(false);
    }
};

    // ─── Speaker button ───────────────────────────────────────
    const handleSpeak = async (text) => {
        if (isSpeaking) {
            stopSpeaking()
            setIsSpeaking(false)
            return
        }
        setIsSpeaking(true)
        await speakResponse(text)
        setIsSpeaking(false)
    }

    // ─── Message bubble ───────────────────────────────────────
    const renderItem = ({ item }) => {
        const isUser = item.role === "user"
        return (
            <View style={[s.bubble, isUser ? s.bubbleUser : s.bubbleBot]}>
                {!isUser && (
                    <View style={s.botHeader}>
                        <Text style={s.botLabel}>Cartinix</Text>
                        <TouchableOpacity onPress={() => handleSpeak(item.text)} activeOpacity={0.7}>
                            <Text style={s.speakerIcon}>🔊</Text>
                        </TouchableOpacity>
                    </View>
                )}
                <Text style={[s.bubbleText, isUser ? s.bubbleTextUser : s.bubbleTextBot]}>
                    {item.text}
                </Text>
            </View>
        )
    }

    return (
        <KeyboardAvoidingView
            style={s.screen}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={90}
        >
            {/* Header */}
            <View style={s.header}>
                <View style={s.headerDot} />
                <View style={{ flex: 1 }}>
                    <Text style={s.headerTitle}>Cartinix Assistant</Text>
                    <Text style={s.headerSub}>
                        {isSpeaking ? "🔊 Bol raha hoon..." :
                         isListening ? "🎙️ Sun raha hoon..." :
                         "Watch expert · Always online"}
                    </Text>
                </View>
            </View>

            {/* Messages */}
            <FlatList
                ref={listRef}
                data={messages}
                keyExtractor={i => i.id}
                renderItem={renderItem}
                contentContainerStyle={s.list}
                onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })}
            />

            {/* Typing indicator */}
            {loading && (
                <View style={s.typing}>
                    <ActivityIndicator size="small" color={C.gold} />
                    <Text style={s.typingText}>Soch raha hoon...</Text>
                </View>
            )}

            {/* Listening indicator */}
            {isListening && (
                <View style={s.typing}>
                    <ActivityIndicator size="small" color={C.red} />
                    <Text style={[s.typingText, { color: C.red }]}>Sun raha hoon... (rok-ne ke liye dobara press karein)</Text>
                </View>
            )}

            {/* Input Row */}
            <View style={s.inputRow}>
                <TouchableOpacity
                    style={[s.micBtn, isListening && s.micBtnActive]}
                    onPress={handleMic}
                    activeOpacity={0.85}
                    disabled={loading}
                >
                    <Text style={s.micIcon}>{isListening ? "⏹" : "🎙️"}</Text>
                </TouchableOpacity>

                <TextInput
                    style={s.input}
                    placeholder="Watch ke baare mein puchein..."
                    placeholderTextColor={C.sub}
                    value={input}
                    onChangeText={setInput}
                    onSubmitEditing={send}
                    returnKeyType="send"
                    multiline
                />
                <TouchableOpacity
                    style={[s.sendBtn, (!input.trim() || loading) && s.sendBtnDisabled]}
                    onPress={send}
                    activeOpacity={0.85}
                >
                    <Text style={s.sendBtnText}>→</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    )
}

const s = StyleSheet.create({
    screen: { flex: 1, backgroundColor: C.bg },

    header: {
        flexDirection: "row", alignItems: "center", gap: 12,
        paddingHorizontal: 20, paddingTop: 56, paddingBottom: 16,
        borderBottomWidth: 1, borderBottomColor: C.border,
    },
    headerDot: {
        width: 40, height: 40, borderRadius: 20,
        backgroundColor: C.ink, alignItems: "center", justifyContent: "center",
    },
    headerTitle: { fontSize: 16, fontWeight: "700", color: C.ink },
    headerSub:   { fontSize: 11, color: C.sub, marginTop: 2 },

    list: { paddingHorizontal: 16, paddingVertical: 12, gap: 10 },

    bubble: {
        maxWidth: "80%", borderRadius: 16, padding: 12,
    },
    bubbleUser: {
        alignSelf: "flex-end", backgroundColor: C.ink,
        borderBottomRightRadius: 4,
    },
    bubbleBot: {
        alignSelf: "flex-start", backgroundColor: C.pill,
        borderBottomLeftRadius: 4,
    },
    botHeader:      { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 4 },
    botLabel:       { fontSize: 9, color: C.gold, fontWeight: "700", letterSpacing: 1 },
    speakerIcon:    { fontSize: 12 },
    bubbleText:     { fontSize: 14, lineHeight: 20 },
    bubbleTextUser: { color: "#FFFFFF" },
    bubbleTextBot:  { color: C.ink },

    typing: {
        flexDirection: "row", alignItems: "center", gap: 8,
        paddingHorizontal: 20, paddingVertical: 8,
    },
    typingText: { fontSize: 12, color: C.sub },

    inputRow: {
        flexDirection: "row", alignItems: "flex-end", gap: 10,
        paddingHorizontal: 16, paddingVertical: 12,
        borderTopWidth: 1, borderTopColor: C.border,
    },
    micBtn: {
        width: 44, height: 44, borderRadius: 22,
        backgroundColor: C.pill, alignItems: "center", justifyContent: "center",
    },
    micBtnActive: { backgroundColor: "#FFE5E5" },
    micIcon: { fontSize: 20 },

    input: {
        flex: 1, backgroundColor: C.pill, borderRadius: 22,
        paddingHorizontal: 16, paddingVertical: 12,
        fontSize: 14, color: C.ink, maxHeight: 100,
    },
    sendBtn: {
        width: 44, height: 44, borderRadius: 22,
        backgroundColor: C.ink, alignItems: "center", justifyContent: "center",
    },
    sendBtnDisabled: { backgroundColor: C.border },
    sendBtnText: { color: "#FFFFFF", fontSize: 18, fontWeight: "700" },
})