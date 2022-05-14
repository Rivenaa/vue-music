/**
 * slice方法会返回一个新数组 不会修改原数组
 * source 来源
 * swap 交换
 */
export const shuffle = source => {
  const arr = source.slice()
  for (let i = 0; i < arr.length; i++) {
    const j = getRandomInt(i)
    swap(arr, i, j)
  }
  return arr
}

const getRandomInt = max => {
  return Math.floor(Math.random() * (max + 1))
}

const swap = (arr, i, j) => {
  const t = arr[i]
  arr[i] = arr[j]
  arr[j] = t
}
