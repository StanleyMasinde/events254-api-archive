<template>
  <h1>Scan tickets</h1>
</template>
<script>
export default {
  mounted () {
    // this.bootScanner()
  },
  methods: {
    bootScanner () {
      // check compatibility
      // console.log('Barcode Detector supported!')

      // create new detector
      // eslint-disable-next-line no-undef
      this.barcodeDetector = new BarcodeDetector({
        formats: ['code_39', 'codabar', 'ean_13']
      })
    }
  }
}
</script>
