<template>
  <div id="outermost_wrap" class="user_manager_wrap">
    <div id="sub_wrap" class="top-nav">
      <CrumbsNav></CrumbsNav>
    </div>
    <div id="content_wrap" class="content_wrap">
      <el-row class="filterOption" id="filterOption" >
        <el-row >
          <el-col :span="2">
            <el-select size="small" v-model="inputTitle" filterable @change="inputValue=''">
              <el-option v-for="item in options" :key="item.label" :label="item.label" :value="item.label"></el-option>
            </el-select>
          </el-col>
          <el-col :span="4" class="optionValue">
            <el-input v-model="inputValue" placeholder="请输入采购订单编号'" size="small" v-if="inputTitle == '按采购订单编号'"></el-input>
            <el-select v-model="pageFilter.whId" filterable clearable placeholder="请选择仓库" size="small" style="width:100%"  v-if="inputTitle == '按供应商名称'">
              <el-option v-for="item in warehouseList" :label="item.whName" :key="item.whId" :value="item.whId"></el-option>
            </el-select>
          </el-col>
          <el-col :span="2">
            <el-button type="primary" size="small" @click="selectFilter(inputTitle,inputValue)">搜索</el-button>
          </el-col>
        </el-row>
      </el-row>
      <el-row id="filer" class="" style="margin-bottom: 20px;">
        <el-collapse v-model="activeNames">
          <el-collapse-item name="1">
            <!--2.0更新-->
            <div class=" flex">
              <div class="span_label">仓库</div>
              <el-radio-group v-model="pageFilter.whId" size="small" @change="getProInspectionList" class="flex1">
                <el-radio-button class="marginBottom" v-for="item in warehouseList" :label="item.whId" :key="item.whId" :value="item.whId" >{{item.whName}}</el-radio-button>
              </el-radio-group>
            </div>
            <div class=" flex">
              <span class="span_label">类型</span>
              <el-radio-group v-model="pageFilter.aaaa" size="small" @change="changeTypes">
                <el-radio-button  label="01" class="marginBottom" v-if="ButtonInfo['按订单列表']!='0'">按订单列表</el-radio-button>
                <el-radio-button  label="02"  class="marginBottom" v-if="ButtonInfo['按任务列表']!='0'">按任务列表</el-radio-button>
              </el-radio-group>
            </div>
            <div class=" flex">
              <span class="span_label">状态</span>
              <el-radio-group v-model="pageFilter.status" size="small" @change="getProInspectionList">
                <el-radio-button  label="01" class="marginBottom" v-if="ButtonInfo['待签收订单']!='0' && pageFilter.aaaa == '01'">待签收订单</el-radio-button>
                <el-radio-button  label="1"  class="marginBottom" v-if="ButtonInfo['待质检列表']!='0' && pageFilter.aaaa == '02'">待质检列表</el-radio-button>
                <el-radio-button  label="2"  class="marginBottom" v-if="ButtonInfo['已质检列表']!='0' && pageFilter.aaaa == '02'">已质检列表</el-radio-button>
                <el-radio-button  label="03" class="marginBottom" v-if="ButtonInfo['已完成订单']!='0' && pageFilter.aaaa == '01'" >已完成订单</el-radio-button>
              </el-radio-group>
            </div>
          </el-collapse-item>
        </el-collapse>
      </el-row>
      <div id="item_list">
        <el-table :data="proInspectionData" border tooltip-effect="dark" style="width: 100%"  v-if="pageFilter.aaaa == '01'">
          <el-table-column type="selection" width="55" align="center"></el-table-column>
          <el-table-column label="操作" align="center" width="100px">
            <template scope="scope">
              <el-tooltip class="item" effect="dark" content="打印物品清单" placement="top-start" v-if="ButtonInfo['打印物品清单']!='0'" >
                <i class="iconfontyyy" @click="toPrintPage('#/productsDetailedList?poId='+scope.row.poId)" >&#xe638;</i>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="生成采购箱麦" placement="top-start" v-if="ButtonInfo['生成采购箱麦']!='0'">
                <i class="iconfontyyy" @click="toPrintPage('#/beingShippingmark?poId='+scope.row.poId)">&#xe6a9;</i>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="采购箱唛历史记录" placement="top-start"     v-if="ButtonInfo['采购箱唛历史记录']!='0' ">
                <i class="iconfontyyy" @click="toPrintPage('#/shippingmarkHistory?poId='+scope.row.poId);" >&#xe61f;</i>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="签收" placement="top-start"     v-if="ButtonInfo['到货']!='0'">
                <i class="iconfontyyy" @click="showArrivalDialog(scope.row);dialogFlag.infoDetail = true" >&#xe608;</i>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="查看" placement="top-start" v-if="ButtonInfo['查看']!='0' && pageFilter.status == '03'">
                <i class="iconfontyyy" @click="taskId=scope.row.taskId;showInfoDialog(scope.row.taskId);dialogFlag.isOpen=true;dialogFlag.inputDisabled=true;dialogFlag.dialogTitle='查看质检详情';" >&#xe600;</i>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column sortable prop="poNo" label="采购单编号" width="180px" align="center"></el-table-column>
          <el-table-column sortable prop="vendorName" label="供应商"   align="center"></el-table-column>
          <el-table-column sortable  prop="skuCount" label="SKU种数" align="center"></el-table-column>
          <el-table-column sortable  prop="amount" label="订单数量总计" align="center"></el-table-column>
          <el-table-column sortable prop="signFor" label=已签收" align="center"></el-table-column>
          <el-table-column sortable prop="enteringWarehouseCount" label="已入库" align="center"></el-table-column>
          <el-table-column sortable prop="warehouse" label="收货仓库" align="center"></el-table-column>
          <el-table-column sortable prop="enteringWarehouseStatus" label="入库状态" align="center"></el-table-column>
          <el-table-column sortable prop="poUser" label="采购员" align="center"></el-table-column>
          <el-table-column sortable prop="addTime" label="采购单创建时间" :formatter="tool.dateFormatter" width="180px" align="center"></el-table-column>
        </el-table>
      </div>
      <div id="item_list">
        <el-table :data="proInspectingData" border tooltip-effect="dark" style="width: 100%" v-if="pageFilter.aaaa == '02'">
          <el-table-column type="selection" width="55" align="center"></el-table-column>
          <el-table-column label="操作" align="center" width="130px">
            <template scope="scope" >
              <el-tooltip class="item" effect="dark" content="查看签收详情" placement="top-start"  v-if="ButtonInfo['查看']!='0'">
              <i class="iconfontyyy" @click="dialogFlag.dialogTitle='查看签收详情';dialogFlag.infoDetail = true">&#xe600;</i>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="打印物品清单" placement="top-start"  v-if="ButtonInfo['打印物品清单']!='0'" >
                <i class="iconfontyyy" @click="toPrintPage('#/productsDetailedList?poId='+scope.row.poId)" >&#xe638;</i>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="质检" placement="top-start" v-if="pageFilter.status == '1' && ButtonInfo['质检']!='0'">
                <i class="iconfontyyy" @click="taskId=scope.row.taskId;poId=scope.row.poId;poNo=scope.row.poNo;showInfoDialog(scope.row.taskId,scope.row.poId,scope.row.poNo);dialogFlag.isOpen=true;dialogFlag.inputDisabled=false;dialogFlag.dialogTitle='录入质检详情';" >&#xe610;</i>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="查看质检详情" placement="top-start" v-if="pageFilter.status == '2'  && ButtonInfo['查看']!='0'">
                <i class="iconfontyyy" @click="taskId=scope.row.taskId;poId=scope.row.poId;poNo=scope.row.poNo;showInfoDialog(scope.row.taskId,scope.row.poId,scope.row.poNo);dialogFlag.isOpen=true;dialogFlag.inputDisabled=true;dialogFlag.dialogTitle='查看质检详情';">&#xe600;</i>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column sortable prop="poNo" label="所属采购单编号" width="180px" align="center"></el-table-column>
          <el-table-column sortable  prop="amount" label="该订单共计任务条数" width="120px" align="center"></el-table-column>
          <el-table-column sortable prop="caseCount" label="签收数量"   align="center"  width="120px"></el-table-column>
          <el-table-column sortable prop="poUser" label="签收员" align="center"></el-table-column>
          <el-table-column sortable prop="addTime" label="签收时间" align="center"  :formatter="tool.dateFormatter" width="180px"></el-table-column>
          <el-table-column sortable prop="poUser" label="状态" align="center"></el-table-column>
          <el-table-column sortable prop="purchaseUser" label="采购员" align="center"></el-table-column>
          <el-table-column sortable prop="addTime" label="采购单创建时间"  width="180px" align="center"></el-table-column>
        </el-table>
      </div>
    </div>
    <div id="page" class="page">
      <el-pagination @size-change="changePageSize" @current-change="changeCurrentPage" :current-page="page.currentPage" :page-sizes="[10,20,30,40]" :page-size="page.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="page.totalCount"></el-pagination>
    </div>
    <!------------------到货--------------------------->
    <el-dialog :title="pageFilter.status == '01' ? '签收' : '查看签收详情'" :visible.sync="dialogFlag.infoDetail" :close-on-click-modal="false" @open="changeType('1');changeType('');" id="borderBottomDialog">
      <el-form label-width="130px" :modal="aaa">
        <el-form-item label="请输入到货的情况:">
          <el-radio-group v-model="type" size="small" @change="changeType" style="width: 100%;" class="marginBottom">
            <el-input type="number" :disabled="pageFilter.status != '01'" class="inputStyle"></el-input>
            <el-radio label="1" :disabled="pageFilter.status != '01'">箱</el-radio>
            <el-radio label="2" :disabled="pageFilter.status != '01'">个</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注：">
          <el-input type="textarea" :disabled="pageFilter.status != '01'"></el-input>
        </el-form-item>
        <el-form-item v-if="pageFilter.status != '01'" label="签收人：">111</el-form-item>
        <el-form-item v-if="pageFilter.status != '01'" label="签收时间：">1111</el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFlag.infoDetail = false;">{{pageFilter.status == '01' ? '取消' : '关闭'}}</el-button>
        <el-button type="primary"  v-if="pageFilter.status == '01'" @click="submitArrivalData();" :loading="$store.state.loading">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 查看 / 录入 质检详情-->
    <el-dialog :title="dialogFlag.dialogTitle" :visible.sync="dialogFlag.isOpen" :close-on-click-modal="false" @close="skuNo = ''">
      <el-row>
        <el-col :span="7" ><el-input v-model="skuNo" placeholder="请输入SKU" size="small"></el-input></el-col>
        <el-col :span="2" style="margin-left:10px;"><el-button type="primary" @click="showInfoDialog(taskId,poId,poNo);" size="small">搜索</el-button></el-col>
      </el-row>
      <div style="margin-top: 20px;border-right:1px solid #dfe6ec;border-bottom:1px solid #dfe6ec;">
        <el-table :data="inspectionDetailData" border tooltip-effect="dark" style="width: 100%">
          <el-table-column sortable prop="skuNo" label="SKU" align="center"  width="130px"></el-table-column>
          <el-table-column sortable prop="proName" label="名称"  align="center" ></el-table-column>
          <el-table-column sortable label="图片" align="center" width="105px">
            <template scope="scope"><img v-if="scope.row.picture != null" :src="scope.row.picture"></template>
          </el-table-column>
          <el-table-column sortable prop="poQty" label="采购数量"  align="center" ></el-table-column>
          <el-table-column sortable prop="invQty" label="已入库数量"  align="center" v-if="pageFilter.status != '03'"></el-table-column>
          <el-table-column sortable label="本次质检正品数" align="center" width="120px">
            <template scope="scope">
              <div v-if="dialogFlag.inputDisabled == false">
                <el-input type="number" min="1" v-model="scope.row.qualityGoods"></el-input>
              </div>
              <span v-if="dialogFlag.inputDisabled == true">{{scope.row.qualityGoods}}</span>
            </template>
          </el-table-column>
          <el-table-column sortable label="本次质检故障品数" align="center"  width="120px">
            <template scope="scope">
              <div v-if="dialogFlag.inputDisabled == false">
                <el-input type="number" min="1" v-model="scope.row.malfunctionGoods"></el-input>
              </div>
              <span v-if="dialogFlag.inputDisabled == true">{{scope.row.malfunctionGoods}}</span>
            </template>
          </el-table-column>
          <el-table-column sortable label="备注" align="center" :show-overflow-tooltip="true" style="padding: 0;height: 100%;">
            <template scope="scope" class="abc" style="height:100%;">
              <div v-if="dialogFlag.inputDisabled == false">
                <el-input type="textarea" v-model="scope.row.dosc" style="height:100%;"></el-input>
              </div>
              <span v-if="dialogFlag.inputDisabled == true">{{scope.row.dosc}}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFlag.isOpen = false;" v-if="dialogFlag.dialogTitle=='查看质检详情'">关闭</el-button>
        <el-button @click="dialogFlag.isOpen = false;" v-if="dialogFlag.dialogTitle=='录入质检详情'">取消</el-button>
        <el-button type="primary" @click="inputtingInspection()"  v-if="dialogFlag.dialogTitle=='录入质检详情'" :loading="$store.state.loading">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  export default{
    data(){
      return {
        options: [{value: 1, label: '按采购订单编号'}, {value: 2, label: '按供应商名称'}],
        activeNames: ['1'],
        inputValue:'',
        inputTitle:'按采购订单编号',
        arrivalPro:{
          taskId:'',
          caseCount:'',
          productList:[{number:'', skuNo:'', storageNumber:'',productId:'',flag:false},]
        },
        proInspectionData:[],
        proInspectingData:[],
        inspectionDetailData:[],
        pageFilter:{
          currentPage:1,
          pageSize:10,
          whId:'',
          poId:'',
          status:'01',
          aaaa:'01',
        },
        page:{          // 分页参数
          currentPage:1,
          pageSize:10,
          totalCount:10,
          totalPage:10
        },
        dialogFlag:{
          isOpen:false,
          infoDetail:false,
          dialogTitle:"",
          inputDisabled:false,
        },
        financeFormLabelWidth:'100px',
        sels:[],
        warehouseList:[],
        skuList:[],
        type:'1',
        skuNo:'',
        taskId:'',
        poId:'',
        whId:'',
        poNo:'',
        indexArr:[0],  // 与到货个数同长度的数组，且数组元素为index
        disableArr:[], // 记录到货个数选中的sku 且后台返回的库位号不为空时的index数组
        index:'',
        ButtonInfo:{},//按钮权限列表20171227
      }
    },
    mounted () {
       this.getauthorityList();
        this.getProInspectionList();
        this.getWarehouseList();
    },
    methods: {
      /*********************页面按钮权限 20171227*****************************/
      getauthorityList(){
        var vm=this;
        vm.ButtonInfo=vm.tool.getBtnPermissions(vm.currentPath);
        console.log('horityList % 0',vm.ButtonInfo)

      },
      /*********************页面按钮权限 20171227*****************************/
      getWarehouseList:function(){
        this.httpPost('productMaterial/getAllWareHouse').then(res =>{
          this.warehouseList = res.data;
        })
      },
      selectFilter:function(title,val){
        this.pageFilter.poId = title == '按采购订单编号' ? val :'';
        this.pageFilter.abnormalNo = title == '按供应商名称' ? val :'';
        this.getProInspectionList();
      },
      changeTypes:function(val){
        val == '01' ? this.pageFilter.status = '01' :  this.pageFilter.status = '02' ? '1' : '';
        this.getProInspectionList();
      },
      getProInspectionList:function(){
        var resetData = function(){
          this.proInspectingData = [] ;
          this.proInspectionData = [];
          this.currentPage = 1,
            this.pageSize = 10,
            this.totalCount = 10,
            this.totalPage = 10
        }
        var url = this.pageFilter.status === '1' ? 'productExamine/selectInspectionList' : this.pageFilter.status === '2' ? 'productExamine/selectInspectionList' :this.pageFilter.status == '01' ? 'productExamine/selectQualityTesting' :'productExamine/selectQualityTesting';
        this.httpPost(url,this.pageFilter).then(res => {
          if(res.data.result == true && JSON.stringify(res.data.params) != '{}'){
                const pageData = res.data.params.list;
                this.page = pageData;
                url == 'productExamine/selectInspectionList' ? this.proInspectingData = pageData.listData : this.proInspectionData = pageData.listData;
            }else{
              resetData();
            }
        }).catch(function(err){
             resetData();
        })
      },
      addItem:function(index,data){
        if(data.length>20){
          this.$message('最多只能添加20个');
        }else{
          data.push({number:'',skuNo:'',storageNumber:'',flag:false});
        }
      },
      deleteItem:function(index,data){
        data.splice(index,1);
        this.delDisArrItem(index);
      },
      showArrivalDialog:function(row){
          this.arrivalPro.taskId = row.taskId;
          this.whId = row.whId;
          this.disableArr = [];
          this.httpPost('productExamine/selectSkuList',{poId:row.poId}).then(res =>{
            if(res.data.result == true){
                this.skuList = res.data.params.list;
            }
          })
      },
      showInfoDialog:function(taskId,poId,poNo){
        var url = this.pageFilter.status == '03' ? 'productExamine/selectTaskProductInfoList': 'productExamine/selectProductTestingInfo'
        this.httpPost(url,{taskId:taskId,poId:poId,poNo:poNo,skuNo:this.skuNo}).then(res =>{
          if(res.data.result == true){
              this.inspectionDetailData = res.data.params.list;
          }
        })
      },
      inputtingInspection:function(){
        var qtyData = [],vm = this;
        this.inspectionDetailData.forEach(item =>{
            qtyData.push({
              id:item.pirId,
              taskId:item.taskId,
              qty:item.qualityGoods,
              defectiveQty:item.malfunctionGoods,
              docs:item.dosc,
              skuNo:item.skuNo,
              poId:vm.poId,
              poNo:vm.poNo,
              productId:item.productId,
              poItemId:item.poItemId,
            })});
        var arr = this.inspectionDetailData;
        var flag = false;
        for(var i=0;i<arr.length;i++){
            if((arr[i].malfunctionGoods == ''||  arr[i].malfunctionGoods  == null) && (arr[i].qualityGoods == '' || arr[i].qualityGoods == null)){
              this.$message('正品数量和故障品不能都为空！');
              flag = false;
              break;
            }else if(arr[i].malfunctionGoods != '' && arr[i].malfunctionGoods  != null && arr[i].malfunctionGoods < 0 ){
              this.$message('故障品不能小于零！');
              flag = false;
              break;
            }else if(arr[i].qualityGoods != '' && arr[i].qualityGoods  != null && arr[i].qualityGoods < 0 ){
              this.$message('正品不能小于零！');
              flag = false;
              break;
            }else{
              flag = true;
            }
        }
        if(flag == true){
           this.httpPost('productExamine/addInspectionQty',qtyData).then(res =>{
             this.$message(res.data.message);
             if(res.data.result == true){
               this.getProInspectionList();
               this.dialogFlag.isOpen = false;
             }
           })
        }
      },
      getProId:function(skuNo,index,data){
          var vm = this;
          this.skuList.forEach(function(item){
              if(skuNo === item.skuNo){
                      data[index].productId = item.productId;
                      vm.httpGet('warehouseLocation/select?productId='+item.productId+'&whId='+vm.whId).then(res =>{
                        if(res.data.result == true){
                            if(res.data.params.warehouseLocation != null){
                                vm.index = index;
                              data[index].storageNumber = res.data.params.warehouseLocation.locationNo;
                              data[index].flag = true;
                            }
                        }
                      })
              }else{
                data[index].productId = '';
                data[index].storageNumber = '';
                data[index].flag = false;
              }
          });
      },
      submitArrivalData:function() {
        var flag = false;
        if (this.type == 1 && (this.arrivalPro.caseCount == '' || this.arrivalPro.caseCount < 1)) {
          this.$message('选择到货箱数类型时箱数必填且大于零！');
        }else if (this.type == 2) {
          var list = this.arrivalPro.productList;
          for (var i = 0; i < list.length; i++) {
            if (list[i].number == '' || list[i].number < 1 || list[i].skuNo == '' || list[i].storageNumber == '') {
              this.$message('选择到货个数类型时个数，sku及库位号为必填项且个数项须大于零！');
              flag = false;
            } else {
              flag = true;
            }
          }
        }else{
          flag = true;
        }
        if(flag){
            this.httpPost('productExamine/addProductArrivalInfo',this.arrivalPro).then(res =>{
              if(res.data.result == true){
                this.dialogFlag.infoDetail = false;
                this.$message(res.data.message);
              }else{
                this.$message(res.data.message);
              }
            })
        }
      },
      changeType:function(val){
        if(val == 1){
            this.arrivalPro.productList = [{number:'', skuNo:'', storageNumber:'',productId:'',flag:false}]
        }else{
          this.arrivalPro.caseCount = '';
        }
      },
      changePageSize:function(val){
        this.pageFilter.pageSize=val;
        this.pageFilter.currentPage = '1';
        this.getProInspectionList();
      },
      changeCurrentPage:function(val){
        this.pageFilter.currentPage=val;
        this.getProInspectionList();
      },
      toPrintPage:function(path){
        var url = '#/'+path;
        window.open(url);
      },
    }
  }
</script>
<style scoped>
.inputStyle{
  width:120px;
  margin-right:10px;
}
</style>
