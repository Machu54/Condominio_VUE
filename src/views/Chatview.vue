<template>

  <!-- NAVBAR -->

  <Navbar />

  <!-- CHAT -->

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

    <section class="messages-container">

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

</template>

<script setup>

import axios from 'axios'
import { ref, onMounted } from 'vue'

import Navbar from '../components/Navbar.vue'

const usuario = JSON.parse(
  localStorage.getItem('usuario')
)

const messages = ref([])

const inputMessage = ref('')

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

onMounted(() => {

  window.Echo.channel('chat')
  .listen('.Mensaje', (e) => {

      console.log(e)

      messages.value.push(e.data)
  })

})

</script>

<style scoped>

* {
  box-sizing: border-box;
}

.chat-container {

  display: flex;
  flex-direction: column;

  height: calc(100vh - 70px);

  background: #ffffff;
}

/* HEADER */

.chat-header {

  padding: 1rem;

  background: #f7f7f7;

  border-bottom: 1px solid #e5e5e5;
}

.header-left {

  display: flex;
  align-items: center;
  gap: 12px;
}

.avatar-icon {

  width: 42px;
  height: 42px;

  border-radius: 50%;

  background: #378add;

  color: white;

  display: flex;
  align-items: center;
  justify-content: center;
}

.header-title {

  margin: 0;

  font-size: 16px;
}

.header-status {

  margin: 0;

  font-size: 12px;

  color: gray;
}

/* MENSAJES */

.messages-container {

  flex: 1;

  overflow-y: auto;

  padding: 1rem;

  display: flex;
  flex-direction: column;

  gap: 12px;

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

  padding: 12px 14px;

  border-radius: 14px;
}

.message-bubble.sent {

  background: #378add;

  color: white;
}

.message-bubble.received {

  background: white;

  border: 1px solid #e5e5e5;
}

.message-user {

  margin: 0 0 5px;

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

  padding: 1rem;

  background: #f7f7f7;

  border-top: 1px solid #e5e5e5;
}

.message-input {

  flex: 1;

  border: 1px solid #dcdcdc;

  border-radius: 10px;

  padding: 12px;

  font-size: 14px;
}

.message-input:focus {

  outline: none;

  border-color: #378add;
}

.send-btn {

  width: 45px;
  height: 45px;

  border: none;

  border-radius: 10px;

  background: #378add;

  color: white;

  cursor: pointer;

  font-size: 18px;
}

</style>