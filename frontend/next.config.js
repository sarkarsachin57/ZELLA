const path = require('path')

module.exports = {
  trailingSlash: true,
  reactStrictMode: false,
  experimental: {
    esmExternals: false,
    jsconfigPaths: true // enables it for both jsconfig.json and tsconfig.json
  },
  webpack: config => {
    config.resolve.alias = {
      ...config.resolve.alias,
      apexcharts: path.resolve(__dirname, './node_modules/apexcharts-clevision')
    }

    return config
  },
  sassOptioins: {
    includePaths: [path.join(__dirname, 'styles')],
  },
  env: {
    APPNAME: "ZELLA",
    APPVERSION: "Version 1.0",
    PROJECT_STATUS: "development",
    REACT_APP_SERVER_ENDPOINT: "http://localhost:8000",
    FLASK_APP_SERVER_ENDPOINT: 'http://localhost:5000',
  },

  // async redirects() {
  //   return [
  //     {
  //       source: '/',
  //       destination: '/live-view',
  //       permanent: true,
  //     },
  //   ]
  // },
}
