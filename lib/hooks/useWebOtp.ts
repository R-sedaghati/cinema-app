import { useEffect } from 'react';

// Import the OTPCredential type
interface OTPCredential extends Credential {
  code: string;
}

type Props = { onSuccess: (otp: string) => void };

export default function useWebOtp({ onSuccess }: Props): void {
  useEffect(() => {
    const abortController = new AbortController();
    if ('OTPCredential' in window && 'get' in navigator.credentials) {
      const options: {
        otp: { transport: Array<string> };
        signal: AbortSignal;
      } = {
        otp: { transport: ['sms'] },
        signal: abortController.signal,
      };

      navigator.credentials
        .get(options)
        .then((credential) => {
          const otp = credential as OTPCredential;
          if (otp && otp.code) {
            onSuccess(otp.code);
          }
        })
        .catch((error) => {
          if (error.name === 'AbortError') {
            console.error('OTP retrieval was cancelled.');
          } else if (error.name === 'NotSupportedError') {
            console.error('WebOTP API is not supported in this browser.');
          } else if (error.name === 'TimeoutError') {
            console.error('OTP retrieval timed out.');
          } else {
            console.error('An error occurred during OTP retrieval:', error);
          }
        });
    }
  }, [onSuccess]);
}
