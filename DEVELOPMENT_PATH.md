# **Lộ trình Phát triển VMGLingo**

Tài liệu này phác thảo lộ trình phát triển toàn diện để biến VMGLingo thành một nền tảng học ngôn ngữ toàn diện, lấy cảm hứng từ những thực tiễn tốt nhất của **Duolingo** và **ELSA Speak**.

## 🎯 **Triết lý Cốt lõi**

VMGLingo kết hợp yếu tố game hóa và học tập thích ứng của Duolingo với khả năng tinh thông phát âm của ELSA Speak, tạo ra trải nghiệm học ngôn ngữ tối ưu dành riêng cho người Việt, nhấn mạnh vào:

-   **Tiếp cận AI-First:** Lộ trình học cá nhân hóa sâu sắc bằng cách sử dụng NLP, học máy và nhận diện giọng nói.
-   **Phản hồi tức thì:** Giải thích ngay lập tức, chấm điểm phát âm và điều chỉnh độ khó linh hoạt.
-   **Game hóa có chiều sâu:** Chuỗi ngày học (streaks), bảng xếp hạng (leagues), thành tích, nhập vai và học tập qua câu chuyện.
-   **Xuất sắc về Phát âm:** Công nghệ nhận diện giọng nói kiểu ELSA với phản hồi chi tiết đến từng âm vị (phoneme).
-   **Học tập có cộng đồng:** Hỗ trợ từ giáo viên, đánh giá từ bạn bè và học tập hợp tác.

## 🎯 **Trạng thái Hiện tại (Đã hoàn thành)**

-   ✅ Cấu trúc khóa học cơ bản (Đơn vị, Bài học, Thử thách)
-   ✅ Đa dạng loại câu hỏi: SELECT, ASSIST, TRANSLATION, REVERSE_TRANSLATION, FILL_IN_BLANK, MATCHING_PAIRS, WORD_ORDER
-   ✅ Hệ thống Tim (Hearts)
-   ✅ Hệ thống Điểm/XP
-   ✅ Cửa hàng cơ bản với tính năng nạp tim
-   ✅ Bảng xếp hạng (Leaderboard)
-   ✅ Xác thực người dùng (Clerk)
-   ✅ Hệ thống đăng ký/thu phí (Stripe)
-   ✅ Bảng điều khiển quản trị nội dung (Admin Panel)
-   ✅ Giao diện tiếng Việt cho việc học tiếng Anh
-   ✅ Gợi ý bài học và ghi chú ngữ pháp
-   ✅ Cơ sở dữ liệu từ vựng nâng cao (hơn 500 từ với 3 đơn vị chủ đề)

---

## 📋 **Giai đoạn 1: Phản hồi Thông minh & Cá nhân hóa (Tuần 1-4)**

### 1.1 **Hệ thống Phản hồi AI-Powered** ⭐ MỚI
**Ưu tiên: CỰC KỲ QUAN TRỌNG** | **Độ khó: Cao**

- **Cảm hứng từ: Giải thích dựa trên GPT của Duolingo + Phân tích lỗi chi tiết của ELSA**

-   [ ] **Giải thích đáp án theo thời gian thực:**
    -   [ ] Hiển thị lý do đáp án đúng/sai bằng NLP.
    -   [ ] Cung cấp các quy tắc và mẫu ngữ pháp liên quan.
    -   [ ] Đề xuất các đáp án đúng thay thế.
    -   [ ] Giải thích các lỗi thường gặp cho người nói tiếng Việt.
-   [ ] **Theo dõi lỗi cá nhân hóa:**
    -   [ ] Theo dõi loại lỗi mà từng người dùng mắc phải (VD: sai mạo từ, giới từ, thì).
    -   [ ] Xác định các điểm ngữ pháp yếu.
    -   [ ] Theo dõi các từ dễ gây nhầm lẫn.
-   [ ] **Hệ thống gợi ý thích ứng:**
    -   [ ] Gợi ý theo ngữ cảnh dựa trên lịch sử lỗi của người dùng.
    -   [ ] Gợi ý tiến bộ (mẹo ngữ pháp → ví dụ → một phần đáp án).
    -   [ ] Tin nhắn động viên dựa trên hiệu suất.
-   [ ] **Nút "Báo cáo vấn đề":**
    -   [ ] Người dùng có thể gắn cờ các câu hỏi/audio không chính xác.
    -   [ ] Cộng đồng bình chọn các vấn đề được báo cáo.
    -   [ ] Bảng điều khiển quản trị viên để xem xét các báo cáo.

**Các file cần tạo/chỉnh sửa:**
-   `lib/ai-feedback.ts` (mới) - Bộ tạo giải thích dựa trên NLP.
-   `db/schema.ts` - Thêm bảng `errorTracking`, `feedbackReports`.
-   `app/lesson/result-card.tsx` - Giao diện phản hồi nâng cao.
-   `app/lesson/footer.tsx` - Hệ thống gợi ý thông minh.
-   `components/modals/feedback-modal.tsx` (mới)
-   `actions/error-tracking.ts` (mới)

### 1.2 **Bài kiểm tra xếp lớp Cá nhân hóa** ⭐ MỚI
**Ưu tiên: CAO** | **Độ khó: Cao**

- **Cảm hứng từ: Đánh giá kỹ năng chi tiết của ELSA**

-   [ ] **Đánh giá ban đầu toàn diện:**
    -   [ ] Kiểm tra kiến thức từ vựng (hơn 500 từ thông dụng).
    -   [ ] Kiểm tra hiểu biết ngữ pháp (thì, mạo từ, trật tự từ).
    -   [ ] Kiểm tra phát âm (nếu bật audio).
    -   [ ] Kiểm tra nghe hiểu.
-   [ ] **Kiểm tra thích ứng:**
    -   [ ] Điều chỉnh độ khó dựa trên câu trả lời.
    -   [ ] Độ dài tối ưu 10-15 phút.
    -   [ ] Bỏ qua nội dung người dùng đã biết.
-   [ ] **Báo cáo kết quả chi tiết:**
    -   [ ] Hiển thị điểm mạnh và điểm yếu theo danh mục.
    -   [ ] Dự đoán cấp độ CEFR (A1-C2).
    -   [ ] Tạo lộ trình học cá nhân hóa.
    -   [ ] Đề xuất đơn vị/bài học bắt đầu.

**Các file cần tạo/chỉnh sửa:**
-   `app/(main)/placement/page.tsx` (mới)
-   `app/(main)/placement/test/page.tsx` (mới)
-   `app/(main)/placement/results/page.tsx` (mới)
-   `actions/placement-test.ts` (mới)
-   `lib/placement-algorithm.ts` (mới) - Logic độ khó thích ứng.
-   `db/schema.ts` - Thêm bảng `placementTests`, `placementResults`.

### 1.3 **Cơ sở dữ liệu Nội dung nâng cao**
**Ưu tiên: Cao** | **Độ khó: Trung bình**

-   [x] Mở rộng từ vựng lên hơn 500 từ
-   [x] Thêm các đơn vị chủ đề:
    -   [x] Chào hỏi & Cơ bản
    -   [x] Đồ ăn & Thức uống
    -   [x] Gia đình & Mối quan hệ
    -   [ ] Số đếm & Thời gian
    -   [ ] Du lịch & Giao thông
    -   [ ] Công việc & Giáo dục (Tiếng Anh chuyên ngành)
    -   [ ] Sức khỏe & Cơ thể
    -   [ ] Sở thích & Giải trí
    -   [ ] Mua sắm & Dịch vụ
    -   [ ] Công nghệ & Internet
-   [ ] **Mở rộng lên hơn 2000 từ (từ vựng cấp độ ELSA).**
-   [ ] **Thêm từ vựng theo ngữ cảnh:**
    -   [ ] Cụm từ phỏng vấn xin việc.
    -   [ ] Các cuộc hội thoại đời sống hàng ngày.
    -   [ ] Viết email.
    -   [ ] Các cuộc gọi điện thoại.
-   [x] Thêm bảng giải thích ngữ pháp
-   [x] Tạo mẹo/ghi chú cho mỗi bài học
-   [ ] **Thêm ghi chú ngữ pháp chi tiết:**
    -   [ ] Các lỗi thường gặp của người học tiếng Việt.
    -   [ ] So sánh với ngữ pháp tiếng Việt.
    -   [ ] Các ví dụ sử dụng trong thực tế.
-   [x] Thêm câu ví dụ
-   [ ] **Thêm hướng dẫn phát âm:**
    -   [ ] Phiên âm IPA.
    -   [ ] Gần đúng theo tiếng Việt (ví dụ: "th" như "tờ nhẹ").
    -   [ ] Các lỗi phát âm phổ biến.

**Các file cần tạo/chỉnh sửa:**
-   `db/schema.ts` - Mở rộng từ vựng, thêm `pronunciationGuides`.
-   `scripts/seed-advanced-vocabulary.ts` (mới)
-   `scripts/seed-grammar-detailed.ts` (mới)
-   `components/grammar-explanation.tsx` - Hiển thị ngữ pháp nâng cao.
-   `components/pronunciation-guide.tsx` (mới)

**Trạng thái:** Hoàn thành một phần - 3 đơn vị chủ đề đã được tạo với mẹo và ghi chú ngữ pháp. Cần mở rộng lên hơn 2000 từ trên 10 đơn vị chủ đề.

### 1.4 **Hệ thống Thông báo Thông minh** ⭐ MỚI
**Ưu tiên: Trung bình** | **Độ khó: Trung bình**

- **Cảm hứng từ: Thời gian nhắc nhở tối ưu bằng AI của Duolingo**

-   [ ] **Phân tích thói quen học tập:**
    -   [ ] Theo dõi thời gian người dùng thường xuyên học.
    -   [ ] Xác định khung thời gian học tối ưu.
    -   [ ] Theo dõi các mẫu tương tác.
-   [ ] **Nhắc nhở cá nhân hóa:**
    -   [ ] Gửi thông báo vào thời điểm tốt nhất của người dùng.
    -   [ ] Thay đổi thông điệp nhắc nhở (động lực, dựa trên streak, dựa trên thành tích).
    -   [ ] Tần suất thích ứng (không gửi quá nhiều thông báo).
-   [ ] **Nội dung thông minh:**
    -   [ ] "Bạn sắp mất chuỗi học!"
    -   [ ] "Luyện tập những từ khó bạn đã học 3 ngày trước."
    -   [ ] "Hoàn thành một bài học để đạt mục tiêu hàng ngày."
    -   [ ] "Bạn đang chậm hơn [Tên bạn bè] 100 XP."

**Các file cần tạo/chỉnh sửa:**
-   `lib/notification-ai.ts` (mới) - Thuật toán thời gian thông minh.
-   `app/api/notifications/route.ts` (mới)
-   `actions/notification-scheduler.ts` (mới)
-   `db/schema.ts` - Thêm bảng `notificationPreferences`, `notificationHistory`.

---

## 📋 **Giai đoạn 2: Tinh thông Phát âm & Kỹ năng Nói (Tuần 5-8)**

- **Cảm hứng từ: Sự xuất sắc về phát âm của ELSA Speak**

### 2.1 **Nhận diện giọng nói Nâng cao (Tích hợp ELSA Speak API)** ⭐ ƯU TIÊN MỚI
**Ưu tiên: CỰC KỲ QUAN TRỌNG** | **Độ khó: Cao** (Giảm từ "Rất cao" do tận dụng API có sẵn)

-   [ ] **Phân tích phát âm cấp độ âm vị (phoneme) qua ELSA Speak API:**
    -   [ ] Tích hợp **ELSA Speak API** để phân tích giọng nói và cung cấp phản hồi phát âm chi tiết.
    -   [ ] Sử dụng API của ELSA để phân tích từng âm thanh riêng lẻ (nguyên âm, phụ âm, nhị trùng âm) trong câu trả lời của người dùng.
    -   [ ] Highlight chính xác âm thanh nào không chính xác dựa trên phản hồi từ API ELSA.
    -   [ ] Hiển thị trực quan so sánh phát âm của người dùng với người bản xứ (dựa trên dữ liệu/gợi ý từ API).
-   [ ] **Hệ thống chấm điểm chi tiết từ ELSA Speak API:**
    -   [ ] Điểm phát âm tổng thể (0-100) được cung cấp bởi API ELSA.
    -   [ ] Điểm từng từ riêng lẻ và phân tích độ chính xác âm vị.
    -   [ ] Phân tích độ trôi chảy và ngữ điệu (nếu API ELSA cung cấp).
    -   [ ] Dự đoán điểm IELTS Speaking (nếu API ELSA hỗ trợ tính năng này).
-   [ ] **Phản hồi trực quan theo thời gian thực:**
    -   [ ] Hiển thị hình ảnh sóng âm (waveform).
    -   [ ] Highlight âm vị đúng/sai bằng màu đỏ/xanh (dựa trên dữ liệu API ELSA).
    -   [ ] Sơ đồ vị trí miệng (nếu ELSA API cung cấp hoặc có thể suy diễn từ dữ liệu).
    -   [ ] Phát lại chậm phát âm của người bản xứ.
-   [ ] **So sánh phát âm:**
    -   [ ] Phát lại bản ghi âm của người dùng so với người bản xứ.
    -   [ ] So sánh sóng âm song song.
    -   [ ] Lặp lại các âm thanh có vấn đề cụ thể.

**Các file cần tạo/chỉnh sửa:**
-   `lib/elsa-speak-api.ts` (mới) - Tích hợp và xử lý ELSA Speak API.
-   `app/lesson/pronunciation-challenge.tsx` (chỉnh sửa) - Tận dụng dữ liệu từ ELSA API.
-   `components/pronunciation-feedback.tsx` (chỉnh sửa) - Hiển thị phản hồi từ ELSA API.
-   `components/waveform-visualizer.tsx` (chỉnh sửa)
-   `components/mouth-diagram.tsx` (chỉnh sửa)
-   `db/schema.ts` - Thêm bảng `pronunciationScores`, `phonemeProgress`.

### 2.2 **Lộ trình Phát âm Cá nhân hóa** ⭐ MỚI
**Ưu tiên: CAO** | **Độ khó: Cao**

-   [ ] **Đánh giá phát âm ban đầu:**
    -   [ ] Kiểm tra hơn 40 âm vị phổ biến (th, r, l, v/w, v.v.).
    -   [ ] Xác định các thách thức cụ thể của người nói tiếng Việt.
    -   [ ] Kiểm tra trọng âm từ và ngữ điệu.
    -   [ ] Tạo hồ sơ phát âm.
-   [ ] **Các bài luyện tập mục tiêu:**
    -   [ ] Tạo các bài học nhỏ cho từng âm thanh có vấn đề.
    -   [ ] Luyện tập các cặp từ tối thiểu (ship/sheep, bad/bed).
    -   [ ] Tongue twisters cho các âm thanh cụ thể.
    -   [ ] Độ khó tăng dần (âm thanh → từ → cụm từ → câu).
-   [ ] **Theo dõi tiến độ:**
    -   [ ] Heatmap phát âm (mã màu theo mức độ thành thạo).
    -   [ ] Theo dõi sự cải thiện theo thời gian cho từng âm vị.
    -   [ ] Kỷ niệm các cột mốc phát âm.
    -   [ ] Hiển thị so sánh trước/sau.

**Các file cần tạo/chỉnh sửa:**
-   `app/(main)/pronunciation/page.tsx` (mới)
-   `app/(main)/pronunciation/assessment/page.tsx` (mới)
-   `app/(main)/pronunciation/[phoneme]/page.tsx` (mới)
-   `components/pronunciation-heatmap.tsx` (mới)
-   `scripts/seed-pronunciation-lessons.ts` (mới)
-   `db/schema.ts` - Thêm bảng `pronunciationLessons`, `userPhonemeProgress`.

### 2.3 **Từ điển Thông minh với Luyện tập** ⭐ MỚI
**Ưu tiên: Trung bình** | **Độ khó: Trung bình**

- **Cảm hứng từ: Từ điển thông minh của ELSA**

-   [ ] **Thông tin từ vựng toàn diện:**
    -   [ ] Phiên âm IPA.
    -   [ ] Audio từ người bản xứ (biến thể US/UK).
    -   [ ] Loại từ và định nghĩa.
    -   [ ] Câu ví dụ kèm audio.
    -   [ ] Các cụm từ thường dùng (collocations).
    -   [ ] Bản dịch tiếng Việt và ghi chú cách dùng.
-   [ ] **Luyện tập tức thì:**
    -   [ ] Luyện phát âm bất kỳ từ nào.
    -   [ ] Chấm điểm phát âm của người dùng (sử dụng ELSA Speak API).
    -   [ ] Thêm từ vào danh sách từ vựng cá nhân.
    -   [ ] Tạo bài tập luyện tập cho từ này.
-   [ ] **Ngân hàng từ vựng cá nhân:**
    -   [ ] Lưu các từ đã tra cứu.
    -   [ ] Theo dõi từ nào đã được luyện tập.
    -   [ ] Ôn tập các từ yếu.
    -   [ ] Xuất ra các ứng dụng flashcard/Anki.

**Các file cần tạo/chỉnh sửa:**
-   `app/(main)/dictionary/page.tsx` (mới)
-   `app/(main)/dictionary/[word]/page.tsx` (mới)
-   `components/dictionary-entry.tsx` (mới)
-   `components/word-practice-modal.tsx` (mới)
-   `db/schema.ts` - Thêm bảng `userVocabulary`, `wordLookups`.
-   `actions/dictionary-actions.ts` (mới)

### 2.4 **Nghe hiểu**
**Ưu tiên: Cao** | **Độ khó: Trung bình**

-   [ ] Thêm loại câu hỏi NGHE HIỂU (LISTENING).
-   [ ] Phát audio, người dùng gõ những gì nghe được.
-   [ ] Hiển thị sóng âm thanh.
-   [ ] Thêm nút "Chậm" và "Bình thường".
-   [ ] Thêm tùy chọn báo cáo "Không nghe được".
-   [ ] **Đa dạng nguồn audio:**
    -   [ ] Nhiều giọng (US, UK, Úc).
    -   [ ] Nhiều người nói (nam, nữ, các độ tuổi).
    -   [ ] Mức độ tiếng ồn nền (yên tĩnh, quán cà phê, đường phố).
    -   [ ] Giọng nói tự nhiên so với giọng nói rõ ràng.

**Các file cần tạo/chỉnh sửa:**
-   `db/schema.ts` - Thêm LISTENING vào `challengesEnum`.
-   `app/lesson/listening-challenge.tsx` (mới)
-   `components/audio-player-advanced.tsx` (mới)
-   `scripts/prod.ts` - Thêm thử thách nghe.
-   `public/audio/` - Tổ chức file audio theo giọng/người nói.

### 2.5 **Tích hợp Audio Chuyên nghiệp**
**Ưu tiên: Cao** | **Độ khó: Trung bình**

-   [ ] Ghi âm/Nguồn audio người bản xứ cho tất cả từ vựng.
-   [ ] Thêm tùy chọn phát lại chậm.
-   [ ] Thêm audio cho câu và đoạn hội thoại.
-   [ ] Nhiều tùy chọn giọng nói (nam/nữ).
-   [ ] Các tùy chọn giọng điệu khác nhau (US/UK).
-   [ ] Cài đặt chất lượng audio.
-   [ ] **Quản lý thư viện audio:**
    -   [ ] Tổ chức theo đơn vị/bài học/từ.
    -   [ ] Kiểm soát phiên bản cho các bản cập nhật audio.
    -   [ ] Fallback sang TTS nếu audio bị thiếu.

**Các file cần tạo/chỉnh sửa:**
-   `app/lesson/challenge.tsx` - Thêm điều khiển audio.
-   `components/audio-player.tsx` (mới)
-   `lib/audio-manager.ts` (mới)
-   `public/audio/` - Tổ chức file audio.

---

## 📋 **Giai đoạn 3: Lặp lại Ngắt quãng & Học tập Thích ứng (Tuần 9-12)**

### 3.1 **Hệ thống Lặp lại Ngắt quãng Nâng cao (SRS)** ⭐ MỚI
**Ưu tiên: CỰC KỲ QUAN TRỌNG** | **Độ khó: Rất cao**

- **Cảm hứng từ: Các thuật toán thích ứng của Duolingo**

-   [ ] **Thuật toán SRS tinh vi:**
    -   [ ] Triển khai thuật toán SuperMemo SM-2 đã sửa đổi.
    -   [ ] Theo dõi độ mạnh của từng từ/điểm ngữ pháp (0-5 cấp độ).
    -   [ ] Dự đoán thời gian ôn tập tối ưu.
    -   [ ] Điều chỉnh dựa trên độ chính xác của người dùng.
    -   [ ] Tính đến các mục tương tự (can thiệp).
-   [ ] **Lập lịch ôn tập thông minh:**
    -   [ ] Tự động tạo các phiên ôn tập.
    -   [ ] Trộn nội dung cũ và mới một cách tối ưu.
    -   [ ] Ưu tiên các mục sắp bị quên.
    -   [ ] Hiển thị số lượng "từ cần ôn tập" một cách nổi bật.
    -   [ ] Tùy chọn "Ôn tập ngay" hoặc "Ôn tập sau".
-   [ ] **Trực quan hóa độ mạnh:**
    -   [ ] Hiển thị thanh độ mạnh trên mỗi bài học.
    -   [ ] Trực quan hóa sự suy giảm theo thời gian.
    -   [ ] Dự đoán khi nào bài học sẽ suy yếu thành "yếu".
    -   [ ] Heatmap độ mạnh của từ vựng.

**Các file cần tạo/chỉnh sửa:**
-   `lib/spaced-repetition-advanced.ts` (mới) - Triển khai thuật toán SM-2.
-   `db/schema.ts` - Thêm bảng `itemStrength`, `reviewHistory`.
-   `actions/review-scheduler.ts` (mới)
-   `app/(main)/review/page.tsx` (mới)
-   `components/strength-meter.tsx` (mới)
-   `app/(main)/learn/lesson-button.tsx` - Hiển thị chỉ báo độ mạnh.

### 3.2 **Công cụ Điều chỉnh độ khó Thích ứng** ⭐ MỚI
**Ưu tiên: CAO** | **Độ khó: Rất cao**

-   [ ] **Điều chỉnh độ khó theo thời gian thực:**
    -   [ ] Theo dõi hiệu suất của người dùng theo loại câu hỏi.
    -   [ ] Điều chỉnh độ khó giữa bài học nếu quá dễ/khó.
    -   [ ] Cân bằng thử thách và tỷ lệ thành công (mục tiêu độ chính xác 75-85%).
    -   [ ] Tránh các vùng gây nản lòng và nhàm chán.
-   [ ] **Tạo bài học cá nhân hóa:**
    -   [ ] Tạo các phiên luyện tập tùy chỉnh dựa trên các lĩnh vực yếu.
    -   [ ] Trộn các loại câu hỏi một cách tối ưu cho từng người dùng.
    -   [ ] Tăng dần thử thách.
    -   [ ] Giới thiệu các khái niệm mới khi người dùng sẵn sàng.
-   [ ] **Phân tích hiệu suất:**
    -   [ ] Theo dõi độ chính xác theo loại câu hỏi.
    -   [ ] Xác định các mẫu vấn đề.
    -   [ ] Đề xuất luyện tập mục tiêu.

**Các file cần tạo/chỉnh sửa:**
-   `lib/adaptive-difficulty.ts` (mới)
-   `lib/lesson-generator.ts` (mới)
-   `actions/performance-tracking.ts` (mới)
-   `db/schema.ts` - Thêm bảng `performanceMetrics`, `adaptiveSettings`.

### 3.3 **Chế độ Ôn tập & Luyện tập**
**Ưu tiên: Trung bình** | **Độ khó: Trung bình**

-   [ ] Thêm chế độ "Ôn tập các từ yếu".
-   [ ] Thêm chế độ "Luyện tập theo thời gian" (thử thách tốc độ).
-   [ ] Thêm thử thách "Cấp độ Huyền thoại" (yêu cầu độ chính xác hoàn hảo).
-   [ ] Tạo các phiên chỉ luyện tập (không mất tim).
-   [ ] Thêm "Ôn tập tổng hợp" trên nhiều bài học.
-   [ ] **Các chế độ luyện tập mới:**
    -   [ ] "Pronunciation bootcamp" - luyện tập phát âm chuyên sâu.
    [ ] "Grammar focus" - các bài tập ngữ pháp cụ thể.
    -   [ ] "Listening intensive" - thử thách chỉ có audio.
    -   [ ] "Speed round" - thử thách gợi nhớ nhanh.

**Các file cần tạo/chỉnh sửa:**
-   `app/(main)/practice/page.tsx` (mới)
-   `app/(main)/practice/timed/page.tsx` (mới)
-   `app/(main)/practice/pronunciation/page.tsx` (mới)
-   `components/practice-mode-selector.tsx` (mới)

---

## 📋 **Giai đoạn 4: Học tập Nhập vai & Đóng vai (Tuần 13-16)**
**Cảm hứng từ: Chế độ Story của Duolingo và nhập vai AI**

### 4.1 **AI Chatbot Nhập vai** ⭐ ƯU TIÊN MỚI
**Ưu tiên: CỰC KỲ QUAN TRỌNG** | **Độ khó: Rất cao**

- **Cảm hứng từ: Cuộc trò chuyện GPT-4 của Duolingo Max + kịch bản thực tế của ELSA**

-   [ ] **Các kịch bản hội thoại thực tế:**
    -   [ ] Phỏng vấn xin việc (luyện trả lời câu hỏi).
    [ ] Đặt món ăn tại nhà hàng.
    -   [ ] Nhận/trả phòng khách sạn.
    -   [ ] Mua sắm và mặc cả.
    -   [ ] Kết bạn và nói chuyện phiếm.
    -   [ ] Các cuộc gọi điện thoại.
    -   [ ] Các cuộc họp kinh doanh.
    -   [ ] Các cuộc hẹn khám bác sĩ.
-   [ ] **Phản hồi do AI cung cấp:**
    -   [ ] Tích hợp GPT-4/Claude để có các cuộc hội thoại tự nhiên.
    -   [ ] Hiểu các đầu vào đa dạng của người dùng.
    -   [ ] Cung cấp các sửa lỗi hữu ích.
    -   [ ] Điều chỉnh độ khó hội thoại.
    -   [ ] Ghi nhớ ngữ cảnh trong cuộc hội thoại.
-   [ ] **Phản hồi trong cuộc hội thoại:**
    -   [ ] Sửa lỗi ngữ pháp theo thời gian thực (nhẹ nhàng, không xâm phạm).
    -   [ ] Phản hồi phát âm nếu người dùng nói (sử dụng ELSA Speak API).
    -   [ ] Đề xuất lựa chọn từ tốt hơn.
    -   [ ] Mẹo văn hóa và ghi chú nghi thức.
-   [ ] **Lịch sử hội thoại:**
    -   [ ] Lưu tất cả các cuộc hội thoại.
    -   [ ] Xem lại các cuộc đối thoại trước đây.
    -   [ ] Theo dõi sự cải thiện theo thời gian.
    -   [ ] Xuất các cuộc hội thoại.

**Các file cần tạo/chỉnh sửa:**
-   `app/(main)/roleplay/page.tsx` (mới)
-   `app/(main)/roleplay/[scenarioId]/page.tsx` (mới)
-   `app/api/ai-chat/route.ts` (mới) - Tích hợp GPT.
-   `lib/conversation-ai.ts` (mới)
-   `components/chat-interface.tsx` (mới)
-   `db/schema.ts` - Thêm bảng `conversations`, `conversationMessages`.
-   `actions/roleplay-actions.ts` (mới)

### 4.2 **Chế độ Truyện tương tác**
**Ưu tiên: Cao** | **Độ khó: Cao**

-   [ ] Tạo truyện tương tác (hơn 50 truyện across các cấp độ).
-   [ ] Điền vào chỗ trống trong ngữ cảnh truyện.
-   [ ] Câu hỏi trắc nghiệm về truyện.
-   [ ] Kể chuyện bằng audio với nhiều giọng khác nhau.
-   [ ] Các cấp độ khó (sơ cấp/trung cấp/nâng cao).
-   [ ] Theo dõi các truyện đã hoàn thành.
-   [ ] **Các tính năng truyện nâng cao:**
    -   [ ] Phân nhánh theo phong cách "chọn cuộc phiêu lưu của riêng bạn".
    -   [ ] Đối thoại nhân vật với các giọng điệu khác nhau.
    -   [ ] Giải thích ngữ cảnh văn hóa.
    -   [ ] Highlight từ vựng và định nghĩa.
    -   [ ] Câu hỏi hiểu bài tại các điểm kiểm tra.
    -   [ ] Chứng chỉ hoàn thành truyện.

**Các file cần tạo/chỉnh sửa:**
-   `db/schema.ts` - Thêm bảng `stories`, `storyParagraphs`, `storyChoices`.
-   `app/(main)/stories/page.tsx` (mới)
-   `app/(main)/stories/[storyId]/page.tsx` (mới)
-   `components/story-reader.tsx` (mới)
-   `components/story-question.tsx` (mới)
-   `scripts/seed-stories.ts` (mới)

### 4.3 **Học tập dựa trên Video** ⭐ MỚI
**Ưu tiên: Trung bình** | **Độ khó: Trung bình**

- **Cảm hứng từ: Các bài học video của ELSA**

-   [ ] **Các bài học video:**
    -   [ ] Hướng dẫn phát âm với chuyển động miệng.
    -   [ ] Video giải thích ngữ pháp.
    -   [ ] Các ví dụ hội thoại trong đời thực.
    -   [ ] Các đoạn clip về văn hóa.
-   [ ] **Câu hỏi video tương tác:**
    -   [ ] Tạm dừng và trả lời câu hỏi.
    -   [ ] Lặp lại sau người nói.
    -   [ ] Các tùy chọn phụ đề (Tiếng Anh/Tiếng Việt/Cả hai/Không).
    -   [ ] Điều khiển tốc độ phát lại.
-   [ ] **Thư viện video:**
    -   [ ] Tổ chức theo chủ đề và cấp độ.
    -   [ ] Tìm kiếm và lọc.
    -   [ ] Theo dõi các video đã xem.
    -   [ ] Đề xuất các video tiếp theo.

**Các file cần tạo/chỉnh sửa:**
-   `app/(main)/videos/page.tsx` (mới)
-   `app/(main)/videos/[videoId]/page.tsx` (mới)
-   `components/video-player-interactive.tsx` (mới)
-   `db/schema.ts` - Thêm bảng `videos`, `videoProgress`.

---

## 📋 **Giai đoạn 5: Game hóa Chuyên sâu & Tương tác xã hội (Tuần 17-20)**

### 5.1 **Chuỗi ngày học (Streaks) & Mục tiêu hàng ngày**
**Ưu tiên: Cao** | **Độ khó: Trung bình**

-   [ ] Thêm bộ đếm chuỗi ngày học hàng ngày.
-   [ ] Thêm "đóng băng chuỗi ngày" (mua bằng ngọc).
-   [ ] Đặt mục tiêu XP hàng ngày (có thể tùy chỉnh).
-   [ ] Thêm thông báo "Cứu chuỗi ngày học".
-   [ ] Hiển thị chuỗi ngày học trong hồ sơ.
-   [ ] Thêm kỷ lục chuỗi ngày học dài nhất.
-   [ ] Kỷ niệm các cột mốc chuỗi ngày học (7, 30, 100, 365 ngày).

**Các file cần tạo/chỉnh sửa:**
-   `db/schema.ts` - Thêm bảng `streaks`, `dailyGoals`.
-   `actions/streak-actions.ts` (mới)
-   `components/streak-display.tsx` (mới)
-   `components/modals/streak-freeze-modal.tsx` (mới)
-   `app/(main)/learn/header.tsx` - Hiển thị chuỗi ngày học.

### 5.2 **Hệ thống Giải đấu (League System)**
**Ưu tiên: Trung bình** | **Độ khó: Cao**

-   [ ] Triển khai các giải đấu hàng tuần (Đồng → Kim cương → Ngọc trai).
-   [ ] Thêm hệ thống thăng/giáng hạng.
-   [ ] Đặt lại bảng xếp hạng hàng tuần.
-   [ ] Phần thưởng giải đấu (tăng XP, huy hiệu).
-   [ ] Hiển thị tiến độ giải đấu trong bảng xếp hạng.
-   [ ] Thêm "lá chắn" để ngăn chặn giáng hạng.

**Các file cần tạo/chỉnh sửa:**
-   `db/schema.ts` - Thêm bảng `leagues`, `weeklyProgress`.
-   `actions/league-actions.ts` (mới)
-   `app/(main)/leaderboard/page.tsx` - Cập nhật với giải đấu.
-   `components/league-badge.tsx` (mới)
-   `lib/league-system.ts` - Logic giải đấu.

### 5.3 **Thành tích & Huy hiệu**
**Ưu tiên: Thấp** | **Độ khó: Trung bình**

-   [ ] Tạo hệ thống thành tích.
-   [ ] Thêm huy hiệu cho các cột mốc:
    -   [ ] Hoàn thành bài học đầu tiên.
    -   [ ] Hoàn thành 10/50/100 bài học.
    -   [ ] Chuỗi ngày học 7/30/100 ngày.
    -   [ ] Bài học hoàn hảo (không sai sót).
    -   [ ] 10 bài học hoàn hảo liên tiếp.
    -   [ ] Hoàn thành một đơn vị.
    -   [ ] Đạt top 10 trong giải đấu.
-   [ ] Hiển thị huy hiệu trên hồ sơ.
-   [ ] Thêm thông báo thành tích.

**Các file cần tạo/chỉnh sửa:**
-   `db/schema.ts` - Thêm bảng `achievements`, `userAchievements`.
-   `actions/achievement-actions.ts` (mới)
-   `app/(main)/profile/page.tsx` (mới)
-   `components/achievement-badge.tsx` (mới)
-   `components/modals/achievement-unlocked-modal.tsx` (mới)

### 5.4 **Hệ thống Cửa hàng nâng cao**
**Ưu tiên: Thấp** | **Độ khó: Thấp**

-   [ ] Thêm tiền tệ ngọc (kiếm được qua thành tích).
-   [ ] Thêm các vật phẩm cửa hàng:
    -   [ ] Đóng băng chuỗi ngày học.
    -   [ ] Nạp tim.
    -   [ ] Tăng XP (gấp đôi trong 1 giờ).
    -   [ ] Lá chắn giải đấu.
    -   [ ] Trang phục/phụ kiện linh vật.
-   [ ] Thêm kho vật phẩm.
-   [ ] Thêm chức năng "Sử dụng vật phẩm".

**Các file cần tạo/chỉnh sửa:**
-   `db/schema.ts` - Thêm bảng `gems`, `inventory`, `shopItems`.
-   `app/(main)/shop/page.tsx`
-   `app/(main)/shop/items.tsx`
-   `actions/shop-actions.ts` (mới)

### 5.5 **Hệ thống Bạn bè**
**Ưu tiên: Thấp** | **Độ khó: Trung bình**

-   [ ] Thêm yêu cầu kết bạn.
-   [ ] Theo dõi/bỏ theo dõi người dùng.
-   [ ] Xem tiến độ của bạn bè.
-   [ ] So sánh XP với bạn bè.
-   [ ] Bảng xếp hạng bạn bè.
-   [ ] Nguồn cấp dữ liệu hoạt động.

**Các file cần tạo/chỉnh sửa:**
-   `db/schema.ts` - Thêm bảng `friendships`, `friendRequests`.
-   `actions/friend-actions.ts` (mới)
-   `app/(main)/friends/page.tsx` (mới)
-   `components/friend-card.tsx` (mới)

### 5.6 **Câu lạc bộ/Nhóm**
**Ưu tiên: Thấp** | **Độ khó: Trung bình**

-   [ ] Tạo/tham gia câu lạc bộ.
-   [ ] Bảng xếp hạng câu lạc bộ.
-   [ ] Chat/thảo luận trong câu lạc bộ.
-   [ ] Thử thách câu lạc bộ.
-   [ ] Thành tích câu lạc bộ.

**Các file cần tạo/chỉnh sửa:**
-   `db/schema.ts` - Thêm bảng `clubs`, `clubMembers`.
-   `app/(main)/clubs/page.tsx` (mới)
-   `app/(main)/clubs/[clubId]/page.tsx` (mới)

### 5.7 **Diễn đàn Thảo luận**
**Ưu tiên: Thấp** | **Độ khó: Cao**

-   [ ] Thảo luận theo bài học cụ thể.
-   [ ] Đặt câu hỏi về các bài tập.
-   [ ] Upvote/downvote câu trả lời.
-   [ ] Đánh dấu câu trả lời tốt nhất.
-   [ ] Hệ thống kiểm duyệt.

**Các file cần tạo/chỉnh sửa:**
-   `db/schema.ts` - Thêm bảng `discussions`, `comments`.
-   `app/(main)/discussions/page.tsx` (mới)
-   `app/(main)/discussions/[discussionId]/page.tsx` (mới)

---

## 📋 **Giai đoạn 6: Phân tích Nâng cao & Tối ưu hóa (Tuần 21-24)**

### 6.1 **Phân tích Tiến độ chi tiết**
**Ưu tiên: Trung bình** | **Độ khó: Trung bình**

-   [ ] Thêm bảng điều khiển tiến độ chi tiết.
-   [ ] Hiển thị đồ thị:
    -   [ ] XP theo thời gian.
    -   [ ] Bài học hoàn thành mỗi tuần.
    -   [ ] Tỷ lệ chính xác.
    -   [ ] Thời gian học.
-   [ ] Số lượng từ vựng.
-   [ ] Các lĩnh vực yếu nhất.
-   [ ] Heatmap thời gian học.
-   [ ] Các thông tin chi tiết cá nhân hóa.

**Các file cần tạo/chỉnh sửa:**
-   `app/(main)/progress/page.tsx` (mới)
-   `components/charts/xp-chart.tsx` (mới)
-   `components/charts/heatmap.tsx` (mới)
-   `actions/analytics-actions.ts` (mới)

### 6.2 **Chế độ Ngoại tuyến & PWA**
**Ưu tiên: Trung bình** | **Độ khó: Cao**

-   [ ] Cấu hình manifest PWA.
-   [ ] Thêm service worker để lưu trữ cache ngoại tuyến.
-   [ ] Lưu cache bài học để sử dụng ngoại tuyến.
-   [ ] Đồng bộ tiến độ khi có kết nối internet.
-   [ ] Tải bài học để sử dụng ngoại tuyến.
-   [ ] Chỉ báo ngoại tuyến trong UI.

**Các file cần tạo/chỉnh sửa:**
-   `public/manifest.json` (mới)
-   `public/sw.js` (mới)
-   `app/layout.tsx` - Đăng ký service worker.
-   `lib/offline-sync.ts` (mới)

### 6.3 **Thông báo & Nhắc nhở (Nâng cao)**
**Ưu tiên: Trung bình** | **Độ khó: Trung bình**

-   [ ] Thông báo đẩy (push notifications) cho lời nhắc luyện tập.
-   [ ] Thông báo email cho các chuỗi ngày học có nguy cơ bị mất.
-   [ ] Thông báo trong ứng dụng.
-   [ ] Tùy chọn thông báo.
-   [ ] Thời gian thông minh dựa trên thói quen người dùng.

**Các file cần tạo/chỉnh sửa:**
-   `lib/notifications.ts` (mới)
-   `app/api/notifications/route.ts` (mới)
-   `app/(main)/settings/notifications/page.tsx` (mới)

### 6.4 **Cải thiện Khả năng Tiếp cận (Accessibility)**
**Ưu tiên: Trung bình** | **Độ khó: Trung bình**

-   [ ] Hoàn thiện điều hướng bằng bàn phím.
-   [ ] Hỗ trợ trình đọc màn hình (nhãn ARIA).
-   [ ] Chế độ tương phản cao.
-   [ ] Điều chỉnh kích thước văn bản.
-   [ ] Tùy chọn giảm chuyển động.
-   [ ] Màu sắc thân thiện với người mù màu.

**Các file cần tạo/chỉnh sửa:**
-   Tất cả các file component - Thêm nhãn ARIA.
-   `app/globals.css` - Thêm các class về khả năng tiếp cận.
-   `app/(main)/settings/accessibility/page.tsx` (mới)

### 6.5 **Tối ưu hóa Hiệu suất**
**Ưu tiên: Cao** | **Độ khó: Trung bình**

-   [ ] Triển khai lazy loading cho các bài học.
-   [ ] Tối ưu hóa hình ảnh (sử dụng next/image).
-   [ ] Tối ưu hóa truy vấn cơ sở dữ liệu.
-   [ ] Thêm chiến lược caching.
-   [ ] Chia tách mã.
-   [ ] Tối ưu hóa kích thước gói.

**Các file cần tạo/chỉnh sửa:**
-   `next.config.mjs` - Tối ưu hóa bản dựng.
-   Tất cả các thành phần trang - Thêm lazy loading.
-   `db/queries.ts` - Tối ưu hóa truy vấn.

### 6.6 **Phản hồi trên thiết bị Di động (Mobile Responsiveness)**
**Ưu tiên: Cao** | **Độ khó: Trung bình**

-   [ ] Kiểm tra tất cả các trang trên thiết bị di động.
-   [ ] Tối ưu hóa vùng chạm (touch targets).
-   [ ] Điều chỉnh UI cụ thể cho di động.
-   [ ] Cử chỉ vuốt để điều hướng.
-   [ ] Tối ưu hóa bàn phím di động.
-   [ ] Hỗ trợ chế độ dọc/ngang.

**Các file cần tạo/chỉnh sửa:**
-   Tất cả các file component - Thêm style di động.
-   `app/globals.css` - Các breakpoint di động.

---

## 📋 **Giai đoạn 7: Mở rộng Nội dung (Liên tục)**

### 7.1 **Mở rộng Từ vựng**
**Ưu tiên: Cao** | **Độ khó: Thấp-Trung bình**

-   [ ] Mở rộng lên 2000+ từ.
-   [ ] Thêm thành ngữ và cụm từ.
-   [ ] Tiếng Anh thương mại.
-   [ ] Tiếng Anh học thuật.
-   [ ] Các cụm từ đàm thoại.
-   [ ] Tiếng lóng và ngôn ngữ không trang trọng.

### 7.2 **Bài học Ngữ pháp chuyên sâu**
**Ưu tiên: Cao** | **Độ khó: Cao**

-   [ ] Thì hiện tại.
-   [ ] Thì quá khứ.
-   [ ] Thì tương lai.
-   [ ] Câu điều kiện.
-   [ ] Thể bị động.
-   [ ] Mạo từ (a/an/the).
-   [ ] Giới từ.
-   [ ] Cụm động từ (phrasal verbs).
-   [ ] Động từ khiếm khuyết (modal verbs).

### 7.3 **Các Khóa học bổ sung**
**Ưu tiên: Thấp** | **Độ khó: Cao**

-   [ ] Thêm nhiều ngôn ngữ hơn để học từ tiếng Việt.
-   [ ] Các cấp độ thành thạo khác nhau.
-   [ ] Các khóa học chuyên biệt (Kinh doanh, Du lịch, v.v.).

---

## 🎯 **Chỉ số Thành công (Success Metrics)**

Theo dõi các KPI này để đo lường thành công:

-   **Mức độ Tương tác của Người dùng:**
    -   Người dùng hoạt động hàng ngày (DAU).
    -   Thời lượng phiên trung bình.
    -   Bài học hoàn thành mỗi người dùng.
    -   Tỷ lệ giữ chân người dùng (D1, D7, D30).
-   **Hiệu quả Học tập:**
    -   Tỷ lệ chính xác trung bình.
    -   Số từ học được mỗi người dùng.
    -   Tỷ lệ hoàn thành mỗi bài học.
    -   Tốc độ tiến bộ.
    -   **Điểm số phát âm trung bình (mới)**
    -   **Tỷ lệ cải thiện phát âm theo âm vị (mới)**
-   **Game hóa:**
    -   Độ dài chuỗi ngày học trung bình.
    -   Tỷ lệ tham gia giải đấu.
    -   Tỷ lệ mở khóa thành tích.
    -   Mức độ sử dụng vật phẩm trong cửa hàng.
-   **Tương tác Cộng đồng:**
    -   **Số lượng bạn bè trung bình mỗi người dùng (mới)**
    -   **Tỷ lệ tham gia Câu lạc bộ (mới)**
    -   **Tỷ lệ tương tác diễn đàn (mới)**

---

## 🛠️ **Yêu cầu về Công nghệ**

### **Hiện tại:**
-   Next.js 14+ (App Router)
-   TypeScript
-   Tailwind CSS
-   Drizzle ORM
-   PostgreSQL (Neon)
-   Clerk (Auth)
-   Stripe (Payments)

### **Các Công cụ bổ sung cần thiết:**
-   **Nhận diện giọng nói:** **ELSA Speak API** (để chấm điểm phát âm) / Web Speech API / Google Cloud Speech-to-Text (hỗ trợ cho các tính năng khác nếu cần).
-   **Xử lý Audio:** Howler.js hoặc tương tự
-   **Biểu đồ:** Recharts hoặc Chart.js
-   **Animation:** Framer Motion
-   **PWA:** next-pwa
-   **Thông báo đẩy:** Web Push API / Firebase Cloud Messaging
-   **Real-time:** Pusher hoặc Socket.io (cho tính năng chat/xã hội)
-   **Tối ưu hóa hình ảnh:** Sharp (đã có trong Next.js)
-   **Kiểm thử:** Jest + React Testing Library
-   **Kiểm thử E2E:** Playwright hoặc Cypress
-   **AI Generative Models:** OpenAI GPT-4, Claude hoặc tương đương (để giải thích và nhập vai AI)

---

## 📝 **Thực tiễn Phát triển Tốt nhất**

1.  **Kiểm soát phiên bản:**
    -   Tạo nhánh tính năng cho mỗi giai đoạn.
    -   Thực hiện commit thường xuyên với thông điệp có ý nghĩa.
    -   Xem xét Pull Request trước khi hợp nhất.
2.  **Kiểm thử:**
    -   Viết unit test cho logic nghiệp vụ.
    -   E2E test cho các luồng người dùng quan trọng.
    -   Kiểm thử trên nhiều thiết bị/trình duyệt.
3.  **Tài liệu:**
    -   Giữ README cập nhật.
    -   Tài liệu hóa các endpoint API.
    -   Tài liệu thành phần.
    -   Cập nhật lộ trình này khi cần thiết.
4.  **Chất lượng Mã:**
    -   ESLint + Prettier.
    -   Chế độ nghiêm ngặt của TypeScript.
    -   Kiểm tra mã.
    -   Refactor thường xuyên.
5.  **Cơ sở dữ liệu:**
    -   Sao lưu thường xuyên.
    -   Chiến lược di chuyển.
    -   Tối ưu hóa chỉ mục.
    -   Giám sát hiệu suất truy vấn.

---