<template>
  <div id="outermost_wrap" class="user_manager_wrap tree_data">
    <div id="sub_wrap" class="sub_wrap">
      <CrumbsNav></CrumbsNav>
    </div>
    <div id="content_wrap" class="content_wrap">
      <div class="tree_data">
        <div class="tree_title">
          <span>分类管理<span>{{'('+categoryCount+')'}}</span></span>
          <span>
             <el-tooltip class="item" effect="dark" content="导入" placement="top-start"  v-if="ButtonInfo['导入']!='0'">
               <i class="iconfontyyy" @click="importData.isOpen = !importData.isOpen">&#xe63a;</i>
             </el-tooltip>
            <el-tooltip class="item" effect="dark" content="添加" placement="top-start"   v-if="ButtonInfo['添加']!='0'">
               <i class="iconfontyyy" @click="dialogFlag.dialogTitle='添加一级分类';dialogFlag.isOpen=true;">&#xe623;</i>
             </el-tooltip>
          </span>
        </div>
        <el-tree :data="categoryList" accordion :default-expanded-keys="defaultExpandedKey" @node-expand="saveCurrentExpandedKey" :highlight-current="true" :props="defaultProps" node-key="categoryId" :expand-on-click-node="true" @node-click="getResponseData" :render-content="renderContent">
        </el-tree>
      </div>
      <div class="content_data">
        <div class="table_data">
          <div style="padding:10px 5px;">
            <el-row class="filterOption" id="filterOption" >
              <el-col :span="6" class="optionValue">
                <el-input v-model="pageFilter.cnName" placeholder="请输入商品名称" size="small"></el-input>
              </el-col>
              <el-col :span="1">
                <el-button type="primary" class="research_btn" id="research_btn" size="small" @click="getResponseData('');">搜索</el-button>
              </el-col>
            </el-row>
          </div>
          <div id="item_list">
            <el-table border  tooltip-effect="dark" :data="categoryListData" label-width="" style="width:100%">
              <el-table-column label="SKU"    prop="skuNo" align="center"  sortable  ></el-table-column>
              <el-table-column label="图片" prop="imageUrl" align="center" sortable >
                <template scope="scope">
                  <img  v-if="scope.row.imageUrl!=null" :src="scope.row.imageUrl" :data-src="scope.row.imageUrl">
                </template>
              </el-table-column>
              <el-table-column label="名称"  prop="cnName" align="center"  sortable ></el-table-column>
              <el-table-column label="EAN" prop="eanCode"  sortable align="center"></el-table-column>
              <el-table-column label="分类"  sortable align="center">
                <template scope="scope" >
                  <span style="text-align: center" v-if="scope.row.oneCategoryName != null">{{scope.row.oneCategoryName}}</span><br/>
                  <span style="text-align: center" v-if="scope.row.twoCategoryName != null">{{scope.row.twoCategoryName}}</span>
                </template>
              </el-table-column>
              <el-table-column label="产品开发"  align="center"  prop="developUser" sortable ></el-table-column>
              <el-table-column label="采购跟单"  align="center"  prop="purchaseUser" sortable ></el-table-column>
              <el-table-column label="状态" align="center"  prop="salesStatus"  sortable ></el-table-column>
              <el-table-column label="仓库与销售" align="center"   sortable >
                <template scope="scope">
                  <span class="link-type" >{{scope.row.warehouseName}}</span><br/>
                    <el-tooltip  content="分配仓库与销售"  effect="dark" placement="bottom">
                      <i @click="showHouseDetail(scope.row);" class="el-icon-more"></i>
                    </el-tooltip>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
         <div id="page" class="page">
           <el-pagination @size-change="changePageSize" @current-change="changeCurrentPage" :current-page="page.currentPage" :page-sizes="[10,20,30,40]" :page-size="page.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="page.totalCount"></el-pagination>
         </div>
       </div>
    </div>
    <!-----------------------添加一级，二级分类----------------------------------->
    <el-dialog :title="dialogFlag.dialogTitle" :visible.sync="dialogFlag.isOpen" size="tiny" @close="resetForm('infoForm');">
      <el-form ref="infoForm" :model="infoForm" :rules="rules" label-width="80px">
        <el-form-item label="分类名称" prop="categoryName" required>
          <el-input v-model="infoForm.categoryName"></el-input>
        </el-form-item>
        <el-form-item label="编码" prop="prefixCode" required>
          <el-input v-model="infoForm.prefixCode"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFlag.isOpen = false">取 消</el-button>
        <el-button type="primary" @click="addCategory('infoForm');" :loading="$store.state.loading">确 定</el-button>
      </div>
    </el-dialog>
    <!--SKU分配仓库及销售弹窗-->
    <el-dialog title="SKU分配仓库及销售" :visible.sync="dialogFlag.infoDetail" size="tiny" @close="dialogFlag.storehouse=true">
      <div v-for="(itemw,index) in queryWarehouseType" :key="index" style="margin-top:30px;"  v-if="dialogFlag.storehouse == true">
        <div>{{itemw.refValue}}</div>
        <div style="margin: 15px 0;"></div>
        <el-checkbox-group v-model="warehouseCheckedList" class="checkBody">
          <el-checkbox v-for="item in itemw.whList" :label="item.whId" :key="item.whId" :value="item.whId" disabled>{{item.whName}}</el-checkbox>
        </el-checkbox-group>
      </div>
      <div v-for="(itemd,index) in queryDeptAndUser" :key="index" style="margin-top:30px;" v-if="dialogFlag.storehouse == false">
        <el-checkbox v-model="checkAll[index]" disabled>{{itemd.deptName}}</el-checkbox>
        <div style="margin: 10px 0;"></div>
        <el-checkbox-group v-model="deptCheckedList" class="checkBody">
          <el-checkbox v-for="item in itemd.salesUserList" :label="item.userId" :key="item.userId" :value="item.userId" disabled>{{item.userName}}</el-checkbox>
        </el-checkbox-group>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFlag.infoDetail = false">关 闭</el-button>
        <el-button type="primary" @click="dialogFlag.storehouse = true" v-if="dialogFlag.storehouse == false " >分配销售情况</el-button>
        <el-button type="primary" @click="dialogFlag.storehouse = false" v-if="dialogFlag.storehouse == true">分配仓库情况</el-button>
      </div>
    </el-dialog>
    <!------------------导入手工订单 弹出框--------------------------->
    <import-dialog  :is-open="importData.isOpen" :import-url="importData.importUrl" :modal-url="importData.modalUrl" @getData="getCategoryList"></import-dialog>
  </div>
</template>
<script>
  export default{
    data(){
      String.prototype.trim=function() {
        return this.replace(/(^\s*)|(\s*$)/g,'');
      };
      const regCode = (rule, value, callback) => {
        if (value.trim() == '') {
             callback(new Error('请输入编码'));
        } else if(!/^[A-Z]{1}$/.test(value.trim())){
              callback(new Error('只能输入大写字母且长度只能为1'))
          }else{
              callback();
          }
      };
      const regName = (rule, value, callback) => {
        if (value.trim() == '') {
             callback(new Error('请输入名称'));
        } /*else if(!/^[\u4E00-\u9FA5A-Za-z0-9]{2,500}$/.test(value.trim())){
              callback(new Error('长度不超过500且不能输入特殊字符及空格'))
          }*/else{
              callback();
          }
      };
      return{
      	editFlag:'0',
        addFlag:'0',
        uploadExcModal:this.RmsUrl+'downCategoryModel?Authorization='+sessionStorage.getItem('userSession'),   //  导入模板地址
        excFile:[],
        excList:'',  //  已选择导入的文件
        checkAll:[],
        warehouseCheckedList:[],
        deptCheckedList:[],
        queryWarehouseType:[],
        queryDeptAndUser:[],
        categoryCount:'',
        defaultExpandedKey:[],
        defaultKeys:[],
        categoryList:[],
        categoryListData:[],
        defaultProps: {
          children: 'subCategoryList',
          label: 'categoryName'
        },
        infoForm:{
          categoryName:'',
          prefixCode:''
        },
        pageFilter:{
          currentPage:1,
          pageSize:10,
          categoryId:'',
          cnName:''
        },
        dialogFlag:{
          isOpen:false,
          infoDetail:false,
          isOpenErr:false,
          isOpenLead:false,
          dialogTitle:"",
          storehouse:true,
          inputDisabled:false,   //checkbox是否处理可点击状态
        },
        importData:{
      	  isOpen:false,
          importUrl:'importCategory',
          modalUrl:'downCategoryModel',
        },
        page:{
          currentPage:1,
          pageSize:10,
          totalCount:10,
          totalPage:10
        },
        paramsData:{
          parentId:'',
          categoryName:'',
          prefixCode:'',
        },
        category_id:'',
        formLabelWidth: '80px',
        rules: {
          prefixCode:[
            {validator: regCode, trigger: 'blur'}
          ],
          categoryName:[
            {validator: regName, trigger: 'blur'}
          ]
        },
        ButtonInfo:{}
      }
    },
    mounted () {
      this.getauthorityList();
      this.getResponseData('');
      this.getCategoryList();

    },
    methods: {
      /*********************页面按钮权限 20171227*****************************/
      getauthorityList(){
        var vm=this;
        vm.ButtonInfo=vm.tool.getBtnPermissions(vm.currentPath);
        console.log('horityList % 0',vm.ButtonInfo)

      },
      /*********************页面按钮权限 20171227*****************************/


      getCategoryList: function () {
        this.httpPost('selectAllCategoryList').then(res => {
          if (res.data.result == true) {
            this.categoryList = res.data.params.mapList;
            this.categoryCount = res.data.params.mapList.length;
          }
        })
      },
      getResponseData:function(data) {
        data != '' ? this.pageFilter.categoryId = data.categoryId : this.pageFilter.categoryId = '';
        this.httpPost('product/listProduct', this.pageFilter).then(res => {
            const pageData = res.data;
            this.page = pageData;
            this.categoryListData = pageData.listData;
          }).catch(function (err) {
            console.log(err);
          });
      },
      addCategory:function(formName) {
        this.dialogFlag.dialogTitle == '添加一级分类'? this.paramsData.parentId = '':this.paramsData.parentId = this.category_id;
        this.paramsData.categoryName = this.infoForm.categoryName;
        this.paramsData.prefixCode = this.infoForm.prefixCode;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            var url='',data='';
            this.dialogFlag.dialogTitle == '编辑分类'?url='updateCategoryData' : url='saveCategoryData';
            this.dialogFlag.dialogTitle == '编辑分类'?data={categoryId:this.category_id,categoryName:this.infoForm.categoryName,prefixCode:this.infoForm.prefixCode}:data=this.paramsData;
            this.httpPost(url,data).then(res => {
              if(res.data.result == true){
                  this.dialogFlag.isOpen = false;
                  this.getCategoryList();
                  this.defaultExpandedKey = this.defaultKeys;
              }else{
                  this.$message(res.data.message);
              }
            })
          }
        })
      },
      showHouseDetail:function(row){
        var vm = this;
        const getQuerySales=vm.httpPost('product/querySales?productId='+row.productId);
        const getProductQuerySignWarehouse=vm.httpPost('product/querySignWarehouse?productId='+row.productId);
        const getQueryDeptAndUser = vm.httpPost('product/queryDeptAndUser');
        const getQueryWarehouseType = vm.httpPost('product/queryWarehouseType');
        this.$http.all([getQuerySales,getProductQuerySignWarehouse,getQueryDeptAndUser,getQueryWarehouseType]).then(this.$http.spread(function(querySales,querySignWarehouse,queryDeptAndUser,queryWarehouseType){
          vm.deptCheckedList = querySales.data.map(item =>item.salesUserId);
          vm.warehouseCheckedList = querySignWarehouse.data.map(item =>item.warehouseId);
          vm.queryDeptAndUser = queryDeptAndUser.data;
          vm.queryWarehouseType = queryWarehouseType.data;
          for(var i=0;i<vm.queryDeptAndUser.length;i++){
            vm.checkAll.push(false);
            var arrItem = vm.queryDeptAndUser[i].salesUserList.map(item  =>item.userId);
            var a = arrItem.every(function(item){
              return vm.deptCheckedList.indexOf(item) != -1;
            });
            vm.checkAll.splice(i,1,a);
          }
          vm.dialogFlag.infoDetail = true;
        }))
      },
      changePageSize: function (val) {
        this.pageFilter.pageSize = val;
        this.pageFilter.currentPage = 1;
        this.getResponseData('');
      },
      changeCurrentPage: function (val) {
        this.pageFilter.currentPage = val;
        this.getResponseData('');
      },
      renderContent(createElement, {node, data, store}){
        var vm = this;
        let editItem='';
        let addItem='';
        if(vm.ButtonInfo['修改']!='0'){
          editItem='';
        }else{
          editItem='editItem'
        }
        if(vm.ButtonInfo['添加']!='0'){
          addItem='';
        }else{
          addItem='addItem';
        }
        var ElementObj=  createElement('span', [
          createElement('span',{attrs:{style:"padding-right: 72px;"}}, node.label),
          createElement('span', {
            attrs: {
              style: "position:absolute;right:-5px; margin-right: 5px", class: 'btnGroup'
            }
          }, [
            createElement('el-tooltip', {
              attrs: {
                class: "item", effect: "dark", id: editItem, content: "编辑", placement: "top-start" ,
              }
            }, [
              createElement('el-button', {
                attrs: {
                  size: "mini", icon: "edit",
                }, on: {
                  click: function () {
                    vm.category_id = data.categoryId;
                    vm.dialogFlag.dialogTitle = '编辑分类';
                    vm.httpPost('queryCategoryData',{categoryId:data.categoryId}).then(res =>{
                      if(res.data.result == true){
                        vm.infoForm.categoryName = res.data.params.categoryData.categoryName;
                        vm.infoForm.prefixCode = res.data.params.categoryData.prefixCode;
                        vm.dialogFlag.isOpen = true;
                      }
                    });
                  }
                }
              }, '')]),
            createElement('el-tooltip', {
              attrs: {
                class: "item", effect: "dark", id: addItem, content: "添加", placement: "top-start",
              }
            }, [
              createElement('el-button', {
                attrs: {
                  size: "mini", icon: "plus",
                }, on: {
                  click: function () {
                    vm.category_id = data.categoryId;
                    vm.dialogFlag.dialogTitle = '添加子级分类';
                    vm.infoForm.categoryName ='';
                    vm.infoForm.prefixCode ='';
                    vm.dialogFlag.isOpen = true;
                  }
                }
              }, '')]),
          ]),
        ]);
        return ElementObj;
      },
      saveCurrentExpandedKey:function(data){
        this.defaultKeys=[];
        this.defaultKeys.push(data.categoryId)
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
  i.iconfontyyy{
    font-size:18px;
  }
  .tree_data .tree_title{
    border-bottom:1px solid #d1dbe5;
    display: flex;
    justify-content: space-between;
    padding: 10px 5px;
  }
  .checkBody{
    margin-left:20px;
  }
</style>
