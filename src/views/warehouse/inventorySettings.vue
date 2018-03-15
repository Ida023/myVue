<template>
  <div id="outermost_wrap">
    <div id="sub_wrap">
      <CrumbsNav></CrumbsNav>
    </div>
    <div id="content_wrap" class="content_wrap">
      <el-row  id="filer" class="marginBottom">
        <el-collapse v-model="activeNames">
          <el-collapse-item name="1">
            <el-col  class="marginBottom">
              <span class="span_label">仓库类型</span>
              <el-radio-group v-model="whRefId" size="small"   @change="pagefilters.keyPath='';getHouseName();">
                <el-radio-button label="01" v-if="ButtonInfo['本地仓']!='0'">本地仓</el-radio-button>
                <el-radio-button label="02" v-if="ButtonInfo['海外仓']!='0'">海外仓</el-radio-button>
                <el-radio-button label="03" v-if="ButtonInfo['第三方仓']!='0'">第三方仓</el-radio-button>
              </el-radio-group>
            </el-col>
            <el-col  class="marginBottom">
              <span class="span_label">仓库名称</span>
              <el-radio-group v-model="pagefilters.whId" size="small"  @change="pagefilters.keyPath='';getList();getCategoryList();" >
                <el-radio-button v-for="item in whs" :key="item.whId" :label="item.whId" :value="item.whId" >{{item.whName}}</el-radio-button>
              </el-radio-group>
            </el-col>
          </el-collapse-item>
        </el-collapse>
      </el-row>
      <el-row  class="main_content content_wrap"  >
        <el-col class="left-content"  >
            <div style="text-align: center;padding: 9px 0;border: 1px solid #e4e4e4;border-bottom: 0;">商品分类</div>
          <el-col class="tree-warp">
            <p class="classificationAll" @click="pagefilters.keyPath='';getList();" >全部分类</p>
            <p class="classificationAll" @click="pagefilters.keyPath='';getList();" >未分类</p>
            <el-col class="cate_tree">
              <el-tree class="classborder" :data="CategoryList" accordion :default-expanded-keys="defaultExpandedKey" :highlight-current="true" :props="defaultProps" node-key="categoryId" :expand-on-click-node="true" @node-click="getStockData" >
              </el-tree>
            </el-col>
          </el-col>
        </el-col>
        <el-col class="right-content">
          <el-row class="marginBottom" type="flex" justify="start" >
              <el-input v-model="selectParams.inputValue" placeholder="请输入SKU,SPU,商品名称,多个请用,隔开" size="small" style="width:300px;margin-right:5px;"></el-input>
              <el-select size="small" v-model="selectParams.optionTitle" filterable  style="width:120px;margin-right:10px;">
                <el-option v-for="item in selectOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
              <el-button type="primary"   size="small" @click="pagefilters.keyPath='';selectFilter(selectParams.optionTitle)">搜索</el-button>
              <el-button type="primary"  size="small" @click="clearFilter();">清除</el-button>
          </el-row>
          <el-row class="marginBottom">
            <el-col :span="20"  v-if="ButtonInfo['批量导入期初库存']!='0'">
              <el-button  style="float: left;" type="primary" size="small" icon="" @click="importData.isOpen = !importData.isOpen;">批量导入期初库存</el-button>
            </el-col>
            <el-col :span="2"  class="save-but">
              <el-button type="primary" size="small" @click="sbumitTable();" :loading="$store.state.loading" >保 存</el-button>
            </el-col>
          </el-row>
          <el-row class="marginBottom"  v-if="ButtonInfo['批量修改']!='0'">
            <el-button type="primary" size="small" @click="batchEdit();">批量修改</el-button>
          </el-row>
          <div class="right-table"  >
            <el-table :data="inventoryList" style="border-right:1px solid #dfe6ec ;border-bottom:1px solid #dfe6ec" tooltip-effect="dark"  border  @selection-change="batchChange"  >
              <el-table-column type="selection" width="55" align="center"></el-table-column>
              <el-table-column label="图片"  prop="imageUrl" align="center" sortable>
                <template scope="scope">
                  <img  v-if="scope.row.imageUrl!=null" style="width: 70px; height: 70px" :src="scope.row.imageUrl" :data-src="scope.row.imageUrl">
                </template>
              </el-table-column>
              <el-table-column label="SKU"  align="center" prop="skuNo" sortable>
              </el-table-column>
              <el-table-column  label="名称"  prop="cnName"  show-overflow-tooltip align="center" sortable >
              </el-table-column>
              <el-table-column  label="期初库存"  prop="initQty"  show-overflow-tooltip align="center" sortable >
                <template scope="scope">
                  <el-input type="number" v-model="scope.row.initQty"></el-input>
                </template>
              </el-table-column>
              <el-table-column  label="货位"  prop="locationNo"  show-overflow-tooltip align="center" sortable>
                <template scope="scope">
                  <el-input type="text" v-model="scope.row.locationNo"></el-input>
                </template>
              </el-table-column>
              <el-table-column  label="仓库专用货号"  prop="locationNoAlias"  show-overflow-tooltip align="center" sortable>
                <template scope="scope">
                  <el-input type="text"  v-model="scope.row.locationNoAlias"></el-input>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div id="page" class="page">
            <el-pagination @size-change="changePageSize" @current-change="changeCurrentPage"
                           :current-page="page.currentPage" :page-sizes="[10,20,30,40]" :page-size="page.pageSize"
                           layout="total, sizes, prev, pager, next, jumper" :total="page.totalCount"></el-pagination>
          </div>
        </el-col>
      </el-row>
    </div>
     <!-------------批量导入弹出框------------------------>
    <!------------------导入手工订单 弹出框--------------------------->
    <import-dialog  :is-open="importData.isOpen" :import-url="importData.importUrl" :modal-url="importData.modalUrl" @getData="getList();"></import-dialog>
    <!---------------批量修改库位号-------------------------->
    <el-dialog title="批量修改库位号" :visible.sync="dialogFlag.isOpenlocation" size="tiny" :close-on-click-modal="false" >
         <el-form :model="locationNodata"  label-width="120px"   ref="locationNodata">
           <el-form-item label="请输入库位号" prop="locationNo" :rules="[{ required: true, message: '请输入库位号!', trigger: 'blur' },
            { min: 1, max: 20, message: '长度不能超过 20 个字符', trigger: 'blur' }]">
             <el-input type="text" v-model="locationNodata.locationNo"></el-input>
           </el-form-item>
         </el-form>
         <span slot="footer" class="dialog-footer">
           <el-button type="primary"  @click="dialogFlag.isOpenlocation = false" >取 消</el-button>
          <el-button type="primary" @click="subMitlocation()" :loading="$store.state.loading">确 定</el-button>
        </span>
    </el-dialog>

    <!---------------批量导入导常弹出框-------------------------->
    <el-dialog title="上传失败提示" :visible.sync="dialogFlag.isOpen" size="tiny">
      <div id="item_list">
        <el-table :data="DataList" border tooltip-effect="dark" style="width: 100%">
          <el-table-column prop="cellName" label="坐标" align="center"></el-table-column>
          <el-table-column prop="errorDesc" label="错误信息" align="center"></el-table-column>
        </el-table>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFlag.isOpen = false;">关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import ElButton from "../../../node_modules/element-ui/packages/button/src/button";
  import ElForm from "../../../node_modules/element-ui/packages/form/src/form";
  import ElFormItem from "../../../node_modules/element-ui/packages/form/src/form-item";

  export default{
    components: {
      ElFormItem,
      ElForm,
      ElButton},
    data(){
      return {
        importData:{  // /新建手工订单 子组件传参
          importUrl:'initStock/import',
          modalUrl:'initStock/templateExport',
          isOpen:false,
        },
      	aa:{b:''},
        DataList:[],
        uploadExcModal:this.RmsUrl+'initStock/templateExport?Authorization='+sessionStorage.getItem('userSession'),   //  导入模板地址
        locationNodata:{
          locationNo:''
        },
        defaultExpandedKey:[],
      	batchList:[],
        InitStocks:[],
        wis:{
          whId:'',
          productId:'',
          initQty:'',
          locationNo:'',
        },
        uploadExc:this.RmsUrl+'initStock/import?Authorization='+this.sessuserid,   //  上传导入文件地址
        isOverFlow:'skip',
        CategoryList:[],
        whs:[],
        inventoryList:[],
      /*  //搜索下拉值
        selectOptions: [{
          value: '1',
          label: '按SKU'
        }, {
          value: '2',
          label: '按SPU'
        },
          {
            value: '3',
            label: '按商品名称'
          }],*/
        //搜索下拉值
        selectOptions: [{
          value: '1',
          label: '按SKU'
        },
          {
            value: '2',
            label: '按SPU'
          },
          {
            value: '3',
            label: '按商品名称'
          }],
        selectParams:{    //  下拉过滤
          inputValue:'',
          optionTitle:'3',
        },
        dialogFlag:{
          isOpenLead:false,
          isOpenlocation:false,
          isOpen:false,
        },
        defaultProps: {
          children: 'subCategoryList',
          label: 'categoryName'
        },
        activeNames: ['1'],    //  筛选 功能的折又又叠面板
        //分页得到的数据集合
        page: {
          currentPage: 1, //当前页数
          pageSize: 10, //每页条数
          totalCount: 0, //总共条数
          totalPage: 0, //总共页数
        },
        whRefId:'01',
        excName:'',
        excList:'',
        excFile:[],
        //过滤返回数据
        pagefilters: {
          whId:'1',
          skuNo:'',
          cnName:'',
          spuNo:'',
          keyPath:'',
          currentPage: 1,
          pageSize: 10,
        },
        ButtonInfo:{},//按钮权限列表20171227
      }
    },
    mounted: function () {
      this.getauthorityList();
      this.getHouseName();
      this.getList();
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
      clearFilter(){
        this.selectParams.inputValue='';this.pagefilters.skuNo='';this.pagefilters.cnName='';this.pagefilters.spuNo='';this.pagefilters.keyPath='';this.getList();
        },
      downDown:function(url){
        window.open(url);
      },
      sbumitTable(){
      	var wisList=[];
      	this.inventoryList.forEach(item=>{
          wisList.push({
            whId:item.whId,
            productId:item.productId,
            initQty:item.initQty,
            locationNo:item.locationNo,
            locationNoAlias:item.locationNoAlias
          })
        });
        console.log('wisList % 0=',wisList)
        if(wisList.length<=0){
        	this.$message('无数据可保存！')
        }else{
          this.httpPost('initStock/edit',wisList).then(res=>{
            this.$message(res.data.message);
          })
        }
      },
      batchEdit(){
        this.batchList.length <=0 ? this.tips() : this.dialogFlag.isOpenlocation = true;
      },
      subMitlocation(){
         var ilm={};
        ilm.initStocks = this.InitStocks;
        ilm.locationNo= this.locationNodata.locationNo;
        console.log(ilm);
        this.$refs['locationNodata'].validate((valid) => {
          if (valid) {
            this.httpPost('initStock/editLocationNo',ilm).then(res=>{
              this.$message(res.data.message)
              if(res.data.result == true){
                this.dialogFlag.isOpenlocation=false;
                this.pagefilters.keyPath = '';
                this.getList();
              }
            })
          }
        })
      },
      batchChange(data){
      	this.batchList=[];
      	this.InitStocks=[];
      	data.forEach(item=>{this.batchList.push({whId:item.whId,productId:item.productId,initQty:item.initQty,locationNo:item.locationNo,locationNoAlias:item.locationNoAlias})})
        data.forEach(item=>{this.InitStocks.push({whId:item.whId,productId:item.productId})});
        console.log('data % 0==',this.batchList)

      },
      selectFilter(val){
        this.pagefilters.skuNo = val == '1' ? this.selectParams.inputValue :'';
        this.pagefilters.cnName = val=='3' ? this.selectParams.inputValue :'';
        this.pagefilters.spuNo = val=='2' ? this.selectParams.inputValue :'';
        //this.pagefilters.whId='';
        this.getList();
      },
      getStockData(data){
      	console.log('data % 0==',data);
        this.pagefilters.keyPath= data.keyPath;
        this.getList();
      },
      //仓库名称
      getHouseName(){
        this.httpPost('warehouseSetting/loadWh?whRefId='+this.whRefId).then(res=>{
          console.log('res % 0==',res.data.whs);
          if(res.data.whs !='' && res.data.whs.length>0 && res.data.whs != null){
            this.whs=res.data.whs;
            this.pagefilters.whId=res.data.whs[0].whId;
          }else{
            this.whs=[];
            this.pagefilters.whId='';
          }
        })
      },
      //列表数据
    	getList(){
       this.httpPost('initStock/list',this.pagefilters).then(res=>{
       	if(res.data.listData.length>0){
          this.inventoryList=res.data.listData;
          this.page=res.data;
        }else{
          this.inventoryList=[];
        }
       })
      },
      //分类数据
      getCategoryList: function () {
        this.httpPost('selectAllCategoryList').then(res => {
          if (res.data.result == true) {
            this.CategoryList = res.data.params.mapList;
            //this.pagefilters.keyPath=res.data.params.mapList[0].keyPath;
          }
        })
      },

      handleNodeClick(){

      },
      //分页
      changePageSize: function (val) {
        this.pagefilters.pageSize = val;
        this.pagefilters.currentPage = 1;
        this.getList();
      },
      changeCurrentPage: function (val) {
        this.pagefilters.currentPage = val;
        this.getList();
      },

    }
  }

</script>

<style scoped>
  .save-but{
    float: right;
    text-align: right;
  }
  .operation_btn  .el-button{
    float: left;
  }
  span.remark{
    color: red;
    font-size:12px;
  }
  span.modelDown{
    position: absolute;
    bottom: 20px;
    color: #297dfa;
    cursor:pointer;
    left: 20px;
  }
  .right-table{
    flex: 1;
  }
  .main_content{
    display: flex;
    height: 100%;
    margin-bottom: 10px;
  }
  .importOptionVal{
    margin-top: 20px;
  }
  .left-content{
    //border: solid 1px #eef1f6;
    max-width: 300px;
    flex: 0 0 300px;
    height: 100%;
    //overflow: auto;
  }
  .classificationAll{
    font-size:14px;
    margin: 0;
    padding:5px 0 10px 10px;
    text-align: left;
    display: inline-block;
    width: 100%;
    cursor: pointer;
    box-sizing: border-box;
  }
  .classificationAll:hover{
    background: #eef1f6;
  }
  .left-content .tree-warp{
    border:solid 1px #e4e4e4;
    padding-top:5px;
    height: 97%;
    overflow: auto;

  }
  .left-content .tree-warp .el-tree{
    border: none;
  }
  .right-content{
    margin-left:10px;
    flex:1;
    display: flex;
    flex-direction:column;
    overflow: auto;
  }

</style>
