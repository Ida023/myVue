<template>
  <div id="outermost_wrap" class="pageWidth">
    <el-row class="header">
      <el-col class="header-left logo" :span="8"></el-col>
      <el-col :span="8" style="text-align: center;"><span class="titleName">采购合同</span></el-col>
      <el-col :span="8" class="text-titleName" >
        <span>合同编号：{{deliveryForm.poNo}}</span><br/>
        <span>采购员：{{deliveryForm.userName}}</span>
      </el-col>
    </el-row>
    <el-row class="content_wrap" id="content_wrap">
      <el-form class="addrForm" :model="deliveryForm">
        <el-col :span="12">
          <el-form-item label="甲方：">深圳市睿搏科技集团有限公司</el-form-item>
          <el-form-item label="地址：">深圳市龙岗区坂田街道雅宝路1号星河world A座16层</el-form-item>
          <el-form-item label="电话：">0755-83170865</el-form-item>
          <el-form-item label="传真：">0755-83170865</el-form-item>
          <el-form-item label="联系人：">李均立</el-form-item>
          <el-form-item label="下单时间：" >{{tool.formatDate('','',deliveryForm.addTime)}}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="乙方：" prop="">{{deliveryForm.vendorName}}</el-form-item>
          <el-form-item label="地址：" prop="">{{deliveryForm.province}}  {{deliveryForm.city}}  {{ deliveryForm.street}}</el-form-item>
          <el-form-item label="电话：" prop="">{{deliveryForm.telNo}}</el-form-item>
          <el-form-item label="传真：" prop="">{{deliveryForm.faxNo}}</el-form-item>
          <el-form-item label="联系人：" prop="">{{deliveryForm.vendorUser}}</el-form-item>
          <el-form-item label=""></el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item> 依据《中华人民共和国合同法》的有关规定，经甲乙双方平等友好协商，达成如下协议，以供双方共同遵守。</el-form-item>
        </el-col>
        <el-col :span="24"> <h3>产品</h3></el-col>
      </el-form>
        <el-table class="item_list" :data="tableData" border tooltip-effect="dark" style="font-size: 14px;">
          <el-table-column sortable  type="index" label="序号" align="center" width="50"></el-table-column>
          <el-table-column sortable prop="cnName" label="名称" align="center" ></el-table-column>
          <el-table-column sortable prop="skuNo" label="SKU" align="center" width="95"></el-table-column>
          <el-table-column sortable prop="docs" label="图片" align="center" width="100" >
            <template scope="scope">
              <img v-if="scope.row.imageUrl!=null" :src="scope.row.imageUrl" :data-src="scope.row.imageUrl">
            </template>
          </el-table-column>
          <el-table-column sortable prop="poQty" label="数量" align="center" width="70">
          </el-table-column>
          <el-table-column sortable prop="itemUnit" label="单位" align="center" width="70"></el-table-column>
          <el-table-column sortable prop="totalAmount" label="小计" align="center" width="80"></el-table-column>
          <el-table-column label="备注详情" align="center" prop="remarksDetails"  sortable width="300" >
            <template scope="scope">
              <el-row v-for="item in scope.row.remarksDetails"  :key="item.itemNo">
                <span>{{item.itemNo}}</span>/<span>{{item.poQty}}</span>/<span>{{item.whName}}</span>/<span>{{item.transportType}}<br></span>
              </el-row>
            </template>
          </el-table-column>

        </el-table>
      <el-form :model="deliveryForm" class="demo-ruleForm" >
        <h3>货款</h3>
        <el-col>
          <el-col class="itemMagrin">
            <el-form-item label="币种:"  prop="" >{{deliveryForm.currencyId}}</el-form-item>
            <el-form-item label="货款小计:"  prop="">{{deliveryForm.totalAmount}}</el-form-item>
            <el-form-item label="税:"  prop="" >{{deliveryForm.taxRate * deliveryForm.totalAmount }}</el-form-item>
            <el-form-item label="运费:"  prop="" >{{deliveryForm.freightCost}}</el-form-item>
            <el-form-item label="人工费:" prop="" >{{deliveryForm.artificialCost}}</el-form-item>
            <el-form-item label="抵扣费:" prop="" >{{deliveryForm.deductionCost}}</el-form-item>
            <el-form-item label="总计:" prop="">{{allAmountnum}}</el-form-item>
            <el-form-item label="交货方式:" prop="">{{deliveryForm.refValue}}</el-form-item>
            <el-form-item label="交货地点:" prop="">{{deliveryForm.deliveryAddress}}</el-form-item>
          </el-col>
        </el-col>
      </el-form>
    </el-row>
    <div style="padding-left: 20px;">
      <el-form :model="deliveryForm">
        <h3>签字</h3>
        <el-col :span="12">
          <el-form-item label="甲方：">深圳市睿搏科技集团有限公司</el-form-item>
          <el-form-item label="签字：">李均立</el-form-item>
          <el-form-item label="日期：">{{tool.formatDate('','',deliveryForm.addTime)}}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="乙方：" prop="">{{deliveryForm.vendorName}}</el-form-item>
          <el-form-item label="签字："></el-form-item>
          <el-form-item label="日期：">{{tool.formatDate('','',deliveryForm.addTime)}}</el-form-item>
        </el-col>
      </el-form>
    </div>
  </div>
</template>
<script>
  import ElForm from "../../../../node_modules/element-ui/packages/form/src/form";
  import ElFormItem from "../../../../node_modules/element-ui/packages/form/src/form-item";

  export default{
    components: {
      ElFormItem,
      ElForm
    },
    data(){
      return {
        poId:'',
        tableData:[],
        deliveryForm:{
          street:'',
          city:'',
          userName:'',
          currencyId:'',
          totalAmount:'',
          taxRate:'',
          freightCost:'',
          refValue:'',
          deliveryAddress:'',
          telNo:'',
          faxNo:'',
          vendorUser:'',
          deductionCost:'',
        },
        proDetailData:[],
        name:'',
        poNo:'',
      }
    },
    mounted () {
      this.poId = this.tool.requestParams('poId');
      this.getProDetailList();
    },
    computed:{
      allAmountnum(){
        return  parseFloat(Number(this.deliveryForm.totalAmount * (Number(this.deliveryForm.taxRate) + Number(1))) + Number(this.deliveryForm.artificialCost) + Number(this.deliveryForm.freightCost)   - Number(this.deliveryForm.deductionCost)).toFixed(4) ;
      },
      getDate(){
        var now=new Date();
        var year=now.getFullYear();
        var month=now.getMonth()+1;
        var date=now.getDate();
        var hour = now.getHours();       //获取当前小时数(0-23)
        var minutes = now.getMinutes();     //获取当前分钟数(0-59)
        var seconds = now.getSeconds();     //获取当前秒数(0-59)
        var millise = now.getMilliseconds();    //获取当前毫秒数(0-999)
        //console.log(year+month+date+hour+minutes+seconds+millise)
        month =  month >= 10 ? month : '0'+month;
        date =  date >= 10 ? date : '0'+date;
        hour =  hour >= 10 ? hour : '0'+hour;
        minutes =  minutes >= 10 ? minutes : '0'+minutes;
        seconds =  seconds >= 10 ? seconds : '0'+seconds;
        return year+ '.'+month+'.'+date+'  '+hour+':'+minutes+':'+seconds;
      },
    },
    methods: {
      getProDetailList:function(){

        this.httpPost('/productPurchase/query?poId='+this.poId).then(res => {
              //alert(999)
               this.tableData=res.data.stockObject;
               this.deliveryForm=res.data.delivery;
               console.log('888 % 0==',this.deliveryForm)

        })
        /*  this.httpPost('url',{taskId:this.tool.requestParams('taskId')}).then(res => {
         if(res.data.result == true){

         }else{

         }
         })*/

      },
      print:function(){
        alert(434);
        document.body.innerHTML=document.getElementById('outermost_wrap').innerHTML;
        window.print();
      }
    }
  }
</script>
<style scoped>
  .addrForm .el-form-item{
    margin:0!important;
  }
  .header {
    width: 100%;
    line-height: 80px;
    border-bottom:1px solid #dfe6ec;
  }
  .logo{
    display: block;
    height: 80px;
    box-sizing: border-box;
    background:url("../../../assets/banner_title.jpg")no-repeat left center;
    background-size:100%;

  }
  .text-titleName{
    height: 80px;line-height: 40px;
    text-align: right;
    padding-right: 20px;
  }
  .titleName{
    //padding-left: 500px;
    font-weight:bold;
    font-size:18px;
  }
  .text-right{
    text-align: right;
    padding-right:20px
  }
  .itemMagrin {
    padding-left: 77px;
  }
  .itemMagrin i{
    display:inline-block;
    font-style:normal;
    width: 100px;
    border-bottom: 1px solid #000;
  }

</style>
