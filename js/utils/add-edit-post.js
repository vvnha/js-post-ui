import * as yup from 'yup'
import { imageSource } from '../constants'
import { setFieldValue, setTextContent } from './common'

function changeImageBackground(imageUrl) {
  const postHeroImageElement = document.getElementById('postHeroImage')
  if (postHeroImageElement) {
    postHeroImageElement.style.backgroundImage = `url(${imageUrl})`
    postHeroImageElement.addEventListener('error', () => {
      // https://via.placeholder.com/468x60?text=thumbnail
      // if load image error => use default img
      const defaultSrc = 'https://via.placeholder.com/1368x400?text=thumbnail'

      postHeroImageElement.style.backgroundImage = `url(${defaultSrc})`
    })
  }
}

function setFormValues(formElement, formValues) {
  const inputTitleElement = formElement.querySelector('input[type="text"][name="title"]')
  const inputAuthorElement = formElement.querySelector('input[type="text"][name="author"]')
  const inputDescElement = formElement.querySelector('textarea[name="description"]')
  const inputImageElement = formElement.querySelector('input[name="imageUrl"]')

  if (!inputTitleElement || !inputAuthorElement || !inputDescElement || !inputImageElement) return

  //if post has id, formValues is not undefined, show content
  if (formValues && Object.keys(formValues).length > 0) {
    inputAuthorElement.value = formValues.author
    inputTitleElement.value = formValues.title
    inputDescElement.value = formValues.description
    inputImageElement.value = formValues.imageUrl

    changeImageBackground(formValues.imageUrl)
  }
}

function getFormValues(formElement, defaultValues) {
  //   const inputTitleElement = formElement.querySelector('input[type="text"][name="title"]')
  //   const inputAuthorElement = formElement.querySelector('input[type="text"][name="author"]')
  //   const inputDescElement = formElement.querySelector('textarea[name="description"]')

  //   if (!inputTitleElement || !inputAuthorElement || !inputDescElement) return defaultValues

  //   return {
  //     author: inputAuthorElement.value,
  //     title: inputTitleElement.value,
  //     description: inputDescElement.value,
  //   }

  // can use for
  // can use formData

  const formValues = {}
  const formData = new FormData(formElement)

  for (const [key, value] of formData) {
    formValues[key] = value
  }

  return formValues
}

function setFieldError(formElement, name, message) {
  const element = formElement.querySelector(`[name="${name}"]`)

  setTextContent(element.parentElement, '.invalid-feedback', message)
}

// const imageSource = {
//   UPLOAD: 'upload',
//   PICSUM: 'picsum',
// }
async function validatePostForm(formElement, formValues) {
  let schema = yup.object().shape({
    author: yup.string().required(),
    title: yup.string().required(),
    description: yup.string(),
    imageSource: yup
      .string()
      .required('Please select an image source')
      .oneOf([imageSource.UPLOAD, imageSource.PICSUM], 'Invalid image source'),
    imageUrl: yup.string().when('imageSource', {
      is: imageSource.PICSUM,
      then: yup.string().url('Please enter a vaid URL').required('Please random image'),
    }),
    image: yup.mixed().when('imageSource', {
      is: imageSource.UPLOAD,
      then: yup
        .mixed()
        .test('required', 'Please select an image to upload', (file) => Boolean(file?.name))
        .test('max-3mb', 'The image is too large (max 3mb)', (file) => {
          const fileSize = file?.size || 0
          const MAX_SIZE = 3 * 1024 * 1024 //3mb

          return fileSize <= MAX_SIZE
        }),
    }),
  })

  try {
    ;['author', 'title', 'imageUrl'].forEach((name) => {
      setFieldError(formElement, name, '')
    })

    await schema.validate(formValues, { abortEarly: false })
  } catch (error) {
    const errorStatistic = {}

    if (error.name === 'ValidationError' && Array.isArray(error.inner)) {
      for (const validationError of error.inner) {
        // field is validationError.path
        // error message is validationError.message

        const name = validationError.path

        // just get first error of an input when getting a lot of errors
        if (errorStatistic[name]) continue

        setFieldError(formElement, name, validationError.message)
        errorStatistic[name] = true
      }
    }
  }

  formElement.classList.add('was-validated')

  return schema.isValid(formValues)
}

function showLoading(form) {
  const button = form.querySelector('[name="submit"]')

  if (button) {
    button.disabled = true
    button.textContent = 'Saving...'
  }
}

function hideLoading(form) {
  const button = form.querySelector('[name="submit"]')

  if (button) {
    button.disabled = false
    button.textContent = 'Save'
  }
}

export function randomImage(maxNumber) {
  const randomNumber = Math.round(Math.random() * maxNumber)
  const newSrc = `https://picsum.photos/id/${randomNumber}/1378/400`
  return newSrc
}

//---------------------------------------------

export async function registerPostForm({ elementId, defaultValues, defaultParams, onSubmit }) {
  const formElement = document.getElementById(elementId)
  if (!formElement) return

  setFormValues(formElement, defaultValues)
  let submitting

  registerInputImageForm({
    formId: 'postForm',
    buttonChangeImageId: 'postChangeImage',
    inputImageId: 'uploadImage',
  })

  registerRadioButton({ formId: 'postForm' })

  const submitButton = document.querySelector('button[name="submit"]')
  const checkElementList = formElement.querySelectorAll('input[type="radio"]')

  if (submitButton)
    submitButton.addEventListener('click', async (event) => {
      event.preventDefault()

      if (submitting) {
        console.log('user is submitting')

        return
      }

      showLoading(formElement)
      submitting = true

      let checkedRadioElementValue
      // get checked radio input
      if (checkElementList) {
        const checkedRadioElement = [...checkElementList].find((x) => x.checked)
        checkedRadioElementValue = checkedRadioElement.value
      }

      const formValues = getFormValues(formElement, defaultValues)
      const isValid = await validatePostForm(formElement, formValues)

      if (isValid) await onSubmit?.(formValues)

      hideLoading(formElement)
      submitting = false
    })
}

function handleChangeRadioInput(formElement, checkElementList) {
  // get checked radio input
  if (checkElementList) {
    ;[...checkElementList].forEach((element) => {
      const controlELement = formElement.querySelector(`[data-image-source=${element.value}]`)
      if (controlELement) {
        if (element.checked) controlELement.hidden = false
        else controlELement.hidden = true
      }
    })
  }
}

export function registerRadioButton({ formId }) {
  const formElement = document.getElementById(formId)
  if (!formElement) return

  const checkElementList = formElement.querySelectorAll('input[type="radio"]')

  checkElementList.forEach((radio) => {
    radio.addEventListener('change', () => {
      handleChangeRadioInput(formElement, checkElementList)
    })
  })
}

function registerInputImageForm({ formId, buttonChangeImageId, inputImageId }) {
  const formElement = document.getElementById(formId)
  if (!formElement) return
  const buttonChangeImageElement = document.getElementById(buttonChangeImageId)
  const inputImageFile = document.getElementById(inputImageId)

  if (buttonChangeImageElement) {
    buttonChangeImageElement.addEventListener('click', () => {
      const newImageUrl = randomImage(1000)
      // onChange?.(newImageUrl)
      setFieldValue(formElement, '[name="imageUrl"]', newImageUrl)
      changeImageBackground(newImageUrl)
    })
  }

  if (inputImageFile) {
    inputImageFile.addEventListener('change', (event) => {
      const imageFile = event.target.files[0]
      const imageUrl = URL.createObjectURL(imageFile)

      changeImageBackground(imageUrl)
    })
  }
}
