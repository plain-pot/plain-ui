import {designPage} from "plain-design-composition";

import useTableOption from "../../init/useTableOption";
import {Plc, PlcDate, PlTablePro} from "../../../src";

export const demo1 = designPage(() => {

    const option = useTableOption({
        url: '/upload',
        fill: true,
        enable: {
            insert: false,
            update: false,
        },
    })

    return () => <>
        <div style={{height: 'calc(100vh - 100px)', boxSizing: 'border-box', backgroundColor: 'white'}}>
            <PlTablePro option={option}>
                <Plc title="文件名称" field="name" width={200}/>
                <PlcDate title="上传时间" field="createdAt" width={200}/>
                <Plc title="文件地址" field="path"/>
            </PlTablePro>
        </div>
    </>

})
