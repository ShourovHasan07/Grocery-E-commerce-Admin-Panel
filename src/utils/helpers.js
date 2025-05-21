// 👉 IsEmpty
export const isEmpty = value => {
  if (value === null || value === undefined || value === '')
    return true

  return !!(Array.isArray(value) && value.length === 0)
}

// 👉 IsNullOrUndefined
export const isNullOrUndefined = value => {
  return value === null || value === undefined
}

// 👉 IsEmptyArray
export const isEmptyArray = arr => {
  return Array.isArray(arr) && arr.length === 0
}

// 👉 IsObject
export const isObject = obj => obj !== null && !!obj && typeof obj === 'object' && !Array.isArray(obj)

// 👉 IsToday
export const isToday = date => {
  const today = new Date()

  return (date.getDate() === today.getDate()
    && date.getMonth() === today.getMonth()
    && date.getFullYear() === today.getFullYear())
}

// 👉 Status
export const activeStatusLabel = status => {
  switch (status) {
    case false:
      return 'Inactive'
    case true:
      return 'Active'
    default:
      return 'N/A'
  }
}

// 👉 Status Color
export const activeStatusColor = status => {
  switch (status) {
    case false:
      return 'warning'
    case true:
      return 'success'
    default:
      return 'secondary'
  }
}
