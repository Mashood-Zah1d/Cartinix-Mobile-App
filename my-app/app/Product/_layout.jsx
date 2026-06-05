import {Stack} from 'expo-router'

export default function Authlayout () {
    return (
        <Stack>
            <Stack.Screen name='[id]' options={{headerShown:false}}/>
        </Stack>
    )
}