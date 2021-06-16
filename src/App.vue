<template>
  <div id="app">
    <router-view />
  </div>
</template>
<script>
  export default {
    name:'App',
    created() {
        if (!this.$vars.token){
          this.$router.push('/login')
        }
    }
  }
</script>
<style lang="less">
*{
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
#app{
  width: 100vw;
  height: 100vh;
}
input{
  padding: 5px 10px;
  border: 1px solid #cccccc;
  background: #ffffff;
  cursor: pointer;
  outline: none;
}

</style>
