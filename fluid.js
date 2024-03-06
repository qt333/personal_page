/*!
 *
 *     🌊 fluid-canvas 🌊 - A JavaScript library that allows for easy deployment of WebGL rendered fluid simulations.
 *     Library By: Malik Tillman
 *     Version: v0.9.1
 *     GitHub: https://github.com/malik-tillman/Fluid-JS#readme
 *     License: ISC
 *
 */
!(function (e, r) {
  "object" == typeof exports && "object" == typeof module
    ? (module.exports = r())
    : "function" == typeof define && define.amd
    ? define([], r)
    : "object" == typeof exports
    ? (exports.Fluid = r())
    : (e.Fluid = r());
})(window, function () {
  return (function (e) {
    var r = {};
    function n(t) {
      if (r[t]) return r[t].exports;
      var i = (r[t] = {i: t, l: !1, exports: {}});
      return e[t].call(i.exports, i, i.exports, n), (i.l = !0), i.exports;
    }
    return (
      (n.m = e),
      (n.c = r),
      (n.d = function (e, r, t) {
        n.o(e, r) || Object.defineProperty(e, r, {enumerable: !0, get: t});
      }),
      (n.r = function (e) {
        "undefined" != typeof Symbol &&
          Symbol.toStringTag &&
          Object.defineProperty(e, Symbol.toStringTag, {value: "Module"}),
          Object.defineProperty(e, "__esModule", {value: !0});
      }),
      (n.t = function (e, r) {
        if ((1 & r && (e = n(e)), 8 & r)) return e;
        if (4 & r && "object" == typeof e && e && e.__esModule) return e;
        var t = Object.create(null);
        if (
          (n.r(t),
          Object.defineProperty(t, "default", {enumerable: !0, value: e}),
          2 & r && "string" != typeof e)
        )
          for (var i in e)
            n.d(
              t,
              i,
              function (r) {
                return e[r];
              }.bind(null, i)
            );
        return t;
      }),
      (n.n = function (e) {
        var r =
          e && e.__esModule
            ? function () {
                return e.default;
              }
            : function () {
                return e;
              };
        return n.d(r, "a", r), r;
      }),
      (n.o = function (e, r) {
        return Object.prototype.hasOwnProperty.call(e, r);
      }),
      (n.p = ""),
      n((n.s = 1))
    );
  })([
    function (e, r, n) {
      "use strict";
      function t(e, r) {
        var n = Object.keys(e);
        if (Object.getOwnPropertySymbols) {
          var t = Object.getOwnPropertySymbols(e);
          r &&
            (t = t.filter(function (r) {
              return Object.getOwnPropertyDescriptor(e, r).enumerable;
            })),
            n.push.apply(n, t);
        }
        return n;
      }
      function i(e, r, n) {
        return (
          r in e
            ? Object.defineProperty(e, r, {
                value: n,
                enumerable: !0,
                configurable: !0,
                writable: !0,
              })
            : (e[r] = n),
          e
        );
      }
      Object.defineProperty(r, "__esModule", {value: !0}),
        (r.setBehaviors = function (e) {
          r.behavior = o = (function (e) {
            for (var r = 1; r < arguments.length; r++) {
              var n = null != arguments[r] ? arguments[r] : {};
              r % 2
                ? t(n, !0).forEach(function (r) {
                    i(e, r, n[r]);
                  })
                : Object.getOwnPropertyDescriptors
                ? Object.defineProperties(
                    e,
                    Object.getOwnPropertyDescriptors(n)
                  )
                : t(n).forEach(function (r) {
                    Object.defineProperty(
                      e,
                      r,
                      Object.getOwnPropertyDescriptor(n, r)
                    );
                  });
            }
            return e;
          })({}, o, {}, e);
        }),
        (r.SHADER_SOURCE = r.DRAWING_PARAMS = r.behavior = void 0);
      var o = {
        sim_resolution: 128,
        dye_resolution: 512,
        paused: !1,
        clamp_values: !0,
        embedded_dither: !0,
        dissipation: 0.97,
        velocity: 0.98,
        pressure: 0.8,
        pressure_iteration: 20,
        fluid_color: [
          [0, 0, 0],
          [0.4, 0.2, 0],
        ],
        curl: 0,
        emitter_size: 0.5,
        render_shaders: !0,
        multi_color: !0,
        render_bloom: !1,
        bloom_iterations: 8,
        bloom_resolution: 256,
        intensity: 0.8,
        threshold: 0.6,
        soft_knee: 0.7,
        background_color: {r: 15, g: 15, b: 15},
        transparent: !1,
      };
      r.behavior = o;
      r.DRAWING_PARAMS = {
        alpha: !0,
        depth: !1,
        stencil: !1,
        antialias: !1,
        preserveDrawingBuffer: !1,
        powerPreference: "default",
      };
      r.SHADER_SOURCE = {
        blank: "",
        vertex:
          "\n                  precision highp float;\n              \n                  attribute vec2 aPosition;\n                  varying vec2 vUv;\n                  varying vec2 vL;\n                  varying vec2 vR;\n                  varying vec2 vT;\n                  varying vec2 vB;\n                  uniform vec2 texelSize;\n              \n                  void main () {\n                      vUv = aPosition * 0.5 + 0.5;\n                      vL = vUv - vec2(texelSize.x, 0.0);\n                      vR = vUv + vec2(texelSize.x, 0.0);\n                      vT = vUv + vec2(0.0, texelSize.y);\n                      vB = vUv - vec2(0.0, texelSize.y);\n                      gl_Position = vec4(aPosition, 0.0, 1.0);\n                  }",
        clear:
          "\n                  precision mediump float;\n                  precision mediump sampler2D;\n              \n                  varying highp vec2 vUv;\n                  uniform sampler2D uTexture;\n                  uniform float value;\n              \n                  void main () {\n                      gl_FragColor = value * texture2D(uTexture, vUv);\n                  }\n              ",
        color:
          "\n                  precision mediump float;\n              \n                  uniform vec4 color;\n              \n                  void main () {\n                      gl_FragColor = color;\n                  }\n              ",
        background:
          "\n                    void main() { \n                        gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0); \n                    } \n            ",
        display:
          "\n                  precision highp float;\n                  precision highp sampler2D;\n              \n                  varying vec2 vUv;\n                  uniform sampler2D uTexture;\n              \n                  void main () {\n                      vec3 C = texture2D(uTexture, vUv).rgb;\n                      float a = max(C.r, max(C.g, C.b));\n                      gl_FragColor = vec4(C, a);\n                  }\n              ",
        displayBloom:
          "\n          precision highp float;\n          precision highp sampler2D;\n      \n          varying vec2 vUv;\n          uniform sampler2D uTexture;\n          uniform sampler2D uBloom;\n          uniform sampler2D uDithering;\n          uniform vec2 ditherScale;\n      \n          void main () {\n              vec3 C = texture2D(uTexture, vUv).rgb;\n              vec3 bloom = texture2D(uBloom, vUv).rgb;\n              vec3 noise = texture2D(uDithering, vUv * ditherScale).rgb;\n              noise = noise * 2.0 - 1.0;\n              bloom += noise / 800.0;\n              bloom = pow(bloom.rgb, vec3(1.0 / 2.2));\n              C += bloom;\n              float a = max(C.r, max(C.g, C.b));\n              gl_FragColor = vec4(C, a);\n          }\n      ",
        displayShading:
          "\n          precision highp float;\n          precision highp sampler2D;\n      \n          varying vec2 vUv;\n          varying vec2 vL;\n          varying vec2 vR;\n          varying vec2 vT;\n          varying vec2 vB;\n          uniform sampler2D uTexture;\n          uniform vec2 texelSize;\n      \n          void main () {\n              vec3 L = texture2D(uTexture, vL).rgb;\n              vec3 R = texture2D(uTexture, vR).rgb;\n              vec3 T = texture2D(uTexture, vT).rgb;\n              vec3 B = texture2D(uTexture, vB).rgb;\n              vec3 C = texture2D(uTexture, vUv).rgb;\n      \n              float dx = length(R) - length(L);\n              float dy = length(T) - length(B);\n      \n              vec3 n = normalize(vec3(dx, dy, length(texelSize)));\n              vec3 l = vec3(0.0, 0.0, 1.0);\n      \n              float diffuse = clamp(dot(n, l) + 0.7, 0.7, 1.0);\n              C.rgb *= diffuse;\n      \n              float a = max(C.r, max(C.g, C.b));\n              gl_FragColor = vec4(C, a);\n          }\n      ",
        displayBloomShading:
          "\n          precision highp float;\n          precision highp sampler2D;\n      \n          varying vec2 vUv;\n          varying vec2 vL;\n          varying vec2 vR;\n          varying vec2 vT;\n          varying vec2 vB;\n          uniform sampler2D uTexture;\n          uniform sampler2D uBloom;\n          uniform sampler2D uDithering;\n          uniform vec2 ditherScale;\n          uniform vec2 texelSize;\n      \n          void main () {\n              vec3 L = texture2D(uTexture, vL).rgb;\n              vec3 R = texture2D(uTexture, vR).rgb;\n              vec3 T = texture2D(uTexture, vT).rgb;\n              vec3 B = texture2D(uTexture, vB).rgb;\n              vec3 C = texture2D(uTexture, vUv).rgb;\n      \n              float dx = length(R) - length(L);\n              float dy = length(T) - length(B);\n      \n              vec3 n = normalize(vec3(dx, dy, length(texelSize)));\n              vec3 l = vec3(0.0, 0.0, 1.0);\n      \n              float diffuse = clamp(dot(n, l) + 0.7, 0.7, 1.0);\n              C *= diffuse;\n      \n              vec3 bloom = texture2D(uBloom, vUv).rgb;\n              vec3 noise = texture2D(uDithering, vUv * ditherScale).rgb;\n              noise = noise * 2.0 - 1.0;\n              bloom += noise / 800.0;\n              bloom = pow(bloom.rgb, vec3(1.0 / 2.2));\n              C += bloom;\n      \n              float a = max(C.r, max(C.g, C.b));\n              gl_FragColor = vec4(C, a);\n          }\n      ",
        bloomPreFilter:
          "\n          precision mediump float;\n          precision mediump sampler2D;\n      \n          varying vec2 vUv;\n          uniform sampler2D uTexture;\n          uniform vec3 curve;\n          uniform float threshold;\n      \n          void main () {\n              vec3 c = texture2D(uTexture, vUv).rgb;\n              float br = max(c.r, max(c.g, c.b));\n              float rq = clamp(br - curve.x, 0.0, curve.y);\n              rq = curve.z * rq * rq;\n              c *= max(rq, br - threshold) / max(br, 0.0001);\n              gl_FragColor = vec4(c, 0.0);\n          }\n      ",
        bloomBlur:
          "\n          precision mediump float;\n          precision mediump sampler2D;\n      \n          varying vec2 vL;\n          varying vec2 vR;\n          varying vec2 vT;\n          varying vec2 vB;\n          uniform sampler2D uTexture;\n      \n          void main () {\n              vec4 sum = vec4(0.0);\n              sum += texture2D(uTexture, vL);\n              sum += texture2D(uTexture, vR);\n              sum += texture2D(uTexture, vT);\n              sum += texture2D(uTexture, vB);\n              sum *= 0.25;\n              gl_FragColor = sum;\n          }\n      ",
        bloomFinal:
          "\n          precision mediump float;\n          precision mediump sampler2D;\n      \n          varying vec2 vL;\n          varying vec2 vR;\n          varying vec2 vT;\n          varying vec2 vB;\n          uniform sampler2D uTexture;\n          uniform float intensity;\n      \n          void main () {\n              vec4 sum = vec4(0.0);\n              sum += texture2D(uTexture, vL);\n              sum += texture2D(uTexture, vR);\n              sum += texture2D(uTexture, vT);\n              sum += texture2D(uTexture, vB);\n              sum *= 0.25;\n              gl_FragColor = sum * intensity;\n          }\n      ",
        splat:
          "\n          precision highp float;\n          precision highp sampler2D;\n      \n          varying vec2 vUv;\n          uniform sampler2D uTarget;\n          uniform float aspectRatio;\n          uniform vec3 color;\n          uniform vec2 point;\n          uniform float radius;\n      \n          void main () {\n              vec2 p = vUv - point.xy;\n              p.x *= aspectRatio;\n              vec3 splat = exp(-dot(p, p) / radius) * color;\n              vec3 base = texture2D(uTarget, vUv).xyz;\n              gl_FragColor = vec4(base + splat, 1.0);\n          }\n      ",
        advectionManualFiltering:
          "\n          precision highp float;\n          precision highp sampler2D;\n      \n          varying vec2 vUv;\n          uniform sampler2D uVelocity;\n          uniform sampler2D uSource;\n          uniform vec2 texelSize;\n          uniform vec2 dyeTexelSize;\n          uniform float dt;\n          uniform float dissipation;\n      \n          vec4 bilerp (sampler2D sam, vec2 uv, vec2 tsize) {\n              vec2 st = uv / tsize - 0.5;\n      \n              vec2 iuv = floor(st);\n              vec2 fuv = fract(st);\n      \n              vec4 a = texture2D(sam, (iuv + vec2(0.5, 0.5)) * tsize);\n              vec4 b = texture2D(sam, (iuv + vec2(1.5, 0.5)) * tsize);\n              vec4 c = texture2D(sam, (iuv + vec2(0.5, 1.5)) * tsize);\n              vec4 d = texture2D(sam, (iuv + vec2(1.5, 1.5)) * tsize);\n      \n              return mix(mix(a, b, fuv.x), mix(c, d, fuv.x), fuv.y);\n          }\n      \n          void main () {\n              vec2 coord = vUv - dt * bilerp(uVelocity, vUv, texelSize).xy * texelSize;\n              gl_FragColor = dissipation * bilerp(uSource, coord, dyeTexelSize);\n              gl_FragColor.a = 1.0;\n          }\n      ",
        advection:
          "\n          precision highp float;\n          precision highp sampler2D;\n      \n          varying vec2 vUv;\n          uniform sampler2D uVelocity;\n          uniform sampler2D uSource;\n          uniform vec2 texelSize;\n          uniform float dt;\n          uniform float dissipation;\n      \n          void main () {\n              vec2 coord = vUv - dt * texture2D(uVelocity, vUv).xy * texelSize;\n              gl_FragColor = dissipation * texture2D(uSource, coord);\n              gl_FragColor.a = 1.0;\n          }\n      ",
        divergence:
          "\n          precision mediump float;\n          precision mediump sampler2D;\n      \n          varying highp vec2 vUv;\n          varying highp vec2 vL;\n          varying highp vec2 vR;\n          varying highp vec2 vT;\n          varying highp vec2 vB;\n          uniform sampler2D uVelocity;\n      \n          void main () {\n              float L = texture2D(uVelocity, vL).x;\n              float R = texture2D(uVelocity, vR).x;\n              float T = texture2D(uVelocity, vT).y;\n              float B = texture2D(uVelocity, vB).y;\n      \n              vec2 C = texture2D(uVelocity, vUv).xy;\n              if (vL.x < 0.0) { L = -C.x; }\n              if (vR.x > 1.0) { R = -C.x; }\n              if (vT.y > 1.0) { T = -C.y; }\n              if (vB.y < 0.0) { B = -C.y; }\n      \n              float div = 0.5 * (R - L + T - B);\n              gl_FragColor = vec4(div, 0.0, 0.0, 1.0);\n          }\n      ",
        curl: "\n          precision mediump float;\n          precision mediump sampler2D;\n      \n          varying highp vec2 vUv;\n          varying highp vec2 vL;\n          varying highp vec2 vR;\n          varying highp vec2 vT;\n          varying highp vec2 vB;\n          uniform sampler2D uVelocity;\n      \n          void main () {\n              float L = texture2D(uVelocity, vL).y;\n              float R = texture2D(uVelocity, vR).y;\n              float T = texture2D(uVelocity, vT).x;\n              float B = texture2D(uVelocity, vB).x;\n              float vorticity = R - L - T + B;\n              gl_FragColor = vec4(0.5 * vorticity, 0.0, 0.0, 1.0);\n          }\n      ",
        vorticity:
          "\n          precision highp float;\n          precision highp sampler2D;\n      \n          varying vec2 vUv;\n          varying vec2 vL;\n          varying vec2 vR;\n          varying vec2 vT;\n          varying vec2 vB;\n          uniform sampler2D uVelocity;\n          uniform sampler2D uCurl;\n          uniform float curl;\n          uniform float dt;\n      \n          void main () {\n              float L = texture2D(uCurl, vL).x;\n              float R = texture2D(uCurl, vR).x;\n              float T = texture2D(uCurl, vT).x;\n              float B = texture2D(uCurl, vB).x;\n              float C = texture2D(uCurl, vUv).x;\n      \n              vec2 force = 0.5 * vec2(abs(T) - abs(B), abs(R) - abs(L));\n              force /= length(force) + 0.0001;\n              force *= curl * C;\n              force.y *= -1.0;\n      \n              vec2 vel = texture2D(uVelocity, vUv).xy;\n              gl_FragColor = vec4(vel + force * dt, 0.0, 1.0);\n          }\n      ",
        pressure:
          "\n          precision mediump float;\n          precision mediump sampler2D;\n      \n          varying highp vec2 vUv;\n          varying highp vec2 vL;\n          varying highp vec2 vR;\n          varying highp vec2 vT;\n          varying highp vec2 vB;\n          uniform sampler2D uPressure;\n          uniform sampler2D uDivergence;\n      \n          vec2 boundary (vec2 uv) {\n              return uv;\n              // uncomment if you use wrap or repeat texture mode\n              // uv = min(max(uv, 0.0), 1.0);\n              // return uv;\n          }\n      \n          void main () {\n              float L = texture2D(uPressure, boundary(vL)).x;\n              float R = texture2D(uPressure, boundary(vR)).x;\n              float T = texture2D(uPressure, boundary(vT)).x;\n              float B = texture2D(uPressure, boundary(vB)).x;\n              float C = texture2D(uPressure, vUv).x;\n              float divergence = texture2D(uDivergence, vUv).x;\n              float pressure = (L + R + B + T - divergence) * 0.25;\n              gl_FragColor = vec4(pressure, 0.0, 0.0, 1.0);\n          }\n      ",
        gradientSubtract:
          "\n          precision mediump float;\n          precision mediump sampler2D;\n      \n          varying highp vec2 vUv;\n          varying highp vec2 vL;\n          varying highp vec2 vR;\n          varying highp vec2 vT;\n          varying highp vec2 vB;\n          uniform sampler2D uPressure;\n          uniform sampler2D uVelocity;\n      \n          vec2 boundary (vec2 uv) {\n              return uv;\n              // uv = min(max(uv, 0.0), 1.0);\n              // return uv;\n          }\n      \n          void main () {\n              float L = texture2D(uPressure, boundary(vL)).x;\n              float R = texture2D(uPressure, boundary(vR)).x;\n              float T = texture2D(uPressure, boundary(vT)).x;\n              float B = texture2D(uPressure, boundary(vB)).x;\n              vec2 velocity = texture2D(uVelocity, vUv).xy;\n              velocity.xy -= vec2(R - L, T - B);\n              gl_FragColor = vec4(velocity, 0.0, 1.0);\n          }\n      ",
      };
    },
    function (e, r, n) {
      "use strict";
      var t = n(0),
        i = n(2);
      function o(e, r) {
        var n = Object.keys(e);
        if (Object.getOwnPropertySymbols) {
          var t = Object.getOwnPropertySymbols(e);
          r &&
            (t = t.filter(function (r) {
              return Object.getOwnPropertyDescriptor(e, r).enumerable;
            })),
            n.push.apply(n, t);
        }
        return n;
      }
      function a(e, r, n) {
        return (
          r in e
            ? Object.defineProperty(e, r, {
                value: n,
                enumerable: !0,
                configurable: !0,
                writable: !0,
              })
            : (e[r] = n),
          e
        );
      }
      function u(e, r) {
        for (var n = 0; n < r.length; n++) {
          var t = r[n];
          (t.enumerable = t.enumerable || !1),
            (t.configurable = !0),
            "value" in t && (t.writable = !0),
            Object.defineProperty(e, t.key, t);
        }
      }
      e.exports = (function () {
        function e(r) {
          !(function (e, r) {
            if (!(e instanceof r))
              throw new TypeError("Cannot call a class as a function");
          })(this, e),
            (this.PARAMS = t.behavior),
            (r.width = r.clientWidth),
            (r.height = r.clientHeight),
            (this.canvas = r);
          var n = (0, i.initWebGL)(),
            o = n.programs,
            a = n.webGL,
            u = n.colorFormats,
            v = n.pointers;
          (this.programs = o),
            (this.webGL = a),
            (this.colorFormats = u),
            (this.pointers = v);
        }
        var r, n, v;
        return (
          (r = e),
          (n = [
            {
              key: "activate",
              value: function () {
                (0, i.activator)(
                  this.canvas,
                  this.webGL,
                  this.colorFormats,
                  this.programs,
                  this.pointers
                );
              },
            },
            {key: "deactivate", value: function () {}},
            {
              key: "reset",
              value: function () {
                (0, i.initWebGL)(), this.activate();
              },
            },
            {
              key: "mapBehaviors",
              value: function (e) {
                (this.PARAMS = (function (e) {
                  for (var r = 1; r < arguments.length; r++) {
                    var n = null != arguments[r] ? arguments[r] : {};
                    r % 2
                      ? o(n, !0).forEach(function (r) {
                          a(e, r, n[r]);
                        })
                      : Object.getOwnPropertyDescriptors
                      ? Object.defineProperties(
                          e,
                          Object.getOwnPropertyDescriptors(n)
                        )
                      : o(n).forEach(function (r) {
                          Object.defineProperty(
                            e,
                            r,
                            Object.getOwnPropertyDescriptor(n, r)
                          );
                        });
                  }
                  return e;
                })({}, this.PARAMS, {}, e)),
                  (0, t.setBehaviors)(this.PARAMS);
              },
            },
            {
              key: "setAsBackground",
              value: function () {
                var e =
                  !(arguments.length > 0 && void 0 !== arguments[0]) ||
                  arguments[0];
                (canvas.style.zIndex = e ? "-99" : "0"),
                  (canvas.style.position = e ? "absolute" : "relative");
              },
            },
            {
              key: "applyBackground",
              value: function (e, r) {
                var n =
                    arguments.length > 2 && void 0 !== arguments[2]
                      ? arguments[2]
                      : null,
                  t =
                    arguments.length > 3 && void 0 !== arguments[3]
                      ? arguments[3]
                      : this.canvas;
                switch (
                  ((e = e.toLowerCase()), (this.PARAMS.transparent = !0), e)
                ) {
                  case "gradient":
                    i();
                    break;
                  case "image":
                    o();
                    break;
                  case "solid":
                  default:
                    (this.PARAMS.transparent = !1),
                      (this.PARAMS.background_color = r);
                }
                function i() {
                  var e = "";
                  switch (n) {
                    case "radial":
                      e = "radial-gradient(" + r + ")";
                      break;
                    case "conic":
                      e = "conic-gradient(" + r + ")";
                      break;
                    case "repeating-linear":
                      e = "repeating-linear-gradient(" + r + ")";
                      break;
                    case "repeating-radial":
                      e = "repeating-radial-gradient(" + r + ")";
                      break;
                    case "linear":
                    default:
                      e = "linear-gradient(" + r + ")";
                  }
                  t.style.backgroundImage = e;
                }
                function o() {
                  (t.style.backgroundImage = "url('" + r + "')"),
                    n &&
                      ((t.style.backgroundRepeat = n.repeat
                        ? "repeat"
                        : "no-repeat"),
                      (t.style.backgroundPosition = n.position
                        ? n.position
                        : "center"),
                      (t.style.backgroundSize = n.size ? n.size : "contain"),
                      (t.style.backgroundColor = n.color ? n.color : "none"));
                }
                this.reset();
              },
            },
            {
              key: "setDitherURL",
              value: function (e) {
                (0, i.setDitherURL)(e);
              },
            },
          ]) && u(r.prototype, n),
          v && u(r, v),
          e
        );
      })();
    },
    function (e, r, n) {
      "use strict";
      Object.defineProperty(r, "__esModule", {value: !0}),
        (r.initWebGL = function () {
          var e = [];
          e.push(new f());
          var r = canvas.getContext("webgl2", t.DRAWING_PARAMS),
            n = !!r;
          n ||
            (r =
              canvas.getContext("webgl", t.DRAWING_PARAMS) ||
              canvas.getContext("experimental-webgl", t.DRAWING_PARAMS));
          var i = (function () {
            var e, t, i, o, a;
            n
              ? (r.getExtension("EXT_color_buffer_float"),
                (a = r.getExtension("OES_texture_float_linear")))
              : ((o = r.getExtension("OES_texture_half_float")),
                (a = r.getExtension("OES_texture_half_float_linear")));
            var u = n ? r.HALF_FLOAT : o.HALF_FLOAT_OES;
            r.clearColor(0, 0, 0, 1),
              n
                ? ((e = v(r.RGBA16F, r.RGBA, u)),
                  (t = v(r.RG16F, r.RG, u)),
                  (i = v(r.R16F, r.RED, u)))
                : ((e = v(r.RGBA, r.RGBA, u)),
                  (t = v(r.RGBA, r.RGBA, u)),
                  (i = v(r.RGBA, r.RGBA, u)));
            function v(e, n, t) {
              var i = r.createTexture();
              r.bindTexture(r.TEXTURE_2D, i),
                r.texParameteri(r.TEXTURE_2D, r.TEXTURE_MIN_FILTER, r.NEAREST),
                r.texParameteri(r.TEXTURE_2D, r.TEXTURE_MAG_FILTER, r.NEAREST),
                r.texParameteri(
                  r.TEXTURE_2D,
                  r.TEXTURE_WRAP_S,
                  r.CLAMP_TO_EDGE
                ),
                r.texParameteri(
                  r.TEXTURE_2D,
                  r.TEXTURE_WRAP_T,
                  r.CLAMP_TO_EDGE
                ),
                r.texImage2D(r.TEXTURE_2D, 0, e, 4, 4, 0, n, t, null);
              var o = r.createFramebuffer();
              r.bindFramebuffer(r.FRAMEBUFFER, o),
                r.framebufferTexture2D(
                  r.FRAMEBUFFER,
                  r.COLOR_ATTACHMENT0,
                  r.TEXTURE_2D,
                  i,
                  0
                );
              var a = r.checkFramebufferStatus(r.FRAMEBUFFER);
              if (!(a === r.FRAMEBUFFER_COMPLETE))
                switch (e) {
                  case r.R16F:
                    return v(r.RG16F, r.RG, t);
                  case r.RG16F:
                    return v(r.RGBA16F, r.RGBA, t);
                  default:
                    return null;
                }
              return {internalFormat: e, format: n};
            }
            return {
              formatRGBA: e,
              formatRG: t,
              formatR: i,
              halfFloatTexType: u,
              supportLinearFiltering: a,
            };
          })();
          /Mobi|Android/i.test(navigator.userAgent) &&
            (t.behavior.render_shaders = !1);
          i.supportLinearFiltering ||
            ((t.behavior.render_shaders = !1), (t.behavior.render_bloom = !1));
          var o = {
            baseVertex: a(r.VERTEX_SHADER, t.SHADER_SOURCE.vertex),
            clear: a(r.FRAGMENT_SHADER, t.SHADER_SOURCE.clear),
            color: a(r.FRAGMENT_SHADER, t.SHADER_SOURCE.color),
            background: a(r.FRAGMENT_SHADER, t.SHADER_SOURCE.background),
            display: a(r.FRAGMENT_SHADER, t.SHADER_SOURCE.display),
            displayBloom: a(r.FRAGMENT_SHADER, t.SHADER_SOURCE.displayBloom),
            displayShading: a(
              r.FRAGMENT_SHADER,
              t.SHADER_SOURCE.displayShading
            ),
            displayBloomShading: a(
              r.FRAGMENT_SHADER,
              t.SHADER_SOURCE.displayBloomShading
            ),
            bloomPreFilter: a(
              r.FRAGMENT_SHADER,
              t.SHADER_SOURCE.bloomPreFilter
            ),
            bloomBlur: a(r.FRAGMENT_SHADER, t.SHADER_SOURCE.bloomBlur),
            bloomFinal: a(r.FRAGMENT_SHADER, t.SHADER_SOURCE.bloomFinal),
            splat: a(r.FRAGMENT_SHADER, t.SHADER_SOURCE.splat),
            advectionManualFiltering: a(
              r.FRAGMENT_SHADER,
              t.SHADER_SOURCE.advectionManualFiltering
            ),
            advection: a(r.FRAGMENT_SHADER, t.SHADER_SOURCE.advection),
            divergence: a(r.FRAGMENT_SHADER, t.SHADER_SOURCE.divergence),
            curl: a(r.FRAGMENT_SHADER, t.SHADER_SOURCE.curl),
            vorticity: a(r.FRAGMENT_SHADER, t.SHADER_SOURCE.vorticity),
            pressure: a(r.FRAGMENT_SHADER, t.SHADER_SOURCE.pressure),
            gradientSubtract: a(
              r.FRAGMENT_SHADER,
              t.SHADER_SOURCE.gradientSubtract
            ),
          };
          function a(e, n) {
            var t = r.createShader(e);
            if (
              (r.shaderSource(t, n),
              r.compileShader(t),
              !r.getShaderParameter(t, r.COMPILE_STATUS))
            )
              throw r.getShaderInfoLog(t);
            return t;
          }
          return {
            programs:
              ((u = i.supportLinearFiltering),
              {
                clearProgram: new m(o.baseVertex, o.clear, r),
                colorProgram: new m(o.baseVertex, o.color, r),
                backgroundProgram: new m(o.baseVertex, o.background, r),
                displayProgram: new m(o.baseVertex, o.display, r),
                displayBloomProgram: new m(o.baseVertex, o.displayBloom, r),
                displayShadingProgram: new m(o.baseVertex, o.displayShading, r),
                displayBloomShadingProgram: new m(
                  o.baseVertex,
                  o.displayBloomShading,
                  r
                ),
                bloomPreFilterProgram: new m(o.baseVertex, o.bloomPreFilter, r),
                bloomBlurProgram: new m(o.baseVertex, o.bloomBlur, r),
                bloomFinalProgram: new m(o.baseVertex, o.bloomFinal, r),
                splatProgram: new m(o.baseVertex, o.splat, r),
                advectionProgram: new m(
                  o.baseVertex,
                  u ? o.advection : o.advectionManualFiltering,
                  r
                ),
                divergenceProgram: new m(o.baseVertex, o.divergence, r),
                curlProgram: new m(o.baseVertex, o.curl, r),
                vorticityProgram: new m(o.baseVertex, o.vorticity, r),
                pressureProgram: new m(o.baseVertex, o.pressure, r),
                gradientSubtractProgram: new m(
                  o.baseVertex,
                  o.gradientSubtract,
                  r
                ),
              }),
            webGL: r,
            colorFormats: i,
            pointers: e,
          };
          var u;
        }),
        (r.activator = function (e, r, n, o, a) {
          if (v) {
            var u = [];
            u.push(new f()), (a = u);
          }
          v = !0;
          var m,
            c,
            s,
            d,
            g,
            p,
            b,
            h,
            S,
            y,
            R = t.behavior,
            T = [],
            E = [],
            x =
              (r.bindBuffer(r.ARRAY_BUFFER, r.createBuffer()),
              r.bufferData(
                r.ARRAY_BUFFER,
                new Float32Array([-1, -1, -1, 1, 1, 1, 1, -1]),
                r.STATIC_DRAW
              ),
              r.bindBuffer(r.ELEMENT_ARRAY_BUFFER, r.createBuffer()),
              r.bufferData(
                r.ELEMENT_ARRAY_BUFFER,
                new Uint16Array([0, 1, 2, 0, 2, 3]),
                r.STATIC_DRAW
              ),
              r.vertexAttribPointer(0, 2, r.FLOAT, !1, 0, 0),
              r.enableVertexAttribArray(0),
              function (e) {
                r.bindFramebuffer(r.FRAMEBUFFER, e),
                  r.drawElements(r.TRIANGLES, 6, r.UNSIGNED_SHORT, 0);
              }),
            P = R.embedded_dither ? U(i.default) : U(l);
          D(), O(parseInt(20 * Math.random()) + 5);
          var k = Date.now();
          function D() {
            var e = n.halfFloatTexType,
              t = n.formatRGBA,
              i = n.formatRG,
              o = n.formatR,
              a = n.supportLinearFiltering ? r.LINEAR : r.NEAREST,
              u = N(R.sim_resolution),
              v = N(R.dye_resolution),
              l = N(R.bloom_resolution);
            (m = u.width),
              (c = u.height),
              (s = v.width),
              (d = v.height),
              (g = g
                ? A(g, s, d, t.internalFormat, t.format, e, a)
                : J(s, d, t.internalFormat, t.format, e, a)),
              (p = p
                ? A(p, m, c, i.internalFormat, i.format, e, a)
                : J(m, c, i.internalFormat, i.format, e, a)),
              (y = _(l.width, l.height, t.internalFormat, t.format, e, a)),
              (b = _(m, c, o.internalFormat, o.format, e, r.NEAREST)),
              (h = _(m, c, o.internalFormat, o.format, e, r.NEAREST)),
              (S = J(m, c, o.internalFormat, o.format, e, r.NEAREST)),
              (T.length = 0);
            for (var f = 0; f < R.bloom_iterations; f++) {
              var E = l.width >> (f + 1),
                x = l.height >> (f + 1);
              if (E < 2 || x < 2) break;
              var P = _(E, x, t.internalFormat, t.format, e, a);
              T.push(P);
            }
          }
          function J(e, r, n, t, i, o) {
            var a = _(e, r, n, t, i, o),
              u = _(e, r, n, t, i, o);
            return {
              get read() {
                return a;
              },
              set read(e) {
                a = e;
              },
              get write() {
                return u;
              },
              set write(e) {
                u = e;
              },
              swap: function () {
                var e = a;
                (a = u), (u = e);
              },
            };
          }
          function _(e, n, t, i, o, a) {
            r.activeTexture(r.TEXTURE0);
            var u = r.createTexture();
            r.bindTexture(r.TEXTURE_2D, u),
              r.texParameteri(r.TEXTURE_2D, r.TEXTURE_MIN_FILTER, a),
              r.texParameteri(r.TEXTURE_2D, r.TEXTURE_MAG_FILTER, a),
              r.texParameteri(r.TEXTURE_2D, r.TEXTURE_WRAP_S, r.CLAMP_TO_EDGE),
              r.texParameteri(r.TEXTURE_2D, r.TEXTURE_WRAP_T, r.CLAMP_TO_EDGE),
              r.texImage2D(r.TEXTURE_2D, 0, t, e, n, 0, i, o, null);
            var v = r.createFramebuffer();
            return (
              r.bindFramebuffer(r.FRAMEBUFFER, v),
              r.framebufferTexture2D(
                r.FRAMEBUFFER,
                r.COLOR_ATTACHMENT0,
                r.TEXTURE_2D,
                u,
                0
              ),
              r.viewport(0, 0, e, n),
              r.clear(r.COLOR_BUFFER_BIT),
              {
                texture: u,
                fbo: v,
                width: e,
                height: n,
                attach: function (e) {
                  return (
                    r.activeTexture(r.TEXTURE0 + e),
                    r.bindTexture(r.TEXTURE_2D, u),
                    e
                  );
                },
              }
            );
          }
          function A(e, n, t, i, a, u, v) {
            return (
              (e.read = (function (e, n, t, i, a, u, v) {
                var l = _(n, t, i, a, u, v);
                return (
                  o.clearProgram.bind(),
                  r.uniform1i(o.clearProgram.uniforms.uTexture, e.attach(0)),
                  r.uniform1f(o.clearProgram.uniforms.value, 1),
                  x(l.fbo),
                  l
                );
              })(e.read, n, t, i, a, u, v)),
              (e.write = _(n, t, i, a, u, v)),
              e
            );
          }
          function U(e) {
            var n = r.createTexture();
            r.bindTexture(r.TEXTURE_2D, n),
              r.texParameteri(r.TEXTURE_2D, r.TEXTURE_MIN_FILTER, r.LINEAR),
              r.texParameteri(r.TEXTURE_2D, r.TEXTURE_MAG_FILTER, r.LINEAR),
              r.texParameteri(r.TEXTURE_2D, r.TEXTURE_WRAP_S, r.REPEAT),
              r.texParameteri(r.TEXTURE_2D, r.TEXTURE_WRAP_T, r.REPEAT),
              r.texImage2D(
                r.TEXTURE_2D,
                0,
                r.RGB,
                1,
                1,
                0,
                r.RGB,
                r.UNSIGNED_BYTE,
                new Uint8Array([255, 255, 255])
              );
            var t = {
                texture: n,
                width: 1,
                height: 1,
                attach: function (e) {
                  return (
                    r.activeTexture(r.TEXTURE0 + e),
                    r.bindTexture(r.TEXTURE_2D, n),
                    e
                  );
                },
              },
              i = new Image();
            return (
              (i.src = e),
              (i.onload = function () {
                (t.width = i.width),
                  (t.height = i.height),
                  r.bindTexture(r.TEXTURE_2D, n),
                  r.texImage2D(
                    r.TEXTURE_2D,
                    0,
                    r.RGB,
                    r.RGB,
                    r.UNSIGNED_BYTE,
                    i
                  );
              }),
              t
            );
          }
          function w(n) {
            R.render_bloom &&
              (function (e, n) {
                if (T.length < 2) return;
                var t = n;
                r.disable(r.BLEND), o.bloomPreFilterProgram.bind();
                var i = R.threshold * R.soft_knee + 1e-4,
                  a = R.threshold - i,
                  u = 2 * i,
                  v = 0.25 / i;
                r.uniform3f(o.bloomPreFilterProgram.uniforms.curve, a, u, v),
                  r.uniform1f(
                    o.bloomPreFilterProgram.uniforms.threshold,
                    R.threshold
                  ),
                  r.uniform1i(
                    o.bloomPreFilterProgram.uniforms.uTexture,
                    e.attach(0)
                  ),
                  r.viewport(0, 0, t.width, t.height),
                  x(t.fbo),
                  o.bloomBlurProgram.bind();
                for (var l = 0; l < T.length; l++) {
                  var m = T[l];
                  r.uniform2f(
                    o.bloomBlurProgram.uniforms.texelSize,
                    1 / t.width,
                    1 / t.height
                  ),
                    r.uniform1i(
                      o.bloomBlurProgram.uniforms.uTexture,
                      t.attach(0)
                    ),
                    r.viewport(0, 0, m.width, m.height),
                    x(m.fbo),
                    (t = m);
                }
                r.blendFunc(r.ONE, r.ONE), r.enable(r.BLEND);
                for (var f = T.length - 2; f >= 0; f--) {
                  var c = T[f];
                  r.uniform2f(
                    o.bloomBlurProgram.uniforms.texelSize,
                    1 / t.width,
                    1 / t.height
                  ),
                    r.uniform1i(
                      o.bloomBlurProgram.uniforms.uTexture,
                      t.attach(0)
                    ),
                    r.viewport(0, 0, c.width, c.height),
                    x(c.fbo),
                    (t = c);
                }
                r.disable(r.BLEND),
                  o.bloomFinalProgram.bind(),
                  r.uniform2f(
                    o.bloomFinalProgram.uniforms.texelSize,
                    1 / t.width,
                    1 / t.height
                  ),
                  r.uniform1i(
                    o.bloomFinalProgram.uniforms.uTexture,
                    t.attach(0)
                  ),
                  r.uniform1f(
                    o.bloomFinalProgram.uniforms.intensity,
                    R.intensity
                  ),
                  r.viewport(0, 0, n.width, n.height),
                  x(n.fbo);
              })(g.read, y),
              null != n && R.transparent
                ? r.disable(r.BLEND)
                : (r.blendFunc(r.ONE, r.ONE_MINUS_SRC_ALPHA),
                  r.enable(r.BLEND));
            var t = null == n ? r.drawingBufferWidth : s,
              i = null == n ? r.drawingBufferHeight : d;
            if ((r.viewport(0, 0, t, i), !R.transparent)) {
              o.colorProgram.bind();
              var a = R.background_color;
              r.uniform4f(
                o.colorProgram.uniforms.color,
                a.r / 255,
                a.g / 255,
                a.b / 255,
                1
              ),
                x(n);
            }
            if (
              (null == n &&
                R.transparent &&
                (o.backgroundProgram.bind(),
                r.uniform1f(
                  o.backgroundProgram.uniforms.aspectRatio,
                  e.width / e.height
                ),
                x(null)),
              R.render_shaders)
            ) {
              var u = R.render_bloom
                ? o.displayBloomShadingProgram
                : o.displayShadingProgram;
              if (
                (u.bind(),
                r.uniform2f(u.uniforms.texelSize, 1 / t, 1 / i),
                r.uniform1i(u.uniforms.uTexture, g.read.attach(0)),
                R.render_bloom)
              ) {
                r.uniform1i(u.uniforms.uBloom, y.attach(1)),
                  r.uniform1i(u.uniforms.uDithering, P.attach(2));
                var v = Z(P, t, i);
                r.uniform2f(u.uniforms.ditherScale, v.x, v.y);
              }
            } else {
              var l = R.render_bloom ? o.displayBloomProgram : o.displayProgram;
              if (
                (l.bind(),
                r.uniform1i(l.uniforms.uTexture, g.read.attach(0)),
                R.render_bloom)
              ) {
                r.uniform1i(l.uniforms.uBloom, y.attach(1)),
                  r.uniform1i(l.uniforms.uDithering, P.attach(2));
                var m = Z(P, t, i);
                r.uniform2f(l.uniforms.ditherScale, m.x, m.y);
              }
            }
            x(n);
          }
          function F(n, t, i, a, u) {
            r.viewport(0, 0, m, c),
              o.splatProgram.bind(),
              r.uniform1i(o.splatProgram.uniforms.uTarget, p.read.attach(0)),
              r.uniform1f(
                o.splatProgram.uniforms.aspectRatio,
                e.width / e.height
              ),
              r.uniform2f(
                o.splatProgram.uniforms.point,
                n / e.width,
                1 - t / e.height
              ),
              r.uniform3f(o.splatProgram.uniforms.color, i, -a, 1),
              r.uniform1f(o.splatProgram.uniforms.radius, R.emitter_size / 100),
              x(p.write.fbo),
              p.swap(),
              r.viewport(0, 0, s, d),
              r.uniform1i(o.splatProgram.uniforms.uTarget, g.read.attach(0)),
              r.uniform3f(o.splatProgram.uniforms.color, u.r, u.g, u.b),
              x(g.write.fbo),
              g.swap();
          }
          function O(e) {
            F(500, 500, 100, 0, {r: 255, b: 0, g: 0});
          }
          function L() {
            var e = (function (e, r, n) {
              var t, i, o, a, u, v, l, m;
              switch (
                ((a = Math.floor(6 * e)),
                (v = n * (1 - r)),
                (l = n * (1 - (u = 6 * e - a) * r)),
                (m = n * (1 - (1 - u) * r)),
                a % 6)
              ) {
                case 0:
                  (t = n), (i = m), (o = v);
                  break;
                case 1:
                  (t = l), (i = n), (o = v);
                  break;
                case 2:
                  (t = v), (i = n), (o = m);
                  break;
                case 3:
                  (t = v), (i = l), (o = n);
                  break;
                case 4:
                  (t = m), (i = v), (o = n);
                  break;
                case 5:
                  (t = n), (i = v), (o = l);
              }
              return {r: t, g: i, b: o};
            })(Math.random(), 1, 1);
            return (e.r *= 0.15), (e.g *= 0.15), (e.b *= 0.15), e;
          }
          function N(e) {
            var n = r.drawingBufferWidth / r.drawingBufferHeight;
            n < 1 && (n = 1 / n);
            var t = Math.round(e * n),
              i = Math.round(e);
            return r.drawingBufferWidth > r.drawingBufferHeight
              ? {width: t, height: i}
              : {width: i, height: t};
          }
          function Z(e, r, n) {
            return {x: r / e.width, y: n / e.height};
          }
          (function t() {
            (e.width == e.clientWidth && e.height == e.clientHeight) ||
              ((e.width = e.clientWidth), (e.height = e.clientHeight), D());
            !(function () {
              E.length > 0 && O(E.pop());
              for (var e = 0; e < a.length; e++) {
                var r = a[e];
                r.moved &&
                  (F(r.x, r.y, r.dx, r.dy, r.color), 1 !== e && (r.moved = !1));
              }
              if (!R.multi_color) return;
              if (k + 100 < Date.now()) {
                k = Date.now();
                for (var n = 0; n < a.length; n++) {
                  var t = a[n];
                  t.color = L();
                }
              }
            })();
            R.paused ||
              (function (e) {
                r.disable(r.BLEND),
                  r.viewport(0, 0, m, c),
                  o.curlProgram.bind(),
                  r.uniform2f(o.curlProgram.uniforms.texelSize, 1 / m, 1 / c),
                  r.uniform1i(
                    o.curlProgram.uniforms.uVelocity,
                    p.read.attach(0)
                  ),
                  x(h.fbo),
                  o.vorticityProgram.bind(),
                  r.uniform2f(
                    o.vorticityProgram.uniforms.texelSize,
                    1 / m,
                    1 / c
                  ),
                  r.uniform1i(
                    o.vorticityProgram.uniforms.uVelocity,
                    p.read.attach(0)
                  ),
                  r.uniform1i(o.vorticityProgram.uniforms.uCurl, h.attach(1)),
                  r.uniform1f(o.vorticityProgram.uniforms.curl, R.curl),
                  r.uniform1f(o.vorticityProgram.uniforms.dt, e),
                  x(p.write.fbo),
                  p.swap(),
                  o.divergenceProgram.bind(),
                  r.uniform2f(
                    o.divergenceProgram.uniforms.texelSize,
                    1 / m,
                    1 / c
                  ),
                  r.uniform1i(
                    o.divergenceProgram.uniforms.uVelocity,
                    p.read.attach(0)
                  ),
                  x(b.fbo),
                  o.clearProgram.bind(),
                  r.uniform1i(
                    o.clearProgram.uniforms.uTexture,
                    S.read.attach(0)
                  ),
                  r.uniform1f(o.clearProgram.uniforms.value, R.pressure),
                  x(S.write.fbo),
                  S.swap(),
                  o.pressureProgram.bind(),
                  r.uniform2f(
                    o.pressureProgram.uniforms.texelSize,
                    1 / m,
                    1 / c
                  ),
                  r.uniform1i(
                    o.pressureProgram.uniforms.uDivergence,
                    b.attach(0)
                  );
                for (var t = 0; t < R.pressure_iteration; t++)
                  r.uniform1i(
                    o.pressureProgram.uniforms.uPressure,
                    S.read.attach(1)
                  ),
                    x(S.write.fbo),
                    S.swap();
                o.gradientSubtractProgram.bind(),
                  r.uniform2f(
                    o.gradientSubtractProgram.uniforms.texelSize,
                    1 / m,
                    1 / c
                  ),
                  r.uniform1i(
                    o.gradientSubtractProgram.uniforms.uPressure,
                    S.read.attach(0)
                  ),
                  r.uniform1i(
                    o.gradientSubtractProgram.uniforms.uVelocity,
                    p.read.attach(1)
                  ),
                  x(p.write.fbo),
                  p.swap(),
                  o.advectionProgram.bind(),
                  r.uniform2f(
                    o.advectionProgram.uniforms.texelSize,
                    1 / m,
                    1 / c
                  ),
                  n.supportLinearFiltering ||
                    r.uniform2f(
                      o.advectionProgram.uniforms.dyeTexelSize,
                      1 / m,
                      1 / c
                    );
                var i = p.read.attach(0);
                r.uniform1i(o.advectionProgram.uniforms.uVelocity, i),
                  r.uniform1i(o.advectionProgram.uniforms.uSource, i),
                  r.uniform1f(o.advectionProgram.uniforms.dt, e),
                  r.uniform1f(
                    o.advectionProgram.uniforms.dissipation,
                    R.velocity
                  ),
                  x(p.write.fbo),
                  p.swap(),
                  r.viewport(0, 0, s, d),
                  n.supportLinearFiltering ||
                    r.uniform2f(
                      o.advectionProgram.uniforms.dyeTexelSize,
                      1 / s,
                      1 / d
                    );
                r.uniform1i(
                  o.advectionProgram.uniforms.uVelocity,
                  p.read.attach(0)
                ),
                  r.uniform1i(
                    o.advectionProgram.uniforms.uSource,
                    g.read.attach(1)
                  ),
                  r.uniform1f(
                    o.advectionProgram.uniforms.dissipation,
                    R.dissipation
                  ),
                  x(g.write.fbo),
                  g.swap();
              })(0.016);
            w(null);
            requestAnimationFrame(t);
          })(),

            //Animation without key press
            // fix animation wont start if maouse move
            // Set the initial state to true after a short delay
            setTimeout(function () {
              a[0].down = true;
              a[0].color = L();
            }, 300); // Adjust the delay as needed
            
            
            // Set the initial state to true to simulate a continuous "mousedown"
            // a[0].down = true;

            e.addEventListener("mousemove", function (e) {
              (a[0].moved = a[0].down),
                (a[0].dx = 5 * (e.offsetX - a[0].x)),
                (a[0].dy = 5 * (e.offsetY - a[0].y)),
                (a[0].x = e.offsetX),
                (a[0].y = e.offsetY);
            }),
            
            //Animation with key press
            // e.addEventListener("mousedown", function () {
            //   (a[0].down = !0), (a[0].color = L());
            // }),
            // window.addEventListener("mouseup", function () {
            //   a[0].down = !1;
            // }),
            window.addEventListener("keydown", function (e) {
              "KeyP" === e.code && (R.paused = !R.paused),
                " " === e.key && E.push(parseInt(20 * Math.random()) + 5);
            });
        }),
        (r.setDitherURL = function (e) {
          l = e;
        });
      var t = o(n(0)),
        i = o(n(3));
      function o(e) {
        if (e && e.__esModule) return e;
        var r = {};
        if (null != e)
          for (var n in e)
            if (Object.prototype.hasOwnProperty.call(e, n)) {
              var t =
                Object.defineProperty && Object.getOwnPropertyDescriptor
                  ? Object.getOwnPropertyDescriptor(e, n)
                  : {};
              t.get || t.set ? Object.defineProperty(r, n, t) : (r[n] = e[n]);
            }
        return (r.default = e), r;
      }
      function a(e, r) {
        if (!(e instanceof r))
          throw new TypeError("Cannot call a class as a function");
      }
      function u(e, r) {
        for (var n = 0; n < r.length; n++) {
          var t = r[n];
          (t.enumerable = t.enumerable || !1),
            (t.configurable = !0),
            "value" in t && (t.writable = !0),
            Object.defineProperty(e, t.key, t);
        }
      }
      var v = !1,
        l = "./assets/dither.png";
      var m = (function () {
          function e(r, n, t) {
            if (
              (a(this, e),
              (this.uniforms = {}),
              (this.webGL = t),
              (this.program = t.createProgram()),
              t.attachShader(this.program, r),
              t.attachShader(this.program, n),
              t.linkProgram(this.program),
              !t.getProgramParameter(this.program, t.LINK_STATUS))
            )
              throw t.getProgramInfoLog(this.program);
            for (
              var i = t.getProgramParameter(this.program, t.ACTIVE_UNIFORMS),
                o = 0;
              o < i;
              o++
            ) {
              var u = t.getActiveUniform(this.program, o).name;
              this.uniforms[u] = t.getUniformLocation(this.program, u);
            }
          }
          var r, n, t;
          return (
            (r = e),
            (n = [
              {
                key: "bind",
                value: function () {
                  this.webGL.useProgram(this.program);
                },
              },
            ]) && u(r.prototype, n),
            t && u(r, t),
            e
          );
        })(),
        f = function e() {
          a(this, e),
            (this.id = -1),
            (this.x = 0),
            (this.y = 0),
            (this.dx = 0),
            (this.dy = 0),
            (this.down = !1),
            (this.moved = !1),
            (this.color = [30, 0, 300]);
        };
    },
    function (e, r) {
      e.exports =
        "data:image/png;base64,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";
    },
  ]);
});
