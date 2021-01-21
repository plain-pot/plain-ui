import {registryRootService} from "../../root/registryRootService";
import {createDefaultService} from "../../root/createDefaultService";
import {reactive, ref} from 'vue';
import {createDefaultManager} from "../../root/createDefaultManager";
import {$$file} from "../../file-service/file-service";
import {getServiceWithoutContext} from "../../../utils/getServiceWithoutContext";
import {imageCompress} from "./image.service.utils";

interface ImageServicePreviewOption {
    imageList: string | string[],
}

const Service = createDefaultService({
    name: 'pl-image-service',
    setup: (option: ImageServicePreviewOption) => {
        const isShow = ref(false)
        const state = reactive({
            key: 0,
            option,
        })

        const show = () => isShow.value = true
        const hide = () => isShow.value = false

        const service = async (option: ImageServicePreviewOption) => {
            state.option = option
            state.key++
            show()
            return hide
        }

        return {
            refer: {
                isShow,
                isOpen: isShow,
                service,
            },
            render: () => (
                <div>
                    image service
                </div>
            )
        }
    }
})

const getImageService = registryRootService(
    'image',
    createDefaultManager('pl-image-manager', Service),
    (getManager) => {
        const preview = (urls: string | string[] | ImageServicePreviewOption) => {
            console.log('preview')
        }
        return {
            choose: $$file.chooseImage,
            compress: imageCompress,
            preview,
        }
    }
)

export const $image = getServiceWithoutContext(getImageService)
