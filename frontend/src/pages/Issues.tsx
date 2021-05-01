import { format } from 'date-fns'
import {
  IonSpinner,
  IonList,
  IonItem,
  IonLabel,
  IonListHeader,
  IonAvatar,
  IonPage,
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
} from '@ionic/react'
import { GET_POSTS_URL } from '../api'
import useFetch from '../hooks/useFetch'
import { Post } from '../types'
import Navbar from '../components/Navbar'

import './Issues.scss'

type GetPostsResponse = {
  data?: Post[]
}

export default function Issues() {
  const { loading, response, error } = useFetch<GetPostsResponse>(GET_POSTS_URL)

  if (loading) {
    return <IonSpinner />
  }

  return (
    <IonPage>
      <Navbar />
      <IonContent fullscreen>
        <div className="container posts-list">
          {loading && (
            <div className="loading-spinner">
              <IonSpinner />
            </div>
          )}
          {response && <PostList posts={response!.data!} />}
        </div>
      </IonContent>
    </IonPage>
  )
}

export function PostList({ posts }: { posts: Post[] }) {
  return (
    <IonList className="container posts-list">
      {posts.map((x) => (
        <IonItem
          key={String(x.id)}
          routerLink={`/post/${x.id}`}
          lines="none"
          className="post-example"
        >
          <IonLabel>
            <h2 className="post_title">{x.title}</h2>
            <p
              className="post_content"
              dangerouslySetInnerHTML={{ __html: x.content }}
            ></p>
            <p>
              {x.author?.name} on {format(new Date(x.createdAt), 'PPP')}
            </p>
          </IonLabel>
        </IonItem>
      ))}
    </IonList>
  )
}
