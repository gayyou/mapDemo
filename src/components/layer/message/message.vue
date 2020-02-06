<template>
  <div class="prompt-container" :class="$data.isAnimate ? 'prompt-active' : ''">
    <div class="prompt-head">
      <span>message</span>
    </div>
    <div class="prompt-value">
      <span>{{ $store.state.message }}</span>
    </div>
    <div class="prompt-choice">
      <button class="prompt-confirm" @click="isRead">confirm</button>
    </div>
  </div>
</template>

<script>
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
    isRead(event) {
      this.$store.state.showMessage = false;
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

$themeColor: #0060e6;

.#{ $prompt-prefix } {
  &-container {
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%) translateY(-100%);
    width: 7rem;
    height: 2.6rem;
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
      font-size: 34px;
      color: $themeColor;
      letter-spacing: 0.04rem;
    }
  }

  &-value {
    @extend %flex-center;

    width: 100%;
    height: 1rem;

    >span {
      font-size: 20px;
      width: 80%;
      height: 100%;
    }
  }
  
  &-choice {
    @extend %flex-center;

    width: 100%;

    button {
      width: 1.5rem;
      height: 0.45rem;
      margin: 5px 10px;
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
