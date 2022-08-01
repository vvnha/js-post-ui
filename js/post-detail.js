import dayjs from 'dayjs'
import postApi from './api/postApi'
import { initPostDetailContent } from './utils'
import { registerLightBox } from './utils/light-box'
;(async () => {
  registerLightBox({
    modalId: 'lightbox',
    imageElementSelector: 'img[data-id="lightboxImg"]',
    prevButtonSelector: 'button[data-id="lightboxPrev"]',
    nextButtonSelector: 'button[data-id="lightboxNext"]',
  })

  try {
    const url = new URL(window.location)

    const queryParams = url.searchParams

    // registerEditLink({
    //   elementId: 'goToEditPageLink',
    //   queryParams,
    //   typeAction: 'edit',
    // })

    const postId = queryParams.get('id')
    if (!postId) history.back()

    const postDetail = await postApi.getById(postId)

    console.log(postDetail)

    initPostDetailContent(postDetail)
  } catch (error) {
    console.log('error post detail', error)
  }
})()
