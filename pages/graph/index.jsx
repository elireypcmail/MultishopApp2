import Graph from '@c/Graph'
import { getCookie } from '@g/cookies'

export default function ViewGraph() {
  return(
    <Graph />
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