<template>
  <div id="outermost_wrap" >
    <el-row type="flex" class="row-bg textStyle" justify="space-between" >
      <span></span>
      <h4>打印邮票</h4>
      <span class="Astyel" @click="tool.goToPage('deliveryTimes')">返回</span>
    </el-row>
    <el-row  class="main_content content_wrap"  >
      <el-col  class="left-content">
        <div style="text-align: center">
          <p :class="[goodsStyle == '1' ? 'Astyel':'Cstyel']" @click="goodsTable='1';getSituation('1');">DHL情况</p>
          <p  :class="[goodsStyle == '2' ? 'Astyel':'Cstyel']" @click="goodsTable='2';getSituation('2');">DPD情况</p>
          <p  :class="[goodsStyle == '3' ? 'Astyel':'Cstyel']" @click="goodsTable='3';getSituation('3');">Whistl情况</p>
        </div>
        </el-col>
      <el-col class="right-content">
        <el-col >
          <el-row  id="filer" class="marginBottom">
            <el-col class="marginBottom" style="padding: 10px;border: 1px solid #dfe6ec;">
              <span  class="span_label">状 态</span>
              <el-radio-group v-model="pagefilters.whId" size="small"  @change="getSituationList();" >
                <el-radio-button v-for="item in whs" :key="item.whId" :label="item.whId" :value="item.whId" >{{item.whName}}</el-radio-button>
              </el-radio-group>
            </el-col>
          </el-row>
          <el-row class="marginBottom">
            <el-button type="primary">生成跟踪单号</el-button>
            <el-button type="primary">打印邮票</el-button>
            <el-button type="primary">提交计费</el-button>
            <el-button type="primary">标记已计费</el-button>
            <el-button type="primary">取消邮票</el-button>
            <el-button type="primary">打印回邮邮票</el-button>
          </el-row>
          <el-table  :data="listData"  border  tooltip-effect="dark" >
            <el-table-column type="selection" width="55" align="center"></el-table-column>
            <el-table-column label="操作" width="" prop="imageUrl"  sortable align="center">
              <template scope="scope">
                <el-tooltip class="item" effect="dark" content="打印邮票" placement="top-start"     >
                  <i class="iconfontyyy" >&#xe638;</i>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="提交计费" placement="top-start"     >
                  <i class="iconfontyyy" >&#xe63e;</i>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="标记已计费" placement="top-start"     >
                  <i class="iconfontyyy" >&#xe61f;</i>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="取消邮票" placement="top-start"     >
                  <i class="iconfontyyy" >&#xe634;</i>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="跟踪物流" placement="top-start"     >
                  <i class="iconfontyyy" >&#xe64b;</i>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column label="提示" width="" prop="esbItemTitle"  sortable align="center"></el-table-column>
            <el-table-column label="订单状态" width="" prop="esbItemTitle"  sortable align="center"></el-table-column>
            <el-table-column label="合并订单" width="" prop="esbItemTitle"  sortable align="center"></el-table-column>
            <el-table-column label="订单ID" width="" prop="esbItemTitle"  sortable align="center"></el-table-column>
            <el-table-column label="跟踪单号" width="" prop="esbItemTitle"  sortable align="center"></el-table-column>
            <el-table-column label="收件人" width="" prop="esbItemTitle"  sortable align="center"></el-table-column>
            <el-table-column label="地址" width="" prop="esbItemTitle"  sortable align="center"></el-table-column>
            <el-table-column label="城市" width="" prop="esbItemTitle"  sortable align="center"></el-table-column>
            <el-table-column label="州" width="" prop="esbItemTitle"  sortable align="center"></el-table-column>
            <el-table-column label="邮编" width="" prop="esbItemTitle"  sortable align="center"></el-table-column>
            <el-table-column label="国家" width="" prop="esbItemTitle"  sortable align="center"></el-table-column>
          </el-table>
        </el-col>
      <!--  <el-col v-if="goodsTable==='3'">
          <el-row  id="filer" class="marginBottom">
            <el-col class="marginBottom" style="padding: 10px;border: 1px solid #dfe6ec;">
              <span  class="span_label">状 态</span>
              <el-radio-group v-model="pagefilters.whId" size="small"  @change="pagefilters.keyPath='';getList();getCategoryList();" >
                <el-radio-button v-for="item in whs" :key="item.whId" :label="item.whId" :value="item.whId" >{{item.whName}}</el-radio-button>
              </el-radio-group>
            </el-col>
          </el-row>
          <el-table  :data="listData2"  border  tooltip-effect="dark">
          </el-table>
        </el-col>-->
      </el-col>
    </el-row>
  </div>
</template>
<script>
  import ElButton from "../../../../node_modules/element-ui/packages/button/src/button";
  export default{
    components: {
      ElButton
    },
    data(){
      return {
        whs:[
          {whId:'123',whName:'123'}
        ],
        goodsTable:'1',
        goodsStyle:'1',
        proDetailForm:{
        },
        listData:[{id:123}],

        pagefilters:{
          whId:'123'
        },
      }
    },
    mounted () {
      this.batchId = this.tool.requestParams('batchId');
      this.getSituationList();
    },
    methods: {
      getSituation(val){
        val == '1'? this.goodsStyle='1' : val == '2' ? this.goodsStyle='2':this.goodsStyle='3';
      },
      getSituationList:function(){
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
.textStyle{
  text-align: center;border-bottom: 1px solid #ccc;
  margin:0;
}
.textStyle span:last-child{
height: 64px;line-height: 64px;padding-right: 5px;
 }
.main_content{
  display: flex;
  height: 100%;
  margin:10px 0 ;
}
.left-content{
  border: solid 1px #eef1f6;
  max-width: 120px;
  flex: 0 0 300px;
  height: 100%;
//overflow: auto;
}
.right-content{
  margin-left:10px;
  flex:1;
  display: flex;
  flex-direction:column;
  overflow: auto;
}
</style>
