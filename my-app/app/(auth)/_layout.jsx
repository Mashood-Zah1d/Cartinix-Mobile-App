import {Stack} from 'expo-router'

export default function Authlayout () {
    return (
        <Stack>
            <Stack.Screen name='Signup' options={{headerShown:false}}/>
            <Stack.Screen name='Signin' options={{headerShown:false}}/>
        </Stack>
    )
}