import React from 'react'
import { useDispatch } from 'react-redux'
import { useRouter } from 'next/router'
import { useCookies } from 'react-cookie'
import { userApi } from '../pages/redux/apis/userApi'
import FullScreenLoader from 'src/@core/components/FullScreenLoader'
import LoginPage from '../pages/login'
import BlankLayout from 'src/@core/layouts/BlankLayout'
import { useEffect, useState } from 'react'

const AuthMiddleware = ({ children }) => {

  const [cookies, setCookie, removeCookie] = useCookies(['authToken'])
  const [token, setToken] = useState(null)
  const router = useRouter()

  const dispatch = useDispatch()

  useEffect(() => {
    const handleCookieChange = () => {
      setToken(localStorage.getItem("token"))
    }
    handleCookieChange()
  })
  const publicPaths = ['/register/', '/login/', '/register', '/login']

  const { isLoading, isFetching, isSuccess, isError } = userApi.endpoints.getMe.useQuery(null, {
    skip: !cookies.authToken,
    refetchOnMountOrArgChange: true
  })

  const data = userApi.endpoints.getMe.useQueryState(null, {
    selectFromResult: ({ data }) => data
  })
  const user = data?.user
  const configs = data?.configs
  const loading = isLoading || isFetching

  if (loading) {
    return <FullScreenLoader />
  }

  if (publicPaths.indexOf(router.pathname) > -1) return children

  if (token) {
    return children
  } else {
    return (
      <BlankLayout>
        <LoginPage />
      </BlankLayout>
    )
  }

}

export default AuthMiddleware
