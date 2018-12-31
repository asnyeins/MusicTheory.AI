<template>
    <div class="container">
        <div class="header">
            <p>
                <span>
                    <v-icon color="purple">queue_music</v-icon>
                </span>MusicTheory.ai
            </p>
        </div>
        <div
            class="player"
            id="player"
            @mouseover="playerHovered = !playerHovered"
            @mouseout="playerHovered = !playerHovered"
        >
            <div id="loading">
                <div class="musicLoader">
                    <Loader/>
                </div>
                <p>Loading Model..</p>
            </div>

            <div id="loaded">
                <div class="introduction">
                    <p>
                        Upload an
                        <span>audio file</span>
                    </p>
                    <v-btn outline large fab color="primary" class="uploadButton">
                        <v-icon>add</v-icon>
                        <div class="inputWrapper">
                            <input type="file" id="file-input">
                        </div>
                    </v-btn>
                </div>
            </div>

            <div class="visualizerLoader" id="visualizerLoader">
                <p>
                    Transcribing
                    <span class="fileName">{{fileName}}</span>...
                    <br>
                    <span
                        class="cpuWarning"
                    >Larger files will take longer to transcribe, and may slow down your browser.</span>
                </p>
            </div>
            <div class="canvasWrap" id="canvasWrap">
                <canvas id="canvas"></canvas>
                <transition name="fade">
                    <v-btn
                        outline
                        class="playButton"
                        fab
                        dark
                        large
                        color="primary"
                        v-if="playerHovered"
                    >
                        <v-icon dark>play_arrow</v-icon>
                    </v-btn>
                </transition>
            </div>
        </div>
    </div>
</template>

<script>
import Loader from "./Loader";
import { setTimeout } from "timers";

export default {
    name: "Transcribe",
    components: {
        Loader
    },
    data() {
        return {
            modelReady: false,
            model: null,
            fileName: "",
            loader: null,
            visualizer: null,
            player: null,
            playerHovered: false
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
            //Use timeout to smoothen load transition
            setTimeout(() => {
                Velocity(
                    document.getElementById("loading"),
                    { opacity: 0 },
                    { display: "none" }
                );
                setTimeout(() => {
                    Velocity(
                        document.getElementById("loaded"),
                        { opacity: 1 },
                        { display: "block" }
                    );
                }, 550);
            }, 100);

            const fileInput = document.getElementById("file-input");
            fileInput.addEventListener("change", e => {
                this.transcribeFile(e.target.files[0]);
                this.fileName = e.target.files[0].name;
            });
        },
        async transcribeFile(file) {
            const config = {
                noteHeight: 8,
                pixelsPerTimeStep: 5,
                noteSpacing: 1,
                noteRGB: "234, 234, 236",
                activeNoteRGB: "240, 84, 119"
            };
            document.getElementById("loaded").style.display = "none";
            document.getElementById("loaded").style.opacity = "0";
            document.getElementById("visualizerLoader").style.display = "block";
            document.getElementById("visualizerLoader").style.opacity = "1";
            // Velocity(
            //     document.getElementById("loaded"),
            //     { opacity: 0 },
            //     { display: "none" }
            // );
            // Velocity(
            //     document.getElementById("visualizerLoader"),
            //     { opacity: 1 },
            //     { display: "block" }
            // );
            await this.model
                .transcribeFromAudioFile(file)
                .then(noteSequence => {
                    Velocity(
                        document.getElementById("visualizerLoader"),
                        { opacity: 0 },
                        { display: "none" }
                    );
                    setTimeout(() => {
                        Velocity(
                            document.getElementById("canvasWrap"),
                            { opacity: 1 },
                            { display: "block" }
                        );
                    }, 500);

                    this.visualizer = new mm.Visualizer(
                        noteSequence,
                        document.getElementById("canvas"),
                        config
                    );
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
        transition: 0.25s;
        #loading {
            text-align: center;
            margin-top: -40px;
            p {
                font-size: 16px;
                font-weight: 300;
                margin-top: -30px;
            }
        }
        #loaded {
            text-align: center;
            display: none;
            opacity: 0;
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
                .musicLoader {
                    margin: auto;
                }
                p {
                    font-size: 16px;
                    opacity: 0.8;
                    font-weight: 300;
                    span {
                        color: #e342f8;
                    }
                }
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
            display: none;
            .loader,
            .loader:before,
            .loader:after {
                background: #ffffff;
                -webkit-animation: load1 1s infinite ease-in-out;
                animation: load1 1s infinite ease-in-out;
                width: 1em;
                height: 4em;
            }
            .loader {
                color: #ffffff;
                text-indent: -9999em;
                margin: 88px auto;
                position: relative;
                font-size: 11px;
                -webkit-transform: translateZ(0);
                -ms-transform: translateZ(0);
                transform: translateZ(0);
                -webkit-animation-delay: -0.16s;
                animation-delay: -0.16s;
            }
            .loader:before,
            .loader:after {
                position: absolute;
                top: 0;
                content: "";
            }
            .loader:before {
                left: -1.5em;
                -webkit-animation-delay: -0.32s;
                animation-delay: -0.32s;
            }
            .loader:after {
                left: 1.5em;
            }
            @-webkit-keyframes load1 {
                0%,
                80%,
                100% {
                    box-shadow: 0 0;
                    height: 4em;
                }
                40% {
                    box-shadow: 0 -2em;
                    height: 5em;
                }
            }
            @keyframes load1 {
                0%,
                80%,
                100% {
                    box-shadow: 0 0;
                    height: 4em;
                }
                40% {
                    box-shadow: 0 -2em;
                    height: 5em;
                }
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
        .canvasWrap {
            width: 90%;
            height: 100%;
            margin: auto;
            display: none;
            opacity: 0;
            #canvas {
                display: block;
                width: 100% !important;
                image-rendering: pixelated;
                height: 100% !important;
            }
            .playButton {
                position: absolute;
                top: 240px;
                right: 47.5%;
                transition: opacity 0.25s;
                opacity: 1;
            }
        }
    }
}
</style>
