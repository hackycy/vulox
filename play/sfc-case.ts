export const PLAY_CODE_CASE1 = `
<template>
  <div class="red">{{ msg }}</div>
</template>

<script>
import { defineComponent, ref } from 'vue';

export default defineComponent({
  setup() {
    const msg = ref('Hello XParser!');

    return {
      msg
    };
  }
});
</script>

<style scoped>
.red {
  color: red;
}
</style>
`

// -----------

export const PLAY_CODE_CASE2 = `
<script setup>
import { ref } from 'vue'

const msg = ref('Hello XParser!')
</script>

<template>
  <h1>{{ msg }}</h1>
  <input v-model="msg" />
</template>
`

// -----------

export const PLAY_CODE_CASE3 = `
<script setup lang="ts">
import { ref } from 'vue'
import { type Props } from './foo'

type Message = string | undefined

const msg = ref<Props>('Hello XParser!')
</script>

<template>
  <h1>{{ msg }}</h1>
</template>

<style scoped>
h1 {
  color: green;
}
</style>
`

// -----------

export const PLAY_CODE_CASE4 = `
<script lang="tsx">
import { withModifiers, defineComponent, ref } from 'vue';

export default defineComponent({
  setup() {
    const count = ref(0);

    const inc = () => {
      count.value++;
    };

    return () => (
      <div>
        <span style="margin-right: 10px">{count.value}</span>
        <button onClick={withModifiers(inc, ['self'])}>+</button>
      </div>
    );
  },
});
</script>
`
