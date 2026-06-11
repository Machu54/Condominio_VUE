<template>

  <div class="min-h-screen flex items-center justify-center bg-gray-100">

    <div class="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">

      <h1 class="text-3xl font-bold text-center mb-6">
        Novahabitad
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

      localStorage.setItem(
        'token',
        response.data.token
      )

      router.push('/chat')
    }

  } catch (e) {

    const mensaje =
      e.response?.data?.mensaje

    if(
      mensaje ===
      'Debes verificar tu correo antes de iniciar sesión'
    ){

      router.push({

        path: '/verificar-correo',

        query: {

          correo: correo.value
        }
      })

      return
    }

    error.value =
      mensaje
      ||
      'Error al iniciar sesión'
  }
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
  background: #f5f5f5;
}

.min-h-screen {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #ffffff 0%, #98C8E9 100%);
}

.bg-white {
  background: white;
  border-radius: 24px;
  box-shadow: 0 20px 35px -10px rgba(0, 0, 0, 0.2);
  padding: 2rem;
  width: 100%;
  max-width: 28rem;
}

h1 {
  font-size: 2rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 1.75rem;
  background: linear-gradient(135deg, #667eea 0%, #98C8E9 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

label {
  display: block;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #333333;
  font-size: 0.95rem;
}

input {
  width: 100%;
  border: 2px solid #d1d5db;
  border-radius: 12px;
  padding: 0.85rem 1rem;
  font-size: 1rem;
  font-family: inherit;
  transition: all 0.2s ease;

  background-color: #ffffff;
  color: #000000;
}

input::placeholder {
  color: #000000;
  opacity: 1;
}

input:focus {
  outline: none;
  border-color: #764ba2;
  box-shadow: 0 0 0 3px rgba(118, 75, 162, 0.15);
}

button {
  width: 100%;
  background: linear-gradient(135deg, #7ab2dd 0%, #98C8E9 100%);
  color: white;
  padding: 0.85rem 1rem;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1rem;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: inherit;
  margin-top: 0.5rem;
}

button:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px -5px rgba(122, 178, 221, 0.4);
}

button:active {
  transform: translateY(0);
}

.text-red-500 {
  color: #ef4444;
  font-size: 0.875rem;
  text-align: center;
  margin-top: 1rem;
}

.mb-4 {
  margin-bottom: 1rem;
}

.mb-6 {
  margin-bottom: 1.5rem;
}
</style>