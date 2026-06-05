import { StyleSheet, Text, TextInput, View } from 'react-native'
import React, { forwardRef } from 'react'
import { Controller } from 'react-hook-form'

const Input = forwardRef(function Input({
  label = "",
  name = "",
  keyboardType = "text",
  control,
  ...props
}, ref) {
  return (
    <View>
      {label && <Text style={styles.label}>{label}</Text>}
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={styles.input}
            keyboardType={keyboardType}
            ref={ref}
            {...props}
            onChangeText={onChange}
            value={value}
            placeholderTextColor="#9A9690"
            selectionColor="#B8975A"
          />
        )}
      />
    </View>
  )
})

export default Input

const styles = StyleSheet.create({
  label: {
    color: '#1A1A1A',
    marginBottom: 7,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  input: {
    backgroundColor: '#FFFFFF',
    color: '#1A1A1A',
    borderWidth: 1,
    borderColor: '#E8E4DE',
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
    fontSize: 14,
    fontWeight: '500',
  },
})