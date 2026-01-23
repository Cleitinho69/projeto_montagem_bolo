import '@/assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { ToastService } from 'primevue';
import Aura from '@primeuix/themes/aura';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

import PrimeVue from 'primevue/config';
import App from './App.vue';
import router from './router';

const app = createApp(App);
const pinia = createPinia();

pinia.use(piniaPluginPersistedstate);

app.use(ToastService);
app.use(pinia)
app.use(router)
app.use(PrimeVue, {
  theme: {
    preset: Aura,
    options: {
      darkModeSelector: 'none',
      cssLayer: {
        name: 'primevue',
        order: 'theme, base, primevue'
      }
    },
    ptOptions: {
      mergeSections: true,
      mergeProps: true
    }
  },
});

app.mount('#app')
