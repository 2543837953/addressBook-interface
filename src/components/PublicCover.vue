<template>
  <div class="cover" @click="hideMsg()" v-show="msg">
    <div class="msg">
      <p class="text">{{text}}</p>
    </div>
  </div>
</template>

<script>
import {bus} from "@/bus";

export default {
  name: "PublicCover",
  data() {
    return {
      msg:false,
      text:'',
      name:''
    }
  },
  created() {
      bus.$on('data',e=>{
        this.msg=e.state;
        this.text=e.text;
        this.name=e.router;
      })
  },
  methods:{
    hideMsg(){
      this.msg=false;
      console.log(this.name)
      this.$router.push({name:this.name})
    }
  }
}
</script>

<style scoped>
.cover{
  width: 100%;
  height: 100%;
  position: absolute;
  background: rgba(0,0,0,0.5);
  top: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}
.cover .msg{
  width: 200px;
  height: 150px;
  background: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 15px;
}
.cover .msg .text{
  color: red;
}
.call a{
  text-decoration: none;
  color: black;
}
</style>