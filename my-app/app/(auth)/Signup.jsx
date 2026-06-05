import {
  StyleSheet, Text, View, TouchableOpacity,
  Alert, Image, Dimensions, ScrollView, StatusBar
} from 'react-native'
import { useForm } from 'react-hook-form'
import { Link, useRouter } from 'expo-router'
import Input from '../Components/Input'
import React, { useState, useRef, useEffect } from 'react'
import * as ImagePicker from 'expo-image-picker'
import { signupUser } from '../Services/Auth.Service'
import { Animated } from 'react-native'

const { width } = Dimensions.get('window')

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
}

const Signup = () => {
  const { control, handleSubmit } = useForm()
  const [avatar, setAvatar] = useState(null)
  const router = useRouter()

  const fadeAnim = useRef(new Animated.Value(0)).current
  const slideAnim = useRef(new Animated.Value(32)).current

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 700, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 700, useNativeDriver: true }),
    ]).start()
  }, [])

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    })
    if (!result.canceled) setAvatar(result.assets[0])
  }

  const onSubmit = async (data) => {
    try {
      if (!avatar) {
        Alert.alert("Error", "Please select avatar")
        return
      }
      const formData = new FormData()
      formData.append("Fullname", data.fullname)
      formData.append("username", data.username)
      formData.append("email", data.email)
      formData.append("password", data.password)
      formData.append("avatar", {
        uri: avatar.uri,
        type: "image/jpeg",
        name: "avatar.jpg",
      })
      const response = await signupUser(formData)
      Alert.alert("Success", response.message)
      router.replace('/(tabs)')
    } catch (error) {
      Alert.alert("Error", error.toString())
    }
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={C.bg} />

      <View style={styles.topGoldLine} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>

          <View style={styles.header}>
            <Text style={styles.headerEye}>CARTINIX</Text>
            <Text style={styles.headerTitle}>Create Account</Text>
            <Text style={styles.headerSub}>Join the elite circle of watch connoisseurs</Text>
          </View>

          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <View style={styles.dividerDiamond} />
            <View style={styles.dividerLine} />
          </View>

          <TouchableOpacity
            onPress={pickImage}
            activeOpacity={0.85}
            style={styles.avatarBlock}
          >
            {avatar ? (
              <Image source={{ uri: avatar.uri }} style={styles.avatarImg} />
            ) : (
              <View style={styles.avatarEmpty}>
                <View style={styles.avatarPlusCircle}>
                  <Text style={styles.avatarPlus}>+</Text>
                </View>
                <Text style={styles.avatarHint}>Upload Photo</Text>
              </View>
            )}
            <View style={styles.avatarMeta}>
              <Text style={styles.avatarLabel}>Profile Photo</Text>
              <Text style={styles.avatarSub}>Tap to choose from gallery</Text>
              <View style={styles.avatarReqBadge}>
                <Text style={styles.avatarReqText}>Required</Text>
              </View>
            </View>
          </TouchableOpacity>

          <View style={styles.formSection}>
            <View style={styles.sectionHeadRow}>
              <View style={styles.sectionAccent} />
              <Text style={styles.sectionHead}>Personal Info</Text>
            </View>
            <Input control={control} name="fullname" label="Full Name" placeholder="John Doe" />
            <Input control={control} name="username" label="Username" placeholder="@username" />
          </View>

          <View style={styles.formSection}>
            <View style={styles.sectionHeadRow}>
              <View style={styles.sectionAccent} />
              <Text style={styles.sectionHead}>Account Info</Text>
            </View>
            <Input control={control} name="email" label="Email Address" placeholder="you@email.com" />
            <Input control={control} name="password" label="Password" placeholder="••••••••" secureTextEntry={true} />
          </View>

          <TouchableOpacity
            style={styles.submitBtn}
            onPress={handleSubmit(onSubmit)}
            activeOpacity={0.88}
          >
            <Text style={styles.submitText}>Create Account</Text>
            <Text style={styles.submitArrow}>→</Text>
          </TouchableOpacity>

          <View style={styles.orRow}>
            <View style={styles.orLine} />
            <Text style={styles.orText}>or</Text>
            <View style={styles.orLine} />
          </View>

          <Link href="/Signin" asChild>
            <TouchableOpacity style={styles.signinRow} activeOpacity={0.7}>
              <Text style={styles.signinText}>Already have an account? </Text>
              <Text style={styles.signinLink}>Sign In →</Text>
            </TouchableOpacity>
          </Link>

          <View style={styles.trustRow}>
            {[["🔒", "Secure"], ["✦", "Verified"], ["◈", "Free"]].map(([icon, label], i) => (
              <React.Fragment key={i}>
                {i > 0 && <View style={styles.trustDivider} />}
                <View style={styles.trustItem}>
                  <Text style={styles.trustIcon}>{icon}</Text>
                  <Text style={styles.trustText}>{label}</Text>
                </View>
              </React.Fragment>
            ))}
          </View>

          <View style={{ height: 48 }} />
        </Animated.View>
      </ScrollView>
    </View>
  )
}

export default Signup

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: C.bg,
  },

  topGoldLine: {
    height: 2,
    backgroundColor: C.gold,
    width: '100%',
  },

  scroll: {
    paddingHorizontal: 24,
    paddingTop: 36,
  },

  header: {
    marginBottom: 24,
  },

  headerEye: {
    fontSize: 10,
    fontWeight: '800',
    color: C.gold,
    letterSpacing: 4,
    marginBottom: 10,
  },

  headerTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: C.ink,
    letterSpacing: -0.5,
    marginBottom: 8,
  },

  headerSub: {
    fontSize: 13,
    color: C.sub,
    lineHeight: 20,
  },

  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 28,
  },

  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: C.line,
  },

  dividerDiamond: {
    width: 6,
    height: 6,
    backgroundColor: C.gold,
    transform: [{ rotate: '45deg' }],
  },

  avatarBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 18,
    backgroundColor: C.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: C.border,
    padding: 16,
    marginBottom: 24,
  },

  avatarImg: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 2,
    borderColor: C.gold,
  },

  avatarEmpty: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: C.goldFaint,
    borderWidth: 1.5,
    borderColor: C.goldLight,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },

  avatarPlusCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: C.white,
    alignItems: 'center',
    justifyContent: 'center',
  },

  avatarPlus: {
    fontSize: 18,
    color: C.gold,
    fontWeight: '300',
    lineHeight: 22,
  },

  avatarHint: {
    fontSize: 7,
    color: C.gold,
    letterSpacing: 0.5,
    fontWeight: '700',
  },

  avatarMeta: {
    flex: 1,
    gap: 4,
  },

  avatarLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: C.ink,
  },

  avatarSub: {
    fontSize: 12,
    color: C.sub,
  },

  avatarReqBadge: {
    alignSelf: 'flex-start',
    marginTop: 4,
    backgroundColor: C.goldFaint,
    borderWidth: 1,
    borderColor: C.goldLight,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },

  avatarReqText: {
    fontSize: 9,
    fontWeight: '700',
    color: C.gold,
    letterSpacing: 0.5,
  },

  formSection: {
    backgroundColor: C.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: C.border,
    padding: 18,
    marginBottom: 14,
    gap: 4,
  },

  sectionHeadRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 14,
  },

  sectionAccent: {
    width: 3,
    height: 14,
    backgroundColor: C.gold,
    borderRadius: 2,
  },

  sectionHead: {
    fontSize: 11,
    fontWeight: '700',
    color: C.ink,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },

  submitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: C.ink,
    paddingVertical: 17,
    borderRadius: 14,
    marginBottom: 20,
    marginTop: 4,
  },

  submitText: {
    color: C.white,
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.5,
  },

  submitArrow: {
    color: C.gold,
    fontSize: 16,
    fontWeight: '700',
  },

  orRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
  },

  orLine: {
    flex: 1,
    height: 1,
    backgroundColor: C.line,
  },

  orText: {
    fontSize: 12,
    color: C.sub,
    fontWeight: 500,
  },

  signinRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 28,
  },

  signinText: {
    fontSize: 13,
    color: C.sub,
  },

  signinLink: {
    fontSize: 13,
    color: C.gold,
    fontWeight: '700',
  },

  trustRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    backgroundColor: C.warm,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 12,
    paddingVertical: 14,
  },

  trustItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },

  trustIcon: {
    fontSize: 11,
    color: C.gold,
  },

  trustText: {
    fontSize: 11,
    color: C.sub,
    fontWeight: '600',
    letterSpacing: 0.5,
  },

  trustDivider: {
    width: 1,
    height: 14,
    backgroundColor: C.line,
  },
})