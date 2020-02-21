<template>
  <div class="clip-plane-component">
    <div class="clip-plane-tap">
      <nav class="clip-plane-tap-nav">
        <span
          :class="{ 'active-tab_item': active === 'lengthways' }"
          @click="hanldeSelectPlane('lengthways')"
        >纵向裁切</span>
        <span
          :class="{ 'active-tab_item': active === 'level' }"
          @click="hanldeSelectPlane('level')"
        >水平裁切</span>
        <span
          :class="{ 'active-tab_item': active === 'timeline' }"
          @click="hanldeSelectPlane('timeline')"
        >时间轴</span>
      </nav>
      <!-- 纵向裁切 -->
      <div v-if="active === 'lengthways'" class="clip-plane-tap-item">
        <el-slider
          v-model="clipValueZ"
          @input="handleClipZInput"
          @change="$emit('initEnableInputs')"
        ></el-slider>
      </div>
      <!-- 水平裁切 -->
      <div v-else-if="active === 'level'" class="clip-plane-tap-item">
        <el-slider
          v-model="clipValueX"
          @input="handleClipXInput"
          @change="$emit('initEnableInputs')"
        ></el-slider>
        <el-slider
          v-model="clipValueY"
          @input="handleClipYInput"
          @change="$emit('initEnableInputs')"
        ></el-slider>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    clipZ: {
      type: Number,
      default: function() {
        return 0;
      }
    },
    clipX: {
      type: Number,
      default: function() {
        return 0;
      }
    },
    clipY: {
      type: Number,
      default: function() {
        return 0;
      }
    }
  },
  data() {
    return {
      active: "lengthways",
      clipValueZ: 0,
      clipValueX: 0,
      clipValueY: 0
    };
  },
  methods: {
    handleClipZInput(e) {
      // console.log('纵向裁切', e)
      this.$emit("update:clipZ", e);
    },
    handleClipXInput(e) {
      // console.log('纵向裁切', e)
      this.$emit("update:clipX", e);
    },
    handleClipYInput(e) {
      // console.log('纵向裁切', e)
      this.$emit("update:clipY", e);
    },
    hanldeSelectPlane(type) {
      if (type === this.active) return;
      if (type === 'lengthways') {
        this.clipValueX = 0;
        this.clipValueY = 0;
        this.$emit("update:clipX", 0);
        this.$emit("update:clipY", 0);
      } else if (type === 'level') {
        this.clipValueZ = 0;
        this.$emit("update:clipZ", 0);
      } else {
        this.clipValueX = 0;
        this.clipValueY = 0;
        this.clipValueZ = 0;
        this.$emit("update:clipZ", 0);
        this.$emit("update:clipX", 0);
        this.$emit("update:clipY", 0);
      }
      this.active = type;
      this.$nextTick(() => {
        this.$emit("updateSelectedPlane", type);
      })
    }
  }
};
</script>

<style lang="scss">
.clip-plane-component {
  position: fixed;
  left: 10px;
  top: 10px;
  .clip-plane-tap {
    padding: 10px;
    background: rgba(255, 255, 255, 0.5);
    border-radius: 4px;
    .clip-plane-tap-nav {
      font-size: 14px;
      span {
        display: inline-block;
        width: 80px;
        height: 30px;
        line-height: 30px;
        text-align: center;
        cursor: pointer;
      }
      .active-tab_item {
        // padding: 10px;
        border-bottom: 2px solid #409eff;
      }
    }
    .clip-plane-tap-item {
      h4 {
        font-size: 14px;
        font-weight: normal;
      }
    }
  }
}
</style>
