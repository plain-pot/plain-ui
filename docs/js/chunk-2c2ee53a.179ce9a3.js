(window["webpackJsonp_main-application-project"]=window["webpackJsonp_main-application-project"]||[]).push([["chunk-2c2ee53a"],{2787:function(e,t,n){"use strict";n("b4f0")},"6ef1":function(e,t,n){"use strict";n.r(t);n("99af");var o=n("7a23"),r={class:"demo-use-event"},c={style:{display:"inline-block",width:"360px"}},l=Object(o["k"])("label",{for:"showHeader"},"showHeader",-1),u={style:{display:"inline-block","vertical-align":"top"}},a=Object(o["k"])("div",{class:"demo-popper-content"}," 这里是popper的内容 ",-1);function i(e,t,n,i,s,b){var d=Object(o["B"])("demo-use-event-table"),f=Object(o["B"])("demo-parent"),p=Object(o["B"])("pl-checkbox"),j=Object(o["B"])("pl-button"),O=Object(o["B"])("demo-row");return Object(o["w"])(),Object(o["g"])("div",r,[Object(o["k"])("div",c,[Object(o["k"])("div",null," 当前滚动位置:"+Object(o["D"])(i.state.currentPart?"".concat(i.state.currentPart," (").concat(i.state.count,")"):"无"),1),Object(o["k"])("h3",null,[Object(o["K"])(Object(o["k"])("input",{type:"checkbox",id:"showHeader","onUpdate:modelValue":t[1]||(t[1]=function(e){return i.state.showHeader=e})},null,512),[[o["E"],i.state.showHeader]]),l]),Object(o["k"])(d,{onScroll:i.onScroll,showHeader:i.state.showHeader},null,8,["onScroll","showHeader"])]),Object(o["k"])("ul",u,[(Object(o["w"])(!0),Object(o["g"])(o["a"],null,Object(o["A"])(i.state.tips,(function(e){return Object(o["w"])(),Object(o["g"])("li",{key:e.label},[e.done?Object(o["h"])("",!0):(Object(o["w"])(),Object(o["g"])("button",{key:0,style:{"margin-right":"8px"},onClick:function(){return e.done=!0}},"done",8,["onClick"])),Object(o["k"])("span",null,Object(o["D"])(e.label),1)])})),128))]),Object(o["k"])(f,{onClickBody:t[2]||(t[2]=function(e){return i.log("click-body parent")})}),Object(o["k"])(O,{title:"测试组件销毁之后，监听的事件是否已经销毁"},{default:Object(o["J"])((function(){return[Object(o["k"])(p,{modelValue:i.state.init,"onUpdate:modelValue":t[3]||(t[3]=function(e){return i.state.init=e}),label:"init"},null,8,["modelValue"]),i.state.init?(Object(o["w"])(),Object(o["g"])(f,{key:0,onClickBody:t[4]||(t[4]=function(e){return i.log("click body")})},{popper:Object(o["J"])((function(){return[a]})),default:Object(o["J"])((function(){return[Object(o["k"])(j,{label:"click激活"})]})),_:1})):Object(o["h"])("",!0)]})),_:1})])}n("b680");var s,b=n("7a87"),d=Object(b["a"])({emits:{onClickHeader:function(e){return!0}},setup:function(){var e=Object(o["z"])(null),t=j.use.inject(),n={scroll:function(t,n){n===s.body&&(e.value.scrollLeft=t.target.scrollLeft)},wrapperScroll:function(e){t.state.hoverPart===s.head&&t.event.emit.scroll(e,s.head)},mousewheel:function(t){e.value.scrollLeft=e.value.scrollLeft+t.deltaY}};return t.event.on.scroll(n.scroll),Object(o["s"])((function(){return t.event.off.scroll(n.scroll)})),{render:function(){return Object(o["k"])("div",Object(o["q"])({class:"demo-use-event-table-head",ref:e,onScroll:n.wrapperScroll},{onMousewheel:n.mousewheel}),[Object(o["k"])("div",{class:"demo-use-event-table-head-inner"},[Object(o["j"])("table head")])])}}}}),f=Object(b["a"])({setup:function(){var e=Object(o["z"])(null),t=j.use.inject(),n={scroll:function(t,n){n===s.head&&(e.value.scrollLeft=t.target.scrollLeft)},wrapperScroll:function(e){t.state.hoverPart===s.body&&t.event.emit.scroll(e,s.body)},mousewheel:function(t){t.altKey&&(e.value.scrollLeft=e.value.scrollLeft+t.deltaY,t.preventDefault(),t.stopPropagation())}};return t.event.on.scroll(n.scroll),Object(o["s"])((function(){return t.event.off.scroll(n.scroll)})),{render:function(){return Object(o["k"])("div",Object(o["q"])({class:"demo-use-event-table-body",ref:e,onScroll:n.wrapperScroll},{onMousewheel:n.mousewheel}),[Object(o["k"])("div",{class:"demo-use-event-table-body-inner"},[Object(o["j"])("table "),Object(o["k"])("br",null,null),Object(o["j"])(" body")])])}}}}),p=n("269b");(function(e){e["head"]="head",e["body"]="body"})(s||(s={}));var j=Object(b["a"])({name:"demo-sue-event-table",props:{showHeader:{type:Boolean,default:!0}},emits:{scroll:function(e,t){return!0}},provideRefer:!0,setup:function(e){var t=e.props,n=e.event,r=Object(o["y"])({hoverPart:null});return{refer:{state:r,event:n},render:function(){return Object(o["k"])("div",{class:"demo-use-event-table",onMouseleave:function(){return r.hoverPart=null}},[!!t.showHeader&&Object(o["k"])(d,Object(o["q"])({onClickHeader:function(e){e.toFixed(1)}},Object(p["a"])({onMouseenter:function(){return r.hoverPart=s.head}})),null),Object(o["k"])(f,Object(p["a"])({onMouseenter:function(){return r.hoverPart=s.body}}),null)])}}}}),O=Object(o["l"])({emits:{init:function(){return!0},destroy:function(){return!0},open:function(){return!0},close:function(){return!0},show:function(){return!0},hide:function(){return!0},"update:modelValue":function(e){return!0},"update:open":function(e){return!0},"click-reference":function(e){return!0},"click-popper":function(e){return!0},"click-body":function(e){return!0},"mousedown-popper":function(e){return!0},"enter-reference":function(e){return!0},"leave-reference":function(e){return!0},"enter-popper":function(e){return!0},"leave-popper":function(e){return!0},"reference-focus":function(e){return!0},"reference-blur":function(e){return!0}},setup:function(e,t){return function(){return Object(o["k"])(o["a"],null,[Object(o["k"])("span",null,[Object(o["j"])("SPAN")]),Object(o["k"])("button",{onClick:function(e){t.emit("click-reference",e),t.emit("click-body",e)}},[Object(o["j"])("PARENT BUTTON")])])}}}),v={name:"demo-use-event",components:{DemoUseEventTable:j,DemoParent:O},setup:function(){var e=Object(o["y"])({showHeader:!0,currentPart:null,count:0,init:!0,tips:[{label:"使用鼠标的滚轮进行纵向滚动",done:!1},{label:"拖拽横向滚动条横向联动滚动",done:!1},{label:"在表头、表体使用触摸板横向，以及纵向滚动",done:!1},{label:"在表头使用鼠标滚动横向滚动",done:!1},{label:"在表体使用 alt+鼠标滚动 横向滚动",done:!1}]});return{state:e,onScroll:function(t,n){n===e.currentPart?e.count++:(e.currentPart=n,e.count=0)},log:function(){var e;(e=console).log.apply(e,arguments)}}}};n("2787");v.render=i;t["default"]=v},b4f0:function(e,t,n){}}]);
//# sourceMappingURL=chunk-2c2ee53a.179ce9a3.js.map