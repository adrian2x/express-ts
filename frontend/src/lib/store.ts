import { Store } from 'pullstate'
import firebase from "./firebase"

interface StoreType {
  user: firebase.User | null
}

let currentUser = sessionStorage.getItem('user')
if (currentUser) currentUser = JSON.parse(currentUser)
export { currentUser }

export const store = new Store<StoreType>({
  user: firebase.auth().currentUser
})

firebase.auth().onAuthStateChanged(async (user) => {
  if (user) {
    store.update(s => {
      s.user = user
    })
  } else {
    store.update(s => {
      s.user = null
    })
  }
})