const FOCUS_POSITION = 1200,
  SPRING = 0.01,
  FRICTION = 0.9;
class PARTICLE {
  constructor(t) {
    (this.center = t),
      (this.x = 0),
      (this.y = 0),
      (this.z = 0),
      (this.vx = 0),
      (this.vy = 0),
      (this.vz = 0),
      (this.nextX = 0),
      (this.nextY = 0),
      (this.nextZ = 0);
  }
  setAxis(t) {
    (this.nextX = t.x),
      (this.nextY = t.y),
      (this.nextZ = t.z),
      (this.color = t.color);
  }
  rotateX(t) {
    const i = Math.sin(t),
      e = Math.cos(t),
      s = this.nextY * e - this.nextZ * i,
      h = this.nextZ * e + this.nextY * i,
      n = this.y * e - this.z * i,
      a = this.z * e + this.y * i;
    (this.nextY = s), (this.nextZ = h), (this.y = n), (this.z = a);
  }
  rotateY(t) {
    const i = Math.sin(t),
      e = Math.cos(t),
      s = this.nextX * e - this.nextZ * i,
      h = this.nextZ * e + this.nextX * i,
      n = this.x * e - this.z * i,
      a = this.z * e + this.x * i;
    (this.nextX = s), (this.nextZ = h), (this.x = n), (this.z = a);
  }
  rotateZ(t) {
    const i = Math.sin(t),
      e = Math.cos(t),
      s = this.nextX * e - this.nextY * i,
      h = this.nextY * e + this.nextX * i,
      n = this.x * e - this.y * i,
      a = this.y * e + this.x * i;
    (this.nextX = s), (this.nextY = h), (this.x = n), (this.y = a);
  }
  step() {
    (this.vx += (this.nextX - this.x) * SPRING),
      (this.vy += (this.nextY - this.y) * SPRING),
      (this.vz += (this.nextZ - this.z) * SPRING),
      (this.vx *= FRICTION),
      (this.vy *= FRICTION),
      (this.vz *= FRICTION),
      (this.x += this.vx),
      (this.y += this.vy),
      (this.z += this.vz);
  }
  getAxis2D() {
    this.step();
    const t = FOCUS_POSITION / (FOCUS_POSITION + this.z);
    return { x: this.center.x + this.x * t, y: this.center.y - this.y * t };
  }
}
const lineHeight = 7;
let praticle_count = 1e3;
function getRequestParam(t) {
  const i = t || window.location.search,
    e = {};
  if (-1 !== i.indexOf("?")) {
    const t = i.substr(1).split("&");
    for (let i = 0; i < t.length; i += 1)
      e[t[i].split("=")[0]] = t[i].split("=")[1];
  }
  return e;
}
function color(t) {
  return `hsla(${t.h},${t.s},${t.l},${t.a})`;
}
const ArcCanvas = {};
function createArcCanvas(t) {
  const i = document.createElement("canvas"),
    e = i.getContext("2d");
  i.setAttribute("width", 40),
    i.setAttribute("height", 40),
    (e.fillStyle = t),
    e.arc(20, 20, 20, 0, 2 * Math.PI),
    e.fill(),
    (ArcCanvas[t] = i);
}
class Scene {
  constructor(t, i, e) {
    (this.ctx = t), (this.draw = this.draw.bind(this)), this.init(i, e);
  }
  init(t, i) {
    (this.width = t),
      (this.height = i),
      (this.center = { x: t / 2, y: i / 2 }),
      (this.geometrys = []),
      (this.activeGeometry = null),
      (this.tick = 0),
      (this.actionIndex = -1),
      (this.particles = []);
    for (let t = 0; t < praticle_count; t++)
      this.particles.push(new PARTICLE(this.center));
    this.clear(), cancelAnimationFrame(this.raf);
  }
  clear() {
    (this.ctx.fillStyle = "rgba(255, 247, 240,0.3)"),
      this.ctx.fillRect(0, 0, this.width, this.height);
  }
  build(t) {
    (this.actions = t),
      (this.geometrys = this.actions.map(t =>
        t.func ? t.func : this.buildGeometry(t.texts)
      )),
      this.geometrys.length && this.nextAction();
  }
  buildGeometry(t) {
    const i = [];
    let e = "";
    t.forEach(t => {
      e += t.text;
    });
    const s = ([+!+[] + !+[]] + [+[]] + [+[]]) | 0,
      h = ~~((s * this.height) / this.width),
      n = document.createElement("canvas"),
      a = n.getContext("2d");
    n.setAttribute("width", s),
      n.setAttribute("height", h),
      (a.fillStyle = "#000"),
      (a.font = "bold 10px Arial");
    const c = a.measureText(e),
      r = Math.min((0.8 * h * 10) / lineHeight, (0.8 * s * 10) / c.width);
    a.font = `bold ${r}px Arial`;
    const o = a.measureText(e);
    let x = (s - o.width) / 2;
    const l = (h + (r / 10) * lineHeight) / 2;
    return (
      Object.values(t).forEach(t => {
        a.clearRect(0, 0, s, h),
          a.fillText(t.text, x, l),
          (x += a.measureText(t.text).width);
        const e = a.getImageData(0, 0, s, h),
          n = [];
        for (let t = 0, i = e.width * e.height; t < i; t++)
          e.data[4 * t + 3] &&
            n.push({ x: (t % e.width) / e.width, y: t / e.width / e.height });
        i.push({ color: t.hsla, points: n });
      }),
      i
    );
  }
  nextAction() {
    this.actionIndex++,
      this.actionIndex >= this.actions.length && (this.actionIndex = 0),
      (this.activeGeometry = this.geometrys[this.actionIndex]),
      (this.tick = 0),
      this.setParticle();
  }
  setParticle() {
    if ("function" == typeof this.activeGeometry)
      this.particles.forEach(t => {
        t.setAxis(this.activeGeometry(this.width, this.height));
      });
    else {
      const t = this.activeGeometry.length;
      this.particles.forEach((i, e) => {
        let s = this.activeGeometry[e % t],
          h = s.points[~~(Math.random() * s.points.length)];
        i.setAxis({
          x: h.x * canvasWidth - this.center.x,
          y: (1 - h.y) * canvasHeight - this.center.y,
          z: ~~(30 * Math.random()),
          color: s.color
        });
      });
    }
  }
  renderParticles() {
    this.particles.forEach(t => {
      const i = t.getAxis2D();
      if ((this.ctx.beginPath(), "1" === getRequestParam().img))
        this.ctx.drawImage(HeartCanvas, i.x - 15, i.y - 15, 30, 30);
      else {
        const e = color(t.color);
        ArcCanvas[e] || createArcCanvas(e),
          this.ctx.drawImage(ArcCanvas[e], i.x - 2, i.y - 2, 4, 4);
      }
    });
  }
  draw() {
    this.tick++,
      this.tick >= this.actions[this.actionIndex].lifeTime && this.nextAction(),
      this.clear(),
      this.renderParticles(),
      (this.raf = requestAnimationFrame(this.draw));
  }
}
var canvas, ctx, canvasWidth, canvasHeight, scene, img, HeartCanvas;
function load() {
  (canvas = document.querySelector("#mycanvas")),
    (ctx = canvas.getContext("2d")),
    createHeartCanvas(),
    reset(),
    (scene = new Scene(ctx, canvasWidth, canvasHeight)).build(Actions),
    scene.draw();
}
function createHeartCanvas() {
  HeartCanvas = document.getElementById("tulip");
}
function reset() {
  (canvasWidth = window.innerWidth), (canvasHeight = window.innerHeight);
  const t = window.devicePixelRatio || 1;
  (canvas.width = canvasWidth * t),
    (canvas.height = canvasHeight * t),
    ctx.scale(t, t),
    scene && scene.init(canvasWidth, canvasHeight),
    scene && scene.build(Actions),
    scene && scene.draw();
}
window.addEventListener("load", load), window.addEventListener("resize", reset);
