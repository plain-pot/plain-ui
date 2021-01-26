import {designComponent} from "../../use/designComponent";
import './image.scss'
import {PropType, reactive, watch} from 'vue';
import {$$file, FileServiceDefaultAccept, FileServiceUploadConfig} from "../file-service/file-service";
import {EditProps, useEdit} from "../../use/useEdit";
import {useStyles} from "../../use/useStyles";
import {unit} from 'plain-utils/string/unit';
import {PlIcon} from "../icon/icon";
import {useClass} from "../../use/useClasses";
import {deepcopy} from "plain-utils/object/deepcopy";
import {defer} from "../../utils/defer";
import {useModel} from "../../use/useModel";
import {PlImage, PlImageProps} from "./image";
import {ImageStatus} from "./image.utils";

enum ImageUploaderStatus {
    /*加载*/
    empty = 'empty',                                        // 当前无图片
    pending = 'pending',                                    // 加载中
    success = 'success',                                    // 图片加载成功或者上传成功
    error = 'error',                                        // 图片加载失败
    /*上传*/
    fail = 'fail',                                          // 图片上传失败
    upload = 'upload',                                      // 图片加载中
}

export const PlImageUploader = designComponent({
    name: 'pl-image-uploader',
    props: {
        ...EditProps,
        ...PlImageProps,
        modelValue: {type: String},                                                             // 图片路径
        width: {type: [String, Number], default: '80px'},                                       // 图片宽度
        height: {type: [String, Number], default: '80px'},                                      // 图片高度
        accept: {type: String, default: FileServiceDefaultAccept.image},                        // 选择文件的时候，图片类型
        uploadConfig: {type: Object as PropType<Omit<FileServiceUploadConfig, 'file'>>},        // 上传配置信息对象
        handleDelete: {type: Function as PropType<() => void | Promise<void>>},
        handleUpload: {type: Function as PropType<(file: File) => void | Promise<void>>},
    },
    emits: {
        onUpdateModelValue: (val?: string) => true,
        onLoadSuccess: (url: string) => true,
        onLoadError: (e: string | Event) => true,
        onUploadSuccess: (resp: object | string) => true,
        onUploadProgress: (percent: number, e: ProgressEvent) => true,
        onUploadFail: (e: any) => true,
    },
    setup({props, event: {emit}}) {

        const model = useModel(() => props.modelValue, emit.onUpdateModelValue, {autoWatch: false})

        const {editComputed} = useEdit()

        const state = reactive({
            status: ImageUploaderStatus.empty,
            percent: null as null | number,
            chooseBase64: undefined as string | undefined,
        })

        watch(() => props.modelValue, val => {
            model.value = val
            state.chooseBase64 = undefined
            if (!val) {
                return state.status = ImageUploaderStatus.empty
            }
            state.status = ImageUploaderStatus.pending
            const image = new Image()
            image.onload = () => {
                state.status = ImageUploaderStatus.success
                emit.onLoadSuccess(val)
            }
            image.onerror = (e) => {
                state.status = ImageUploaderStatus.error
                emit.onLoadError(e)
            }
            image.src = val
        }, {immediate: true})

        const classes = useClass(() => [
            'pl-image-uploader',
            `pl-image-uploader-status-${state.status}`,
            {
                'pl-image-disabled': editComputed.value.disabled,
                'pl-image-editable': editComputed.value.editable,
            }
        ])

        const styles = useStyles(style => {
            if (!!props.height) {style.height = unit(props.height)}
            if (!!props.width) {style.width = unit(props.width)}
        })

        const methods = {
            choose: async () => {
                const dfd = defer<void | string | Record<string, string>>()
                const file = await $$file.chooseImage() as File
                state.chooseBase64 = await $$file.readAsDataURL(file) as string

                if (!!props.uploadConfig) {
                    const config = deepcopy(props.uploadConfig)
                    state.status = ImageUploaderStatus.upload
                    $$file.upload({
                        ...config,
                        file,
                        onProgress: (percent, e) => {
                            if (!!config.onProgress) config.onProgress(percent, e)
                            console.log('percent', percent)
                            state.percent = percent
                            emit.onUploadProgress(percent, e)
                        },
                        onSuccess: (resp) => {
                            if (!!config.onSuccess) config.onSuccess(resp)
                            console.log('upload success, resp:', resp)
                            model.value = String(state.chooseBase64)
                            state.chooseBase64 = undefined
                            state.status = ImageUploaderStatus.success
                            emit.onUploadSuccess(resp)
                            dfd.resolve(resp)
                        },
                        onError: (e) => {
                            if (!!config.onError) config.onError(e)
                            console.log('upload fail, e:', e)
                            state.status = ImageUploaderStatus.fail
                            emit.onUploadFail(e)
                            dfd.reject(e)
                        },
                    })
                } else if (!!props.handleUpload) {
                    await props.handleUpload(file)
                    dfd.resolve()
                } else {
                    dfd.reject('image-uploader: no props.uploadConfig and props.handleUpload, do nothing')
                }

                return dfd.promise
            },
        }

        const handler = {
            onClick: async () => {
                if (!editComputed.value.editable) return
                await methods.choose()
            },
            onClickImage: async () => {
                if (state.status === ImageUploaderStatus.error) {
                    await handler.onClick()
                }
            },
            onClickDelete: async () => {
                if (!!props.handleDelete) {
                    await props.handleDelete()
                }
                model.value = undefined
                state.chooseBase64 = undefined
            },
        }

        return {
            render: () => (
                <div class={classes.value} style={styles.value}>
                    {(!!model.value || !!state.chooseBase64) && (
                        <PlImage
                            src={model.value || state.chooseBase64}
                            fit={props.fit}
                            position={props.position}
                            previewOnClick={false}
                            height={props.height}
                            width={props.width}
                            onClick={handler.onClickImage}
                        />
                    )}
                    {state.status === ImageUploaderStatus.empty && <div class="pl-image-uploader-empty" onClick={handler.onClick}>
                        <PlIcon icon="el-icon-picture"/>
                        <span>待上传</span>
                    </div>}
                    {state.status === ImageUploaderStatus.fail && <div class="pl-image-uploader-fail" onClick={handler.onClick}>
                        <PlIcon icon="el-icon-close"/>
                        <span>上传失败</span>
                    </div>}
                    <div class="pl-image-uploader-button-group">
                        <div class="pl-image-uploader-button" onClick={handler.onClick}>
                            <PlIcon icon="el-icon-upload"/>
                        </div>
                        <div class="pl-image-uploader-button" onClick={handler.onClickDelete}>
                            <PlIcon icon="el-icon-close-bold"/>
                        </div>
                    </div>
                </div>
            )
        }
    },
})