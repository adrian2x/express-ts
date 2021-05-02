import Cookie from 'js-cookie'
import firebase from 'firebase/app'
import 'firebase/auth'

// TODO: set your firebase config
const config = {
  apiKey: 'AIzaSyDOTyoj9m1nnT9bkG30WXMPuzFjT39Yb9I',
  authDomain: 'test-e758d.firebaseapp.com',
  databaseURL: 'https://test-e758d.firebaseio.com',
  storageBucket: 'test-e758d.appspot.com',
  messagingSenderId: '918779841724',
}

firebase.initializeApp(config)
export default firebase

export async function signOut() {
  return firebase.auth().signOut()
}

firebase.auth().onAuthStateChanged(async (user) => {
  if (user) {
    sessionStorage.setItem('user', JSON.stringify(firebase.auth().currentUser))
    Cookie.set('session', await user.getIdToken(), {
      expires: 3,
      sameSite: 'Strict',
    })
  } else {
    Cookie.remove('session')
    sessionStorage.removeItem('user')
  }
})
