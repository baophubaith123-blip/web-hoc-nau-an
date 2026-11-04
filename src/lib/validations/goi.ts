import { z } from "zod";

export const taoGoiSchema = z.object({
  ma_goi: z
    .string()
    .min(2, "Mã gói ít nhất 2 ký tự")
    .max(50, "Mã gói tối đa 50 ký tự")
    .regex(/^[a-z0-9_-]+$/, "Mã gói chỉ gồm chữ thường, số, dấu gạch dưới hoặc gạch ngang"),
  ten: z.string().min(2, "Tên gói ít nhất 2 ký tự").max(100, "Tên gói tối đa 100 ký tự"),
  mo_ta: z.string().max(500, "Mô tả tối đa 500 ký tự").optional().nullable(),
  thoi_han_ngay: z.coerce
    .number()
    .int("Thời hạn phải là số ngày nguyên")
    .positive("Thời hạn ngày phải lớn hơn 0 (không hỗ trợ gói vĩnh viễn)"),
  gia: z.coerce
    .number()
    .min(0, "Giá không được âm"),
  quyen_loi: z.array(z.string()).default([]),
  thu_tu: z.coerce.number().int().default(0),
  hoat_dong: z.boolean().default(true),
});

export type TaoGoiInput = z.infer<typeof taoGoiSchema>;

export const suaGoiSchema = taoGoiSchema.partial().extend({
  id: z.string().uuid("ID gói không hợp lệ"),
});

export type SuaGoiInput = z.infer<typeof suaGoiSchema>;

export const capGoiThuCongSchema = z.object({
  nguoi_dung_id: z.string().uuid("ID người dùng không hợp lệ"),
  goi_id: z.string().uuid("ID gói không hợp lệ"),
  ghi_chu: z.string().max(500, "Ghi chú tối đa 500 ký tự").optional().nullable(),
});

export type CapGoiThuCongInput = z.infer<typeof capGoiThuCongSchema>;

export const thuHoiGoiSchema = z.object({
  nguoi_dung_id: z.string().uuid("ID người dùng không hợp lệ"),
  ly_do: z.string().max(500, "Lý do tối đa 500 ký tự").optional().nullable(),
});

export type ThuHoiGoiInput = z.infer<typeof thuHoiGoiSchema>;
