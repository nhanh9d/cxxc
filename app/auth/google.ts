import * as Google from "expo-auth-session/providers/google";
import { signInWithCredential, GoogleAuthProvider, Auth } from "firebase/auth";

export default async function signInWithGoogle(auth: Auth) {
  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId: "YOUR_GOOGLE_WEB_CLIENT_ID", // Replace with your Firebase Google Client ID
  });

  if (response?.type === "success") {
    const { id_token } = response.params;
    const credential = GoogleAuthProvider.credential(id_token);
    await signInWithCredential(auth, credential);
    alert("Google Sign-In successful!");
  } else {
    console.log("Google Sign-In failed", response);
  }
};
