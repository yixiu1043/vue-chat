import { showToast } from '@/service/helper';

export default class tool {
  // 获取粘贴板图片数据
  static pasteSendImg = (e, success) => {
    e = e || event;
    if (e.originalEvent) {
      e = e.originalEvent;
    }
    const cbd = e.clipboardData;
    const ua = window.navigator.userAgent;
    // 如果是 Safari 直接 return
    if (!(e.clipboardData && e.clipboardData.items)) {
      showToast('当前浏览器不支持');
      return;
    }
    // Mac平台下Chrome49版本以下 复制Finder中的文件的Bug Hack掉
    if (cbd.items && cbd.items.length === 2 && cbd.items[0].kind === 'string' && cbd.items[1].kind === 'file'
      && cbd.types && cbd.types.length === 2 && cbd.types[0] === 'text/plain' && cbd.types[1] === 'Files'
      && ua.match(/Macintosh/i) && Number(ua.match(/Chrome\/(\d{2})/i)[1]) < 49) {
      return;
    }
    //文件类型是Files，并且数据格式是image，才进行正常发送
    if (cbd.types[0] === 'Files' && cbd.items[0].type.includes('image')) {
      for (let i = 0; i < cbd.items.length; i++) {
        const item = cbd.items[i];
        if (item.kind === 'file') {
          const blob = item.getAsFile();
          if (blob.size === 0) {
            return;
          }
          success(blob);
          // blob 就是从剪切板获得的文件 可以进行上传或其他操作
        }
      }
    }
  }
  // 压缩文件
  static compressImage = (file, success) => {

    if (!/image\/\w+/.test(file.type)) {
      showToast('请确保文件为图像类型');
      return;
    }
    // 图片小于1M不压缩
    if (file.size < Math.pow(1024, 2)) {
      return success(file);
    }
    if (file.type === 'image/gif') {
      return success(file);
    }

    const name = file.name; //文件名
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (e) => {
      const src = e.target.result;

      const img = new Image();
      img.src = src;
      img.onload = (e) => {
        const w = img.width;
        const h = img.height;
        const quality = 0.92;  // 默认图片质量为0.92
        //生成canvas
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        // 创建属性节点
        const anw = document.createAttribute("width");
        anw.nodeValue = w;
        const anh = document.createAttribute("height");
        anh.nodeValue = h;
        canvas.setAttributeNode(anw);
        canvas.setAttributeNode(anh);

        //铺底色 PNG转JPEG时透明区域会变黑色
        ctx.fillStyle = "#fff";
        ctx.fillRect(0, 0, w, h);

        ctx.drawImage(img, 0, 0, w, h);
        // quality值越小，所绘制出的图像越模糊
        const base64 = canvas.toDataURL('image/jpeg', quality); //图片格式jpeg或webp可以选0-1质量区间

        // 返回base64转blob的值
        console.log(`原图${(src.length / 1024).toFixed(2)}kb`, `新图${(base64.length / 1024).toFixed(2)}kb`);
        //去掉url的头，并转换为byte
        const bytes = window.atob(base64.split(',')[1]);
        //处理异常,将ascii码小于0的转换为大于0
        const ab = new ArrayBuffer(bytes.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < bytes.length; i++) {
          ia[i] = bytes.charCodeAt(i);
        }
        file = new Blob([ab], { type: 'image/jpeg' });
        file.name = name;

        success(file);
      }
      img.onerror = (e) => {
        console.log(e);
        showToast('图片不支持');
      }
    }
    reader.onerror = (e) => {
      console.log(e);
      showToast('图片不支持');
    }
  }

  // 图片转成base64
  static uploadImgToBase64 (file) {
    const size = (file.size / 1024) / 1024;
    // if (size > 2) {
    //   showToast('图片太大,超过2M');
    //   return false;
    // }
    return (new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      // 图片转base64完成后返回reader对象
      reader.onload = () => {
        resolve(reader);
        showToast('发送成功');
      };
      reader.onerror = (error) => {
        console.log(error);
        showToast('未知错误');
      };
    }));
  }
}