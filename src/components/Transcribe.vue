<template>
    <div class="container">
        <div class="header">
            <p>
                <span>
                    <v-icon color="purple">queue_music</v-icon>
                </span>MusicTheory.ai
            </p>
        </div>
        <div class="player">
            <p id="loading">Loading Model..</p>
            <div id="loaded">
                <div class="introduction" :style="introductionHandler">
                    <p>Upload an audio file and it will show up here!</p>
                    <!-- <v-btn
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
                    <v-btn round depressed color="primary">Record Audio</v-btn>-->
                    <v-btn outline large fab color="primary" class="uploadButton">
                        <v-icon>add</v-icon>
                        <div class="inputWrapper">
                            <input type="file" id="file-input" title=" ">
                        </div>
                    </v-btn>
                </div>
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
    .header {
        text-align: center;
        height: 80px;
        padding: 15px;
        p {
            font-size: 20px;
            margin-top: 8px;
            i {
                font-size: 28px;
            }
        }
    }
    .player {
        background: #2a3942;
        width: 100%;
        height: 300px;
        padding: 40px 0;
        #loading {
            text-align: center;
        }
        #loaded {
            text-align: center;
            display: none;
            div,
            p {
                // display: inline-block;
                margin: 20px;
            }
            .introduction {
                text-align: center;
                font-size: 20px;
                width: 60%;
                margin: auto;
                font-weight: 300;
                .uploadButton {
                    i {
                        font-size: 40px;
                        margin-top: -20px;
                    }
                    .inputWrapper {
                        width: 72px;
                        height: 72px;
                        margin-top: -35px;
                        margin-left: 0px;
                        border-radius: 50%;
                        display: block;
                        z-index: 2;
                        input[type="file"] {
                            margin-top: 0px;
                            margin-left: -35px;
                            opacity: 0;
                            width: 100%;
                            height: 100%;
                            position: absolute;
                            color: transparent;
                            font-size: 0;
                            &:hover {
                                cursor: pointer;
                            }
                        }
                    }
                }
            }
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
}
</style>
