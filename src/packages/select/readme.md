总觉得通过 data+labelKey+valueKey 的形式很不灵活，还是改成 select+option的形式会好很多。
但是这个的缺点就是难在怎么获取所有的select-option，现在的解决方案是这样的：

1. input增加一个hidden插槽，用来隐藏内容；
2. 在hidden插槽中渲染内容，收集子组件，但是这个子组件不渲染内容，只是用来收集props；
3. 在agentState中在渲染一遍内容，不过得有容器组件 pl-select-panel，这个 pl-select-panel负责处理
pl-select-option的点击事件、键盘按键事件等等；