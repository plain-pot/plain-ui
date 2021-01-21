import {registryRootService} from "../../root/registryRootService";
import {createDefaultService} from "../../root/createDefaultService";
import {ref, reactive} from 'vue';
import {createDefaultManager} from "../../root/createDefaultManager";
import {$$file} from "../../file-service/file-service";

interface ImageServiceOption {
    imageList: string | string[],
}

const Service = createDefaultService({
    name: 'pl-image-service',
    setup: (option: ImageServiceOption) => {
        const isShow = ref(false)
        const state = reactive({
            key: 0,
            option,
        })

        const show = () => isShow.value = true
        const hide = () => isShow.value = false

        const service = async (option: ImageServiceOption) => {
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
        return (option: ImageServiceOption) => {

            const choose = $$file.chooseImage

            const preview = () => {

            }
            const compress = () => {

            }

        }
    }
)
