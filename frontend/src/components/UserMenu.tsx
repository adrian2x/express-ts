import {
  IonItem,
  IonAvatar,
  IonList,
  IonListHeader,
  IonPopover,
} from '@ionic/react'
import React, { useState } from 'react'
import { User } from '@firebase/auth-types'
import { firebase } from './FirebaseAuth'

export default function UserMenu({ user }: { user?: User }) {
  const [popoverState, setShowPopover] = useState({
    showPopover: false,
    event: undefined,
  })

  return (
    <>
      <IonItem>
        <IonPopover
          cssClass="user-menu-popover"
          event={popoverState.event}
          isOpen={popoverState.showPopover}
          showBackdrop={false}
          onDidDismiss={() =>
            setShowPopover({ showPopover: false, event: undefined })
          }
        >
          {/* This is the popover content */}
          <IonList>
            <IonListHeader>{user?.displayName}</IonListHeader>
            <IonItem button>Account</IonItem>
            <IonItem button>Settings</IonItem>
            <IonItem
              button
              onClick={(e) => {
                setShowPopover({ showPopover: false, event: undefined })
                firebase
                  .auth()
                  .signOut()
                  .then(() => {
                    window.location.assign('/')
                  })
              }}
            >
              Sign Out
            </IonItem>
          </IonList>
        </IonPopover>
        <IonAvatar
          slot="end"
          onClick={(e: any) => {
            console.log(user)
            if (user) {
              e.persist()
              setShowPopover({ showPopover: true, event: e })
            }
          }}
        >
          <img
            alt="Account"
            src={
              user?.photoURL ??
              'https://gravatar.com/avatar/dba6bae8c566f9d4041fb9cd9ada7741?d=identicon&f=y'
            }
          />
        </IonAvatar>
      </IonItem>
    </>
  )
}
