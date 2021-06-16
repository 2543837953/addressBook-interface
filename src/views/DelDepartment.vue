<template>
  <div class="del-department">
    <public-header :val="text"></public-header>
    <div class="layout">
      <nav>
        <ul class="list">
          <li class="item" v-for="d in deAll" :key="d.id" >
            <span class="de-name">{{d.name}}</span>
            <button @click="delDe($event,d.id)">删除</button>
          </li>
        </ul>
      </nav>
    </div>
    <public-cover></public-cover>
  </div>
</template>

<script>
import PublicHeader from "@/components/PublicHeader";
import PublicCover from "@/components/PublicCover";
import {bus} from "@/bus";
export default {
  name: "DelDepartment",
  data() {
    return {
      text:'删除部列表',
      deAll:[],
      msg:{}
    }
  },
  methods:{
    delDe(el,id){
      let header = {
        'authorization': 'Bearer ' + this.$vars.token
      }
      fetch(this.$vars.url + 'department/del/'+id, {method: 'get', headers: header})
          .then(res => {
            if (res.status === 200) {
                this.msg={
                 'state':true,
                 'text':'删除成功',
                 'router':'EmployeeList'
                }
                bus.$emit('data',this.msg)
            }else if (res.status===406){
              res.json().then(data=>{
                this.msg={
                  'state':true,
                  'text':data.msg,
                  'router':''
                }
                bus.$emit('data',this.msg);
              })
            }
          })
    }
  },
  mounted() {
    let header = {
      'authorization': 'Bearer ' + this.$vars.token
    }
    fetch(this.$vars.url + 'department/list', {method: 'get', headers: header})
        .then(res => {
          if (res.status === 200) {
            res.json()
                .then(data => {
                  this.deAll = data.data;
                })
          }
        })
  },
  components: {
    PublicHeader,
    PublicCover
  }
}
</script>

<style scoped>
.del-department {
  width: 100%;
  height: 100%;
}
.layout{
  width: 1200px;
  margin: 10px auto;
}
.list{
  list-style: none;
}
.list .item{
  height: 50px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 10px;
}
.list .item button{
  padding: 5px 10px;
  background: #fff;
  border: 1px solid #cccccc;
  cursor: pointer;
  outline: none;
}
.list .item:nth-child(odd){
  background: #eee;
  border-top: 1px solid #ccc;
  border-bottom: 1px solid #ccc;
}
@media screen and (max-width: 768px){
  .layout{
    width: 100%;
    margin: 0 auto;
  }
}
</style>