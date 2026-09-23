/**
 * 文字动态效果 —— 移植自「小」文件夹的 text.js（binft 彩色光标轮播）
 * 效果：逐字打出当前文案 → 停留 → 逐字删除 → 切换下一条，循环往复
 *       文字尾部附带随机彩色字符光标（20 色渐变，随删随补）
 * 适配：读取 .animated-text 元素的 data-words 属性（逗号分隔多条文案）
 */
(function () {
  var txtElement = document.querySelector(".animated-text");
  if (!txtElement) return;

  var wordsAttr = txtElement.getAttribute("data-words") || "";
  var o = wordsAttr
    .split(/[,，、;；]\s*/) // 支持中英文逗号/顿号/分号分隔多条文案
    .map(function (w) {
      return w.trim();
    })
    .filter(function (w) {
      return w.length > 0;
    })
    .map(function (r) {
      return r + ".";
    });
  if (o.length === 0) return;

  // 光标随机颜色池（与原版一致）
  var b = [
    "rgb(110,64,170)", "rgb(150,61,179)", "rgb(191,60,175)", "rgb(228,65,157)",
    "rgb(254,75,131)", "rgb(255,94,99)", "rgb(255,120,71)", "rgb(251,150,51)",
    "rgb(226,183,47)", "rgb(198,214,60)", "rgb(175,240,91)", "rgb(127,246,88)",
    "rgb(82,246,103)", "rgb(48,239,130)", "rgb(29,223,163)", "rgb(26,199,194)",
    "rgb(35,171,216)", "rgb(54,140,225)", "rgb(76,110,219)", "rgb(96,84,200)"
  ];

  function t() {
    return b[Math.floor(Math.random() * b.length)];
  }

  function e() {
    return String.fromCharCode(94 * Math.random() + 33);
  }

  // 生成 n 个随机彩色字符的光标片段
  function n(r) {
    for (var frag = document.createDocumentFragment(), i = 0; r > i; i++) {
      var l = document.createElement("span");
      l.textContent = e();
      l.style.color = t();
      frag.appendChild(l);
    }
    return frag;
  }

  var a = 2, // 打完停留轮数
    g = 1, // 步长
    s = 5, // 光标最长字符数
    d = 75, // 每轮间隔 ms
    c = {
      text: "",
      skillI: 0,
      skillP: 0,
      direction: "forward",
      delay: a,
      step: g
    };

  function i() {
    var word = o[c.skillI];

    if (c.step) {
      c.step--;
    } else {
      c.step = g;
      if ("forward" === c.direction) {
        if (c.skillP < word.length) {
          c.text += word[c.skillP];
          c.skillP++;
        } else if (c.delay) {
          c.delay--;
        } else {
          c.direction = "backward";
          c.delay = a;
        }
      } else {
        if (c.skillP > 0) {
          c.text = c.text.slice(0, -1);
          c.skillP--;
        } else {
          c.skillI = (c.skillI + 1) % o.length;
          c.direction = "forward";
        }
      }
    }

    txtElement.textContent = c.text;
    txtElement.appendChild(n(Math.min(s, word.length - c.skillP)));
    setTimeout(i, d);
  }

  i();
})();
