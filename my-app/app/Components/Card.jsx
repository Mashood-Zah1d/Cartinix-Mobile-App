import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native'
import React from 'react'

const Card = ({
  image = "",
  title = "",
  brand = "",
  price = 0.0,
  onPress
}) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>

      <View style={styles.imageContainer}>
        <Image source={{ uri: image }} style={styles.image} resizeMode="cover" />
        <View style={styles.brandBadge}>
          <View style={styles.brandDot} />
          <Text style={styles.brandText}>{brand}</Text>
        </View>
        <View style={styles.cornerTR} />
        <View style={styles.cornerBL} />
      </View>

      <View style={styles.info}>
        <View style={styles.topAccent} />
        <Text style={styles.title} numberOfLines={2}>{title}</Text>
        <View style={styles.footer}>
          <View>
            <Text style={styles.priceLabel}>PRICE</Text>
            <Text style={styles.price}>Rs.{price.toLocaleString()}</Text>
          </View>
          <View style={styles.viewBtn}>
            <Text style={styles.viewBtnText}>VIEW</Text>
            <Text style={styles.viewArrow}>→</Text>
          </View>
        </View>
      </View>

    </TouchableOpacity>
  )
}

export default Card

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E8E4DE',
    backgroundColor: '#FFFFFF',
  },

  imageContainer: {
    width: '100%',
    height: 145,
    backgroundColor: '#F4F1EC',
    position: 'relative',
  },

  image: {
    width: '100%',
    height: '100%',
  },

  brandBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFFFFFCC',
    borderWidth: 1,
    borderColor: '#E8E4DE',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
  },

  brandDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#B8975A',
  },

  brandText: {
    color: '#1A1A1A',
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 1.5,
  },

  cornerTR: {
    position: 'absolute',
    top: 7,
    right: 7,
    width: 10,
    height: 10,
    borderTopWidth: 1.5,
    borderRightWidth: 1.5,
    borderColor: '#B8975A',
  },

  cornerBL: {
    position: 'absolute',
    bottom: 7,
    left: 7,
    width: 10,
    height: 10,
    borderBottomWidth: 1.5,
    borderLeftWidth: 1.5,
    borderColor: '#B8975A',
  },

  info: {
    padding: 12,
    gap: 8,
    position: 'relative',
  },

  topAccent: {
    position: 'absolute',
    top: 0,
    left: 12,
    right: 12,
    height: 1,
    backgroundColor: '#EEEBE5',
  },

  title: {
    color: '#1A1A1A',
    fontSize: 11,
    fontWeight: '600',
    lineHeight: 16,
  },

  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  priceLabel: {
    color: '#9A9690',
    fontSize: 7,
    fontWeight: '800',
    letterSpacing: 1.5,
    marginBottom: 1,
  },

  price: {
    color: '#B8975A',
    fontSize: 13,
    fontWeight: '800',
  },

  viewBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F0E8D8',
    borderWidth: 1,
    borderColor: '#D4B483',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },

  viewBtnText: {
    color: '#B8975A',
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 1.2,
  },

  viewArrow: {
    color: '#B8975A',
    fontSize: 10,
    fontWeight: '700',
  },
})