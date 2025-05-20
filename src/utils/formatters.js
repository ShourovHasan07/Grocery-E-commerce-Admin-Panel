import { format } from "date-fns/format";
import { TZDate } from "@date-fns/tz";

export const avatarText = value => {
  if (!value)
    return ''
  const nameArray = value.split(' ')

  return nameArray.map(word => word.charAt(0).toUpperCase()).join('')
}

// TODO: Try to implement this: https://twitter.com/fireship_dev/status/1565424801216311297
export const kFormatter = num => {
  const regex = /\B(?=(\d{3})+(?!\d))/g

  return Math.abs(num) > 9999 ? `${Math.sign(num) * +((Math.abs(num) / 1000).toFixed(1))}k` : Math.abs(num).toFixed(0).replace(regex, ',')
}

/**
 * Format and return date in Humanize format
 *
 */
export const formattedDate = (value, dateFormat = 'yyyy-MM-dd HH:mm:ss') => {
  if (!value)
    return value

  return format(new TZDate(value, "+00:00"), dateFormat);
}
