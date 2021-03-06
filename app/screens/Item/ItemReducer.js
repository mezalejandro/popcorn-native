import * as ItemConstants from './ItemConstants'

import * as QualitySelectorConstants from 'components/QualitySelector/QualitySelectorConstants'

export default (state = ItemConstants.INITIAL_STATE, action) => {
  switch (action.type) {

    case ItemConstants.CLEAR_ITEM:
      return {
        ...state,
        item: null,
      }

    case ItemConstants.FETCH_ITEM:
      return {
        ...state,
        isLoading: true,
        item     : null,
      }

    case ItemConstants.PARTLY_FETCH_ITEM:
      return {
        ...state,
        item: action.payload,
      }

    case ItemConstants.FETCHED_ITEM:
      return {
        ...state,
        isLoading: false,
        item     : action.payload,
      }

    case ItemConstants.ADD_TO_BOOKMARKS:
      return {
        ...state,
        item: {
          ...state.item,
          bookmarked: true,
        },
      }

    case ItemConstants.REMOVE_FROM_BOOKMARKS:
      return {
        ...state,
        item: {
          ...state.item,
          bookmarked: false,
        },
      }

    case ItemConstants.MARK_MOVIE_WATCHED:
      return {
        ...state,
        item: {
          ...state.item,
          watched: {
            complete: true,
          },
        },
      }

    case ItemConstants.MARK_MOVIE_UNWATCHED:
      return {
        ...state,
        item: {
          ...state.item,
          watched: {
            complete: false,
          },
        },
      }

    case QualitySelectorConstants.FETCH_BETTER:
      return {
        ...state,
        fetchingBetter: true,
      }

    case QualitySelectorConstants.FETCHED_BETTER_FOR_MY_EPISODE:
      return {
        ...state,
        fetchingBetter: false,
      }

    case QualitySelectorConstants.FETCHED_BETTER_FOR_MOVIE:
      return {
        ...state,
        fetchingBetter: false,
        item          : {
          ...state.item,
          searchedForBetter: true,
          torrents: action.payload.newTorrents,
        },
      }

    case QualitySelectorConstants.FETCHED_BETTER_FOR_EPISODE:
      return {
        ...state,
        fetchingBetter: false,
        item          : {
          ...state.item,
          seasons: state.item.seasons.map((season) => {
            if (season.number !== action.payload.season) {
              return season
            }

            return {
              ...season,
              episodes: season.episodes.map((episode) => {
                if (episode.number !== action.payload.episode) {
                  return episode
                }

                return {
                  ...episode,
                  searchedForBetter: true,
                  torrents: action.payload.newTorrents,
                }
              }),
            }
          }),
        },
      }

    default:
      return state

  }
}
