<template>
  <div class="container">
    <CustomAlert ref="alert" />

    <div class="half">
      <div class="header">
        <div class="type-name">{{ currentColor.name }}</div>
        <div class="buttons">
          <button @click="copyText(currentColor.hex, 'Hex 复制成功 ' + currentColor.hex)">Hex</button>
          <button @click="copyText(currentColor.RGB, 'RGB 复制成功 ' + currentColor.RGB)">RGB</button>
          <button @click="copyText(currentColor.CMYK, 'CMYK 复制成功 ' + currentColor.CMYK)">CMYK</button>
        </div>
      </div>
      <div class="color-canvas" :style="{ backgroundColor: currentColor.hex }"></div>
    </div>

    <div class="half nav">
      <div class="header">
        <div class="function-buttons">
          <div class="type-name">候选区域</div>
          <button @click="copyText(JSON.stringify(chosenList), '所有候选颜色复制成功')">复制所有</button>
          <button @click="chosenList = []">清空</button>
        </div>
      </div>
      <div class="chosen">
        <div v-for="(item, index) in chosenList" :key="item.pinyin" class="color-select">
          <div
            class="color-item"
            :style="{ backgroundColor: item.hex, height: '100px' }"
            @click="colorClick(item, true)"
          ></div>
          <button class="sub" @click="delColor(index)">-</button>
        </div>
      </div>

      <div class="sub-nav">
        <div v-for="colorPair in colorArray" :key="colorPair[0]" class="type">
          <div class="type-header">
            <div class="type-name">{{ colorPair[0] }}</div>
          </div>
          <div class="type-item">
            <div v-for="item in colorPair[1]" :key="item.name" class="color-select">
              <div
                class="color-item"
                :style="{ borderTop: `10px solid ${item.hex}` }"
                @click="colorClick(item, true)"
              >
                {{ item.name }}
              </div>
              <button class="add" @click="colorClick(item)">+</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, reactive } from 'vue';
import colorJson from '@/assets/color.json';
import CustomAlert from './CustomAlert.vue';

const colorList = Array.isArray(colorJson.colorList) ? colorJson.colorList : [];
const classify = ['红', '绿', '黄', '灰', '紫', '蓝', '棕', '白', '青', '橙', '粉', '褐', '肉色', '驼', '咖啡', '豆沙', '米色'];
const classifyOther = [];

const colorMap = new Map();
colorList.forEach(item => {
  const matchedClass = classify.find(cls => item.name.includes(cls));
  if (matchedClass) {
    const list = colorMap.get(matchedClass) || [];
    colorMap.set(matchedClass, [...list, item]);
  } else {
    classifyOther.push(item);
  }
});

const colorArray = Array.from(colorMap).sort((a, b) => b[1].length - a[1].length);
colorArray.push(['其他', classifyOther]);

const currentColor = reactive({
  CMYK: [78,0,62,0],
  RGB: [93,190,138],
  hex: '#f1c4cd',
  name: '水红',
  pinyin: 'shuihong',
});

const chosenList = ref([]);
const alert = ref(null);

function colorClick(item, chosen = false) {
  Object.assign(currentColor, item);
  if (!chosen && !chosenList.value.some(el => el.name === item.name)) {
    chosenList.value.push(item);
  } else if (chosen) {
    alert.value.show('已添加重复颜色', 'error');
  }
}

function delColor(index) {
  chosenList.value.splice(index, 1);
}

async function copyText(text, successText) {
  try {
    await navigator.clipboard.writeText(text);
    alert.value.show(successText, 'success');
  } catch (err) {
    alert.value.show(`复制失败: ${err}`, 'error');
  }
}
</script>

<style scoped>
@font-face {
  font-family: 'SourceHanSerifCN-Medium';
  src: url('@/assets/fonts/SourceHanSerifCN-Medium.otf');
}

.container {
  display: flex;
  flex-direction: row;
  font-family: 'SourceHanSerifCN-Medium';
  animation: fadein 2s ease;
}

.half {
  flex: 1;
  margin: 10px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  min-height: 95vh;
}

.nav {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
}

.function-buttons {
  display: flex;
  flex-flow: row wrap;
  justify-content: flex-start;
  margin-right: 5px;
  width: fit-content;
}

.color-canvas {
  height: 80vh;
  width: 100%;
  transition: background-color 1s ease;
}

.chosen {
  width: 100%;
  display: flex;
  flex-flow: row wrap;
}

.sub-nav {
  width: 100%;
  min-height: 250px;
  max-height: 80vh;
  overflow-y: auto;
  margin-top: 20px;
  padding-bottom: 200px;
  display: flex;
  flex-flow: row wrap;
}

.sub-nav::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.sub-nav::-webkit-scrollbar-thumb {
  background-color: #475164;
  border-radius: 10px;
}

.sub-nav::-webkit-scrollbar-track {
  background: #ededed;
  border-radius: 10px;
}

.type {
  margin-right: 40px;
  width: fit-content;
  display: flex;
  flex-direction: column;
}

.type-header {
  display: flex;
  flex-flow: row wrap;
}

.header {
  display: flex;
  flex-flow: row wrap;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-bottom: 10px;
}

.type-name {
  font-size: 1.75rem;
  width: fit-content;
  margin-right: 20px;
}

@keyframes fadein {
  0% { opacity: 0; transform: translateY(-10px); }
  100% { opacity: 1; transform: translateY(0); }
}

.type-item {
  display: flex;
  flex-flow: row wrap;
  justify-content: flex-start;
  width: fit-content;
}

.color-item {
  font-size: 1.25rem;
  width: 100px;
  height: 100px;
  margin: 10px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  animation: fadein 1s ease-in-out;
}

.color-select {
  display: flex;
  flex-flow: column wrap;
  align-items: center;
  position: relative;
}

.color-select:hover .add {
  opacity: 1;
}

.sub, .add {
  cursor: pointer;
  margin: 0;
  transition: background-color 0.3s ease, opacity 0.3s ease;
}

.sub:hover, .add:hover {
  background-color: #eee;
  opacity: 1;
}

@media (max-width: 768px) {
  .container {
    flex-direction: column;
  }

  .half {
    width: 100%;
    min-height: auto;
  }

  .nav {
    flex-direction: column;
  }
}
</style>