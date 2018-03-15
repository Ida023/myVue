<template>
  <div>
    <el-select  placeholder="请选择" v-model="options" clearable filterable>
      <el-option
        v-for="(item,index) in transport"
        :key="item.id"
        :label="item.value"
        :value="item.id"
      >
      </el-option>
    </el-select>
  </div>
</template>

<script>
  import ElRow from "element-ui/packages/row/src/row";
  import ElCol from "element-ui/packages/col/src/col";
  export default {
    name:'SpecialAttributes',
    components: {
      ElCol,
      ElRow},
    data() {
      return {
        transport:[
        ],
        dataModel: [],
        GetDataList:[],
        submit: {
          options: []
        },
        options:'',
        GetLogistics:{
          whId:'',
          whType:'02'
        }
      };
    },
    mounted () {
      this.getList()
    },
    methods: {
      getList:function () {
        this.httpGet('warehouseAllotting/getInfo',this.GetLogistics).then(res=>{//物流方式
          this.transport=res.data
        });
      },
      ResetFn:function () {
        this.options='';
      },
    },
    watch: {
      'options':{
        handler(val){
          let Obj={};
          for (let i=0; i<this.transport.length; i++){
            if(val===this.transport[i].id){
              Obj=this.transport[i];
            }
          }
          this.$emit('assignment',{
            value: val,
            Obj:Obj,
            sign: 'transportType'
          })
        }
      },
    }
  };

</script>

<style scoped>

</style>
