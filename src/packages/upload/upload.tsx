import {designComponent} from "../../use/designComponent";
import {FileServiceSingleFile} from "../file-service/file-service";
import {PropType} from 'vue';

export enum UploadStatus {
    ready = 'ready',

}

type UploadFile = {
    status: string,
}
type BeforeUpload = (file: FileServiceSingleFile, fileList: FileServiceSingleFile[]) => boolean | Promise<FileServiceSingleFile | undefined>
type CustomRequest = () => any
type UploadData = Record<string, string> | (() => Record<string, string>)
type UploadModelValue = UploadFile | UploadFile[]

export default designComponent({
    name: 'pl-upload',
    props: {
        modelValue: {type: Array as PropType<UploadModelValue>},        // 双向绑定值，文件对象
        accept: {type: String},                                         // 接收上传的文件类型
        action: {type: String},                                         // 文件上传地址
        beforeUpload: {type: Function as PropType<BeforeUpload>},       // 上传前校验文件
        customRequest: {type: Function as PropType<CustomRequest>},     // 自定义上传行为
        data: {type: [Object, Function] as PropType<UploadData>},       // 上传时的额外参数，或者获取额外参数的函数

    },
})