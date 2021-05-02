import {
  IonItem,
  IonAvatar,
  IonList,
  IonListHeader,
  IonPopover,
  NavContext,
} from '@ionic/react'
import React, { useContext, useState } from 'react'
import { signOut } from '../lib/firebase'
import { AuthUser } from '../lib/types'

export default function UserMenu({ user }: { user?: AuthUser | null }) {
  const [popoverState, setShowPopover] = useState({
    showPopover: false,
    event: undefined,
  })

  const { navigate } = useContext(NavContext)

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
                signOut().then(() => {
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
          className="user-menu-avatar"
          onClick={(e: any) => {
            console.log(user)
            if (user) {
              e.persist()
              setShowPopover({ showPopover: true, event: e })
            } else {
              navigate('/')
            }
          }}
        >
          <img
            alt="Account"
            src={user?.photoURL ?? 'https://gravatar.com/avatar/?d=mp'}
          />
        </IonAvatar>
      </IonItem>
    </>
  )
}
