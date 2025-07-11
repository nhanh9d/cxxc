import { Platform } from 'react-native'
import {
  AccessToken,
  AuthenticationToken,
  LoginManager,
  Settings
} from 'react-native-fbsdk-next'

// Initialize Facebook SDK
Settings.setAppID('915599720419978')
Settings.setClientToken('41db9e330db405dc6900f734dc2c2679')
Settings.initializeSDK()

export default async function signInWithFacebook() {
  try {
    const result = await LoginManager.logInWithPermissions([
      'public_profile',
      'email'
    ])
    
    if (result.isCancelled) {
      console.log('User cancelled Facebook login')
      return null
    }
    
    console.log('Facebook login result:', result)
    
    if (Platform.OS === 'ios') {
      // This token **cannot** be used to access the Graph API.
      // https://developers.facebook.com/docs/facebook-login/limited-login/
      const authResult = await AuthenticationToken.getAuthenticationTokenIOS()
      console.log('iOS Authentication Token:', authResult?.authenticationToken)
      return authResult
    } else {
      // This token can be used to access the Graph API.
      const accessResult = await AccessToken.getCurrentAccessToken()
      console.log('Android Access Token:', accessResult?.accessToken)
      return accessResult
    }
  } catch (error) {
    console.error('Facebook login error:', error)
    throw error
  }
}
