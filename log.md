#### Vue队列动画失效的一个问题：
在迁移MessageService的时候，队列过度动画一直有问题，就是消失的时候，后一项是直接瞬移到消失一项的位置上去的，而不是缓慢移动，
后面检查了多番原因，原来是new Vue(component)的时候有点问题，
通过这种模式手手动创建一个vue实例是不行的，队列动画不起作用
```js
const ins = new Vue(component).$mount()
document.body.appendChild(ins.$el)
```
或者这样也不行
```js
const container = document.createElement('div')
document.body.appendChild(container)
const ins = new Vue({
        el:container,
        ...component
    }).$mount()
```
必须得这样手动创建一个实例，队列动画才能生效

```js
const container = document.createElement('div')
document.body.appendChild(container)

const ins = new VUe({
    render:h=>h(component),
    el:container
}).$mount()
return ins.$children[0]
```