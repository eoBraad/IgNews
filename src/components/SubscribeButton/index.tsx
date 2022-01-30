import styles from './style.module.scss'
import { useSession, signIn } from 'next-auth/client'
import { api } from '../../services/api'
import { getStripeJs } from '../../services/stripe-js'

interface SubscribeButtonProps {
  priceId: string,
}

export function SubscribeButton ({priceId}: SubscribeButtonProps) {
  const [session] = useSession()

  async function handleSubscribe () {
    if(!session) {
      signIn('github')
      return
    }

    try {
      const respose = await api.post('/subscribe') 

      const { sessionId } = respose.data
      
      const stripe = await getStripeJs()

      await stripe.redirectToCheckout({ sessionId })

    } catch (err) {
      alert(err.message)
    }
    
  }

  return  (
    <button 
      type="button" 
      className={styles.homeSubscribe}
      onClick={handleSubscribe}
    >
      Subscribe now
    </button>
  )
}