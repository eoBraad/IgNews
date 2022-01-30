import Head from 'next/head'
import styles from './style.module.scss'
import { GetStaticProps } from 'next'
import { getPrismicClient } from '../../services/prismic'
import Prismic from '@prismicio/client'
import { RichText } from 'prismic-dom'
import Link from 'next/link'

type Post = {
  slug: string,
  title: string,
  exerpt: string,
  updatedAt: string
}

interface postProps  {
  posts: Post[]
}

export default function Posts ({ posts } : postProps) {
  return (
    <>
      <Head>
        <title>Posts | Ignews</title>
      </Head>
      <main className={styles.container}>
        <div className={styles.posts}>
        {
          posts.map((posts) => {
            return (
             
              <Link href={`posts/${posts.slug}`} key={posts.slug}>
                <a>
                  <time>{posts.updatedAt}</time>
                  <strong>{posts.title}</strong>
                  <p>{posts.exerpt}</p>
                </a>
              </Link> 
            )
          })
        }
        </div>
      </main>
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient() 
  
  const response = await prismic.query([
    Prismic.predicates.at('document.type', 'posts')
  ], {
    fetch: ['publication.title', 'publication.content'],
    pageSize: 100
  })

  console.log(response.results)

  const posts = response.results.map((post) => {
    return {
      slug: post.uid,

      title: RichText.asText(post.data.tittle),

      exerpt: post.data.content.find(content => content.type === 'paragraph')?.text ?? '',

      updatedAt: new Date(post.last_publication_date).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      })
    }
  })

  return {
    props: {
      posts
    },
    revalidate: 60 * 60 * 24 //  24 hours
  }
}