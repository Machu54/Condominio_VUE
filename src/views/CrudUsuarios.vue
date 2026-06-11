<template>

  <Navbar />

  <div class="container">

    <div class="card">

      <div class="header">

        <h2>
          Gestión de Usuarios
        </h2>

        <button
          class="add-btn"
          @click="abrirModal"
        >
          Nuevo Usuario
        </button>

      </div>

      <table>

        <thead>

          <tr>

            <th>Persona</th>

            <th>Correo</th>

            <th>Rol</th>

            <th>Acciones</th>

          </tr>

        </thead>

        <tbody>

          <tr
            v-for="usuario in usuarios"
            :key="usuario.id"
          >

            <td>
              {{ usuario.nombre }}
              {{ usuario.apellido_p }}
            </td>

            <td>
              {{ usuario.correo }}
            </td>

            <td>

              <span
                :class="
                  usuario.admin
                  ? 'rol-admin'
                  : 'rol-user'
                "
              >

                {{
                  usuario.admin
                  ? 'Administrador'
                  : 'Usuario'
                }}

              </span>

            </td>

            <td>

              <button
                class="edit-btn"
                @click="editarUsuario(usuario)"
              >
                Editar
              </button>

              <button
                class="delete-btn"
                @click="eliminarUsuario(usuario.id)"
              >
                Eliminar
              </button>

            </td>

          </tr>

        </tbody>

      </table>

    </div>

    <!-- MODAL -->

    <Transition name="bounce">

      <div
        v-if="mostrarModal"
        class="modal-overlay"
      >

        <div class="modal">

          <h2>

            {{
              editando
              ? 'Editar Usuario'
              : 'Nuevo Usuario'
            }}

          </h2>

          <input
            v-model="form.nombre"
            type="text"
            placeholder="Nombre"
          />

          <input
            v-model="form.apellido_p"
            type="text"
            placeholder="Apellido paterno"
          />

          <input
            v-model="form.apellido_m"
            type="text"
            placeholder="Apellido materno"
          />

          <input
            v-model="form.celular"
            type="text"
            placeholder="Celular"
          />

        <input
  :value="form.correo"
  @input="form.correo = $event.target.value.toLowerCase()"
  type="email"
  placeholder="Correo"
/>

          <input
            v-model="form.pass"
            type="password"
            placeholder="Contraseña"
          />

          <select v-model="form.admin">

            <option :value="true">
              Administrador
            </option>

            <option :value="false">
              Usuario
            </option>

          </select>

          <div class="modal-buttons">

            <button
              class="save-btn"
              @click="guardarUsuario"
            >
              Guardar
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

  </div>

</template>


<script setup>

import axios from 'axios'

import { ref, onMounted } from 'vue'

import { useRouter } from 'vue-router'

import Navbar from '../components/Navbar.vue'

const router = useRouter()

const usuarios = ref([])

const personas = ref([])

const mostrarModal = ref(false)

const editando = ref(false)

const usuarioId = ref(null)

const form = ref({

  nombre: '',

  apellido_p: '',

  apellido_m: '',

  celular: '',

  correo: '',

  pass: '',

  admin: false
})

const cargarUsuarios = async () => {

  const response = await axios.get(
    'http://127.0.0.1:8000/api/usuarios'
  )

  usuarios.value = response.data
}

const cargarPersonas = async () => {

  const response = await axios.get(
    'http://127.0.0.1:8000/api/personas'
  )

  personas.value = response.data
}

const abrirModal = () => {

  editando.value = false

  form.value = {

    nombre: '',

    apellido_p: '',

    apellido_m: '',

    celular: '',

    correo: '',

    pass: '',

    admin: false
  }

  mostrarModal.value = true
}

const cerrarModal = () => {

  mostrarModal.value = false
}

const guardarUsuario = async () => {

  try {

    if(editando.value){

      await axios.put(

        `http://127.0.0.1:8000/api/usuarios/${usuarioId.value}`,

        form.value
      )

      alert(
        'Usuario actualizado correctamente'
      )

    } else {

      await axios.post(

        'http://127.0.0.1:8000/api/usuarios',

        form.value
      )

      alert(
        'Usuario creado correctamente. Revisa tu correo para obtener el código de verificación.'
      )

    }

    cerrarModal()

    cargarUsuarios()

  } catch (error) {

    alert(
      error.response?.data?.mensaje
      ||
      'Error al guardar usuario'
    )
  }
}

const editarUsuario = (usuario) => {

  editando.value = true

  usuarioId.value = usuario.id

  form.value = {

    nombre: usuario.nombre,

    apellido_p: usuario.apellido_p,

    apellido_m: usuario.apellido_m,

    celular: usuario.celular,

    correo: usuario.correo,

    pass: '',

    admin: usuario.admin
  }

  mostrarModal.value = true
}

const eliminarUsuario = async (id) => {

  if(!confirm('¿Deseas eliminar este usuario?')){

    return
  }

  await axios.delete(
    `http://127.0.0.1:8000/api/usuarios/${id}`
  )

  cargarUsuarios()
}

onMounted(() => {

  cargarUsuarios()

  cargarPersonas()
})

</script>

<style scoped>
*{
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.container{
  min-height: calc(100vh - 70px);
  background: #f4f6f9;
  padding: 40px;
  display: flex;
  justify-content: center;
}

.card{
  width: 100%;
  max-width: 1400px;
  background: #ffffff;
  border-radius: 24px;
  padding: 30px;
  box-shadow: 0 10px 30px rgba(0,0,0,.08);
}

.header{
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
}

.header h2{
  color: #2d3748;
  font-size: 32px;
  font-weight: 700;
}

.add-btn{
  border: none;
  background: #98C8E9;
  color: white;
  padding: 14px 25px;
  border-radius: 14px;
  cursor: pointer;
  font-weight: 600;
  font-size: 15px;
  transition: .3s;
}

.add-btn:hover{
  background: #7cb9e5;
  transform: translateY(-2px);
}

/* TABLA */

table{
  width: 100%;
  border-collapse: collapse;
  overflow: hidden;
  border-radius: 18px;
}

thead{
  background: #98C8E9;
}

thead th{
  color: white;
  padding: 18px;
  font-size: 15px;
  font-weight: 600;
  text-align: left;
}

tbody td{
  padding: 18px;
  border-bottom: 1px solid #e5e7eb;
  color: #374151;
}

tbody tr{
  transition: .2s;
}

tbody tr:hover{
  background: #f8fbfd;
}

/* ROLES */

.rol-admin{
  background: #22c55e;
  color: white;
  padding: 8px 14px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 700;
}

.rol-user{
  background: #64748b;
  color: white;
  padding: 8px 14px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 700;
}

/* BOTONES ACCIONES */

.edit-btn{
  border: none;
  background: #3b82f6;
  color: white;
  padding: 10px 16px;
  border-radius: 10px;
  cursor: pointer;
  margin-right: 8px;
  font-weight: 600;
  transition: .3s;
}

.edit-btn:hover{
  background: #2563eb;
}

.delete-btn{
  border: none;
  background: #ef4444;
  color: white;
  padding: 10px 16px;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 600;
  transition: .3s;
}

.delete-btn:hover{
  background: #dc2626;
}

/* MODAL */

.modal-overlay{
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
  backdrop-filter: blur(4px);
}

.modal{
  width: 500px;
  background: white;
  border-radius: 24px;
  padding: 30px;
  display: flex;
  flex-direction: column;
  gap: 15px;
  box-shadow: 0 20px 40px rgba(0,0,0,.2);
}

.modal h2{
  text-align: center;
  color: #2d3748;
  margin-bottom: 10px;
}

.modal input,
.modal select{
  width: 100%;
  height: 55px;
  border: 1px solid #d1d5db;
  border-radius: 12px;
  padding: 0 15px;
  font-size: 15px;
  background: white;
  color: black;
}

.modal input::placeholder{
  color: #000;
  opacity: 1;
}

.modal input:focus,
.modal select:focus{
  outline: none;
  border-color: #98C8E9;
  box-shadow: 0 0 0 4px rgba(152,200,233,.25);
}

.modal-buttons{
  display: flex;
  gap: 12px;
  margin-top: 10px;
}

.save-btn{
  flex: 1;
  height: 52px;
  border: none;
  border-radius: 12px;
  background: #98C8E9;
  color: white;
  font-weight: 700;
  cursor: pointer;
}

.save-btn:hover{
  background: #7cb9e5;
}

.cancel-btn{
  flex: 1;
  height: 52px;
  border: none;
  border-radius: 12px;
  background: #e5e7eb;
  color: #374151;
  font-weight: 700;
  cursor: pointer;
}

.cancel-btn:hover{
  background: #d1d5db;
}

/* ANIMACIÓN */

.bounce-enter-active{
  animation: bounce-in .35s;
}

.bounce-leave-active{
  animation: bounce-in .25s reverse;
}

@keyframes bounce-in{
  0%{
    opacity: 0;
    transform: scale(.8);
  }

  100%{
    opacity: 1;
    transform: scale(1);
  }
}
</style>