<template>
  <div dropzone>
    <input
      flat
      filled
      chips
      title="Upload image"
      type="file"
      accept="image/*"
      rounded
      :name="name"
      placeholder="Change photo"
      @change="onchange"
    >
    <p>
      <b>Click to add your poster</b>
    </p>
  </div>
</template>
<script>
export default {
  props: {
    name: {
      type: String,
      default: ''
    }
  },
  methods: {
    onchange (e) {
      this.$emit('change', e.target.files[0])
    }
  }
}
</script>
<style scoped>
div {
    border: thin solid #0000001f;
    width: 200px;
    height: 70px;
    background-color: #88888800;
    border-radius: 5px;
    transition: 1s ease-in;
    text-align: center;
    cursor: pointer;
    background-color: #ffffff77;
}

div:hover {
    background-color: #49c5b6;
    border: thin solid #ffffff;
}

p {
    color: #080808;
    cursor: pointer;
    position: relative;
    bottom: 90%;
    display: block;
}

input {
    z-index: 3;
    opacity: 0;
    width: max-content;
    height: 100%;
    cursor: pointer;
}
</style>
