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

export const stringToBoolean = (stringValue) => {
  if (stringValue === null || stringValue === undefined) {
    return false;
  }

  if (typeof stringValue === 'boolean') {
    return stringValue;
  }

  switch (stringValue?.toLowerCase()?.trim()) {
    case "true":
    case "yes":
    case "1":
    case 1:
      return true;

    case "false":
    case "no":
    case "0":
    case 0:
    case null:
    case undefined:
      return false;

    default:
      return false;
  }
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

// 👉 isJWT
export const isJWT = token => {
  return token && token.split('.').length === 3;
}

// 👉 parseJWT
export const parseJWT = token => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');

    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );


    return JSON.parse(jsonPayload);
  } catch (error) {
    // console.error('JWT parsing error:', error);

    return null;
  }
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
