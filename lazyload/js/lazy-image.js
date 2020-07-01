class LazyImage {
  constructor(selector) {
    // 懒记载图片列表，将伪数组转为数组，以便可以使用数组的api
    this.lazyImages = Array.prototype.slice.call(
      document.querySelectorAll(selector)
    );
    this.init();
  }

  inViewShow() {
    // 不支持IntersectionObserver api的情况下判断图片是否出现在可视区域内
    let len = this.lazyImages.length;
    for (let i = 0; i < len; i++) {
      let lazyImage = this.lazyImages[i];
      const rect = lazyImage.getBoundingClientRect();
      // 出现在视野的时候加载图片
      if (rect.top < document.documentElement.clientHeight) {
        lazyImage.src = lazyImage.dataset.src;
        // 移除掉已经显示的
        this.lazyImages.splice(i, 1);
        len--;
        i--;
        if (this.lazyImages.length === 0) {
          // 如果全部都加载完 则去掉滚动事件监听
          document.removeEventListener("scroll", this._throttleFn);
        }
      }
    }
  }

  throttle(fn, delay = 15, mustRun = 30) {
    let t_start = null;
    let timer = null;
    let context = this;
    return function () {
      let t_current = +new Date();
      let args = Array.prototype.slice.call(arguments);
      clearTimeout(timer);
      if (!t_start) {
        t_start = t_current;
      }
      if (t_current - t_start > mustRun) {
        fn.apply(context, args);
        t_start = t_current;
      } else {
        timer = setTimeout(() => {
          fn.apply(context, args);
        }, delay);
      }
    };
  }

  init() {
    // 通过IntersectionObserver api判断图片是否出现在可视区域内，不需要监听Scroll来判断
    if ("IntersectionObserver" in window) {
      let lazyImageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry, index) => {
          // 如果元素可见
          if (entry.isIntersecting) {
            let lazyImage = entry.target;
            lazyImage.src = lazyImage.dataset.src;
            lazyImageObserver.unobserve(lazyImage);
            // this.lazyImages.splice(index, 1)
          }
        });
      });
      this.lazyImages.forEach(function (lazyImage) {
        lazyImageObserver.observe(lazyImage);
      });
    } else {
      this.inViewShow();
      this._throttleFn = this.throttle(this.inViewShow);
      document.addEventListener("scroll", this._throttleFn);
    }
  }
}
