export function registerEditLink({ elementId, queryParams, typeAction }) {
  const editLinkElement = document.getElementById(elementId)
  if (!editLinkElement) return

  editLinkElement.addEventListener('click', (event) => {
    event.preventDefault()
    const editAddPostUrl = '/'
    window.location.assign(`/add-edit-post.html?id=${post.id}`)
  })
}
