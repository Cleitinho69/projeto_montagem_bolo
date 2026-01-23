import { createRouter, createWebHistory, START_LOCATION } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/404',
      component: () => import('@/pages/notFouldPage.vue'),
    },
    {
      path: '/:confeitaria',
      name: 'Home',
      redirect: to => `${to.params.confeitaria}/etapa/1`,
      component: () => import('@/layout/mainLayout.vue'),
      children: [
        {
          path: 'etapa/:ordem(\\d+)',
          name: 'Etapas',
          component: () => import('@/pages/etapaDefaultPage.vue'),
          props: (route) => ({ ordem: Number(route.params.ordem) })
        },
        {
          path: 'estilo',
          name: 'Estilo',
          component: () => import('@/pages/estiloPage.vue'),
        },
        {
          path: 'finalizar',
          name: 'Finalizar',
          component: () => import('@/pages/finalizarEncomendaPage.vue')
        },
        {
          path: 'resumo',
          name: 'Resumo',
          component: () => import('@/pages/resumoPage.vue')
        }
      ]
    },
  ],
})

router.beforeEach((to, from, next) => {
  if (to.name === 'Etapas' && to.params.ordem != '1' && from === START_LOCATION) {
    const confeitaria = to.params.confeitaria;
    next({
      name: 'Home',
      params: { confeitaria: confeitaria }
    });
  } else if ((to.name == 'Finalizar' || to.name === 'Resumo') && from === START_LOCATION) {
    const confeitaria = to.params.confeitaria;

    next({
      name: 'Home',
      params: { confeitaria: confeitaria }
    });
  }else next();
});

export default router
