<template>
  <div class="loginPage">
    <div class="loginForm">
      <h1>登录</h1>
      <input type="text" placeholder="电话号码" id="mobile" v-model="mobile">
      <input type="password" placeholder="密码" id="pwd" v-model="pwd">
      <input type="submit" value="登录" id="btn" @click="getLogin()">
    </div>
  </div>
</template>

<script>
export default {
  name: "HomeLogin.vue",
  data() {
    return {
      mobile:"17787449705",
      pwd: "123456"
    }
  },
  methods: {
    getLogin() {
      let data = {
        mobile: this.mobile,
        password: this.pwd
      }
      fetch(this.$vars.url + 'login', {
        method: 'post',
        headers: this.$vars.headers,
        body: JSON.stringify(data)
      }).then(res => {
        if (res.status === 200) {
          res.json().then(data => {
            this.$vars.setName(data.user.name)
            this.$vars.setToken(data.token);
            this.$vars.setAdmin(data.user.admin)
            this.$vars.setDeAdmin(data.user.department_admin);
            this.$vars.setDepartment(data.user.department);
            this.$vars.setId(data.user.id);
            let dataUser={
              'id':data.user.id,
              'name':data.user.name,
              'token':data.token,
              'department':data.user.department,
              'admin':data.user.admin,
              'department_admin':data.user.department_admin,
            }
            localStorage.setItem('login_state',JSON.stringify(dataUser));
            this.$router.push({name: "EmployeeList"});
          })
        }
      })
    }
  }
}
</script>

<style scoped lang="less">
.loginPage {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  .loginForm {
    width: 350px;
    height: 250px;
    background: #eee;
    display: flex;
    justify-content: space-around;
    flex-direction: column;
    align-items: center;

    input:not(#btn) {
      display: block;
      width: 200px;
      height: 30px;
      padding-left: 5px;
      border: 1px solid #ccc;
      outline: none;
    }

    #btn {
      width: 60px;
      height: 30px;
      cursor: pointer;
    }
  }
}

@media screen and(max-width: 768px) {
  .loginPage {
    .loginForm {
      border: none;
      background: #fff;
    }
  }
}
</style>