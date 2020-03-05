/**
 * 添加class
 * @author 韦胜健
 * @date 2018/11/19
 */
export const addClass = (el, addCLs) => {
    if (!el || !addCLs)
        return;
    let addClasses;
    if (Array.isArray(addCLs)) {
        addClasses = addCLs;
    }
    else {
        addClasses = addCLs.split(' ');
    }
    if (!!el.classList && !!el.classList.value) {
        addClasses.forEach(item => el.classList.add(item));
    }
    else {
        const curClasses = (el.className || '').split(' ');
        addClasses.forEach(item => {
            if (curClasses.indexOf(item) === -1)
                curClasses.push(item);
        });
        el.className = curClasses.join(' ');
    }
};