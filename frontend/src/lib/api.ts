import Cookie from 'js-cookie'
import superagent from 'superagent'
import { AuthUser, Post } from './types'

export const BASE_URL = "http://localhost:9000/api/v1"
export const GET_USER_URL = "http://localhost:9000/api/v1/users"
export const GET_POSTS_URL = "http://localhost:9000/api/v1/posts"

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
    .set('Authorization', await user.getIdToken())
    .send({ post }).then()
}
