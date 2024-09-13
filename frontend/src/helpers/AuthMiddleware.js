import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useRouter } from 'next/router'
import { useCookies } from 'react-cookie'
import { userApi } from '../pages/redux/apis/userApi'
import { configApi } from '../pages/redux/apis/configApi'
import FullScreenLoader from 'src/@core/components/FullScreenLoader'
import LoginPage from '../pages/login'
import BlankLayout from 'src/@core/layouts/BlankLayout'
import { useGetAllConfigsQuery } from 'src/pages/redux/apis/configApi'
import { switchMode } from 'src/pages/redux/features/siteSettingSlice'
import { useEffect } from 'react'
import { TRUST_MODE } from 'src/constants'

const AuthMiddleware = ({ children }) => {
  const [cookies] = useCookies(['logged_in'])
  const router = useRouter()

  /**
   * @author QmQ
   * @content using router url, switch online and offline
   */
  const dispatch = useDispatch()
  useEffect(() => {
    if (router.pathname.includes('offline')) {
      dispatch(switchMode(TRUST_MODE.offline))
    } else {
      dispatch(switchMode(TRUST_MODE.online))
    }
  }, [router.pathname])

  const publicPaths = ['/register/', '/login/', '/register', '/login']

  const { isLoading, isFetching, isSuccess, isError } = userApi.endpoints.getMe.useQuery(null, {
    skip: !cookies.logged_in,
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

  if (cookies.logged_in || user) {
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
