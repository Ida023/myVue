<template>
    <div id="outermost_wrap">
        <div id="sub_wrap">
            <CrumbsNav></CrumbsNav>
        </div>
      <div id="content_wrap" class="content_wrap">
          <el-row  id="filer" class="marginBottom" style="margin-top:-10px">
            <el-collapse v-model="activeNames">
              <el-collapse-item name="1">
                <el-col  class="marginBottom" v-show="$route.path!=='/inventoryBalance'">
                  <span class="span_label">查看方式</span>
                  <el-radio-group v-model="pagefilters.a" size="small"   >
                    <el-radio-button label="01"  v-if="ButtonInfo['按仓库']!='0'">按仓库</el-radio-button>
                    <el-radio-button label="02"     v-if="ButtonInfo['按SKU']!='0'">按SKU</el-radio-button>
                  </el-radio-group>
                </el-col >
                <el-col  class="marginBottom" v-if="pagefilters.a == '01'">
                  <span class="span_label">仓库类型</span>
                  <el-radio-group v-model="warehouseTypeId" size="small"   >
                    <el-radio-button :label="item.refId" v-for="(item,index) in BasicsData1"  v-if="ButtonInfo[item.refValue]!='0'">{{ item.refValue }}</el-radio-button>
                  </el-radio-group>
                </el-col>
                <el-col  class="marginBottom" v-if="pagefilters.a == '01'">
                  <span class="span_label">仓库名称</span>
                  <el-radio-group v-model="defaultData.whId" size="small"   >
                    <el-radio-button :label="item.whId" v-for="(item,index) in BasicsData2" v-if="ButtonInfo[item.whName]!='0'">{{ item.whName }}</el-radio-button>
                  </el-radio-group>
                </el-col>
                <el-col  class="marginBottom">
                  <span class="span_label">销售状态</span>
                  <el-radio-group v-model="defaultData.saleStatusId" size="small"   >
                    <el-radio-button :label="item.refId" v-for="(item,index) in BasicsData3" v-if="ButtonInfo[ item.refValue ]!='0'">{{ item.refValue }}</el-radio-button>
                  </el-radio-group>
                </el-col>
              </el-collapse-item>
            </el-collapse>
          </el-row>
          <el-row  class="main_content content_wrap" >
           <el-col class="left-content">
             <el-col>
               <el-col :span="24" class="text-C butBorder">检索类型</el-col>
               <el-col :span="24" class="radioRow">
                 <el-col :span="24"  class="radioStyel">
                   <el-radio class="radio" v-model="radio" label="1"  v-if="ButtonInfo['按产品品类检索']!='0'">按产品品类检索</el-radio><br>
                   <el-radio class="radio" v-model="radio" label="2" v-if="$route.path==='/inventoryBalance'" >按库位号检索</el-radio>
                 </el-col>
               </el-col>
               <el-col v-show="radio==='1'" class="radioStyel">商品分类</el-col>
               <el-col v-show="radio==='2'" class="radioStyel">库位号</el-col>
             </el-col>
             <el-col v-show="radio==='1'" class="classTree">
                 <classification @assignment="assignment" ref="classification"></classification>
             </el-col>
             <el-col v-show="radio==='2'">
               <el-select style="margin-left: 25px" v-model="defaultData.locationNo" placeholder="库位号" @change="getPictureList()" clearable filterable>
                 <el-option
                   v-for="item in BasicsData4"
                   :key="item.locationNo"
                   :label="item.locationNo+'('+item.prodCount+')'"
                   :value="item.locationNo">
                 </el-option>
               </el-select>
             </el-col>
           </el-col>
           <el-col class="right-content">
             <!--条件搜索&& 批量操作！-->
             <div>
               <el-row type="flex" justify="start" class="filterOption marginBottom" id="filterOption">
                 <el-col style="width:200px;margin-right: 10px" class="optionValue">
                   <el-select v-model="selectParams.optionTitle" filterable clearable @change="selectFilter();"
                              size="small">
                     <el-option v-for="item in options" :key="item.value" :label="item.label"
                                :value="item.value"></el-option>
                   </el-select>
                 </el-col>
                 <el-button type="primary" class="research_btn" id="research_btn" size="small"
                            @click="getPictureList();">搜索
                 </el-button>
                 <el-button type="primary" class="research_btn" size="small" @click="closeDialog(); getPictureList()">
                   清除条件
                 </el-button>
                 <el-input  v-model="selectParams.optionValue" size="small" v-if="selectParams.optionTitle==1"
                           :placeholder="getPlaceholder" class="input66" @change="selectFilter()"
                           name="input66"></el-input>
                 <el-row v-if="selectParams.optionTitle==0" style="margin-left: 10px;margin-top:1px;">
                   <el-tag
                     :key="tag"
                     v-for="tag in defaultData.skuNos"
                     :closable="true"
                     :close-transition="false"
                     @close="handleClose(tag)">
                     {{tag}}
                   </el-tag>
                   <el-input
                     class="input-new-tag input-new-tag2"
                     v-if="inputVisible"
                     v-model="inputValue"
                     size="small"
                     ref="saveTagInput"
                     @keyup.enter.native="handleInputConfirm"
                     @blur="handleInputConfirm"
                   >
                   </el-input>
                   <el-button v-else class="button-new-tag" size="small" @click="showInput">+ SKU</el-button>
                 </el-row>
               </el-row>
               <el-row class="marginBottom">
                 <el-button type="primary" size="small" @click="exportData();"  v-if="ButtonInfo['导出Excel']!='0'">导出Excel</el-button>
                 <el-button type="primary" size="small" @click="transferFn('批量库位转移')" v-if="$route.path==='/inventoryBalance' && pagefilters.a==='01' && ButtonInfo['批量库位转移']!='0' ">
                   批量库位转移
                 </el-button>
                 <el-button type="primary" size="small" @click="transferFn('设置安全库存')" v-if="$route.path!=='/inventoryBalance' && pagefilters.a==='01' && ButtonInfo['设置安全库存']!='0'">
                   设置安全库存
                 </el-button>
               </el-row>
             </div>
             <!--表格-->
             <div class="right-table">
               <el-table  id="item_list"  :data="TableData" border tooltip-effect="dark" style="width: 100%" :stripe="false"  @selection-change="selsChange">
                 <el-table-column type="selection" width="55" align="center" ></el-table-column>
                 <el-table-column label="操作"  prop="label" align="center"  width="150"  v-show="pagefilters.a==='01'  && ButtonInfo['设置安全库存']!='0'">
                   <template scope="scope">
                     <!--<el-tooltip content="查看"  effect="dark" placement="bottom">-->
                       <!--<i  class="iconfontyyy" content="Bottom center" @click="RowData(scope.row, '查看')">&#xe600;</i>-->
                     <!--</el-tooltip>-->
                     <el-tooltip content="收藏"  effect="dark" placement="bottom" v-show="scope.row.isFavorite==='0'  && ButtonInfo['收藏']!='0'">
                       <i style="color: rgb(247, 186, 42)"  class="iconfontyyy" content="Bottom center" @click="RowData(scope.row, '收藏')">&#xe61a;</i>
                     </el-tooltip>
                     <el-tooltip content="收藏"  effect="dark" placement="bottom" v-show="scope.row.isFavorite==='1'  && ButtonInfo['收藏']!='0'">
                       <i class="iconfontyyy" content="Bottom center" @click="RowData(scope.row, '收藏')">&#xe679;</i>
                     </el-tooltip>
                     <el-tooltip content="部门数量"  effect="dark" placement="bottom" v-if="ButtonInfo['部门数量']!='0'">
                       <i  class="iconfontyyy" content="Bottom center" @click="RowData(scope.row, '数量')">&#xe61b;</i>
                     </el-tooltip>
                     <el-tooltip content="修改"  effect="dark" placement="bottom" v-show="$route.path==='/inventoryBalance'  && ButtonInfo['修改']!='0'">
                       <i  class="iconfontyyy" content="Bottom center" @click="RowData(scope.row, '修改')">&#xe6e5;</i>
                     </el-tooltip>
                     <el-tooltip content="历史销量"  effect="dark" placement="bottom"  v-if="ButtonInfo['历史销量']!='0'">
                       <i  class="iconfontyyy" content="Bottom center" @click="RowData(scope.row, '历史销量')">&#xe801;</i>
                     </el-tooltip>
                     <el-tooltip content="打印"  effect="dark" placement="bottom" v-show="$route.path==='/inventoryBalance'  && ButtonInfo['打印']!='0'">
                       <i  class="iconfontyyy" content="Bottom center" @click="RowData(scope.row, '打印')">&#xe638;</i>
                     </el-tooltip>
                   </template>
                 </el-table-column>
                 <el-table-column label="图片"  align="center" >
                   <template scope="scope">
                     <img v-if="scope.row.productImage!=null" style="width: 70px; height: 70px" :src="scope.row.productImage"/>
                   </template>
                 </el-table-column>
                 <el-table-column label="SKU"  align="center"  >
                   <template scope="scope">
                     <span v-text="scope.row.skuNo" class="Astyel" @click="RowData(scope.row, 'SKU')"></span>
                   </template>
                 </el-table-column>
                 <el-table-column label="EAN"  align="center" prop="eanCode" >
                 </el-table-column>
                 <el-table-column label="商品名称"  align="center" prop="productName" >
                 </el-table-column>
                 <el-table-column label="货架总计"  align="center" prop="inventoryQty" >
                 </el-table-column>
                 <el-table-column label="可销售"  align="center" prop="qty" >
                 </el-table-column>
                 <el-table-column label="锁定库存"  align="center" prop="lockedQty" >
                 </el-table-column>
                 <el-table-column label="在途"  align="center"  >
                   <template scope="scope">
                     <span v-if="warehouseTypeId != '01'" v-text="scope.row.inRoadQty" class="Astyel" @click="RowData(scope.row, '在途')"></span>
                     <span v-if="warehouseTypeId == '01'" v-text="scope.row.inRoadQty"></span>
                   </template>
                 </el-table-column>
                 <el-table-column label="故障品"  align="center" prop="defectiveQty" >
                 </el-table-column>
                 <el-table-column label="安全库存"  align="center" prop="minQty">
                 </el-table-column>
                 <el-table-column label="库位号"  align="center" prop="locationNo" v-if="pagefilters.a==='01' && $route.path==='/inventoryBalance'">
                 </el-table-column>
                 <el-table-column label="到仓成本"  align="center"  v-if="$route.path!=='/inventoryBalance' && pagefilters.a==='01'">
                   <template scope="scope">
                     <span>{{ scope.row.avgCost }}</span>
                     <span>{{ scope.row.currencyNo }}</span>
                   </template>
                 </el-table-column>
               </el-table>
             </div>
             <!--Sku日志-->
             <el-dialog  title="SKU日志" :visible.sync="SkuDialog.Dialog" size="small" :close-on-click-modal="false" @open="" >
               <el-table class="item_list" :data="SkuData" border tooltip-effect="dark" style="width: 100%" :stripe="false">
                 <el-table-column label="序号"  align="center" type="index">
                 </el-table-column>
                 <el-table-column label="操作人"  align="center" prop="tradingUser" ></el-table-column>
                 <el-table-column label="动作"  align="center" prop="actionName" ></el-table-column>
                 <el-table-column label="原库存数"  align="center" prop="oldInventoryQty" ></el-table-column>
                 <el-table-column label="操作后数量"  align="center" prop="InventoryQty" ></el-table-column>
                 <el-table-column label="操作时间" align="center" :formatter="tool.formatDate" prop="tradingTime"></el-table-column>
               </el-table>
               <span slot="footer" class="dialog-footer">
                  <el-button @click="SkuDialog.Dialog = false">取 消</el-button>
                  <!--<el-button @click="" type="primary">确 定</el-button>-->
                </span>
             </el-dialog>
             <!--数量-->
             <el-dialog  title="数量" :visible.sync="NumberDialog.Dialog" size="small" :close-on-click-modal="false" @open="" >
               <el-table class="item_list" :data="NumberList" border tooltip-effect="dark" style="width: 100%" :stripe="false">
                 <el-table-column label="部门"  align="center" prop="departName" ></el-table-column>
                 <el-table-column label="货架总计"  align="center" prop="inventoryQty" ></el-table-column>
                 <el-table-column label="可销售"  align="center" prop="qty" ></el-table-column>
                 <el-table-column label="锁定库存"  align="center" prop="lockedQty" ></el-table-column>
                 <el-table-column label="在途"  align="center" prop="inRoadQty" ></el-table-column>
                 <el-table-column label="故障品"  align="center" prop="defectiveQty" ></el-table-column>
               </el-table>
               <span slot="footer" class="dialog-footer">
                  <el-button @click="NumberDialog.Dialog = false">取 消</el-button>
                  <!--<el-button @click="NumberDialog.Dialog = false" type="primary">确 定</el-button>-->
                </span>
             </el-dialog>
             <!--编辑-->
             <el-dialog  title="修改库位号" :visible.sync="EditDialog.Dialog" size="tiny" :close-on-click-modal="false" @close="closeData" >
                <el-input v-model="modifyData.locationNo" type="input"></el-input>
               <span slot="footer" class="dialog-footer">
                  <el-button @click="EditDialog.Dialog = false">取 消</el-button>
                 <el-button @click="SeeSkuDataFn()" type="primary" :loading="$store.state.loading">确 定</el-button>
                </span>
             </el-dialog>
             <!--批量库位转移-->
             <el-dialog  title="库位转移" :visible.sync="transferDialog.Dialog" size="tiny" :close-on-click-modal="false" @close="closeData" >
               <el-input v-model="modifyData.locationNo" type="input"></el-input>
               <span slot="footer" class="dialog-footer">
                  <el-button @click="transferDialog.Dialog = false">取 消</el-button>
                  <el-button @click="SeeSkuDataFns()" type="primary" :loading="$store.state.loading">确 定</el-button>
                </span>
             </el-dialog>
             <!--批量设置安全库存-->
             <el-dialog  title="设置安全库存" :visible.sync="SetStockDal.Dal" size="tiny" :close-on-click-modal="false" @close="closeData" >
               <el-input v-model="SetStockDal.SetStockData.data" type="input" placeholder="请输入安全库存数"></el-input>
               <span slot="footer" class="dialog-footer">
                  <el-button @click="SetStockDal.Dal = false">取 消</el-button>
                  <el-button @click="SetStock()" type="primary" :loading="$store.state.loading">确 定</el-button>
                </span>
             </el-dialog>
             <!--在途中-->
             <el-dialog  title="在途库存详情" :visible.sync="Ontheway.Dialog" size="small" :close-on-click-modal="false" @open="" >
               <el-table class="item_list" :data="OnthewayData" border tooltip-effect="dark" style="width: 100%" :stripe="false">
                 <el-table-column label="序号"  align="center" type="index"></el-table-column>
                 <el-table-column label="数量"  align="center" prop="qty" ></el-table-column>
                 <el-table-column label="运输方式"  align="center" prop="transportTypeName" ></el-table-column>
                 <el-table-column label="跟踪单号"  align="center"  >
                   <template scope="scope">
                     <span v-text="scope.row.trackingNo" class="Astyel" @click=""></span>
                   </template>
                 </el-table-column>
               </el-table>
               <span slot="footer" class="dialog-footer">
                  <el-button @click="Ontheway.Dialog = false">取 消</el-button>
                </span>
             </el-dialog>
             <!--tab SKU 详情-->
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
                 <el-tab-pane label="详细描述"   name="2">
                   <describe-dialog  ref="describeDialog"     :Selected="dialogFlag"  :disState="dialogFlag.inputDisabled"></describe-dialog>
                 </el-tab-pane>
                 <el-tab-pane label="产品图片"   name="3" >
                   <images-dialog  @assignment="imageData"  @assignment3="imageData3"
                                   @assignment4="imageData4" @assignment2="imageData2"   :product-id="productId" :docment-null="true" :disState="SonDis = false" :Selected="sonDataFrom" :is-open="dialogFlag.isOpen" ref="imagesfun">
                   </images-dialog>
                 </el-tab-pane>
                 <el-tab-pane label="物流方式"   name="4" >
                   <logistics-dialog  ref="logisticsDialog" :logisticsparentinfo-detail="dialogFlag.activeTab" :product-id="productId" :input-disabled="dialogFlag.inputDisabled"></logistics-dialog>
                 </el-tab-pane>
                 <el-tab-pane label="产品问题"   name="5" >
                   <el-row>
                     <el-col  v-if="problem.problemparentForm.length > 0">
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
             <!------------------打印商品标签--------------------------->
             <el-dialog title="打印商品标签" :visible.sync="dialogFlag.printDialog" :close-on-click-modal="false">
               <el-table :data="printData" border tooltip-effect="dark" style="width: 100%">
                 <el-table-column label="操作"  prop="label" align="center"  width="150">
                   <template scope="scope">
                     <el-tooltip content="打印"  effect="dark" placement="bottom">
                       <i class="iconfontyyy" content="Bottom center" @click="printProduct(scope.row)">&#xe638;</i>
                     </el-tooltip>
                   </template>
                 </el-table-column>
                 <el-table-column sortable prop="poNo" label="采购订单编号" align="center" :show-overflow-tooltip="true"></el-table-column>
                 <el-table-column sortable prop="poDate" label="采购单生成时间" :formatter="tool.formatDate"  width="180px" align="center" :show-overflow-tooltip="true"></el-table-column>
                 <el-table-column sortable prop="poBatchNo" label="批次号（R.N）"  align="center" :show-overflow-tooltip="true"></el-table-column>
                 <el-table-column sortable prop="skuNo" label="SKU"  align="center" :show-overflow-tooltip="true"></el-table-column>
                 <el-table-column sortable prop="purchaseUser" label="跟单"  align="center" :show-overflow-tooltip="true"></el-table-column>
               </el-table>

               <div slot="footer" class="dialog-footer">
                 <el-button @click="dialogFlag.printDialog = false;">取消</el-button>
               </div>
             </el-dialog>
             <div id="page" class="page" >
               <el-pagination @size-change="changePageSize" @current-change="changeCurrentPage" :current-page="page.currentPage" :page-sizes="[10,20,30,40]" :page-size="page.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="page.totalCount"></el-pagination>
             </div>
           </el-col>
          </el-row>
        </div>
    </div>
</template>
<script>
  import classification from "components/classification";
  import WarehouseNumber from "components/listData/WarehouseNumber";
  import ElRow from "element-ui/packages/row/src/row";
  import ElCol from "element-ui/packages/col/src/col";
  import ElButton from "../../../node_modules/element-ui/packages/button/src/button";
  import ElInput from "../../../node_modules/element-ui/packages/input/src/input";
  import { classify, SpecialAttributes, ChoiceDevelopment, Merchandiser, ArtDesigner,
    Photography, msgDialog,assistDialog,purchaseDialog,describeDialog,imagesDialog,
    logisticsDialog,problemDialog,screenDialog, group } from 'views/product/import_modular';
  import { mapState,mapMutations,mapGetters,mapActions } from 'vuex'
	export default{
    components: {
      ElInput,
      ElButton,
      ElCol,
      ElRow,
      classification,
      WarehouseNumber,
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
        printData:[], //打印商品标签
        activeNames: ['1'],    //  筛选 功能的折叠面板
				//分页得到的数据集合
				page: {
					currentPage: 1, //当前页数
					pageSize: 10, //每页条数
					totalCount: 0, //总共条数
					totalPage: 0, //总共页数
				},
        TableData:[],
        radio:'1',
        defaultData:{
          isFavorite:'',
          exportType:'',
          skuNos:[],//Sku
          whId:'',//仓库ID
          saleStatusId:'',//销售状态ID
          keyPath:'',//分类路径
          locationNo:'',//库位号
          prductNames:'',//多个商品名称
          currentPage:1,//当前页数
          pageSize:10,//页面显示条数
        },
        warehouseTypeId:'',
        dynamicTags: ['sku1', 'sku12', 'sku3'],
        inputVisible: false,
        inputValue: '',
				//过滤返回数据
				pagefilters: {
          a:'01',
          b:'01',
          c:'01',
          d:'01',
					currentPage: 1,
					pageSize: 10,
				},
        detailInventory:[],//详细数据
        options: [
          {
            value: 0,
            label: 'SKU'
          },
          {
            value: 1,
            label: '商品名称'
          }],
        optionVal:'',    // 下拉选项值
        selectParams:{    //  下拉过滤
          optionValue:'',
          optionTitle:0,
        },
        SkuDialog:{
          Dialog:false,
          dis:false,
        },
        Ontheway:{
          Dialog:false,
          dis:false,
        },
        OnthewayData:[],
        SkuData:[],
        NumberDialog:{
          Dialog:false,
          dis:false,
        },
        NumberData:[],
        EditDialog:{
          Dialog:false,
          dis:false,
        },
        addData:'',
        transferDialog:{
          Dialog:false,
          dis:false,
        },
        transferData:'',
        SonWarehouseNumber:{
          Selected:'',
          dis:false
        },
        BasicsData1:[],
        BasicsData2:[],
        BasicsData3:[],
        BasicsData4:[],
        SeeSkuData:{},
        modifyData:{
          whId:'',//仓库ID
          productId:'',//仓库ID
          locationNo:'',//仓库ID
        },
        modifyDatas:[],
        whId:[],
        dialogFlag:{
          productId:'',
          openPicDia:false,
          printDialog:false,  // 打印商品标签
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
        productId:'',
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
        isOpen:false,
        SonDis:false,
        sonDataFrom:{
          SonDis:false,
          productId:''
        },
        financeFormLabelWidth: '120px',
        getObj:{
          whid:'1',
          productId:'20170927110249767000'
        },
        NumberList:[],
        SetStockDal:{
          Dal:false,
          Dis:false,
          SetStockData:{
            whId:'',
            data:'',
          }
        },
        ButtonInfo:{},//按钮权限列表20171227
			}
		},
    computed:{
      getPlaceholder:function(){
        return this.selectParams.optionTitle == 0 ? '多个SKU请用","隔开' : this.selectParams.optionTitle == 1 ? '请输入商品名称':'';
      },

    },
    watch:{
      'pagefilters.a':{
        handler(val){
            if(val==='01'){
              this.getPictureList();
              this.getBasicsData2();
              this.getBasicsData3()
            }else {
              this.defaultData.whId='';
              this.getPictureList();
            }
        }
      },
      'warehouseTypeId':{
        handler(val){
          this.getBasicsData2();
        }
      },
      'defaultData.whId':{
        handler(val){
          this.getBasicsData4();
        }
      },
      'defaultData':{
        handler(val){
          this.getPictureList();
        },
        deep: true
      },
      'radio':{
          handler(val){
            if(val==='1'){
              this.defaultData.locationNo='';
            }else {
              this.defaultData.keyPath='';
            }
          }
      }

    },
		mounted: function () {
      this.getauthorityList();
      this.getPictureList();
			this.getBasicsData();
			this.getBasicsData3();
			this.getBasicsData4();
		},
		methods: {
      /*********************页面按钮权限 20171227*****************************/
      getauthorityList(){
        var vm=this;
        vm.ButtonInfo=vm.tool.getBtnPermissions(vm.currentPath);
        console.log('horityList % 0',vm.ButtonInfo)

      },
      /*********************页面按钮权限 20171227*****************************/
			requestem(){

			},
      ...mapMutations([
        'postmenu',
        'subnav',
        'getsub'
      ]),
      closeDialog:function () {//清除数据
        this.defaultData.skuNos=[];
        this.defaultData.prductNames='';
        this.defaultData.keyPath='';
        this.defaultData.locationNo='';
        this.$refs.classification.CloseFn()
      },
      getBasicsData:function () {//加载仓库类型
          this.httpGet('refWarehouseType/selectList').then(res=>{
              if(res.data.result===true){
                this.BasicsData1=res.data.params.listData;
                this.warehouseTypeId=res.data.params.listData[0].refId;
                setTimeout(()=>{
                  this.getBasicsData2();
                },20)
              }else {
                  this.$message(res.data.message)
              }
          })
      },
      getBasicsData2:function () {//加载仓库名称
        this.httpGet('warehouse/selectList?warehouseTypeId='+this.warehouseTypeId, 'Lwms').then(res=>{
          if(res.data.result===true){
            this.BasicsData2=res.data.params.listData;
            this.defaultData.whId=res.data.params.listData[0].whId;
          }else {
            this.$message(res.data.message)
          }
        })
      },
      getBasicsData3:function () {//加载销售状态
        this.httpGet('refSalesStatus/selectList','', 'Lwms').then(res=>{
          if(res.data.result===true){
            this.BasicsData3=res.data.params.listData;
            this.defaultData.saleStatusId=res.data.params.listData[0].refId;
          }else {
            this.$message(res.data.message)
          }

        })
      },
      getBasicsData4:function () {//按库位号检索
        this.defaultData.locationNo='';
        let whid={
            whId:this.defaultData.whId
        };
        this.httpGet('warehouseLocation/selectList',whid, 'Lwms').then(res=>{
          if(res.data.result===true){
            this.BasicsData4=res.data.params.listData;
//            this.defaultData.whId=res.data.params.listData[0].refId;
          }else {
            this.$message(res.data.message)
          }

        })
      },
      getPictureList:function(){
        console.log('翻页传参 % O',this.defaultData);
        this.httpPost('warehouseInventory/selectList',this.defaultData).then(res => {
          this.TableData=res.data.listData;
          const pageData = res.data;
          this.page.currentPage = pageData.currentPage;
          this.page.totalCount = pageData.totalCount;
          this.page.totalPage = pageData.totalPage;
          this.page.pageSize = pageData.pageSize;
        }).catch(function(err){
          console.log(err);
        })
//        this.$http.get('static/Table2.json').then(res=>{
//          this.TableData=res.data.table;
//          this.TableData2=res.data.table;
//          console.log(this.TableData)
//        })
      },

      RowData:function (row, state) {//行内操作
        let SeeSku={whId:row.whId, productId:row.productId};
        switch(state){
          case '查看':
            this.SkuDialog.Dialog=true;
            console.log(SeeSku)
            this.httpGet('warehouseTradingRec/selectList/productAndWh',SeeSku, 'Lwms').then(res=>{
              if(res.data.result===true){
                this.BasicsData4=res.data.params.dataList;
                this.defaultData.whId=res.data.params.listData[0].refId;
              }else {
                this.$message(res.data.message)
              }
            });
            break;
          case '打印':
              /*------------------------------2017-11-25----S----------------------*/
            this.httpGet('poItem/selectListByProductId',{productId:row.productId},'Scm').then(res =>{
              if(res.data.result == true){
                  this.printData = res.data.params.listData;
                  this.dialogFlag.printDialog = true;
              }else{
                  this.$message(res.data.message);
              }
            })
            /*------------------------------2017-11-25----E----------------------*/
            break;
          case '历史销量':
            this.$router.push({path:'/HistoricalSales'});
            break;
          case '数量':
            this.NumberDialog.Dialog=true;
            this.NumberList=row.detailInventory;
//            this.$set(this.NumberList,row.detailInventory)

            break;
          case '修改':
            this.EditDialog.Dialog=true;
            this.modifyData.whId=row.whId;
            this.modifyData.productId=row.productId;
            break;
          case '收藏':
//            let SeeSku={whId:row.whId, productId:row.productId};
//            let SeeSku2={whId:row.whId, productId:[1,2,1,]};
//            this.httpPost('warehouseInventory/addFavorite', SeeSku , 'Lwms').then(res=>{
              this.httpPost('warehouseInventory/addFavorite',this.qs.stringify(SeeSku) ,'Lwms').then(res=>{//whId=2&productId=20170927110249767000
                console.log(SeeSku)
              if(res.data.result===true){
                    this.getPictureList();
              }else {
                this.$message(res.data.message)
              }
            })
            break;
          case '在途':
              this.Ontheway.Dialog=true;
            this.httpGet('stockTransfer/selectList/productAndWh',SeeSku , 'Lwms').then(res=>{
              if(res.data.result===true){
                this.OnthewayData=res.data.params.listData;
              }else {
                this.$message(res.data.message)
              }
            })
              break;
          case 'SKU':
            this.dialogFlag.isOpen = true;
            this.dialogFlag.docmentNull = true;
            this.dialogFlag.inputDisabled = true;
            this.dialogFlag.dialogTitle='查看';
            this.productId = row.productId;
            this.sonDataFrom.productId = row.productId;
            this.dialogFlag.productId = row.productId;
            this.dialogFlag.prlblemask = true;
            this.dialogFlag.activeTab = '0';
            setTimeout(()=>{
             // this.$refs.imagesfun.getImg();
              this.$refs.msgDialog.requestem();
              this.$refs.describeDialog.addlang();
              this.$refs.logisticsDialog.getLogisTypeForm(row.productId);
            },50)

            break;
        }
      },
      SeeSkuDataFn:function () {//单个

        this.httpPost('warehouseLocation/updateList',this.modifyData, 'Lwms').then(res=>{
          if(res.data.result===true){
            this.EditDialog.Dialog=false;
            this.getPictureList();
          }else {
            this.$message(res.data.message)
          }
        });
      },
      SeeSkuDataFns:function () {//批量库位转移
        let _this=this;
        for(let i=0; i<this.modifyDatas.length; i++){
          this.modifyDatas[i].locationNo=this.modifyData.locationNo;
        }
        for(let i=0; i<this.modifyDatas.length; i++){
          this.httpPost('warehouseLocation/updateList',this.modifyDatas[i], 'Lwms').then(res=>{
            if(res.data.result===true){
              _this.transferDialog.Dialog=false;
              _this.getPictureList();
            }else {
              _this.$message(res.data.message)
            }
          });
        }
      },
      transferFn:function (key) {
//        设置安全库存批量库位转移
        let vm = this;
        vm.whId = vm.modifyDatas.map(item => item.whId);
        if(vm.whId == '' ){
          vm.tips();
        }else{
          if(key==='批量库位转移'){
            this.transferDialog.Dialog=true;
          }else {
            this.SetStockDal.Dal=true;
          }

        }
      },
      SetStock:function () {
        alert('确定 等接口',this.SetStockDal.SetStockData.whId)
      },
      selsChange: function (sels) {//批量操作获取数据
        this.modifyDatas=[];
        this.whId=[];
        for(let i=0; i<sels.length;i++){
          let modifyData={whId:sels[i].whId,productId:sels[i].productId,locationNo:this.modifyData.locationNo};
          this.modifyDatas.push(modifyData);
          this.whId.push(sels[i].whId);
        }

      },

      selectFilter:function(){
        let selectVal = this.selectParams.optionValue;
        let selectTittle = this.selectParams.optionTitle;

        let vm = this;
        switch(selectTittle){
          case 0:
            vm.defaultData.prductNames = '' ;
            break;
          case 1:
            vm.defaultData.skuNos = [] ;
            vm.defaultData.prductNames = selectVal ;
            break;
          case 3:
            vm.defaultData.states = '' ;
            break;
        }
      },
      assignment:function (val) {
//        this.defaultData.keyPath='';
        this.defaultData.keyPath=val;
        console.log(this.defaultData.keyPath)
//        this.getPictureList();
      },
      closeData:function () {//关闭回调清除
        this.modifyData.locationNo='';
      },
      handleClose(tag) {//删除
        this.defaultData.skuNos.splice(this.defaultData.skuNos.indexOf(tag), 1);
      },

      showInput() {
        this.inputVisible = true;
        this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus();
        });
      },
      handleInputConfirm() {
        let inputValue = this.inputValue;
        if (inputValue) {
          this.defaultData.skuNos.push(inputValue);
        }
        this.inputVisible = false;
        this.inputValue = '';
      },
			//分页
      changePageSize:function(val){
        this.defaultData.pageSize=val;
        this.defaultData.currentPage = 1;
        this.getPictureList();
      },
      changeCurrentPage:function(val){
        this.defaultData.currentPage=val;
        this.getPictureList();
      },
      getProductQuest(){
        var _this = this;
        var a='../static';
        _this.httpPost('productDevInfo/getProductQuest?productId='+this.productId).then(res=>{
        	if(res.data!='' && res.data!=null){
            _this.problem.problemparentForm = res.data;
            for(var i=0;i<_this.problem.problemparentForm.length;i++){
              _this.problem.problemparentForm[i].askTime = _this.formatDate(_this.problem.problemparentForm[i].askTime)
            }
          }else{
            _this.problem.problemparentForm=[];
          }


        })
      },
      tabclick(val){
        if(val.index == 5){
          this.getProductQuest();

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
      /*------------------------------2017-11-25----S----------------------*/
      printProduct:function (row){
          //  模块 scm
        var url = this.RmsUrl+'poItem/selectProductLable?Authorization='+sessionStorage.getItem('userSession')+'&productId='+row.productId+'&poId='+row.poId;
        window.open(url);
        //this.tool.openPostWindow(url,params,'导出')
      },
      exportData:function(){
        var type = this.pagefilters.a === '01' ? '0' : '1';
        var params = {};
        // 模块 lwms
        var data = this.defaultData;
        var url = this.RmsUrl+'/warehouseInventory/exportExcel?Authorization='+sessionStorage.getItem('userSession')+'&skuNos='+data.skuNos+ '&whId='+data.whId+
          '&saleStatusId='+data.saleStatusId+'&keyPath='+data.keyPath+'&locationNo='+data.locationNo+'&prductNames='+data.prductNames+ '&exportType='+type;   //  导出地址
        //var url = this.RmsUrl+'productDevLeading/exportModels?Authorization='+sessionStorage.getItem('userSession')+'&addressId=1212';   //  导出地址
       // var url = this.RmsUrl+'financialCorporation/select?Authorization='+sessionStorage.getItem('userSession');   //  导出地址
        //this.tool.openPostWindow(url,params,'blank');
        window.open(url);
      },
		}
	}

</script>

<style scoped>
 /*    2017.11.27     start         */
  .input66{
    width: 200px;
    margin-left:10px;
  }

 /*    2017.11.27     end        */

 .right-table{
    flex: 1;
  }
  .main_content{
    display: flex;
    height: 100%;
    margin-bottom: 10px;
  }
  .left-content{
    border: solid 1px #eef1f6;
    max-width: 300px;
    flex: 0 0 300px;
    height: 100%;
    overflow: auto;
  }
.right-content{
  margin-left:10px;
  flex:1;
  display: flex;
  flex-direction:column;
  overflow: auto;
}
  .butBorder{
    border-bottom: 1px solid #eef1f6;
    padding: 10px 0;
    font-size: 18px;
  }
  .radioStyel{
    margin:10px 0 10px 35px;
    }
  .radioRow{
    border-bottom: 1px solid #eef1f6;
    margin-bottom: 20px;
  }
  .operationNav{
    width: 100%;
    min-height: 100px;
  }
.input-new-tag2{
  width: 100px !important;
}
  .el-tag{
    margin-left: 5px;
  }
  #star-five {
    margin: 5px 0;
    position: relative;
    display: block;
    color: red;
    width: 0px;
    height: 0px;
    border-right:  10px solid transparent;
    border-bottom: 7px  solid red;
    border-left:   10px solid transparent;
    -moz-transform:    rotate(3.5deg);
    -webkit-transform: rotate(3.5deg);
    -ms-transform:     rotate(3.5deg);
    -o-transform:      rotate(3.5deg);
  }
  #star-five:before {
    border-bottom: 8px solid red;
    border-left: 3px solid transparent;
    border-right: 3px solid transparent;
    position: absolute;
    height: 0;
    width: 0;
    top: -4.5px;
    left: -6.5px;
    display: block;
    content: '';
    -webkit-transform: rotate(-3.5deg);
    -moz-transform:    rotate(-3.5deg);
    -ms-transform:     rotate(-3.5deg);
    -o-transform:      rotate(-3.5deg);

  }
  #star-five:after {
    position: absolute;
    display: block;
    color: red;
    top: 0.3px;
    left: -10.5px;
    width: 0px;
    height: 0px;
    border-right: 10px solid transparent;
    border-bottom: 7px solid #fff;
    border-left: 10px solid transparent;
    -webkit-transform: rotate(-7deg);
    -moz-transform:    rotate(-7deg);
    -ms-transform:     rotate(-7deg);
    -o-transform:      rotate(-7deg);
    content: '';
  }
</style>
