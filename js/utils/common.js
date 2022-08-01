export function setTextContent(parent, selector, text) {
  if (!parent) return

  const elementt = parent.querySelector(selector)

  if (elementt) elementt.textContent = text
}

export function truncate(text, textLength) {
  if (text.length < textLength) return text

  return `${text.slice(0, textLength - 1)}…`
}

export function setFieldValue(formElement, selector, value) {
  const element = formElement.querySelector(selector)

  if (!element) return

  element.value = value
}
