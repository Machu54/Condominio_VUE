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

      <button class="nav-btn active">

        <i class="ti ti-message-circle"></i>

        <span>
          Chat
        </span>

      </button>

      <!-- NOTIFICACIONES -->

      <button class="nav-btn">

        <i class="ti ti-bell"></i>

        <span>
          Notificaciones
        </span>

      </button>

      <!-- MULTAS -->

      <button class="nav-btn">

        <i class="ti ti-alert-triangle"></i>

        <span>
          Multas
        </span>

      </button>

    </nav>

    <!-- USER -->

    <div class="header-right">

      <div class="user-avatar">
        {{ usuarioInicial }}
      </div>

      <!-- LOGOUT -->

      <button
        class="logout-btn"
        @click="cerrarSesion"
      >
        <i class="ti ti-logout"></i>

        <span>
          Salir
        </span>
      </button>

    </div>

  </header>

</template>

<script setup>

import { useRouter } from 'vue-router'

const router = useRouter()

const usuario = JSON.parse(
  localStorage.getItem('usuario')
)

const usuarioInicial = usuario?.correo
  ?.charAt(0)
  ?.toUpperCase()

const cerrarSesion = () => {

  localStorage.removeItem('usuario')

  router.push('/')
}

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

.user-avatar{

  width: 42px;
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

</style>