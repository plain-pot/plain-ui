(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-2d208fcd"],{a6ac:function(e,t,r){"use strict";r.r(t);var n=function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("div",{staticClass:"popper-service"},[r("demo-row",{attrs:{title:"基本用法"}},[r("pl-button",{ref:"test1",attrs:{label:"open popper"},on:{click:function(t){return e.test1.toggle()}}})],1),r("demo-row",{attrs:{title:"popper参数"}},[r("pl-button",{ref:"testPopper",attrs:{label:"open popper"},on:{click:function(t){return e.testPopper.toggle()}}})],1),r("demo-row",{attrs:{title:"实例复用"}},[r("pl-button",{ref:"instance1",attrs:{label:"instance1"},on:{click:function(t){return e.instance1.toggle()}}}),r("pl-button",{ref:"instance2",attrs:{label:"instance2"},on:{click:function(t){return e.instance2.toggle()}}}),r("pl-button",{ref:"instance3",attrs:{label:"instance3"},on:{click:function(t){return e.instance3.toggle()}}})],1),r("demo-row",{attrs:{title:"私有实例"}},[r("pl-button",{ref:"privateTest",attrs:{label:"私有实例"},on:{click:function(t){return e.privateTest.toggle()}}}),r("pl-button",{ref:"normalTest",attrs:{label:"普通实例"},on:{click:function(t){return e.normalTest.toggle()}}})],1)],1)},i=[],o=(r("8e6e"),r("ac6a"),r("456d"),r("96cf"),r("3b8d")),c=(r("7f7f"),r("bd86"));function a(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function s(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?a(Object(r),!0).forEach((function(t){Object(c["a"])(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):a(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}var p={name:"popper-service",props:{},data:function(){var e=this,t=(this.$createElement,function(t,r){var n={service:null,option:s({reference:function(){return e.$refs[t]}},r),toggle:function(){var t=Object(o["a"])(regeneratorRuntime.mark((function t(){return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:if(n.service){t.next=4;break}return t.next=3,e.$popper(n.option);case 3:n.service=t.sent;case 4:n.service.toggle();case 5:case"end":return t.stop()}}),t)})));function r(){return t.apply(this,arguments)}return r}()};return n}),r=t("test1",{render:function(){var e=arguments[0];return e("div",["Hello world"])}}),n=t("testPopper",{popperProps:{placement:"right-start",width:"100px",height:"200px",transition:"pl-transition-scale-y"},render:function(){var e=arguments[0];return e("div",[e("p",["右固定"]),e("p",["宽100px，高200px"]),e("p",["纵向缩放动画"])])}}),i=t("instance1",{render:function(){var e=arguments[0];return e("div",["instance1"])}}),c=t("instance2",{render:function(){var e=arguments[0];return e("div",["instance2"])}}),a=t("instance3",{render:function(){var e=arguments[0];return e("div",["instance3"])}}),p=t("privateTest",{private:!0,render:function(){var e=arguments[0];return e("div",[e("pl-input")])}}),u=t("normalTest",{render:function(){var e=arguments[0];return e("div",[e("pl-input")])}});return{test1:r,testPopper:n,instance1:i,instance2:c,instance3:a,privateTest:p,normalTest:u}},methods:{},beforeDestroy:function(){this.privateTest.service&&this.privateTest.service.destroy()}},u=p,l=r("2877"),f=Object(l["a"])(u,n,i,!1,null,null,null);t["default"]=f.exports}}]);
//# sourceMappingURL=chunk-2d208fcd.15798f51.js.map