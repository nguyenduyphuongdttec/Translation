# 🀄 Dịch Tiếng Trung ↔ Tiếng Việt

Web app dịch tiếng Trung Quốc sang tiếng Việt với các tính năng:

- ✅ Tự động nhận diện **Phồn thể (繁體)** vs **Giản thể (简体)**
- ✅ Dịch văn bản Trung → Việt (miễn phí, không cần API key)
- ✅ Dịch Việt → Trung (chọn phồn thể hoặc giản thể)
- ✅ Hiển thị **Pinyin** (phiên âm La-tinh)
- ✅ **Phiên âm địa phương** - cách đọc theo kiểu người Việt
- ✅ OCR ảnh chứa chữ Trung (cần Google Vision API key)

---

## 🚀 Cách chạy

Chỉ cần mở file `index.html` trong trình duyệt. Không cần cài đặt gì thêm.

```
Mở file: D:\translation\index.html
```

---

## 🔑 Cài đặt API Key (cho tính năng OCR ảnh)

### Bước 1: Lấy Google Cloud Vision API Key

1. Vào [Google Cloud Console](https://console.cloud.google.com)
2. Tạo project mới hoặc chọn project có sẵn
3. Vào **APIs & Services** → **Enable APIs**
4. Tìm và bật **Cloud Vision API**
5. Vào **Credentials** → **Create Credentials** → **API Key**
6. Copy API key

### Bước 2: Nhập vào web

1. Mở web, vào tab **"Dịch từ ảnh"**
2. Nhấn nút **"⚙️ Cài đặt API Key"**
3. Dán API key vào ô **Google Cloud Vision API Key**
4. Nhấn **"💾 Lưu"**

> API key được lưu trong localStorage của trình duyệt, không gửi đi đâu ngoài Google.

---

## 📖 Giải thích tính năng

### Nhận diện Phồn thể / Giản thể

Web tự động phân tích từng ký tự trong văn bản:
- **Phồn thể (繁體字)**: Dùng ở Đài Loan, Hồng Kông, Ma Cao
- **Giản thể (简体字)**: Dùng ở Trung Quốc đại lục, Singapore

### Phiên âm địa phương

Chuyển đổi Pinyin sang cách đọc gần đúng theo âm Việt, giúp người Việt giao tiếp cơ bản mà không cần học Pinyin chính thức.

Ví dụ:
- 你好 → nǐ hǎo → **nỉ hảo**
- 谢谢 → xiè xiè → **xiệ xiệ**
- 我爱你 → wǒ ài nǐ → **ủa ái nỉ**

---

## 🛠️ Công nghệ

- **Frontend**: HTML5, CSS3, JavaScript thuần (không framework)
- **Dịch thuật**: Google Translate (unofficial free endpoint)
- **OCR**: Google Cloud Vision API
- **Nhận diện phồn/giản**: Unicode character analysis

---

## ⚠️ Lưu ý

- Tính năng dịch văn bản dùng Google Translate miễn phí, có thể bị giới hạn nếu dùng quá nhiều
- OCR ảnh cần API key trả phí (Google Cloud Vision có 1000 request/tháng miễn phí)
- Phiên âm địa phương chỉ là gần đúng, không thay thế học Pinyin chính thức
