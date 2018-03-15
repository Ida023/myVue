<template>
  <div id="outermost_wrap" class="pageWidth">
    <el-row style="text-align: center;border-bottom: 1px solid #ccc">
      <h4>拣货单</h4>
    </el-row>
    <el-row class="content_wrap" id="content_wrap">
      <el-form  class="demo-ruleForm" :model="proDetailForm">
        <h3>基本信息</h3>
        <el-col>
          <el-col class="itemMagrin" :span="10">
            <el-form-item label="波次ID:" >{{proDetailForm.Batch_Id}}</el-form-item>
            <el-form-item label="物流方式:">{{proDetailForm.Cn_Name}}</el-form-item>
            <el-form-item label="包裹个数/订单个数/产品品种总数/产品数量总计:">{{proDetailForm.parcelCount}}/{{proDetailForm.orderCount}}/{{proDetailForm.skuCount}}/{{proDetailForm.productCount}}</el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item label="波次ID:">
              <img :src="getImage('shipmentBatch/getOrderCode',proDetailForm.Batch_Id)" width="230" height="140"/>
            </el-form-item>
          </el-col>
          <el-col :span="5"  class="textStyle">
            <el-form-item   label="创建仓库:" >{{proDetailForm.Wh_Name}}</el-form-item>
            <el-form-item  label="创建人:">{{proDetailForm.createUser}}</el-form-item>
            <el-form-item  label="创建时间：">{{tool.formatDate('','',proDetailForm.Add_Time)}}</el-form-item>
          </el-col>
        </el-col>
        <h3>签名信息</h3>
        <el-col class="itemMagrin">
          <el-col :span="7"><el-form-item label="拣货人" ><i >{{proDetailForm.Picking_User}}</i></el-form-item></el-col>
          <el-col :span="7"><el-form-item label="开始时间" ><i style="">{{tool.formatDate('','',proDetailForm.Picking_Start_Time)}}</i></el-form-item></el-col>
          <el-col :span="7"><el-form-item label="结束时间" ><i style="">{{tool.formatDate('','',proDetailForm.Picking_End_Time)}}</i></el-form-item></el-col>
        </el-col>
        <el-col class="fisrtIitem itemMagrin">
          <el-col :span="7"><el-form-item label="打包/发货人" ><i style="">{{proDetailForm.Shippment_User}}</i></el-form-item></el-col>
          <el-col :span="7"><el-form-item label="开始时间" ><i style="">{{tool.formatDate('','',proDetailForm.Shippment_Start_Time)}}</i></el-form-item></el-col>
          <el-col :span="7"><el-form-item label="结束时间" ><i style="">{{tool.formatDate('','',proDetailForm.Shippment_End_Time)}}</i></el-form-item></el-col>
        </el-col>
        <h3>产品信息</h3>
        <div  class="item_list">
            <el-table :data="proDetailForm.pacelList" border tooltip-effect="dark" style="width: 100%" >
              <el-table-column sortable prop="Parcel_Id" label="包裹编号"   align="center"  width="80px"></el-table-column>
    <!--          <el-table-column sortable prop="Order_No" label="订单数" align="center">
              </el-table-column>
              <el-table-column sortable prop="nation" label="产品数" align="center">
              </el-table-column>-->
              <el-table-column sortable prop="Order_Id" label="订单ID" align="center" width="180px">
                <template scope="scope">
                  <div v-for="(item,index) in scope.row.childList" class="orderDIV simulation" >
                      <div class="childDiv paddingStyle " >
                        <img :src="getImage('shipmentBatch/getOrderCode',item.Order_Id)" alt="二维码" style="width: 150px;height: 90px;padding-top: 0px">
                      </div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column sortable prop="Ean_Code" label="EAN" align="center" width="120px">
                <template scope="scope">
                  <div v-for="(item,index) in scope.row.childList" :class="scope.row.childList.length>1? 'simulation':''">
                    <div v-for="(info,index) in item.childList"  :class="item.childList.length>1? 'simulation':''">
                    <div class="childDiv paddingStyle" >
                     <img :src="getImage('shipmentBatch/getEanCode',info.Ean_Code)" alt="二维码" style="width:90px;height: 70px;padding-top: 0px">
                      </div>
                    </div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column sortable prop="Sku_No" label="SKU" align="center" width="80px">
                <template scope="scope">
                  <div v-for="(item,index) in scope.row.childList" :class="scope.row.childList.length>1? 'simulation':''">
                    <div v-for="(info,index) in item.childList"  :class="item.childList.length>1? 'simulation':''">
                      <div class="childDiv paddingStyle" >
                        {{info.Sku_No}}
                      </div>
                    </div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column sortable prop="Image_Url" label="图片"  align="center" width="100px;" >
                <template scope="scope">
                  <div v-for="(item,index) in scope.row.childList" :class="scope.row.childList.length>1? 'simulation':''" >
                    <div v-for="(info,index) in item.childList" :class="item.childList.length>1? 'simulation':''" >
                      <div class="childDiv paddingStyle" >
                        <img  v-if="info.Image_Url!=null" style="width: 70px; height: 70px" :src="info.Image_Url" >
                      </div>
                    </div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column sortable prop="Cn_Name" label="商品名称"  align="center" width="100px;" >
                <template scope="scope">
                  <div v-for="(item,index) in scope.row.childList" :class="scope.row.childList.length>1? 'simulation':''" >
                    <div v-for="(info,index) in item.childList" :class="item.childList.length>1? 'simulation':''" >
                      <div class="childDiv paddingStyle" >
                        {{info.Cn_Name}}
                      </div>
                    </div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column sortable prop="Location_No" label="货位号"  align="center" width="80px;">
                <template scope="scope">
                  <div v-for="(item,index) in scope.row.childList" :class="scope.row.childList.length>1? 'simulation':''" >
                    <div v-for="(info,index) in item.childList" :class="item.childList.length>1? 'simulation':''" >
                      <div class="childDiv paddingStyle" >
                        {{info.Location_No}}
                      </div>
                    </div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column sortable prop="Sales_Qty" label="SKU数"  align="center" width="70px;">
                <template scope="scope">
                  <div v-for="(item,index) in scope.row.childList" :class="scope.row.childList.length>1? 'simulation':''" >
                    <div v-for="(info,index) in item.childList" :class="item.childList.length>1? 'simulation':''" >
                      <div class="childDiv paddingStyle" >
                        {{info.Sales_Qty}}
                      </div>
                    </div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column sortable prop="packQty" label="拣货数"  align="center" width="70px;">
                <template scope="scope">
                  <div v-for="(item,index) in scope.row.childList" :class="scope.row.childList.length>1? 'simulation':''" >
                    <div v-for="(info,index) in item.childList" :class="item.childList.length>1? 'simulation':''" >
                      <div class="childDiv paddingStyle" >
                        {{info.packQty}}
                      </div>
                    </div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column sortable prop="notes" label="备注"  align="center" width="76px;">
                <template scope="scope">
                  <div v-for="(item,index) in scope.row.childList"  :class="scope.row.childList.length>1? 'simulation':''"  >
                    {{item.childList.length}}
                    <div v-for="(info,index) in item.childList" :class="item.childList.length>1? 'simulation':''" >
                      <div v-for="(note,index) in info.notes" >
                        <div class="childDiv paddingStyle"  >
                          <el-col>
                            {{note.noteContent}}
                          </el-col>
                        </div>
                      </div>
                    </div>
                  </div>
                </template>
              </el-table-column>
            </el-table>
        </div>
      </el-form>
    </el-row>
    <div class="text-right">
      <el-row>
        打印人： {{proDetailForm.printUser}}
      </el-row>
      <p></p>
      <el-row>
        打印时间：  {{tool.formatDate('','',proDetailForm.printTime)}}
      </el-row>
    </div>
  </div>
</template>
<script>
  export default{
    components: {
      },
    data(){
      return {
        name:'',
        poNo:'',
        proDetailForm:{
          Picking_User:'',
          Picking_Start_Time:'',
          Picking_End_Time:'',
          Shippment_User:'',
          Shippment_Start_Time:'',
          Shippment_End_Time:'',
          printUser:'',
          printTime:'',
          pacelList:[
          /*  {Parcel_Id:'123',childList:[
            	{Order_Id:'123',childList:[{Batch_Id:'123',notes:[]}]}]},
            {Parcel_Id:'123',childList:[
            	{Order_Id:'123',childList:[
            		{Batch_Id:'123',notes:[]},
                {Batch_Id:'123',notes:[]}
            		]},
              {Order_Id:'123',childList:[
              	{Batch_Id:'123',notes:[]},
                {Batch_Id:'123',notes:[]}
              	]}
            	]}*/
          ],
          /*pacelList:[
            {Parcel_Id:'123',Parcel_No:'123',orderList:[{Order_Id:'1',Order_No:'25',productList:[{Batch_Id:'123',Ean_Code:'456'},{Batch_Id:'123',Ean_Code:'456'}]},{Order_Id:'1',Order_No:'25',productList:[{Batch_Id:'123',Ean_Code:'456'},{Batch_Id:'123',Ean_Code:'456'}]}]},{Parcel_Id:'123',Parcel_No:'123',orderList:[{Order_Id:'1',Order_No:'25',productList:[{Batch_Id:'123',Ean_Code:'456'},{Batch_Id:'123',Ean_Code:'456'}]},{Order_Id:'1',Order_No:'25',productList:[{Batch_Id:'123',Ean_Code:'456'},{Batch_Id:'123',Ean_Code:'456'}]}]},
          ],*/
        },
      }
    },
    mounted () {
      this.batchId = this.tool.requestParams('batchId');
      this.getProDetailList();
    },
    computed:{
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
        this.httpGet('shipmentBatch/printPicking?batchId='+this.batchId,'','Sms').then(res => {
          this.proDetailForm=res.data;
        })
      },
      print:function(){
        document.body.innerHTML=document.getElementById('outermost_wrap').innerHTML;
        window.print();
      },
      getImage(url,val){
      	var paramsUrl=url=='shipmentBatch/getOrderCode'?'shipmentBatch/getOrderCode?orderId=':'shipmentBatch/getEanCode?eanCode=';
      	return  this.RmsUrl+paramsUrl+val+'&Authorization='+sessionStorage.getItem('userSession');
      }
    }
  }
</script>
<style scoped>
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
    width: 173px;
    border-bottom: 1px solid #000;
  }
  .fisrtIitem >div:first-child i{
    width: 152px;
  }
  .user_manager_wrap{
    padding:0 20px;
  }
  .header {
    width: 100%;
    height: 80px;
    border-bottom:1px solid #dfe6ec;
  }
  .logo{
    display: block;
    height: 80px;
    line-height: 80px;
    box-sizing: border-box;
    background:url("../../../assets/banner_title.jpg")no-repeat left;
  }
  .titleName{
    padding-left: 500px;
    font-weight:bold;
    font-size:18px;
  }
  .header-right{
    text-align: right;
    padding: 13px 20px;
    font-size: 14px;
  }
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
  .orderDIV:last-child{
    border-bottom: none;
  }
  .textStyle{
    float: right;
  }
  .textStyle .el-form-item{
    text-align: left!important;
  }
  /*.simulation1{
    height: 150px;
    border-bottom: 1px solid #ccc;
  }
  .simulation2{
    height: 80px;
    border-bottom: 1px solid #ccc;

  }
  .simulation2:last-child{
    //border-bottom: none;
  }*/
</style>
