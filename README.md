# Nhóm Cú Đêm

## Thông tin Thành Viên Nhóm:
---

| MSSV       | Họ Tên           | Email                         | Số Điện Thoại   |
| :---------:|:----------------:| :----------------------------:|:---------------:|
| 19424031   | Nguyễn Thị Oanh  | 19424031@student.hcmus.edu.vn | 0388256797      |
| 19424033   | Huỳnh Đức Phong  | 19424033@student.hcmus.edu.vn | 0777178681      |
| 19424044   | Nguyễn Mai Thi   | 19424044@student.hcmus.edu.vn | 0327247666      |
| 19424052   | Hà Minh Bảo Toàn | 19424052@student.hcmus.edu.vn | 0327247666      |


#### Link Project: https://github.com/19424033/OnlineAcademy


# Hướng dẫn chạy chương trình:
- b1: clone về: $git clone https://github.com/19424033/OnlineAcademy
- b2: npm install (lâu, đợi cài package cà frontend và backend )
- b3: npm start 
   - note: 
      - frontend localhost: 3000
      - backend localhost: 4000
- note: để chạy riêng client: tại ./frontend : npm start
- note: để chạy riêng server: tại ./backend : npm start

 "start-client": "cd frontend  && npm start",
    "postinstall": "concurrently \"cd backend && npm install\" \"cd frontend && npm install \"",
    "start": "cd backend && npm start",
    "bulid": "concurrently \"cd backend && npm start\" \"cd frontend  && npm build\"",
    "test": "echo \"Error: no test specified\" && exit 1"