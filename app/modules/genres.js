import sortAB from './utils/sortAB'

export const TOP_GENRES = [
  'action',
  'adventure',
  'animation',
  'comedy',
  'documentary',
  'family',
  'fantasy',
  'horror',
]

export const ALL_GENRES = [
  ...TOP_GENRES,

  'drama',
  'holiday',
  'music',
  'tv-movie',
  'mystery',
  'crime',
  'history',
  'science-fiction',
  'thriller',
  'short',
  'suspense',
  'war',
  'western',
  'romance',
].sort(sortAB)
