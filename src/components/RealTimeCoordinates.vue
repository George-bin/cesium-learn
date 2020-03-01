<template>
  <div class="real-time-coordinates-component">
    <p>
      <span class="label">经度:</span>
      <span class="value">{{realTimeCoordinates.lng}}</span>
    </p>
    <p>
      <span class="label">纬度:</span>
      <span class="value">{{realTimeCoordinates.lat}}</span>
    </p>
    <p>
      <span class="label">视高:</span>
      <span class="value">{{realTimeCoordinates.height}}</span>
    </p>
  </div>
</template>

<script>
export default {
  name: "",
  props: {
    realTimeCoordinates: {
      type: Object,
      default: function() {
        return {}
      }
    }
  },
  components: {},
  data() {
    return {}
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {}
}
</script>

<style lang="scss">
.real-time-coordinates-component {
  position: fixed;
  bottom: 35px;
  right: 8px;
  width: 120px;
  padding: 5px 10px;
  font-size: 12px;
  color: #edffff;
  background: rgba(68, 68, 68, 0.4);
  border-radius: 4px;
  p {
    display: flex;
    align-items: center;
    height: 34px;
    .value {
      flex: 1;
      margin-left: 10px;
      padding: 4px;
      border: 1px solid #444;
      background: #303336;
      border-radius: 4px;
    }
  }
}
</style>
