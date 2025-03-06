import * as AppleAuthentication from "expo-apple-authentication";
import { Auth, OAuthProvider, signInWithCredential } from "firebase/auth";

export default async function signInWithApple(auth: Auth) {
  try {
    const credential = await AppleAuthentication.signInAsync({
      requestedScopes: [
        AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
        AppleAuthentication.AppleAuthenticationScope.EMAIL,
      ],
    });

    const { identityToken } = credential;
    const appleCredential = OAuthProvider.credentialFromJSON({
      idToken: identityToken,
    });

    await signInWithCredential(auth, appleCredential);
    alert("Apple Sign-In successful!");
  } catch (error) {
    console.log("Apple Sign-In failed", error);
  }
};
