import { GetServerSideProps } from "next"
import { getSession } from 'next-auth/client'
import { RichText } from "prismic-dom"
import { getPrismicClient } from "../../services/prismic"
import Head from 'next/head'
import styles from './post.module.scss'


type Post = {
  slug: string,
  content: string,
  title: string,
  updatedAt: string
}

interface postProps {
  posts: Post,
}

export default function Post({ posts }: postProps) {
  return (
    <div>
      <Head>
        <title>{`${posts.title} | igNews`}</title>
      </Head>
      <main className={styles.container}>
        <article className={styles.post}>
          <h1>{posts.title}</h1>
          <time>{posts.updatedAt}</time>
          <div dangerouslySetInnerHTML={{ __html: posts.content}} className={styles.content}></div>
        </article>
      </main>
      
    </div> 
  )
}
export const getServerSideProps: GetServerSideProps = async ({ req, params}) => {
  const session = await getSession({ req })
  const {slug} = params

  
  
  if (!session?.activeSubscription) {

    return {
      redirect: {
        destination: '/',
        permanent: false,
      }
    }
  }

  const prismic = getPrismicClient(req)

  const trueSlug = String(slug)

  const response = await prismic.getByUID('posts', trueSlug, {})

  const posts = {
    slug,
    title: RichText.asText(response.data.tittle),
    content: RichText.asHtml(response.data.content),
    updatedAt: new Date(response.last_publication_date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    })
  }
  return {
    props: {
      posts
    },
    redirect: 60 * 30
  }
}