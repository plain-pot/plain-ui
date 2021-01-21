import {registryRootService} from "../../root/registryRootService";
import {createDefaultService} from "../../root/createDefaultService";
import {reactive, ref} from 'vue';
import {createDefaultManager} from "../../root/createDefaultManager";
import {$$file} from "../../file-service/file-service";
import {getServiceWithoutContext} from "../../../utils/getServiceWithoutContext";
import {imageCompress} from "./image.service.utils";

interface ImageServicePreviewOption {
    urls: string[],
}

const Service = createDefaultService({
    name: 'pl-image-preview-service',
    setup: (option: ImageServicePreviewOption) => {
        const isShow = ref(false)
        const state = reactive({
            current: 0,
            key: 0,
            option,
        })

        const show = () => {
            state.current = 0
            isShow.value = true
        }
        const hide = () => isShow.value = false

        const service = async (option: ImageServicePreviewOption) => {
            state.option = option
            state.key++
            show()
            return hide
        }

        const buttons = [
            {
                label: '逆时针旋转90°',
                icon: '',
            }
        ]

        return {
            refer: {
                isShow,
                isOpen: isShow,
                service,
            },
            render: () => (
                <div class="pl-image-preview-service">
                    {!!state.option.urls[state.current] && <img class="pl-image-preview-service-img" src={state.option.urls[state.current]}/>}
                    <div class="pl-image-preview-service-button-group">
                        <div class="pl-image-preview-service-button"></div>
                    </div>
                </div>
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
