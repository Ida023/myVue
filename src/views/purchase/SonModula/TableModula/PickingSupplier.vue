<template>
  <div id="">
    <el-row id="filer2" class="">
      <el-collapse v-model="activeNames2">
        <el-collapse-item name="1">
          <div id="SkuCounts">
            <el-radio-group v-model="radio" v-for="(item,index) in SkuCountList" text-color="#20a0ff" fill="#fbfdff">
              <el-col :span="3">
                <el-radio-button :label="item.vendorId" > {{ item.verndorName }}（{{ item.skuCount }}）</el-radio-button>
              </el-col>
            </el-radio-group>
          </div>
        </el-collapse-item>
      </el-collapse>
    </el-row>
    <el-row class="supplier_btn" style="margin: 10px 0 10px 0">
      <el-button type="primary" size="small" @click="BatchOperation('待供应链处理','0')" v-if="SonScreenData.stateName==='待供应链处理'">批量处理</el-button>
      <el-button type="primary" size="small" @click="BatchOperation('待第三方审核','0')" v-if="SonScreenData.stateName==='待第三方审核'">批量同意</el-button>
      <el-button type="primary" size="small" @click="BatchOperation('待第三方审核','1')" v-if="SonScreenData.stateName==='待第三方审核'">批量不同意</el-button>
      <el-button type="primary" size="small" @click="BatchOperation('第三方审核不通过')" v-if="SonScreenData.stateName==='第三方审核不通过'">批量撤回</el-button>
      <el-button type="primary" size="small" @click="BatchOperation('待提交采购')" v-if="SonScreenData.stateName==='待提交采购'">批量处理</el-button>
      <span v-if="SonScreenData.stateName==='待提交采购'"><span>装箱共计:<span style="color: red">{{ ScreenData.productVolumes }}</span>m³</span></span>
      <span style="margin-left: 20px" v-if="SonScreenData.stateName==='待提交采购'"><span>重量共计:<span style="color: red">{{ ScreenData.productWeights }}</span>KG</span></span>
      <el-button type="primary" size="small" @click="BatchOperation('待采购')" v-if="SonScreenData.stateName==='待采购'">创建采购</el-button>
    </el-row>
    <el-table :data="TableData" border tooltip-effect="dark" style="width: 100%" :stripe="false"  @selection-change="selsChange">
      <el-table-column type="selection" width="55" align="center"></el-table-column>
      <el-table-column sortable width="125" label="SKU/MSKU/ASIN/名称" align="center">
        <template scope="scope">
          <div class="childDiv">
            <span>{{ scope.row.skuNo }}</span><br>
            <span>{{ scope.row.productName }}</span><br>
            <span class="Astyel" @click="RowData(scope.row,'', '库存')">库存详情</span>
            <el-row style="margin-top: 5px">
              <el-tooltip content="商品库存"  effect="dark" placement="bottom">
                <i  class="iconfontyyy" content="Bottom center" @click="RowData(scope.row, index,'商品库存')">&#xe6f6;</i>
              </el-tooltip>
              <el-tooltip content="历史销量"  effect="dark" placement="bottom">
                <i  class="iconfontyyy" content="Bottom center" @click="RowData(scope.row, index,'历史销量')">&#xe61b;</i>
              </el-tooltip>
            </el-row>
          </div>
        </template>
      </el-table-column>
      <el-table-column sortable label="图片" align="center"  width="104">
        <template scope="scope">
          <div style="margin-left:0px">
            <img v-if="scope.row.productImage!=null" style="width: 70px; height: 70px;" :src="RmsUrl+scope.row.productImage"/>
          </div>
        </template>
      </el-table-column>
      <el-table-column width="100" id="space" label="操作" align="center" >
        <template scope="scope">
          <div class="simulation" v-for="(item,index) in scope.row.stockItems" :id="'simulation' +'-'  + scope.$index +'/' + index">
            <div class="childDiv">
              <el-tooltip content="费用"  effect="dark" placement="bottom" >
                <i  class="iconfontyyy" content="Bottom center" @click="RowData(scope.row, index, '费用')">&#xe757;</i>
              </el-tooltip>
              <el-tooltip content="日志"  effect="dark" placement="bottom" >
                <i  class="iconfontyyy" content="Bottom center" @click="RowData(scope.row, index, '日志')">&#xe602;</i>
              </el-tooltip>
              <el-tooltip content="查看"  effect="dark" placement="bottom" >
                <i  class="iconfontyyy" content="Bottom center" @click="RowData(scope.row, index, '查看')">&#xe600;</i>
              </el-tooltip>
              <el-tooltip content="编辑"  effect="dark" placement="bottom" v-show="ButtonState===false && ScreenData.stateName!=='待采购' && ScreenData.stateName!=='审核中'">
                <i  class="iconfontyyy" content="Bottom center" @click="RowData(scope.row,index, '编辑')">&#xe6e5;</i>
              </el-tooltip>
              <el-tooltip content="物流"  effect="dark" placement="bottom" v-show="ButtonState===false || ScreenData.stateName==='待采购'">
                <i  class="iconfontyyy" content="Bottom center" @click="RowData(scope.row, index, '物流')">&#xe689;</i>
              </el-tooltip>
              <el-tooltip content="销售"  effect="dark" placement="bottom" v-show="ButtonState===false || ScreenData.stateName==='待采购'">
                <i  class="iconfontyyy" content="Bottom center" @click="RowData(scope.row, index, '销售')">&#xe6f5;</i>
              </el-tooltip>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column sortable label="备货子ID　所属备货计划" align="center" width="120">
        <template scope="scope">
          <div class="simulation" v-for="(item,index) in scope.row.stockItems" :id="'simulation' +'-'  + scope.$index +'/' + index">
            <div class="childDiv">
              <span>{{ item.itemNo }}</span><br/>
              <span class="Astyel" @click="RowData(scope.row, index, '备货计划查看')">{{ item.stockNo }}</span><br/>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column sortable label="需求数量" align="center">
        <template scope="scope">
          <div class="simulation" v-for="(item,index) in scope.row.stockItems" :id="'simulation' +'-'  + scope.$index +'/' + index">
            <div class="childDiv">
              <div class="InputDiv">
                <el-input v-model="item.requestQty" :disabled="RowDisabled"  class="tableInput" name="input66" type="number"  v-if="item.stateUrl===true"></el-input>
                <span v-if="item.stateUrl===false">{{ item.requestQty }}</span>
              </div>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column sortable label="预估销售天数" align="center">
        <template scope="scope">
          <div class="simulation" v-for="(item,index) in scope.row.stockItems" :id="'simulation' +'-'  + scope.$index +'/' + index">
            <div class="childDiv">
              <div class="InputDiv">
                <el-input v-model="item.requestSalesDays" :disabled="RowDisabled" class="tableInput" name="input66" type="number" v-if="item.stateUrl===true"></el-input>
                <span v-if="item.stateUrl===false">{{ item.requestSalesDays }}</span>
              </div>
            </div>
          </div>
        </template>
      </el-table-column>
      <!--<el-table-column sortable label="采购仓库" align="center" width="120">-->
        <!--<template scope="scope">-->
          <!--<div class="simulation" v-for="(item,index) in scope.row.stockItems" :id="'simulation' +'-'  + scope.$index +'/' + index">-->
            <!--<div class="childDiv">-->
              <!--<el-select  placeholder="请选择" :disabled="RowDisabled" v-model="item.startStorehouse" clearable filterable class="tableInput" v-if="item.stateUrl===true">-->
                <!--<el-option-->
                  <!--v-for="item in WarehouseList2"-->
                  <!--:key="item.value"-->
                  <!--:label="item.label"-->
                  <!--:value="item.value">-->
                <!--</el-option>-->
              <!--</el-select>-->
              <!--<span v-if="item.stateUrl===false">{{ switchData.data3 }}</span>-->
            <!--</div>-->
          <!--</div>-->
        <!--</template>-->
      <!--</el-table-column>-->
      <el-table-column sortable label="运输方式" align="center" width="120">
        <template scope="scope">
          <div class="simulation" v-for="(item,index) in scope.row.stockItems" :id="'simulation' +'-'  + scope.$index +'/' + index">
            <div class="childDiv">
              <el-select  placeholder="请选择" :disabled="RowDisabled" v-model="item.requestTransportType" clearable filterable class="tableInput" v-if="item.stateUrl===true">
                <el-option
                  v-for="item in transport"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
              <span v-if="item.stateUrl===false">{{ switchData.data1 }}</span>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column sortable label="目的仓" align="center" width="120">
        <template scope="scope">
          <div class="simulation" v-for="(item,index) in scope.row.stockItems" :id="'simulation' +'-'  + scope.$index +'/' + index">
            <div class="childDiv">
              <el-select  placeholder="请选择" :disabled="RowDisabled" v-model="item.requestWarehouse" clearable filterable class="tableInput" v-if="item.stateUrl===true">
                <el-option
                  v-for="item in WarehouseList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
              <span v-if="item.stateUrl===false">{{ switchData.data2 }}</span>
            </div>
          </div>
        </template>
      </el-table-column>
      <!--<el-table-column sortable label="库存信息" align="center" >-->
        <!--<template scope="scope">-->
          <!--<div class="simulation" v-for="(item,index) in scope.row.stockItems" :id="'simulation' +'-'  + scope.$index +'/' + index">-->
            <!--<div class="childDiv">-->
              <!--<span>目的仓库存</span><br />-->
              <!--<span>货架数:{{ item.shelvesCount }}</span><br />-->
              <!--<span>可销售:{{ item.canSale }}</span><br />-->
              <!--<span>锁定数:{{ item.slockCount }}</span><br />-->
              <!--<span>目的仓在途</span><br />-->
              <!--<span>海运:{{ item.shippingProductCount }}</span><br />-->
              <!--<span>空运:{{ item.airProductCount }}</span>-->
            <!--</div>-->
          <!--</div>-->
        <!--</template>-->
      <!--</el-table-column>-->
      <!--<el-table-column sortable label="销售数据" align="center">-->
        <!--<template scope="scope">-->
          <!--<div class="simulation" v-for="(item,index) in scope.row.stockItems" :id="'simulation' +'-'  + scope.$index +'/' + index">-->
            <!--<div class="childDiv">-->
              <!--<span>7天销量：{{ scope.row.salesCount_Seven }}</span><br />-->
              <!--<span>15天销量：{{ scope.row.salesCount_fifteen }}</span><br />-->
              <!--<span>30天销量：{{ scope.row.salesCount_thirty }}</span>-->
            <!--</div>-->
          <!--</div>-->
        <!--</template>-->
      <!--</el-table-column>-->
      <el-table-column sortable label="重量（kg）" align="center">
        <template scope="scope">
          <div class="simulation" v-for="(item,index) in scope.row.stockItems" :id="'simulation' +'-'  + scope.$index +'/' + index">
            <div class="childDiv">
              <span v-text="(item.productWeight * item.requestQty)/1000"></span>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column sortable label="体积（cm³）" align="center">
        <template scope="scope">
          <div class="simulation" v-for="(item,index) in scope.row.stockItems" :id="'simulation' +'-'  + scope.$index +'/' + index">
            <div class="childDiv">
              <span v-text="item.productbulk * item.requestQty"></span>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column sortable label="到货记录" align="center" width="150">
        <template scope="scope">
          <div class="simulation" v-for="(item,index) in scope.row.stockItems" :id="'simulation' +'-'  + scope.$index +'/' + index">
            <div class="childDiv">
                <span v-for="(items,index) in item.data">
                  <span>{{ items.cgNo }}</span><br />
                  <span>{{ items.count }}</span><br />
                </span>
              <el-tooltip content="分配"  effect="dark" placement="bottom" v-show="ButtonState===false && ScreenData.stateName!=='待采购'
            && ScreenData.stateName!=='审核中'">
                <i  class="iconfontyyy" content="Bottom center" @click="RowData(scope.row,index, '分配')">&#xe64f;</i>
              </el-tooltip>
              <!--{{ ButtonState}}&#45;&#45;{{ ScreenData.stateName }}-->
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column sortable label="操作" align="center" width="50">
        <template scope="scope">
          <div class="simulation" v-for="(item,index) in scope.row.stockItems" :id="'simulation' +'-'  + scope.$index +'/' + index">
            <div class="childDiv">
              <el-tooltip class="item" effect="dark" content="删除" v-if="ScreenData.stateName==='草稿'" >
                <i class="iconfontyyy" :key="index" @click="RowData(scope.row, index, '删除')">&#xe6f7;</i>
              </el-tooltip>
              <el-tooltip content="保存"  effect="dark" placement="bottom" v-if="ScreenData.stateName==='草稿'">
                <i  class="iconfontyyy" content="Bottom center" @click="RowData(scope.row, index, '保存')">&#xe613;</i>
              </el-tooltip>
              <el-tooltip content="保存"  effect="dark" placement="bottom" v-if="ScreenData.stateName==='待第三方审核' || ScreenData.stateName==='待提交采购'">
                <i  class="iconfontyyy" content="Bottom center" @click="RowData(scope.row, index, '保存2')">&#xe613;</i>
              </el-tooltip>
              <el-tooltip content="提交"  effect="dark" placement="bottom" v-if="ScreenData.stateName==='待提交采购'">
                <i  class="iconfontyyy" content="Bottom center" @click="RowData(scope.row, index, '提交')">&#xe63e;</i>
              </el-tooltip>
              <el-tooltip content="同意"  effect="dark" placement="bottom" v-if="ScreenData.stateName==='待第三方审核' || ScreenData.stateName==='待供应链处理'">
                <i  class="iconfontyyy" content="Bottom center" @click="RowData(scope.row, index, '同意')">&#xe67e;</i>
              </el-tooltip>
              <el-tooltip content="不同意"  effect="dark" placement="bottom" v-if="ScreenData.stateName==='待第三方审核'">
                <i  class="iconfontyyy" content="Bottom center" @click="RowData(scope.row, index, '不同意')">&#xe665;</i>
              </el-tooltip>
              <el-tooltip content="编辑"  effect="dark" placement="bottom" v-if="ScreenData.stateName==='待第三方审核' || ScreenData.stateName==='待提交采购'">
                <i  class="iconfontyyy" content="Bottom center" @click="RowData(scope.row, index, '编辑2')">&#xe6e5;</i>
              </el-tooltip>
              <el-tooltip content="回退"  effect="dark" placement="bottom" v-if="ScreenData.stateName==='第三方审核不通过'">
                <i  class="iconfontyyy" content="Bottom center" @click="RowData(scope.row, index, '回退')">&#xe666;</i>
              </el-tooltip>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column sortable label="状态" align="center"  width="80">
        <template scope="scope">
          <div class="simulation" v-for="(item,index) in scope.row.stockItems" :id="'simulation' +'-' + scope.$index +'/' + index">
            <div class="childDiv">
              <span v-if="item.nodeName!==null" v-text="item.nodeName">/</span>
              <span v-if="item.allocationStatus!==null" v-text="'/'+item.allocationStatus">/</span>
              <span v-if="item.salesStatus!==null" v-text="'/'+item.salesStatus">/</span>
              <span v-if="item.purStatus!==null" v-text="'/'+item.purStatus">/</span>
            </div>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <!--备注弹窗-->
    <el-dialog title="添加备注" :visible.sync="RemarksDialog" size="tiny" :close-on-click-modal="false" @open="dilRemarks" >
      <el-input type="textarea" v-model="HandleTasksSon.stockItemNote" v-if="RemarksDialogBtn===false"></el-input>
      <el-input type="textarea" v-model="HandleTasksSon.stockItemNote" v-if="RemarksDialogBtn===true"></el-input>
      <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="addRemarks(RemarksState);" v-if="RemarksDialogBtn===false" :loading="$store.state.loading">保 存</el-button>
          <el-button type="primary" @click="addRemarks2(RemarksState);" v-if="RemarksDialogBtn===true" :loading="$store.state.loading">保 存</el-button>
          <el-button @click="RemarksDialog = false">取 消</el-button>
        </span>
    </el-dialog>
    <!--创建采购-->
    <el-dialog :title="EstablishPurchase.editDialogTitle" :visible.sync="EstablishPurchase.dis" size="small" :close-on-click-modal="false" @open="dilRemarks" >
      <EstablishPurchase ref="EstablishPurchase" @dilEstablishPurchase="dilEstablishPurchase" :SondefaultData="SondefaultData"></EstablishPurchase>
      <span slot="footer" class="dialog-footer">
          <el-button @click="EstablishPurchase.dis = false">取 消</el-button>
         <el-button type="primary" @click="EstablishPurchaseFn" :loading="$store.state.loading">确 定</el-button>
        </span>
    </el-dialog>
  </div>
</template>

<script>
  import Journal from './operation/Journal';
  import Remarks from './operation/Remarks';
  import AllocationStatus from './operation/AllocationStatus';
  import SalesStatus from './operation/SalesStatus';
  import StockingId from './operation/StockingId';
  import CostDetails from './operation/CostDetails';
  import ElRow from "element-ui/packages/row/src/row";
  import ElCol from "element-ui/packages/col/src/col";
  import EstablishPurchase from './operation/EstablishPurchase';
  export default{
    components:{
      ElCol,
      ElRow,
      Journal,
      Remarks,
      AllocationStatus,
      SalesStatus,
      StockingId,
      CostDetails,
      EstablishPurchase
    },
    /*
     ScreenData:父组件条件，用于 后续 各种状态，各种条件下，操作按钮控制。
     TableListData：父组件 条件过滤后拿到的 list，用于table；
     */
    props:['ScreenData','TableListData','SondefaultData'],
    data() {
      return {
        ButtonInfo:{},//按钮权限列表20171227
        TableData:[],
        sels:[],    //批量删除已选的条目数
        GrandsonID:'',//给孙子的 ID，根据具体要什么ID是什么ID，进行填值
        SonScreenData:this.ScreenData, //watch监听，在第一次加载子组件，不会触发,直接赋值一次，后续由watch 赋值。
        SonTableListData:this.TableListData,//watch监听，在第一次加载子组件，不会触发,直接赋值一次，后续由watch 赋值。
        ButtonState:true,
        transport:[
          {label:'空运',value:'01'},
          {label:'海运',value:'02'}
        ],
        WarehouseList:[],
        WarehouseList2:[],
        RemarksDialog:false,
        RemarksDialogBtn:false,
        SeeDialog:{
          dis:false,
          SeeDialogTitle:'',
          SeeDialogSize:'small'
        },
        activeNames2: ['1'],    //  筛选 功能的折叠面板
        editDialog:{
          dis:false,
          editDialogTitle:''
        },
        RemarksState:'',
        RemarksData:{
          val:'',
          id:[],
        },
        deleteList:[],
        batchData:{
          itemId:[],
          relaId:[],
          stockId:[],
        },
        HandleTasks:{
          relaId:[],
          state:true,
          processkey:'stock_plan',
          stockItemNote:'',
          nodeId:'',
          nodeName:'',
          stockId:[],
          itemId:[],
        },
        HandleTasksSon:{
          relaId:[],
          state:true,
          processkey:'stock_plan',
          stockItemNote:'',
          nodeId:'',
          nodeName:'',
          stockId:'',
          itemId:[],
        },
        EditStock:{
          itemId:'',//备货子id
          requestQty:'',//需求数量
          requestSalesDays:'',//预估销售天数
          requestTransportType:'',//运输方式
          requestWarehouse:'',//目的仓
        },
        RemarksDialogID:{
          itemId:[]
        },
        SkuCountList:[],
        radio:'',
        EstablishPurchase:{
          dis:false,
          editDialogTitle:''
        },
        switchData:{
            data1:'',
          data2:'',
          data3:'',
        },
        stateName:'草稿',
        RowDisabled:true
      }
    },
    watch:{
      'ScreenData':{
        handler(val){
          this.SonScreenData=val;
          this.stateName=val.stateName;
          this.combination();
          this.combinationDis();
        },
        deep: true,
        immediate: true
      },
      'TableListData':{
        handler(val){
          this.SonTableListData=val;
          this.combination();
          this.combinationDis();
        },
        deep: true
      },
      'radio':{
        handler(val){
          this.$emit('firstData',val)
        }
      },
    },
    mounted(){
      this.getauthorityList();
      this.ObjectiveWarehouseData();
    },

    methods:{
      /*********************页面按钮权限 20171227*****************************/
      getauthorityList(){
        var vm=this;
        vm.ButtonInfo=vm.tool.getBtnPermissions(vm.currentPath);
        console.log('horityList % 0',vm.ButtonInfo)

      },
      /*********************页面按钮权限 20171227*****************************/
      getSkuCount:function () {
        this.SondefaultData.venderId='';
        console.log(this.SondefaultData)
        console.log(666677)
        this.httpPost('stockProductPlan/selectVendorSkuCount',this.SondefaultData).then(res=>{
            var vendorId='';
          this.SkuCountList=res.data;
          console.log(this.SkuCountList)
          if(res.data.length > 0){
             vendorId=res.data[0].vendorId;
              this.radio=vendorId;
              this.$emit('firstData',vendorId)
          }
        })
      },
      getListData:function (val) {
        this.TableData=val;
        setTimeout(()=>{
          this.CalculationHeight();
        },20)
      },
      verndorData:function (val) {
        console.log(val)
        console.log(this)
      },
      selsChange: function (sels) {//批量操作获取SKU
        console.log(sels)
        let _this=this;
        _this.batchData.stockId=[];
        _this.batchData.relaId=[];
        _this.batchData.itemId=[];
        for(let i=0; i<sels.length;i++){
          for(let j=0; j<sels[i].stockItems.length; j++){
            if(sels[i].stockItems[j].relaId){
              _this.batchData.relaId.push(sels[i].stockItems[j].relaId)
            }
            if(sels[i].stockItems[j].stockId){
              _this.batchData.stockId.push(sels[i].stockItems[j].stockId)
            }
            if(sels[i].stockItems[j].itemId){
              _this.batchData.itemId.push(sels[i].stockItems[j].itemId)
            }
          }
        }
        console.log(_this.batchData)
      },
      BatchOperation:function (val,state) {//批量操作，状态区分做操作。
        let _this=this;
        this.RemarksState=state;
        this.RemarksDialogBtn=true;
        this.HandleTasksSon.nodeName=this.SonScreenData.nodeName;
        this.HandleTasksSon.nodeId=this.SonScreenData.nodeId;
        this.HandleTasksSon.relaId=this.batchData.relaId;
        this.HandleTasksSon.stockId='';
        this.HandleTasksSon.itemId=this.batchData.itemId;
        this.RemarksDialogID.itemId=this.batchData.itemId;
        if(_this.batchData.stockId.length<1 && _this.batchData.itemId.length<1){
          _this.tips();
        }else{
          console.log('批量提交的Sku长度',_this.sels.length);
          if(val==='待供应链处理'){
            alert('待供应链处理')
            this.RemarksDialog=true;
            this.RemarksState='同意';
            this.HandleTasksSon.state=true;
          }else if(val==='待第三方审核'){
            if(state==='0'){
              this.RemarksState='同意';
              this.HandleTasksSon.state=true;
              this.RemarksDialog=true;
            }else if (state==='1'){
              this.RemarksState='不同意';
              this.RemarksDialog=true;
              this.HandleTasksSon.state=false;
            }
          }else if(val==='第三方审核不通过'){
            this.HandleTasksSon.state=false;
            _this.doItem('您确定批量回退备货计划？（备货计划将重新提交待供应链处理）','stockProductPlan/pacthStockItemState',_this.HandleTasksSon,_this.SonDifferentiatedRequest);
          }else if(val==='待提交采购'){
            this.HandleTasksSon.state=true;
            _this.doItem('您确定批量提交备货计划给采购？','stockProductPlan/pacthStockItemState',_this.HandleTasksSon,_this.SonDifferentiatedRequest);
          }else if(val==='待采购'){
            _this.EstablishPurchase.dis=true;
            _this.EstablishPurchase.editDialogTitle='采购处理';
            setTimeout(()=>{
              this.$refs.EstablishPurchase.getListData(_this.RemarksDialogID.itemId,this.batchData.stockId, this.radio);
            },20)
          }
        }
      },
      SonDifferentiatedRequest:function () {
        this.$emit('DifferentiatedRequest');
        this.SeeDialog.dis=false;
        this.getSkuCount();
      },
      RowData:function (row, index, state) {//小行内 的点击操作：备货子ID
        let _this=this;
        let RowIndexData='';
        for(let i=0; i<row.stockItems.length; i++){
          if(index===i){
            RowIndexData=row.stockItems[i];
            break;
          }
        }
        this.RemarksDialogBtn=false;
        this.HandleTasksSon.stockId='';
        this.HandleTasksSon.relaId=[];
        this.HandleTasksSon.itemId=[];
        console.log(RowIndexData);
        this.RemarksState=state;
        this.SeeDialog.SeeDialogSize='small';
        this.HandleTasksSon.nodeId=this.SonScreenData.nodeId;
        this.HandleTasksSon.nodeName=this.SonScreenData.nodeName;
        this.HandleTasksSon.stockId=RowIndexData.stockId;
        this.HandleTasksSon.relaId.push(RowIndexData.relaId);
        this.HandleTasksSon.itemId.push(RowIndexData.itemId);
        if(state==='费用'){
          this.$emit('SeeDialogFn',{itemId:RowIndexData.itemId ,state:'费用'})
        }else if(state==='日志'){
          this.$emit('SeeDialogFn',{itemId:RowIndexData.itemId ,state:'日志'})
        }else if(state==='查看'){
          this.$emit('SeeDialogFn',{itemId:RowIndexData.itemId ,state:'查看'})
        }else if(state==='编辑'){
          this.$emit('SeeDialogFn',{itemId:RowIndexData.itemId ,state:'编辑'},RowIndexData)
        }else if(state==='物流'){
          this.$emit('SeeDialogFn',{itemId:RowIndexData.itemId ,state:'物流'})
        }else if(state==='销售'){
          this.$emit('SeeDialogFn',{itemId:RowIndexData.itemId ,state:'销售'})
        } else if(state==='保存'){
          this.EditStock.itemId=RowIndexData.itemId;
          this.EditStock.requestQty=RowIndexData.requestQty;
          this.EditStock.requestSalesDays=RowIndexData.requestSalesDays;
          this.EditStock.requestTransportType=RowIndexData.requestTransportType;
          this.EditStock.requestWarehouse=RowIndexData.requestWarehouse;
          this.EditStock.startStorehouse=RowIndexData.startStorehouse;
          this.httpPost('stockProductPlan/pacthStockItemInfo',this.EditStock).then(res=>{
            if(res.data.result===true){
              console.log(res)
              RowIndexData.stateUrl=false;
            }else{
              this.$message(res.data.message)
            }
          });
        }else if(state==='删除'){
          let itemIdArr=[];
          let relaIdArr=[];
          itemIdArr.push(RowIndexData.itemId);
          relaIdArr.push(RowIndexData.relaId);
          this.deleteListFn(itemIdArr,relaIdArr);
          this.httpPost('stockProductPlan/deleteStockItemInfos',this.deleteList).then(res=>{
            if(res.data.result===true){
              this.$emit('DifferentiatedRequest');
              this.$message('操作成功')
            }else {
              this.$message(res.data.message)
            }
          })
        }else if(state==='入库'){
          this.SeeDialog.SeeDialogSize='tiny';
          this.SeeDialog.dis = true;
          this.SeeDialog.SeeDialogTitle='入库详情';
        }else if(state==='编辑2'){
          for(let i=0; i<row.stockItems.length; i++){
            if(index===i){
             row.stockItems[i].stateUrl=true;
              break;
            }
          }
        }else if(state==='保存2'){
          for(let i=0; i<row.stockItems.length; i++){
            if(index===i){
             row.stockItems[i].stateUrl=false;
              break;
            }
          }
          for(let i=0; i<this.transport.length; i++){
              if(RowIndexData.requestTransportType===this.transport[i].value){
                  this.switchData.data1=this.transport[i].label
              }
          }
          for(let i=0; i<this.WarehouseList.length; i++){
            if(RowIndexData.requestWarehouse===this.WarehouseList[i].value){
              this.switchData.data2=this.WarehouseList[i].label
            }
          }
          for(let i=0; i<this.WarehouseList2.length; i++){
            if(RowIndexData.startStorehouse===this.WarehouseList2[i].value){
              this.switchData.data3=this.WarehouseList2[i].label
            }
          }
          console.log(this.switchData)
          this.httpPost('stockProductPlan/pacthStockItemInfo',RowIndexData).then(res=>{
            if(res.data.result===true){
              console.log(res)
            }else{
              this.$message(res.data.message)
            }
          });
        }else if(state==='提交'){
          this.HandleTasksSon.state=true;
          _this.doItem('您确定提交此备货计划给采购？','stockProductPlan/pacthStockItemState',_this.HandleTasksSon,_this.SonDifferentiatedRequest);
        }else if(state==='同意'){
          this.RemarksDialog=true;
          this.HandleTasksSon.state=true;
        }else if(state==='不同意'){
          this.RemarksDialog=true;
          this.HandleTasksSon.state=false;
        }else if(state==='回退'){
          this.HandleTasksSon.state=false;
          _this.doItem('您确定回退此备货计划？（备货计划将重新提交第三方审核）','stockProductPlan/pacthStockItemState',_this.HandleTasksSon,_this.SonDifferentiatedRequest);
        }else if(state==='库存'){
            this.$message('待开发')
        }
        else if(state==='备货计划查看'){
          this.$emit('SonRowData',RowIndexData)
        }else if(state==='分配'){
          this.$emit('SeeDialogFn',{itemId:RowIndexData.itemId ,state:'分配'},RowIndexData)
        }else if(state==='历史销量'){
          window.open('#/HistoricalSales?Id='+RowIndexData.stockId);
        }else if(state==='商品库存'){
          window.open('#/commodityStock?Id='+RowIndexData.stockId);
        }
      },
      addRemarks:function (state) {//添加备注保存
        let _this=this;
        console.log(this.RemarksData);
        if(this.RemarksState==='同意'){
          this.httpPost('stockProductPlan/pacthStockItemState',_this.HandleTasksSon).then(res=>{
            if(res.data.result===true){
              this.RemarksDialog=false;
              this.SonDifferentiatedRequest();
            }else {
              this.$message(res.data.message)
            }
          })
        }else if(this.RemarksState==='不同意'){
          this.httpPost('stockProductPlan/pacthStockItemState',_this.HandleTasksSon).then(res=>{
            if(res.data.result===true){
              this.RemarksDialog=false;
              this.SonDifferentiatedRequest();
            }else {
              this.$message(res.data.message)
            }
          })
        }
      },
      addRemarks2:function (state) {//批量添加备注保存
        let _this=this;
        console.log(this.RemarksData);
        if(this.RemarksState==='同意'){
          this.httpPost('stockProductPlan/pacthStockItemState',_this.HandleTasksSon).then(res=>{
            if(res.data.result===true){
              this.RemarksDialog=false;
              this.SonDifferentiatedRequest();
            }else {
              this.$message(res.data.message)
            }
          })
        }else if(this.RemarksState==='不同意'){
          this.httpPost('stockProductPlan/pacthStockItemState',_this.HandleTasksSon).then(res=>{
            if(res.data.result===true){
              this.RemarksDialog=false;
              this.SonDifferentiatedRequest();
            }else {
              this.$message(res.data.message)
            }
          })
        }
      },
      dilRemarks:function () {//添加备注清空
        setTimeout(()=>{//神经病 和保存事件走的异步，先后混乱；
          this.HandleTasksSon.stockItemNote='';
          this.HandleTasks.stockItemNote='';
        },10)
      },
      EstablishPurchaseFn:function () {//采购弹窗确定
        this.$refs.EstablishPurchase.PostData()
      },
      dilEstablishPurchase:function () {//子回调关闭采购弹窗
        this.EstablishPurchase.dis=false;
        this.SonDifferentiatedRequest();
        this.getSkuCount();
      },
      deleteListFn:function (itemId,relaId) {//封数据
        this.deleteList=[];
        for(let i=0; i<itemId.length; i++){
          for(let k=0; k<relaId.length; k++){
            if(i===k){
              let Obj={itemId:itemId[i], relaId:relaId[k]};
              this.deleteList.push(Obj)
            }
          }
          console.log(this.deleteList)
        }
      },
      combination:function (val) {//条件符合第一阶段返回true 用于按钮切换
        let stateName=this.stateName;
        if(stateName==='草稿' || stateName==='待主管审核'|| stateName==='主管审核不通过'|| stateName==='待供应链处理'|| stateName==='待第三方审核'||
          stateName==='第三方审核不通过'|| stateName==='待提交采购'){
          this.ButtonState=true;
        }else {
          this.ButtonState=false;
        }
      },
      combinationDis:function (val) {//条件符合第一阶段返回true 禁用
        let stateName=this.stateName;
        if(stateName==='草稿'|| stateName==='待第三方审核'|| stateName==='待提交采购'){
          this.RowDisabled=false;
        }else {
          this.RowDisabled=true;
        }
      },
      ObjectiveWarehouseData(){
        this.httpGet('productMaterial/userAllWareHouse','','Scm').then(res => {
          let GetDataList = res.data.params.listWareInfo;
          setTimeout(()=>{
            this.WarehouseList=this.tool.replaceObjKey(GetDataList,'userWare_Id','ware_Name')
          },20);
        });
        this.httpGet('productMaterial/getCompIdAllWareHouse?type=1').then(res => {
          console.log(res)
          let GetDataList = res.data;
          setTimeout(()=>{
            this.WarehouseList2=this.tool.replaceObjKey(GetDataList,'whId','whName')
          },20)
        });
        this.httpGet('stockProductPlan/getRefTraType').then(res => {
          let GetDataList = res.data;
          setTimeout(()=>{
            this.transport=this.tool.replaceObjKey(GetDataList,'refId','refValue')
          },20)
        });
      },

      CalculationHeight:function () {//合并表格 小行统一高度。
        let objList=document.getElementsByClassName('simulation');
        let heights=[];
        for(let i=0;i<objList.length;i++) {
          let objCell = objList[i];
          let objId = objCell.id;
          let subName = objId.substring(objId.indexOf('-') + 1).split('/');
          let group = subName[0];
          let groupRow = subName[1];
//          console.log('heights length:', heights.length);
          if (heights.length < group + 1) {
            this.$set(heights, group, []);
          }
          setTimeout(() => {
            if (heights[group].length < groupRow + 1) {
              this.$set(heights[group], groupRow, 0);
            }
          }, 30);
          setTimeout(() => {
            if (heights[group][groupRow] < objCell.offsetHeight) {
              this.$set(heights[group], groupRow, objCell.offsetHeight);
            }
          }, 100)
        }
        setTimeout(()=>{//设置最大高度和 子元素的 -top 值；
          for (let m = 0; m < heights.length; m++) {
            for (let n = 0; n < heights[m].length; n++) {
              for (let k = 0; k < objList.length; k++) {
                if (objList[k].id == 'simulation-' + m + '/' + n) {
                  objList[k].style.height = (heights[m][n]) + 'px';
                  let child = objList[k].childNodes[0];
                  child.style.marginTop = -(child.offsetHeight/2)+'px';
//                  console.log(child.offsetHeight)
                }
              }
            }
          }
        },200)
      },
      HandleData:function () {//抖机灵
        let arr2=['1','7','1','1','7','2','3','4','5','5','6','6','7', '8','9','9','10'];
        let arr=arr2.sort();
        let newArr = [], tempArr = [];
        for(let i=0,j=arr.length;i<j;i++){
          if(arr[i] == arr[i+1]){
            tempArr.push(arr[i]);
          } else {
            tempArr.push(arr[i]);
            console.log(tempArr);
            newArr.push(tempArr.slice(0));
            tempArr.length = 0;
          }
        }
      },

    },


  }


</script>

<style scoped>
  .simulation{
    border-bottom: 1px solid #dfe6ec;
    margin-left: -18px !important;
    margin-right: -18px !important;
    padding: 1px 1px 0 1px !important;
    min-height: 130px;
    position: relative;
  }
  .childDiv{
    position: relative;
    top:50%;
  }

</style>
