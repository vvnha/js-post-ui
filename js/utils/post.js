import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { setTextContent, truncate } from './common'

dayjs.extend(relativeTime)

export function createPostElement(post) {
  if (!post) return

  // find
  const postTemplate = document.getElementById('postTemplate')

  if (!postTemplate) return

  const liElement = postTemplate.content.firstElementChild.cloneNode(true)

  if (!liElement) return
  // update content

  setTextContent(liElement, '[data-id=title]', post.title)
  setTextContent(liElement, '[data-id=author]', post.author)
  setTextContent(liElement, '[data-id=description]', truncate(post.description, 100))
  setTextContent(liElement, '[data-id=timeSpan]', `- ${dayjs(post.updatedAt).fromNow()}`)

  const thumbnailElement = liElement.querySelector('[data-id=thumbnail]')
  if (thumbnailElement) {
    thumbnailElement.src = post.imageUrl

    thumbnailElement.addEventListener('error', () => {
      // https://via.placeholder.com/468x60?text=thumbnail
      // if load image error => use default img
      thumbnailElement.src = 'https://via.placeholder.com/1368x400?text=thumbnail'
    })
  }

  const divElement = liElement.firstElementChild

  if (divElement) {
    divElement.addEventListener('click', (event) => {
      // technique "contains element => ignore catch event which is caused by bubbling"

      const menu = liElement.querySelector('[data-id="menu"]')

      if (menu && menu.contains(event.target)) return

      window.location.assign(`/post-detail.html?id=${post.id}`)
    })
  }

  const editButtonElement = liElement.querySelector('[data-id="edit"]')

  if (editButtonElement) {
    editButtonElement.addEventListener('click', () => {
      window.location.assign(`/add-edit-post.html?id=${post.id}`)
    })
  }

  const removeButtonElement = liElement.querySelector('[data-id="remove"]')

  if (removeButtonElement) {
    removeButtonElement.addEventListener('click', () => {
      // custom event for being listened from parent
      const customEvent = new CustomEvent('post-delete', {
        bubbles: true,
        detail: post,
      })

      removeButtonElement.dispatchEvent(customEvent)
    })
  }

  return liElement
}

export function renderPostList(elementId, postList) {
  if (!Array.isArray(postList) || postList.length < 1) return

  const ulElement = document.getElementById(elementId)

  ulElement.textContent = ''

  if (!ulElement) return

  postList.forEach((post, idx) => {
    const liElement = createPostElement(post)
    ulElement.appendChild(liElement)
  })
}
