// ** Next Imports
import Head from 'next/head'
import { Router, useRouter } from 'next/router'

// ** import Redux

import { Provider, useDispatch } from 'react-redux'
import { store } from './redux/store'

// ** Loader Import
import NProgress from 'nprogress'

// ** Emotion Imports
import { CacheProvider } from '@emotion/react'
import { CookiesProvider } from 'react-cookie'
import AuthMiddleware from 'src/helpers/AuthMiddleware'
import MessageMiddleware from 'src/helpers/MessageMiddleware'

// ** Config Imports
import themeConfig from 'src/configs/themeConfig'

// ** Component Imports
import UserLayout from 'src/layouts/UserLayout'
import ThemeComponent from 'src/@core/theme/ThemeComponent'

// ** Contexts
import { SettingsConsumer, SettingsProvider } from 'src/@core/context/settingsContext'

// ** Utils Imports
import { createEmotionCache } from 'src/@core/utils/create-emotion-cache'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

// ** React Perfect Scrollbar Style
import 'react-perfect-scrollbar/dist/css/styles.css'

// ** Global css styles
import '../../styles/globals.scss'
import '../../styles/variables.scss'

const clientSideEmotionCache = createEmotionCache()

// ** Pace Loader
if (themeConfig.routingLoader) {
  Router.events.on('routeChangeStart', () => {
    NProgress.start()
  })
  Router.events.on('routeChangeError', () => {
    NProgress.done()
  })
  Router.events.on('routeChangeComplete', () => {
    NProgress.done()
  })
}

// ** Configure JSS & ClassName
const App = props => {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props

  // Variables
  const getLayout = Component.getLayout ?? (page => <UserLayout>{page}</UserLayout>)

  return (
    <Provider store={store}>
      <CacheProvider value={emotionCache}>
        <CookiesProvider>
          <Head>
            <title>{`${themeConfig.templateName} - ZELLA`}</title>
            <meta name='description' content={`${themeConfig.templateName} – ZELLA`} />
            <meta name='keywords' content='MERN ZELLA Trust AVAWATZ' />
            <meta name='viewport' content='initial-scale=1, width=device-width' />
          </Head>
          <ToastContainer limit={5} autoClose={2000} />
          <SettingsProvider>
            <SettingsConsumer>
              {({ settings }) => {
                return (
                  <ThemeComponent settings={settings}>
                    {/* <AuthMiddleware> */}
                      {/* <MessageMiddleware> */}
                        {getLayout(<Component {...pageProps} />)}
                      {/* </MessageMiddleware> */}
                    {/* </AuthMiddleware> */}
                  </ThemeComponent>
                )
              }}
            </SettingsConsumer>
          </SettingsProvider>
        </CookiesProvider>
      </CacheProvider>
    </Provider>
  )
}

export default App
