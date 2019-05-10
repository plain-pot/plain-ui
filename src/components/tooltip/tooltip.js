import $utils from '../../scripts/utils'
import $dom from '../../scripts/dom'
import Tippy from 'tippy.js';

const DEFAULT_OPTION = {
    arrow: false,
    placement: 'bottom',
    trigger: 'mouseenter',
    theme: 'dark',
    boundary: 'window',
};

export default function (el, {value}) {
    $dom.addClass(el, 'pl-tooltip-target')
    !!el.pl_tippy && el.pl_tippy.destroy();
    if ($utils.typeOf(value) === 'object') {
        const {content, arrow = true, placement = 'bottom', trigger = 'mouseenter', theme = 'dark', boundary = 'window', disabled = false} = value
        !!content && !disabled && (el.pl_tippy = Tippy(el, {content, arrow, placement, trigger, theme, boundary}))
    }
    else if ($utils.typeOf(value) === 'string') {
        const content = value
        !!content && (el.pl_tippy = Tippy(el, {content, ...DEFAULT_OPTION}))
    }
}
