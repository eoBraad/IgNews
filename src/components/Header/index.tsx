import { SignInButton } from '../SignInButton'
import styles from './style.module.scss'
import Link from 'next/link'
import { ActiveLink } from '../LinkComponent'

export function Header () {
  return (
    <header className={styles.headerContainer}>
      <div className={styles.headerContent}>
        <img src="/images/logo.svg" alt="IgNews" />
        <nav>
          <ActiveLink href="/"  activeClassName={styles.active} >
            <a>Home</a>
          </ActiveLink>
          <ActiveLink href="/posts" prefetch activeClassName={styles.active}>
            <a>Posts</a>
          </ActiveLink>
        </nav>
        <SignInButton />
      </div>
    </header>
  )
}