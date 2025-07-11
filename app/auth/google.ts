import * as Google from 'expo-auth-session/providers/google'
import auth from '@react-native-firebase/auth'
import { GoogleSignin } from '@react-native-google-signin/google-signin'

export default async function signInWithGoogle() {
  try {
    await GoogleSignin.hasPlayServices()
    const response = await GoogleSignin.signIn()
    console.log('Google Sign-In Response:', response)
  } catch (error) {}
}
