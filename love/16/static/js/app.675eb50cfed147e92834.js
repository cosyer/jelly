webpackJsonp(
  [1],
  {
    "/K91": function (t, e) {},
    NHnr: function (t, e, n) {
      "use strict";
      Object.defineProperty(e, "__esModule", { value: !0 });
      var i = n("7+uW"),
        r = {
          render: function () {
            var t = this.$createElement,
              e = this._self._c || t;
            return e("div", { attrs: { id: "app" } }, [e("router-view")], 1);
          },
          staticRenderFns: [],
        };
      var a = n("VU/8")(
          { name: "App" },
          r,
          !1,
          function (t) {
            n("y9vr");
          },
          null,
          null
        ).exports,
        o = n("/ocq"),
        s = n("Zrlr"),
        c = n.n(s),
        u = function t(e, n, i, r, a, o) {
          c()(this, t),
            (this.x = e),
            (this.y = n),
            (this.r = i),
            (this.moveX = r),
            (this.moveY = a),
            (this.colors = o);
        };
      function m(t, e, n, i, r, a) {
        t.beginPath(),
          (t.strokeStyle = "rgba(255, 0, 0, " + a + ")"),
          t.moveTo(e, n),
          t.lineTo(i, r),
          t.closePath(),
          t.stroke();
      }
      function h(t, e) {
        return (Math.random() * (t - e) + e) | 0;
      }
      var l = {
          name: "VueLove",
          props: { pData: { call: { type: String }, time: { type: String } } },
          data: function () {
            return { timeLen: [31536e6, 864e5, 36e5, 6e4, 1e3] };
          },
          computed: {
            meetDom: function () {
              return document.querySelector("#meet");
            },
            initDate: function () {
              return new Date(this.pData.time).getTime();
            },
          },
          mounted: function () {
            this.initDom(), this.initEvent();
          },
          methods: {
            showTime: function () {
              var t = new Date().getTime() - this.initDate,
                e = (t / this.timeLen[0]) | 0,
                n = ((t - e * this.timeLen[0]) / this.timeLen[1]) | 0,
                i =
                  ((t - e * this.timeLen[0] - n * this.timeLen[1]) /
                    this.timeLen[2]) |
                  0,
                r =
                  ((t -
                    e * this.timeLen[0] -
                    n * this.timeLen[1] -
                    i * this.timeLen[2]) /
                    this.timeLen[3]) |
                  0,
                a =
                  n +
                  "天 " +
                  i +
                  "小时 " +
                  r +
                  "分钟 " +
                  (((t -
                    e * this.timeLen[0] -
                    n * this.timeLen[1] -
                    i * this.timeLen[2] -
                    r * this.timeLen[3]) /
                    this.timeLen[4]) |
                    0) +
                  "秒";
              0 !== e && (a = e + "年 " + a), (this.meetDom.innerText = a);
            },
            loop: function () {
              var t = this;
              setTimeout(function () {
                t.initDom();
              }, 1e3);
            },
            initDom: function () {
              this.showTime(), this.loop();
            },
            loveing: function (t, e, n) {
              var i = document.createElement("i");
              (i.className = "love"),
                (i.style.position = "absolute"),
                (i.style.left = t + "px"),
                (i.style.top = e + "px"),
                n.appendChild(i),
                setTimeout(function () {
                  n.removeChild(i);
                }, 800);
            },
            initEvent: function () {
              var t = this,
                e = document.querySelector(".container");
              document.body.addEventListener("touchstart", function (n) {
                var i = n.touches[0],
                  r = i.pageX - 50,
                  a = i.pageY - 50;
                t.loveing(r, a, e);
              }),
                document.body.addEventListener("touchend", function (t) {
                  t.preventDefault ? t.preventDefault() : (t.returnValue = !1);
                }),
                document.body.addEventListener("click", function (n) {
                  var i = n.clientX - 50,
                    r = n.clientY - 50;
                  t.loveing(i, r, e);
                });
              var n = document.querySelector("#canvas"),
                i = window.innerWidth,
                r = window.innerHeight;
              (n.width = i), (n.height = r);
              var a = n.getContext("2d"),
                o = [],
                s = 35;
              window.innerWidth < 780
                ? (s = 15)
                : window.innerWidth < 1280 && (s = 25),
                (function (t) {
                  for (
                    var e = t.POINT,
                      n = t.WIDTH,
                      i = t.HEIGHT,
                      r = t.maxR,
                      a = t.minR,
                      o = t.circleArr,
                      s = 0;
                    s < e;
                    s++
                  ) {
                    var c = new u(
                      h(n, 0),
                      h(i, 0),
                      h(r, a),
                      h(10, -10) / 40,
                      h(10, -10) / 40,
                      [255, 0, 0]
                    );
                    o.push(c);
                  }
                })({
                  POINT: s,
                  WIDTH: i,
                  HEIGHT: r,
                  maxR: 15,
                  minR: 5,
                  circleArr: o,
                }),
                requestAnimationFrame(function t() {
                  !(function (t) {
                    var e,
                      n,
                      i,
                      r,
                      a,
                      o = t.context,
                      s = t.canvas,
                      c = t.POINT,
                      u = t.WIDTH,
                      h = t.HEIGHT,
                      l = t.circleArr;
                    o.clearRect(0, 0, s.width, s.height);
                    for (var v = 0; v < c; v++) {
                      (l[v].x += l[v].moveX),
                        (l[v].y += l[v].moveY),
                        l[v].x > u ? (l[v].x = 0) : l[v].x < 0 && (l[v].x = u),
                        l[v].y > h ? (l[v].y = 0) : l[v].y < 0 && (l[v].y = h),
                        (e = o),
                        (n = l[v].x),
                        (i = l[v].y),
                        (r = l[v].r),
                        (a = l[v].colors),
                        (e.fillStyle =
                          "rgba(" +
                          a[0] +
                          ", " +
                          a[1] +
                          ", " +
                          a[2] +
                          ", 0.15)"),
                        e.beginPath(),
                        e.arc(n, i, r, 0, 2 * Math.PI),
                        e.closePath(),
                        e.fill();
                      for (var d = 0; d < c - v; d++) {
                        var p = Math.abs(l[v + d].x - l[v].x),
                          f = Math.abs(l[v + d].y - l[v].y),
                          y = c / Math.sqrt(p * p + f * f) - 0.09,
                          x = y > 0.15 ? 0.15 : y;
                        x > 0 &&
                          m(o, l[v].x, l[v].y, l[v + d].x, l[v + d].y, x);
                      }
                    }
                  })({
                    context: a,
                    canvas: n,
                    POINT: s,
                    WIDTH: i,
                    HEIGHT: r,
                    circleArr: o,
                  }),
                    requestAnimationFrame(t);
                });
            },
          },
        },
        v = {
          render: function () {
            var t = this.$createElement,
              e = this._self._c || t;
            return e("div", [
              e("canvas", { attrs: { id: "canvas" } }),
              this._v(" "),
              e("div", { staticClass: "container" }, [
                e("i", { staticClass: "love heart" }),
                this._v(" "),
                e("div", { staticClass: "main" }, [
                  e("p", [this._v(this._s(this.pData.call))]),
                  this._v(" "),
                  e("p", { attrs: { id: "meet" } }),
                ]),
              ]),
            ]);
          },
          staticRenderFns: [],
        };
      var d = {
          name: "Demo",
          components: {
            Ilove: n("VU/8")(
              l,
              v,
              !1,
              function (t) {
                n("/K91");
              },
              null,
              null
            ).exports,
          },
          data: function () {
            return {
              pData: {
                call: "xxx先生和xxx女士",
                time: "1993/9/23 00:00:00",
              },
            };
          },
        },
        p = {
          render: function () {
            var t = this.$createElement,
              e = this._self._c || t;
            return e("div", [e("ilove", { attrs: { pData: this.pData } })], 1);
          },
          staticRenderFns: [],
        };
      var f = n("VU/8")(
        d,
        p,
        !1,
        function (t) {
          n("nOQW");
        },
        "data-v-a9ae80fc",
        null
      ).exports;
      i.a.use(o.a);
      var y = new o.a({
        mode: "history",
        routes: [{ path: "*", name: "demo", component: f }],
      });
      (i.a.config.productionTip = !1),
        new i.a({
          el: "#app",
          router: y,
          components: { App: a },
          template: "<App/>",
        });
    },
    nOQW: function (t, e) {},
    y9vr: function (t, e) {},
  },
  ["NHnr"]
);
//# sourceMappingURL=app.675eb50cfed147e92834.js.map
