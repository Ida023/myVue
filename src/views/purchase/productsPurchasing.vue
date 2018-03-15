<template>
    <div id="outermost_wrap">
        <div id="sub_wrap">
            <CrumbsNav></CrumbsNav>
        </div>
        <div id="content_wrap">
          <el-row class=""  :gutter="10">
            <el-col :span="6" class="optionValue">
              <el-input v-model="pageFilter.poNo" size="small" placeholder="请输入采购订单编号"></el-input>
            </el-col>
            <el-col :span="1">
              <el-button type="primary" class="research_btn" id="research_btn" size="small" @click="cleaerscren();getListData();">搜索</el-button>
            </el-col>
          </el-row>
          <el-row  id="filer" class=" marginBottom">
            <el-collapse v-model="activeNames">
              <el-collapse-item name="1">
                <el-row class=" marginBottom">
                  <span class="span_label">审核状态 &nbsp; </span>
                  <el-radio-group v-model="pageFilter.nodeId" size="small" >
                    <el-radio-button label="">全部</el-radio-button>
                  </el-radio-group>
                  <el-radio-group v-model="pageFilter.nodeId" size="small" @change="changeStatus" >
                    <el-radio-button  v-for="(item,index) in NodeIdlist" :key="item.nodeId" :label="item.nodeId"   v-if="ButtonInfo[item.nodeName]!='0'">{{item.nodeName}}</el-radio-button>
                  </el-radio-group>
                </el-row>
                <el-row class=" marginBottom">
                  <span class="span_label">付款状态 &nbsp; </span>
                  <el-radio-group v-model="pageFilter.paymentStatus" size="small" @change="changeStatus">
                    <el-radio-button label="">全部</el-radio-button>
                    <el-radio-button label="未申请付款"    v-if="ButtonInfo['未申请付款']!='0'">未申请付款</el-radio-button>
                    <el-radio-button label="已申请未付款"    v-if="ButtonInfo['已申请未付款']!='0'">已申请未付款</el-radio-button>
                    <el-radio-button label="已申请已付部分"    v-if="ButtonInfo['已申请已付部分']!='0'">已申请已付部分</el-radio-button>
                    <el-radio-button label="已申请已付全部"    v-if="ButtonInfo['已申请已付全部']!='0'">已申请已付全部</el-radio-button>
                  </el-radio-group>
                </el-row>
                <el-row>
                  <span class="span_label">到货状态 &nbsp; </span>
                  <el-radio-group v-model="pageFilter.warehouseStatus" size="small" @change="changeStatus">
                    <el-radio-button label="">全部</el-radio-button>
                    <el-radio-button label="等待到货" v-if="ButtonInfo['等待到货']!='0'">等待到货</el-radio-button>
                    <el-radio-button label="部分到货" v-if="ButtonInfo['部分到货']!='0'">部分到货</el-radio-button>
                    <el-radio-button label="完全到货" v-if="ButtonInfo['完全到货']!='0'">全部到货</el-radio-button>
                  </el-radio-group>
                </el-row>
              </el-collapse-item>
            </el-collapse>
          </el-row>
          <el-row>
            <el-button size="small"  @click="dialogFlag.isOpen = true" type="primary" >筛选</el-button>
          </el-row>
          <el-row class="supplier_btn" >
            <el-button size="small"   type="primary" v-if="pageFilter.nodeId == 'T01' && ButtonInfo['批量提交']!='0'"  @click="openSubmitDialog('','1','Submit');">批量提交</el-button>
            <el-button size="small"   type="primary" v-if="(pageFilter.nodeId == 'T02' || pageFilter.nodeId == 'T05') && ButtonInfo['批量同意']!='0' " @click="openSubmitDialog('','1','Agree');">批量同意</el-button>
            <el-button size="small"   type="primary" v-if="(pageFilter.nodeId == 'T02' || pageFilter.nodeId == 'T05') && ButtonInfo['批量不同意']!='0' "  @click="openSubmitDialog('','1','Noagree');">批量不同意</el-button>
            <el-button size="small"   type="primary" v-if="(pageFilter.nodeId == 'T03' || pageFilter.nodeId == 'T06')  && ButtonInfo['批量撤回']!='0'" @click="openSubmitDialog('','1','Noagree');">批量撤回</el-button>
          </el-row>
          <div id="item_list">
            <el-table  :data="FinisheData"  ref="FinisheData"  border tooltip-effect="dark"   @selection-change="batchChange"  style="width:100%;" @clearSelection="clearbatch">
              <el-table-column type="selection" width="55" align="center"></el-table-column>
              <el-table-column  id="space" label="操作"  align="center" style="word-wrap:break-word;word-break:break-all;">
                <template scope="scope">
                  <el-tooltip content="提交审核" v-if="scope.row.nodeName === '待完善' && ButtonInfo['提交审核']!='0'"  effect="dark" placement="bottom">
                    <i  class="iconfontyyy" @click="openSubmitDialog(scope.row,'2','Submit');" content="Bottom center">&#xe67e;</i>
                  </el-tooltip>
                  <el-tooltip content="编辑" v-if="scope.row.nodeName === '待完善' && ButtonInfo['编辑']!='0'" effect="dark" placement="bottom">
                    <i  class="iconfontyyy" @click="dialogFlag.title='编辑';dialogFlag.infoisOpen=true;openDialog(scope.row,dialogFlag.title='编辑');" content="Bottom center">&#xe6e5;</i>
                  </el-tooltip>
                  <el-tooltip content="添加合同"  effect="dark" placement="bottom" v-if="scope.row.nodeName === '待上传附件' && ButtonInfo['添加合同']!='0'">
                    <i  class="iconfontyyy" @click="addDoc(scope.row);dialogFlag.DocisOpen=true;" content="Bottom center">&#xe623;</i>
                  </el-tooltip>
                  <el-tooltip content="查看" v-if="scope.row.nodeName != '待完善' &&  ButtonInfo['查看']!='0'" effect="dark" placement="bottom">
                    <i  class="iconfontyyy" @click="dialogFlag.infoisOpen=true;openDialog(scope.row,dialogFlag.title='查看');" content="Bottom center">&#xe600;</i>
                  </el-tooltip>
                  <el-tooltip content="付款申请"  effect="dark" placement="bottom" v-if="scope.row.nodeName === '法务审核通过' && ButtonInfo['付款申请']!='0' && scope.row.paymentStatus === '未申请付款'">
                    <i  class="iconfontyyy" @click="dialogFlag.remarksisOpen=true;playDialog(scope.row)" content="Bottom center">&#xe757;</i>
                  </el-tooltip>
                  <el-tooltip content="生成采购箱唛"  effect="dark" placement="bottom" v-if="scope.row.nodeName === '法务审核通过' && ButtonInfo['生成采购箱唛']!='0'">
                    <i  class="iconfontyyy"  content="Bottom center" @click="tool.goToPage('beingShippingmark?poId='+scope.row.poId)">&#xe6a9;</i>
                  </el-tooltip>
                  <el-tooltip content="打印物品清单"  effect="dark" placement="bottom" v-if="scope.row.nodeName === '法务审核通过' && ButtonInfo['打印物品清单']!='0'">
                    <i  class="iconfontyyy"  content="Bottom center" @click="tool.goToPage('productsDetailedList?poId='+scope.row.poId)">&#xe638;</i>
                  </el-tooltip>
                  <el-tooltip content="打印合同"  effect="dark" placement="bottom" v-if="scope.row.nodeName === '法务审核通过' && ButtonInfo['打印合同']!='0'">
                    <i  class="iconfontyyy"  content="Bottom center" @click="tool.goToPage('purchaseContract?poId='+scope.row.poId)">&#xe638;</i>
                  </el-tooltip>
                  <el-tooltip content="采购箱唛历史记录"  effect="dark" placement="bottom" v-if="scope.row.nodeName === '法务审核通过' && ButtonInfo['采购箱唛历史记录']!='0'">
                    <i  class="iconfontyyy"  content="Bottom center" @click="tool.goToPage('shippingmarkHistory?poId='+scope.row.poId)">&#xe61f;</i>
                  </el-tooltip>
                  <el-tooltip content="同意" v-if="(scope.row.nodeName === '待审核'  || scope.row.nodeName === '法务审核') && ButtonInfo['同意']!='0' " effect="dark" placement="bottom">
                    <i  class="iconfontyyy" @click="openSubmitDialog(scope.row,'2','Agree');" content="Bottom center">&#xe67e;</i>
                  </el-tooltip>
                  <el-tooltip content="不同意" v-if="(scope.row.nodeName === '待审核' ||  scope.row.nodeName === '法务审核') && ButtonInfo['不同意']!='0'"  effect="dark" placement="bottom">
                    <i  class="iconfontyyy" @click="openSubmitDialog(scope.row,'2','Noagree');" content="Bottom center">&#xe665;</i>
                  </el-tooltip>
                  <el-tooltip content="撤回" v-if="(scope.row.nodeName === '主管审核不通过' ||  scope.row.nodeName === '法务审核不通过') && ButtonInfo['撤回']!='0'" effect="dark" placement="bottom">
                    <i  class="iconfontyyy" @click="openSubmitDialog(scope.row,'2','Noagree');" content="Bottom center">&#xe666;</i>
                  </el-tooltip>
                </template>
              </el-table-column>
              <el-table-column label="采购单编号"    prop="poNo" align="center"  sortable  ></el-table-column>
              <el-table-column label="采购员"  prop="poUserName" align="center"  sortable ></el-table-column>
              <el-table-column label="创建时间" prop="addTime"  :formatter="tool.formatDate" align="center" sortable >
              </el-table-column>
              <el-table-column label="供应商"  prop="vendorName"  sortable align="center"></el-table-column>
              <el-table-column label="货款小计"  align="center"  prop="totalAmount" sortable ></el-table-column>
              <el-table-column label="其他费用"  align="center"  prop="otherExpenses" sortable ></el-table-column>
              <el-table-column label="抵扣" align="center"  prop="deductionCost"  sortable ></el-table-column>
              <el-table-column label="货款总计" align="center"   prop="allAmount"  sortable ></el-table-column>
              <el-table-column label="交货仓库" align="center" prop="poWarehouse"  sortable >
              </el-table-column>
              <el-table-column label="审核状态" align="center" prop="nodeName"  sortable >
              </el-table-column>
              <el-table-column label="付款状态" align="center" prop="paymentStatus"  sortable >
              </el-table-column>
              <el-table-column label="到货状态" align="center" prop="warehouseStatus"  sortable >
              </el-table-column>
            </el-table>
          </div>
        </div>
        <div id="page" class="page">
            <el-pagination @size-change="changePageSize" @current-change="changeCurrentPage"
                           :current-page="page.currentPage" :page-sizes="[10,20,30,40]" :page-size="page.pageSize"
                           layout="total, sizes, prev, pager, next, jumper" :total="page.totalCount"></el-pagination>
        </div>
      <!--筛选弹窗-->
      <div class="smallDia">
        <el-dialog title="筛选" :visible.sync="dialogFlag.isOpen" size="small" :close-on-click-modal="false" @open="closeDialog">
          <div class="data_body">
            <title-header></title-header>
            <text-input   condition-name="采购单编号"  @child-change-val="getChildren"  :selectValue="poNoo" text-type="poNo" ></text-input>
            <text-input  condition-name="sku"   @child-change-val="getChildren" :selectValue="pageFilter.skuNo" text-type="skuNo"   ></text-input >
            <time-data   :start-time="pageFilter.startDate" condition-name="创建日期" :end-time="pageFilter.endDate" @child-value-Stime="getTime" @child-value-Etime="getTime" ></time-data>
            <el-row class="row">
              <el-col class="col" :span="4">采购员</el-col><el-col class="col" :span="4">是</el-col>
              <el-col class="col_input" :span="16">
                <Merchandiser @assignment="getChildren"  select-type="Name"  :Selected="pageFilter.poUserId"   >
                </Merchandiser>
              </el-col>
            </el-row>
            <el-row class="row">
              <el-col class="col" :span="4">供应商</el-col><el-col class="col" :span="4">是</el-col>
              <el-col class="col_input" :span="16">
                <Vendorlist :select-value="pageFilter.vendorId"  select-type="vend"  place-value="请选择供应商"  @child-change-val="getChildren">
                </Vendorlist>
              </el-col>
            </el-row>
            <el-row class="row">
              <el-col class="col" :span="4">
                交货仓库
              </el-col><el-col class="col" :span="4">是</el-col>
              <el-col class="col_input" :span="16">
                <OwnWarehouseList :select-value="pageFilter.poWarehouse"  select-type="house"  place-value="请选择交货仓库" @child-change-val="getChildren">
                </OwnWarehouseList>
              </el-col>
            </el-row>
          </div>
          <div slot="footer" class="dialog-footer">
            <el-button @click="colseScreen();">清除条件</el-button>
            <el-button @click="screenForm();">筛 选</el-button>
            <el-button @click="dialogFlag.isOpen = false;">取 消</el-button>
          </div>
        </el-dialog>
    </div>
      <!--查看/编辑    弹窗-->
      <div class="smallDia">
        <el-dialog :title="dialogFlag.title" :visible.sync="dialogFlag.infoisOpen" size="large" :close-on-click-modal="false" @open="Contract='2';dialogFlag.activeTab='0';getForm();"  @close="closeDialog();tabListData.purchaseContract=[]">
           <el-tabs v-model="dialogFlag.activeTab"  @tab-click="tabclick">
            <el-tab-pane label="产品&备货"   name="0" >
              <pro-table-list  ref="proList"   :getpo-id="poIdd" :isopen="dialogFlag.infoisOpen" :dis="dialogFlag.inputDisabled" @child-list="getChildList" tabtype="stock"></pro-table-list>
            </el-tab-pane>
            <el-tab-pane label="货款&交付"   name="1" >
              <delivery-form ref="deliveForm" :getpo-id="poIdd" :dis="dialogFlag.inputDisabled" :isopen="dialogFlag.infoisOpen"  @child-list="getChildList" tabtype="delivery"></delivery-form>
            </el-tab-pane>
             <el-tab-pane label="备注"   name="2">
               <el-row style="text-align: right">
                 <el-tooltip content="添加备注"  effect="dark" placement="bottom" >
                   <i  class="iconfontyyy" @click="dialogFlag.RemarkisOpen=true;addRemark(dialogFlag.RemarksTitle='添加备注','');" content="Bottom center">&#xe623;</i>
                 </el-tooltip>
               </el-row>
               <el-row :span="24" class="noteDiv"  v-if="tabListData.purchaseNote.length > 0">
                 <el-col :span="24" v-for="(item,index) in tabListData.purchaseNote" class="note"
                         :key="item.userName">
                   <div>
                     <span>{{item.userName}}</span>
                     <time class="time">{{item.updTime }}</time>
                     <el-col class="noteText">{{item.note}}</el-col>
                     <div class="bottom clearfix deleteNote" >
                       <i class="iconfontyyy"  @click="dialogFlag.RemarkisOpen=true;addRemark(dialogFlag.RemarksTitle='编辑备注',index);"
                          content="Bottom center">&#xe6e5;</i>
                       <i class="iconfontyyy" @click="addRemark(dialogFlag.RemarksTitle='删除备注',index);"   content="Bottom center">&#xe6f7;</i>
                     </div>
                   </div>
                 </el-col>
               </el-row>
             </el-tab-pane>
             <el-tab-pane label="付款&记录" v-if="DialogStatus == '法务审核通过' " name="3" >
               <el-table :data="tabListData.purchasePayLog"  id="item_list" ref="tabListData.purchasePayLog"  border tooltip-effect="dark"   @selection-change="batchChange"  style="width:100%;" >
                 <el-table-column  id="space" label="操作"  align="center" style="word-wrap:break-word;word-break:break-all;">
                   <template scope="scope">
                     <el-tooltip content="查看"  effect="dark" placement="bottom">
                       <i  class="iconfontyyy" @click="" content="Bottom center">&#xe600;</i>
                     </el-tooltip>
                   </template>
                 </el-table-column>
                 <el-table-column label="付款时间" align="center" prop="payTime" :formatter="tool.formatDate"   sortable >
                 </el-table-column>
                 <el-table-column label="付款人" align="center" prop="userName"  sortable >
                 </el-table-column>
                 <el-table-column label="付款金额" align="center" prop="payAmount"  sortable >
                   <template scope="scope">{{scope.row.payAmount}}元</template>
                 </el-table-column>
                 <el-table-column label="付款后剩余未付" align="center" prop="balance"  sortable >
                   <template scope="scope">{{scope.row.balance}}元</template>
                 </el-table-column>
                 <el-table-column label="手续费" align="center" prop="poundage"  sortable >
                   <template scope="scope"> {{scope.row.poundage}}元</template>
                 </el-table-column>
                 <el-table-column label="付款银行" align="center" prop="payBank"  sortable >

                 </el-table-column>
               </el-table>
             </el-tab-pane>
             <el-tab-pane label="合同"  class="preview"   name="4" v-if="DialogStatus == '待上传附件' || DialogStatus == '主管审核不通过' || DialogStatus == '法务审核' || DialogStatus == '法务审核不通过' || DialogStatus == '法务审核通过'">
               <el-upload  :file-list="tabListData.purchaseContract"
                           list-type="picture-card"
                           :on-preview="handlePictureCardPreview"
                           drag  accept=".jpg,.jpeg,.png"
                           :action="uploadPic"
               >
               </el-upload>
               <div   class="downDoc" >
                 <el-button size="small" type="primary" style="float: right"  @click="downDoc('1')" >下载合同</el-button>
               </div>
             </el-tab-pane>
             <el-tab-pane  label="发票" class="preview" v-if="DialogStatus == '法务审核通过'"   name="5"  >
               <el-upload multiple  :http-request="uploadFilePic"  :action="uploadPic"   list-type="picture-card" :on-preview="handlePictureCardPreview"   drag  :file-list="tabListData.purchaseInvoice"  accept=".jpg,.jpeg,.png" >
                 <el-button size="small" type="primary">添加发票</el-button>
               </el-upload>
               <div   class="downDoc" >
                 <el-button size="small" type="primary" style="float: right"  @click="downDoc('2')" v-if="tabListData.purchaseInvoice">下载发票</el-button>
               </div>
             </el-tab-pane>
          </el-tabs>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFlag.infoisOpen = false;" v-if="dialogFlag.inputDisabled == true" >关 闭</el-button>
            <el-button @click="dialogFlag.infoisOpen = false;" v-if="dialogFlag.inputDisabled == false" >取 消</el-button>
            <el-button type="primary" @click="subMiTabList();" v-if="dialogFlag.inputDisabled == false" :loading="$store.state.loading">保 存</el-button>
          </div>
        </el-dialog>
      </div>
        <!--编辑/添加 备注-->
        <el-dialog :title="dialogFlag.RemarksTitle" :visible.sync="dialogFlag.RemarkisOpen" size="small" :close-on-click-modal="false" @close="Remarkobj.note = '';ResetFrom('Remarkobj')" >
          <el-form :model="Remarkobj" :rules="rules" ref="Remarkobj" >
            <el-form-item prop="note"  required >
              <el-input v-model="Remarkobj.note" type="textarea" ></el-input>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
           <el-button type="primary"  @click="dialogFlag.RemarkisOpen = false" >关 闭</el-button>
          <el-button type="primary" @click="subMitRemark('Remarkobj')" :loading="$store.state.loading">确 定</el-button>
        </span>
        </el-dialog>
        <!--付款申请-->
        <el-dialog title="付款申请" :visible.sync="dialogFlag.remarksisOpen" size="small" :close-on-click-modal="false" @close="paymentObj.note = '';" >
          <el-form  :label-width="financeFormLabelWidth" :model="paymentObj" ref="paymentObj" :rules="rules" >
            <el-form-item label="付款申请" prop="note"  :rules="[{ min: 1, max: 50, message: '备注不能超过 50 个字符', trigger: 'blur' }]" >
              <el-input type="textarea" v-model="paymentObj.note"></el-input>
            </el-form-item>
            <!--<el-form-item label="付款人" >

            </el-form-item>-->
          </el-form>
          <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="paySubmit" :loading="$store.state.loading">确 定</el-button>
          <el-button @click="dialogFlag.remarksisOpen = false" >关 闭</el-button>
        </span>
        </el-dialog>
        <!--添加合同-->
        <el-dialog title="添加合同" :visible.sync="dialogFlag.DocisOpen" size="small" :close-on-click-modal="false" @close="picList = [];picListNum=[];" @open="Contract='1'" >
            <el-form >
              <el-form-item  class="picHover">
               <!-- <img :src="picSrc" class="picDetail"    alt="">-->
                <el-upload multiple :file-list="picList"  :on-success="handleChange" :http-request="uploadFilePic"  :action="uploadPic"  :before-upload="beforeAvatarUpload"  list-type="picture-card"  drag  accept=".jpg,.jpeg,.png" >
                <el-button size="small" type="primary">点击上传</el-button>
              </el-upload>
              </el-form-item>
            </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFlag.DocisOpen = false;" >取 消</el-button>
            <el-button type="primary" @click="submitDoc();" :loading="$store.state.loading">确 定</el-button>
          </div>
        </el-dialog>
      <el-dialog v-model="dialogVisible" size="tiny" class="ImgEnlarge"  :close-on-click-modal="false">
        <img width="100%" :src="dialogImageUrl" alt="放大">
      </el-dialog>
    </div>
</template>
<script>
  import timeData from "../../components/ScreenModular/timeDate.vue"
  import titleHeader from "../../components/ScreenModular/title.vue"
  import textInput from '../../components/ScreenModular/textInput.vue'
  import selectInput from '../../components/ScreenModular/selectInput.vue'
  import { Merchandiser } from 'views/product/import_modular';
  import Vendorlist from '../../components/listData/getVendorList.vue'
  import OwnWarehouseList from '../../components/listData/getOwnWarehouseList.vue'
  import proTableList from './SonModula/TabModula/proTableList.vue'
  import deliveryForm from './SonModula/TabModula/deliveryForm.vue'
  import ElButton from "../../../node_modules/element-ui/packages/button/src/button";
  import ElForm from "../../../node_modules/element-ui/packages/form/src/form";

  export default{
    components: {
      ElForm,
      ElButton,
      titleHeader,timeData,textInput,selectInput,Merchandiser,Vendorlist,OwnWarehouseList,
      proTableList,
      deliveryForm
    },
		data(){
			return {
				DialogStatus:'',
        dialogImageUrl: '',
        dialogVisible: false,
        Contract:'',
        purchaseContract:[],
        paymentObj:{
          poId:'',
          note:''
        },
        rules:{
          note:[
            { required: true, message: '请输入备注描述', trigger: 'blur' },
            { min: 1, max: 500, message: '不能超过 500 个字符', trigger: 'blur' }
          ]
        },
        Remarkobj:{
          poId:'',
          note:'',
          id:'',
        },
        note:'',
        financeFormLabelWidth: '90px',
        picSrc:'',
        uploadPic:this.RmsUrl+'/productPurchase/upContract?Authorization='+this.sessuserid,//  上传图片地址
        picList:[],
        provs:[],
        props:{
          label:'vendorName',
          value:'vendorId'
        },
        UserName:'',
        batch:[],
        batchRev:[],

        activeNames:['1'],
        FinisheData:[],
        NodeIdlist:[],
        dialogFlag:{
          isOpen:false,
          title:'',
          infoisOpen:false,
          activeTab:'0',
          tabsArr:['0'],
          inputDisabled:false,
          remarksisOpen:false,
          remarksTitle:'',
          DocisOpen:false,
          RemarksTitle:'',
          RemarkisOpen:false

        },
        tabListData:{
          purchaseNote:[]

        },
				//分页得到的数据集合
				page: {
					currentPage: 1, //当前页数
					pageSize: 10, //每页条数
					totalCount: 0, //总共条数
					totalPage: 0, //总共页数
				},
				//过滤返回数据
        pageFilter: {
					currentPage: 1,
					pageSize: 10,
          processKey:'',//流程定义
          nodeId:'',//审核状态
          poNo:'',//采购单编号
          paymentStatus:'',//付款状态
          warehouseStatus:'',//到货状态
          skuNo:'',
          startDate:'',
          endDate:'',
          poUserId:'',
          vendorId:'',
          poWarehouse:'',//仓库ID
				},
        poNoo:'',
        poIdd:'',
        relaIdd:'',
        nodeIdd:'',
        processKeyy:'',
        picListNum:[],
        filterclear:false,
        ButtonInfo:{},//按钮权限列表20171227
			}
		},
		mounted: function () {
      this.getauthorityList();
      this.getListData();
			this.getnodeIdlist();
			this.addElemntLarge();
		},
		methods: {
      /*********************页面按钮权限 20171227*****************************/
      getauthorityList(){
        var vm=this;
        vm.ButtonInfo=vm.tool.getBtnPermissions(vm.currentPath);
        console.log('horityList % 0',vm.ButtonInfo)

      },
      /*********************页面按钮权限 20171227*****************************/
      cleaerscren(){
      	this.filterclear=true;
        this.pageFilter.nodeId=''; this.pageFilter.startDate = '';
        this.pageFilter.endDate = '';this.pageFilter.skuNo='';this.pageFilter.vendorId='';this.pageFilter.paymentStatus='';this.pageFilter.poUserId='';this.pageFilter.warehouseStatus='';
        this.getListData();
      },
       changeStatus(){
      	if(this.filterclear==false){
          this.pageFilter.poNo='';this.getListData();
        }
       },
      //下载发票
         downDoc(val){
       var vm=this;
       var attachmentIds=[];
       if(val == '2'){
       for(let i=0;i<vm.tabListData.purchaseInvoice.length;i++){
       attachmentIds.push(vm.tabListData.purchaseInvoice[i].attachmentId)
       }

       /*  this.httpPost('productPurchase/invoiceDownload',attachmentIds).then(res=>{

       })*/
       }else if(val == '1'){
       for(let i=0;i<vm.tabListData.purchaseContract.length;i++){
       attachmentIds.push(vm.tabListData.purchaseContract[i].attachmentId)
       }
       }
       var attachmentId = attachmentIds.join();
       console.log('555555 ',attachmentId)
       let session = sessionStorage.getItem('userSession');
       var url = this.RmsUrl+'productPurchase/invoiceDownload?Authorization='+session+'&attachmentId='+attachmentId;
       window.open(url);
       },
      getForm(){
      },
      colseScreen(){
        this.pageFilter.poNo = '';
        this.poNoo = '';
        this.pageFilter.skuNo = '';
        this.pageFilter.poUserId ='';
        this.pageFilter.vendorId ='';
        this.pageFilter.poWarehouse ='';
        this.pageFilter.startDate = '';
        this.pageFilter.endDate = '';

      },
      ResetFrom(formName){
        this.$refs[formName].resetFields();
      },
      beforeAvatarUpload(file) {
        console.log('file.type % 0===',file)
        const isJPG = file.type === 'image/jpeg';
        if (!isJPG) {
          this.$message.error('上传合同只能是 image 格式!');
        }
        return isJPG ;
      },
      handleChange(response, file, fileList) {
        this.getListData();
        //console.log('fileList % 0==',fileList)
        //this.picList = fileList.slice(-3);
      },
      submitDoc(){
        //this.dialogFlag.DocisOpen = false;
      	if(this.picListNum.length <= 0){
      		this.$message('请上传合同！')
        }else{
          this.httpGet('/productPurchase/upFlow?poId='+this.poIdd+'&relaId='+this.relaIdd+'&nodeId='+this.nodeIdd+'&processKey='+this.processKeyy).then(res=>{
          	if(res.data.result == true){
              this.dialogFlag.DocisOpen = false;
              this.getListData();
              this.$message(res.data.message);
            }
          });
        }
      },
      playDialog(val){
        this.poIdd= val.poId ;
      },
      paySubmit(){
        this.paymentObj.poId=this.poIdd;
        this.$refs['paymentObj'].validate((valid) => {
          if (valid) {
            this.httpPost('/productPurchase/requestPay',this.paymentObj).then(res=>{
              this.$message(res.data.message)
              if(res.data.result == true){
                this.dialogFlag.remarksisOpen = false
              }
            })
          }else{


          }
        })

      },
      //图片添加左右切换按钮
      addElemntLarge(){
        var imgElement = document.getElementsByClassName('ImgEnlarge');
        var imgElementChild = imgElement[0].firstChild;
        var newdiv = document.createElement("div");
        var newdiv2 = document.createElement("div");
        imgElementChild.insertBefore(newdiv,imgElementChild.childNodes[0]);
        imgElementChild.appendChild(newdiv2);
        var lastChildd = imgElementChild.lastChild;
        var firstChildd = imgElementChild.firstChild;
        firstChildd.setAttribute('id','imgLeft');
        lastChildd.setAttribute('id','imgRight');
      },
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
        this.dialogFlag.activeTab === '4' ? this.LargeChange(this.tabListData.purchaseContract) : this.dialogFlag.activeTab === '5' ? this.LargeChange(this.tabListData.purchaseInvoice) : '';
      },
      LargeChange(arr){
        var vm=this;
        var imgIndex='';
        var docImgarr = arr.map(item => item.url);
        for(let i=0;i<docImgarr.length;i++){
          imgIndex = docImgarr.indexOf(vm.dialogImageUrl);
        }
        var divM = document.getElementById("imgLeft");
        divM.onclick = function () {
          imgIndex++;
          if(imgIndex > docImgarr.length -1){
            vm.$message('已经是最后一张啦！');
            imgIndex=docImgarr.length-1;
          }
          vm.dialogImageUrl = docImgarr[imgIndex];
        }
        var divR = document.getElementById("imgRight");
        divR.onclick = function () {
          imgIndex--;
          if(imgIndex < 0){
            vm.$message('已经是第一张啦！');
            imgIndex=0;
          }
          vm.dialogImageUrl = docImgarr[imgIndex];
        }
      },
      addRemark(title,data){
      	var vm=this;
        var id='';
        vm.tabListData.purchaseNote.forEach(function(i,index,arr){
        	id = arr[data].id;
        });
        var url='/productPurchase/deleteNote?id='+id;
        if(title == '编辑备注'){
          vm.getNote(id);
        }else if(title == '添加备注'){
        	id='';
        }else if(title == '删除备注'){
        	var obj={};
        	obj.poId=this.poIdd;
          vm.$confirm('此操作将删除该文件, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.httpPost(url).then(res=>{
              if(res.data.result == true){
                vm.$message(res.data.message);
                vm.tabListData.purchaseNote.splice(data,1);
                setTimeout(vm.openDialog(obj,''),20);
              }else{
                vm.$message(res.data.message)
              }
            })
          }).catch(() => {
            vm.$message({
              type: 'info',
              message: '已取消删除'
            });
          });
        }
      },
      getNote(id){
         this.httpPost('/productPurchase/singleNote?id='+id).then(res => {
           this.Remarkobj.note = res.data.note;
           this.Remarkobj.id = res.data.id;

    })},
      subMitRemark(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.Remarkobj.poId = this.poIdd;
            if(this.dialogFlag.RemarksTitle == '添加备注'){
              this.Remarkobj.id = '';
            }
            this.httpPost('/productPurchase/note',this.Remarkobj).then(res => {
              if(res.data.result == true){
                this.$message(res.data.message);
                for(var item of res.data.params.notes){
                  item.updTime = this.tool.formatDate('','',item.updTime);
                }
                this.tabListData.purchaseNote = res.data.params.notes;
                this.dialogFlag.RemarkisOpen = false;
              }else{
                this.$message(res.data.message)
              }
            })
          } else {
            return false;
          }
        });
      },
      subMiTabList(){
      	var _this=this;
      	if(_this.dialogFlag.activeTab==='0'){
         _this.$refs.proList.submitList();
        }else if(_this.dialogFlag.activeTab==='1'){
         _this.$refs.deliveForm.submitForm();
        }else if(_this.dialogFlag.activeTab==='2'){
          _this.dialogFlag.infoisOpen = false
        }
        //setTimeout(_this.getListData(),100)

      },
      getChildList(val){
        //alert(val)
        //val === true ? this.dialogFlag.infoisOpen = false : '';
        val === true ?  this.getListData() :'';
      },
      openDialog(val,info){
      	console.log('val % 0  99999========',val)
      	this.poIdd = val.poId;
        this.poNoo = val.poNo;
        this.relaIdd = val.relaId;
        this.nodeIdd=val.nodeId;
        this.processKeyy = this.NodeIdlist[1].processKey;
      	this.DialogStatus = val.nodeName;
      	console.log('	this.DialogStatus====='+	this.DialogStatus)
        info == '编辑' ? this.dialogFlag.inputDisabled = false : this.dialogFlag.inputDisabled = true;
      	//alert('1111'+this.dialogFlag.inputDisabled)
        this.httpPost('/productPurchase/query?poId='+this.poIdd).then(res => {
          var vm=this;
          vm.tabListData=res.data;
          if(res.data.purchaseNote){
          	for(var item of res.data.purchaseNote){
              item.updTime = this.tool.formatDate('','',item.updTime);
            }
            this.tabListData.purchaseNote = res.data.purchaseNote;
          }
          //alert(vm.tabListData.purchaseNote.length)
          if(res.data.purchaseContract){
            var arrImg = res.data.purchaseContract;
            var newImg = [];
            for(let i=0;i<arrImg.length;i++){
              newImg.push({url:arrImg[i].imageUrl,id:arrImg[i].id,attachmentId:arrImg[i].attachmentId});
            }
            vm.tabListData.purchaseContract = newImg;
          }
          if(res.data.purchaseInvoice){
            var Invoice = res.data.purchaseInvoice;
            var newInvoice = [];
            for(let i=0;i<Invoice.length;i++){
              newInvoice.push({url:Invoice[i].imageUrl,id:Invoice[i].id,attachmentId:Invoice[i].attachmentId});
            }
            vm.tabListData.purchaseInvoice = newInvoice;
          }
        })
      },
      getTime:function(val){
        val.type == 'start' ? this.pageFilter.startDate = val.value : this.pageFilter.endDate = val.value;
      },
      getChildren(data){
      	  data.type === 'poNo'? this.poNoo = data.value : data.type==='skuNo' ? this.pageFilter.skuNo = data.value : data.type==='Name' ? this.pageFilter.poUserId = data.value : data.type === 'vend' ? this.pageFilter.vendorId = data.value :
          data.type === 'house' ? this.pageFilter.poWarehouse = data.value : '' ;
      	},
      screenForm(){
      	this.pageFilter.poNo = this.poNoo;
        this.dialogFlag.isOpen = false;
        this.getListData();
      },
      addDoc(val){
        this.poNoo = val.poNo;
        this.poIdd = val.poId;
        this.relaIdd = val.relaId;
        this.nodeIdd=val.nodeId;
        console.log('this.NodeIdlist[1].processKey; % 0=====',this.NodeIdlist[0].processKey);
        this.processKeyy = this.NodeIdlist[1].processKey;
      },
      uploadFilePic(options){
        console.log('dataoptions % 0===',options);
        var upNo='';
        let data = new FormData();
        data.append(options.filename, options.file);
        console.log('data % 0===',data);
        let url='';
        upNo = this.Contract === '1'  ?  1 : 2;
        url = this.Contract === '1' ? 'productPurchase/upContract?poId='+this.poIdd+'&poNo='+this.poNoo+'&upNo='+upNo :'productPurchase/upContract?poId='+this.poIdd+'&poNo='+this.poNoo+'&relaId='+this.relaIdd+'&nodeId='+this.nodeIdd+'&upNo='+upNo+'&processKey='+this.processKeyy;
        this.httpPost(url,data).then(res => {
          if(res.data.result == true){
          	//alert(options.onSuccess.length);
            this.picListNum.push(options.onSuccess.length);
            this.$message(res.data.message)
          }else{
          	this.$message(res.data.message)
          }
        })
      },
      tabclick(){
        this.dialogFlag.activeTab=='1'? this.$refs.deliveForm.getList():'';
      },
      closeDialog(){
      //	setTimeout(function(){  this.$refs.deliveForm.resetForm();  this.$refs.proList.remove();},100);
        this.tabListData.purchaseContract=[];
        this.tabListData.purchaseNote=[];
        this.tabListData.purchaseInvoice=[];
        this.poNoo = '';
        this.dialogFlag.activeTab='0';
        this.pageFilter.poNo = '';
        this.pageFilter.skuNo = '';
        this.pageFilter.poUserId ='';
        this.pageFilter.vendorId='';
        this.pageFilter.poWarehouse='';
        this.pageFilter.startDate = '';
        this.pageFilter.endDate = '';
      },
      getLoanList(val){
        this.pageFilter.nodeId = val;
        this.getListData();
      },
      batchChange(val){
      	console.log('8888888888888888888888888888% 0===',val)
        var list=val;
        var a=[];
        var b=[];
        list.forEach(function(i,index){
          a.push({relaId:i.relaId,nodeId:i.nodeId,poId:i.poId});
          b.push({relaId:i.relaId,nodeId:i.nodeId,poId:i.poId,approve:1});
        });
        this.batch = a;
        this.batchRev = b;
      },
      clearbatch(val){
      },
      getListData(){
        this.httpPost('/productPurchase/list',this.pageFilter).then(res =>{
        	this.FinisheData = res.data.listData;
          this.page = res.data;
          this.filterclear=false;
        })
			},
      getnodeIdlist(){
        this.httpPost('/productPurchase/flowStatus').then(res =>{
        	console.log(res.data)
          this.NodeIdlist = res.data
        })
      },
      openSubmitDialog(row,val,stauts){
      	 var vm =this,msg='',url='',poId=[],approve = '',id=[],batch =[];
         approve = stauts == 'Agree' ? '1' : '0';
         stauts == 'Submit' ?  id.push({relaId:row.relaId,nodeId:row.nodeId,poId:row.poId}) :  id.push({relaId:row.relaId,nodeId:row.nodeId,poId:row.poId,approve:approve});
         msg = stauts == 'Submit' ? '您确定提交此采购单进行审核？':stauts == 'Agree' ? '您确定同意此采购单？' : '您确定回退此采购单？';
         url = stauts == 'Submit' ? 'productPurchase/pendingAudit' : 'productPurchase/audit';
         batch = stauts == 'Submit' ? vm.batch : vm.batchRev;
         poId = val == '1' ? batch : id;
          for(let i=0;i<vm.batchRev.length;i++){
              stauts == 'Agree' ? vm.batchRev[i].approve = '1' : vm.batchRev[i].approve = '0';
           }
        poId.length < 1 ? vm.tips() : vm.doItem(msg,url,poId,vm.getListData);
       },
			//分页
			changePageSize: function (val) {
				this.pageFilter.pageSize = val;
				this.pageFilter.currentPage = 1;
				this.getListData();
			},
			changeCurrentPage: function (val) {
				this.pageFilter.currentPage = val;
				this.getListData();
			},

		}
	}

</script>

<style scoped>
  .noteDiv{
    border:1px solid #d1dbe5;
    padding:10px;
    margin-top:10px;
  }
.note{
  border-bottom: 1px solid #d1dbe5;
  margin-bottom:7px;
  position: relative;
}
.note .deleteNote{
  text-align: center;
  position: absolute;
  top: 1px;
  right: 2px;
}
.note .noteText{
  padding:10px 0;
}
  .ImgEnlarge .el-dialog::before,.ImgEnlarge .el-dialog::after{
    display: inline-block;
    content:'56555';
    width: 50px;
    height: 50px;
    color: red;
    position: absolute;
    top:50%;
  }

  .ImgEnlarge .el-dialog::before{
    left:-20px;
    text-align: left;

  }
  .ImgEnlarge .el-dialog::after{
    right:-20px;
    text-align: right;
  }
</style>
