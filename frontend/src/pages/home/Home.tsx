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
import FirebaseAuth from '../../components/FirebaseAuth'
import Navbar from '../../components/Navbar'

import './Home.scss'

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
