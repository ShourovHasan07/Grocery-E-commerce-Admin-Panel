// 👉 IsEmpty
export const isEmpty = (value) => {
  if (value === null || value === undefined || value === "") return true;

  return !!(Array.isArray(value) && value.length === 0);
};

// 👉 IsNullOrUndefined
export const isNullOrUndefined = (value) => {
  return value === null || value === undefined;
};

export const stringToBoolean = (stringValue) => {
  if (stringValue === null || stringValue === undefined) {
    return false;
  }

  if (typeof stringValue === "boolean") {
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
};

// 👉 IsEmptyArray
export const isEmptyArray = (arr) => {
  return Array.isArray(arr) && arr.length === 0;
};

// 👉 IsObject
export const isObject = (obj) =>
  obj !== null && !!obj && typeof obj === "object" && !Array.isArray(obj);

// 👉 IsToday
export const isToday = (date) => {
  const today = new Date();

  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
};

// 👉 isJWT
export const isJWT = (token) => {
  return token && token.split(".").length === 3;
};

// 👉 parseJWT
export const parseJWT = (token) => {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");

    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join(""),
    );

    return JSON.parse(jsonPayload);
  } catch (error) {
    // console.error('JWT parsing error:', error);

    return null;
  }
};

// 👉 Status
export const activeStatusLabel = (status) => {
  switch (status) {
    case false:
      return "Inactive";
    case true:
      return "Active";
    default:
      return "N/A";
  }
};

// 👉 Status Color
export const activeStatusColor = (status) => {
  switch (status) {
    case false:
      return "warning";
    case true:
      return "success";
    case completed:
      return "success";
    default:
      return "secondary";
  }
};

//pending, confirmed, ongoing, completed, cancelled,
export const bookingStatusLabel = (status) => {
  switch (status) {
    case "cancelled":
      return "Cancelled";
    case "completed":
      return "Completed";
    case "ongoing":
      return "Ongoing";
    case "confirmed":
      return "Upcoming";
    case "pending":
      return "Pending";
    default:
      return String(status);
  }
};

export const bookingStatusColor = (status) => {
  switch (status) {
    case "cancelled":
      return "error";
    case "completed":
      return "success";
    case "ongoing":
      return "info";
    case "confirmed":
      return "primary";
    case "pending":
      return "warning";
    default:
      return "default";
  }
};

//pending, confirmed, ongoing, completed, cancelled,
export const transactionStatusLabel = (status) => {
  switch (status) {
    case "failed":
      return "Failed";
    case "paid":
      return "Paid";
    case "pending":
      return "Pending";
    default:
      return String(status);
  }
};

export const transactionStatusColor = (status) => {
  switch (status) {
    case "failed":
      return "error";
    case "paid":
      return "success";
    case "pending":
      return "warning";
    default:
      return "default";
  }
};

// 👉 Popular Status
export const popularStatusLabel = (popular) => {
  switch (popular) {
    case true:
      return "Yes";
    default:
      return "No";
  }
};

// 👉 Popular Color
export const popularStatusColor = (popular) => {
  switch (popular) {
    case true:
      return "success";
    default:
      return "secondary";
  }
};

// 👉 Contact Status
export const contactStatusLabel = (popular) => {
  switch (popular) {
    case true:
      return "Solved";
    default:
      return "Pending";
  }
};

// 👉 Contact Color
export const contactStatusColor = (popular) => {
  switch (popular) {
    case true:
      return "success";
    default:
      return "warning";
  }
};

// 👉 Format Time
export const timeFormat = (time24h) => {
  let [hours, minutes] = time24h.split(":");
  const modifier = +hours >= 12 ? "PM" : "AM";

  hours = +hours % 12 || 12; // convert '00' to '12'

  return `${hours}:${minutes} ${modifier}`;
};

export const getCurrency = '£';

// 👉 Get Card Brand Image
export const getCardBrandImage = (cardBrand) => {
  const defaultImage = '/images/logos/default-card.png';

  if (!cardBrand) return {
    primary: defaultImage,
    fallback: defaultImage
  };

  // Normalize the card brand name to lowercase
  const normalizedBrand = cardBrand.toLowerCase().trim();

  // Map common card brand variations to their image file names
  const cardBrandMap = {
    'visa': 'visa',
    'mastercard': 'mastercard',
    'master card': 'mastercard',
    'mc': 'mastercard',
    'american express': 'american-express',
    'americanexpress': 'american-express',
    'amex': 'american-express',
    'discover': 'discover',
    'jcb': 'jcb',
    'diners club': 'dinners-club',
    'dinersclub': 'dinners-club',
    'diners': 'dinners-club',
    'unionpay': 'unionpay',
    'union pay': 'unionpay',
    'maestro': 'maestro',
    'paypal': 'paypal',
    'apple pay': 'apple-pay',
    'applepay': 'apple-pay',
    'google pay': 'google-pay',
    'googlepay': 'google-pay',
    'samsung pay': 'samsung-pay',
    'samsungpay': 'samsung-pay'
  };

  // Get the mapped image name or use the original brand name as fallback
  const imageName = cardBrandMap[normalizedBrand] || normalizedBrand.replace(/\s+/g, '-');

  return {
    primary: `/images/logos/${imageName}.png`,
    fallback: defaultImage
  };
};

// 👉 Get Card Brand Image with Fallback (Legacy - returns string)
export const getCardBrandImagePath = (cardBrand) => {
  const result = getCardBrandImage(cardBrand);


  return result.primary;
};
