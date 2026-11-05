# Firebase OTP web demo

The browser build uses Firebase JS Authentication and its reCAPTCHA verifier. Firebase test numbers use the saved code and do not send SMS.

## Firebase Console

1. Open **Authentication → Sign-in method → Phone** and make sure Phone is enabled.
2. Under **Phone numbers for testing**, remove any personal/real phone number added as a test number. Add a fictional number and code, such as `+1 650-555-3434` and `739204`.
3. Open **Authentication → Settings → Authorized domains** and make sure `localhost` is listed.

## Run the demo

From the FitPlan folder containing `app.json`, run:

```sh
npx expo start --web
```

Open the local URL in a browser on the Mac. Sign in with the app's email/password flow, then open **Phone OTP Quiz** from the drawer. Enter `+16505553434`, complete reCAPTCHA, request the code, enter `739204`, and verify. A wrong code shows an error.

The Firebase web app config is already in `src/firebase.js`. No iPhone cable or SMS billing is needed for this test-number browser demo. It verifies the code with Firebase but does not show a real SMS arriving on a phone.
