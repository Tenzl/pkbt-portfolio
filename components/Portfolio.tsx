"use client";

import { useState, useEffect, useRef, type RefObject, type ReactNode } from "react";
import Image from "next/image";
import ContactForm from "@/components/ContactForm";
import { ACTIVITIES, EXPERIENCES, STATS, type ExperienceItem } from "@/lib/content";

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
    <div className={`bezel-outer ${className}`}>
      <div className={`bezel-inner ${innerClassName}`}>{children}</div>
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
      className={`group inline-flex w-full items-center justify-center gap-3 rounded-full bg-[#ccff00] px-6 py-3 text-sm font-semibold text-black active:scale-[0.98] sm:w-auto ${EASE}`}
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
      <header className="fixed inset-x-0 top-0 z-30 flex justify-center px-3 pt-4 sm:px-4 sm:pt-6">
        <nav
          className={`flex w-full max-w-4xl items-center justify-between gap-3 rounded-full border border-white/10 bg-black/50 px-3 py-2 backdrop-blur-2xl sm:gap-4 sm:px-4 sm:py-2.5 md:px-6 ${EASE}`}
        >
          <a href="#home" className="text-base font-bold tracking-tight text-white sm:text-lg">
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
              className={`text-2xl font-semibold text-white sm:text-3xl ${EASE} ${menuOpen ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"}`}
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
        className="section-pad relative z-10 flex min-h-[100dvh] items-center pt-24 sm:pt-28 md:pt-32"
      >
        <div className="section-shell grid grid-cols-1 items-center gap-8 md:gap-10 lg:grid-cols-12 lg:gap-12 xl:gap-16">
          {/* Typography */}
          <div className="order-1 flex flex-col gap-5 sm:gap-6 lg:order-none lg:col-span-5 lg:gap-8">
            <Reveal>
              <Eyebrow>Portfolio</Eyebrow>
            </Reveal>

            <Reveal delay={80}>
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-white/40 sm:text-sm">
                Xin chào, tôi là
              </p>
              <h1 className="mt-2 text-4xl font-bold leading-[1.05] tracking-tight text-white sm:mt-3 sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl">
                Phạm Kim{" "}
                <span className="text-[#ccff00]">Bảo Trân</span>
              </h1>
              <p className="mt-3 text-xl font-medium text-white/80 sm:text-2xl md:text-3xl">
                Content Creator
              </p>
            </Reveal>

            <Reveal delay={160}>
              <p className="max-w-md text-sm leading-relaxed text-white/50 sm:text-base md:text-lg">
                <span className="md:hidden">
                  Trách nhiệm, giao tiếp tốt — kinh nghiệm CS, content và quản lý dữ liệu.
                </span>
                <span className="hidden md:inline">
                  Là một cá nhân có tinh thần trách nhiệm, tỉ mỉ với kỹ năng giao tiếp và
                  tổ chức tốt. Kinh nghiệm dịch vụ khách hàng, sáng tạo nội dung và quản lý
                  dữ liệu.
                </span>
              </p>
            </Reveal>

            <Reveal delay={240} className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
              <PrimaryButton href="#contact">Tuyển Dụng Tôi</PrimaryButton>
              <a
                href="#"
                className={`group inline-flex items-center justify-center gap-2 text-sm font-medium text-white/70 hover:text-[#ccff00] sm:justify-start ${EASE}`}
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

          {/* Portrait */}
          <div className="order-2 relative flex justify-center lg:order-none lg:col-span-4">
            <Reveal delay={120} className="relative w-full max-w-[260px] sm:max-w-[300px] md:max-w-[320px] lg:max-w-[340px]">
              <div
                className="pointer-events-none absolute inset-0 flex items-center justify-center"
                aria-hidden
              >
                <div
                  className="h-[240px] w-[240px] rounded-full opacity-35 sm:h-[300px] sm:w-[300px] md:h-[380px] md:w-[380px] md:opacity-40"
                  style={{
                    background:
                      "conic-gradient(from 180deg, rgba(204,255,0,0.35), transparent 55%, rgba(204,255,0,0.15))",
                  }}
                />
              </div>

              <div className="animate-float-soft relative z-10 mx-auto w-full">
                <Bezel innerClassName="overflow-hidden">
                  <div className="relative aspect-[3/4] overflow-hidden rounded-[calc(1.25rem-0.25rem)] sm:rounded-[calc(1.5rem-0.3rem)] md:rounded-[calc(2rem-0.375rem)]">
                    <Image
                      src="/portrait.png"
                      alt="Phạm Kim Bảo Trân"
                      fill
                      className="object-cover object-top"
                      priority
                      sizes="(max-width: 640px) 260px, (max-width: 1024px) 300px, 340px"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#050505]/80 via-transparent to-transparent" />
                  </div>
                </Bezel>
              </div>
            </Reveal>
          </div>

          {/* Stats — 3-col mobile, stack desktop-right */}
          <div className="order-3 grid grid-cols-3 gap-2 sm:gap-3 md:gap-4 lg:order-none lg:col-span-3 lg:grid-cols-1">
            {STATS.map((stat, i) => (
              <Reveal key={stat.value} delay={100 + i * 80}>
                <StatCard
                  value={stat.value}
                  label={stat.label}
                  labelShort={stat.labelShort}
                  large={i === 0}
                />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Experience */}
      <section id="experience" className="section-pad relative z-10">
        <div className="section-shell max-w-5xl">
          <SectionHeader title="Kinh Nghiệm" subtitle="Hành trình làm việc" />

          <div className="mt-10 space-y-6 sm:mt-12 sm:space-y-8 md:mt-16 md:space-y-10">
            {EXPERIENCES.map((exp, i) => (
              <ExperienceCard key={exp.company} {...exp} delay={i * 100} />
            ))}
          </div>
        </div>
      </section>

      {/* Skills — Bento */}
      <section id="skills" className="section-pad relative z-10">
        <div className="section-shell">
          <div className="grid grid-cols-1 gap-10 md:gap-12 lg:grid-cols-12 lg:gap-8">
            <div className="lg:col-span-5">
              <SectionHeader title="Kỹ Năng" subtitle="Công cụ & Ngoại ngữ" />

              <div className="mt-8 grid grid-cols-3 gap-2 sm:mt-10 sm:gap-3 md:grid-cols-3 md:gap-4">
                {TOOL_LOGOS.map((tool, i) => (
                  <SkillLogoTile
                    key={tool.src}
                    name={tool.name}
                    src={tool.src}
                    delay={i * 70}
                  />
                ))}
              </div>

              <div className="mt-6 flex flex-wrap gap-2 sm:mt-8 sm:gap-3">
                {SOFT_SKILLS.map((name, i) => (
                  <SkillBadge
                    key={name}
                    name={name}
                    delay={TOOL_LOGOS.length * 70 + i * 60}
                  />
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:col-span-7 lg:grid-cols-2 lg:gap-5">
              <Reveal className="md:col-span-2 lg:col-span-2">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Bezel innerClassName="p-5 sm:p-6 md:p-8">
                    <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-white/40">
                      Học vấn
                    </p>
                    <h4 className="mt-2 text-base font-bold leading-snug text-white sm:mt-3 sm:text-lg md:text-xl">
                      ĐH Ngân hàng TP.HCM
                    </h4>
                    <p className="mt-1.5 text-xs text-[#ccff00]/90 sm:mt-2 sm:text-sm">
                      <span className="md:hidden">Kinh doanh số</span>
                      <span className="hidden md:inline">Kinh tế & Kinh doanh số</span>
                    </p>
                  </Bezel>

                  <Bezel innerClassName="p-5 sm:p-6 md:p-8">
                    <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-white/40">
                      Ngoại ngữ
                    </p>
                    <div className="mt-2 flex items-start justify-between gap-3 sm:mt-3">
                      <div>
                        <h4 className="text-base font-bold text-white sm:text-lg md:text-xl">
                          IELTS 6.0
                        </h4>
                        <p className="mt-1 text-xs text-white/45 sm:mt-2 sm:text-sm">
                          Tiếng Pháp giao tiếp
                        </p>
                      </div>
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full ring-2 ring-[#ccff00]/40 text-base font-bold text-[#ccff00] sm:h-14 sm:w-14 sm:text-lg">
                        6.0
                      </div>
                    </div>
                  </Bezel>
                </div>
              </Reveal>

              <Reveal delay={120} className="md:col-span-2 lg:col-span-2">
                <SectionHeader title="Hoạt Động" subtitle="Ngoại khóa" />
              </Reveal>

              {ACTIVITIES.map((activity, i) => (
                <Reveal key={activity.titleFull} delay={80 + i * 80}>
                  <ActivityCard {...activity} />
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <footer id="contact" className="section-pad relative z-10">
        <div className="section-shell">
          <Reveal>
            <div className="mb-10 text-center sm:mb-12 md:mb-16 md:text-left">
              <Eyebrow>Kết nối</Eyebrow>
              <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:mt-6 sm:text-4xl md:text-5xl lg:text-6xl">
                <span className="md:hidden">
                  Bắt đầu <span className="text-[#ccff00]">dự án mới</span>
                </span>
                <span className="hidden md:inline">
                  Hãy bắt đầu
                  <br />
                  <span className="text-[#ccff00]">dự án mới</span>
                </span>
              </h2>
              <p className="mx-auto mt-3 max-w-lg text-sm text-white/45 sm:mt-4 sm:text-base md:mx-0">
                <span className="md:hidden">Form tuyển dụng hoặc liên hệ trực tiếp.</span>
                <span className="hidden md:inline">
                  Điền form tuyển dụng bên dưới hoặc liên hệ trực tiếp qua email / điện thoại.
                </span>
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 gap-8 md:gap-10 lg:grid-cols-12 lg:gap-10">
            <Reveal delay={80} className="lg:col-span-7">
              <ContactForm />
            </Reveal>

            <div className="flex flex-col gap-3 sm:gap-4 lg:col-span-5">
              <Reveal delay={160}>
                <ContactLink
                  href="mailto:pkbtran.onlyjob@gmail.com"
                  icon={<IconMail />}
                  label="pkbtran.onlyjob@gmail.com"
                  labelShort="Email"
                />
              </Reveal>
              <Reveal delay={240}>
                <ContactLink
                  href="tel:+84984002267"
                  icon={<IconPhone />}
                  label="(+84) 984 002 267"
                  labelShort="Gọi ngay"
                />
              </Reveal>
            </div>
          </div>

          <Reveal delay={240}>
            <div className="mt-12 flex flex-col items-center justify-between gap-6 border-t border-white/10 pt-8 sm:mt-16 sm:pt-10 md:mt-20 md:flex-row">
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
  labelShort,
  large = false,
}: {
  value: string;
  label: string;
  labelShort: string;
  large?: boolean;
}) {
  return (
    <Bezel innerClassName={`p-3 sm:p-5 md:p-6 ${large ? "lg:p-8" : ""}`}>
      <p
        className={`font-bold tracking-tight text-[#ccff00] ${large ? "text-2xl sm:text-4xl lg:text-5xl xl:text-6xl" : "text-xl sm:text-3xl lg:text-4xl"}`}
      >
        {value}
      </p>
      <p className="mt-1 text-[10px] leading-snug text-white/45 sm:mt-2 sm:text-xs md:text-sm">
        <span className="lg:hidden">{labelShort}</span>
        <span className="hidden lg:inline">{label}</span>
      </p>
    </Bezel>
  );
}

function SectionHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <Reveal>
      <Eyebrow>{subtitle}</Eyebrow>
      <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:mt-5 sm:text-4xl md:text-5xl">
        {title}
      </h2>
    </Reveal>
  );
}

function ExperienceCard({
  role,
  company,
  date,
  dateShort,
  points,
  pointsShort,
  delay,
}: ExperienceItem & { delay: number }) {
  return (
    <Reveal delay={delay}>
      <div className="group relative pl-5 sm:pl-6 md:pl-8">
        <div
          className={`absolute left-0 top-2 h-2.5 w-2.5 rounded-full bg-[#ccff00]/20 ring-2 ring-[#ccff00]/50 group-hover:bg-[#ccff00] sm:h-3 sm:w-3 ${EASE}`}
        />
        <Bezel innerClassName="p-5 sm:p-6 md:p-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
            <div className="min-w-0 flex-1">
              <h3
                className={`text-lg font-bold text-white group-hover:text-[#ccff00] sm:text-xl md:text-2xl ${EASE}`}
              >
                {role}
              </h3>
              <p className="mt-1 text-sm text-white/45 sm:text-base">{company}</p>
            </div>
            <span className="inline-flex w-fit shrink-0 rounded-full bg-white/[0.04] px-3 py-1 text-[10px] font-medium text-white/60 ring-1 ring-white/10 sm:px-4 sm:py-1.5 sm:text-xs">
              <span className="md:hidden">{dateShort}</span>
              <span className="hidden md:inline">{date}</span>
            </span>
          </div>
          <ul className="mt-5 space-y-3 sm:mt-6 sm:space-y-4 md:mt-8">
            {pointsShort.map((point, idx) => (
              <li
                key={`m-${idx}`}
                className="flex gap-2 text-xs leading-relaxed text-white/50 sm:gap-3 sm:text-sm md:hidden"
              >
                <span className="mt-0.5 shrink-0 text-[#ccff00]">
                  <IconChevron />
                </span>
                <span>{point}</span>
              </li>
            ))}
            {points.map((point, idx) => (
              <li
                key={`d-${idx}`}
                className="hidden gap-3 text-sm leading-relaxed text-white/50 md:flex"
              >
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
    <Reveal delay={delay} className="group flex flex-col gap-1.5 sm:gap-2 md:gap-3">
      <Bezel
        className={`${EASE} group-hover:ring-white/20`}
        innerClassName="flex aspect-square items-center justify-center border border-white/10 p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] sm:p-5 md:p-6 lg:p-8"
      >
        <div className="relative h-8 w-8 transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-110 sm:h-10 sm:w-10 md:h-12 md:w-12 lg:h-14 lg:w-14">
          <Image
            src={src}
            alt={name}
            fill
            unoptimized
            className="object-contain"
            sizes="(max-width: 640px) 32px, 56px"
          />
        </div>
      </Bezel>
      <p className="truncate text-center text-[9px] font-medium uppercase tracking-[0.1em] text-white/45 sm:text-[10px] md:text-[11px]">
        {name}
      </p>
    </Reveal>
  );
}

function SkillBadge({ name, delay }: { name: string; delay: number }) {
  return (
    <Reveal delay={delay}>
      <span
        className={`inline-block cursor-default rounded-full bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-white/70 ring-1 ring-white/10 hover:bg-[#ccff00] hover:text-black hover:ring-[#ccff00]/30 active:scale-[0.98] sm:px-4 sm:py-2 sm:text-sm md:px-5 md:py-2.5 ${EASE}`}
      >
        {name}
      </span>
    </Reveal>
  );
}

function ActivityCard({
  title,
  titleFull,
  org,
  orgFull,
  description,
  descriptionFull,
  accent = false,
}: {
  title: string;
  titleFull: string;
  org: string;
  orgFull: string;
  description: string;
  descriptionFull: string;
  accent?: boolean;
}) {
  return (
    <Bezel
      className="h-full"
      innerClassName={`p-5 sm:p-6 ${accent ? "ring-1 ring-[#ccff00]/20" : ""}`}
    >
      <h4 className="text-base font-bold text-white sm:text-lg">
        <span className="md:hidden">{title}</span>
        <span className="hidden md:inline">{titleFull}</span>
      </h4>
      <p className="mt-1.5 text-[10px] font-medium uppercase tracking-wider text-[#ccff00]/80 sm:mt-2 sm:text-xs">
        <span className="md:hidden">{org}</span>
        <span className="hidden md:inline">{orgFull}</span>
      </p>
      <p className="mt-3 text-xs leading-relaxed text-white/45 sm:mt-4 sm:text-sm">
        <span className="md:hidden">{description}</span>
        <span className="hidden md:inline">{descriptionFull}</span>
      </p>
    </Bezel>
  );
}

function ContactLink({
  href,
  icon,
  label,
  labelShort,
}: {
  href: string;
  icon: ReactNode;
  label: string;
  labelShort: string;
}) {
  return (
    <a href={href} className={`group block active:scale-[0.99] ${EASE}`}>
      <Bezel innerClassName="flex items-center gap-3 p-4 sm:gap-4 sm:p-5 md:p-6">
        <span
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#ccff00]/10 text-[#ccff00] group-hover:scale-105 sm:h-11 sm:w-11 ${EASE}`}
        >
          {icon}
        </span>
        <span className="min-w-0 flex-1 text-sm font-medium text-white/80 group-hover:text-white sm:text-base">
          <span className="md:hidden">{labelShort}</span>
          <span className="hidden break-all md:inline">{label}</span>
        </span>
        <span
          className={`hidden h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/5 opacity-0 group-hover:translate-x-0.5 group-hover:-translate-y-px group-hover:opacity-100 sm:flex ${EASE}`}
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
