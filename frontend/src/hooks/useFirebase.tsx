import React, { useState, useEffect } from 'react'
import { User } from '@firebase/auth-types'
import { firebase } from '../components/FirebaseAuth'

export default function useFirebase({
  setUser,
}: {
  setUser?: (user: User) => any
}) {
  const [currentUser, setCurrentUser] = useState<User | null>(
    firebase.auth().currentUser
  )

  // Listen to the Firebase Auth state and set the local state.
  useEffect(() => {
    const unregisterAuthObserver = firebase
      .auth()
      .onAuthStateChanged((user) => {
        if (user) {
          console.log('user', user)
          if (setUser) setUser(user)
          setCurrentUser(user)
        }
      })
    // Make sure we un-register Firebase observers when the component unmounts.
    return () => unregisterAuthObserver()
  }, [])

  return { currentUser }
}
