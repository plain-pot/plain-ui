(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-2d208fcd"],{a6ac:function(t,e,n){"use strict";n.r(e);var r=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"popper-service"},[n("demo-row",{attrs:{title:"基本用法"}},[n("pl-button",{ref:"test1",attrs:{label:"open popper"},on:{click:function(e){return t.test1.toggle()}}})],1),n("demo-row",{attrs:{title:"popper参数"}},[n("pl-button",{ref:"testPopper",attrs:{label:"open popper"},on:{click:function(e){return t.testPopper.toggle()}}})],1),n("demo-row",{attrs:{title:"实例复用"}},[n("pl-button",{ref:"instance1",attrs:{label:"instance1"},on:{click:function(e){return t.instance1.toggle()}}}),n("pl-button",{ref:"instance2",attrs:{label:"instance2"},on:{click:function(e){return t.instance2.toggle()}}}),n("pl-button",{ref:"instance3",attrs:{label:"instance3"},on:{click:function(e){return t.instance3.toggle()}}})],1),n("demo-row",{attrs:{title:"私有实例"}},[n("pl-button",{ref:"privateTest",attrs:{label:"私有实例"},on:{click:function(e){return t.privateTest.toggle()}}}),n("pl-button",{ref:"normalTest",attrs:{label:"普通实例"},on:{click:function(e){return t.normalTest.toggle()}}})],1)],1)},i=[],o=(n("96cf"),n("1da1")),a=n("5530"),s={name:"popper-service",props:{},data:function(){var t=this,e=(this.$createElement,function(e,n){var r={service:null,option:Object(a["a"])({reference:function(){return t.$refs[e]}},n),toggle:function(){var e=Object(o["a"])(regeneratorRuntime.mark((function e(){return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:if(r.service){e.next=4;break}return e.next=3,t.$popper(r.option);case 3:r.service=e.sent;case 4:r.service.toggle();case 5:case"end":return e.stop()}}),e)})));function n(){return e.apply(this,arguments)}return n}()};return r}),n=e("test1",{render:function(){var t=arguments[0];return t("div",["Hello world"])}}),r=e("testPopper",{popperProps:{placement:"right-start",width:"100px",height:"200px",transition:"pl-transition-scale-y"},render:function(){var t=arguments[0];return t("div",[t("p",["右固定"]),t("p",["宽100px，高200px"]),t("p",["纵向缩放动画"])])}}),i=e("instance1",{render:function(){var t=arguments[0];return t("div",["instance1"])}}),s=e("instance2",{render:function(){var t=arguments[0];return t("div",["instance2"])}}),c=e("instance3",{render:function(){var t=arguments[0];return t("div",["instance3"])}}),p=e("privateTest",{private:!0,render:function(){var t=arguments[0];return t("div",[t("pl-input")])}}),l=e("normalTest",{render:function(){var t=arguments[0];return t("div",[t("pl-input")])}});return{test1:n,testPopper:r,instance1:i,instance2:s,instance3:c,privateTest:p,normalTest:l}},methods:{},beforeDestroy:function(){this.privateTest.service&&this.privateTest.service.destroy()}},c=s,p=n("2877"),l=Object(p["a"])(c,r,i,!1,null,null,null);e["default"]=l.exports}}]);
//# sourceMappingURL=chunk-2d208fcd.dff92c75.js.map