import styles from './style.module.scss'

import {FaGithub} from 'react-icons/fa'
import {FiX} from 'react-icons/fi'

import { signIn, useSession, signOut } from 'next-auth/client'

export function SignInButton () { 
  const [session] = useSession()

  return session ? (
    <button 
    type='button' 
    className={styles.signInButton}
    onClick={() => signOut()}
    >

    <FaGithub color="#04D361"/>
      <p>{session.user.name}</p>
    <FiX className={styles.rightIcon}/>
    </button>
  ) : (
    <button 
    type='button' 
    className={styles.signInButton}
    onClick={() => signIn('github')}
    >
    <FaGithub color="#EBA417"/>
      <p>Sign In with GitHub</p>
    </button>
  )
}