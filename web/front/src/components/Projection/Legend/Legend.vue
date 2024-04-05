<template>
    <Transition>
        <div class="legend-box" v-show="!renderState">
            <div id="legend" v-show="colorBy != 'no_outline'">
                <div class="bar-contain" :class="{
                        pos: colorBy == 'row' || colorBy == 'column' || colorBy == 'position' || colorBy == 'embed_norm' || colorBy == 'token_length' || colorBy == 'sent_length' || colorBy == 'token_freq' || colorBy == 'sent_pos', cat: colorBy == 'pos_mod_5', reg: colorBy == 'region_type', pun: colorBy == 'special_tokens'
                    }">
                    <span>query</span>
                    <div class="bar">
                        <span class="low">{{ lowLabel() }}</span>
                        <span class="second">{{ secondLabel() }}</span>
                        <span class="third">{{ thirdLabel() }}</span>
                        <span class="fourth">{{ fourthLabel() }}</span>
                        <span class="fifth">{{ fifthLabel() }}</span>
                        <span class="sixth">{{ sixthLabel() }}</span>
                        <span class="high">{{ highLabel() }}</span>
                    </div>
                </div>
                <div class="bar-contain k" :class="{
                    pos: colorBy == 'row' || colorBy == 'column' || colorBy == 'position' || colorBy == 'embed_norm' || colorBy == 'token_length' || colorBy == 'sent_length' || colorBy == 'token_freq' || colorBy == 'sent_pos', cat: colorBy == 'pos_mod_5', reg: colorBy == 'region_type', pun: colorBy == 'special_tokens'
                }">
                    <span>key</span>
                    <div class="bar">
                        <span class="low">{{ lowLabel() }}</span>
                        <span class="second">{{ secondLabel() }}</span>
                        <span class="third">{{ thirdLabel() }}</span>
                        <span class="fourth">{{ fourthLabel() }}</span>
                        <span class="fifth">{{ fifthLabel() }}</span>
                        <span class="sixth">{{ sixthLabel() }}</span>
                        <span class="high">{{ highLabel() }}</span>
                    </div>
                </div>
            </div>

            <p id="legend-msg" class="subtitle"><b>color info:</b> {{ colorMsg }}</p>
        </div>
    </Transition>
</template>

<script lang="ts">
import { onMounted, computed, reactive, toRefs, h, watch, ref, defineComponent } from "vue";
import { useStore } from "@/store/index";

export default defineComponent({
    setup(props, context) {
        const store = useStore();

        const state = reactive({
            colorBy: computed(() => store.state.colorBy),
            renderState: computed(() => store.state.renderState),
            modelType: computed(() => store.state.modelType),
            aggregationType: computed(() => store.state.aggregationType),
            colorMsg: ""
        });

        const lowLabel = () => {
            switch (state.colorBy) {
                case 'pos_mod_5':
                case 'row':
                case 'column':
                    return "0"
                case 'position':
                    return "start"
                //case 'token_length':
                case 'region_type':
                    return "sep"
                case 'sent_length':
                    return "short"
                case 'embed_norm':
                case 'token_freq':
                    return "low"
                case 'special_tokens':
                    return "ACTG"
                default:
                    ""
            }
        }
        const highLabel = () => {
            switch (state.colorBy) {
                case 'position':
                    return "end"
                case 'row':
                case 'column':
                    return state.modelType == "vit-16" ? 13 : 6
                case 'pos_mod_5':
                    return "4"
                case 'embed_norm':
                case 'region_type':
                    return "exon"                    
                case 'token_freq':
                    return "high"
                //case 'token_length':
                case 'sent_length':
                    return "long"
                case 'special_tokens':
                    return "[cls]"
                default:
                    ""
            }
        }

        const secondLabel = () => {
            switch (state.colorBy) {
                case 'region_type':
                    return "intron"                    
                default:
                    ""
            }
        }    

        const thirdLabel = () => {
            switch (state.colorBy) {
                case 'region_type':
                    return "ALU"                    
                default:
                    ""
            }
        }            

        const fourthLabel = () => {
            switch (state.colorBy) {
                case 'region_type':
                    return "MIR"                    
                default:
                    ""
            }
        }   
        const fifthLabel = () => {
            switch (state.colorBy) {
                case 'region_type':
                    return "LINE"                    
                default:
                    ""
            }
        }     
        const sixthLabel = () => {
            switch (state.colorBy) {
                case 'region_type':
                    return "CLS"                    
                default:
                    ""
            }
        }                            


        // change msg below legend
        const setColorMsg = (msg: string) => {
            state.colorMsg = msg;
        }

        context.expose({
            setColorMsg
        });

        return {
            ...toRefs(state),
            highLabel,
            lowLabel,
            secondLabel,
            thirdLabel,
            fourthLabel,
            fifthLabel,
            sixthLabel
        };
    }
})

</script>

<style lang="scss">
.legend-box {
    transition: 0.5s;
    margin-top: 10px;
    width: 235px;
    display: flex;
    column-gap: 20px;
    align-items: center;
}

#legend {
    display: flex;
    column-gap: 12px;
}

#legend-msg {
    margin-bottom: 0;
}

.bar-contain {
    text-align: center;
    font-size: small;
}

/* default: type */
.bar {
    height: calc(24px + 0.2vw);
    max-height: 300px;
    width: calc(24px + 0.2vw);
    background: rgb(95, 185, 108);
    margin: 5px auto 0;
    transition: 0.5s;
    position: relative;
}

.bar-contain.k .bar {
    background: rgb(227, 55, 143);
}

/* position or norm */
.bar-contain.pos .bar {
    background: linear-gradient(to top, #ddefbb, #82CA7C, #00482A);
    height: calc(120px + 1vw);
}

.bar-contain.k.pos .bar {
    background: linear-gradient(to top, #ead4ed, #E33F97, #5E021B);
}

/* categorical */
.bar-contain.cat .bar {
    background: linear-gradient(#A144DB 20%,
            #528DDB 20% 40%,
            #5FB96C 40% 60%,
            #EDB50E 60% 80%,
            #E3378F 80%);
    height: calc(120px + 1vw);
}

.bar-contain.k.cat .bar {
    background: linear-gradient(#D6BAE3 20%,
            #C8DDED 20% 40%,
            #C4D6B8 40% 60%,
            #F0D6A5 60% 80%,
            #F5C0CA 80%);
}
/* regions type */
.bar-contain.reg .bar {
    background: linear-gradient(#2E93D9 14%,
            #E15759 14% 28%,
            #F28E2B 28% 42%,                       
            #59A14F 42% 56%,
            #00ffff 56% 70%, 
            #E3378F 70% 85%,
            #76B7B2 85%);
    height: calc(120px + 1vw);
}

.bar-contain.k.reg .bar {
    background: linear-gradient(#beddf3 14%,
            #f0a8a9 14% 28%,
            #fad9b7 28% 42%,            
            #bfddbb 42% 56%,
            #b3ffff 56% 70%,
            #f5bcda 70% 85%,
            #bcdcd9 85%);
}

/* categorical */
.bar-contain.pun .bar {
    background: linear-gradient(#F39226 50%, #5FB96C 50%);
    height: calc(48px + 0.4vw);
}

.bar-contain.k.pun .bar {
    background: linear-gradient(#E3378F 50%, #2E93D9 50%);
}

/* bar labels */
.bar span {
    display: block;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    font-size: x-small;
    transition: 0.5s;
    color: white;
}

.bar .high {
    top: 5px;
}

.bar .second {
    top: 20px;
}

.bar .third {
    top: 40px;
}
.bar .fourth {
    top: 65px;
}
.bar .fifth {
    top: 85px;
}
.bar .sixth {
    top: 105px;
}

.bar .low {
    bottom: 5px;
}
</style>