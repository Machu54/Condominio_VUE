<template>

  <Navbar />

  <div class="page">

    <div class="container">

      <!-- HEADER -->

      <div class="top-section">

        <div>

          <h1 class="title">
            Mis Multas
          </h1>

          <p class="subtitle">
            Consulta las multas registradas a tu cuenta
          </p>

        </div>

      </div>

      <!-- TABLA -->

      <div class="table-container">

        <table>

          <thead>

            <tr>

              <th>Motivo</th>

              <th>Monto</th>

              <th>Fecha</th>

              <th>Estado</th>

            </tr>

          </thead>

          <tbody>

            <tr
              v-for="multa in multas"
              :key="multa.id"
            >

              <td>
                {{ multa.motivo }}
              </td>

              <td class="monto">
                ${{ multa.monto }}
              </td>
<td>
  {{
    (() => {

      const fecha = new Date(multa.fecha)

      const yyyy = fecha.getFullYear()

      const mm = String(fecha.getMonth() + 1).padStart(2, '0')

      const dd = String(fecha.getDate()).padStart(2, '0')

      let horas = fecha.getHours()

      const minutos = String(fecha.getMinutes()).padStart(2, '0')

      const ampm = horas >= 12 ? 'PM' : 'AM'

      horas = horas % 12 || 12

      return `${yyyy}-${mm}-${dd} ${horas}:${minutos} ${ampm}`

    })()
  }}
</td>

              <td>

                <span
                  class="estado"
                  :class="{
                    pagada: multa.estado == 'Pagada',
                    pendiente: multa.estado == 'Pendiente'
                  }"
                >
                  {{ multa.estado }}
                </span>

              </td>

            </tr>

          </tbody>

        </table>

      </div>

      <!-- VACIO -->

      <div
        v-if="multas.length == 0"
        class="empty-state"
      >

        <i class="ti ti-alert-circle"></i>

        <p>
          No tienes multas registradas
        </p>

      </div>

    </div>

  </div>

</template>

<script setup>

import { ref, onMounted } from 'vue'

import axios from 'axios'

import Navbar from '../components/Navbar.vue'

const usuario = JSON.parse(
  localStorage.getItem('usuario')
)

const multas = ref([])

const cargarMultas = async () => {

  try {

    const response = await axios.get(
      `http://127.0.0.1:8000/api/multas-usuario/${usuario.id_persona}`
    )

    multas.value = response.data

  } catch (e) {

    console.log(e)
  }
}

onMounted(() => {

  cargarMultas()
})

</script>

<style scoped>

*{
  box-sizing: border-box;
}

.page{

  min-height: 100vh;

  background: #f4f7fb;

  padding: 30px;
}

.container{

  width: 100%;

  max-width: 1200px;

  margin: auto;

  background: white;

  border-radius: 25px;

  padding: 35px;

  box-shadow: 0 10px 30px rgba(0,0,0,.05);
}

/* TOP */

.top-section{

  margin-bottom: 30px;
}

.title{

  font-size: 34px;

  color: #222;
}

.subtitle{

  color: #777;

  margin-top: 5px;
}

/* TABLE */

.table-container{

  overflow-x: auto;
}

table{

  width: 100%;

  border-collapse: collapse;
}

th{

  background: #98C8E9;

  color: white;

  padding: 18px;

  text-align: left;

  font-size: 14px;
}

td{

  padding: 18px;

  border-bottom: 1px solid #eee;

  color: #444;
}

tr:hover{

  background: #f9fcff;
}

.monto{

  font-weight: bold;

  color: #4f8fbd;
}

/* ESTADO */

.estado{

  padding: 8px 14px;

  border-radius: 30px;

  font-size: 13px;

  font-weight: bold;
}

.estado.pagada{

  background: #dcfce7;

  color: #166534;
}

.estado.pendiente{

  background: #fee2e2;

  color: #991b1b;
}

/* EMPTY */

.empty-state{

  padding: 50px;

  display: flex;

  flex-direction: column;

  align-items: center;

  justify-content: center;

  gap: 12px;

  color: gray;
}

.empty-state i{

  font-size: 50px;
}

</style>