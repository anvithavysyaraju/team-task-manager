export function parseApiError(error, fallback = 'Something went wrong.') {
  const data = error?.response?.data

  if (!data) {
    return error?.message || fallback
  }

  if (typeof data === 'string') {
    return data
  }

  if (data.detail) {
    return typeof data.detail === 'string' ? data.detail : JSON.stringify(data.detail)
  }

  return Object.entries(data)
    .map(([key, value]) => {
      const label = key === 'non_field_errors' ? 'Error' : key
      const text = Array.isArray(value) ? value.join(' ') : String(value)
      return `${label}: ${text}`
    })
    .join(' · ')
}
