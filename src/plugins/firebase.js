import firebase from 'firebase'
import 'firebase/firestore'
import 'firebase/storage'

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.configKey,
  authDomain: 'telephy-147d6.firebaseapp.com',
  databaseURL: 'https://telephy-147d6.firebaseio.com',
  projectId: 'telephy-147d6',
  storageBucket: 'telephy-147d6.appspot.com',
  messagingSenderId: '615030893220',
  appId: '1:615030893220:web:cc026e420b995de13c5431',
  measurementId: 'G-30RW8BKS2X',
}

// Initialize Firebase
firebase.initializeApp(firebaseConfig)

const db = firebase.firestore()
const auth = firebase.auth()
const storage = firebase.storage()

export { db, auth, storage }
