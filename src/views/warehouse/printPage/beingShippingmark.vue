<template>
  <div id="outermost_wrap" class="user_manager_wrap">
    <el-row class="header">
      <el-col class="header-left logo"><span class="titleName">生成采购箱唛</span></el-col>
    </el-row>
    <div id="content_wrap" class="content_wrap">
      <el-row style="border: 1px solid #dfe6ec;width: 465px;padding:18px;margin: 0 auto;">
        <el-row style="text-align: left;">
          <el-col :span="8"><img src="../../../assets/erweima.jpg" title="此二维码仅供展示，不可进行扫码，实际二维码在生成之后会自动下载" style="width: 130px;height: 140px;"></el-col>
          <el-col :span="16" style="margin-top: 0px;">
            <span>深圳市睿搏科技集团有限公司</span><br/>
            <span>订单编号（{{orderLength}}个）/物品个数（{{cartonModel.productCount}}种）：</span><br/>
            <span>采购箱唛编号：{{cartonModel.cartonNo}}</span><br/>
            <span class="breakAll" v-for="(item,index) in poArr" v-if="index == 0 || index == 1 || index == 2">{{item}}<br/></span>
            <span style="margin-top: 20px;">{{'重量：'+cartonModel.weight+'KG'}}</span><br/>
            <span>体积：<span class="breakAll" v-if="cartonModel.lengh != '' && cartonModel.width != '' && cartonModel.height != ''">{{cartonModel.lengh+'*'+cartonModel.width+'*'+cartonModel.height+'cm'+'='+cartonModel.voiume}}</span>cm3</span>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <div v-for="(item,index) in carItemList" v-if="index == 0 || index == 1" style="margin:10px 0">
              <span class="breakAll">物品名称：{{item.productName}}</span><br/>
              <span>SKU：{{item.skuNo}}</span><br/>
              <span>装箱/套袋数量：{{item.qty+'PCS /  '+item.labelQty+'PCS'}}</span><br/>
            </div>
          </el-col>
        </el-row>
      </el-row>
      <el-row class="supplier_btn ">
        <el-button class="el-icon-plus"  size="small"  @click="dialogFlag.infoDetail = true;">添加产品</el-button>
        <el-button class="el-icon-plus"  size="small"  @click="dialogFlag.isOpen = true">录入重量&体积</el-button>
      </el-row>
      <el-row class="supplier_btn">
        <el-button class="el-icon-plus" type="primary"  size="small"  @click="beingMark">生成采购箱唛</el-button>
      </el-row>
      <div class="table_padding">
        <el-table :data="carItemList" border tooltip-effect="dark" style="width: 100%">
          <el-table-column label="操作" align="center" width="100px">
            <template scope="scope" >
              <el-tooltip class="item" effect="dark" content="编辑" placement="top-start" >
                <i class="iconfontyyy" @click="openEdit(scope.row,scope.$index);" >&#xe6e5;</i>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="删除" placement="top-start" >
                <i class="iconfontyyy" @click="deleteRow(scope.row,scope.$index,carItemList)" >&#xe6f7;</i>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column sortable prop="poNo" label="订单编号" align="center"></el-table-column>
          <el-table-column sortable prop="skuNo" label="SKU" align="center"></el-table-column>
          <el-table-column sortable prop="productName" label="名称" align="center"></el-table-column>
          <el-table-column sortable prop="qty" label="本箱数量"  align="center">
            <template scope="scope">
              <el-input type="number" v-model.number="scope.row.qty"></el-input>
            </template>
          </el-table-column>
          <el-table-column sortable prop="qty" label="套袋贴标数量"  align="center">
            <template scope="scope">
              <el-input type="number" v-model.number="scope.row.labelQty"></el-input>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <!------------------添加产品 弹出框--------------------------->
    <el-dialog title="添加产品" :visible.sync="dialogFlag.infoDetail" size="tiny" :close-on-click-modal="false" @open="openDialog" @close="closeDialog('proInfo')">
      <el-form :model="proInfo" ref="proInfo">
        <el-form-item  label="订单编号：" prop="orderNo"   :label-width="formLabelWidth" required :rules="{required:true,message:'不能为空',trigger:'blur'}">
          <el-input type="text" placeholder="请输入订单编号"  v-model="proInfo.orderNo"></el-input>
        </el-form-item>
        <el-form-item  label="SKU：" prop="sku" :label-width="formLabelWidth"  required :rules="{required:true,message:'不能为空',trigger:'blur'}">
          <el-input type="text" placeholder="请输入SKU"  v-model="proInfo.sku"></el-input>
        </el-form-item>
        <el-form-item  label="数量：" prop="num" :label-width="formLabelWidth" required :rules="{required:true,message:'不能为空',trigger:'blur'}">
          <el-input type="number" placeholder="请输入数量"  v-model.number="proInfo.num"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFlag.infoDetail = false;">取 消</el-button>
        <el-button type="primary" @click="addPro('proInfo');" :loading="$store.state.loading">确 定</el-button>
      </div>
    </el-dialog>
    <!------------------录入重量&体积 弹出框--------------------------->
    <el-dialog title="录入重量&体积" :visible.sync="dialogFlag.isOpen" size="tiny" :close-on-click-modal="false">
      <el-form :model="cartonModel" ref="cartonModel" >
        <el-form-item  label="重量：" prop="weight"   :label-width="labelWidth" required :rules="{required:true,message:'不能为空',trigger:'blur'}">
          <el-input type="number" placeholder="请输入重量"  v-model="cartonModel.weight" min="0"><template slot="append">kg</template></el-input>
        </el-form-item>
        <el-form-item  label="长：" prop="lengh" :label-width="labelWidth"  required :rules="{required:true,message:'不能为空',trigger:'blur'}">
          <el-input type="number" placeholder="请输入长"  v-model="cartonModel.lengh" min="0"><template slot="append">cm</template></el-input>
        </el-form-item>
        <el-form-item  label="宽：" prop="width" :label-width="labelWidth" required :rules="{required:true,message:'不能为空',trigger:'blur'}">
          <el-input type="number" placeholder="请输入宽"  v-model="cartonModel.width" min="0"><template slot="append">cm</template></el-input>
        </el-form-item>
        <el-form-item  label="高：" prop="height" :label-width="labelWidth" required :rules="{required:true,message:'不能为空',trigger:'blur'}">
          <el-input type="number" placeholder="请输入高"  v-model="cartonModel.height" min="0"><template slot="append">cm</template></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFlag.isOpen = false;">取消</el-button>
        <el-button type="primary" @click="submitcartonModel('cartonModel')" :loading="$store.state.loading">确 定</el-button>
      </div>
    </el-dialog>
    <!------------------修改产品名称 弹出框--------------------------->
    <el-dialog title="编辑名称" :visible.sync="dialogFlag.openName" size="tiny" :close-on-click-modal="false">
      <el-input v-model="proName"></el-input>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFlag.openName = false;">取消</el-button>
        <el-button type="primary" @click="editProName(index,carItemList);" :loading="$store.state.loading">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  export default{
    data(){
      return {
        src:'',
        proInfo:{
          name:'',
          sku:'',
          num:'',
          orderNo:'',
        },
        proName:'',
        carItemList:[],
        poArr:[],
        cartonModel:{
          lengh:'',
          width:'',
          height:'',
          weight:'',
          cartonId:'',
          voiume:'',
          poCount:'',
          productCount:'',
        },
        index:'',
        dialogFlag:{
          isOpen:false,
          openName:false,
          infoDetail:false,
        },
        sels:[],
        poId:'',
        cartonId:'',
        orderLength:'',
      }
    },
    mounted () {
      this.poId = this.tool.requestParams('poId');
      this.getShipppingMarkList();
    },
    methods: {
      getShipppingMarkList:function(){
        this.httpPost('pocarton/selectCarton',{poId:this.poId}).then(res => {
            if(res.data.result == true){
               const pageData = res.data.params.carItemList;
               this.cartonModel.cartonId = res.data.params.carModel.cartonId;
               this.cartonId = res.data.params.carModel.cartonId;
               this.carItemList = [];
               pageData.forEach(item =>{this.carItemList.push({
                 productId:item.productId,
                 productName:item.productName,
                 qty:'',
                 labelQty:'',
                 skuNo:item.skuNo,
                 poNo:item.poNo,poId:this.poId,
                 cartonId:this.cartonId
               })});
               this.getNumInfo();
            }else{
                this.$alert('未登录请重新登录', '提示', {
                  confirmButtonText: '确定',
                  callback: action => {
                    this.$router.replace({
                      path: '/login',
                    })
                  }
                });
            }
        })
      },
      getNumInfo:function(){
        this.cartonModel.productCount = this.carItemList.length;
        let poArr = this.carItemList.map(item =>item.poNo);
        this.cartonModel.poCount = poArr.length;
        poArr = this.tool.arrUnique(poArr);
        this.poArr = poArr;
        this.orderLength = this.poArr.length > 3 ? 3 : this.poArr.length;
      },
      addPro:function(formName){
        this.$refs[formName].validate((valid) => {
          if(valid) {
            this.httpPost('pocarton/veifyPoSkuInfo',{poId:this.proInfo.orderNo,skuNo:this.proInfo.sku}).then(res =>{
                if(res.data.result == true){
                  this.httpPost('pocarton/selectPoName',{skuNo:this.proInfo.sku,poId:this.proInfo.orderNo,qty:this.proInfo.num}).then(res =>{
                    if(res.data.result == true){
                      var data = res.data.params.model;
                      this.carItemList.push({poNo:this.proInfo.orderNo,
                        productName:data.productName,
                        productId:data.productId,
                        qty:this.proInfo.num,
                        labelQty:'',
                        skuNo:this.proInfo.sku,
                        poId:this.poId,
                        cartonId:this.cartonId
                      });
                      this.dialogFlag.infoDetail = false;
                      this.getNumInfo();
                    }else{
                      this.$message(res.data.message);
                    }
                  });
                }else{
                    this.$message(res.data.message);
                }
            })
          }
        })
      },
      submitcartonModel:function(forName){
        this.$refs[forName].validate((valid) => {
          if (valid) {
              if(this.cartonModel.width < 0 || this.cartonModel.lengh < 0 || this.cartonModel.weight < 0 || this.cartonModel.height < 0){
                  this.$message('长宽高和重量都不能小于零！')
              }else{
                this.cartonModel.voiume = this.cartonModel.lengh*this.cartonModel.width*this.cartonModel.height;
                this.dialogFlag.isOpen = false;
              }
          }else{
            return false;
          }
        });
      },
      beingMark:function() {
        var flag = false, vm = this;
        if (this.cartonModel.voiume == '' || this.cartonModel.voiume == null) {
          this.$message('您还没有录入重量和体积哦！');
          flag = false;
        } else {
          flag = this.carItemList.every(function(item){
              return item.qty >= 0 && item.labelQty >= 0 && item.qty != null && item.labelQty != null && item.qty != '' && item.labelQty != '';
          })
          if (flag == true) {
            var params = [{cartonItemList: this.carItemList, cartonModel: this.cartonModel}];
            this.httpPost('pocarton/addCartonInfo', params).then(res => {
              if(res.data.result == true){
                var arr = [];
                arr.push(res.data.params.data);
                window.open(this.RmsUrl+'pocarton/downloadCartonInfo?strList='+arr+'&Authorization=' + sessionStorage.getItem("userSession"));
                this.getShipppingMarkList();
              }
            })
          }else{
            this.$message('请输入本箱数量和套袋数量且需要大于零！');
          }
        }

      },
      deleteRow(row,index, data) {
        data.splice(index, 1);
      },
      openEdit(row,index) {
        this.index = index;
        this.proName = row.productName;
        this.dialogFlag.openName = true;
      },
      editProName(index,data) {
        data[index].productName = this.proName;
        this.dialogFlag.openName = false;
      },
      closeDialog:function(formName){
        this.$refs[formName].resetFields();
      },
      openDialog:function(formName){
        this.proInfo.orderNo = this.carItemList[0].poNo;
      }
    }
  }
</script>
<style scoped>
  .header {
    width: 100%;
    line-height: 80px;
    height: 80px;
    border-bottom:1px solid #dfe6ec;
  }
  .logo{
    display: block;
    height: 80px;
    box-sizing: border-box;
    background:url("../../../assets/banner_title.jpg")no-repeat left ;
  }
  .titleName{
    padding-left: 500px;
    font-weight:bold;
    font-size:18px;
  }
  .breakAll{
    word-break: break-all;
  }
</style>
