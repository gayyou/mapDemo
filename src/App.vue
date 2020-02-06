<template>
  <div id="app">
    <!-- <router-view/> -->
    <index></index>
  </div>
</template>

<script>
import index from './views/index.vue';

export default {
  components: {
    index
  },
  mounted() {

  }
}
</script>


<style>
/*
初始化css
*/
body,ol,ul,h1,h2,h3,h4,h5,h6,p,th,td,dl,dd,form,fieldset,legend,textarea,select,button{margin:0; padding:0;} 
body {
    font-size: 15px;
    font-family: 'Microsoft YaHei';   
    font-weight: 500;
    color: #000000;
}
a {
    text-decoration:none;
    resize: none;
    outline: none;
} 
em {
    font-style:normal;
} 
li{
    list-style:none;
} 
img{
    border:0; vertical-align:middle;
} 
table{
    border-collapse:collapse;
    border-spacing:0;
} 
p {
    word-wrap:break-word;
}
input {
    outline: none;
    resize: none;
    border: none 0;
}
button {
    border: none;
    outline: none;
    cursor:pointer;             
}

#app {
  font-family: 'SourceHanSansCN-Regular', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
