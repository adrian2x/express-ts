import {
  IonAvatar,
  IonButtons,
  IonContent,
  IonHeader,
  IonItem,
  IonMenuButton,
  IonPage,
  IonTitle,
  IonToolbar,
} from '@ionic/react'
import { User } from '@firebase/auth-types'
import UserMenu from '../components/UserMenu'

import useFirebase from '../hooks/useFirebase'

export default function Navbar({ user }: { user?: User }) {
  const { currentUser } = useFirebase({})

  return (
    <IonHeader>
      <IonToolbar>
        <IonTitle>Ionic App</IonTitle>
        <IonButtons slot="end">
          <UserMenu user={currentUser} />
        </IonButtons>
      </IonToolbar>
    </IonHeader>
  )
}
