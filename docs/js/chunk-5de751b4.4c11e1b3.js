(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-5de751b4"],{4986:function(a,e,o){"use strict";o.r(e);var r=function(){var a=this,e=a.$createElement,o=a._self._c||e;return o("div",{staticClass:"table-columns"},[o("pl-form",[o("pl-form-item",{attrs:{label:"获取选中行"}},[o("pl-button",{on:{click:a.logSelected}},[a._v("$refs.check.getSelected()")])],1),o("pl-form-item",{attrs:{label:"是否开启虚拟滚动"}},[o("pl-toggle",{model:{value:a.virtualFlag,callback:function(e){a.virtualFlag=e},expression:"virtualFlag"}})],1),o("pl-form-item",[o("pl-button-group",{attrs:{disabled:0===a.editNodes.length}},[o("pl-button",{on:{click:a.saveEdit}},[a._v("保存编辑")]),o("pl-button",{on:{click:a.cancelEdit}},[a._v("取消编辑")])],1)],1)],1),o("pl-table",{attrs:{data:a.data,virtual:a.virtualFlag},on:{"dblclick-cell":a.onDblClickRow}},[o("plc-index"),o("plc-check",{ref:"check"}),o("plc",{attrs:{field:"id",title:"编号"}}),o("plc",{attrs:{field:"name",title:"普通文本列"}}),o("plc-input",{attrs:{field:"name",title:"文本框",required:""}}),o("plc-number",{attrs:{field:"size",title:"数字框"}}),o("plc-date",{attrs:{field:"date",title:"日期",required:""}}),o("plc-color-picker",{attrs:{field:"color",title:"颜色"}}),o("plc-rate",{attrs:{field:"star",title:"评分"}}),o("plc-toggle",{attrs:{field:"flag",title:"开关"}})],1)],1)},t=[],i=(o("99af"),o("4de4"),o("4160"),o("a15b"),o("d81d"),o("b0c0"),o("d3b7"),o("3ca3"),o("159b"),o("ddb0"),o("96cf"),o("1da1")),l=o("a3e3"),d={name:"table-columns",data:function(){return{data:l,editNodes:[],virtualFlag:!1}},methods:{onDblClickRow:function(a,e){console.log("tableNode",a),a.isEdit||(a.enableEdit(),this.editNodes.push(a))},saveEdit:function(){var a=this;return Object(i["a"])(regeneratorRuntime.mark((function e(){var o,r,t,i;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,Promise.all(a.editNodes.map((function(a){return a.validate()})));case 2:if(o=e.sent.filter(Boolean),!(o.length>0)){e.next=7;break}return r=o[0],t=r.message,i=r.rowData,a.$message.error("第".concat(i.index+1,"条记录校验不通过，").concat(t)),e.abrupt("return");case 7:a.editNodes.forEach((function(a){return a.saveEdit()})),a.editNodes.forEach((function(a){return a.closeEdit()})),a.editNodes=[];case 10:case"end":return e.stop()}}),e)})))()},cancelEdit:function(){this.editNodes.forEach((function(a){a.cancelEdit()})),this.editNodes=[]},logSelected:function(){var a=this;return Object(i["a"])(regeneratorRuntime.mark((function e(){var o;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:o=a.$refs.check.getSelected(),console.log(o),a.$message(o.map((function(a){return a.data.name})).join(","));case 3:case"end":return e.stop()}}),e)})))()}}},n=d,c=o("2877"),m=Object(c["a"])(n,r,t,!1,null,null,null);e["default"]=m.exports},a3e3:function(a){a.exports=JSON.parse('[{"id":0,"color":"#79c1f2","name":"Sarah","date":"1972-05-16","star":7,"size":44,"addr":"湖北省 随州市 随县","url":"wais://brgwt.cv/wjpruajd","domain":"ognnkjwpk.md","protocol":"prospero","email":"s.akvlkabd@emtb.cg","ip":"95.184.156.49","flag":"N"},{"id":1,"color":"#e4f279","name":"Mark","date":"2000-01-03","star":2,"size":49,"addr":"吉林省 松原市 扶余市","url":"news://qvykgw.li/bmpnbylhr","domain":"jocotk.bd","protocol":"telnet","email":"f.nqcbym@hdwdctfh.hk","ip":"153.46.240.135","flag":"N"},{"id":2,"color":"#dc79f2","name":"Richard","date":"2004-05-11","star":1,"size":76,"addr":"云南省 曲靖市 师宗县","url":"gopher://abvnz.an/ghjnux","domain":"cbap.bh","protocol":"mailto","email":"t.nsmgczm@csdox.ci","ip":"167.1.57.138","flag":"N"},{"id":3,"color":"#79f2b9","name":"Maria","date":"1976-02-07","star":10,"size":72,"addr":"香港特别行政区 九龙 油尖旺区","url":"nntp://cjfqpjfp.th/qgww","domain":"ftx.eg","protocol":"cid","email":"r.ywaiho@gcskrxulq.vg","ip":"53.3.8.112","flag":"N"},{"id":4,"color":"#f29679","name":"Steven","date":"1974-10-01","star":2,"size":49,"addr":"四川省 泸州市 纳溪区","url":"mailto://dvsvga.tn/qbbwsu","domain":"vrfqvy.ne","protocol":"tn3270","email":"f.zpbeffugt@bfprlx.coop","ip":"152.198.180.174","flag":"N"},{"id":5,"color":"#797ff2","name":"Jose","date":"1993-09-06","star":2,"size":66,"addr":"重庆 重庆市 南岸区","url":"nntp://ajuyfwonmx.sc/mfrswfmu","domain":"rdwaky.ar","protocol":"telnet","email":"i.ygjrfrgvsj@swlvfyr.mz","ip":"189.216.42.203","flag":"Y"},{"id":6,"color":"#a2f279","name":"Brenda","date":"1986-06-30","star":3,"size":45,"addr":"宁夏回族自治区 银川市 其它区","url":"mailto://rhpr.lr/jpgbtxj","domain":"urskrmj.ro","protocol":"mid","email":"p.xlprx@mfmyc.se","ip":"230.125.182.237","flag":"Y"},{"id":7,"color":"#f279c6","name":"Kimberly","date":"2000-09-23","star":7,"size":72,"addr":"山西省 阳泉市 矿区","url":"tn3270://syvwsoan.pf/snco","domain":"tgjcbbpw.tc","protocol":"mid","email":"f.lhkkvu@hioytx.km","ip":"167.84.55.10","flag":"N"},{"id":8,"color":"#79e9f2","name":"Jeffrey","date":"2015-06-09","star":3,"size":57,"addr":"安徽省 阜阳市 阜南县","url":"nntp://hlanu.kr/gyxtsmoa","domain":"xkqqyccoi.so","protocol":"rlogin","email":"v.nceg@ysnxrvud.cr","ip":"131.131.115.30","flag":"N"},{"id":9,"color":"#f2d779","name":"Elizabeth","date":"2004-06-25","star":4,"size":59,"addr":"云南省 德宏傣族景颇族自治州 盈江县","url":"tn3270://msnpqkzeol.cz/wcdlbwd","domain":"kcwyp.nz","protocol":"ftp","email":"q.gnvnzk@hcwfm.dk","ip":"159.200.140.120","flag":"Y"},{"id":10,"color":"#b479f2","name":"Cynthia","date":"1994-12-14","star":2,"size":47,"addr":"山西省 长治市 沁县","url":"nntp://veofjmamw.tv/mgdmh","domain":"nmyrlk.kw","protocol":"http","email":"z.rwhovntj@yehjpif.cr","ip":"35.95.56.5","flag":"Y"},{"id":11,"color":"#79f290","name":"Jessica","date":"1987-01-10","star":2,"size":40,"addr":"云南省 怒江傈僳族自治州 其它区","url":"mid://ohuekvf.ch/xbvow","domain":"dma.jp","protocol":"mid","email":"g.upvgndh@vbyyutvp.fm","ip":"56.69.32.164","flag":"N"},{"id":12,"color":"#f27984","name":"Maria","date":"2011-05-26","star":3,"size":78,"addr":"河南省 驻马店市 泌阳县","url":"nntp://bvax.gu/lutxc","domain":"xzswboxg.cy","protocol":"http","email":"y.rflgyp@jmijcp.mil","ip":"147.98.131.242","flag":"N"},{"id":13,"color":"#79a8f2","name":"Michelle","date":"1988-01-23","star":5,"size":65,"addr":"山东省 烟台市 招远市","url":"mailto://cuqiqc.py/hvsapbfg","domain":"hlkln.za","protocol":"gopher","email":"g.yzfhvsqh@zeqjz.name","ip":"97.53.128.85","flag":"N"},{"id":14,"color":"#cbf279","name":"Joseph","date":"2003-04-30","star":3,"size":47,"addr":"台湾 云林县 土库镇","url":"tn3270://sqruo.pw/qsbimclp","domain":"uoobpss.nc","protocol":"cid","email":"b.xlut@pavdvw.int","ip":"247.248.216.96","flag":"N"},{"id":15,"color":"#f279ee","name":"Mark","date":"2009-09-20","star":8,"size":51,"addr":"香港特别行政区 香港岛 南区","url":"telnet://rujteqska.aero/btajwgv","domain":"ysrbejj.cc","protocol":"tn3270","email":"q.njeew@xvgo.net","ip":"244.232.55.25","flag":"N"},{"id":16,"color":"#79f2d2","name":"Mark","date":"2018-11-01","star":7,"size":60,"addr":"浙江省 台州市 温岭市","url":"telnet://jzmhycjj.bw/viertq","domain":"dnygqs.gu","protocol":"nntp","email":"q.lftktwr@txxmjrcm.uk","ip":"85.103.80.232","flag":"Y"},{"id":17,"color":"#f2af79","name":"Donald","date":"2014-09-11","star":5,"size":59,"addr":"陕西省 延安市 宜川县","url":"rlogin://tujpbuhvj.ck/zepytibh","domain":"wpwmf.travel","protocol":"prospero","email":"f.ddy@uyprggo.ng","ip":"136.30.239.101","flag":"N"},{"id":18,"color":"#8b79f2","name":"Anthony","date":"2010-06-26","star":10,"size":57,"addr":"辽宁省 抚顺市 顺城区","url":"gopher://wtcq.cn/knknob","domain":"wjoa.lk","protocol":"mailto","email":"f.jwbktejbx@nsin.gw","ip":"219.207.102.67","flag":"Y"},{"id":19,"color":"#89f279","name":"Nancy","date":"2017-09-24","star":7,"size":76,"addr":"台湾 嘉义县 溪口乡","url":"mid://bxclfvuqu.cx/azefva","domain":"fwyexvre.gn","protocol":"cid","email":"v.rxd@kiummq.mt","ip":"65.32.57.30","flag":"N"},{"id":20,"color":"#f279ad","name":"Donna","date":"1996-09-28","star":5,"size":42,"addr":"宁夏回族自治区 银川市 灵武市","url":"ftp://mjdvwg.sc/yudjietm","domain":"oqmi.ck","protocol":"telnet","email":"v.lsygmb@ucvoibn.biz","ip":"17.33.109.168","flag":"N"},{"id":21,"color":"#79d0f2","name":"Maria","date":"2002-03-22","star":5,"size":42,"addr":"海外 海外 -","url":"cid://ylgugwrou.kn/rvngsyytdd","domain":"qlkyhzoff.af","protocol":"ftp","email":"k.uromfgt@oosvfx.fi","ip":"76.52.67.164","flag":"N"},{"id":22,"color":"#f2f079","name":"Eric","date":"1977-05-18","star":0,"size":67,"addr":"甘肃省 甘南藏族自治州 迭部县","url":"telnet://jyd.co/bzwux","domain":"tptqrypts.co","protocol":"mid","email":"n.uyokkue@veeqi.mv","ip":"32.97.191.73","flag":"N"},{"id":23,"color":"#cd79f2","name":"Kenneth","date":"1982-04-07","star":6,"size":60,"addr":"青海省 黄南藏族自治州 尖扎县","url":"nntp://oyg.tf/vbnvyyhw","domain":"xpluwrjwss.ws","protocol":"telnet","email":"q.ziuswa@apxywbdw.ru","ip":"39.30.230.203","flag":"N"},{"id":24,"color":"#79f2a9","name":"Joseph","date":"1994-07-29","star":7,"size":65,"addr":"山西省 长治市 平顺县","url":"wais://gsohq.uy/ggeeqaucg","domain":"bmwmtkg.us","protocol":"news","email":"i.ouprxqvvq@enij.ye","ip":"21.89.73.30","flag":"Y"},{"id":25,"color":"#f28679","name":"Amy","date":"2006-07-02","star":4,"size":65,"addr":"广西壮族自治区 贺州市 昭平县","url":"ftp://rmocv.mn/opoc","domain":"olljy.se","protocol":"http","email":"e.euu@krteztg.ly","ip":"8.35.160.19","flag":"Y"},{"id":26,"color":"#798ef2","name":"Lisa","date":"2007-01-08","star":5,"size":57,"addr":"广东省 河源市 连平县","url":"gopher://hoypx.vc/jddsuergus","domain":"hyxxulc.tel","protocol":"cid","email":"d.xlnso@jgpks.tp","ip":"98.185.126.242","flag":"N"},{"id":27,"color":"#b2f279","name":"Timothy","date":"1973-03-28","star":8,"size":76,"addr":"香港特别行政区 香港岛 湾仔","url":"wais://ptgv.yu/oetnkavr","domain":"vbrkluzag.bg","protocol":"rlogin","email":"y.ugdkes@pcjgyslbh.lb","ip":"101.98.189.27","flag":"N"},{"id":28,"color":"#f279d5","name":"Lisa","date":"1995-10-02","star":5,"size":59,"addr":"浙江省 宁波市 余姚市","url":"tn3270://mrnbbmtc.ai/sgjxhyz","domain":"ldvsfhtnj.lt","protocol":"mailto","email":"y.doelxt@mxxdf.mp","ip":"54.69.195.83","flag":"N"},{"id":29,"color":"#79f2eb","name":"Kimberly","date":"1998-12-10","star":5,"size":67,"addr":"山东省 淄博市 其它区","url":"cid://qxuqxdqdwq.ro/igbvqow","domain":"fqisdpha.mm","protocol":"ftp","email":"t.kisthlrpi@umlx.pl","ip":"97.162.105.19","flag":"Y"},{"id":30,"color":"#f2c879","name":"Christopher","date":"1988-06-18","star":6,"size":53,"addr":"广西壮族自治区 贵港市 覃塘区","url":"wais://vuyocn.gf/afopbsp","domain":"qhwnnrrkc.cf","protocol":"rlogin","email":"e.xvooqk@qefg.bs","ip":"226.196.5.72","flag":"Y"},{"id":31,"color":"#a479f2","name":"David","date":"1993-11-03","star":3,"size":43,"addr":"吉林省 辽源市 东辽县","url":"gopher://thout.gn/iksnlisd","domain":"nzkwvgwr.lt","protocol":"http","email":"h.kmdnernld@vxzhrfwsv.ye","ip":"199.4.178.158","flag":"N"},{"id":32,"color":"#79f281","name":"Richard","date":"1975-09-07","star":7,"size":64,"addr":"甘肃省 陇南市 其它区","url":"mailto://ksrgzin.pl/alpxu","domain":"ushrxfb.mv","protocol":"telnet","email":"k.eovkoh@tcepve.ve","ip":"37.185.54.23","flag":"Y"},{"id":33,"color":"#f27994","name":"Jennifer","date":"2019-09-19","star":6,"size":50,"addr":"湖北省 黄石市 黄石港区","url":"cid://nbhhfwr.ls/naxmd","domain":"lvpvg.np","protocol":"nntp","email":"n.prxdajc@limn.vn","ip":"194.81.188.243","flag":"Y"},{"id":34,"color":"#79b7f2","name":"Barbara","date":"2001-02-22","star":0,"size":68,"addr":"西藏自治区 昌都地区 左贡县","url":"mid://vpsjfh.ae/iksks","domain":"kswwkqoufg.bn","protocol":"nntp","email":"g.hppy@bwbqjpau.bi","ip":"225.242.139.183","flag":"Y"},{"id":35,"color":"#daf279","name":"George","date":"1990-11-25","star":4,"size":45,"addr":"云南省 西双版纳傣族自治州 勐海县","url":"gopher://wlgh.cq/xutpxyolv","domain":"dweelrh.bm","protocol":"mailto","email":"r.gvltfjxt@nkefs.lc","ip":"239.27.67.36","flag":"Y"},{"id":36,"color":"#e679f2","name":"Jennifer","date":"2016-11-18","star":9,"size":54,"addr":"青海省 海北藏族自治州 祁连县","url":"cid://aowrilf.bt/qktcielqrk","domain":"epuhfll.td","protocol":"ftp","email":"g.dpytmcnwf@qieuph.kp","ip":"186.37.210.77","flag":"Y"},{"id":37,"color":"#79f2c2","name":"Dorothy","date":"1997-02-12","star":0,"size":75,"addr":"江西省 景德镇市 浮梁县","url":"nntp://xeyeb.mo/ykbcvggml","domain":"phex.qa","protocol":"mid","email":"n.qnvozttrp@vippdvmus.aero","ip":"64.104.188.44","flag":"Y"},{"id":38,"color":"#f29f79","name":"Steven","date":"1993-06-10","star":0,"size":49,"addr":"贵州省 黔西南布依族苗族自治州 晴隆县","url":"mid://rlekhkrpti.pk/tyky","domain":"xsaqhnosv.kp","protocol":"rlogin","email":"s.vinn@hwmql.tp","ip":"153.50.185.12","flag":"Y"},{"id":39,"color":"#7c79f2","name":"Barbara","date":"1974-06-06","star":9,"size":49,"addr":"海外 海外 -","url":"tn3270://uthn.dm/miwb","domain":"eztf.qa","protocol":"mid","email":"j.gxyd@wumhhfuua.gi","ip":"74.47.118.30","flag":"N"},{"id":40,"color":"#99f279","name":"Brenda","date":"2019-05-27","star":5,"size":63,"addr":"浙江省 宁波市 慈溪市","url":"wais://lcxeups.ly/czmqprk","domain":"rakaxjtpwm.aero","protocol":"nntp","email":"j.wziygz@jhxeki.ml","ip":"34.28.9.253","flag":"Y"},{"id":41,"color":"#f279bc","name":"Maria","date":"2012-03-17","star":2,"size":54,"addr":"香港特别行政区 九龙 九龙城区","url":"news://ztxq.vn/qwjq","domain":"jcbah.an","protocol":"prospero","email":"t.booe@pml.pt","ip":"50.55.133.163","flag":"Y"},{"id":42,"color":"#79dff2","name":"David","date":"1997-06-02","star":9,"size":50,"addr":"吉林省 松原市 长岭县","url":"telnet://hrynix.mc/jbxy","domain":"kueg.bz","protocol":"mid","email":"c.exfivnie@gfhogejhh.tv","ip":"59.206.91.81","flag":"N"},{"id":43,"color":"#f2e179","name":"Mary","date":"1996-08-23","star":5,"size":74,"addr":"北京 北京市 朝阳区","url":"ftp://jxdg.py/mcxiqscc","domain":"xtfw.gp","protocol":"rlogin","email":"j.mudzgvstn@xwmp.ph","ip":"45.209.227.171","flag":"N"},{"id":44,"color":"#bd79f2","name":"Kimberly","date":"1971-07-06","star":4,"size":50,"addr":"天津 天津市 宝坻区","url":"gopher://qujkvyxrn.np/pjqrjiw","domain":"ujct.vg","protocol":"gopher","email":"t.lkktjak@bpcxldb.su","ip":"233.184.166.26","flag":"Y"},{"id":45,"color":"#79f29a","name":"George","date":"2002-08-18","star":7,"size":52,"addr":"河北省 保定市 清苑县","url":"ftp://xqi.vn/pqrufer","domain":"moufl.museum","protocol":"nntp","email":"u.vyguwl@xmxaxvhhpm.sg","ip":"219.101.41.28","flag":"N"},{"id":46,"color":"#f2797b","name":"Elizabeth","date":"1993-10-22","star":5,"size":59,"addr":"山东省 烟台市 招远市","url":"gopher://bhq.ca/lcovvj","domain":"iarnc.ly","protocol":"gopher","email":"i.cvgos@ftesiat.il","ip":"151.171.217.210","flag":"Y"},{"id":47,"color":"#799ef2","name":"Shirley","date":"1981-08-23","star":8,"size":69,"addr":"内蒙古自治区 包头市 固阳县","url":"telnet://vfz.re/axxxmd","domain":"jxqh.pw","protocol":"rlogin","email":"g.munntovnh@lvql.cz","ip":"196.202.67.80","flag":"N"},{"id":48,"color":"#c1f279","name":"Lisa","date":"2006-06-13","star":7,"size":77,"addr":"福建省 南平市 邵武市","url":"http://ggegat.iq/ozbq","domain":"tzunqy.ie","protocol":"cid","email":"j.tsbwp@yswir.cx","ip":"217.65.102.130","flag":"N"},{"id":49,"color":"#f279e5","name":"Jeffrey","date":"1975-05-01","star":9,"size":75,"addr":"天津 天津市 东丽区","url":"mid://oscbrqlrm.nf/vfhtghovnb","domain":"hpvd.cf","protocol":"tn3270","email":"z.vwbjfd@upddxclgg.al","ip":"112.137.87.49","flag":"Y"}]')}}]);
//# sourceMappingURL=chunk-5de751b4.4c11e1b3.js.map