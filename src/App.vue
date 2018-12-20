<template>
  <div id="app">
    <HelloWorld msg="Welcome to Your Vue.js App"/>
    <h1>Image classification using MobileNet</h1>
    <p>
      The MobileNet model labeled this as
      <span id="result">...</span> with a confidence of
      <span id="probability">...</span>
    </p>
    <img
      crossorigin="anonymous"
      src="https://ml5js.org/docs/assets/img/bird.jpg"
      id="image"
      width="400"
    >
  </div>
</template>

<script>
/*IDEAS
Voice Transcription
Image Recognition:
-Chemistry/Physics (elements, velocity of collision)
-Show and TEll (modeldepot) **
-Image colorization (modeldepot) **
-Emotion Classification
*/
import HelloWorld from "./components/HelloWorld.vue";

export default {
  name: "app",
  components: {
    HelloWorld
  },
  mounted: () => {
    const image = document.getElementById("image");
    // The result tag in the HTML;
    const result = document.getElementById("result");
    // The probability tag in the HTML;
    const probability = document.getElementById("probability");

    // Initialize the Image Classifier method with MobileNet;
    const classifier = ml5.imageClassifier("MobileNet", function() {
      console.log("Model Loaded!");
    });

    // Make a prediction with the selected image;
    // This will return an array with a default of 10 options with their probabilities;
    classifier.predict(image, function(err, results) {
      result.innerText = results[0].className;
      probability.innerText = results[0].probability.toFixed(4);
    });
  }
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
