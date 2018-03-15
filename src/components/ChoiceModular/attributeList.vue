<template>
  <div>
    <div class="block" v-for="(item,index) in msg">
      <el-row >
        <el-col :span="10">
            <span >{{ item.attributeParentName}}</span>
        </el-col>
        <el-col :span="14">
          <el-select  placeholder="小特殊属性" v-model="value[index]" clearable filterable :disabled="dis" >
            <el-option
              v-for="item in item.sonList"
              :key="item.attributeId"
              :label="item.cnName"
              :value="item.attributeId"
            >
            </el-option>
          </el-select>
        </el-col>
      </el-row>
    </div>
  </div>


</template>

<script>
  export default {
    props:['disState','Selected'],
    data() {
      return {
        props:{
          value:'attributeId',
          label:'cnName',
        },
        msg:[],
        value:[],
        dis:false,

      };
    },
    mounted () {
      this.getClassifyList();
    },
    methods: {
      getClassifyList(){
        this.httpGet('/product/queryAllAttribute','','Scm').then(res => {
          console.log(res)
          this.msg=res.data
          this.dis = this.disState;
        })
      },
    },
    watch: {
      'value':{
        handler(val){
            console.log(val)
          this.$emit('assignment',{
              value:val
          })

        },
        deep: true
      },
      'Selected':{
        handler(val){
            console.log(val)
            console.log(1111111111111111)
            console.log(typeof(val))
            console.log('子组件')
          this.value = val;
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
.block{
  margin-bottom:5px;
}
</style>
