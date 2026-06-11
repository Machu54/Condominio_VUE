 <template>

  <div class="min-h-screen flex items-center justify-center bg-gray-100">

    <div class="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">

      <h1 class="text-3xl font-bold text-center mb-6">
        Verificar correo
      </h1>

      <p class="text-center mb-4">
        Ingresa tu correo y el código recibido.
      </p>

      <input
        v-model="correo"
        type="email"
        placeholder="Correo"
        class="w-full border rounded-lg px-4 py-3 mb-4"
      />

      <input
        v-model="codigo"
        type="text"
        placeholder="Código de verificación"
        class="w-full border rounded-lg px-4 py-3 mb-4"
      />

      <button
        @click="verificar"
        class="w-full bg-blue-600 text-white py-3 rounded-lg"
      >
        Verificar
      </button>

      <p
        v-if="mensaje"
        class="text-center mt-4"
      >
        {{ mensaje }}
      </p>

    </div>

  </div>

</template>

<script setup>

import axios from 'axios'
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const correo = ref(
  route.query.correo || ''
)

const codigo = ref('')
const mensaje = ref('')

const verificar = async () => {

  try {

    const response = await axios.post(

      'http://127.0.0.1:8000/api/verificar-correo',

      {
        correo: correo.value,
        codigo: codigo.value
      }
    )

    if(response.data.ok){

      mensaje.value =
      'Correo verificado correctamente'

      setTimeout(() => {

        router.push('/')

      }, 1500)
    }

  } catch (e) {

    mensaje.value =
      e.response?.data?.mensaje
      ||
      'Código incorrecto'
  }
}

</script>