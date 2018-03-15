<template>
    <div>
      <el-transfer class="transfeialign" v-model="value1" :data="data"
                   @change="handleChange"
                   :titles="['所有人员', '所选人员']"
                   :props="{key: 'userId',label: 'userName'}"
                   filter-placeholder="请输入名字拼音"
                   filterable
                   :filter-method="filterMethod">
      </el-transfer>
    </div>
</template>
<script>
  import ElDialog from "../../../../node_modules/element-ui/packages/dialog/src/component";
  import ElButton from "../../../../node_modules/element-ui/packages/button/src/button";
  import { mapState,mapMutations,mapGetters,mapActions } from 'vuex'

  export default{
    components: {
      ElButton,
      ElDialog},

    data(){
			return {
          data:[],
          value1: [],
           filterMethod(query, item) {
          return item.userName.indexOf(query) > -1;
        }
			}
		},
    props:['isopen','typeName'],
		mounted: function () {
			this.getList();
      this.value1=[];
      this.selectedArr.forEach(item=>{
        this.value1.push(item.userId)
      })
		},
    computed:{
      ...mapState(["selectedArr"])
    },
    watch: {
      'selectedArr': {
        handler: function (val) {
          this.value1=[];
          val.forEach(item=>{
            this.value1.push(item.userId)
          })
        },
        deep: true,
      },
    },
		methods: {
      handleChange(value, direction, movedKeys){
    		//console.log('555=='+this.value1)
      	var obj={};
      	obj.value=value;
        obj.direction=direction;
        obj.movedKeys=movedKeys;
        this.$emit('childValue',obj)
        console.log('666 %0==',this.data);
        console.log('999 %0==',value );
        console.log('888 %0==',direction );
        console.log( '777 %0==',movedKeys);
      },
      getList(){
      	this.httpGet('productUserGroup/getCompUserInfo').then(res=>{
          this.data=res.data;
        })
			}
		}
	}

</script>

<style scoped>
.transfeialign{
  text-align: center!important;
}
 .transfeialign .el-transfer-panel__item{
     text-align: left!important;
 }
</style>
