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
import React, { useState } from 'react'
import { User } from '@firebase/auth-types'
import FirebaseAuth from '../components/FirebaseAuth'

import './Home.css'
import UserMenu from '../components/UserMenu'

const Home: React.FC = () => {
  const [user, setUser] = useState<User | undefined>(undefined)

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Ionic App</IonTitle>
          <IonButtons slot="end">
            <UserMenu user={user} />
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Blank</IonTitle>
          </IonToolbar>
        </IonHeader>
        <FirebaseAuth signedInSuccess={(user: User) => setUser(user)} />
      </IonContent>
    </IonPage>
  )
}

export default Home
