import Cookie from 'js-cookie'
import superagent from 'superagent'
import { AuthUser, Post } from './types'

export const BASE_URL = "http://localhost:9000/api/v1"
export const GET_USER_URL = "http://localhost:9000/api/v1/users"
export const GET_POSTS_URL = "http://localhost:9000/api/v1/posts"
export const POST_POST_REPLY = "http://localhost:9000/api/v1/reply"

export async function signIn(user: AuthUser) {
  return superagent.put(GET_USER_URL)
    .send({ user }).then()
}

export function updateUser(user: AuthUser) {
  return superagent.post(GET_USER_URL).send({ user }).then()
}

export function getUser(id: number | string) {
  return superagent.get(`${GET_USER_URL}/${id}`).then()
}

export async function createPost(post: Post, user: AuthUser) {
  return superagent.put(GET_POSTS_URL)
    .set('Authorization', user.uid)
    .send({ post }).then(res => res.body)
}

export async function editPost(post: Post, user: AuthUser) {
  return superagent.post(`${GET_POSTS_URL}/${post.id}`)
    .set('Authorization', user.uid)
    .send({ post }).then(res => res.body)
}

export async function deletePost(id: Number, user: AuthUser) {
  return superagent.delete(`${GET_POSTS_URL}/${id}`)
    .set('Authorization', user.uid)
    .send({}).then(res => res.body)
}

export async function addReply(id: Number, post: Post, user: AuthUser): Promise<Post> {
  return superagent.post(`${POST_POST_REPLY}/${id}`)
    .set('Authorization', user.uid)
    .send({ post }).then(res => res.body)
}
