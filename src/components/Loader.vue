<!--Credit Joe Harry @CodePen-->
<template>
    <div class="l_container">
        <svg
            class="part"
            x="0px"
            y="0px"
            viewBox="0 0 256 256"
            style="enable-background:new 0 0 256 256;"
            xml:space="preserve"
        >
            <path
                class="svgpath"
                id="playload"
                d="M189.5,140.5c-6.6,29.1-32.6,50.9-63.7,50.9c-36.1,0-65.3-29.3-65.3-65.3
	c0,0,17,0,23.5,0c10.4,0,6.6-45.9,11-46c5.2-0.1,3.6,94.8,7.4,94.8c4.1,0,4.1-92.9,8.2-92.9c4.1,0,4.1,83,8.1,83
	c4.1,0,4.1-73.6,8.1-73.6c4.1,0,4.1,63.9,8.1,63.9c4.1,0,4.1-53.9,8.1-53.9c4.1,0,4.1,44.1,8.2,44.1c4.1,0,3.1-34.5,7.2-34.5
	c4.1,0,3.1,24.6,7.2,24.6c4.1,0,2.5-14.5,5.2-14.5c2.2,0,0.8,5.1,4.2,4.9c0.4,0,13.1,0,13.1,0c0-34.4-27.9-62.3-62.3-62.3
	c-27.4,0-50.7,17.7-59,42.3"
            ></path>

            <path
                class="svgbg"
                d="M61,126c0,0,16.4,0,23,0c10.4,0,6.6-45.9,11-46c5.2-0.1,3.6,94.8,7.4,94.8c4.1,0,4.1-92.9,8.2-92.9
	c4.1,0,4.1,83,8.1,83c4.1,0,4.1-73.6,8.1-73.6c4.1,0,4.1,63.9,8.1,63.9c4.1,0,4.1-53.9,8.1-53.9c4.1,0,4.1,44.1,8.2,44.1
	c4.1,0,3.1-34.5,7.2-34.5c4.1,0,3.1,24.6,7.2,24.6c4.1,0,2.5-14.5,5.2-14.5c2.2,0,0.8,5.1,4.2,4.9c0.4,0,22.5,0,23,0"
            ></path>
        </svg>
    </div>
</template>

<script>
export default {
    name: "Loader"
};
</script>

<style lang="scss" scoped>
.l_container {
    width: 250px;
    height: 250px;
    margin: auto !important;
}

.part {
    width: 100%;
    height: 100%;
}

.svgpath {
    fill: rgba(145, 220, 90, 0);
    stroke: #892796;
    stroke-width: 3px;
    stroke-dasharray: 1000;
    stroke-linecap: round;
    z-index: 2;
}

.svgbg {
    fill: rgba(255, 255, 255, 0);
    z-index: 1;
}

#playload {
    animation: dash 2.5s reverse ease-in-out infinite;
}

@keyframes dash {
    to {
        stroke-dashoffset: 2000;
    }
}
</style>
