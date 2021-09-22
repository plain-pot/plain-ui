/**
 * 将url转成image对象
 * @author  韦胜健
 * @date    2021/1/21 11:46
 */
import {defer} from "../../utils/defer";
import $$file from "../$$file";

export function urlToImage(url: string) {
    const dfd = defer<HTMLImageElement>()
    const image = new Image()
    image.setAttribute('crossOrigin', 'anonymous');
    image.onload = () => dfd.resolve(image)
    image.onerror = dfd.reject
    image.src = url
    return dfd.promise
}

/**
 * 将image转化为canvas
 * @author  韦胜健
 * @date    2021/1/21 11:50
 */
export function imageToCanvas(image: HTMLImageElement) {
    const canvas = document.createElement('canvas') as HTMLCanvasElement
    const ctx = canvas.getContext('2d')!
    canvas.width = image.width
    canvas.height = image.height
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height)
    return canvas
}

/**
 * 将canvas转化为File对象
 * @author  韦胜健
 * @date    2021/1/21 11:50
 * @param   canvas              画布对象
 * @param   type                文件类型，比如 image/jpeg
 * @param   quality             图片压缩质量，0-1
 * @param   filename            文件名称
 */
export function canvasToFile(canvas: HTMLCanvasElement, type: string, quality: number, filename: string) {
    const dfd = defer<File | null>()
    canvas.toBlob(blob => {
        dfd.resolve(!blob ? null : new File([blob], filename))
    }, type, quality)
    return dfd.promise
}

/**
 * 将canvas转化为base64
 * @author  韦胜健
 * @date    2021/1/21 11:52
 * @param   type            文件类型
 * @param   quality         图片压缩质量，0-1
 */
export function canvasToDataURL(canvas: HTMLCanvasElement, type: string, quality: number): string {
    return canvas.toDataURL(type, quality)
}


/**
 * 将file转化为base64
 * @author  韦胜健
 * @date    2021/1/21 11:54
 */
export const fileToDataURL = $$file.readAsDataURL

/**
 * 将dataURL转化为File对象
 * @author  韦胜健
 * @date    2021/1/21 11:54
 */
export function dataURLToFile(dataUrl: string) {
    const arr = dataUrl.split(',');
    const mime = arr[0].match(/:(.*?);/)![1]
    const bstr = atob(arr[1]);
    let n = bstr.length, u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], {type: mime});
}

/**
 * 将blob转化为file
 * @author  韦胜健
 * @date    2021/1/21 15:19
 */
export function blobToFile(blob: Blob, filename: string, option?: FilePropertyBag) {
    return new File([blob], filename, option)
}

export const imageCompress = (() => {
    /**
     * 根据尺寸压缩图片
     * @author  韦胜健
     * @date    2021/1/21 16:11
     */
    const compressByMeasure = async (image: HTMLImageElement, config: { maxHeight?: number, maxWidth?: number }, filename: string) => {
        const canvas = document.createElement('canvas') as HTMLCanvasElement
        const ctx = canvas.getContext('2d')!
        let height = image.height, width = image.width;
        if (!!config.maxHeight && height > config.maxHeight) {
            width = config.maxHeight / height * width
            height = config.maxHeight
        }
        if (!!config.maxWidth && width > config.maxWidth) {
            height = config.maxWidth / width * height
            width = config.maxWidth
        }
        canvas.width = width
        canvas.height = height
        ctx.drawImage(image, 0, 0, width, height)
        return canvasToFile(canvas, 'image/png', 1, filename)
    }
    /**
     * 根据图片容量大小压缩图片
     * @author  韦胜健
     * @date    2021/1/21 16:11
     */
    const compressByMaxSize = async (image: HTMLImageElement, maxSize: number, filename: string) => {
        const max = maxSize * 1000 * 1000
        let rate = 1
        const canvas = document.createElement('canvas') as HTMLCanvasElement
        const ctx = canvas.getContext('2d')!
        canvas.height = image.height
        canvas.width = image.width
        ctx.drawImage(image, 0, 0, image.width, image.height)

        let file = await canvasToFile(canvas, 'image/png', 1, filename)
        while (!!file && file.size > max && rate > 0.1) {
            ctx.clearRect(0, 0, image.width * rate, image.height * rate)
            rate -= 0.3
            canvas.height = image.height * rate
            canvas.width = image.width * rate
            ctx.drawImage(image, 0, 0, image.width * rate, image.height * rate)
            file = await canvasToFile(canvas, 'image/png', 1, filename)
        }
        return file
    }
    return async (url: string, config: { maxSize?: number, maxHeight?: number, maxWidth?: number }): Promise<string | ArrayBuffer | null> => {
        if (!url) {
            throw new Error('compress: url is empty!')
        }
        /*if (/^https?/.test(url) && url.indexOf('?') === -1) {
            url += `?timestamp=${Date.now()}`
        }*/
        let image = await urlToImage(url)
        if (!!config.maxHeight || !!config.maxWidth) {
            let file = await compressByMeasure(image, config, '根据尺寸压缩图片.png')
            return !file ? null : fileToDataURL(file)
        }
        if (!!config.maxSize) {
            let file = await compressByMaxSize(image, config.maxSize, '根据文件大小压缩图片.png')
            return !file ? null : fileToDataURL(file)
        }
        throw new Error('compress: maxSize, maxHeight, maxWidth is empty!')
    }
})();