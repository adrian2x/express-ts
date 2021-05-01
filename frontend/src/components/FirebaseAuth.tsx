import React, { useState, useEffect } from 'react'
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth'
import firebase from 'firebase/app'
import 'firebase/auth'
import { User } from '@firebase/auth-types'
import { signIn } from '../api'
import './FirebaseAuth.scss'

// TODO: set your firebase config
const config = {
  apiKey: 'AIzaSyDOTyoj9m1nnT9bkG30WXMPuzFjT39Yb9I',
  authDomain: 'test-e758d.firebaseapp.com',
  databaseURL: 'https://test-e758d.firebaseio.com',
  storageBucket: 'test-e758d.appspot.com',
  messagingSenderId: '918779841724',
}
firebase.initializeApp(config)

export { firebase }

// Configure FirebaseUI.
const uiConfig = {
  // Popup signin flow rather than redirect flow.
  signInFlow: 'popup',
  // Redirect to /signedIn after sign in is successful. Alternatively you can provide a callbacks.signInSuccess function.
  // signInSuccessUrl: '/handleSignedIn',
  // We will display Google and Facebook as auth providers.
  signInOptions: [
    // Leave the lines as is for the providers you want to offer your users.
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    firebase.auth.FacebookAuthProvider.PROVIDER_ID,
    firebase.auth.TwitterAuthProvider.PROVIDER_ID,
    // firebase.auth.GithubAuthProvider.PROVIDER_ID,
    {
      provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
      // Whether the display name should be displayed in the Sign Up page.
      requireDisplayName: true,
    },
    {
      provider: firebase.auth.PhoneAuthProvider.PROVIDER_ID,
      defaultCountry: 'US',
      // Invisible reCAPTCHA with image challenge and bottom left badge.
      recaptchaParameters: {
        type: 'image',
        size: 'invisible',
        badge: 'bottomleft',
      },
    },
  ],
  callbacks: {
    // Avoid redirects after sign-in.
    signInSuccessWithAuthResult: (authResult: any) => {
      const user = authResult.user
      if (authResult.additionalUserInfo.isNewUser) {
        // Create new user from user data
        signIn(user!).catch((err) => console.error(err))
      }
      return false
    },
  },
  // tosUrl and privacyPolicyUrl accept either url string or a callback
  // function.
  // Terms of service url/callback.
  tosUrl: 'https://www.google.com',
  // Privacy policy url/callback.
  privacyPolicyUrl: function () {
    window.location.assign('')
  },
}

export interface FirebaseAuthProps {
  signedInSuccess?: (user: User) => void
}

export default function FirebaseAuth({ signedInSuccess }: FirebaseAuthProps) {
  const [user, setUser] = useState<User | undefined>(undefined)

  // Listen to the Firebase Auth state and set the local state.
  useEffect(() => {
    const unregisterAuthObserver = firebase
      .auth()
      .onAuthStateChanged((user) => {
        if (user) {
          setUser(user)
          if (signedInSuccess) signedInSuccess(user)
        }
      })
    // Make sure we un-register Firebase observers when the component unmounts.
    return () => unregisterAuthObserver()
  }, [])

  if (!user) {
    return (
      <div className="signup-form">
        <h1 className="signup-h1">Please sign in to continue</h1>
        <div>
          <StyledFirebaseAuth
            uiConfig={uiConfig}
            firebaseAuth={firebase.auth()}
          />
        </div>
      </div>
    )
  }

  return null
}
