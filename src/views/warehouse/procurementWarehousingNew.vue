<template>
  <div id="outermost_wrap" class="role" style="">
    <div id="sub_wrap" class="top-nav">
      <CrumbsNav></CrumbsNav>
    </div>
    <div id="content_wrap" class="content_wrap">
      <el-row class="filterOption" id="filterOption" >
        <el-col :span="4" class="optionValue">
          <el-input v-model="pageFilter.poNo" placeholder="请输入采购订单编号" size="small"></el-input>
        </el-col>
        <el-col :span="2">
          <el-button type="primary" size="small" @click="getProcurrementList">搜索</el-button>
        </el-col>
      </el-row>
      <el-row id="filer" class="">
        <el-collapse v-model="activeNames">
          <el-collapse-item name="1">
            <div class=" flex">
              <div class="span_label">仓库</div>
              <el-radio-group v-model="pageFilter.whId" size="small" @change="getProcurrementList" class="flex1">
                <el-radio-button class="marginBottom" v-for="item in warehouseList" :label="item.whId" :key="item.whId" :value="item.whId" >{{item.whName}}</el-radio-button>
              </el-radio-group>
            </div>
            <div class=" flex">
              <span class="span_label">类型</span>
              <el-radio-group v-model="pageFilter.aaaa" size="small" @change="getProcurrementList">
                <el-radio-button  label="01" class="marginBottom" v-if="ButtonInfo['按订单列表']!='0'">按订单列表</el-radio-button>
                <el-radio-button  label="02"  class="marginBottom" v-if="ButtonInfo['按任务列表']!='0'">按任务列表</el-radio-button>
              </el-radio-group>
            </div>
            <div class=" flex">
              <span class="span_label">状态</span>
              <el-radio-group v-model="pageFilter.state" size="small" @change="filterStateData">
                <el-radio-button  :label="item.value" v-if="pageFilter.aaaa == '02'" v-for="item in statusOptions" :key="item.value">{{item.label}}</el-radio-button>
                <el-radio-button  :label="item.value" v-if="pageFilter.aaaa == '01'" v-for="item in orderOptions" :key="item.value">{{item.label}}</el-radio-button>
              </el-radio-group>
            </div>
          </el-collapse-item>
        </el-collapse>
      </el-row>
      <el-row class="supplier_btn">
        <el-button  size="small"  v-if="ButtonInfo['筛选']!='0'"  @click="isGroup=false;dialogFlag.isOpen = true;getListDataq()">筛选</el-button>
      </el-row>
      <el-row class="supplier_btn last_btn">
        <el-button size="small" type="primary"  @click="dialogFlag.dialogTitle='采购单入库';handlerItems()" v-if="pageFilter.state == 1 && pageFilter.aaaa == '02' && ButtonInfo['批量入库']!='0'">批量入库</el-button>
        <el-button size="small" type="primary"  @click="toPrint" v-if="pageFilter.state != '' && pageFilter.aaaa == '02' && ButtonInfo['批量打印']!='0'">批量打印</el-button>
    </el-row>
      <el-table :data="procurrementData" id="item_list" border tooltip-effect="dark" style="width: 100%" @selection-change="selsChange"  v-if="pageFilter.aaaa == '02'">
        <el-table-column type="selection" width="55" align="center" :disabled= true  ></el-table-column>
        <el-table-column prop="label" width="120" label="操作" show-overflow-tooltip align="center" >
          <template scope="scope" >
            <el-tooltip class="item" effect="dark" :content="scope.row.state == '已入库' ? '查看': '入库'" placement="top-start"  v-if="ButtonInfo[scope.row.state == '已入库' ? '查看': '入库']!='0'"  >
              <i class="iconfontyyy" v-if="scope.row.state == '已入库'" @click="dialogFlag.dialogTitle='采购单入库清单';showInfoDialog([{taskId:scope.row.taskId}])">&#xe600;</i>
              <i class="iconfontyyy" v-if="scope.row.state == '待入库'" @click="dialogFlag.dialogTitle='采购单入库';productId=scope.row.productId;showInfoDialog([{taskId:scope.row.taskId}])">&#xe608;</i>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column sortable align="center" prop="poNo" label="图片" width="106px">
          <template scope="scope">
            <img :src="scope.row.picture"/>
          </template>
        </el-table-column>
        <el-table-column sortable align="center" label="SKU/商品名称" >
          <template scope="scope">
            <span>{{scope.row.skuNo}}</span><br/>
            <span>{{scope.row.proName}}</span><br/>
          </template>
        </el-table-column>
        <el-table-column sortable align="center" prop="poNo" label="采购单编号" ></el-table-column>
        <el-table-column sortable align="center" prop="poUser" label="采购员" ></el-table-column>
        <el-table-column sortable align="center" prop="recTime" label="到货时间"  width="180px" :formatter="tool.dateFormatter"></el-table-column>
        <el-table-column sortable align="center" prop="insUser" label="质检员"></el-table-column>
        <el-table-column sortable align="center" prop="allInsQty" label="质检结果(良品/次品)"></el-table-column>
        <el-table-column sortable align="center" prop="allWarQty" label="已入库(良品/次品)"></el-table-column>
        <el-table-column sortable align="center" prop="locNo" label="货位号" ></el-table-column>
        <el-table-column sortable align="center" prop="state" label="状态" ></el-table-column>
      </el-table>
      <el-table :data="procurrementData" id="item_list" border tooltip-effect="dark" style="width: 100%"  v-show="pageFilter.aaaa == '01'">
        <el-table-column type="selection" width="55" align="center" :disabled= true  ></el-table-column>
        <el-table-column prop="label" width="120" label="操作" show-overflow-tooltip align="center" >
          <template scope="scope" >
            <el-tooltip class="item" effect="dark" content="打印物品清单" placement="top-start" v-if="ButtonInfo['打印物品清单']!='0'" >
              <i class="iconfontyyy" @click="toPrintPage('#/productsDetailedList?poId='+scope.row.poId)" >&#xe638;</i>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="生成采购箱麦" placement="top-start" v-if="ButtonInfo['生成采购箱麦']!='0'">
              <i class="iconfontyyy" @click="toPrintPage('#/beingShippingmark?poId='+scope.row.poId)">&#xe6a9;</i>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="采购箱唛历史记录" placement="top-start"     v-if="ButtonInfo['采购箱唛历史记录']!='0' ">
              <i class="iconfontyyy" @click="toPrintPage('#/shippingmarkHistory?poId='+scope.row.poId);" >&#xe61f;</i>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column sortable align="center" prop="poNo" label="采购单编号" ></el-table-column>
        <el-table-column sortable align="center" prop="poUser" label="采购员" ></el-table-column>
        <el-table-column sortable align="center" prop="recTime" label="采购单创建时间"  width="180px" :formatter="tool.dateFormatter"></el-table-column>
        <el-table-column sortable align="center" prop="insUser" label="供应商"></el-table-column>
        <el-table-column sortable align="center" prop="insUser" label="SKU种数"></el-table-column>
        <el-table-column sortable align="center" prop="insUser" label="已签收"></el-table-column>
        <el-table-column sortable align="center" prop="insUser" label="SKU数量"></el-table-column>
        <el-table-column sortable align="center" prop="insUser" label="已入库数量"></el-table-column>
        <el-table-column sortable align="center" prop="insUser" label="入库员"></el-table-column>
        <el-table-column sortable align="center" prop="insUser" label="最新入库时间" width="180px" :formatter="tool.dateFormatter"></el-table-column>
        <el-table-column sortable align="center" prop="locNo" label="入库仓库" ></el-table-column>
        <el-table-column sortable align="center" prop="state" label="状态" ></el-table-column>
      </el-table>
    </div>
    <div id="page" class="page">
      <el-pagination @size-change="changePageSize" @current-change="changeCurrentPage" :current-page="page.currentPage" :page-sizes="[10,20,30,40]" :page-size="page.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="page.totalCount"></el-pagination>
    </div>

    <!--     查看、批量入库、单个入库弹窗--------------------------------------------------->
    <el-dialog :title="dialogFlag.dialogTitle" :visible.sync="dialogFlag.infoDetail"  size="small">
      <el-table border :data="warehousingList" >
        <el-table-column  label="日志" align="center"  v-if="dialogFlag.dialogTitle == '采购单入库清单'">
          <template scope="scope">
            <el-tooltip class="item" effect="dark" content="查看日志" placement="top-start" >
              <i class="iconfontyyy"  @click="showLogDialog(scope.row)">&#xe712;</i>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column  label="图片" align="center" width="106px">
          <template scope="scope">
            <img :src="scope.row.picture"/>
          </template>
        </el-table-column>
        <el-table-column prop="poNo" label="采购单号"  align="center"  width="160px"></el-table-column>
        <el-table-column label="SKU"  prop="skuNo" align="center"  width="140px"></el-table-column>
        <el-table-column label="商品名称"  prop="proName" align="center"  width="140px"></el-table-column>
        <el-table-column prop="insAllQty" label="采购数量" align="center" ></el-table-column>
        <el-table-column prop="wareAllQty" label="已入库(良品/次品)" align="center" ></el-table-column>
        <el-table-column prop="wareAllQty" label="质检(良品/次品)" align="center" ></el-table-column>
        <el-table-column  label="入库数量" align="center" width="120px">
          <template scope="scope" >
            <el-input v-if="dialogFlag.dialogTitle == '采购单入库'" type="text" v-model="scope.row.locationNumber"></el-input>
            <span v-if="dialogFlag.dialogTitle == '采购单入库清单'">{{scope.row.locationNumber}}</span>
          </template>
        </el-table-column>
        <el-table-column  label="故障品数量" align="center" width="120px">
          <template scope="scope" >
            <el-input v-if="dialogFlag.dialogTitle == '采购单入库'" type="number" v-model="scope.row.wareQty"></el-input>
            <span v-if="dialogFlag.dialogTitle == '采购单入库清单'">{{scope.row.wareQty}}</span>
          </template>
        </el-table-column>
        <el-table-column  label="备注内容" align="center" width="120px">
          <template scope="scope" >
            <el-input v-if="dialogFlag.dialogTitle == '采购单入库'" type="number" v-model="scope.row.memo"></el-input>
            <span v-if="dialogFlag.dialogTitle == '采购单入库清单'">{{scope.row.memo}}</span>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFlag.infoDetail= false">{{dialogFlag.dialogTitle === '采购单入库清单' ? '关闭': '取消'}}</el-button>
        <el-button type="primary" @click="submit" v-if="dialogFlag.dialogTitle == '采购单入库'">入库</el-button>
      </div>
    </el-dialog>
<!---------------------添加备注弹出框------------------->
    <el-dialog title="添加备注" :visible.sync="dialogFlag.remarkOpen"  size="tiny" @open="paramsData.remark=''">
      <el-input type="textarea" v-model="paramsData.remark"></el-input>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFlag.remarkOpen= false">取 消</el-button>
        <el-button type="primary" @click="submitRemark();" :loading="$store.state.loading">确 定</el-button>
      </div>
    </el-dialog>

<!---------------------查看入库日志弹出框------------------->
    <el-dialog title="日志" :visible.sync="dialogFlag.logOpen">
      <el-table border :data="logData" >
        <el-table-column prop="operation" label="操作"  align="center"></el-table-column>
        <el-table-column prop="qty" label="入库数量/修改数量/故障品申报数量" align="center" ></el-table-column>
        <el-table-column prop="user" label="操作人" align="center" ></el-table-column>
        <el-table-column prop="time" label="操作时间" align="center" :formatter="tool.formatDate" width="180px"></el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFlag.logOpen= false">关闭</el-button>
      </div>
    </el-dialog>
    <!----------------------筛选--------------------------->
    <div class="smallDia">
      <el-dialog title="筛选" :visible.sync="dialogFlag.isOpen" size="small" :close-on-click-modal="false" @close="isGroup=true">
        <div class="data_body">
          <title-header></title-header>
          <text-input :select-value="pageFilter.poNo" condition-name="采购单号" text-type="采购单号" place-value="请输入采购单号" @child-change-val="getTextInput"></text-input>
          <text-input :select-value="pageFilter.skuNo"  condition-name="SKU" text-type="SKU" place-value="请输入SKU" @child-change-val="getTextInput"></text-input>
          <time-data :start-time="pageFilter.initialTime" condition-name="到货日期" :end-time="pageFilter.overTime" @child-value-Stime="getTime" @child-value-Etime="getTime"></time-data>
          <select-input :select-value="pageFilter.poUser" condition-name="采购员" :options-data="userList" @child-change-val="getSelectInput"></select-input>
          <select-input :select-value="pageFilter.recUser" condition-name="签收员" :options-data="userList" @child-change-val="getSelectInput"></select-input>
          <select-input :select-value="pageFilter.insUser" condition-name="质检员" :options-data="userList" @child-change-val="getSelectInput"></select-input>
          <select-input :select-value="pageFilter.vendorName" condition-name="供应商" :options-data="vendorList" @child-change-val="getSelectInput"></select-input>
          <select-input :select-value="pageFilter.state" condition-name="状态" :options-data="statusOptions" @child-change-val="getSelectInput"></select-input>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="closeDialog()">清除条件</el-button>
          <el-button @click="getProcurrementList();">筛 选</el-button>
          <el-button @click="dialogFlag.isOpen = false;">取 消</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
  import titleHeader from "../../components/ScreenModular/title.vue"
  import textInput from '../../components/ScreenModular/textInput.vue'
  import selectInput from '../../components/ScreenModular/selectInput.vue'
  import timeData from '../../components/ScreenModular/timeDate.vue'
  export default {
    components: {titleHeader, textInput,selectInput,timeData},
    data() {
      return {
        statusOptions:[{value:'01',label:'待入库任务'},{value:'02',label:'已入库任务'}],
        orderOptions:[{value:'01',label:'待入库'},{value:'02',label:'部分入库'},{value:'03',label:'全部入库'}],
        activeNames: ['1'],
        procurrementData: [],
        pageFilter: {
          currentPage: 1,
          pageSize: 10,
          state:'01',
          whId:'',
          skuNo:'',
          initialTime:'',
          overTime:'',
          poUser:'',
          recUser:'',
          insUser:'',
          vendorName:'',
          poNo:'',
          aaaa:'01',
        },
        page: {          // 分页参数
          currentPage: 1,
          pageSize: 10,
          totalCount: 10,
          totalPage: 10
        },
        dialogFlag: {
          isOpen: false,
          logOpen:false,
          remarkOpen: false,
          infoDetail: false,
          dialogTitle: "",
        },
        formLabelWidth: '100px',
        warehousingList:[]  , // 入库详情表数据
        userList:[]  , // 质检，，
        vendorList:[]  , // 供应商
        warehouseList:[]  , // 仓库
        logData:[]  , //  日志
        sels:[]  , //
        paramsData:{
            list:[],
            remark:''
        },   //  入库传参
        productId:'' ,   // 入库时传后台
        isGroup:true,
        ButtonInfo:{},//按钮权限列表20171227
      }
    },
    mounted () {
      this.getauthorityList();
      this.getProcurrementList();
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
      filterStateData:function(val,type){
        if(this.isGroup == true){
          this.getProcurrementList();
        }
      },
      getWarehouseList:function(){
        this.httpPost('productMaterial/getAllWareHouse').then(res =>{
            this.warehouseList = res.data;
        })
      },
      getListDataq:function(){
        var vm = this;
        const userList = this.httpPost('powarehousingtask/selectUserInfo')
        const vendorList = this.httpPost('powarehousingtask/selectWhVendorInfo')
        this.$http.all([userList,vendorList]).then(this.$http.spread(function(userData,vendorData){
          vm.userList = vm.tool.replaceObjKey(userData.data.params.list,'userId','userName');
          vm.vendorList = vm.tool.replaceObjKey(vendorData.data.params.list,'vendorId','vendorName');
        }))
      },
      getProcurrementList: function () {
        this.httpPost('powarehousingtask/select', this.pageFilter).then(res => {
          if (res.data.result == true) {
            const pageData = res.data.params.list;
            this.page = pageData;
            this.dialogFlag.isOpen = false;
            this.procurrementData = pageData.listData;
          } else {
            this.procurrementData = [];
          }
        })
      },
      selsChange: function (sels) {
        this.sels = sels;
      },
      showLogDialog:function(row){
        this.dialogFlag.logOpen = true;
        this.logData = [];
        this.httpPost('powarehousingtask/selectLogItem',{taskId:row.taskId}).then(res =>{
            if(res.data.result == true){
                this.logData.push(res.data.params.list);
            }else{
              this.$message(res.data.message)
            }
        })
      },
      handlerItems:function(){
        var ids = this.sels.length;
        var data = [];
        this.sels.forEach(function(item){data.push({taskId:item.taskId})});
        ids >0 ? this.showInfoDialog(data) : this.tips();
      },
      showInfoDialog(data){
        this.dialogFlag.infoDetail = true;
        this.warehousingList = [];
        this.httpPost('powarehousingtask/selectWhItem',data).then(res =>{
          if(res.data.result == true){
            var data = res.data.params.list;
            if(data.length == 1 && data[0] == null){
              this.warehousingList = []
            }else{
              this.warehousingList = res.data.params.list;
            }
          }else{
            this.$message(res.data.message)
          }
        })
      },
      submit:function(){
        this.paramsData.list = [];
        var vm = this,lessQty = false,item = this.warehousingList;
        var flag = this.warehousingList.every(function(item){
            var res = (item.locationNumber != '' && item.locationNumber != null && item.wareQty > 0);
            if(res){
                vm.paramsData.list.push({taskId:item.taskId,qty:item.wareQty,lonNo:item.locationNumber,poItemId:item.poItemId});
                item.insQty = item.insQty == null ? 0 : parseInt(item.insQty);
                item.insDefectiveQty = item.insQty == null ? 0 : parseInt(item.insDefectiveQty);
                lessQty = item.wareQty < item.insDefectiveQty+item.insQty;
            }
            return res;
        })
        if(flag){
          lessQty == true ? this.dialogFlag.remarkOpen = true : this.submitRemark();
        }else{
          this.$message('货位及入库数量为必填项，且入库数量须大于零！！');
        }
      },
      submitRemark:function(){
        if(this.dialogFlag.remarkOpen == true && this.paramsData.remark == ''){
            this.$message('备注不能为空！');
        }else {
          var vm = this;
          this.paramsData.list.forEach(function(item){
              vm.$set(item,'dosc',vm.paramsData.remark);
              vm.$set(item,'productId',vm.productId);
          })
          this.httpPost('powarehousingtask/updateData', this.paramsData.list).then(res => {
            if (res.data.result == true) {
              this.$message('保存成功');
              this.dialogFlag.infoDetail = false;
              this.dialogFlag.remarkOpen = false
              this.getProcurrementList();
            } else {
              this.$message(res.data.message);
            }
          })
        }
      },
      toPrint:function(){
        var type = this.pageFilter.state == '01' ? '1' :'2';
        var list = this.sels.map(item =>item.taskId);
        if(list.length>0){
          this.$refs.clearTable.clearSelection();
          var data = list.join(',')  ;
          var url = '#/toBePutStorage?type='+type+'&list='+data;
          window.open(url);
        }else{
            this.tips();
        }
      },
      changePageSize: function (val) {
        this.pageFilter.pageSize = val;
        this.pageFilter.currentPage = '1';
        this.getProcurrementList();
      },
      changeCurrentPage: function (val) {
        this.pageFilter.currentPage = val;
        this.getProcurrementList();
      },
      getTextInput:function(val){
        val.type === '采购单号'? this.pageFilter.poNo = val.value : this.pageFilter.skuNo = val.value;
      },
      getSelectInput:function(val){
        var pf = this.pageFilter,vall = val.value;
        val.type == '采购员'? pf.poUser = vall : val.type == '签收员'? pf.recUser = vall :  val.type == '质检员'? pf.insUser = vall :  val.type == '供应商'? pf.vendorName = vall : pf.state = vall;
      },
      getTime:function(val){
        val.type == 'start' ? this.pageFilter.initialTime = val.value : this.pageFilter.overTime = val.value;
      },
      closeDialog:function(){
          this.pageFilter.state = '';
          this.pageFilter.whId = '';
          this.pageFilter.skuNo = '';
          this.pageFilter.poNo = '';
          this.pageFilter.initialTime = '';
          this.pageFilter.overTime = '';
          this.pageFilter.poUser = '';
          this.pageFilter.recUser = '';
          this.pageFilter.insUser = '';
          this.pageFilter.vendorName = '';
      },
    },
  }
</script>
<style scoped>
</style>
