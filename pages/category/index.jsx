import Category from '@c/Category'
import { getCookie } from '@g/cookies'

export default function Code() {
  return (
    <Category />
  )
}

export const getServerSideProps = async ({ req }) => {
  const profileCookie = getCookie('instancia', req)

  if (!profileCookie) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }
  
  let data = null

  return {
    props: {
      data: data
    }
  }
}