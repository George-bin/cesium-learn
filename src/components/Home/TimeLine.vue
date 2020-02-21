<template>
  <div class="time-line-component">
    <h2>雷达回波</h2>
    <p class="time">{{activeTimeLine}}</p>
  </div>
</template>

<script>
export default {
  props: {
    activeShowModelIndex: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      timelineArr: [
        '2019年8月10日 0时30分',
        '2019年8月10日 0时40分',
        '2019年8月10日 0时50分',
        '2019年8月10日 1时00分',
        '2019年8月10日 1时10分',
        '2019年8月10日 1时20分',
        '2019年8月10日 1时30分',
        '2019年8月10日 1时40分',
        '2019年8月10日 1时50分',
        '2019年8月10日 2时00分',
        '2019年8月10日 2时10分',
      ]
    };
  },
  computed: {
    activeTimeLine() {
      return this.timelineArr[this.activeShowModelIndex]
    }
  },
  created() {

  },
  mounted() {

  },
  watch: {

  },
  methods: {

  },
  components: {

  },
};
</script>

<style lang="scss">
.time-line-component {
  position: fixed;
  left: 50%;
  top: 40px;
  transform: translateX(-50%);
  color: white;
  text-align: center;
  h2 {
    font-size: 24px;
    font-weight: normal;
  }
  .time {
    margin-top: 10px;
    font-size: 18px;
  }
}
</style>
