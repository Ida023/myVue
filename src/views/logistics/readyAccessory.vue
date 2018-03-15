<template>
   <div id="outermost_wrap">
     <div id="sub_wrap">
       <CrumbsNav></CrumbsNav>
     </div>
     <div id="content_wrap">
       <el-row class="marginBottom">
         <OwnWarehouseList  :selectValue="pagefilters.whId"  select-type="house"  default="defaultt" placeValue="请选择仓库"  size="small"  @child-change-val="getChildren"   @child-change='getHouse' ></OwnWarehouseList>
       </el-row>
       <el-row  id="filer" class="marginBottom">
         <el-collapse v-model="activeNames">
           <el-collapse-item name="1">
             <span class="span_label">状态</span>
             <el-radio-group v-model="pagefilters.whStatus" size="small"   @change="pagefilters.skuNo='';pagefilters.orderNo='';pagefilters.userId='';pagefilters.startDate ='';pagefilters.endDate ='';getAccessList();" >
               <el-radio-button label="01" >待发配件</el-radio-button>
               <el-radio-button label="04" >待从新品取配件发货(待审核)</el-radio-button>
               <el-radio-button label="02" >待从新品取配件发货(已审核)</el-radio-button>
               <el-radio-button label="03" >已发配件</el-radio-button>
             </el-radio-group>
           </el-collapse-item>
         </el-collapse>
       </el-row>
       <el-row class="marginBottom" style="border-bottom:1px solid #bfcbd9;padding-bottom: 10px;">
         <el-button size="small"  type="primary" @click="dialogFlag.sccrenisOpen = true" >筛选</el-button>
       </el-row>
       <el-row class="supplier_btn">
         <el-button type="primary" size="small" v-if="pagefilters.whStatus == '01' || pagefilters.whStatus == '02'" @click="statusChange('','logist')" >批量设置物流方式</el-button>
         <el-button type="primary" size="small" v-if="pagefilters.whStatus == '01' || pagefilters.whStatus == '02'" @click="">批量打印地址标签</el-button>
         <el-button type="primary" size="small" v-if="pagefilters.whStatus == '01'" @click="statusChange('','status')" >批量从新品发货</el-button>
       </el-row>
       <div id="item_list">
         <el-table  :data="AccessoryData"  ref="AccessoryData"  border tooltip-effect="dark"  @selection-change="batchChange"   style="width:100%;" >
           <el-table-column type="selection" width="55" align="center"></el-table-column>
           <el-table-column  id="space" label="操作"  align="center" style="word-wrap:break-word;word-break:break-all;">
             <template scope="scope" >
               <el-tooltip content="设置状态"  v-if="scope.row.whStatus == '待发货' " effect="dark" placement="bottom">
                 <i  class="iconfontyyy" @click="statusChange(scope.row,'status');" content="Bottom center">&#xe60d;</i>
               </el-tooltip>
               <el-tooltip content="设置物流方式"  effect="dark" v-if="scope.row.whStatus == '待发货' || scope.row.whStatus == '待从新品发货' " placement="bottom">
                 <i  class="iconfontyyy" @click="statusChange(scope.row,'logist');" content="Bottom center">&#xe604;</i>
               </el-tooltip>
               <el-tooltip content="打印地址" v-if="scope.row.whStatus != '待审核'" effect="dark" placement="bottom" >
                 <i  class="iconfontyyy"      content="Bottom center">&#xe633;</i>
               </el-tooltip>
               <el-tooltip content="跟踪单号" v-if="scope.row.whStatus == '待发货' || scope.row.whStatus == '待从新品发货' " effect="dark" placement="bottom" >
                 <i   class="iconfontyyy"    content="Bottom center" @click="TrackChange(scope.row)" >&#xe617;</i>
               </el-tooltip>
               <el-tooltip content="打印邮票"  effect="dark"  v-if="scope.row.whStatus != '待审核'" placement="bottom">
                 <i  class="iconfontyyy"   content="Bottom center">&#xe601;</i>
               </el-tooltip>
               <el-tooltip content="修改运费" v-if="scope.row.whStatus == '已发货'" effect="dark"   placement="bottom" >
                 <i  class="iconfontyyy" @click="dialogFlag.freightisOpen = true;getquerySingle(scope.row.reqId)"  content="Bottom center">&#xe62b;</i>
               </el-tooltip>
               <el-tooltip content="修改跟踪单号"   effect="dark"  placement="bottom" v-if="scope.row.whStatus == '已发货'">
                 <i  class="iconfontyyy"  @click="dialogFlag.signedisOpen = true;getquerySingle(scope.row.reqId)" content="Bottom center">&#xe6e5;</i>
               </el-tooltip>
             </template>
           </el-table-column>
           <el-table-column label="订单编号"  prop="orderNo"  sortable align="center"></el-table-column>
           <el-table-column label="SKU图片"  prop="" align="center"  sortable >
             <template scope="scope">
               <img v-if="scope.row.productImageUrl!=null" :src="scope.row.productImageUrl" :data-src="scope.row.productImageUrl">
             </template>
           </el-table-column>
           <el-table-column label="SKU"    prop="skuNo" align="center"  sortable  ></el-table-column>
           <el-table-column label="产品名称" prop="cnName"   align="center" sortable >
           </el-table-column>
           <el-table-column label="发货物品图片"  align="center"  prop="" sortable >
             <template scope="scope">
               <img v-if="scope.row.imageUrl!=null" :src="scope.row.imageUrl" :data-src="scope.row.imageUrl">
             </template>
           </el-table-column>
           <el-table-column label="创建人" align="center" prop="reqUserName"  sortable >
           </el-table-column>
           <el-table-column label="收件人信息"  align="left"   width="180"  prop="" sortable >
             <template scope="scope">
               客户ID:{{scope.row.customerId}}<br>客户姓名:{{scope.row.customerName}}<br>地址1:{{scope.row.address1}}<br>市:{{scope.row.city}}<br>区:{{scope.row.district}}<br>州:{{scope.row.state}}<br>邮编:{{scope.row.postCode}}<br>手机:{{scope.row.phone}}<br>国家:{{scope.row.cuntryArea}}
             </template>
           </el-table-column>
           <el-table-column label="物流方式" align="center"  prop="whLogisticsCnName"  sortable ></el-table-column>
           <el-table-column label="状态" align="center"   prop="whStatus"  sortable ></el-table-column>
           <el-table-column label="发货时间" align="center" prop="whTime"  :formatter="tool.formatDate" sortable >
           </el-table-column>
           <el-table-column label="物流跟踪单" align="center" prop="trackingNo"  sortable >
           </el-table-column>
           <el-table-column label="备注信息" align="center" prop="reqMemo"   sortable >
           </el-table-column>
         </el-table>
       </div>
     </div>
     <!--筛选弹窗-->
     <div class="smallDia">
       <el-dialog title="筛选" :visible.sync="dialogFlag.sccrenisOpen" size="small" :close-on-click-modal="false"  @open="colseScreen();">
         <div class="data_body">
           <title-header></title-header>
           <text-input   condition-name="订单编号"  @child-change-val="getChildren"  :selectValue="pagefilters.orderNo" text-type="poNo" ></text-input>
           <el-row class="row">
             <el-col class="col" :span="4">SKU</el-col><el-col class="col" :span="4">是</el-col>
             <el-col class="col_input" :span="16">
               <SkuList  :selectValue="pagefilters.skuNo" @child-change-val="getChildren" @child-list="getid" select-type="skuNo"></SkuList>
             </el-col>
           </el-row>
           <el-row class="row">
             <el-col class="col" :span="4">创建人</el-col><el-col class="col" :span="4">是</el-col>
             <el-col class="col_input" :span="16">
               <FounderList  :selectValue="pagefilters.userId"  @child-change-val="getChildren"   select-type="userId">
               </FounderList  >
             </el-col>
           </el-row>
           <time-data  conditionName="创建日期"  :start-time="pagefilters.startDate" :end-time="pagefilters.endDate" @child-value-Stime="getTime" @child-value-Etime="getTime" ></time-data>
         </div>
         <div slot="footer" class="dialog-footer">
           <el-button @click="colseScreen">清除条件</el-button>
           <el-button @click="dialogFlag.sccrenisOpen = false;getAccessList();">筛 选</el-button>
           <el-button @click="dialogFlag.sccrenisOpen = false;" >取 消</el-button>
         </div>
       </el-dialog>
     </div>
     <!--设置物流方式弹窗-->
     <el-dialog title="设置物流方式"  :visible.sync="dialogFlag.logistisOpen" size="tiny"  :close-on-click-modal="false" @open="" @colse="IdList = [];">
         <el-form labelWidth="80px">
           <el-form-item label="物流方式" >
             <LogisticsList size="small" :selectValue="methodId"  :houseValue="pagefilters.whId" @child-change-val="getLogistList" ></LogisticsList>
           </el-form-item>
         </el-form>
       <div slot="footer" class="dialog-footer">
         <el-button @click="dialogFlag.logistisOpen =  false;">取 消</el-button>
         <el-button @click="submitlogist" type="primary" :loading="$store.state.loading">确 定</el-button>
       </div>
     </el-dialog>
     <!--跟踪单号弹窗-->
     <el-dialog title="标记发货（需要跟踪单号）"  :visible.sync="dialogFlag.signisOpen"  size="tiny" :close-on-click-modal="false"  @close="closedata">
       <el-form labelWidth="80px">
         <el-row :span="18">
           <el-form-item label="跟踪单号">
             <el-input type="text" v-model="trackingNo"></el-input>
           </el-form-item>
         </el-row>
       </el-form>
       <div slot="footer" class="dialog-footer">
         <el-button @click="dialogFlag.signisOpen = false" >取消</el-button>
         <el-button type="primary" @click="submitsign('sign')">标记发货</el-button>
         <el-button type="primary" @click="submitsign('');">保存跟踪单号</el-button>
       </div>
     </el-dialog>
     <!--修改运费-->
     <el-dialog title="修改运费"  :visible.sync="dialogFlag.freightisOpen" size="tiny" :close-on-click-modal="false"  @close="IdList = [];freightCost='';">
       <el-form labelWidth="100px">
         <el-form-item label="原始运费:" >
           <span> {{freightCostt}}</span>
         </el-form-item>
         <el-form-item label="修改运费:" >
           <el-input type="text" v-model="freightCost"></el-input>
         </el-form-item>
       </el-form>
       <div slot="footer" class="dialog-footer">
         <el-button @click="dialogFlag.freightisOpen =  false;">取 消</el-button>
         <el-button @click="submitFreightCost" type="primary" :loading="$store.state.loading">确 定</el-button>
       </div>
     </el-dialog>
     <!--修改跟踪单号-->
     <el-dialog title="修改跟踪单号"  :visible.sync="dialogFlag.signedisOpen" size="tiny" :close-on-click-modal="false"  @close="IdList = []; trackingNo = '';">
       <el-form labelWidth="">
         <el-form-item label="" >
           <el-input type="textarea" v-model="trackingNo"></el-input>
         </el-form-item>
       </el-form>
       <div slot="footer" class="dialog-footer">
         <el-button @click="dialogFlag.signedisOpen =  false;">取 消</el-button>
         <el-button @click="submitsign('')" type="primary" :loading="$store.state.loading">确 定</el-button>
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
  import OwnWarehouseList from 'components/listData/getOwnWarehouseList.vue'
  import FounderList from '../../components/listData/GetFounderList.vue'
  import textInput from 'components/ScreenModular/textInput.vue'
  import LogisticsList from 'components/listData/getLogisticsList.vue'
  import timeData from "components/ScreenModular/timeDate.vue"
  import titleHeader from "components/ScreenModular/title.vue"
  import SkuList from 'components/listData/getSkuList.vue'
  export default{
    components: {
      OwnWarehouseList,titleHeader,textInput,timeData,LogisticsList,FounderList,SkuList},
    data(){
      return {
        poNoo:'',
        skuNo:'',
        startDate:'',
        endDate:'',
        dialogFlag:{
          sccrenisOpen:false,
          inputDisabled:false,
          logistisOpen:false,
          signisOpen:false,
          deliveryisOpen:false,
          AddresseeisOpen:false,
          freightisOpen:false,
          signedisOpen:false
        },
        AccessoryData:[],
        activeNames: ['1'],    //  筛选 功能的折又又叠面板
        //分页得到的数据集合
        page: {
          currentPage: 1, //当前页数
          pageSize: 10, //每页条数
          totalCount: 0, //总共条数
          totalPage: 0, //总共页数
        },
        //过滤返回数据
        pagefilters: {
          currentPage: 1,
          pageSize: 10,
          whId:'',
          orderNo:'',
          skuNo:'',
          whStatus:'01',
          userId:'',
          startDate:'',
          endDate:'',
        },
        pagefilter: {
          currentPage: 1,
          pageSize: 10,

        },
        IdList:[],
        methodId:'',
        freightCostt:'',
        freightCost:'',
        trackingNo:'',
        newUsed:'',
      }
    },
    mounted: function () {
     // this.getAccessList();
    },
    methods: {
      closedata() {
        this.IdList = [];
      },
      getid(data){
      	this.pagefilters.skuNo = data;
      },
      getquerySingle(id){
        this.IdList.push(id);
        this.httpPost('partsApply/querySingle?reqId='+id).then(res=>{
        	this.trackingNo = res.data.trackingNo;
        	this.freightCostt =parseFloat(res.data.freightCost) ;
        })
      },
      submitsign(signdata){
        var obj={};
        obj.trackingNo = this.trackingNo;
        obj.reqIds = this.IdList;
        obj.trackingNo == '' ? this.$message('请填写跟踪单号！') : this.submitDialog(obj,'1',signdata);
      },
      submitlogist(){
      	var obj={};
      	obj.methodId=this.methodId;
      	obj.reqIds=this.IdList;
        obj.methodId == null ? this.$message('请选择物流方式！') : this.submitDialog(obj,'2','');
      },
      submitFreightCost(){
        var obj = {};
        obj.freightCost=this.freightCost;
        obj.reqIds = this.IdList;
        obj.freightCost == '' ? this.$message('请填写运费！') : this.submitDialog(obj,'3','');
      },
      submitDialog(obj,isopen,data){
        this.httpPost('partsApply/edit',obj).then(res=>{
          if(res.data.result == true){
          	if(data === 'sign'){
          		this.subMitdelivery();
            }else{
              this.$message(res.data.message);
              this.dialogFlag.signisOpen == true ? this.dialogFlag.signisOpen = false : '' ;
              isopen == '1' ? this.dialogFlag.signedisOpen = false : isopen == '2' ? this.dialogFlag.logistisOpen = false : this.dialogFlag.freightisOpen = false;
              this.getAccessList();
            }
          }else{
            this.$message(res.data.message);
          }
        })
      },

      getLogistList(data){
      	this.methodId= data.value;
      },
    	statusChange(val,data){
        var vm =this,msg='',url='',poId=[],id=[],obj={};
        vm.methodId = data =='logist' ? val.whLogisticsCnName : '';
        val == '' ? poId = vm.IdList : poId.push(val.reqId);
        url= data == 'logist' ? 'partsApply/edit' : 'partsApply/applyNew' ;
        msg = data == 'logist' ? '':"您确定需要从新品中拿货？申请之后需第三方审核，该条数据将进入'待从新品取配件发货'。" ;
        vm.IdList = poId;
        if(poId.length == 0){
          vm.tips();
        }else {
          data == 'logist' ? vm.dialogFlag.logistisOpen = true :  vm.doItem(msg,url,poId,vm.getAccessList);
        }
      },

      TrackChange(val){
    		var vm=this;
        vm.newUsed = val.whStatus == '待发货' ? '0' : '1';
        vm.IdList.push(val.reqId);
        vm.trackingNo = val.trackingNo;
        var obj={};
        obj.reqId = val.reqId;
        obj.newUsed = vm.newUsed;
    		val.isNeedTrackingNo == '0' ? vm.doItem("您确定该小配件订单已经发货？",'partsApply/deliverGoods',obj,this.getAccessList): vm.dialogFlag.signisOpen = true;
      },
      subMitdelivery(){
          var obj={};
          obj.reqId = this.IdList.join();
          obj.newUsed = this.newUsed;
          this.httpPost('partsApply/deliverGoods',obj).then(res=>{
            if(res.data.result == true){
              this.dialogFlag.signisOpen = false;
              this.getAccessList();
              this.$message(res.data.message)
            }else{
              this.$message(res.data.message)
            }
          })
      },
      colseScreen(){
        this.pagefilters.skuNo='';
        this.pagefilters.orderNo='';
        this.pagefilters.userId='';
        this.pagefilters.startDate ='';
        this.pagefilters.endDate ='';
      },
      batchChange(val){
        this.IdList = val.map(item => item.reqId);
      },
      getTime:function(val){
        val.type == 'start' ? this.pagefilters.startDate = val.value : this.pagefilters.endDate = val.value;
      },
      getChildren(data){
        data.type === '订单编号'? this.pagefilters.orderNo = data.value : data.type==='skuNo' ? this.pagefilters.skuNo = data.value : data.type==='userId' ? this.pagefilters.userId = data.value : '';
        if(data.type ==='house'){
          this.pagefilters.whId=data.value;
          this.getAccessList();
        }
        },
      getchangeList( val ){
        this.getinfoModel.isOpen = false;
      },
      getHouse(data){
        var valarr=data.map(item => item.value);
        this.pagefilters.whId = valarr[0];
      },
      getAccessList(){
        this.httpPost('partsApply/readyList',this.pagefilters).then(res =>{
          this.AccessoryData=res.data.listData;
          this.page=res.data;
        })
      },
      //分页
      changePageSize: function (val) {
        this.pagefilters.pageSize = val;
        this.pagefilters.currentPage = 1;
        this.getAccessList();
      },
      changeCurrentPage: function (val) {
        this.pagefilters.currentPage = val;
        this.getAccessList();
      },

    }
  }

</script>

<style scoped>


</style>
