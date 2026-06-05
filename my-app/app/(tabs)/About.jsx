import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Linking } from 'react-native'
import React, { useRef, useEffect } from 'react'
import { Animated } from 'react-native'

const C = {
  bg: "#FAFAF8",
  warm: "#F4F1EC",
  ink: "#1A1A1A",
  sub: "#9A9690",
  border: "#E8E4DE",
  gold: "#B8975A",
  goldFaint: "#F0E8D8",
  white: "#FFFFFF",
  line: "#EEEBE5",
}

function FadeSlide({ delay, children }) {
  const fade = useRef(new Animated.Value(0)).current
  const slide = useRef(new Animated.Value(24)).current
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fade, { toValue: 1, duration: 700, delay, useNativeDriver: true }),
      Animated.timing(slide, { toValue: 0, duration: 700, delay, useNativeDriver: true }),
    ]).start()
  }, [])
  return (
    <Animated.View style={{ opacity: fade, transform: [{ translateY: slide }] }}>
      {children}
    </Animated.View>
  )
}

const features = [
  { icon: '◈', text: 'Original & Authentic Watches' },
  { icon: '◉', text: 'Brand Packaging Included' },
  { icon: '◆', text: 'Nationwide Delivery' },
  { icon: '✦', text: '100% Customer Satisfaction' },
  { icon: '◇', text: 'Secure & Safe Shopping' },
]

export default function About() {
  const pulseAnim = useRef(new Animated.Value(1)).current
  const rotate = useRef(new Animated.Value(0)).current

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.04, duration: 2500, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 2500, useNativeDriver: true }),
      ])
    ).start()
    Animated.loop(
      Animated.timing(rotate, { toValue: 1, duration: 60000, useNativeDriver: true })
    ).start()
  }, [])

  const rotateDeg = rotate.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] })

  return (
    <ScrollView style={s.screen} showsVerticalScrollIndicator={false} contentContainerStyle={s.content}>

      <FadeSlide delay={0}>
        <View style={s.hero}>
          <Animated.View style={[s.dialOuter, { transform: [{ scale: pulseAnim }] }]}>
            <Animated.View style={[s.tickRing, { transform: [{ rotate: rotateDeg }] }]}>
              {[...Array(12)].map((_, i) => (
                <View
                  key={i}
                  style={[
                    s.tick,
                    {
                      transform: [{ rotate: `${i * 30}deg` }, { translateY: -52 }],
                      backgroundColor: i % 3 === 0 ? C.gold : C.border,
                      height: i % 3 === 0 ? 6 : 4,
                    },
                  ]}
                />
              ))}
            </Animated.View>
            <View style={s.dialFace}>
              <View style={s.dialLogoWrap}>
                <Text style={s.dialLogoC}>C</Text>
              </View>
              <View style={s.hourHand} />
              <View style={s.minHand} />
              <View style={s.dialCenter} />
            </View>
          </Animated.View>

          <View style={s.brandRow}>
            <View style={s.brandDot} />
            <Text style={s.brand}>CARTINIX</Text>
            <View style={s.brandDot} />
          </View>

          <View style={s.taglineRow}>
            <View style={s.taglineLine} />
            <Text style={s.tagline}>TIMELESS ELEGANCE, REDEFINED</Text>
            <View style={s.taglineLine} />
          </View>

          <View style={s.badgeRow}>
            <View style={s.badge}><Text style={s.badgeText}>EST. 2020</Text></View>
            <View style={s.badgeDot} />
            <View style={s.badge}><Text style={s.badgeText}>KARACHI, PK</Text></View>
          </View>
        </View>
      </FadeSlide>

      <View style={s.rule} />

      <FadeSlide delay={150}>
        <View style={s.section}>
          <View style={s.labelRow}>
            <View style={s.labelAccent} />
            <Text style={s.label}>WHO WE ARE</Text>
          </View>
          <View style={s.card}>
            <View style={s.cardTopBar} />
            <Text style={s.cardText}>
              Cartinix is a premium watch store based in Karachi, Pakistan. We bring you the finest collection of luxury and everyday watches from top brands around the world. Our mission is to make quality timepieces accessible to everyone.
            </Text>
          </View>
        </View>
      </FadeSlide>

      <FadeSlide delay={250}>
        <View style={s.section}>
          <View style={s.labelRow}>
            <View style={s.labelAccent} />
            <Text style={s.label}>WHY CHOOSE US</Text>
          </View>
          <View style={s.featuresCard}>
            <View style={s.cardTopBar} />
            {features.map((item, i) => (
              <View key={i}>
                {i !== 0 && <View style={s.featureDivider} />}
                <View style={s.featureRow}>
                  <View style={s.featureIconWrap}>
                    <Text style={s.featureIcon}>{item.icon}</Text>
                  </View>
                  <Text style={s.featureText}>{item.text}</Text>
                  <Text style={s.featureArrow}>›</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </FadeSlide>

      <View style={s.rule} />

      <FadeSlide delay={350}>
        <View style={s.section}>
          <View style={s.labelRow}>
            <View style={s.labelAccent} />
            <Text style={s.label}>CONTACT US</Text>
          </View>

          <View style={s.contactRow}>
            <View style={[s.contactCard, { flex: 1 }]}>
              <View style={s.cardTopBar} />
              <Text style={s.contactLabel}>LOCATION</Text>
              <Text style={s.contactIcon}>◎</Text>
              <Text style={s.contactValue}>Karachi{'\n'}Pakistan</Text>
            </View>
            <View style={[s.contactCard, { flex: 1 }]}>
              <View style={s.cardTopBar} />
              <Text style={s.contactLabel}>PHONE</Text>
              <Text style={s.contactIcon}>◉</Text>
              <Text style={s.contactValue}>0331{'\n'}4745405</Text>
            </View>
          </View>

          <TouchableOpacity
            style={s.whatsappBtn}
            activeOpacity={0.85}
            onPress={() => Linking.openURL('https://wa.me/923314745405')}
          >
            <Text style={s.whatsappIcon}>✆</Text>
            <Text style={s.whatsappText}>Chat on WhatsApp</Text>
          </TouchableOpacity>
        </View>
      </FadeSlide>

      <View style={s.rule} />

      <FadeSlide delay={450}>
        <View style={s.footer}>
          <View style={s.brandRow}>
            <View style={s.brandDot} />
            <Text style={s.footerBrand}>CARTINIX</Text>
            <View style={s.brandDot} />
          </View>
          <Text style={s.footerText}>© 2026 · Karachi, Pakistan</Text>
        </View>
      </FadeSlide>

      <View style={{ height: 80 }} />
    </ScrollView>
  )
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: C.bg },
  content: { paddingBottom: 40 },

  rule: { height: 1, backgroundColor: C.line, marginVertical: 24, marginHorizontal: 24 },

  hero: {
    alignItems: 'center',
    paddingTop: 70,
    paddingBottom: 32,
    paddingHorizontal: 24,
  },

  dialOuter: {
    width: 130,
    height: 130,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 28,
  },
  tickRing: {
    position: 'absolute',
    width: 124,
    height: 124,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  tick: {
    position: 'absolute',
    width: 1.5,
    borderRadius: 1,
    top: '50%',
    left: '50%',
    marginLeft: -0.75,
    transformOrigin: 'center 52px',
  },
  dialFace: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: C.white,
    borderWidth: 1.5,
    borderColor: C.gold,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: C.gold,
    shadowOpacity: 0.15,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  dialLogoWrap: { position: 'absolute', top: 22 },
  dialLogoC: { fontSize: 9, fontWeight: '700', color: C.gold, letterSpacing: 1 },
  hourHand: {
    position: 'absolute',
    width: 2,
    height: 22,
    backgroundColor: C.ink,
    borderRadius: 2,
    bottom: '50%',
    left: '50%',
    marginLeft: -1,
    transform: [{ rotate: '-40deg' }, { translateY: 4 }],
  },
  minHand: {
    position: 'absolute',
    width: 1.5,
    height: 30,
    backgroundColor: C.gold,
    borderRadius: 2,
    bottom: '50%',
    left: '50%',
    marginLeft: -0.75,
    transform: [{ rotate: '100deg' }, { translateY: 4 }],
  },
  dialCenter: { width: 6, height: 6, borderRadius: 3, backgroundColor: C.gold, zIndex: 10 },

  brandRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
  brandDot: { width: 5, height: 5, borderRadius: 2.5, backgroundColor: C.gold, opacity: 0.6 },
  brand: { fontSize: 24, fontWeight: '900', color: C.ink, letterSpacing: 6 },

  taglineRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 },
  taglineLine: { width: 22, height: 0.5, backgroundColor: C.gold, opacity: 0.4 },
  tagline: { color: C.sub, fontSize: 8, fontWeight: '700', letterSpacing: 2 },

  badgeRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  badge: {
    borderWidth: 1,
    borderColor: C.gold,
    backgroundColor: C.goldFaint,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
  },
  badgeText: { color: C.gold, fontSize: 9, fontWeight: '800', letterSpacing: 2 },
  badgeDot: { width: 4, height: 4, borderRadius: 2, backgroundColor: C.gold, opacity: 0.4 },

  section: { paddingHorizontal: 20, marginBottom: 20 },

  labelRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  labelAccent: { width: 3, height: 14, backgroundColor: C.gold, borderRadius: 2 },
  label: { color: C.gold, fontSize: 10, fontWeight: '800', letterSpacing: 3 },

  card: {
    backgroundColor: C.white,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: C.border,
    padding: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  cardTopBar: {
    position: 'absolute',
    top: 0, left: 0, right: 0,
    height: 2,
    backgroundColor: C.gold,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
  },
  cardText: { color: C.sub, fontSize: 14, lineHeight: 24 },

  featuresCard: {
    backgroundColor: C.white,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: C.border,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  featureDivider: { height: 1, backgroundColor: C.line, marginHorizontal: 16 },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
  },
  featureIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: C.gold,
    backgroundColor: C.goldFaint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureIcon: { fontSize: 15, color: C.gold },
  featureText: { color: C.ink, fontSize: 13, fontWeight: '600', flex: 1 },
  featureArrow: { fontSize: 20, color: C.gold, fontWeight: '300' },

  contactRow: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  contactCard: {
    backgroundColor: C.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: C.border,
    padding: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  contactLabel: { color: C.gold, fontSize: 8, fontWeight: '800', letterSpacing: 2, marginBottom: 8, marginTop: 6 },
  contactIcon: { color: C.gold, fontSize: 18, marginBottom: 6 },
  contactValue: { color: C.ink, fontSize: 13, fontWeight: '700', lineHeight: 20 },

  whatsappBtn: {
    backgroundColor: '#25D366',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 10,
    shadowColor: '#25D366',
    shadowOpacity: 0.25,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  whatsappIcon: { color: '#fff', fontSize: 18 },
  whatsappText: { color: '#fff', fontWeight: '800', fontSize: 14, letterSpacing: 0.5 },

  footer: { alignItems: 'center', paddingVertical: 20 },
  footerBrand: { fontSize: 13, fontWeight: '800', color: C.ink, letterSpacing: 4 },
  footerText: { fontSize: 10, color: C.sub, letterSpacing: 0.5, marginTop: 6 },
})