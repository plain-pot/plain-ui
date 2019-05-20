import $utils from '../scripts/utils'

import icon from './pl-icon'
import scroll from './pl-scroll'
import button from './pl-button'
import buttonGroup from './pl-button-group'
import loading from './pl-loading'
import input from './pl-input'
import popper from './popper/pl-popper'
import popover from './popper/pl-popover'
import dropdown from './dropdown/pl-dropdown'
import dropdownItem from './dropdown/pl-dropdown-item'
import toggle from './pl-toggle'
import radio from './radio/pl-radio'
import radioGroup from './radio/pl-radio-group'
import form from './form/pl-form'
import formItem from './form/pl-form-item'
import formColumn from './form/pl-form-column'
import list from './list/pl-list'
import item from './list/pl-item'
import textarea from './pl-textarea'
import dialog from './dialog/pl-dialog'
import select from './select/pl-select'
import collapse from './collapse/pl-collapse'
import collapseGroup from './collapse/pl-collapse-group'
import collapseTransition from './collapse/pl-collapse-transition'
import carousel from './pl-carousel'
import card from './card/pl-card'
import cardHeader from './card/pl-card-header'
import cardContent from './card/pl-card-content'
import cascade from './cascade/pl-cascade'
import tooltip from './tooltip/pl-tooltip'
import number from './pl-number'
import slider from './pl-slider'
import rate from './pl-rate'
import colorPicker from './color-picker/pl-color-picker'
import scrollOption from './scroll-option/pl-scroll-option'
import badge from './pl-badge'
import time from './time/pl-time'
import date from './date/pl-date'
import tree from './tree/pl-tree'
import progress from './progress/pl-progress'
import tag from './tag/pl-tag'
import tagInput from './tag/pl-tag-input'
import pagination from './pl-pagination'
import step from './step/pl-step'
import stepContainer from './step/pl-step-container'
import tabs from './tab/pl-tabs'
import tab from './tab/pl-tab'
import tabHeader from './tab/pl-tab-header'
import navTab from './pl-nav-tab'
import navPages from './nav/pl-nav-pages'
import nav from './nav/pl-nav'

const components = {
    icon, scroll, navTab, button, loading, buttonGroup, input, popper, popover, dropdown, dropdownItem, toggle,
    radio, radioGroup, form, formItem, formColumn, list, item, textarea, dialog, select, collapse, collapseGroup, collapseTransition, carousel, card,
    cardHeader, cardContent, tooltip, cascade, number, slider, rate, colorPicker, scrollOption, badge, time, date, tree, progress, tag, tagInput, pagination,
    step, stepContainer, tabs, tab, tabHeader, navPages, nav,
}

export function getComponents(prefix = 'pl') {
    return Object.keys(components).reduce((ret, key) => {
        ret[`${prefix}-${$utils.kebabCase(key)}`] = components[key]
        return ret
    }, {})
}

export default components