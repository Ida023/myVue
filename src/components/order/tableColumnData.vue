<template>
    <!--  table公共列数据--------------------------->
  <div>
    <el-table-column type="selection" width="55" align="center"></el-table-column><!--不可去除，用来支持表格列的排序-->
    <el-table-column label="订单信息"  prop="" align="center"  width="250px" sortable>
      <template scope="scope">
        <span >{{scope.row.orderNo+' '+scope.row.salesUserName}}<br/></span>
        <span style="margin-left: 10px;font-weight: bold;">{{scope.row.amount+' '+scope.row.currencyName}}<br/></span>
        <span v-if="scope.row.shopOrderId != '' && scope.row.shopOrderId != null ">{{scope.row.shopOrderId}}<br/></span>
        <span v-if="scope.row.accountNo != '' && scope.row.accountNo != null ">{{scope.row.accountNo}}<br/></span>
        <span v-if="scope.row.parentOrderId != '' && scope.row.parentOrderId != null ">{{'原订单：'+scope.row.parentOrderNo}}<br/></span>
      </template>
    </el-table-column>
    <el-table-column label="产品信息"  prop="" align="center" width="260px" sortable>
      <template scope="scope">
        <div v-for="(item,index) in scope.row.orderItemList" class="simulation" >
          <div class="childDiv paddingStyle" :id="index != 0 ? 'border_bt':''" >
            <el-row>
              <el-col :span="8"><img :src="item.imageUrl"/></el-col>
              <el-col :span="16">
                {{item.skuNo+' * '+item.salesQty}}
                <div style="float: right">
                  <el-tooltip content="商品库存"  effect="dark" placement="bottom">
                    <i  class="iconfontyyy" content="Bottom center" @click="tool.goToPage('commodityStock?Id='+scope.row.orderId)">&#xe6f6;</i>
                  </el-tooltip>
                  <el-tooltip content="历史销量"  effect="dark" placement="bottom">
                    <i  class="iconfontyyy" content="Bottom center" @click="tool.goToPage('HistoricalSales?Id='+scope.row.orderId);">&#xe61b;</i>
                  </el-tooltip>
                </div>
              </el-col>
            </el-row>
            <el-row>
              <el-col>{{item.productName}}</el-col>
            </el-row>
          </div>
        </div>
      </template>
    </el-table-column>
    <el-table-column label="收件人"  prop="" align="left"  min-width="260px" sortable>
      <template scope="scope">
        <span >{{'客户名称：'+scope.row.customerName}}<br/></span>
        <span >{{'收件人姓名：'+scope.row.recipient}}<br/></span>
        <span >{{'地址：'+scope.row.address}}<br/></span>
        <span >{{'邮编：'+scope.row.postCode}}<br/></span>
        <span >{{'国家：'+scope.row.countryName}}<br/></span>
        <span >{{'电话：'+scope.row.phone}}<br/></span>
        <span >{{'邮箱：'+scope.row.customerEmail}}<br/></span>
      </template>
    </el-table-column>
    <el-table-column label="仓库与物流"  prop="" align="center" width="220px" sortable>
      <template scope="scope">
        <span>{{scope.row.whName}}<br></span>
        <span>{{scope.row.logisticsMethodName}}<br></span>
        <span>{{scope.row.freightCost+scope.row.freightCurrencyName}}<br></span>
      </template>
    </el-table-column>
    <el-table-column label="状态"  prop="" align="center" width="180px" sortable>
      <template scope="scope">
        <i v-if="scope.row.hasCustomerMsg == 1" class="iconfontyyy" content="Bottom center">&#xe644;</i><br/>
        <span v-if="scope.row.status != '' && scope.row.status != null" >{{'订单状态：'+scope.row.status}}<br></span>
        <span v-if="scope.row.interceptStatus != ''  && scope.row.interceptStatus != null">{{'拦截状态：'+scope.row.interceptStatus}}<br></span>
        <span v-if="scope.row.redirectStatus != ''  && scope.row.redirectStatus != null">{{'重寄状态：'+scope.row.redirectStatus}}<br></span>
        <span v-if="scope.row.refundStatus != ''  && scope.row.refundStatus != null">{{'退款状态：'+scope.row.refundStatus}}<br></span>
        <span v-if="scope.row.returnStatus != ''  && scope.row.returnStatus != null">{{'退件状态：'+scope.row.returnStatus}}<br></span>
<!--        <span v-if="scope.row.status != ''">{{scope.row.status}}<br></span>
        <span v-if="scope.row.interceptStatus != ''">{{scope.row.interceptStatus}}<br></span>
        <span v-if="scope.row.redirectStatus != ''">{{scope.row.redirectStatus}}<br></span>
        <span v-if="scope.row.refundStatus != ''">{{scope.row.refundStatus}}<br></span>
        <span v-if="scope.row.returnStatus != ''">{{scope.row.returnStatus}}<br></span>-->
     <!--   <span v-html="scope.row.status=scope.row.status.replace(',','<br/>')"><br></span>-->
        <span v-if="show == true && (scope.row.newOrderId != '' || scope.row.newOrderId != null)" @click="tool.goToPage('orderDetails?transferId='+scope.row.newOrderId)">{{'新订单编号：'+scope.row.newOrderNo}}</span>
      </template>
    </el-table-column>
    <el-table-column label="时间"  prop="" align="center" width="275px" sortable>
      <template scope="scope">
        <span v-if="scope.row.orderTime != null">{{'创建时间：'+tool.dateFormatter('','',scope.row.orderTime)}}<br></span>
        <span v-if="scope.row.payTime != null">{{'付款时间：'+tool.dateFormatter('','',scope.row.payTime)}}<br></span>
        <span v-if="scope.row.syncTime != null">{{'系统同步时间：'+tool.dateFormatter('','',scope.row.syncTime)}}<br></span>
      </template>
    </el-table-column>
  </div>
</template>
<script>
  export default{
    data(){
      return {
        ceshi:'fdsfds,1fdskfjdsf',
        deptList:[],   //
        modelData:[{value:'1',label:'测试数据1'},{value:'2',label:'测试数据2'},{value:'3',label:'测试数据3'},{value:'4',label:'测试数据4'}],   //
        formData:{
            content:'',
            title:'11',
            modelType:'',
        },
        id:this.idValue,
        show:this.isShow,
      }
    },
    props:['idValue','isShow',],
    mounted () {
    },
    methods: {

    },
    watch:{
      'idValue':{
          handler(val){
            this.id = val;
          },
      },
      'isShow':{
          handler(val){
            this.show = val;
          },
      },
    }
  }
</script>
<style scoped>
</style>
