import {
  IonAvatar,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonItem,
  IonMenuButton,
  IonPage,
  IonTitle,
  IonToolbar,
} from '@ionic/react'
import UserMenu from '../components/UserMenu'
import { store } from '../lib/store'
import { AuthUser } from '../lib/types'

export default function Navbar({ user }: { user?: AuthUser }) {
  const currentUser = store.useState((s) => s.user)

  return (
    <IonHeader>
      <IonToolbar>
        <IonTitle>Ionic App</IonTitle>
        <IonButtons slot="secondary">
          <IonButton routerLink="/posts">Posts</IonButton>
        </IonButtons>
        <IonButtons slot="end">
          <UserMenu user={currentUser} />
        </IonButtons>
      </IonToolbar>
    </IonHeader>
  )
}
