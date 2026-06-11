import { createRouter, createWebHistory } from 'vue-router'

/* VISTAS */
import VerificarCorreoView
from '../views/VerificarCorreoView.vue'
import LoginView from '../views/LoginView.vue'

import Chatview from '../views/Chatview.vue'

import MultasView from '../views/MultasView.vue'

import MultasGeneralView from '../views/MultasGeneralView.vue'

import CrudUsuarios from '../views/CrudUsuarios.vue'

/* RUTAS */

const routes = [

    /* LOGIN */

    {
        path: '/',
        component: LoginView
    },

    /* VERIFICAR CORREO */

    {
        path: '/verificar-correo',
        component: VerificarCorreoView
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
    },

    /* USUARIOS */

    {
        path: '/usuarios',
        component: CrudUsuarios
    }
]

/* ROUTER */

const router = createRouter({

    history: createWebHistory(),

    routes
})

/* PROTECCION DE RUTAS */

router.beforeEach((to, from, next) => {

    const usuario = JSON.parse(
        localStorage.getItem('usuario')
    )

    /* LOGIN */
if(
    to.path === '/'
    ||
    to.path === '/verificar-correo'
){

    return next()
}

    /* SIN SESION */

    if(!usuario){

        return next('/')
    }

    /* SOLO ADMIN */

    const rutasAdmin = [

        '/multas',

        '/usuarios'
    ]

    if(
        rutasAdmin.includes(to.path)
        && !usuario.admin
    ){

        return next('/chat')
    }

    next()
})

export default router