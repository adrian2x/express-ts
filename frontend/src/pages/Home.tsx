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
import Navbar from '../components/Navbar'
import useFirebase from '../hooks/useFirebase'

const Home: React.FC = () => {
  return (
    <IonPage>
      <Navbar />
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Blank</IonTitle>
          </IonToolbar>
        </IonHeader>
        <FirebaseAuth />
      </IonContent>
    </IonPage>
  )
}

export default Home
