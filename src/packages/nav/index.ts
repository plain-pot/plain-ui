import Nav from './nav'
import NavPageStack from './nav-page-stack'
import {createComponentPlugin} from "../../utils/createComponentPlugin";

export default createComponentPlugin(Nav, {
    exposeComponents: {NavPageStack}
})