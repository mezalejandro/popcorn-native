import * as QualitySelectorConstants from 'components/QualitySelector/QualitySelectorConstants'

import * as HomeConstants from './HomeConstants'
import * as ItemConstants from '../Item/ItemConstants'

export default (state = HomeConstants.INITIAL_STATE, action) => {
  switch (action.type) {

    case HomeConstants.FETCH_ITEMS:
      return {
        ...state,
        isLoading  : true,
        hasInternet: true,
      }

    case HomeConstants.ERROR_NO_CON:
      return {
        ...state,
        isLoading  : false,
        hasInternet: false,
      }

    case HomeConstants.FETCHED_ITEMS:
      return {
        ...state,
        isLoading: false,
        modes    : {
          ...state.modes,
          [action.payload.mode]: {
            page : state.modes[action.payload.mode].page + 1,
            limit: state.modes[action.payload.mode].limit,
            items: [...state.modes[action.payload.mode].items, ...action.payload.items],
          },
        },
      }

    case HomeConstants.FETCH_MY_EPISODES:
      return {
        ...state,
        isLoading: false,
        modes    : {
          ...state.modes,
          myEpisodes: {
            ...state.modes.myEpisodes,
            fetching: true,
          },
        },
      }

    case QualitySelectorConstants.FETCHED_BETTER_FOR_MY_EPISODE:
      return {
        ...state,
        isLoading: false,
        modes    : {
          ...state.modes,
          myEpisodes: {
            ...state.modes.myEpisodes,
            items: state.modes.myEpisodes.items.map((item) => {
              if (item.id !== action.payload.episodeId) {
                return item
              }

              return {
                ...item,
                searchedForBetter: true,
                torrents         : action.payload.newTorrents,
              }
            }),
          },
        },
      }

    case QualitySelectorConstants.FETCHED_BETTER_FOR_MOVIE:
      return {
        ...state,
        isLoading: false,
        modes    : {
          ...state.modes,
          movie: {
            ...state.modes.movie,
            items: state.modes.movie.items.map((item) => {
              if (item.id !== action.payload.item.id) {
                return item
              }

              return {
                ...item,
                searchedForBetter: true,
                torrents         : action.payload.newTorrents,
              }
            }),
          },
        },
      }

    case HomeConstants.REFRESH_MY_EPISODES:
      return {
        ...state,
        isLoading: false,
        modes    : {
          ...state.modes,
          myEpisodes: {
            ...state.modes.myEpisodes,
            refreshing: true,
          },
        },
      }

    case HomeConstants.FETCHED_MY_EPISODES:
      return {
        ...state,
        isLoading: false,
        modes    : {
          ...state.modes,
          myEpisodes: {
            ...state.modes.myEpisodes,
            fetching  : false,
            refreshing: false,
            items     : action.payload,
          },
        },
      }

    case HomeConstants.CLEAR_ITEMS:
      return {
        ...state,
        modes: {
          ...state.modes,
          [action.payload]: HomeConstants.INITIAL_STATE.modes[action.payload],
        },
      }

    case ItemConstants.ADD_TO_BOOKMARKS:
      return {
        ...state,
        modes: {
          ...state.modes,

          [action.payload.type]: {
            ...state.modes[action.payload.type],
            items: state.modes[action.payload.type].items.map((item) => {
              if (item.id !== action.payload.id) {
                return item
              }

              return {
                ...item,
                bookmarked: true,
              }
            }),
          },

          bookmark: {
            ...state.modes.bookmark,
            items: [
              ...state.modes.bookmark.items,
              action.payload,
            ],
          },
        },
      }

    case ItemConstants.REMOVE_FROM_BOOKMARKS:
      return {
        ...state,
        modes: {
          ...state.modes,

          [action.payload.type]: {
            ...state.modes[action.payload.type],
            items: state.modes[action.payload.type].items.map((item) => {
              if (item.id !== action.payload.id) {
                return item
              }

              return {
                ...item,
                bookmarked: false,
              }
            }),
          },

          bookmark: {
            ...state.modes.bookmark,
            items: state.modes.bookmark.items.filter(bookmark => bookmark.id !== action.payload.id),
          },
        },
      }

    case ItemConstants.MARK_MOVIE_WATCHED:
      const checkAndMarkMovies = items => items.map(movie => {
        if (movie.id !== action.payload.id) {
          return movie
        }

        return {
          ...movie,
          watched: {
            complete: true,
          },
        }
      })

      return {
        ...state,
        modes: {
          ...state.modes,

          bookmark: {
            ...state.modes.bookmark,
            items: checkAndMarkMovies(state.modes.bookmark.items),
          },

          movie: {
            ...state.modes.movie,
            items: checkAndMarkMovies(state.modes.movie.items),
          },
        },
      }

    case ItemConstants.MARK_MOVIE_UNWATCHED:
      const checkAndUnmarkMovies = items => items.map(movie => {
        if (movie.id !== action.payload.id) {
          return movie
        }

        return {
          ...movie,
          watched: {
            complete: false,
          },
        }
      })

      return {
        ...state,
        modes: {
          ...state.modes,

          bookmark: {
            ...state.modes.bookmark,
            items: checkAndUnmarkMovies(state.modes.bookmark.items),
          },

          movie: {
            ...state.modes.movie,
            items: checkAndUnmarkMovies(state.modes.movie.items),
          },
        },
      }

    default:
      return state
  }
}
