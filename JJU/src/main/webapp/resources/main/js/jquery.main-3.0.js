/*
 * Salmon 공용 스크립트
 *
 * @author
 * @date
 * @since
 */
 
(function ($) {
    $(document).on("keydown", function(e){
        if ((e.which || e.keyCode) == 116) e.preventDefault(); // F5
        if (e.keyCode == 65 && e.ctrlKey) e.preventDefault(); // Crtl + R
    });

    /*-------------------------------------
     * Ajax 전송 : 글로벌 설정
     -------------------------------------*/

    // 중첩 배열 객체 직렬화를 사용하지 않음
    jQuery.ajaxSettings.traditional = true;

    $.ajaxSetup({
        beforeSend: function(xhr) {
            SM.ajaxStart();
        },
        success: function(response) {
        },
        error: function(xhr) {
            SM.ajaxError(xhr);
        },
        complete: function(xhr, status) {
            SM.ajaxDone();
        }
    });

    SM = {
        ajaxStart: function() {
            NProgress.start();
        },
        ajaxDone: function() {
            NProgress.done();
        },
        ajaxError: function(xhr) {

            var text = SM.crgRtn(xhr.responseText);
            if (text != "") alert(xhr.status + " : " + text);

            var statusCode = xhr.status;

            /* 페이지 없음 */
            if (statusCode == 404) {
            }
            /* 권한 없음 */
            else if (statusCode == 401) {
            }
            /* 대리인 접근 거부 URL */
            else if (statusCode == 406) {
            }
            /* 로그인 세션 소멸 */
            else if (statusCode == 511) {
                top.location.href = CTX_PATH + "/login";
            }
            /* Server error */
            else if (statusCode == 500) {
            }
            else {
            }

            NProgress.done();
        },
        /*-------------------------------------
         * AJAX 전송 : 폼 서브밋, 버튼 클릭 이벤트
         -------------------------------------*/
        submit: function(e, option, callback) {
            var me = this;
            var isClick = true, el, btn;
            var ignoreMsg = option.ignoreMsg || false;

            if (e) {
                /* type을 체크하므로 넘어오는 form에 input[name=type] 값이 있으면 안됨 */
                isClick = e.type ? true : false;
                el = isClick ? $(e) : $(e).find("button[type=submit]");
            }

            option = $.extend(true, {
                type: "POST",
                beforeSend: function(xhr) {
                    if (el) SM.showLoad(el);
                    //if (parent.statusBusy) parent.statusBusy();
                },
                success: function(response) {
                    //console.log("success : " + response);
                },
                error: function(xhr) {
                    //console.log("error : " + xhr.readyState + "_" + xhr.status);
                },
                complete: function(xhr) {

                    var messages = me.parseMsg(xhr.responseText);

                    if (!ignoreMsg) {
                        if (messages.code == 200) {
                            alert(messages.text);
                            //if (parent.statusClear) parent.statusClear();
                        }
                        else {
                            alert(messages.text);
                            //if (parent.statusError) parent.statusError(messages.text);
                        }
                    }

                    if (el) SM.hideLoad(el);

                    if (callback) {
                        callback(messages, xhr);
                    }
                }
            }, option);

            if (isClick) {
                $.ajax(option);
            }
            else {
                $(e).ajaxSubmit(option);
            }
        },
        /*-------------------------------------
         * 클릭 대상 버튼에  AJAX indicator 표시
         -------------------------------------*/
        showLoad: function(el) {
            if (el) {
                var btn = el;
                el.attr("disabled", true);
                return btn;
            }
            return el;
        },
        /*-------------------------------------
         * AJAX indicator 숨김 (기존 버튼 표시)
         -------------------------------------*/
        hideLoad: function(el) {
            if (el) el.attr("disabled", false);
        },
        /*-------------------------------------
         * 특정 selector 영역에 AJAX indicator 표시
         -------------------------------------*/
        showLoadDiv: function(el) {
            var loadLoader = "<div><span class='t3-loader'>&nbsp;</span></div>";
            $(el).html(loadLoader);
        },
        /*-------------------------------------
         * AJAX indicator 숨김
         -------------------------------------*/
        hideLoadDiv: function(el) {
            $(el).html("");
        },
        /*-------------------------------------
         * AJAX 처리결과 메시지 파싱
         -------------------------------------*/
        parseMsg: function(msg) {

            var me = this;
            msg = me.cleanHtml(msg);

            var message = {};

            if ( !isNaN(msg) ) {
                message.code = 500;
                message.text = "처리결과 정보의 형식이 잘못되었습니다.\n\n결과정보 : " + msg;
            }
            else {
                var msgs = msg.split("|");

                if (1 == msgs.length) {
                    message.code = 500;
                    message.text = me.crgRtn(msgs[0]);
                }
                else if ( msgs.length == 2 ) {
                    message.code = msgs[0];
                    message.text = me.crgRtn(msgs[1]);
                }
                else if ( msgs.length == 3 ) {
                    message.code = msgs[0];
                    message.text = me.crgRtn(msgs[1]);
                    message.dummy = msgs[2];
                }
                else {
                    message.code = 500;
                    message.text = "처리결과 정보의 형식이 잘못되었습니다.\n\n결과정보 : " + msg;
                }
            }
            return message;
        },
        /*-------------------------------------
         * HTML 제거
         -------------------------------------*/
        cleanHtml: function(msg) {
            if (!msg) return "";
            return msg.replace(/<\/?[^>]+(>|$)/g, "");
        },
        /*-------------------------------------
         * 새 라인 문자를 자바스크립트가 해석할 수 있도록 변환
         -------------------------------------*/
        crgRtn: function(msg) {
            if (!msg) return "";
            return msg.split("\\n").join("\n");
        },
        /*-------------------------------------
         * Override Ext.getCmp
         -------------------------------------*/
        getCmp: function(id) {
            // return top.$('#main-iframe').get(0).contentWindow.Ext.getCmp(id);
            return Ext.getCmp(id);
        },
        /*-------------------------------------
         * 모달 창 띄우기
         -------------------------------------*/
        // modalObj: null,
        modal: function(paramOption) {

            SM.modalClose();

            var userOption = {
                width: "50%",
                height: "50%",
                y: -1,
                closable: true,
                popup: false,
                popupId: "_pop_"
            };

            userOption = $.extend(true, userOption, paramOption);

            if ( isNaN(userOption.width) && userOption.width.indexOf("%") != -1 ) {
                var _w = parseFloat(userOption.width);
                userOption.width = $(document).width()*(_w*0.01);
            }
            if ( isNaN(userOption.height) && userOption.height.indexOf("%") != -1 ) {
                var _h = parseFloat(userOption.height);
                userOption.height = $(document).height()*(_h*0.01);
            }

            if (userOption.popup) {
                var toph  = screen.height / 2 - userOption.height / 2 - 50;
                var left = screen.width / 2 - userOption.width / 2 ;
                var pwin = window.open(userOption.loadUrl, userOption.popupId,
                        'width=' + userOption.width + ', height=' + userOption.height + ', top=' + toph +
                        ', left=' + left + ', scrollbars=yes, resizable=no, status=yes, toolbar=no, menubar=no');

                if (pwin) pwin.focus();

                return pwin;
            }
            else {
                if (!userOption.title) {

                }
                var dialogEl = $('<div id="sm-modal" style="display: none;" class="loading"><iframe id="modal-iframe" width="100%" height="100%" title="' + userOption.title + '" scrolling="auto"></iframe></div>');
                /* dialogEl.appendTo( top.$('body') ); */
                dialogEl.appendTo( $('body') );

                // open the dialog
                /* top.SM.modalObj = dialogEl.dialog({ */
                /*this.modalObj = */dialogEl.dialog({
                    // add a close listener to prevent adding multiple divs to the document
                    open: function(ev, ui){
                        /* top.$("#modal-iframe").attr("src", userOption.loadUrl); */
                        $("#modal-iframe").attr("src", userOption.loadUrl);
                        if ( !userOption.closable ) {
                            $(".ui-dialog-titlebar-close").hide();
                        }
                    },
                    close: function(event, ui) {
                        // remove div with all data and events
                        dialogEl.remove();
                    },
                    title: SYSTEM_NM,
                    height: userOption.height,
                    width: userOption.width,
                    position: {
                        my: "center top",
                        at: "center top"
                    },
                    autoOpen: false,
                    modal: true
                });

                /* top.SM.modalObj.dialog("open"); */
                // this.modalObj.dialog("open");
                $("#sm-modal").dialog("open");

                // prevent the browser to follow the link
                return false;
            }
        },
        /*-------------------------------------
         * 모달 창 닫기
         -------------------------------------*/
        modalClose: function() {

            if (parent) {
                try {
                    if ( parent.$("#sm-modal").dialog("isOpen") ) {
                        parent.$("#sm-modal").dialog('close');
                    }
                } catch(err) {
                    try {
                        if ( $("#sm-modal").dialog("isOpen") ) {
                            $("#sm-modal").dialog('close');
                        }
                        else {
                            self.close();
                        }
                    } catch(err) {}
                }
            }
            else {
                try {
                    if ( $("#sm-modal").dialog("isOpen") ) {
                        $("#sm-modal").dialog('close');
                    }
                    else {
                        self.close();
                    }
                } catch(err) {}
            }
        },
        alert: function(msg, callback) {

            $("#sm-alert").remove();

            msg = $.trim(msg).split("\n").join("<br/>");

            var alertEl = $('<div id="sm-alert" class=""><div class="msg">' + msg + '</div></div>');
            alertEl.appendTo( $('body') );

            alertEl.dialog({
                title: SYSTEM_NM,
                autoOpen: true,
                modal: true,
                resizable: false,
                buttons: [{
                    text: "확인",
                    class: "btn_boardsm type8",
                    click: function() {
                        if (callback) callback("yes");
                        $(this).dialog("close");
                    }
                }],
                open: function(ev, ui){
                    $(".ui-dialog-titlebar-close").hide();
                },
                close: function(event, ui) {
                    // remove div with all data and events
                    alertEl.remove();
                }
            });
        },
        confirm: function(msg, callback) {

            $("#sm-confirm").remove();

            msg = $.trim(msg).split("\n").join("<br/>");

            var confirmEl = $('<div id="sm-confirm" class=""><div class="msg">' + msg + '</div></div>');
            confirmEl.appendTo( $('body') );

            confirmEl.dialog({
                title: SYSTEM_NM,
                autoOpen: true,
                modal: true,
                resizable: false,
                buttons: [{
                    text: "예",
                    class: "btn_boardsm type8",
                    click: function() {
                        if (callback) callback("yes");
                        $(this).dialog("close");
                    }
                }, {
                    text: "아니오",
                    class: "btn_boardsm type8",
                    click: function() {
                        if (callback) callback("no");
                        $(this).dialog("close");
                    }
                }],
                open: function(ev, ui){
                    $(".ui-dialog-titlebar-close").hide();
                },
                close: function(event, ui) {
                    // remove div with all data and events
                    confirmEl.remove();
                }
            });
        },
        /*-------------------------------------
         * POI 기반 : 엑셀 파일 다운로드
         -------------------------------------*/
        xlsDownload: function(url, option, callback) {
			
            var me = this;
            var btn;

            var _option = {
                httpMethod: "POST",
                target: $("#indicator")
            };

            var _option = $.extend(_option, option);
            if (_option.target) me.showLoadDiv(_option.target);
            if (_option.button) me.showLoad(_option.button);

            $.fileDownload(url, {
                httpMethod: _option.httpMethod,
                data: _option.data,
                successCallback: function (url) {
                    if (_option.target) me.hideLoadDiv(_option.target);
                    if (btn) me.hideLoad(btn);
                    if (callback) callback(true);
                },
                failCallback: function (responseHtml, url) {
                    if (_option.target) me.hideLoadDiv(_option.target);
                    if (_option.button) me.hideLoad(_option.button);
                    if (callback) callback(false);
                    alert("파일을 다운로드 하지 못했습니다.\n\n" + me.cleanHtml(responseHtml));
                }
            });
        },
        /*-------------------------------------
         * 공용 첨부파일 다운로드 로그 팝업
         -------------------------------------*/
        fileLogPop: function(fileSeq, fileId) {
            this.modal({
                title: "파일 다운로드 이력",
                width: 400,
                height: 360,
                y: -1,
                loadUrl: CTX_PATH + "/bo/sr/file/p_fileLogIndex.do?fileSeq=" + fileSeq + "&fileId=" + fileId
            });
        },
        /*-------------------------------------
         * jquery UI tabs reload
         -------------------------------------*/
        reloadTab: function(tabsObj, url) {
            var curIndex = tabsObj.tabs("option", "active");
            var curTabs = $(tabsObj.data("uiTabs").tabs[curIndex]);
            curTabs.find(".ui-tabs-anchor").attr("href", url);
            tabsObj.tabs("load", curIndex);
        },
        /*-------------------------------------
         * 메인 컨텐츠 윈도우 객체 얻기
         -------------------------------------*/
        getContentsWindow: function() {
            var cw = top.iframeContents.contentWindow;
            if (cw)
                return cw;
            else
                return top.window;
        },
        /*-------------------------------------
         * 통계 엑셀변환용 : 아이프레임/폼 생성
         -------------------------------------*/
        generateExcelForm: function() {

            $("<iframe />", {
                name  : "_hiddenFrame",
                id    : "_hiddenFrame",
                src   : "",
                style : "position: absolute; left: -100px; top: -100px; width:0px; height:0px;"
            }).appendTo("body");

            $("<form name='excelForm' action='x_excel.do' method='post' target='_hiddenFrame' />")
            .appendTo("body")
            .append("<input type=\"hidden\" id=\"xlsStatCd\" name=\"xlsStatCd\" />")
            .append("<input type=\"hidden\" id=\"xlsData\" name=\"xlsData\" />")
            .append("<input type=\"hidden\" id=\"__gexssk__\" name=\"__gexssk__\" value=\"xlsData\" />");
        },
        /*-------------------------------------
         * 에디터 글 표시용 : 아이프레임 생성
         -------------------------------------*/
        generateViewFrame: function(el) {
            var iframe = $('<iframe frameborder="0"></iframe>').css({
                "width": "100%", "height": el.height()
            }).load(function(){
                $(this).contents().find("body").css({ "font-size": "12px" }).html( $("#contents-desc", el).html() );
                $(this).height( $(this).contents().height()+20 );
            });

            $("#contents-frame", el).append(iframe);
        },
        /*-------------------------------------
         * 신고접수 등록 팝업
         -------------------------------------*/
        openRptRegFormPop: function() {
            var pop = window.open( CTX_PATH + "/bo/naapd/aod/rpt/main/modal/p_form.do", "_rptfpop_", "width=1020, height=650, scrollbars=yes, resizable=yes");
            pop.focus();
        },
        /*-------------------------------------
         * 리포팅 공용 팝업
         -------------------------------------*/
        reportingPop: function(userOpt) {
            var defOpt = $.extend(true, {
                width: 1000,
                height: 800,
                ozrNm:"",
                odiCnt: 0,
                odiNm: "",
                odiParam: {},
                batch: "",
                batchSize: 0
            }, userOpt);

            var w = defOpt.width;
            var h = defOpt.height;

            var reportingPopForm= document.reportingPopForm;
            var url = "/oz80/reportingPop.jsp";
            var pop = window.open("", "_rppop_", "width="+w+", height="+h+", scrollbars=no, resizable=yes");

            reportingPopForm.action = url;
            reportingPopForm.target = "_rppop_";
            reportingPopForm.ozrNm.value = defOpt.ozrNm;
            reportingPopForm.odiCnt.value = defOpt.odiCnt;
            reportingPopForm.odiNm.value = defOpt.odiNm;
            reportingPopForm.odiParam.value = JSON.stringify(defOpt.odiParam);
            reportingPopForm.batch.value = defOpt.batch;
            reportingPopForm.batchSize.value = defOpt.batchSize;
            reportingPopForm.submit();

            pop.focus();
            
            $.ajax({
                url: CTX_PATH +"/bo/sr/read/log/j_insertReportReadLog.do",
                type:'get',
                data: {
                    readContent : userOpt.readContent
                },
                success: function(data) {
                },
                error: function (xhr, status, error) {
                    alert("Status: " + status + "\nResponse: " + xhr.responseText + "\nError: " + error);
                    console.log("Status: " + status + "\nResponse: " + xhr.responseText + "\nError: " + error);
                }
            });
        },
        /*-------------------------------------
         * 주소검색: https://www.juso.go.kr
         -------------------------------------*/
        jusoPop: function() {
            var pop = window.open( CTX_PATH + "/common/intfce/p_jusoPop.do", "_jspop_", "width=570, height=420, scrollbars=yes, resizable=yes");
            pop.focus();
        },
        jusoCallBack: function(zipNo, roadAddrPart1, addrDetail) {
            document.dataForm.postCd.value = zipNo;
            document.dataForm.addr1.value = roadAddrPart1;
            document.dataForm.addr2.value = addrDetail;
        },
        // 녹취파일 듣기
        recordPop: function(tenantId, agentId, callId) {

            /*--
            if ( $("#recTR").is(":visible") ) return;

            var url = CTX_PATH + "/bo/naapd/scc/rec/a_index.do";
                url += "?agent_id=" + agentId;
                url += "&call_id=" + callId;

            $("#recTR").show().find("td").SM_LOAD(url); --*/

            $.ajax({
                type: "GET",
                crossOrigin: true,
                timeout: 1000,
                url: RECORD_LISTEN_URL + "/?call_id=" + callId + "&tenant_id=" + tenantId + "&user_id=" + agentId,
                success: function(res){
                    console.log(res);
                },
                error: function(xhr, status, err) {
                    if (xhr.readyState == 0 && xhr.status == 0) {
                        alert("녹취 재생기가 미실행 중이거나, 설치되지 않았습니다.");
                    }
                    else {
                        alert("[ERR] " + xhr.statusText);
                    }
                },
                dataType: "text"
            });
        },
        closeRec: function() {
            /*--
            $("#recTR").hide().find("td").html(""); --*/
        },
        // 녹취파일 다운로드
        recordDownload: function(agentId, callId) {

            alert("TO DO !!");
        }
    };

    /*-------------------------------------
     * jQuery $.load() 오버라이딩
     * 로드 대상 영역에 AJAX indicator 표시
     -------------------------------------*/
    $.fn.SM_LOAD = function(url, option, callback) {

        return this.each(function() {

            if (option && option.buttonEl)
                SM.showLoad($(option.buttonEl));

            SM.showLoadDiv($(this));

            $(this).load(url, option, function(respone, status, xhr) {

                if ( status == "error" ) {
                    SM.hideLoadDiv($(this));
                }
                else {
                    if (callback) callback(respone, status, xhr);
                }

                if (option && option.buttonEl)
                    SM.hideLoad($(option.buttonEl));

                $(".qtip").remove();
            });
        });
    };

    /*-------------------------------------
     * 1000자리 콤마 찍어 주기
     -------------------------------------*/
    $.SM_NUM_COMMA = function(number) {

         // 숫자일 경우, 문자로 바꾸기.
         var string = number + "";

         // ±기호, 소수점, 숫자가 아닌 부분은 지우기.
         string = string.replace( /^\s+|\s+$|,|[^+-\.\d]/g, "" )

         //정규식
         var regExp = /([+-]?\d+)(\d{3})(\.\d+)?/;

         while ( regExp.test( string ) ){
             string = string.replace( regExp, "$1" + "," + "$2" + "$3" );
         }

         return string;
    };

    /*-------------------------------------
     * $.browser was deprecated in version 1.3 and removed in 1.9
     * 참고 : http://api.jquery.com/jQuery.browser/
     -------------------------------------*/
    if (!$.browser && $.fn.jquery != "1.3.2") {
        $.extend({
            browser: {}
        });
        $.browser.init = function() {
            var a = {};
            try {
                navigator.vendor ?
                    /Chrome/.test(navigator.userAgent) ?
                    (a.browser = "Chrome", a.version = parseFloat(navigator.userAgent.split("Chrome/")[1].split("Safari")[0])) : /Safari/.test(navigator.userAgent) ? (a.browser = "Safari", a.version = parseFloat(navigator.userAgent.split("Version/")[1].split("Safari")[0])) : /Opera/.test(navigator.userAgent) && (a.Opera = "Safari", a.version = parseFloat(navigator.userAgent.split("Version/")[1])) : /Firefox/.test(navigator.userAgent) ? (a.browser = "mozilla",
                        a.version = parseFloat(navigator.userAgent.split("Firefox/")[1])) : (a.browser = "MSIE", /MSIE/.test(navigator.userAgent) ? a.version = parseFloat(navigator.userAgent.split("MSIE")[1]) : a.version = "edge")
            } catch (e) { a = e; }
            $.browser[a.browser.toLowerCase()] = a.browser.toLowerCase();
            $.browser.browser = a.browser;
            $.browser.version = a.version;
            $.browser.chrome = $.browser.browser.toLowerCase() == 'chrome';
            $.browser.safari = $.browser.browser.toLowerCase() == 'safari';
            $.browser.opera = $.browser.browser.toLowerCase() == 'opera';
            $.browser.msie = $.browser.browser.toLowerCase() == 'msie';
            $.browser.mozilla = $.browser.browser.toLowerCase() == 'mozilla';
        };
        $.browser.init();
    }

    /* jQuery UI 툴팁 표시 */
/*    $(document).tooltip({
        content: function() {
            return $(this).prop("title");
        }
    });*/

})(jQuery);