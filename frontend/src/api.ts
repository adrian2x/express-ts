import { User } from '@firebase/auth-types'
import superagent from 'superagent'

export const BASE_URL = "http://localhost:9000/api/v1"

export async function signIn(user: User) {
  const token = await user.getIdToken()
  return superagent.put(`${BASE_URL}/users`)
    .set({ authorization: `Bearer ${token}` })
    .send({ user }).then()
}

export function updateUser(user: User) {
  return superagent.post(`${BASE_URL}/users`).send({ user }).then()
}

export async function signOut(user: User) {
  const token = await user.getIdToken()
  return superagent
    .post(`${BASE_URL}/signOut`)
    .set({ authorization: `Bearer ${token}` })
    .send({ user }).then()
}

export function getUser(id: number | string) {
  return superagent.get(`${BASE_URL}/users/${id}`).then()
}
