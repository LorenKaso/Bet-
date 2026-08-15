export function validatePost(title, body, imageUrl) {
  const normalizedTitle = title.trim()
  const normalizedBody = body.trim()
  const normalizedImageUrl = imageUrl.trim()

  if (!normalizedTitle && !normalizedBody && !normalizedImageUrl) {
    return 'Please add a title, body, or image before publishing.'
  }

  return ''
}


export function validateImageUrl(imageUrl) {
  const normalizedUrl = imageUrl.trim()

  if (!normalizedUrl) {
    return ''
  }

  if (/\s/.test(normalizedUrl)) {
    return 'Invalid image URL.'
  }

  try {
    const url = new URL(normalizedUrl)

    if (url.protocol !== 'http:' && url.protocol !== 'https:') {
      return 'Invalid image URL.'
    }

    return ''
  } catch {
    return 'Invalid image URL.'
  }
}

export function validateLinkUrl(linkUrl) {
  const normalizedUrl = linkUrl.trim()

  if (!normalizedUrl) {
    return 'Please enter a URL.'
  }

  if (normalizedUrl.length > 2048) {
    return 'URL is too long.'
  }

  if (/[\u0000-\u001F\u007F]/.test(normalizedUrl)) {
    return 'Invalid link URL.'
  }

  if (/\s/.test(normalizedUrl)) {
    return 'Invalid link URL.'
  }

  try {
    const url = new URL(normalizedUrl)

    if (url.protocol !== 'http:' && url.protocol !== 'https:') {
      return 'Only HTTP and HTTPS links are allowed.'
    }

    if (!url.hostname) {
      return 'Invalid link URL.'
    }

    return ''
  } catch {
    return 'Invalid link URL.'
  }
}