import debouce from 'lodash.debounce'

export function initSearchInput({ elementId, defaultParams, onChange }) {
  const searchInputElement = document.getElementById(elementId)

  if (!searchInputElement) return

  if (defaultParams.get('title_like')) searchInputElement.value = defaultParams.get('title_like')

  const debouceSearch = debouce((event) => onChange(event.target.value), 500)

  searchInputElement.addEventListener('input', (event) => debouceSearch(event))
}
