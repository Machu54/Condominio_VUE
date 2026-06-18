<template>
  <router-view />
</template>

<script setup>

import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Swal from 'sweetalert2'

const router = useRouter()

onMounted(() => {

    const usuario = JSON.parse(
        localStorage.getItem('usuario')
    )

    if (!usuario) {
        return
    }

    window.Echo
        .channel(`logout.${usuario.id}`)
        .listen('.Mensaje', async (e) => {

            console.log('Evento recibido', e)

            localStorage.removeItem('token')
            localStorage.removeItem('usuario')

            await Swal.fire({

                icon: 'warning',

                title: 'Sesión cerrada',

                text: 'Tu contraseña fue modificada por un administrador. Debes iniciar sesión nuevamente.',

                confirmButtonText: 'Aceptar',

                confirmButtonColor: '#98C8E9',

                allowOutsideClick: false,

                allowEscapeKey: false
            })

            router.push('/')
        })
})

</script>