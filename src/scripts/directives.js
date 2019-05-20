import tooltip from '../components/tooltip/tooltip.js'
import $utils from "./utils";
const directives = {
    tooltip
}
export function getDirectives(prefix) {
    return Object.keys(directives).reduce((ret, key) => {
        ret[`${prefix}-${$utils.kebabCase(key)}`] = directives[key]
        return ret
    }, {})
}