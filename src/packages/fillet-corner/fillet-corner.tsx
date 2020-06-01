import {computed, defineComponent, onMounted, ref} from "@vue/composition-api";
import {$plain} from "@/packages/base";
import {useRefs} from "@/use/useRefs";

export const enum FilletCornerDirection {
    horizontal = 'horizontal',
    vertical = 'vertical',
}

export default defineComponent({
    name: 'pl-fillet-corner',
    props: {
        direction: {type: String, default: FilletCornerDirection.vertical},
        top: {type: Boolean, default: true},
        start: {type: Boolean, default: false},
    },
    setup(props) {

        const refs = useRefs()
        const size = ref(0)

        const styles = computed(() => ({
            height: $plain.utils.suffixPx(refs.$el.offsetHeight),
            width: $plain.utils.suffixPx(refs.$el.offsetHeight),
        }))

        const path = computed(() => {
            let part1 = props.top ? 1 : -1
            let part2 = props.start ? 1 : -1

            const startPos = [0, part1 * part2 * -1 < 0 ? 100 : 0]
            const endPos = [100 - startPos[0], 100 - startPos[1]]

            const firstCornerPoint = props.direction === FilletCornerDirection.horizontal ?
                [startPos[0], 50] :
                [50, startPos[1]]

            const secondCornerPoint = props.direction === FilletCornerDirection.horizontal ?
                [endPos[0], 50] :
                [50, endPos[1]]

            // "M0,0 Q50,0 50,50 Q50,100 100,100 L0,100 Z"

            const d = [
                `M${startPos[0]},${startPos[1]}`,
                `Q${firstCornerPoint[0]},${firstCornerPoint[1]} 50,50`,
                `Q${secondCornerPoint[0]},${secondCornerPoint[1]} ${endPos[0]},${endPos[1]}`,
                part2 > 0 ? `L${endPos[0]},${startPos[1]}` : `L${startPos[0]},${endPos[1]}`,
                `Z`
            ]

            return d.join(' ')
        })

        onMounted(() => {
            size.value = refs.$el.offsetHeight
        })

        return () => (
            !size.value ?
                <div class={'pl-fillet-corner'}/>
                :
                <svg viewBox="0 0 100 100" style={styles.value} class={'pl-fillet-corner'}>
                    <path d={path.value}/>
                </svg>
        )
    },
})