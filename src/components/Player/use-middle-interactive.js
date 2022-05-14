import { ref } from 'vue'

export default function useMiddleInteractive() {
  const currentShow = ref('cd')
  const middleLStyle = ref(null)
  const middleRStyle = ref(null)

  let currentView = 'cd'

  const touch = { pageX: 0, pageY: 0, percent: 0, directionLocked: '' }

  function onMiddleTouchStart(e) {
    touch.pageX = e.touches[0].pageX
    touch.pageY = e.touches[0].pageY
    touch.directionLocked = ''
  }

  function onMiddleTouchMove(e) {
    const deltaX = e.touches[0].pageX - touch.pageX
    const deltaY = e.touches[0].pageY - touch.pageY

    const absDeltaX = Math.abs(deltaX)
    const absDeltaY = Math.abs(deltaY)

    // 方向锁
    if (!touch.directionLocked) {
      touch.directionLocked = absDeltaX >= absDeltaY ? 'h' : 'v'
    }

    if (touch.directionLocked === 'v') {
      return
    }

    const val = currentView === 'cd' ? 0 : -window.innerWidth // 取值
    const offsetWidth = Math.min(0, Math.max(-window.innerWidth, val + deltaX))
    touch.percent = Math.abs(offsetWidth / window.innerWidth)

    if (currentView === 'cd') {
      if (touch.percent > 0.2) {
        currentShow.value = 'lyric'
      } else {
        currentShow.value = 'cd'
      }
    } else {
      if (touch.percent < 0.8) {
        currentShow.value = 'cd'
      } else {
        currentShow.value = 'lyric'
      }
    }

    middleLStyle.value = {
      opacity: 1 - touch.percent
    }

    middleRStyle.value = {
      transform: `translate3d(${offsetWidth}px,0,0)`
    }
  }

  function onMiddleTouchEnd() {
    let offsetWidth
    let opacity
    if (currentShow.value === 'cd') {
      currentView = 'cd'
      offsetWidth = 0
      opacity = 1
    } else {
      currentView = 'lyric'
      offsetWidth = -window.innerWidth
      opacity = 0
    }

    const duration = 350
    middleLStyle.value = {
      opacity,
      transitionDuration: `${duration}ms`
    }

    middleRStyle.value = {
      transform: `translate3d(${offsetWidth}px,0,0)`,
      transitionDuration: `${duration}ms`
    }
  }

  return {
    currentShow,
    middleLStyle,
    middleRStyle,
    onMiddleTouchStart,
    onMiddleTouchMove,
    onMiddleTouchEnd
  }
}
