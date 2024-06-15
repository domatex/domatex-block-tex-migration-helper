<script setup lang="ts">
const tex = ref('');
const message = ref<null | { content: string, type: 'success' | 'error' }>(null);

function migrate() {
  // 1. Migrate the TeX
  try {
    const migrated = safeMigrateTex(tex.value);
    if (migrated === tex.value) {
      message.value = { content: 'No need to migrate', type: 'success' };
      return;
    }
    tex.value = migrated;
    message.value = { content: 'Migrated successfully', type: 'success' };
  } catch (error: any) {
    message.value = { content: error?.message ?? 'Unknown error', type: 'error' };
    return;
  }

  // 2. Copy the migrated TeX to the clipboard
  try {
    navigator.clipboard.writeText(tex.value);
  } catch (error: any) {
    message.value = { content: error?.message ?? 'Unknown error when copying to clipboard', type: 'error' };
    return;
  }

  // 3. Notify the parent window
  if (window.parent !== window) {
    window.parent.postMessage({ type: 'migrated', tex: tex.value }, '*');
  }
}

// On mount, get the hash from the URL and set it to the textarea
onMounted(() => {
  const hash = window.location.hash.slice(1);
  if (hash) {
    tex.value = decodeURIComponent(hash);
    migrate();
  }
});

</script>

<template>
  <div class="container">
    <textarea v-model="tex"></textarea>
    <p v-if="message" :class="'message message-' + message.type">{{ message.content }}</p>
    <div class="actions">
      <button @click="migrate">Migrate TeX</button>
    </div>
  </div>
</template>

<style>
body {
  padding: 0;
  margin: 0;
  width: 100vw;
  height: 100vh;
}
body > div {
  width: 100%;
  height: 100%;
}
</style>

<style scoped>
.container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

textarea {
  flex-grow: 1;
  font-size: 20px;
  padding: 20px;
  font-family: 'Monospace', monospace;
  box-sizing: border-box;
  border: none;
  outline: none;
  resize: none;
  background-color: #f5f5f5;
}

.message {
  text-align: center;
  font-family: 'Monospace', monospace;
}

.message .message-success {
  color: #4caf50;
}

.message .message-error {
  color: #f44336;
}

.actions {
  display: flex;
  justify-content: center;
}

button {
  margin: 10px;
  padding: 10px;
  font-size: 20px;
  font-family: 'Noto Sans JP', sans-serif;
  border: none;
  outline: none;
  border-radius: 5px;
  background-color: #f5f5f5;
  cursor: pointer;
}
</style>
