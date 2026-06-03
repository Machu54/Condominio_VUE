<template>

  <!-- NAVBAR -->

  <Navbar />

  <!-- PAGE -->

  <div class="page-container">

    <!-- CHAT CONTAINER -->

    <div class="chat-container">

      <!-- HEADER -->

      <header class="chat-header">

        <div class="header-left">

          <div class="avatar-icon">
            <i class="ti ti-message"></i>
          </div>

          <div class="header-info">

            <h2 class="header-title">
              Chat General
            </h2>

            <p class="header-status">
              {{ usuario.correo }}
            </p>

          </div>

        </div>

      </header>

      <!-- MENSAJES -->

<section
  class="messages-container"
  ref="messagesContainer"
>
        <div
          v-for="(message, index) in messages"
          :key="index"
          class="message-wrapper"
          :class="{
            sent: message.remitente == usuario.id_persona,
            received: message.remitente != usuario.id_persona
          }"
        >

          <div
            class="message-bubble"
            :class="{
              sent: message.remitente == usuario.id_persona,
              received: message.remitente != usuario.id_persona
            }"
          >

            <p class="message-user">
              {{ message.usuario }}
            </p>

            <p class="message-text">
              {{ message.mensaje }}
            </p>

          </div>

        </div>

      </section>

      <!-- FOOTER -->

      <footer class="chat-footer">

        <input
          v-model="inputMessage"
          type="text"
          placeholder="Escribe un mensaje..."
          class="message-input"
          @keyup.enter="sendMessage"
        />

        <button
          class="send-btn"
          @click="sendMessage"
        >
          <i class="ti ti-send"></i>
        </button>

      </footer>

    </div>

  </div>

</template>

<script setup>

import axios from 'axios'

import { nextTick } from 'vue'

import { ref, onMounted } from 'vue'

import Navbar from '../components/Navbar.vue'

const usuario = JSON.parse(
  localStorage.getItem('usuario')
)

const messages = ref([])

const inputMessage = ref('')

const messagesContainer = ref(null)

/* AUDIO */

const messageAudio = new Audio(
  '/mensaje.mp3'
)

/* =========================================
   CARGAR MENSAJES
========================================= */

const cargarMensajes = async () => {

  try {

    const response = await axios.get(
      'http://127.0.0.1:8000/api/mensajes'
    )

    messages.value = response.data

    scrollToBottom()

  } catch (e) {

    console.log(e)
  }
}

/* =========================================
   ENVIAR MENSAJE
========================================= */

const sendMessage = async () => {

  if (!inputMessage.value.trim()) return

  const nuevoMensaje = {

    remitente: usuario.id_persona,

    usuario: usuario.correo,

    mensaje: inputMessage.value
  }

  try {

    await axios.post(
      'http://127.0.0.1:8000/api/mensaje',
      nuevoMensaje
    )

    inputMessage.value = ''

  } catch (e) {

    console.log(e)
  }
}

/* =========================================
   SCROLL
========================================= */

const scrollToBottom = async () => {

  await nextTick()

  if(messagesContainer.value){

    messagesContainer.value.scrollTop =
    messagesContainer.value.scrollHeight
  }
}

/* =========================================
   WEBSOCKET
========================================= */

onMounted(() => {

  /* CARGAR MENSAJES */

  cargarMensajes()

  /* ESCUCHAR CHAT */

  window.Echo.channel('chat')
  .listen('.Mensaje', (e) => {

    messages.value.push(e.data)

    scrollToBottom()

    /* SONIDO SOLO SI RESPONDE OTRA PERSONA */

    if(
      e.data.remitente != usuario.id_persona
    ){

      messageAudio.currentTime = 0

      messageAudio.play()
    }

  })

})

</script>

<style scoped>

* {
  box-sizing: border-box;
}

/* PAGE */

.page-container{

  width: 100%;

  min-height: calc(100vh - 70px);

  background: #f4f7fb;

  display: flex;

  justify-content: center;

  padding: 30px;
}

/* CHAT */

.chat-container {

  width: 100%;

  max-width: 1100px;

  height: calc(100vh - 130px);

  background: white;

  border-radius: 25px;

  overflow: hidden;

  box-shadow: 0 10px 30px rgba(0,0,0,.05);

  display: flex;
  flex-direction: column;
}

/* HEADER */

.chat-header {

  padding: 20px;

  background: #f7f7f7;

  border-bottom: 1px solid #e5e5e5;
}

.header-left {

  display: flex;
  align-items: center;
  gap: 12px;
}

.avatar-icon {

  width: 45px;
  height: 45px;

  border-radius: 50%;

  background: #98C8E9;

  color: white;

  display: flex;
  align-items: center;
  justify-content: center;

  font-size: 20px;
}

.header-title {

  margin: 0;

  font-size: 18px;

  color: #222;
}

.header-status {

  margin: 0;

  font-size: 13px;

  color: gray;
}

/* MENSAJES */

.messages-container {

  flex: 1;

  overflow-y: auto;

  padding: 20px;

  display: flex;
  flex-direction: column;

  gap: 14px;

  background: #fafafa;
}

.message-wrapper {

  display: flex;
}

.message-wrapper.sent {

  justify-content: flex-end;
}

.message-wrapper.received {

  justify-content: flex-start;
}

.message-bubble {

  max-width: 70%;

  padding: 12px 15px;

  border-radius: 16px;
}

.message-bubble.sent {

  background: #98C8E9;

  color: white;
}

.message-bubble.received {

  background: white;

  border: 1px solid #e5e5e5;
}

.message-user {

  margin: 0 0 6px;

  font-size: 11px;

  font-weight: bold;

  opacity: .7;
}

.message-text {

  margin: 0;

  font-size: 14px;

  line-height: 1.4;
}

/* FOOTER */

.chat-footer {

  display: flex;

  gap: 10px;

  padding: 18px;

  background: #f7f7f7;

  border-top: 1px solid #e5e5e5;
}

.message-input {

  flex: 1;

  border: 1px solid #dcdcdc;

  border-radius: 12px;

  padding: 14px;

  font-size: 14px;
}

.message-input:focus {

  outline: none;

  border-color: #98C8E9;
}

.send-btn {

  width: 50px;
  height: 50px;

  border: none;

  border-radius: 12px;

  background: #98C8E9;

  color: white;

  cursor: pointer;

  font-size: 18px;
}

</style>