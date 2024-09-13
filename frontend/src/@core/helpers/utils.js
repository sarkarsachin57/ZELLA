function timeDifference(current, previous) {
  const milliSecondsPerMinute = 60 * 1000
  const milliSecondsPerHour = milliSecondsPerMinute * 60
  const milliSecondsPerDay = milliSecondsPerHour * 24
  const milliSecondsPerMonth = milliSecondsPerDay * 30
  const milliSecondsPerYear = milliSecondsPerDay * 365

  const elapsed = current - previous

  if (elapsed < milliSecondsPerMinute / 3) {
    return 'just now'
  }

  if (elapsed < milliSecondsPerMinute) {
    return 'less than 1 min ago'
  } else if (elapsed < milliSecondsPerHour) {
    return Math.round(elapsed / milliSecondsPerMinute) + ' min ago'
  } else if (elapsed < milliSecondsPerDay) {
    return Math.round(elapsed / milliSecondsPerHour) + ' h ago'
  } else if (elapsed < milliSecondsPerMonth) {
    return Math.round(elapsed / milliSecondsPerDay) + ' days ago'
  } else if (elapsed < milliSecondsPerYear) {
    return Math.round(elapsed / milliSecondsPerMonth) + ' mo ago'
  } else {
    return Math.round(elapsed / milliSecondsPerYear) + ' years ago'
  }
}

export function timeDifferenceForDate(date) {
  const now = new Date().getTime()
  const updated = new Date(date).getTime()

  return timeDifference(now, updated)
}

// time Range unit hour timeRange * 3600 *1000
export const isInTimeRange = (time, timeRange) => {
  const current = Date.now()
  const previous = new Date(time).getTime()
  if (timeRange == -1) return true;
  if (current - previous < timeRange * 3600 * 1000) return true

  return false
}

export const makeReadableTime = (timeStr) => {
  var datetime = new Date(timeStr)

  return datetime.toLocaleString()
}

export const compareArrays = (a, b) =>{
  if(a === undefined || b === undefined || a === null || b === null || !Array.isArray(a) || !Array.isArray(b)) return false;
  return JSON.stringify(a) === JSON.stringify(b);
  return a.length === b.length && a.every((element, index) => element === b[index]);
}

export function difference(a, b) {
  return Math.abs(a - b);
}

export function abs (a) {
  return Math.abs(a)
}

// For bubble sort <start> QmQ

function swap(arr, a, b) {
  let temp = arr[a];
  arr[a] = arr[b];
  arr[b] = temp;
}

const Compare = {
  LESS_THAN: -1,
  BIGGER_THAN: 1
};

function defaultCompare(a, b) {
  if (a === b) {
      return 0;
  }
  return a < b ? Compare.LESS_THAN : Compare.BIGGER_THAN;
}

export function bubbleSort(arr, compare = defaultCompare) {
  const { length } = arr;
  for (let i = 0; i < length; i++) {
      for (let j = 0; j < length - 1 - i; j++) { // refer to note below
          if (compare(arr[j], arr[j + 1]) > 0) {
              swap(arr, j, j + 1);
          }
      }
  }
  return arr;
}
// For bubble sort <end> QmQ