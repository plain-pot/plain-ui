(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-2d0abfaf"],{"181c":function(a,r,e){"use strict";e.r(r);var t=function(){var a=this,r=a.$createElement,e=a._self._c||r;return e("div",{staticClass:"test-drag"},[e("button",{attrs:{draggable:"true"},on:{dragstart:a.draggable.source.dragstart,drag:a.draggable.source.drag,dragend:a.draggable.source.dragend,dragexit:a.draggable.source.dragexit}},[a._v("\n        test-drag\n    ")]),e("div",{staticStyle:{height:"100px",width:"100px","background-color":"#12b4a5"},on:{dragenter:a.draggable.target.dragenter,dragover:a.draggable.target.dragover,dragleave:a.draggable.target.dragleave,drop:a.draggable.target.drop}}),e("div",{staticStyle:{height:"100px",width:"100px","background-color":"#FFB273"},on:{dragenter:a.draggable.target.dragenter,dragover:a.draggable.target.dragover,dragleave:a.draggable.target.dragleave,drop:a.draggable.target.drop}})])},d=[],g={name:"test-drag",props:{},data:function(){var a,r,e=this;return{draggable:{source:{dragstart:function(r){r.dataTransfer.effectAllowed="move",a=r.target},drag:function(a){},dragend:function(t){r=r||e.$el,r.appendChild(a)},dragexit:function(a){}},target:{dragenter:function(a){a.dataTransfer.dropEffect="move",r=a.target},dragover:function(a){a.preventDefault()},dragleave:function(a){a.dataTransfer.dropEffect="none",r===a.target&&(r=null)},drop:function(a){a.preventDefault()}}}}},methods:{},mounted:function(){}},n=g,o=e("2877"),l=Object(o["a"])(n,t,d,!1,null,null,null);r["default"]=l.exports}}]);
//# sourceMappingURL=chunk-2d0abfaf.afa0a1a0.js.map