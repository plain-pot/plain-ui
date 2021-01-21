import {registryRootService} from "../../root/registryRootService";
import {createDefaultService} from "../../root/createDefaultService";
import {reactive, ref, withDirectives, Transition, computed} from 'vue';
import {createDefaultManager} from "../../root/createDefaultManager";
import {$$file} from "../../file-service/file-service";
import {getServiceWithoutContext} from "../../../utils/getServiceWithoutContext";
import {imageCompress} from "./image.service.utils";
import {PlIcon} from "../../icon/icon";
import {TooltipDirective} from "../../tooltip/tooltip-directive";

interface ImageServicePreviewOption {
    urls: string[],
}

const Service = createDefaultService({
    name: 'pl-image-preview-service',
    setup: (option: ImageServicePreviewOption) => {
        const isShow = ref(false)
        const state = reactive({
            current: 0,                                 // 当前显示的图片索引
            option,
        })

        const show = () => {
            state.current = 0
            isShow.value = true
        }
        const hide = () => isShow.value = false

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
            },
            {
                label: '缩小',
                icon: 'el-icon-zoom-out',
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

        return {
            refer: {
                isShow,
                isOpen: isShow,
                service,
            },
            render: () => (
                <Transition name="pl-image-preview">
                    <div class={classes.value} v-show={isShow.value}>
                        {!!state.option.urls[state.current] && <img class="pl-image-preview-service-img" src={state.option.urls[state.current]}/>}
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
