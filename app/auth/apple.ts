import * as AppleAuthentication from 'expo-apple-authentication'
async function signInWithApple() {
  try {
    const credential = await AppleAuthentication.signInAsync({
      requestedScopes: [
        AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
        AppleAuthentication.AppleAuthenticationScope.EMAIL
      ]
    })
    console.log('Apple Sign-In Credential:', credential)
    // signed in
  } catch (e) {}
}

export default signInWithApple
