import { createRouter, createWebHistory } from 'vue-router'

import LoginView from '../views/LoginView.vue'
import Chatview from '../views/Chatview.vue'

const routes = [

    {
        path: '/',
        component: LoginView
    },

    {
        path: '/chat',
        component: Chatview
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router