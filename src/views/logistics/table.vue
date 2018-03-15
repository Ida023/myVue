<template>
    <div id="">
      <el-table :data="parcelData" border tooltip-effect="dark" style="width: 100%" :stripe="false"  >
        <el-table-column type="selection" width="55" align="center"></el-table-column>
        <el-table-column sortable width="" label="波次ID"   align="center"  >
          <template scope="scope">
            {{ scope.row.data2 }}
          </template>
        </el-table-column>
        <el-table-column sortable width="" label="1111"   align="center"  >
          <template scope="scope">
              <div class="simulation" v-for="(item,index) in scope.row.infos" :id="'simulation' +'-'  + scope.$index +'/' + index">
                <div class="childDiv">
                  <span>{{ item.data1 }}</span><br/>
                  <span>{{ item.data1 }}</span>
                </div>
              </div>
          </template>
        </el-table-column>
        <el-table-column sortable width="" label="波2222次ID"   align="center"  >
          <template scope="scope">
            <div class="simulation" v-for="(item,index) in scope.row.infos" :id="'simulation' +'-'  + scope.$index +'/' + index">
              <div class="childDiv">
                <div class="simulations" v-for="(items,index) in item.infoss" :id="'simulation' +'-'  + scope.$index +'/' + index + '.'+index">
                  {{ items.data2 }}<br/>
                </div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column sortable width="" label="波33333次ID"   align="center"  >
          <template scope="scope">
            <div class="simulation" v-for="(item,index) in scope.row.infos" :id="'simulation' +'-'  + scope.$index +'/' + index">
              <div class="simulations" v-for="(items,index) in item.infoss" :id="'simulation' +'-'  + scope.$index +'/' + index + '.'+index">
                  {{ items.data1 }}<br/>
                </div>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <el-button @click="CalculationHeight">99999999999999</el-button>
      <el-table :data="parcelData" border tooltip-effect="dark" style="width: 100%" :stripe="false"  >
        <el-table-column type="selection" width="55" align="center"></el-table-column>
        <el-table-column sortable width="" label="波次ID"   align="center"  >
          <template scope="scope">
            {{ scope.row.data2 }}
          </template>
        </el-table-column>
        <el-table-column sortable width="" label="1111"   align="center"  >
          <template scope="scope">
            <div class="div1s" v-for="(item,index) in scope.row.infos" :id="'simulation' +'-'  + scope.$index +'/' + index">
                <span>{{ item.data1 }}</span><br/>
                <span>{{ item.data1 }}</span>
              </div>
          </template>
        </el-table-column>
        <el-table-column sortable width="" label="波2222次ID"   align="center"  >
          <template scope="scope">
            <div class="div1s" v-for="(item,index) in scope.row.infos" :id="'simulation' +'-'  + scope.$index +'/' + index">
              <div class="div2s" v-for="(items,index) in item.infoss" :id="'simulation' +'-'  + scope.$index +'/' + index + '.'+index">
                  {{ items.data2 }}<br/>
                </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column sortable width="" label="波33333次ID"   align="center"  >
          <template scope="scope">
            <div class="div1s" v-for="(item,index) in scope.row.infos" :id="'simulation' +'-'  + scope.$index +'/' + index">
              <div class="div2s" v-for="(items,index) in item.infoss" :id="'simulation' +'-'  + scope.$index +'/' + index + '.'+index">
                {{ items.data1 }}<br/>
              </div>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
</template>

<script>
  import ElButton from "../../../node_modules/element-ui/packages/button/src/button";
  export default{
    components: {
      ElButton

    },
    data(){
      return {
        parcelData:[]
      }
    },
    computed:{

    },
    mounted: function () {
      this.getList();

      setTimeout(()=>{
        this.CalculationHeight();
      },300)
    },
    methods: {
      CalculationHeight:function () {//合并表格 小行统一高度。
        let objList=document.getElementsByClassName('simulation');
        let heights=[];
        for(let i=0;i<objList.length;i++) {
          let childNodeObj=objList[i].childNodes;
          let objCell = objList[i];
          let objId = objCell.id;
          let subName = objId.substring(objId.indexOf('-') + 1).split('/');
          let group = subName[0];
          let groupRow = subName[1];

          if (heights.length < group + 1) {
            this.$set(heights, group, []);
          }
          setTimeout(() => {
            if (heights[group].length < groupRow + 1) {
              this.$set(heights[group], groupRow, 0);
            }
          }, 20);
          setTimeout(() => {
            if (heights[group][groupRow] < objCell.offsetHeight) {
              this.$set(heights[group], groupRow, objCell.offsetHeight);
            }
          }, 80);
          setTimeout(()=>{
            for(let p=0; p<childNodeObj.length; p++){
              let childNodeId=childNodeObj[p].id;
              let childNodeKeys=childNodeId.substring(childNodeId.indexOf('/') + 1).split('.');
              let childNodeKey=childNodeKeys[0];
            console.log(childNodeKey)
              console.log(988888);
                this.$set(heights[group][groupRow], childNodeKey, 0);
              console.log(heights)
            }
          },200)
        }

        let List=[
          {group:[
            {groupRow:[
              {groupRowSon:[

              ]}
            ]}
          ]}
        ]
        setTimeout(()=>{//设置最大高度和 子元素的 -top 值；
          for (let m = 0; m < heights.length; m++) {
            for (let n = 0; n < heights[m].length; n++) {
              for (let k = 0; k < objList.length; k++) {
                if (objList[k].id == 'simulation-' + m + '/' + n) {
                  objList[k].style.height = (heights[m][n]) + 'px';
                  let child = objList[k].childNodes[0];
                  child.style.marginTop = -(child.offsetHeight/2)+'px';
//                  console.log(child.offsetHeight)
                }
              }
            }
          }
        },200)
      },
        getList:function () {
          this.$http.get('static/ss.json').then(res=>{
           this.parcelData=res.data.listData;
           });
        }
    }
  }

</script>

<style scoped>
  .simulation{
    border-bottom: 1px solid red;
    margin-left: -18px !important;
    margin-right: -18px !important;
    padding: 1px 1px 0 1px !important;
    /*min-height: 184px;*/
    position: relative;
  }
  .div1s{
    border-bottom: 1px solid red;
    margin-left: -18px !important;
    margin-right: -18px !important;
    padding: 1px 1px 0 1px !important;
    min-height: 204px;
    position: relative;
    margin-top:10px;
  }
  .div2s{
    border-bottom: 1px solid red;
    margin-left: -18px !important;
    margin-right: -18px !important;
    padding: 1px 1px 0 1px !important;
    min-height: 90px;
    position: relative;
    margin-top:10px;
  }
  .simulations{
    border-bottom: 1px solid black;
    margin-left: -18px !important;
    margin-right: -18px !important;
    padding: 1px 1px 0 1px !important;
    /*min-height: 90px;*/
    position: relative;
  }
  .updSea{
    margin-bottom: 10px;
  }
  .research_btn{
    padding:9px 12px;
    margin-left: 20px;
  }
  .span_label{
    margin-right: 20px;
  }
  .inputstyle{
    padding-left: 4px;
  }
  .supplier_btn{
    padding:10px 0;
    border-bottom:solid 1px #e4e4e4;
  }
  .tatestyle{
    display: block;
    line-height: 41px;
    /*text-align: center;*/
    padding-left: 20px;
    min-height: 41px;
    border-right: 1px solid #e4e4e4
  }
  .stateDiv{
    margin-bottom: 5px;
  }
  .SkuStyle{
    color: #20a0ff;
    margin-left: 20px;
  }
  .SkuStyle:hover{
    cursor: pointer;
  }
</style>
