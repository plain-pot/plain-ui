import {registryRootService} from "../../root/registryRootService";
import {createDefaultService} from "../../root/createDefaultService";
import {reactive, ref, withDirectives, Transition, computed, onMounted} from 'vue';
import {createDefaultManager} from "../../root/createDefaultManager";
import {$$file} from "../../file-service/file-service";
import {getServiceWithoutContext} from "../../../utils/getServiceWithoutContext";
import {imageCompress} from "./image.service.utils";
import {PlIcon} from "../../icon/icon";
import {TooltipDirective} from "../../tooltip/tooltip-directive";
import {useRefs} from "../../../use/useRefs";
import {useStyles} from "../../../use/useStyles";

interface ImageServicePreviewOption {
    urls: string[],
}

const Service = createDefaultService({
    name: 'pl-image-preview-service',
    setup: (option: ImageServicePreviewOption) => {

        const step = {
            scale: 0.2,
            rotate: 90,
        }

        const isShow = ref(false)
        const state = reactive({
            current: 0,                                 // 当前显示的图片索引
            option,
            adjust: {
                scale: null as null | number,           // 当前图片缩放大小
                top: null as null | number,             // 当前图片拖拽top距离
                left: null as null | number,            // 当前图片拖拽left距离
                rotate: null as null | number,          // 当前图片旋转距离
            },
            mounted: new Promise(resolve => onMounted(resolve))
        })

        const imgStyles = useStyles(style => {
            const {scale, top, left, rotate} = state.adjust
            let transform: string[] = []
            if (!!scale) {
                transform.push(`scale(${scale})`)
            }
            if (!!rotate) {
                transform.push(`rotate(${rotate}deg)`)
            }
            if (transform.length > 0) {
                style.transform = transform.join(',')
            }
            if (!!top) {
                style.top = `${top}px`
            }
            if (!!left) {
                style.left = `${left}px`
            }
        })

        const show = async () => {
            state.current = 0
            resetAdjust()
            await state.mounted
            isShow.value = true
        }
        const hide = () => isShow.value = false

        const resetAdjust = () => state.adjust = {
            scale: null as null | number,           // 当前图片缩放大小
            top: null as null | number,             // 当前图片拖拽top距离
            left: null as null | number,            // 当前图片拖拽left距离
            rotate: null as null | number,          // 当前图片旋转距离
        }

        const service = async (option: ImageServicePreviewOption) => {
            state.option = option
            show()
            return hide
        }

        const buttons = [
            {
                label: '逆时针旋转90°',
                icon: 'el-icon-rotate-left',
            },
            {
                label: '顺时针旋转90°',
                icon: 'el-icon-rotate-right',
            },
            {
                label: '放大',
                icon: 'el-icon-zoom-in',
                onClick: () => {
                    let {scale} = state.adjust
                    state.adjust.scale = (scale == null ? 1 : scale) + step.scale
                }
            },
            {
                label: '缩小',
                icon: 'el-icon-zoom-out',
                onClick: () => {
                    let {scale} = state.adjust
                    state.adjust.scale = (scale == null ? 1 : scale) - step.scale
                }
            },
            {
                label: '关闭',
                icon: 'el-icon-close',
                onClick: hide,
            },
        ]

        const classes = computed(() => [
            'pl-image-preview-service',
            {
                'pl-image-preview-service-show': isShow.value
            }
        ])

        const dragImg = (() => {
            let freezeState = {
                startTop: 0,
                startLeft: 0,
                startX: 0,
                startY: 0,
            }
            const mousedown = (e: MouseEvent) => {
                freezeState = {
                    startTop: state.adjust.top || 0,
                    startLeft: state.adjust.left || 0,
                    startX: e.clientX,
                    startY: e.clientY,
                }
                document.addEventListener('mousemove', mousemove)
                document.addEventListener('mouseup', mouseup)
            }
            const mousemove = (e: MouseEvent) => {
                state.adjust.left = e.clientX - freezeState.startX + freezeState.startLeft
                state.adjust.top = e.clientY - freezeState.startY + freezeState.startTop
            }
            const mouseup = (e: MouseEvent) => {
                document.removeEventListener('mousemove', mousemove)
                document.removeEventListener('mouseup', mouseup)
            }
            const dragstart = (e: DragEvent) => {
                e.stopPropagation()
                e.preventDefault()
            }
            return {
                mousedown,
                dragstart,
                imgStyles,
            }
        })();

        const handler = {
            onClickImg: (e: MouseEvent) => {
                e.stopPropagation()
            },
            onDblclickImg: () => {
                hide()
            },
        }

        return {
            refer: {
                isShow,
                isOpen: isShow,
                service,
            },
            render: () => (
                <Transition name="pl-image-preview">
                    <div class={classes.value} v-show={isShow.value}>
                        <div class="pl-image-preview-service-img-wrapper">
                            {!!state.option.urls[state.current] && (
                                <img
                                    ref="img"
                                    style={imgStyles.value}
                                    class="pl-image-preview-service-img"
                                    src={state.option.urls[state.current]}
                                    onClick={handler.onClickImg}
                                    onDblclick={handler.onDblclickImg}
                                    onMousedown={dragImg.mousedown}
                                    onDragstart={dragImg.dragstart}
                                />
                            )}
                        </div>
                        <div class="pl-image-preview-service-button-group">
                            {buttons.map(btn => withDirectives(<div class="pl-image-preview-service-button" key={btn.label} onClick={() => !!btn.onClick && btn.onClick()}>
                                <PlIcon icon={btn.icon}/>
                            </div> as any, [[TooltipDirective, btn.label]]))}
                        </div>
                    </div>
                </Transition>
            )
        }
    }
})

const getImageService = registryRootService(
    'image',
    createDefaultManager('pl-image-manager', Service),
    (getManager) => {
        const preview = (o: string | string[] | ImageServicePreviewOption) => {
            let option: ImageServicePreviewOption;
            if (Array.isArray(o)) {
                option = {urls: o}
            } else if (typeof o === "string") {
                option = {urls: [o]}
            } else {
                option = o
            }
            getManager().then(manager => manager.service(option))
        }
        return {
            choose: $$file.chooseImage,
            compress: imageCompress,
            preview,
        }
    }
)

export const $image = getServiceWithoutContext(getImageService)
