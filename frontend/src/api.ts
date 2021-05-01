import { User } from '@firebase/auth-types'
import superagent from 'superagent'

export const BASE_URL = "http://localhost:9000/api/v1"
export const GET_USER_URL = "http://localhost:9000/api/v1/users"
export const GET_POSTS_URL = "http://localhost:9000/api/v1/posts"

export async function signIn(user: User) {
  const token = await user.getIdToken()
  return superagent.put(GET_USER_URL)
    .set({ authorization: `Bearer ${token}` })
    .send({ user }).then()
}

export function updateUser(user: User) {
  return superagent.post(GET_USER_URL).send({ user }).then()
}

export function getUser(id: number | string) {
  return superagent.get(`${GET_USER_URL}/${id}`).then()
}
