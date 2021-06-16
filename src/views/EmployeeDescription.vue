<template>
  <div class="emp-desc">
    <public-header :val="text"></public-header>
<!--    <a href="mailto:xxx@admin.com">123</a>-->
    <div class="layout" v-if="description">
      <ul class="desc-list">
        <li class="item">
          <span class="key">姓名: </span>
          <span class="val">{{description.name}}</span>
        </li>
        <li class="item">
          <span class="key">性别: </span>
          <span class="val">{{description.gender}}</span>
        </li>
        <li class="item">
          <span class="key">出生日期: </span>
          <span class="val">{{description.birth_date}}</span>
        </li>
        <li class="item">
          <span class="key">邮箱: </span>
          <span class="val">{{description.email}}</span>
        </li>
        <li class="item">
          <span class="key">电话: </span>
          <span class="val">{{description.mobile}}</span>
        </li>
        <li class="item">
          <span class="key">部门: </span>
          <span class="val">{{description.department}}</span>
        </li>
        <li class="item">
          <span class="key">职称: </span>
          <span class="val">{{description.post_title}}</span>
        </li>
        <li class="item">
          <span class="key">类别: </span>
          <span class="val">{{description.category}}</span>
        </li>
      </ul>
      <div class="btn-group">
        <button class="call" v-if="show_cell">
          <a :href="cellEmp()">呼叫</a>
        </button>
        <button class="send-email" v-if="!show_cell">发送邮箱</button>
        <button class="edit" v-show="showEdit()" @click="empEdit($route.params.id)">编辑</button>
        <button class="del" v-if="show_del" @click="empDel()">删除</button>
        <button class="del" v-if="show_deDel" @click="empDel()">删除</button>
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
  name: "EmployeeDescription",
  components:{
    PublicHeader,
    PublicCover
  },
  data(){
    return{
      text:'详情信息',
      show_del:false,
      show_deDel:false,
      description:null,
      show_cell:false,
      clientWidth: document.body.clientWidth < 768 ? this.show_cell = true : this.show_cell = false,
      msg:{},
    }
  },
  watch:{
    description(){
      this.showEdit();
      if(this.$vars.admin!==0&&this.$vars.id!==this.description.id){
        this.show_del=true;
      }else if (
          this.$vars.deAdmin!==0
          &&
          this.$vars.department===this.description.department
          &&
          this.description.admin!==1
          &&
          this.$vars.id!==this.description.id
      ){
        this.show_deDel=true
      }
    },
    clientWidth(val) {
      if (val < 768) {
        this.show_cell = true;
      } else {
        this.show_cell = false;
      }
    },
  },
  created() {
    // 在DOM渲染数据时，设置下区域高度为浏览器可视区域高度．
    this.clientWidth = document.body.clientWidth;
    // 监听window的resize事件．在浏览器窗口变化时再设置下区域高度．
    const _this = this;
    window.onresize = function temp() {
      _this.clientWidth = document.body.clientWidth;
    };
    let header = {
      'authorization': 'Bearer ' + this.$vars.token
    }
    fetch(this.$vars.url + 'employees/list/' +this.$route.params.id,
        {method: 'get', headers: header})
        .then(res => {
          if (res.status === 200) {
            res.json().then(data => {
              this.description = data.data;
            })
          }
        })
  },
  methods:{
    empEdit(id){
      this.$router.push({name:'EmpEdit',params:{'id':id}})
    },
    showEdit(){
      if (this.$vars.admin===1){
        return  true;
      }else if (this.$vars.deAdmin===1&&this.$vars.department===this.description.department&& this.description.admin!==1){
        return  true;
      }else if (this.description.id===this.$vars.id){
        return  true;
      }
      return false;
    },
    cellEmp(){
      if (this.description){
        return 'tel:'+this.description.mobile;
        // return 'tel:17787449707'
      }
    },
    empDel(){
      let header = {
        'authorization': 'Bearer ' + this.$vars.token
      }
      fetch(this.$vars.url + 'employees/del/' +this.$vars.id+'/'+this.description.id,
          {method: 'get', headers: header})
          .then(res => {
            if (res.status === 200) {
              this.msg={
                'state':true,
                'text':'删除成功',
                'router':'EmployeeList'
              }
              bus.$emit('data',this.msg);
            }
          })
    }
}
}
</script>
<style scoped>
.emp-desc {
  width: 100%;
  height: 100%;
}
.layout{
  width: 1200px;
  margin: 0 auto;
}
.desc-list{
  list-style: none;
  display: grid;
  grid-template-columns: repeat(3,1fr);
  grid-template-rows: repeat(3,60px);
  align-items: center;
  grid-gap: 50px;
  justify-items: center;
}
.btn-group{
  margin-top: 20px;
  text-align: center;
}
.btn-group button{
  margin: 0 20px;
  padding: 10px 15px;
  border: 1px solid #ccc;
  background: #fff;
   cursor: pointer;
  outline: none;
}
.btn-group button:hover{
  background: #eee;
}
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
}
.cover .msg .text{
color: red;
}
.call a{
  text-decoration: none;
  color: black;
}
@media screen and (max-width: 768px){
  .layout{
    width: 100%;
    padding: 0 15px;
  }
  .desc-list{
    display: grid;
    grid-template-columns: repeat(1,1fr);
    grid-template-rows: repeat(8,30px);
    justify-items: flex-start;
  }
  .btn-group button{
    display: block;
    margin: 20px auto;
    width: 100%;
    cursor: pointer;
  }
}
</style>