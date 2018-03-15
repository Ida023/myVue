<template>
  <div id="outermost_wrap">
    <div id="sub_wrap" class="top-nav">
      <CrumbsNav></CrumbsNav>
    </div>
    <div id="content_wrap">
      <el-row class="marginBottom"  :gutter="10">
        <el-col :span="3">
          <el-select size="small" v-model="selectParams.optionTitle" filterable  @change="selectParams.optionValue = ''">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-col>
        <el-col :span="6" class="optionValue">
          <el-input v-model="selectParams.optionValue" :placeholder="getPlaceholder" size="small"></el-input>
        </el-col>
        <el-col :span="1">
          <el-button type="primary" size="small" @click="pagefilters.status = '';radioAll='全部';selectFilter();">搜索</el-button>
        </el-col>
      </el-row>
      <el-row id="filer" class="marginBottom">
        <el-collapse v-model="activeNames">
          <el-collapse-item name="1">
          <span class="span_label">状态</span>
          <el-radio-group v-model="radioAll" size="small" @change="requestemStart($event);">
            <el-radio-button    label="全部"   v-if="ButtonInfo['全部']!='0'"></el-radio-button>
            <el-radio-button    label="未摄影"  v-if="ButtonInfo['未摄影']!='0'"></el-radio-button>
            <el-radio-button    label="已摄影"  v-if="ButtonInfo['已摄影']!='0'"></el-radio-button>
          </el-radio-group>
          </el-collapse-item>
        </el-collapse>
      </el-row>
      <el-row class="operation marginBottom">
        <el-button size="small"  type="primary" @click="signphoto('','1','确定批量标记该文件？');" v-if="pagefilters.status != '1' && ButtonInfo['批量标记']!='0'" >批量标记</el-button>
      </el-row>
      <el-table  id="item_list"  border v-model="listData" tooltip-effect="dark" :data="listData" @selection-change="handleSelectionChange" >
          <el-table-column type="selection" width="55" align="center"></el-table-column>
          <el-table-column  width="150" label="操作" show-overflow-tooltip align="center" >
            <template scope="scope" >
              <el-tooltip content="查看"  effect="dark" placement="bottom" v-if="ButtonInfo['查看']!='0'">
                <i  class="iconfontyyy"   @click="getCreateIssues(scope.row,dialogFlag.inputDisabled = true);"  content="Bottom center">&#xe600;</i>
              </el-tooltip>
              <el-tooltip :content="content"  effect="dark" placement="bottom"   v-if="ButtonInfo[content]!='0'">
                <i  class="iconfontyyy"    @click="signphoto(scope.row,'0','确定标记该文件?')" content="Bottom center">&#xe66f;</i>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column label="SKU"   prop="skuNo" align="center"  sortable  ></el-table-column>
         <el-table-column label="EAN码"  prop="eanCode" align="center"  sortable ></el-table-column>
        <el-table-column label="图片" prop="imageUrl" align="center" sortable  >
          <template scope="scope">
            <img  v-if="scope.row.imageUrl!=null" style="width: 70px; height: 70px" :src="scope.row.imageUrl" :data-src="scope.row.imageUrl">
          </template>
        </el-table-column>
        <el-table-column label="产品名称"  prop="cnName" align="center"  sortable ></el-table-column>
        <el-table-column label="分类" prop="classify"  sortable align="center"></el-table-column>
        <el-table-column label="开发人员"  prop="exploitUser"  sortable align="center"></el-table-column>
        <el-table-column label="跟单"  align="center"  prop="documentaryUser" sortable ></el-table-column>
       <el-table-column label="状态" align="center"  prop="status"  sortable ></el-table-column>
       </el-table>
    </div>
    <!--查看 编辑 新增弹窗-->
    <el-dialog title="查看" :visible.sync="dialogFlag.isOpen" :close-on-click-modal="false" @close="pagefilters.productId = ''">
      <el-tabs v-model="dialogFlag.activeTab"  @tab-click="tabclick">
        <el-tab-pane label="基本信息"   name="0">
          <msg-dialog :parentinfo-detail="dialogFlag.activeTab" :product-id="pagefilters.productId"
                      :input-disabled="dialogFlag.inputDisabled" :docment-null="dialogFlag.docmentNull" ></msg-dialog>
        </el-tab-pane>
        <el-tab-pane label="辅助信息"   name="1">
          <assist-dialog :group-product="dialogFlag.addDialog" :product-id="pagefilters.productId"    :assistparentinfo-detail="dialogFlag.activeTab"
                         :input-disabled="dialogFlag.inputDisabled"   :docment-null="dialogFlag.docmentNull" ></assist-dialog>
        </el-tab-pane>
      <el-tab-pane label="采购信息"   name="2">
          <purchase-dialog  :purchaseparentinfo-detail="dialogFlag.activeTab" :product-id="pagefilters.productId"
                            :input-disabled="dialogFlag.inputDisabled"  :docment-null="dialogFlag.docmentNull"></purchase-dialog>
        </el-tab-pane>
        <el-tab-pane label="详细描述"   name="3">
        <describe-dialog    :disState="dialogFlag.inputDisabled" :Selected="pagefilters" ></describe-dialog>
      </el-tab-pane>
         <el-tab-pane label="产品图片"   name="4" >
           <images-dialog   @assignment2="imageData2" :docment-null="dialogFlag.docmentNull" :disState="!dialogFlag.inputDisabled" :Selected="pagefilters" :isOpen="dialogFlag.isOpen"></images-dialog>
         </el-tab-pane>
         <el-tab-pane label="物流方式"   name="5" >
           <logistics-dialog ref="logisticsDialog" :logisticsparentinfo-detail="dialogFlag.activeTab"   @assignment="getLogisticsVlaue" :input-disabled="dialogFlag.inputDisabled" :product-id="pagefilters.productId"></logistics-dialog>
         </el-tab-pane>
         <el-tab-pane label="产品问题"   name="6" >
           <el-row>
             <el-col >
               <el-form :label-width="financeFormLabelWidth"  v-for="item in problem.problemparentForm" :key="item.askUser" >
                 <el-form-item label="问题" >
                   {{item.askTitle}}
                 </el-form-item>
                 <el-form-item label="发布时间" >
                   {{item.askTime}}
                 </el-form-item>
                 <el-form-item label="发布者">
                   {{item.askUser}}
                 </el-form-item>
                 <el-form-item label="解答" >
                   {{item.askContent}}
                 </el-form-item>
               </el-form>
             </el-col>
           </el-row>
         </el-tab-pane>
      </el-tabs>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFlag.isOpen = false;dialogFlag.activeTab='0';">关 闭</el-button>
      </div>
    </el-dialog>
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
  </div>
</template>
<script>
  import { msgDialog,assistDialog,purchaseDialog,describeDialog,imagesDialog,logisticsDialog,screenDialog} from 'views/product/import_modular';
  export default{
    components: {
      msgDialog,//基本信息
      assistDialog,//辅助信息
      purchaseDialog,//采购信息
      describeDialog,//详细描述
      imagesDialog,//商品图片
      logisticsDialog,//物流方式
    },
    data(){
      return {
        ButtonInfo:{},//按钮权限列表20171227
        Filterclear:false,
        financeFormLabelWidth: '120px',
        //产品问题
        problemDialog:{
          ask:'',
          issueId:''
        },

        problem:{
          ask:'',
          problemparentForm:[
            {
              productId: '',
              askTime: '',
              askUser: '',
              askTitle: '',
              askContent: '',
              issueId:''

            }
          ]
        },
        dialogFlag:{
          dialogTitle:'',
          isOpen:false,
          activeTab:'0',
          addDialog:false,
          inputDisabled:false,
          docmentNull:true,
          problemTitle:'',
          problemisOpen:false,
        },
        activeNames: ['1'],    //  筛选 功能的折又又叠面板
        listData:[],
        signList:[],
        status:{
          done:'已摄影',
          nodone:'未摄影'
        },
        radioAll:'全部',
        options: [{       //下拉值
          value: 'SKU',
          label: 'SKU'
        }, {
          value: '产品名称',
          label: '产品名称'
        }
        ],
        content:'',
        selectParams:{    //  下拉过滤
          optionValue:'',
          optionTitle:'SKU',
        },
        //分页得到的数据集合
        page: {
          currentPage: 1, //当前页数
          pageSize: 10, //每页条数
          totalCount: 0, //总共条数
          totalPage: 0, //总共页数
          listData: []
        },
        //分页过滤
        pagefilters: {
          productId:'',
          currentPage: '1',
          pageSize: '10',
          skuNo:'',
          cnName:'',
          status:''
        },
        productidData: {
          productId: ''
        }
      }
    },
    //搜索
    computed:{
      getPlaceholder:function(){
        return this.selectParams.optionTitle == 'SKU' ? '请输入SKU' : this.selectParams.optionTitle == '产品名称' ? '请输入产品名称' :this.selectParams.optionTitle == '2' ;
      },
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
      imageData2(){

      },
      //产品问题
      getProductQuest(){
        var _this=this;
        _this.httpPost('productDevInfo/getProductQuest?productId='+this.pagefilters.productId).then(res=>{
          _this.problem.problemparentForm = res.data;
          for(var i=0;i<_this.problem.problemparentForm.length;i++){
            _this.problem.problemparentForm[i].askTime = _this.formatDate(_this.problem.problemparentForm[i].askTime)
          }
        })
      },
      tabclick(val){
      	if(val.index == 6){
          this.getProductQuest();
        }
      },
      //查看
      getCreateIssues(row,val){
      	var vm=this;
        this.dialogFlag.docmentNull = true;
        this.dialogFlag.isOpen = true;
        this.dialogFlag.activeTab = '0';
        this.pagefilters.productId = row.productId;
        setTimeout(()=>{
          vm.$refs.logisticsDialog.getLogisTypeForm(row.productId);
        },20)
      },
      //入口
      requestem(){
        this.httpPost('photography/photographyList',this.pagefilters).then(res => {
          this.listData = res.data.listData;
          this.page = res.data;
          for(var i=0; i< this.listData.length; i++){
            if(this.listData[i].status == '1'){
              this.listData[i].status = this.status.done;
              this.content = '已摄影'
            }
            else if(this.listData[i].status == '0') {
              this.listData[i].status = this.status.nodone;
              this.content = '未摄影'
            }
          }
           this.Filterclear=false;
        })
      },
      //搜索确认
      selectFilter:function(){
        this.Filterclear=true;
        var value = this.selectParams.optionValue;
        var title = this.selectParams.optionTitle;
        if(value == '' || title == '' ){

        }else{
          var vm =this;
          if(title == 'SKU'){
            vm.pagefilters.skuNo=value;
            vm.pagefilters.cnName='';
          }else if(title == '产品名称'){
            vm.pagefilters.cnName=value;
            vm.pagefilters.skuNo='';
          }
            this.requestem();
        }
      },
      //用户列表状态切换
      requestemStart(value){
        if(this.Filterclear==false){
          this.pagefilters.skuNo='';this.pagefilters.cnName='';this.selectParams.optionValue='';
          if(value == '全部'){
            this.pagefilters.status = '';
          }else if(value == '未摄影'){
            this.pagefilters.status = '0';
          }else if(value == '已摄影'){
            this.pagefilters.status = '1';
          }
        this.pagefilters.currentPage = 1;
        this.requestem();
        }
      },
      handleSelectionChange(val){
        this.signList = val;
        console.log('87794556 % 0===',this.signList)
      },
      signphoto(row,val,title){
        var ids = this.signList.map(item => item.productId),productId=[];
        console.log('所勾选ids',ids)
        val == '1' ? productId = ids : productId.push(row.productId);
        console.log('所勾选ID1',productId)
       if( row.states == '已摄影' || productId.length == 0 ){
           this.content='已摄影'
           this.$message('请合法操作！')
       }else{
         this.$confirm(title, '提示', {
           confirmButtonText: '确定',
           cancelButtonText: '取消',
           type: 'warning'
         }).then(() => {
         	var pou={};
           pou.productId=productId;
           this.httpPost('photography/editPhotography',pou).then(res => {
             if(res.data.result == true){
               this.requestem();
               this.$message({
                 type: 'success',
                 message: '标记成功!'
               });
             }else if(res.data.result == false){
               this.requestem();
               this.$message(res.data.message)
             }
           })
         }).catch(() => {
           this.$message({
             type: 'info',
             message: '已取消标记'
           });
         });
       }
      },
      //分页
      handleSizeChange(val) {
        this.pagefilters.pageSize = val;
        this.requestem();
      },
      handleCurrentChange(val) {
        this.pagefilters.currentPage = val;
        this.requestem();
      },
    }
  }
</script>
<style scoped>
  .select input.el-input__inner{
    height:28px!important;
  }
  .operation i{
    font-size: 16px;
  }
  .el-input-number--small{
    width:100px!important;
  }


</style>
