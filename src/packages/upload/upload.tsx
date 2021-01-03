import {designComponent} from "../../use/designComponent";
import {$$file, FileServiceSingleFile, FileServiceValidator} from "../file-service/file-service";
import {computed, PropType, nextTick} from 'vue';
import {EditProps, useEdit} from "../../use/useEdit";
import {useModel} from "../../use/useModel";
import {toArray} from "../../utils/toArray";
import './upload.scss'
import {useClass} from "../../use/useClasses";
import {createCounter} from "../../utils/createCounter";
import {VNodeChild} from "../../shims";
import {delay} from "plain-utils/utils/delay";
import {$$dialog} from "../dialog-service";

const nextFileId = createCounter('upload')

export enum UploadStatus {
    ready = 'ready',                        // 刚添加，还未上传
    success = 'success',                    // 已上传完毕
    error = 'error',                        // 上传失败
    uploading = 'uploading',                // 正在上传
    remove = 'remove',                      // 已删除
    empty = 'empty',                        // 无文件
}

type UploadFile = {
    status?: UploadStatus,
    id: string,
    name: string,
    response?: any,
    file?: FileServiceSingleFile,
    percent?: number,
}

type BeforeUpload = (file: FileServiceSingleFile, fileList: FileServiceSingleFile[]) => boolean | Promise<FileServiceSingleFile | undefined>
type BeforeRemove = (file: UploadFile) => boolean
type HandleRemove = (file: UploadFile) => boolean
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
        action: {type: String, required: true},                         // 文件上传地址
        data: {type: [Object, Function] as PropType<UploadData>},       // 上传时的额外参数，或者获取额外参数的函数
        headers: {type: Object as PropType<Record<string, string>>,},   // 上传时的请求头
        withCredentials: {type: Boolean},                               // 带cookie凭证信息
        filename: {type: String, required: true},                       // 文件上传的的时候接收的文件名
        /*other*/
        draggable: {type: Boolean},                                     // 支持拖拽上传
        request: {type: Function as PropType<CustomRequest>},           // 自定义上传行为
        method: {type: String, default: 'post'},                        // 上传时的method方法
        autoUpload: {type: Boolean, default: true},                     // 获取到文件之后，自动上传文件
        removeConfirm: {type: Boolean, default: true},                  // 删除前的确认提示

        beforeUpload: {type: Function as PropType<BeforeUpload>},       // 上传前校验文件
        beforeRemove: {type: Function as PropType<BeforeRemove>},       // 删除前校验
        handleRemove: {type: Function as PropType<HandleRemove>},       // 执行删除逻辑
    },
    emits: {
        updateModelValue: (val?: UploadModelValue) => true,
    },
    setup({props, event: {emit}}) {

        const {editComputed} = useEdit()

        const singleModel = useModel(() => props.modelValue as undefined | UploadFile, emit.updateModelValue)
        const multipleModel = useModel(() => props.modelValue as undefined | UploadFile[], emit.updateModelValue)

        const renderIcon = {
            [UploadStatus.success]: <pl-icon icon="el-icon-check-bold"/>,
            [UploadStatus.ready]: <pl-icon icon="el-icon-upload1"/>,
            [UploadStatus.error]: <pl-icon icon="el-icon-close-bold"/>,
            [UploadStatus.uploading]: <pl-loading type='beta' status="primary"/>,
            [UploadStatus.remove]: null,

            [UploadStatus.empty]: <pl-icon icon="el-icon-upload1"/>,
        }
        const singleEmptyFile: UploadFile = {
            name: '未上传',
            status: UploadStatus.empty,
            id: 'nothing'
        }

        const classes = useClass(() => [
            'pl-upload',
            `pl-upload-${props.multiple ? 'multiple' : 'single'}`,
            {
                'pl-upload-remove': !!props.handleRemove,
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

        const methods = {
            chooseFile: async () => {
                const files = await $$file.chooseFile({
                    multiple: props.multiple,
                    accept: props.accept,
                    validator: props.validator,
                    max: props.max,
                })
                let uploadFiles: UploadFile | UploadFile[];
                if (!props.multiple) {
                    const file = files as any as FileServiceSingleFile
                    singleModel.value = {
                        id: nextFileId(),
                        name: file.name,
                        file,
                        status: UploadStatus.ready,
                    }
                    uploadFiles = singleModel.value
                } else {
                    const addFiles = toArray(files).map(f => ({
                        id: nextFileId(),
                        status: UploadStatus.ready,
                        name: f.name,
                        file: f,
                    } as UploadFile))
                    multipleModel.value = [...multipleModel.value || [], ...addFiles]
                    uploadFiles = addFiles
                }
                if (props.autoUpload) {
                    await methods.uploadFile(uploadFiles)
                }
            },
            removeFile: async (file: UploadFile) => {

                // 状态不存在或者状态为success表示需要用户处理删除文件在后端的逻辑，否则其他状态直接前端删除
                if (!file.status || file.status === UploadStatus.success) {
                    if (props.removeConfirm) {
                        await $$dialog.confirm(`确认要删除文件：${file.name} 吗？`)
                    }
                    if (!!props.beforeRemove) {await props.beforeRemove(file)}
                    await props.handleRemove!(file)
                }

                // 前端删除
                if (!props.multiple) {
                    singleModel.value = undefined
                } else {
                    const index = multipleModel.value!.indexOf(file)
                    if (index > -1) {
                        multipleModel.value!.splice(index, 1)
                    }
                }
            },
            uploadFile: (uploadFiles: UploadFile | UploadFile[]) => {
                $$file.upload({
                    action: props.action,
                    data: typeof props.data === "function" ? props.data() : props.data,
                    headers: props.headers,
                    withCredentials: props.withCredentials,
                    file: Array.isArray(uploadFiles) ? uploadFiles.map(f => f.file!) : uploadFiles.file!,
                    filename: props.filename,
                    onProgress: (percent) => {
                        toArray(uploadFiles).forEach(file => file.percent = percent)
                    },
                    onSuccess: () => {
                        toArray(uploadFiles).forEach(file => file.status = UploadStatus.success)
                    },
                    onError: () => {
                        toArray(uploadFiles).forEach(file => file.status = UploadStatus.error)
                    },
                })
            },
        }

        const renderItem = (file: UploadFile, custom?: () => VNodeChild) => (
            <div class={utils.getItemClass(file)} key={file.id}>
                {!!custom ? custom() : <>
                    {file.status ? renderIcon[file.status] : <pl-icon icon="el-icon-document"/>}
                    {file.status === UploadStatus.ready ? '(待上传) ' : ''}
                    {file.name}
                </>}
                {(!!props.handleRemove && file.status !== UploadStatus.empty) && (
                    <div class="pl-upload-item-remove" onClick={() => methods.removeFile(file)}>
                        <pl-icon icon="el-icon-delete-solid"/>
                    </div>
                )}
            </div>
        )

        const singleRender = computed(() => <>
            <pl-button label="选择文件" icon="el-icon-upload" onClick={methods.chooseFile}/>
            {renderItem(singleModel.value || singleEmptyFile)}
        </>)
        const multipleRender = computed(() => <>
            <div class="pl-upload-button">
                {!props.draggable ? (
                    <pl-button label="选择文件" icon="el-icon-upload" onClick={methods.chooseFile}/>
                ) : (
                    <div class="pl-upload-drop-area" onClick={methods.chooseFile}>
                        <pl-icon icon="el-icon-upload"/>
                        <div>
                            <span>将文件拖拽至此处，或者</span>
                            <pl-button mode="text" class="pl-upload-drop-upload-button" onClick={methods.chooseFile}>
                                <span>点击上传</span>
                                <pl-icon icon="el-icon-upload1"/>
                            </pl-button>
                        </div>
                    </div>
                )}
            </div>
            <div class="pl-upload-list">
                {!!multipleModel.value && multipleModel.value
                    .filter(item => item.status !== UploadStatus.remove)
                    .map(file => renderItem(file))}
            </div>
        </>)

        return {
            render: () => {
                return (
                    <div class={classes.value}>
                        {props.multiple ? multipleRender.value : singleRender.value}
                    </div>
                )
            }
        }
    },
})