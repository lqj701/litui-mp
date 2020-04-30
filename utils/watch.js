function watch(data_ctx, run_ctx, obj) {
  Object.keys(obj).forEach(key => {
    defineReactive(data_ctx, key, data_ctx[key], function (value) {
      obj[key].call(run_ctx, value, data_ctx[key])
    })
  })
}

function defineReactive(data, key, val, fn) {
  Object.defineProperty(data, key, {
    configurable: true,
    enumerable: true,
    get: function () {
      return val
    },
    set: function (newVal) {
      console.log(`WATCH -- ${key} has set: %O`, newVal)
      if (newVal === val) return
      fn && fn(newVal)
      val = newVal
    },
  })
}

export default watch