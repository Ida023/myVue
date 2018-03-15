<template>
  <div style="">
    <el-tree accordion id="tree" highlight-current :highlight-current="dis"  :data="assistlist.data" :props="assistlist.defaultProps" @node-click="handleNodeClick"></el-tree>
  </div>

</template>

<script>
  import ElRow from "element-ui/packages/row/src/row";
  import ElCol from "element-ui/packages/col/src/col";
  export default {
    name:'SKU',
    props:['Selected','scene'],
    components: {
      ElCol,
      ElRow},
    data() {
      return {
        //添加组合商品
        assistlist:{
          dialoglist:[],
          data:[],
          defaultProps:{
            children: 'subCategoryList',
            label: 'categoryName'
          },
          sels:[],    //批量删除已选的条目数
          listData:[],
          page: {
            currentPage: 1, //当前页数
            pageSize: 10, //每页条数
            totalCount: 0, //总共条数
            totalPage: 0, //总共页数
            listData: []
          },
          pagefilters:{
            skuNo:'',
            cnName:'',
            categoryId:'',
            currentPage:1,
            pageSize:10,
            includeAssemby:'1'
          },
          classifybuteTree:[],
          optionVal:'',    // 下拉选项值
          selectParams:{    //  下拉过滤
            optionValue:'',
            optionTitle:'SKU',
          },
          selectOptions: [{
            value: 'SKU',
            label: 'SKU'
          }, {
            value: '产品名称',
            label: '产品名称'
          }],
          assistisOpen:false,
          arr:[],
          dis:true

        },
      };
    },
    computed:{
      getPlaceholder:function(){
        return this.selectParams.optionTitle == 'SKU' ? '请输入SKU' : this.selectParams.optionTitle == '产品名称' ? '请输入产品名称' :'' ;
      },
      getPlaceholderr:function(){
        return this.assistlist.selectParams.optionTitle == 'SKU' ? '请输入SKU' : this.assistlist.selectParams.optionTitle == '产品名称' ? '请输入产品名称' :'' ;
      },
    },
    mounted () {
      this.getlist();
//      this.getassdialog();
      this.getCategoryList();
    },
    methods: {
      addSku:function () {
        this.httpPost('stockProductPlan/getProductInfos',this.sels).then(res=>{
          console.log(res);
//            for(let i=0; i<res.data.length; i++){
//              let ifInput=true;
//              this.$set(res.data[i],'ifInput',ifInput)//输入框切换，需要每个小行有个判断值
//            }
          this.$emit('addSeeTableData',res.data)
        })
      },
      deleteSku:function () {//打开Sku 一些重置动作
        this.$refs.SKUTable.clearSelection()
      },
      CloseFn:function () {
        this.dis=false;
      },
      getlist(){

      },
      handleNodeClick(data){
        this.assistlist.pagefilters.categoryId = data.categoryId;
        this.getlist();
        this.$emit('assignment',data.keyPath);
      },
      getassdialog(val){
        var _this = this;
        _this.assistisOpen = true;
        _this.getlist();
        _this.httpPost('selectAllCategoryList').then( res => {
          _this.assistlist.data = res.data;
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
          digui(_this.assistlist.data);
        })
      },
      getCategoryList: function () {
        this.httpPost('selectAllCategoryList').then(res => {
          if (res.data.result == true) {
            this.assistlist.data = res.data.params.mapList;
            //this.pagefilters.keyPath=res.data.params.mapList[0].keyPath;
          }
        })
      },
      handleSizeChange(arr,val) {
        arr == '0' ? this.pagefilters.pageSize = val : this.assistlist.pagefilters.pageSize = val;
        if(arr == '0'){
          this.requestem();
        }else{
          this.getassdialog();
        }

      },
      handleCurrentChange(arr,val) {
        arr == '0' ? this.pagefilters.currentPage = val : this.assistlist.pagefilters.currentPage = val;
        if(arr == '0'){
          this.requestem();
        }else{
          this.getassdialog();
        }
      },
      selectFilter:function(val){
        if(val == '0'){
          if(this.selectParams.optionValue == '' ){
            this.pagefilters.skuNo = '';
            this.pagefilters.cnName='';
            this.requestem();
          }else {
            var value = this.selectParams.optionValue;
            var title = this.selectParams.optionTitle;
            if(value == '' || title == '' ){

            }else{
              var vm =this;
              if(title == 'SKU'){
                vm.pagefilters.skuNo=value;
                vm.pagefilters.cnName='';
              }else if(title == '产品名称'){
                vm.pagefilters.cnName=value;
                vm.pagefilters.skuNo='';
              }
              vm.pagefilters.salesStatus='';
              this.requestem();
            }
          }
        }else if(val == '1'){
          if(this.assistlist.selectParams.optionValue == '' ){
            this.assistlist.pagefilters.skuNo='';
            this.assistlist.pagefilters.cnName='';
            this.getlist();
          }else{
            var value = this.assistlist.selectParams.optionValue;
            var title = this.assistlist.selectParams.optionTitle;
            if(value == '' || title == '' ){

            }else{
              var vm =this;
              if(title == 'SKU'){
                vm.assistlist.pagefilters.skuNo=value;
                vm.assistlist.pagefilters.cnName='';
              }else if(title == '产品名称'){
                vm.assistlist.pagefilters.cnName=value;
                vm.assistlist.pagefilters.skuNo='';
              }
              this.httpPost('product/listProduct',this.assistlist.pagefilters).then(res => {
                this.getlist();
              })
            }
          }
        }
      },
    },
    watch: {
      'Selected':{
        handler(val){
          this.options=val.Selected;
          this.dis=val.dis;
          this.scene=this.Selected.scene;
        },
        deep: true
      },
      'options':{
        handler(val){
          this.$emit('assignment',{
            value: val,
            scene:this.scene,
            sign: 'accounts'
          })
        }
      },
    }
  };

</script>

<style scoped>
 #tree{
   border: 0 !important;
 }
</style>
