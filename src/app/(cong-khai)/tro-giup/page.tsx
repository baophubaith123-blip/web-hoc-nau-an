import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const CAU_HOI_THUONG_GAP = [
  {
    cauHoi: "Làm sao để đăng ký tài khoản học nấu ăn?",
    traLoi: "Bạn chỉ cần nhấp vào nút 'Đăng ký' ở góc trên bên phải màn hình, điền họ tên, email và mật khẩu. Bạn có thể sử dụng tài khoản ngay để lưu công thức và đăng ký các khóa học miễn phí.",
  },
  {
    cauHoi: "Khóa học trả phí thanh toán qua hình thức nào?",
    traLoi: "Chúng tôi hỗ trợ thanh toán an toàn trực tuyến qua cổng VNPay Sandbox, chấp nhận thẻ ATM nội địa, thẻ Visa/Mastercard và quét mã QR ngân hàng.",
  },
  {
    cauHoi: "Làm thế nào để nhận chứng chỉ sau khi học?",
    traLoi: "Đối với các khóa học có chứng chỉ, sau khi bạn hoàn thành 100% các bài học và vượt qua các bài tập trắc nghiệm yêu cầu, hệ thống sẽ tự động cấp chứng chỉ PDF có mã định danh và QR code để bạn tải về.",
  },
  {
    cauHoi: "Tôi có thể tự đăng công thức nấu ăn của mình lên web không?",
    traLoi: "Có! Thành viên có thể tạo công thức trong mục 'Tạo công thức'. Công thức sau khi gửi sẽ được ban biên tập kiểm duyệt và xuất bản công khai cho cộng đồng.",
  },
  {
    cauHoi: "Nếu gặp sự cố trong quá trình học tôi cần liên hệ ai?",
    traLoi: "Bạn có thể vào mục 'Hỗ trợ' trên thanh điều hướng để gửi Ticket hỗ trợ. Nhân viên chăm sóc khách hàng và đội ngũ kỹ thuật sẽ phản hồi trực tiếp cho bạn qua hệ thống tin nhắn realtime.",
  },
];

export default function TrangTroGiup() {
  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-16">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-extrabold tracking-tight">Trung tâm trợ giúp & FAQ</h1>
        <p className="text-sm text-muted-foreground">
          Giải đáp các câu hỏi thường gặp khi sử dụng nền tảng Học Nấu Ăn Online
        </p>
      </div>

      <div className="rounded-2xl border bg-card p-6 shadow-xs">
        <Accordion className="w-full">
          {CAU_HOI_THUONG_GAP.map((item, idx) => (
            <AccordionItem key={idx} value={`item-${idx}`}>
              <AccordionTrigger className="text-left font-semibold text-sm sm:text-base">
                {item.cauHoi}
              </AccordionTrigger>
              <AccordionContent className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                {item.traLoi}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
}
