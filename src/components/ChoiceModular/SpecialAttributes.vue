<template>
  <div>
    <div class="block" v-for="(item,index) in msg">
      <el-row >
        <el-col :span="10">
            <span >{{ item.attributeParentName}}</span>
        </el-col>
        <el-col :span="14">
          <el-select  placeholder="小特殊属性" v-model="item.checkValue" clearable filterable :disabled="dis"  @change="change" >
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
  import ElRow from "element-ui/packages/row/src/row";
  import ElCol from "element-ui/packages/col/src/col";
  export default {
    name:'SpecialAttributes',
    props:['disState','Selected'],
    components: {
      ElCol,
      ElRow},
    data() {
      return {
        props:{
          value:'attributeId',
          label:'cnName',
        },
        dataModel: [],
        msg:[],
        options:[],
        submit:{
          options:[]
        },
        dis:false,

      };
    },
    mounted () {
      this.getClassifyList();
//      this.addCheckedData();
    },
    methods: {
      getClassifyList(){
        this.httpGet('/product/queryAllAttribute','','Scm').then(res => {
          console.log(res)
          this.msg=res.data
          this.submit.options=this.Selected;
          this.dis = this.disState;
        })
      },
      change(val){

//        alert(111)
      },
      addCheckedData:function (ids) {
//          alert(996)
          let list =this.msg;// [,1,3,3]
          let list3 = ids;
//          alert('长度'+list3.length)
          setTimeout(()=>{
            for( let i=0; i<this.msg.length; i++){
              this.$set(this.msg[i],"checkValue", '');
              console.log(this.msg)
              for(let j=0;j<this.msg[i].sonList.length;j++){
                if(list3.length!==0){
                  console.log(111)
                  for(let k=0;k<list3.length;k++){
                    if(this.msg[i].sonList[j].attributeId==list3[k]){
//                      list[i].checkValue=list[i].sonList[j].attributeId;
                      this.$set(this.msg[i],"checkValue", this.msg[i].sonList[j].attributeId);
                      break;
                    }
                  }
                }else {
                  console.log(222)
                  this.$set(this.msg[i],"checkValue", '');
                }
              }
              this.options=this.msg;
            }
          },100)

      }
    },
    watch: {
      'options':{
        handler(val){
            console.log(val)
          var checkValueList=[];
          for(let i=0; i<val.length; i++){
                if(val[i].checkValue!==''){
                  checkValueList.push(val[i].checkValue);
                }
          }
//          alert(11)
          this.$emit('assignment',{
            value:checkValueList
          })

        },
        deep: true
      },
      'Selected':{
        handler(val){
            console.log(typeof(val))
            console.log('子组件')
          this.submit.options = val;
//          this.addCheckedData();
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
