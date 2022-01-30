import { GetStaticProps } from "next"
import { RichText } from "prismic-dom"
import { getPrismicClient } from "../../../services/prismic"
import Head from 'next/head'
import styles from '../post.module.scss'
import Link from "next/link"
import { useRouter } from "next/router"
import { useSession } from 'next-auth/client'
import { useEffect } from "react"


type PostPreviewProps = {
  slug: string,
  content: string,
  title: string,
  updatedAt: string
}

interface PostPreview {
  posts: PostPreviewProps,
}

export default function PostPreview ({ posts }: PostPreview) {
  const [session] = useSession()
  const router = useRouter()

  useEffect(() => {
    if(session?.activeSubscription) {
      router.push(`/posts/${posts.slug}`)
    }
  }, [session])
  return (
    <div>
      <Head>
        <title>{`${posts.title} | igNews`}</title>
      </Head>
      <main className={styles.container}>
        <article className={styles.post}>
          <h1>{posts.title}</h1>
          <time>{posts.updatedAt}</time>
          <div 
          dangerouslySetInnerHTML={{ __html: posts.content}} 
          className={`${styles.content} ${styles.previewContent}`}
          >
          </div>

          <div className={styles.continueReading}>
            Wanna continue reading?
            <Link href='/'>
              <a href="">Subscribe now 🤗</a>
            </Link>
          </div>
        </article>
      </main>
      
    </div> 
  )
}

export const getStaticPaths = () => {
   return {
     paths: [],
    fallback: 'blocking'
   }
}

export const getStaticProps: GetStaticProps = async ({ params}) => {
  const {slug} = params


  const prismic = getPrismicClient()

  const trueSlug = String(slug)

  const response = await prismic.getByUID('posts', trueSlug, {})

  const posts = {
    slug,
    title: RichText.asText(response.data.tittle),
    content: RichText.asHtml(response.data.content.splice(0, 4)),
    updatedAt: new Date(response.last_publication_date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    })
  }
  return {
    props: {
      posts
    }
  }
}