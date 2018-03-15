<template>
  <div id="outermost_wrap" class="user_manager_wrap tree_data">
    <div id="sub_wrap" class="sub_wrap">
      <CrumbsNav></CrumbsNav>
    </div>
    <div id="content_wrap" class="content_wrap">
      <div class="tree_data">
        <div class="tree_title">
          <span>部门管理<span>{{'('+deptCount+')'}}</span></span>
          <span>
             <el-tooltip class="item" effect="dark" content="添加" placement="top-start" v-if="ButtonInfo['添加']!='0'" >
               <i class="iconfontyyy small" @click="dialogFlag.dialogTitle='添加一级部门';dialogFlag.isOpen=true;">&#xe623;</i>
             </el-tooltip>
          </span>
        </div>
        <el-tree :data="deptList" accordion :default-expanded-keys="defaultExpandedKey" @node-expand="saveCurrentExpandedKey" :highlight-current="true" :props="defaultProps" node-key="deptId" :expand-on-click-node="false" @node-click="getResponseData" :render-content="renderContent"></el-tree>
      </div>
      <div class="content_data">
        <div class="table_data">
          <div style="padding:10px 5px;">
            <el-row class="filterOption" id="filterOption" >
              <el-col :span="6" class="optionValue">
                <el-input v-model="pageFilter.userName" placeholder="请输入用户姓名" size="small"></el-input>
              </el-col>
              <el-col :span="1">
                <el-button type="primary" class="research_btn" id="research_btn" size="small" @click="getResponseData('');">搜索</el-button>
              </el-col>
              <div style="text-align: right;"  v-if="pageFilter.deptId !=''">
                <el-button type="primary" class="el-icon-plus"  size="small" @click="showAllUsers();">添加成员</el-button>
              </div>
            </el-row>
          </div>
          <div id="item_list">
            <el-table border  tooltip-effect="dark" :data="deptListData" label-width="" style="width:100%">
              <el-table-column label="操作" width="120" align="center">
                <template scope="scope">
                  <el-tooltip class="item" effect="dark" content="移除" placement="top-start" v-if="ButtonInfo['移除']!='0'" >
                    <i class="iconfontyyy"  @click="deleteUserFromDep(scope.row)">&#xe665;</i>
                  </el-tooltip>
                  <el-tooltip class="item" effect="dark" :content="scope.row.isManage == '是' ? '取消经理' : '设置为经理'" placement="top-start"  v-if="ButtonInfo[scope.row.isManage == '是' ? '取消经理' : '设置为经理']!='0'"  >
                    <i class="iconfontyyy"  @click="toggleManagerFromDep(scope.row)">&#xe624;</i>
                  </el-tooltip>
                </template>
              </el-table-column>
              <el-table-column label="姓名"  prop="userName" align="center"  sortable  ></el-table-column>
              <el-table-column label="是否部门经理"  prop="isManage" align="center"  sortable ></el-table-column>
              <el-table-column label="邮箱" prop="email" width="180px" sortable align="center"></el-table-column>
              <el-table-column label="电话" prop="phone" width="180px" sortable align="center"></el-table-column>
              <el-table-column label="用户状态"  align="center"  prop="userStatus" sortable ></el-table-column>
              <el-table-column label="创建时间"  align="center"  prop="deptAddTime" width="180px" sortable ></el-table-column>
              <el-table-column label="添加时间" align="center"  prop="userAddTime" width="180px" sortable ></el-table-column>
            </el-table>
          </div>
        </div>
        <div id="page" class="page">
          <el-pagination @size-change="changePageSize" @current-change="changeCurrentPage" :current-page="page.currentPage" :page-sizes="[10,20,30,40]" :page-size="page.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="page.totalCount"></el-pagination>
        </div>
      </div>
    </div>
    <!-----------------------添加一级，子级部门----------------------------------->
    <el-dialog :title="dialogFlag.dialogTitle" :visible.sync="dialogFlag.isOpen" size="tiny" @close="resetForm('infoForm');">
      <el-form ref="infoForm" :model="infoForm" label-width="80px"  >
        <el-form-item label="部门名称" prop="deptName" required :rules="[{required:true,message:'不能为空',trigger:'change'},{min:1,max:10,message:'长度不能超过10',trigger:'change'}]">
          <el-input v-model="infoForm.deptName"></el-input>
          <input type="text" style="display:none ">
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFlag.isOpen = false">取 消</el-button>
        <el-button type="primary" @click="addDept('infoForm');" :loading="$store.state.loading">确 定</el-button>
      </div>
    </el-dialog>
    <!-----------------------添加部门成员----------------------------------->
    <el-dialog title="添加部门成员" :visible.sync="dialogFlag.infoDetail" size="tiny" @close="checkList = [];">
      <el-checkbox-group v-model="checkList">
        <el-col :span="12" v-for="item in usersData" :key="item.userId"><el-checkbox :label="item.userId"  :value="item.userId">{{item.userName}}</el-checkbox></el-col>
      </el-checkbox-group>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFlag.infoDetail = false">取 消</el-button>
        <el-button type="primary" @click="addUserToDep" :loading="$store.state.loading">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  export default{
    data(){
      return{
        checkList:[],
        deptCheckedList:[],
        deptCount:'',
        defaultExpandedKey:[],
        defaultKeys:[],
        deptList:[],
        deptListData:[],
        defaultProps: {
          children: 'sysDeptDataList',
          label: 'deptName'
        },
        infoForm:{
          deptName:'',
        },
        pageFilter:{
          currentPage:1,
          pageSize:10,
          deptId:'',
          userName:''
        },
        dialogFlag:{
          isOpen:false,
          infoDetail:false,
          dialogTitle:"",
        },
        page:{
          currentPage:1,
          pageSize:10,
          totalCount:10,
          totalPage:10
        },
        dept_id:'',
        formLabelWidth: '80px',
        usersData:[],
        ButtonInfo:{},//按钮权限列表20171227
      }
    },
    mounted () {
      this.getauthorityList();
      this.getResponseData('');
      this.getDeptList();
    },
    methods: {
      /*********************页面按钮权限 20171227*****************************/
      getauthorityList(){
        var vm=this;
        vm.ButtonInfo=vm.tool.getBtnPermissions(vm.currentPath);
        console.log('horityList % 0',vm.ButtonInfo)

      },
      /*********************页面按钮权限 20171227*****************************/
      getDeptList: function () {
        this.httpPost('deptManager/selectDeptList',{isUse:''}).then(res => {
          if (res.data.result == true) {
            this.deptList = res.data.params.deptList;
            this.deptCount = res.data.params.deptList.length;
          }
        })
      },
      getResponseData:function(data) {
         this.dept_id = data.deptId;
        data != '' ? this.pageFilter.deptId = data.deptId : this.pageFilter.deptId = '';
        this.httpPost('deptManager/selectDeptUserList', this.pageFilter).then(res => {
          const pageData = res.data.params.deptUserList;
          this.page = pageData;
          this.deptListData = pageData.listData;
          console.log('  ---deptListData % O', this.deptListData);
        }).catch(function (err) {});
      },
      showAllUsers:function(){
        this.httpPost('deptManager/selectUserNameList',{deptId:this.dept_id}).then(res =>{
            if(res.data.result == true){
              this.usersData = res.data.params.userNameList;
              if(this.usersData.length>0){
                this.dialogFlag.infoDetail=true;
              }else{
                this.$message('该部门已添加全部公司人员！');
              }
            }
        })
      },
      addUserToDep:function(){
          this.httpPost('deptManager/saveDeptUser',{deptId:this.dept_id,userId:this.checkList}).then(res =>{
            if(res.data.result == true){
                this.dialogFlag.infoDetail = false;
                this.$message(res.data.message);
                this.getResponseData({deptId:this.pageFilter.deptId});
            }else{
                this.$message(res.data.message);
            }
          })
      },
      deleteUserFromDep:function(row){
        this.doItem('您确定将此成员移除？','deptManager/removeDeptUser',{deptId:row.deptId,userId:row.userId},this.getResponseData,{deptId:this.dept_id});
      },
      toggleManagerFromDep:function(row){
        var isManage = row.isManage == '是' ? '0' : '1';
        var msg = row.isManage == '是' ? '您确定将其取消部门经理？' : '您确定将其设置为部门经理？';
        this.doItem(msg,'deptManager/saveDeptManage',{deptId:row.deptId,userId:row.userId,isManage:isManage},this.getResponseData,{deptId:this.dept_id});
      },
      addDept:function(formName) {
        var deptId = this.dialogFlag.dialogTitle == '添加一级部门' ?  '' :  this.dept_id;
        var url = this.dialogFlag.dialogTitle == '编辑部门' ? 'deptManager/updateDeptDate': 'deptManager/saveDeptDate';
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.httpPost(url,{deptId:deptId,deptName:this.infoForm.deptName}).then(res => {
              if(res.data.result == true){
                this.$message(res.data.message);
                this.dialogFlag.isOpen = false;
                this.getDeptList();
                this.defaultExpandedKey = this.defaultKeys;
              }else{
                this.$message(res.data.message);
              }
            })
          }
        })
      },
      changePageSize: function (val) {
        this.pageFilter.pageSize = val;
        this.pageFilter.currentPage = 1;
        this.getResponseData({deptId:this.dept_id});
      },
      changeCurrentPage: function (val) {
        this.pageFilter.currentPage = val;
        this.getResponseData({deptId:this.dept_id});
      },
      renderContent(createElement, {node, data, store}){
        var vm = this;
        var icon = document.getElementsByName(data.deptId);
        setTimeout(function(){
          if(data.deptId == icon[0].id && (vm.ButtonInfo['停用']!='0' || vm.ButtonInfo['启用']!='0')){
              icon[0].className = data.use == true ? 'iconfontyyy icon-tingyongg' : 'iconfontyyy icon-qiyongg';
              }
        },10);
        var toggleStatus = function(){
          vm.dept_id = data.deptId;
          var msg = data.use == false ? '您确定启用此部门？' : '您确定停用此部门？';
          var isUse = data.use == false ? '1' : '0';
          vm.doItem(msg,'deptManager/updateStatus',{deptId:data.deptId,isUse:isUse},vm.getDeptList);
          vm.defaultExpandedKey = vm.defaultKeys;
        }
        let editItem='';
        let addItem='';
        if(vm.ButtonInfo['编辑']!='0'){
          editItem='';
        }else{
          editItem='editItem'
        }
        if(vm.ButtonInfo['新增']!='0'){
          addItem='';
        }else{
          addItem='addItem';
        }
        var elementObj= createElement('span',
          [
          	createElement('span',{attrs:{style:"padding-right: 72px;"}}, node.label),
            createElement('span', {attrs: {style: "position:absolute;right:-5px; margin-right: 5px", class: 'btnGroup'}},
              [
                createElement('el-tooltip', {attrs: {class: "item", id:editItem, effect: "dark", content: "编辑", placement: "top-start"}},
                  [
                    createElement('el-button', {
                   attrs: {
                  size: "mini", icon: "edit",
                }, on: {
                  click: function () {
                    vm.dialogFlag.isOpen = true;
                    vm.dept_id = data.deptId;
                    vm.dialogFlag.dialogTitle = '编辑部门';
                    vm.httpPost('deptManager/selectDeptData',{deptId:data.deptId}).then(res =>{
                      if(res.data.result == true){
                        vm.infoForm.deptName = res.data.params.sysDept.deptName;
                      }
                    });
                  }
                }
              }, '')]),
            createElement('el-tooltip', {
              attrs: {
                class: "item", effect: "dark",content: data.use == false ? '启用部门' : '停用部门', placement: "top-start"
              }
            }, [
              createElement('i', {
                attrs: {
                  id:data.deptId,name:data.deptId,class: "",
                }, on: {
                  click: function () {
                    toggleStatus();
                  }
                }
              },)]),
            createElement('el-tooltip', {
              attrs: {
                class: "item", effect: "dark", id:addItem, content: "添加", placement: "top-start"
              }
            }, [
              createElement('el-button', {
                attrs: {
                  size: "mini", icon: "plus",
                }, on: {
                  click: function () {
                    vm.dept_id = data.deptId;
                    vm.dialogFlag.dialogTitle = '添加子级部门';
                    vm.dialogFlag.isOpen = true;
                  }
                }
              }, '')]),
          ]),
        ])
        return  elementObj;
      /*  createElement('span', [
          createElement('span',{attrs:{style:"padding-right: 72px;"}}, node.label),
          createElement('span', {
            attrs: {
              style: "position:absolute;right:-5px; margin-right: 5px", class: 'btnGroup'
            }
          }, [
            createElement('el-tooltip', {
              attrs: {
                class: "item", effect: "dark", content: "编辑", placement: "top-start"
              }
            }, [
              createElement('el-button', {
                attrs: {
                  size: "mini", icon: "edit",
                }, on: {
                  click: function () {
                    vm.dialogFlag.isOpen = true;
                    vm.dept_id = data.deptId;
                    vm.dialogFlag.dialogTitle = '编辑部门';
                    vm.httpPost('deptManager/selectDeptData',{deptId:data.deptId}).then(res =>{
                      if(res.data.result == true){
                        vm.infoForm.deptName = res.data.params.sysDept.deptName;
                      }
                    });
                  }
                }
              }, '')]),
            createElement('el-tooltip', {
              attrs: {
                class: "item", effect: "dark",content: data.use == false ? '启用部门' : '停用部门', placement: "top-start"
              }
            }, [
              createElement('i', {
                attrs: {
                  id:data.deptId,name:data.deptId,class: "",
                }, on: {
                  click: function () {
                    toggleStatus();
                  }
                }
              },)]),
            createElement('el-tooltip', {
              attrs: {
                class: "item", effect: "dark", content: "添加", placement: "top-start"
              }
            }, [
              createElement('el-button', {
                attrs: {
                  size: "mini", icon: "plus",
                }, on: {
                  click: function () {
                    vm.dept_id = data.deptId;
                    vm.dialogFlag.dialogTitle = '添加子级部门';
                    vm.dialogFlag.isOpen = true;
                  }
                }
              }, '')]),
          ]),
        ])*/
      },
      saveCurrentExpandedKey:function(data){
        this.defaultKeys=[];
        this.defaultKeys.push(data.deptId)
      },
      resetForm: function (formName) {
        this.$refs[formName].resetFields();
      },
    }
  }
</script>

<style scoped>
  .user_manager_wrap{
    overflow-x: hidden;
  }
  .content_wrap{
    display: flex;
  }
  .content_wrap .tree_data{
    min-width: 220px;
    height:100%;
    border:1px solid #d1dbe5 ;
    overflow: auto;
    position:relative;
  }
  .tree_data .el-tree{
    border:none;
    font-size:14px;
  }
  .content_wrap .content_data{
    margin-left:10px;
    flex:1;
    display: flex;
    flex-direction:column;
    overflow: auto;
  }
  .content_data .table_data{
    flex:1;
  }
  i.iconfontyyy.small{
    font-size:18px;
  }
  .tree_data .tree_title{
    border-bottom:1px solid #d1dbe5;
    display: flex;
    justify-content: space-between;
    padding: 10px 5px;
  }
  .el-checkbox-group label{
    padding:10px 20px!important;
  }
  .el-checkbox+.el-checkbox {
    margin-left: 0px;
  }
</style>
