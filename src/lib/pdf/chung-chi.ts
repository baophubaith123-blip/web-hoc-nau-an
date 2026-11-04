import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import QRCode from "qrcode";

export async function taoPdfChungChi({
  hoTen,
  khoaHoc,
  maChungChi,
  ngayCap,
}: {
  hoTen: string;
  khoaHoc: string;
  maChungChi: string;
  ngayCap: string;
}): Promise<Uint8Array> {
  // Tạo tài liệu PDF khổ A4 nằm ngang: 842 x 595 pt
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([842, 595]);
  const { width, height } = page.getSize();

  // Load font tiêu chuẩn
  const fontTieuDe = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontVanBan = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontNghieng = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);

  // Khung viền đôi sang trọng
  const mauCam = rgb(0.91, 0.35, 0.05); // #ea580c
  const mauXam = rgb(0.3, 0.35, 0.4);
  const mauDen = rgb(0.08, 0.1, 0.15);

  // Viền ngoài
  page.drawRectangle({
    x: 20,
    y: 20,
    width: width - 40,
    height: height - 40,
    borderColor: mauCam,
    borderWidth: 3,
  });

  // Viền trong
  page.drawRectangle({
    x: 26,
    y: 26,
    width: width - 52,
    height: height - 52,
    borderColor: rgb(0.9, 0.8, 0.7),
    borderWidth: 1,
  });

  // 1. Tiêu đề hệ thống
  const tenHeThong = "HOC NAU AN ONLINE - CULINARY ACADEMY";
  const wHeThong = fontVanBan.widthOfTextAtSize(tenHeThong, 12);
  page.drawText(tenHeThong, {
    x: (width - wHeThong) / 2,
    y: height - 80,
    size: 12,
    font: fontVanBan,
    color: mauCam,
  });

  // 2. Tiêu đề chứng chỉ
  const tieuDeChungChi = "CERTIFICATE OF COMPLETION";
  const wChungChi = fontTieuDe.widthOfTextAtSize(tieuDeChungChi, 28);
  page.drawText(tieuDeChungChi, {
    x: (width - wChungChi) / 2,
    y: height - 130,
    size: 28,
    font: fontTieuDe,
    color: mauDen,
  });

  // 3. Lời trao tặng
  const loiTrao = "This certificate is proudly presented to";
  const wLoiTrao = fontNghieng.widthOfTextAtSize(loiTrao, 14);
  page.drawText(loiTrao, {
    x: (width - wLoiTrao) / 2,
    y: height - 180,
    size: 14,
    font: fontNghieng,
    color: mauXam,
  });

  // 4. Tên học viên
  const tenHocVien = hoTen.toUpperCase();
  const wTen = fontTieuDe.widthOfTextAtSize(tenHocVien, 26);
  page.drawText(tenHocVien, {
    x: (width - wTen) / 2,
    y: height - 230,
    size: 26,
    font: fontTieuDe,
    color: mauCam,
  });

  // Đường kẻ chân tên học viên
  page.drawLine({
    start: { x: width / 2 - 180, y: height - 245 },
    end: { x: width / 2 + 180, y: height - 245 },
    thickness: 1.5,
    color: mauCam,
  });

  // 5. Khóa học đã hoàn thành
  const loiChungNhan = "for successfully mastering the culinary course";
  const wChungNhan = fontVanBan.widthOfTextAtSize(loiChungNhan, 13);
  page.drawText(loiChungNhan, {
    x: (width - wChungNhan) / 2,
    y: height - 280,
    size: 13,
    font: fontVanBan,
    color: mauXam,
  });

  const tenKhoa = `"${khoaHoc}"`;
  const wKhoa = fontTieuDe.widthOfTextAtSize(tenKhoa, 20);
  page.drawText(tenKhoa, {
    x: (width - wKhoa) / 2,
    y: height - 320,
    size: 20,
    font: fontTieuDe,
    color: mauDen,
  });

  // 6. Mã QR tra cứu chứng chỉ
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const xacMinhUrl = `${siteUrl}/api/chung-chi/${maChungChi}/pdf`;
  const qrBase64 = await QRCode.toDataURL(xacMinhUrl, { margin: 1, width: 120 });
  const qrImageBytes = Buffer.from(qrBase64.split(",")[1], "base64");
  const qrImage = await pdfDoc.embedPng(qrImageBytes);

  page.drawImage(qrImage, {
    x: 60,
    y: 50,
    width: 80,
    height: 80,
  });

  // Thông tin mã chứng nhận bên cạnh QR
  page.drawText(`Certificate ID: ${maChungChi}`, {
    x: 155,
    y: 95,
    size: 10,
    font: fontVanBan,
    color: mauXam,
  });
  page.drawText(`Issue Date: ${new Date(ngayCap).toLocaleDateString("vi-VN")}`, {
    x: 155,
    y: 75,
    size: 10,
    font: fontVanBan,
    color: mauXam,
  });
  page.drawText(`Verify at: ${siteUrl}`, {
    x: 155,
    y: 55,
    size: 9,
    font: fontNghieng,
    color: mauCam,
  });

  // Chữ ký đại diện
  const chuKy = "Master Chef & Culinary Board";
  const wChuKy = fontVanBan.widthOfTextAtSize(chuKy, 12);
  page.drawLine({
    start: { x: width - 260, y: 105 },
    end: { x: width - 60, y: 105 },
    thickness: 1,
    color: mauXam,
  });
  page.drawText(chuKy, {
    x: width - 160 - wChuKy / 2,
    y: 85,
    size: 12,
    font: fontVanBan,
    color: mauDen,
  });
  page.drawText("Verified Signature", {
    x: width - 160 - 45,
    y: 65,
    size: 10,
    font: fontNghieng,
    color: mauCam,
  });

  return pdfDoc.save();
}
