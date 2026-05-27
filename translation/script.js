/* ============================================================
   TRUNG–VIỆT PRO — script.js
   ============================================================ */

'use strict';

// ===== CONFIG =====
const CONFIG = {
  geminiApiKey: localStorage.getItem('geminiApiKey') || '',
};

// ===== TRANSLATE COUNT =====
let translateCount = parseInt(localStorage.getItem('translateCount') || '0');
function bumpCount() {
  translateCount++;
  localStorage.setItem('translateCount', translateCount);
  const el = document.getElementById('translate-count');
  if (el) el.textContent = translateCount;
}
document.getElementById('translate-count').textContent = translateCount;

// ===== PARTICLES BACKGROUND =====
(function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  const ctx = canvas.getContext('2d');
  let W, H, particles = [];

  const CHARS = ['福','寿','喜','龙','中','越','爱','好','美','乐'];
  const TYPES = ['char', 'lantern', 'petal'];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  function makeParticle(initialY = false) {
    const type = TYPES[Math.floor(Math.random() * TYPES.length)];
    const size = type === 'char' ? 14 + Math.random() * 18
               : type === 'lantern' ? 16 + Math.random() * 14
               : 8 + Math.random() * 10;
    
    return {
      type,
      x: Math.random() * W,
      y: initialY ? Math.random() * H : (type === 'petal' ? -20 : H + 20),
      size,
      width: size,
      height: size * 0.65,
      char: CHARS[Math.floor(Math.random() * CHARS.length)],
      speed: type === 'petal' ? 0.6 + Math.random() * 0.8 : 0.3 + Math.random() * 0.5,
      opacity: type === 'char' ? 0.04 + Math.random() * 0.08
             : type === 'lantern' ? 0.05 + Math.random() * 0.08
             : 0.12 + Math.random() * 0.15,
      drift: (Math.random() - 0.3) * 0.5,
      angle: Math.random() * Math.PI * 2,
      spin: (Math.random() - 0.5) * 0.03,
    };
  }

  function init() {
    particles = [];
    const densityPref = localStorage.getItem('particleDensity') || 'medium';
    const count = densityPref === 'low' ? 15 : densityPref === 'high' ? 50 : 30;
    for (let i = 0; i < count; i++) {
      const p = makeParticle(true);
      particles.push(p);
    }
  }
  init();
  window.reinitParticles = init;

  function draw() {
    ctx.clearRect(0, 0, W, H);
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    
    particles.forEach(p => {
      ctx.save();
      ctx.globalAlpha = p.opacity;
      
      if (p.type === 'char') {
        ctx.font = `bold ${p.size}px serif`;
        ctx.fillStyle = isDark ? '#ff6b6b' : '#b71c1c';
        ctx.fillText(p.char, p.x, p.y);
        p.y -= p.speed;
        p.x += p.drift;
        if (p.y < -40) { Object.assign(p, makeParticle(false)); }
      } 
      else if (p.type === 'lantern') {
        ctx.translate(p.x, p.y);
        ctx.shadowBlur = 10;
        ctx.shadowColor = isDark ? 'rgba(255, 107, 107, 0.8)' : 'rgba(255, 168, 37, 0.8)';
        ctx.fillStyle = isDark ? '#ff4757' : '#d32f2f';
        ctx.beginPath();
        ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.strokeStyle = '#d4af37';
        ctx.lineWidth = 1.5;
        ctx.stroke();
        
        ctx.fillStyle = '#d4af37';
        ctx.fillRect(-p.size / 4, -p.size / 2 - 1, p.size / 2, 2);
        ctx.fillRect(-p.size / 4, p.size / 2 - 1, p.size / 2, 2);
        
        p.y -= p.speed;
        p.x += p.drift * 0.4;
        if (p.y < -40) { Object.assign(p, makeParticle(false)); }
      } 
      else if (p.type === 'petal') {
        ctx.translate(p.x, p.y);
        ctx.rotate(p.angle);
        ctx.beginPath();
        ctx.ellipse(0, 0, p.width, p.height, 0, 0, Math.PI * 2);
        ctx.fillStyle = isDark ? '#ff6b81' : '#ffb6c1';
        ctx.fill();
        
        ctx.strokeStyle = isDark ? '#ff8797' : '#ffccd5';
        ctx.lineWidth = 0.5;
        ctx.stroke();
        
        p.y += p.speed;
        p.x += p.drift;
        p.angle += p.spin;
        if (p.y > H + 40) { Object.assign(p, makeParticle(false)); }
      }
      
      ctx.restore();
    });
    requestAnimationFrame(draw);
  }
  draw();
})();

// ===== DARK MODE =====
const themeToggle = document.getElementById('theme-toggle');
const themeIcon   = themeToggle.querySelector('.theme-icon');
let isDark = localStorage.getItem('theme') === 'dark';

function applyTheme() {
  document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
  themeIcon.textContent = isDark ? '☀️' : '🌙';
}
applyTheme();

themeToggle.addEventListener('click', () => {
  isDark = !isDark;
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
  applyTheme();
  themeToggle.style.transform = 'rotate(360deg)';
  setTimeout(() => themeToggle.style.transform = '', 400);
});

// ===== RIPPLE EFFECT =====
document.querySelectorAll('.ripple').forEach(btn => {
  btn.addEventListener('click', function(e) {
    const rect = this.getBoundingClientRect();
    this.style.setProperty('--rx', (e.clientX - rect.left) + 'px');
    this.style.setProperty('--ry', (e.clientY - rect.top) + 'px');
    this.classList.remove('rippling');
    void this.offsetWidth;
    this.classList.add('rippling');
    setTimeout(() => this.classList.remove('rippling'), 600);
  });
});

// ===== PHỒN/GIẢN THỂ DETECTION =====
const TRADITIONAL_ONLY = new Set([
  '愛','國','來','時','會','說','對','這','個','們','為','學','長','發','開',
  '關','問','頭','點','電','話','語','書','讀','聽','寫','見','買','賣',
  '車','門','風','飛','馬','魚','鳥','龍','鳳','龜','麗','體','藝','術','樂',
  '樹','橋','機','樓','歡','歲','歷','親','觀','覺','視','訓','記','設',
  '許','論','課','調','談','請','謝','繁','傳','統','習','慣','實','際',
  '歸','廣','應','當','從','後','與','無','東','兩','產','業','現','萬',
  '數','進','過','還','邊','遠','連','運','達','選','難','雖','雲','農',
]);

const SIMPLIFIED_ONLY = new Set([
  '爱','国','来','时','会','说','对','这','个','们','为','学','长','发','开',
  '关','问','头','点','电','话','语','书','读','听','写','见','买','卖',
  '车','门','风','飞','马','鱼','鸟','龙','凤','龟','丽','体','艺','术','乐',
  '树','桥','机','楼','欢','岁','历','亲','观','觉','视','训','记','设',
  '许','论','课','调','谈','请','谢','繁','传','统','习','惯','实','际',
  '归','广','应','当','从','后','与','无','东','两','产','业','现','万',
  '数','进','过','还','边','远','连','运','达','选','难','虽','云','农',
]);

function detectScript(text) {
  let fanCount = 0, jianCount = 0;
  for (const ch of text) {
    if (TRADITIONAL_ONLY.has(ch)) fanCount++;
    if (SIMPLIFIED_ONLY.has(ch))  jianCount++;
  }
  if (fanCount === 0 && jianCount === 0) return 'unknown';
  if (fanCount > jianCount) return 'traditional';
  if (jianCount > fanCount) return 'simplified';
  return 'mixed';
}

function scriptLabel(type) {
  const map = {
    traditional: { text: '繁 Phồn thể', cls: 'badge-fan' },
    simplified:  { text: '简 Giản thể', cls: 'badge-jian' },
    mixed:       { text: '混 Hỗn hợp', cls: 'badge-mixed' },
    unknown:     { text: '中 Tiếng Trung', cls: 'badge-jian' },
  };
  return map[type] || map.unknown;
}

// ===== PINYIN MAP =====
const PINYIN_MAP = {
  '你':'nǐ','好':'hǎo','我':'wǒ','爱':'ài','愛':'ài','他':'tā','她':'tā','它':'tā',
  '们':'men','們':'men','是':'shì','不':'bù','的':'de','了':'le','在':'zài',
  '有':'yǒu','这':'zhè','這':'zhè','那':'nà','个':'gè','個':'gè','人':'rén',
  '来':'lái','來':'lái','去':'qù','说':'shuō','說':'shuō','看':'kàn',
  '想':'xiǎng','知':'zhī','道':'dào','时':'shí','時':'shí','候':'hòu',
  '会':'huì','會':'huì','可':'kě','以':'yǐ','要':'yào','就':'jiù',
  '也':'yě','都':'dōu','很':'hěn','大':'dà','小':'xiǎo','多':'duō',
  '少':'shǎo','上':'shàng','下':'xià','中':'zhōng','国':'guó','國':'guó',
  '家':'jiā','里':'lǐ','裡':'lǐ','出':'chū','进':'jìn','進':'jìn',
  '开':'kāi','開':'kāi','关':'guān','關':'guān','对':'duì','對':'duì',
  '没':'méi','什':'shén','么':'me','麼':'me','为':'wèi','為':'wèi',
  '吗':'ma','嗎':'ma','呢':'ne','啊':'a','哦':'ó','哈':'hā','嗯':'ń',
  '谢':'xiè','謝':'xiè','请':'qǐng','請':'qǐng',
  '再':'zài','见':'jiàn','見':'jiàn','明':'míng','天':'tiān','今':'jīn',
  '年':'nián','月':'yuè','日':'rì','号':'hào','號':'hào','点':'diǎn',
  '點':'diǎn','分':'fēn','钟':'zhōng','鐘':'zhōng','早':'zǎo','晚':'wǎn',
  '吃':'chī','喝':'hē','饭':'fàn','飯':'fàn','水':'shuǐ','茶':'chá',
  '咖':'kā','啡':'fēi','钱':'qián','錢':'qián','买':'mǎi','買':'mǎi',
  '卖':'mài','賣':'mài','贵':'guì','貴':'guì','便':'pián','宜':'yí',
  '哪':'nǎ','厕':'cè','所':'suǒ','医':'yī','院':'yuàn',
  '学':'xué','學':'xué','校':'xiào','工':'gōng','作':'zuò','公':'gōng',
  '司':'sī','朋':'péng','友':'yǒu','男':'nán','女':'nǚ','孩':'hái',
  '子':'zǐ','父':'fù','母':'mǔ','哥':'gē','姐':'jiě','弟':'dì','妹':'mèi',
  '老':'lǎo','师':'shī','師':'shī','同':'tóng',
  '车':'chē','車':'chē','路':'lù','站':'zhàn','飞':'fēi','飛':'fēi',
  '机':'jī','機':'jī','场':'chǎng','場':'chǎng','火':'huǒ','船':'chuán',
  '电':'diàn','電':'diàn','话':'huà','話':'huà','手':'shǒu',
  '网':'wǎng','络':'luò','脑':'nǎo','腦':'nǎo',
  '美':'měi','丽':'lì','麗':'lì','漂':'piào','亮':'liàng','帅':'shuài',
  '帥':'shuài','高':'gāo','兴':'xìng','興':'xìng','快':'kuài','乐':'lè',
  '樂':'lè','难':'nán','難':'nán','过':'guò','過':'guò','累':'lèi',
  '饿':'è','餓':'è','渴':'kě','冷':'lěng','热':'rè','熱':'rè',
  '一':'yī','二':'èr','三':'sān','四':'sì','五':'wǔ','六':'liù',
  '七':'qī','八':'bā','九':'jiǔ','十':'shí','百':'bǎi','千':'qiān',
  '万':'wàn','萬':'wàn','零':'líng',
  '红':'hóng','紅':'hóng','绿':'lǜ','綠':'lǜ','蓝':'lán','藍':'lán',
  '白':'bái','黑':'hēi','黄':'huáng','黃':'huáng',
  '吃':'chī','饭':'fàn','好':'hǎo','吃':'chī',
  '北':'běi','京':'jīng','上':'shàng','海':'hǎi','广':'guǎng','州':'zhōu',
  '香':'xiāng','港':'gǎng','台':'tái','湾':'wān','灣':'wān',
  '越':'yuè','南':'nán','河':'hé','内':'nèi','胡':'hú','志':'zhì','明':'míng',
  '新':'xīn','加':'jiā','坡':'pō','日':'rì','本':'běn','韩':'hán','国':'guó',
  '语':'yǔ','語':'yǔ','文':'wén','字':'zì','汉':'hàn','漢':'hàn',
  '普':'pǔ','通':'tōng','话':'huà','粤':'yuè',
  '吃':'chī','喝':'hē','玩':'wán','乐':'lè','睡':'shuì','觉':'jiào',
  '走':'zǒu','跑':'pǎo','跳':'tiào','唱':'chàng','歌':'gē','跳':'tiào','舞':'wǔ',
};

function toPinyin(text) {
  let result = '';
  for (const ch of text) {
    if (PINYIN_MAP[ch]) result += PINYIN_MAP[ch] + ' ';
    else if (/[\u4e00-\u9fff\u3400-\u4dbf]/.test(ch)) result += ch + ' ';
    else result += ch;
  }
  return result.trim();
}

// ===== PINYIN → VIỆT PHIÊN ÂM =====
const PINYIN_TO_VIET = {
  'nǐ':'nỉ','hǎo':'hảo','wǒ':'ủa','ài':'ái','tā':'ta','men':'men',
  'shì':'sứ','bù':'bú','de':'đơ','le':'lơ','zài':'chài','yǒu':'dẫu',
  'zhè':'chứa','nà':'na','gè':'cơ','rén':'rần','lái':'lái','qù':'chuy',
  'shuō':'suốt','kàn':'khan','xiǎng':'xiảng','zhī':'chư','dào':'đao',
  'shí':'sứ','hòu':'hậu','huì':'huệ','kě':'khơ','yǐ':'ỉ','yào':'dao',
  'jiù':'chíu','yě':'dê','dōu':'đâu','hěn':'hẩn','dà':'đa','xiǎo':'xiảo',
  'duō':'đua','shǎo':'sảo','shàng':'sảng','xià':'xia','zhōng':'chung',
  'guó':'quốc','jiā':'chia','lǐ':'lỉ','chū':'chư','jìn':'chin',
  'kāi':'khai','guān':'quan','duì':'đuệ','méi':'mây','shén':'sần',
  'me':'mơ','wèi':'uệ','ma':'ma','ne':'nơ','a':'a','hā':'ha',
  'xiè':'xiệ','qǐng':'chỉnh','jiàn':'chiến','míng':'minh','tiān':'thiên',
  'jīn':'chin','nián':'niên','yuè':'duyệt','rì':'rứ','hào':'hao',
  'diǎn':'điểm','fēn':'phân','zǎo':'tảo','wǎn':'uẩn',
  'chī':'chư','hē':'hơ','fàn':'phạn','shuǐ':'suỉ','chá':'tra',
  'kā':'ka','fēi':'phây','qián':'tiền','mǎi':'mải','mài':'mại',
  'guì':'quý','pián':'biên','yí':'di','nǎ':'nả','cè':'trắc',
  'suǒ':'sở','yī':'y','yuàn':'viện','xué':'học','xiào':'hiệu',
  'gōng':'công','zuò':'tác','sī':'tư','péng':'bằng',
  'nán':'nam','nǚ':'nữ','hái':'hài','zǐ':'tử','fù':'phụ','mǔ':'mẫu',
  'gē':'ca','jiě':'tỷ','dì':'đệ','mèi':'muội','lǎo':'lão','shī':'sư',
  'tóng':'đồng','chē':'xa','lù':'lộ','zhàn':'trạm','fēi':'phi',
  'jī':'cơ','chǎng':'trường','huǒ':'hỏa','chuán':'thuyền',
  'diàn':'điện','huà':'thoại','shǒu':'thủ','wǎng':'mạng','luò':'lạc',
  'nǎo':'não','měi':'mỹ','lì':'lệ','piào':'phiêu','liàng':'lượng',
  'shuài':'soái','gāo':'cao','xìng':'hứng','kuài':'khoái','lè':'lạc',
  'guò':'quá','lèi':'lụy','è':'ngạ','lěng':'lãnh','rè':'nhiệt',
  'yī':'nhất','èr':'nhị','sān':'tam','sì':'tứ','wǔ':'ngũ','liù':'lục',
  'qī':'thất','bā':'bát','jiǔ':'cửu','bǎi':'bách','qiān':'thiên',
  'wàn':'vạn','líng':'linh','hóng':'hồng','lǜ':'lục','lán':'lam',
  'bái':'bạch','hēi':'hắc','huáng':'hoàng',
  'běi':'bắc','jīng':'kinh','hǎi':'hải','guǎng':'quảng','zhōu':'châu',
  'xiāng':'hương','gǎng':'cảng','tái':'đài','wān':'loan',
  'yuè':'việt','hé':'hà','nèi':'nội','hú':'hồ','zhì':'chí',
  'xīn':'tân','pō':'pha','běn':'bản','hán':'hàn',
  'yǔ':'ngữ','wén':'văn','zì':'tự','hàn':'hán',
  'pǔ':'phổ','tōng':'thông','wán':'hoàn','shuì':'thụy','jiào':'giác',
  'zǒu':'tẩu','pǎo':'bào','tiào':'khiêu','chàng':'xướng','wǔ':'vũ',
};

function pinyinToViet(pinyinStr) {
  if (!pinyinStr) return '';
  const words = pinyinStr.split(/\s+/);
  return words.map(w => PINYIN_TO_VIET[w] || w).join(' · ');
}

// ===== TEXT-TO-SPEECH =====
function speakChinese(text) {
  if (!text || !window.speechSynthesis) {
    showToast('⚠️ Trình duyệt không hỗ trợ TTS'); return;
  }
  window.speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = 'zh-CN';
  utter.rate = 0.85;
  utter.pitch = 1;
  // Thử tìm giọng Trung
  const voices = window.speechSynthesis.getVoices();
  const zhVoice = voices.find(v => v.lang.startsWith('zh'));
  if (zhVoice) utter.voice = zhVoice;
  window.speechSynthesis.speak(utter);
  showToast('🔊 Đang phát âm…', 2000);
}

// ===== TRANSLATE API =====
async function translateText(text, sourceLang, targetLang) {
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLang}&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error('Network error');
    const data = await res.json();
    let translated = '';
    if (data && data[0]) {
      for (const part of data[0]) {
        if (part && part[0]) translated += part[0];
      }
    }
    return translated;
  } catch {
    throw new Error('Không thể kết nối dịch vụ. Kiểm tra kết nối mạng.');
  }
}

async function translateChineseToViet(text) {
  const script = detectScript(text);
  const srcLang = script === 'traditional' ? 'zh-TW' : 'zh-CN';
  return await translateText(text, srcLang, 'vi');
}

async function translateVietToChinese(text, script) {
  const tgtLang = script === 'traditional' ? 'zh-TW' : 'zh-CN';
  return await translateText(text, 'vi', tgtLang);
}

// ===== OCR via OCR.space API =====
async function ocrImage(imageFile) {
  const msgEl = document.querySelector('#loading-image .loading-text-msg');

  const apiKey = CONFIG.geminiApiKey || localStorage.getItem('geminiApiKey') || '';
  if (!apiKey) {
    throw new Error('Chưa có OCR API Key. Vào ⚙️ Cài đặt để nhập key miễn phí từ ocr.space');
  }

  msgEl.textContent = 'Đang gửi ảnh lên OCR.space…';

  const formData = new FormData();
  formData.append('file', imageFile);
  formData.append('apikey', apiKey);
  formData.append('language', 'chs');   // Chinese Simplified
  formData.append('isOverlayRequired', 'false');
  formData.append('detectOrientation', 'true');
  formData.append('scale', 'true');
  formData.append('OCREngine', '2');    // Engine 2 tốt hơn cho CJK

  const res = await fetch('https://api.ocr.space/parse/image', {
    method: 'POST',
    body: formData
  });

  if (!res.ok) {
    throw new Error(`OCR.space lỗi HTTP ${res.status}. Kiểm tra kết nối mạng.`);
  }

  const data = await res.json();

  if (data.IsErroredOnProcessing) {
    const msg = data.ErrorMessage?.[0] || 'Lỗi không xác định từ OCR.space';
    if (msg.includes('API key')) {
      throw new Error('API Key không hợp lệ. Kiểm tra lại trong ⚙️ Cài đặt.');
    }
    throw new Error('OCR lỗi: ' + msg);
  }

  const text = data.ParsedResults?.[0]?.ParsedText?.trim() || '';

  if (!text) {
    throw new Error('Không tìm thấy chữ nào trong ảnh này.');
  }

  msgEl.textContent = 'Nhận diện xong!';
  return text;
}

// ===== TYPEWRITER EFFECT =====
function typewriterSet(el, text, defaultSpeed = 18) {
  el.textContent = '';
  el.classList.remove('done');
  
  const speedPref = localStorage.getItem('typewriterSpeed') || 'medium';
  if (speedPref === 'none') {
    el.textContent = text;
    el.classList.add('done');
    return;
  }
  
  let speed = defaultSpeed;
  if (speedPref === 'fast') speed = 8;
  if (speedPref === 'slow') speed = 35;
  
  let i = 0;
  if (el._timer) clearInterval(el._timer);
  el._timer = setInterval(() => {
    el.textContent += text[i++];
    if (i >= text.length) {
      clearInterval(el._timer);
      el.classList.add('done');
    }
  }, speed);
}

// ===== UI HELPERS =====
function showToast(msg, duration = 2400) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => toast.classList.remove('show'), duration);
}

function setLoading(id, show) {
  document.getElementById(id).style.display = show ? 'block' : 'none';
}

function setVisible(id, show) {
  const el = document.getElementById(id);
  if (!el) return;
  if (show) {
    el.style.display = 'block';
    el.classList.remove('slide-up');
    void el.offsetWidth;
    el.classList.add('slide-up');
  } else {
    el.style.display = 'none';
  }
}

function copyText(text) {
  navigator.clipboard.writeText(text).then(() => showToast('✅ Đã sao chép vào clipboard'));
}

// ===== HISTORY =====
let history = JSON.parse(localStorage.getItem('translateHistory') || '[]');

function saveHistory(original, translated, type) {
  const item = {
    id: Date.now(),
    original: original.slice(0, 120),
    translated: translated.slice(0, 120),
    type, // 'zh2vi' | 'vi2zh'
    time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
  };
  history.unshift(item);
  if (history.length > 50) history = history.slice(0, 50);
  localStorage.setItem('translateHistory', JSON.stringify(history));
  renderHistory();
}

function renderHistory() {
  const list = document.getElementById('history-list');
  if (!history.length) {
    list.innerHTML = `
      <div class="history-empty">
        <div class="empty-icon">📭</div>
        <p>Chưa có lịch sử dịch</p>
        <p class="note">Các bản dịch sẽ được lưu tự động tại đây</p>
      </div>`;
    return;
  }
  list.innerHTML = history.map(item => `
    <div class="history-item" data-id="${item.id}">
      <div class="history-item-header">
        <span class="history-source">${item.type === 'zh2vi' ? '🀄 Trung → Việt' : '🇻🇳 Việt → Trung'}</span>
        <span class="history-time">${item.time}</span>
      </div>
      <div class="history-original">${escapeHtml(item.original)}</div>
      <div class="history-translated">→ ${escapeHtml(item.translated)}</div>
    </div>
  `).join('');

  // Click to re-use
  list.querySelectorAll('.history-item').forEach(el => {
    el.addEventListener('click', () => {
      const item = history.find(h => h.id === parseInt(el.dataset.id));
      if (!item) return;
      if (item.type === 'zh2vi') {
        document.getElementById('chinese-input').value = item.original;
        document.getElementById('chinese-input').dispatchEvent(new Event('input'));
        switchTab('text');
      } else {
        document.getElementById('viet-input').value = item.original;
        switchTab('viet2trung');
      }
      showToast('📋 Đã tải lại bản dịch');
    });
  });
}

function escapeHtml(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

document.getElementById('clear-history').addEventListener('click', () => {
  if (!history.length) return;
  history = [];
  localStorage.removeItem('translateHistory');
  renderHistory();
  showToast('🗑️ Đã xóa lịch sử');
});

renderHistory();

// ===== SLIDING INDICATORS =====
function updateTabIndicator(tabContainerSelector, activeTabSelector, indicatorSelector) {
  const container = typeof tabContainerSelector === 'string' ? document.querySelector(tabContainerSelector) : tabContainerSelector;
  const activeTab = typeof activeTabSelector === 'string' ? document.querySelector(activeTabSelector) : activeTabSelector;
  const indicator = typeof indicatorSelector === 'string' ? document.querySelector(indicatorSelector) : indicatorSelector;
  
  if (!container || !activeTab || !indicator) return;

  const containerRect = container.getBoundingClientRect();
  const activeRect = activeTab.getBoundingClientRect();

  const left = activeRect.left - containerRect.left + container.scrollLeft;
  const width = activeRect.width;

  indicator.style.transform = `translateX(${left}px)`;
  indicator.style.width = `${width}px`;
}

function setupDynamicIndicators() {
  const mainIndicator = document.querySelector('.tab-indicator');
  if (mainIndicator) mainIndicator.style.display = 'block';

  const textResultTabs = document.querySelector('#tab-text .result-tabs');
  if (textResultTabs && !textResultTabs.querySelector('.rtab-indicator')) {
    const ind = document.createElement('div');
    ind.className = 'rtab-indicator';
    textResultTabs.appendChild(ind);
  }

  const toggleWrapper = document.querySelector('.toggle-pill-wrapper');
  if (toggleWrapper && !toggleWrapper.querySelector('.toggle-indicator')) {
    const ind = document.createElement('div');
    ind.className = 'toggle-indicator';
    toggleWrapper.appendChild(ind);
  }
}

function updateAllIndicators() {
  updateTabIndicator('.tabs', '.tab.active', '.tab-indicator');
  updateTabIndicator('#tab-text .result-tabs', '#tab-text .rtab.active', '#tab-text .rtab-indicator');
  updateTabIndicator('.toggle-pill-wrapper', '.toggle-btn.active', '.toggle-indicator');
}

// ===== TABS =====
function switchTab(name) {
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
  const tab = document.querySelector(`.tab[data-tab="${name}"]`);
  const content = document.getElementById(`tab-${name}`);
  if (tab) tab.classList.add('active');
  if (content) content.classList.add('active');
  
  // Dynamic sliding indicator
  setTimeout(() => {
    updateTabIndicator('.tabs', '.tab.active', '.tab-indicator');
  }, 30);
}

document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', () => switchTab(tab.dataset.tab));
});

// ===== RESULT SUB-TABS =====
document.querySelectorAll('.rtab').forEach(rtab => {
  rtab.addEventListener('click', () => {
    const parent = rtab.closest('.result-area');
    parent.querySelectorAll('.rtab').forEach(t => t.classList.remove('active'));
    parent.querySelectorAll('.rtab-panel').forEach(p => p.classList.remove('active'));
    rtab.classList.add('active');
    const panel = parent.querySelector(`#rp-${rtab.dataset.rtab}`);
    if (panel) panel.classList.add('active');
    
    // Dynamic sliding indicator
    const parentTabs = rtab.closest('.result-tabs');
    const indicator = parentTabs.querySelector('.rtab-indicator');
    if (indicator) {
      setTimeout(() => {
        updateTabIndicator(parentTabs, rtab, indicator);
      }, 30);
    }
  });
});

// ===== TAB 1: VĂN BẢN =====
const chineseInput  = document.getElementById('chinese-input');
const scriptBadgeRow = document.getElementById('script-badge-row');
const scriptBadge   = document.getElementById('script-badge');
const charCount     = document.getElementById('char-count');

chineseInput.addEventListener('input', () => {
  const text = chineseInput.value;
  const len  = text.length;
  charCount.textContent = len + ' ký tự';
  charCount.style.color = len > 1000 ? 'var(--red)' : '';

  const hasChinese = /[\u4e00-\u9fff\u3400-\u4dbf]/.test(text);
  if (!text.trim() || !hasChinese) {
    scriptBadgeRow.style.opacity = '0';
    scriptBadgeRow.style.pointerEvents = 'none';
    return;
  }
  const type  = detectScript(text);
  const label = scriptLabel(type);
  scriptBadge.textContent = label.text;
  scriptBadge.className   = 'badge ' + label.cls;
  scriptBadgeRow.style.opacity = '1';
  scriptBadgeRow.style.pointerEvents = 'auto';
});

// Ctrl+Enter shortcut
chineseInput.addEventListener('keydown', e => {
  if (e.ctrlKey && e.key === 'Enter') document.getElementById('translate-btn').click();
});

document.getElementById('clear-text').addEventListener('click', () => {
  chineseInput.value = '';
  chineseInput.dispatchEvent(new Event('input'));
  setVisible('result-area', false);
});

document.getElementById('sample-jian').addEventListener('click', () => {
  chineseInput.value = '你好！我叫小明，很高兴认识你。我来自中国，现在在越南工作。你会说越南语吗？';
  chineseInput.dispatchEvent(new Event('input'));
});

document.getElementById('sample-fan').addEventListener('click', () => {
  chineseInput.value = '你好！我叫小明，很高興認識你。我來自台灣，現在在越南工作。你會說越南語嗎？';
  chineseInput.dispatchEvent(new Event('input'));
});

document.getElementById('translate-btn').addEventListener('click', async () => {
  const text = chineseInput.value.trim();
  if (!text) { showToast('⚠️ Vui lòng nhập chữ Trung Quốc'); return; }

  setLoading('loading-text', true);
  setVisible('result-area', false);

  try {
    const translated    = await translateChineseToViet(text);
    const pinyin        = toPinyin(text);
    const vietPronounce = pinyinToViet(pinyin);

    typewriterSet(document.getElementById('result-text'), translated, 15);
    document.getElementById('pinyin-text').textContent        = pinyin || '(không có pinyin)';
    document.getElementById('viet-pronounce-text').textContent = vietPronounce || '(không có phiên âm)';

    // Reset to first sub-tab
    document.querySelectorAll('#tab-text .rtab').forEach((t,i) => t.classList.toggle('active', i===0));
    document.querySelectorAll('#tab-text .rtab-panel').forEach((p,i) => p.classList.toggle('active', i===0));

    setVisible('result-area', true);
    saveHistory(text, translated, 'zh2vi');
    bumpCount();
  } catch (e) {
    showToast('❌ ' + e.message, 4000);
  } finally {
    setLoading('loading-text', false);
  }
});

document.getElementById('copy-result').addEventListener('click', () => {
  copyText(document.getElementById('result-text').textContent);
});

document.getElementById('tts-result').addEventListener('click', () => {
  speakChinese(chineseInput.value.trim());
});

// ===== TAB 2: ẢNH =====
let currentImageFile = null;
const uploadZone  = document.getElementById('upload-zone');
const imageInput  = document.getElementById('image-input');

document.getElementById('upload-btn').addEventListener('click', e => {
  e.stopPropagation(); imageInput.click();
});
uploadZone.addEventListener('click', () => imageInput.click());

uploadZone.addEventListener('dragover', e => {
  e.preventDefault(); uploadZone.classList.add('drag-over');
});
uploadZone.addEventListener('dragleave', () => uploadZone.classList.remove('drag-over'));
uploadZone.addEventListener('drop', e => {
  e.preventDefault(); uploadZone.classList.remove('drag-over');
  const file = e.dataTransfer.files[0];
  if (file && file.type.startsWith('image/')) loadImageFile(file);
});
imageInput.addEventListener('change', () => {
  if (imageInput.files[0]) loadImageFile(imageInput.files[0]);
});

function loadImageFile(file) {
  currentImageFile = file;
  const url = URL.createObjectURL(file);
  document.getElementById('preview-img').src = url;
  uploadZone.style.display = 'none';
  setVisible('image-preview-area', true);
  setVisible('ocr-actions', true);
  setVisible('ocr-result-area', false);
}

document.getElementById('remove-image').addEventListener('click', () => {
  currentImageFile = null;
  imageInput.value = '';
  uploadZone.style.display = 'block';
  setVisible('image-preview-area', false);
  setVisible('ocr-actions', false);
  setVisible('ocr-result-area', false);
});

document.getElementById('ocr-btn').addEventListener('click', async () => {
  if (!currentImageFile) return;
  setLoading('loading-image', true);
  setVisible('ocr-result-area', false);
  try {
    const extractedText = await ocrImage(currentImageFile);

    const script = detectScript(extractedText);
    const label  = scriptLabel(script);
    const ocrBadge = document.getElementById('ocr-script-badge');
    ocrBadge.textContent = label.text;
    ocrBadge.className   = 'badge ' + label.cls;

    document.getElementById('ocr-extracted-text').textContent = extractedText;

    const translated    = await translateChineseToViet(extractedText);
    const pinyin        = toPinyin(extractedText);
    const vietPronounce = pinyinToViet(pinyin);

    typewriterSet(document.getElementById('ocr-translated-text'), translated, 15);
    document.getElementById('ocr-viet-pronounce').textContent = vietPronounce || '(không có phiên âm)';

    setVisible('ocr-result-area', true);
    saveHistory(extractedText, translated, 'zh2vi');
    bumpCount();
  } catch (e) {
    showToast('❌ ' + e.message, 4500);
  } finally {
    setLoading('loading-image', false);
    // Hide progress bar after complete
    const progContainer = document.querySelector('#loading-image .ocr-progress-container');
    if (progContainer) {
      setTimeout(() => progContainer.remove(), 1000);
    }
  }
});

document.getElementById('copy-ocr-result').addEventListener('click', () => {
  copyText(document.getElementById('ocr-translated-text').textContent);
});
document.getElementById('open-api-settings').addEventListener('click', () => {
  document.getElementById('modal-overlay').style.display = 'flex';
});

// ===== GLOBAL CLIPBOARD PASTE LISTENER =====
window.addEventListener('paste', async (e) => {
  const items = e.clipboardData?.items;
  if (!items) return;
  
  for (const item of items) {
    if (item.type.startsWith('image/')) {
      const file = item.getAsFile();
      if (file) {
        switchTab('image');
        loadImageFile(file);
        showToast('📋 Đã dán hình ảnh và đang nhận diện tự động…', 3000);
        
        // Auto-click OCR button after tab transition
        setTimeout(() => {
          const btn = document.getElementById('ocr-btn');
          if (btn) btn.click();
        }, 500);
        break;
      }
    }
  }
});

// ===== TAB 3: VIỆT → TRUNG =====
let selectedScript = 'simplified';

document.getElementById('toggle-jian').addEventListener('click', () => {
  selectedScript = 'simplified';
  document.getElementById('toggle-jian').classList.add('active');
  document.getElementById('toggle-fan').classList.remove('active');
  updateTabIndicator('.toggle-pill-wrapper', '#toggle-jian', '.toggle-indicator');
});
document.getElementById('toggle-fan').addEventListener('click', () => {
  selectedScript = 'traditional';
  document.getElementById('toggle-fan').classList.add('active');
  document.getElementById('toggle-jian').classList.remove('active');
  updateTabIndicator('.toggle-pill-wrapper', '#toggle-fan', '.toggle-indicator');
});

document.getElementById('clear-viet').addEventListener('click', () => {
  document.getElementById('viet-input').value = '';
  setVisible('v2c-result-area', false);
});

document.getElementById('sample-viet').addEventListener('click', () => {
  document.getElementById('viet-input').value =
    'Xin chào! Tôi tên là Minh, rất vui được gặp bạn. Bạn có khỏe không? Tôi đến từ Việt Nam.';
});

document.getElementById('viet-input').addEventListener('keydown', e => {
  if (e.ctrlKey && e.key === 'Enter') document.getElementById('v2c-btn').click();
});

document.getElementById('v2c-btn').addEventListener('click', async () => {
  const text = document.getElementById('viet-input').value.trim();
  if (!text) { showToast('⚠️ Vui lòng nhập tiếng Việt'); return; }

  setLoading('loading-v2c', true);
  setVisible('v2c-result-area', false);

  try {
    const chinese       = await translateVietToChinese(text, selectedScript);
    const pinyin        = toPinyin(chinese);
    const vietPronounce = pinyinToViet(pinyin);

    document.getElementById('v2c-chinese').textContent         = chinese;
    document.getElementById('v2c-pinyin').textContent          = pinyin || '(không có pinyin)';
    document.getElementById('v2c-viet-pronounce').textContent  = vietPronounce || '(không có phiên âm)';

    setVisible('v2c-result-area', true);
    saveHistory(text, chinese, 'vi2zh');
    bumpCount();
  } catch (e) {
    showToast('❌ ' + e.message, 4000);
  } finally {
    setLoading('loading-v2c', false);
  }
});

document.getElementById('copy-v2c').addEventListener('click', () => {
  copyText(document.getElementById('v2c-chinese').textContent);
});
document.getElementById('tts-v2c').addEventListener('click', () => {
  speakChinese(document.getElementById('v2c-chinese').textContent);
});

// ===== SETTINGS & MODAL =====
const SETTINGS = {
  particleDensity: localStorage.getItem('particleDensity') || 'medium',
  typewriterSpeed: localStorage.getItem('typewriterSpeed') || 'medium',
};

// Open Settings Modal
const openModal = () => {
  document.getElementById('gemini-api-key').value = CONFIG.geminiApiKey;
  document.getElementById('particle-density').value = SETTINGS.particleDensity;
  document.getElementById('typewriter-speed').value = SETTINGS.typewriterSpeed;
  document.getElementById('modal-overlay').style.display = 'flex';
};

const closeModal = () => { document.getElementById('modal-overlay').style.display = 'none'; };

document.getElementById('modal-close').addEventListener('click', closeModal);
document.getElementById('modal-cancel').addEventListener('click', closeModal);
document.getElementById('modal-overlay').addEventListener('click', e => {
  if (e.target === document.getElementById('modal-overlay')) closeModal();
});

document.getElementById('save-api-keys').addEventListener('click', () => {
  const geminiKey = document.getElementById('gemini-api-key').value.trim();
  const density   = document.getElementById('particle-density').value;
  const speed     = document.getElementById('typewriter-speed').value;

  if (geminiKey) {
    localStorage.setItem('geminiApiKey', geminiKey);
    CONFIG.geminiApiKey = geminiKey;
  }

  localStorage.setItem('particleDensity', density);
  localStorage.setItem('typewriterSpeed', speed);

  SETTINGS.particleDensity = density;
  SETTINGS.typewriterSpeed = speed;

  showToast('✅ Đã lưu cấu hình tùy chỉnh');
  closeModal();

  // Reinitialize particles if density changed
  if (window.reinitParticles) window.reinitParticles();
});

// Toggle API key visibility
document.getElementById('toggle-key-visibility').addEventListener('click', () => {
  const input = document.getElementById('gemini-api-key');
  input.type = input.type === 'password' ? 'text' : 'password';
});

// ===== KEYBOARD SHORTCUT HINT =====
if (window.innerWidth < 600) {
  document.querySelectorAll('.shortcut-hint').forEach(el => el.style.display = 'none');
}

// ===== ENTRANCE ANIMATIONS =====
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.info-card').forEach(card => observer.observe(card));

// ===== INIT & SLIDING INDICATORS =====
setupDynamicIndicators();
updateAllIndicators();
window.addEventListener('resize', updateAllIndicators);

// Double check the indicators after dynamic content triggers or animations
setTimeout(updateAllIndicators, 200);

console.log('%c🀄 Trung–Việt Pro v2.0 loaded', 'color:#d32f2f;font-size:14px;font-weight:bold');

// ===== MOBILE BOTTOM NAV SYNC =====
(function initMobileNav() {
  const mbnItems = document.querySelectorAll('.mbn-item');

  // Sync bottom nav khi tab thay đổi
  function syncMobileNav(tabName) {
    mbnItems.forEach(item => {
      item.classList.toggle('active', item.dataset.tab === tabName);
    });
  }

  // Click bottom nav → switch tab
  mbnItems.forEach(item => {
    item.addEventListener('click', () => {
      switchTab(item.dataset.tab);
      syncMobileNav(item.dataset.tab);
    });
  });

  // Patch switchTab để tự sync bottom nav
  const _origSwitchTab = switchTab;
  window.switchTab = function(name) {
    _origSwitchTab(name);
    syncMobileNav(name);
  };
})();
(function initWelcome() {
  const overlay = document.getElementById('welcome-overlay');
  const closeBtn = document.getElementById('welcome-close');

  // Luôn hiện mỗi lần reload
  overlay.style.display = 'flex';

  function closeWelcome() {
    overlay.classList.add('hidden');
    setTimeout(() => { overlay.style.display = 'none'; }, 300);
  }

  closeBtn.addEventListener('click', closeWelcome);

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeWelcome();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.style.display !== 'none') closeWelcome();
  });
})();
