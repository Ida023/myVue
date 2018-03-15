<template>
    <div id="">
      <el-row>
        <el-col :span="4">
          <el-menu v-show="!collapsed" class="el-menu-vertical-demo el-menu-show " theme="dark" router :default-active="$route.path">
          <el-submenu v-for="listurl in msg " :index="listurl.grpId" :key="listurl.grpId" >
          <template slot="title"><i class="el-icon-message"></i>{{ listurl.grpName }}</template>
          <el-menu-item v-for="listurl in listurl.groupMenuList" :index="listurl.menuUrl" :key="listurl.menuUrl">
          <i :class="listurl.menuIconClass"></i>{{ listurl.menuName }}
          </el-menu-item>
          </el-submenu>
          </el-menu>
        </el-col>
        <el-col :span="20">
          <router-view></router-view>
        </el-col>
      </el-row>

    </div>
</template>

<script>


</script>

<style scoped>

</style>
