import Modal from "@a/components/Modal"
import { getCookie } from '@g/cookies'

export default function ListCategory() {
  return (
    <Modal />
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