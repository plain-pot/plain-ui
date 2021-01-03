import {designComponent} from "../../use/designComponent";
import {$$file, FileServiceSingleFile, FileServiceValidator} from "../file-service/file-service";
import {computed, PropType} from 'vue';
import {EditProps, useEdit} from "../../use/useEdit";
import {useModel} from "../../use/useModel";
import {toArray} from "../../utils/toArray";
import './upload.scss'
import {useClass} from "../../use/useClasses";
import {createCounter} from "../../utils/createCounter";

const nextFileId = createCounter('upload')

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
        /*chooseFile*/
        accept: {type: String},                                         // FileServiceChooseFileConfig.accept, 接收上传的文件类型
        multiple: {type: Boolean, default: true},                       // FileServiceChooseFileConfig.multiple, 是否上传多个文件
        validator: {type: Function as PropType<FileServiceValidator>},  // FileServiceChooseFileConfig.validator, 选择文件的校验函数
        max: {type: Number},                                            // 最多上传文件个数
        /*upload*/
        action: {type: String, required: true},                                         // 文件上传地址
        data: {type: [Object, Function] as PropType<UploadData>},       // 上传时的额外参数，或者获取额外参数的函数
        headers: {type: Object as PropType<Record<string, string>>,},   // 上传时的请求头
        withCredentials: {type: Boolean},                               // 带cookie凭证信息
        filename: {type: String, required: true},                       // 文件上传的的时候接收的文件名
        /*other*/
        remove: {type: Boolean, default: true},                         // 是否可删除
        draggable: {type: Boolean},                                     // 支持拖拽上传
        request: {type: Function as PropType<CustomRequest>},           // 自定义上传行为
        method: {type: String, default: 'post'},                        // 上传时的method方法
        autoUpload: {type: Boolean},                                    // 获取到文件之后，自动上传文件

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

        const classes = useClass(() => [
            'pl-upload',
            {
                'pl-upload-remove': props.remove,
                'pl-upload-multiple': props.multiple,
            }
        ])

        const utils = {
            getItemClass: (item: UploadFile) => [
                'pl-upload-item',
                {
                    [`pl-upload-item-status-${item.status}`]: !!item.status
                }
            ],
        }

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

        const methods = {
            chooseFile: async () => {
                const file = await $$file.chooseFile({
                    multiple: props.multiple,
                    accept: props.accept,
                    validator: props.validator,
                    max: props.max,
                })
                const files = toArray(file).map(f => ({
                    status: UploadStatus.ready,
                    id: nextFileId(),
                    name: f.name,
                } as UploadFile))
                model.value = [...toArray(model.value || []), ...files]
            },
            deleteFile: async (file: UploadFile) => {
                //
            },
        }

        return {
            render: () => {
                return (
                    <div class={classes.value}>
                        <div class="pl-upload-button">
                            {!props.draggable ? (
                                <pl-button label="选择文件" icon="el-icon-upload" onClick={methods.chooseFile}/>
                            ) : (
                                <div class="pl-upload-drop-area" onClick={methods.chooseFile}>
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