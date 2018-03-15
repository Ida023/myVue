<template>
  <div>
    <!--  重寄申请 弹出框--------------------------->
    <el-dialog title="重寄申请" :visible.sync="resendDialog" :close-on-click-modal="false" size="small">
      <el-form :model="resendForm" ref="resendForm" labelWidth="40px" >
        <el-form-item label=" " prop="redirectItems" required :rules="[{required:true,message:'不能为空',type:'array',trigger:'change'}]"  >
          <el-row style="margin-bottom: 10px;" type="flex" justify="space-between">
            <el-col :span="6">订单产品信息:</el-col>
            <el-col  class="skuDialog" :span="16">
              <!--<el-col  v-show="skuDialog == true">
                <el-col :span="10" class="marginR"> <el-input type="text" v-model="skuData.skuNo" placeholder="请输入SKU" size="small"></el-input></el-col>
                <el-col :span="5" ><el-input type="number"min="0"  v-model.number="skuData.number"  placeholder="请输入数量" size="small"></el-input></el-col>
                <el-button size="small" @click="skuDialog = false;">取 消</el-button>
                <el-button size="small" type="primary" @click="addProduct" :loading="$store.state.loading">确 定</el-button>
              </el-col>-->
              <el-button size="small" type="primary" @click="skuDialog = true"  v-if="skuDialog == false">添加</el-button>
            </el-col>
          </el-row>
          <div class="table_padding">
            <el-table :data="resendForm.redirectItems" style="width: 100%"  border tooltip-effect="dark" >
              <el-table-column   label="操作"  align="center">
                <template scope="scope">
                  <el-tooltip content="删除" effect="dark" placement="bottom">
                    <i  class="iconfontyyy" content="Bottom center" @click="deleteData(scope.row,scope.$index,resendForm.returnItems)">&#xe6f7;</i>
                  </el-tooltip>
                  <el-tooltip content="打印"  effect="dark" placement="bottom" >
                    <i  class="iconfontyyy" content="Bottom center" @click="getProductLabel(scope.row);">&#xe638;</i>
                  </el-tooltip>
                </template>
              </el-table-column>
              <el-table-column label="图片" prop="parcelNo" align="center"  sortable  width="106px">
                <template scope="scope">
                  <img v-if="scope.row.imageUrl!=null" style="width: 70px; height: 70px;" :src="scope.row.imageUrl"/>
                </template>
              </el-table-column>
              <el-table-column label="商品名称" prop="productName" align="center" sortable></el-table-column>
              <el-table-column label="SKU" prop="skuNo" align="center"  sortable >
                <template scope="scope">
                  <el-tooltip content="商品库存"  effect="dark" placement="bottom">
                    <i  class="iconfontyyy" content="Bottom center" @click="tool.goToPage('commodityStock?Id='+scope.row.name)">&#xe6f6;</i>
                  </el-tooltip>
                  <el-tooltip content="历史销量"  effect="dark" placement="bottom">
                    <i  class="iconfontyyy" content="Bottom center" @click="tool.goToPage('HistoricalSales?Id='+scope.row.name);">&#xe61b;</i>
                  </el-tooltip>
                </template>
              </el-table-column>
              <el-table-column label="尺寸" prop="name" align="center"  sortable  >
                <template scope="scope">
                  <span>长：{{scope.row.productLength}}<br/></span>
                  <span>宽：{{scope.row.productWidth}}<br/></span>
                  <span>高：{{scope.row.productWeight}}<br/></span>
                </template>
              </el-table-column>
              <el-table-column label="数量"  prop="qty" align="center"  sortable  >
                <template scope="scope">
                  <el-input type="number" v-model.number="scope.row.qty" min="0"></el-input>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-form-item>
        <el-form-item label=" " prop="whId" required :rules="[{required:true,message:'不能为空',trigger:'change'}]">
          <span>重寄仓库</span><br/>
          <warehouse-list :select-value="resendForm.whId"  :is-disabled="false" @getData="getWarehouse"></warehouse-list>
        </el-form-item>
        <el-form-item label=" " prop="logisticsMethod" required :rules="[{required:true,message:'不能为空',trigger:'change'}]">
          <span>物流方式</span><br/>
          <logic-list :select-value="resendForm.logisticsMethod" :wh-id="resendForm.whId" :is-use="resendDialog" :is-disabled="false" @getData="getLogic"></logic-list>
        </el-form-item>
        <el-form-item label=" " prop="rmaId" required :rules="[{required:true,message:'不能为空',trigger:'change'}]">
          <span>重寄原因</span><br/>
          <el-select v-model="resendForm.rmaId" placeholder="请选择" style="width:100%">
            <el-option v-for="item in modelData" :key="item.rmaId" :label="item.rmaDesc" :value="item.rmaId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label=" " prop="returnOption" required :rules="[{required:true,message:'不能为空',trigger:'change'}]">
          <span>是否需要退件</span><br/>
          <el-radio-group v-model="resendForm.returnOption" @change="getResendData">
            <el-radio label="0">不需要</el-radio>
            <el-radio label="1">需要部分退回</el-radio>
            <el-radio label="2">需要全部退回</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label=" " prop="redirectOption" required :rules="[{required:true,message:'不能为空',trigger:'change'}]">
          <span>重寄选项</span><br/>
          <el-radio-group v-model="resendForm.redirectOption">
            <el-radio label="0">先退件</el-radio>
            <el-radio label="1">先重寄</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label=" " prop="attachIds" class="picture" :rules="[{required:true,type:'array',message:'不能为空',trigger:'change'}]">
          <span>图片</span><br/>
          <el-upload :http-request="uploadFilePic" :action="uploadPic" list-type="picture-card" drag multiple :file-list="attachList" :list-data="resendForm.attachIds"  accept=".jpg,.jpeg,.png">
            <el-button size="small" type="primary" >点击上传</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item label=" " prop="memo" required :rules="[{required:true,message:'不能为空',trigger:'change'}]">
          <span>备注</span><br/>
          <el-input type="textarea" v-model="resendForm.memo"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" >
        <el-button @click="resendDialog = false;">取消</el-button>
        <el-button type="primary" @click="submitResendData('resendForm')" :loading="$store.state.loading">确定</el-button>
      </div>
    </el-dialog>
    <!------------------重寄需退件物品选择 弹出框--------------------------->
    <pre-withdrawal :id-value="resendForm2.id" :is-open="resendForm2.isOpen" :add-btn="true" dialog-title="重寄需退件物品选择"></pre-withdrawal>
    <!------------------打印按钮 弹出框--------------------------->
    <print-label :id-value="printForm.id" :is-open="printForm.isOpen"></print-label>
    <!--添加产品sku-->
    <el-dialog title="添加SKU" :visible.sync="skuDialog" :close-on-click-modal="false" size="small" @close="reFlash" class="add_product_wrap" id="add_product_wrap">
      <add-product :default-key="[]" ref="proData"></add-product>
      <div slot="footer" class="dialog-footer">
        <el-button @click="skuDialog = false;">取消</el-button>
        <el-button type="primary" @click="addSku()" :loading="$store.state.loading">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import warehouseList from "../../components/listData/getWarehouseOrder.vue"
  import logicList from "../../components/listData/getLogicByWhId.vue"
  import printLabel from '../../components/order/toPrintPorductLabel.vue'
  import preWithdrawal from '../../components/order/pre-withdrawal.vue'
  import addProduct from '../../components/singleTableData/addProduct.vue'
  export default{
    components: {warehouseList,logicList,printLabel,preWithdrawal,addProduct},
    data(){
      return {
        attachList:[],
        deptList:[],   //
        statusOption:[],   //
        modelData:[{value:'1',label:'测试数据1'},{value:'2',label:'测试数据2'},{value:'3',label:'测试数据3'},{value:'4',label:'测试数据4'}],   //
        resendForm:{
          requestId:'',
          modelType:'',
          whId:'',
          logisticsMethod:'',
          logisticsDesc:'',
          rmaId:'',
          memo:'',
          redirectItems:[],
          redirectOption:'',
          returnOption:'',
          attachIds:[],
        },
        skuData:{
          skuNo:'',
          number:'',
        },
        printForm:{
          id:'',
          isOpen:false,
        },
        resendForm2:{  // 发起预退件 子组件传参
          id:'',
          isOpen:false,
        },
        id:this.idValue,
        refundsDialog:false,
        skuDialog:false,
        resendDialog:false,
      }
    },
    props:['idValue','isOpen',],
    mounted () {
      //this.getData();
    },
    methods: {
      getData(){
        this.httpGet('orderItems/selectByOrderId',{orderId:this.idValue},'Sms').then(res =>{
            if(res.data) {
              this.resendForm.redirectItems = res.data;
              this.$set(this.resendForm.redirectItems, 'qyt', '');
            }
         })
      },
      getResendReason(){
        this.httpGet('orderRmaCfg/selectList','','Sms').then(res =>{
            if(res.data) {
              this.modelData = res.data;
            }
         })
      },
      uploadFilePic(options){
        let data = new FormData();
        data.append(options.filename, options.file);
        this.httpPost('imageManage/saveAttach',data).then(res => {
          if(res.data.result == true){
            this.attachList.push(res.data.params.attach);
            this.resendForm.attachIds = this.attachList.map(item =>item.attachId);
          }
        })
      },
      handleRemove(file,fileList) {
        console.log(fileList);
        this.httpPost('removeVendorAttachData?attachId='+file.attachId).then(res =>{
          if(res.data.result == true){
            for(var i=0;i< this.resendForm.attachIds.length;i++){
              if( this.resendForm.attachIds[i] == file.attachId){
                this.resendForm.attachIds.splice(i,1);
              }
            }
            for(var i=0;i< this.attachList.length;i++){
              if( this.attachList[i].attachId == file.attachId){
                this.attachList.splice(i,1);
              }
            }
          }else{
            this.$message(res.data.message);
          }
        })
      },
      submitResendData:function(formName){
        this.$refs[formName].validate((valid) =>{
          if(valid){
            this.resendForm.orderId = this.idValue;
            var flag = this.resendForm.redirectItems.every(function(item){
              return item.qty>=0 && item.qty != '';
            })
            if(flag == true){
              this.httpPost('orderRedirect/save',this.resendForm,'Sms').then(res =>{
                this.$message(res.data.message);
                if(res.data.result == true){
                  this.$emit('getData');
                  this.resendDialog = false;
                }
              })
            }else{
              this.$message('产品数量不能为空，且不能小于零！')
            }
          } else {
            console.log('error submit!!');
            return false;
          }
        })
      },
      reFlash:function(){
        this.$refs.proData.resetData();
        this.$refs.proData.clearSels();
      },
      addSku:function(){
        var vm = this,data = [];
        var selectData = JSON.parse(JSON.stringify(this.$refs.proData.returnData()));
        var idList = vm.resendForm.returnItems.map(item =>item.productId);   // 当前现有产品id
        var newIdList = selectData.map(item =>item.productId);   // 所要添加的产品id
        var flag = selectData.every(function(item){
          return idList.indexOf(item.productId) == -1;
        })
        if(flag){
          newIdList = newIdList.join(',');
          this.httpGet('productInfo/selectBySkuNo',{productIds:newIdList},'Scm').then(res =>{
            if(res.data){
              res.data.forEach(function(item){
                vm.resendForm.returnItems.push({
                  productId: item.productId,
                  imageUrl: item.imageUrl,
                  productName: item.productName,
                  skuNo: item.skuNo,
                  productLength: item.productLength,
                  productWidth: item.productWidth,
                  productWeight: item.productWeight,
                  itemId: '',
                  qty: '',
                })
              })
            }
            this.skuDialog = false;
            this.tool.clearObjValue(this.skuData);
          })
        }else{
          this.$message('不能选择已经添加的商品！');
        }
      },
      getProductLabel:function(row){
        this.printForm.id = row.productId;
        this.printForm.isOpen = !this.printForm.isOpen;
      },
      getWarehouse:function(val){
        this.resendForm.whId = val.value;
      },
      getLogic:function(val){
        this.resendForm.logisticsMethod = val.value;
      },
      getResendData:function(val){
        if(val ==2 || val == 1){
          this.resendForm2.isOpen = !this.resendForm2.isOpen;
          this.resendForm2.id = this.idValue;
        }
      },
      deleteData:function(row,index,data){
        data.splice(index,1)
      },
      resetForm:function(formName) {
        this.$refs[formName].resetFields();
      },
    },
    watch:{
      'idValue':{
          handler(val){
            this.id = val;
          },
          deep:true
      },
      'isOpen':{
          handler(val){
            this.resendDialog = true;
            this.getResendReason();
            this.getData();
          },
      },
    }
  }
</script>
<style scoped>
  .skuDialog{
  float: right;
  text-align: right;
  line-height: 38px;
}
.marginR{
  margin-right: 2px;
}

</style>
