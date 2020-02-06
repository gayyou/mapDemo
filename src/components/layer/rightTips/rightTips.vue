<style lang="scss" scoped>
.right-tip {
  position: absolute;
  z-index: 998;
  top: 1.5rem;
  width: 2rem;
  right: -2.2rem;
  border-top-left-radius: 12px;
  border-bottom-left-radius: 12px;
  background-color: #fff;
  box-shadow: 0 0 2px 0 rgba($color: #000000, $alpha: .3);
  padding: .1rem .1rem;
  transition: .75s all ease;

  span {
    font-size: 16px;
  }
}
.tip-active {
  right: 0;
}
.tip-normal {
  right: -2.2rem;
}
</style>

<template>
  <div class="right-tip" :class="isAnimate ? 'tip-active' : 'tip-normal'">
    <span>{{ $store.state.rightTipMes }}</span>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isAnimate: true
    }
  },
  mounted() {
    setTimeout(() => {
      this.$data.isAnimate = true;
      setTimeout(() => {
        if (!this.$store.state.noCloseRight) {
          this.$data.isAnimate = false;
          setTimeout(() => {
            this.$store.state.showRightTip = false;
          }, 751);
        }
      }, 4500);
    }, 10);
  }
}
</script>
