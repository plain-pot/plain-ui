import $utils from './utils'

/**
 * 向下查找组件
 * @author 韦胜健
 * @date 2018/11/19
 */
function findComponentsDownward(context, componentName) {
    return context.$children.reduce((components, child) => {
        if (child.$options.name === componentName) components.push(child);
        const foundChilds = findComponentsDownward(child, componentName);
        return components.concat(foundChilds);
    }, []);
}

/**
 * 向上查找组件
 * @author 韦胜健
 * @date 2018/11/19
 */
function findComponentsUpward(context, componentName) {
    let parents = [];
    const parent = context.$parent;
    if (parent) {
        if (parent.$options.name === componentName) parents.push(parent);
        return parents.concat(findComponentsUpward(parent, componentName));
    } else {
        return [];
    }
}

/**
 * 向上查找一个组件
 * @author 韦胜健
 * @date 2018/11/19
 */
function findComponentUpward(context, componentName, componentNames) {
    if (typeof componentName === 'string') {
        componentNames = [componentName];
    } else {
        componentNames = componentName;
    }

    let parent = context.$parent;
    let name = parent.$options.name;
    while (parent && (!name || componentNames.indexOf(name) < 0)) {
        parent = parent.$parent;
        if (parent) name = parent.$options.name;
    }
    return parent;
}

/**
 * 是否包含某种样式class
 * @author 韦胜健
 * @date 2018/11/19
 */
function hasClass(el, cls) {
    if (!!el.classList && !!el.classList.value) return $utils.oneOf(cls, el.classList.value.split(' '));
    else return (el.className || '').split(' ').indexOf(cls) > -1
}

/**
 * 添加class
 * @author 韦胜健
 * @date 2018/11/19
 */
function addClass(el, addCLs) {
    if (!el || !addCLs) return;
    const addClasses = $utils.typeOf(addCLs) === 'string' ? addCLs.split(' ') : addCLs
    if (!!el.classList && !!el.classList.value) {
        addClasses.forEach(item => el.classList.add(item))
    } else {
        const curClasses = (el.className || '').split(' ')
        addClasses.forEach(item => {
            if (curClasses.indexOf(item) === -1) curClasses.push(item)
        })
        el.className = curClasses.join(' ')
    }
}

/**
 * 删除class
 * @author 韦胜健
 * @date 2018/11/19
 */
function removeClass(el, rmCls) {
    if (!el || !rmCls) return;
    const rmClasses = $utils.typeOf(rmCls) === 'string' ? rmCls.split(' ') : rmCls
    if (!!el.classList && !!el.classList.value) {
        rmClasses.forEach(item => el.classList.remove(item))
    } else {
        const curClasses = (el.className || '').split(' ')
        for (let i = 0; i < rmClasses.length; i++) {
            const rmClass = rmClasses[i];
            const index = curClasses.indexOf(rmClass)
            if (index > -1) {
                curClasses.splice(index, 1)
                i--
            }
        }
        el.className = curClasses.join(' ')
    }
}

/**
 * 在元素节点后面添加新的节点
 * @author 韦胜健
 * @date 2018/11/19
 */
function insertAfter(newEl, targetEl) {
    let parentEl = targetEl.parentNode;
    if (parentEl.lastChild === targetEl) {
        // 如果最后的节点是目标元素，则直接添加。因为默认是最后
        parentEl.appendChild(newEl);
    } else {
        //如果不是，则插入在目标元素的下一个兄弟节点 的前面。也就是目标元素的后面
        parentEl.insertBefore(newEl, targetEl.nextSibling);
    }
}

/*
 *  禁用全局选择文字功能
 *  @author     martsforever
 *  @datetime   2018/12/28 20:56
 */
function enableSelectNone() {
    addClass(window.document.body, 'pl-body-user-select-none')
}

/*
 *  启用全局选择文字功能
 *  @author     martsforever
 *  @datetime   2018/12/28 20:56
 */
function disabledSelectNone() {
    removeClass(window.document.body, 'pl-body-user-select-none')
}

const $dom = {
    findComponentsDownward,
    findComponentsUpward,
    findComponentUpward,
    hasClass,
    addClass,
    removeClass,
    insertAfter,
    enableSelectNone,
    disabledSelectNone,
}

export default $dom
