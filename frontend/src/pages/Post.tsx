import { format } from 'date-fns'
import { RouteComponentProps } from 'react-router-dom'
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
import Navbar from '../components/Navbar'
import { Post } from '../types'
import { GET_POSTS_URL } from '../api'
import useFetch from '../hooks/useFetch'

import './Post.scss'

interface PostPageProps
  extends RouteComponentProps<{
    id: string
  }> {}

export default function PostPage({ match, history }: PostPageProps) {
  const { loading, response, error } = useFetch<Post>(
    `${GET_POSTS_URL}/${match.params.id}`
  )

  return (
    <IonPage>
      <Navbar />
      <IonContent fullscreen>
        {loading && (
          <div>
            <IonSpinner />
          </div>
        )}
        {response && <PostContent post={response} />}
      </IonContent>
    </IonPage>
  )
}

export function PostContent({ post }: { post: Post }) {
  const { author } = post
  return (
    <div className="container single-post">
      <h1 className="post-title">{post.title}</h1>
      <section className="meta-author">
        <IonItem
          slot="start"
          routerLink={`/users/${author?.id}`}
          lines="none"
          className="ion-no-padding no-hover"
        >
          {author && (
            <IonAvatar slot="start">
              <img src={author.photoURL} alt={author.name} />
            </IonAvatar>
          )}
          <IonLabel>
            <h2>{author?.name}</h2>
            <h3>{format(new Date(post.createdAt), 'PPP')}</h3>
          </IonLabel>
        </IonItem>
      </section>
      <section>
        {author?.name && (
          <p>
            <em>By {author?.name}</em>
          </p>
        )}
        <p
          className="post-content"
          dangerouslySetInnerHTML={{ __html: post.content }}
        ></p>
      </section>
    </div>
  )
}
