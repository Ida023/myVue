<template>
  <div>
      <el-row >
          <el-col style="width: 120px"><h4>组合产品信息</h4></el-col>
          <el-col style="width:80px" ><h4  class="routerLink" v-if="inputDisabled==false" @click="addisopen=true">添加物品</h4></el-col>
            <el-col class="table_border">
              <el-table  border  tooltip-effect="dark" :data="combinations" >
                <el-table-column label="操作"  prop="" align="center"  sortable >
                  <template scope="scope" class="operation" style=""  v-if="inputDisabled==false">
                    <el-tooltip  content="删除" effect="dark" placement="bottom" v-if="inputDisabled == false" >
                      <i  class="iconfontyyy" @click="deleteAssidata(scope.$index)" >&#xe6f7;</i>
                    </el-tooltip>
                  </template>
                </el-table-column>
                <el-table-column label="图片"  prop="imageUrl" align="center" >
                  <template scope="scope">
                    <img  v-if="scope.row.imageUrl!=null" style="width: 70px; height: 70px" :src="scope.row.imageUrl" :data-src="scope.row.imageUrl">
                  </template>
                </el-table-column>
                <el-table-column label="名称"  prop="cnName" align="center"  sortable></el-table-column>
                <el-table-column label="SKU"  prop="skuNo" align="center"  sortable ></el-table-column>
                <el-table-column label="数量"  prop="qty" align="center"  sortable >
                  <template  scope="scope">
                    <el-input style="width: 100%;height: 100%;" type="number" v-model="scope.row.qty" :disabled="inputDisabled" ></el-input>
                  </template>
                </el-table-column>
                <el-table-column label="重量"  prop="productWeight" align="center"  sortable ></el-table-column>
                <el-table-column label="长"  prop="productLength" align="center"  sortable ></el-table-column>
                <el-table-column label="宽"  prop="productWidth" align="center"  sortable ></el-table-column>
                <el-table-column label="高"  prop="productHeight" align="center"  sortable ></el-table-column>
              </el-table>
            </el-col>
      </el-row>

  </div>
</template>
<script>
  import categoryProduct from "components/singleTableData/addProduct";

  import store from '@/vuex/store'
  import { mapState,mapMutations,mapGetters,mapActions } from 'vuex'
  export default{
    name:'assistDialog',
    components: {
      categoryProduct
    },
    data(){
      let importRate2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入该字段'));
        } else if(!/^(\d{1,7})+(\.\d{0,2})?$/.test(value)){
          callback(new Error('请输入正确格式且长度不超过9位！'));
        } else {
          callback();
        }
      };
      return {
        combinations: [{productId:123}],//表格List
        defaltKey:[],
        addisopen:false,

      }
    },

    props: [ 'inputDisabled', 'productId', 'open'],
    watch: {
      'inputDisabled'(val){
        this.inputDisabledd = val;
      },
      'addisopen': {
        handler: function (val) {
          this.$emit('changeEvent',{
            isopen: val,
          });
        },
        deep: true,
      },
      'productId'(val){
        this.productIdd = val
        this.requestem();
        //this.assistInfoModel.combinations = [];
      },
    },
    mounted: function () {

    },

    methods: {
      deleteAssidata(index){
        this.combinations.splice(index,1)

      },
    	restData(){
        this.combinations=[];
      },
    	changeaddisopen(){
    		this.addisopen=false;
      },
      returnData(){
    		return this.combinations;
      },
      changeData(data){
        this.combinations=JSON.parse(JSON.stringify(data));
        console.log('77 %0',this.combinations)
      },

      //提交表格
      getportfolio(){
       	alert(77)
     	/*this.httpPost()*/

     },
    }
  }
</script>

<style scoped>
  .routerLink {
    text-align: center;
    color:#20a0ff;
    cursor: pointer;
  }
  .routerLink a {
    color:#20a0ff;
  }
  .el-dialog .el-dialog__body{
    min-height: 200px!important;

  }
</style>
