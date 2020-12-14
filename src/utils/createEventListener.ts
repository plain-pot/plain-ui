import {Events} from 'vue'

/**
 * 方便创建监听原生事件的监听函数
 * @author  韦胜健
 * @date    2020/12/14 17:47
 */
export function createEventListener<Config extends Partial<{ [k in keyof Events]: (e: Events[k]) => void }>>(config: Config): Config {
    return config
}