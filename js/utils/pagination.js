export function initPagination({ elementId, defaultParams, onChange }) {
  const ulPaginationElement = document.getElementById(elementId)
  if (!ulPaginationElement) return

  // get a tag
  const prevLink = ulPaginationElement.firstElementChild.firstElementChild
  if (prevLink) {
    prevLink.addEventListener('click', (event) => {
      event.preventDefault()
      const page = Number.parseInt(ulPaginationElement.dataset.page) || 1

      if (page <= 1) ulPaginationElement.firstElementChild?.classList.add('disabled')
      else ulPaginationElement.firstElementChild?.classList.remove('disabled')

      if (page >= 2) onChange?.(page - 1)
    })
  }

  const nextLink = ulPaginationElement.lastElementChild.firstElementChild
  if (nextLink) {
    nextLink.addEventListener('click', (event) => {
      event.preventDefault()

      const page = Number.parseInt(ulPaginationElement.dataset.page) || 1
      const totalPages = ulPaginationElement.dataset.totalPages

      if (page <= 1) ulPaginationElement.lastElementChild?.classList.add('disabled')
      else ulPaginationElement.lastElementChild?.classList.remove('disabled')

      if (page <= totalPages) onChange?.(page + 1)
    })
  }
}

// export function handlePreButtonClick(event) {
//   event.preventDefault()

//   const ulPaginationElement = getUlPaginationElement()
//   if (!ulPaginationElement) return

//   const page = Number.parseInt(ulPaginationElement.dataset.page) || 1

//   if (page <= 1) ulPaginationElement.firstElementChild?.classList.add('disabled')
//   else ulPaginationElement.firstElementChild?.classList.remove('disabled')

//   handleFilterChange('_page', page - 1)
// }

// export function handleNextButtonClick(event) {
//   event.preventDefault()

//   const ulPaginationElement = getUlPaginationElement()
//   if (!ulPaginationElement) return

//   const page = Number.parseInt(ulPaginationElement.dataset.page) || 1
//   const totalPages = ulPaginationElement.dataset.totalPages

//   if (page >= totalPages) ulPaginationElement.lastElementChild?.classList.add('disabled')
//   else ulPaginationElement.lastElementChild?.classList.remove('disabled')

//   handleFilterChange('_page', page + 1)
// }

export function renderPagination(elementId, pagination) {
  if (!pagination) return

  const { _page, _limit, _totalRows } = pagination

  const ulPagination = document.getElementById(elementId)
  if (!ulPagination) return

  const totalPages = Math.ceil(_totalRows / _limit)

  ulPagination.dataset.page = _page
  ulPagination.dataset.totalPages = totalPages

  if (_page <= 1) ulPagination.firstElementChild?.classList.add('disabled')
  else ulPagination.firstElementChild?.classList.remove('disabled')

  if (_page >= totalPages) ulPagination.lastElementChild?.classList.add('disabled')
  else ulPagination.lastElementChild?.classList.remove('disabled')
}
