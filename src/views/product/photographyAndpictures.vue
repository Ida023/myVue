<template>
    <div id="outermost_wrap">
        <div id="sub_wrap">
            <CrumbsNav></CrumbsNav>
        </div>
        <div id="content_wrap">
          <el-row class="marginBottom"  :gutter="10">
            <el-col :span="3">
              <el-select size="small" v-model="selectParams.optionTitle" filterable  @clear="clearValue('0')" @change="selectParams.optionValue = ''">
                <el-option v-for="item in selectOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-col>
            <el-col :span="6" class="optionValue">
              <el-input v-model="selectParams.optionValue" :placeholder="getPlaceholder" size="small"></el-input>
            </el-col>
            <el-col :span="1">
              <el-button type="primary" size="small" @click="selectFilter('0')">搜索</el-button>
            </el-col>
          </el-row>
            <el-row  id="filer" class="marginBottom" >
                <el-collapse v-model="activeNames" >
                    <el-collapse-item name="1">
                        <el-col class="marginBottom">
                            <span class="span_label">类型</span>
                            <el-radio-group size="small" @change="">
                                <el-radio-button label="">待分配摄影美工</el-radio-button>
                                <el-radio-button label="01">待摄影拍照</el-radio-button>
                                <el-radio-button label="02">待美工P图</el-radio-button>
                                <el-radio-button label="03">图片已完成</el-radio-button>
                            </el-radio-group>
                        </el-col>
                    </el-collapse-item>
                </el-collapse>
            </el-row>
          <el-row style="border-bottom:1px solid #bfcbd9;padding-bottom: 10px;">
            <el-button size="small"  type="primary" @click="dialogFlag.sccrenisOpen=true;" >筛选</el-button>
          </el-row>
            <el-row class="supplier_btn">
                <el-button size="small" @click="" type="primary">分配摄影美工</el-button>
                <el-button size="small" @click="" type="primary">批量标记</el-button>
            </el-row>
            <div id="item_list">
                <el-table :data="Data" ref="Data" border tooltip-effect="dark" @selection-change="batchChange"
                          style="width:100%;">
                    <el-table-column type="selection" width="55" align="center"></el-table-column>
                    <el-table-column id="space" label="操作" align="center">
                      <template scope="scope" >
                        <el-tooltip content="查看"  effect="dark" placement="bottom" v-if="ButtonInfo['查看']!='0'">
                          <i  class="iconfontyyy"   @click="getCreateIssues(scope.row,dialogFlag.inputDisabled = true);"  content="Bottom center">&#xe600;</i>
                        </el-tooltip>
                        <el-tooltip content="标记"  effect="dark" placement="bottom"   v-if="ButtonInfo[content]!='0'">
                          <i  class="iconfontyyy"    @click="dialogFlag.signisOpen=true" content="Bottom center">&#xe627;</i>
                        </el-tooltip>
                        <el-tooltip content="分配摄影与美工"  effect="dark" placement="bottom"   v-if="ButtonInfo[content]!='0'">
                        <i  class="iconfontyyy"    @click="dialogFlag.distributionisOpen=true" content="Bottom center">&#xe69b;</i>
                      </el-tooltip>
                        <el-tooltip content="上传图片"  effect="dark" placement="bottom"   v-if="ButtonInfo[content]!='0'">
                          <i  class="iconfontyyy"    @click="dialogFlag.imagesisOpen=true;dialogFlag.inputDisabled = false" content="Bottom center">&#xe614;</i>
                        </el-tooltip>
                      </template>
                    </el-table-column>
                  <el-table-column label="SKU" prop="" align="center" sortable></el-table-column>
                  <el-table-column label="图片" prop="imageUrl" align="center" sortable  >
                    <template scope="scope">
                      <img  v-if="scope.row.imageUrl!=null" style="width: 70px; height: 70px" :src="scope.row.imageUrl" :data-src="scope.row.imageUrl">
                    </template>
                  </el-table-column>
                  <el-table-column label="产品名称" prop="" align="center" sortable></el-table-column>
                    <el-table-column label="分类" prop="" align="center" sortable></el-table-column>
                    <el-table-column label="平台" prop="" align="center" sortable></el-table-column>
                    <el-table-column label="状态" prop="" align="center" sortable></el-table-column>
                  <el-table-column label="摄影" prop="" align="center" sortable></el-table-column>
                  <el-table-column label="摄影时间" prop="" width="180" :formatter="tool.formatDate" align="center"
                                   sortable>
                  </el-table-column>
                  <el-table-column label="摄影张数" prop="" align="center" sortable></el-table-column>
                  <el-table-column label="美工" prop="" align="center" sortable></el-table-column>
                  <el-table-column label="美工时间" prop="" width="180" :formatter="tool.formatDate" align="center"
                                   sortable>
                  </el-table-column>
                  <el-table-column label="美工张数" prop="" align="center" sortable></el-table-column>
                  <el-table-column label="开发" prop="" align="center" sortable></el-table-column>
                  <el-table-column label="创建时间" prop="" width="180" :formatter="tool.formatDate" align="center"
                                     sortable>
                    </el-table-column>
                </el-table>
            </div>
        </div>
        <!------------------------------------查看/编辑/新增--------------------------------------->
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
    <!--      <el-tab-pane label="采购信息"   name="2">
            <purchase-dialog  :purchaseparentinfo-detail="dialogFlag.activeTab" :product-id="pagefilters.productId"
                              :input-disabled="dialogFlag.inputDisabled"  :docment-null="dialogFlag.docmentNull"></purchase-dialog>
          </el-tab-pane>-->
          <el-tab-pane label="详细描述"   name="3">
            <describe-dialog    :disState="dialogFlag.inputDisabled" :Selected="pagefilters" ></describe-dialog>
          </el-tab-pane>
          <el-tab-pane label="产品图片"   name="4" >
            <images-dialog   @assignment2="imageData2" :docment-null="dialogFlag.docmentNull" :disState="!dialogFlag.inputDisabled" :Selected="pagefilters" :isOpen="dialogFlag.isOpen"></images-dialog>
          </el-tab-pane>
    <!--      <el-tab-pane label="物流方式"   name="5" >
            <logistics-dialog ref="logisticsDialog" :logisticsparentinfo-detail="dialogFlag.activeTab"   @assignment="getLogisticsVlaue" :input-disabled="dialogFlag.inputDisabled" :product-id="pagefilters.productId"></logistics-dialog>
          </el-tab-pane>-->
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
      <!--筛选弹窗-->
      <div class="smallDia">
        <el-dialog title="筛选" :visible.sync="dialogFlag.sccrenisOpen" size="small" :close-on-click-modal="false"  @open="colseScreen();">
          <div class="data_body">
            <title-header></title-header>
            <el-row class="row-text">
              <text-input condition-name="SKU"  @child-change-val="getChildren"  :selectValue="pagefilters.skuNo"  text-type="skuNo" ></text-input>
            </el-row>
            <el-row class="row-text">
              <el-col class="col-matching" :span="4"> 分类 </el-col>
              <el-col class="col-matching col_input" :span="4">
                是
              </el-col>
              <el-col class="col_input" :span="16">
                <classify @assignment="addData6" :disState="isDisabledd" :Selected="categoryId" :skuno="skunoo"></classify>
              </el-col>
            </el-row>
            <el-row class="row-text">
            <el-col class="col-matching" :span="4"> 摄影 </el-col>
            <el-col class="col-matching col_input" :span="4">
              是
            </el-col>
            <el-col class="col_input" :span="16">
              <Photography @assignment="Photographydata1" :disState="false"   :Selected="pagefilters.categoryId"></Photography>
            </el-col>
          </el-row>
            <el-row class="row-text">
              <el-col class="col-matching" :span="4"> 美工 </el-col>
              <el-col class="col-matching col_input" :span="4">
                是
              </el-col>
              <el-col class="col_input" :span="16">
                <ArtDesigner @assignment="Photographydata2" :disState="false"   :Selected="pagefilters.categoryId"></ArtDesigner>
              </el-col>
            </el-row>
          </div>
          <div slot="footer" class="dialog-footer">
            <el-button @click="colseScreen">清除条件</el-button>
            <el-button @click="dialogFlag.sccrenisOpen = false;getRequirementList();">筛 选</el-button>
            <el-button @click="dialogFlag.sccrenisOpen = false;" >取 消</el-button>
          </div>
        </el-dialog>
      </div>
       <!--分配摄影美工-->
      <el-dialog title="分配人员" :visible.sync="dialogFlag.distributionisOpen" :close-on-click-modal="false"  size="tiny">
        <el-form :model="distributionForm" ref="distributionForm" labelWidth="80px">
          <el-form-item label="摄影" prop="aa" >
            <Photography @assignment="Photographydata1" :disState="false"   :Selected="pagefilters.categoryId"></Photography>
          </el-form-item>
          <el-form-item label="美工" prop="aa">
            <ArtDesigner @assignment="Photographydata2" :disState="false"   :Selected="pagefilters.categoryId"></ArtDesigner>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFlag.distributionisOpen = false;dialogFlag.activeTab='0';">取消</el-button>
          <el-button type="primary" @click="dialogFlag.distributionisOpen = false;dialogFlag.activeTab='0';">确定</el-button>
        </div>
      </el-dialog>
      <!--标记-->
      <el-dialog title="标记" :visible.sync="dialogFlag.signisOpen" :close-on-click-modal="false"  size="tiny">
        <el-form :model="distributionForm" ref="distributionForm" labelWidth="150px">
          <el-form-item label="请输入摄影张数" prop="aa"     :rules="[
      { required: true, message: '张数不能为空'},
      { type: 'number', message: '张数必须为数字值'}
    ]">
            <el-input type="number" v-model.number="distributionForm.aa"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFlag.signisOpen = false;dialogFlag.activeTab='0';">取消</el-button>
          <el-button type="primary" @click="dialogFlag.activeTab='0';sumbitSignForm();">确定</el-button>
        </div>
      </el-dialog>
      <!--上传图片-->
      <el-dialog title="上传图片" :visible.sync="dialogFlag.imagesisOpen" :close-on-click-modal="false"  size="tiny">
        <images-dialog @assignment="imageData"  @assignment3="imageData3"
                       @assignment4="imageData4" @assignment2="imageData2" :disState="!dialogFlag.inputDisabled" :Selected="pagefilters" :docment-null="dialogFlag.docmentNull" :isOpen="dialogFlag.isOpen"></images-dialog>
<!--
        <images-dialog   @assignment2="imageData2" :docment-null="dialogFlag.docmentNull" :disState="!dialogFlag.inputDisabled" :Selected="pagefilters" :isOpen="dialogFlag.isOpen"></images-dialog>
-->
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFlag.imagesisOpen = false;dialogFlag.activeTab='0';">取消</el-button>
          <el-button type="primary" @click="dialogFlag.activeTab='0';sumbitimages();">确定</el-button>
        </div>
      </el-dialog>

      <div id="page" class="page">
            <el-pagination @size-change="changePageSize" @current-change="changeCurrentPage"
                           :current-page="page.currentPage" :page-sizes="[10,20,30,40]" :page-size="page.pageSize"
                           layout="total, sizes, prev, pager, next, jumper" :total="page.totalCount"></el-pagination>
        </div>
    </div>
</template>
<script>
  import {classify,Photography,ArtDesigner, msgDialog,assistDialog,purchaseDialog,describeDialog,imagesDialog,logisticsDialog,screenDialog} from 'views/product/import_modular';
  import titleHeader from "components/ScreenModular/title.vue";
  import textInput from 'components/ScreenModular/textInput.vue';
  import ElForm from "../../../node_modules/element-ui/packages/form/src/form";
  import ElFormItem from "../../../node_modules/element-ui/packages/form/src/form-item";


  export default{
    components: {
      ElFormItem,
      ElForm,
      msgDialog,//基本信息
      assistDialog,//辅助信息
      purchaseDialog,//采购信息
      describeDialog,//详细描述
      imagesDialog,//商品图片
      logisticsDialog,//物流方式
      titleHeader,
      textInput,
      ArtDesigner,
      Photography,
      classify
    },
  data(){
			return {
        distributionForm:{
        	aa:123
        },
        //搜索下拉值
        selectOptions: [{
          value: 'SKU',
          label: 'SKU'
        }, {
          value: '产品名称',
          label: '产品名称'
        }],
        optionVal:'',    // 下拉选项值
        selectParams:{    //  下拉过滤
          optionValue:'',
          optionTitle:'SKU',
        },
				picList: [],
				uploadPic: this.RmsUrl + 'productDevInfo/postProductImage=' + this.sessuserid,   //  上传图片地址
				activeNames: ['1'],
        dialogFlag:{
          imagesisOpen:false,
          signisOpen:false,
        	distributionisOpen:false,
          sccrenisOpen:false,
          dialogTitle:'',
          isOpen:false,
          activeTab:'0',
          addDialog:false,
          inputDisabled:false,
          docmentNull:true,
          problemTitle:'',
          problemisOpen:false,
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
				Options: [
					{label: '1', value: '1'},
					{label: '1', value: '1'},
					{label: '1', value: '1'},
				],
				Data: [{aa:123}],
				Form: {aa: '', bb: []},
				//分页得到的数据集合
				page: {
					currentPage: 1, //当前页数
					pageSize: 10, //每页条数
					totalCount: 0, //总共条数
					totalPage: 0, //总共页数
				},
        categoryId:[],
				//过滤返回数据
				pagefilters: {
          categoryId:'',
          skuNo:'',
					satus: '',
					whRefId: '',
					currentPage: 1,
					pageSize: 10,
				},
        oneImageId:'',
        ImgFrom:[],
        ImgFrom2:[],
        ImgFrom3:[],
        ImgFrom4:[],
        ButtonInfo:{},//按钮权限列表20171227
			}
		},
    computed:{
      getPlaceholder:function(){
        return this.selectParams.optionTitle == 'SKU' ? '请输入SKU' : this.selectParams.optionTitle == '产品名称' ? '请输入产品名称' :'' ;
      }
      },
		mounted: function () {
      this.getauthorityList();
      this.getRequirementList();
		},
		methods: {
      /*********************页面按钮权限 20171227*****************************/
      getauthorityList(){
        var vm=this;
        vm.ButtonInfo=vm.tool.getBtnPermissions(vm.currentPath);
        console.log('horityList % 0',vm.ButtonInfo)

      },
      /*********************页面按钮权限 20171227*****************************/
      imageData(val){
        this.ImgFrom2=val;
        console.log(val)
      },
      imageData3(val){
        this.ImgFrom3=val;
        console.log(val)
      },
      imageData4(val){
        this.ImgFrom4=val;
        console.log(val)
      },
      imageData2(val){
        this.oneImageId=val;
        console.log(val)
      },
      sumbitimages(){
        this.ImgFrom=this.ImgFrom2.concat(this.ImgFrom3).concat(this.ImgFrom4);
        console.log(this.ImgFrom)
        if(this.ImgFrom4.length>0){
          this.httpPost('productDevInfo/postProductImage?oneImageId='+this.oneImageId+'&proId='+this.pagefilters.productId,this.ImgFrom).then(res => {
            console.log(res)
            if(res.data.result === true){
                this.getRequirementList();
                this.dialogFlag.imagesisOpen=false;
            }else {
              this.$message(res.data.message)
            }
          })
        }else{
          this.$message('主图不能为空！')
        }
      },
      sumbitSignForm(){
        this.$refs['distributionForm'].validate((valid) => {
          if (valid) {
           this.dialogFlag.signisOpen = false;
          }
        })
      },
      getChildren(val){
        this.pagefilters.skuNo=val.value;
      },
      addData6(val){
//        alert('触发')
        console.log(val);
        let  arr=val.value;
        this.HandleData(arr);
        this.categoryId=val.value;
        this.dataState=false;
      },
      HandleData(arr){
        this.pagefilters.categoryId=arr[arr.length-1];
      },
      Photographydata1(val){
        this.pagefilters.categoryId=val.value
      },
      Photographydata2(val){
        console.log(val)
        this.pagefilters.categoryId=val.value
      },
      colseScreen(){
      	this.pagefilters.categoryId='';
        this.categoryId=[];
      	this.pagefilters.skuNo='';
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
			openDialog(val){
			},
			getRequirementList(){

			},
			batchChange(){

			},
			//分页
			changePageSize: function (val) {
				this.pagefilters.pageSize = val;
				this.pagefilters.currentPage = 1;
				this.getRequirementList();
			},
			changeCurrentPage: function (val) {
				this.pagefilters.currentPage = val;
				this.getRequirementList();
			},

		}
	}

</script>

<style scoped>


</style>
