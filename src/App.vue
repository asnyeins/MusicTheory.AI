<template>
    <div id="app">
        <Transcribe/>
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
import Transcribe from "./components/Transcribe.vue";

export default {
    name: "app",
    components: {
        Transcribe
    }
};
</script>

<style>
html,
body {
    height: 100%;
}
#app {
    background: #192329;
    height: 100%;
    position: relative;
    overflow: hidden;
}
</style>
