export const loadScript = function (url: string, name: string) {
  return new Promise<boolean>((resolve, reject) => {
    if (!url || !name) {
      throw new Error(`必需传入脚本名称以及脚本URL`);
    }
    const existingScript = document.getElementById(name);
    if (!existingScript) {
      const script = document.createElement("script");
      script.src = url;
      script.id = name;
      document.body.appendChild(script);
      script.onload = () => {
        resolve(true);
      };
      script.onerror = (ev) => {
        reject(ev);
      };
    }
    if (existingScript) resolve(true);
  });
};

export const loadCSS = function (url: string, name: string) {
  return new Promise((resolve, reject) => {
    if (!url || !name) {
      throw new Error(`必需传入样式名称或URL`);
    }
    const existingStyleSheet = document.getElementById(name);
    if (!existingStyleSheet) {
      const stylesheet = document.createElement("link");
      stylesheet.href = url;
      stylesheet.id = name;
      stylesheet.rel = "stylesheet";
      document.head.appendChild(stylesheet);
      stylesheet.onload = () => {
        resolve(true);
      };
      stylesheet.onerror = (e) => {
        reject(e);
      };
    }
    if (existingStyleSheet) resolve(true);
  });
};

const waterfall = function (promises: Promise<boolean>[]) {
  return promises.reduce(function (p, c: Promise<boolean>) {
    return p.then(function () {
      return c.then(function () {
        return true;
      });
    });
  }, Promise.resolve(true));
};

// 按顺序加载
export const loadScriptsInOrder = function (arrayOfJs: []) {
  const promises = arrayOfJs.map(function ({ url, name }) {
    return loadScript(url, name);
  });
  return waterfall(promises);
};
