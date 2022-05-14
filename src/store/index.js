import { createLogger, createStore } from 'vuex'
import music from './modules/music'
import { getters } from './getters'

const debug = process.env.NODE_ENV !== 'production'

export default createStore({
  getters,
  modules: {
    music
  },
  strict: debug,
  plugins: debug ? [createLogger()] : []
})
