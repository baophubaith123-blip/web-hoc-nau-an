"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Bang } from "@/types";

interface BoLocCongThucProps {
  danhMucList: Bang<"danh_muc">[];
}

export function BoLocCongThuc({ danhMucList }: BoLocCongThucProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const tuKhoa = searchParams.get("tu_khoa") || "";
  const danhMuc = searchParams.get("danh_muc") || "tat_ca";
  const doKho = searchParams.get("do_kho") || "tat_ca";
  const sapXep = searchParams.get("sap_xep") || "moi_nhat";

  // Ô tìm kiếm KHÔNG đồng bộ hai chiều với URL trong lúc gõ: ô nhập là nguồn sự thật duy nhất
  // cho chữ đang gõ, nên chữ/dấu đang soạn không bao giờ bị ghi đè giữa chừng (lỗi mất dấu
  // tiếng Việt khi trang tải lại kết quả). Ô chỉ "nạp lại" khi URL đổi từ BÊN NGOÀI (nút quay
  // lại, Xóa bộ lọc...) — phân biệt bằng giá trị gần nhất do chính ô này đã áp lên URL.
  const oNhapRef = useRef<HTMLInputElement>(null);
  const henGioRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const henGioAnToanRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dangSoanRef = useRef(false); // đang soạn dấu bằng bộ gõ (IME composition)
  const giaTriDaApRef = useRef(tuKhoa);
  const tuKhoaUrlRef = useRef(tuKhoa);
  // Các lần áp dụng từ khóa phải XẾP HÀNG, không chạy chồng nhau: hai lần điều hướng chồng
  // nhau khiến luồng dữ liệu của lần sau bị trình duyệt hủy giữa chừng (net::ERR_ABORTED)
  // và từ khóa không bao giờ được áp dụng. Từ khóa gõ trong lúc đang áp dụng sẽ được giữ
  // lại và áp dụng ngay khi lần trước hoàn tất (hoặc sau 5 giây nếu lần trước bị hủy).
  const dangApRef = useRef(false);
  const choApRef = useRef<string | null>(null);
  const soLanThuRef = useRef(0); // số lần áp dụng lại một giá trị sau khi lần trước bị hủy
  const [khoaTaiNap, setKhoaTaiNap] = useState(tuKhoa);

  useEffect(() => {
    tuKhoaUrlRef.current = tuKhoa;
    if (tuKhoa !== giaTriDaApRef.current) setKhoaTaiNap(tuKhoa);
    // URL đã bắt kịp giá trị vừa áp dụng -> lần áp dụng kết thúc, chạy tiếp từ khóa đang chờ
    if (dangApRef.current && tuKhoa === giaTriDaApRef.current) {
      dangApRef.current = false;
      soLanThuRef.current = 0;
      chayChoAp();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tuKhoa]);

  useEffect(
    () => () => {
      if (henGioRef.current) clearTimeout(henGioRef.current);
      if (henGioAnToanRef.current) clearTimeout(henGioAnToanRef.current);
    },
    []
  );

  // Bảng nhãn hiển thị cho Select (Base UI mặc định hiện giá trị thô như "tat_ca")
  const nhanDanhMuc: Record<string, string> = {
    tat_ca: "Tất cả danh mục",
    ...Object.fromEntries(danhMucList.map((dm) => [dm.slug, dm.ten])),
  };
  const nhanDoKho: Record<string, string> = {
    tat_ca: "Mọi độ khó",
    de: "Dễ làm",
    trung_binh: "Trung bình",
    kho: "Kỳ công / Khó",
  };
  const nhanSapXep: Record<string, string> = {
    moi_nhat: "Mới nhất",
    xem_nhieu: "Xem nhiều nhất",
    thoi_gian_ngan: "Nấu nhanh nhất",
  };

  const capNhatThamSo = (khoa: string, giaTri: string, thayThe = false) => {
    // Đọc tham số từ URL hiện tại của trình duyệt để không bao giờ dùng trạng thái cũ
    const params = new URLSearchParams(window.location.search);
    if (giaTri && giaTri !== "tat_ca") {
      params.set(khoa, giaTri);
    } else {
      params.delete(khoa);
    }
    // Đổi bộ lọc khác giữa lúc đang gõ dở: giữ nguyên từ khóa đang có trong ô nhập
    if (khoa !== "tu_khoa") {
      const tuKhoaTrongO = oNhapRef.current?.value.trim() || "";
      if (tuKhoaTrongO) {
        params.set("tu_khoa", tuKhoaTrongO);
      } else {
        params.delete("tu_khoa");
      }
    }
    params.delete("trang"); // Reset về trang 1 khi lọc
    const url = `${pathname}?${params.toString()}`;
    if (thayThe) {
      // Tìm kiếm theo nhịp gõ: thay URL tại chỗ, không thêm mục lịch sử.
      // LƯU Ý: không truyền { scroll: false } — trên Next 15.5 tùy chọn này khiến lần điều
      // hướng không bao giờ hoàn tất (dữ liệu đã về nhưng trang không áp dụng, đã kiểm chứng).
      router.replace(url);
    } else {
      router.push(url);
    }
  };

  function chayChoAp() {
    if (dangApRef.current) return;
    const cho = choApRef.current;
    if (cho === null) return;
    choApRef.current = null;
    if (cho !== tuKhoaUrlRef.current) apDungTuKhoa(cho);
  }

  function apDungTuKhoa(giaTri: string) {
    if (giaTri !== giaTriDaApRef.current) soLanThuRef.current = 0;
    dangApRef.current = true;
    giaTriDaApRef.current = giaTri;
    capNhatThamSo("tu_khoa", giaTri, true);
    // Phòng hờ: luồng dữ liệu của một lần điều hướng đôi khi bị hủy giữa chừng
    // (net::ERR_ABORTED) khiến URL không bao giờ thay đổi. Sau 5 giây nếu URL vẫn chưa
    // khớp giá trị đã áp dụng thì áp dụng LẠI chính giá trị đó (tối đa 5 lần) thay vì
    // để từ khóa người dùng đã gõ mất hẳn.
    if (henGioAnToanRef.current) clearTimeout(henGioAnToanRef.current);
    henGioAnToanRef.current = setTimeout(() => {
      if (tuKhoaUrlRef.current === giaTriDaApRef.current) {
        dangApRef.current = false;
        chayChoAp();
        return;
      }
      if (soLanThuRef.current < 5) {
        soLanThuRef.current += 1;
        apDungTuKhoa(giaTriDaApRef.current);
      } else {
        dangApRef.current = false;
        chayChoAp();
      }
    }, 5000);
  }

  // Lên lịch áp dụng từ khóa sau khi ngừng gõ 400ms; hoãn tiếp nếu đang soạn dấu dở
  const lenLichTimKiem = () => {
    if (henGioRef.current) clearTimeout(henGioRef.current);
    henGioRef.current = setTimeout(() => {
      if (dangSoanRef.current) {
        lenLichTimKiem();
        return;
      }
      const giaTri = oNhapRef.current?.value.trim() || "";
      if (dangApRef.current) {
        // Đang có lần áp dụng chưa xong: giữ từ khóa mới nhất lại để áp dụng nối tiếp
        choApRef.current = giaTri;
        return;
      }
      if (giaTri === tuKhoaUrlRef.current) return;
      apDungTuKhoa(giaTri);
    }, 400);
  };

  const xoaTatCaLoc = () => {
    router.push(pathname);
  };

  const coBoLoc = tuKhoa || (danhMuc && danhMuc !== "tat_ca") || (doKho && doKho !== "tat_ca");

  return (
    <div className="space-y-4 rounded-xl border bg-card p-4 shadow-xs">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {/* Tìm kiếm */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            key={khoaTaiNap}
            ref={oNhapRef}
            defaultValue={khoaTaiNap}
            onChange={(e) => {
              // Bỏ qua sự kiện thay đổi phát sinh giữa chừng khi đang soạn dấu
              if ((e.nativeEvent as InputEvent).isComposing) return;
              lenLichTimKiem();
            }}
            onCompositionStart={() => {
              dangSoanRef.current = true;
            }}
            onCompositionEnd={() => {
              dangSoanRef.current = false;
              lenLichTimKiem();
            }}
            placeholder="Tìm tên món, nguyên liệu..."
            className="pl-9"
          />
        </div>

        {/* Danh mục */}
        <Select
          value={danhMuc}
          onValueChange={(val) => capNhatThamSo("danh_muc", val ?? "tat_ca")}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Danh mục món ăn">
              {(value: string) => nhanDanhMuc[value] ?? value}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="tat_ca">Tất cả danh mục</SelectItem>
            {danhMucList.map((dm) => (
              <SelectItem key={dm.id} value={dm.slug}>
                {dm.ten}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Độ khó */}
        <Select
          value={doKho}
          onValueChange={(val) => capNhatThamSo("do_kho", val ?? "tat_ca")}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Độ khó">
              {(value: string) => nhanDoKho[value] ?? value}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="tat_ca">Mọi độ khó</SelectItem>
            <SelectItem value="de">Dễ làm</SelectItem>
            <SelectItem value="trung_binh">Trung bình</SelectItem>
            <SelectItem value="kho">Kỳ công / Khó</SelectItem>
          </SelectContent>
        </Select>

        {/* Sắp xếp */}
        <Select
          value={sapXep}
          onValueChange={(val) => capNhatThamSo("sap_xep", val ?? "moi_nhat")}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Sắp xếp">
              {(value: string) => nhanSapXep[value] ?? value}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="moi_nhat">Mới nhất</SelectItem>
            <SelectItem value="xem_nhieu">Xem nhiều nhất</SelectItem>
            <SelectItem value="thoi_gian_ngan">Nấu nhanh nhất</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {coBoLoc && (
        <div className="flex items-center justify-between border-t pt-3 text-xs text-muted-foreground">
          <span>Đang lọc theo tiêu chí</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={xoaTatCaLoc}
            className="h-7 text-xs text-destructive hover:bg-destructive/10"
          >
            <X className="mr-1 h-3.5 w-3.5" />
            Xóa bộ lọc
          </Button>
        </div>
      )}
    </div>
  );
}
