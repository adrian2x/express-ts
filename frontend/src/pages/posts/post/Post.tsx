import { format, formatRelative } from 'date-fns'
import { RouteComponentProps } from 'react-router-dom'
import {
  IonSpinner,
  IonList,
  IonIcon,
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
  IonTextarea,
  NavContext,
} from '@ionic/react'
import { trashOutline } from 'ionicons/icons'
import { useContext, useEffect, useState } from 'react'
import Navbar from '../../../components/Navbar'
import { Post } from '../../../lib/types'
import {
  addReply,
  createPost,
  deletePost,
  editPost,
  GET_POSTS_URL,
} from '../../../lib/api'
import useFetch from '../../../hooks/useFetch'

import './Post.scss'
import { store } from '../../../lib/store'
import { PostForm } from './NewPost'
import { md2html } from '../../../lib/md2html'

interface PostPageProps
  extends RouteComponentProps<{
    id: string
  }> {}

export default function PostPage({
  match: { params },
  history,
}: PostPageProps) {
  const user = store.useState((s) => s.user)
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
  const [replies, setReplies] = useState<Post[]>(post.replies!)
  const user = store.useState((s) => s.user)
  const { navigate } = useContext(NavContext)
  useEffect(() => {
    setReplies(post.replies!)
  }, [post])
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
            <PostToolbar
              type="comment"
              onEdit={() => navigate(`/posts/${post.id}/update`)}
              onDelete={() => {
                let ok = window.confirm(
                  'Are you sure you want to delete this post?'
                )
                ok && deletePost(post.id, user).then(() => navigate('/posts/'))
              }}
            />
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
          dangerouslySetInnerHTML={{ __html: md2html(post.content) }}
        ></p>
      </section>

      {user && (
        <section className="post_reply">
          <PostForm
            rows={1}
            contentOnly
            placeholder="Add a comment..."
            onSubmit={async (newPost) => {
              // TODO: on new comment update parent post
              return addReply(post.id, newPost, user).then((post) => {
                console.log('post', post)
                setReplies(post.replies!)
              })
            }}
          />
        </section>
      )}

      <section className="post_comments">
        {replies.map((post) => (
          <PostComment key={String(post.id)} post={post} />
        ))}
      </section>
    </div>
  )
}

export function PostToolbar({
  type,
  onEdit,
  onDelete,
}: {
  type?: string
  onEdit: () => any
  onDelete: () => any
}) {
  return (
    <IonButtons slot="end" className="post_meta_actions">
      <IonButton color="primary" size="small" onClick={(e) => onEdit()}>
        Edit
      </IonButton>
      <IonButton
        color="danger"
        size="small"
        type="button"
        onClick={(e) => onDelete()}
      >
        <IonIcon icon={trashOutline} />
      </IonButton>
    </IonButtons>
  )
}

export function PostComment({ post }: { post: Post }) {
  const { author } = post
  const [isDeleted, setIsDeleted] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [currentPost, setCurrentPost] = useState(post)
  const user = store.useState((s) => s.user)
  const { navigate } = useContext(NavContext)
  if (isDeleted) return null
  return (
    <div id={String(post.id)} className="post_content">
      <section className="meta-author">
        <IonItem lines="none" className="ion-no-padding no-hover">
          {author && (
            <IonAvatar
              slot="start"
              className="post_reply_author"
              onClick={(e) => {
                navigate(`/users/${author?.id}`)
              }}
            >
              <img src={author.photoURL!} alt={author.name} />
            </IonAvatar>
          )}
          <IonLabel>
            <h3>
              <strong>{author?.name}</strong>,{' '}
              <span className="post_date_rel">
                {formatRelative(new Date(currentPost.updatedAt), new Date())}
              </span>
            </h3>
          </IonLabel>
          {user && author?.providerId === user.uid && (
            <PostToolbar
              onEdit={() => setIsEditing(true)}
              onDelete={() => {
                let ok = window.confirm(
                  'You sure you want to delete this post?'
                )
                ok &&
                  deletePost(post.id, user).then(() => {
                    setIsDeleted(true)
                  })
              }}
            />
          )}
        </IonItem>
      </section>
      <section className="post-content">
        {!isEditing ? (
          <p
            dangerouslySetInnerHTML={{ __html: md2html(currentPost.content) }}
          ></p>
        ) : (
          <form
            action={`#${post.id}`}
            onSubmit={(e) => {
              e.preventDefault()
              editPost(currentPost, user!).then((post) => {
                setCurrentPost(post)
                setIsEditing(false)
              })
            }}
          >
            <IonTextarea
              value={currentPost.content}
              autoGrow
              autofocus
              minlength={1}
              autoCorrect="on"
              required
              debounce={200}
              onIonChange={(e) => {
                if (e.detail.value) {
                  Object.assign(currentPost, { content: e.detail.value })
                }
              }}
            />
            <IonButtons slot="end" className="post_save">
              <IonButton
                size="small"
                color="primary"
                fill="solid"
                type="submit"
              >
                Submit
              </IonButton>
              <IonButton
                size="small"
                type="button"
                onClick={(e) => {
                  setIsEditing(false)
                  setCurrentPost(post)
                }}
              >
                Cancel
              </IonButton>
            </IonButtons>
          </form>
        )}
      </section>
    </div>
  )
}
