export type ExperienceItem = {
  role: string;
  company: string;
  date: string;
  dateShort: string;
  points: string[];
  pointsShort: string[];
};

export const EXPERIENCES: ExperienceItem[] = [
  {
    role: "Admin Fanpage & Content Creator",
    company: "Fanpage Cua Kì Cục (#Rìu)",
    date: "Tháng 3/2020 — Hiện tại",
    dateShort: "03/2020 — Nay",
    points: [
      "Phân tích dữ liệu tương tác sự kiện eSports cho fanpage 129k followers, tăng 35% lượt tiếp cận trung bình.",
      "Tổ chức và điều hành các giải đấu/sự kiện Esport (Trọng tài).",
      "Phối hợp team Marketing, thiết lập 4 chiến dịch Facebook Ads đạt tương tác cao.",
    ],
    pointsShort: [
      "Phân tích dữ liệu fanpage 129K+, tăng 35% tiếp cận.",
      "Tổ chức giải Esport, trọng tài & truyền thông CLB.",
      "4 chiến dịch Facebook Ads hiệu quả.",
    ],
  },
  {
    role: "Customer Service Management Intern",
    company: "Timo Digital Bank by BVBank",
    date: "Tháng 12/2024 — Tháng 7/2025",
    dateShort: "12/2024 — 07/2025",
    points: [
      "Kiểm tra và xử lý yêu cầu khách hàng đa nền tảng.",
      "Thẩm định, duyệt hồ sơ mở tài khoản, xác minh tài liệu (chống gian lận).",
      "Đánh giá và phê duyệt xác thực sinh trắc học trực tuyến.",
    ],
    pointsShort: [
      "Xử lý yêu cầu khách hàng đa nền tảng.",
      "Thẩm định hồ sơ mở tài khoản, chống gian lận.",
      "Phê duyệt xác thực sinh trắc học.",
    ],
  },
  {
    role: "Content Creator Online",
    company: "VOCO Center by Huyền Lưu Amon",
    date: "Tháng 3/2024 — Tháng 6/2024",
    dateShort: "03/2024 — 06/2024",
    points: [
      "Phát triển và triển khai các bài đăng truyền thông (Nội dung & Thiết kế).",
      "Nghiên cứu và đẩy mạnh tương tác để mở rộng độ nhận diện.",
      "Kiểm chứng thông tin và xử lý vấn đề truyền thông trực tuyến.",
    ],
    pointsShort: [
      "Sáng tạo nội dung & thiết kế bài đăng.",
      "Tăng tương tác, mở rộng nhận diện thương hiệu.",
      "Kiểm chứng thông tin truyền thông.",
    ],
  },
];

export const ACTIVITIES = [
  {
    title: "Ban Sự kiện & Nội dung",
    titleFull: "Thành viên Ban Sự kiện & Nội dung",
    org: "HUB • 11/2022 — 11/2024",
    orgFull: "Khoa Kinh tế Quốc tế (HUB) • 11/2022 — 11/2024",
    description:
      "Tổ chức talkshow, workshop. Timeline sự kiện, dịch thuật, email tài trợ, MC và xử lý sự cố.",
    descriptionFull:
      "Tổ chức talkshow, workshop. Lên timeline sự kiện, dịch thuật Anh-Việt, viết email tài trợ, làm MC và xử lý sự cố hiện trường.",
    accent: true,
  },
  {
    title: "Ban Kỹ thuật",
    titleFull: "Thành viên Ban Kỹ thuật",
    org: "ISH HUB • 09/2023 — 04/2024",
    orgFull: "ISH HUB Club • 09/2023 — 04/2024",
    description:
      "Vận hành giải TFT, Cờ vua, Liên Quân. Trợ lý trọng tài, soạn luật thi đấu.",
    descriptionFull:
      "Vận hành giải đấu TFT, Cờ vua, Liên Quân. Trợ lý trọng tài và soạn thảo luật thi đấu cho giải Cờ vua HUB.",
    accent: false,
  },
] as const;

export const STATS = [
  { value: "129K+", label: "Followers Fanpage", labelShort: "Followers" },
  { value: "4+", label: "Năm kinh nghiệm (2020 — Nay)", labelShort: "Năm KN" },
  { value: "3+", label: "Vị trí (Admin, CS, Content)", labelShort: "Vị trí" },
] as const;
