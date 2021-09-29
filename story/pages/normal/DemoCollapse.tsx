import {designPage} from "plain-ui-composition";
import {DemoRow} from "../../components/DemoRow";
import {reactive} from "plain-ui-composition";
import PlCollapse from "../../../src/packages/PlCollapse";
import PlIcon from "../../../src/packages/PlIcon";
import PlCollapseGroup from "../../../src/packages/PlCollapseGroup";

export default designPage(() => {

    const val = reactive({
        val: {} as any
    }).val

    return () => (
        <div>
            <DemoRow title={'Collapse：基本用法'}>
                <PlCollapse title={'前端工程师'}>
                    <div>
                        <p>前端工程师是互联网时代软件产品研发中不可缺少的一种专业研发角色；</p>
                        <p>从狭义上讲，前端工程师使用 HTML、CSS、JavaScript 等专业技能和工具将产品UI设计稿实现成网站产品，涵盖用户PC端、移动端网页，处理视觉和交互问题；</p>
                        <p>从广义上来讲，所有用户终端产品与视觉和交互有关的部分，都是前端工程师的专业领域。</p>
                    </div>
                </PlCollapse>
            </DemoRow>
            <DemoRow title={'Collapse:自定义标题'}>
                <PlCollapse>
                    {{
                        default: () => <>
                            <div>
                                <p>前端工程师是互联网时代软件产品研发中不可缺少的一种专业研发角色；</p>
                                <p>从狭义上讲，前端工程师使用 HTML、CSS、JavaScript 等专业技能和工具将产品UI设计稿实现成网站产品，涵盖用户PC端、移动端网页，处理视觉和交互问题；</p>
                                <p>从广义上来讲，所有用户终端产品与视觉和交互有关的部分，都是前端工程师的专业领域。</p>
                            </div>
                        </>,
                        head: () => <>
                            <span>前端工程师</span>
                            <PlIcon icon={'el-icon-info'} style={{marginLeft: '4px'}}/>
                        </>
                    }}
                </PlCollapse>
            </DemoRow>
            <DemoRow title={'CollapseGroup：基本用法'}>
                <PlCollapseGroup>
                    <PlCollapse title={'专家方向'}>
                        <p>经过几年的技术积累，大量的项目历练，很自然地就朝着专家的方向过渡了；</p>
                        <p>技术人普遍具有的一个特征就是不喜欢管一些乱七八糟的事，更愿意钻研感兴趣的技术，解决一些技术难题；</p>
                        <p>走专家路线可能是大多数技术人的选择；</p>
                    </PlCollapse>
                    <PlCollapse title={'管理方向'}>
                        <p>另一个职业方向就是技术管理；</p>
                        <p>技术管理要求的更综合，日常的工作涉及项目管理，跨部门沟通，团队管理，技术体系建设等方面；</p>
                        <p>做技术管理意味着远离一线coding，渐渐失去自己的技术优势，80%的精力是帮助团队同学成长，通过团队完成既定目标；</p>
                        <p>技术人要经历一个心态的转变。但企业招人过去最主要的目的是解决实际面临的技术问题，所以对于技术管理来说，技术还是一个基本面，不能完全放下，还是要时刻关注技术大方向；</p>
                    </PlCollapse>
                    <PlCollapse title={'产品&业务方向'}>
                        <p>还有一个职业方向是转型做产品经理更多地贴近业务；</p>
                        <p>我身边有越来越多的前端做了几年的研发后转型做了产品；</p>
                        <p>技术人转型做产品，其实是比较有优势的，一方面懂技术能更好地和研发沟通，另一方面产品设计上更容易落地；</p>
                    </PlCollapse>
                </PlCollapseGroup>
            </DemoRow>

            <DemoRow title={'CollapseGroup：限制展开的个数'}>
                {JSON.stringify(val[2])}
                <PlCollapseGroup v-model={val[2]} style={{marginBottom: '20px'}} limit={2}>
                    <PlCollapse title={'专家方向'}>
                        <p>经过几年的技术积累，大量的项目历练，很自然地就朝着专家的方向过渡了；</p>
                        <p>技术人普遍具有的一个特征就是不喜欢管一些乱七八糟的事，更愿意钻研感兴趣的技术，解决一些技术难题；</p>
                        <p>走专家路线可能是大多数技术人的选择；</p>
                    </PlCollapse>
                    <PlCollapse title={'管理方向'}>
                        <p>另一个职业方向就是技术管理；</p>
                        <p>技术管理要求的更综合，日常的工作涉及项目管理，跨部门沟通，团队管理，技术体系建设等方面；</p>
                        <p>做技术管理意味着远离一线coding，渐渐失去自己的技术优势，80%的精力是帮助团队同学成长，通过团队完成既定目标；</p>
                        <p>技术人要经历一个心态的转变。但企业招人过去最主要的目的是解决实际面临的技术问题，所以对于技术管理来说，技术还是一个基本面，不能完全放下，还是要时刻关注技术大方向；</p>
                    </PlCollapse>
                    <PlCollapse title={'产品&业务方向'}>
                        <p>还有一个职业方向是转型做产品经理更多地贴近业务；</p>
                        <p>我身边有越来越多的前端做了几年的研发后转型做了产品；</p>
                        <p>技术人转型做产品，其实是比较有优势的，一方面懂技术能更好地和研发沟通，另一方面产品设计上更容易落地；</p>
                    </PlCollapse>
                </PlCollapseGroup>
                <p>禁用的 CollapseGroup</p>
                <PlCollapseGroup v-model={val[2]} disabled>
                    <PlCollapse title={'专家方向'}>
                        <p>经过几年的技术积累，大量的项目历练，很自然地就朝着专家的方向过渡了；</p>
                        <p>技术人普遍具有的一个特征就是不喜欢管一些乱七八糟的事，更愿意钻研感兴趣的技术，解决一些技术难题；</p>
                        <p>走专家路线可能是大多数技术人的选择；</p>
                    </PlCollapse>
                    <PlCollapse title={'管理方向'}>
                        <p>另一个职业方向就是技术管理；</p>
                        <p>技术管理要求的更综合，日常的工作涉及项目管理，跨部门沟通，团队管理，技术体系建设等方面；</p>
                        <p>做技术管理意味着远离一线coding，渐渐失去自己的技术优势，80%的精力是帮助团队同学成长，通过团队完成既定目标；</p>
                        <p>技术人要经历一个心态的转变。但企业招人过去最主要的目的是解决实际面临的技术问题，所以对于技术管理来说，技术还是一个基本面，不能完全放下，还是要时刻关注技术大方向；</p>
                    </PlCollapse>
                    <PlCollapse title={'产品&业务方向'}>
                        <p>还有一个职业方向是转型做产品经理更多地贴近业务；</p>
                        <p>我身边有越来越多的前端做了几年的研发后转型做了产品；</p>
                        <p>技术人转型做产品，其实是比较有优势的，一方面懂技术能更好地和研发沟通，另一方面产品设计上更容易落地；</p>
                    </PlCollapse>
                </PlCollapseGroup>
            </DemoRow>
        </div>
    )
})
