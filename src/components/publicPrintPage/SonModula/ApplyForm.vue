<template>
    <div>
      <el-form :model="RedirectForm"  ref="RedirectForm">
        <el-form-item label="" prop="" :rules="[{required:true,message:'不能为空',type:'array',trigger:'change'}]" >
          <el-row style="margin-bottom: 10px;" type="flex" justify="space-between">
          <el-col :span="6">订单产品信息:</el-col>
          <el-col  class="addSKU" :span="16">
            <el-col  v-show="addSku == true">
              <el-col :span="10" class="marginR"> <el-input type="text" placeholder="请输入SKU" v-model="skuData.skuNo" size="small"></el-input></el-col>
              <el-col :span="5"><el-input type="text" placeholder="请输入数量"   v-model="skuData.qty" size="small"></el-input></el-col>
              <el-button size="small" @click="addSku = false;">取 消</el-button>
              <el-button size="small" type="primary" @click="addProduct" :loading="$store.state.loading">确 定</el-button>
            </el-col>
            <el-button size="small" type="primary" @click="addSku = true"  v-if="addSku == false && RedirectLabelhouse == '重寄仓库'" >添加</el-button>
          </el-col>
        </el-row>
          <el-table :data="RedirectForm.redirectItems"  border tooltip-effect="dark" class="table_padding" >
            <el-table-column   label="操作"  align="center">
              <template scope="scope">
                <el-tooltip content="删除" effect="dark" placement="bottom">
                  <i  class="iconfontyyy" content="Bottom center" @click="deleteData(scope.$index)">&#xe6f7;</i>
                </el-tooltip>
                <el-tooltip content="打印"  effect="dark" placement="bottom" >
                  <i  class="iconfontyyy" content="Bottom center"  @click="getProductLabel(scope.row);">&#xe638;</i>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column label="图片"    prop="imageUrl" align="center"  sortable  >
              <template scope="scope">
                <img v-if="scope.row.imageUrl!=null" style="width: 70px; height: 70px;" :src="RmsUrl+scope.row.imageUrl"/>
              </template>
            </el-table-column>
            <el-table-column label="商品名称"  prop="productName" align="center"  sortable  ></el-table-column>
            <el-table-column label="SKU"    prop="skuNo" align="center"  sortable  >
              <template scope="scope">
                <span>{{scope.row.skuNo}}</span>
                <el-tooltip content="商品库存" effect="dark" placement="bottom">
                  <i  class="iconfontyyy" content="Bottom center" @click="tool.goToPage('commodityStock?Id='+scope.row.productId)">&#xe6f6;</i>
                </el-tooltip>
                <el-tooltip content="历史销量" effect="dark" placement="bottom">
                  <i  class="iconfontyyy" content="Bottom center" @click="tool.goToPage('HistoricalSales?Id='+scope.row.productId);">&#xe61b;</i>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column label="尺寸" prop="" align="center" sortable>
              <template scope="scope">
                {{scope.row.productLength}}*{{scope.row.productWidth}}*{{scope.row.productWeight}}
              </template>
            </el-table-column>
            <el-table-column label="数量" prop="salesQty" align="center" sortable>
              <template scope="scope">
                <el-input type="number" v-model="scope.row.salesQty"></el-input>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item :label="RedirectLabelhouse" labelWidth="120px" prop="whId" required :rules=" { required: true, message: '请选择仓库', trigger: 'change' }">
          <el-select v-model="RedirectForm.whId" placeholder="请选择仓库" @change="getlogisticsMethod">
            <el-option v-for="item in houseoptions" :key="item.whId" :label="item.whName" :value="item.whId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="logisticsMethod" :label="RedirectLabelhouse == '重寄仓库' ? '物流方式' : '退回配送方式'" labelWidth="120px" required :rules=" { required: true, message: '请选择方式', trigger: 'change' }">
          <el-select v-model="RedirectForm.logisticsMethod" placeholder="请选择物流方式">
            <el-option v-for="item in logisticsoptions" :key="item.methodId" :label="item.cnName" :value="item.methodId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="重寄原因" labelWidth="120px" prop="rmaId" required :rules=" { required: true, message: '请选择重寄原因', trigger: 'change' }">
          <el-select v-model="RedirectForm.rmaId" placeholder="请选择" labelWidth="120px" >
            <el-option v-for="item in rmaIdoptions" :key="item.rmaId" :label="item.rmaDesc" :value="item.rmaId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否需退件" prop="returnOption" v-if="RedirectLabelhouse == '重寄仓库'" labelWidth="120px"  required :rules=" { required: true, message: '请选择', trigger: 'change' }">
          <el-radio-group v-model="RedirectForm.returnOption" @change="changeRedirectradio">
            <el-radio label="0">不需要</el-radio>
            <el-radio label="1">需要部分退回</el-radio>
            <el-radio label="2">需要完全退回</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="添加图片" labelWidth="120px" prop="attachIds" >
          <el-upload :http-request="uploadFilePic" :action="uploadPic" list-type="picture-card" drag multiple :file-list="attachList"   accept=".jpg,.jpeg,.png">
            <el-button size="small" type="primary" >点击上传</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item label="备注" labelWidth="120px" prop="memo" >
          <el-input type="textarea" v-model="RedirectForm.memo"></el-input>
        </el-form-item>
      </el-form>
      <!------------------发起预退件 弹出框--------------------------->
      <print-label :id-value="printForm.id" :is-open="printForm.isOpen" :add-btn="true" dialog-title="发起预退件"></print-label>
    </div>
</template>
<script>
  import printLabel from 'components/order/toPrintPorductLabel.vue'
  export default{
    components: {printLabel},

    data(){
			return {
        options:[
          {label:'1',value:'1'}
        ],
        attachList:[],
        skuData:{
          skuNo:'',
          qty:'',
        },
        uploadPic:this.RmsUrl+'productDevInfo/postProductImage='+this.sessuserid,   //  上传图片地址
        RedirectLabelhouse:this.redirectLabel,
        addSku:false,
        houseoptions:[],
        logisticsoptions:[],
        rmaIdoptions:[],
        printForm:{
          id:'',
          isOpen:false,
        },
        //重寄退件物品
        RedirectForm:{
          requestId:'',
          orderId:'',
          whId:'',
          logisticsMethod:'',
          logisticsDesc:'',
          rmaId:'',
          redirectOption:'0',
          returnOption:'',
          memo:'',
          attachIds:[],
          redirectItems:[],
        },
			}
		},
    props:['redirectLabel','orderId'],
		mounted: function () {

		},
    watch:{
			'redirectLabel':{
        handler(val){
        this.RedirectLabelhouse = val;
        },
        deep: true
      },
      'RedirectForm':{
        handler(val){
        	this.$emit('childForm',{
        		  form:val,
            }
          )
        },
        deep: true
      },
    },
		methods: {
			/*重寄原因*/
			getrmaIdoptions(){
				this.httpGet('/orderRmaCfg/selectList','','').then(res=>{
					if(res.data!=[]){
            this.rmaIdoptions=res.data;
          }
        })
      },
      /*物流方式*/
      getlogisticsMethod(){
      	this.httpGet('logisticsMethod/selectListByWhId?whId='+this.RedirectForm.whId,'','Sms').then(res=>{
           if(res.data!=[]){
             this.logisticsoptions=res.data;
           }
        })
      },
      /*仓库列表*/
			gethouseoptions(){
				this.httpGet('/warehouse/selectAllList','','Lwms').then(res=>{
					if(res.data.params.listData !=[]){
            this.houseoptions=res.data.params.listData;
          }
        })
      },
      /*sku列表*/
			getSkuList(){
				this.httpGet('/orderItems/selectByOrderId?orderId='+this.orderId,'','Sms').then(res=>{
					if(res.data!=[] ){
            this.RedirectForm.redirectItems=res.data;
          }
        })
      },
      getProductLabel:function(row){
        this.printForm.id = row.productId;
        this.printForm.isOpen = !this.printForm.isOpen;
      },
      changeRedirectradio(val){
        if(val !== '0'){
          this.RedirectLabelhouse='退回仓库';
          this.$emit('childisopen',{isopen:true,houseName:this.RedirectLabelhouse} );
          this.getFormData();
          //this.getSkuList();
        }else{
          this.RedirectLabelhouse='重寄仓库';
          this.$emit('childisopen',{isopen:false,houseName:this.RedirectLabelhouse} );

        }
      },
      submitForm(){
      	var url='';
        this.RedirectForm.orderId=this.orderId;
        url=this.RedirectLabelhouse == '重寄仓库'?'orderRedirect/save':'orderReturn/save';

        var flag=this.RedirectForm.redirectItems.every(function(item){
        	return item.salesQty!='';
        })
        if(flag==false){
        	this.$message('请填写退件商品数量！')
        }else{
          this.$refs['RedirectForm'].validate((valid) => {
            if (valid) {
              this.httpPost(url, this.RedirectForm,'Sms').then(res=>{
                this.$message(res.data.message)

              })
            }
          })
        }


      /*	if(this.RedirectLabelhouse == '重寄仓库'){
          this.$refs['RedirectForm'].validate((valid) => {
              if (valid) {
                this.httpPost('/orderReturn/save', this.RedirectForm,'sms').then(res=>{

                })
              }
          })
        }else if(this.RedirectLabelhouse == '退回仓库'){


        }*/
      },
      getFormData(){
       this.getrmaIdoptions();
       this.gethouseoptions();
        this.getSkuList();
      },
      add(){},
			resetForm(){
          this.$refs['RedirectForm'].resetFields();
			},
      addProduct:function(){
        if(this.skuData.skuNo == '' || this.skuData.qty =='' || this.skuData.qty < 0){
          this.$message('sku和数量为必填项，且数量不能小于零！')
        }else{
          this.httpGet('returnManage/querySku?skuNo='+this.skuData.skuNo,'','Lwms').then(res=>{
            if(res.data!=null && res.data!=''){
              this.RedirectForm.redirectItems.push({skuNo:res.data.skuNo,qty:this.skuData.qty,imageUrl:res.data.imageUrl,productName:res.data.enName,productId:res.data.productId,productLength:res.data.productLength,productWidth:res.data.productWidth,productWeight:res.data.productWeight})
              this.addSku = false;
              this.skuData.qty='';
              this.skuData.skuNo='';
            }else{
              this.$message('SKU不存在，添加失败！')
            }
          })
          this.skuDialog = false;

        }
      },
      deleteData(index){
        this.RedirectForm.redirectItems.splice(index,1)
      },
      //添加图片
      uploadFilePic(options){
        console.log(options);
        let data = new FormData();
        data.append(options.filename, options.file);
        this.httpPost('imageManage/saveAttach',data).then(res => {
          console.log(res);
          if(res.data.result == true){
            this.attachList.push(res.data.params.attach);
            this.RedirectForm.attachIds = this.attachList.map(item =>item.attachId);
          }
        })
      },
      handleRemove(file,fileList) {
        console.log(fileList);
        this.httpPost('removeVendorAttachData?attachId='+file.attachId).then(res =>{
          if(res.data.result == true){
            for(var i=0;i< this.RedirectForm.attachIds.length;i++){
              if( this.RedirectForm.attachIds[i] == file.attachId){
                this.RedirectForm.attachIds.splice(i,1);
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
		}
	}

</script>

<style scoped>
.addSKU{
  float: right;
  text-align: right;
  line-height: 38px;
}
  .marginR{
    margin-right: 2px;
  }

</style>
