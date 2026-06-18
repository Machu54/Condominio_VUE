<template>

  <Navbar />

  <div class="container">

      <div class="card">

          <h1>
              Mi Perfil
          </h1>

          <div class="form">

              <input
                  v-model="form.nombre"
                  type="text"
                  placeholder="Nombre"
              >

              <input
                  v-model="form.apellido_p"
                  type="text"
                  placeholder="Apellido paterno"
              >

              <input
                  v-model="form.apellido_m"
                  type="text"
                  placeholder="Apellido materno"
              >

           

              <input
                  v-model="form.correo"
                  type="email"
                  placeholder="Correo"
              >

              <input
                  v-model="form.pass"
                  type="password"
                  placeholder="Nueva contraseña (opcional)"
              >

              <button
                  @click="guardar"
                  class="btn-guardar"
              >
                  Guardar Cambios
              </button>

          </div>

      </div>

  </div>

</template>

<script setup>

import Navbar from '../components/Navbar.vue'

import axios from 'axios'

import Swal from 'sweetalert2'

import { ref, onMounted } from 'vue'

import { useRouter } from 'vue-router'

const router = useRouter()

const form = ref({

    nombre: '',

    apellido_p: '',

    apellido_m: '',

    celular: '',

    correo: '',

    pass: ''
})

const cargarPerfil = async () => {

    const response = await axios.get(
        'http://127.0.0.1:8000/api/perfil'
    )

    const usuario =
    response.data.usuario

    form.value = {

        nombre: usuario.nombre,

        apellido_p: usuario.apellido_p,

        apellido_m: usuario.apellido_m,

        celular: usuario.celular,

        correo: usuario.correo,

        pass: ''
    }
}

const guardar = async () => {

    try {

        if(form.value.pass){

            const confirmar =
            await Swal.fire({

                icon: 'warning',

                title: 'Cambiar contraseña',

                text: 'Al cambiar tu contraseña se cerrará la sesión en todos tus dispositivos.',

                showCancelButton: true,

                confirmButtonText: 'Confirmar',

                cancelButtonText: 'Cancelar',

                confirmButtonColor: '#98C8E9'
            })

            if(!confirmar.isConfirmed){

                return
            }
        }

        const response = await axios.put(

            'http://127.0.0.1:8000/api/perfil',

            form.value
        )

        if(response.data.cerrarSesion){

            await Swal.fire({

                icon: 'success',

                title: 'Contraseña actualizada',

                text: 'Debes iniciar sesión nuevamente.'
            })

            localStorage.removeItem('token')

            localStorage.removeItem('usuario')

            router.push('/')

            return
        }

        Swal.fire({

            icon: 'success',

            title: 'Perfil actualizado',

            text: 'Los cambios se guardaron correctamente.'
        })

    } catch (error) {

        Swal.fire({

            icon: 'error',

            title: 'Error',

            text: 'No fue posible actualizar el perfil.'
        })
    }
}



onMounted(() => {

    cargarPerfil()
})

</script>



<style scoped>

.container{

    min-height: 100vh;

    display: flex;

    justify-content: center;

    align-items: center;

    background: #f5f7fb;
}

.card{

    width: 100%;

    max-width: 600px;

    background: white;

    padding: 35px;

    border-radius: 24px;

    box-shadow: 0 10px 25px rgba(0,0,0,.08);
}

h1{

    text-align: center;

    margin-bottom: 25px;

    color: #374151;

    font-size: 28px;

    font-weight: 700;
}

.form{

    display: flex;

    flex-direction: column;

    gap: 15px;
}

input{

    width: 100%;

    height: 55px;

    border: 1px solid #d1d5db;

    border-radius: 14px;

    padding: 0 16px;

    font-size: 15px;
}

input:focus{

    outline: none;

    border-color: #98C8E9;
}

.btn-guardar{

    height: 55px;

    border: none;

    border-radius: 14px;

    background: #98C8E9;

    color: white;

    font-size: 16px;

    font-weight: 700;

    cursor: pointer;

    transition: .3s;
}

.btn-guardar:hover{

    background: #7db8df;
}

</style>