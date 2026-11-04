import { Heart, Award, Users } from "lucide-react";
import { Card } from "@/components/ui/card";

export default function TrangGioiThieu() {
  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-16">
      <div className="space-y-4 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight">Về Học Nấu Ăn Online</h1>
        <p className="text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Nền tảng chia sẻ công thức và đào tạo kỹ năng nấu ăn trực tuyến hàng đầu, mang niềm vui làm bếp đến mọi gia đình Việt.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="text-center p-6 space-y-3">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Heart className="h-6 w-6" />
          </div>
          <h3 className="font-bold text-base">Đam mê & Tâm huyết</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Mỗi công thức được biên soạn và thử nghiệm tỉ mỉ, giúp bạn tự tin vào bếp và thành công ngay lần đầu thực hiện.
          </p>
        </Card>

        <Card className="text-center p-6 space-y-3">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Award className="h-6 w-6" />
          </div>
          <h3 className="font-bold text-base">Đầu bếp chuyên nghiệp</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Học hỏi trực tiếp từ những bếp trưởng giàu kinh nghiệm, nắm vững các kỹ thuật và quy chuẩn ẩm thực tinh hoa.
          </p>
        </Card>

        <Card className="text-center p-6 space-y-3">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Users className="h-6 w-6" />
          </div>
          <h3 className="font-bold text-base">Cộng đồng sôi nổi</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Giao lưu, trao đổi kinh nghiệm và cùng nhau chia sẻ những bữa cơm ấm áp, dinh dưỡng cho người thân yêu.
          </p>
        </Card>
      </div>

      <div className="rounded-2xl border bg-card p-8 space-y-4 leading-relaxed text-sm text-foreground/90">
        <h2 className="text-xl font-bold text-foreground">Sứ mệnh của chúng tôi</h2>
        <p>
          Ẩm thực không chỉ là ăn uống, mà là sợi dây gắn kết tình thân và thể hiện sự chăm sóc tinh tế nhất. Chúng tôi mong muốn phá vỡ rào cản phức tạp của kỹ thuật làm bếp, biến việc nấu nướng hàng ngày trở thành trải nghiệm thư giãn, sáng tạo và ngập tràn niềm vui.
        </p>
        <p>
          Với hệ sinh thái video bài học trực quan, tính toán khẩu phần thông minh và chứng chỉ hoàn thành khóa học, bất kỳ ai cũng có thể trở thành &ldquo;nghệ sĩ&rdquo; trong chính căn bếp của mình.
        </p>
      </div>
    </div>
  );
}
