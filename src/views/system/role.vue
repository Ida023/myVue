<template>
  <div id="outermost_wrap" class="role" style="">
    <div id="sub_wrap" class="top-nav">
      <CrumbsNav></CrumbsNav>
    </div>
    <div id="content_wrap" class="tab-content ">
      <el-row id="filer" class="marginBottom">
        <el-row class="filterOption" id="filterOption" >
          <el-col :span="6" class="optionValue">
            <el-input v-model="pagefilters.roleName" placeholder="请输入角色名称" size="small"></el-input>
          </el-col>
          <el-col :span="1">
            <el-button type="primary" class="research_btn" id="research_btn" size="small" @click="requestem();">搜索</el-button>
          </el-col>
        </el-row>
        <el-collapse v-model="activeNames">
          <el-collapse-item name="1">
            <el-col class="marginBottom">
              <el-row>
                <span class="span_label">付款状态 &nbsp; </span>
                <el-radio-group v-model="pagefilters.isUse" size="small" @change="pagefilters.roleName='';requestem();">
                  <el-radio-button label=''   v-if="ButtonInfo['全部']!='0'">全部</el-radio-button>
                  <el-radio-button label='1'   v-if="ButtonInfo['启用中']!='0'">启用中</el-radio-button>
                  <el-radio-button label='0'   v-if="ButtonInfo['已停用']!='0'">已停用</el-radio-button>
                </el-radio-group>
              </el-row>
            </el-col>
          </el-collapse-item>
        </el-collapse>
      </el-row>
      <el-col class="marginBottom">
        <el-button size="small"   v-if="ButtonInfo['添加']!='0'" type="primary"  @click="dialogFlag.dialogTitle='新增角色';dialogFlag.disabled=false;handleAdd('');"><i class="el-icon-plus"></i>&nbsp;&nbsp;添加</el-button>
        <el-button size="small"  v-if="pagefilters.isUse=='1' && ButtonInfo['批量停用']!='0'"  type="primary" icon="delete"  @click="roledeleteAll('');"  >批量停用</el-button>
      </el-col>
      <el-table  id="item_list" ref="multipleTable"  :data="listData"   border tooltip-effect="dark"   :span="24" style="text-align: center"  @selection-change="selsChange">
        <el-table-column type="selection" width="55" align="center" :disabled= true  ></el-table-column>
        <el-table-column prop="operation" width="120" label="操作" show-overflow-tooltip align="center" >
          <template scope="scope" class="operation" style="" >
            <el-tooltip content="查看"  effect="dark" placement="bottom"  v-if="ButtonInfo['查看']!='0'">
              <i  class="iconfontyyy"  @click="dialogFlag.disabled=true;dialogFlag.dialogTitle='查看角色';handleAdd(scope.row);" content="Bottom center">&#xe600;</i>
            </el-tooltip>
            <el-tooltip content="编辑"  effect="dark" placement="bottom"   v-if="ButtonInfo['编辑']!='0'">
              <i  class="iconfontyyy"  @click="dialogFlag.disabled=false;dialogFlag.dialogTitle='编辑角色';handleAdd(scope.row);" >&#xe6e5;</i>
            </el-tooltip>
            <el-tooltip :content="scope.row.isUse=='停用'?'已删除！':'删除'" effect="dark" placement="bottom"   v-if="ButtonInfo[scope.row.isUse=='停用'?'已删除！':'删除']!='0'">
              <i  class="iconfontyyy"  @click="roledelete(scope.$index, scope.row); "  v-if="scope.row.isUse=='启用'">&#xe6f7;</i>
              <i  class="iconfontyyy stop"  v-if="scope.row.isUse=='停用'" >&#xe634;</i>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column sortable width="200" label="角色名称"   prop="roleName" align="center" ></el-table-column>
        <el-table-column sortable label="角色描述"  prop="roleDesc" header-align="center" align="left" ></el-table-column>
        <el-table-column sortable label="成员数量" width="100"  prop="roleCoun" align="center" ></el-table-column>
        <el-table-column sortable label="状态" width="100"  prop="isUse" align="center" ></el-table-column>
      </el-table>
    </div>
    <div id="page" class="block page">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="page.currentPage"
        :page-sizes="[10, 20, 30, 50,100]"
        :page-size="page.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="page.totalCount">
      </el-pagination>
    </div>
    <!-----------------------------------------分割线 以下弹窗--------------------------------------->
    <!--------------------查看/编辑/添加角色窗口---------------------------------------->
    <el-dialog :title="dialogFlag.dialogTitle"  v-model="addFormVisible"   @close="ResetFrom('From')" @open="openResetForm" :close-on-click-modal="false">
      <el-form ref="From" :model="From" label-width="80px" >
        <el-form-item label="角色名称" prop="roleInfo.roleName" :rules="[{ required: true, message: '请输入角色名称', trigger: 'blur' },
            { min: 1, max: 50, message: '长度不能超过 50 个字符', trigger: 'blur' }]">
          <el-input v-model="From.roleInfo.roleName"  :disabled="dialogFlag.disabled"></el-input>
          <input type="text" style="display:none"/>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleInfo.roleDesc"  :rules="[{ required: true, message: '请输入角色描述', trigger: 'blur' },
            { min: 1, max: 500, message: '长度不能超过 500 个字符', trigger: 'blur' }]">
          <el-input type="textarea" v-model="From.roleInfo.roleDesc" :disabled="dialogFlag.disabled"></el-input>
        </el-form-item>
        <el-form-item label="权限分配" >
          <el-tree class="roleTree"  ref="tree" :disabled="dialogFlag.disabled"
                   :data="From.menuInfoList"
                   show-checkbox
                   node-key="menuId"
                   :current-node-key="CheckedNodes"
                   :default-checked-keys="checkedList"
                   :props="defaultProps"
                   @check-change="checkChange"
          >
          </el-tree>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="addFormVisible = false">关闭</el-button>
        <el-button type="primary" @click.native="submitForm('From')" :loading="$store.state.loading" v-if="dialogFlag.disabled==false">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  export default{
    components: {
     },
    data(){
      return {
        CheckedNodes:[],
        checkedList:[],
        dialogTitle:'',
        nodeKey:[],
        editcheckedId:[],
        checkedId:[],//changeId
        defaultProps: {
          children: 'menuList',
          label: 'menuName'
        },
        From:{
          menuInfoList:[],
          roleInfo: {
          roleDesc: '',
          roleId: '',
          roleName: ''
        }
        },
        theModel:[],
        grounpData:[],
        checkAll: true,
        isIndeterminate: true,
        activeNames:['1'],
        msg: '',
        checked: false,
        disabled: false,//输入框禁用
        collapsed: false,
        display:true,
        addFormVisible: false,//新增界面是否显示
        currentPage: [],
        listLoading: false,
        sels: [],//列表选中类
        selss:[],
        // checkedCities: [],//已勾选数组
        //单删角色ID
        deleteRole:{
          roleId:""
        },
        //复选框
        munuList:[],
        openRole:{
          roleId:''
        },
        //得到的数据集合
        page:{
          currentPage:1, //当前页数
          pageSize:10, //每页条数
          totalCount:0, //总共条数
          totalPage:0, //总共页数
          listData:[]
        },
        //分页过滤
        pagefilters:{
          roleName:'',
          currentPage:'1',
          pageSize:'10',
          isUse:''
        },
        //用户列表
        listData: [],
        //状态
        roleStatus:{
          open:'启用',
          close:'停用'
        },
        btnType:'',
        roleId:'',
        url:'',
        //弹出框宽度
        formLabelWidth: '120px',
        dialogFlag:{
          isOpen:false,
          infoDetail:false,
          dialogTitle:"",
          isOpenMsg:'',
          disabled:false,
        },
        deleteAll:true,
        content:'删除',
        ButtonInfo:{},//按钮权限列表20171227
      }

    },
    mounted: function () {
      this.getauthorityList();
      this.requestem();
    },

    methods: {

      /*********************页面按钮权限 20171227*****************************/
      getauthorityList(){
        var vm=this;
        vm.ButtonInfo=vm.tool.getBtnPermissions(vm.currentPath);
        console.log('horityList % 0',vm.ButtonInfo)

      },
      /*********************页面按钮权限 20171227*****************************/
      //查看/编辑/新增角色
      handleAdd: function (row) {
        this.roleId='';
        var vm=this;
        row!=''?this.roleId=row.roleId:'';
        this.addFormVisible = true;
        this.get(this.roleId);
        //console.log('this.checkedList % 0==',this.checkedList)
      },
      get(roleId){
        this.httpPost('toQueryRole?roleId='+roleId).then(res=>{
        	var vm=this;
          this.From.menuInfoList=res.data.menuGrouList;
          this.From.menuInfoList.forEach(item=>{
            this.$set(item,'menuName',item.groupName)
            this.$set(item,'menuId',item.id)
          })
          this.From.roleInfo.roleDesc=res.data.roleDesc;
          this.From.roleInfo.roleName=res.data.roleName;
          var form=[];
          this.From.menuInfoList.forEach(item=>{
          	item.menuList.map(item=>form.push(item))
          })
          var digui = function(val){
            val.forEach((item,index,data)=>{
              vm.$set(item,'disabled',true)
              digui(item.menuList);
            })
          }
          if(vm.dialogFlag.dialogTitle=='查看角色'){
            digui(vm.From.menuInfoList);
          }
          if(roleId!=''){this.editrecursiondata(form);}
          //console.log('this.From.menuInfoList % 00==',this.From.menuInfoList)
        })

      },
      openResetForm(){
        this.From.menuInfoList=[];
        this.From.roleInfo.roleDesc='';
        this.From.roleInfo.roleName='';

      },
      ResetFrom(formName){
        this.$refs[formName].resetFields();
        this.checkedList=[];
      },
      //新增递归
      recursiondata(Treedata){
        var vm=this;
        var data = [];
        var flag = true;
        Treedata.forEach((item)=>{
           item.menuList.map(function(itemm){ // 页面
           	data.push(itemm);
           });
        })
        var digui2 = function(parent,subList){
          subList.forEach((item,index,data)=>{
            item.haveRight=0;
            if(item.menuList.length>0 && item.menuList){
              digui2(item,item.menuList);
            }else{
              if(vm.checkedId.indexOf(item.menuId)!==-1){
              	//console.log('item.menuId111 %0',item['keyPath'])
                item.haveRight=1;
                if(parent!=null){
                  parent.haveRight=1;
                }
              }else if(item.haveRight==1){
               // console.log('item.menuId222 %0',item['keyPath'])
               // console.log('item.haveRight222 %0',item.haveRight)
                if(parent!=null){
                  parent.haveRight=1;
                }
              }
            }
          })
        }
        var diguiClear = function(parent,subList){
          subList.forEach((item,index,data)=>{
            if(item.menuList.length>0 && item.menuList){
              diguiClear(item,item.menuList);
              item.haveRight=0;
            }else{
                item.haveRight=0;
            }
          })
        }
        digui2(null,Treedata);

      },
      //编辑递归
      editrecursiondata(Treedata){
      	var vm=this;
      //console.log('Treedata %0',Treedata)
        var digui = function(val){
          val.forEach((item,index,data)=>{
            if(item.menuList.length>0 && item.menuList){
              digui(item.menuList);
            }else{
              if(item.haveRight==1){
                vm.checkedList.push(item.menuId);
                //console.log('id %0==',vm.checkedList);
              }else{

              }
            }
          })
        }
        digui(Treedata);
      },
      //新增表单提交
      submitForm(From){
        this.getCheckedKeys();
        this.recursiondata(this.From.menuInfoList);
        //console.log('this.From.menuInfoList %0',this.From.menuInfoList)
        this.From.menuInfoList.forEach((item,index,data)=>{
          delete item.menuName;
          delete item.menuId;
        });
        this.$refs[From].validate((valid) => {
          if (valid) {
            var obj={}; obj.menuInfoList=[];obj.roleInfo={};
            obj.roleInfo.roleDesc=this.From.roleInfo.roleDesc;
            obj.roleInfo.roleId=this.roleId;
            obj.roleInfo.roleName=this.From.roleInfo.roleName;
            obj.menuInfoList=this.From.menuInfoList;
           // console.log('45555 % 0',obj)
            this.httpPost('saveOrUpdateRoleMuenCommand',obj).then((res) =>{
              if(res.data.result==true){
                this.requestem();
                this.open2();
              }
              else{
                this.$message(res.data.message)
              }
            })
          }
          else{
            this.$message('请输入合法的数据！')
          }

        })
      },
      open2() {
        this.$confirm('权限已修改成功需重新登录后生效, 是否立即重新登录?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$router.push({
            path:'/login'
          })
        }).catch(() => {
            this.addFormVisible = false;
        });
      },
      checkChange(val,data,list){

      },
      getCheckedNodes(){
      	var vm=this;
      	var nodes=this.$refs.tree.getCheckedNodes();

      	nodes.forEach(item=>{
      		//console.log(item.menuName)
          if(vm.checkedId.indexOf(item.menuId)==-1){

            vm.checkedId.push(item.menuId);
          }
        })


      },
      getCheckedKeys() {
         this.checkedId=this.$refs.tree.getCheckedKeys();
         this.getCheckedNodes();
      },

      handleCheckAllChange(item) {
        //this.senduserList(item,'0');
      },
      handlecheckedperNameChange(item) {
        // this.senduserList(item,'1');
      },
      //获取角色列表
      requestem(){
        this.httpPost('toRoleManages',this.qs.stringify(this.pagefilters)).then(res => {
          this.listData=res.data.listData;
          this.page = res.data;
          for(var i=0; i< this.listData.length; i++){
            if(this.listData[i].isUse == true){
              this.listData[i].isUse = this. roleStatus.open;
            }
            else if(this.listData[i].isUse == false) {
              this.listData[i].isUse = this.roleStatus.close;
            }

          }

        })
      },


      //导航切换
      collapse: function () {
        this.collapsed = !this.collapsed;
      },
      //分页
      handleSizeChange(val) {
        this.pagefilters.pageSize=val;
        this.requestem();
      },
      handleCurrentChange(val) {
        this.pagefilters.currentPage=val;
        this.requestem();
      },
      //获取复选框是否勾选
      handleCheckedCitiesChange(value) {
        this.checkedCities=value;
        //console.log('获取复选框是否勾选 % 0',value)
      },
      selsChange: function (sels) {
        this.sels = sels;
        for(var i=0;i<this.sels.length;i++){
          if(this.sels[i].isUse=='启用'){
            this.selss.push(this.sels[i])
          }
        }
        this.sels=this.selss;
        //console.log(this.sels)
      },
      //删除角色
      roledelete(index, row) {
      	var vm=this;
        this.roleId =row.roleId;
        vm.doGetItem('确定删除选项中的角色？','deleteRole?roleIds='+ this.roleId, this.requestem);
      },

      changeTypeStatus:function(row){
        this.dialogFlag.isOpen = false;
        this.httpPost('deleteRole?roleId='+this.roleId).then((res) =>{
          if (res.data.result === true) {
            this.requestem();
            scope.row.isUse = '停用'
          }else{
            this.$message(res.data.message);
          }
        }).catch(() => {
        });
      },
      //批量删除
      roledeleteAll() {
      	var vm=this;
        this.roleId = this.sels.map(item => item.roleId);
        if(this.roleId.length<=0){
          vm.tips();
        }else{
            vm.doGetItem('确定删除选项中的角色？','deleteRole?roleIds='+ this.roleId, this.requestem);
        }
        this.selss=[];
      },
    }

  }
</script>

<style scoped>
  .activity-text div.el-form-item__content{
    float: left!important;
  }
  .grid-content span{
    font-size: 14px;
    padding-right: 5px;
  }
  /* .title-center .el-table th>.cell{
     text-align: center!important;
   }*/
  .operation  i{
    cursor:pointer!important;
    padding:0 10px;
  }
  i.stop{
    cursor:default;
  }

</style>
