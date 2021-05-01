
export interface Post {
  id: Number
  createdAt: Date
  updatedAt: Date
  title?: string
  content: string
  author?: User
  authorId: number
  replies?: Post[]
}

export interface User {
  id: Number
  createdAt: Date
  updatedAt: Date
  name?: string // our model name
  displayName?: string // firebase's displayName
  email: string
  phoneNumber?: string
  photoURL?: string
  role: string
  posts?: Post[]
}
