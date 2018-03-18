/**
 *
 * @authors Your Name (you@example.org)
 * @date    2016-04-05 20:53:45
 * @version $Id$
 */
var Utils = {
    hasClass: function (node, str) {
        if (node.className) {
            var reg = new RegExp("\\b" + str + "\\b", "g");
            return Boolean(node.className.match(reg));
        }
        return false;
    },
    addClass: function (node, str) {
        if (!this.hasClass(node, str)) {
            var org = node.className;
            node.className = org + " " + str;
        }
        return node.className;
    },
    removeClass: function (node, str) {
        if (this.hasClass(node, str)) {
            var reg = new RegExp("\\b" + str + "\\b", "g");
            node.className = this.trim(node.className.replace(reg, ""));
        }
        return node.className;
    },
    insertAfter: function (newElement, targetElement) {
        var parent = targetElement.parentNode;
        if (parent.lastChild == targetElement) {
            parent.appendChild(newElement);
        } else {
            parent.insertBefore(newElement, targetElement.nextSibling);
        }
    },
    addLoadEvent: function (func) {
        var oldonload = window.onload;
        if (typeof window.onload != 'function') {
            window.onload = func;
        } else {
            window.onload = function () {
                oldonload();
                func();
            }
        }
    },
    addEvent: function (node, type, handler) {
        if (!node) return false;
        if (node.addEventListener) {
            node.addEventListener(type, handler, false);
            return true;
        } else if (node.attachEvent) {
            node['e' + type + handler] = handler;
            node[type + handler] = function () {
                node['e' + type + handler](window.event);
            };
            node.attachEvent('on' + type, node[type + handler]);
            return true;
        }
        return false;
    },
    //跨浏览器removeEvent
    removeEvent: function (node, type, handler) {
        if (!node) return false;
        if (node.removeEventListener) {
            node.removeEventListener(type, handler, false);
            return true;
        } else if (node.detachEvent) {
            node.detachEvent('on' + type, node[type + handler]);
            node[type + handler] = null;
        }
        return false;
    },
    type: function (obj) {
        return Object.prototype.toString.call(obj).slice(8, -1).toLowerCase();
    },
    //去除字符串的空白字符
    trim: function (str, trimMode) {
        switch (trimMode) {
            case 'left':
                return str.replace(/(^\s+)/g, '');
            case 'right':
                return str.replace(/(\s+$)/g, '');
            case 'all':
                return str.replace(/(^\s+)|\s|(\s+$)/g, '');
            default:
                return str.replace(/(^\s+)|(\s+$)/g, '');
        }
    },
    createAjax: function () {
        if (window.ActiveXObject) {
            try {
                xmlHttpRequest = new ActiveXObject("Microsoft.XMLHTTP");
            } catch (e) {
                xmlHttpRequest = new ActiveXObject("Msxml2.XMLHTTP");
            }
            return xmlHttpRequest;
        } else if (window.XMLHttpRequest) {
            return new XMLHttpRequest();
        } else {
            return null;
        }
    },
    ajax: function (opts) {
        var xhr = createAjax();
        var data = "";
        if (!xhr) return null;
        for (var v in opts.data) {
            data = data + v + "=" + opts.data[v] + "&";
        }
        data = data.replace(/^&+|&+$/g, "");
        if (opts.type.toLowerCase() === "get") {
            var url = opts["url"] + "?" + data;
            xhr.open("get", url, true);
            xhr.send();
        };
        if (opts.type.toLowerCase() === "post") {
            xhr.open("post", opts.url, true);
            xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            request.send(data);
        };
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                var responseText = JSON.parse(xhr.responseText);
                opts.success(responseText);
            }
            if (xhr.readyState === 4 && xhr.status === 404) {
                opts.error();
            }
        };
    }
}
