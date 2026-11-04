export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          username: string | null;
          ho_ten: string | null;
          avatar_url: string | null;
          bio: string | null;
          vai_tro: "user" | "chef" | "support" | "admin";
          so_dien_thoai: string | null;
          dia_chi: string | null;
          ngay_sinh: string | null;
          gioi_tinh: "nam" | "nu" | "khac" | null;
          trang_thai: "hoat_dong" | "khoa";
          lan_dang_nhap_cuoi: string | null;
          la_pro: boolean;
          goi_hien_tai_id: string | null;
          goi_het_han: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          username?: string | null;
          ho_ten?: string | null;
          avatar_url?: string | null;
          bio?: string | null;
          vai_tro?: "user" | "chef" | "support" | "admin";
          so_dien_thoai?: string | null;
          dia_chi?: string | null;
          ngay_sinh?: string | null;
          gioi_tinh?: "nam" | "nu" | "khac" | null;
          trang_thai?: "hoat_dong" | "khoa";
          lan_dang_nhap_cuoi?: string | null;
          la_pro?: boolean;
          goi_hien_tai_id?: string | null;
          goi_het_han?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          username?: string | null;
          ho_ten?: string | null;
          avatar_url?: string | null;
          bio?: string | null;
          vai_tro?: "user" | "chef" | "support" | "admin";
          so_dien_thoai?: string | null;
          dia_chi?: string | null;
          ngay_sinh?: string | null;
          gioi_tinh?: "nam" | "nu" | "khac" | null;
          trang_thai?: "hoat_dong" | "khoa";
          lan_dang_nhap_cuoi?: string | null;
          la_pro?: boolean;
          goi_hien_tai_id?: string | null;
          goi_het_han?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      danh_muc: {
        Row: {
          id: string;
          ten: string;
          slug: string;
          mo_ta: string | null;
          anh_dai_dien: string | null;
          danh_muc_cha_id: string | null;
          thu_tu: number;
          trang_thai: "hoat_dong" | "an";
          created_at: string;
        };
        Insert: {
          id?: string;
          ten: string;
          slug: string;
          mo_ta?: string | null;
          anh_dai_dien?: string | null;
          danh_muc_cha_id?: string | null;
          thu_tu?: number;
          trang_thai?: "hoat_dong" | "an";
          created_at?: string;
        };
        Update: {
          id?: string;
          ten?: string;
          slug?: string;
          mo_ta?: string | null;
          anh_dai_dien?: string | null;
          danh_muc_cha_id?: string | null;
          thu_tu?: number;
          trang_thai?: "hoat_dong" | "an";
          created_at?: string;
        };
        Relationships: [];
      };
      cong_thuc: {
        Row: {
          id: string;
          tieu_de: string;
          slug: string;
          mo_ta: string | null;
          nguyen_lieu: Json;
          cac_buoc: Json;
          thoi_gian_chuan_bi: number;
          thoi_gian_nau: number;
          khau_phan: number;
          do_kho: "de" | "trung_binh" | "kho";
          anh_dai_dien: string | null;
          video_url: string | null;
          calories: number | null;
          tac_gia_id: string;
          tac_gia_la_pro: boolean;
          trang_thai: "nhap" | "cho_duyet" | "xuat_ban" | "luu_tru" | "tu_choi";
          ly_do_tu_choi: string | null;
          noi_bat: boolean;
          luot_xem: number;
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
        };
        Insert: {
          id?: string;
          tieu_de: string;
          slug: string;
          mo_ta?: string | null;
          nguyen_lieu?: Json;
          cac_buoc?: Json;
          thoi_gian_chuan_bi?: number;
          thoi_gian_nau?: number;
          khau_phan?: number;
          do_kho?: "de" | "trung_binh" | "kho";
          anh_dai_dien?: string | null;
          video_url?: string | null;
          calories?: number | null;
          tac_gia_id: string;
          tac_gia_la_pro?: boolean;
          trang_thai?: "nhap" | "cho_duyet" | "xuat_ban" | "luu_tru" | "tu_choi";
          ly_do_tu_choi?: string | null;
          noi_bat?: boolean;
          luot_xem?: number;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
        Update: {
          id?: string;
          tieu_de?: string;
          slug?: string;
          mo_ta?: string | null;
          nguyen_lieu?: Json;
          cac_buoc?: Json;
          thoi_gian_chuan_bi?: number;
          thoi_gian_nau?: number;
          khau_phan?: number;
          do_kho?: "de" | "trung_binh" | "kho";
          anh_dai_dien?: string | null;
          video_url?: string | null;
          calories?: number | null;
          tac_gia_id?: string;
          tac_gia_la_pro?: boolean;
          trang_thai?: "nhap" | "cho_duyet" | "xuat_ban" | "luu_tru" | "tu_choi";
          ly_do_tu_choi?: string | null;
          noi_bat?: boolean;
          luot_xem?: number;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "cong_thuc_tac_gia_id_fkey";
            columns: ["tac_gia_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      cong_thuc_danh_muc: {
        Row: {
          cong_thuc_id: string;
          danh_muc_id: string;
        };
        Insert: {
          cong_thuc_id: string;
          danh_muc_id: string;
        };
        Update: {
          cong_thuc_id?: string;
          danh_muc_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "cong_thuc_danh_muc_cong_thuc_id_fkey";
            columns: ["cong_thuc_id"];
            isOneToOne: false;
            referencedRelation: "cong_thuc";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "cong_thuc_danh_muc_danh_muc_id_fkey";
            columns: ["danh_muc_id"];
            isOneToOne: false;
            referencedRelation: "danh_muc";
            referencedColumns: ["id"];
          }
        ];
      };
      khoa_hoc: {
        Row: {
          id: string;
          tieu_de: string;
          slug: string;
          mo_ta: string | null;
          mo_ta_chi_tiet: string | null;
          anh_dai_dien: string | null;
          video_gioi_thieu: string | null;
          cap_do: "co_ban" | "trung_cap" | "nang_cao";
          gia: number;
          mien_phi: boolean;
          dau_bep_id: string;
          trang_thai: "nhap" | "cho_duyet" | "xuat_ban" | "luu_tru";
          tong_thoi_gian: number;
          so_bai_hoc: number;
          co_chung_chi: boolean;
          co_tai_lieu: boolean;
          co_bai_tap: boolean;
          ho_tro_1_1: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          tieu_de: string;
          slug: string;
          mo_ta?: string | null;
          mo_ta_chi_tiet?: string | null;
          anh_dai_dien?: string | null;
          video_gioi_thieu?: string | null;
          cap_do?: "co_ban" | "trung_cap" | "nang_cao";
          gia?: number;
          mien_phi?: boolean;
          dau_bep_id: string;
          trang_thai?: "nhap" | "cho_duyet" | "xuat_ban" | "luu_tru";
          tong_thoi_gian?: number;
          so_bai_hoc?: number;
          co_chung_chi?: boolean;
          co_tai_lieu?: boolean;
          co_bai_tap?: boolean;
          ho_tro_1_1?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          tieu_de?: string;
          slug?: string;
          mo_ta?: string | null;
          mo_ta_chi_tiet?: string | null;
          anh_dai_dien?: string | null;
          video_gioi_thieu?: string | null;
          cap_do?: "co_ban" | "trung_cap" | "nang_cao";
          gia?: number;
          mien_phi?: boolean;
          dau_bep_id?: string;
          trang_thai?: "nhap" | "cho_duyet" | "xuat_ban" | "luu_tru";
          tong_thoi_gian?: number;
          so_bai_hoc?: number;
          co_chung_chi?: boolean;
          co_tai_lieu?: boolean;
          co_bai_tap?: boolean;
          ho_tro_1_1?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "khoa_hoc_dau_bep_id_fkey";
            columns: ["dau_bep_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      bai_hoc: {
        Row: {
          id: string;
          khoa_hoc_id: string;
          tieu_de: string;
          mo_ta: string | null;
          video_url: string | null;
          video_hd_url: string | null;
          chi_pro: boolean;
          tai_lieu: Json;
          tai_lieu_pro: Json;
          bai_tap: Json;
          thoi_gian_phut: number;
          thu_tu: number;
          xem_truoc: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          khoa_hoc_id: string;
          tieu_de: string;
          mo_ta?: string | null;
          video_url?: string | null;
          video_hd_url?: string | null;
          chi_pro?: boolean;
          tai_lieu?: Json;
          tai_lieu_pro?: Json;
          bai_tap?: Json;
          thoi_gian_phut?: number;
          thu_tu?: number;
          xem_truoc?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          khoa_hoc_id?: string;
          tieu_de?: string;
          mo_ta?: string | null;
          video_url?: string | null;
          video_hd_url?: string | null;
          chi_pro?: boolean;
          tai_lieu?: Json;
          tai_lieu_pro?: Json;
          bai_tap?: Json;
          thoi_gian_phut?: number;
          thu_tu?: number;
          xem_truoc?: boolean;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "bai_hoc_khoa_hoc_id_fkey";
            columns: ["khoa_hoc_id"];
            isOneToOne: false;
            referencedRelation: "khoa_hoc";
            referencedColumns: ["id"];
          }
        ];
      };
      dang_ky_khoa_hoc: {
        Row: {
          id: string;
          nguoi_dung_id: string;
          khoa_hoc_id: string;
          ngay_dang_ky: string;
          ngay_hoan_thanh: string | null;
          phan_tram_tien_do: number;
          da_thanh_toan: boolean;
          ma_giao_dich: string | null;
        };
        Insert: {
          id?: string;
          nguoi_dung_id: string;
          khoa_hoc_id: string;
          ngay_dang_ky?: string;
          ngay_hoan_thanh?: string | null;
          phan_tram_tien_do?: number;
          da_thanh_toan?: boolean;
          ma_giao_dich?: string | null;
        };
        Update: {
          id?: string;
          nguoi_dung_id?: string;
          khoa_hoc_id?: string;
          ngay_dang_ky?: string;
          ngay_hoan_thanh?: string | null;
          phan_tram_tien_do?: number;
          da_thanh_toan?: boolean;
          ma_giao_dich?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "dang_ky_khoa_hoc_khoa_hoc_id_fkey";
            columns: ["khoa_hoc_id"];
            isOneToOne: false;
            referencedRelation: "khoa_hoc";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "dang_ky_khoa_hoc_nguoi_dung_id_fkey";
            columns: ["nguoi_dung_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      tien_do_bai_hoc: {
        Row: {
          id: string;
          nguoi_dung_id: string;
          bai_hoc_id: string;
          hoan_thanh: boolean;
          ngay_hoan_thanh: string | null;
        };
        Insert: {
          id?: string;
          nguoi_dung_id: string;
          bai_hoc_id: string;
          hoan_thanh?: boolean;
          ngay_hoan_thanh?: string | null;
        };
        Update: {
          id?: string;
          nguoi_dung_id?: string;
          bai_hoc_id?: string;
          hoan_thanh?: boolean;
          ngay_hoan_thanh?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "tien_do_bai_hoc_bai_hoc_id_fkey";
            columns: ["bai_hoc_id"];
            isOneToOne: false;
            referencedRelation: "bai_hoc";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "tien_do_bai_hoc_nguoi_dung_id_fkey";
            columns: ["nguoi_dung_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      cong_thuc_da_luu: {
        Row: {
          id: string;
          nguoi_dung_id: string;
          cong_thuc_id: string;
          bo_suu_tap: string;
          ngay_luu: string;
        };
        Insert: {
          id?: string;
          nguoi_dung_id: string;
          cong_thuc_id: string;
          bo_suu_tap?: string;
          ngay_luu?: string;
        };
        Update: {
          id?: string;
          nguoi_dung_id?: string;
          cong_thuc_id?: string;
          bo_suu_tap?: string;
          ngay_luu?: string;
        };
        Relationships: [
          {
            foreignKeyName: "cong_thuc_da_luu_cong_thuc_id_fkey";
            columns: ["cong_thuc_id"];
            isOneToOne: false;
            referencedRelation: "cong_thuc";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "cong_thuc_da_luu_nguoi_dung_id_fkey";
            columns: ["nguoi_dung_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      binh_luan: {
        Row: {
          id: string;
          nguoi_dung_id: string;
          cong_thuc_id: string;
          noi_dung: string;
          binh_luan_cha_id: string | null;
          da_duyet: boolean;
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
        };
        Insert: {
          id?: string;
          nguoi_dung_id: string;
          cong_thuc_id: string;
          noi_dung: string;
          binh_luan_cha_id?: string | null;
          da_duyet?: boolean;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
        Update: {
          id?: string;
          nguoi_dung_id?: string;
          cong_thuc_id?: string;
          noi_dung?: string;
          binh_luan_cha_id?: string | null;
          da_duyet?: boolean;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "binh_luan_cong_thuc_id_fkey";
            columns: ["cong_thuc_id"];
            isOneToOne: false;
            referencedRelation: "cong_thuc";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "binh_luan_nguoi_dung_id_fkey";
            columns: ["nguoi_dung_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      danh_gia: {
        Row: {
          id: string;
          nguoi_dung_id: string;
          cong_thuc_id: string;
          diem: number;
          nhan_xet: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          nguoi_dung_id: string;
          cong_thuc_id: string;
          diem: number;
          nhan_xet?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          nguoi_dung_id?: string;
          cong_thuc_id?: string;
          diem?: number;
          nhan_xet?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "danh_gia_cong_thuc_id_fkey";
            columns: ["cong_thuc_id"];
            isOneToOne: false;
            referencedRelation: "cong_thuc";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "danh_gia_nguoi_dung_id_fkey";
            columns: ["nguoi_dung_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      bai_viet: {
        Row: {
          id: string;
          tieu_de: string;
          slug: string;
          tom_tat: string | null;
          noi_dung: string | null;
          anh_dai_dien: string | null;
          tac_gia_id: string;
          danh_muc: string | null;
          trang_thai: "nhap" | "xuat_ban" | "luu_tru";
          luot_xem: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          tieu_de: string;
          slug: string;
          tom_tat?: string | null;
          noi_dung?: string | null;
          anh_dai_dien?: string | null;
          tac_gia_id: string;
          danh_muc?: string | null;
          trang_thai?: "nhap" | "xuat_ban" | "luu_tru";
          luot_xem?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          tieu_de?: string;
          slug?: string;
          tom_tat?: string | null;
          noi_dung?: string | null;
          anh_dai_dien?: string | null;
          tac_gia_id?: string;
          danh_muc?: string | null;
          trang_thai?: "nhap" | "xuat_ban" | "luu_tru";
          luot_xem?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "bai_viet_tac_gia_id_fkey";
            columns: ["tac_gia_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      ticket_ho_tro: {
        Row: {
          id: string;
          ma_ticket: string;
          nguoi_dung_id: string;
          tieu_de: string;
          noi_dung: string;
          danh_muc: string | null;
          do_uu_tien: "thap" | "trung_binh" | "cao" | "khan_cap";
          trang_thai: "moi" | "dang_xu_ly" | "cho_phan_hoi" | "da_giai_quyet" | "dong";
          nhan_vien_ho_tro_id: string | null;
          created_at: string;
          updated_at: string;
          dong_luc: string | null;
        };
        Insert: {
          id?: string;
          ma_ticket?: string;
          nguoi_dung_id: string;
          tieu_de: string;
          noi_dung: string;
          danh_muc?: string | null;
          do_uu_tien?: "thap" | "trung_binh" | "cao" | "khan_cap";
          trang_thai?: "moi" | "dang_xu_ly" | "cho_phan_hoi" | "da_giai_quyet" | "dong";
          nhan_vien_ho_tro_id?: string | null;
          created_at?: string;
          updated_at?: string;
          dong_luc?: string | null;
        };
        Update: {
          id?: string;
          ma_ticket?: string;
          nguoi_dung_id?: string;
          tieu_de?: string;
          noi_dung?: string;
          danh_muc?: string | null;
          do_uu_tien?: "thap" | "trung_binh" | "cao" | "khan_cap";
          trang_thai?: "moi" | "dang_xu_ly" | "cho_phan_hoi" | "da_giai_quyet" | "dong";
          nhan_vien_ho_tro_id?: string | null;
          created_at?: string;
          updated_at?: string;
          dong_luc?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "ticket_ho_tro_nguoi_dung_id_fkey";
            columns: ["nguoi_dung_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "ticket_ho_tro_nhan_vien_ho_tro_id_fkey";
            columns: ["nhan_vien_ho_tro_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      tin_nhan_ticket: {
        Row: {
          id: string;
          ticket_id: string;
          nguoi_gui_id: string;
          noi_dung: string;
          tep_dinh_kem: Json;
          la_noi_bo: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          ticket_id: string;
          nguoi_gui_id: string;
          noi_dung: string;
          tep_dinh_kem?: Json;
          la_noi_bo?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          ticket_id?: string;
          nguoi_gui_id?: string;
          noi_dung?: string;
          tep_dinh_kem?: Json;
          la_noi_bo?: boolean;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "tin_nhan_ticket_ticket_id_fkey";
            columns: ["ticket_id"];
            isOneToOne: false;
            referencedRelation: "ticket_ho_tro";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "tin_nhan_ticket_nguoi_gui_id_fkey";
            columns: ["nguoi_gui_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      thong_bao: {
        Row: {
          id: string;
          nguoi_dung_id: string;
          tieu_de: string;
          noi_dung: string | null;
          loai: string;
          lien_ket: string | null;
          da_doc: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          nguoi_dung_id: string;
          tieu_de: string;
          noi_dung?: string | null;
          loai?: string;
          lien_ket?: string | null;
          da_doc?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          nguoi_dung_id?: string;
          tieu_de?: string;
          noi_dung?: string | null;
          loai?: string;
          lien_ket?: string | null;
          da_doc?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };
      cau_hinh_he_thong: {
        Row: {
          id: string;
          khoa: string;
          gia_tri: Json;
          mo_ta: string | null;
          updated_at: string;
        };
        Insert: {
          id?: string;
          khoa: string;
          gia_tri?: Json;
          mo_ta?: string | null;
          updated_at?: string;
        };
        Update: {
          id?: string;
          khoa?: string;
          gia_tri?: Json;
          mo_ta?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      nhat_ky_hoat_dong: {
        Row: {
          id: string;
          nguoi_dung_id: string | null;
          hanh_dong: string;
          doi_tuong: string | null;
          doi_tuong_id: string | null;
          chi_tiet: Json;
          ip_address: string | null;
          user_agent: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          nguoi_dung_id?: string | null;
          hanh_dong: string;
          doi_tuong?: string | null;
          doi_tuong_id?: string | null;
          chi_tiet?: Json;
          ip_address?: string | null;
          user_agent?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          nguoi_dung_id?: string | null;
          hanh_dong?: string;
          doi_tuong?: string | null;
          doi_tuong_id?: string | null;
          chi_tiet?: Json;
          ip_address?: string | null;
          user_agent?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "nhat_ky_he_thong_nguoi_dung_id_fkey";
            columns: ["nguoi_dung_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      bao_cao_vi_pham: {
        Row: {
          id: string;
          nguoi_bao_cao_id: string;
          loai_doi_tuong: "cong_thuc" | "binh_luan" | "khoa_hoc" | "nguoi_dung" | "bai_viet";
          doi_tuong_id: string;
          ly_do: string;
          mo_ta: string | null;
          trang_thai: "moi" | "dang_xu_ly" | "da_xu_ly" | "bo_qua";
          nguoi_xu_ly_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          nguoi_bao_cao_id: string;
          loai_doi_tuong: "cong_thuc" | "binh_luan" | "khoa_hoc" | "nguoi_dung" | "bai_viet";
          doi_tuong_id: string;
          ly_do: string;
          mo_ta?: string | null;
          trang_thai?: "moi" | "dang_xu_ly" | "da_xu_ly" | "bo_qua";
          nguoi_xu_ly_id?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          nguoi_bao_cao_id?: string;
          loai_doi_tuong?: "cong_thuc" | "binh_luan" | "khoa_hoc" | "nguoi_dung" | "bai_viet";
          doi_tuong_id?: string;
          ly_do?: string;
          mo_ta?: string | null;
          trang_thai?: "moi" | "dang_xu_ly" | "da_xu_ly" | "bo_qua";
          nguoi_xu_ly_id?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      thanh_toan: {
        Row: {
          id: string;
          ma_giao_dich: string;
          nguoi_dung_id: string;
          khoa_hoc_id: string | null;
          goi_id: string | null;
          loai_thanh_toan: "khoa_hoc" | "goi_premium";
          so_tien: number;
          phuong_thuc: "momo" | "vnpay" | "stripe" | "chuyen_khoan";
          trang_thai: "cho_xu_ly" | "thanh_cong" | "that_bai" | "hoan_tien";
          ma_giao_dich_ngoai: string | null;
          chi_tiet: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          ma_giao_dich: string;
          nguoi_dung_id: string;
          khoa_hoc_id?: string | null;
          goi_id?: string | null;
          loai_thanh_toan?: "khoa_hoc" | "goi_premium";
          so_tien: number;
          phuong_thuc: "momo" | "vnpay" | "stripe" | "chuyen_khoan";
          trang_thai?: "cho_xu_ly" | "thanh_cong" | "that_bai" | "hoan_tien";
          ma_giao_dich_ngoai?: string | null;
          chi_tiet?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          ma_giao_dich?: string;
          nguoi_dung_id?: string;
          khoa_hoc_id?: string | null;
          goi_id?: string | null;
          loai_thanh_toan?: "khoa_hoc" | "goi_premium";
          so_tien?: number;
          phuong_thuc?: "momo" | "vnpay" | "stripe" | "chuyen_khoan";
          trang_thai?: "cho_xu_ly" | "thanh_cong" | "that_bai" | "hoan_tien";
          ma_giao_dich_ngoai?: string | null;
          chi_tiet?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "thanh_toan_nguoi_dung_id_fkey";
            columns: ["nguoi_dung_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "thanh_toan_khoa_hoc_id_fkey";
            columns: ["khoa_hoc_id"];
            isOneToOne: false;
            referencedRelation: "khoa_hoc";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "fk_thanh_toan_goi";
            columns: ["goi_id"];
            isOneToOne: false;
            referencedRelation: "goi_premium";
            referencedColumns: ["id"];
          }
        ];
      };
      chung_chi: {
        Row: {
          id: string;
          nguoi_dung_id: string;
          khoa_hoc_id: string;
          ma_chung_chi: string;
          ngay_cap: string;
          url_pdf: string | null;
        };
        Insert: {
          id?: string;
          nguoi_dung_id: string;
          khoa_hoc_id: string;
          ma_chung_chi: string;
          ngay_cap?: string;
          url_pdf?: string | null;
        };
        Update: {
          id?: string;
          nguoi_dung_id?: string;
          khoa_hoc_id?: string;
          ma_chung_chi?: string;
          ngay_cap?: string;
          url_pdf?: string | null;
        };
        Relationships: [];
      };
      goi_premium: {
        Row: {
          id: string;
          ma_goi: "pro_thang" | "pro_nam";
          ten: string;
          mo_ta: string | null;
          thoi_han_ngay: number;
          gia: number;
          quyen_loi: Json;
          thu_tu: number;
          hoat_dong: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          ma_goi: "pro_thang" | "pro_nam";
          ten: string;
          mo_ta?: string | null;
          thoi_han_ngay: number;
          gia: number;
          quyen_loi?: Json;
          thu_tu?: number;
          hoat_dong?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          ma_goi?: "pro_thang" | "pro_nam";
          ten?: string;
          mo_ta?: string | null;
          thoi_han_ngay?: number;
          gia?: number;
          quyen_loi?: Json;
          thu_tu?: number;
          hoat_dong?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      goi_nguoi_dung: {
        Row: {
          id: string;
          nguoi_dung_id: string;
          goi_id: string;
          ngay_bat_dau: string;
          ngay_het_han: string;
          trang_thai: "hoat_dong" | "het_han" | "huy";
          cap_boi_admin: boolean;
          ghi_chu: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          nguoi_dung_id: string;
          goi_id: string;
          ngay_bat_dau?: string;
          ngay_het_han: string;
          trang_thai?: "hoat_dong" | "het_han" | "huy";
          cap_boi_admin?: boolean;
          ghi_chu?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          nguoi_dung_id?: string;
          goi_id?: string;
          ngay_bat_dau?: string;
          ngay_het_han?: string;
          trang_thai?: "hoat_dong" | "het_han" | "huy";
          cap_boi_admin?: boolean;
          ghi_chu?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "goi_nguoi_dung_nguoi_dung_id_fkey";
            columns: ["nguoi_dung_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "goi_nguoi_dung_goi_id_fkey";
            columns: ["goi_id"];
            isOneToOne: false;
            referencedRelation: "goi_premium";
            referencedColumns: ["id"];
          }
        ];
      };
      yeu_cau_nang_cap: {
        Row: {
          id: string;
          ma_yeu_cau: string;
          nguoi_dung_id: string;
          goi_id: string;
          trang_thai: "cho_duyet" | "da_duyet" | "tu_choi" | "da_huy";
          thanh_toan_id: string | null;
          ly_do_tu_choi: string | null;
          nguoi_duyet_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          ma_yeu_cau: string;
          nguoi_dung_id: string;
          goi_id: string;
          trang_thai?: "cho_duyet" | "da_duyet" | "tu_choi" | "da_huy";
          thanh_toan_id?: string | null;
          ly_do_tu_choi?: string | null;
          nguoi_duyet_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          ma_yeu_cau?: string;
          nguoi_dung_id?: string;
          goi_id?: string;
          trang_thai?: "cho_duyet" | "da_duyet" | "tu_choi" | "da_huy";
          thanh_toan_id?: string | null;
          ly_do_tu_choi?: string | null;
          nguoi_duyet_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "yeu_cau_nang_cap_nguoi_dung_id_fkey";
            columns: ["nguoi_dung_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "yeu_cau_nang_cap_goi_id_fkey";
            columns: ["goi_id"];
            isOneToOne: false;
            referencedRelation: "goi_premium";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "yeu_cau_nang_cap_thanh_toan_id_fkey";
            columns: ["thanh_toan_id"];
            isOneToOne: false;
            referencedRelation: "thanh_toan";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "yeu_cau_nang_cap_nguoi_duyet_id_fkey";
            columns: ["nguoi_duyet_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      quyen_nguoi_dung: {
        Row: {
          nguoi_dung_id: string;
          la_pro: boolean;
          goi_hien_tai_id: string | null;
          ngay_het_han: string | null;
          cap_nhat_luc: string;
        };
        Insert: {
          nguoi_dung_id: string;
          la_pro?: boolean;
          goi_hien_tai_id?: string | null;
          ngay_het_han?: string | null;
          cap_nhat_luc?: string;
        };
        Update: {
          nguoi_dung_id?: string;
          la_pro?: boolean;
          goi_hien_tai_id?: string | null;
          ngay_het_han?: string | null;
          cap_nhat_luc?: string;
        };
        Relationships: [
          {
            foreignKeyName: "quyen_nguoi_dung_nguoi_dung_id_fkey";
            columns: ["nguoi_dung_id"];
            isOneToOne: true;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "quyen_nguoi_dung_goi_hien_tai_id_fkey";
            columns: ["goi_hien_tai_id"];
            isOneToOne: false;
            referencedRelation: "goi_premium";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      tang_luot_xem_cong_thuc: {
        Args: {
          p_id: string;
        };
        Returns: undefined;
      };
      co_quyen_hoc: {
        Args: {
          p_id: string;
        };
        Returns: boolean;
      };
      la_pro: {
        Args: {
          p_nguoi_dung_id: string;
        };
        Returns: boolean;
      };
      kiem_tra_het_han_goi: {
        Args: Record<PropertyKey, never>;
        Returns: undefined;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};
