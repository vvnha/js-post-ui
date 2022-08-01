import dayjs from 'dayjs'

function initTextElement(elementId, value) {
  const textElement = document.getElementById(elementId)

  if (!textElement) return
  textElement.textContent = ''
  textElement.textContent = value
}

export function initPostDetailContent(postDetail) {
  if (!postDetail) return

  initTextElement('postDetailTitle', postDetail.title)
  initTextElement('postDetailAuthor', postDetail.author)
  initTextElement(
    'postDetailTimeSpan',
    `at ${dayjs(postDetail.updatedAt).format('MMM D, YYYY h:mm A')}`
  )
  initTextElement('postDetailDescription', postDetail.description)

  const postHeroImageElement = document.getElementById('postHeroImage')
  if (postHeroImageElement) {
    postHeroImageElement.style.backgroundImage = `url(${postDetail.imageUrl})`

    postHeroImageElement.addEventListener('error', () => {
      // https://via.placeholder.com/468x60?text=thumbnail
      // if load image error => use default img
      const defaultSrc = 'https://via.placeholder.com/1368x400?text=thumbnail'

      postHeroImageElement.style.backgroundImage = `url(${defaultSrc})`
    })
  }

  //   renderEditPageLink
  const editPageLink = document.getElementById('goToEditPageLink')
  if (editPageLink) {
    editPageLink.addEventListener('click', () => {
      window.location.assign(`/add-edit-post.html?id=${postDetail.id}`)
    })

    // const liIcon = document.createElement('i').classList.add('fas fa-edit')
    // editPageLink.textContent = 'Edit Post'
    editPageLink.innerHTML = '<i class="fas fa-edit"></i>Edit Post'
  }
}
