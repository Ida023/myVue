<template>
  <div>
    <el-dialog :title="dialogFlag.dialogTitle" :visible.sync="dialogFlag.infoDetail" :close-on-click-modal="false" @close="closeDialog">
      <section class="infoData">
        <div class="info_tit">
          <span class="title">基本信息</span>
        </div>
        <el-form :model="poSamplesChargesModel" ref="poSamplesChargesModel" class="formData" >
          <el-form-item  label="收货仓库：" prop="chargesCount" :label-width="financeFormLabelWidth" required>
            <selector-item :select-value="poSamplesChargesModel.currencyId" :option-data="options" :is-disabled="dialogFlag.inputDisabled" place-value="请选择仓库" @on-child-change-Val="onChildChangeValCurrency"></selector-item>
          </el-form-item>
          <el-form-item label="运费/报关/其他费用：" prop="allQty" :label-width="financeFormLabelWidth">
            <el-col :span="5" style="padding-right:5px;"><el-input type="number" v-model="poSamplesChargesModel.chargesCount" :disabled="dialogFlag.inputDisabled"></el-input></el-col>
            <el-col :span="5" style="padding: 0 5px;"><el-input type="number" v-model="poSamplesChargesModel.chargesCount" :disabled="dialogFlag.inputDisabled"></el-input></el-col>
            <el-col :span="5" style="padding: 0 5px;"><el-input type="number" v-model="poSamplesChargesModel.chargesCount" :disabled="dialogFlag.inputDisabled"></el-input></el-col>
            <el-col :span="3" style="padding: 0 0 5px 0;text-align: center">币种：</el-col>
            <el-col :span="6" style="padding-left:5px;"><selector-item :select-value="poSamplesChargesModel.currencyId" :option-data="options" :is-disabled="dialogFlag.inputDisabled" place-value="请选择币种" @on-child-change-Val="onChildChangeValCurrency"></selector-item></el-col>
          </el-form-item>
          <el-form-item label="计费类型：" class="yufei_item" prop="freight" :label-width="financeFormLabelWidth">
            <el-radio-group v-model="poSamplesChargesModel.freight">
              <el-radio  :label="true" name="bankTransfer" :disabled="dialogFlag.inputDisabled" >千克（KG)</el-radio>
              <el-radio  :label="false" name="alipay" :disabled="dialogFlag.inputDisabled" >立方米（CBM）</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="入库原因："  :label-width="financeFormLabelWidth">
            <el-col :span="5"><selector-item :select-value="poSamplesChargesModel.currencyId" :option-data="options" :is-disabled="dialogFlag.inputDisabled" place-value="请选择供应商" @on-child-change-Val="onChildChangeValCurrency"></selector-item></el-col>
            <el-col :span="2" style="text-align: center;">
              <el-tooltip class="item" effect="dark" content="添加其他原因" placement="top-start" v-if="dialogFlag.inputDisabled == false">
                <i class="iconfontyyy" @click="dialogFlag.isOpen=true;" style="padding:0 5px;">&#xe623;</i>
              </el-tooltip>
            </el-col>
            <el-col :span="17" v-if="dialogFlag.isOpen==true"><el-input v-model="poSamplesChargesModel.chargesCount" placeholder="输入其他原因"></el-input></el-col>
          </el-form-item>
          <el-form-item label="备注：" prop="allCharges" :label-width="financeFormLabelWidth">
            <el-input  type="textarea" v-model="poSamplesChargesModel.chargesCount" :disabled="dialogFlag.inputDisabled"></el-input>
          </el-form-item>
        </el-form>
      </section>
      <section class="infoData">
        <div class="info_tit" style="margin-bottom: 20px;">
          <span class="title">明细信息</span><br/>
        </div>
        <el-row style="margin:10px">
          <el-col :span="12" v-if="dialogFlag.inputDisabled == false">
            <el-button type="primary" size="small"  @click="dialogFlag.isOpen=true;" >添加物品</el-button>
            <el-button type="primary" size="small"  @click="batchSubmit()" >批量输入SKU</el-button>
            <el-button type="primary" size="small"  @click="batchSubmit()" >Excel导入</el-button>
          </el-col>
          <el-col :span="12" style="text-align: right;float: right;"><span>总重量（KG）</span><span>0.00</span><span> 总体积（CBM）</span><span>0.00</span></el-col>
        </el-row>
        <div class="table_border">
          <el-table :data="poSamplesItemList" border tooltip-effect="dark" style="width: 100%" >
            <el-table-column sortable label="图片" align="center" class="textarea">
              <template scope="scope">
                <img src="../assets/imgTest.jpg" alt="凤早翔太" :data-src="scope.row.url">
              </template>
            </el-table-column>
            <el-table-column sortable prop="status" label="SKU" align="center" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column sortable prop="status" label="货品名称"  align="center"></el-table-column>
            <el-table-column sortable prop="status" label="采购单价"  align="center"></el-table-column>
            <el-table-column sortable prop="status" label="数量" align="center">
              <template scope="scope">
                <div v-if="dialogFlag.inputDisabled == false">
                  <el-input type="number" v-model="scope.row.memo"></el-input>
                </div>
                <span v-if="dialogFlag.inputDisabled == true">{{scope.row.memo}}</span>
              </template>
            </el-table-column>
            <el-table-column sortable label="货位号" align="center" :show-overflow-tooltip="true">
              <template scope="scope">
                <div v-if="dialogFlag.inputDisabled == false">
                  <el-input v-model="scope.row.memo"></el-input>
                </div>
                <span v-if="dialogFlag.inputDisabled == true">{{scope.row.memo}}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="120" align="center">
              <template scope="scope">
                <el-tooltip class="item" effect="dark" content="删除" placement="top-start" v-if="dialogFlag.inputDisabled == false">
                  <i class="iconfontyyy"  @click="deleteRow(scope.row,scope.$index,poSamplesItemList)">&#xe6f7;</i>
                </el-tooltip>
                <i class="iconfontyyy" v-if="dialogFlag.inputDisabled == true">&#xe6f7;</i>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </section>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeDialog">取消</el-button>
        <el-button type="primary" @click="closeDialog()" v-if="dialogFlag.inputDisabled == false" :loading="$store.state.loading">保 存</el-button>
      </div>
    </el-dialog>
    <add-product-item :open="dialogFlag.isOpen" @add-pro-data="addProData"></add-product-item>
  </div>
</template>
<script>
  import addProductItem from './add_product_item.vue';
  export default{
    components: {addProductItem},
        data(){
            return {
              poSamplesItemList: [{memo: 'fdfsd', status: 3343}],
              poSamplesChargesModel: {
                chargesCount: '',
                allQty: '',
                freight: '',
                allCharges: '',
                addTime: '',
                addUser: '',
                compId: '',
                poId: '',
                updTime: '',
                updUser: '',
              },
              dialogFlag: {
                isOpen: false,
                infoDetail: this.open,
                dialogTitle: this.title,
                inputDisabled: this.disabled,
              },
              transmit:false,
              status:false,
              financeFormLabelWidth: '150px',
            }
        },
        props:['title','open','disabled',],
        mounted () {

        },
        methods: {
          addProData:function(val){
              this.dialogFlag.isOpen = val.open;
          },
          closeDialog:function(){
            this.dialogFlag.infoDetail = false;
            this.transmit = !this.transmit;
          },
        },
        watch:{
            'transmit':{
                handler(val){
                    this.$emit('material-dialog',{
                        open:this.dialogFlag.infoDetail,
                        status:this.status
                    })
                }
            },
            'title':{
                  handler(val){
                      this.dialogFlag.dialogTitle = val;
                  }
              },
            'open':{
                  handler(val){
                      this.dialogFlag.infoDetail = val;
                  }
              },
            'disabled':{
                  handler(val){
                      this.dialogFlag.inputDisabled = val;
                  }
              },
        }
    }
</script>

<style scoped>
    .info_tit{
      display:flex;
      justify-content:space-between;
    }
    .info_tit .title{
      font-size:16px;
      font-weight:bold;
    }
    .formData .el-form-item {
      margin:10px 10px 0 20px;
    }
    .formData{
      margin:10px 0;
    }
    .infoData{
      margin-left:10px;
    }
</style>
