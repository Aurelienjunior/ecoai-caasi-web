// src/utils/firebaseRecaptcha.ts
import { RecaptchaVerifier } from 'firebase/auth';
import { auth } from '@/firebase';

export type CustomWindow = typeof window & {
  recaptchaVerifier?: RecaptchaVerifier;
};

export const initRecaptcha = (): Promise<RecaptchaVerifier> => {
  return new Promise((resolve, reject) => {
    const customWindow = window as CustomWindow;

    if (customWindow.recaptchaVerifier) {
      // Already initialized - return existing instance
      return resolve(customWindow.recaptchaVerifier);
    }

    const checkDOM = setInterval(() => {
      const container = document.getElementById('recaptcha-container');

      if (container) {
        clearInterval(checkDOM);

        try {
          customWindow.recaptchaVerifier = new RecaptchaVerifier(
            auth,
            'recaptcha-container',
            {
              size: 'invisible',
              callback: () => {
                console.log('✅ reCAPTCHA solved');
              },
              'expired-callback': () => {
                console.warn('⚠️ reCAPTCHA expired');
              },
            }
          );

          customWindow.recaptchaVerifier
            .render()
            .then(() => {
              resolve(customWindow.recaptchaVerifier!);
            })
            .catch((err) => {
              reject(err);
            });
        } catch (err) {
          reject(err);
        }
      }
    }, 300);
  });
};
