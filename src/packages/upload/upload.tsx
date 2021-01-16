import {designComponent} from "../../use/designComponent";
import {$$file, FileServiceDefaultAccept, FileServiceSingleFile, FileServiceValidator} from "../file-service/file-service";
import {computed, PropType} from 'vue';
import {EditProps, useEdit} from "../../use/useEdit";
import {useModel} from "../../use/useModel";
import {toArray} from "../../utils/toArray";
import './upload.scss'
import {useClass} from "../../use/useClasses";
import {createCounter} from "../../utils/createCounter";
import {VNodeChild} from "../../shims";
import {$$dialog} from "../dialog-service";
import {$$message} from "../message";
import {defer} from "../../utils/defer";
import {useSlots} from "../../use/useSlots";
import {useScopedSlots} from "../../use/useScopedSlots";
import {PlButton} from "../button/button";
import {PlButtonGroup} from "../button-group/button-group";
import {PlIcon} from "../icon/icon";
import {PlLoading} from "../loading/loading";

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

type BeforeRemove = (file: UploadFile) => boolean
type BeforeUpload = (file: UploadFile) => void | Promise<void>
type HandleRemove = (file: UploadFile) => Promise<void>
type HandleUpload = (files: UploadFile | UploadFile[]) => Promise<void>
type HandlePreview = (file: UploadFile) => void

type UploadData = Record<string, string> | (() => Record<string, string>)
type UploadModelValue = UploadFile | UploadFile[]

export const PlUpload = designComponent({
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
        // request: {type: Function as PropType<CustomRequest>},           // 自定义上传行为
        // method: {type: String, default: 'post'},                        // 上传时的method方法
        autoUpload: {type: Boolean, default: true},                     // 获取到文件之后，自动上传文件
        removeConfirm: {type: Boolean, default: true},                  // 删除前的确认提示

        beforeUpload: {type: Function as PropType<BeforeUpload>},       // 上传前校验文件
        beforeRemove: {type: Function as PropType<BeforeRemove>},       // 删除前校验
        handleRemove: {type: Function as PropType<HandleRemove>},       // 执行删除逻辑
        handleUpload: {type: Function as PropType<HandleUpload>},       // 自定义上传逻辑
        handlePreview: {type: Function as PropType<HandlePreview>},     // 处理预览文件逻辑
    },
    emits: {
        updateModelValue: (val?: UploadModelValue) => true,
    },
    setup({props, event: {emit}}) {

        const {editComputed} = useEdit()
        const {slots} = useSlots(['button'])
        const {scopedSlots} = useScopedSlots({
            default: {item: Object as PropType<UploadFile>, index: Number}
        })

        const singleModel = useModel(() => props.modelValue as undefined | UploadFile, emit.updateModelValue)
        const multipleModel = useModel(() => props.modelValue as undefined | UploadFile[], emit.updateModelValue)

        const renderIcon = {
            [UploadStatus.success]: <PlIcon icon="el-icon-check-bold"/>,
            [UploadStatus.ready]: <PlIcon icon="el-icon-upload1"/>,
            [UploadStatus.error]: <PlIcon icon="el-icon-close-bold"/>,
            [UploadStatus.uploading]: <PlLoading type='beta' status="primary"/>,
            [UploadStatus.remove]: null,

            [UploadStatus.empty]: <PlIcon icon="el-icon-upload1"/>,
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
                'pl-upload-disabled': editComputed.value.disabled,
                'pl-upload-preview': !!props.handlePreview,
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

        const handler = {
            onSelectFile: async (files: File | File[]) => {

                const selectFiles = toArray(files).filter(file => {
                    const f = file as FileServiceSingleFile
                    f.calcSize = Number((file.size / (1024 * 1024)).toFixed(2))
                    /*validator*/
                    if (props.validator != null) {
                        const flag = props.validator(f)
                        if (flag === false) {
                            return false
                        }
                    }
                    /*max*/
                    if (props.max != null) {
                        if (f.calcSize > props.max) {
                            $$message.error(`[${file.name}]大小为${f.calcSize}MB，超过最大限制${props.max}MB`, {time: 5000})
                            return false
                        }
                    }
                    return true
                }) as FileServiceSingleFile[]

                if (!props.multiple) {
                    const file = selectFiles[0]!
                    singleModel.value = {
                        id: nextFileId(),
                        name: file.name,
                        file,
                        status: UploadStatus.ready,
                    }
                } else {
                    const addFiles = toArray(selectFiles).map(f => ({
                        id: nextFileId(),
                        status: UploadStatus.ready,
                        name: f.name,
                        file: f,
                    } as UploadFile))
                    multipleModel.value = [...addFiles, ...multipleModel.value || []]
                }
                if (props.autoUpload) {
                    await methods.upload()
                }
            },
        }

        const dropHandler = {
            onDragover: (e: DragEvent) => {
                e.preventDefault()
            },
            onDragLeave: (e: DragEvent) => {
                e.preventDefault()
            },
            onDrop: async (e: DragEvent) => {
                e.preventDefault()
                if (!editComputed.value.editable) {
                    return
                }

                const accept = !props.accept ? undefined : FileServiceDefaultAccept[props.accept] || props.accept
                let files: File[] = Array.from(e.dataTransfer!.files)
                if (!!accept) {
                    files = Array.from(e.dataTransfer!.files).filter(file => {
                        const {type, name} = file;
                        const extension = name.indexOf('.') > -1
                            ? `.${name.split('.').pop()}`
                            : '';
                        const baseType = type.replace(/\/.*$/, '');
                        return accept.split(',')
                            .map(type => type.trim())
                            .filter(type => type)
                            .some(acceptedType => {
                                if (/\..+$/.test(acceptedType)) {
                                    return extension === acceptedType;
                                }
                                if (/\/\*$/.test(acceptedType)) {
                                    return baseType === acceptedType.replace(/\/\*$/, '');
                                }
                                if (/^[^/]+\/[^/]+$/.test(acceptedType)) {
                                    return type === acceptedType;
                                }
                                return false;
                            });
                    })
                }
                if (files.length > 0) {
                    await handler.onSelectFile(files)
                }
            },
        }

        const methods = {
            chooseFile: async () => {
                if (!editComputed.value.editable) {
                    return
                }
                const files = await $$file.chooseFile({
                    multiple: props.multiple,
                    accept: props.accept,
                    /*validator以及max不在这里校验，因为 drop file的时候不走这里，在onSelectFile中统一处理*/
                    // validator: props.validator,
                    // max: props.max,
                })
                await handler.onSelectFile(files)
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
            upload: () => {
                let files = props.multiple ? multipleModel.value : (singleModel.value ? [singleModel.value] : undefined)
                if (!files) return
                /*上传 准备就绪或者上传失败的文件*/
                files = files.filter(f => f.status === UploadStatus.ready || f.status === UploadStatus.error)
                if (files.length === 0) return
                return methods.uploadFile(props.multiple ? files : files[0])
            },
            uploadFile: async (uploadFiles: UploadFile | UploadFile[]) => {

                toArray(uploadFiles).forEach(file => {
                    file.percent = 0
                    file.status = UploadStatus.uploading
                })

                if (!!props.beforeUpload) {
                    await Promise.all(toArray(uploadFiles).map(file => props.beforeUpload!(file)))
                }

                const handler = {
                    onSuccess: () => {
                        toArray(uploadFiles).forEach(file => {
                            file.status = UploadStatus.success
                            file.percent = undefined
                        })
                        dfd.resolve()
                    },
                    onError: () => {
                        toArray(uploadFiles).forEach(file => file.status = UploadStatus.error)
                        dfd.reject()
                    },
                }

                const dfd = defer()
                if (!!props.handleUpload) {
                    const promise = props.handleUpload(uploadFiles)
                    if (!promise) {
                        console.error('pl-upload: handleUpload must return promise object!')
                    } else {
                        promise.then(handler.onSuccess, handler.onError)
                    }
                } else {
                    $$file.upload({
                        action: props.action,
                        data: typeof props.data === "function" ? props.data() : props.data,
                        headers: props.headers,
                        withCredentials: props.withCredentials,
                        file: Array.isArray(uploadFiles) ? uploadFiles.map(f => f.file!) : uploadFiles.file!,
                        filename: props.filename,
                        ...handler,
                        onProgress: (percent) => {
                            toArray(uploadFiles).forEach(file => file.percent = percent)
                        },
                    })
                }
                return dfd.promise
            },
        }

        const renderItem = (file: UploadFile, index: number, custom?: () => VNodeChild) => (
            <div class={utils.getItemClass(file)} key={file.id}>
                <div class="pl-upload-item-inner">
                    {!!custom ? custom() : <>
                        {file.status ? renderIcon[file.status] : <PlIcon icon="el-icon-document"/>}
                        {file.status === UploadStatus.ready ? '(待上传) ' : ''}
                        <div class="pl-upload-item-content" onClick={() => !!props.handlePreview && props.handlePreview(file)}>
                            {scopedSlots.default({item: file, index}, file.name)}
                        </div>
                    </>}
                    {(
                        !!props.handleRemove
                        && file.status !== UploadStatus.empty
                        && file.status !== UploadStatus.uploading
                        && editComputed.value.editable
                    ) && (
                        <div class="pl-upload-item-remove" onClick={() => methods.removeFile(file)}>
                            <PlIcon icon="el-icon-delete-solid"/>
                        </div>
                    )}
                </div>
                {file.percent != null && (
                    <div class="pl-upload-item-progress">
                        <div class="pl-upload-item-progress-inner" style={{width: `${file.percent}%`}}/>
                    </div>
                )}
            </div>
        )

        const singleRender = computed(() => <>
            <PlButtonGroup>
                <PlButton label="选择文件" icon="el-icon-upload" onClick={methods.chooseFile}/>
                {!props.autoUpload && <PlButton label="上传" icon="el-icon-connection" onClick={methods.upload}/>}
                {slots.button()}
            </PlButtonGroup>
            {renderItem(singleModel.value || singleEmptyFile, 0)}
        </>)
        const multipleRender = computed(() => <>
            <div class="pl-upload-button">
                {!props.draggable ? (
                    <PlButtonGroup>
                        <PlButton label="选择文件" icon="el-icon-upload" onClick={methods.chooseFile}/>
                        {!props.autoUpload && <PlButton label="上传" icon="el-icon-connection" onClick={methods.upload}/>}
                        {slots.button()}
                    </PlButtonGroup>
                ) : (
                    <div class="pl-upload-drop-area" onClick={methods.chooseFile} {...dropHandler}>
                        <PlIcon icon="el-icon-upload"/>
                        <div>
                            <span>将文件拖拽至此处，或者</span>
                            <PlButton mode="text" class="pl-upload-drop-upload-button" onClick={methods.chooseFile}>
                                <span>点击上传</span>
                                <PlIcon icon="el-icon-upload1"/>
                            </PlButton>
                            {slots.button()}
                        </div>
                    </div>
                )}
            </div>
            <div class="pl-upload-list">
                {!!multipleModel.value && multipleModel.value
                    .filter(item => item.status !== UploadStatus.remove)
                    .map((file, index) => renderItem(file, index))}
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