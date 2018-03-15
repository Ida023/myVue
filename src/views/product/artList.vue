<template>
  <div id="outermost_wrap" class="user_manager_wrap">
    <div id="sub_wrap" class="top-nav">
      <CrumbsNav></CrumbsNav>
    </div>
    <div id="content_wrap" class="content_wrap">
      <el-row class="filterOption" id="filterOption" >
        <el-col :span="2">
          <el-select v-model="selectParams.optionTitle" filterable clearable size="small" @change="selectParams.optionValue=''">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-col>
        <el-col :span="6" class="optionValue">
          <el-input v-model="selectParams.optionValue" :placeholder="getPlaceholder" size="small"></el-input>
        </el-col>
        <el-col :span="1">
          <el-button type="primary" class="research_btn" id="research_btn" size="small" @click="selectFilter">搜索</el-button>
        </el-col>
      </el-row>
      <el-row id="filer" class="supplierFiler">
        <el-collapse v-model="activeNames" class="marginBottom">
          <el-collapse-item name="1">
            <span class="span_label">状态</span>
            <el-radio-group v-model="pageFilter.state" size="small" @change="getPictureList">
              <el-radio-button  label="0"   v-if="ButtonInfo['全部']!='0'">全部</el-radio-button>
              <el-radio-button  label="1"   v-if="ButtonInfo['图片未处理']!='0'">图片未处理</el-radio-button>
              <el-radio-button  label="2"   v-if="ButtonInfo['图片已处理']!='0'">图片已处理</el-radio-button>
            </el-radio-group>
          </el-collapse-item>
        </el-collapse>
      </el-row>
      <div id="item_list">
        <el-table :data="picData" border tooltip-effect="dark" style="width: 100%" >
          <el-table-column  label="操作" align="center">
            <template scope="scope" width="100px">
              <el-tooltip class="item" effect="dark" content="查看" placement="top-start" v-if="ButtonInfo['查看']!='0'">
                <i class="iconfontyyy" @click="dialogFlag.dialogTitle='查看';dialogFlag.inputDisabled = true;getCreateIssues(scope.row);
                 SonDis= true; isShow=false; " >&#xe600;</i>
                <!--@click="dialogFlag.prlblemask=true; SonDis= true; isShow=false; dialogFlag.dialogTitle='查看产品详情'; getCreateIssues(scope.row);-->
                <!--describ(scope.row,dialogFlag.inputDisabled = true); dialogFlag.isOpen = true;"-->
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="上传图片" placement="top-start"  v-if="ButtonInfo['上传图片']!='0'">
                <i class="iconfontyyy" @click="GetImgDialog(scope.row); ">&#xe614;</i>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column sortable prop="skuNo" label="sku" align="center"></el-table-column>
          <el-table-column sortable prop="eanCode" label="EAN码" align="center"></el-table-column>
          <el-table-column sortable prop="state" label="图片" align="center">
            <template scope="scope">
              <img v-if="scope.row.imageUrl!=null" :src="RmsUrl+scope.row.imageUrl">
            </template>
          </el-table-column>
          <el-table-column sortable prop="cnName" label="产品名称" align="center"></el-table-column>
          <el-table-column sortable label="分类" align="center">
            <template scope="scope">
              <span>{{scope.row.categoryParentid}}</span><br/>
              <span>{{scope.row.categoryId}}</span>
            </template>
          </el-table-column>
          <el-table-column sortable prop="developUser" label="开发人员" align="center"></el-table-column>
          <el-table-column sortable prop="purchaseUser" label="跟单" align="center"></el-table-column>
          <el-table-column sortable prop="photographyUser" label="摄影" align="center"></el-table-column>
          <el-table-column sortable prop="imageDesignUser" label="美工" align="center"></el-table-column>
          <el-table-column sortable prop="count" label="状态" align="center"></el-table-column>
        </el-table>
      </div>
    </div>
    <div id="page" class="page">
      <el-pagination @size-change="changePageSize" @current-change="changeCurrentPage" :current-page="page.currentPage" :page-sizes="[10,20,30,40]" :page-size="page.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="page.totalCount"></el-pagination>
    </div>
    <el-dialog :title="dialogFlag.dialogTitle" :visible.sync="dialogFlag.isOpen" :close-on-click-modal="false" >
      <el-tabs v-model="dialogFlag.activeTab"  @tab-click="tabclick">
        <el-tab-pane label="基本信息"   name="0">
          <msg-dialog ref="msgDialog" :parentinfo-detail="dialogFlag.activeTab" :product-id="productId" :input-disabled="dialogFlag.inputDisabled" :docment-null="dialogFlag.docmentNull"></msg-dialog>
        </el-tab-pane>
        <el-tab-pane label="辅助信息"   name="1">
          <assist-dialog ref="assistDialog" :group-product="dialogFlag.addDialog"
                         :product-id="productId"
                         :docment-null="dialogFlag.docmentNull"
                         :assistparentinfo-detail="dialogFlag.activeTab" :input-disabled="dialogFlag.inputDisabled" ></assist-dialog>
        </el-tab-pane>
        <el-tab-pane label="采购信息"   name="2">
          <purchase-dialog  ref="purchaseDialog" :purchaseparentinfo-detail="dialogFlag.activeTab" :product-id="productId"  :input-disabled="dialogFlag.inputDisabled" ></purchase-dialog>
        </el-tab-pane>
        <el-tab-pane label="详细描述"   name="3">
          <describe-dialog  ref="describeDialog"   :Selected="dialogFlag"  :disState="dialogFlag.inputDisabled"></describe-dialog>
        </el-tab-pane>
        <el-tab-pane label="产品图片"   name="4" >
          <images-dialog  @assignment="imageData"  @assignment3="imageData3"
                          @assignment4="imageData4" @assignment2="imageData2" :docment-null="true" :disState="SonDis = false" :Selected="sonDataFrom" :is-open="!isOpen" ref="imagesfun">
          </images-dialog>
        </el-tab-pane>
        <el-tab-pane label="物流方式"   name="5" >
          <logistics-dialog ref="logisticsDialog" :logisticsparentinfo-detail="dialogFlag.activeTab"   :input-disabled="dialogFlag.inputDisabled" :product-id="productId"></logistics-dialog>

          <!--
                    <logistics-dialog  :logisticsparentinfo-detail="dialogFlag.activeTab" :product-id="productId" :input-disabled="dialogFlag.inputDisabled"></logistics-dialog>
          -->
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
    <el-dialog title="上传图片" :visible.sync="dialogFlag.openPicDia" :close-on-click-modal="false">
      <images-dialog  @assignment="imageData"  @assignment3="imageData3"
                      @assignment4="imageData4" @assignment2="imageData2" :docment-null="true" :disState="SonDis = true" :Selected="sonDataFrom" :is-open="!isOpen" ref="imagesfun">
      </images-dialog>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFlag.openPicDia = false">关 闭</el-button>
        <el-button type="primary" @click="PreservationImg(); dialogFlag.openPicDia = false" :loading="$store.state.loading">保 存</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>

  import ElTabPane from "../../../node_modules/element-ui/packages/tabs/src/tab-pane";
  import ElForm from "../../../node_modules/element-ui/packages/form/src/form";
  import ElFormItem from "../../../node_modules/element-ui/packages/form/src/form-item";
  import ElDialog from "../../../node_modules/element-ui/packages/dialog/src/component";
  import ElCol from "element-ui/packages/col/src/col";
  import { classify, SpecialAttributes, ChoiceDevelopment, Merchandiser, ArtDesigner,
    Photography, msgDialog,assistDialog,purchaseDialog,describeDialog,imagesDialog,
    logisticsDialog,problemDialog,screenDialog, group } from 'views/product/import_modular';
export default{
    components: {
      ElDialog,
      ElFormItem,
      ElForm,
      ElTabPane,
      msgDialog,//基本信息
      assistDialog,//辅助信息
      purchaseDialog,//采购信息
      describeDialog,//详细描述
      imagesDialog,//商品图片
      logisticsDialog,//物流方式
      screenDialog,

    },
    data(){
      return {
        isOpen:false,
        SonDis:false,
        isShow:'',
        financeFormLabelWidth: '120px',
        //产品问题
        problemDialog:{
          ask:'',
          issueId:''
        },
        sonDataFrom:{
          SonDis:false,
          productId:''
        },
        ImgDialog:false,
        ImgFrom:[],
        ImgFrom2:[],
        ImgFrom3:[],
        ImgFrom4:[],
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
        productId:'',
        options: [/*{
          value: 3,
          label: '全部'
        },*/{
          value: 0,
          label: 'sku'
        }, {
          value: 1,
          label: '商品名称'
        }],

        optionVal:'',    // 下拉选项值
        selectParams:{    //  下拉过滤
          optionValue:'',
          optionTitle:0,
        },
        pageFilter:{
          currentPage:1,
          pageSize:10,
          sku:'',
          cnName:'',
          state:0,
        },
        page:{          // 分页参数
          currentPage:1,
          pageSize:10,
          totalCount:10,
          totalPage:10
        },
        activeNames: ['1'],    //  筛选 功能的折又又叠面板
        picData:[],   // 供应商列表
        dialogFlag:{
          productId:'',
          openPicDia:false,
          isOpen:false,     // 批量及单个删除框
          isOpenLead:false,     // 批量导入框
          isOpenLeadError:false,     // 批量导入异常框
          openResetPass:false,  // 重置密码框
          dialogTitle:"",     // 弹出框 的title
          isOpenMsg:'',      // 弹出框 的msg
          otherInputDisabled:false,  //用户邮箱是否可编辑  在添加与编辑中区分
          problemisOpen:false,
          assistisOpen:false,
          houseisOpen:false,
          classifyisOpen:false,
          screenisOpen:false,
          salesisOpen:false,
          infoDetail: false,
          docmentNull:false,
          prlblemLabel:'',
          problemTitle:'',
          salesTitle:'',
          houseTitle:'',
          inputDisabled: false,  //区分编辑和查看
          addDialog: false,//区分产品和组合产品
          activeTab:'0'
        },
        sels:[],    //批量删除已选的条目数
        uploadPic:this.RmsUrl+'saveAttachmentMultipartFile?Authorization='+this.sessuserid,   //  上传图片地址
        picSrc:'http://img5.duitang.com/uploads/item/201602/11/20160211121720_astJR.jpeg',
        image_Ids:[],
        picId:'',
        ButtonInfo:{},//按钮权限列表20171227

      }
    },
    computed:{
      getPlaceholder:function(){
        return this.selectParams.optionTitle == 0 ? '请输入sku' : this.selectParams.optionTitle == 1 ? '请输入产品名称':'';
      },
    },
    mounted () {
      this.getauthorityList();
      this.getPictureList();
    },
    methods: {
      /*********************页面按钮权限 20171227*****************************/
      getauthorityList(){
        var vm=this;
        vm.ButtonInfo=vm.tool.getBtnPermissions(vm.currentPath);
        console.log('horityList % 0',vm.ButtonInfo)

      },
      /*********************页面按钮权限 20171227*****************************/
      GetImgDialog:function (row) {
        this.sonDataFrom.productId=row.productId;
        this.dialogFlag.openPicDia = true;
        this.SonDis= false;
        this.isShow=true;
        this.isOpen = !this.isOpen;
      },
      PreservationImg:function () {
        this.ImgFrom = this.ImgFrom2.concat(this.ImgFrom3).concat(this.ImgFrom4);
//        alert(this.ImgFrom.length)
        if (this.ImgFrom.length > 0) {
//          alert(this.ImgFrom2.length)
          this.httpPost('productDevInfo/postProductImage?oneImageId=' + this.oneImageId + '&proId=' + this.sonDataFrom.productId, this.ImgFrom).then(res => {
            console.log(res)
            if (res.data.result === true) {
//              alert(98)
              console.log(res)
              this.getPictureList()
            } else {
              this.$message(res.data.message)
            }
          })
        }
      },
      imageData(val){
        this.ImgFrom2=val;
        console.log(val)
      },
      imageData3(val){
        this.ImgFrom3=val;
        console.log(val)
      },
      imageData2(val){
//        alert('img2')
        this.oneImageId=val;
        console.log(val)
      },
      imageData4(val){
        this.ImgFrom4=val;
        console.log(val)
      },
      getProductQuest(){
        var _this = this;
        var a='../static';
        _this.httpPost('productDevInfo/getProductQuest?productId='+this.productId).then(res=>{
          _this.problem.problemparentForm = res.data;
          for(var i=0;i<_this.problem.problemparentForm.length;i++){
            _this.problem.problemparentForm[i].askTime = _this.formatDate(_this.problem.problemparentForm[i].askTime)
          }
        })
      },
      selectFilter:function(){
        var selectVal = this.selectParams.optionValue;
        var selectTittle = this.selectParams.optionTitle;
        var vm = this;
        switch(selectTittle){
          case 0:
            vm.pageFilter.sku = selectVal ;
            vm.pageFilter.cnName = '' ;
            this.getPictureList();
            break;
          case 1:
            vm.pageFilter.cnName = selectVal ;
            vm.pageFilter.sku = '' ;
            this.getPictureList();
            break;
        }
      },
      getPictureList:function(){
        console.log('翻页传参 % O',this.pageFilter);
        this.httpPost('imageDesinInfo/getImageDesinInfo',this.pageFilter).then(res => {
            console.log(res);
            const pageData = res.data;
            this.page.currentPage = pageData.currentPage;
            this.page.totalCount = pageData.totalCount;
            this.page.totalPage = pageData.totalPage;
            this.page.pageSize = pageData.pageSize;
            this.picData = pageData.listData;
            console.log('  ---userListData % O',this.picData);
        })
      },
      tabclick(val){
        if(val.index == 6){
          this.getProductQuest();
        }
      },
      //查看
      getCreateIssues(row){
      	var vm=this;
        this.dialogFlag.isOpen = true;
        this.dialogFlag.docmentNull = true;
        this.productId = row.productId;
        this.sonDataFrom.productId = row.productId;
        this.dialogFlag.prlblemask = true;
        this.dialogFlag.activeTab = '0';
        setTimeout(()=>{
          vm.$refs.logisticsDialog.getLogisTypeForm(this.productId);
          vm.$refs.imagesfun.getImageResource();
        },20)
      },
      changePageSize:function(val){
        this.pageFilter.pageSize=val;
        this.pageFilter.currentPage = 1;
        this.getPictureList();
      },
      changeCurrentPage:function(val){
        this.pageFilter.currentPage=val;
        this.getPictureList();
      },
      describ(row){
        this.dialogFlag.prlblemask=true;
        this.dialogFlag.isOpen = true;
        this.sonDataFrom.productId = row.productId;
        this.productId = row.productId;
//        alert(' this.productId======='+  this.productId)
        this.dialogFlag.docmentNull = true;
        this.$refs.msgDialog.requestem();
        this.$refs.assistDialog.requestem();
        this.$refs.purchaseDialog.requestem();
        this.$refs.describeDialog.getLanguage();
        this.$refs.describeDialog.addlang();
        this.dialogFlag.activeTab = '0';
      },
      },
  }
</script>

<style scoped>
  [v-cloak] {
    display: none;
  }
  .optionValue{
    margin:0 10px;
  }
  .research_btn{
    padding:9px 12px;
  }
  .span_label{
    font-weight:bold;
    margin-right:10px;
  }
</style>
