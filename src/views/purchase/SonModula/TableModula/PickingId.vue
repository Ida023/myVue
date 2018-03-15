<template>
  <div>
    <el-row class="supplier_btn" style="margin: 10px 0 10px 0">
      <!--<el-button type="primary" size="small" @click="BatchOperation('待供应链处理')" v-if="SonScreenData.stateName==='待供应链处理'">批量处理</el-button>-->
      <!--<el-button type="primary" size="small" @click="BatchOperation('待第三方审核','0')" v-if="SonScreenData.stateName==='待第三方审核'">批量同意</el-button>-->
      <!--<el-button type="primary" size="small" @click="BatchOperation('待第三方审核','1')" v-if="SonScreenData.stateName==='待第三方审核'">批量不同意</el-button>-->
      <!--<el-button type="primary" size="small" @click="BatchOperation('第三方审核不通过')" v-if="SonScreenData.stateName==='第三方审核不通过'">批量撤回</el-button>-->
      <!--<el-button type="primary" size="small" @click="BatchOperation('待提交采购')" v-if="SonScreenData.stateName==='待提交采购'">批量处理</el-button>-->
      <!--<span v-if="SonScreenData.stateName==='待提交采购'">
      <span>装箱共计:<span style="color: red">25.1234</span>m</span></span>-->
      <!--<span style="margin-left: 20px" v-if="SonScreenData.stateName==='待提交采购'"><span>重量共计:<span style="color: red">25.1234</span>KG</span></span>-->
      <!--<el-button type="primary" size="small" @click="BatchOperation('待采购')" v-if="SonScreenData.stateName==='待采购'">创建采购</el-button>-->
      <span v-if="SonScreenData.stateName==='待提交采购'"><span>装箱共计:<span style="color: red">{{ ScreenData.productVolumes }}</span>m³</span></span>
      <span style="margin-left: 20px" v-if="SonScreenData.stateName==='待提交采购'"><span>重量共计:<span style="color: red">{{ ScreenData.productWeights }}</span>KG</span></span>
    </el-row>
    <div class="padno">
    <el-table :data="TableData" border tooltip-effect="dark" style="width: 100%" :stripe="false"  @selection-change="selsChange">
      <el-table-column type="selection" width="45" align="center"></el-table-column>
      <el-table-column width="90" id="space" label="操作" align="center" >
        <template scope="scope">
          <el-tooltip content="费用"  effect="dark" placement="bottom"   v-if="ButtonInfo['费用']!='0'" >
            <i  class="iconfontyyy" content="Bottom center" @click="RowData(scope.row, '费用')">&#xe757;</i>
          </el-tooltip>
          <el-tooltip content="日志"  effect="dark" placement="bottom"    v-if="ButtonInfo['日志']!='0'">
            <i  class="iconfontyyy" content="Bottom center" @click="RowData(scope.row, '日志')">&#xe602;</i>
          </el-tooltip>
          <el-tooltip content="查看"  effect="dark" placement="bottom"    v-if="ButtonInfo['查看']!='0'">
            <i  class="iconfontyyy" content="Bottom center" @click="RowData(scope.row, '查看')">&#xe600;</i>
          </el-tooltip>
          <el-tooltip content="编辑"  effect="dark" placement="bottom"   v-if="ButtonInfo['编辑']!='0'" v-show="ButtonState===false && ScreenData.stateName!=='待采购' && ScreenData.stateName!=='审核中'">
            <i  class="iconfontyyy" content="Bottom center" @click="RowData(scope.row, '编辑')">&#xe6e5;</i>
          </el-tooltip>
          <el-tooltip content="物流"  effect="dark" placement="bottom"   v-if="ButtonInfo['物流']!='0'" v-show="ButtonState===false || ScreenData.stateName==='待采购'">
            <i  class="iconfontyyy" content="Bottom center" @click="RowData(scope.row, '物流')">&#xe689;</i>
          </el-tooltip>
          <el-tooltip content="销售"  effect="dark" placement="bottom"   v-if="ButtonInfo['销售']!='0'" v-show="ButtonState===false || ScreenData.stateName==='待采购'">
            <i  class="iconfontyyy" content="Bottom center" @click="RowData(scope.row, '销售')">&#xe6f5;</i>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column sortable width="120" label="备货子ID　所属备货计划" align="center">
        <template scope="scope">
         <span>{{ scope.row.itemNo }}</span><br/>
         <span class="Astyel" @click="RowData(scope.row, '备货计划查看')">{{ scope.row.stockNo }}</span><br/>
        </template>
      </el-table-column>
      <el-table-column sortable label="图片" align="center"  width="104">
        <template scope="scope">
          <div style="margin-left:0px">
            <img v-if="scope.row.productImage!=null" style="width: 70px; height: 70px;" :src="RmsUrl+scope.row.productImage"/>
          </div>
        </template>
      </el-table-column>
      <el-table-column sortable label="SKU/MSKU/ASIN/名称" align="center" width="125">
        <template scope="scope">
            <span>{{ scope.row.skuNo }}</span><br/>
            <span>{{ scope.row.productName }}</span><br>
          <el-row style="margin-top: 5px">
            <el-tooltip content="商品库存"  effect="dark" placement="bottom">
              <i  class="iconfontyyy" content="Bottom center" @click="RowData(scope.row, '商品库存')">&#xe6f6;</i>
            </el-tooltip>
            <el-tooltip content="历史销量"  effect="dark" placement="bottom">
              <i  class="iconfontyyy" content="Bottom center" @click="RowData(scope.row, '历史销量')">&#xe61b;</i>
            </el-tooltip>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column sortable label="需求数量" align="center">
        <template scope="scope">
          <el-input v-model="scope.row.requestQty" :disabled="RowDisabled"  class="tableInput" name="input66" type="number" v-if="scope.row.stateUrl===true"></el-input>
          <span v-if="scope.row.stateUrl===false">{{ scope.row.requestQty }}</span>
        </template>
      </el-table-column>
      <el-table-column sortable label="预估销售天数" align="center">
        <template scope="scope">
          <el-input v-model="scope.row.requestSalesDays"  :disabled="RowDisabled" class="tableInput" name="input66" type="number" v-if="scope.row.stateUrl===true"></el-input>
          <span v-if="scope.row.stateUrl===false"> {{ scope.row.requestSalesDays }}</span>
        </template>
      </el-table-column>
      <!--<el-table-column sortable label="采购仓库" align="center" width="120">-->
        <!--<template scope="scope">-->
          <!--<el-select  placeholder="请选择" v-model="scope.row.startStorehouse" :disabled="RowDisabled" clearable filterable class="tableInput" v-if="scope.row.stateUrl===true">-->
            <!--<el-option-->
              <!--v-for="item in WarehouseList2"-->
              <!--:key="item.value"-->
              <!--:label="item.label"-->
              <!--:value="item.value"-->
            <!--&gt;-->
            <!--</el-option>-->
          <!--</el-select>-->
          <!--<span v-if="scope.row.stateUrl===false">{{ switchData.data3 }}</span>-->
        <!--</template>-->
      <!--</el-table-column>-->
      <el-table-column sortable label="运输方式" align="center" width="120">
        <template scope="scope">
          <el-select  placeholder="请选择" v-model="scope.row.requestTransportType" :disabled="RowDisabled" clearable filterable class="tableInput" v-if="scope.row.stateUrl===true">
            <el-option
              v-for="item in transport"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
          <span v-if="scope.row.stateUrl===false">{{ switchData.data1 }}</span>
        </template>
      </el-table-column>
      <el-table-column sortable label="目的仓" align="center" width="120">
        <template scope="scope">
          <el-select  placeholder="请选择" v-model="scope.row.requestWarehouse" :disabled="RowDisabled" clearable filterable class="tableInput" v-if="scope.row.stateUrl===true">
            <el-option
              v-for="item in WarehouseList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
          <span v-if="scope.row.stateUrl===false">{{ switchData.data2 }}</span>
        </template>
      </el-table-column>
      <!--<el-table-column sortable label="库存信息" align="center" >-->
        <!--<template scope="scope">-->
          <!--<span>目的仓库存</span><br />-->
          <!--<span>货架数:{{ scope.row.shelvesCount }}</span><br />-->
          <!--<span>可销售:{{ scope.row.canSale }}</span><br />-->
          <!--<span>锁定数:{{ scope.row.slockCount }}</span><br />-->
          <!--<span>目的仓在途</span><br />-->
          <!--<span>海运:{{ scope.row.shippingProductCount }}</span><br />-->
          <!--<span>空运:{{ scope.row.airProductCount }}</span>-->
        <!--</template>-->
      <!--</el-table-column>-->
      <!--<el-table-column sortable label="销售数据" align="center">-->
        <!--<template scope="scope">-->
          <!--<span>7天销量：{{ scope.row.salesCount_Seven }}</span><br />-->
          <!--<span>15天销量：{{ scope.row.salesCount_fifteen }}</span><br />-->
          <!--<span>30天销量：{{ scope.row.salesCount_thirty }}</span>-->
        <!--</template>-->
      <!--</el-table-column>-->
      <el-table-column sortable label="重量（kg）" align="center">
        <template scope="scope">
          <span v-text="(scope.row.productWeight* scope.row.requestQty)/1000"></span>
        </template>
      </el-table-column>
      <el-table-column sortable label="体积（cm³）" align="center">
        <template scope="scope">
          <span v-text="scope.row.productbulk * scope.row.requestQty"></span>
        </template>
      </el-table-column>
      <el-table-column sortable label="到货记录" align="center" width="150">
        <template scope="scope">
          <span v-for="(items,index) in scope.row.data">
              <span>{{ items.cgNo }}</span><br />
              <span>{{ items.count }}</span><br />
            </span>
          <el-tooltip content="分配"  effect="dark" placement="bottom"   v-if="ButtonInfo['分配']!='0'"  v-show="ButtonState===false && ScreenData.stateName!=='待采购'
            && ScreenData.stateName!=='审核中'">
            <i  class="iconfontyyy" content="Bottom center" @click="RowData(scope.row, '分配')">&#xe64f;</i>
          </el-tooltip>
          <!--<el-tooltip content="分配"  effect="dark" placement="bottom" >-->
            <!--<i  class="iconfontyyy" content="Bottom center" @click="RowData(scope.row, '分配')">&#xe64f;</i>-->
          <!--</el-tooltip>-->
        </template>
      </el-table-column>
      <el-table-column sortable label="操作" align="center" width="50">
        <template scope="scope">
              <el-tooltip class="item" effect="dark" content="删除" v-if="ScreenData.stateName==='草稿'" >
                <i class="iconfontyyy" @click="RowData(scope.row, '删除')">&#xe6f7;</i>
              </el-tooltip>
              <el-tooltip content="保存"  effect="dark" placement="bottom" v-if="ScreenData.stateName==='草稿'">
                <i  class="iconfontyyy" content="Bottom center" @click="RowData(scope.row, '保存')">&#xe613;</i>
              </el-tooltip>
              <el-tooltip content="保存"  effect="dark" placement="bottom" v-if="ScreenData.stateName==='待第三方审核' || ScreenData.stateName==='待提交采购'">
                <i  class="iconfontyyy" content="Bottom center" @click="RowData(scope.row, '保存2');">&#xe613;</i>
              </el-tooltip>
              <el-tooltip content="提交"  effect="dark" placement="bottom" v-if="ScreenData.stateName==='待提交采购'">
                <i  class="iconfontyyy" content="Bottom center" @click="RowData(scope.row, '提交')">&#xe63e;</i>
              </el-tooltip>
              <el-tooltip content="同意"  effect="dark" placement="bottom" v-if="ScreenData.stateName==='待第三方审核' || ScreenData.stateName==='待供应链处理'">
                <i  class="iconfontyyy" content="Bottom center" @click="RowData(scope.row, '同意')">&#xe67e;</i>
              </el-tooltip>
              <el-tooltip content="不同意"  effect="dark" placement="bottom" v-if="ScreenData.stateName==='待第三方审核'">
                <i  class="iconfontyyy" content="Bottom center" @click="RowData(scope.row, '不同意')">&#xe665;</i>
              </el-tooltip>
              <el-tooltip content="编辑"  effect="dark" placement="bottom" v-if="ScreenData.stateName==='待第三方审核' || ScreenData.stateName==='待提交采购'">
                <i  class="iconfontyyy" content="Bottom center" @click="RowData(scope.row, '编辑2'); scope.row.stateUrl=true">&#xe6e5;</i>
              </el-tooltip>
              <el-tooltip content="回退"  effect="dark" placement="bottom" v-if="ScreenData.stateName==='第三方审核不通过'">
                <i  class="iconfontyyy" content="Bottom center" @click="RowData(scope.row, '回退')">&#xe666;</i>
              </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column sortable label="状态" align="center"  width="80">
        <template scope="scope">
          <span v-if="scope.row.nodeName!==null" v-text="scope.row.nodeName">/</span>
          <span v-if="scope.row.allocationStatus!==null" v-text="'/'+scope.row.allocationStatus">/</span>
          <span v-if="scope.row.salesStatus!==null" v-text="'/'+scope.row.salesStatus">/</span>
          <span v-if="scope.row.purStatus!==null" v-text="'/'+scope.row.purStatus">/</span>
        </template>
      </el-table-column>
    </el-table>
    </div>
    <!--备注弹窗-->
    <el-dialog title="添加备注" :visible.sync="RemarksDialog" size="tiny" :close-on-click-modal="false" @open="dilRemarks" >
      <el-input type="textarea" v-model="HandleTasksSon.stockItemNote"></el-input>
      <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="addRemarks(RemarksState);" :loading="$store.state.loading">保 存</el-button>
          <el-button @click="RemarksDialog = false">取 消</el-button>
        </span>
    </el-dialog>
    <!--查看弹窗-->
    <!--<el-dialog :title="SeeDialog.SeeDialogTitle" :visible.sync="SeeDialog.dis" :size="SeeDialog.SeeDialogSize" :close-on-click-modal="false" @open="dilRemarks" >-->
      <!--<Journal v-if="RemarksState==='日志'" ref="Journal"></Journal>-->
      <!--<Remarks v-if="RemarksState==='查看'" ref="Remarks"></Remarks>-->
      <!--<AllocationStatus v-if="RemarksState==='物流'" ref="AllocationStatus"></AllocationStatus>-->
      <!--<SalesStatus v-if="RemarksState==='销售'" ref="SalesStatus"></SalesStatus>-->
      <!--<CostDetails v-if="RemarksState==='分配'" ref="CostDetails"></CostDetails>-->
      <!--<span slot="footer" class="dialog-footer">-->
          <!--<el-button @click="SeeDialog.dis = false">取 消</el-button>-->
          <!--<el-button type="primary" @click="CostDetailsFn">确 定</el-button>-->
        <!--</span>-->
    <!--</el-dialog>-->
    <!--编辑查看小弹窗-->
    <el-dialog :title="editDialog.editDialogTitle" :visible.sync="editDialog.dis" size="small" :close-on-click-modal="false" @open="dilRemarks" >
      <StockingId ref="StockingId"></StockingId>
      <EstablishPurchase ref="EstablishPurchase" v-if="RemarksState==='待采购'"></EstablishPurchase>
      <span slot="footer" class="dialog-footer">
          <el-button @click="" :loading="$store.state.loading">确 定</el-button>
          <el-button @click="editDialog.dis = false">取 消</el-button>
        </span>
    </el-dialog>
    <!--创建采购-->
    <el-dialog :title="EstablishPurchase.editDialogTitle" :visible.sync="EstablishPurchase.dis" size="small" :close-on-click-modal="false" @open="dilRemarks" >
      <EstablishPurchase ref="EstablishPurchase" @dilEstablishPurchase="dilEstablishPurchase"></EstablishPurchase>
      <span slot="footer" class="dialog-footer">
          <el-button @click="EstablishPurchaseFn" :loading="$store.state.loading">确 定</el-button>
          <el-button @click="EstablishPurchase.dis = false">取 消</el-button>
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
  import EstablishPurchase from './operation/EstablishPurchase';
  import ElRow from "element-ui/packages/row/src/row";
  export default{
    components:{
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
    props:['ScreenData','TableListData'],
    data() {
      return {
        ButtonInfo:{},//按钮权限列表20171227
        TableData:[],
        sels:[],    //批量删除已选的条目数
        GrandsonID:'',//给孙子的 ID，根据具体要什么ID是什么ID，进行填值
        SonScreenData:this.ScreenData, //watch监听，在第一次加载子组件，不会触发,直接赋值一次，后续由watch 赋值。
        SonTableListData:this.TableListData,//watch监听，在第一次加载子组件，不会触发,直接赋值一次，后续由watch 赋值。
        ButtonState:true,
        transport:[],
        WarehouseList:[],
        WarehouseList2:[],
        RemarksDialog:false,
        RemarksDialogID:{
          itemId:[]
        },
        SeeDialog:{
          dis:false,
          SeeDialogTitle:'',
          SeeDialogSize:'small'
        },
        editDialog:{
          dis:false,
          editDialogTitle:''
        },
        EstablishPurchase:{
          dis:false,
          editDialogTitle:''
        },

        RemarksState:'',
        RemarksData:{
          val:'',
          id:[],
        },
        EditStock:{
          itemId:'',//备货子id
          requestQty:'',//需求数量
          requestSalesDays:'',//预估销售天数
          requestTransportType:'',//运输方式
          requestWarehouse:'',//目的仓
        },
        deleteList:[],
        HandleTasks:{
          relaId:[],
          state:true,
          processkey:'stock_plan',
          stockItemNote:'',
          nodeId:'',
          nodeName:'',
          stockId:[],
          itemId:'',
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
        HandleTasksSon2:{
          relaId:[],
          state:true,
          processkey:'stock_plan',
          stockItemNote:'',
          nodeId:'',
          nodeName:'',
          stockId:[],
          itemId:'',
        },
        batchData:{
          itemId:[],
          relaId:[],
          stockId:[],
        },
        switchData:{
          data1:'',
          data2:'',
          data3:''
        },
        stateName:'草稿',
        RowDisabled:true
      }
    },
    mounted(){
      //      this.HandleData();
//      this.getListData();
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
      getListData:function (val) {
          this.TableData=val;
          console.log(this.TableData)
          console.log(888888889)
      },
      selsChange: function (sels) {//批量操作获取SKU
        console.log(sels)
        let _this=this;
        _this.batchData.stockId=[];
        _this.batchData.relaId=[];
        _this.batchData.itemId=[];
        for(let i=0; i<sels.length;i++){
          if(sels[i].relaId){
            _this.batchData.relaId.push(sels[i].relaId)
          }
          if(sels[i].stockId){
            _this.batchData.stockId.push(sels[i].stockId)
          }
          if(sels[i].itemId){
            _this.batchData.itemId.push(sels[i].itemId)
          }
        }
        console.log(_this.batchData);
      },

      BatchOperation:function (val,state) {//批量操作，状态区分做操作。
        let _this=this;
        let batchData=this.batchData;
        _this.RemarksDialogID.itemId=batchData.itemId;
        if( _this.RemarksDialogID.length<1){
          _this.tips();
        }else{
            if(val==='待采购'){
              _this.EstablishPurchase.dis=true;
              _this.EstablishPurchase.editDialogTitle='采购处理';
              setTimeout(()=>{
                this.$refs.EstablishPurchase.getListData(_this.RemarksDialogID.itemId);
              },20)

            } else if(val==='待供应链处理'){
            alert('待供应链处理')
          }else if(val==='待第三方审核'){
            if(state==='0'){
              this.RemarksState='同意';
              this.RemarksDialog=true;
              _this.doItem('您确定删除此备货计划？','stockProductPlan/pacthStockItemState',_this.HandleTasks,_this.GetListObj);
            }else if (state==='1'){
              this.RemarksState='不同意';
              this.RemarksDialog=true;
            }
          }else if(val==='第三方审核不通过'){
            _this.doItem('您确定批量回退备货计划？（备货计划将重新提交待供应链处理）','stockProductPlan/pacthStockState',_this.RemarksData.id,_this.SonDifferentiatedRequest);
          }else if(val==='待提交采购'){
            _this.doItem('您确定批量提交备货计划给采购？','stockProductPlan/pacthStockItemState',_this.RemarksData.id,_this.SonDifferentiatedRequest);
          }
        }
      },
      EstablishPurchaseFn:function () {//采购弹窗确定
        this.$refs.EstablishPurchase.PostData()
      },
      dilEstablishPurchase:function () {//子回调关闭采购弹窗
        this.EstablishPurchase.dis=false;
        this.DifferentiatedRequest();
      },
      addData:function () {
        let arr = this.data ;
        arr.filter(item,function () {
          if(item.children!==''){

          }
        })
      },
      SonDifferentiatedRequest:function () {
        this.$emit('DifferentiatedRequest');
        this.SeeDialog.dis=false;
      },
      RowData:function (row, state) {//小行内 的点击操作：备货子ID
        console.log(row);
        this.HandleTasksSon.stockId='';
        this.HandleTasksSon.relaId=[];
        this.HandleTasksSon.itemId=[];
        this.HandleTasksSon2.stockId=[];
        this.HandleTasksSon2.relaId=[];
        let _this=this;
        let itemIdArr=[];
        let relaIdArr=[];
        let RowIndexData='';
        console.log(RowIndexData);
        this.RemarksState=state;
        this.RemarksData.id=[];
        this.RemarksData.id.push(RowIndexData.Id);
        console.log(this.RemarksData.id);
        this.SeeDialog.SeeDialogSize='small';
        this.HandleTasksSon.nodeId=this.SonScreenData.nodeId;
        this.HandleTasksSon.nodeName=this.SonScreenData.nodeName;
        this.HandleTasksSon.stockId=row.stockId;
        this.HandleTasksSon.relaId.push(row.relaId);
        this.HandleTasksSon.itemId.push(row.itemId);
        this.HandleTasksSon.stockItemNote=this.RemarksData.val;
        this.HandleTasksSon2.nodeId=this.SonScreenData.nodeId;
        this.HandleTasksSon2.nodeName=this.SonScreenData.nodeName;
        this.HandleTasksSon2.stockId.push(row.stockId);
        this.HandleTasksSon2.relaId.push(row.relaId);
        this.HandleTasksSon2.itemId=row.itemId;
        this.HandleTasksSon2.stockItemNote=this.RemarksData.val;
        if(state==='费用'){
          this.$emit('SeeDialogFn',{itemId:row.itemId ,state:'费用'})
        }else if(state==='日志'){
          this.$emit('SeeDialogFn',{itemId:row.itemId ,state:'日志'})
        }else if(state==='查看'){
          this.$emit('SeeDialogFn',{itemId:row.itemId ,state:'查看'})
        }else if(state==='编辑'){
          this.$emit('SeeDialogFn',{itemId:RowIndexData.itemId ,state:'编辑'},row)
        }else if(state==='物流'){
          this.$emit('SeeDialogFn',{itemId:row.itemId ,state:'物流'})
        }else if(state==='销售'){
          this.$emit('SeeDialogFn',{itemId:row.itemId ,state:'销售'})
        } else if(state==='保存'){
          this.EditStock.itemId=row.itemId;
          this.EditStock.requestQty=row.requestQty;
          this.EditStock.requestSalesDays=row.requestSalesDays;
          this.EditStock.requestTransportType=row.requestTransportType;
          this.EditStock.requestWarehouse=row.requestWarehouse;
          this.EditStock.startStorehouse=row.startStorehouse;
            this.httpPost('stockProductPlan/pacthStockItemInfo',this.EditStock).then(res=>{
                if(res.data.result===true){
                  console.log(res)
                }else{
                    this.$message(res.data.message)
                }
            });
        }else if(state==='删除'){
          itemIdArr=[];
          relaIdArr=[];
          this.deleteList=[];
          setTimeout(()=>{
            itemIdArr.push(row.itemId);
            relaIdArr.push(row.relaId);
            this.deleteListFn(itemIdArr,relaIdArr);
            this.httpPost('stockProductPlan/deleteStockItemInfos',this.deleteList).then(res=>{
              if(res.data.result===true){
                console.log(res);
                this.$emit('DifferentiatedRequest');
                this.$message('操作成功')
              }else {
                this.$message(res.data.message)
              }
            })
          },20)

        }else if(state==='分配'){
          this.$emit('SeeDialogFn',{itemId:RowIndexData.itemId ,state:'分配'},row)
        }else if(state==='编辑2'){
          row.stateUrl=true;
        }else if(state==='保存2'){
          row.stateUrl=false;
          this.EditStock.itemId=row.itemId;
          this.EditStock.requestQty=row.requestQty;
          this.EditStock.requestSalesDays=row.requestSalesDays;
          this.EditStock.requestTransportType=row.requestTransportType;
          this.EditStock.requestWarehouse=row.requestWarehouse;
          for(let i=0; i<this.transport.length; i++){
            if(row.requestTransportType===this.transport[i].value){
              this.switchData.data1=this.transport[i].label;
            }
          }
          for(let i=0; i<this.WarehouseList.length; i++){
            if(row.requestWarehouse===this.WarehouseList[i].value){
              this.switchData.data2=this.WarehouseList[i].label;
            }
          }
          for(let i=0; i<this.WarehouseList2.length; i++){
            if(row.startStorehouse===this.WarehouseList2[i].value){
              this.switchData.data3=this.WarehouseList2[i].label;
            }
          }
          this.httpPost('stockProductPlan/pacthStockItemInfo',this.EditStock).then(res=>{
            if(res.data.result===true){
              console.log(res)
              row.stateUrl=false;
            }else{
              this.$message(res.data.message)
            }
          });
        }else if(state==='提交'){
//            alert(333)
          this.HandleTasksSon.state=true;
          _this.doItem('您确定提交此备货计划给采购？','stockProductPlan/pacthStockItemState',_this.HandleTasksSon,_this.SonDifferentiatedRequest);
        }else if(state==='同意'){
          this.RemarksDialog=true;
          this.HandleTasksSon.state=true;
        }else if(state==='不同意'){
          this.RemarksDialog=true;
          this.HandleTasksSon.state=false;
        }else if(state==='回退'){
          this.HandleTasksSon.stockItemNote=this.RemarksData.val;
          _this.doItem('您确定回退此备货计划？（备货计划将重新提交第三方审核）?','stockProductPlan/pacthStockState',_this.HandleTasksSon2,_this.SonDifferentiatedRequest);
        }else if(state==='库存'){
            this.$message('待开发')
        }else if(state==='备货计划查看'){
          this.$emit('SonRowData',row)
        }else if(state==='历史销量'){
          window.open('#/HistoricalSales?Id='+row.stockId);
        }else if(state==='商品库存'){
          window.open('#/commodityStock?Id='+row.stockId);
        }
      },
      deleteListFn:function (itemId,relaId) {//封数据
        alert(itemId.length)
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
      CostDetailsFn:function () {
        this.$refs.CostDetails.PostData()
      },
      addRemarks:function (state) {//添加备注保存
        let _this=this;
        console.log(this.RemarksData);
        if(this.RemarksState==='同意'){
          this.httpPost('stockProductPlan/pacthStockItemState',_this.HandleTasksSon).then(res=>{
              if(res.data.result===true){
                this.RemarksDialog=false;
                this.$emit('DifferentiatedRequest')
              }else {
                this.$message(res.data.message)
              }
          })
        }else if(this.RemarksState==='不同意'){
          this.httpPost('stockProductPlan/pacthStockItemState',_this.HandleTasksSon).then(res=>{
            if(res.data.result===true){
              this.RemarksDialog=false;
              this.$emit('DifferentiatedRequest')
            }else {
              this.$message(res.data.message)
            }
          })
        }
      },
      dilRemarks:function () {//添加备注清空
        setTimeout(()=>{//神经病 和保存事件走的异步，先后混乱；
          this.HandleTasksSon.stockItemNote='';
        },10)
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
        if(stateName==='草稿'|| stateName==='待第三方审核' || stateName==='待提交采购'){
            this.RowDisabled=false;
        }else {
          this.RowDisabled=true;
        }
      },
      ObjectiveWarehouseData(){
        this.httpGet('productMaterial/userAllWareHouse','','Scm').then(res => {
          let GetDataList = res.data.params.listWareInfo;
          console.log(GetDataList)
          setTimeout(()=>{
            this.WarehouseList=this.tool.replaceObjKey(GetDataList,'userWare_Id','ware_Name')
          },20)
          this.httpGet('productMaterial/getCompIdAllWareHouse?type=1').then(res => {
            let GetDataList = res.data;
            console.log(GetDataList)
            setTimeout(()=>{
              this.WarehouseList2=this.tool.replaceObjKey(GetDataList,'whId','whName')
            },20)
            console.log(this.WarehouseList2)
          });
          this.httpGet('stockProductPlan/getRefTraType').then(res => {
            let GetDataList = res.data;
            setTimeout(()=>{
              this.transport=this.tool.replaceObjKey(GetDataList,'refId','refValue')
            },20)
          });
        })
      },



    },
    watch:{
      'ScreenData':{
        handler(val){
          this.SonScreenData=val;
          this.stateName=val.stateName;
          this.combination(val)
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
          console.log(val)
        },
        deep: true
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
    min-height: 180px;
    position: relative;
  }
  .childDiv{
    position: relative;
    top:50%;
  }

</style>
