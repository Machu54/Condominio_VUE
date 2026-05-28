<template>

  <header class="main-header">

    <!-- LOGO -->

    <div class="header-left">

      <div class="logo">
        <i class="ti ti-building-community"></i>
      </div>

      <h1 class="title">
        NovaHabitat
      </h1>

    </div>

    <!-- NAV -->

    <nav class="nav-menu">

      <!-- CHAT -->

      <button
        class="nav-btn"
        :class="{ active: route.path == '/chat' }"
        @click="router.push('/chat')"
      >

        <i class="ti ti-message-circle"></i>

        <span>
          Chat
        </span>

      </button>

      <!-- MULTAS ADMIN -->

      <button
        class="nav-btn"
        :class="{ active: route.path == '/multas' }"
        @click="router.push('/multas')"
      >

        <i class="ti ti-alert-triangle"></i>

        <span>
          Multas
        </span>

      </button>

      <!-- MIS MULTAS -->

      <button
        class="nav-btn"
        :class="{ active: route.path == '/multas-general' }"
        @click="router.push('/multas-general')"
      >

        <i class="ti ti-file-text"></i>

        <span>
          Mis Multas
        </span>

      </button>

    </nav>

    <!-- RIGHT -->

    <div class="header-right">

      <!-- NOTIFICACIONES -->

      <div class="notification-menu">

        <button
          class="notification-btn"
          @click="toggleMenu"
        >

          <div class="notification-wrapper">

            <img
              src="../assets/notificacion.png"
              class="notification-image"
            />

            <span
              v-if="notificaciones.length > 0"
              class="notification-badge"
            >
              {{ notificaciones.length }}
            </span>

          </div>

        </button>

        <!-- DROPDOWN -->

        <div
          v-if="mostrarMenu"
          class="notification-dropdown"
        >

          <div class="dropdown-header">

            <h3>
              Notificaciones
            </h3>

          </div>

          <!-- LISTA -->

          <div
            v-if="notificaciones.length > 0"
            class="notification-list"
          >

            <div
              v-for="(item, index) in notificaciones"
              :key="index"
              class="notification-item"
              @click="abrirNotificacion(item)"
            >

              <!-- ICON -->

              <div class="notification-icon">

                <i
                  class="ti"
                  :class="
                    item.tipo == 'mensaje'
                    ? 'ti-message-circle'
                    : 'ti-alert-triangle'
                  "
                ></i>

              </div>

              <!-- CONTENT -->

              <div class="notification-content">

                <p class="notification-title">
                  {{ item.titulo }}
                </p>

                <span class="notification-time">
                  {{ item.hora }}
                </span>

              </div>

              <!-- DELETE -->

              <button
                class="delete-notification-btn"
                @click.stop="eliminarNotificacion(index)"
              >

                <i class="ti ti-x"></i>

              </button>

            </div>

          </div>

          <!-- VACIO -->

          <div
            v-else
            class="empty-notifications"
          >

            <i class="ti ti-bell-off"></i>

            <p>
              Sin notificaciones
            </p>

          </div>

        </div>

      </div>

      <!-- USER -->

      <div class="user-avatar">
        {{ usuarioInicial }}
      </div>

      <!-- LOGOUT -->

<!-- LOGOUT -->
<button
  class="logout-btn"
  @click="cerrarSesion"
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke-width="1.5"
    stroke="currentColor"
    class="logout-icon"
  >
    <path
      stroke-linecap="round"
      stroke-linejoin="round"
      d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15"
    />
  </svg>

  <span>Salir</span>
</button>

    </div>

  </header>

</template>

<script setup>

import { ref, onMounted } from 'vue'

import { useRouter, useRoute } from 'vue-router'

const router = useRouter()

const route = useRoute()

const mostrarMenu = ref(false)

const notificaciones = ref([])

const usuario = JSON.parse(
  localStorage.getItem('usuario')
)

const usuarioInicial = usuario?.correo
  ?.charAt(0)
  ?.toUpperCase()

/* AUDIO */

const notificationAudio = new Audio(
  '/notificacion.mp3'
)

/* =========================================
   LOGOUT
========================================= */

const cerrarSesion = () => {

  localStorage.removeItem('usuario')

  router.push('/')
}

/* =========================================
   MENU
========================================= */

const toggleMenu = () => {

  mostrarMenu.value = !mostrarMenu.value
}

/* =========================================
   ELIMINAR
========================================= */

const eliminarNotificacion = (index) => {

  notificaciones.value.splice(index, 1)
}

/* =========================================
   ABRIR
========================================= */

const abrirNotificacion = (item) => {

  mostrarMenu.value = false

  if(item.tipo == 'mensaje'){

    router.push('/chat')
  }

  if(item.tipo == 'multa'){

    router.push('/multas-general')
  }
}

/* =========================================
   EVENTOS
========================================= */

onMounted(() => {

  /* =========================================
     CHAT
  ========================================= */

  window.Echo.channel('chat')
  .listen('.Mensaje', (e) => {

    console.log(e)

    /* NO NOTIFICARTE A TI MISMO */

    if(e.data.remitente == usuario.id_persona){
      return
    }

    /* SI YA ESTAS EN CHAT */

    if(route.path == '/chat'){
      return
    }

    /* SONIDO */

    notificationAudio.currentTime = 0

    notificationAudio.play()

    /* NOTIFICACION */

    notificaciones.value.unshift({

      tipo: 'mensaje',

      titulo: `Nuevo mensaje de ${e.data.usuario}`,

      hora: 'Ahora'
    })

  })

  /* =========================================
     MULTAS SOLO DEL USUARIO
  ========================================= */

  window.Echo.channel(
    'multas.' + usuario.id_persona
  )
  .listen('.Mensaje', (e) => {

    console.log(e)

    notificationAudio.currentTime = 0

    notificationAudio.play()

    notificaciones.value.unshift({

      tipo: 'multa',

      titulo: e.data.mensaje,

      hora: 'Ahora'
    })

  })

})

</script>

<style scoped>

*{
  box-sizing: border-box;
}

.main-header{

  width: 100%;
  height: 70px;

  background: #98C8E9;

  display: flex;
  align-items: center;
  justify-content: space-between;

  padding: 0 25px;

  border-bottom: 1px solid #7eb7df;
}

/* LEFT */

.header-left{

  display: flex;
  align-items: center;

  gap: 12px;
}

.logo{

  width: 45px;
  height: 45px;

  border-radius: 12px;

  background: white;

  display: flex;
  align-items: center;
  justify-content: center;

  color: #4f8fbd;

  font-size: 22px;
}

.title{

  margin: 0;

  color: white;

  font-size: 22px;

  font-weight: bold;
}

/* NAV */

.nav-menu{

  display: flex;
  align-items: center;

  gap: 10px;
}

.nav-btn{

  border: none;

  background: transparent;

  color: white;

  padding: 10px 18px;

  border-radius: 12px;

  cursor: pointer;

  display: flex;
  align-items: center;

  gap: 8px;

  font-size: 14px;
  font-weight: 500;

  transition: .2s;
}

.nav-btn:hover{

  background: rgba(255,255,255,.2);
}

.nav-btn.active{

  background: white;

  color: #4f8fbd;
}

/* RIGHT */

.header-right{

  display: flex;
  align-items: center;

  gap: 15px;
}

/* USER */

.user-avatar{

  width: 90px;
  height: 42px;

  border-radius: 50%;

  background: white;

  color: #4f8fbd;

  display: flex;
  align-items: center;
  justify-content: center;

  font-weight: bold;

  font-size: 18px;
}

/* NOTIFICATION */

.notification-menu{

  position: relative;
}

.notification-btn{

  width: 45px;
  height: 45px;

  border: none;

  border-radius: 12px;

  background: white;

  cursor: pointer;

  display: flex;

  align-items: center;
  justify-content: center;
}

.notification-wrapper{

  position: relative;

  display: flex;

  align-items: center;
  justify-content: center;
}

.notification-image{

  width: 26px;
  height: 26px;

  object-fit: contain;
}

.notification-badge{

  position: absolute;

  top: -10px;
  right: -12px;

  min-width: 20px;
  height: 20px;

  border-radius: 50%;

  background: red;

  color: white;

  font-size: 11px;

  font-weight: bold;

  display: flex;

  align-items: center;
  justify-content: center;

  padding: 2px 6px;
}

/* DROPDOWN */

.notification-dropdown{

  position: absolute;

  top: 60px;
  right: 0;

  width: 330px;

  background: white;

  border-radius: 18px;

  overflow: hidden;

  box-shadow: 0 10px 30px rgba(0,0,0,.15);

  z-index: 100;
}

.dropdown-header{

  padding: 18px;

  border-bottom: 1px solid #eee;
}

.dropdown-header h3{

  margin: 0;

  color: #222;
}

.notification-list{

  max-height: 350px;

  overflow-y: auto;
}

.notification-item{

  display: flex;

  gap: 14px;

  padding: 16px 18px;

  border-bottom: 1px solid #f3f3f3;

  cursor: pointer;

  transition: .2s;
}

.notification-item:hover{

  background: #f8fbfd;
}

.notification-icon{

  width: 40px;
  height: 40px;

  border-radius: 12px;

  background: #98C8E9;

  color: white;

  display: flex;

  align-items: center;
  justify-content: center;

  font-size: 18px;
}

.notification-content{

  flex: 1;
}

.notification-title{

  margin: 0;

  font-size: 14px;

  font-weight: 600;

  color: #333;
}

.notification-time{

  font-size: 12px;

  color: gray;
}

/* DELETE */

.delete-notification-btn{

  width: 28px;
  height: 28px;

  border: none;

  border-radius: 8px;

  background: transparent;

  color: #999;

  cursor: pointer;

  display: flex;

  align-items: center;
  justify-content: center;

  transition: .2s;
}

.delete-notification-btn:hover{

  background: #f1f1f1;

  color: red;
}

/* EMPTY */

.empty-notifications{

  padding: 35px;

  display: flex;

  flex-direction: column;

  align-items: center;

  gap: 10px;

  color: gray;
}

.empty-notifications i{

  font-size: 35px;
}

/* LOGOUT */

.logout-btn{

  border: none;

  background: white;

  color: #4f8fbd;

  padding: 10px 16px;

  border-radius: 12px;

  cursor: pointer;

  display: flex;

  align-items: center;

  gap: 8px;

  font-weight: 600;

  transition: .2s;
}

.logout-btn:hover{

  transform: translateY(-1px);

  background: #f4f9fc;
}

.logout-icon{

  width: 22px;

  height: 22px;

  flex-shrink: 0;
}

</style>