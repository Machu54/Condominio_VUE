import { createRouter, createWebHistory } from 'vue-router'

/* VISTAS */

import LoginView from '../views/LoginView.vue'

import Chatview from '../views/Chatview.vue'

import MultasView from '../views/MultasView.vue'

import MultasGeneralView from '../views/MultasGeneralView.vue'

/* RUTAS */

const routes = [

    /* LOGIN */

    {
        path: '/',
        component: LoginView
    },

    /* CHAT */

    {
        path: '/chat',
        component: Chatview
    },

    /* CRUD MULTAS */

    {
        path: '/multas',
        component: MultasView
    },

    /* MULTAS USUARIO */

    {
        path: '/multas-general',
        component: MultasGeneralView
    }
]

/* ROUTER */

const router = createRouter({

    history: createWebHistory(),

    routes
})

export default router