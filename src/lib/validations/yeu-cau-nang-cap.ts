import { z } from "zod";

export const duyetNangCapSchema = z.object({
  yeu_cau_id: z.string().uuid("ID yêu cầu không hợp lệ"),
  ghi_chu: z.string().max(500, "Ghi chú tối đa 500 ký tự").optional().nullable(),
});

export type DuyetNangCapInput = z.infer<typeof duyetNangCapSchema>;

export const tuChoiNangCapSchema = z.object({
  yeu_cau_id: z.string().uuid("ID yêu cầu không hợp lệ"),
  ly_do_tu_choi: z.string().min(3, "Vui lòng nhập lý do từ chối (tối thiểu 3 ký tự)").max(500, "Lý do tối đa 500 ký tự"),
});

export type TuChoiNangCapInput = z.infer<typeof tuChoiNangCapSchema>;

export const huyYeuCauSchema = z.object({
  yeu_cau_id: z.string().uuid("ID yêu cầu không hợp lệ"),
});

export type HuyYeuCauInput = z.infer<typeof huyYeuCauSchema>;
