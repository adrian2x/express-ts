import {
  IonButtons,
  IonButton,
  IonContent,
  IonInput,
  IonPage,
  IonTextarea,
  IonToolbar,
} from '@ionic/react'
import { useState } from 'react'
import Navbar from '../../../components/Navbar'
import { createPost } from '../../../lib/api'
import firebase from '../../../lib/firebase'

import './NewPost.scss'

export default function NewPost({ user }: { user: firebase.User }) {
  let [post, setPost] = useState<any>({})

  return (
    <IonPage>
      <Navbar />
      <IonContent>
        <form
          action="#"
          className="container new-post"
          onSubmit={(e) => {
            e.preventDefault()
            createPost(
              Object.assign(post, {
                published: true,
              }),
              user
            )
          }}
        >
          <IonInput
            autoCapitalize="on"
            autoCorrect="on"
            autofocus
            type="text"
            maxlength={500}
            minlength={2}
            placeholder="Your post title..."
            required
            spellCheck
            className="post_title"
            onIonChange={(e) => {
              setPost(Object.assign(post, { title: e.detail.value! }))
            }}
          />
          <section className="post_content">
            <IonTextarea
              autoGrow
              minlength={1}
              autoCorrect="on"
              placeholder="What would you like to say?"
              rows={6}
              required
              onIonChange={(e) => {
                setPost(Object.assign(post, { content: e.detail.value! }))
              }}
            />
          </section>
          <section>
            <IonButton fill="solid" type="submit">
              Create
            </IonButton>
          </section>
        </form>
      </IonContent>
    </IonPage>
  )
}
