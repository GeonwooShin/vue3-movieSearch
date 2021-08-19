import axios from 'axios'
import _uniqBy from 'lodash/uniqBy'

const _defaultMessage = 'Search for the movie title!'

export default {
  namespaced: true, // movie.js 가 하나의 스토어에서 모듈화돼서 사용될 수 있다는 것을 명시적으로 나타내는 옵션
  state: () => ({
    movies: [],
    message: 'Search for the movie title!',
    loading: false,
    theMovie: {}
  }),  // vue에서 data와 같은 역할 (실제로 취급해야하는 각각의 데이터를 의미)
  getters: {},  // vue에서 computed와 같은 역할 (계산된 데이터를 만들어내는 역할)
  mutations: {
    updateState(state, payload) {
      Object.keys(payload).forEach(key => {
        state[key] = payload[key]
      })
    },
    resetMovies(state) {
      state.movies = []
      state.message = _defaultMessage
      state.loading = false
    }
  },  // vue에서 methods와 같은 역할 (mutation을 통해서만 store의 데이터를 수정할 수 있다.)
  actions: {
    async searchMovies({ commit, state }, payload) {
      if (state.loading) {
        return
      }
      commit('updateState', {
        message: '',
        loading: true
      })
      try{
        const res = await _fetchMovie({
          ...payload,
          page: 1
        })
        const { Search, totalResults } = res.data
        commit('updateState', {
          movies: _uniqBy(Search, 'imdbID')
        })
  
        const total = parseInt(totalResults, 10)
        const pageLength = Math.ceil(total / 10)
        
        // 추가 요청
        if(pageLength > 1) {
          for(let page = 2; page <= pageLength; page += 1) {
            if (page > payload.number / 10) {
              break
            }
            const res = await _fetchMovie({
              ...payload,
              page
            })
            const { Search } = res.data
            commit('updateState', {
              movies: [...state.movies, ..._uniqBy(Search,'imdbID')]
            })
          }
        }
      } catch({ message }) {
        commit('updateState', {
          movies: [],
          message
        })
      } finally {
        commit('updateState', {
          loading: false
        })
      }
    },
    async searchMovieWithId({ state, commit }, payload) {
      if (state.loading) return

      commit('updateState', {
        theMovie: {},
        loading: true
      })

      try {
        const res = await _fetchMovie(payload)
        commit('updateState', {
          theMovie: res.data
        })
      } catch(error) {
        commit('updateState', {
          theMovie: {}
        })
      } finally {
        commit('updateState', {
          loading: false
        })
      }
    }
  } // vue에서 methods와 같은 역할 (비동기로 처리된다)
}

async function _fetchMovie(payload) {
  return await axios.post('/.netlify/functions/movie', payload)
}