import { GetStaticProps } from 'next'

import Head from 'next/head'
import { SubscribeButton } from '../components/SubscribeButton'
import { stripe } from '../services/stripe'
import styles from '../styles/home.module.scss'

interface HomeProduct {
  product: {
    priceId: string,
    amount: number
  }
}

export default function Home({product}: HomeProduct) {
  return (
    <> 
      <Head>
        <title>Home | Ig.News</title>
      </Head>
      <main className={styles.homeContent}>
        <section>
          <span>👏 Hey, welcome</span>
          <h1>News about <br /> the <span>React</span> world</h1>
          <p>Get acess to all the publications <span>for {product.amount} month</span></p>
          <SubscribeButton priceId={product.priceId}/>
        </section>
        <img src="/Images/avatar.svg" alt="Coding React" />
      </main>
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const price = await stripe.prices.retrieve('price_1JumRNEcID6IkuOqcxpCvUtB', {
    expand: ['product']
  })

  const product = {
    priceId: price.id,
    amount: new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price.unit_amount / 100)
  }
    return {
      props: {
        product,
      },
      revalidate: 60 * 60 * 24 //  24 hours
    }
}
