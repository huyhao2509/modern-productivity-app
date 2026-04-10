# AI Instructions – Modern Productivity App (React + Vite + Node)

## 1. Bối cảnh

- Dự án: Ứng dụng web hiện đại quản lý project/task (dùng để học cách làm việc với AI).
- Tech stack:
  - Frontend: React + TypeScript, Vite.
  - Backend: NodeJS + Express + TypeScript.
- Thư mục:
  - `frontend/` – React app.
  - `backend/` – Express API.

## 2. Cách chạy / build

### Frontend (Vite React TS)

- Thư mục: `frontend/`
- Cài deps:
  - `cd frontend`
  - `npm install`
- Chạy dev:
  - `npm run dev` (mặc định port 5173)
- Build:
  - `npm run build`
- Preview bản build:
  - `npm run preview`

### Backend (Express TS)

- Thư mục: `backend/`
- Cài deps:
  - `cd backend`
  - `npm install`
- Chạy dev:
  - `npm run dev` (mặc định port 4000)
- Build:
  - `npm run build`
- Chạy bản build:
  - `npm start`

## 3. Quy ước TypeScript

- Cả frontend và backend đều dùng TypeScript.
- Hạn chế dùng `any`, ưu tiên khai báo type/interface rõ ràng cho:
  - Entity chính (User, Project, Task, ...)
  - Props component React.
- Khi sửa code, nếu type lỗi, hãy sửa type cho đúng và giải thích ngắn gọn.

## 4. Quy tắc làm việc với AI trong repo này

Khi bạn hỗ trợ mình:

1. Nếu task liên quan giao diện/UI:
   - Ưu tiên xem code trong `frontend/src/`.
2. Nếu task liên quan API/dữ liệu:
   - Ưu tiên xem code trong `backend/src/`.
3. Khi mình nói về "build dự án":
   - Hỏi lại là build FE, BE hay cả hai.
   - Dùng các lệnh ở mục 2.
4. Khi mình đưa log lỗi (build hoặc runtime):
   - Đọc log, giải thích nguyên nhân rõ ràng.
   - Chỉ đúng file/dòng liên quan.
   - Đề xuất patch nhỏ, dễ hiểu.
   - Nhắc mình lệnh cần chạy lại để kiểm tra.
5. Khi thêm tính năng:
   - Làm rõ cần thay đổi ở FE, BE hay cả hai.
   - Đề xuất thay đổi từng bên + test (nếu phù hợp).

## 5. Cấu trúc mã nguồn mong muốn

- Frontend:
  - Các trang chính đặt ở `frontend/src/pages/`.
  - Các component dùng lại đặt ở `frontend/src/components/`.
  - Hàm gọi API đặt ở `frontend/src/services/`.
  - Kiểu dữ liệu dùng chung đặt ở `frontend/src/types/`.

- Backend:
  - Dùng mô hình MVC.
  - Router/API đặt ở `backend/src/routes/` và chỉ làm nhiệm vụ định tuyến.
  - Controller đặt ở `backend/src/controllers/` để nhận request/response.
  - Logic xử lý đặt ở `backend/src/services/`.
  - Kiểu dữ liệu đặt ở `backend/src/types/`.

## 6. Cách đề xuất thay đổi

- Khi đề xuất sửa code:
  - Chỉ rõ file và nếu được thì kèm số dòng xấp xỉ.
  - Giải thích ngắn gọn “tại sao sửa như vậy”.
- Khi tạo file mới:
  - Nói rõ đường dẫn đầy đủ (ví dụ: `backend/src/routes/projectRoutes.ts`).

## 7. Khi không chắc chắn

- Nếu không chắc về hiện trạng code hoặc API:
  - Hãy nói rõ “không chắc” và gợi ý mình kiểm tra file/đoạn mã cụ thể.
- Không tự bịa đường dẫn hoặc endpoint nếu không tìm thấy trong repo.
