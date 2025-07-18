import { auth } from '@/firebase';
import { PhoneAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import { initRecaptcha } from '@/lib/firebaseRecaptcha';

export const reauthenticateWithPhoneOTP = async (): Promise<void> => {
  const currentUser = auth.currentUser;

  if (!currentUser || !currentUser.phoneNumber) {
    throw new Error('User must be logged in with a phone number.');
  }

  const recaptchaVerifier = await initRecaptcha();
  const phoneProvider = new PhoneAuthProvider(auth);

  const verificationId = await phoneProvider.verifyPhoneNumber(
    currentUser.phoneNumber,
    recaptchaVerifier
  );

  const otp = prompt('Enter the OTP sent to your phone:');
  if (!otp) throw new Error('OTP is required.');

  const credential = PhoneAuthProvider.credential(verificationId, otp);
  await reauthenticateWithCredential(currentUser, credential);
};
