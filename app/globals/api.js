import axios from "axios"

const instance = axios.create({
  // baseURL: 'http://localhost:4000',
  baseURL: 'https://multishop-app1-production.up.railway.app',
  headers: {
    Accept: "application/json"
  }
})

export default instance