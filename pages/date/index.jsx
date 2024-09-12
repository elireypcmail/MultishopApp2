import Date  from '@c/Date'
import { getCookie } from '@g/cookies'

export default function Dash() {
  return(
    <Date />
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