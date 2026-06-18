import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './style.css'

import axios from 'axios'

import Echo from 'laravel-echo'
import Pusher from 'pusher-js'

window.Pusher = Pusher

/*
|--------------------------------------------------------------------------
| AXIOS
|--------------------------------------------------------------------------
*/

axios.defaults.baseURL = 'http://127.0.0.1:8000/api'

const token = localStorage.getItem('token')

if (token) {

    axios.defaults.headers.common['Authorization'] =
        `Bearer ${token}`
}

/*
|--------------------------------------------------------------------------
| INTERCEPTOR 401
|--------------------------------------------------------------------------
*/

axios.interceptors.response.use(

    response => response,

    error => {

        if (error.response?.status === 401) {

            localStorage.removeItem('token')
            localStorage.removeItem('usuario')

            alert(
                'Tu sesión ha expirado. Inicia sesión nuevamente.'
            )

            router.push('/')
        }

        return Promise.reject(error)
    }
)

/*
|--------------------------------------------------------------------------
| REVERB
|--------------------------------------------------------------------------
*/

window.Echo = new Echo({

    broadcaster: 'reverb',

    key: import.meta.env.VITE_REVERB_APP_KEY,

    wsHost: import.meta.env.VITE_REVERB_HOST,

    wsPort: Number(
        import.meta.env.VITE_REVERB_PORT
    ),

    wssPort: Number(
        import.meta.env.VITE_REVERB_PORT
    ),

    forceTLS: false,

    enabledTransports: [
        'ws',
        'wss'
    ]
})

/*
|--------------------------------------------------------------------------
| DEBUG REVERB
|--------------------------------------------------------------------------
*/

window.Echo.connector.pusher.connection.bind(

    'connected',

    () => {

        console.log(
            '✅ Reverb conectado'
        )
    }
)

window.Echo.connector.pusher.connection.bind(

    'error',

    (error) => {

        console.error(
            '❌ Error Reverb:',
            error
        )
    }
)

window.Echo.connector.pusher.connection.bind(

    'disconnected',

    () => {

        console.warn(
            '⚠️ Reverb desconectado'
        )
    }
)

/*
|--------------------------------------------------------------------------
| APP
|--------------------------------------------------------------------------
*/

createApp(App)
.use(router)
.mount('#app')