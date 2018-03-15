<template>
  <div id="">
    <p style="margin-top: -10px;">数量</p>
    <div class="table_padding">
      <el-table :data="TableData" border tooltip-effect="dark" style="width: 100%" :stripe="false">
        <el-table-column sortable label="SKU/名称" align="center" prop="skuNo" ></el-table-column>
        <el-table-column sortable label="原计划数量" align="center" prop="requestQty"></el-table-column>
        <el-table-column sortable label="更新后数量" align="center">
          <template scope="scope">
            <div>
              <el-input type="number" v-model="scope.row.qty" @change="qtyFn(scope.row)"></el-input>
            </div>
          </template>
        </el-table-column>
        <el-table-column sortable label="新增备货计划数量" align="center">
          <template scope="scope">
            <span v-html="scope.row.requestQty - scope.row.qty >= 0 ? scope.row.requestQty - scope.row.qty : '输入数量有误'"></span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="" style="margin-top: 20px">
      <el-row class="rowStyle">
        <el-col :span="3" class="textTop">原目的仓</el-col>
        <el-col :span="12">
          <el-select  placeholder="请选择" v-model="getData.oldWhId" clearable filterable >
            <el-option
              v-for="item in GetDataList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-col>
      </el-row>
      <el-row >
        <el-col :span="3" class="textTop">原运输方式</el-col>
        <el-col :span="12">
          <el-select  placeholder="请选择" v-model="getData.oldTransportType" clearable filterable >
            <el-option
              v-for="item in transport"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-col>
      </el-row>
    </div>
    <p class="P_style">新备货计划分配部门/目的仓/物流方式</p>
    <div>
      <el-row class="rowStyle">
        <el-col :span="3" class="textTop">分配部门</el-col>
        <el-col :span="12">
          <deptSelect :select-value="warehouse" :isDisabled="isDisabled" select-type="lendDept" @child-change-Val="SonData" ref="deptSelects"></deptSelect>
        </el-col>
      </el-row>
      <el-row class="rowStyle">
        <el-col :span="3" class="textTop">目的仓</el-col>
        <el-col :span="12">
          <el-select  placeholder="请选择" v-model="getData.newToWhId" clearable filterable >
            <el-option
              v-for="item in GetDataList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-col>
      </el-row>
      <el-row class="rowStyle">
        <el-col :span="3" class="textTop">运输方式</el-col>
        <el-col :span="12">
          <el-select  placeholder="请选择" v-model="getData.newTransportType" clearable filterable >
            <el-option
              v-for="item in transport"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-col>
      </el-row>
    </div>
    <!--<p class="P_style">修改结果</p>-->
    <!--<p>原计划 <span class="red" v-text="Exhibition.Number1"> </span> 个 <span class="red" v-text="Exhibition.transportType1"></span> 至 <span class="red" v-text="Exhibition.Warehouse1"></span>，修改为 <span class="red" v-text="Exhibition.Number2"></span> 个-->
      <!--<span class="red" v-text="Exhibition.transportType2"></span>至<span class="red" v-text="Exhibition.Warehouse2"></span></p>-->
    <!--<p>同时新增 <span class="red" v-text="Exhibition.Number3"> </span> 个 <span class="red" v-text="Exhibition.transportType3"></span> 至 <span class="red" v-text="Exhibition.Warehouse3"></span>，分配部门：<span class="red" v-text="Exhibition.department"></span></p>-->
  </div>
</template>

<script>
  import ElRow from "element-ui/packages/row/src/row";
  import ElCol from "element-ui/packages/col/src/col";
  import transportType from '../../BasicsModula/transportType';
  import ObjectiveWarehouse from '../../BasicsModula/ObjectiveWarehouse';
  import deptSelect from 'components/listData/getDeptList.vue'
  export default{
    /*
     GrandsonData: 父组件条件，用于 后续 各种状态，各种条件下，操作按钮控制。
     */
    components: {
      ElCol,
      ElRow,
      transportType,
      ObjectiveWarehouse,
      deptSelect
    },
    props:['PassGrandsonData'],
    name:'StockingId',
    data() {
      return {
        props:{
          value:'userId',
          label:'userName',
        },
        GrandsonID:this.GrandsonID,//ID
        GrandsonState:this.GrandsonState, //选中
        GrandsonDis:this.GrandsonDis,//禁用
        TableData:[],
        Obj:{},
        Exhibition:{
          Number1:'100',
          Number2:'40',
          Number3:'60',
          transportType1:'空运',
          transportType2:'海运',
          transportType3:'空运',
          Warehouse1:'英国仓',
          Warehouse2:'法国仓',
          Warehouse3:'德国仓',
          department:'DepB'
        },
        ObjectiveWarehouseData:{
          dis:false,//是否禁用
          Selected:''//默认值
        },
        transportTypeData:{
          dis:false,//是否禁用
          Selected:''//默认值
        },
        transport:[
        ],
        GetDataList:[],
        isDisabled:false,
        warehouse:'',
        Addqty:'',
        getData:{
          stockId:'',//备货Id
          itemId:'',//备货子id
          qty:'',//更新后数量
          oldWhId:'',//原目的仓
          oldTransportType:'',//原运输方式
          deptId:'',//分配部门id
//          newWhId:'',//新备货仓
          newToWhId:'',//新目的仓
          newTransportType:'',//新运输方式
//          nodeId:'',//默认草稿
//          processKey:'stock_plan',//默认草稿
//          skuNo:''
        }
      }
    },
    mounted(){
      this.getWareHouse();
      this.getwhID();
    },
    methods:{
        PostStocking:function () {
          this.httpPost('stockProductPlan/toPatchStockItemInfo',this.getData).then(res=>{
            if(res.data.result===true){
              this.$emit('editDialogFsale')
            }else {
              this.$message(res.data.message)
            }
          })
        },
      getwhID:function () {
        this.httpGet('stockProductPlan/getRefTraType').then(res => {
          let GetDataList = res.data;
          setTimeout(()=>{
            this.transport=this.tool.replaceObjKey(GetDataList,'refId','refValue')
          },20)
        });
      },
      SonemptyFn:function () {
        this.$refs.deptSelects.emptyFns();
      },
      getWareHouse(){
        this.httpGet('userWareHouseInfo','','Scm').then(res => {
          let GetDataList = res.data.params.listWareInfo;
          this.GetDataList=this.tool.replaceObjKey(GetDataList,'userWare_Id','ware_Name')
        })
      },
      getList:function (val, nodeId) {
        this.tool.clearObjValue(this.getData);
          console.log(val);
         this.Obj=val;
          let Objs={
            skuNo:val.skuNo,
            requestQty:val.requestQty,
            qty:0,
            Addqty:val.requestQty
          };
          this.$set(this.TableData, [0], Objs);
          this.getData.oldWhId=val.requestWarehouse;
          this.getData.oldTransportType=val.requestTransportType;
          this.getData.stockId=val.stockId;
          this.getData.itemId=val.itemId;
//          this.getData.skuNo=val.skuNo;
//          this.getData.nodeId=nodeId;
//          this.getData.processKey='stock_plan';
      },
      qtyFn:function (val) {
        this.TableData[0].Addqty=val.requestQty-val.qty;
        this.Addqty=val.requestQty-val.qty;
          this.getData.qty=val.qty;
      },

      SonData:function (val) {
        let SonData=val.value;
        this.getData.deptId=SonData;
      },


    },

    watch:{
      'PassGrandsonData':{
        handler(val){
          this.GrandsonID=val.GrandsonID;
          this.GrandsonState=val.GrandsonState;
          this.GrandsonDis=val.GrandsonDis;
        },
        deep: true
      },
    },
  }


</script>

<style scoped>
  .red{
    color: red;
  }
  .rowStyle{
    margin: 10px 0 10px 0;
  }
  .P_style{
    margin: 20px 0 20px 0;
  }
</style>
