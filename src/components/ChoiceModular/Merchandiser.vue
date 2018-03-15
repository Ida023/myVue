<template>
  <div>
    <el-select  placeholder="请选择" v-model="options" clearable filterable :disabled="dis">
      <el-option
        v-for="item in msg"
        :key="item.userId"
        :label="item.userName"
        :value="item.userId"
        :disabled="dis"
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
    props:['disState','Selected','selectType'],
    components: {
      ElCol,
      ElRow},
    data() {
      return {
        props:{
          value:'userId',
          label:'userName',
        },
        dataModel: [],
        msg:[],
        options:'',
        submit: {
          options: []
        },
        dis:false,
      };
    },
    mounted () {
      this.getClassifyList();
    },
    methods: {
      getClassifyList(){
        this.httpPost('productUserGroup/getList?groupName='+'跟单人员').then(res => {
          console.log(res)
          this.msg=res.data;
          this.options=this.Selected;
          this.dis = this.disState;
        })
      },
    },
    watch: {
      'options':{
        handler(val){
          this.$emit('assignment',{
            value:val,
            type:this.selectType
          })
        }
      },
      'Selected':{
        handler(val){
          this.options = val;
        }
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

</style>
