import { RouteComponentProps } from 'react-router-dom'
import {
  IonButtons,
  IonButton,
  IonContent,
  IonInput,
  IonPage,
  IonTextarea,
  NavContext,
} from '@ionic/react'
import React, { useCallback, useState, useContext } from 'react'
import Navbar from '../../../components/Navbar'
import { PostForm } from './NewPost'

import { editPost, GET_POSTS_URL } from '../../../lib/api'
import firebase from '../../../lib/firebase'
import { Post } from '../../../lib/types'

import './NewPost.scss'
import './EditPost.scss'
import useFetch from '../../../hooks/useFetch'

enum PostType {
  comment = 'comment',
}

export default function EditPost({
  match: { params },
  history,
  user,
  type,
}: {
  user: firebase.User
  type?: PostType
} & RouteComponentProps<any>) {
  const { navigate } = useContext(NavContext)

  const { loading, response, error } = useFetch<Post>(
    `${GET_POSTS_URL}/${params.id}`,
    [params]
  )

  const handleSubmit = useCallback(async (post: Post) => {
    let res = await editPost(post, user)
    navigate(`/post/${post.id}`)
  }, [])

  return (
    <IonPage>
      <Navbar />
      <IonContent>
        <PostForm
          value={response!}
          contentOnly={type === PostType.comment}
          onSubmit={handleSubmit}
        />
      </IonContent>
    </IonPage>
  )
}
