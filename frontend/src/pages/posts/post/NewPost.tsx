import cl from 'classnames'
import {
  IonButtons,
  IonButton,
  IonContent,
  IonInput,
  IonPage,
  IonTextarea,
  NavContext,
  IonRow,
  IonCol,
  IonGrid,
} from '@ionic/react'
import { useCallback, useState, useContext, useEffect } from 'react'
import Navbar from '../../../components/Navbar'
import { createPost } from '../../../lib/api'
import firebase from '../../../lib/firebase'
import { Post } from '../../../lib/types'

import './NewPost.scss'

export default function NewPost({ user }: { user: firebase.User }) {
  const { navigate } = useContext(NavContext)

  const handleSubmit = useCallback(async (post) => {
    let res = await createPost(
      Object.assign(post, {
        published: true,
      }),
      user
    )
    navigate(`/post/${res.id}`)
  }, [])

  return (
    <IonPage>
      <Navbar />
      <IonContent>
        <PostForm onSubmit={handleSubmit} contentOnly={false} />
      </IonContent>
    </IonPage>
  )
}

export function PostForm({
  value = {} as Post,
  onSubmit,
  contentOnly = false,
  rows = 6,
  placeholder = 'What would you like to say?',
}: {
  value?: Post
  onSubmit: (post: Post) => Promise<any>
  contentOnly: boolean
  rows?: number
  placeholder?: string
}) {
  let [isSubmitting, setIsSubmitting] = useState(false)

  console.log('initial post', value)

  return (
    <form
      action="#"
      className="container new-post"
      onSubmit={async (e) => {
        e.preventDefault()
        try {
          console.log(value)
          setIsSubmitting(true)
          onSubmit(value)
        } finally {
          setIsSubmitting(false)
        }
      }}
    >
      {!contentOnly && (
        <IonInput
          disabled={isSubmitting}
          value={value.title ?? ''}
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
            Object.assign(value, { title: e.detail.value! })
          }}
        />
      )}
      <section className={cl('post_content', { content_only: contentOnly })}>
        <IonTextarea
          disabled={isSubmitting}
          value={value.content ?? ''}
          autoGrow
          minlength={1}
          autoCorrect="on"
          placeholder={placeholder}
          rows={rows ?? (contentOnly ? 2 : 6)}
          required
          onIonChange={(e) => {
            Object.assign(value, { content: e.detail.value! })
          }}
        />
      </section>
      <IonGrid>
        <IonRow className="ion-justify-content-end">
          <div>
            <IonButton
              slot="end"
              color="primary"
              fill="solid"
              type="submit"
              disabled={isSubmitting}
            >
              Submit
            </IonButton>
          </div>
        </IonRow>
      </IonGrid>
    </form>
  )
}
