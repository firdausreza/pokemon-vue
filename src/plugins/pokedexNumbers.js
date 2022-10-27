export default {
  install: (app) => {
    app.config.globalProperties.$dexnumber = (id) => {
      if (id && id < 10) {
        return `#00${id}`
      } else if (id && id < 100) {
        return `#0${id}`
      } else {
        return `#${id}`
      }
    }
  }
}
