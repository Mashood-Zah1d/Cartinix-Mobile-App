import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  Animated,
  Dimensions,
  FlatList,
  ActivityIndicator,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import { getProducts } from "../Services/Product.Service";

const { width } = Dimensions.get("window");

const C = {
  bg: "#FAFAF8",
  warm: "#F4F1EC",
  ink: "#1A1A1A",
  inkLight: "#3D3D3D",
  sub: "#9A9690",
  border: "#E8E4DE",
  gold: "#B8975A",
  goldLight: "#D4B483",
  goldFaint: "#F0E8D8",
  white: "#FFFFFF",
  line: "#EEEBE5",
};

function FadeIn({ delay = 0, children, style }) {
  const op = useRef(new Animated.Value(0)).current;
  const ty = useRef(new Animated.Value(24)).current;
  useEffect(() => {
    Animated.parallel([
      Animated.timing(op, { toValue: 1, duration: 700, delay, useNativeDriver: true }),
      Animated.timing(ty, { toValue: 0, duration: 700, delay, useNativeDriver: true }),
    ]).start();
  }, []);
  return (
    <Animated.View style={[{ opacity: op, transform: [{ translateY: ty }] }, style]}>
      {children}
    </Animated.View>
  );
}

function PressCard({ children, style, onPress }) {
  const scale = useRef(new Animated.Value(1)).current;
  const inn = () =>
    Animated.spring(scale, { toValue: 0.97, useNativeDriver: true, tension: 300, friction: 20 }).start();
  const out = () =>
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, tension: 300, friction: 20 }).start();
  return (
    <TouchableOpacity onPress={onPress} onPressIn={inn} onPressOut={out} activeOpacity={1}>
      <Animated.View style={[style, { transform: [{ scale }] }]}>{children}</Animated.View>
    </TouchableOpacity>
  );
}

function WatchDial() {
  const pulse = useRef(new Animated.Value(1)).current;
  const rotate = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1.03, duration: 2500, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1, duration: 2500, useNativeDriver: true }),
      ])
    ).start();
    Animated.loop(
      Animated.timing(rotate, { toValue: 1, duration: 60000, useNativeDriver: true })
    ).start();
  }, []);

  const rotateDeg = rotate.interpolate({ inputRange: [0, 1], outputRange: ["0deg", "360deg"] });

  return (
    <Animated.View style={[wd.outer, { transform: [{ scale: pulse }] }]}>
      <Animated.View style={[wd.tickRing, { transform: [{ rotate: rotateDeg }] }]}>
        {[...Array(12)].map((_, i) => (
          <View
            key={i}
            style={[
              wd.tick,
              {
                transform: [{ rotate: `${i * 30}deg` }, { translateY: -52 }],
                backgroundColor: i % 3 === 0 ? C.gold : C.border,
                height: i % 3 === 0 ? 6 : 4,
              },
            ]}
          />
        ))}
      </Animated.View>
      <View style={wd.face}>
        <View style={wd.logoWrap}>
          <Text style={wd.logoC}>C</Text>
        </View>
        <View style={wd.hourHand} />
        <View style={wd.minHand} />
        <View style={wd.center} />
      </View>
    </Animated.View>
  );
}

const wd = StyleSheet.create({
  outer: { width: 130, height: 130, alignItems: "center", justifyContent: "center" },
  tickRing: { position: "absolute", width: 124, height: 124, alignItems: "center", justifyContent: "flex-start" },
  tick: {
    position: "absolute",
    width: 1.5,
    borderRadius: 1,
    top: "50%",
    left: "50%",
    marginLeft: -0.75,
    transformOrigin: "center 52px",
  },
  face: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: C.white,
    borderWidth: 1.5,
    borderColor: C.gold,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: C.gold,
    shadowOpacity: 0.15,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  logoWrap: { position: "absolute", top: 22 },
  logoC: { fontSize: 9, fontWeight: "700", color: C.gold, letterSpacing: 1 },
  hourHand: {
    position: "absolute",
    width: 2,
    height: 22,
    backgroundColor: C.ink,
    borderRadius: 2,
    bottom: "50%",
    left: "50%",
    marginLeft: -1,
    transform: [{ rotate: "-40deg" }, { translateY: 4 }],
  },
  minHand: {
    position: "absolute",
    width: 1.5,
    height: 30,
    backgroundColor: C.gold,
    borderRadius: 2,
    bottom: "50%",
    left: "50%",
    marginLeft: -0.75,
    transform: [{ rotate: "100deg" }, { translateY: 4 }],
  },
  center: { width: 6, height: 6, borderRadius: 3, backgroundColor: C.gold, zIndex: 10 },
});

export default function HomePage() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getProducts();
        setProducts(response.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <ScrollView style={s.screen} showsVerticalScrollIndicator={false} contentContainerStyle={s.content}>
      <StatusBar barStyle="dark-content" backgroundColor={C.bg} />

      <FadeIn delay={0}>
        <View style={s.nav}>
          <View>
            <Text style={s.logoMain}>CARTINIX</Text>
            <Text style={s.logoSub}>Karachi · Est. 2020</Text>
          </View>
          <TouchableOpacity style={s.navBtn} onPress={() => router.push("/(tabs)/Products")}>
            <Text style={s.navBtnText}>Shop →</Text>
          </TouchableOpacity>
        </View>
      </FadeIn>

      <View style={s.topRule} />

      <FadeIn delay={100}>
        <View style={s.hero}>
          <WatchDial />
          <View style={s.heroText}>
            <Text style={s.heroEye}>Timeless Elegance, Redefined</Text>
            <Text style={s.heroTitle}>Time,{"\n"}Refined.</Text>
            <Text style={s.heroSub}>Original watches from the world's finest brands, delivered to your door.</Text>
          </View>
          <TouchableOpacity style={s.heroCta} onPress={() => router.push("/(tabs)/Products")} activeOpacity={0.85}>
            <Text style={s.heroCtaTxt}>Explore Collection</Text>
            <Text style={s.heroCtaArrow}>→</Text>
          </TouchableOpacity>
          <View style={s.statsRow}>
            {[["500+", "Models"], ["12K+", "Customers"], ["4.9★", "Rating"]].map(([n, l], i) => (
              <View key={i} style={s.statItem}>
                {i > 0 && <View style={s.statDivider} />}
                <Text style={s.statNum}>{n}</Text>
                <Text style={s.statLabel}>{l}</Text>
              </View>
            ))}
          </View>
        </View>
      </FadeIn>

      <View style={s.sectionRule} />

      <FadeIn delay={200}>
        <View style={s.collHeader}>
          <View>
            <Text style={s.sectionEye}>Our Range</Text>
            <Text style={s.sectionTitle}>Collections</Text>
          </View>
          <TouchableOpacity onPress={() => router.push("/(tabs)/Products")}>
            <Text style={s.seeAll}>See all →</Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <ActivityIndicator color={C.gold} size="large" style={{ marginVertical: 30 }} />
        ) : error ? (
          <Text style={s.errorText}>Failed to load products</Text>
        ) : (
          <FlatList
            data={products}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id?.toString()}
            contentContainerStyle={s.hScroll}
            snapToInterval={200}
            decelerationRate="fast"
            renderItem={({ item, index }) => (
              <FadeIn delay={220 + index * 60}>
                <PressCard style={s.collCard} onPress={() => router.push(`/Product/${item._id}`)}>
                  <Image
                    source={{ uri: item.images }}
                    style={s.collImage}
                    resizeMode="cover"
                  />
                  <View style={s.collOverlay} />
                  <View style={s.collBadge}>
                    <Text style={s.collBadgeText}>{item.brand}</Text>
                  </View>
                  <View style={s.collBottom}>
                    <Text style={s.collName} numberOfLines={2}>{item.title}</Text>
                    <View style={s.collPriceRow}>
                      <Text style={s.collPrice}>Rs. {item.price}</Text>
                      <View style={s.collArrowBtn}>
                        <Text style={s.collArrowText}>→</Text>
                      </View>
                    </View>
                  </View>
                </PressCard>
              </FadeIn>
            )}
          />
        )}
      </FadeIn>

      <View style={s.sectionRule} />

      <FadeIn delay={360} style={s.padH}>
        <PressCard style={s.banner} onPress={() => router.push("/(tabs)/Products")}>
          <View style={s.bannerLeft}>
            <Text style={s.bannerEye}>New Drop · 2026</Text>
            <Text style={s.bannerTitle}>New{"\n"}Arrivals</Text>
            <Text style={s.bannerSub}>Premium designs,{"\n"}crafted this year.</Text>
            <View style={s.bannerCta}>
              <Text style={s.bannerCtaText}>Shop now</Text>
              <Text style={s.bannerCtaArrow}>→</Text>
            </View>
          </View>
          <View style={s.bannerRight}>
            <View style={s.bannerDial}>
              <View style={s.bannerDialInner}>
                <Text style={s.bannerDialC}>C</Text>
              </View>
            </View>
          </View>
        </PressCard>
      </FadeIn>

      <View style={s.sectionRule} />

      <FadeIn delay={440} style={s.padH}>
        <View style={s.ctaBlock}>
          <Text style={s.ctaEye}>Members Only</Text>
          <Text style={s.ctaTitle}>Join the{"\n"}Elite Circle</Text>
          <Text style={s.ctaSub}>Early access to drops & exclusive previews</Text>
          <TouchableOpacity style={s.ctaPrimary} onPress={() => router.push("/(auth)/Signup")} activeOpacity={0.85}>
            <Text style={s.ctaPrimaryText}>Create Account</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push("/(auth)/Signin")} activeOpacity={0.7}>
            <Text style={s.ctaSecondary}>
              Already a member? <Text style={s.ctaSecondaryAccent}>Sign In →</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </FadeIn>

      <View style={s.footer}>
        <Text style={s.footerBrand}>CARTINIX</Text>
        <Text style={s.footerSub}>© 2026 · Karachi, Pakistan</Text>
      </View>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: C.bg },
  content: { paddingBottom: 60 },
  topRule: { height: 1, backgroundColor: C.line, marginTop: 0 },
  sectionRule: { height: 1, backgroundColor: C.line, marginVertical: 28, marginHorizontal: 24 },
  nav: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 16,
  },
  logoMain: { fontSize: 17, fontWeight: "800", color: C.ink, letterSpacing: 3 },
  logoSub: { fontSize: 10, color: C.sub, letterSpacing: 1, marginTop: 2 },
  navBtn: {
    borderWidth: 1,
    borderColor: C.gold,
    borderRadius: 20,
    paddingHorizontal: 18,
    paddingVertical: 8,
    backgroundColor: C.goldFaint,
  },
  navBtnText: { fontSize: 12, fontWeight: "700", color: C.gold, letterSpacing: 0.5 },
  hero: { paddingHorizontal: 24, paddingTop: 20, paddingBottom: 28, alignItems: "center" },
  heroText: { alignItems: "center", marginTop: 28, marginBottom: 28 },
  heroEye: {
    fontSize: 10,
    color: C.gold,
    letterSpacing: 2,
    textTransform: "uppercase",
    marginBottom: 12,
    fontWeight: "600",
  },
  heroTitle: {
    fontSize: 52,
    fontWeight: "800",
    color: C.ink,
    letterSpacing: -1.5,
    textAlign: "center",
    lineHeight: 58,
    marginBottom: 14,
  },
  heroSub: { fontSize: 14, color: C.sub, textAlign: "center", lineHeight: 22, maxWidth: 260 },
  heroCta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: C.ink,
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 50,
    marginBottom: 32,
  },
  heroCtaTxt: { color: C.white, fontSize: 14, fontWeight: "700", letterSpacing: 0.5 },
  heroCtaArrow: { color: C.gold, fontSize: 16, fontWeight: "700" },
  statsRow: { flexDirection: "row", width: "100%", borderTopWidth: 1, borderColor: C.line, paddingTop: 20 },
  statItem: { flex: 1, alignItems: "center", position: "relative" },
  statDivider: { position: "absolute", left: 0, top: "10%", bottom: "10%", width: 1, backgroundColor: C.line },
  statNum: { fontSize: 19, fontWeight: "800", color: C.ink, letterSpacing: -0.5 },
  statLabel: { fontSize: 9, color: C.sub, marginTop: 3, textTransform: "uppercase", letterSpacing: 1 },
  collHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  sectionEye: {
    fontSize: 10,
    color: C.gold,
    letterSpacing: 2,
    textTransform: "uppercase",
    fontWeight: "600",
    marginBottom: 4,
  },
  sectionTitle: { fontSize: 20, fontWeight: "800", color: C.ink, letterSpacing: -0.3 },
  seeAll: { fontSize: 12, color: C.gold, fontWeight: "700" },
  hScroll: { paddingLeft: 24, paddingRight: 12, gap: 14 },

  collCard: {
    width: 188,
    height: 260,
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 5,
  },
  collImage: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: "100%",
    height: "100%",
  },
  collOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  collBadge: {
    position: "absolute",
    top: 14,
    left: 14,
    backgroundColor: C.gold,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  collBadgeText: {
    fontSize: 8,
    fontWeight: "800",
    color: C.white,
    letterSpacing: 1.5,
    textTransform: "uppercase",
  },
  collBottom: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 14,
    gap: 8,
  },
  collName: {
    fontSize: 14,
    fontWeight: "700",
    color: C.white,
    lineHeight: 19,
  },
  collPriceRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  collPrice: {
    fontSize: 13,
    fontWeight: "800",
    color: C.gold,
  },
  collArrowBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: C.gold,
    alignItems: "center",
    justifyContent: "center",
  },
  collArrowText: {
    fontSize: 12,
    color: C.white,
    fontWeight: "700",
  },

  errorText: { color: "red", textAlign: "center", marginVertical: 20 },
  padH: { paddingHorizontal: 24 },
  banner: {
    backgroundColor: C.ink,
    borderRadius: 20,
    padding: 24,
    flexDirection: "row",
    alignItems: "center",
    overflow: "hidden",
  },
  bannerLeft: { flex: 1, gap: 6 },
  bannerEye: {
    fontSize: 9,
    color: C.gold,
    letterSpacing: 2,
    textTransform: "uppercase",
    fontWeight: "700",
    marginBottom: 2,
  },
  bannerTitle: { fontSize: 30, fontWeight: "800", color: C.white, letterSpacing: -0.5, lineHeight: 34 },
  bannerSub: { fontSize: 12, color: "#888", lineHeight: 18, marginTop: 4 },
  bannerCta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#2A2A2A",
    paddingTop: 14,
  },
  bannerCtaText: { fontSize: 12, color: C.gold, fontWeight: "700" },
  bannerCtaArrow: { fontSize: 13, color: C.gold, fontWeight: "700" },
  bannerRight: { alignItems: "center", justifyContent: "center", marginLeft: 16 },
  bannerDial: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 1,
    borderColor: "#2A2A2A",
    alignItems: "center",
    justifyContent: "center",
  },
  bannerDialInner: {
    width: 58,
    height: 58,
    borderRadius: 29,
    borderWidth: 1.5,
    borderColor: C.gold,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#111",
  },
  bannerDialC: { fontSize: 20, fontWeight: "800", color: C.gold },
  ctaBlock: {
    backgroundColor: C.warm,
    borderRadius: 20,
    padding: 28,
    borderWidth: 1,
    borderColor: C.border,
    alignItems: "center",
  },
  ctaEye: {
    fontSize: 9,
    color: C.gold,
    letterSpacing: 2,
    textTransform: "uppercase",
    fontWeight: "700",
    marginBottom: 10,
  },
  ctaTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: C.ink,
    letterSpacing: -0.5,
    textAlign: "center",
    lineHeight: 32,
    marginBottom: 10,
  },
  ctaSub: { fontSize: 13, color: C.sub, textAlign: "center", lineHeight: 20, marginBottom: 24 },
  ctaPrimary: {
    width: "100%",
    backgroundColor: C.ink,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    marginBottom: 14,
  },
  ctaPrimaryText: { color: C.white, fontSize: 14, fontWeight: "700", letterSpacing: 0.5 },
  ctaSecondary: { fontSize: 13, color: C.sub },
  ctaSecondaryAccent: { color: C.gold, fontWeight: "700" },
  footer: {
    alignItems: "center",
    paddingVertical: 28,
    borderTopWidth: 1,
    borderTopColor: C.line,
    marginTop: 8,
    gap: 6,
  },
  footerBrand: { fontSize: 13, fontWeight: "800", color: C.ink, letterSpacing: 4 },
  footerSub: { fontSize: 10, color: C.sub, letterSpacing: 0.5 },
});