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
  IonSkeletonText,
  IonButtons,
  IonButton,
  IonRouterLink,
  NavContext,
} from '@ionic/react'
import { useContext } from 'react'
import Navbar from '../../../components/Navbar'
import { Post } from '../../../lib/types'
import { GET_POSTS_URL } from '../../../lib/api'
import useFetch from '../../../hooks/useFetch'

import './Post.scss'
import { store } from '../../../lib/store'

interface PostPageProps
  extends RouteComponentProps<{
    id: string
  }> {}

export default function PostPage({
  match: { params },
  history,
}: PostPageProps) {
  const { loading, response, error } = useFetch<Post>(
    `${GET_POSTS_URL}/${params.id}`,
    [params]
  )

  return (
    <IonPage>
      <Navbar />
      <IonContent fullscreen>
        {loading && <EmptyState />}
        {response && <PostContent post={response} />}
      </IonContent>
    </IonPage>
  )
}

function EmptyState() {
  return (
    <div className="container single-post">
      <h1 className="post-title">
        <IonSkeletonText animated style={{ height: '1.625em' }} />
      </h1>
      <section className="meta-author">
        <IonItem slot="start" lines="none" className="ion-no-padding no-hover">
          <IonAvatar slot="start">
            <IonSkeletonText animated />
          </IonAvatar>
          <IonLabel>
            <h2>
              <IonSkeletonText animated style={{ width: '25%' }} />
            </h2>
            <h3>
              <IonSkeletonText animated style={{ width: '25%' }} />
            </h3>
          </IonLabel>
        </IonItem>
      </section>
      <section>
        <p>
          <IonSkeletonText animated style={{ width: '25%' }} />
        </p>
        <p className="post-content">
          <IonSkeletonText style={{ height: '250px' }} />
        </p>
      </section>
    </div>
  )
}

export function PostContent({ post }: { post: Post }) {
  const { author } = post
  const user = store.useState((s) => s.user)
  const { navigate } = useContext(NavContext)
  return (
    <div className="container single-post">
      <h1 className="post-title">{post.title}</h1>
      <section className="meta-author">
        <IonItem lines="none" className="ion-no-padding no-hover">
          {author && (
            <IonAvatar
              slot="start"
              onClick={(e) => {
                navigate(`/users/${author?.id}`)
              }}
            >
              <img src={author.photoURL!} alt={author.name} />
            </IonAvatar>
          )}
          <IonLabel>
            <h2>{author?.name}</h2>
            <h3>{format(new Date(post.createdAt), 'PPP')}</h3>
          </IonLabel>
          {user && author?.providerId === user.uid && (
            <IonButtons slot="end">
              <IonButton
                color="primary"
                fill="solid"
                routerLink={`/posts/${post.id}/update`}
              >
                Edit
              </IonButton>
              <IonButton
                color="danger"
                fill="outline"
                type="button"
                onClick={(e) => {
                  // TODO: delete request
                  navigate('/posts/')
                }}
              >
                Delete
              </IonButton>
            </IonButtons>
          )}
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
