// Script to create admin user
import { initializeApp } from 'firebase/app'
import { getFirestore, setDoc, doc } from 'firebase/firestore'
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'
import readline from 'readline'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const db = getFirestore(app)
const auth = getAuth(app)

// Create readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

// Prompt for email and password
rl.question('Enter admin email: ', (email) => {
  rl.question('Enter admin password: ', async (password) => {
    try {
      // Sign in with provided credentials
      console.log(`Signing in as ${email}...`)
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      const user = userCredential.user

      // Set admin privileges in Firestore
      console.log(`Setting admin privileges for user: ${user.uid}`)
      await setDoc(doc(db, 'users', user.uid), {
        email: user.email,
        admin: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })

      console.log('Success! User has been granted admin privileges.')
    } catch (error) {
      console.error('Error:', error.message)
    } finally {
      rl.close()
      process.exit(0)
    }
  })
})
