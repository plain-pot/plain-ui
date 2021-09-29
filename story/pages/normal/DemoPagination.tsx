import {designPage, reactive} from "plain-ui-composition";
import {DemoRow} from "../../components/DemoRow";
import PlPagination from "../../../src/packages/PlPagination";
import {DemoLine} from "../../components/DemoLine";
import PlAlert from "../../../src/packages/PlAlert";

export default designPage(() => {

    const val = reactive({
        val: (() => {
            let val = []
            for (let i = 0; i < 20; i++) {
                val.push({
                    current: 1,
                    size: 20,
                })
            }
            val[5].current = 7
            val[6].current = 3
            val[7].current = 10
            return val
        })() as any
    }).val

    return () => (
        <div>
            <DemoRow title={'基本用法'}>
                <PlPagination
                    total={20000}
                    pageSize={val[0].size}
                    currentPage={val[0].current}
                    onCurrentChange={page => val[0].current = page}
                    onJump={page => val[0].current = page}
                    onSizeChange={size => val[0].size = size}
                />
                <div>{JSON.stringify(val[0])}</div>
            </DemoRow>
            <DemoRow title={'大小尺寸'}>
                <DemoLine title={'large'}/>
                <PlPagination
                    total={200}
                    pageSize={val[1].size}
                    currentPage={val[1].current}
                    onCurrentChange={page => val[1].current = page}
                    onJump={page => val[1].current = page}
                    onSizeChange={size => val[1].size = size}
                    size={'large'}
                />
                <DemoLine title={'normal'}/>
                <PlPagination
                    total={200}
                    pageSize={val[2].size}
                    currentPage={val[2].current}
                    onCurrentChange={page => val[2].current = page}
                    onJump={page => val[2].current = page}
                    onSizeChange={size => val[2].size = size}
                    size={'normal'}
                />
                <DemoLine title={'mini'}/>
                <PlPagination
                    total={200}
                    pageSize={val[3].size}
                    currentPage={val[3].current}
                    onCurrentChange={page => val[3].current = page}
                    onJump={page => val[3].current = page}
                    onSizeChange={size => val[3].size = size}
                    size={'mini'}
                />
            </DemoRow>
            <DemoRow title={'页码折叠形式'}>
                <DemoLine title={'前后不折叠(总页数小于等于页码按钮个数)'}/>
                <PlPagination
                    totalPage={7}
                    pageSize={val[4].size}
                    currentPage={val[4].current}
                    onCurrentChange={page => val[4].current = page}
                    onJump={page => val[4].current = page}
                    onSizeChange={size => val[4].size = size}
                />
                <DemoLine title={'前页折叠，当前页接近尾部位置'}/>
                <PlPagination
                    total={200}
                    pageSize={val[5].size}
                    currentPage={val[5].current}
                    onCurrentChange={page => val[5].current = page}
                    onJump={page => val[5].current = page}
                    onSizeChange={size => val[5].size = size}
                />
                <DemoLine title={'后页折叠，当前页接近起始位置'}/>
                <PlPagination
                    total={200}
                    pageSize={val[6].size}
                    currentPage={val[6].current}
                    onCurrentChange={page => val[6].current = page}
                    onJump={page => val[6].current = page}
                    onSizeChange={size => val[6].size = size}
                />
                <DemoLine title={'前后页折叠，当前页在中间位置'}/>
                <PlPagination
                    total={400}
                    pageSize={val[7].size}
                    currentPage={val[7].current}
                    onCurrentChange={page => val[7].current = page}
                    onJump={page => val[7].current = page}
                    onSizeChange={size => val[7].size = size}
                />
            </DemoRow>
            <DemoRow title={'自定义布局'}>
                <PlPagination
                    total={400}
                    pageSize={val[8].size}
                    currentPage={val[8].current}
                    onCurrentChange={page => val[8].current = page}
                    onJump={page => val[8].current = page}
                    onSizeChange={size => val[8].size = size}
                    layout="sizes,prev,next,pager,jumper,loading,blank,total,slot"
                />
            </DemoRow>
            <DemoRow title={'上下页文本'}>
                <PlPagination
                    total={400}
                    pageSize={val[8].size}
                    currentPage={val[8].current}
                    onCurrentChange={page => val[8].current = page}
                    onJump={page => val[8].current = page}
                    onSizeChange={size => val[8].size = size}
                    prevText={'上一页'}
                    nextText={'下一页'}
                />
            </DemoRow>
            <DemoRow title={'加载状态'}>
                <PlPagination
                    total={400}
                    pageSize={val[8].size}
                    currentPage={val[8].current}
                    onCurrentChange={page => val[8].current = page}
                    onJump={page => val[8].current = page}
                    onSizeChange={size => val[8].size = size}
                    loading
                />
            </DemoRow>
            <DemoRow title={'禁用'}>
                <PlPagination
                    total={400}
                    pageSize={val[8].size}
                    currentPage={val[8].current}
                    onCurrentChange={page => val[8].current = page}
                    onJump={page => val[8].current = page}
                    onSizeChange={size => val[8].size = size}
                    disabled
                />
            </DemoRow>
        </div>
    )
})
