<template>
  <div class="prompt-container" :class="$data.isAnimate ? 'prompt-active' : ''">
    <div class="prompt-head">
      <span>message</span>
    </div>
    <div class="prompt-value">
      <span>{{ $store.state.confirmMes }}</span>
    </div>
    <div class="prompt-choice">
      <button class="prompt-cancel" @click="cancelOperate">No</button>
      <button class="prompt-confirm" @click="confirmOperate">Yes</button>
    </div>
  </div>
</template>

<script>
import PubSub from 'pubsub-js'
export default {
  data() {
    return {
      isAnimate: false
    }
  },
  mounted() {
    setTimeout(() => {
      this.$data.isAnimate = true;
    }, 10);
  },
  methods: {
    cancelOperate() {
      this.$store.state.showConfirm = false;
      this.$data.isAnimate = false;
      PubSub.publish('confirmChart', {
        confirm: false,
        cancel: true
      })
    },
    confirmOperate() {
      this.$store.state.showConfirm = false;
      this.$data.isAnimate = false;
      PubSub.publish('confirmChart', {
        confirm: true,
        cancel: false
      })
    }
  },
}
</script>

<style lang="scss" scoped>
$prompt-prefix: "prompt";

%flex-center {
  display: flex;
  justify-content: center;
  align-items: center;
}
%clear-both::after {
  content: "";
  clear: both;
  display: block;
}

$themeColor: #0060e6;

.#{ $prompt-prefix } {
  &-container {
    @extend %clear-both;

    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%) translateY(-100%);
    width: 7rem;
    min-height: 2.6rem;
    border-radius: 0.12rem;
    background-color: #fff;
    transition: top .75s ease-out;
    border: 1px solid rgba($color: #000000, $alpha: .3);
  }

  &-head {
    @extend %flex-center;

    position: relative;
    width: 100%;
    height: 0.8rem;

    >span {
      display: block;
      font-family: 'HYZhuZiMuTouRen';
      font-size: 34px;
      color: $themeColor;
      letter-spacing: 0.04rem;
    }

    
  }

  &-value {
    @extend %flex-center;
    @extend %clear-both;
    width: 100%;
    min-height: 1rem;

    >span {
      font-size: 20px;
      width: 80%;
      min-height: 100%;
      // min-height: 0.45rem;
    }

    >span::after {
      content: "";
      display: block;
      clear: both;
    }
  }
  
  &-choice {
    @extend %flex-center;

    width: 100%;
    margin-top: 0.1rem;
    margin-bottom: 0.1rem;

    button {
      width: 1.5rem;
      min-height: 0.45rem;
      margin: 5px 0.2rem;
      border-radius: 0.36rem;
    }
  }

  &-choice::after {
    content: "";
    clear: both;
    display: block;
  }

  &-cancel {
    background-color: #fff;
    border: 0.5px solid rgba($color: #000, $alpha: .3);
  }

  &-confirm {
    background-color: $themeColor;
    color: #fff;
  }

  &-confirm:hover {
    background-color: rgba($color: #0060e6, $alpha: .8)
  }

  &-active {
    top: 40%!important;
  }
}

</style>
