// lifeTime 祯数
const color1 = {
  h: 279,
  s: "100%",
  l: "50%",
  a: "80%"
};
const color2 = {
  h: 197,
  s: "100%",
  l: "50%",
  a: "80%"
};
const color3 = {
  h: 0,
  s: "100%",
  l: "50%",
  a: "80%"
};
const points1 = [];
const points2 = [];
const Actions = [
  {
    lifeTime: 60,
    texts: [
      {
        text: "3",
        hsla: color1
      }
    ]
  },
  {
    lifeTime: 90,
    func: (width, height) => {
      if (!points1.length) {
        for (let i = 0; i < 1200; i++) {
          let x = (i - 1200 / 2) / 300;
          let y =
            Math.sqrt(Math.abs(x)) - Math.sqrt(Math.cos(x)) * Math.cos(30 * x);
          if (!isNaN(y)) {
            points1.push({ x, y });
          }
        }
      }

      const p = points1[~~(Math.random() * points1.length)];
      const radius = Math.min(width * 0.4, height * 0.4);
      return {
        x: (p.x * radius) / 2,
        y: (p.y * radius) / 2,
        z: ~~(Math.random() * 30),
        color: {
          h: 0,
          s: "100%",
          l: "70%",
          a: "80%"
        }
      };
    }
  },
  {
    lifeTime: 60,
    texts: [
      {
        text: "2",
        hsla: color1
      }
    ]
  },
  {
    lifeTime: 90,
    func: (width, height) => {
      if (!points2.length) {
        const img = document.getElementById("tulip");
        const offscreenCanvas = document.createElement("canvas");
        const offscreenCanvasCtx = offscreenCanvas.getContext("2d");
        const imgWidth = 200;
        const imgHeight = 200;
        offscreenCanvas.setAttribute("width", imgWidth);
        offscreenCanvas.setAttribute("height", imgHeight);
        offscreenCanvasCtx.drawImage(img, 0, 0, imgWidth, imgHeight);
        let imgData = offscreenCanvasCtx.getImageData(
          0,
          0,
          imgWidth,
          imgHeight
        );
        for (let i = 0, max = imgData.width * imgData.height; i < max; i++) {
          if (imgData.data[i * 4 + 3]) {
            points2.push({
              x: (i % imgData.width) / imgData.width,
              y: i / imgData.width / imgData.height
            });
          }
        }
      }
      const p = points2[~~(Math.random() * points2.length)];
      const radius = Math.min(width * 0.8, height * 0.8);
      return {
        x: p.x * radius - radius / 2,
        y: (1 - p.y) * radius - radius / 2,
        z: ~~(Math.random() * 30),
        color: {
          h: 0,
          s: "100%",
          l: "60%",
          a: "80%"
        }
      };
    }
  },
  {
    lifeTime: 60,
    texts: [
      {
        text: "1",
        hsla: color1
      }
    ]
  },
  {
    lifeTime: 180,
    texts: [
      {
        text: "I",
        hsla: color2
      },
      {
        text: " ❤️ ",
        hsla: color3
      },
      {
        text: "Y",
        hsla: color2
      },
      {
        text: "O",
        hsla: color2
      },
      {
        text: "U",
        hsla: color2
      }
    ]
  }
];
