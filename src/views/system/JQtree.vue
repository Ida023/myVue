<template>
  <div id="outermost_wrap">
    <!-- <ggg :msg='msg'></ggg>-->

    <li :class="[isButton, hasBorder]" style="list-style:none;">
  <span @click="toggle" v-show="model.menuLevel!==1" class="spanFloat">
   <i v-if="isFolder" class="icon" :class="[open ? 'icon-jiantou-down': 'icon-jiantouzuoshuang-']" style="margin-bottom: 3px;"></i>
   <i v-if="!isFolder" class="icon file-text"></i>
   <input type="checkbox" class="checkCls" @click.stop="selTree(model)" :id="'menu'+model.id" :class="'group'+label">
   {{ model.menuName }}
  </span>
      <ul v-show="open" v-if="isFolder" class="ParallelUl">
        <tree-menu v-for="(item, index) in model.childNode" :model="item" :key="index" :menuList="menuList"
                   :label="label" :selectKeys="selectKeys"></tree-menu>
      </ul>
    </li>
    <!-- <el-checkbox-group v-for="item in data" :key="item">
       <el-checkbox  style="margin: 5px;"  v-for="list in item.salesUserList"  :label="list.userId" :key='list.userId' >{{list.userName}}<br></el-checkbox >
       <checkbox :data="item.salesUserList"></checkbox>
     </el-checkbox-group>-->
  </div>
</template>
<script>
  import $ from 'jquery'
  export default{
    name: 'treeMenu',
    props: ['model', 'menuList', 'label', 'selectKeys'],
    data(){
      return {
        open: true, // 默认打开彩单树
        selAllkeys: [],
        msg:[{
          text:1,
          flag:false,
          next:[{
            text:'1-1',
            flag:false,
            next:[{
              text:'1-1-1',
              flag:false,
              next:[{
                text:'1-1-1-1',
                flag:false,
              }]
            }]
          },{
            text:'1-2',
            flag:false,//1-2写在这儿，第二层数据数组中的a[1].text就是‘1-2’
          }]
        },{
          text:2,
          flag:true,
          next:[{
            text:'2-1',
            flag:false,
          }]
        },{
          text:3,
          flag:false,
        }],
        picList: [],
        uploadPic: this.RmsUrl + 'productDevInfo/postProductImage=' + this.sessuserid,   //  上传图片地址
        activeNames: ['1'],
        dialogFlag: {
          isopen: false,
          title: '',
        },
        Options: [
          {label: '1', value: '1'},
          {label: '1', value: '1'},
          {label: '1', value: '1'},
        ],
        Data: [],
        Form: {aa: '', bb: []},
        //分页得到的数据集合
        page: {
          currentPage: 1, //当前页数
          pageSize: 10, //每页条数
          totalCount: 0, //总共条数
          totalPage: 0, //总共页数
        },
        //过滤返回数据
        pagefilters: {
          satus: '',
          whRefId: '',
          currentPage: 1,
          pageSize: 10,
        },
      }
    },
    computed: {
      isFolder: function () {
        return this.model.childNode && this.model.childNode.length
      },
      isButton: function () {
        if (this.model.buttonControl === '1') {
          return 'btnCls'
        } else {
          return 'menuCls'
        }
      },
      hasBorder: function () {
        if (this.model.menuLevel === 1) {
          return 'blk_border'
        }
      }
    },

    methods: {

      getAllKeys () {
        var keys = []
        var objs = $('.group' + this.label + ':checked')
        for (let i = 0; i < objs.length; i++) {
          let id = objs[i].id
          id = id.substring(4)
          keys.push((id - 0)) // 保存选中菜单id
        }
        return keys
      },
      toggle: function () {
        if (this.isFolder) {
          this.open = !this.open
        }
      },
      // 根据id获取menu对象
      getMeunById (id, allMenuList) {
        console.log('allMenuList % 0',allMenuList)
        var menu = {}
        if (allMenuList.id === id) { // 一级菜单
          menu = JSON.parse(JSON.stringify(allMenuList))
        } else if (allMenuList.childNode && allMenuList.childNode.length) { // 二级菜单
          for (let i = 0; i < allMenuList.childNode.length; i++) {
            if (allMenuList.childNode[i].id === id) {
              menu = allMenuList.childNode[i]
              break
            } else if (allMenuList.childNode[i].childNode && allMenuList.childNode[i].childNode.length) { // 三级
              for (let j = 0; j < allMenuList.childNode[i].childNode.length; j++) {
                if (allMenuList.childNode[i].childNode[j].id === id) {
                  menu = allMenuList.childNode[i].childNode[j]
                  break
                }
              }
            }
          }
        }
        return menu
      },
      // checkbox点击事件
      selTree (model) {
        var obj = $('#menu' + model.id)[0] // checkbox DOM对象
        if (obj.checked) {
          console.log('obj % 0==',obj)
          // 选中
          // 若存在下级，下级全部选中
          if (model.childNode && model.childNode.length) {
            this.subMenusOp(model.childNode, 1)
          }
          // 若存在上级,确认是否需要选中上级CheckBox
          if (model.supMenuID !== 0 && model.menuLevel > 2) {
            this.supMenusOp(model.supMenuID, 1)
          }
        } else { // 取消
          // 若存在下级，下级全部取消
          if (model.childNode && model.childNode.length) {
            this.subMenusOp(model.childNode, 0)
          }
          // 若存在上级，确认是否需要取消上级CheckBox
          if (model.supMenuID !== 0 && model.menuLevel > 2) {
            this.supMenusOp(model.supMenuID, 0)
          }
        }
        this.getAllKeys()
      },
      // 下级菜单操作 flag=1为选中,flag=0为取消
      subMenusOp (childNodes, flag) {
        for (let i = 0; i < childNodes.length; i++) {
          console.log('childNodes[i]',childNodes[i]);
          var menu = childNodes[i]
          var id = menu.id
          if (flag === 1) { // 选中
            $('#menu' + id)[0].checked = true
          } else { // 取消
            $('#menu' + id)[0].checked = false
          }
          if (menu.childNode && menu.childNode.length) {
            this.subMenusOp(menu.childNode, flag)
          }
        }
      },
      // 上级菜单操作（选中:flag=1,取消:flag=0）
      supMenusOp (id, flag) {
        var menu = this.getMeunById(id, this.menuList)
        if (menu.childNode && menu.childNode.length) {
          var childLength = menu.childNode.length // 直接子级个数
          var selectCount = 0
          for (let i = 0; i < childLength; i++) {
            let id1 = menu.childNode[i].id
            if ($('#menu' + id1)[0].checked) {
              selectCount++
            }
          }
          if (flag === 1) { // 选中
            if (childLength === selectCount) {
              $('#menu' + id)[0].checked = true
              if (menu.supMenuID !== 0 && menu.menuLevel > 2) {
                this.supMenusOp(menu.supMenuID, flag)
              }
            }
          } else if (flag === 0) {
            if (childLength !== selectCount) {
              $('#menu' + id)[0].checked = false
              if (menu.supMenuID !== 0 && menu.menuLevel > 2) {
                this.supMenusOp(menu.supMenuID, flag)
              }
            }
          }
        }
      },
      // 计算所有下级节点是否全部选中，是返回true，否返回false
      isAllSel (childNodes, selectKeys) {
        var nodeKeys = [] // 选中的id集合
        this.addKeys(childNodes, selectKeys, nodeKeys)
        var allKeys = []
        this.getNodesCount(childNodes, allKeys)
        if (nodeKeys.length === allKeys.length) {
          return true
        } else {
          return false
        }
      },
      // 计算childNodes下选中的id集合
      addKeys (childNodes, selectKeys, Arrs) {
        for (let i = 0; i < childNodes.length; i++) {
          if (selectKeys.indexOf(childNodes[i].id) >= 0) {
            Arrs.push(childNodes[i].id)
          }
          if (childNodes[i].childNode && childNodes[i].childNode.length) {
            this.addKeys(childNodes[i].childNode, selectKeys, Arrs)
          }
        }
      },
      // 计算childNodes的子级数
      getNodesCount (childNodes, allKeys) {
        for (let i = 0; i < childNodes.length; i++) {
          allKeys.push(childNodes[i].id)
          if (childNodes[i].childNode && childNodes[i].childNode.length) {
            this.getNodesCount(childNodes[i].childNode, allKeys)
          }
        }
      }
    },
    mounted () {
      // 禁止复选框的冒泡事件
      $("input[type='checkbox']").click(function (e) {
        // e.stopPropagation()
      })
      // 选中菜单使能
      console.log('modelId',this.model.id)
      console.log('selectKeys',this.selectKeys)
      if (this.selectKeys instanceof Array && this.selectKeys.length > 0 && this.selectKeys.indexOf(this.model.id) >= 0) {
        //alert(this.model.childNode.length)
        //console.log('1',this.model.childNode)
        // console.log('2',this.model.childNode.length)
        // console.log('3', $('#menu' + this.model.id)[0])
        $('#menu' + this.model.id)[0].checked = true;
        /*  if (this.model.childNode && this.model.childNode instanceof Array && this.model.menuLevel !== 1) {// 包含子级,一级菜单除外
         // 计算所有子节点是否全部选中
         $('#menu' + this.model.id)[0].checked = true
         if (this.isAllSel(this.model.childNode, this.selectKeys)) {
         $('#menu' + this.model.id)[0].checked = true
         }
         } else {
         $('#menu' + this.model.id)[0].checked = true
         }*/
      }
    }

    /*  openDialog(val){
     },
     getRequirementList(){
     console.log('msg % 0==',this.msg)
     },
     batchChange(){

     },
     //分页
     changePageSize: function (val) {
     this.pagefilters.pageSize = val;
     this.pagefilters.currentPage = 1;
     this.getRequirementList();
     },
     changeCurrentPage: function (val) {
     this.pagefilters.currentPage = val;
     this.getRequirementList();
     },*/


  }

</script>

<style scoped>
  /*  .ParallelUl {
      width: 150px;
      float: left;
    }*/
  ul.ParallelUl{
  //width: 180px;
    float:left;
    margin:0;
    padding:0;
  }
  span.spanFloat{
    display: inline-block;
    width: 150px;
    float: left;
  }
  .blk_border{
    border:1px solid #d1dbe5;
    padding-bottom: 15px;
  }
  .blk_border ul{
    padding-left: 15px;
  }
  ul {
    list-style: none;
  }
  i.icon {
    display: inline-block;
    width: 15px;
    height: 15px;
    background-repeat: no-repeat;
    vertical-align: middle;
  }
  /* .icon.folder {
     //background-image: url(../../images/close.png);
   }
   .icon.folder-open {
    // background-image: url(../../images/open.png);
   }*/
  .tree-menu li {
    line-height: 1.5;
  }
  li.btnCls {
    float: left;
    margin-right: 10px;
  }
  li.menuCls {
    clear: both;
    line-height:30px;
  }
  .checkCls {
    vertical-align: middle;
  }
  .el-tabs__content{
    color:#48576A;
  }
</style>
