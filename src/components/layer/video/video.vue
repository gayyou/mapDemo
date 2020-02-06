<template>
  <div class="video-container">
    <div class="arrow-container" @click="closeVideoLayer">
      <img src="../../../assets/icons/close.png" alt="">
    </div>/api
    <video src="" id="demo-video" controls></video>
  </div>
</template>

<script>
export default {
  mounted() {
    $('#demo-video').trigger('play');
  },
  methods: {
    closeVideoLayer() {
      this.$store.state.showVideo = false;
      $('#demo-video').trigger('pause');
    }
  }
}
</script>

<style lang="scss" scoped>
.video-container {
  position: relative;
  width: 100%;
  height: 100%;
  background-color: rgba($color: #ffffff, $alpha: 0.7);

  .arrow-container {
    position: absolute;
    z-index: 111;
    cursor: pointer;
    width: 75px;
    height: 75px;
    right: 0.2rem;
    top: 0.2rem;

    img {
      width: 100%;
      height: 100%;
    }
  }

  video {
    width: 100%;
    height: 100%;
  }
}
</style>
