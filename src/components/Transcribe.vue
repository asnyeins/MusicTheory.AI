<template>
    <div class="container">
        <div class="header">
            <!-- <input id="file-input" type="file"> -->
            <p id="loading">Loading Model..</p>
            <div id="loaded">
                <v-btn depressed color="primary">
                    Upload File
                    <input type="file" id="file-input">
                </v-btn>
                <p>or</p>
                <v-btn depressed color="primary">Record Audio</v-btn>
            </div>
        </div>
        <div class="player">
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
            await this.model
                .transcribeFromAudioFile(file)
                .then(noteSequence => {
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
    padding: 0;
    .player {
        background: #2a3942;
        width: 100%;
        #canvas {
            display: block;
            width: 90% !important;
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
            #file-input {
                width: 100%;
                height: 100%;
                position: absolute;
                opacity: 0;
            }
        }
    }
}
</style>
