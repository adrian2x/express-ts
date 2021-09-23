import { Store } from 'pullstate'
import firebase from "./firebase"

interface StoreType {
  user: firebase.User | null
}

export const currentUser = () => {
  try {
    let user = firebase.auth().currentUser
    if (user) return user
    return JSON.parse(sessionStorage.getItem('user') as string) as firebase.User
  } catch (err) {
    return null
  }
}

export const store = new Store<StoreType>({
  user: currentUser()
})

firebase.auth().onAuthStateChanged(user => {
  store.update(s => {
    s.user = user
  })
})
