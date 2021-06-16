<template>
  <div class="container">
    <div class="emp">
      <div id="emp__header">
        <div class="emp__header">
          <div :class="{active:moreBtn,item:true,emp__header__department:true}">
            <select class="emp--select" v-model="selectId">
              <option value="">----- 部门筛选 -----</option>
              <option v-for="d in department" :key="d.id" :value="d.id">{{ d.name }}</option>
            </select>
          </div>
          <div :class="{active:moreBtn,item:true,emp__header__search:true}">
            <input type="search" class="emp--search" v-model="keyVal" placeholder="搜索姓名或者电话号码">
            <input type="submit" class="emp--btn" value="搜索" @click="getSearch()">
          </div>
          <div class="item emp__header__loginOrLogout">
            <p class="onLogin" v-if="show"><span class="emp--login">登录</span>/<span class="emp--logout">退出</span></p>
            <p class="successLogin" v-else>
              <span class="user">用户名: </span>
              <span class="name">{{ this.$vars.name }}</span>
            </p>
            <p class="more" v-if="dom" @click="setMore()"></p>
          </div>
          <div :class="{active:moreBtn,item:true,emp__header__logout:true}">
            <div class="emp-logout" @click="logout()">退出</div>
          </div>
          <div :class="{active:moreBtn,module:true}"></div>
        </div>
      </div>
      <div :class="{active:moreBtn,emp__empList:true}">
        <div class="top-title">
          <h2 style="text-align: center;margin:20px 0">信息列表</h2>
          <button class="newEmp" v-if="showBtn" @click="$router.push({name:'AddEmp'})">添加人员</button>
          <button class="newDe" v-if="showBtnDe" @click="$router.push({name:'AddDepartment'})">添加部门</button>
          <button class="deleteDe" v-if="showBtnDe" @click="$router.push({name:'DelDepartment'})">删除部门</button>
        </div>
        <table>
          <thead>
          <tr class="title">
            <th>姓名</th>
            <th>性别</th>
            <th>部门</th>
            <th>电话</th>
            <th>邮箱</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="item in list" :key="item.id" class="tbody" @click="empDesc(item.id)">
            <td data-title="姓名: ">{{ item.name }}</td>
            <td data-title="性别: ">{{ item.gender }}</td>
            <td data-title="部门: ">{{ item.department }}</td>
            <td data-title="电话: ">{{ item.mobile }}</td>
            <td data-title="邮箱: ">{{ item.email }}</td>
          </tr>
          </tbody>
        </table>
        <ul class="paging">
          <li class="item" @click="prePage()" v-show="current>1">&lt;</li>
          <li :class="{item:true,active:num===current}" v-for="num in pageArr" :key="num" @click="paging(num)">
            {{ num }}
          </li>
          <li class="item" @click="nextPage()" v-show="current<pagCount">&gt;</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "EmployeeList.vue",
  data() {
    return {
      showBtnDe:false,
      showBtn:false,
      selectId: '',
      keyVal: '',
      current: 1,
      pagCount: 1,
      list: [],
      start: 1,
      end: 10,
      department: [],
      show: true,
      clientWidth: document.body.clientWidth < 768 ? this.dom = true : this.dom = false,
      dom: false,
      moreBtn: false
    }
  },
  mounted() {
    // 在DOM渲染数据时，设置下区域高度为浏览器可视区域高度．
    this.clientWidth = document.body.clientWidth;
    // 监听window的resize事件．在浏览器窗口变化时再设置下区域高度．
    const _this = this;
    window.onresize = function temp() {
      _this.clientWidth = document.body.clientWidth;
    };
    if (this.$vars.admin!==0||this.$vars.deAdmin!==0){
      this.showBtn=true;
    }
    if (this.$vars.admin!==0&&this.$vars.deAdmin===0){
      this.showBtnDe=true;
    }
  },
  computed: {
    pageArr() {
      let arr = []
      for (let i = this.start; i <= this.end; i++) {
        arr.push(i);
      }
      return arr;
    }
  },
  watch: {
    clientWidth(val) {
      if (val < 768) {
        this.dom = true;
      } else {
        this.dom = false;
      }
    },
    keyVal(val) {
      if (val === '') {
        this.current = 1;
        this.start = 1;
        this.end = 10;
        this.fetchRequest();
      }
    },
    selectId(val) {
      if (val !== '') {
        this.current = 1;
        this.start = 1;
        this.fetchRequest();
      } else {
        this.current = 1;
        this.start = 1;
        this.end = 10;
        this.fetchRequest();
      }
    },
  },
  created() {
    if (this.$vars.name) {
      this.show = false;
    }
    this.fetchRequest();
    let header = {
      'authorization': 'Bearer ' + this.$vars.token
    }
    fetch(this.$vars.url + 'department/list', {method: 'get', headers: header})
        .then(res => {
          if (res.status === 200) {
            res.json()
                .then(data => {
                  this.department = data.data;
                })
          }
        })
  },
  methods: {
    empDesc(id){
      this.$router.push({name:'EmployeeDescription',params:{id:id}})
    },
    setMore() {
      this.moreBtn = !this.moreBtn;
    },
    logout() {
      let header = {
        'authorization': 'Bearer ' + this.$vars.token
      }
      fetch(this.$vars.url + 'logout', {method: 'post', headers: header})
          .then(res => {
            if (res.status === 200) {
              localStorage.removeItem('login_state');
              this.$router.push({'name': 'HomeLogin'});
            }
          })
    },
    getSearch() {
      this.selectId = '';
      if (this.keyVal !== '') {
        this.current = 1;
        this.start = 1;
        this.end = 10;
        let header = {
          'authorization': 'Bearer ' + this.$vars.token
        }
        fetch(this.$vars.url + 'employees/search/' + this.keyVal + '?page=' + this.current,
            {method: 'get', headers: header})
            .then(res => {
              if (res.status === 200) {
                res.json().then(data => {
                  this.pagCount = data.pageCount;
                  if (this.pagCount < 10) {
                    this.end = this.pagCount;
                  }
                  this.list = data.data;
                })
              }
            })
      }
    },
    fetchRequest() {
      let header = {
        'authorization': 'Bearer ' + this.$vars.token
      }
      let str = '';
      if (this.selectId !== '') {
        str = 'department/' + this.selectId + '/' + this.current
      }
      if (this.keyVal !== '') {
        str = 'employees/search/' + this.keyVal + '?page=' + this.current
      }
      if (this.selectId === '' && this.keyVal === '') {
        str = 'employees/list?page=' + this.current
      }
      fetch(this.$vars.url + str,
          {method: 'get', headers: header})
          .then(res => {
            if (res.status === 200) {
              res.json().then(data => {
                if (this.selectId === '') {
                  this.pagCount = data.pageCount;
                  this.list = data.data;
                }
                if (this.selectId !== '' && this.keyVal === '') {
                  this.pagCount = data.data.pageCount;
                  this.list = data.data.employees;
                } else {
                  this.pagCount = data.pageCount;
                  this.list = data.data;
                }
                if (this.pagCount < 10) {
                  this.end = this.pagCount;
                }
              })
            }
          })
    },
    pageSet() {
      this.start = this.current - 5;
      this.end = this.current + 4;
      if (this.start <= 0) {
        this.start = 1;
        if (this.pagCount < 10) {
          this.end = this.pagCount;
        } else {
          this.end = 10;
        }
      }
      if (this.end > this.pagCount) {
        if (this.pagCount < 10) {
          this.start = 1;
        } else {
          this.start = this.pagCount - 9;
        }
        this.end = this.pagCount
      }
    },
    paging(n) {
      this.current = n;
      this.pageSet();
      this.fetchRequest();
    },
    prePage() {
      this.pageSet();
      if (this.current > 1) {
        this.current--
        this.fetchRequest();
      }
    },
    nextPage() {
      this.pageSet();
      if (this.current < this.pagCount) {
        this.current++
        this.fetchRequest();
      }
    }
  },
}
</script>

<style scoped lang="less">
.top-title{
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  .newEmp{
    position: absolute;
    right: 0;
    border: 1px solid #ccc;
    background: #fff;
    padding: 5px 10px;
    cursor: pointer;
    outline: none;
  }
  .newDe{
      position: absolute;
      left: 0;
      border: 1px solid #ccc;
      background: #fff;
      padding: 5px 10px;
      cursor: pointer;
      outline: none;
  }
  .deleteDe{
    position: absolute;
    left: 90px;
    border: 1px solid #ccc;
    background: #fff;
    padding: 5px 10px;
    cursor: pointer;
    outline: none;
  }
}
.emp {
  width: 100%;
  user-select: none;
  #emp__header {
    width: 100%;
    background: #333333;
  .emp__header {
    width: 1200px;
    margin: 0 auto;
    background: #333;
    height: 70px;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .module {
      display: none;
    }

    &__logout {
      color: white;
      cursor: pointer;

      .emp-logout:hover {
        color: #6ebefc;
      }
    }

    &__loginOrLogout {
      color: #ffffff;

      .more {
        width: 30px;
        height: 30px;
        background: url(../assets/bars.png);
        background-size: cover;
        cursor: pointer;
      }

      .emp--login, .emp--logout {
        cursor: pointer;
      }

      .emp--login:hover, .emp--logout:hover {
        color: #6ebefc;
      }
    }

    &__department {
      color: #fff;

      .emp--select {
        width: 250px;
        height: 30px;
        outline: none;
        border: 1px solid #ccc;
        text-align-last: center;
      }
    }

    &__search {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 250px;

      .emp--search {
        width: 80%;
        height: 30px;
        padding-left: 10px;
        border: 1px solid #ccc;
        outline: none;
      }

      .emp--btn {
        width: 20%;
        height: 30px;
        padding: 0 10px;
        cursor: pointer;
        background: #fff;
        border: 1px solid #ccc;
        border-left: none;
        outline: none;
      }

    }
  }
  }
  .emp__empList.active {
    margin-top: 200px;
  }

  .emp__empList {
    width: 1200px;
    margin: 0 auto;
    table {
      width: 100%;
      border-collapse: collapse;
    }
    tr {
      height: 50px;
      padding: 10px 15px;
      text-align: center;
    }
    tr:nth-child(odd) {
      background: #eee;
      border-top: 1px solid #ccc;
      border-bottom: 1px solid #ccc;
    }
    tr.title{
      background: #fff;
    }
    tr.tbody:hover {
      cursor: pointer;
    }
    tr:last-child{
      border-bottom: 1px solid #ccc;
    }
    .paging {
      list-style: none;
      display: flex;
      justify-content: center;
      margin-top: 20px;
      .active {
        background: #ccc;
      }
      li {
        width: 20px;
        height: 20px;
        text-align: center;
        border: 1px solid #cccccc;
        margin-top: 10px;
        margin-right: 10px;
        cursor: pointer;
      }
    }
  }
}

@media screen and(max-width: 768px) {
  .top-title{
    font-size: 15px;
    .newEmp{
      right: 10px;
      font-size: 12px;
      padding: 3px 5px;
    }
    .newDe{
      left: 10px;
      font-size: 12px;
      padding: 3px 5px;
    }
    .deleteDe{
      left: 75px;
      font-size: 12px;
      padding: 3px 5px;
    }
  }
  .emp {
    width: 100%;
    #emp__header{
      width: 100%;
    .emp__header {
      height: 50px;
      display: flex;
      flex-direction: column;
      padding: 0 15px;
      width: 100%;
      .module {
        height: 200px;
        background: #ddd;
        width: 100%;
        position: absolute;
        top: 50px;
        z-index: -1;
        display: none;
      }

      .module.active {
        display: block;
      }

      .item:nth-child(1).active,
      .item:nth-child(2).active,
      .item:nth-child(4).active {
        display: flex;
      }

      .item:nth-child(1) {
        display: none;
        margin-top: 90px;
        margin-bottom: 40px;
      }

      .item:nth-child(2) {
        display: none;
        margin-bottom: 30px;
      }

      .item:nth-child(3) {
        position: absolute;
        top: 12px;
        left: 0;
        padding: 0 15px;
        width: 100%;
        display: flex;
        justify-content: space-between;
      }

      .item:nth-child(4) {
        display: none;
        color: #000;
      }

      &__department {

        width: 100%;

        .emp--select {
          width: 100%;
        }
      }

      &__search {
        width: 100%;
      }
    }
    }
    .emp__empList {
      width: 100%;
      thead {
        display: none;
      }

      .paging {
        padding-left: 10px;
      }
        tr {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          height: 150px;
          padding: 5px 15px;
          td:before{
            content: attr(data-title);
            position: absolute;
            left: 15px;
          }
          td {
            margin: 4px 0;
          }
      }
    }
  }
}
</style>