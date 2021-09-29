import {designPage, reactive} from "plain-ui-composition";
import {DemoRow} from "../../components/DemoRow";
import PlButton from "../../../src/packages/PlButton";
import $$file, {FileServiceChooseFileConfig, FileServiceSingleFile} from "../../../src/packages/$$file";

export default designPage(() => {

    const state = reactive({
        base64: null as null | string,
    })

    const methods = {
        async getSingleFile(option?: FileServiceChooseFileConfig) {
            const file = await $$file.chooseFile(option)
            console.log('success', file)
        },
        async showImage() {
            const file = await $$file.chooseImage()
            const base64 = await $$file.readAsDataURL(file as FileServiceSingleFile)
            state.base64 = base64 as string
        },
        async uploadFile() {
            const file = await $$file.chooseFile()
            await $$file.upload({
                action: 'http://193.112.75.134/server/upload/uploadFile',
                file,
                filename: 'file',
                data: {
                    headId: '123',
                    module: 'single',
                },
                onProgress(data) {
                    console.log('progress', data)
                },
                onSuccess(...args) {
                    console.log('success', ...args)
                },
                onError(...args) {
                    console.log('error', ...args)
                },
            })
        },
        async uploadFiles() {
            const file = await $$file.chooseFile({multiple: true})
            await $$file.upload({
                action: 'http://193.112.75.134/server/upload/uploadFiles',
                file,
                filename: 'files',
                data: {
                    headId: '456',
                    module: 'multiple',
                },
                onProgress(data) {
                    console.log('progress', data)
                },
                onSuccess(...args) {
                    console.log('success', ...args)
                },
                onError(...args) {
                    console.log('error', ...args)
                },
            })
        },
    }

    return () => (
        <div>
            <DemoRow title={'基本用法'}>
                <PlButton label={'获取单个文件'} onClick={() => methods.getSingleFile()}/>
            </DemoRow>
            <DemoRow title={'其他'}>
                <PlButton onClick={() => methods.getSingleFile({multiple: true})} label="获取多个文件"/>
                <PlButton onClick={() => methods.getSingleFile({max: 5})} label="获取单个文件，最大5M"/>
                <PlButton onClick={() => methods.getSingleFile({max: 5, multiple: true})} label="获取多个文件，最大5M"/>
                <PlButton onClick={() => methods.getSingleFile({max: 5, multiple: true, accept: 'image'})} label="获取多个文件，类型为图片"/>
                <PlButton onClick={() => methods.getSingleFile({max: 5, multiple: true, accept: 'excel'})} label="获取多个文件，类型为Excel文档"/>
                <PlButton onClick={() => methods.getSingleFile({max: 5, multiple: true, accept: 'image/png'})} label="获取多个文件，类型为自定义"/>
            </DemoRow>
            <DemoRow title={'获取图片base64字符串'}>
                <PlButton label={'获取图片之后展示图片'} onClick={() => methods.showImage()}/>
                <div>
                    {!!state.base64 && <img src={state.base64}/>}
                </div>
            </DemoRow>
            <DemoRow title={'获取文件，然后上传文件'}>
                <PlButton label={'上传文件'} onClick={methods.uploadFile}/>
                <PlButton label={'上传多个文件'} onClick={methods.uploadFiles}/>
            </DemoRow>
        </div>
    )
})
