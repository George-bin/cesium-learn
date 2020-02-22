<template>
  <div class="home-component">
    <h2>案例列表</h2>
    <ul class="example-list">
      <li
        v-for="item in navList"
        :key="item.path"
        class="example-item"
        @click="$router.push(item.path)">
        {{item.label}}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "",
  props: {},
  components: {},
  data() {
    return {
      navList: [
        {
          path: '/introduction',
          label: '空间数据可视化',
        },
        {
          path: '/imageryProvider',
          label: '影像图层'
        },
        {
          path: '/terrian',
          label: '地形图层'
        },
        {
          path: '/camera',
          label: '相机'
        },
        {
          path: '/gltf',
          label: 'gltf裁切'
        },
        {
          path: '/geometry',
          label: 'Geometry'
        }
      ]
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {}
}
</script>

<style lang="scss">
.home-component {
  width: 920px;
  padding: 20px 40px;
  margin: 0 auto;
  .example-list {
    display: flex;
    flex-wrap: wrap;
    .example-item {
      width: 50%;
      margin-top: 20px;
    }
  }
}
</style>
