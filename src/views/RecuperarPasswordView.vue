<template>

  <div class="container">

    <div class="card">

      <h1>
        Recuperar Contraseña
      </h1>

      <!-- PASO 1 -->

      <div v-if="paso == 1">

        <input
          v-model="correo"
          type="email"
          placeholder="Correo electrónico"
        />

        <button
          @click="enviarCodigo"
          :disabled="cargando"
        >

          <span v-if="!cargando">
            Enviar código
          </span>

          <div
            v-else
            class="spinner-container"
          >

            <div class="spinner"></div>

            <span>
              Enviando...
            </span>

          </div>

        </button>

      </div>

      <!-- PASO 2 -->

      <div v-if="paso == 2">

        <input
          v-model="codigo"
          maxlength="6"
          placeholder="Código de 6 dígitos"
        />

        <button @click="verificarCodigo">
          Verificar
        </button>

      </div>

      <!-- MENSAJE -->

      <p
        v-if="mensaje"
        class="mensaje"
      >
        {{ mensaje }}
      </p>

      <!-- VOLVER -->

      <button
        class="volver"
        @click="router.push('/')"
      >
        Volver al login
      </button>

    </div>

    <!-- MODAL -->

    <Transition name="bounce">

      <div
        v-if="mostrarModal"
        class="modal-fondo"
      >

        <div class="modal">

          <h2>
            Nueva contraseña
          </h2>

          <input
            v-model="password"
            type="password"
            placeholder="Nueva contraseña"
          />

          <input
            v-model="confirmar"
            type="password"
            placeholder="Confirmar contraseña"
          />

          <div class="modal-buttons">

            <button
              class="guardar"
              @click="cambiarPassword"
            >
              Guardar
            </button>

            <button
              class="cancelar"
              @click="mostrarModal = false"
            >
              Cancelar
            </button>

          </div>

        </div>

      </div>

    </Transition>

  </div>

</template>
<script setup>

import axios from 'axios'

import Swal from 'sweetalert2'

import { ref } from 'vue'

import { useRouter } from 'vue-router'

const router = useRouter()

const paso = ref(1)

const correo = ref('')

const codigo = ref('')

const password = ref('')

const confirmar = ref('')

const mensaje = ref('')

const mostrarModal = ref(false)

const cargando = ref(false)

/* ENVIAR CODIGO */

const enviarCodigo = async () => {

  cargando.value = true

  try {

    const response = await axios.post(

      'http://127.0.0.1:8000/api/recuperar',

      {
        correo: correo.value
      }
    )

    mensaje.value =
      response.data.mensaje

    paso.value = 2

  } catch (e) {

    mensaje.value =
      e.response?.data?.mensaje
      ||
      'Error al enviar el código'

  } finally {

    cargando.value = false
  }
}

/* VERIFICAR CODIGO */

const verificarCodigo = async () => {

  try {

    const response = await axios.post(

      'http://127.0.0.1:8000/api/verificar-codigo',

      {

        correo: correo.value,

        codigo: codigo.value
      }
    )

    if(response.data.ok){

      mensaje.value = ''

      mostrarModal.value = true
    }
    else{

      mensaje.value =
        response.data.mensaje
    }

  } catch (e) {

    mensaje.value =
      e.response?.data?.mensaje
      ||
      'Código incorrecto'
  }
}

/* CAMBIAR CONTRASEÑA */

const cambiarPassword = async () => {

  if(password.value !== confirmar.value){

    mensaje.value =
      'Las contraseñas no coinciden'

    return
  }

  try {

    const response = await axios.post(

      'http://127.0.0.1:8000/api/nueva-password',

      {

        correo: correo.value,

        pass: password.value
      }
    )

    await Swal.fire({

      icon: 'success',

      title: 'Contraseña actualizada',

      text: response.data.mensaje,

      confirmButtonColor: '#98C8E9'
    })

    mostrarModal.value = false

    localStorage.removeItem('token')

    localStorage.removeItem('usuario')

    router.push('/')

  } catch (e) {

    mensaje.value =
      e.response?.data?.mensaje
      ||
      'Error al actualizar la contraseña'
  }
}

</script>

<style scoped>
.spinner-container{

  display: flex;

  align-items: center;

  justify-content: center;

  gap: 10px;
}

.spinner{

  width: 20px;

  height: 20px;

  border: 3px solid rgba(255,255,255,.4);

  border-top: 3px solid white;

  border-radius: 50%;

  animation: girar .8s linear infinite;
}

button:disabled{

  opacity: .85;

  cursor: not-allowed;
}

@keyframes girar{

  from{

    transform: rotate(0deg);
  }

  to{

    transform: rotate(360deg);
  }
}
.container{

  min-height: 100vh;

  display: flex;

  justify-content: center;

  align-items: center;

  background: linear-gradient(
    135deg,
    white,
    #98C8E9
  );
}

.card{

  width: 400px;

  background: white;

  padding: 35px;

  border-radius: 20px;

  box-shadow: 0 10px 30px rgba(0,0,0,.15);
}

h1{

  color: #6a84e6;

  font-size: 40px;

  font-weight: bold;

  text-align: center;

  margin-bottom: 30px;

  line-height: 1.2;

  background: none;

  -webkit-text-fill-color: initial;
}

input{

  width: 100%;

  height: 50px;

  margin-bottom: 15px;

  border: 1px solid #ddd;

  border-radius: 10px;

  padding: 0 15px;

  font-size: 15px;
}

button{

  width: 100%;

  height: 50px;

  border: none;

  border-radius: 10px;

  background: #98C8E9;

  color: white;

  cursor: pointer;

  margin-top: 10px;

  font-size: 15px;

  transition: .2s;
}

button:hover{

  transform: translateY(-2px);
}

.mensaje{

  text-align: center;

  margin-top: 15px;

  color: #444;
}

.volver{

  background: #ddd;

  color: black;
}

/* MODAL */

.modal-fondo{

  position: fixed;

  top: 0;

  left: 0;

  width: 100%;

  height: 100%;

  background: rgba(0,0,0,.5);

  display: flex;

  justify-content: center;

  align-items: center;

  z-index: 999;
}

.modal{

  width: 400px;

  background: white;

  border-radius: 20px;

  padding: 30px;

  box-shadow: 0 20px 40px rgba(0,0,0,.25);
}

.modal h2{

  text-align: center;

  color: #6a84e6;

  margin-bottom: 20px;
}

.modal-buttons{

  display: flex;

  gap: 10px;

  margin-top: 10px;
}

.guardar{

  flex: 1;

  background: #98C8E9;
}

.cancelar{

  flex: 1;

  background: #d1d5db;

  color: black;
}

/* TRANSICION */

.bounce-enter-active{

  animation: bounce-in .4s;
}

.bounce-leave-active{

  animation: bounce-in .3s reverse;
}

@keyframes bounce-in{

  0%{

    opacity: 0;

    transform: scale(.5);
  }

  50%{

    transform: scale(1.05);
  }

  100%{

    opacity: 1;

    transform: scale(1);
  }
}

</style>