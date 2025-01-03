<template>
    <div v-if="open" class="custom-alert" :class="type" :style="{ animationDuration: `${duration}ms` }">
      {{ message }}
      <button @click="close">关闭</button>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  
  const open = ref(false);
  const message = ref('');
  const type = ref('success');
  const duration = ref(2000); // 默认 2 秒
  
  function show(msg, alertType = 'success', time = 2000) {
    message.value = msg;
    type.value = alertType;
    duration.value = time;
    open.value = true;
    setTimeout(() => {
      open.value = false;
    }, duration.value);
  }
  
  function close() {
    open.value = false;
  }
  
  defineExpose({ show });
  </script>
  
  <style scoped>
  .custom-alert {
  position: fixed; /* 固定在视口中 */
  top: 20px; /* 距离顶部 20px */
  left: 50%; /* 水平居中 */
  transform: translateX(-50%); /* 水平居中 */
  padding: 10px;
  margin: 10px;
  border-radius: 4px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  animation: fadeInOut ease-in-out;
  z-index: 1000; /* 确保弹窗在最上层 */
  min-width: 300px; /* 设置最小宽度 */
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); /* 添加阴影效果 */
}

.success {
  background-color: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.error {
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

button {
  background: none;
  border: none;
  cursor: pointer;
  color: inherit;
}

@keyframes fadeInOut {
  0% { opacity: 0; transform: translate(-50%, -20px); } /* 从顶部滑入 */
  10% { opacity: 1; transform: translate(-50%, 0); }
  90% { opacity: 1; transform: translate(-50%, 0); }
  100% { opacity: 0; transform: translate(-50%, -20px); } /* 滑出 */
}
  </style>