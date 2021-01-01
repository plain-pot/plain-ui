import {defer} from "../../utils/defer";
import {$$message} from "../message";

export type FileServiceSingleFile = File & { calcSize: number }

export type FileServiceChooseFileConfig = {
    multiple?: boolean,                 // 是否多选
    accept?: string,                    // 选择的文件类型， input组件的accept属性值
    validator?: (file: FileServiceSingleFile) => boolean,          // 自定义校验函数
    max?: number,                       // 最大文件大小
}

export type FileServiceUploadErrorEvent = Error & {
    status: number,
    method: string,
    url: string,
    config: FileServiceUploadConfig,
}

export type FileServiceUploadConfig = {
    action: string,                             // 上传地址
    data: Record<string, string>,               // 上传的额外数据
    headers?: Record<string, string>,           // 请求头
    withCredentials?: boolean,                  // 是否带cookies凭证
    file: File | File[],                        // 上传的文件
    filename: string,                           // 上传文件接收的文件名
    onProgress: (percent: number, e: ProgressEvent) => void,
    onSuccess: (data: string | Record<string, string>) => void,
    onError: (e: FileServiceUploadErrorEvent | ProgressEvent) => void,
}

export function createFileService() {

    const defaultAccept = {
        image: 'image/gif, image/jpeg, image/png, image/jpg',
        excel: 'application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    } as Record<string, string>

    /**
     * 选择文件
     * @author  韦胜健
     * @date    2021/1/1 17:03
     */
    const chooseFile = (config?: FileServiceChooseFileConfig) => {
        config = config || {}
        const input = getInput()

        /*multiple*/
        if (config.multiple) {
            input.setAttribute('multiple', 'multiple')
        } else {
            input.removeAttribute('multiple')
        }
        /*accept*/
        if (!!config.accept) {
            const defaultInputAccept = defaultAccept[config.accept]
            input.setAttribute('accept', defaultInputAccept || config.accept)
        } else {
            input.removeAttribute('accept')
        }
        const dfd = defer<FileServiceSingleFile | FileServiceSingleFile[]>()

        if (!!input.__change) {
            input.value = null as any
            input.removeEventListener('change', input.__change)
        }
        input.__change = (e) => {
            const targetFiles = (e as any).target.files as FileServiceSingleFile[]
            const files = []
            for (let i = 0; i < targetFiles.length; i++) {
                const file = targetFiles[i];
                file.calcSize = Number((file.size / (1024 * 1024)).toFixed(2))
                if (!!config!.validator && !config!.validator(file)) return
                if (!!config!.max && file.calcSize > config!.max) {
                    return $$message.error(`[${file.name}]大小为${file.calcSize}MB，超过最大限制${config!.max}MB`, {time: 5000})
                }
                files.push(file)
            }
            dfd.resolve(config!.multiple ? files : files[0])
        }
        input.addEventListener('change', input.__change)
        input.click()

        return dfd.promise
    }

    /**
     * 选择tupiuan
     * @author  韦胜健
     * @date    2021/1/1 17:03
     */
    const chooseImage = (multiple?: boolean) => {
        const config: FileServiceChooseFileConfig = {accept: "image", multiple}
        return chooseFile(config)
    }

    /**
     * 读取文件为base64字符串
     * @author  韦胜健
     * @date    2021/1/1 17:04
     */
    const readAsDataURL = (file: File) => {
        const dfd = defer<string | ArrayBuffer | null>()
        let fr = new FileReader()
        fr.onloadend = e => dfd.resolve(e.target!.result)
        fr.onerror = () => dfd.reject()
        fr.readAsDataURL(file)
        return dfd.promise
    }

    /**
     * 上传文件
     * @author  韦胜健
     * @date    2021/1/1 17:07
     */
    const upload = (uploadConfig: FileServiceUploadConfig) => {
        const xhr = ('XMLHttpRequest' in window ? new XMLHttpRequest() : new (Window as any).ActiveXObject('Microsoft.XMLHTTP')) as XMLHttpRequest
        xhr.open('post', uploadConfig.action, true)

        if (!!xhr.upload) {
            xhr.upload.addEventListener('progress', (e) => {
                const percent = Number((e.loaded / e.total * 100).toFixed(2))
                !!uploadConfig.onProgress && uploadConfig.onProgress(percent, e)
            })
        }

        if (uploadConfig.withCredentials != null && 'withCredentials' in xhr) {
            xhr.withCredentials = uploadConfig.withCredentials
        }

        if (!!uploadConfig.headers)
            Object.entries(uploadConfig.headers)
                .forEach(([key, value]) => xhr.setRequestHeader(key, value))

        xhr.onerror = (e) => !!uploadConfig.onError && uploadConfig.onError(e)
        xhr.onload = () => {
            if (xhr.status < 200 || xhr.status > 300) {
                !!uploadConfig.onError && uploadConfig.onError(getError(uploadConfig, xhr))
            } else {
                !!uploadConfig.onSuccess && uploadConfig.onSuccess(getResponseBody(xhr))
            }
        }
        const formData = new FormData()
        if (!!uploadConfig.data) Object.entries(uploadConfig.data).forEach(([key, value]) => formData.append(key, value))
        if (Array.isArray(uploadConfig.file)) {
            uploadConfig.file.forEach(f => formData.append(uploadConfig.filename, f))
        } else {
            formData.append(uploadConfig.filename, uploadConfig.file);
        }
        xhr.send(formData)
        return xhr
    }

    return {
        chooseFile,
        chooseImage,
        readAsDataURL,
        upload,
    }
}

const getInput = (() => {
    let input: HTMLInputElement & { __change?: (e: Event) => void };
    return () => {
        if (!input) {
            input = document.createElement('input')
            input.setAttribute('type', 'file')
            input.style.display = 'none'
            document.body.appendChild(input)
        }
        return input
    }
})();

function getError(config: FileServiceUploadConfig, xhr: XMLHttpRequest) {
    let message: string
    console.log(xhr)
    if (!!xhr.response) {
        message = xhr.response.error || xhr.response
    } else if (!!xhr.responseText) {
        message = xhr.responseText
    } else {
        message = `file to post ${config.action} ${xhr.status}`
    }

    const error = new Error(message) as FileServiceUploadErrorEvent
    error.status = xhr.status
    error.method = 'post'
    error.url = config.action
    error.config = config

    return error
}

function getResponseBody(xhr: XMLHttpRequest) {
    let result = xhr.responseText || xhr.response
    if (!result) return result
    try {
        return JSON.parse(result)
    } catch (e) {
        return result
    }
}

export const $$file = createFileService()