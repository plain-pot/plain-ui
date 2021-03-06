import {useClasses, reactive, computed, designComponent, PropType, watch, useStyles, useRefs} from 'plain-ui-composition'
import './image.scss'
import {unit} from "plain-utils/string/unit";
import PlIcon from "../PlIcon";
import {PlLoadingMask} from "../PlLoadingMask";
import {$$image} from "../useImage";

export enum ImageFit {
    fill = 'fill',
    contain = 'contain',
    cover = 'cover',
    none = 'none',
    'scale-down' = 'scale-down',
}

export enum ImageStatus {
    success = 'success',
    error = 'error',
    pending = 'pending',
    empty = 'empty',
}

export const PlImageProps = {
    alt: {type: String},                                                        // 图片描述
    fit: {type: String as PropType<keyof typeof ImageFit>, default: ImageFit.cover},         // 图片 object-fit 属性
    position: {type: String, default: 'top center'},                            // 图片 object-position 属性
}

export const PlImage = designComponent({
    name: 'pl-image',
    props: {
        src: {type: String as PropType<string | null>},                          // 图片地址
        status: {type: String as PropType<keyof typeof ImageStatus>},            // 当前转股固态，fill, container, cover, none, scale-down
        previewOnClick: {type: Boolean, default: true},                          // 是否点击的时候放大预览图片
        maxHeight: {type: [String, Number]},                                     // 最大高度
        minHeight: {type: [String, Number]},                                     // 最小高度
        maxWidth: {type: [String, Number]},                                      // 最大宽度
        minWidth: {type: [String, Number]},                                      // 最小宽度
        width: {type: [String, Number]},                                         // 图片宽度
        height: {type: [String, Number]},                                        // 图片高度
        ...PlImageProps,
    },
    emits: {
        onClick: (e: MouseEvent) => true,
        onSuccess: (val: string) => true,
        onError: (e: string | Event) => true,
    },
    setup({props, event: {emit}}) {

        const {refs, onRef} = useRefs({
            el: HTMLDivElement,
            img: HTMLImageElement,
        })

        const state = reactive({
            src: undefined as string | undefined | null,
            status: ImageStatus.empty,
        })

        const status = computed(() => props.status == null ? state.status : props.status)

        watch(() => props.src, val => {
            state.src = val
            if (!val) {
                return state.status = ImageStatus.empty
            }
            state.status = ImageStatus.pending
            const image = new Image()
            image.onload = () => {
                state.status = ImageStatus.success
                emit.onSuccess(val)
            }
            image.onerror = (e) => {
                state.status = ImageStatus.error
                emit.onError(e)
            }
            image.src = val
        }, {immediate: true})

        const classes = useClasses(() => [
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
            if (!!props.fit) style.objectFit = props.fit
            if (!!props.position) style.objectPosition = props.position
        })

        const tip = {
            [ImageStatus.empty]: '无图片',
            [ImageStatus.pending]: '加载中',
            [ImageStatus.error]: '加载失败',
        }

        const handler = {
            onClick: (e: MouseEvent) => {
                if (state.status === ImageStatus.success && props.previewOnClick) {
                    $$image.preview(state.src!)
                }
                emit.onClick(e)
            }
        }

        return {
            refer: {
                refs,
            },
            render: () => {
                if (status.value === ImageStatus.empty || status.value === ImageStatus.pending || status.value === ImageStatus.error) {
                    return (
                        <div class={classes.value} style={styles.value} onClick={handler.onClick} ref={onRef.el}>
                            <PlIcon icon="el-icon-picture"/>
                            <span>{tip[status.value]}</span>
                            {status.value === ImageStatus.pending && (<PlLoadingMask modelValue={true} background="rgba(255,255,255,0.5)"/>)}
                        </div>
                    )
                }
                if (status.value === ImageStatus.success) {
                    return (
                        <img src={state.src || ''} class={classes.value} style={styles.value} onClick={handler.onClick} ref={onRef.img}/>
                    )
                }
            }
        }
    },
})

export default PlImage
