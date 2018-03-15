<template>
  <div class="block">
    <el-cascader
      expand-trigger="hover"
      clearable
      :options="options"
      :props="props"
      placeholder="搜索"
      filterable
      @change="addData"
      v-model="classify"
      :disabled="dis"
    >
    </el-cascader>
  </div>

</template>

<script>
  export default {
    name:'classify',
    props:['disState','Selected','skuno'],
    data() {
      return {
        props:{
          value:'categoryId',
          label:'cnName',
          children:'categorys'
        },
        options: [],
        classify:this.Selected,
        classify2:[],
        dis:this.disState,
        skunoo:this.skuno
      };
    },
    mounted () {
      this.getClassifyList();
    },
    methods: {
      getClassifyList(){
        var _this = this;
        _this.options=[];
        this.httpPost('productCategory/getList').then(res => {
//          this.classify=this.Selected;
//          this.dis = this.disState;
         console.log(res)
          console.log(777668)
          _this.options=res.data
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
          console.log('分类管理的数据最后的 % 0', _this.options)
        })
      },
      addData(){
        var _this = this;
        let classifyData=_this.classify;
        let cateId = _this.classify[_this.classify.length-1];
          _this.$emit('assignment',{
            value:classifyData,
            lastValue:cateId
          })
//        this.$emit('classify',classifyData)
      },
    },
    watch: {
     /* 'classify':{
        handler(val){
          this.$emit('assignment',{
            value:val,
          })
        }
      },*/
      'Selected':{
        handler(val){
            this.classify=val;
        },
        deep: true
      },
      'disState':{
        handler(val){
          this.dis = val;
        }
      },
    }

  };

</script>

<style scoped>
.block{
  width:100%
}
  .block span{
    width:100%;
  }
</style>
