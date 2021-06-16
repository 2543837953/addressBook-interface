<template>
  <div class="emp-edit">
    <public-header :val="text"></public-header>
    <div class="layout">
      <div class="input-info">
        <div class="item">
          <label for="name">姓名: </label>
          <input type="text" id="name" v-model="name">
        </div>
        <div class="item">
          <label for="gender">性别: </label>
          <input type="text" id="gender" placeholder="填男或者女" v-model="gender">
        </div>
        <div class="item">
          <label for="date">出身日期: </label>
          <input type="text" id="date" placeholder="yyyy-mm-dd" v-model="birth_date">
        </div>
        <div class="item">
          <label for="cellPhone">电话: </label>
          <input type="text" id="cellPhone" v-model="mobile">
        </div>
        <div class="item">
          <label for="post-title">职称: </label>
          <input type="text" id="post-title" v-model="post_title">
        </div>
        <div class="item" v-if="show">
          <label for="department">部门: </label>
          <select id="department" v-model="department_id">
            <option value="0">----- 选择部门 -----</option>
            <option v-for="d in deAll" :value="d.id" :key="d.id">{{ d.name }}</option>
          </select>
        </div>
        <div class="item"  v-if="show">
          <label for="category">类别: </label>
          <select id="category" v-model="category_id">
            <option value="0">----- 选择类别 -----</option>
            <option v-for="c in categoryAll" :key="c.id" :value="c.id">{{ c.name }}</option>
          </select>
        </div>
        <div class="item">
          <label for="user">用户名: </label>
          <input type="text" id="user" v-model="username">
        </div>
        <div class="item">
          <label for="email">邮箱: </label>
          <input type="email" id="email" v-model="email">
        </div>
        <div class="item" v-if="show">
          <label for="competence">权限: </label>
          <select id="competence" v-model="competence">
            <option value="0">--- 选择权限级别 ---</option>
            <option value="root" v-if="showRoot">管理员</option>
            <option value="admin">部门管理员</option>
            <option value="user">人员</option>
          </select>
        </div>
      </div>
      <div class="submit-btn">
        <input type="submit" id="submit" value="提交" @click="editEmp()">
      </div>
    </div>
    <public-cover></public-cover>
  </div>
</template>

<script>
import PublicHeader from "@/components/PublicHeader";
import {bus} from "@/bus";
import PublicCover from "@/components/PublicCover";
export default {
  name: "EmpEdit",
  data() {
    return {
      text: '编辑信息',
      deAll: [],
      categoryAll: [],
      name: '',
      gender: '',
      email: '',
      competence: 0,
      post_title: '',
      department_id: 0,
      username: '',
      mobile: '',
      birth_date: '',
      category_id: 0,
      showRoot: true,
      description: [],
      show:true
    }
  },
  created() {
    if (this.$vars.deAdmin === 1) {
      this.showRoot = false
    }
    if (this.$vars.admin!==1&&this.$vars.deAdmin!==1){
      this.show = false
    }
    let header = {
      'authorization': 'Bearer ' + this.$vars.token
    }
    fetch(this.$vars.url + 'employees/list/edit/' + this.$route.params.id,
        {method: 'get', headers: header})
        .then(res => {
          if (res.status === 200) {
            res.json().then(data => {
              this.description = data.data;
              this.setVal(this.description);
            })
          }
        })
    fetch(this.$vars.url + 'department/list', {method: 'get', headers: header})
        .then(res => {
          if (res.status === 200) {
            res.json()
                .then(data => {
                  if (this.$vars.deAdmin === 1) {
                    this.deAll = data.data.filter(e => e.name === this.$vars.department);
                  } else {
                    this.deAll = data.data;
                  }
                })
          }
        })
    fetch(this.$vars.url + 'category', {method: 'get', headers: header})
        .then(res => {
          if (res.status === 200) {
            res.json()
                .then(data => {
                  this.categoryAll = data.data;
                })
          }
        })
  },
  methods: {
    setVal(val) {
      this.name = val.name
      this.gender = val.gender
      this.birth_date = val.birth_date
      this.email = val.email
      this.mobile = val.mobile
      this.post_title = val.post_title
      this.category_id = val.category_id
      this.department_id = val.department_id
      this.competence = val.competence
      this.username = val.username
    },
    stateCode(state,text,router){
      this.msg={
        'state':state,
        'text':text,
        'router':router
      }
      bus.$emit('data',this.msg)
    },
    editEmp() {
      let header={
        'authorization': 'Bearer ' + this.$vars.token,
        'Accept':'application/json',
        'Content-Type':'application/json'
      }
      let data={
        'name':this.name,
        'gender':this.gender,
        'email':this.email,
        'competence':this.competence,
        'post_title':this.post_title,
        'department_id':this.department_id,
        'username':this.username,
        'mobile':this.mobile,
        'birth_date':this.birth_date,
        'category_id':this.category_id
      }
      fetch(this.$vars.url + 'employees/list/edit/'+this.$route.params.id, {method: 'put', headers: header,body:JSON.stringify(data)})
          .then(res => {
            switch (res.status){
              case 200:
                this.stateCode(true,"编辑人员成功","EmployeeList")
                break;
              case 422:
                res.json().then(d=>{
                  this.stateCode(true,d.msg,"")
                })
                break;
              case 402:
                res.json().then(d=>{
                  this.stateCode(true,d.msg,"")
                })
                break;
              case 423:
                res.json().then(d=>{
                  this.stateCode(true,d.msg,"")
                })
                break;
            }
          })
    }
  },
  components: {
    PublicCover,
    PublicHeader
  }
}
</script>

<style scoped>
.emp-edit {
  width: 100%;
  height: 100%;
}

.layout {
  width: 1200px;
  margin: 10px auto;
}

.input-info {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows:repeat(4, 80px);
  justify-items: center;
  align-items: center;
}

.input-info input, .input-info select {
  height: 25px;
  border: 1px solid #ccc;
  width: 150px;
  outline: none;
  padding-left: 5px;
}

.submit-btn {
  margin-top: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.submit-btn input {
  padding: 5px 10px;
  border: 1px solid #cccccc;
  background: #ffffff;
  cursor: pointer;
}

@media screen and (max-width: 768px) {
  .layout {
    width: 100%;
  }

  .input-info {
    display: grid;
    grid-template-columns: repeat(1, 1fr);
    grid-template-rows:repeat(10, 60px);
    justify-items: center;
    align-items: center;
  }

  .submit-btn {
    margin-top: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>