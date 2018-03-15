<template>
<div>
  <el-dialog title="筛选" :visible.sync="screenn.screenisOpen"  size="tiny"  :close-on-click-modal="false"  @close="screedialog = false;removeForm();" >
    <div class="data_body" style="text-align: center" >
      <el-row class="row_title row-text" :getter="20">
        <el-col class="col-matching" :span="6">条件</el-col>
        <el-col class="col-matching" :span="6">比较方式</el-col>
        <el-col class="col-matching" :span="12">输入</el-col>
      </el-row>
      <el-row class="row-text">
        <el-col class="col-matching" :span="6"> SKU </el-col>
        <el-col class="col-matching col_input" :span="6">
         是
        </el-col>
        <el-col class="col_input" :span="12" ><el-input v-model="pagefilters.skuNo"></el-input></el-col>
      </el-row>
      <el-row class="row-text">
        <el-col class="col-matching" :span="6"> SPU </el-col>
        <el-col class="col-matching col_input" :span="6">
          包含
        </el-col>
        <el-col class="col_input" :span="12" ><el-input v-model="pagefilters.cnName"></el-input></el-col>
      </el-row>
      <el-row class="row-text">
        <el-col class="col-matching" :span="6"> 商品名称 </el-col>
        <el-col class="col-matching col_input" :span="6">
          包含
        </el-col>
        <el-col class="col_input" :span="12" ><el-input v-model="pagefilters.cnName"></el-input></el-col>
      </el-row>
      <el-row class="row-text">
        <el-col class="col-matching" :span="6"> 产品分类 </el-col>
        <el-col class="col-matching col_input" :span="6">
         是
        </el-col>
        <el-col class="col_input" :span="12">
          <el-cascader
            expand-trigger="hover"
            clearable
            :options="options"
            :props="props"
            v-model="selectedOptions"
            @change="handleChange"
          ></el-cascader>
        </el-col>
      </el-row>
      <el-row class="row-text">
        <el-col class="col-matching" :span="6">开发</el-col>
        <el-col class="col-matching col_input" :span="6">
         是
        </el-col>
        <el-col class="col_input" :span="12">

          <el-select  filterable clearable v-model="pagefilters.developUserId" :allow-create="true" :placeholder="placeholder"  >
            <el-option v-for="item in developPer" :key="item.userId" :label="item.userName" :value="item.userId"></el-option>
          </el-select>
        </el-col>
      </el-row>
      <el-row class="row-text">
        <el-col class="col-matching" :span="6">采购跟单</el-col>
        <el-col class="col-matching col_input" :span="6">
          是
        </el-col>
        <el-col class="col_input" :span="12">
          <el-select  filterable clearable  v-model="pagefilters.purchaseUserId" :allow-create="true" :placeholder="placeholder" >
            <el-option v-for="item in documentaryPer" :key="item.userId" :label="item.userName" :value="item.userId"></el-option>
          </el-select>
        </el-col>
      </el-row>
      <el-row class="row-text">
        <el-col class="col-matching" :span="6">摄影</el-col>
        <el-col class="col_input col-matching" :span="6">
          是
        </el-col>
        <el-col class="col_input" :span="12">
          <el-select  filterable clearable v-model="pagefilters.photographyUserId" :allow-create="true" :placeholder="placeholder"  >
            <el-option v-for="item in photoPer" :key="item.userId" :label="item.userName" :value="item.userId"></el-option>
          </el-select>
        </el-col>
      </el-row>
      <el-row class="row-text">
        <el-col class="col-matching" :span="6">美工</el-col>
        <el-col class="col-matching col_input" :span="6">
          是
        </el-col>
        <el-col class="col_input" :span="12">
          <el-select  @change="" filterable v-model="pagefilters.imageDesignUserId" clearable :allow-create="true" :placeholder="placeholder" >
            <el-option v-for="item in designerPer" :key="item.userId" :label="item.userName" :value="item.userId"></el-option>
          </el-select>
        </el-col>
      </el-row>
      <el-row class="row-text">
        <el-col class="col-matching" :span="6">销售状态</el-col>
        <el-col class="col_input col-matching" :span="6">
          是
        </el-col>
        <el-col class="col_input" :span="12">
          <el-select  filterable  v-model="pagefilters.salesStatus" :allow-create="true" :placeholder="placeholder"  >
            <el-option v-for="item in salesOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-col>
      </el-row>
      <el-row class="row-text">
        <el-col class="col-matching" :span="6">分配仓库</el-col>
        <el-col class="col-matching col_input" :span="6">
          是
        </el-col>
        <el-col class="col_input" :span="12">
          <el-select  filterable clearable v-model="pagefilters.warehouseId" :allow-create="true" :placeholder="placeholder" >
            <el-option v-for="item in warehouses" :key="item.warehouseId" :label="item.warehouseName" :value="item.warehouseId"></el-option>
          </el-select>
        </el-col>
      </el-row>
      <el-row class="row-text">
        <el-col class="col-matching" :span="6">分配销售</el-col>
        <el-col class="col-matching col_input" :span="6">
          是
        </el-col>
        <el-col class="col_input" :span="12">
          <el-select  filterable clearable v-model="pagefilters.salesUserId"  :allow-create="true" :placeholder="placeholder" >
            <el-option v-for="item in salesUsers" :key="item.salesUserId" :label="item.salesUserName" :value="item.salesUserId"></el-option>
          </el-select>
        </el-col>
      </el-row>
      <el-row class="row-text">
        <el-col class="col-matching" :span="6">供应商</el-col>
        <el-col class="col-matching col_input" :span="6">
          是
        </el-col>
        <el-col class="col_input" :span="12">
          <el-select  filterable clearable v-model="pagefilters.salesUserId"  :allow-create="true" :placeholder="placeholder" >
            <el-option v-for="item in salesUsers" :key="item.salesUserId" :label="item.salesUserName" :value="item.salesUserId"></el-option>
          </el-select>
        </el-col>
      </el-row>
     <!-- <el-row class="row-text">
        <el-col class="col-matching" :span="6">物流方式</el-col>
        <el-col class="col-matching col_input" :span="6">
          是
        </el-col>
        <el-col class="col_input" :span="12">
       &lt;!&ndash;   <el-select disabled  filterable clearable :allow-create="true" :placeholder="placeholder" >
            <el-option></el-option>
          </el-select>&ndash;&gt;
        </el-col>
      </el-row>-->
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="removeForm">清除条件</el-button>
      <el-button @click="screenForm">筛 选</el-button>
      <el-button @click="screenn.screenisOpen = false;">取 消</el-button>
    </div>
  </el-dialog>
</div>
</template>
<script>
    export default{
      data(){
        return {
          placeholder:'请选择',
          selectedOptions:[],
          pagefilters: {
            skuNo: '',
            cnName: '',
            categoryId:'',
            developUserId: '',
            purchaseUserId: '',
            photographyUserId: '',
            imageDesignUserId: '',
            salesStatus: '',
            warehouseId: '',
            salesUserId: '',
            //logisticsState: '',
          },
          props:{
            value:'categoryId',
            label:'cnName',
            children:'categorys'
          },
          listData:[],
          options: [],
          designerPer:[],
          developPer:[],
          documentaryPer:[],
          photoPer:[],
          optionsValue:[],
          salesOptions:[
            {
                value:'1',
                label:'正常销售'
            },
            {
              value:'2',
              label:'清货销售'
            },
            {
              value:'3',
              label:'暂停销售'
            },
            {
              value:'4',
              label:'卖完不再销售'
            },
            {
              value:'5',
              label:'侵权不再销售'
            },
          ],
          warehouses:[],
          salesUsers:[],
          screenn:this.screendialogFlag,
        }
      },
      props: ['screendialogFlag','recovery'],
      watch:{
        'screendialogFlag':{
          handler: function (val) {
            this.screenn = val;
            console.log('val==== % 0',val)
            if(this.screenn.screenisOpen === true){
              this.screenn.screenisOpen = val.screenisOpen;
              this.pagefilters.salesStatus = val.salesStatus;
              this.requestem();
              this.requestemper('摄影人员');
              this.requestemper('美工人员');
              this.requestemper('开发人员');
              this.requestemper('跟单人员');
            }else if(val.screenisOpen === false){

            }
          },
          deep: true,
        },
      },
      mounted: function () {
        if(this.recovery == true){
          this.salesOptions.push({
            value:'6',
            label:'回收站'
          })
        }
      },
      methods: {
        requestemper(groupName){
          var _this=this;
          var aa=decodeURI(groupName);
          var url='productUserGroup/getList?groupName='+aa;
          //alert(url)
        this.httpGet(url).then(res => {
          if(groupName=='摄影人员'){
            _this.photoPer = res.data;
          }else if(groupName=='美工人员'){
            _this.designerPer = res.data;
          }
          else if(groupName=='开发人员'){
            _this.developPer = res.data;
          }
          else if(groupName=='跟单人员'){
            _this.documentaryPer = res.data;
          }
        })
        },
       requestem(){
          var _this=this;
          const getClassifyInfo = this.httpPost('productCategory/getList');//分类
          const getWarehouseInfo = this.httpPost('product/loadFilterConditionWarehouse');//仓库
          const getSalesUserInfo = this.httpPost('product/loadFilterConditionSalesUser');//销售
          _this.$http.all([getClassifyInfo,getWarehouseInfo,getSalesUserInfo]).then(this.$http.spread(function(classifyInfo,warehouseInfo,salesUserInfo){
                console.log(2222)
               _this.options  =  classifyInfo.data;
               _this.warehouses = warehouseInfo.data;
               _this.salesUsers = salesUserInfo.data;
              var digui = function(val){
                for( var i=0;i<val.length;i++ ){
                  if(val[i].categorys){
                    if(!val[i].categorys.length){
                      delete val[i].categorys;
                    }else{
                      digui(val[i].categorys);
                    }
                  } else{
                    continue;
                  }
                }
              };
              digui(_this.options);
            })
            )
        },
        handleChange(val){
            //console.log('田田国',this.optionsValue)
          var optionsValue = val
         this.pagefilters.categoryId = optionsValue[optionsValue.length-1];
         // console.log('田田国 % 0', this.pagefilters.categoryId)
        },
        screenForm(){
        	var vm=this;
          this.httpPost('product/listProduct',this.pagefilters).then(res => {
              this.listData = res.data;
              this.screenn.screenisOpen = false;
            this.$emit('parent-screen',{
              dialog: vm.screenn.screenisOpen,
              list:vm.listData,
              status:vm.pagefilters,

            });
          })
        },
        removeForm(){
           this.pagefilters.skuNo='';
           this.pagefilters.cnName='';
           this.selectedOptions=[];
           this.pagefilters.imageDesignUserId = '';
           this.pagefilters.developUserId = '';
           this.pagefilters.photographyUserId = '';
           this.pagefilters.purchaseUserId = '';
           this.pagefilters.warehouseId = '';
           this.pagefilters.salesUserId = '';
           this.pagefilters.categoryId='';
        }
      }
    }
</script>

<style scoped>

/*.row{
  line-height: 36px;
}*/

/*

.data_body{
  border:1px solid #e4e4e4;
}
.data_body .row-text{
  border:1px solid #e4e4e4;
  border-right:none;
}
.data_body .row-text .col-matching{
  padding: 10px 20px;
  border-right:1px solid #e4e4e4;
}
.data_body .col_input .el-cascader{
   width: 100%!important;
  }

*/

</style>
