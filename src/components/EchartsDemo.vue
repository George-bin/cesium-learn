<template>
  <div class="echarts-component">
    <header class="base-info">
      <p class="base-info-item">
        <span class="label">当前地区:</span>
        <span class="value">北京地区（共35家）</span>
      </p>
      <p class="base-info-item">
        <span class="label">会员单位:</span>
        <span class="value">23家</span>
      </p>
      <p class="base-info-item">
        <span class="label">理事单位:</span>
        <span class="value">12家</span>
      </p>
    </header>
  </div>
</template>

<script>
export default {
  data() {
    return {}
  }
}
</script>

<style lang="scss">
.echarts-component {
  width: 20vw;
  .base-info {
    padding: 10px;
    font-size: 14px;
    color: white;
    background: rgba(0,0,0,0.4);
    border-radius: 4px;
    .base-info-item {
      display: flex;
      .label {
        margin-right: 10px;
      }
    }
  }
}
</style>