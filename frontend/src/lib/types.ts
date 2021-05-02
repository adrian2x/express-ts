import { User as FirebaseUser } from '@firebase/auth-types'

export type AuthUser = FirebaseUser

export interface Post {
  id: Number
  createdAt: Date
  updatedAt: Date
  title?: string
  content: string
  authorId: number
  author?: User
  replies?: Post[]
}

export interface User {
  id: Number
  createdAt: Date
  updatedAt: Date
  name?: string // our model name
  providerId?: string // firebase.uid
  displayName: string | null // firebase.displayName
  email: string
  phoneNumber: string | null
  photoURL?: string
  role: string
  posts?: Post[]
}