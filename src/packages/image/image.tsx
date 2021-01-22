import {designComponent} from "../../use/designComponent";
import {$image} from "./service";
import './image.scss'
import {computed, PropType, reactive, watch} from 'vue';
import {ImageStatus} from "./image.utils";
import {useClass} from "../../use/useClasses";
import {PlIcon} from "../icon/icon";
import {PlLoadingMask} from "../loading-mask/loading-mask";
import {useStyles} from "../../use/useStyles";
import {unit} from 'plain-utils/string/unit';

export const PlImage = designComponent({
    name: 'pl-image',
    props: {
        src: {type: String},
        alt: {type: String},
        status: {type: String as PropType<ImageStatus>},
        previewOnClick: {type: Boolean, default: true},
        width: {type: [String, Number]},
        height: {type: [String, Number]},
        maxHeight: {type: [String, Number]},
        minHeight: {type: [String, Number]},
        maxWidth: {type: [String, Number]},
        minWidth: {type: [String, Number]},
    },
    emits: {
        onClick: (e: MouseEvent) => true,
    },
    setup({props, event: {emit}}) {

        const state = reactive({
            src: undefined as string | undefined,
            image: null,
            status: ImageStatus.empty,
        })

        const status = computed(() => props.status == null ? state.status : props.status)

        watch(() => props.src, val => {
            state.src = val
            if (!val) {
                return state.status = ImageStatus.empty
            }
            state.src = val
            state.status = ImageStatus.pending
            const image = new Image()
            image.onload = () => state.status = ImageStatus.success
            image.onerror = () => state.status = ImageStatus.error
            image.src = val
        }, {immediate: true})

        const classes = useClass(() => [
            'pl-image',
            `pl-image-status-${status.value}`,
            {
                'pl-image-preview-on-click': props.previewOnClick,
            },
        ])

        const styles = useStyles(style => {
            if (!!props.height) style.height = unit(props.height)
            if (!!props.width) style.width = unit(props.width)
            if (!!props.minHeight) style.minHeight = unit(props.minHeight)
            if (!!props.minWidth) style.minWidth = unit(props.minWidth)
            if (!!props.maxHeight) style.maxHeight = unit(props.maxHeight)
            if (!!props.maxWidth) style.maxWidth = unit(props.maxWidth)
        })

        const tip = {
            [ImageStatus.empty]: '无图片',
            [ImageStatus.pending]: '加载中',
            [ImageStatus.error]: '加载失败',
        }

        const handler = {
            onClick: (e: MouseEvent) => {
                if (state.status === ImageStatus.success && props.previewOnClick) {
                    $image.preview(state.src!)
                }
                emit.onClick(e)
            }
        }

        return {
            render: () => {
                if (status.value === ImageStatus.empty || status.value === ImageStatus.pending || status.value === ImageStatus.error) {
                    return (
                        <div class={classes.value} style={styles.value} onClick={handler.onClick}>
                            <PlIcon icon="el-icon-picture"/>
                            <span>{tip[status.value]}</span>
                            {status.value === ImageStatus.pending && (<PlLoadingMask modelValue={true} background="rgba(255,255,255,0.5)"/>)}
                        </div>
                    )
                }
                if (status.value === ImageStatus.success) {
                    return (
                        <img src={state.src} class={classes.value} style={styles.value} onClick={handler.onClick}/>
                    )
                }
            }
        }
    },
}, {
    $image,
})