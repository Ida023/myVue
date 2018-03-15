<template>
  <div id="outermost_wrap" class="user_manager_wrap">
    <div id="sub_wrap" class="sub_wrap">
      <el-row>
        <el-col :span="24"><div class="grid-content bg-purple-dark">当前位置：一级菜单 > 二级菜单 > 供应链列表</div></el-col>
      </el-row>
    </div>
    <div id="content_wrap" class="content_wrap">
      <el-row class="filterOption" id="filterOption" >
        <el-col :span="2">
          <el-select v-model="filterParams.optionTitle" filterable @change="filterValue">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-col>
         <el-col :span="6" class="optionValue">
           <el-input v-model="filterParams.optionValue" placeholder="请输入供应商名称"></el-input>
         </el-col>
        <el-col :span="1">
          <el-button type="primary" class="research_btn" id="research_btn" size="small" @click="showAddInfoDialog()">搜索</el-button>
        </el-col>
      </el-row>
      <el-row class="supplierFiler">
        <el-collapse v-model="activeNames">
          <el-collapse-item name="1">
            <span class="span_label">供应商状态</span>
            <el-radio-group v-model="radio">
              <el-radio class="radio"  label="1">启用供应商平台</el-radio>
              <el-radio class="radio"  label="2">未启用供应商平台</el-radio>
            </el-radio-group>
          </el-collapse-item>
        </el-collapse>
      </el-row>
      <el-row class="supplier_btn">
        <el-button type="primary" class="el-icon-plus" @click="dialogFlag.dialogTitle='添加供应商';dialogFlag.infoDetail=true;dialogFlag.inputDisabled=false;">&nbsp;&nbsp;添加供应商</el-button>
        <el-button type="primary" icon="">批量导入</el-button>
        <el-button type="primary" icon="">批量导出</el-button>
      </el-row>
      <el-row class="supplier_delete">
        <el-button type="danger" icon="delete" id="supplier_delete_btn" @click="getSupplierIds();" class="supplier_delete_btn">&nbsp;&nbsp;批量删除</el-button>
      </el-row>
      <div id="item_list">
        <el-table :data="supplierListData" border tooltip-effect="dark" style="width: 100%"  max-height="600"  @selection-change="selsChange">
          <el-table-column sortable type="selection" width="55" align="center"></el-table-column>
          <el-table-column sortable prop="status" label="序号" align="center"></el-table-column>
          <el-table-column sortable label="操作" align="center">
            <template scope="scope" width="100px">
              <el-tooltip class="item" effect="dark" content="查看" placement="top-start">
                <i class="iconfontyyy" @click="showInfoDialog(scope.row,dialogFlag.inputDisabled=true);dialogFlag.infoDetail=true" >&#xe600;</i>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="编辑" placement="top-start">
                <i class="iconfontyyy" @click="showInfoDialog(scope.row,dialogFlag.inputDisabled=false);dialogFlag.infoDetail=true">&#xe6e5;</i>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="删除" placement="top-start">
                <i class="iconfontyyy" @click="id = scope.row.status;dialogFlag.isOpen = true;dialogFlag.isOpenMsg = '确定删除该数据吗？';">&#xe6f7;</i>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column sortable prop="userNo" label="供应商名称" align="center"></el-table-column>
          <el-table-column sortable prop="userName" label="省份" align="center"></el-table-column>
          <el-table-column sortable prop="userLevel" label="地市" align="center"></el-table-column>
          <el-table-column sortable prop="status" label="地址"  align="center"></el-table-column>
          <el-table-column sortable prop="status" label="联系人"  align="center"></el-table-column>
          <el-table-column sortable prop="status" label="联系电话"  align="center"></el-table-column>
        </el-table>
      </div>
    </div>
    <div id="page" class="page">
      <el-pagination @size-change="changePageSize" @current-change="changeCurrentPage" :current-page="page.currentPage" :page-sizes="[10,20,30,40]" :page-size="page.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="page.totalCount"></el-pagination>
    </div>
    <!---------------批量及单个删除弹出框-------------------------->
    <el-dialog title="提示" :visible.sync="dialogFlag.isOpen" size="tiny" :close-on-click-modal="false">
      <span>{{dialogFlag.isOpenMsg}}</span>
      <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="singleDelete()" v-if="dialogFlag.isOpenMsg == '确定删除该数据吗？'" :loading="$store.state.loading">确 定</el-button>
          <el-button type="primary" @click="batchDelete()" v-if="dialogFlag.isOpenMsg == '确定批量删除这些数据吗？'" :loading="$store.state.loading">确 定</el-button>
          <el-button @click="dialogFlag.isOpen = false">取 消</el-button>
        </span>
    </el-dialog>
    <!------------------重置密码 弹出框--------------------------->
    <el-dialog title="重置密码" :visible.sync="dialogFlag.openResetPass" :close-on-click-modal="false">
      <el-form :model="form">
        <el-form-item label="请输入密码" :label-width="financeFormLabelWidth">
          <el-input v-model="form.name" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFlag.openResetPass = false">取 消</el-button>
        <el-button type="primary" @click="dialogFlag.openResetPass = false" :loading="$store.state.loading">确 定</el-button>
      </div>
    </el-dialog>
    <!------------------查看 / 编辑 / 添加 供应商 弹出框--------------------------->
    <el-dialog :title="dialogFlag.dialogTitle" :visible.sync="dialogFlag.infoDetail" :close-on-click-modal="false" >
      <el-tabs v-model="activeTab" @tab-click="handleClick">
        <el-tab-pane label="基本信息" name='1' >
          <el-form :model="baseForm" class="demo-ruleForm">
            <el-form-item label="供应商名称"  prop="supplierName" :label-width="financeFormLabelWidth" required="">
              <el-input v-model="baseForm.supplierName" :disabled="dialogFlag.inputDisabled"></el-input>
            </el-form-item>
            <el-form-item label="网址"  prop="supplierUniform" :label-width="financeFormLabelWidth">
              <el-input v-model="baseForm.supplierUniform" :disabled="dialogFlag.inputDisabled"></el-input>
            </el-form-item>
            <el-form-item label="地址"  prop="supplierAddress" :label-width="financeFormLabelWidth" required="">
              <el-input v-model="baseForm.supplierAddress" :disabled="dialogFlag.inputDisabled"></el-input>
            </el-form-item>
            <el-form-item label="固话"  prop="supplierTel" :label-width="financeFormLabelWidth" >
              <el-input v-model="baseForm.supplierTel" :disabled="dialogFlag.inputDisabled"></el-input>
            </el-form-item>
            <el-form-item label="传真"  prop="supplierFax" :label-width="financeFormLabelWidth">
              <el-input v-model="baseForm.supplierFax" :disabled="dialogFlag.inputDisabled"></el-input>
            </el-form-item>
            <el-form-item label="性质"  prop="property" :label-width="financeFormLabelWidth">
              <el-radio-group v-model="baseForm.property">
                <el-radio label="公司" name="bankTransfer" :disabled="dialogFlag.inputDisabled"></el-radio>
                <el-radio label="个人" name="alipay" :disabled="dialogFlag.inputDisabled"></el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="附件"  prop="additionData" :label-width="financeFormLabelWidth">
              <el-input v-model="baseForm.additionData"></el-input>
            </el-form-item>
          </el-form>
        </el-tab-pane>
          <el-tab-pane label="联系人" name='2' >
            <el-form :model="form" :rules="rules" ref="form">
              <el-row>
                <el-col :span="7" v-for="(item,index) in form.relationData" key="item.key">
                  <el-form-item label="姓名" :label-width="formLabelWidth" prop="name" required>
                    <el-input v-model="item.name" :disabled="dialogFlag.inputDisabled"></el-input>
                  </el-form-item>
                  <el-form-item label="职位" :label-width="formLabelWidth" prop="job">
                    <el-input v-model="item.job" :disabled="dialogFlag.inputDisabled"></el-input>
                  </el-form-item>
                  <el-form-item label="电话" :label-width="formLabelWidth" prop="phone" required>
                    <el-input v-model="item.phone" :disabled="dialogFlag.inputDisabled"></el-input>
                  </el-form-item>
                  <el-form-item label="QQ" :label-width="formLabelWidth" prop="qq" >
                    <el-input v-model="item.qq" :disabled="dialogFlag.inputDisabled"></el-input>
                  </el-form-item>
                  <el-form-item label="阿里旺旺" :label-width="formLabelWidth" prop="ali">
                    <el-input v-model="item.ali" :disabled="dialogFlag.inputDisabled"></el-input>
                  </el-form-item>
                  <el-form-item label="邮箱" :label-width="formLabelWidth" prop="email">
                    <el-input v-model="item.email" :disabled="dialogFlag.inputDisabled"></el-input>
                  </el-form-item>
                  <el-form-item  :label-width="formLabelWidth">
                    <el-button  @click="deleteRelationship(item)" :disabled="dialogFlag.inputDisabled">&nbsp;&nbsp;删除</el-button>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row class="addRelationship">
                <el-button type="primary" class="el-icon-plus" @click="addRelationship" :disabled="dialogFlag.inputDisabled">&nbsp;&nbsp;添加联系人</el-button>
              </el-row>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="财务信息" name='3' >
            <el-form :model="financeForm" class="demo-ruleForm">
              <el-form-item label="付款方式" :label-width="financeFormLabelWidth" prop="payType" >
                <el-radio-group v-model="financeForm.payType">
                  <el-radio label="银行转账" name="bankTransfer" :disabled="dialogFlag.inputDisabled"></el-radio>
                  <el-radio label="支付宝" name="alipay" :disabled="dialogFlag.inputDisabled"></el-radio>
                  <el-radio label="现金" name="cash" :disabled="dialogFlag.inputDisabled"></el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="银行名称" :label-width="financeFormLabelWidth" prop="bankName">
                <el-input v-model="financeForm.bankName" :disabled="dialogFlag.inputDisabled"></el-input>
              </el-form-item>
              <el-form-item label="收款账号" :label-width="financeFormLabelWidth" prop="accountNumber">
                <el-input v-model="financeForm.accountNumber" :disabled="dialogFlag.inputDisabled"></el-input>
              </el-form-item>
              <el-form-item label="收款人" :label-width="financeFormLabelWidth" prop="payee">
                <el-input v-model="financeForm.payee" :disabled="dialogFlag.inputDisabled"></el-input>
              </el-form-item>
              <el-form-item label="支付宝收款账号" :label-width="financeFormLabelWidth" prop="alipayAccount">
                <el-input v-model="financeForm.alipayAccount" :disabled="dialogFlag.inputDisabled"></el-input>
              </el-form-item>
              <el-form-item label="支付宝收款人" :label-width="financeFormLabelWidth" prop="alipayPayee">
                <el-input v-model="financeForm.alipayPayee" :disabled="dialogFlag.inputDisabled"></el-input>
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="高级功能" name='4' >
          <el-form :model="highForm" class="demo-ruleForm">
            <el-form-item label="供应商系统地址"  prop="supplierUrl" :label-width="highFormLabelWidth">
              <el-input v-model="highForm.supplierUrl" :disabled="dialogFlag.inputDisabled"></el-input>
            </el-form-item>
            <el-form-item label="供应商账号"  prop="supplierAccount" :label-width="highFormLabelWidth">
              <el-input v-model="highForm.supplierAccount" placeholder="建议采用供应商联系人手机" :disabled="dialogFlag.inputDisabled"></el-input>
            </el-form-item>
            <el-form-item label="供应商密码"  prop="supplierPass" :label-width="highFormLabelWidth">
              <span>供应商初始密码为123456</span><el-button class="resetPass" @click="dialogFlag.openResetPass = true;" :disabled="dialogFlag.inputDisabled">重置密码</el-button>
            </el-form-item>
            <el-form-item label="状态"  prop="status" :label-width="highFormLabelWidth">
              <el-radio-group v-model="highForm.status">
                <el-radio label="启用" name="bankTransfer" :disabled="dialogFlag.inputDisabled"></el-radio>
                <el-radio label="停用" name="alipay" :disabled="dialogFlag.inputDisabled"></el-radio>
              </el-radio-group>
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogFlag.infoDetail = false" v-if="dialogFlag.inputDisabled==false" :loading="$store.state.loading">保 存</el-button>
        <!--<el-button type="warning" @click="saveAndNext()" v-if="dialogFlag.inputDisabled==false">保存&下一步</el-button>-->
        <el-button @click="dialogFlag.infoDetail = false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import ElButton from "../../../node_modules/element-ui/packages/button/src/button";
  export default{
    components: {ElButton},
    data(){
      return {
        url:'',
        options: [{
          value: '选项1',
          label: '名称'
        }, {
          value: '选项2',
          label: '联系人'
        }, {
          value: '选项3',
          label: '联系电话'
        }],
        filterParams:{
          optionValue:'',
          optionTitle:'',
        },
        page:{          // 分页参数
          currentPage:1,
          pageSize:10,
          totalCount:10,
          totalPage:10
        },
        radio:'',
        activeNames: ['1'],    //  筛选 功能的折又又叠面板
        activeTab:'1',     // 查看 编辑 添加 弹出框 的 tab 标签页
        supplierListData:[],   // 供应商列表
        dialogFlag:{
          isOpen:false,     // 批量及单个删除框
          openResetPass:false,  // 重置密码框
          infoDetail:false,    //  添加 编辑  查看框
          dialogTitle:"",     // 弹出框 的title
          isOpenMsg:'',      // 弹出框 的msg
          otherInputDisabled:false,  //用户邮箱是否可编辑  在添加与编辑中区分
          inputDisabled:false,   //checkbox是否处理可点击状态
        },
        supplier_Id:1111,   // 存储供应商id
        sels:[],    //批量删除已选的条目数
        id:'',
        baseForm: {             // 基本信息
          supplierName: '',
          supplierUniform: '',
          supplierAddress: '',
          supplierFax: '',
          supplierTel: '',
          property: '',
          additionData:'',
        },
        form:{             //  联系人信息
          relationData:[{
            name:'11',
            job:'11',
            phone:'11',
            qq:'11',
            ali:'11',
            email:'11',
          }] ,
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
        },
        financeForm: {             // 财务信息
          payType: '',
          bankName: '',
          accountNumber: '',
          payee: '',
          alipayAccount: '',
          alipayPayee: '',
        },
        highForm: {             // 高级功能信息
          supplierUrl: '',
          supplierAccount: '',
          accountNumber: '',
          status: '',
        },
        formLabelWidth: '80px',
        financeFormLabelWidth: '120px',
        highFormLabelWidth:'150px',
        baseFormLabelWidth:'150px',
      }
    },
    mounted () {
      this.getSupplierList();
    },
    methods: {
      filterValue:function(val){
          alert(val);
      },
      getSupplierList:function(){
        this.url = this.RmsUrl+'userMannger';
        //this.$http.post(this.url,this.qs.stringify(this.pageFilter)).then(res => {
          this.$http.get('../../../static/userListDate.json').then(res => {
          if(res.data.result == true){
            const pageData = res.data.params.listSysUser;
            this.page.currentPage = pageData.currentPage;
            this.page.totalCount = pageData.totalCount;
            this.page.totalPage = pageData.totalPage;
            this.page.pageSize = pageData.pageSize;
            this.supplierListData = pageData.listData;
            console.log('  ---userListData % O',this.supplierListData);
          }else{
            this.supplierListData = [];
            console.log('请求无数据');
          }
        }).catch(function(err){
          console.log(err);
        })
      },
      batchDelete:function(value){
        this.id = this.sels.map(item => item.status);
        alert('批量删除'+this.id);
        this.dialogFlag.isOpen = false;
      },
      singleDelete:function(){
          alert('单个删除'+this.id);
          this.dialogFlag.isOpen = false;
      },
      getSupplierIds:function(){
        this.id = this.sels.map(item => item.status);
        alert(this.id);
        this.dialogFlag.isOpenMsg =  this.id=='' ? '未选择任何数据' : '确定批量删除这些数据吗？';
        this.dialogFlag.isOpen = true;
      },
      selsChange: function (sels) {
        this.sels = sels;
      },
      addRelationship:function(){
          if(this.form.relationData.length >= 3){
              this.$message('最多只能添加三个联系人')
          }else{
            this.form.relationData.push({
              name:'12222221',
              job:'1222222221',
              phone:'1222222221',
              qq:'1222222221',
              ali:'121',
              email:'11',
              key: Date.now()
            });
          }
      },
      deleteRelationship:function(val){
        var index = this.form.relationData.indexOf(val);
        if (index !== -1) {
          this.form.relationData.splice(index, 1)
        }
      },
      saveAndNext:function(){
        this.activeTab +=1;
      },
      showInfoDialog:function(row,val){
        var vm = this;
        vm.dialogFlag.dialogTitle = val ? '查看供应商' : '编辑供应商';

      },
      showAddInfoDialog:function(){
        var vm = this;
        vm.form.user_No = '';
        vm.form.user_Name = '';
        vm.form.phone = '';
        vm.dialogFlag.dialogTitle = '添加用户';
        vm.dialogFlag.inputDisabled = false;
        vm.dialogFlag.inputDisabled = false;
        vm.role = vm.dept = vm.ware = vm.account = [];
        vm.dialogFlag.infoDetail = true;
        vm.url = vm.RmsUrl + 'addUserInfo.do';
        const getUserRoleInfo=this.$http.post(this.RmsUrl + 'userRoleInfo.do');
        const getUserDeptInfo=this.$http.post(this.RmsUrl + 'userDeptInfo.do');
        const getUserWareHouseInfo=this.$http.post(this.RmsUrl + 'userWareHouseInfo.do');
        const getUserAccountInfo=this.$http.post(this.RmsUrl + 'userAccountInfo.do');
        vm.$http.all([getUserRoleInfo,getUserDeptInfo,getUserWareHouseInfo,getUserAccountInfo])
          .then(this.$http.spread(function(userRoleInfo,userDeptInfo,userWareHouseInfo,userAccountInfo){
              vm.form.userRoles = userRoleInfo.data.params.listRoleInfo;
              vm.form.depts = userDeptInfo.data.params.listDeptInfo;
              vm.form.userWares = userWareHouseInfo.data.params.listWareInfo;
              vm.form.userAccounts = userAccountInfo.data.params.listAccountInfo;
            })
          )
      },
      updateUser:function(formName){
        var vm = this;
        //const userParams = {};
        userParams.user_No = vm.form.user_No;
        userParams.user_Name = vm.form.user_Name;
        userParams.user_Id = vm.form.user_Id ;
        userParams.phone = vm.form.phone;
        console.log("userParams===== % O",userParams);
        userParams.role = vm.role.join();
        userParams.dept = vm.dept.join();
        userParams.ware = vm.ware.join();
        userParams.account = vm.account.join();
        delete userParams['user_Id'];
       // vm.dialogFlag.dialogTitle == '添加用户' ? delete userParams.user_Id : userParams.user_Id = vm.user_Id;
        console.log(vm.user_Id);
        console.log("now   userParams===== % O",userParams);
        vm.url = vm.RmsUrl + 'addUserInfo.do';
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$http.post(vm.url,vm.qs.stringify(userParams)).then(res =>{
              if(res.data.result == true){
                this.getUserData();
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
      showChangeTypeDialog:function(index,row){
        this.dialogFlag.isOpen = row.userLevel == '0' ? false : true;
        var vm =  this.dialogFlag;
        console.log('row.status ==='+row.status);
        this.user_Id = row.userId;
        this.status = row.status;
        return row.status == 1 ? vm.isOpenMsg = '您确定停用此用户吗？': row.status == 0 ? vm.isOpenMsg = '您确定启用此用户吗？' : '未知'
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
        console.log('切换停用/启用传参：=== % O',userParams);
        this.url = this.RmsUrl + 'setUserState.do';
        this.$http.post(this.url,this.qs.stringify(userParams)).then(res =>{
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
        return  row.status === 1 ? '启用' : row.status === 0 ? '停用' : '未知';
      },
      resetForm:function(formName) {
        this.$refs[formName].resetFields();
      },
    }
  }
</script>

<style scoped>
  .optionValue{
    margin:0 10px;
  }
  .research_btn{
    padding:9px 12px;
  }
  .span_label{
    font-weight:bold;
    fontsize:14px;
    margin-right:10px;
  }
  .supplier_btn{
    padding:10px 0;
    border-bottom:solid 1px #e4e4e4;
  }
  .supplier_delete{
    padding:10px 0;
  }
  .addRelationship{
    margin-left:70px;
  }
  .resetPass{
    border:none;
    margin-left:20px;
    color: #297dfa;
    cursor:pointer;
  }
  /*控制弹出框的宽度*/
  .el-dialog--small{
    width:35% !important
  }
</style>
