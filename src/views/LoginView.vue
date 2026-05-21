<template>

  <div class="min-h-screen flex items-center justify-center bg-gray-100">

    <div class="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">

      <h1 class="text-3xl font-bold text-center mb-6">
        Login
      </h1>

      <form @submit.prevent="login">

        <div class="mb-4">

          <label class="block mb-2 font-semibold">
            Correo
          </label>

          <input
            v-model="correo"
            type="email"
            class="w-full border rounded-lg px-4 py-3"
            placeholder="correo@gmail.com"
          />

        </div>

        <div class="mb-6">

          <label class="block mb-2 font-semibold">
            Contraseña
          </label>

          <input
            v-model="pass"
            type="password"
            class="w-full border rounded-lg px-4 py-3"
            placeholder="********"
          />

        </div>

        <button
          class="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg"
        >
          Entrar
        </button>

      </form>

      <p
        v-if="error"
        class="text-red-500 text-center mt-4"
      >
        {{ error }}
      </p>

    </div>

  </div>

</template>

<script setup>

import axios from 'axios'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const correo = ref('')
const pass = ref('')

const error = ref('')

const login = async () => {

  try {

    const response = await axios.post(
      'http://127.0.0.1:8000/api/login',
      {
        correo: correo.value,
        pass: pass.value
      }
    )

    if(response.data.ok){

      localStorage.setItem(
        'usuario',
        JSON.stringify(response.data.usuario)
      )

      router.push('/chat')
    }

  } catch (e) {

    error.value = 'Correo o contraseña incorrectos'
  }
}

</script>