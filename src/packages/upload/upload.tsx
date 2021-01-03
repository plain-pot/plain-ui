import {designComponent} from "../../use/designComponent";
import {FileServiceSingleFile} from "../file-service/file-service";
import {PropType, computed} from 'vue';
import {EditProps, useEdit} from "../../use/useEdit";
import {useModel} from "../../use/useModel";
import {toArray} from "../../utils/toArray";
import './upload.scss'
import {useClass} from "../../use/useClasses";

export enum UploadStatus {
    ready = 'ready',                        // 刚添加，还未上传
    success = 'success',                    // 已上传完毕
    error = 'error',                        // 上传失败
    uploading = 'uploading',                // 正在上传
    remove = 'remove',                      // 已删除
}

type UploadFile = {
    status: UploadStatus,
    id: string,
    name: string,
    response?: any,
}
type BeforeUpload = (file: FileServiceSingleFile, fileList: FileServiceSingleFile[]) => boolean | Promise<FileServiceSingleFile | undefined>
type BeforeRemove = () => boolean
type CustomRequest = () => any
type UploadData = Record<string, string> | (() => Record<string, string>)
type UploadModelValue = UploadFile | UploadFile[]

export default designComponent({
    name: 'pl-upload',
    props: {
        ...EditProps,
        modelValue: {type: Array as PropType<UploadModelValue>},        // 双向绑定值，文件对象
        accept: {type: String},                                         // 接收上传的文件类型
        action: {type: String, required: true},                                         // 文件上传地址
        headers: {type: Object as PropType<Record<string, string>>,},   // 上传时的请求头
        multiple: {type: Boolean},                                      // 是否上传多个文件
        data: {type: [Object, Function] as PropType<UploadData>},       // 上传时的额外参数，或者获取额外参数的函数
        filename: {type: String, required: true},                       // 文件上传的的时候接收的文件名
        withCredentials: {type: Boolean},                               // 带cookie凭证信息
        remove: {type: Boolean, default: true},                         // 是否可删除

        draggable: {type: Boolean},                                     // 支持拖拽上传
        request: {type: Function as PropType<CustomRequest>},           // 自定义上传行为
        method: {type: String, default: 'post'},                        // 上传时的method方法
        autoUpload: {type: Boolean},                                    // 获取到文件之后，自动上传文件
        limitFiles: {type: Number},                                     // 最大文件个数

        beforeUpload: {type: Function as PropType<BeforeUpload>},       // 上传前校验文件
        beforeRemove: {type: Function as PropType<BeforeRemove>},       // 删除前校验
    },
    emits: {
        updateModelValue: (val?: UploadModelValue) => true,
    },
    setup({props, event: {emit}}) {

        const {editComputed} = useEdit()
        const model = useModel(() => props.modelValue, emit.updateModelValue)

        const renderIcon = {
            [UploadStatus.success]: <pl-icon icon="el-icon-check-bold"/>,
            [UploadStatus.ready]: <pl-icon icon="el-icon-upload1"/>,
            [UploadStatus.error]: <pl-icon icon="el-icon-close-bold"/>,
            [UploadStatus.uploading]: <pl-loading type='beta' status="primary"/>,
            [UploadStatus.remove]: null,
        }

        const utils = {
            getItemClass: (item: UploadFile) => [
                'pl-upload-item',
                {
                    [`pl-upload-item-status-${item.status}`]: !!item.status
                }
            ],
        }

        const classes = useClass(() => [
            'pl-upload',
            {
                'pl-upload-remove': props.remove,
            }
        ])

        const content = computed(() =>
            toArray(model.value || [])
                .filter(item => item.status !== UploadStatus.remove)
                .map(file => (
                    <div class={utils.getItemClass(file)} key={file.id}>
                        {file.status ? renderIcon[file.status] : <pl-icon icon="el-icon-document"/>}
                        {file.name}
                        <div class="pl-upload-item-remove">
                            <pl-icon icon="el-icon-delete-solid"/>
                        </div>
                    </div>
                )))

        return {
            render: () => {
                return (
                    <div class={classes.value}>
                        <div class="pl-upload-button">
                            {!props.draggable ? (
                                <pl-button label="选择文件" icon="el-icon-upload"/>
                            ) : (
                                <div class="pl-upload-drop-area">
                                    <pl-icon icon="el-icon-upload"/>
                                    <div>
                                        <span>将文件拖拽至此处，或者</span>
                                        <pl-button mode="text" class="pl-upload-drop-upload-button">
                                            <span>点击上传</span>
                                            <pl-icon icon="el-icon-upload1"/>
                                        </pl-button>
                                    </div>
                                </div>
                            )}

                        </div>
                        <div class="pl-upload-list">
                            {content.value}
                        </div>
                    </div>
                )
            }
        }
    },
})