<template>
  <div id="">
    <el-row style="line-height: 40px">
      <span>订单编号 {{TableData.cgNo}}</span>
      <span>关联SKU： {{TableData.skuNo}} {{TableData.totalCount}}</span>
      <span>待装箱总数：  {{ TableData.availableTotalQty}}</span>
    </el-row>
    <!--<el-row style="border: 1px solid #dfe6ec">-->
      <!--<el-row>-->
        <!--<el-col :span="6" style="border-bottom: 1px solid #dfe6ec; border-right: 1px solid #dfe6ec;text-align: center">-->
          <!--<span style="line-height: 40px; ">采购订单该SKU分配</span>-->
        <!--</el-col>-->
        <!--&lt;!&ndash;<el-col :span="4" style="border-bottom: 1px solid #dfe6ec; border-right: 1px solid #dfe6ec;text-align: center">&ndash;&gt;-->
          <!--&lt;!&ndash;<span style="line-height: 40px; ">待装箱总数</span>&ndash;&gt;-->
        <!--&lt;!&ndash;</el-col>&ndash;&gt;-->
        <!--<el-col :span="6" style="border-bottom: 1px solid #dfe6ec; border-right: 1px solid #dfe6ec;text-align: center">-->
          <!--<span style="line-height: 40px; ">待装箱数据默认分配</span>-->
        <!--</el-col>-->
        <!--<el-col :span="2" style="border-bottom: 1px solid #dfe6ec; border-right: 1px solid #dfe6ec;text-align: center">-->
          <!--<span style="line-height: 40px; ">操作</span>-->
        <!--</el-col>-->
        <!--<el-col :span="6" style="border-bottom: 1px solid #dfe6ec;text-align: center">-->
          <!--<span style="line-height: 40px; ">修改后分配</span>-->
        <!--</el-col>-->
      <!--</el-row>-->
      <!--<el-row>-->
        <!--<el-col :span="6" style="border-right: 1px solid #dfe6ec;text-align: center">-->
          <!--<span style="line-height: 40px; " v-for="(item,index) in GrandsonState">-->
            <!--{{ item.stockItemNo}}   {{ item.requestQty}}-->
          <!--</span>-->
        <!--</el-col>-->
        <!--&lt;!&ndash;<el-col :span="4" style="border-right: 1px solid #dfe6ec;text-align: center">&ndash;&gt;-->
           <!--&lt;!&ndash;<span style="line-height: 40px; ">&ndash;&gt;-->
            <!--&lt;!&ndash;{{ TableData.availableTotalQty}}&ndash;&gt;-->
          <!--&lt;!&ndash;</span>&ndash;&gt;-->
        <!--&lt;!&ndash;</el-col>&ndash;&gt;-->
        <!--<el-col :span="6" style="border-right: 1px solid #dfe6ec;text-align: center">-->
          <!--<span style="line-height: 40px; ">待装箱数据默认分配</span>-->
        <!--</el-col>-->
        <!--<el-col :span="2" style="border-right: 1px solid #dfe6ec;text-align: center">-->
         <!--<span style="line-height: 40px; " v-for="(item,index) in GrandsonState" v-show="item.availableQty!=='0'">-->
            <!--{{ item.stockItemNo}}   {{ item.availableQty}}-->
          <!--</span>-->
        <!--</el-col>-->
        <!--<el-col :span="6" style="border-bottom: 1px solid #dfe6ec;text-align: center">-->
          <!--<el-row style="line-height: 40px; " v-for="(item,index) in getObjData.info" v-show="item.availableQty!=='0'">-->
            <!--<el-col :span="15" style="margin-right: 20px">{{ item.stockItemNo}} </el-col>-->
            <!--<el-col :span="4"> <el-input v-model="item.qty"></el-input> </el-col>-->
          <!--</el-row>-->
        <!--</el-col>-->
      <!--</el-row>-->
    <!--</el-row>-->
    <div id="item_listBorder">
      <el-table :data="getObjData.info" border tooltip-effect="dark" style="width: 100%" :stripe="false"  >
        <el-table-column sortable label="备货子计划" align="center" prop="stockItemNo"></el-table-column>
        <el-table-column sortable label="采购数" align="center" prop="poQty"></el-table-column>
        <el-table-column sortable label="默认分配数" align="center" prop="availableQty"></el-table-column>
        <el-table-column sortable label="修改后分配数" align="center">
          <template scope="scope">
            <el-input v-model="scope.row.qty" :disabled="scope.row.默认分配数==='0'"></el-input>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
  import ElRow from "element-ui/packages/row/src/row";
  import ElCol from "element-ui/packages/col/src/col";
  import ElInput from "../../../../../../node_modules/element-ui/packages/input/src/input";
  export default{
    /*
     GrandsonData: 父组件条件，用于 后续 各种状态，各种条件下，操作按钮控制。
     */
    components: {
      ElInput,
      ElCol,
      ElRow},
    props:['PassGrandsonData'],
    name:'Journal',
    data() {
      return {
        GrandsonID:this.GrandsonID,//ID
        GrandsonState:this.GrandsonState, //选中
        GrandsonDis:this.GrandsonDis,//禁用
        TableData:{},
        TableList:[],
        getData:{
          itemId:'',
          skuNo:'',
          productId:''
        },
        getObjData:{},
      }
    },
    mounted(){

    },
    methods:{
      getList:function (row) {
        this.getData.itemId=row.itemId;
        this.getData.skuNo=row.skuNo;
        this.getData.productId=row.productId;
//        this.getData.itemId='20171122202825461768';
//        this.getData.skuNo='AZ004P-01';
        this.httpPost('stockProductPlan/priortyAllocation',this.qs.stringify(this.getData)).then(res=>{
          this.TableData=res.data;
          this.TableList=res.data.info;
          this.getObjData=res.data;
        })
      },
      PostData:function () {
        this.httpPost('stockProductPlan/toPpriortyAllocation',this.getObjData).then(res=>{
          this.$message(res.data.message)
          if(res.data.result===true){
            this.$emit('CostDetailsFalse')
          }
        })
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

</style>
