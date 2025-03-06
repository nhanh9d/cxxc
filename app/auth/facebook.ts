import * as Facebook from "expo-facebook";
import { Auth, FacebookAuthProvider, signInWithCredential } from "firebase/auth";

export default async function signInWithFacebook(auth: Auth) {
  await Facebook.initializeAsync({ appId: "YOUR_FACEBOOK_APP_ID" });
  const result = await Facebook.logInWithReadPermissionsAsync({
    permissions: ["public_profile", "email"],
  });

  if (result.type === "success") {
    const credential = FacebookAuthProvider.credential(result.token);
    await signInWithCredential(auth, credential);
    alert("Facebook Sign-In successful!");
  } else {
    console.log("Facebook Sign-In failed");
  }
};
