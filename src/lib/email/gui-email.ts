import { Resend } from "resend";

const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;
const emailFrom = process.env.EMAIL_FROM || "Học Nấu Ăn <onboarding@resend.dev>";
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

// Helper bọc template email HTML phong cách ẩm thực trang nhã
function mauEmailKhung(tieuDe: string, noiDungHtml: string): string {
  return `
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${tieuDe}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f8fafc; padding: 40px 10px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05);">
          <!-- Header -->
          <tr>
            <td style="background-color: #ea580c; padding: 24px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 22px; font-weight: bold; letter-spacing: -0.5px;">🍳 Học Nấu Ăn Online</h1>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding: 32px 28px;">
              ${noiDungHtml}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background-color: #f1f5f9; padding: 20px 24px; text-align: center; font-size: 13px; color: #64748b; border-top: 1px solid #e2e8f0;">
              <p style="margin: 0 0 8px 0;">Cảm ơn bạn đã đồng hành cùng Học Nấu Ăn Online.</p>
              <p style="margin: 0;">Nếu có thắc mắc, vui lòng gửi phản hồi tại <a href="${siteUrl}/ho-tro" style="color: #ea580c; text-decoration: none;">Trung tâm hỗ trợ</a>.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

// 1. Email cấp chứng chỉ hoàn thành khóa học
export async function guiEmailChungChi({
  den,
  ten,
  khoaHoc,
  maChungChi,
}: {
  den: string;
  ten: string;
  khoaHoc: string;
  maChungChi: string;
}) {
  if (!resend) {
    console.warn("[RESEND] Chưa cấu hình RESEND_API_KEY. Bỏ qua gửi email chứng chỉ cho:", den);
    return;
  }

  const noiDungHtml = `
    <h2 style="margin: 0 0 16px 0; color: #0f172a; font-size: 20px;">Chúc mừng ${ten}! 🎉</h2>
    <p style="margin: 0 0 16px 0; line-height: 1.6;">
      Bạn đã xuất sắc hoàn thành khóa học <strong>"${khoaHoc}"</strong> trên nền tảng Học Nấu Ăn Online.
    </p>
    <div style="background-color: #fff7ed; border-left: 4px solid #ea580c; padding: 16px; border-radius: 4px; margin: 20px 0;">
      <p style="margin: 0; font-size: 14px; color: #9a3412;">
        <strong>Mã chứng chỉ:</strong> <span style="font-family: monospace; font-size: 16px;">${maChungChi}</span>
      </p>
    </div>
    <p style="margin: 0 0 24px 0; line-height: 1.6;">
      Bạn có thể xem và tải chứng chỉ PDF trực tuyến bất kỳ lúc nào:
    </p>
    <div style="text-align: center; margin: 30px 0;">
      <a href="${siteUrl}/api/chung-chi/${maChungChi}/pdf" style="background-color: #ea580c; color: #ffffff; padding: 12px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
        Xem chứng chỉ PDF
      </a>
    </div>
  `;

  return resend.emails.send({
    from: emailFrom,
    to: den,
    subject: `[Chứng chỉ] Chúc mừng bạn đã hoàn thành khóa học "${khoaHoc}"`,
    html: mauEmailKhung("Chứng chỉ khóa học", noiDungHtml),
  });
}

// 2. Email thông báo phản hồi ticket hỗ trợ
export async function guiEmailTraLoiTicket({
  den,
  ten,
  maTicket,
  noiDung,
  ticketId,
}: {
  den: string;
  ten: string;
  maTicket: string;
  noiDung: string;
  ticketId: string;
}) {
  if (!resend) {
    console.warn("[RESEND] Chưa cấu hình RESEND_API_KEY. Bỏ qua gửi email ticket cho:", den);
    return;
  }

  const noiDungHtml = `
    <h2 style="margin: 0 0 16px 0; color: #0f172a; font-size: 20px;">Xin chào ${ten},</h2>
    <p style="margin: 0 0 16px 0; line-height: 1.6;">
      Yêu cầu hỗ trợ <strong>#${maTicket}</strong> của bạn vừa có phản hồi mới từ ban hỗ trợ:
    </p>
    <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin: 20px 0; font-style: italic; color: #334155;">
      "${noiDung}"
    </div>
    <div style="text-align: center; margin: 30px 0;">
      <a href="${siteUrl}/ho-tro/${ticketId}" style="background-color: #ea580c; color: #ffffff; padding: 12px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
        Xem và trả lời ticket
      </a>
    </div>
  `;

  return resend.emails.send({
    from: emailFrom,
    to: den,
    subject: `[Hỗ trợ] Phản hồi mới cho yêu cầu #${maTicket}`,
    html: mauEmailKhung("Hỗ trợ kỹ thuật", noiDungHtml),
  });
}

// 3. Email thông báo kết quả duyệt bài viết / công thức
export async function guiEmailKetQuaDuyet({
  den,
  ten,
  tieuDe,
  slug,
  duyet,
  lyDo,
}: {
  den: string;
  ten: string;
  tieuDe: string;
  slug: string;
  duyet: boolean;
  lyDo?: string;
}) {
  if (!resend) {
    console.warn("[RESEND] Chưa cấu hình RESEND_API_KEY. Bỏ qua gửi email duyệt cho:", den);
    return;
  }

  const noiDungHtml = duyet
    ? `
      <h2 style="margin: 0 0 16px 0; color: #16a34a; font-size: 20px;">Chúc mừng ${ten}! 🎉</h2>
      <p style="margin: 0 0 16px 0; line-height: 1.6;">
        Công thức / Khóa học <strong>"${tieuDe}"</strong> của bạn đã được kiểm duyệt và chính thức xuất bản trên hệ thống.
      </p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${siteUrl}/cong-thuc/${slug}" style="background-color: #16a34a; color: #ffffff; padding: 12px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
          Xem bài viết đã xuất bản
        </a>
      </div>
    `
    : `
      <h2 style="margin: 0 0 16px 0; color: #dc2626; font-size: 20px;">Thông báo từ ban kiểm duyệt</h2>
      <p style="margin: 0 0 16px 0; line-height: 1.6;">
        Rất tiếc, nội dung <strong>"${tieuDe}"</strong> của bạn chưa đạt yêu cầu để xuất bản.
      </p>
      ${
        lyDo
          ? `<div style="background-color: #fef2f2; border-left: 4px solid #ef4444; padding: 16px; border-radius: 4px; margin: 20px 0;">
              <strong>Lý do từ chối:</strong><br/>${lyDo}
            </div>`
          : ""
      }
      <p style="margin: 0 0 24px 0; line-height: 1.6;">
        Bạn có thể chỉnh sửa lại công thức và gửi duyệt lại qua mục quản lý công thức.
      </p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${siteUrl}/cong-thuc-da-gui" style="background-color: #475569; color: #ffffff; padding: 12px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
          Quản lý bài đã gửi
        </a>
      </div>
    `;

  return resend.emails.send({
    from: emailFrom,
    to: den,
    subject: duyet
      ? `[Duyệt bài] "${tieuDe}" đã được xuất bản thành công!`
      : `[Duyệt bài] Cần chỉnh sửa lại "${tieuDe}"`,
    html: mauEmailKhung("Kết quả duyệt nội dung", noiDungHtml),
  });
}

// 4. Email chúc mừng nâng cấp Pro thành công
export async function guiEmailChucMungPro({
  den,
  ten,
  tenGoi,
  ngayHetHan,
}: {
  den: string;
  ten: string;
  tenGoi: string;
  ngayHetHan: string;
}) {
  if (!resend) {
    console.warn("[RESEND] Chưa cấu hình RESEND_API_KEY. Bỏ qua gửi email Pro cho:", den);
    return;
  }

  const noiDungHtml = `
    <h2 style="margin: 0 0 16px 0; color: #ea580c; font-size: 22px;">Chúc mừng bạn đã là thành viên PRO! 👑</h2>
    <p style="margin: 0 0 16px 0; line-height: 1.6;">
      Xin chào <strong>${ten}</strong>, tài khoản của bạn đã được nâng cấp thành công lên gói <strong>${tenGoi}</strong>.
    </p>
    <div style="background-color: #fff7ed; border-left: 4px solid #ea580c; padding: 16px; border-radius: 4px; margin: 20px 0;">
      <p style="margin: 0 0 8px 0; font-size: 14px; color: #9a3412;">
        <strong>Gói dịch vụ:</strong> ${tenGoi}
      </p>
      <p style="margin: 0; font-size: 14px; color: #9a3412;">
        <strong>Hạn sử dụng đến:</strong> ${ngayHetHan}
      </p>
    </div>
    <p style="margin: 0 0 16px 0; line-height: 1.6;">
      <strong>Đặc quyền thành viên Pro của bạn bao gồm:</strong>
    </p>
    <ul style="margin: 0 0 24px 0; padding-left: 20px; line-height: 1.8; color: #334155;">
      <li>Xem video bài giảng chất lượng Full HD 1080p</li>
      <li>Tải tài liệu PDF công thức và bài học độc quyền</li>
      <li>Làm bài tập thực hành nấu ăn có chấm điểm</li>
      <li>Được cấp chứng chỉ hoàn thành khóa học chính thức</li>
      <li>Quyền đăng tải công thức nấu ăn của riêng bạn</li>
      <li>Huy hiệu Pro vương miện vàng uy tín</li>
      <li>Trải nghiệm học tập hoàn toàn không có quảng cáo</li>
    </ul>
    <div style="text-align: center; margin: 30px 0;">
      <a href="${siteUrl}/goi-cua-toi" style="background-color: #ea580c; color: #ffffff; padding: 12px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
        Xem gói & Bắt đầu học ngay
      </a>
    </div>
  `;

  return resend.emails.send({
    from: emailFrom,
    to: den,
    subject: `👑 [Nâng cấp thành công] Chúc mừng bạn đã là thành viên PRO!`,
    html: mauEmailKhung("Nâng cấp gói PRO thành công", noiDungHtml),
  });
}
