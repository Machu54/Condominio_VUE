<template>

  <Navbar />

  <div class="page">

    <div class="container">

      <!-- HEADER -->

      <div class="top-section">

        <div>

          <h1 class="title">
            Gestión de Multas
          </h1>

          <p class="subtitle">
            Administra las multas del condominio
          </p>

        </div>

        <!-- BOTON -->

        <button
          class="add-btn"
          @click="abrirModal"
        >

          <i class="ti ti-plus"></i>

          Nueva Multa

        </button>

      </div>

      <!-- TABLA -->

    <!-- TABLA -->

<div class="table-container">

  <table>

    <thead>

      <tr>

        <th>
          Usuario
        </th>

        <th>
          Motivo
        </th>

        <th>
          Monto
        </th>

        <th>
          Estado
        </th>

        <th class="acciones-column">
          Acciones
        </th>

      </tr>

    </thead>

    <tbody>

      <tr
        v-for="multa in multas"
        :key="multa.id"
      >

        <!-- USUARIO -->

        <td>

          {{ multa.nombre }}
          {{ multa.apellido_p }}

        </td>

        <!-- MOTIVO -->

        <td>

          {{ multa.motivo }}

        </td>

        <!-- MONTO -->

        <td class="monto">

          ${{ multa.monto }}

        </td>

        <!-- ESTADO -->

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

        <!-- ACTIONS -->

        <td class="acciones-column">

          <div class="actions">

            <!-- EDIT -->

            <button
              class="edit-btn"
              @click="editarMulta(multa)"
            >

              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="action-icon"
              >

                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M16.862 4.487a2.625 2.625 0 1 1 3.712 3.712L7.5 21.273 3 22.5l1.227-4.5L16.862 4.487Z"
                />

              </svg>

            </button>

            <!-- DELETE -->

            <button
              class="delete-btn"
              @click="eliminarMulta(multa.id)"
            >

              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="action-icon"
              >

                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5m6 4.125 2.25 2.25m0 0 2.25 2.25M12 13.875l2.25-2.25M12 13.875l-2.25 2.25M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z"
                />

              </svg>

            </button>

          </div>

        </td>

      </tr>

    </tbody>

  </table>

</div>
    </div>

  </div>

  <!-- MODAL -->

<Transition name="bounce">

  <div
    v-if="mostrarModal"
    class="modal-overlay"
  >

    <div class="modal">

      <h2>
        {{ editando ? 'Editar Multa' : 'Nueva Multa' }}
      </h2>

      <select v-model="form.id_persona">

        <option disabled value="">
          Selecciona un usuario
        </option>

        <option
          v-for="persona in personas"
          :key="persona.id"
          :value="persona.id"
        >
          {{ persona.nombre }}
          {{ persona.apellido_p }}
        </option>

      </select>

      <input
        v-model="form.motivo"
        type="text"
        placeholder="Motivo"
      />

      <input
        v-model="form.monto"
        type="number"
        placeholder="Monto"
      />

      <select v-model="form.estado">

        <option value="Pendiente">
          Pendiente
        </option>

        <option value="Pagada">
          Pagada
        </option>

      </select>

      <div class="modal-buttons">

        <button
          class="save-btn"
          @click="guardarMulta"
          :disabled="loading"
        >

          <span v-if="!loading">
            Guardar
          </span>

          <span v-else>
            Guardando...
          </span>

        </button>

        <button
          class="cancel-btn"
          @click="cerrarModal"
        >
          Cancelar
        </button>

      </div>

    </div>

  </div>

</Transition>

</template>

<script setup>

import { ref, onMounted } from 'vue'

import axios from 'axios'

import Navbar from '../components/Navbar.vue'

const multas = ref([])

const personas = ref([])

const mostrarModal = ref(false)

const editando = ref(false)

const multaId = ref(null)

const loading = ref(false)

const form = ref({

  id_persona: '',

  motivo: '',

  monto: '',

  estado: 'Pendiente'
})

/* =========================
   CARGAR MULTAS
========================= */

const cargarMultas = async () => {

  try {

    const response = await axios.get(
      'http://127.0.0.1:8000/api/multas'
    )

    multas.value = response.data

  } catch (e) {

    console.log(e)
  }
}

/* =========================
   CARGAR PERSONAS
========================= */

const cargarPersonas = async () => {

  try {

    const response = await axios.get(
      'http://127.0.0.1:8000/api/personas'
    )

    personas.value = response.data

  } catch (e) {

    console.log(e)
  }
}

/* =========================
   MODAL
========================= */

const abrirModal = () => {

  editando.value = false

  multaId.value = null

  form.value = {

    id_persona: '',

    motivo: '',

    monto: '',

    estado: 'Pendiente'
  }

  mostrarModal.value = true
}

const cerrarModal = () => {

  mostrarModal.value = false
}

/* =========================
   GUARDAR
========================= */

const guardarMulta = async () => {

  try {

    if(editando.value){

      await axios.put(

        `http://127.0.0.1:8000/api/multas/${multaId.value}`,

        form.value
      )

    } else {

      await axios.post(
        'http://127.0.0.1:8000/api/multas',
        form.value
      )
    }

    cerrarModal()

    cargarMultas()

  } catch (e) {

    console.log(e)
  }
}

/* =========================
   EDITAR
========================= */

const editarMulta = (multa) => {

  editando.value = true

  multaId.value = multa.id

  form.value = {

    id_persona: multa.id_persona,

    motivo: multa.motivo,

    monto: multa.monto,

    estado: multa.estado
  }

  mostrarModal.value = true
}

/* =========================
   ELIMINAR
========================= */

const eliminarMulta = async (id) => {

  try {

    await axios.delete(
      `http://127.0.0.1:8000/api/multas/${id}`
    )

    cargarMultas()

  } catch (e) {

    console.log(e)
  }
}

onMounted(() => {

  cargarMultas()

  cargarPersonas()
})

</script>

<style scoped>

*{
  box-sizing: border-box;
}

/* PAGE */

.page{

  min-height: 100vh;

  background: #f4f7fb;

  padding: 30px;
}

/* CONTAINER */

.container{

  max-width: 1200px;

  margin: auto;

  background: white;

  border-radius: 25px;

  padding: 35px;

  box-shadow: 0 10px 30px rgba(0,0,0,.05);
}

/* TOP */

.top-section{

  display: flex;

  justify-content: space-between;

  align-items: center;

  margin-bottom: 30px;
}

.title{

  font-size: 34px;

  color: #222;
}

.subtitle{

  color: gray;

  margin-top: 5px;
}

/* BUTTON */

.add-btn{

  border: none;

  background: #98C8E9;

  color: white;

  padding: 12px 18px;

  border-radius: 14px;

  cursor: pointer;

  display: flex;

  align-items: center;

  gap: 8px;

  font-weight: bold;

  transition: .2s;
}

.add-btn:hover{

  transform: translateY(-2px);

  background: #7eb7df;
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

  font-size: 15px;
}

td{

  padding: 18px;

  border-bottom: 1px solid #eee;

  color: #333;
}

tr:hover{

  background: #f9fcff;
}

/* MONTO */

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

/* ACTIONS COLUMN */

.acciones-column{

  width: 170px;

  min-width: 170px;

  text-align: center;
}

/* ACTIONS */

.actions{

  width: 100%;

  display: flex;

  align-items: center;

  justify-content: center;

  gap: 14px;
}

/* BUTTONS */

.edit-btn,
.delete-btn{

  width: 4px;

  height: 8 px;

  min-width: 70px;

  border: none;

  border-radius: 12px;

  cursor: pointer;

  display: flex;

  align-items: center;
  justify-content: center;

  transition: .2s;
}

.edit-btn{

  background: #98C8E9;

  color: white;
}

.delete-btn{

  background: #ef4444;

  color: white;
}

.edit-btn:hover,
.delete-btn:hover{

  transform: scale(1.05);
}

/* ICONS */

.action-icon{

  width: 20px;

  height: 20px;

  stroke-width: 2;
}

/* MODAL */

.modal-overlay{

  position: fixed;

  inset: 0;

  background: rgba(0,0,0,.4);

  display: flex;

  align-items: center;
  justify-content: center;

  z-index: 100;
}

.modal{

  width: 420px;

  background: white;

  border-radius: 24px;

  padding: 30px;

  display: flex;

  flex-direction: column;

  gap: 18px;

  color: #000;
}

.modal h2{

  color: #222;

  font-size: 24px;

  text-align: center;
}

/* INPUTS */

.modal input,
.modal select{

  height: 52px;

  border: 1px solid #ddd;

  border-radius: 12px;

  padding: 0 15px;

  font-size: 15px;

  background: white;

  color: #000;
}

.modal input:focus,
.modal select:focus{

  outline: none;

  border-color: #98C8E9;
}

/* BUTTONS */

.modal-buttons{

  display: flex;

  gap: 12px;

  margin-top: 10px;
}

.save-btn,
.cancel-btn{

  flex: 1;

  height: 50px;

  border: none;

  border-radius: 12px;

  cursor: pointer;

  font-weight: bold;
}

.save-btn{

  background: #98C8E9;

  color: white;
}

.cancel-btn{

  background: #eee;

  color: #222;
}

/* RESPONSIVE */

@media(max-width: 768px){

  .container{

    padding: 20px;
  }

  .top-section{

    flex-direction: column;

    align-items: flex-start;

    gap: 20px;
  }

  .modal{

    width: 95%;
  }
}

/* TRANSICION MODAL */

.bounce-enter-active {

  animation: bounce-in .5s;
}

.bounce-leave-active {

  animation: bounce-in .35s reverse;
}

@keyframes bounce-in {

  0% {

    opacity: 0;

    transform: scale(0);
  }

  50% {

    transform: scale(1.1);
  }

  100% {

    opacity: 1;

    transform: scale(1);
  }
}

</style>