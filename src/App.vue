<template>
  <div>
    <h1>
      Easiest app to apply<br>
      <i class="highlight">color pop</i> to your photos
    </h1>
    
    <button>
      Color Pop!
    </button>
  </div>
</template>

<script lang="ts">
import { Vue } from 'vue-property-decorator';

export default class App extends Vue {
}
</script>

<style>
  * {
    box-sizing: border-box;
  }

  body {
    margin: 0;
    font-family: 'Noto Sans HK', sans-serif;
    background-color: #F1F3F5;
    color: #0A2641;
  }

  i.highlight {
    color: #EB1F81;
    font-style: normal;
  }

  h1 {
    text-align: center;
    font-weight: 900;
    line-height: 2.5rem;
  }

  button {
    font-family: 'Noto Sans HK', sans-serif;
    font-weight: 600;
    height: 52px;
    min-width: 150px;
    font-size: 1.2rem;
    color: #ffffff;
    border: none;
    background-image: linear-gradient(180deg, #EB1F81 0%, #CB0765 100%);
    border-radius: 10px;
    cursor: pointer;
    user-select: none;
  }
</style>
