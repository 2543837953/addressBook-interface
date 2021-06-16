<template>
  <div class="emp-desc-header">
    <div class="header-title">
        <h2>{{text}}</h2>
    </div>
  </div>
</template>

<script>
export default {
  name: "PublicHeader",
  data(){
    return{
      text:this.val
    }
  },
  props:['val']
}
</script>

<style scoped>
.emp-desc-header {
  width: 100%;
  height: 50px;
  color: #ffffff;
  text-align: center;
  background: #333;
  line-height: 50px;
}
</style>