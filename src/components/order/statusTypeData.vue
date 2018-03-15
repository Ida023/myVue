<template>
  <div>
    <!--订单部分页面折叠筛选组件-->
    <el-collapse v-model="activeNames">
      <el-collapse-item name="1">
     <!--   <div>-->
          <div class="marginBottom flex">
            <div class="span_label">平台渠道</div>
            <el-radio-group v-model="params.channelId" size="small" @change="getAccountNoData" class="flex1">
              <el-radio-button class="marginBottom" :label="item.channelId" :value="item.channelId" :key="item.channelId" v-for="(item,index) in channelIdData">{{item.channelName}}</el-radio-button>
            </el-radio-group>
          </div>
          <div class="marginBottom flex">
            <div class="span_label">店铺账号</div>
            <el-radio-group v-model="params.accountNo" size="small" @change="getCountryNoData"  class="flex1 radioOverflow">
              <el-radio-button class="marginBottom" :label="item.accountId" :value="item.accountId" :key="item.accountId" v-for="(item,index) in accountNoData">{{item.accountNo}}</el-radio-button>
            </el-radio-group>
          </div>
          <div class="marginBottom flex">
            <span class="span_label">市场/站点</span>
            <el-radio-group v-model="params.countryNo" size="small"  class="flex1 radioOverflow">
              <el-radio-button class="marginBottom" :label="item.countryNo" :value="item.countryNo" :key="item.countryNo" v-for="(item,index) in countryNoData">{{item.cnName}}</el-radio-button>
            </el-radio-group>
          </div>
          <div class="marginBottom flex">
            <span class="span_label">收件人国家</span>
            <el-select v-model="params.toCountryNo" filterable clearable size="small"  class="">
              <el-option class="marginBottom" :label="item.cnName" :key="item.countryNo" :value="item.countryNo" v-for="(item,index) in countryNoData">{{item.cnName}}</el-option>
            </el-select>
          </div>
     <!--   </div>-->
      </el-collapse-item>
    </el-collapse>
  </div>
</template>
<script>
  export default{
    data(){
      return {
        activeNames:'1',   // 折叠面板
        channelIdData:[],   //
        accountNoData:[],   //
        countryNoData:[],   //
        dataOption:[{value:1,label:'测试数据1'},{value:2,label:'测试数据2'},{value:3,label:'测试数据3'},{value:4,label:'测试数据4'}],   //
        params:{
          channelId:this.channelIdItem,
          accountNo:this.accountNoItem,
          countryNo:this.countryItem,
          toCountryNo:this.countryNoItem,
        },
        first:true,   //  是否第一次赋值，第一次不清空相关
        isSeach:true,  //  值改变是否进行搜索查询，因相关其他值改变而致值为空的改变不进行搜索查询
      }
    },
    props:['channelIdItem','accountNoItem','countryItem','countryNoItem',],
    mounted () {
      this.getChannelIdData();
      this.getAccountNoData();
      this.getCountryNoData();
    },
    methods: {
     getChannelIdData: function(){
      this.httpGet('dictChannel/selectList','','Scm').then(res =>{
        this.channelIdData = res.data;
        this.channelIdData.unshift({channelId:'', channelName: '全部'});
      })
    },
    getAccountNoData:function(){
      var vm = this;
      if(this.first == false){
          this.params.accountNo = '';
          this.isSeach = false;
      }
      setTimeout(function(){
        vm.first = false;
        vm.isSeach = true;
      },200)
      this.httpGet('shopAccount/selectListByChannel',{channelId:this.params.channelId},'Sms').then(res =>{
        this.accountNoData = res.data;
        this.accountNoData.unshift({accountId:'', accountNo: '全部'});
      })
    },
    getCountryNoData:function(val){
      var vm = this;
      if(this.first == false){
        this.params.countryNo = '';
        this.isSeach = false;
      }
      setTimeout(function(){
        vm.first = false;
        vm.isSeach = true;
      },200)
      this.httpGet('shopAccount/selectCountryList',{accountId:this.params.accountNo},'Sms').then(res =>{
        this.countryNoData = res.data;
        this.countryNoData.unshift({countryNo:'', cnName:'全部'});
      })
    },
   },
    watch:{
        'params':{
          handler(val){
             if(this.isSeach == true){
               this.first = false;
               this.$emit('getParamsData',{
                 params:val,
               })
             }
          },
          deep:true
        },
      'countryNoItem':{
          handler(val){
              this.params.countryNo = val;
          }
      },
      'accountNoItem':{
          handler(val){
              this.params.accountNo = val;
              //this.first = true;
          }
      },
      'channelIdItem':{
          handler(val){
              this.params.channelId = val;
              //this.first = true;
          }
      },
      'countryItem':{
          handler(val){
              this.params.toCountryNo = val;
          }
      },
    }
  }
</script>
<style scoped>
</style>
