<template>
  <div class="add-department">
    <public-header :val="text"></public-header>
    <div class="layout">
      <div class="input-add">
        <label for="department">部门: </label>
        <input type="text" id="department" v-model="department">
      </div>
      <div class="input-add">
        <label for="telephone">电话: </label>
        <input type="text" id="telephone" v-model="telephone">
      </div>
      <div class="input-add">
        <label for="address">地址: </label>
        <input type="text" id="address" v-model="location">
      </div>
      <div class="add-btn">
        <input type="submit" class="de-btn" value="新增部门" @click="addDe()">
      </div>
    </div>
    <public-cover></public-cover>
  </div>
</template>

<script>
import PublicHeader from "@/components/PublicHeader";
import PublicCover from "@/components/PublicCover";
import {bus} from "@/bus";
export default {
  name: "AddDepartment",
  data() {
    return {
      text: "添加部门",
      department:'社会与服务系',
      telephone:'17787449707',
      location:''
    }
  },
  methods:{
    addDe(){
      let header = {
        'authorization': 'Bearer ' + this.$vars.token,
        'Accept':'application/json',
        'Content-Type':'application/json'
      }
      let data={
        department:this.department,
        telephone:this.telephone,
        location:this.location
      }
      fetch(this.$vars.url + 'department/new', {method: 'post', headers: header,body:JSON.stringify(data)})
          .then(res => {
            if (res.status === 200) {
              this.msg={
                'state':true,
                'text':'添加部门成功',
                'router':'EmployeeList'
              }
              bus.$emit('data',this.msg)
            }else if (res.status===422){
              res.json().then(d=>{
                this.msg={
                  'state':true,
                  'text':d.msg,
                  'router':''
                }
                bus.$emit('data',this.msg);
              })
            }
          })
    }
  },
  components: {
    PublicHeader,
    PublicCover
  }
}
</script>

<style scoped>
.add-department {
  width: 100%;
  height: 100%;
}
.layout {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.input-add input{
  width: 150px;
  height: 25px;
}
.layout div{
  margin: 20px 0;
}
</style>