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
  IonSkeletonText,
  IonButtons,
  IonButton,
  IonIcon,
} from '@ionic/react'
import { addSharp } from 'ionicons/icons'
import { GET_POSTS_URL } from '../../lib/api'
import useFetch from '../../hooks/useFetch'
import { Post } from '../../lib/types'
import Navbar from '../../components/Navbar'

import './Posts.scss'

type GetPostsResponse = {
  data?: Post[]
}

export default function Posts() {
  const { loading, response, error } = useFetch<GetPostsResponse>(
    GET_POSTS_URL,
    {
      query: { sort: '-createdAt' },
    }
  )

  return (
    <IonPage>
      <Navbar />
      <IonContent fullscreen>
        <div className="container posts-list">
          <IonToolbar>
            <IonTitle>New topics</IonTitle>
            <IonButtons slot="end">
              <IonButton
                fill="outline"
                color="secondary"
                routerLink="/posts/new"
              >
                <IonIcon slot="start" icon={addSharp} />
                Create new
              </IonButton>
            </IonButtons>
          </IonToolbar>
          {loading && <EmptyState />}
          {response && <PostList posts={response!.data!} />}
        </div>
      </IonContent>
    </IonPage>
  )
}

function EmptyState() {
  return (
    <IonList className="container posts-list">
      {[1, 2, 3, 4].map((n) => (
        <IonItem key={n} lines="none">
          <IonLabel>
            <h2>
              <IonSkeletonText animated></IonSkeletonText>
            </h2>
            <p>
              <IonSkeletonText animated></IonSkeletonText>
            </p>
            <p>
              <IonSkeletonText animated style={{ width: '25%' }} />
            </p>
          </IonLabel>
        </IonItem>
      ))}
    </IonList>
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
