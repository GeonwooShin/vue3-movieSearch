import { createApp } from 'vue'
import App from './App.vue'
import router from './routes/index.js'  // 특정 폴더에 들어있는 index라는 이름의 파일을 가지고올 때는 index라는 이름의 파일을 생략해줄 수 있다. ex) './routes'
import store from './store/index.js'    // ex) './store'  대신 다른 이름일 경우에는 생략 불가능
import loadImage from './plugins/loadImage'

createApp(App)
  .use(router)
  .use(store)
  .use(loadImage)
  .mount('#app')