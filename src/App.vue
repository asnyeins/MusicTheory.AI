<template>
    <div id="app">
        <v-app class="vueWrap" dark>
            <Transcribe/>
        </v-app>
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
@import url("https://fonts.googleapis.com/css?family=Open+Sans:300,400,600");
@import url("https://fonts.googleapis.com/css?family=Poppins:100,200,300,400,500");

html,
body,
.application {
    height: 100%;
    font-family: "Poppins", sans-serif !important;
}
#app {
    background: #192329;
    height: 100%;
    position: relative;
    overflow: hidden;
}
</style>
