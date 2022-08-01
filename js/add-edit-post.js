import postApi from './api/postApi'
import { imageSource } from './constants'
import { registerPostForm, registerRadioButton, toast } from './utils'
;(async () => {
  let defaultValues = {
    author: '',
    title: '',
    description: '',
    imageUrl: '',
  }

  function createPost(formValues) {
    return postApi.add(formValues)
  }

  function editPost(postId, formValues) {
    return postApi.update({
      id: postId,
      ...formValues,
    })
  }

  function jsonToFormData(jsonObject) {
    const formData = new FormData()
    for (const key in jsonObject) {
      formData.set(key, jsonObject[key])
    }
    return formData
  }

  function removeUnusedFields(formValues) {
    const payload = { ...formValues }

    if (payload.imageSource === imageSource.UPLOAD) {
      delete payload.imageUrl
    } else {
      delete payload.image
    }

    delete payload.imageSource
    return payload
  }

  async function handleFormChange(formValues, queryParams) {
    // defaultValues = {
    //   ...defaultValues,
    //   ...formValues,
    //   imageUrl: defaultValues.imageUrl,
    // }

    const payload = removeUnusedFields(formValues)
    const formData = jsonToFormData(payload)

    console.log('form', { formValues, payload })

    let newPostDetail

    try {
      const postId = queryParams.get('id')
      // has postId mean edit post, otherwise => create post
      if (!postId) {
        newPostDetail = await postApi.addFormData(formData)
      } else {
        newPostDetail = await postApi.updateFormData(formData)
      }

      toast.success('Save post successfully!')
      // redirect

      setTimeout(() => {
        window.location.assign(`/post-detail.html?id=${newPostDetail.id}`)
      }, 2000)
    } catch (error) {
      console.log('fail to call API', error)
      toast.error(`Error: ${error.message}`)
    }
  }

  // function handleChangeImage(newImageUrl) {
  //   defaultValues = {
  //     ...defaultValues,
  //     imageUrl: newImageUrl,
  //   }
  // }

  try {
    const url = new URL(window.location)
    const queryParams = url.searchParams
    const postId = queryParams.get('id')

    if (postId) defaultValues = await postApi.getById(postId)

    registerPostForm({
      elementId: 'postForm',
      defaultValues,
      defaultParams: queryParams,
      onSubmit: (formValues) => handleFormChange({ ...defaultValues, ...formValues }, queryParams),
    })

    // registerRadioButton({
    //   formId: 'postForm',
    //   radioUploadImageSelector: 'input[id="imageSourceUpload"]',
    //   radioRandomImageSelector: 'input[id="imageSourcePicsum"]',
    // })

    // registerInputImageForm({
    //   formId: 'postForm',
    //   buttonChangeImageId: 'postChangeImage',
    //   inputImageId: 'uploadImage',
    //   onChange: (newImageUrl) => handleChangeImage(newImageUrl),
    // })
  } catch (error) {
    console.log('error post detail', error)
  }
})()
