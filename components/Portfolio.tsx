"use client";

import { useState, useEffect, useRef, type RefObject, type ReactNode } from "react";
import Image from "next/image";
import ContactForm from "@/components/ContactForm";

const EASE =
  "transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]";
const ACCENT = "#ccff00";

const NAV_LINKS = [
  { href: "#home", label: "Trang chủ" },
  { href: "#experience", label: "Kinh nghiệm" },
  { href: "#skills", label: "Kỹ năng" },
  { href: "#contact", label: "Liên hệ" },
];

const TOOL_LOGOS = [
  { name: "Canva", src: "/canva.svg" },
  { name: "Photoshop", src: "/adobe.svg" },
  { name: "Google Workspace", src: "/google-workspace-seeklogo.svg" },
  { name: "ElevenLabs", src: "/elevenlabs-seeklogo.svg" },
  { name: "Claude", src: "/claude.svg" },
  { name: "Higgsfield", src: "/higgsfield-seeklogo.svg" },
] as const;

const SOFT_SKILLS = [
  "Quản lý Cộng đồng",
  "Facebook Ads",
  "Chăm sóc Khách hàng",
] as const;

// --- Ultra-light inline icons (no Lucide) ---

function IconArrow({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25">
      <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconDownload({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25">
      <path d="M12 3v12M8 11l4 4 4-4M5 21h14" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconMail({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 7l9 6 9-6" strokeLinecap="round" />
    </svg>
  );
}

function IconPhone({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25">
      <path d="M6.5 4.5c2.8 5.2 7.8 10.2 13 13l2-3.5a1 1 0 011-.35c1.2.4 2.5.6 3.8.6a1 1 0 011 1V20a1 1 0 01-1 1C10.4 21 3 13.6 3 4a1 1 0 011-1h4.2a1 1 0 011 1c0 1.3.2 2.6.6 3.8a1 1 0 01-.35 1L6.5 4.5z" strokeLinecap="round" />
    </svg>
  );
}

function IconLinkedIn({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25">
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <path d="M8 11v5M8 8v.01M12 16v-3a2 2 0 014 0v3" strokeLinecap="round" />
    </svg>
  );
}

function IconExternal({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25">
      <path d="M7 17L17 7M9 7h8v8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconChevron({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25">
      <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// --- Hooks & primitives ---

function useReveal<T extends HTMLElement>(
  options: IntersectionObserverInit = { threshold: 0.12 }
): [RefObject<T | null>, boolean] {
  const [visible, setVisible] = useState(false);
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setVisible(true);
        observer.disconnect();
      }
    }, options);

    observer.observe(node);
    return () => observer.disconnect();
  }, [options]);

  return [ref, visible];
}

function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const [ref, visible] = useReveal<HTMLDivElement>();

  return (
    <div
      ref={ref}
      className={`reveal ${visible ? "is-visible" : ""} ${className}`}
      style={{ transitionDelay: visible ? `${delay}ms` : "0ms" }}
    >
      {children}
    </div>
  );
}

function Bezel({
  children,
  className = "",
  innerClassName = "",
}: {
  children: ReactNode;
  className?: string;
  innerClassName?: string;
}) {
  return (
    <div
      className={`rounded-[2rem] bg-white/[0.04] p-1.5 ring-1 ring-white/10 ${className}`}
    >
      <div
        className={`rounded-[calc(2rem-0.375rem)] bg-[#0a0a0c] shadow-[inset_0_1px_1px_rgba(255,255,255,0.08)] ${innerClassName}`}
      >
        {children}
      </div>
    </div>
  );
}

function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex w-fit items-center rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[10px] font-medium uppercase tracking-[0.2em] text-[#ccff00]">
      {children}
    </span>
  );
}

function PrimaryButton({
  href,
  children,
  icon = "arrow",
}: {
  href: string;
  children: ReactNode;
  icon?: "arrow" | "download";
}) {
  const Icon = icon === "download" ? IconDownload : IconArrow;

  return (
    <a
      href={href}
      className={`group inline-flex items-center gap-3 rounded-full bg-[#ccff00] px-6 py-3 text-sm font-semibold text-black active:scale-[0.98] ${EASE}`}
    >
      <span>{children}</span>
      <span
        className={`flex h-8 w-8 items-center justify-center rounded-full bg-black/10 group-hover:translate-x-0.5 group-hover:-translate-y-px group-hover:scale-105 ${EASE}`}
      >
        <Icon className="w-3.5 h-3.5" />
      </span>
    </a>
  );
}

// --- Main ---

export default function Portfolio() {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <div className="relative min-h-[100dvh] overflow-x-hidden bg-[#050505] text-[#a3a3a8] selection:bg-[#ccff00] selection:text-black">
      <div className="noise-overlay" aria-hidden />

      {/* Mesh gradients */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden>
        <div
          className="animate-mesh-drift absolute -left-[20%] top-[10%] h-[55vh] w-[55vh] rounded-full opacity-30"
          style={{
            background:
              "radial-gradient(circle, rgba(204,255,0,0.18) 0%, transparent 70%)",
          }}
        />
        <div
          className="animate-mesh-drift absolute -right-[15%] bottom-[5%] h-[50vh] w-[50vh] rounded-full opacity-20"
          style={{
            background:
              "radial-gradient(circle, rgba(120,255,180,0.12) 0%, transparent 70%)",
            animationDelay: "-6s",
          }}
        />
      </div>

      {/* Floating island nav */}
      <header className="fixed inset-x-0 top-0 z-30 flex justify-center px-4 pt-6">
        <nav
          className={`flex w-full max-w-4xl items-center justify-between gap-4 rounded-full border border-white/10 bg-black/50 px-4 py-2.5 backdrop-blur-2xl md:px-6 ${EASE}`}
        >
          <a href="#home" className="text-lg font-bold tracking-tight text-white">
            Bảo<span style={{ color: ACCENT }}>Trân</span>
          </a>

          <div className="hidden items-center gap-8 md:flex">
            {NAV_LINKS.slice(0, 3).map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`text-xs font-medium uppercase tracking-[0.15em] text-white/60 hover:text-white ${EASE}`}
              >
                {link.label}
              </a>
            ))}
            <a
              href="#contact"
              className={`rounded-full border border-white/15 px-4 py-2 text-xs font-medium text-white hover:border-[#ccff00]/50 hover:text-[#ccff00] ${EASE}`}
            >
              Liên hệ
            </a>
          </div>

          <button
            type="button"
            aria-label={menuOpen ? "Đóng menu" : "Mở menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((o) => !o)}
            className="relative flex h-10 w-10 items-center justify-center rounded-full bg-white/5 md:hidden"
          >
            <span
              className={`absolute block h-px w-5 bg-white ${EASE} ${menuOpen ? "translate-y-0 rotate-45" : "-translate-y-1.5"}`}
            />
            <span
              className={`absolute block h-px w-5 bg-white ${EASE} ${menuOpen ? "scale-x-0 opacity-0" : ""}`}
            />
            <span
              className={`absolute block h-px w-5 bg-white ${EASE} ${menuOpen ? "translate-y-0 -rotate-45" : "translate-y-1.5"}`}
            />
          </button>
        </nav>
      </header>

      {/* Mobile menu overlay */}
      <div
        className={`fixed inset-0 z-20 flex flex-col items-center justify-center backdrop-blur-3xl bg-black/85 md:hidden ${EASE} ${menuOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"}`}
        aria-hidden={!menuOpen}
      >
        <nav className="flex flex-col items-center gap-2">
          {NAV_LINKS.map((link, i) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className={`text-3xl font-semibold text-white ${EASE} ${menuOpen ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"}`}
              style={{
                transitionDelay: menuOpen ? `${100 + i * 80}ms` : "0ms",
              }}
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>

      {/* Hero — Editorial Split */}
      <section
        id="home"
        className="relative z-10 flex min-h-[100dvh] items-center px-4 pb-16 pt-28 md:px-8 md:pt-32"
      >
        <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Left: typography */}
          <div className="flex flex-col gap-8 lg:col-span-5">
            <Reveal>
              <Eyebrow>Portfolio 2026</Eyebrow>
            </Reveal>

            <Reveal delay={80}>
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-white/40">
                Xin chào, tôi là
              </p>
              <h1 className="mt-3 text-5xl font-bold leading-[1.05] tracking-tight text-white md:text-7xl lg:text-8xl">
                Phạm Kim
                <br />
                <span className="text-[#ccff00]">Bảo Trân</span>
              </h1>
              <p className="mt-4 text-2xl font-medium text-white/80 md:text-3xl">
                Content Creator
              </p>
            </Reveal>

            <Reveal delay={160}>
              <p className="max-w-md text-base leading-relaxed text-white/50 md:text-lg">
                Là một cá nhân có tinh thần trách nhiệm, tỉ mỉ với kỹ năng giao tiếp và
                tổ chức tốt. Tôi có kinh nghiệm xử lý dịch vụ khách hàng, sáng tạo nội
                dung và đảm bảo độ chính xác của dữ liệu.
              </p>
            </Reveal>

            <Reveal delay={240} className="flex flex-wrap items-center gap-4">
              <PrimaryButton href="#contact">Tuyển Dụng Tôi</PrimaryButton>
              <a
                href="#"
                className={`group inline-flex items-center gap-2 text-sm font-medium text-white/70 hover:text-[#ccff00] ${EASE}`}
              >
                Tải CV
                <span
                  className={`flex h-7 w-7 items-center justify-center rounded-full ring-1 ring-white/10 group-hover:ring-[#ccff00]/40 ${EASE}`}
                >
                  <IconDownload />
                </span>
              </a>
            </Reveal>
          </div>

          {/* Center: portrait with double-bezel */}
          <div className="relative flex justify-center lg:col-span-4">
            <Reveal delay={120} className="relative">
              <div
                className="pointer-events-none absolute inset-0 flex items-center justify-center"
                aria-hidden
              >
                <div
                  className="h-[320px] w-[320px] rounded-full opacity-40 md:h-[420px] md:w-[420px]"
                  style={{
                    background:
                      "conic-gradient(from 180deg, rgba(204,255,0,0.35), transparent 55%, rgba(204,255,0,0.15))",
                  }}
                />
              </div>

              <div className="animate-float-soft relative z-10">
                <Bezel
                  className="mx-auto w-[min(100%,300px)] md:w-[340px]"
                  innerClassName="overflow-hidden"
                >
                  <div className="relative aspect-[3/4] overflow-hidden rounded-[calc(2rem-0.375rem)]">
                    <Image
                      src="/portrait.png"
                      alt="Phạm Kim Bảo Trân"
                      fill
                      className="object-cover object-top rounded-[calc(2rem-0.375rem)]"
                      priority
                      sizes="(max-width: 768px) 300px, 340px"
                    />
                    <div className="pointer-events-none absolute inset-0 rounded-[calc(2rem-0.375rem)] bg-gradient-to-t from-[#050505]/80 via-transparent to-transparent" />
                  </div>
                </Bezel>
              </div>
            </Reveal>
          </div>

          {/* Right: Bento stats */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:col-span-3 lg:grid-cols-1">
            <Reveal delay={100}>
              <StatCard value="129K+" label="Người theo dõi Fanpage" large />
            </Reveal>
            <Reveal delay={180}>
              <StatCard value="4+" label="Năm kinh nghiệm (2020 — Nay)" />
            </Reveal>
            <Reveal delay={260}>
              <StatCard value="3+" label="Vị trí (Admin, CS, Content)" />
            </Reveal>
          </div>
        </div>
      </section>

      {/* Experience */}
      <section id="experience" className="relative z-10 py-28 md:py-40">
        <div className="mx-auto max-w-5xl px-4 md:px-8">
          <SectionHeader title="Kinh Nghiệm" subtitle="Hành trình làm việc" />

          <div className="mt-16 space-y-10">
            <ExperienceCard
              role="Admin Fanpage & Content Creator"
              company="Fanpage Cua Kì Cục (#Rìu)"
              date="Tháng 3/2020 — Hiện tại"
              points={[
                "Phân tích dữ liệu tương tác sự kiện eSports cho fanpage 129k followers, tăng 35% lượt tiếp cận trung bình.",
                "Tổ chức và điều hành các giải đấu/sự kiện Esport (Trọng tài).",
                "Phối hợp với team Marketing xây dựng truyền thông CLB. Thiết lập 4 chiến dịch Facebook Ads đạt tương tác khủng.",
              ]}
              delay={0}
            />
            <ExperienceCard
              role="Customer Service Management Intern"
              company="Timo Digital Bank by BVBank"
              date="Tháng 12/2024 — Tháng 7/2025"
              points={[
                "Kiểm tra và xử lý yêu cầu khách hàng đa nền tảng.",
                "Thẩm định, duyệt hồ sơ mở tài khoản, xác minh tính xác thực của tài liệu (chống gian lận).",
                "Đánh giá và phê duyệt xác thực sinh trắc học trực tuyến.",
              ]}
              delay={100}
            />
            <ExperienceCard
              role="Content Creator Online"
              company="VOCO Center by Huyền Lưu Amon"
              date="Tháng 3/2024 — Tháng 6/2024"
              points={[
                "Phát triển và triển khai các bài đăng truyền thông (Nội dung & Thiết kế).",
                "Nghiên cứu và đẩy mạnh tương tác để mở rộng độ nhận diện.",
                "Kiểm chứng thông tin và xử lý các vấn đề truyền thông trực tuyến tiềm ẩn.",
              ]}
              delay={200}
            />
          </div>
        </div>
      </section>

      {/* Skills — Asymmetrical Bento */}
      <section id="skills" className="relative z-10 py-28 md:py-40">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-8">
            <div className="lg:col-span-5">
              <SectionHeader title="Kỹ Năng" subtitle="Công cụ & Ngoại ngữ" />

              <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3">
                {TOOL_LOGOS.map((tool, i) => (
                  <SkillLogoTile
                    key={tool.src}
                    name={tool.name}
                    src={tool.src}
                    delay={i * 70}
                  />
                ))}
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                {SOFT_SKILLS.map((name, i) => (
                  <SkillBadge
                    key={name}
                    name={name}
                    delay={TOOL_LOGOS.length * 70 + i * 60}
                  />
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:col-span-7 lg:grid-cols-6">
              <Reveal className="sm:col-span-2 lg:col-span-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Bezel innerClassName="p-6 md:p-8">
                    <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-white/40">
                      Học vấn
                    </p>
                    <h4 className="mt-3 text-lg font-bold leading-snug text-white md:text-xl">
                      Đại học Ngân hàng TP.HCM
                    </h4>
                    <p className="mt-2 text-sm text-[#ccff00]/90">
                      Kinh tế & Kinh doanh số
                    </p>
                  </Bezel>

                  <Bezel innerClassName="p-6 md:p-8">
                    <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-white/40">
                      Ngoại ngữ
                    </p>
                    <div className="mt-3 flex items-start justify-between gap-4">
                      <div>
                        <h4 className="text-lg font-bold text-white md:text-xl">IELTS 6.0</h4>
                        <p className="mt-2 text-sm text-white/45">Tiếng Pháp giao tiếp</p>
                      </div>
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full ring-2 ring-[#ccff00]/40 text-lg font-bold text-[#ccff00]">
                        6.0
                      </div>
                    </div>
                  </Bezel>
                </div>
              </Reveal>

              <Reveal delay={120} className="sm:col-span-2 lg:col-span-6">
                <SectionHeader title="Hoạt Động" subtitle="Ngoại khóa" />
              </Reveal>

              <Reveal delay={80} className="sm:col-span-1 lg:col-span-3">
                <ActivityCard
                  title="Thành viên Ban Sự kiện & Nội dung"
                  org="Khoa Kinh tế Quốc tế (HUB) • 11/2022 — 11/2024"
                  description="Tổ chức talkshow, workshop. Lên timeline sự kiện, dịch thuật Anh-Việt, viết email tài trợ, làm MC và xử lý sự cố hiện trường."
                  accent
                />
              </Reveal>

              <Reveal delay={160} className="sm:col-span-1 lg:col-span-3">
                <ActivityCard
                  title="Thành viên Ban Kỹ thuật"
                  org="ISH HUB Club • 09/2023 — 04/2024"
                  description="Vận hành giải đấu TFT, Cờ vua, Liên Quân. Trợ lý trọng tài và soạn thảo luật thi đấu cho giải Cờ vua HUB."
                />
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <footer id="contact" className="relative z-10 py-28 md:py-40">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <Reveal>
            <div className="mb-16 text-center md:text-left">
              <Eyebrow>Kết nối</Eyebrow>
              <h2 className="mt-6 text-4xl font-bold tracking-tight text-white md:text-5xl lg:text-6xl">
                Hãy bắt đầu
                <br />
                <span className="text-[#ccff00]">dự án mới</span>
              </h2>
              <p className="mt-4 max-w-lg text-white/45">
                Điền form tuyển dụng bên dưới hoặc liên hệ trực tiếp qua email / điện thoại.
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-10">
            <Reveal delay={80} className="lg:col-span-7">
              <ContactForm />
            </Reveal>

            <div className="flex flex-col gap-4 lg:col-span-5">
              <Reveal delay={160}>
                <ContactLink
                  href="mailto:pkbtran.onlyjob@gmail.com"
                  icon={<IconMail />}
                  label="pkbtran.onlyjob@gmail.com"
                />
              </Reveal>
              <Reveal delay={240}>
                <ContactLink
                  href="tel:+84984002267"
                  icon={<IconPhone />}
                  label="(+84) 984 002 267"
                />
              </Reveal>
            </div>
          </div>

          <Reveal delay={240}>
            <div className="mt-20 flex flex-col items-center justify-between gap-6 border-t border-white/10 pt-10 md:flex-row">
              <p className="text-xs uppercase tracking-[0.15em] text-white/35">
                © 2026 Phạm Kim Bảo Trân
              </p>
              <div className="flex gap-3">
                <SocialLink
                  href="https://www.linkedin.com/in/phamkimbaotran/"
                  icon={<IconLinkedIn />}
                  label="LinkedIn"
                />
                <SocialLink
                  href="https://chuotbu.my.canva.site/phamkimbaotran"
                  icon={<IconExternal />}
                  label="Portfolio Canva"
                />
              </div>
            </div>
          </Reveal>
        </div>
      </footer>
    </div>
  );
}

// --- Subcomponents ---

function StatCard({
  value,
  label,
  large = false,
}: {
  value: string;
  label: string;
  large?: boolean;
}) {
  return (
    <Bezel innerClassName={`p-6 ${large ? "md:p-8" : ""}`}>
      <p
        className={`font-bold tracking-tight text-[#ccff00] ${large ? "text-5xl md:text-6xl" : "text-4xl"}`}
      >
        {value}
      </p>
      <p className="mt-2 text-sm leading-snug text-white/45">{label}</p>
    </Bezel>
  );
}

function SectionHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <Reveal>
      <Eyebrow>{subtitle}</Eyebrow>
      <h2 className="mt-5 text-4xl font-bold tracking-tight text-white md:text-5xl">
        {title}
      </h2>
    </Reveal>
  );
}

function ExperienceCard({
  role,
  company,
  date,
  points,
  delay,
}: {
  role: string;
  company: string;
  date: string;
  points: string[];
  delay: number;
}) {
  return (
    <Reveal delay={delay}>
      <div className="group relative pl-6 md:pl-8">
        <div
          className={`absolute left-0 top-2 h-3 w-3 rounded-full bg-[#ccff00]/20 ring-2 ring-[#ccff00]/50 group-hover:bg-[#ccff00] ${EASE}`}
        />
        <Bezel innerClassName="p-6 md:p-8">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
            <div>
              <h3
                className={`text-xl font-bold text-white group-hover:text-[#ccff00] md:text-2xl ${EASE}`}
              >
                {role}
              </h3>
              <p className="mt-1 text-base text-white/45">{company}</p>
            </div>
            <span className="inline-flex w-fit shrink-0 rounded-full bg-white/[0.04] px-4 py-1.5 text-xs font-medium text-white/60 ring-1 ring-white/10">
              {date}
            </span>
          </div>
          <ul className="mt-8 space-y-4">
            {points.map((point, idx) => (
              <li key={idx} className="flex gap-3 text-sm leading-relaxed text-white/50">
                <span className="mt-0.5 shrink-0 text-[#ccff00]">
                  <IconChevron />
                </span>
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </Bezel>
      </div>
    </Reveal>
  );
}

function SkillLogoTile({
  name,
  src,
  delay,
}: {
  name: string;
  src: string;
  delay: number;
}) {
  return (
    <Reveal delay={delay} className="group flex flex-col gap-3">
      <Bezel
        className={`${EASE} group-hover:ring-white/20`}
        innerClassName="flex aspect-square items-center justify-center border border-white/10 p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] md:p-8"
      >
        <div className="relative h-11 w-11 transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-110 md:h-14 md:w-14">
          <Image
            src={src}
            alt={name}
            fill
            unoptimized
            className="object-contain"
            sizes="56px"
          />
        </div>
      </Bezel>
      <p className="text-center text-[11px] font-medium uppercase tracking-[0.12em] text-white/45">
        {name}
      </p>
    </Reveal>
  );
}

function SkillBadge({ name, delay }: { name: string; delay: number }) {
  return (
    <Reveal delay={delay}>
      <span
        className={`inline-block cursor-default rounded-full bg-white/[0.04] px-5 py-2.5 text-sm font-medium text-white/70 ring-1 ring-white/10 hover:bg-[#ccff00] hover:text-black hover:ring-[#ccff00]/30 active:scale-[0.98] ${EASE}`}
      >
        {name}
      </span>
    </Reveal>
  );
}

function ActivityCard({
  title,
  org,
  description,
  accent = false,
}: {
  title: string;
  org: string;
  description: string;
  accent?: boolean;
}) {
  return (
    <Bezel
      className="h-full"
      innerClassName={`p-6 ${accent ? "ring-1 ring-[#ccff00]/20" : ""}`}
    >
      <h4 className="text-lg font-bold text-white">{title}</h4>
      <p className="mt-2 text-xs font-medium uppercase tracking-wider text-[#ccff00]/80">
        {org}
      </p>
      <p className="mt-4 text-sm leading-relaxed text-white/45">{description}</p>
    </Bezel>
  );
}

function ContactLink({
  href,
  icon,
  label,
}: {
  href: string;
  icon: ReactNode;
  label: string;
}) {
  return (
    <a href={href} className={`group block active:scale-[0.99] ${EASE}`}>
      <Bezel innerClassName="flex items-center gap-4 p-5 md:p-6">
        <span
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#ccff00]/10 text-[#ccff00] group-hover:scale-105 ${EASE}`}
        >
          {icon}
        </span>
        <span className="text-sm font-medium text-white/80 group-hover:text-white md:text-base">
          {label}
        </span>
        <span
          className={`ml-auto flex h-8 w-8 items-center justify-center rounded-full bg-white/5 opacity-0 group-hover:translate-x-0.5 group-hover:-translate-y-px group-hover:opacity-100 ${EASE}`}
        >
          <IconArrow className="w-3.5 h-3.5" />
        </span>
      </Bezel>
    </a>
  );
}

function SocialLink({
  href,
  icon,
  label,
}: {
  href: string;
  icon: ReactNode;
  label: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      className={`flex h-11 w-11 items-center justify-center rounded-full bg-white/[0.04] text-white/60 ring-1 ring-white/10 hover:bg-[#ccff00] hover:text-black hover:ring-[#ccff00]/40 active:scale-[0.95] ${EASE}`}
    >
      {icon}
    </a>
  );
}
