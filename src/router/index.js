import Vue from "vue";
import VueRouter from "vue-router";
import HomeLogin from "@/views/HomeLogin";
import EmployeeList from "@/views/EmployeeList";
import EmployeeDescription from "@/views/EmployeeDescription";
import AddEmp from "@/views/AddEmp";
import AddDepartment from "@/views/AddDepartment";
import DelDepartment from "@/views/DelDepartment";
import EmpEdit from "@/views/EmpEdit";
Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    redirect:'/list'
  },
  {
    path: "/login",
    name: "HomeLogin",
    component: HomeLogin,
  },
  {
    path: "/list",
    name: "EmployeeList",
    component: EmployeeList
  },
  {
    path: "/list/desc/:id",
    name: "EmployeeDescription",
    component:EmployeeDescription
  },
  {
    path: "/list/add",
    name: "AddEmp",
    component:AddEmp
  },
  {
    path: "/list/addDe",
    name: "AddDepartment",
    component:AddDepartment
  },
  {
    path: "/list/delDe",
    name: "DelDepartment",
    component:DelDepartment
  },
  {
    path: "/list/desc/edit/:id",
    name: "EmpEdit",
    component:EmpEdit
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});
const originalPush=VueRouter.prototype.push;
VueRouter.prototype.push=function (location){
  return originalPush.call(this,location).catch(err=>err);
}
export default router;
