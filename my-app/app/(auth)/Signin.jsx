import { StyleSheet, Text, View, TouchableOpacity, Alert, Dimensions } from 'react-native'
import { useForm } from 'react-hook-form'
import { Link, useRouter } from 'expo-router'
import * as SecureStore from 'expo-secure-store'
import Input from '../Components/Input'
import React, { useRef, useEffect } from 'react'
import { loginUser } from '../Services/Auth.Service'
import { Animated } from 'react-native'

const { width, height } = Dimensions.get('window')

const Signin = () => {
  const { control, handleSubmit } = useForm()
  const router = useRouter()
  const fadeAnim = useRef(new Animated.Value(0)).current
  const slideAnim = useRef(new Animated.Value(30)).current

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 700, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 700, useNativeDriver: true }),
    ]).start()
  }, [])

  const onSubmit = async (data) => {
    try {
      const response = await loginUser({ email: data.email, password: data.password })
      await SecureStore.setItemAsync('accessToken', response.data.accessToken)
      router.push('/(tabs)/Products')
    } catch (error) {
      Alert.alert("Error", error.toString())
    }
  }

  return (
    <View style={styles.container}>

      <View style={styles.topGoldLine} />

      <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>

        <View style={styles.topSection}>
          <View style={styles.dialOuter}>
            <View style={styles.dialInner}>
              <View style={styles.dialFace}>
                <Text style={styles.dialLogo}>C</Text>
              </View>
            </View>
          </View>

          <View style={styles.brandRow}>
            <View style={styles.brandDot} />
            <Text style={styles.brand}>CARTINIX</Text>
            <View style={styles.brandDot} />
          </View>

          <Text style={styles.tagline}>Timeless Elegance, Redefined</Text>
        </View>

        <View style={styles.card}>

          <View style={styles.cardHeader}>
            <View>
              <Text style={styles.cardTitle}>Welcome Back</Text>
              <Text style={styles.cardSubtitle}>Sign in to your account</Text>
            </View>
            <View style={styles.cardBadge}>
              <Text style={styles.cardBadgeText}>ELITE</Text>
            </View>
          </View>

          <Input control={control} name="email" label="Email Address" placeholder="yourname@email.com" />
          <Input control={control} name="password" label="Password" placeholder="••••••••" secureTextEntry={true} />

          <TouchableOpacity style={styles.button} onPress={handleSubmit(onSubmit)} activeOpacity={0.88}>
            <Text style={styles.buttonText}>Sign In</Text>
            <Text style={styles.buttonArrow}>→</Text>
          </TouchableOpacity>

          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>

          <Link href={"/Signup"} style={styles.signupLink}>
            <Text style={styles.signupText}>
              New to Cartinix?{'  '}
              <Text style={styles.signupHighlight}>Create Account →</Text>
            </Text>
          </Link>

          <View style={styles.trustRow}>
            <View style={styles.trustItem}>
              <Text style={styles.trustText}>🔒 Secure</Text>
            </View>
            <View style={styles.trustDivider} />
            <View style={styles.trustItem}>
              <Text style={styles.trustText}>✦ Verified</Text>
            </View>
            <View style={styles.trustDivider} />
            <View style={styles.trustItem}>
              <Text style={styles.trustText}>◈ Premium</Text>
            </View>
          </View>

        </View>

      </Animated.View>
    </View>
  )
}

export default Signin

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAF8',
    justifyContent: 'center',
    paddingHorizontal: 22,
  },

  topGoldLine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: '#B8975A',
  },

  topSection: {
    alignItems: 'center',
    marginBottom: 28,
  },

  dialOuter: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: '#E8E4DE',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },

  dialInner: {
    width: 78,
    height: 78,
    borderRadius: 39,
    borderWidth: 1.5,
    borderColor: '#B8975A',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F4F1EC',
  },

  dialFace: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E8E4DE',
    alignItems: 'center',
    justifyContent: 'center',
  },

  dialLogo: {
    color: '#B8975A',
    fontSize: 20,
    fontWeight: '800',
  },

  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 6,
  },

  brandDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#B8975A',
  },

  brand: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1A1A1A',
    letterSpacing: 5,
  },

  tagline: {
    color: '#9A9690',
    fontSize: 11,
    letterSpacing: 1,
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: '#E8E4DE',
  },

  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 22,
  },

  cardTitle: {
    color: '#1A1A1A',
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 4,
  },

  cardSubtitle: {
    color: '#9A9690',
    fontSize: 13,
  },

  cardBadge: {
    backgroundColor: '#F0E8D8',
    borderWidth: 1,
    borderColor: '#D4B483',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },

  cardBadgeText: {
    color: '#B8975A',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 2,
  },

  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    paddingVertical: 16,
    marginTop: 6,
  },

  buttonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
    letterSpacing: 0.5,
  },

  buttonArrow: {
    color: '#B8975A',
    fontSize: 16,
    fontWeight: '700',
  },

  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
    gap: 10,
  },

  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#EEEBE5',
  },

  dividerText: {
    color: '#9A9690',
    fontSize: 12,
    fontWeight: '500',
  },

  signupLink: {
    alignItems: 'center',
    marginBottom: 22,
  },

  signupText: {
    color: '#9A9690',
    fontSize: 13,
    textAlign: 'center',
  },

  signupHighlight: {
    color: '#B8975A',
    fontWeight: '700',
  },

  trustRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 14,
    backgroundColor: '#F4F1EC',
    borderWidth: 1,
    borderColor: '#E8E4DE',
    borderRadius: 12,
    paddingVertical: 12,
  },

  trustItem: {
    alignItems: 'center',
  },

  trustText: {
    fontSize: 10,
    color: '#9A9690',
    fontWeight: '600',
    letterSpacing: 0.5,
  },

  trustDivider: {
    width: 1,
    height: 12,
    backgroundColor: '#E8E4DE',
  },
})