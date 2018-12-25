<template>
    <div class="container">
        <div class="header">
            <!-- <input id="file-input" type="file"> -->
            <p id="loading">Loading Model..</p>
            <div id="loaded">
                <v-btn
                    depressed
                    round
                    color="primary"
                    :loading="this.uploadLoading"
                    :disabled="this.uploadLoading"
                    class="uploadButton"
                >
                    Upload File
                    <span slot="loader">Loading...</span>
                    <input type="file" id="file-input">
                </v-btn>
                <p>or</p>
                <v-btn round depressed color="primary">Record Audio</v-btn>
            </div>
        </div>
        <div class="player">
            <div class="introduction" :style="introductionHandler">
                <p>This app uses neural networks run through the browser for all of its functionality. Upload a file of a music piece to get started.</p>
            </div>
            <div class="visualizerLoader" :style="loadHandler">
                <!-- <v-progress-circular
                    class="visualizerLoadingCircle"
                    :size="70"
                    :width="7"
                    color="#a53a45"
                    indeterminate
                ></v-progress-circular>-->
                <v-progress-circular class="visualizerLoadingCircle" indeterminate color="primary"></v-progress-circular>
                <p>
                    Transcribing
                    <span class="fileName">{{fileName}}</span>...
                    <br>
                    <span
                        class="cpuWarning"
                    >Larger files will take longer to transcribe, and may slow down your browser.</span>
                </p>
            </div>
            <canvas id="canvas"></canvas>
        </div>
    </div>
</template>

<script>
export default {
    name: "Transcribe",
    data() {
        return {
            modelReady: false,
            model: null,
            uploadLoading: false,
            loadHandler: "display: none",
            introductionHandler: "",
            fileName: "",
            loader: null,
            visualizer: null,
            player: null
        };
    },
    mounted: function() {
        this.model = new mm.OnsetsAndFrames(
            "https://storage.googleapis.com/magentadata/js/checkpoints/transcription/onsets_frames_uni"
        );
        this.model.initialize().then(() => {
            this.modelReady = true;
            this.initUI();
        });
    },
    methods: {
        initUI() {
            document.getElementById("loading").style.display = "none";
            document.getElementById("loaded").style.display = "block";

            const fileInput = document.getElementById("file-input");
            fileInput.addEventListener("change", e => {
                this.transcribeFile(e.target.files[0]);
                this.fileName = e.target.files[0].name;
            });
        },
        async transcribeFile(file) {
            const config = {
                noteHeight: 8,
                pixelsPerTimeStep: 20, // like a note width
                noteSpacing: 10,
                noteRGB: "234, 234, 236",
                activeNoteRGB: "240, 84, 119"
            };
            this.uploadLoading = !this.uploadLoading;
            this.introductionHandler = "display: none";
            this.loadHandler = "display: block";
            await this.model
                .transcribeFromAudioFile(file)
                .then(noteSequence => {
                    this.visualizer = new mm.Visualizer(
                        noteSequence,
                        document.getElementById("canvas"),
                        config
                    );
                    this.loadHandler = "display: none";
                    this.uploadLoading = !this.uploadLoading;
                });
        },
        playNotes() {
            this.player = new mm.Player(false, {
                run: note => this.visualizer.redraw(note),
                stop: () => {
                    console.log("done");
                }
            });
        }
    }
};
</script>

<style lang="scss" scoped>
.container {
    background: #22313a;
    margin-top: 50px;
    width: 1000px;
    border-radius: 15px;
    padding: 0;
    .player {
        background: #2a3942;
        width: 100%;
        height: 300px;
        padding: 40px 0;
        .introduction {
            text-align: center;
            font-size: 20px;
            width: 60%;
            margin: auto;
            font-weight: 300;
        }
        .visualizerLoader {
            text-align: center;
            .visualizerLoadingCircle {
                margin-top: 20px;
            }
            p {
                font-size: 19px;
                margin-top: 30px;
                font-weight: 300;
                .fileName {
                    color: #8c363f;
                    color: #952aa3;
                }
                .cpuWarning {
                    font-size: 17px;
                    opacity: 0.7;
                }
            }
        }
        #canvas {
            display: block;
            width: 90% !important;
            height: 100% !important;
            margin: auto;
        }
    }
    .header {
        text-align: center;
        height: 100px;
        padding: 15px;
        #loaded {
            display: none;
            div,
            p {
                display: inline-block;
                margin: 20px;
            }
            .uploadButton {
                // padding: 0;
                // margin: 0;
                #file-input {
                    padding: 18px 60px;
                    width: 100%;
                    height: 100%;
                    position: absolute;
                    opacity: 0;
                    // color: rgb(87, 52, 55)
                    &:hover {
                        cursor: pointer;
                    }
                }
            }
        }
    }
}
</style>
