export default {
     url:'http://127.0.0.1:8000/api/',
     headers:{
        'Accept':'application/json',
        'Content-Type':'application/json',
    },
    name:localStorage.getItem('login_state')?JSON.parse(localStorage.getItem('login_state')).name:null,
    setName(name){
         this.name=name;
    },
    token:localStorage.getItem('login_state')?JSON.parse(localStorage.getItem('login_state')).token:null,
    setToken(token){
         this.token=token;
    },
    admin:localStorage.getItem('login_state')?JSON.parse(localStorage.getItem('login_state')).admin:null,
    setAdmin(admin){
        this.admin=admin;
    },
    deAdmin:localStorage.getItem('login_state')?JSON.parse(localStorage.getItem('login_state')).department_admin:null,
    setDeAdmin(deAdmin){
        this.deAdmin=deAdmin;
    },
    department:localStorage.getItem('login_state')?JSON.parse(localStorage.getItem('login_state')).department:null,
    setDepartment(department){
        this.department=department;
    },
    id:localStorage.getItem('login_state')?JSON.parse(localStorage.getItem('login_state')).id:null,
    setId(id){
        this.id=id;
    },
}
