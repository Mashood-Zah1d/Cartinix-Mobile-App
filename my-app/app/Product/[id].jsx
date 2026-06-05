import { StyleSheet, Text, View, Image, ScrollView, TouchableOpacity, Linking, ActivityIndicator, Dimensions } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { getProductDetail } from '../Services/Product.Service'
import { SafeAreaView } from 'react-native-safe-area-context'
import { BlurView } from 'expo-blur'

const { width } = Dimensions.get('window')

export default function ProductDetail() {
  const { id } = useLocalSearchParams()
  const router = useRouter()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchProduct() }, [])

  const fetchProduct = async () => {
    try {
      const response = await getProductDetail(id)
      setProduct(response.data)
    } catch (err) {
      console.log(err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return (
    <View style={styles.centered}>
      <View style={styles.loaderOuter}>
        <View style={styles.loaderMiddle}>
          <View style={styles.loaderInner}>
            <ActivityIndicator size="large" color="#B8975A" />
          </View>
        </View>
      </View>
      <Text style={styles.loadingText}>Loading Details</Text>
      <Text style={styles.loadingSubText}>Fetching your timepiece...</Text>
    </View>
  )

  if (!product) return (
    <View style={styles.centered}>
      <View style={styles.errorIconWrap}>
        <Text style={styles.errorIcon}>⚠</Text>
      </View>
      <Text style={styles.errorText}>Product not found</Text>
    </View>
  )

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F0EDE8' }}>
      <View style={styles.wrapper}>

        <View style={styles.topBar}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backText}>←</Text>
          </TouchableOpacity>
          <View style={styles.topBarCenter}>
            <View style={styles.brandDot} />
            <Text style={styles.topBarTitle}>PRODUCT DETAILS</Text>
            <View style={styles.brandDot} />
          </View>
          <View style={{ width: 38 }} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

          <View style={styles.masterCard}>

            <View style={styles.imageArea}>
              <Image
                source={{ uri: product.thumbnail || product.images }}
                style={styles.image}
                resizeMode="cover"
              />
              <BlurView intensity={50} tint="light" style={styles.brandBadge}>
                <View style={styles.brandDotSmall} />
                <Text style={styles.brandText}>{product.brand}</Text>
              </BlurView>
            </View>

            <View style={styles.cardBody}>

              <Text style={styles.title}>{product.title}</Text>

              <View style={styles.priceRow}>
                <View>
                  <Text style={styles.priceLabel}>PRICE</Text>
                  <Text style={styles.price}>Rs. {product.price?.toLocaleString()}</Text>
                </View>
                <View style={styles.stockBadge}>
                  <View style={styles.stockDot} />
                  <Text style={styles.stockText}>In Stock</Text>
                </View>
              </View>

              <View style={styles.divider} />

              <View style={styles.descLabelRow}>
                <View style={styles.descAccentLine} />
                <Text style={styles.descLabel}>DESCRIPTION</Text>
              </View>

              {product.description?.split('\n').map((line, i) =>
                line.trim() ? (
                  <View key={i} style={styles.descRow}>
                    <View style={styles.descBullet} />
                    <Text style={styles.descText}>{line}</Text>
                  </View>
                ) : null
              )}

            </View>

          </View>

          <View style={{ height: 110 }} />
        </ScrollView>

        <BlurView intensity={80} tint="light" style={styles.bottomButtons}>
          <View style={styles.bottomBtnsBorder} />
          <TouchableOpacity style={styles.cartButton} activeOpacity={0.85}>
            <Text style={styles.cartText}>Add to Cart</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.whatsappButton}
            activeOpacity={0.85}
            onPress={() => Linking.openURL(`https://wa.me/923314745405?text=I want to order: ${product.title}`)}
          >
            <Text style={styles.whatsappIcon}>✆</Text>
            <Text style={styles.whatsappText}>Order on WhatsApp</Text>
          </TouchableOpacity>
        </BlurView>

      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#F0EDE8',
  },

  centered: {
    flex: 1,
    backgroundColor: '#FAFAF8',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },

  loaderOuter: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 1,
    borderColor: '#E8E4DE',
    alignItems: 'center',
    justifyContent: 'center',
  },

  loaderMiddle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    borderWidth: 1,
    borderColor: '#D4B483',
    alignItems: 'center',
    justifyContent: 'center',
  },

  loaderInner: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#F4F1EC',
    borderWidth: 1,
    borderColor: '#B8975A',
    alignItems: 'center',
    justifyContent: 'center',
  },

  loadingText: {
    color: '#1A1A1A',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 1.5,
    marginTop: 14,
  },

  loadingSubText: {
    color: '#9A9690',
    fontSize: 12,
    marginTop: 4,
  },

  errorIconWrap: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FFF0F0',
    borderWidth: 1,
    borderColor: '#FFCCCC',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },

  errorIcon: { fontSize: 22 },

  errorText: {
    color: '#C0392B',
    fontSize: 14,
    fontWeight: '600',
  },

  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },

  backButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1,
    borderColor: '#E8E4DE',
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },

  backText: {
    color: '#1A1A1A',
    fontSize: 17,
    fontWeight: '700',
  },

  topBarCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  topBarTitle: {
    color: '#1A1A1A',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 3,
  },

  brandDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#B8975A',
  },

  scroll: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },

  masterCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E8E4DE',
  },

  imageArea: {
    width: '100%',
    height: width - 32,
    backgroundColor: '#F4F1EC',
    position: 'relative',
  },

  image: {
    width: '100%',
    height: '100%',
  },

  brandBadge: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    borderWidth: 1,
    borderColor: '#E8E4DE',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    overflow: 'hidden',
  },

  brandDotSmall: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#B8975A',
  },

  brandText: {
    color: '#1A1A1A',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 2,
  },

  cardBody: {
    padding: 22,
    gap: 16,
  },

  title: {
    color: '#1A1A1A',
    fontSize: 22,
    fontWeight: '800',
    lineHeight: 30,
  },

  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  priceLabel: {
    color: '#9A9690',
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 2,
    marginBottom: 4,
  },

  price: {
    color: '#B8975A',
    fontSize: 26,
    fontWeight: '800',
  },

  stockBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#EDFAF3',
    borderWidth: 1,
    borderColor: '#A8DFC0',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },

  stockDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#27ae60',
  },

  stockText: {
    color: '#27ae60',
    fontSize: 12,
    fontWeight: '700',
  },

  divider: {
    height: 1,
    backgroundColor: '#EEEBE5',
  },

  descLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  descAccentLine: {
    width: 3,
    height: 14,
    backgroundColor: '#B8975A',
    borderRadius: 2,
  },

  descLabel: {
    color: '#1A1A1A',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 3,
  },

  descRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },

  descBullet: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#B8975A',
    marginTop: 8,
  },

  descText: {
    color: '#3D3D3D',
    fontSize: 14,
    lineHeight: 22,
    flex: 1,
  },

  bottomButtons: {
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 34,
    gap: 10,
    overflow: 'hidden',
  },

  bottomBtnsBorder: {
    position: 'absolute',
    top: 0, left: 0, right: 0,
    height: 1,
    backgroundColor: '#E8E4DE',
  },

  cartButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#D4B483',
    backgroundColor: '#F0E8D8',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },

  cartText: {
    color: '#B8975A',
    fontWeight: '700',
    fontSize: 13,
  },

  whatsappButton: {
    flex: 1.5,
    backgroundColor: '#25D366',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },

  whatsappIcon: {
    color: '#fff',
    fontSize: 15,
  },

  whatsappText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 13,
  },
})