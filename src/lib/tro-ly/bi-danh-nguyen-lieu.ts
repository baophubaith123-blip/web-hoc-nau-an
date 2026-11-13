// Bảng bí danh nguyên liệu cho trợ lý bếp "Cokba" (Đợt 1 — chuẩn hóa dữ liệu).
//
// MỤC ĐÍCH: Người dùng gõ tên nguyên liệu theo nhiều cách khác nhau — tên gọi
// vùng miền ("hành hoa" ở miền Bắc = "hành lá"), dạng sơ chế ("hành lá thái
// nhỏ"), tên tiếng Anh trên bao bì ("baking powder", "basil") hoặc tên thay
// thế ghi trong công thức ("cá basa" thay cho "cá lóc"). Bảng này ánh xạ các
// biến thể đó về MỘT tên chuẩn duy nhất, đúng như tên hiển thị trong dữ liệu
// công thức (bảng cong_thuc, cột nguyen_lieu), để Cokba khớp nguyên liệu của
// người dùng với nguyên liệu trong công thức.
//
// QUY ƯỚC KHÓA (key): khóa đã được THƯỜNG HÓA từ tên biến thể:
//   - viết thường (lowercase),
//   - bỏ dấu tiếng Việt (ví dụ "hành lá" -> "hanh la"),
//   - bỏ phần chú thích trong ngoặc đơn (ví dụ "Nước mắm (pha nước chấm)"
//     -> "nuoc mam"), vì phần trong ngoặc chỉ là ghi chú mục đích dùng,
//   - gộp khoảng trắng thừa, cắt khoảng trắng hai đầu.
// Khi tra cứu, Cokba thường hóa chuỗi người dùng gõ bằng đúng quy ước trên
// rồi mới tra trong bảng này; nếu không có trong bảng thì dùng chính chuỗi
// đã thường hóa để so với tên nguyên liệu trong công thức (cũng thường hóa
// theo cùng quy ước).
//
// CÁCH MỞ RỘNG: khi phát hiện thêm một cách gọi khác của nguyên liệu đã có
// trong dữ liệu, chỉ cần thêm một dòng "khóa thường hóa": "Tên chuẩn".
// Tên chuẩn (value) PHẢI là tên đang dùng trong dữ liệu công thức, không
// tự đặt tên mới. Không thêm bí danh cho nguyên liệu chưa có trong dữ liệu.

export const BI_DANH_NGUYEN_LIEU: Record<string, string> = {
  // Tên gọi vùng miền / cách gọi khác của cùng một nguyên liệu
  "hanh hoa": "Hành lá", // hành hoa (miền Bắc) = hành lá
  "mui tau": "Ngò gai", // mùi tàu = ngò gai
  "rau mui": "Ngò rí", // rau mùi = ngò rí
  "rau ngo": "Rau om (rau ngổ)", // rau ngổ = rau om
  "doc mung": "Bạc hà (dọc mùng)", // dọc mùng = bạc hà (trong canh chua)
  "bac ha": "Bạc hà (dọc mùng)",
  "dua": "Thơm (dứa)", // người dùng gõ "dứa" bỏ dấu; khác với "dua leo"
  "thom": "Thơm (dứa)", // thơm = dứa (miền Nam gọi thơm)
  "thit ba roi": "Thịt ba chỉ", // thịt ba rọi (miền Nam) = thịt ba chỉ
  "chanh chuc": "Lá chanh Thái (chanh chúc)", // chanh chúc = lá chanh Thái
  "ca basa": "Cá lóc", // công thức ghi "Cá lóc (hoặc cá basa/cá hú)"
  "ca hu": "Cá lóc",

  // Dạng sơ chế / mức độ của cùng nguyên liệu
  "hanh la thai nho": "Hành lá",
  "hanh tay thai mong": "Hành tây",
  "ca chua chin": "Cà chua",
  "ca chua chin do": "Cà chua",
  "ca rot bao soi": "Cà rốt",
  "gung": "Gừng tươi",
  "gung thai soi": "Gừng tươi",
  "bun tuoi soi nho": "Bún tươi",
  "trung ga nguyen qua": "Trứng gà",
  "tom su nho": "Tôm sú",
  "tom su tuoi": "Tôm sú",
  "tom tuoi boc vo": "Tôm sú",
  "nuoc mam ngon": "Nước mắm",
  "nuoc cot chanh": "Chanh",
  "sua dac": "Sữa đặc có đường",
  "bot mi": "Bột mì đa dụng",

  // Tên tiếng Anh / tên trên bao bì nhập khẩu
  "baking powder": "Bột nở (baking powder)",
  "hoisin": "Tương đen (hoisin)",
  "basil": "Lá húng quế tươi (basil)",
  "tomato paste": "Sốt cà chua (tomato paste)",
  "paprika": "Bột ớt paprika (hoặc ớt bột)",
};
