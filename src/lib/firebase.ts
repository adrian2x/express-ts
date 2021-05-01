import * as admin from 'firebase-admin'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const firebase = admin.initializeApp({
  // TODO: your firebase config here
})

export async function firebaseAuth(req, res, next) {
  req.firebase = firebase
  let authToken
  const { headers, cookies } = req
  if (headers.authorization) {
    authToken = headers.authorization
  } else if (cookies.session) {
    authToken = cookies.session
  }
  if (authToken) {
    req.auth = await admin.auth().verifyIdToken(authToken)
  }
  next()
}

/** Route validatior to enforce firebase verification */
export async function withAuth(req, res, next) {
  try {
    // Validate that we authenticated via firebase
    if (!req.auth) throw Error('Auth token is invalid or expired')

    /** (Optional) Extend Firebase using models.
     * Firebase provides displayName, email, phoneNumber, photoURL, emailVerified and some
     * provider specific data. We can expand on that here with our own User model
     */
    req.getUser = async () => {
      if (req.user) return req.user
      req.user = await prisma.user.findFirst({
        where: { providerId: req.auth.uid },
      })
      return req.user
    }

    return next()
  } catch (err) {
    return res.status(401).send({ error: err })
  }
}
