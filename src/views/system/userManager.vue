<template>
  <div id="outermost_wrap" class="user_manager_wrap">
    <div id="sub_wrap" class="top-nav">
      <CrumbsNav></CrumbsNav>
    </div>
    <div id="content_wrap" class="content_wrap"><el-row >
      <el-col :span="2">
        <el-select v-model="inputTitle" filterable  @change="inputValue=''" size="small">
          <el-option v-for="item in options" :key="item.label" :label="item.label" :value="item.label"></el-option>
        </el-select>
      </el-col>
      <el-col :span="4" class="optionValue">
        <el-input v-model="inputValue" :placeholder="inputTitle == '用户名' ? '请输入用户名' :  '请输入姓名'" size="small"></el-input>
      </el-col>
      <el-col :span="2">
        <el-button type="primary" size="small" @click="selectFilter(inputTitle,inputValue)">搜索</el-button>
      </el-col>
    </el-row>
      <el-row id="filer" class="supplierFiler">
        <el-collapse v-model="activeNames">
          <el-collapse-item name="1">
            <span class="span_label" >状态</span>
            <el-radio-group v-model="pageFilter.queryState" size="small" @change="getResponseData">
              <el-radio-button  label=""     v-if="ButtonInfo['全部']!='0'">全部</el-radio-button>
              <el-radio-button  label="1"     v-if="ButtonInfo['启用中']!='0'">启用中</el-radio-button>
              <el-radio-button  label="4"     v-if="ButtonInfo['停用中']!='0'">停用中</el-radio-button>
            </el-radio-group>
          </el-collapse-item>
        </el-collapse>
      </el-row>
      <el-row  v-if="ButtonInfo['添加']!='0'">
        <el-col :span="24" id="operation" ><el-button type="primary" class="el-icon-plus"  size="small" @click="showAddInfoDialog()">&nbsp;&nbsp;添加</el-button></el-col>
      </el-row>
      <div class="item_list">
        <el-table :data="userListData" border tooltip-effect="dark" style="width: 100%" >
            <el-table-column  label="操作" align="center">
              <template scope="scope" width="100px">
                <el-tooltip class="item" effect="dark" content="查看" placement="top-start"  v-if="ButtonInfo['查看']!='0'">
                  <i class="iconfontyyy" @click="showInfoDialog(scope.row,dialogFlag.inputDisabled=true);dialogFlag.addInputDisabled=true" >&#xe600;</i>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="编辑" placement="top-start"  v-if="ButtonInfo['编辑']!='0'">
                  <i class="iconfontyyy" @click="showInfoDialog(scope.row,dialogFlag.inputDisabled=false);dialogFlag.addInputDisabled=true">&#xe6e5;</i>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="停用" v-if="scope.row.userLevel == '1' &&ButtonInfo['停用']!='0'" placement="top-start"  >
                  <i class="iconfontyyy" @click="showChangeTypeDialog(scope.row)" v-if="scope.row.status == 1" >&#xe615;</i>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="启用" v-if="scope.row.userLevel == '1' && ButtonInfo['启用']!='0'" placement="top-start" >
                  <i class="iconfontyyy" @click="showChangeTypeDialog(scope.row)" v-if="scope.row.status == 4 " >&#xe618;</i>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" :content="scope.row.userLevel == '0'? '禁止点击':' 未激活'" v-if="(scope.row.userLevel == '0' || scope.row.status == 0)  && ButtonInfo[scope.row.userLevel == '0'? '禁止点击':' 未激活']!='0'"  placement="top-start">
                  <i class="iconfontyyy" @click="">&#xe634;</i>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column sortable prop="userNo" label="用户名" align="center"></el-table-column>
            <el-table-column sortable prop="userName" label="姓名" align="center"></el-table-column>
            <el-table-column sortable prop="userLevel" label="用户类型" :formatter="formatUserLevel" align="center"></el-table-column>
            <el-table-column sortable prop="status" label="状态" :formatter="formatStatus" align="center"></el-table-column>
        </el-table>
      </div>
    </div>
    <div id="page" class="page">
      <el-pagination @size-change="changePageSize" @current-change="changeCurrentPage" :current-page="page.currentPage" :page-sizes="[10,20,30,40]" :page-size="page.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="page.totalCount"></el-pagination>
    </div>
    <!--------------------启用停用窗口---------------------------->
    <el-dialog title="提示" :visible.sync="dialogFlag.isOpen" size="tiny">
      <span>{{dialogFlag.isOpenMsg}}</span>
      <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="changeTypeStatus" :loading="$store.state.loading">确 定</el-button>
          <el-button @click="dialogFlag.isOpen = false">取 消</el-button>
        </span>
    </el-dialog>
    <!--------------------共用同一个窗口：查看 + 编辑  + 添加  ------------------------------------->
    <el-dialog :title="dialogFlag.dialogTitle" :visible.sync="dialogFlag.infoDetail" @close="resetForm('form')">
      <el-form :model="form" :rules="rules" ref="form">
        <el-form-item label="用户邮箱" :label-width="formLabelWidth" prop="user_No" :rules="[{ required: true, message: '请输入邮箱地址', trigger: 'blur' },{ type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur,change' }]">
          <el-input v-model="form.user_No" :disabled="dialogFlag.addInputDisabled"></el-input>
        </el-form-item>
        <el-form-item label="用户姓名" :label-width="formLabelWidth" prop="user_Name" :rules="[{required: true, message: '姓名不能为空', trigger: 'blur'},{ min: 1, max: 10, message: '姓名长度不能超过10个字符', trigger: 'blur' }]">
          <el-input v-model="form.user_Name" :disabled="dialogFlag.inputDisabled"></el-input>
        </el-form-item>
        <el-form-item label="手机号码" :label-width="formLabelWidth" prop="phone" required>
          <el-input v-model="form.phone" :disabled="dialogFlag.inputDisabled"></el-input>
        </el-form-item>
        <el-form-item label="角色分配" :label-width="formLabelWidth" prop="userRoles">
          <el-checkbox-group v-model="role" @change="" style="display:inline;">
            <el-checkbox  :label="item.userRole_Id" :key="item" v-for="item in form.userRoles"  :checked="item.isCheck == 1 ? true : false" :disabled="dialogFlag.inputDisabled">{{item.role_Name}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
       <!-- <el-form-item label="账号分配" :label-width="formLabelWidth" prop="userAccounts">
          <el-form-item v-for="(list,index) in form.userAccounts" :key="list" >
            <el-col :span="3">
              <el-checkbox  v-model="parentIsChecked[index]" :disabled="dialogFlag.inputDisabled">{{list.acc_Name}}</el-checkbox>
            </el-col>
            <el-col :span="21">
              <el-checkbox-group v-model="account" >
                <el-checkbox  :label="item.userAcc_Id" :key="item"  v-for="item in list.account" v-show="parentIsChecked[index]" :checked="item.isCheck == 1 ? true :false" :disabled="dialogFlag.inputDisabled">{{item.acc_Name}}</el-checkbox>
              </el-checkbox-group>
            </el-col>
          </el-form-item>
        </el-form-item>-->
        <el-form-item label="仓库分配" :label-width="formLabelWidth" prop="userWares">
          <el-checkbox-group v-model="ware" @change="" style="display:inline;">
            <el-checkbox :label="item.userWare_Id" :key="item" v-for="item in form.userWares" :checked="item.isCheck == 1 ? true :false" :disabled="dialogFlag.inputDisabled">{{item.ware_Name}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="所属部门" :label-width="formLabelWidth" style="display:inline;" prop="depts">
          <el-checkbox-group v-model="dept" @change="">
            <el-checkbox :label="item.userDept_Id" :key="item" v-for="item in form.depts" :checked="item.isCheck == 1 ? true :false" :disabled="dialogFlag.inputDisabled">{{item.dept_Name}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="updateUser('form')" v-if="dialogFlag.inputDisabled==false" :loading="$store.state.loading">确 定</el-button>
        <el-button @click="dialogFlag.infoDetail = false;" v-if="dialogFlag.inputDisabled==false">取 消</el-button>
        <el-button @click="dialogFlag.infoDetail = false" v-if="dialogFlag.inputDisabled==true">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  export default{
    data(){
      const phoneType = (rule, value, callback) => {
        if (value == '') {
          callback(new Error('请输入手机号'));
        } else if(!/1(3[0-9]|6[0-9]|4[57]|5[0-35-9]|7[0-9]|8[0-9])\d{8}$/.test(value)){
          callback(new Error('请输入正确手机号'));
        } else {
          callback();
        }
      };
      return{
        url:'',
        activeNames: ['1'],
        userListData:[],      //  存储用户数据列表
        iconShow:true,   // 启用停用图标Flag
        dialogFlag:{
          isOpen:false,
          infoDetail:false,
          dialogTitle:"",
          isOpenMsg:'',
          addInputDisabled:false,  //用户邮箱是否可编辑  在添加与编辑中区分
          inputDisabled:false,   //checkbox是否处理可点击状态
        },
        page:{
          currentPage:1,
          pageSize:10,
          totalCount:10,
          totalPage:10
        },
        inputTitle:'姓名',
        inputValue:'',
        options: [{value: 1, label: '姓名'}, {value: 2, label: '用户名'}],
        pageFilter:{
          currentPage:1,
          userName:'',
          userNo:'',
          pageSize:10,
          queryState:''   //  获取启用停用数据传参queryState:1 启用 0 停用
        },
        form:{
          depts:[
            {
              userDept_Id:'',
              dept_Name:"",
              isCheck:""
            },
          ],
          userRoles:[
            {
              userRole_Id:"",
              isCheck:"",
              role_Name:""
            }
          ],
          userAccounts:[
            {
              account:[
                {
                  userAcc_Id:"",
                  acc_Name:"",
                  channelId:"",
                  isCheck:""
                },

              ],
              acc_Id:"",
              acc_Name:""
            }
          ],
          userWares:[
            {
              userWare_Id:"",
              ware_Name:'',
              isCheck:""
            }
          ],
          user_No:'',
          user_Name:"",
          phone:"",
          user_Id:''
        },     //  存储单个用户数据
        role:[],
        dept:[],
        account:[],
        ware:[],
        arr:[],        //  中间转换数据数组
        user_Id:'',   //  存储 用户 ID
        status:'',    //   存储 用户 状态（启用：1，停用：0）
        formLabelWidth: '80px',
        parentIsChecked:[],    //  弹窗页面 账号部分 分级控制显示隐藏
        rules: {
          phone:[
            {validator: phoneType, trigger: 'blur'}
          ]
        },
        ButtonInfo:{},//按钮权限列表20171227
      }
    },
    mounted () {
      this.getauthorityList();
      this.getResponseData();
    },
    methods: {

      /*********************页面按钮权限 20171227*****************************/
      getauthorityList(){
        var vm=this;
        vm.ButtonInfo=vm.tool.getBtnPermissions(vm.currentPath);
        console.log('horityList % 0',vm.ButtonInfo)

      },
      /*********************页面按钮权限 20171227*****************************/

      getResponseData:function(){
          this.httpPost('userMannger',this.qs.stringify(this.pageFilter)).then(res => {
          if(res.data.result == true){
            const pageData = res.data.params.listSysUser;
            this.page.currentPage = pageData.currentPage;
            this.page.totalCount = pageData.totalCount;
            this.page.totalPage = pageData.totalPage;
            this.page.pageSize = pageData.pageSize;
            this.userListData = pageData.listData;
          }else{
            this.userListData = [];
          }
        })
      },
      selectFilter:function(title,val){
        this.pageFilter.userName = title == '姓名' ? val :'';
        this.pageFilter.userNo = title == '用户名' ? val :'';
        this.getResponseData();
      },
      showInfoDialog:function(row,val){
        var vm = this;
        vm.dialogFlag.dialogTitle = val ? '查看用户' : '编辑用户';
        vm.user_Id = row.userId;
        vm.url = 'checkUserInfo.do?user_Id='+row.userId;
        this.httpPost(vm.url).then(res =>{
          if(res.data.result == true){
            vm.role = [];
            vm.dept = [];
            vm.ware =[];
            vm.account = [];
            const formData =  res.data.params;
            //--------------------------------------------
            formData.user_No = formData.userInfo.user_No;
            formData.user_Name = formData.userInfo.user_Name;
            formData.user_Id = formData.userInfo.user_Id;
            formData.phone = formData.userInfo.phone;
            delete formData.userInfo;
            //---------------------------------------
            vm.form = formData;
            //vm.resetPushItem(vm.form.userAccounts);
            vm.dialogFlag.infoDetail = true;
          }else{
              this.$message(res.data.message);
          }
        }).catch(function(err){
          console.log(err);
        })
      },
      showAddInfoDialog:function(){
        var vm = this;
        vm.form.user_No = '';
        vm.form.user_Name = '';
        vm.form.phone = '';
        vm.dialogFlag.dialogTitle = '添加用户';
        vm.dialogFlag.inputDisabled = false;
        vm.dialogFlag.addInputDisabled = false;
        vm.role = vm.dept = vm.ware = vm.account = [];
        vm.dialogFlag.infoDetail = true;
        vm.url = vm.RmsUrl + 'addUserInfo.do';
        const getUserRoleInfo=this.httpPost('userRoleInfo.do');
        const getUserDeptInfo=this.httpPost('userDeptInfo.do');
        const getUserWareHouseInfo=this.httpPost('userWareHouseInfo.do');
       // const getUserAccountInfo=this.httpPost('userAccountInfo.do');
        vm.$http.all([getUserRoleInfo,getUserDeptInfo,getUserWareHouseInfo])
          .then(this.$http.spread(function(userRoleInfo,userDeptInfo,userWareHouseInfo){
              vm.form.userRoles = userRoleInfo.data.params.listRoleInfo;
              vm.form.depts = userDeptInfo.data.params.listDeptInfo;
              vm.form.userWares = userWareHouseInfo.data.params.listWareInfo;
              //vm.form.userAccounts = userAccountInfo.data.params.listAccountInfo;
             // vm.resetPushItem(vm.form.userAccounts);
            })
          )
      },
      updateUser:function(formName){
        var vm = this,userParams = {};
        userParams.user_No = vm.form.user_No;
        userParams.user_Name = vm.form.user_Name;
        userParams.user_Id = vm.form.user_Id ;
        userParams.phone = vm.form.phone;
        userParams.role = vm.role.join();
        userParams.dept = vm.dept.join();
        userParams.ware = vm.ware.join();
        userParams.account = vm.account.join();
        userParams.user_Id = vm.dialogFlag.dialogTitle == '添加用户' ? '' : vm.user_Id;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.httpPost('addUserInfo.do',vm.qs.stringify(userParams)).then(res =>{
              if(res.data.result == true){
                this.getResponseData();
                this.$message("操作成功");
                this.dialogFlag.infoDetail = false;
              }else{
                  this.$message(res.data.message);
              }
            }).catch(function(err){
              console.log(err);
            })
          } else {
            return false
          }
        })
      },
      showChangeTypeDialog:function(row){
        this.dialogFlag.isOpen = row.userLevel == '0' || row.status == '0' ? false : true;
        var vm =  this.dialogFlag;
        console.log('row.status ==='+row.status);
        this.user_Id = row.userId;
        this.status = row.status;
        return row.status == 1 ? vm.isOpenMsg = '您确定停用此用户吗？': row.status == 4 ? vm.isOpenMsg = '您确定启用此用户吗？' : '未知'
      },
      changePageSize:function(val){
        this.pageFilter.pageSize=val;
        this.pageFilter.currentPage = 1;
        this.getResponseData();
      },
      changeCurrentPage:function(val){
        this.pageFilter.currentPage=val;
        this.getResponseData();
      },
      changeTypeStatus:function(){
        this.dialogFlag.isOpen = false;
        var userParams = {
          user_Id:this.user_Id,
          state:this.status
        }
        this.httpPost('setUserState.do',this.qs.stringify(userParams)).then(res =>{
          if(res.data.result == true){
            this.getResponseData();
          }
        }).catch(function(err){
          console.log(err);
        })

      },
      formatUserLevel:function(row){
        return row.userLevel == 1 ? '普通员工' : row.userLevel == 0 ? '管理员' : '未知';
      },
      formatStatus:function(row){
        return  row.status === 1 ? '启用' : row.status === 4 ? '停用' :  row.status === 0 ? '未激活' : '未知'
      },
      resetForm:function(formName) {
        this.$refs[formName].resetFields();
      },
      resetPushItem:function(data){
        this.parentIsChecked = [];
        for(var i=0;i<data.length;i++){
          this.parentIsChecked.push(true)
        }
      }
    }
  }
</script>

<style scoped>
  .el-checkbox+.el-checkbox{
    margin-right: 15px;
    margin-left:0;
  }
  .el-checkbox{
    margin-right:15px;
  }
</style>
