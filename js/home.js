import postApi from './api/postApi'
import { initPagination, initSearchInput, renderPagination, renderPostList, toast } from './utils'

async function handleFilterChange(filterName, filterValue) {
  const url = new URL(window.location)

  if (url.searchParams.get('title_like')) url.searchParams.set('_page', 1)

  if (filterName) url.searchParams.set(filterName, filterValue)

  history.pushState({}, '', url)

  const { data, pagination } = await postApi.getAll(url.searchParams)

  renderPostList('postList', data)
  renderPagination('pagination', pagination)
}

function getDefaultParams() {
  const url = new URL(window.location)

  if (!url.searchParams.get('_page')) url.searchParams.set('_page', 1)
  if (!url.searchParams.get('_limit')) url.searchParams.set('_limit', 6)

  history.pushState({}, '', url)

  return url.searchParams
}

function registerPostDeleteEvent() {
  document.addEventListener('post-delete', async (event) => {
    try {
      const post = event.detail
      if (window.confirm(`Are you sure to remove post "${post.title}"`)) {
        await postApi.remove(post.id)
        await handleFilterChange()

        toast.success('Remove post successfully!')
      }
    } catch (error) {
      console.log('failed to remove post', error)
      toast.error(error.message)
    }
  })
}

;(async () => {
  try {
    const queryParams = getDefaultParams()

    registerPostDeleteEvent()

    initPagination({
      elementId: 'pagination',
      defaultParams: queryParams,
      onChange: (page) => handleFilterChange('_page', page),
    })

    initSearchInput({
      elementId: 'searchInput',
      defaultParams: queryParams,
      onChange: (value) => handleFilterChange('title_like', value),
    })

    handleFilterChange()
  } catch (error) {
    console.log('get all failed', error)
  }
})()
