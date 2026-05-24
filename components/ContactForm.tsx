"use client";

import { useState, type FormEvent } from "react";

const EASE =
  "transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]";

type FormData = {
  fullName: string;
  jobTitle: string;
  jdLink: string;
  phone: string;
  email: string;
};

type FormErrors = Partial<Record<keyof FormData, string>>;

const INITIAL: FormData = {
  fullName: "",
  jobTitle: "",
  jdLink: "",
  phone: "",
  email: "",
};

function IconSend({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25">
      <path d="M4 12h14M14 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function FormField({
  id,
  label,
  type = "text",
  placeholder,
  value,
  error,
  onChange,
  required,
}: {
  id: keyof FormData;
  label: string;
  type?: string;
  placeholder: string;
  value: string;
  error?: string;
  onChange: (value: string) => void;
  required?: boolean;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-[11px] font-medium uppercase tracking-[0.15em] text-white/45">
        {label}
        {required && <span className="text-[#ccff00]"> *</span>}
      </label>
      <div className="rounded-[1.25rem] bg-white/[0.04] p-1 ring-1 ring-white/10">
        <input
          id={id}
          name={id}
          type={type}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full rounded-[calc(1.25rem-0.25rem)] bg-[#0a0a0c] px-4 py-3.5 text-sm text-white placeholder:text-white/25 shadow-[inset_0_1px_1px_rgba(255,255,255,0.06)] outline-none focus:ring-1 focus:ring-[#ccff00]/40 ${EASE}`}
        />
      </div>
      {error && (
        <p className="text-xs text-red-400/90" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

export default function ContactForm() {
  const [form, setForm] = useState<FormData>(INITIAL);
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [serverError, setServerError] = useState("");

  const update = (key: keyof FormData) => (value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
    if (status === "error") setStatus("idle");
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setServerError("");
    setStatus("loading");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = (await res.json()) as {
        errors?: FormErrors;
        error?: string;
        success?: boolean;
      };

      if (!res.ok) {
        if (data.errors) {
          setErrors(data.errors);
          setStatus("idle");
          return;
        }
        setServerError(data.error ?? "Gửi thất bại. Vui lòng thử lại.");
        setStatus("error");
        return;
      }

      setForm(INITIAL);
      setErrors({});
      setStatus("success");
    } catch {
      setServerError("Không thể kết nối máy chủ. Vui lòng thử lại.");
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="rounded-[2rem] bg-white/[0.04] p-1.5 ring-1 ring-white/10">
        <div className="rounded-[calc(2rem-0.375rem)] bg-[#0a0a0c] px-8 py-14 text-center shadow-[inset_0_1px_1px_rgba(255,255,255,0.08)]">
          <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-[#ccff00]/15 ring-1 ring-[#ccff00]/30">
            <svg className="h-6 w-6 text-[#ccff00]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold tracking-tight text-white">Đã gửi thành công</h3>
          <p className="mt-3 text-sm leading-relaxed text-white/45">
            Cảm ơn bạn. Thông tin tuyển dụng đã được chuyển tới{" "}
            <span className="text-[#ccff00]/90">pkbtran.onlyjob@gmail.com</span>.
          </p>
          <button
            type="button"
            onClick={() => setStatus("idle")}
            className={`mt-8 rounded-full border border-white/15 px-6 py-2.5 text-xs font-medium uppercase tracking-[0.15em] text-white/60 hover:border-[#ccff00]/40 hover:text-[#ccff00] ${EASE}`}
          >
            Gửi thêm
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="rounded-[2rem] bg-white/[0.04] p-1.5 ring-1 ring-white/10">
        <div className="rounded-[calc(2rem-0.375rem)] bg-[#0a0a0c] p-6 shadow-[inset_0_1px_1px_rgba(255,255,255,0.08)] md:p-10">
          <div className="mb-8">
            <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-[#ccff00]">
              Tuyển dụng
            </p>
            <h3 className="mt-3 text-2xl font-bold tracking-tight text-white md:text-3xl">
              Gửi thông tin liên hệ
            </h3>
            <p className="mt-2 text-sm text-white/40">
              Điền form bên dưới — thông tin sẽ được gửi trực tiếp qua email.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <FormField
              id="fullName"
              label="Họ tên"
              placeholder="Nguyễn Văn A"
              value={form.fullName}
              error={errors.fullName}
              onChange={update("fullName")}
              required
            />
            <FormField
              id="jobTitle"
              label="Job title"
              placeholder="Content Creator"
              value={form.jobTitle}
              error={errors.jobTitle}
              onChange={update("jobTitle")}
              required
            />
            <FormField
              id="jdLink"
              label="Link JD"
              type="url"
              placeholder="https://..."
              value={form.jdLink}
              error={errors.jdLink}
              onChange={update("jdLink")}
            />
            <FormField
              id="phone"
              label="Số điện thoại"
              type="tel"
              placeholder="(+84) 984 002 267"
              value={form.phone}
              error={errors.phone}
              onChange={update("phone")}
              required
            />
            <div className="md:col-span-2">
              <FormField
                id="email"
                label="Email"
                type="email"
                placeholder="recruiter@company.com"
                value={form.email}
                error={errors.email}
                onChange={update("email")}
                required
              />
            </div>
          </div>

          {serverError && (
            <p className="mt-6 rounded-[1rem] bg-red-500/10 px-4 py-3 text-sm text-red-300 ring-1 ring-red-500/20" role="alert">
              {serverError}
            </p>
          )}

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <button
              type="submit"
              disabled={status === "loading"}
              className={`group inline-flex items-center gap-3 rounded-full bg-[#ccff00] px-6 py-3 text-sm font-semibold text-black active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 ${EASE}`}
            >
              <span>{status === "loading" ? "Đang gửi..." : "Gửi thông tin"}</span>
              <span
                className={`flex h-8 w-8 items-center justify-center rounded-full bg-black/10 group-hover:translate-x-0.5 group-hover:-translate-y-px group-hover:scale-105 group-disabled:translate-x-0 group-disabled:scale-100 ${EASE}`}
              >
                {status === "loading" ? (
                  <span className="h-3.5 w-3.5 animate-pulse rounded-full bg-black/30" />
                ) : (
                  <IconSend />
                )}
              </span>
            </button>
            <p className="text-xs text-white/30">
              Gửi tới{" "}
              <span className="text-white/50">pkbtran.onlyjob@gmail.com</span>
            </p>
          </div>
        </div>
      </div>
    </form>
  );
}
