import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export const runtime = "nodejs";

type ContactPayload = {
  fullName: string;
  jobTitle: string;
  jdLink: string;
  phone: string;
  email: string;
};

function validate(body: Partial<ContactPayload>) {
  const errors: Record<string, string> = {};

  if (!body.fullName?.trim()) errors.fullName = "Vui lòng nhập họ tên.";
  if (!body.jobTitle?.trim()) errors.jobTitle = "Vui lòng nhập job title.";
  if (!body.email?.trim()) {
    errors.email = "Vui lòng nhập email.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
    errors.email = "Email không hợp lệ.";
  }
  if (!body.phone?.trim()) errors.phone = "Vui lòng nhập số điện thoại.";
  if (body.jdLink?.trim()) {
    try {
      new URL(body.jdLink);
    } catch {
      errors.jdLink = "Link JD không hợp lệ.";
    }
  }

  return errors;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<ContactPayload>;
    const errors = validate(body);

    if (Object.keys(errors).length > 0) {
      return NextResponse.json({ errors }, { status: 400 });
    }

    const { fullName, jobTitle, jdLink, phone, email } = body as ContactPayload;

    const smtpHost = process.env.SMTP_HOST?.trim() || "smtp.gmail.com";
    const smtpPort = Number(process.env.SMTP_PORT?.trim() || "587");
    const smtpUser = process.env.SMTP_USER?.trim();
    const smtpPass = process.env.SMTP_PASSWORD?.trim();
    const contactTo =
      process.env.CONTACT_TO?.trim() || "pkbtran.onlyjob@gmail.com";

    if (!smtpUser || !smtpPass || smtpPass === "your-gmail-app-password") {
      return NextResponse.json(
        {
          error:
            "Email chưa được cấu hình. Cập nhật SMTP_PASSWORD (App Password Gmail) trong .env.local rồi restart server.",
        },
        { status: 503 }
      );
    }

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: { user: smtpUser, pass: smtpPass },
    });

    try {
      await transporter.verify();
    } catch (verifyError) {
      console.error("SMTP verify error:", verifyError);
      return NextResponse.json(
        {
          error:
            "Không kết nối được SMTP. Kiểm tra SMTP_USER / SMTP_PASSWORD trong .env.local.",
        },
        { status: 503 }
      );
    }

    const jdDisplay = jdLink?.trim() || "Không cung cấp";

    await transporter.sendMail({
      from: `"Portfolio Contact" <${smtpUser}>`,
      to: contactTo,
      replyTo: email,
      subject: `[Tuyển dụng] ${jobTitle} — ${fullName}`,
      text: [
        "Thông tin liên hệ tuyển dụng mới",
        "",
        `Họ tên: ${fullName}`,
        `Job title: ${jobTitle}`,
        `Link JD: ${jdDisplay}`,
        `SĐT: ${phone}`,
        `Email: ${email}`,
      ].join("\n"),
      html: `
        <div style="font-family:sans-serif;line-height:1.6;color:#111;">
          <h2 style="margin:0 0 16px;">Thông tin liên hệ tuyển dụng mới</h2>
          <p><strong>Họ tên:</strong> ${fullName}</p>
          <p><strong>Job title:</strong> ${jobTitle}</p>
          <p><strong>Link JD:</strong> ${
            jdLink?.trim()
              ? `<a href="${jdLink}">${jdLink}</a>`
              : "Không cung cấp"
          }</p>
          <p><strong>SĐT:</strong> ${phone}</p>
          <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Không thể gửi email. Vui lòng thử lại sau." },
      { status: 500 }
    );
  }
}
