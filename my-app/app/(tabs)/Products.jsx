import { StyleSheet, Text, View, FlatList, ActivityIndicator } from 'react-native'
import React, { useCallback, useState } from 'react'
import { getProducts } from '../Services/Product.Service.js'
import Card from '../Components/Card.jsx'
import { useFocusEffect, useRouter } from 'expo-router'

const Products = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const router = useRouter()

  useFocusEffect(
    useCallback(() => {
      fetchProducts()
    }, [])
  )

  const fetchProducts = async () => {
    try {
      const response = await getProducts()
      setProducts(response.data)
    } catch (err) {
      setError(err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <View style={styles.centered}>
        <View style={styles.loaderOuter}>
          <View style={styles.loaderInner}>
            <ActivityIndicator size="large" color="#B8975A" />
          </View>
        </View>
        <Text style={styles.loadingText}>Curating Collection</Text>
        <Text style={styles.loadingSubText}>Finest timepieces loading...</Text>
      </View>
    )
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Something went wrong</Text>
        <Text style={styles.errorSub}>{String(error)}</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>

      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.headerAccent} />
          <View>
            <Text style={styles.headerLabel}>OUR RANGE</Text>
            <Text style={styles.heading}>Collection</Text>
            <Text style={styles.subheading}>{products.length} timepieces available</Text>
          </View>
        </View>
        <View style={styles.badgePill}>
          <Text style={styles.badgeText}>2026</Text>
        </View>
      </View>

      <FlatList
        data={products}
        keyExtractor={(item) => item._id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        renderItem={({ item }) => (
          <Card
            image={item.images}
            title={item.title}
            brand={item.brand}
            price={item.price}
            onPress={() => router.push(`/Product/${item._id}`)}
          />
        )}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />

    </View>
  )
}

export default Products

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAF8',
    paddingHorizontal: 14,
  },

  centered: {
    flex: 1,
    backgroundColor: '#FAFAF8',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },

  loaderOuter: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 1,
    borderColor: '#E8E4DE',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },

  loaderInner: {
    width: 58,
    height: 58,
    borderRadius: 29,
    borderWidth: 1.5,
    borderColor: '#B8975A',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F4F1EC',
  },

  loadingText: {
    color: '#1A1A1A',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 1,
  },

  loadingSubText: {
    color: '#9A9690',
    fontSize: 12,
  },

  errorText: {
    color: '#C0392B',
    fontSize: 14,
    fontWeight: '700',
  },

  errorSub: {
    color: '#9A9690',
    fontSize: 12,
    marginTop: 4,
    textAlign: 'center',
    paddingHorizontal: 32,
  },

  header: {
    paddingTop: 58,
    paddingBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },

  headerAccent: {
    width: 2,
    height: 32,
    backgroundColor: '#B8975A',
    borderRadius: 2,
  },

  headerLabel: {
    color: '#B8975A',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 3,
    marginBottom: 2,
  },

  heading: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1A1A1A',
    letterSpacing: -0.3,
  },

  subheading: {
    fontSize: 11,
    color: '#9A9690',
    marginTop: 2,
  },

  badgePill: {
    borderWidth: 1,
    borderColor: '#D4B483',
    backgroundColor: '#F0E8D8',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },

  badgeText: {
    fontSize: 11,
    color: '#B8975A',
    letterSpacing: 2,
    fontWeight: '700',
  },

  list: {
    paddingBottom: 110,
    gap: 12,
  },

  row: {
    gap: 12,
  },
})