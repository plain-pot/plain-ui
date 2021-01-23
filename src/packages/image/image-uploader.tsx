import {designComponent} from "../../use/designComponent";
import './image.scss'
import {PropType, reactive} from 'vue';
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

enum ImageUploaderStatus {
    empty = 'empty',                                        // 当前无图片
    success = 'success',                                    // 图片加载成功或者上传成功
    error = 'error',                                        // 图片上传失败
    fail = 'fail',                                          // 图片加兹安失败
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
        uploadConfig: {type: Object as PropType<Omit<FileServiceUploadConfig, 'file'>>, required: true},// 上传配置信息对象
    },
    emits: {
        onUpdateModelValue: (val?: string) => true,
    },
    setup({props, event: {emit}}) {

        const model = useModel(() => props.modelValue, emit.onUpdateModelValue)

        const {editComputed} = useEdit()

        const state = reactive({
            status: ImageUploaderStatus.empty,
            percent: null as null | number,
            chooseBase64: undefined as string | undefined,
        })

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
                const dfd = defer()
                const file = await $$file.chooseImage() as File
                state.chooseBase64 = await $$file.readAsDataURL(file) as string
                const config = deepcopy(props.uploadConfig)
                state.status = ImageUploaderStatus.upload
                $$file.upload({
                    ...config,
                    file,
                    onProgress: (percent, e) => {
                        if (!!config.onProgress) config.onProgress(percent, e)
                        console.log('percent', percent)
                        state.percent = percent
                    },
                    onSuccess: (resp) => {
                        if (!!config.onSuccess) config.onSuccess(resp)
                        console.log('upload success, resp:', resp)
                        model.value = String(state.chooseBase64)
                        state.chooseBase64 = undefined
                        state.status = ImageUploaderStatus.success
                    },
                    onError: (e) => {
                        if (!!config.onError) config.onError(e)
                        console.log('upload error, e:', e)
                        state.status = ImageUploaderStatus.error
                    },
                })
                return dfd.promise
            },
        }

        const handler = {
            onClick: () => {
                methods.choose()
            },
            onImageLoadSuccess: () => state.status = ImageUploaderStatus.success,
            onImageLoadError: () => state.status = ImageUploaderStatus.fail,
        }

        return {
            render: () => (
                <div class={classes.value} style={styles.value} onClick={handler.onClick}>
                    {(!!model.value || !!state.chooseBase64) && (
                        <PlImage
                            src={model.value || state.chooseBase64}
                            fit={props.fit}
                            position={props.position}
                            previewOnClick={false}
                            onSuccess={handler.onImageLoadSuccess}
                            onError={handler.onImageLoadError}
                            height={props.height}
                            width={props.width}
                        />
                    )}
                    {state.status === ImageUploaderStatus.empty && <>
                        <PlIcon icon="el-icon-picture"/>
                        <span>待上传</span>
                    </>}
                    {state.status === ImageUploaderStatus.error && <div class="pl-image-uploader-error">
                        <PlIcon icon="el-icon-close"/>
                        <span>上传失败</span>
                    </div>}
                </div>
            )
        }
    },
})