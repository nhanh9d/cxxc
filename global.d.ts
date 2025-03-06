// global.d.ts
export { };

declare global {
  interface Window {
    recaptchaVerifier: any; // You can replace `any` with the specific type if needed
  }
}
