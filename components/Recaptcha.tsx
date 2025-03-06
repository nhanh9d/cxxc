import React from "react";
import {
  FirebaseRecaptchaVerifierModal,
} from "expo-firebase-recaptcha";
import { FirebaseOptions } from "firebase/app";

type RecaptchaModalProps = {
  ref?: React.RefObject<FirebaseRecaptchaVerifierModal>; // Optional ref
  firebaseConfig?: FirebaseOptions
};

const RecaptchaModal = React.forwardRef<
  FirebaseRecaptchaVerifierModal,
  RecaptchaModalProps
>(({ firebaseConfig, ...otherProps }, ref) => {
  return (
    <FirebaseRecaptchaVerifierModal
      ref={ref}
      firebaseConfig={firebaseConfig}
      {...otherProps}
    />
  );
});

export default RecaptchaModal;
