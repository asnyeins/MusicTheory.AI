<template>
    <div class="container">
        <p id="loading">Loading Model..</p>
        <p id="loaded" style="display: none">Loaded</p>
        <input id="file-input" type="file">
        <canvas id="canvas"></canvas>
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
            const fileInput = document.getElementById("file-input");

            fileInput.addEventListener("change", e => {
                this.transcribeFile(e.target.files[0]);
            });

            document.getElementById("loading").style.display = "none";
            document.getElementById("loaded").style.display = "block";
        },
        async transcribeFile(file) {
            const config = {
                noteHeight: 15,
                pixelsPerTimeStep: 20, // like a note width
                noteSpacing: 10,
                noteRGB: "100, 100, 0",
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

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.container {
    background: #2a3942;
    margin-top: 50px;
}
</style>
