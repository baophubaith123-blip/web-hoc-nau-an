import crypto from "crypto";

const vnpTmnCode = process.env.VNPAY_TMN_CODE || "DEMO";
const vnpHashSecret = process.env.VNPAY_HASH_SECRET || "DEMOSECRET";
const vnpUrl = process.env.VNPAY_URL || "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
const vnpReturnUrl =
  process.env.VNPAY_RETURN_URL || "http://localhost:3000/api/thanh-toan/vnpay/ket-qua";
// Che do demo: khi VNPAY_DEMO=true, URL thanh toan tro ve trang cong thanh toan
// mo phong ngay trong website thay vi cong sandbox cua VNPay. Toan bo tham so,
// chu ky HMAC-SHA512, IPN va trang ket qua van la code that — chi thay noi
// nguoi dung nhap thong tin thanh toan. Co ma TMN that thi dat VNPAY_DEMO=false.
const vnpDemo = process.env.VNPAY_DEMO === "true";
const vnpSiteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export function laCheDoDemoVNPay(): boolean {
  return vnpDemo;
}

// Ky mot bo tham so VNPay (dung cho ca URL thanh toan, IPN mo phong va URL ket qua)
export function kyThamSoVNPay(params: Record<string, string | number>): string {
  const sortedParams = sapXepObject(params);
  const signData = Object.entries(sortedParams)
    .map(([k, v]) => `${k}=${v}`)
    .join("&");
  const hmac = crypto.createHmac("sha512", vnpHashSecret);
  const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");
  return `${signData}&vnp_SecureHash=${signed}`;
}

// Tao bo tham so ket qua ma cong thanh toan (that hoac demo) gui ve IPN + ReturnURL
export function taoThamSoKetQuaVNPay({
  maGiaoDich,
  soTien,
  noiDung,
  thanhCong,
  maNganHang = "NCB",
}: {
  maGiaoDich: string;
  soTien: number;
  noiDung: string;
  thanhCong: boolean;
  maNganHang?: string;
}): string {
  const maPhanHoi = thanhCong ? "00" : "24"; // 24 = nguoi dung huy giao dich
  const params: Record<string, string | number> = {
    vnp_TmnCode: vnpTmnCode,
    vnp_Amount: Math.round(soTien * 100),
    vnp_BankCode: maNganHang,
    vnp_BankTranNo: `VNP${Date.now()}`,
    vnp_CardType: "ATM",
    vnp_OrderInfo: noiDung,
    vnp_PayDate: dinhDangThoiGianVNPay(new Date()),
    vnp_ResponseCode: maPhanHoi,
    vnp_TransactionNo: Math.floor(10_000_000 + Math.random() * 89_999_999).toString(),
    vnp_TransactionStatus: thanhCong ? "00" : "02",
    vnp_TxnRef: maGiaoDich,
  };
  return kyThamSoVNPay(params);
}

function dinhDangThoiGianVNPay(date: Date): string {
  const yyyy = date.getFullYear().toString();
  const MM = (date.getMonth() + 1).toString().padStart(2, "0");
  const dd = date.getDate().toString().padStart(2, "0");
  const HH = date.getHours().toString().padStart(2, "0");
  const mm = date.getMinutes().toString().padStart(2, "0");
  const ss = date.getSeconds().toString().padStart(2, "0");
  return `${yyyy}${MM}${dd}${HH}${mm}${ss}`;
}

function sapXepObject(obj: Record<string, string | number>): Record<string, string> {
  const sorted: Record<string, string> = {};
  const keys = Object.keys(obj).sort();
  for (const key of keys) {
    const val = obj[key];
    if (val !== undefined && val !== null && val !== "") {
      sorted[key] = encodeURIComponent(val.toString()).replace(/%20/g, "+");
    }
  }
  return sorted;
}

export function taoUrlThanhToanVNPay({
  maGiaoDich,
  soTien,
  noiDung,
  ipAddr,
}: {
  maGiaoDich: string;
  soTien: number;
  noiDung: string;
  ipAddr?: string;
}): string {
  const date = new Date();
  const createDate = dinhDangThoiGianVNPay(date);

  const rawParams: Record<string, string | number> = {
    vnp_Version: "2.1.0",
    vnp_Command: "pay",
    vnp_TmnCode: vnpTmnCode,
    vnp_Locale: "vn",
    vnp_CurrCode: "VND",
    vnp_TxnRef: maGiaoDich,
    vnp_OrderInfo: noiDung,
    vnp_OrderType: "other",
    vnp_Amount: Math.round(soTien * 100),
    vnp_ReturnUrl: vnpReturnUrl,
    vnp_IpAddr: ipAddr || "127.0.0.1",
    vnp_CreateDate: createDate,
  };

  const chuoiDaKy = kyThamSoVNPay(rawParams);
  const urlGoc = vnpDemo ? `${vnpSiteUrl}/thanh-toan-demo` : vnpUrl;
  return `${urlGoc}?${chuoiDaKy}`;
}

export function xacMinhChuKyVNPay(params: Record<string, string>): {
  hopLe: boolean;
  maGiaoDich: string;
  soTien: number;
  maPhanHoi: string;
  thanhCong: boolean;
} {
  const secureHash = params["vnp_SecureHash"];
  const paramsToVerify: Record<string, string> = {};

  for (const [key, value] of Object.entries(params)) {
    if (key !== "vnp_SecureHash" && key !== "vnp_SecureHashType") {
      paramsToVerify[key] = value;
    }
  }

  const sortedParams = sapXepObject(paramsToVerify);
  const signData = Object.entries(sortedParams)
    .map(([k, v]) => `${k}=${v}`)
    .join("&");

  const hmac = crypto.createHmac("sha512", vnpHashSecret);
  const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

  const hopLe = secureHash?.toLowerCase() === signed.toLowerCase();
  const maPhanHoi = params["vnp_ResponseCode"] || "";
  const soTien = params["vnp_Amount"] ? parseInt(params["vnp_Amount"], 10) / 100 : 0;
  const maGiaoDich = params["vnp_TxnRef"] || "";

  return {
    hopLe,
    maGiaoDich,
    soTien,
    maPhanHoi,
    thanhCong: hopLe && maPhanHoi === "00",
  };
}
