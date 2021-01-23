import {designComponent} from "../../use/designComponent";
import './image.scss'
import {reactive, PropType} from 'vue';
import {FileServiceDefaultAccept, FileServiceUploadConfig} from "../file-service/file-service";
import {ImageFit} from "./image";
import {EditProps} from "../../use/useEdit";

enum ImageUploaderStatus {
    empty = 'empty',
    loading = 'loading',
    success = 'success',
    error = 'error',
    upload = 'upload',
}

export const PlImageUploader = designComponent({
    name: 'pl-image-uploader',
    props: {
        ...EditProps,
        modelValue: {type: String},                                                             // 图片路径
        width: {type: [String, Number], default: '80px'},                                       // 图片宽度
        height: {type: [String, Number], default: '80px'},                                      // 图片高度
        alt: {type: String},                                                                    // 图片描述
        accept: {type: String, default: FileServiceDefaultAccept.image},                        // 选择文件的时候，图片类型
        fit: {type: String as PropType<ImageFit>, default: ImageFit.cover},                     // 图片object-fit样式值
        position: {type: String, default: 'top center'},                                        // 图片object-position样式值
        uploadConfig: {type: Object as PropType<FileServiceUploadConfig>, required: true},      // 上传配置信息对象

    },
    setup({props}) {

        const state = reactive({
            status: ImageUploaderStatus.empty,
            percent: null as null | number,
        })


        return {
            render: () => (
                <div class="pl-image-uploader">
                    this is image
                </div>
            )
        }
    },
})