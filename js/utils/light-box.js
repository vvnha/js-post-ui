export function registerLightBox({
  modalId,
  imageElementSelector,
  prevButtonSelector,
  nextButtonSelector,
}) {
  const modalElement = document.getElementById(modalId)

  if (!modalElement) return

  // check if modal is registered
  if (modalElement.dataset.registered) return

  const currentImgElement = document.querySelector(imageElementSelector)
  const prevButtonElement = document.querySelector(prevButtonSelector)
  const nextButtonElement = document.querySelector(nextButtonSelector)

  if (!currentImgElement || !prevButtonElement || !nextButtonElement) return

  let imgList = []
  let currentImageIndex = 0

  function setImageElement() {
    currentImgElement.src = imgList[currentImageIndex].src
  }

  function showModal() {
    const myModal = new bootstrap.Modal(modalElement)
    myModal.show()
  }

  document.addEventListener('click', (event) => {
    const { target } = event

    if (!target.tagName === 'IMG' || !target.dataset.album) return

    imgList = document.querySelectorAll('img[data-album=easy-frontend]')
    currentImageIndex = [...imgList].findIndex((x) => x === target)

    setImageElement()

    showModal()
  })

  nextButtonElement.addEventListener('click', () => {
    currentImageIndex = (currentImageIndex + 1) % imgList.length
    setImageElement()
  })

  prevButtonElement.addEventListener('click', () => {
    currentImageIndex = (currentImageIndex - 1 + imgList.length) % imgList.length
    setImageElement()
  })

  modalElement.dataset.registered = true
}
