import {emitName2ListenName, RefsMixinFactory} from "../../utils/mixins";
import Popper from '../popper/pl-popper.vue'

const DEFAULT_POPPER_OPTION = {
    placement: 'bottom-start',
    trigger: 'manual',
    transition: 'pl-transition-scale',
}

class AgentOption {
    reference: object | Function
    beforeShow: Function
    beforeHide: Function

    popperProps: object
    popperListener: object

    props: object
    listener: object
}

class AgentService {
    showFlag: boolean
    openFlag: boolean
    agent: Agent
    count: number

    options: any
    isShow: boolean
    isOpen: boolean
    isPrivate: boolean
    popperBinding: object

    show: () => Promise<any>
    hide: () => Promise<any>
    bind: (agent: Agent) => void
    unbind: (agent: Agent) => void
}

class Agent {
    service: AgentService

    constructor(public option: AgentOption, public controller) {
    }

    /*---------------------------------------getter-------------------------------------------*/

    get isShow(): boolean {
        if (!this.service) return false
        return this.service.isShow
    }

    get isOpen(): boolean {
        if (!this.service) return false
        return this.service.isOpen
    }

    /*---------------------------------------methods-------------------------------------------*/

    async show() {
        if (this.isShow) return
        if (!this.isOpen) {
            this.service = await this.controller.getInstance()
            this.service.bind(this)
        }
        await this.service.show()
    }

    async hide() {
        if (!this.isShow) return
        await this.service.hide()
    }

    async toggle() {
        if (!!this.isShow) {
            await this.hide()
        } else {
            await this.show()
        }
    }

    async destroy() {
        if (this.isShow) {
            this.hide()
        }
        if (!!this.service) {
            this.service.unbind(this)
        }
    }
}

/**
 * 生成一个service controller对象，用来生成service服务实例
 * @author  韦胜健
 * @date    2020/4/10 10:53
 */
function factory(name: string, ServiceComponent: any) {
    return {
        name,
        mixins: [RefsMixinFactory({
            items: Array,
        })],
        data() {
            return {
                count: 1,
            }
        },
        render(h) {
            return (
                <div class={name}>
                    {new Array(this.count).fill(0).map((item, index) => <ServiceComponent {...{key: index, ref: 'items', refInFor: true}}/>)}
                </div>
            )
        },
        methods: {
            async getInstance() {
                let service = this.items.find(item => (!item.showFlag && !item.openFlag) && !item.isPrivate)
                if (!service) {
                    this.count++
                    await this.$plain.nextTick()
                    return this.getInstance()
                } else {
                    return service
                }
            },
        },
    }
}

function service(name: string, content: (h: Function, Service: any) => any) {
    return {
        name: "pl-color-service",
        data() {
            const showFlag: boolean = false
            const openFlag: boolean = false
            const agent: Agent = null

            return {
                showFlag,
                openFlag,
                agent,
                count: 0,
            }
        },
        render(h) {
            return (
                <pl-popper class="pl-color-service" {...this.popperBinding}>
                    {content(h, this)}
                </pl-popper>
            )
        },
        computed: {
            options() {
                if (!this.agent) return {}
                let option = this.agent.option as AgentOption
                if (typeof option === "function") {
                    // @ts-ignore
                    option = option()
                }

                let {props, popperProps, listener, popperListener, reference, beforeShow, beforeHide} = option

                popperProps = {
                    ...DEFAULT_POPPER_OPTION,
                    ...(popperProps || {}),
                    reference: reference,
                }

                return {
                    popperProps,
                    props,
                    listener,
                    popperListener,
                    beforeShow,
                    beforeHide,
                }
            },
            isPrivate(): boolean {
                if (!this.agent) return false
                return this.options.private
            },
            isShow(): boolean {
                return this.showFlag
            },
            isOpen(): boolean {
                return this.openFlag
            },
            popperBinding() {

                const {popperListener} = this.options

                return {
                    props: {
                        value: this.showFlag,
                        open: this.openFlag,
                        popperClass: `${name}-popper`,
                        ...this.options.popperOption,
                    },
                    on: {

                        ...(Object.keys((Popper as any).emitters).reduce((ret, emitName) => {
                            const listenName = emitName2ListenName(emitName)
                            ret[listenName] = (...args) => {

                                const val = args[0]

                                switch (listenName) {
                                    case 'input':
                                        this.showFlag = val
                                        break
                                    case 'update:open':
                                        this.openFlag = val
                                        break
                                    case 'close':
                                        this.agent.service = null
                                        this.agent = null
                                        break
                                    case 'click-body':
                                        if (!!this.isShow) {
                                            this.hide()
                                        }
                                        break
                                }

                                if (!!popperListener[listenName]) {
                                    popperListener[listenName](...args)
                                }
                            }
                            return ret
                        }, {})),
                    },
                }
            },
        },
        methods: {
            async show() {
                if (!!this.showFlag) return
                this.count++
                await this.$plain.nextTick()
                if (!!this.agent.option.beforeShow) await this.agent.option.beforeShow()
                this.showFlag = true
            },
            async hide() {
                if (!this.showFlag) return
                if (!!this.agent.option.beforeHide) await this.agent.option.beforeHide()
                this.showFlag = false
            },
            bind(agent) {
                if (!!this.agent) {
                    this.agent.service = null
                }
                this.agent = agent
                agent.service = this
            },
            unbind(agent) {
                if (agent === this.agent) {
                    this.agent = null
                }
                agent.service = null
            },
        },
    }
}

function agent() {
    return Agent
}

class PlainService {
    static factory = factory
    static agent = agent
    static service = service
}

export default PlainService