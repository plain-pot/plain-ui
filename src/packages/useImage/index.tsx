import {createDefaultService} from "../PlRoot/createDefaultService";
import {reactive, onMounted, ref, useStyles, computed, onBeforeUnmount} from "plain-ui-composition";
import {Transition, Teleport} from 'vue'
import {PlImage} from "../PlImage";
import PlTooltip from "../PlTooltip";
import PlIcon from "../PlIcon";
import {createServiceWithoutContext, createUseService} from "../PlRoot/registryRootService";
import {createDefaultManager} from "../PlRoot/createDefaultManager";
import $$file from "../$$file";
import {imageCompress} from "./image.service.utils";
import {KeyboardService} from "../keyboard";
import {createCounter} from "plain-utils/utils/createCounter";

interface ImageServicePreviewOption {
    urls: (string | null | undefined)[],
    current: number,
}

const nextCount = createCounter("image_preview")

const Service = createDefaultService({
    name: 'pl-image-preview-service',
    setup: (option: ImageServicePreviewOption) => {

        const step = {scale: 0.2, rotate: 90,}

        const isShow = ref(false)

        const state = reactive({
            option,
            count: nextCount(),
            adjust: {
                scale: null as null | number,           // 当前图片缩放大小
                top: null as null | number,             // 当前图片拖拽top距离
                left: null as null | number,            // 当前图片拖拽left距离
                rotate: null as null | number,          // 当前图片旋转距离
            },
            mounted: new Promise<void>(resolve => onMounted(resolve))
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
                style.transform = transform.join(' ')
            }
            if (!!top) {
                style.top = `${top}px`
            }
            if (!!left) {
                style.left = `${left}px`
            }
        })

        const show = async () => {
            resetAdjust()
            state.count = nextCount()
            await state.mounted
            isShow.value = true

            setTimeout(() => {
                const activeElement = document.activeElement as HTMLElement
                if (!!activeElement) activeElement.blur()
            })
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
            await show()
            return hide
        }

        const isMultipleImages = computed(() => state.option.urls.length > 1)

        const buttons = [
            {
                label: '逆时针旋转90°',
                icon: 'el-icon-rotate-left',
                onClick: () => {
                    let {rotate} = state.adjust
                    rotate = (rotate == null ? 0 : rotate) + step.rotate;
                    (rotate === 360) && (rotate = 0);
                    state.adjust.rotate = rotate
                }
            },
            {
                label: '顺时针旋转90°',
                icon: 'el-icon-rotate-right',
                onClick: () => {
                    let {rotate} = state.adjust
                    rotate = (rotate == null ? 0 : rotate) - step.rotate;
                    (rotate === -360) && (rotate = 0);
                    state.adjust.rotate = rotate
                }
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
                label: '上一张',
                icon: 'el-icon-arrow-left',
                show: () => isMultipleImages.value,
                onClick: () => {
                    resetAdjust()
                    let current = state.option.current - 1
                    if (current < 0) current = state.option.urls.length - 1
                    state.option.current = current
                },
            },
            {
                label: '下一张',
                icon: 'el-icon-arrow-right',
                show: () => isMultipleImages.value,
                onClick: () => {
                    resetAdjust()
                    let current = state.option.current + 1
                    if (current > state.option.urls.length - 1) current = 0
                    state.option.current = current
                },
            },
            {
                label: '重置',
                icon: 'el-icon-refresh',
                onClick: resetAdjust,
            },
            {
                label: '关闭',
                icon: 'el-icon-close',
                onClick: hide,
            },
        ]

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
            stopPropagation: (e: MouseEvent) => e.stopPropagation(),
            onDblclickImg: hide,
            onClickMask: hide,
        }

        onBeforeUnmount(KeyboardService.listen({esc: () => {isShow.value && hide()}}))

        return {
            refer: {
                isShow,
                isOpen: isShow,
                service,
            },
            render: () => (
                <Teleport to=".pl-root-service-container">
                    <Transition name="pl-image-preview">
                        {isShow.value && <div class="pl-image-preview-service" onClick={handler.onClickMask}>
                            <div class="pl-image-preview-service-img-wrapper">
                                <Transition name={'pl-transition-scale'} key={state.count}>
                                    {/*不加这个div，switch动画没有效果，真是奇怪。PlButton可以，PlCard可以，就PlImage不行*/}
                                    <div style={{display: 'inline-block'}} key={state.option.urls[state.option.current]!}>
                                        <PlImage
                                            style={imgStyles.value}
                                            previewOnClick={false}
                                            class="pl-image-preview-service-img"
                                            src={state.option.urls[state.option.current]}
                                            key={state.option.urls[state.option.current]!}
                                            {...{
                                                onClick: handler.stopPropagation,
                                                onDoubleClick: handler.onDblclickImg,
                                                onMousedown: dragImg.mousedown,
                                                onDragStart: dragImg.dragstart,
                                            }}
                                        />
                                    </div>
                                </Transition>
                            </div>
                            {isMultipleImages.value && <div class="pl-image-preview-service-indicator">
                                {state.option.urls.map((item, index) => <div class={`pl-image-preview-service-indicator-item ${index === state.option.current ? 'pl-image-preview-service-indicator-item-active' : ''}`} key={index}/>)}
                            </div>}
                            <div class="pl-image-preview-service-button-group" onClick={handler.stopPropagation}>
                                {buttons.map(btn => {
                                    if (!!btn.show && !btn.show()) {
                                        return null
                                    }
                                    return (
                                        <PlTooltip title={btn.label} key={btn.label}>
                                            <div class="pl-image-preview-service-button" key={btn.label} onClick={() => !!btn.onClick && btn.onClick()}>
                                                <PlIcon icon={btn.icon}/>
                                            </div>
                                        </PlTooltip>
                                    )
                                })}
                            </div>
                        </div>}
                    </Transition>
                </Teleport>
            )
        }
    }
})

const useImage = createUseService({
    name: 'image',
    managerComponent: createDefaultManager('pl-image-manager', Service),
    createService: (getManager) => {
        const preview = (urls: string | (string | null | undefined)[], current?: number) => {
            let option: ImageServicePreviewOption = {
                urls: !!urls && Array.isArray(urls) ? urls : [urls],
                current: current == null ? 0 : current,
            };
            getManager().then(manager => manager.service(option))
        }
        return {
            choose: $$file.chooseImage,
            compress: imageCompress,
            preview,
        }
    },
})

export const $$image = createServiceWithoutContext(useImage)

export default useImage
