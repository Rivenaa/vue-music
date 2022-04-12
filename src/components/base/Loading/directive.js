import { createApp } from 'vue'
import { addClass, removeClass } from '@/assets/js/dom'
import Loading from './loading.vue'

const fixedCls = 'g-fixed'

const loadingDirective = {
  mounted(el, binding) {
    /* 创建loading实例 */
    const app = createApp(Loading)
    /* 创建一个div并挂载在上面 */
    const instance = app.mount(document.createElement('div'))
    const title = binding.arg
    if (Object.prototype.toString.call(title) !== '[object Undefined]') {
      instance.setTitle(title)
    }
    /* 把实例保存在el里 */
    el.instance = instance
    /* 判断参数的值 */
    if (binding.value) {
      /* 为true执行appendEl方法 */
      appendEl(el)
    }
    console.log(el.instance.$el)
  },
  updated(el, binding) {
    const title = binding.arg
    if (Object.prototype.toString.call(title) !== '[object Undefined]') {
      el.instance.setTitle(title)
    }
    if (binding.value !== binding.oldValue) {
      binding.value ? appendEl(el) : removeEl(el)
    }
  }
}

function appendEl(el) {
  const style = getComputedStyle(el)
  if (['absolute', 'fixed', 'relative'].indexOf(style.position) === -1) {
    addClass(el, fixedCls)
  }
  el.appendChild(el.instance.$el)
}

function removeEl(el) {
  removeClass(el, fixedCls)
  el.removeChild(el.instance.$el)
}

export default loadingDirective
