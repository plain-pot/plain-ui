import {designPage, reactive} from "plain-ui-composition";
import {DemoRow} from "../../components/DemoRow";
import PlImage from "../../../src/packages/PlImage";
import {DemoLine} from "../../components/DemoLine";
import PlImageUploader from "../../../src/packages/PlImageUploader";
import PlButton from "../../../src/packages/PlButton";
import {$$image} from "../../../src/packages/useImage";

const img1 = 'https://img-blog.csdnimg.cn/c63923ea90924234af36aba464dfdfe7.jpg?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L21hdGVfZ2U=,size_16,color_FFFFFF,t_70#pic_center'
const img2 = 'https://img-blog.csdnimg.cn/213fc723bf10438db7a166323438ecb6.jpg?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L21hdGVfZ2U=,size_16,color_FFFFFF,t_70#pic_center'
const img3 = 'https://img-blog.csdnimg.cn/bf0aa67c0efd40d189f0f0005a5e4ced.jpg?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L21hdGVfZ2U=,size_16,color_FFFFFF,t_70#pic_center'
const img4 = 'https://img-blog.csdnimg.cn/b81da61a9bcf4990a732ed631644fe8e.jpg?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L21hdGVfZ2U=,size_16,color_FFFFFF,t_70#pic_center'
const img5 = 'https://img-blog.csdnimg.cn/89b8aacb3b0743dd9ddfD16da8c4ff0b2.jpg?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L21hdGVfZ2U=,size_16,color_FFFFFF,t_70#pic_center'

export default designPage(() => {

    const state = reactive({
        uploadConfig: {
            action: 'http://localhost:7001/saveFile',
            filename: 'file',
            data: {
                headId: '123',
                module: 'single',
                attr1: 'single',
            },
        },
        val: {
            0: img1,
            1: 'error.png',
            2: undefined,
        },
    })

    const previewMoreImage = () => {
        $$image.preview([
            img1,
            img2,
            img3,
            'error.jpg',
            null,
        ])
    }

    return () => (
        <div>
            <DemoRow title={'基本用法'}>
                <PlButton label={'预览多张图片'} onClick={previewMoreImage}/>
                <PlImage src={img1} width={100}/>
            </DemoRow>
            <DemoRow title={'限制图片大小'}>
                <PlImage src={img1} height={60} width={60}/>
            </DemoRow>
            <DemoRow title={'限制图片大小：图片缩放形式'}>
                {['fill', 'contain', 'cover', ' none', 'scale-down'].map(fit => (
                    <div style={{display: 'inline-flex', flexDirection: 'column', alignItems: 'center'}} key={fit}>
                        <PlImage fit={fit as any} src={img1} height={60} width={60}/>
                        <span style={{marginTop: '8px'}}>{fit}</span>
                    </div>
                ))}
            </DemoRow>
            <DemoRow title={'自定义缩放位置'}>
                {['center top', 'center', 'center bottom'].map(position => (
                    <div style={{display: 'inline-flex', flexDirection: 'column', alignItems: 'center'}} key={position}>
                        <PlImage fit={'cover'} position={position} src={img1} height={60} width={60}/>
                        <span style={{marginTop: '8px'}}>{position}</span>
                    </div>
                ))}
            </DemoRow>
            <DemoRow title={'四种状态'}>
                <PlImage status={'empty'}/>
                <PlImage status={'pending'}/>
                <PlImage status={'success'} src={img1} height={60} width={60}/>
                <PlImage status={'error'}/>
            </DemoRow>
            <DemoRow title={'PlImageUploader'}>
                <DemoLine title={'图片有效'}>
                    <PlImageUploader v-model={state.val[0]} uploadConfig={state.uploadConfig}/>
                </DemoLine>
                <DemoLine title={'图片无效'}>
                    <PlImageUploader v-model={state.val[1]} uploadConfig={state.uploadConfig}/>
                </DemoLine>
                <DemoLine title={'上传失败'}>
                    <PlImageUploader v-model={state.val[2]} uploadConfig={{action: '', filename: ''}}/>
                </DemoLine>
            </DemoRow>
        </div>
    )
})
