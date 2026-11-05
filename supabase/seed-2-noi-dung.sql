-- Seed noi dung dot 2 (Part C): 7 cong thuc, 7 khoa hoc (21 bai hoc, 63 cau hoi), 14 bai viet.
-- Idempotent: moi insert deu kiem tra slug/thu_tu chua ton tai moi them. Da ap dung len DB live 2026-11-05.

insert into cong_thuc (tieu_de, slug, mo_ta, anh_dai_dien, nguyen_lieu, cac_buoc, thoi_gian_chuan_bi, thoi_gian_nau, khau_phan, do_kho, calories, tac_gia_id, trang_thai, noi_bat)
select 'Cá kho tộ', 'ca-kho-to', 'Cá kho tộ miền Nam chuẩn vị với thịt cá săn chắc thấm đẫm nước kho nâu cánh gián, vị mặn ngọt đậm đà xen chút cay nồng của tiêu và ớt. Công thức hướng dẫn từ khâu thắng nước màu, ướp cá cho hết tanh đến kỹ thuật kho hai lửa trong tộ đất để cá ráo nước, bóng đẹp và ăn hao cơm vô cùng.', 'https://images.unsplash.com/photo-1574484284002-952d92456975?w=800', '[{"ten": "Cá lóc (hoặc cá basa/cá hú)", "so_luong": 700, "don_vi": "g"}, {"ten": "Thịt ba chỉ", "so_luong": 150, "don_vi": "g"}, {"ten": "Đường (thắng nước màu)", "so_luong": 2, "don_vi": "thìa canh"}, {"ten": "Nước mắm ngon", "so_luong": 4, "don_vi": "thìa canh"}, {"ten": "Đường (nêm kho)", "so_luong": 1, "don_vi": "thìa canh"}, {"ten": "Nước dừa tươi", "so_luong": 300, "don_vi": "ml"}, {"ten": "Hành tím băm", "so_luong": 2, "don_vi": "thìa canh"}, {"ten": "Tỏi băm", "so_luong": 1, "don_vi": "thìa canh"}, {"ten": "Gừng thái sợi", "so_luong": 20, "don_vi": "g"}, {"ten": "Ớt hiểm", "so_luong": 3, "don_vi": "quả"}, {"ten": "Tiêu xay", "so_luong": 1, "don_vi": "thìa cà phê"}, {"ten": "Hành lá", "so_luong": 3, "don_vi": "cây"}, {"ten": "Dầu ăn", "so_luong": 2, "don_vi": "thìa canh"}, {"ten": "Muối", "so_luong": 1, "don_vi": "thìa cà phê"}]'::jsonb, '[{"thu_tu": 1, "noi_dung": "Sơ chế cá: cá làm sạch, cắt khúc dày 2,5-3cm, rửa với nước muối loãng và ít gừng đập dập để khử nhớt và mùi tanh, để thật ráo nước (cá ướt sẽ làm nước kho bị loãng và tanh). Ba chỉ thái miếng nhỏ vừa ăn."}, {"thu_tu": 2, "noi_dung": "Ướp cá: ướp cá với 1 thìa canh nước mắm, hành tím băm, tỏi băm, tiêu và 1/2 thìa cà phê muối trong 20-30 phút cho thấm. Ướp trước giúp thịt cá săn, khi kho không bị nát và thấm vị từ trong ra."}, {"thu_tu": 3, "noi_dung": "Thắng nước màu: cho 2 thìa canh đường và 1 thìa canh nước vào tộ đất (hoặc nồi đáy dày), đun lửa vừa, không khuấy mà chỉ lắc nhẹ tộ đến khi đường chuyển màu cánh gián đậm thì nhanh tay cho 100ml nước dừa vào để dừng màu. Nước màu quá non cá sẽ nhạt màu, quá già sẽ đắng."}, {"thu_tu": 4, "noi_dung": "Xếp cá vào tộ: cho dầu ăn vào nước màu, phi thơm phần hành tỏi còn lại, xếp ba chỉ xuống đáy rồi xếp cá lên trên, rưới đều phần nước ướp vào. Để lửa lớn cho nồi cá sôi lên khoảng 3 phút để cá săn mặt."}, {"thu_tu": 5, "noi_dung": "Kho lửa thứ nhất: chế phần nước dừa còn lại vào xâm xấp mặt cá, thêm 3 thìa canh nước mắm và 1 thìa canh đường. Đun sôi rồi hạ lửa nhỏ liu riu kho 25-30 phút, không đậy nắp kín (hé nắp) để nước kho sánh dần; thỉnh thoảng nghiêng tộ hoặc múc nước kho rưới lên mặt cá cho thấm đều, tránh đảo làm nát cá."}, {"thu_tu": 6, "noi_dung": "Kho lửa thứ hai: tắt bếp, để cá nghỉ 15-20 phút cho thấm sâu (bước này giúp cá kho để càng lâu càng ngon). Khi gần ăn, mở lửa kho lại 8-10 phút đến khi nước kho sánh keo, bám bóng quanh miếng cá, nêm lại vị mặn ngọt cho vừa miệng."}, {"thu_tu": 7, "noi_dung": "Hoàn thiện: rắc gừng sợi, ớt hiểm nguyên quả và tiêu xay lên mặt, kho thêm 2 phút. Rắc hành lá cắt khúc, tắt bếp và giữ nguyên trong tộ mang ra bàn. Ăn nóng với cơm trắng, rau luộc và canh chua là đúng điệu miền Nam."}]'::jsonb, 35, 45, 4, 'trung_binh', 320, 'c1000000-0000-0000-0000-000000000001', 'xuat_ban', true
where not exists (select 1 from cong_thuc where slug = 'ca-kho-to');
insert into cong_thuc_danh_muc (cong_thuc_id, danh_muc_id)
select id, 'a8370969-5188-4a36-96c8-7782a0d381b6' from cong_thuc where slug = 'ca-kho-to'
and not exists (select 1 from cong_thuc_danh_muc m join cong_thuc c on c.id = m.cong_thuc_id where c.slug = 'ca-kho-to' and m.danh_muc_id = 'a8370969-5188-4a36-96c8-7782a0d381b6');

insert into cong_thuc (tieu_de, slug, mo_ta, anh_dai_dien, nguyen_lieu, cac_buoc, thoi_gian_chuan_bi, thoi_gian_nau, khau_phan, do_kho, calories, tac_gia_id, trang_thai, noi_bat)
select 'Bò lúc lắc', 'bo-luc-lac', 'Bò lúc lắc thơm lừng với thịt bò cắt khối vuông cháy cạnh bên ngoài, mềm mọng bên trong, quyện sốt dầu hào đậm đà cùng ớt chuông và hành tây giòn ngọt. Công thức chỉ rõ cách chọn thịt, ướp với bột bắp và xào lửa lớn thật nhanh để bò không ra nước, không dai, ăn kèm khoai tây chiên và cơm trắng ngon như nhà hàng.', 'https://images.unsplash.com/photo-1607532941433-304659e8198a?w=800', '[{"ten": "Thịt bò thăn (hoặc phi lê)", "so_luong": 500, "don_vi": "g"}, {"ten": "Ớt chuông xanh", "so_luong": 1, "don_vi": "quả"}, {"ten": "Ớt chuông đỏ", "so_luong": 1, "don_vi": "quả"}, {"ten": "Hành tây", "so_luong": 1, "don_vi": "củ"}, {"ten": "Tỏi băm", "so_luong": 2, "don_vi": "thìa canh"}, {"ten": "Dầu hào", "so_luong": 2, "don_vi": "thìa canh"}, {"ten": "Nước tương", "so_luong": 1, "don_vi": "thìa canh"}, {"ten": "Đường", "so_luong": 1, "don_vi": "thìa cà phê"}, {"ten": "Bột bắp", "so_luong": 1, "don_vi": "thìa cà phê"}, {"ten": "Bơ lạt", "so_luong": 20, "don_vi": "g"}, {"ten": "Dầu ăn", "so_luong": 3, "don_vi": "thìa canh"}, {"ten": "Tiêu xay", "so_luong": 1, "don_vi": "thìa cà phê"}, {"ten": "Khoai tây (ăn kèm)", "so_luong": 300, "don_vi": "g"}, {"ten": "Xà lách, cà chua (ăn kèm)", "so_luong": 100, "don_vi": "g"}]'::jsonb, '[{"thu_tu": 1, "noi_dung": "Sơ chế thịt bò: chọn thăn bò tươi màu đỏ sậm, thớ mịn. Thái bò thành khối vuông 2,5cm đều nhau (khối đều thì chín đều). Thấm thật khô bề mặt thịt bằng khăn giấy - thịt khô là điều kiện tiên quyết để cháy cạnh, không bị luộc trong nước thịt."}, {"thu_tu": 2, "noi_dung": "Ướp bò: trộn bò với 1 thìa canh dầu hào, 1 thìa canh nước tương, 1 thìa cà phê đường, tỏi băm, tiêu và bột bắp, thêm 1 thìa canh dầu ăn sau cùng để khóa ẩm. Ướp 20-30 phút trong ngăn mát. Bột bắp tạo lớp áo mỏng giúp thịt mềm và sốt bám đẹp."}, {"thu_tu": 3, "noi_dung": "Sơ chế rau: ớt chuông bỏ hạt cắt miếng vuông 2,5cm bằng cỡ miếng bò, hành tây cắt múi cau rồi tách lớp. Khoai tây gọt vỏ cắt thanh, ngâm nước muối 10 phút, chiên vàng giòn để ăn kèm."}, {"thu_tu": 4, "noi_dung": "Xào bò - quyết định thành bại: dùng chảo gang hoặc chảo đáy dày, đun lửa lớn nhất đến khi chảo gần bốc khói mới cho dầu ăn. Cho một nửa lượng bò vào, dàn một lớp, để yên 40-50 giây cho cháy cạnh rồi mới lắc chảo đảo mặt. Xào tổng cộng khoảng 2 phút đến khi bò chín tái 70%, trút ra đĩa. Làm tương tự với phần bò còn lại - xào từng mẻ nhỏ để chảo không bị hạ nhiệt."}, {"thu_tu": 5, "noi_dung": "Xào rau: vẫn chảo đó, cho bơ lạt vào, phi thơm tỏi, cho hành tây và ớt chuông vào xào lửa lớn 1-2 phút đến khi rau vừa chín tới, còn giòn và bóng dầu."}, {"thu_tu": 6, "noi_dung": "Hòa quyện: cho bò trở lại chảo cùng nước thịt tiết ra, thêm 1 thìa canh dầu hào còn lại, lắc chảo mạnh tay (động tác ''lúc lắc'') khoảng 30 giây cho sốt áo đều, bóng mướt quanh từng miếng bò rồi tắt bếp ngay. Xào quá lâu bò sẽ dai và ra nước."}, {"thu_tu": 7, "noi_dung": "Trình bày: lót xà lách và cà chua thái lát ra đĩa, trút bò lúc lắc lên trên, rắc thêm tiêu xay. Ăn nóng kèm khoai tây chiên, cơm trắng hoặc bánh mì; chấm tương ớt hoặc muối tiêu chanh đều ngon."}]'::jsonb, 35, 15, 3, 'trung_binh', 480, 'c1000000-0000-0000-0000-000000000001', 'xuat_ban', true
where not exists (select 1 from cong_thuc where slug = 'bo-luc-lac');
insert into cong_thuc_danh_muc (cong_thuc_id, danh_muc_id)
select id, 'a8370969-5188-4a36-96c8-7782a0d381b6' from cong_thuc where slug = 'bo-luc-lac'
and not exists (select 1 from cong_thuc_danh_muc m join cong_thuc c on c.id = m.cong_thuc_id where c.slug = 'bo-luc-lac' and m.danh_muc_id = 'a8370969-5188-4a36-96c8-7782a0d381b6');

insert into cong_thuc (tieu_de, slug, mo_ta, anh_dai_dien, nguyen_lieu, cac_buoc, thoi_gian_chuan_bi, thoi_gian_nau, khau_phan, do_kho, calories, tac_gia_id, trang_thai, noi_bat)
select 'Súp cua', 'sup-cua', 'Súp cua nóng hổi sánh mịn, thơm ngọt vị cua biển và nước dùng gà, điểm xuyết trứng cút, nấm và những sợi trứng vàng óng đẹp mắt. Công thức hướng dẫn cách nấu nước dùng trong, kỹ thuật tạo độ sánh bằng bột năng và rót trứng thành sợi mỏng không vón cục, cho chén súp chuẩn vị hàng quán ngay tại nhà.', 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800', '[{"ten": "Thịt cua gỡ sẵn (hoặc 2 con cua biển)", "so_luong": 200, "don_vi": "g"}, {"ten": "Ức gà", "so_luong": 200, "don_vi": "g"}, {"ten": "Xương gà (nấu nước dùng)", "so_luong": 500, "don_vi": "g"}, {"ten": "Trứng gà", "so_luong": 2, "don_vi": "quả"}, {"ten": "Trứng cút", "so_luong": 12, "don_vi": "quả"}, {"ten": "Nấm đông cô tươi", "so_luong": 80, "don_vi": "g"}, {"ten": "Bắp Mỹ (tách hạt)", "so_luong": 100, "don_vi": "g"}, {"ten": "Cà rốt", "so_luong": 60, "don_vi": "g"}, {"ten": "Bột năng", "so_luong": 4, "don_vi": "thìa canh"}, {"ten": "Nước lọc (nấu dùng)", "so_luong": 1.5, "don_vi": "lít"}, {"ten": "Hạt nêm", "so_luong": 2, "don_vi": "thìa cà phê"}, {"ten": "Muối", "so_luong": 1, "don_vi": "thìa cà phê"}, {"ten": "Đường", "so_luong": 1, "don_vi": "thìa cà phê"}, {"ten": "Tiêu xay", "so_luong": 1, "don_vi": "thìa cà phê"}, {"ten": "Ngò rí", "so_luong": 20, "don_vi": "g"}, {"ten": "Dầu mè", "so_luong": 1, "don_vi": "thìa cà phê"}]'::jsonb, '[{"thu_tu": 1, "noi_dung": "Nấu nước dùng: xương gà chần qua nước sôi 3 phút, rửa sạch, ninh với 1,5 lít nước lạnh và vài lát hành tím trong 35-40 phút lửa nhỏ, hớt bọt thường xuyên để nước dùng trong và ngọt thanh. Lọc lấy nước dùng, bỏ xương."}, {"thu_tu": 2, "noi_dung": "Chuẩn bị nguyên liệu: luộc ức gà trong nước dùng cho chín, vớt ra xé sợi nhỏ. Trứng cút luộc chín, bóc vỏ. Nấm đông cô thái sợi, cà rốt thái hạt lựu nhỏ, bắp tách hạt. Thịt cua nhặt sạch mảnh vỏ còn sót, xào sơ với chút dầu và tiêu cho thơm, hết tanh."}, {"thu_tu": 3, "noi_dung": "Nấu nền súp: đun sôi nước dùng, cho cà rốt và bắp vào nấu 3 phút, tiếp đến cho nấm, thịt gà xé và trứng cút vào. Nêm muối, hạt nêm, đường; vị súp cần thanh ngọt, hơi nhạt để khi ăn còn rưới thêm dầu mè và tiêu."}, {"thu_tu": 4, "noi_dung": "Tạo độ sánh: hòa bột năng với 100ml nước lạnh cho tan hoàn toàn. Hạ lửa vừa, một tay khuấy nồi súp theo một chiều, một tay rót từ từ nước bột năng vào đến khi súp sánh nhẹ, bám muỗng là dừng (có thể không dùng hết bột). Đun thêm 1 phút cho bột chín trong, không còn vị bột sống."}, {"thu_tu": 5, "noi_dung": "Rót trứng tạo sợi: đánh tan 2 quả trứng. Giữ nồi súp sôi nhẹ, khuấy tạo dòng xoáy chậm rồi rót trứng thành dòng mảnh qua rây hoặc qua đầu đũa, đợi 10 giây mới khuấy nhẹ một vòng để trứng kết thành sợi mỏng vàng óng, không vón cục."}, {"thu_tu": 6, "noi_dung": "Hoàn thiện: cho thịt cua đã xào lên mặt (để sau cùng để cua không nát), rắc ngò rí thái nhỏ, vài giọt dầu mè và tiêu xay. Múc ra chén ăn nóng; có thể thêm trứng bắc thảo cắt múi cau và chấm kèm tương ớt, nước tương tùy thích."}]'::jsonb, 25, 50, 4, 'trung_binh', 180, 'c1000000-0000-0000-0000-000000000001', 'xuat_ban', false
where not exists (select 1 from cong_thuc where slug = 'sup-cua');
insert into cong_thuc_danh_muc (cong_thuc_id, danh_muc_id)
select id, 'f88177bc-69b4-43fb-94de-914851cee09a' from cong_thuc where slug = 'sup-cua'
and not exists (select 1 from cong_thuc_danh_muc m join cong_thuc c on c.id = m.cong_thuc_id where c.slug = 'sup-cua' and m.danh_muc_id = 'f88177bc-69b4-43fb-94de-914851cee09a');
insert into cong_thuc_danh_muc (cong_thuc_id, danh_muc_id)
select id, '1f5284ea-1bf3-46f2-9f3b-7ccbbb0f63ec' from cong_thuc where slug = 'sup-cua'
and not exists (select 1 from cong_thuc_danh_muc m join cong_thuc c on c.id = m.cong_thuc_id where c.slug = 'sup-cua' and m.danh_muc_id = '1f5284ea-1bf3-46f2-9f3b-7ccbbb0f63ec');

insert into cong_thuc (tieu_de, slug, mo_ta, anh_dai_dien, nguyen_lieu, cac_buoc, thoi_gian_chuan_bi, thoi_gian_nau, khau_phan, do_kho, calories, tac_gia_id, trang_thai, noi_bat)
select 'Gà rán vỏ giòn', 'ga-ran-vo-gion', 'Gà rán vỏ giòn rụm kiểu tiệm với lớp bột xù vảy đẹp, thịt bên trong mọng nước thấm vị sữa chua và gia vị. Công thức tiết lộ bí quyết ngâm gà trong sữa lên men, pha bột hai lớp khô - ướt và chiên hai lần ở nhiệt độ chuẩn để vỏ giòn lâu, không ngấm dầu, ngon không kém thương hiệu nổi tiếng.', 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=800', '[{"ten": "Đùi gà góc tư (hoặc cánh gà)", "so_luong": 1, "don_vi": "kg"}, {"ten": "Sữa tươi không đường (ngâm gà)", "so_luong": 300, "don_vi": "ml"}, {"ten": "Sữa chua không đường", "so_luong": 100, "don_vi": "g"}, {"ten": "Bột mì đa dụng", "so_luong": 250, "don_vi": "g"}, {"ten": "Bột bắp", "so_luong": 80, "don_vi": "g"}, {"ten": "Bột nở (baking powder)", "so_luong": 1, "don_vi": "thìa cà phê"}, {"ten": "Bột tỏi", "so_luong": 1, "don_vi": "thìa cà phê"}, {"ten": "Bột hành", "so_luong": 1, "don_vi": "thìa cà phê"}, {"ten": "Bột ớt paprika (hoặc ớt bột)", "so_luong": 1, "don_vi": "thìa cà phê"}, {"ten": "Muối", "so_luong": 2, "don_vi": "thìa cà phê"}, {"ten": "Tiêu xay", "so_luong": 1, "don_vi": "thìa cà phê"}, {"ten": "Trứng gà", "so_luong": 1, "don_vi": "quả"}, {"ten": "Dầu ăn (để chiên ngập)", "so_luong": 1, "don_vi": "lít"}]'::jsonb, '[{"thu_tu": 1, "noi_dung": "Ngâm gà làm mềm thịt: gà rửa sạch, khía vài đường ở phần thịt dày. Ngâm gà trong sữa tươi pha sữa chua và 1 thìa cà phê muối tối thiểu 1 giờ, ngon nhất 4-6 giờ trong ngăn mát. Axit nhẹ trong sữa giúp thịt mềm, mọng nước và khử mùi hôi đặc trưng."}, {"thu_tu": 2, "noi_dung": "Pha bột khô: trộn bột mì, bột bắp, bột nở cùng bột tỏi, bột hành, paprika, 1 thìa cà phê muối và tiêu. Chia bột khô làm hai phần: một phần để lăn lớp đầu, một phần để tạo vảy ở bước sau. Bột bắp và bột nở là chìa khóa giúp vỏ giòn xốp."}, {"thu_tu": 3, "noi_dung": "Lăn bột lớp một: vớt gà khỏi sữa (giữ lại nước ngâm), để ráo bớt nhưng vẫn còn ẩm. Lăn từng miếng qua bột khô, ấn nhẹ cho bột bám đều rồi giũ bớt bột thừa. Lớp bột mỏng này giúp lớp vỏ chính bám chắc, không bị bong khi chiên."}, {"thu_tu": 4, "noi_dung": "Tạo vảy giòn: đánh trứng vào phần nước sữa ngâm gà còn lại, khuấy đều làm hỗn hợp ướt. Nhúng miếng gà đã lăn bột vào hỗn hợp ướt, rồi lăn lại vào phần bột khô thứ hai, dùng tay bóp nhẹ và xới bột để tạo những vảy bột xù tự nhiên. Xếp gà ra khay, nghỉ 10 phút cho bột bám chặt."}, {"thu_tu": 5, "noi_dung": "Chiên lần một: đun dầu ngập trong nồi sâu đến 170°C (thử bằng đũa gỗ thấy sủi tăm đều). Thả gà vào chiên 10-12 phút đến khi vỏ vàng nhạt, thịt chín tới; chiên từng mẻ 3-4 miếng để dầu không hạ nhiệt. Vớt ra để ráo trên vỉ, nghỉ 10 phút."}, {"thu_tu": 6, "noi_dung": "Chiên lần hai cho giòn lâu: nâng dầu lên 180°C, chiên lại mỗi mẻ 2-3 phút đến khi vỏ vàng nâu, giòn rụm. Vớt ra vỉ cho ráo dầu (không để lên giấy thấm lâu làm vỏ mềm hơi). Rắc chút muối tiêu khi gà còn nóng."}, {"thu_tu": 7, "noi_dung": "Thưởng thức: ăn ngay khi nóng với tương ớt, tương cà, mayonnaise hoặc sốt mật ong tỏi. Gà đạt chuẩn khi vỏ giòn nghe tiếng rôm rốp, thịt bên trong chín trắng, mọng nước. Phần thừa bảo quản ngăn mát, khi ăn lại nướng lò 180°C 8 phút để vỏ giòn trở lại."}]'::jsonb, 80, 30, 4, 'trung_binh', 540, 'c1000000-0000-0000-0000-000000000001', 'xuat_ban', true
where not exists (select 1 from cong_thuc where slug = 'ga-ran-vo-gion');
insert into cong_thuc_danh_muc (cong_thuc_id, danh_muc_id)
select id, '3d2595df-e3a3-4035-8f7a-541c80b0c2be' from cong_thuc where slug = 'ga-ran-vo-gion'
and not exists (select 1 from cong_thuc_danh_muc m join cong_thuc c on c.id = m.cong_thuc_id where c.slug = 'ga-ran-vo-gion' and m.danh_muc_id = '3d2595df-e3a3-4035-8f7a-541c80b0c2be');

insert into cong_thuc (tieu_de, slug, mo_ta, anh_dai_dien, nguyen_lieu, cac_buoc, thoi_gian_chuan_bi, thoi_gian_nau, khau_phan, do_kho, calories, tac_gia_id, trang_thai, noi_bat)
select 'Cà ri gà', 'ca-ri-ga', 'Cà ri gà nước cốt dừa thơm béo, vàng óng màu bột cà ri và sả, gà mềm thấm vị, khoai lang khoai tây bùi ngọt, chấm bánh mì hay ăn với cơm, bún đều tuyệt. Công thức hướng dẫn cách xào bột cà ri cho dậy mùi không đắng, thứ tự cho nước cốt dừa để không tách dầu và nêm vị ngọt mặn cân bằng kiểu miền Tây.', 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800', '[{"ten": "Gà ta (chặt miếng vừa ăn)", "so_luong": 1, "don_vi": "kg"}, {"ten": "Khoai lang", "so_luong": 300, "don_vi": "g"}, {"ten": "Khoai tây", "so_luong": 250, "don_vi": "g"}, {"ten": "Hành tây", "so_luong": 1, "don_vi": "củ"}, {"ten": "Bột cà ri", "so_luong": 3, "don_vi": "thìa canh"}, {"ten": "Nước cốt dừa (phần đặc)", "so_luong": 200, "don_vi": "ml"}, {"ten": "Nước dão dừa (hoặc nước lọc)", "so_luong": 700, "don_vi": "ml"}, {"ten": "Sả cây", "so_luong": 3, "don_vi": "cây"}, {"ten": "Hành tím băm", "so_luong": 2, "don_vi": "thìa canh"}, {"ten": "Tỏi băm", "so_luong": 1, "don_vi": "thìa canh"}, {"ten": "Đường", "so_luong": 2, "don_vi": "thìa canh"}, {"ten": "Hạt nêm", "so_luong": 2, "don_vi": "thìa cà phê"}, {"ten": "Muối", "so_luong": 1, "don_vi": "thìa cà phê"}, {"ten": "Dầu ăn", "so_luong": 3, "don_vi": "thìa canh"}, {"ten": "Lá cà ri (nếu có)", "so_luong": 5, "don_vi": "g"}, {"ten": "Ớt bột (tùy chọn)", "so_luong": 1, "don_vi": "thìa cà phê"}]'::jsonb, '[{"thu_tu": 1, "noi_dung": "Sơ chế và ướp gà: gà chặt miếng vừa ăn, rửa nước muối loãng, để ráo. Ướp gà với 1 thìa canh bột cà ri, hành tím băm, 1 thìa cà phê muối, 1 thìa cà phê hạt nêm và 1 thìa canh đường trong 30 phút cho thấm và lên màu đẹp."}, {"thu_tu": 2, "noi_dung": "Chuẩn bị khoai: khoai lang và khoai tây gọt vỏ, cắt khối lớn 3-4cm (cắt nhỏ sẽ nát khi nấu), ngâm nước muối loãng cho khỏi thâm. Chiên sơ khoai trong dầu nóng đến khi xém cạnh vàng nhẹ - bước này giúp khoai thơm, giữ nguyên khối, không làm đục và chua nước cà ri."}, {"thu_tu": 3, "noi_dung": "Xào cà ri dậy mùi: cho dầu ăn vào nồi, phi thơm sả đập dập cắt khúc, hành tỏi băm và lá cà ri. Hạ lửa vừa, cho 2 thìa canh bột cà ri còn lại vào xào 30 giây đến khi dầu chuyển màu vàng cam thơm nức. Xào bột cà ri lửa nhỏ và nhanh tay, để cháy sẽ đắng."}, {"thu_tu": 4, "noi_dung": "Xào gà: cho gà đã ướp vào nồi, đảo lửa lớn 5-7 phút đến khi thịt gà săn lại, áo đều màu cà ri và hơi xém cạnh. Cho nước dão dừa (hoặc nước lọc) vào xâm xấp, đun sôi, hớt bọt, hạ lửa vừa ninh 15 phút."}, {"thu_tu": 5, "noi_dung": "Cho khoai và cốt dừa: cho khoai đã chiên sơ vào nấu tiếp 12-15 phút đến khi khoai mềm bùi, gà chín mềm. Cuối cùng mới cho nước cốt dừa đặc vào, khuấy nhẹ, đun sôi lăn tăn 2-3 phút rồi tắt bếp ngay - cốt dừa nấu sôi lâu sẽ tách dầu và mất mùi thơm."}, {"thu_tu": 6, "noi_dung": "Nêm nếm và hoàn thiện: nêm lại đường, muối cho vị ngọt mặn cân bằng, hơi thiên ngọt nhẹ kiểu miền Tây. Thả hành tây cắt múi cau vào đảo 1 phút cho vừa chín tới. Múc ra tô, ăn nóng chấm bánh mì, hoặc chan cơm, bún tươi, kèm muối ớt chanh và rau thơm."}]'::jsonb, 40, 45, 4, 'trung_binh', 460, 'c1000000-0000-0000-0000-000000000001', 'xuat_ban', false
where not exists (select 1 from cong_thuc where slug = 'ca-ri-ga');
insert into cong_thuc_danh_muc (cong_thuc_id, danh_muc_id)
select id, 'a8370969-5188-4a36-96c8-7782a0d381b6' from cong_thuc where slug = 'ca-ri-ga'
and not exists (select 1 from cong_thuc_danh_muc m join cong_thuc c on c.id = m.cong_thuc_id where c.slug = 'ca-ri-ga' and m.danh_muc_id = 'a8370969-5188-4a36-96c8-7782a0d381b6');
insert into cong_thuc_danh_muc (cong_thuc_id, danh_muc_id)
select id, 'f88177bc-69b4-43fb-94de-914851cee09a' from cong_thuc where slug = 'ca-ri-ga'
and not exists (select 1 from cong_thuc_danh_muc m join cong_thuc c on c.id = m.cong_thuc_id where c.slug = 'ca-ri-ga' and m.danh_muc_id = 'f88177bc-69b4-43fb-94de-914851cee09a');

insert into cong_thuc (tieu_de, slug, mo_ta, anh_dai_dien, nguyen_lieu, cac_buoc, thoi_gian_chuan_bi, thoi_gian_nau, khau_phan, do_kho, calories, tac_gia_id, trang_thai, noi_bat)
select 'Lẩu Thái chua cay', 'lau-thai-chua-cay', 'Nồi lẩu Thái chua cay thơm nức mùi sả, riềng, lá chanh và sa tế, nước dùng đỏ cam sóng sánh, chua cay mặn ngọt cân bằng, nhúng tôm mực hải sản tươi giòn cùng rau nấm và bún. Công thức xây dựng nền nước lẩu từ xương và đầu tôm, hướng dẫn thứ tự nhúng đồ và cách pha nước chấm hải sản chuẩn vị quán Thái.', 'https://images.unsplash.com/photo-1559847844-5315695dadae?w=800', '[{"ten": "Xương heo (nấu nước dùng)", "so_luong": 500, "don_vi": "g"}, {"ten": "Tôm sú tươi", "so_luong": 400, "don_vi": "g"}, {"ten": "Mực tươi", "so_luong": 300, "don_vi": "g"}, {"ten": "Nghêu", "so_luong": 500, "don_vi": "g"}, {"ten": "Cá viên", "so_luong": 200, "don_vi": "g"}, {"ten": "Sả cây", "so_luong": 4, "don_vi": "cây"}, {"ten": "Riềng", "so_luong": 40, "don_vi": "g"}, {"ten": "Lá chanh Thái (chanh chúc)", "so_luong": 6, "don_vi": "lá"}, {"ten": "Sa tế tôm", "so_luong": 2, "don_vi": "thìa canh"}, {"ten": "Tương ớt", "so_luong": 2, "don_vi": "thìa canh"}, {"ten": "Nước mắm", "so_luong": 3, "don_vi": "thìa canh"}, {"ten": "Đường", "so_luong": 2, "don_vi": "thìa canh"}, {"ten": "Chanh (nước cốt)", "so_luong": 3, "don_vi": "quả"}, {"ten": "Cà chua", "so_luong": 2, "don_vi": "quả"}, {"ten": "Nấm rơm", "so_luong": 200, "don_vi": "g"}, {"ten": "Rau muống, rau nhút, bắp chuối", "so_luong": 500, "don_vi": "g"}, {"ten": "Bún tươi", "so_luong": 1, "don_vi": "kg"}, {"ten": "Nước lọc", "so_luong": 2, "don_vi": "lít"}]'::jsonb, '[{"thu_tu": 1, "noi_dung": "Nấu nền nước dùng: xương heo chần nước sôi 5 phút, rửa sạch, ninh với 2 lít nước trong 45 phút lửa nhỏ, hớt bọt cho nước trong. Đầu và vỏ tôm (lấy từ phần tôm nhúng lẩu) rang với chút dầu đến đỏ thơm rồi cho vào ninh cùng 15 phút, sau đó lọc bỏ xác - nền nước ngọt sâu và thơm mùi tôm là linh hồn của lẩu Thái ngon."}, {"thu_tu": 2, "noi_dung": "Sơ chế đồ nhúng: tôm cắt râu, rút chỉ đen, để nguyên vỏ cho ngọt. Mực làm sạch, khía vảy rồng, cắt miếng vừa ăn. Nghêu ngâm nước muối ớt 1 giờ cho nhả cát, rửa sạch. Cá viên, nấm rửa sạch; rau các loại nhặt rửa, để ráo, bày ra đĩa lớn."}, {"thu_tu": 3, "noi_dung": "Xào gia vị lẩu: phi thơm sả đập dập cắt khúc, riềng thái lát và hành tím với dầu ăn; cho sa tế và tương ớt vào xào lửa nhỏ đến khi dầu nổi màu đỏ đẹp. Trút hỗn hợp này vào nồi nước dùng, thả lá chanh vò nhẹ và cà chua cắt múi cau."}, {"thu_tu": 4, "noi_dung": "Nêm nước lẩu: đun sôi nước dùng, nêm nước mắm, đường và muối cho đạt vị mặn ngọt trước, cuối cùng mới cho nước cốt chanh vào từng chút và nếm đến khi chua cay cân bằng (cho chanh sớm hoặc đun sôi lâu sẽ đắng và mất hương). Vị chuẩn: chua thanh, cay nồng, mặn ngọt hài hòa, thơm mùi sả chanh."}, {"thu_tu": 5, "noi_dung": "Trình tự nhúng lẩu: dọn nồi lẩu ra bàn ăn giữ sôi nhẹ. Nhúng theo thứ tự: nghêu và cá viên trước cho nước thêm ngọt, đến tôm mực (chỉ nhúng 1-2 phút đến khi vừa cong, chín tới - nhúng lâu hải sản dai và teo), nấm, cuối cùng là rau và bún. Vớt đồ nhúng ra ngay khi chín để giữ độ giòn ngọt."}, {"thu_tu": 6, "noi_dung": "Nước chấm hải sản: giã nhuyễn 3 quả ớt hiểm, 2 tép tỏi với 1 thìa canh đường, pha 2 thìa canh nước mắm, 1 thìa canh nước cốt chanh và ít ngò rí băm. Ăn lẩu kèm bún tươi, chan nước lẩu nóng hổi; cuối bữa nước lẩu đã thấm vị hải sản là lúc ngon nhất để chan bún."}]'::jsonb, 45, 60, 5, 'trung_binh', 380, 'c1000000-0000-0000-0000-000000000001', 'xuat_ban', true
where not exists (select 1 from cong_thuc where slug = 'lau-thai-chua-cay');
insert into cong_thuc_danh_muc (cong_thuc_id, danh_muc_id)
select id, 'f88177bc-69b4-43fb-94de-914851cee09a' from cong_thuc where slug = 'lau-thai-chua-cay'
and not exists (select 1 from cong_thuc_danh_muc m join cong_thuc c on c.id = m.cong_thuc_id where c.slug = 'lau-thai-chua-cay' and m.danh_muc_id = 'f88177bc-69b4-43fb-94de-914851cee09a');
insert into cong_thuc_danh_muc (cong_thuc_id, danh_muc_id)
select id, '1f5284ea-1bf3-46f2-9f3b-7ccbbb0f63ec' from cong_thuc where slug = 'lau-thai-chua-cay'
and not exists (select 1 from cong_thuc_danh_muc m join cong_thuc c on c.id = m.cong_thuc_id where c.slug = 'lau-thai-chua-cay' and m.danh_muc_id = '1f5284ea-1bf3-46f2-9f3b-7ccbbb0f63ec');

insert into cong_thuc (tieu_de, slug, mo_ta, anh_dai_dien, nguyen_lieu, cac_buoc, thoi_gian_chuan_bi, thoi_gian_nau, khau_phan, do_kho, calories, tac_gia_id, trang_thai, noi_bat)
select 'Chè ba màu', 'che-ba-mau', 'Ly chè ba màu mát lạnh đẹp mắt với đậu đỏ mềm bùi, thạch sương sáo đen bóng, bánh lọt lá dứa xanh thơm quyện nước cốt dừa béo ngậy và đá bào. Công thức hướng dẫn nấu đậu không sượng, làm bánh lọt dẻo dai bằng bột năng và bột gạo, cùng cách nấu cốt dừa sánh thơm không tách nước, chuẩn vị chè Nam Bộ.', 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=800', '[{"ten": "Đậu đỏ hạt nhỏ", "so_luong": 200, "don_vi": "g"}, {"ten": "Bột năng (làm bánh lọt)", "so_luong": 120, "don_vi": "g"}, {"ten": "Bột gạo (làm bánh lọt)", "so_luong": 30, "don_vi": "g"}, {"ten": "Lá dứa tươi", "so_luong": 100, "don_vi": "g"}, {"ten": "Thạch sương sáo đen (bột)", "so_luong": 25, "don_vi": "g"}, {"ten": "Nước cốt dừa", "so_luong": 400, "don_vi": "ml"}, {"ten": "Đường cát (nấu đậu và nước đường)", "so_luong": 200, "don_vi": "g"}, {"ten": "Đường phèn (nấu cốt dừa, tùy chọn)", "so_luong": 30, "don_vi": "g"}, {"ten": "Bột bắp (tạo sánh cốt dừa)", "so_luong": 1, "don_vi": "thìa cà phê"}, {"ten": "Muối", "so_luong": 1, "don_vi": "thìa cà phê"}, {"ten": "Nước lọc", "so_luong": 1.2, "don_vi": "lít"}, {"ten": "Đá bào", "so_luong": 500, "don_vi": "g"}, {"ten": "Sữa đặc (tùy chọn)", "so_luong": 2, "don_vi": "thìa canh"}]'::jsonb, '[{"thu_tu": 1, "noi_dung": "Nấu đậu đỏ: đậu vo sạch, ngâm nước 6-8 giờ (qua đêm) cho nở đều. Ninh đậu với 800ml nước lửa nhỏ 40-50 phút đến khi hạt đậu mềm bở mà không nát; chỉ cho 80g đường vào khi đậu đã mềm hẳn (cho đường sớm đậu sẽ sượng, không mềm được). Thêm chút muối cho vị đậm, để nguội rồi cho vào ngăn mát."}, {"thu_tu": 2, "noi_dung": "Làm thạch sương sáo: hòa bột sương sáo với 400ml nước và 30g đường, khuấy tan, đun sôi nhẹ 2 phút, đổ ra khuôn. Để nguội rồi cho vào tủ lạnh ít nhất 1 giờ cho thạch đông chắc, cắt khối vuông nhỏ vừa ăn."}, {"thu_tu": 3, "noi_dung": "Làm nước lá dứa: lá dứa rửa sạch, cắt nhỏ, xay với 250ml nước, lọc kỹ lấy nước cốt xanh. Để lắng 30 phút, gạn lấy phần nước xanh đậm phía dưới để bánh lọt lên màu đẹp và thơm."}, {"thu_tu": 4, "noi_dung": "Làm bánh lọt: trộn bột năng và bột gạo, chế từ từ nước lá dứa ấm vào nhồi thành khối bột dẻo mịn. Đun nồi nước sôi, ép bột qua rổ thưa (hoặc cho vào túi bắt kem cắt đầu lớn) thành sợi ngắn rơi xuống nồi; bánh lọt nổi lên là chín, vớt ngay vào tô nước đá cho dai giòn, không dính."}, {"thu_tu": 5, "noi_dung": "Nấu nước cốt dừa: cho cốt dừa vào nồi cùng 30g đường phèn (hoặc đường cát), 1/4 thìa cà phê muối và nước bột bắp đã hòa tan. Đun lửa nhỏ, khuấy đều tay đến khi cốt dừa vừa sôi lăn tăn, hơi sánh thì tắt bếp ngay - không đun sôi lớn để tránh tách dầu. Để nguội, bảo quản ngăn mát."}, {"thu_tu": 6, "noi_dung": "Nấu nước đường chan: đun 90g đường còn lại với 100ml nước và vài lá dứa cho thơm, để nguội. Nước đường giúp điều chỉnh độ ngọt khi ăn và làm ly chè trong, không bị đục như khi chỉ dùng sữa đặc."}, {"thu_tu": 7, "noi_dung": "Xếp ly và thưởng thức: cho lần lượt đậu đỏ, bánh lọt, thạch sương sáo vào ly, thêm đá bào đầy ly, chan 2-3 thìa canh nước đường rồi rưới cốt dừa lên trên (thêm sữa đặc nếu thích béo ngọt). Trộn đều và ăn ngay khi còn lạnh; từng lớp màu đỏ - xanh - đen trắng xen nhau rất đẹp mắt."}]'::jsonb, 60, 60, 4, 'trung_binh', 340, 'c1000000-0000-0000-0000-000000000001', 'xuat_ban', false
where not exists (select 1 from cong_thuc where slug = 'che-ba-mau');
insert into cong_thuc_danh_muc (cong_thuc_id, danh_muc_id)
select id, '439254a4-bb0e-4b98-bdd3-45dc686680f2' from cong_thuc where slug = 'che-ba-mau'
and not exists (select 1 from cong_thuc_danh_muc m join cong_thuc c on c.id = m.cong_thuc_id where c.slug = 'che-ba-mau' and m.danh_muc_id = '439254a4-bb0e-4b98-bdd3-45dc686680f2');

insert into khoa_hoc (tieu_de, slug, mo_ta, mo_ta_chi_tiet, anh_dai_dien, cap_do, gia, mien_phi, dau_bep_id, trang_thai, tong_thoi_gian, so_bai_hoc, co_bai_tap, co_chung_chi, co_tai_lieu, ho_tro_1_1)
select 'Món Hàn tại nhà', 'mon-han-tai-nha', 'Tự tay muối kim chi giòn cay, trộn bibimbap đủ màu sắc và nấu nồi canh kim chi đậu hũ thơm nồng chuẩn vị Hàn ngay trong bếp nhà. Khóa học đi từ kỹ thuật lên men cơ bản đến cân bằng vị cay - chua - béo đặc trưng của ẩm thực Hàn Quốc.', 'Ẩm thực Hàn Quốc chinh phục người ăn bằng vị cay nồng, chua thanh từ món lên men và sự cân bằng màu sắc trong từng bữa ăn. Khóa học này hướng dẫn bạn ba món ''quốc dân'' làm nền tảng: kim chi cải thảo muối tại nhà an toàn, giòn cay; cơm trộn bibimbap đủ ngũ sắc với sốt gochujang pha chuẩn; và canh kim chi đậu hũ thịt heo - món canh tận dụng chính kim chi bạn đã muối.

Mỗi bài học gồm video hướng dẫn chi tiết, giải thích rõ nguyên lý lên men, cách chọn ớt bột gochugaru và thứ tự chế biến để món ăn đạt vị như nhà hàng Hàn. Học xong khóa, bạn tự tin mở một bữa ăn Hàn hoàn chỉnh chiêu đãi gia đình.', 'https://images.unsplash.com/photo-1526318896980-cf78c088247c?w=800', 'trung_cap', 449000, false, 'c1000000-0000-0000-0000-000000000002', 'xuat_ban', 55, 3, true, true, true, false
where not exists (select 1 from khoa_hoc where slug = 'mon-han-tai-nha');
insert into bai_hoc (khoa_hoc_id, tieu_de, mo_ta, video_url, tai_lieu, tai_lieu_pro, bai_tap, thoi_gian_phut, thu_tu, xem_truoc, chi_pro)
select k.id, 'Muối kim chi cải thảo giòn cay chuẩn vị', 'Bài học hướng dẫn trọn quy trình muối kim chi cải thảo tại nhà: chọn cải thảo chắc lá, ướp muối đúng thời gian để cải mềm mà vẫn giòn, rửa và vắt cải đúng cách để không bị mặn hay úng nước. Bạn sẽ học cách nấu hồ bột nếp, xay hỗn hợp củ quả và pha sốt ớt gochugaru với nước mắm, tỏi, gừng cho màu đỏ đẹp và vị cay hài hòa. Phần cuối bài giải thích cách ủ lên men ở nhiệt độ phòng, bảo quản trong tủ lạnh và nhận biết kim chi đã ''chín'' để ăn sống, nấu canh hay xào cơm đều ngon.', 'https://www.youtube.com/watch?v=K5VDmckfk6Y', '[]'::jsonb, '[]'::jsonb, '[{"cau_hoi": "Vì sao phải ướp muối cải thảo trước khi trộn sốt kim chi?", "lua_chon": ["Để cải ra bớt nước, mềm vừa phải giúp thấm sốt và giữ độ giòn", "Để cải lên màu đỏ đẹp hơn", "Để diệt toàn bộ vi khuẩn trong cải", "Để cải có vị ngọt hơn"], "dap_an_dung": 0, "diem": 10}, {"cau_hoi": "Nguyên liệu tạo vị cay và màu đỏ đặc trưng của kim chi là gì?", "lua_chon": ["Tương ớt gochujang", "Ớt bột Hàn Quốc (gochugaru)", "Ớt tươi xay nhuyễn", "Bột paprika Tây Ban Nha"], "dap_an_dung": 1, "diem": 10}, {"cau_hoi": "Kim chi mới muối nên được xử lý thế nào để lên men ngon?", "lua_chon": ["Cho ngay vào tủ đông", "Đun sôi trước khi cất", "Để ở nhiệt độ phòng khoảng 1-2 ngày rồi mới cho vào tủ lạnh", "Phơi nắng một buổi"], "dap_an_dung": 2, "diem": 10}]'::jsonb, 20, 1, true, false
from khoa_hoc k where k.slug = 'mon-han-tai-nha'
and not exists (select 1 from bai_hoc b where b.khoa_hoc_id = k.id and b.thu_tu = 1);
insert into bai_hoc (khoa_hoc_id, tieu_de, mo_ta, video_url, tai_lieu, tai_lieu_pro, bai_tap, thoi_gian_phut, thu_tu, xem_truoc, chi_pro)
select k.id, 'Bibimbap - cơm trộn Hàn Quốc ngũ sắc', 'Bibimbap là món cơm trộn nổi tiếng với các loại rau củ đủ màu sắc bày trên nền cơm trắng, thịt bò xào và trứng ốp la lòng đào. Bài học hướng dẫn bạn sơ chế và xào riêng từng loại rau (cải bó xôi, cà rốt, giá đỗ, nấm, bí ngòi) với dầu mè cho thơm mà không lẫn vị, ướp xào thịt bò mềm ngọt và pha sốt gochujang chua cay vừa miệng. Bạn cũng sẽ biết cách dùng nồi đá nóng (dolsot) để tạo lớp cơm cháy giòn dưới đáy và trình bày tô cơm đúng chuẩn ngũ sắc của người Hàn.', 'https://www.youtube.com/watch?v=GyzWB5wh4Yw', '[]'::jsonb, '[]'::jsonb, '[{"cau_hoi": "Các loại rau trong bibimbap cần được chế biến thế nào?", "lua_chon": ["Luộc chung tất cả trong một nồi", "Xào/trụng riêng từng loại rồi bày lên cơm", "Để sống hoàn toàn không chế biến", "Trộn tất cả vào xào một lần"], "dap_an_dung": 1, "diem": 10}, {"cau_hoi": "Sốt trộn chính của bibimbap truyền thống là gì?", "lua_chon": ["Nước tương pha giấm", "Mayonnaise pha tương ớt", "Gochujang pha dầu mè, đường và giấm", "Tương đen Hàn Quốc"], "dap_an_dung": 2, "diem": 10}, {"cau_hoi": "Trứng trong bibimbap thường được làm thế nào để khi trộn quyện đều vào cơm?", "lua_chon": ["Luộc chín kỹ rồi cắt lát", "Đánh tan xào chín", "Ốp la lòng đào", "Dùng trứng sống nguyên quả"], "dap_an_dung": 2, "diem": 10}]'::jsonb, 20, 2, false, false
from khoa_hoc k where k.slug = 'mon-han-tai-nha'
and not exists (select 1 from bai_hoc b where b.khoa_hoc_id = k.id and b.thu_tu = 2);
insert into bai_hoc (khoa_hoc_id, tieu_de, mo_ta, video_url, tai_lieu, tai_lieu_pro, bai_tap, thoi_gian_phut, thu_tu, xem_truoc, chi_pro)
select k.id, 'Canh kim chi đậu hũ thịt heo (kimchi-jjigae)', 'Kimchi-jjigae là nồi canh cay nóng hổi nấu từ kim chi đã chín chua, thịt ba chỉ và đậu hũ mềm - món canh được yêu thích nhất trong bữa cơm Hàn. Bài học chỉ rõ vì sao phải dùng kim chi lên men kỹ, kỹ thuật xào kim chi với thịt trong mỡ heo cho dậy mùi trước khi chế nước dùng cá cơm hoặc nước gạo, và thời điểm cho đậu hũ, hành lá để canh đạt độ ngon nhất. Món canh này cũng là cách tận dụng tuyệt vời cho phần kim chi bạn đã muối ở bài đầu tiên của khóa học.', 'https://www.youtube.com/watch?v=JfvvHK7Mpck', '[]'::jsonb, '[]'::jsonb, '[{"cau_hoi": "Loại kim chi nào nấu canh kimchi-jjigae ngon nhất?", "lua_chon": ["Kim chi mới muối trong ngày", "Kim chi còn xanh chưa lên men", "Kim chi muối xổi ăn liền", "Kim chi đã chín chua, lên men kỹ"], "dap_an_dung": 3, "diem": 10}, {"cau_hoi": "Vì sao nên xào kim chi với thịt trước khi cho nước dùng?", "lua_chon": ["Để kim chi bay hết vị chua", "Giúp kim chi thấm mỡ, dậy mùi thơm và nước canh đậm vị hơn", "Để tiết kiệm thời gian nấu", "Để kim chi đổi màu đẹp hơn"], "dap_an_dung": 1, "diem": 10}, {"cau_hoi": "Đậu hũ nên cho vào nồi canh kim chi ở thời điểm nào?", "lua_chon": ["Ngay từ đầu cùng với thịt", "Gần cuối khi canh gần chín để đậu không bị nát", "Sau khi đã tắt bếp hẳn", "Trước cả kim chi"], "dap_an_dung": 1, "diem": 10}]'::jsonb, 15, 3, false, false
from khoa_hoc k where k.slug = 'mon-han-tai-nha'
and not exists (select 1 from bai_hoc b where b.khoa_hoc_id = k.id and b.thu_tu = 3);

insert into khoa_hoc (tieu_de, slug, mo_ta, mo_ta_chi_tiet, anh_dai_dien, cap_do, gia, mien_phi, dau_bep_id, trang_thai, tong_thoi_gian, so_bai_hoc, co_bai_tap, co_chung_chi, co_tai_lieu, ho_tro_1_1)
select 'Ẩm thực Nhật cơ bản', 'am-thuc-nhat-co-ban', 'Khám phá ba trụ cột của bếp Nhật tại gia: cuộn maki cơm dẻo thơm, chén súp miso ấm nóng từ nước dùng dashi và đĩa gà chiên karaage giòn rụm. Khóa học chú trọng kỹ thuật nền tảng và sự tinh tế trong nêm nếm đặc trưng của ẩm thực Nhật Bản.', 'Ẩm thực Nhật Bản đề cao vị ngọt tự nhiên (umami) của nguyên liệu và kỹ thuật chế biến chuẩn xác. Khóa học này đưa bạn qua ba bài học nền tảng nhất: nấu cơm sushi và cuộn maki chắc tay không vỡ; nấu nước dùng dashi từ tảo kombu và cá bào - linh hồn của mọi món Nhật - rồi hoàn thiện chén súp miso đúng cách; cuối cùng là gà chiên karaage ướp nước tương gừng, áo bột khoai tây chiên giòn.

Hoàn thành khóa học, bạn sẽ hiểu nguyên lý umami, biết cách xử lý gạo Nhật, rong biển nori và tương miso, đủ tự tin chuẩn bị một bữa ăn Nhật tinh tươm cho gia đình vào dịp cuối tuần.', 'https://images.unsplash.com/photo-1553621042-f6e147245754?w=800', 'trung_cap', 499000, false, 'c1000000-0000-0000-0000-000000000002', 'xuat_ban', 55, 3, true, true, true, false
where not exists (select 1 from khoa_hoc where slug = 'am-thuc-nhat-co-ban');
insert into bai_hoc (khoa_hoc_id, tieu_de, mo_ta, video_url, tai_lieu, tai_lieu_pro, bai_tap, thoi_gian_phut, thu_tu, xem_truoc, chi_pro)
select k.id, 'Cơm cuộn maki: nấu cơm sushi và kỹ thuật cuộn', 'Bài học bắt đầu từ khâu vo và nấu gạo Nhật cho hạt cơm dẻo bóng, trộn giấm sushi (giấm gạo, đường, muối) đúng thời điểm khi cơm còn nóng và quạt cho cơm nguội nhanh, bóng đẹp. Tiếp đó là kỹ thuật trải cơm mỏng đều lên lá nori, xếp nhân cá, dưa leo, bơ ở giữa và cuộn bằng mành tre với lực tay vừa đủ để cuộn chắc mà không nát hạt cơm. Phần cuối hướng dẫn cách dùng dao thật sắc, làm ướt lưỡi dao để cắt cuộn thành từng khoanh đều đẹp, không bẹp nhân như ngoài tiệm.', 'https://www.youtube.com/watch?v=K5wdfUWckK4', '[]'::jsonb, '[]'::jsonb, '[{"cau_hoi": "Cơm sushi được trộn với hỗn hợp gia vị nào?", "lua_chon": ["Nước tương và dầu mè", "Giấm gạo, đường và muối", "Mirin nguyên chất", "Nước cốt chanh và mật ong"], "dap_an_dung": 1, "diem": 10}, {"cau_hoi": "Khi trải cơm lên lá rong biển nori để cuộn maki, cần lưu ý gì?", "lua_chon": ["Trải cơm càng dày càng tốt", "Trải kín cả lá, không chừa mép", "Trải lớp mỏng đều và chừa mép khoảng 2cm để dán cuộn", "Phải nén cơm thật chặt bằng muỗng"], "dap_an_dung": 2, "diem": 10}, {"cau_hoi": "Để cắt cuộn sushi không bị nát và dính, người làm cần làm gì?", "lua_chon": ["Dùng dao răng cưa cắt qua lại", "Cắt ngay khi cơm còn bốc khói", "Dùng dao cùn để cơm không dính", "Dùng dao thật sắc và làm ướt lưỡi dao giữa các nhát cắt"], "dap_an_dung": 3, "diem": 10}]'::jsonb, 20, 1, true, false
from khoa_hoc k where k.slug = 'am-thuc-nhat-co-ban'
and not exists (select 1 from bai_hoc b where b.khoa_hoc_id = k.id and b.thu_tu = 1);
insert into bai_hoc (khoa_hoc_id, tieu_de, mo_ta, video_url, tai_lieu, tai_lieu_pro, bai_tap, thoi_gian_phut, thu_tu, xem_truoc, chi_pro)
select k.id, 'Súp miso và nước dùng dashi nền tảng', 'Dashi là nước dùng nền của gần như mọi món Nhật, quyết định bởi cách ngâm tảo kombu ở nhiệt độ vừa và cho cá bào bonito vào đúng lúc để chiết xuất vị umami mà không bị đắng hay tanh. Bài học hướng dẫn bạn nấu dashi trong veo, sau đó hoàn thiện chén súp miso kinh điển với đậu hũ non và rong biển wakame. Bạn sẽ hiểu vì sao miso chỉ được hòa vào khi nước dùng đã tắt lửa hoặc vừa dưới điểm sôi, và cách hòa miso qua vá lọc để súp mịn, không vón cục, thơm dịu.', 'https://www.youtube.com/watch?v=PwLVEJowmjw', '[]'::jsonb, '[]'::jsonb, '[{"cau_hoi": "Nước dùng dashi truyền thống của Nhật được nấu từ nguyên liệu nào?", "lua_chon": ["Xương gà và hành tây", "Nấm hương và tôm khô", "Tảo kombu và cá bào bonito", "Củ cải và rong biển wakame"], "dap_an_dung": 2, "diem": 10}, {"cau_hoi": "Vì sao không nên đun sôi mạnh súp sau khi đã hòa tương miso?", "lua_chon": ["Vì miso sẽ vón cục ngay lập tức", "Vì súp sẽ bị đục không thể dùng", "Vì miso sẽ chuyển vị đắng không ăn được", "Vì nhiệt cao làm miso mất hương thơm và giảm giá trị dinh dưỡng"], "dap_an_dung": 3, "diem": 10}, {"cau_hoi": "Cách hòa miso vào súp để không bị vón cục là gì?", "lua_chon": ["Múc ít nước dùng nóng hòa tan miso trong vá/rây rồi mới cho vào nồi", "Cho miso khô trực tiếp vào nồi đang sôi mạnh", "Xay miso với nước lạnh trước", "Ngâm miso qua đêm trong nước"], "dap_an_dung": 0, "diem": 10}]'::jsonb, 15, 2, false, false
from khoa_hoc k where k.slug = 'am-thuc-nhat-co-ban'
and not exists (select 1 from bai_hoc b where b.khoa_hoc_id = k.id and b.thu_tu = 2);
insert into bai_hoc (khoa_hoc_id, tieu_de, mo_ta, video_url, tai_lieu, tai_lieu_pro, bai_tap, thoi_gian_phut, thu_tu, xem_truoc, chi_pro)
select k.id, 'Gà chiên karaage giòn thơm kiểu Nhật', 'Karaage là món gà chiên quốc dân của Nhật: thịt đùi gà cắt miếng vừa ăn, ướp nước tương, rượu sake, gừng và tỏi cho thơm, áo lớp bột khoai tây mỏng rồi chiên đến vàng giòn. Bài học giải thích vì sao người Nhật chuộng thịt đùi hơn ức gà cho món này, cách ướp ít nhất 30 phút để gia vị thấm sâu, và kỹ thuật chiên ở 170-180°C - có thể chiên hai lần - để vỏ giòn tan mà thịt bên trong vẫn mọng nước. Ăn kèm bắp cải thái sợi, mayonnaise và chanh là đúng chuẩn izakaya.', 'https://www.youtube.com/watch?v=hDLkhVemv44', '[]'::jsonb, '[]'::jsonb, '[{"cau_hoi": "Gà karaage truyền thống dùng phần thịt và loại bột áo nào?", "lua_chon": ["Thịt ức gà và bột chiên xù", "Thịt đùi gà và bột khoai tây (katakuriko)", "Thịt cánh gà và bột mì đa dụng", "Thịt đùi gà và bột bắp"], "dap_an_dung": 1, "diem": 10}, {"cau_hoi": "Hỗn hợp ướp đặc trưng của karaage gồm những gì?", "lua_chon": ["Nước mắm, sả và ớt", "Muối, tiêu và nước cốt chanh", "Tương ớt và mật ong", "Nước tương, rượu sake, gừng và tỏi"], "dap_an_dung": 3, "diem": 10}, {"cau_hoi": "Nhiệt độ dầu phù hợp để chiên karaage giòn ngoài, chín trong là khoảng bao nhiêu?", "lua_chon": ["Khoảng 120°C", "Khoảng 170-180°C", "Khoảng 220°C", "Lửa nhỏ nhất có thể"], "dap_an_dung": 1, "diem": 10}]'::jsonb, 20, 3, false, false
from khoa_hoc k where k.slug = 'am-thuc-nhat-co-ban'
and not exists (select 1 from bai_hoc b where b.khoa_hoc_id = k.id and b.thu_tu = 3);

insert into khoa_hoc (tieu_de, slug, mo_ta, mo_ta_chi_tiet, anh_dai_dien, cap_do, gia, mien_phi, dau_bep_id, trang_thai, tong_thoi_gian, so_bai_hoc, co_bai_tap, co_chung_chi, co_tai_lieu, ho_tro_1_1)
select 'Món Âu cho bữa tối', 'mon-au-cho-bua-toi', 'Nâng tầm bữa tối tại nhà với bít tết áp chảo đúng độ chín, mì Ý sốt kem nấm thơm béo và súp bí đỏ nướng sánh mịn. Khóa học tập trung vào kỹ thuật chảo nóng, kiểm soát nhiệt độ thịt và cân bằng vị béo - chua - thơm kiểu Âu.', 'Một bữa tối kiểu Âu trọn vẹn không cần nguyên liệu cầu kỳ, chỉ cần kỹ thuật chuẩn: áp chảo miếng bò cho lớp vỏ nâu thơm trong khi tâm thịt vẫn hồng mọng, nấu sợi mì al dente và hoàn thiện sốt ngay trong chảo với nước luộc mì, xay nồi súp bí đỏ nướng ngọt sâu, sánh mịn như nhung.

Khóa học hướng dẫn bạn đọc nhiệt độ thịt bằng nhiệt kế và bằng tay, hiểu các mức chín từ rare đến well-done, quản lý thời gian để ba món lên bàn cùng lúc còn nóng hổi. Đây là khóa học lý tưởng để chuẩn bị bữa tối hẹn hò hoặc đãi khách cuối tuần.', 'https://images.unsplash.com/photo-1432139555190-58524dae6a55?w=800', 'trung_cap', 599000, false, 'c1000000-0000-0000-0000-000000000002', 'xuat_ban', 55, 3, true, true, true, false
where not exists (select 1 from khoa_hoc where slug = 'mon-au-cho-bua-toi');
insert into bai_hoc (khoa_hoc_id, tieu_de, mo_ta, video_url, tai_lieu, tai_lieu_pro, bai_tap, thoi_gian_phut, thu_tu, xem_truoc, chi_pro)
select k.id, 'Bò bít tết: chọn thịt, áp chảo và các mức chín', 'Bài học hướng dẫn chọn phần thịt bò phù hợp (thăn nội, thăn ngoại, ribeye), độ dày lý tưởng 2,5-3cm và cách đưa thịt về nhiệt độ phòng trước khi nấu. Trọng tâm là kỹ thuật áp chảo lửa lớn cho lớp vỏ Maillard nâu thơm, dùng nhiệt kế đo nhiệt độ tâm để đạt đúng mức chín mong muốn từ rare đến medium well, và nguyên tắc để thịt nghỉ sau khi nấu để nước thịt phân bổ lại. Bạn cũng sẽ học cách làm bơ tỏi rau thơm rưới lên mặt thịt và những lỗi thường gặp khiến bít tết bị dai, khô hoặc xám màu.', 'https://www.youtube.com/watch?v=RQbNgG1TA_Y', '[]'::jsonb, '[]'::jsonb, '[{"cau_hoi": "Nhiệt độ tâm thịt khoảng bao nhiêu tương ứng mức chín medium rare?", "lua_chon": ["Khoảng 45°C", "Khoảng 54-57°C", "Khoảng 63-65°C", "Khoảng 71°C trở lên"], "dap_an_dung": 1, "diem": 10}, {"cau_hoi": "Vì sao cần để thịt bò nghỉ (resting) vài phút sau khi áp chảo?", "lua_chon": ["Để nước thịt phân bổ lại trong miếng thịt, khi cắt không bị chảy nước và thịt mềm mọng", "Để thịt nguội bớt cho dễ cầm dao", "Để thịt tự chín thành well-done", "Để gia vị trên bề mặt khô lại"], "dap_an_dung": 0, "diem": 10}, {"cau_hoi": "Ngay trước khi áp chảo, bề mặt miếng thịt bò cần được xử lý thế nào?", "lua_chon": ["Ngâm nước muối loãng 30 phút", "Ướp nước tương qua đêm", "Thấm thật khô và nêm muối tiêu", "Rửa qua rượu trắng rồi để ướt"], "dap_an_dung": 2, "diem": 10}]'::jsonb, 25, 1, true, false
from khoa_hoc k where k.slug = 'mon-au-cho-bua-toi'
and not exists (select 1 from bai_hoc b where b.khoa_hoc_id = k.id and b.thu_tu = 1);
insert into bai_hoc (khoa_hoc_id, tieu_de, mo_ta, video_url, tai_lieu, tai_lieu_pro, bai_tap, thoi_gian_phut, thu_tu, xem_truoc, chi_pro)
select k.id, 'Mì Ý sốt kem nấm thơm béo', 'Đĩa mì Ý sốt kem nấm ngon nằm ở ba điểm: sợi mì luộc al dente còn độ dai nhẹ ở lõi, nấm được xào lửa lớn cho xém mặt thơm nức thay vì ra nước nhũn, và sốt kem được hoàn thiện ngay trong chảo cùng nước luộc mì giàu tinh bột để sánh bóng, bám đều từng sợi. Bài học hướng dẫn chọn các loại nấm (nấm mỡ, nấm đùi gà, nấm hương), thứ tự cho tỏi, kem tươi và phô mai Parmesan, cùng cách nêm tiêu đen và rau mùi tây để cân bằng vị béo, tránh ngấy.', 'https://www.youtube.com/watch?v=yhysiBQCTWg', '[]'::jsonb, '[]'::jsonb, '[{"cau_hoi": "Độ chín ''al dente'' của mì Ý có nghĩa là gì?", "lua_chon": ["Mì chín mềm nhũn hoàn toàn", "Mì còn sống hẳn ở giữa", "Mì chín tới, còn hơi dai nhẹ ở lõi khi cắn", "Mì luộc đúng 5 phút"], "dap_an_dung": 2, "diem": 10}, {"cau_hoi": "Người nấu giữ lại một phần nước luộc mì để làm gì?", "lua_chon": ["Để uống kèm món mì", "Để rửa mì sau khi luộc", "Để làm nước súp riêng", "Pha vào sốt giúp sốt sánh và bám mì nhờ lượng tinh bột trong nước"], "dap_an_dung": 3, "diem": 10}, {"cau_hoi": "Xào nấm thế nào để nấm vàng thơm, không bị ra nước?", "lua_chon": ["Xào lửa lớn, dàn một lớp không xếp chồng, đợi nấm xém mặt mới đảo", "Xào lửa nhỏ và đậy nắp kín", "Cho muối ngay từ đầu để nấm ra nước", "Luộc nấm trước khi xào"], "dap_an_dung": 0, "diem": 10}]'::jsonb, 15, 2, false, false
from khoa_hoc k where k.slug = 'mon-au-cho-bua-toi'
and not exists (select 1 from bai_hoc b where b.khoa_hoc_id = k.id and b.thu_tu = 2);
insert into bai_hoc (khoa_hoc_id, tieu_de, mo_ta, video_url, tai_lieu, tai_lieu_pro, bai_tap, thoi_gian_phut, thu_tu, xem_truoc, chi_pro)
select k.id, 'Súp bí đỏ nướng kem sánh mịn', 'Nướng bí đỏ trước khi nấu là bí quyết giúp nồi súp có vị ngọt sâu và mùi thơm caramel mà luộc không thể có. Bài học hướng dẫn cắt và nướng bí cùng hành tỏi đến xém cạnh, nấu với nước dùng gà hoặc rau củ, xay nhuyễn an toàn với máy xay cầm tay và hoàn thiện bằng kem tươi cho vào sau cùng. Bạn sẽ biết cách điều chỉnh độ sánh, nêm nhục đậu khấu và quế nhẹ tay, cùng cách trình bày với vệt kem xoáy và hạt bí rang giòn đẹp như nhà hàng.', 'https://www.youtube.com/watch?v=JCOmri0eFFA', '[]'::jsonb, '[]'::jsonb, '[{"cau_hoi": "Nướng bí đỏ trước khi nấu súp mang lại lợi ích gì?", "lua_chon": ["Giúp bí dễ gọt vỏ hơn", "Tăng vị ngọt caramel và độ thơm cho súp nhờ phản ứng cháy xém bề mặt", "Làm súp có màu vàng sáng hơn", "Rút ngắn thời gian xay súp"], "dap_an_dung": 1, "diem": 10}, {"cau_hoi": "Kem tươi nên cho vào nồi súp bí đỏ ở thời điểm nào?", "lua_chon": ["Ngay từ đầu cùng với bí", "Trước khi xay nhuyễn", "Giữa quá trình nấu", "Sau khi xay xong, chỉ đun ấm lại chứ không sôi mạnh"], "dap_an_dung": 3, "diem": 10}, {"cau_hoi": "Khi xay súp nóng bằng máy xay sinh tố đậy nắp, cần lưu ý điều gì?", "lua_chon": ["Xay từng mẻ nhỏ, không đổ đầy bình và chừa khe thoát hơi nóng", "Xay ngay khi súp đang sôi mạnh, đậy nắp thật kín", "Cho thêm đá viên vào xay cùng", "Đổ đầy bình để xay một lần cho xong"], "dap_an_dung": 0, "diem": 10}]'::jsonb, 15, 3, false, false
from khoa_hoc k where k.slug = 'mon-au-cho-bua-toi'
and not exists (select 1 from bai_hoc b where b.khoa_hoc_id = k.id and b.thu_tu = 3);

insert into khoa_hoc (tieu_de, slug, mo_ta, mo_ta_chi_tiet, anh_dai_dien, cap_do, gia, mien_phi, dau_bep_id, trang_thai, tong_thoi_gian, so_bai_hoc, co_bai_tap, co_chung_chi, co_tai_lieu, ho_tro_1_1)
select 'Ăn sáng kiểu Việt', 'an-sang-kieu-viet', 'Ba món ăn sáng được yêu thích nhất của người Việt: phở gà nước trong nấu nhanh, bánh mì chảo trứng ốp la đầy đủ và cháo sườn sánh mịn thơm hành phi. Khóa học miễn phí giúp bạn chuẩn bị bữa sáng nóng hổi, đủ chất cho cả nhà trong thời gian ngắn.', 'Bữa sáng kiểu Việt đề cao sự nóng hổi, nhanh gọn mà vẫn đủ chất để bắt đầu ngày mới. Khóa học miễn phí này tuyển chọn ba món tiêu biểu của ba miền thói quen ăn sáng: tô phở gà với nước dùng trong, thơm hành gừng nướng nấu theo lối rút gọn cho buổi sáng bận rộn; chảo bánh mì với trứng ốp la lòng đào, pate, xúc xích và sốt cà chua tự làm; và nồi cháo sườn sánh mịn từ gạo rang, ăn kèm quẩy và hành phi.

Mỗi bài đều có mẹo chuẩn bị từ tối hôm trước (sơ chế sẵn, nấu nước dùng trước) để sáng hôm sau bạn chỉ mất 10-20 phút là có bữa sáng ngon như ngoài quán.', 'https://images.unsplash.com/photo-1493770348161-369560ae357d?w=800', 'co_ban', 0, true, 'c1000000-0000-0000-0000-000000000002', 'xuat_ban', 55, 3, true, false, false, false
where not exists (select 1 from khoa_hoc where slug = 'an-sang-kieu-viet');
insert into bai_hoc (khoa_hoc_id, tieu_de, mo_ta, video_url, tai_lieu, tai_lieu_pro, bai_tap, thoi_gian_phut, thu_tu, xem_truoc, chi_pro)
select k.id, 'Phở gà nhanh cho buổi sáng bận rộn', 'Phiên bản phở gà rút gọn cho buổi sáng vẫn giữ được nước dùng trong veo nhờ luộc gà đúng cách, nướng hành gừng và hớt bọt kỹ trong lúc ninh. Bài học hướng dẫn luộc gà sao cho da vàng giòn, thịt không khô, tận dụng chính nước luộc gà làm nước dùng, nêm nếm với quế hồi rang thơm và nước mắm ngon. Bạn sẽ nắm được thứ tự trụng bánh phở, xếp thịt gà xé phay, rắc hành ngò và chan nước dùng sôi để có tô phở nóng hổi chỉ trong khoảng 30 phút nấu thực tế.', 'https://www.youtube.com/watch?v=dS-P714c_6E', '[]'::jsonb, '[]'::jsonb, '[{"cau_hoi": "Bí quyết để nước dùng phở gà trong và thơm là gì?", "lua_chon": ["Cho nhiều bột ngọt ngay từ đầu", "Nướng hành gừng, hớt bọt kỹ khi ninh và nêm nước mắm sau cùng", "Ninh lửa lớn liên tục không vớt bọt", "Cho nước mắm vào ngay khi nước còn lạnh"], "dap_an_dung": 1, "diem": 10}, {"cau_hoi": "Gà sau khi luộc chín nên được xử lý thế nào để da giòn, thịt không bị khô?", "lua_chon": ["Để nguyên trong nồi nước nóng đến khi ăn", "Xé thịt ngay khi còn bốc khói", "Cho vào ngăn đá 10 phút", "Vớt ra ngâm nước lạnh cho săn da, thịt giữ ẩm"], "dap_an_dung": 3, "diem": 10}, {"cau_hoi": "Trụng bánh phở đúng cách là thế nào?", "lua_chon": ["Nấu bánh phở trong nồi nước dùng 5 phút", "Ngâm bánh trong nước lạnh 30 phút rồi ăn", "Trụng nhanh qua nước sôi, bánh vừa mềm là vớt ngay", "Trụng bằng nước nguội cho dai"], "dap_an_dung": 2, "diem": 10}]'::jsonb, 20, 1, true, false
from khoa_hoc k where k.slug = 'an-sang-kieu-viet'
and not exists (select 1 from bai_hoc b where b.khoa_hoc_id = k.id and b.thu_tu = 1);
insert into bai_hoc (khoa_hoc_id, tieu_de, mo_ta, video_url, tai_lieu, tai_lieu_pro, bai_tap, thoi_gian_phut, thu_tu, xem_truoc, chi_pro)
select k.id, 'Bánh mì chảo trứng ốp la đầy đủ', 'Bánh mì chảo là bữa sáng ''tất cả trong một chảo gang'': trứng ốp la lòng đào, pate gan, xúc xích, thịt nguội và sốt cà chua sánh thơm, ăn kèm bánh mì giòn nóng chấm đẫm sốt. Bài học hướng dẫn tự làm sốt cà chua chua ngọt cân bằng từ cà chua tươi, chiên xúc xích khía hoa cho đẹp, ốp trứng lòng đào bằng cách đậy nắp hơi nước và thứ tự sắp xếp các nguyên liệu vào chảo để mọi thứ chín cùng lúc, dọn nguyên chảo lên bàn còn xèo xèo hấp dẫn.', 'https://www.youtube.com/watch?v=rezIPvW4avg', '[]'::jsonb, '[]'::jsonb, '[{"cau_hoi": "Sốt cà chua cho bánh mì chảo ngon cần đạt hương vị thế nào?", "lua_chon": ["Chua gắt là chính", "Ngọt đậm như nước chè", "Chua ngọt nhẹ cân bằng và hơi sánh", "Mặn đậm để chấm bánh mì"], "dap_an_dung": 2, "diem": 10}, {"cau_hoi": "Muốn ốp la lòng đào đẹp (lòng trắng chín, lòng đỏ còn chảy), cách làm đúng là gì?", "lua_chon": ["Chiên lửa lớn 5 phút không đậy nắp", "Chảo nóng vừa, đập trứng vào rồi đậy nắp 1-2 phút cho hơi nước làm chín mặt trên", "Lật trứng qua lại nhiều lần", "Chiên ngập dầu như trứng chiên giòn"], "dap_an_dung": 1, "diem": 10}, {"cau_hoi": "Pate nên cho vào chảo bánh mì ở thời điểm nào?", "lua_chon": ["Ngay từ đầu cùng dầu lạnh", "Sau khi đã tắt bếp", "Khi sốt cà chua đã nóng, trước khi đập trứng vào", "Để riêng ra đĩa, không cho vào chảo"], "dap_an_dung": 2, "diem": 10}]'::jsonb, 15, 2, false, false
from khoa_hoc k where k.slug = 'an-sang-kieu-viet'
and not exists (select 1 from bai_hoc b where b.khoa_hoc_id = k.id and b.thu_tu = 2);
insert into bai_hoc (khoa_hoc_id, tieu_de, mo_ta, video_url, tai_lieu, tai_lieu_pro, bai_tap, thoi_gian_phut, thu_tu, xem_truoc, chi_pro)
select k.id, 'Cháo sườn mềm thơm sánh mịn', 'Cháo sườn ngon có hạt cháo bung nở sánh mịn, miếng sườn mềm rục thơm và lớp hành phi, tóp mỡ giòn rụm bên trên. Bài học hướng dẫn chần sườn với gừng để khử hôi, rang gạo trước khi nấu cho cháo thơm và nhanh nhừ, tỉ lệ nước hợp lý để cháo không loãng không đặc, và thói quen khuấy đều tay tránh bén đáy nồi. Bạn cũng học cách nấu cháo từ tối hôm trước bằng nồi ủ hoặc nồi cơm điện để sáng ra có ngay nồi cháo nóng cho cả nhà.', 'https://www.youtube.com/watch?v=VwGicsHZ8_s', '[]'::jsonb, '[]'::jsonb, '[{"cau_hoi": "Rang gạo trước khi nấu cháo sườn có tác dụng gì?", "lua_chon": ["Làm hạt gạo hết tinh bột", "Giúp gạo thơm hơn, cháo nhanh nhừ và sánh đẹp", "Để cháo có màu vàng", "Để khử mùi hôi của sườn"], "dap_an_dung": 1, "diem": 10}, {"cau_hoi": "Sườn heo nấu cháo cần sơ chế thế nào để nước cháo không bị hôi?", "lua_chon": ["Ngâm nước lạnh qua đêm", "Ướp nước mắm trước 1 giờ", "Để nguyên không cần xử lý", "Chần qua nước sôi với gừng rồi rửa sạch"], "dap_an_dung": 3, "diem": 10}, {"cau_hoi": "Trong lúc nấu cháo, vì sao cần khuấy thường xuyên?", "lua_chon": ["Để cháo nhanh nguội", "Để sườn mềm nhanh hơn", "Tránh cháo bén đáy nồi và giúp hạt gạo bung đều, cháo sánh mịn", "Để tạo bọt cho cháo đẹp"], "dap_an_dung": 2, "diem": 10}]'::jsonb, 20, 3, false, false
from khoa_hoc k where k.slug = 'an-sang-kieu-viet'
and not exists (select 1 from bai_hoc b where b.khoa_hoc_id = k.id and b.thu_tu = 3);

insert into khoa_hoc (tieu_de, slug, mo_ta, mo_ta_chi_tiet, anh_dai_dien, cap_do, gia, mien_phi, dau_bep_id, trang_thai, tong_thoi_gian, so_bai_hoc, co_bai_tap, co_chung_chi, co_tai_lieu, ho_tro_1_1)
select 'Tráng miệng & chè Việt', 'trang-mieng-va-che-viet', 'Thế giới chè Việt ngọt mát: chè đậu xanh nha đam giải nhiệt, bánh flan caramel mềm mịn không rỗ và chè trôi nước dẻo thơm nhân đậu xanh. Khóa học chỉ rõ kỹ thuật sơ chế nguyên liệu và kiểm soát nhiệt để món nào cũng thành công ngay lần đầu.', 'Chè và bánh tráng miệng Việt Nam đòi hỏi sự tỉ mỉ ở những chi tiết nhỏ: nha đam phải hết đắng hết nhớt, flan phải mịn như lụa không một lỗ rỗ, viên trôi nước phải dẻo mềm cả khi để nguội. Khóa học này hệ thống ba món tiêu biểu nhất kèm mọi bí quyết xử lý lỗi thường gặp.

Bạn sẽ học cách nấu đậu xanh mềm mà không nát, sơ chế nha đam giòn trong, thắng caramel màu cánh gián không đắng, hấp flan lửa nhỏ đúng thời gian, và nhồi bột nếp với khoai lang để viên trôi nước mềm dẻo suốt nhiều giờ. Kết khóa, bạn có thể tự tay làm một mâm tráng miệng hoàn chỉnh cho gia đình.', 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=800', 'co_ban', 299000, false, 'c1000000-0000-0000-0000-000000000002', 'xuat_ban', 55, 3, true, true, true, false
where not exists (select 1 from khoa_hoc where slug = 'trang-mieng-va-che-viet');
insert into bai_hoc (khoa_hoc_id, tieu_de, mo_ta, video_url, tai_lieu, tai_lieu_pro, bai_tap, thoi_gian_phut, thu_tu, xem_truoc, chi_pro)
select k.id, 'Chè đậu xanh nha đam thanh mát giải nhiệt', 'Chén chè đậu xanh nha đam đạt chuẩn khi hạt đậu mềm bùi mà không nát, miếng nha đam giòn trong, không còn chút đắng hay nhớt, nước chè ngọt thanh từ đường phèn và thơm nhẹ lá dứa. Bài học tập trung vào khâu sơ chế nha đam: gọt sạch phần vỏ xanh, rửa và ngâm với nước muối chanh nhiều lần để loại bỏ chất đắng, trụng nhanh rồi ngâm nước đá cho giòn. Tiếp đó là cách nấu đậu xanh vừa chín tới, cho đường sau khi đậu đã mềm để tránh sượng, và cho nha đam vào sau cùng nấu vừa sôi là tắt bếp.', 'https://www.youtube.com/watch?v=Qxic1_tHB5w', '[]'::jsonb, '[]'::jsonb, '[{"cau_hoi": "Sơ chế nha đam thế nào để hết đắng và hết nhớt?", "lua_chon": ["Chỉ rửa một lần với nước lạnh", "Luộc nha đam 30 phút trong nước sôi", "Gọt sạch vỏ xanh, ngâm rửa nhiều lần với nước muối pha chanh", "Ngâm trong nước đường qua đêm"], "dap_an_dung": 2, "diem": 10}, {"cau_hoi": "Đậu xanh nấu chè nên được chuẩn bị thế nào trước khi nấu?", "lua_chon": ["Không cần ngâm, nấu luôn 1 giờ", "Ngâm nước 2-4 giờ cho đậu nở, nấu nhanh mềm hơn", "Ngâm 5 phút trong nước nóng", "Ngâm 2 ngày cho lên mầm"], "dap_an_dung": 1, "diem": 10}, {"cau_hoi": "Nha đam nên cho vào nồi chè ở thời điểm nào?", "lua_chon": ["Ngay từ đầu cùng đậu xanh", "Trước khi cho đậu vào", "Sau khi đã múc chè ra chén", "Khi đậu đã mềm và đường đã tan, nấu thêm 2-3 phút là tắt bếp"], "dap_an_dung": 3, "diem": 10}]'::jsonb, 15, 1, true, false
from khoa_hoc k where k.slug = 'trang-mieng-va-che-viet'
and not exists (select 1 from bai_hoc b where b.khoa_hoc_id = k.id and b.thu_tu = 1);
insert into bai_hoc (khoa_hoc_id, tieu_de, mo_ta, video_url, tai_lieu, tai_lieu_pro, bai_tap, thoi_gian_phut, thu_tu, xem_truoc, chi_pro)
select k.id, 'Bánh flan caramel mềm mịn không rỗ', 'Bánh flan hoàn hảo có mặt bánh láng mịn như gương, thân bánh mềm tan không rỗ, lớp caramel màu cánh gián thơm dịu không đắng. Bài học phân tích ba nguyên nhân gây rỗ bánh (nhiệt quá cao, đánh trứng nổi bọt, hấp quá lâu) và cách khắc phục từng nguyên nhân: khuấy trứng nhẹ một chiều, lọc hỗn hợp qua rây, hấp lửa nhỏ với mực nước vừa và lấy bánh ra khi mặt còn hơi rung. Kèm theo là kỹ thuật thắng caramel chuẩn màu và cách úp bánh ra đĩa nguyên vẹn, bóng đẹp.', 'https://www.youtube.com/watch?v=4bYaIxOfgJc', '[]'::jsonb, '[]'::jsonb, '[{"cau_hoi": "Nguyên nhân chính khiến bánh flan bị rỗ là gì?", "lua_chon": ["Dùng sữa tươi thay sữa đặc", "Cho quá ít đường", "Hấp ở nhiệt quá cao hoặc quá lâu làm hỗn hợp trứng sôi tạo bọt khí", "Đánh trứng quá nhẹ tay"], "dap_an_dung": 2, "diem": 10}, {"cau_hoi": "Caramel thắng đạt chuẩn có đặc điểm gì?", "lua_chon": ["Màu vàng nhạt như mật ong", "Màu nâu cánh gián, thơm, không cháy đắng", "Màu nâu đen bóng", "Trong suốt không màu"], "dap_an_dung": 1, "diem": 10}, {"cau_hoi": "Khuấy hỗn hợp trứng sữa làm flan thế nào để bánh mịn?", "lua_chon": ["Đánh bông mạnh cho nổi nhiều bọt", "Dùng máy đánh trứng tốc độ cao", "Khuấy với nước đang sôi", "Khuấy nhẹ một chiều tránh tạo bọt và lọc qua rây trước khi hấp"], "dap_an_dung": 3, "diem": 10}]'::jsonb, 20, 2, false, false
from khoa_hoc k where k.slug = 'trang-mieng-va-che-viet'
and not exists (select 1 from bai_hoc b where b.khoa_hoc_id = k.id and b.thu_tu = 2);
insert into bai_hoc (khoa_hoc_id, tieu_de, mo_ta, video_url, tai_lieu, tai_lieu_pro, bai_tap, thoi_gian_phut, thu_tu, xem_truoc, chi_pro)
select k.id, 'Chè trôi nước dẻo mềm nhân đậu xanh', 'Viên trôi nước tròn trịa với lớp vỏ nếp dẻo mềm ôm nhân đậu xanh sên dừa béo thơm, ngâm trong nước đường gừng ấm nóng. Bài học chia sẻ bí quyết trộn thêm khoai lang nghiền vào bột nếp để vỏ bánh mềm dẻo nhiều giờ, để tủ lạnh hâm lại vẫn không cứng; cách sên nhân đậu xanh với nước cốt dừa và dừa sợi cho nhân khô ráo dễ vo viên; và dấu hiệu nhận biết bánh chín khi luộc - viên bánh nổi lên mặt nước. Cuối bài là cách nấu nước đường phèn gừng và chan nước cốt dừa sánh mịn.', 'https://www.youtube.com/watch?v=7mq7DcYiSk8', '[]'::jsonb, '[]'::jsonb, '[{"cau_hoi": "Bí quyết giúp vỏ bánh trôi nước mềm dẻo lâu, để nguội không bị cứng là gì?", "lua_chon": ["Dùng toàn bộ bột gạo tẻ thay bột nếp", "Nhồi bột bằng nước ấm và trộn thêm khoai lang nghiền vào bột", "Nhồi bột bằng nước đá lạnh", "Cho thật nhiều đường vào bột"], "dap_an_dung": 1, "diem": 10}, {"cau_hoi": "Khi luộc, dấu hiệu nào cho biết viên trôi nước đã chín?", "lua_chon": ["Viên bánh nổi lên mặt nước", "Viên bánh chìm chặt xuống đáy", "Nước luộc chuyển sang màu vàng", "Viên bánh nứt vỏ"], "dap_an_dung": 0, "diem": 10}, {"cau_hoi": "Nước đường ăn kèm chè trôi nước thường dùng loại đường nào cho vị ngọt thanh, thơm gừng?", "lua_chon": ["Đường hóa học tạo ngọt", "Mật ong nguyên chất", "Sữa đặc có đường", "Đường phèn hoặc đường thốt nốt"], "dap_an_dung": 3, "diem": 10}]'::jsonb, 20, 3, false, false
from khoa_hoc k where k.slug = 'trang-mieng-va-che-viet'
and not exists (select 1 from bai_hoc b where b.khoa_hoc_id = k.id and b.thu_tu = 3);

insert into khoa_hoc (tieu_de, slug, mo_ta, mo_ta_chi_tiet, anh_dai_dien, cap_do, gia, mien_phi, dau_bep_id, trang_thai, tong_thoi_gian, so_bai_hoc, co_bai_tap, co_chung_chi, co_tai_lieu, ho_tro_1_1)
select 'Eat-clean nhẹ nhàng', 'eat-clean-nhe-nhang', 'Bắt đầu lối ăn eat-clean không áp lực với salad ức gà sốt sữa chua, cơm gạo lứt cá hồi áp chảo cho meal prep và yến mạch qua đêm 5 phút. Khóa học miễn phí giúp bạn ăn đủ chất, no lâu mà vẫn ngon miệng mỗi ngày.', 'Eat-clean không có nghĩa là ăn kiêng khổ sở hay chỉ ăn rau luộc nhạt nhẽo. Khóa học miễn phí này giới thiệu cách ăn sạch thực tế cho người Việt: chọn nguyên liệu tươi, ít chế biến sẵn, cân bằng đạm - tinh bột chậm - rau củ - chất béo tốt trong mỗi bữa.

Bạn sẽ thực hành ba công thức nền tảng dễ duy trì: salad ức gà áp chảo sốt sữa chua Hy Lạp cho bữa trưa nhẹ, hộp cơm gạo lứt cá hồi áp chảo chuẩn meal prep cho cả tuần bận rộn, và yến mạch qua đêm chuẩn bị 5 phút cho bữa sáng. Kèm theo là nguyên tắc đọc nhãn thực phẩm và thay thế gia vị lành mạnh hơn trong bếp Việt.', 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800', 'co_ban', 0, true, 'c1000000-0000-0000-0000-000000000002', 'xuat_ban', 55, 3, true, false, false, false
where not exists (select 1 from khoa_hoc where slug = 'eat-clean-nhe-nhang');
insert into bai_hoc (khoa_hoc_id, tieu_de, mo_ta, video_url, tai_lieu, tai_lieu_pro, bai_tap, thoi_gian_phut, thu_tu, xem_truoc, chi_pro)
select k.id, 'Salad ức gà sốt sữa chua Hy Lạp', 'Ức gà là nguyên liệu eat-clean quen thuộc nhưng rất dễ nấu khô và dai nếu sai kỹ thuật. Bài học hướng dẫn ướp ức gà với muối, tiêu và thảo mộc 15 phút, áp chảo mỗi mặt vừa đủ thời gian rồi để thịt nghỉ trước khi cắt lát để giữ nước ngọt bên trong. Phần sốt sữa chua Hy Lạp không đường pha chanh, tỏi và thì là thay thế hoàn hảo cho mayonnaise nhiều calo. Cuối bài là cách vẩy rau thật ráo nước, xếp salad đẹp mắt với cà chua bi, dưa leo, bắp và trứng luộc cho một bữa trưa no mà nhẹ bụng.', 'https://www.youtube.com/watch?v=WLSOo7r2_dE', '[]'::jsonb, '[]'::jsonb, '[{"cau_hoi": "Nấu ức gà eat-clean thế nào để thịt mềm ẩm, không khô dai?", "lua_chon": ["Luộc 40 phút cho thật mềm", "Ướp 15 phút, áp chảo vừa chín tới rồi để nghỉ vài phút trước khi cắt", "Chiên ngập dầu cho giòn", "Nướng đến khi thịt cháy cạnh hoàn toàn"], "dap_an_dung": 1, "diem": 10}, {"cau_hoi": "Sốt salad từ sữa chua nên chọn loại nào?", "lua_chon": ["Sữa chua có đường vị trái cây", "Mayonnaise nguyên chất", "Kem béo whipping cream", "Sữa chua không đường (tốt nhất là sữa chua Hy Lạp) pha chanh, tỏi và rau thơm"], "dap_an_dung": 3, "diem": 10}, {"cau_hoi": "Rau salad cần được xử lý thế nào ngay trước khi trộn sốt?", "lua_chon": ["Ngâm nước muối qua đêm", "Trụng nhanh qua nước sôi", "Rửa sạch và vẩy/quay thật ráo nước để sốt không bị loãng", "Cắt nhỏ và để tủ lạnh từ hôm trước"], "dap_an_dung": 2, "diem": 10}]'::jsonb, 20, 1, true, false
from khoa_hoc k where k.slug = 'eat-clean-nhe-nhang'
and not exists (select 1 from bai_hoc b where b.khoa_hoc_id = k.id and b.thu_tu = 1);
insert into bai_hoc (khoa_hoc_id, tieu_de, mo_ta, video_url, tai_lieu, tai_lieu_pro, bai_tap, thoi_gian_phut, thu_tu, xem_truoc, chi_pro)
select k.id, 'Cơm gạo lứt cá hồi áp chảo chuẩn meal prep', 'Hộp cơm gạo lứt cá hồi là lựa chọn meal prep kinh điển: đủ đạm, giàu omega-3, no lâu và dễ chuẩn bị số lượng lớn cho 3-4 ngày. Bài học hướng dẫn ngâm và nấu gạo lứt dẻo thơm không sượng, áp chảo cá hồi da giòn với nguyên tắc thấm khô cá và áp mặt da trước, cùng cách hấp hoặc áp chảo nhanh rau củ giữ màu xanh đẹp. Bạn cũng sẽ biết cách chia hộp, bảo quản ngăn mát đúng thời hạn và hâm lại sao cho cá không bị khô, cơm vẫn mềm khi ăn tại văn phòng.', 'https://www.youtube.com/watch?v=D3c6aI7Z61E', '[]'::jsonb, '[]'::jsonb, '[{"cau_hoi": "Nấu cơm gạo lứt dẻo ngon, không sượng cần lưu ý gì?", "lua_chon": ["Nấu y như gạo trắng, không ngâm", "Ngâm gạo trước 30 phút đến 2 giờ và nấu với lượng nước nhiều hơn gạo trắng", "Cho thật ít nước để cơm khô ráo", "Vo gạo thật kỹ đến khi nước trong vắt"], "dap_an_dung": 1, "diem": 10}, {"cau_hoi": "Áp chảo cá hồi thế nào để da giòn, thịt mềm không nát?", "lua_chon": ["Ướp cá trong nước tương qua đêm", "Áp chảo lửa nhỏ và đậy nắp suốt quá trình", "Lật cá liên tục mỗi 30 giây", "Thấm khô cá, áp mặt da xuống trước trên chảo nóng và hạn chế lật trở"], "dap_an_dung": 3, "diem": 10}, {"cau_hoi": "Một hộp cơm eat-clean cân bằng nên gồm những nhóm chất nào?", "lua_chon": ["Chỉ rau xanh và ức gà", "Càng ít tinh bột càng tốt, bỏ hẳn cơm", "Tinh bột chậm, đạm nạc, rau củ và chất béo tốt", "Nhiều thịt đỏ và phô mai cho đủ năng lượng"], "dap_an_dung": 2, "diem": 10}]'::jsonb, 20, 2, false, false
from khoa_hoc k where k.slug = 'eat-clean-nhe-nhang'
and not exists (select 1 from bai_hoc b where b.khoa_hoc_id = k.id and b.thu_tu = 2);
insert into bai_hoc (khoa_hoc_id, tieu_de, mo_ta, video_url, tai_lieu, tai_lieu_pro, bai_tap, thoi_gian_phut, thu_tu, xem_truoc, chi_pro)
select k.id, 'Overnight oats - yến mạch qua đêm 5 phút', 'Overnight oats là bữa sáng không cần nấu: trộn yến mạch cán dẹt với sữa hoặc sữa chua, hạt chia và trái cây trong hũ, để tủ lạnh qua đêm, sáng hôm sau mở ra là ăn ngay. Bài học giới thiệu tỉ lệ nền chuẩn để yến mạch sánh dẻo không loãng không đặc, vai trò của hạt chia trong việc tạo độ sánh và bổ sung chất xơ, cùng bốn biến tấu hương vị dễ làm: chuối cacao, táo quế, xoài dừa và cà phê sữa. Đây là công thức cứu cánh cho những buổi sáng bận rộn mà vẫn muốn ăn sáng đàng hoàng.', 'https://www.youtube.com/watch?v=PlsoRwHHbIY', '[]'::jsonb, '[]'::jsonb, '[{"cau_hoi": "Tỉ lệ nền cơ bản của overnight oats là gì?", "lua_chon": ["1 phần yến mạch với 4 phần nước", "Chỉ yến mạch và trái cây, không chất lỏng", "1 phần yến mạch với khoảng 1 phần chất lỏng (sữa/sữa chua), thêm hạt chia tạo sánh", "Yến mạch phải nấu chín trước rồi mới để nguội"], "dap_an_dung": 2, "diem": 10}, {"cau_hoi": "Hũ overnight oats cần ủ trong tủ lạnh tối thiểu bao lâu?", "lua_chon": ["Khoảng 30 phút", "Ít nhất 4 giờ, ngon nhất khi để qua đêm khoảng 8 giờ", "Đúng 15 phút", "Không cần ủ, ăn ngay sau khi trộn"], "dap_an_dung": 1, "diem": 10}, {"cau_hoi": "Hạt chia trong overnight oats đóng vai trò gì?", "lua_chon": ["Tạo vị ngọt tự nhiên", "Làm hũ yến mạch có màu đẹp", "Thay thế hoàn toàn yến mạch", "Hút nước giúp hỗn hợp sánh dẻo, đồng thời bổ sung chất xơ và omega-3"], "dap_an_dung": 3, "diem": 10}]'::jsonb, 15, 3, false, false
from khoa_hoc k where k.slug = 'eat-clean-nhe-nhang'
and not exists (select 1 from bai_hoc b where b.khoa_hoc_id = k.id and b.thu_tu = 3);

insert into khoa_hoc (tieu_de, slug, mo_ta, mo_ta_chi_tiet, anh_dai_dien, cap_do, gia, mien_phi, dau_bep_id, trang_thai, tong_thoi_gian, so_bai_hoc, co_bai_tap, co_chung_chi, co_tai_lieu, ho_tro_1_1)
select 'Kỹ thuật chiên xào châu Á', 'ky-thuat-chien-xao-chau-a', 'Làm chủ ngọn lửa lớn và chiếc chảo wok: hiểu ''wok hei'' - hơi thở của chảo, xào mì hải sản dai giòn không nhão và đĩa bò xào rau muống tỏi xanh mướt như nhà hàng. Khóa nâng cao cho người muốn đưa món xào lên đẳng cấp đầu bếp.', 'Món xào châu Á ngon hay dở quyết định trong vài chục giây trên ngọn lửa lớn. Khóa học nâng cao này giải mã ''wok hei'' - mùi thơm khói đặc trưng chỉ xuất hiện khi chảo đủ nóng, lượng nguyên liệu vừa phải và thao tác đảo xào đủ nhanh; đồng thời hệ thống các nguyên tắc bất biến của món xào: nguyên liệu phải khô ráo, cắt đều cỡ, xào riêng từng nhóm và hoàn thiện sốt ở giây cuối.

Hai bài thực hành mì xào hải sản và bò xào rau muống tỏi áp dụng trọn bộ nguyên tắc vào món ăn quen thuộc, kèm bài tập trắc nghiệm sau mỗi bài. Khóa học có hỗ trợ hỏi đáp 1-1 với đầu bếp để bạn gửi video thực hành và nhận góp ý trực tiếp.', 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=800', 'nang_cao', 899000, false, 'c1000000-0000-0000-0000-000000000002', 'xuat_ban', 55, 3, true, true, true, true
where not exists (select 1 from khoa_hoc where slug = 'ky-thuat-chien-xao-chau-a');
insert into bai_hoc (khoa_hoc_id, tieu_de, mo_ta, video_url, tai_lieu, tai_lieu_pro, bai_tap, thoi_gian_phut, thu_tu, xem_truoc, chi_pro)
select k.id, 'Lửa chảo và ''wok hei'' - hơi thở của chảo', '''Wok hei'' là mùi thơm khói quyến rũ chỉ có ở món xào nhà hàng, sinh ra khi nguyên liệu tiếp xúc chảo nóng ở nhiệt độ rất cao trong thời gian ngắn, bề mặt xém nhẹ và phản ứng Maillard diễn ra mạnh mẽ. Bài học phân tích ba điều kiện tạo wok hei tại bếp gia đình: chảo phải thật nóng trước khi cho dầu, mỗi mẻ xào chỉ lượng vừa để chảo không hạ nhiệt, và nguyên liệu phải thật ráo nước. Bạn sẽ thực hành với món cơm chiên trứng để cảm nhận sự khác biệt, đồng thời học cách ''tôi'' và bảo dưỡng chảo gang, chảo thép carbon.', 'https://www.youtube.com/watch?v=8gzfb40VR5A', '[]'::jsonb, '[]'::jsonb, '[{"cau_hoi": "''Wok hei'' (hơi thở của chảo) thực chất là gì?", "lua_chon": ["Một loại gia vị truyền thống của người Hoa", "Tên gọi khác của chảo gang", "Mùi thơm khói đặc trưng tạo ra khi xào lửa lớn, nguyên liệu xém cạnh và phản ứng Maillard diễn ra nhanh", "Hơi nước bốc lên từ món xào"], "dap_an_dung": 2, "diem": 10}, {"cau_hoi": "Điều kiện quan trọng nhất để đạt wok hei khi nấu tại bếp gia đình là gì?", "lua_chon": ["Cho càng nhiều dầu càng tốt", "Đậy nắp kín trong lúc xào", "Dùng chảo chống dính mới mua", "Chảo thật nóng trước khi cho dầu, xào lượng ít và giữ lửa lớn liên tục"], "dap_an_dung": 3, "diem": 10}, {"cau_hoi": "Vì sao cho quá nhiều nguyên liệu vào chảo cùng lúc làm món xào kém ngon?", "lua_chon": ["Chảo hạ nhiệt nhanh, nguyên liệu ra nước và bị ''hấp'' chín thay vì xào xém", "Nguyên liệu sẽ có màu không đều", "Tốn nhiều gas hơn bình thường", "Dầu ăn bắn ra ngoài nhiều hơn"], "dap_an_dung": 0, "diem": 10}]'::jsonb, 20, 1, true, false
from khoa_hoc k where k.slug = 'ky-thuat-chien-xao-chau-a'
and not exists (select 1 from bai_hoc b where b.khoa_hoc_id = k.id and b.thu_tu = 1);
insert into bai_hoc (khoa_hoc_id, tieu_de, mo_ta, video_url, tai_lieu, tai_lieu_pro, bai_tap, thoi_gian_phut, thu_tu, xem_truoc, chi_pro)
select k.id, 'Mì xào hải sản dai giòn không nhão', 'Đĩa mì xào hải sản chuẩn quán có sợi mì dai, tơi từng sợi, không bết dính; tôm mực vừa chín tới còn giòn ngọt và rau củ chín mà vẫn xanh giòn. Bài học chỉ ra sai lầm phổ biến nhất là luộc mì quá chín và xào hải sản chung từ đầu khiến cả chảo đầy nước. Bạn sẽ học quy trình chuẩn đầu bếp: ngâm mì nước lạnh cho vừa mềm, chần riêng hải sản thật nhanh trên lửa lớn, pha sẵn chén sốt xào và hoàn thiện tất cả trong 2 phút cuối trên chảo nóng, rưới sốt quanh thành chảo để tạo mùi thơm khói.', 'https://www.youtube.com/watch?v=mds0XlktSsc', '[]'::jsonb, '[]'::jsonb, '[{"cau_hoi": "Sơ chế mì thế nào để khi xào sợi mì dai giòn, không nhão?", "lua_chon": ["Luộc mì chín mềm hẳn rồi mới xào lâu", "Ngâm mì trong nước sôi 30 phút", "Ngâm nước lạnh (hoặc chần nhanh) đến vừa mềm, vớt ra để thật ráo và xào ở công đoạn cuối", "Cho mì khô trực tiếp vào chảo xào"], "dap_an_dung": 2, "diem": 10}, {"cau_hoi": "Hải sản trong món mì xào cần được xử lý ra sao?", "lua_chon": ["Cho vào xào cùng mì ngay từ đầu", "Chần hoặc xào riêng thật nhanh trên lửa lớn, cho vào chảo mì ở công đoạn cuối", "Ướp đường qua đêm cho thấm", "Luộc chín kỹ 15 phút trước khi xào"], "dap_an_dung": 1, "diem": 10}, {"cau_hoi": "Chén sốt xào mì cơ bản thường cân bằng những vị nào?", "lua_chon": ["Chỉ vị mặn của nước mắm", "Vị chua của giấm và muối", "Mặn ngọt hài hòa từ nước tương, dầu hào, đường và tiêu", "Vị cay từ tương ớt và mayonnaise"], "dap_an_dung": 2, "diem": 10}]'::jsonb, 15, 2, false, false
from khoa_hoc k where k.slug = 'ky-thuat-chien-xao-chau-a'
and not exists (select 1 from bai_hoc b where b.khoa_hoc_id = k.id and b.thu_tu = 2);
insert into bai_hoc (khoa_hoc_id, tieu_de, mo_ta, video_url, tai_lieu, tai_lieu_pro, bai_tap, thoi_gian_phut, thu_tu, xem_truoc, chi_pro)
select k.id, 'Bò xào rau muống tỏi xanh giòn', 'Rau muống xào tỏi tưởng đơn giản mà rất dễ thất bại: rau thâm đen, ra nước, thịt bò dai và chảy nước làm cả đĩa nhạt nhẽo. Bài học hướng dẫn chọn rau muống cọng giòn, nhặt và để rau thật ráo, ướp bò với chút bột bắp và dầu ăn để thịt mềm, xào bò chín tái trước rồi trút ra, sau đó mới xào rau trên lửa lớn nhất với nhiều tỏi phi và cho bò trở lại ở 30 giây cuối. Kết quả là đĩa rau xanh mướt, giòn sần sật, thấm vị nước mắm tỏi, thịt bò mềm ngọt - món cơm nhà được nâng lên chuẩn nhà hàng.', 'https://www.youtube.com/watch?v=5ba8jGlaeTI', '[]'::jsonb, '[]'::jsonb, '[{"cau_hoi": "Điều kiện để rau muống xào được xanh giòn, không thâm và không ra nước là gì?", "lua_chon": ["Xào lửa nhỏ trong thời gian dài", "Cho thêm nhiều nước vào chảo khi xào", "Đậy nắp kín khoảng 5 phút", "Lửa lớn, chảo nóng, rau thật ráo nước và xào nhanh tay"], "dap_an_dung": 3, "diem": 10}, {"cau_hoi": "Thứ tự xào thịt bò và rau muống đúng kỹ thuật là gì?", "lua_chon": ["Xào rau và bò cùng lúc ngay từ đầu", "Luộc cả hai rồi trộn với tỏi phi", "Xào bò chín tái trước và trút ra, xào rau xong mới cho bò vào lại đảo nhanh", "Xào rau thật chín rồi mới cho bò sống vào"], "dap_an_dung": 2, "diem": 10}, {"cau_hoi": "Tỏi trong món rau muống xào tỏi nên được dùng thế nào cho thơm nhất?", "lua_chon": ["Chỉ dùng bột tỏi cho tiện", "Cho toàn bộ tỏi vào sau khi tắt bếp", "Dùng nhiều tỏi: một phần phi thơm ở đầu chảo, một phần cho vào sau cùng để giữ mùi thơm tươi", "Không cần tỏi, chỉ cần hành"], "dap_an_dung": 2, "diem": 10}]'::jsonb, 20, 3, false, false
from khoa_hoc k where k.slug = 'ky-thuat-chien-xao-chau-a'
and not exists (select 1 from bai_hoc b where b.khoa_hoc_id = k.id and b.thu_tu = 3);

insert into bai_viet (tieu_de, slug, tom_tat, noi_dung, anh_dai_dien, danh_muc, tac_gia_id, trang_thai, luot_xem)
select 'Cách chọn cá tươi ngon như người bán cá lâu năm', 'cach-chon-ca-tuoi-ngon', 'Cá tươi quyết định 70% độ ngon của món cá. Nắm 6 dấu hiệu nhận biết cá tươi qua mắt, mang, da, độ đàn hồi và mùi để không bao giờ mua phải cá ươn, cá ngâm hóa chất.', '## Vì sao phải biết chọn cá tươi?

Cá là nguyên liệu "khó tính" nhất trong bếp: chỉ cần kém tươi một chút, món ăn sẽ tanh, bở và mất hẳn vị ngọt tự nhiên, dù bạn nấu khéo đến đâu. Người bán cá lâu năm có thể nhận biết cá tươi chỉ trong vài giây bằng mắt và tay. Bạn cũng làm được điều đó nếu nắm vững 6 dấu hiệu dưới đây.

## 1. Nhìn vào mắt cá

Mắt cá tươi trong veo, hơi lồi ra, con ngươi đen rõ và giác mạc trong suốt. Cá để lâu mắt sẽ đục dần, lõm vào trong và chuyển màu trắng xám. Đây là dấu hiệu dễ quan sát nhất và cũng đáng tin nhất, hãy luôn kiểm tra đầu tiên.

## 2. Kiểm tra mang cá

Vạch nhẹ nắp mang: cá tươi có mang màu đỏ hồng hoặc đỏ sẫm, sạch, không nhớt. Mang chuyển nâu xám, có chất nhầy đục hoặc mùi lạ là cá đã ươn. Lưu ý: một số nơi có thể nhuộm mang cho đỏ giả tạo, nên cần kết hợp với các dấu hiệu khác thay vì chỉ nhìn màu mang.

## 3. Ấn tay kiểm tra độ đàn hồi

Dùng ngón tay ấn nhẹ vào thân cá: thịt cá tươi săn chắc, vết ấn đàn hồi trở lại ngay. Nếu ấn vào thấy mềm nhũn, để lại vết lõm lâu hoặc thịt rời rạc khỏi xương thì cá đã để lâu. Với cá phi lê, thịt phải ráo bề mặt, không chảy nước đục.

## 4. Quan sát da và vảy

Cá tươi có da bóng, ánh kim tự nhiên, vảy bám chặt vào thân (với loại có vảy). Da xỉn màu, vảy dễ bong tróc hàng loạt, bụng cá phình hoặc đổi màu vàng xanh là dấu hiệu cá bắt đầu phân hủy ở phần bụng - tuyệt đối không mua.

## 5. Ngửi mùi

Cá tươi chỉ có mùi tanh nhẹ đặc trưng của nước, hơi giống mùi rong biển. Cá ươn có mùi tanh nồng gắt, chua hoặc mùi khai amoniac. Khi mua cá đông lạnh, nếu ngửi thấy mùi lạ sau lớp đá thì bên trong thường đã kém chất lượng.

## 6. Mẹo chọn từng loại cá phổ biến

Cá lóc, cá trê: chọn con bơi khỏe, da nhớt trong, không trầy xước. Cá biển như cá thu, cá ngừ: ưu tiên con mắt trong, thân cứng, ấn vào chắc tay. Tôm tươi vỏ trong bóng, đầu dính chặt thân; mực tươi da còn lấp lánh các đốm màu, thịt trắng săn.

## Mua về rồi, bảo quản sao cho tươi lâu?

Nếu chưa nấu ngay, làm sạch cá, thấm khô, cho vào hộp kín lót giấy thấm và để ngăn mát, dùng trong ngày là tốt nhất. Muốn để lâu hơn, chia khẩu phần vừa bữa, bọc kín từng phần rồi cấp đông; khi dùng rã đông chậm trong ngăn mát qua đêm để thịt cá không bị bở nước.', 'https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=800', 'Mẹo vặt', 'a1000000-0000-0000-0000-000000000001', 'xuat_ban', 0
where not exists (select 1 from bai_viet where slug = 'cach-chon-ca-tuoi-ngon');

insert into bai_viet (tieu_de, slug, tom_tat, noi_dung, anh_dai_dien, danh_muc, tac_gia_id, trang_thai, luot_xem)
select 'Bảo quản rau củ tươi lâu cả tuần trong tủ lạnh', 'bao-quan-rau-cu-tuoi-lau', 'Rau mua về hay héo úa, nhớt hỏng chỉ sau 2-3 ngày? Nguyên nhân phần lớn nằm ở cách cất trữ. Áp dụng nguyên tắc khô - thoáng - phân loại để rau củ giữ được độ tươi giòn cả tuần.', '## Kẻ thù lớn nhất của rau: hơi ẩm đọng

Đa số rau củ hỏng trong tủ lạnh không phải vì "hết hạn" mà vì hơi nước đọng trên bề mặt tạo môi trường cho vi khuẩn và nấm mốc phát triển, gây nhớt và thối. Vì vậy nguyên tắc đầu tiên là: cất rau khi khô ráo, và dùng giấy ăn hoặc khăn sạch hút ẩm trong suốt quá trình bảo quản.

## Rau ăn lá: cuộn giấy, cho vào hộp kín

Xà lách, cải, rau thơm sau khi rửa (hoặc tốt hơn là chưa rửa nếu còn sạch) cần vẩy thật ráo nước. Xếp rau vào hộp có lót giấy ăn bên dưới và phủ thêm một lớp giấy lên trên, đậy kín, để ngăn mát. Giấy hút ẩm giúp lá rau giòn tươi 5-7 ngày. Rau thơm như hành lá, ngò rí có thể cắm vào ly nước như cắm hoa rồi bọc túi thoáng, để trong tủ lạnh.

## Củ quả cứng: để nguyên, tránh rửa trước

Cà rốt, củ cải, khoai tây không nên rửa trước khi cất vì lớp đất mỏng và vỏ tự nhiên giúp chúng bền hơn. Cà rốt bỏ phần lá xanh (lá hút ẩm làm củ mềm), bọc giấy và cho vào túi zip. Khoai tây và hành tây nên để ngoài tủ lạnh, nơi khô thoáng tránh ánh sáng; cho khoai tây vào tủ lạnh làm tinh bột chuyển thành đường, thay đổi vị khi nấu.

## Quả mọng và nấm: càng khô càng bền

Dâu, nho chỉ rửa ngay trước khi ăn; khi cất giữ nguyên trong hộp có lót giấy, quả nào dập phải loại bỏ ngay để không lây sang quả khác. Nấm tươi bảo quản tốt nhất trong túi giấy thay vì túi nilon, vì giấy thấm hơi ẩm tỏa ra từ nấm.

## Phân loại: quả nào không nên để cạnh nhau

Một số quả chín tỏa khí ethylene làm rau củ xung quanh nhanh chín và nhanh hỏng: chuối, táo, cà chua chín, bơ. Hãy để nhóm này tách riêng với rau ăn lá và dưa leo. Ngược lại, nếu muốn bơ hoặc xoài xanh nhanh chín, hãy để chúng cạnh chuối trong túi giấy.

## Nguyên tắc nhập - xuất kho trong tủ lạnh

Dán nhãn hoặc ghi nhớ ngày mua, xếp đồ cũ ra phía trước (nguyên tắc FIFO: vào trước, dùng trước). Mỗi tuần dành 10 phút kiểm tra tủ lạnh, loại bỏ phần hỏng và lên thực đơn tận dụng rau củ sắp hết hạn - vừa tránh lãng phí, vừa luôn có nguyên liệu tươi cho bữa ăn.', 'https://images.unsplash.com/photo-1466637574441-749b8f19452f?w=800', 'Mẹo vặt', 'a1000000-0000-0000-0000-000000000001', 'xuat_ban', 0
where not exists (select 1 from bai_viet where slug = 'bao-quan-rau-cu-tuoi-lau');

insert into bai_viet (tieu_de, slug, tom_tat, noi_dung, anh_dai_dien, danh_muc, tac_gia_id, trang_thai, luot_xem)
select 'Kỹ thuật cắt thái cơ bản: cầm dao an toàn và cắt đều tay', 'ky-thuat-cat-thai-co-ban', 'Cắt thái đúng kỹ thuật giúp nguyên liệu chín đều, đẹp mắt và quan trọng nhất là an toàn cho ngón tay. Hướng dẫn cách cầm dao, tư thế tay ''móng mèo'' và các kiểu cắt cơ bản nhất trong bếp Việt.', '## Vì sao cắt thái là kỹ năng nền tảng nhất?

Miếng nguyên liệu cắt đều nhau sẽ chín cùng lúc, thấm gia vị đồng đều và trình bày đẹp mắt. Ngược lại, miếng to miếng nhỏ khiến phần nhỏ cháy khét trong khi phần to còn sống. Chưa kể, phần lớn tai nạn trong bếp gia đình đến từ dao - và hầu hết đều do cầm dao, giữ nguyên liệu sai tư thế chứ không phải do dao quá sắc.

## Cách cầm dao đúng

Cầm dao kiểu "pinch grip": ngón cái và ngón trỏ bóp vào hai bên gốc lưỡi dao, ngay sát cán, ba ngón còn lại ôm lấy cán dao. Cách cầm này cho lực và độ kiểm soát tốt nhất, cổ tay không mỏi. Tránh đặt ngón trỏ duỗi thẳng lên sống dao - tư thế nhiều người quen dùng nhưng khiến dao dễ trượt và khó điều khiển khi cắt nguyên liệu cứng.

## Tay giữ nguyên liệu: tư thế móng mèo

Tay không cầm dao giữ nguyên liệu bằng tư thế "móng mèo": các đầu ngón tay cong vào trong như vuốt mèo, khớp ngón tay giữa hướng ra ngoài tiếp xúc nhẹ với mặt phẳng của lưỡi dao. Lưỡi dao trượt dọc theo khớp ngón tay, đầu ngón tay luôn ở phía sau đường cắt nên gần như không thể cắt trúng. Khi cắt, rút dần bàn tay về phía sau theo từng nhát.

## Dao phải sắc mới an toàn

Nghe ngược đời nhưng đúng: dao cùn nguy hiểm hơn dao sắc vì bạn phải dùng nhiều lực, dao dễ trượt khỏi bề mặt nguyên liệu. Hãy mài dao thường xuyên bằng đá mài hoặc cây mài, và luôn cắt trên thớt gỗ hoặc thớt nhựa dày, mặt thớt kê khăn ẩm để không trơn trượt. Không cắt trên đĩa sứ, mặt đá hay thớt kính.

## Các kiểu cắt cơ bản cần thuộc

Thái lát: cắt ngang thớ thành lát mỏng đều, dùng cho thịt xào và rau củ xào. Thái sợi (julienne): từ lát cắt tiếp thành sợi dài đều nhau cho gỏi, nem, mì xào. Cắt hạt lựu: sợi cắt tiếp thành hạt vuông cho súp, cơm chiên. Băm nhuyễn: hai tay giữ dao, đưa mũi dao làm trụ và bập bênh lưỡi dao cho tỏi, hành, sả. Thái ngang thớ thịt: luôn cắt ngược chiều sợi cơ để miếng thịt mềm, không dai.

## Thứ tự làm việc để không lãng phí thời gian

Chuẩn bị toàn bộ nguyên liệu trước khi bắt đầu (mise en place): rửa, gọt, cắt xong xuôi và bày ra từng chén nhỏ theo thứ tự cho vào chảo. Cắt rau củ trước, thịt cá sau để tránh nhiễm chéo, và dùng thớt riêng cho đồ sống - đồ chín. Khi đã đứng bếp xào nấu, bạn sẽ không còn cảnh vừa đảo chảo vừa quýnh quáng cắt hành.', 'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=800', 'Kỹ thuật', 'a1000000-0000-0000-0000-000000000001', 'xuat_ban', 0
where not exists (select 1 from bai_viet where slug = 'ky-thuat-cat-thai-co-ban');

insert into bai_viet (tieu_de, slug, tom_tat, noi_dung, anh_dai_dien, danh_muc, tac_gia_id, trang_thai, luot_xem)
select 'Tủ gia vị Việt: 12 loại gia vị nên có sẵn trong bếp', 'tu-gia-vi-viet-nen-co', 'Chỉ cần 12 loại gia vị nền tảng này, bạn có thể nấu được 90% món Việt từ kho, xào, canh đến nước chấm. Danh sách kèm cách chọn mua và bảo quản để gia vị luôn thơm, không ẩm mốc.', '## Gia vị là linh hồn của món Việt

Cùng một miếng thịt, người nấu khéo biến nó thành món kho đậm đà, món xào thơm lừng hay tô canh thanh ngọt - sự khác biệt nằm ở gia vị và cách dùng. Tin vui là bếp Việt không cần tủ gia vị hàng chục lọ cầu kỳ: chỉ 12 loại cơ bản dưới đây đã bao phủ gần như mọi món ăn hằng ngày.

## Nhóm mặn - ngọt nền tảng

Nước mắm: chọn loại độ đạm cao (trên nhãn ghi từ 30 độ đạm), màu nâu cánh gián trong, mùi thơm dịu không gắt. Nước mắm dùng nêm món kho, xào và pha nước chấm. Muối: nên có cả muối hạt cho sơ chế và muối tinh cho nêm nếm. Đường: đường cát trắng dùng hằng ngày, thêm đường phèn cho các món chè và nước dùng cần vị ngọt thanh, đường thốt nốt cho món kho và chè miền Tây.

## Nhóm tạo mùi thơm

Hành tím và tỏi: hai "công thần" của bếp Việt, phi thơm đầu chảo cho hầu hết món xào kho. Tiêu đen: nên mua hạt về xay dùng dần, thơm hơn hẳn tiêu xay sẵn để lâu. Gừng: khử tanh cá thịt, làm ấm các món chè và nước dùng. Sả: dùng cho món nướng, cà ri, lẩu. Hành lá và ngò rí tuy là rau thơm nhưng vai trò như gia vị hoàn thiện, rắc lên món ăn trước khi tắt bếp.

## Nhóm chua - cay - đặc trưng vùng miền

Chanh và giấm gạo cho vị chua tươi; me vắt cho canh chua miền Tây. Ớt tươi và ớt bột cho vị cay; sa tế cho các món lẩu, xào cay. Bột cà ri và ngũ vị hương là hai hỗn hợp gia vị "cứu cánh" khi muốn đổi vị cho món gà, bò quen thuộc. Nghệ tươi hoặc bột nghệ cho màu vàng đẹp và mùi thơm ấm trong các món kho, xào miền Trung.

## Cách bảo quản để gia vị luôn thơm

Gia vị khô (tiêu hạt, ớt bột, bột cà ri, ngũ vị hương) cần đựng trong lọ thủy tinh kín, để nơi khô thoáng tránh ánh nắng; mua lượng vừa đủ dùng trong 2-3 tháng vì để lâu sẽ bay mùi. Nước mắm đậy kín nắp, tránh để cạnh bếp nóng. Hành tỏi khô để nơi thoáng gió, không cho vào túi nilon kín gây ẩm mốc. Gừng, sả thừa có thể thái sẵn, chia phần cấp đông dùng dần trong tháng.

## Gợi ý sắp xếp để nấu ăn nhanh hơn

Xếp gia vị theo tần suất dùng: hàng trước là muối, đường, nước mắm, hạt nêm; hàng sau là các loại bột gia vị ít dùng hơn. Dán nhãn và ghi ngày mở nắp lên từng lọ. Khi tủ gia vị gọn gàng, bạn sẽ nấu ăn nhanh và tự tin nêm nếm hơn hẳn.', 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=800', 'Kiến thức', 'a1000000-0000-0000-0000-000000000001', 'xuat_ban', 0
where not exists (select 1 from bai_viet where slug = 'tu-gia-vi-viet-nen-co');

insert into bai_viet (tieu_de, slug, tom_tat, noi_dung, anh_dai_dien, danh_muc, tac_gia_id, trang_thai, luot_xem)
select 'Bí quyết nấu nước dùng trong veo, ngọt thanh từ xương', 'bi-quyet-nuoc-dung-trong-veo', 'Nước dùng đục, hôi là nỗi ám ảnh của nhiều người nấu phở, bún, lẩu tại nhà. Năm nguyên tắc về chần xương, nhiệt độ ninh và thứ tự nêm nếm giúp bạn có nồi nước dùng trong như ngoài quán.', '## Nước dùng trong là nước dùng "sạch"

Độ trong của nước dùng không phụ thuộc vào thời gian ninh bao lâu mà phụ thuộc vào việc loại bỏ tạp chất đúng lúc. Máu thừa, vụn thịt và mỡ nổi là ba thủ phạm làm nước đục và hôi. Nắm được điều này, bạn đã đi được nửa đường.

## Nguyên tắc 1: Chần xương và bỏ nước đầu

Xương mua về rửa sạch, cho vào nồi nước lạnh đun đến sôi mạnh 3-5 phút. Lớp bọt xám và máu đông nổi lên chính là tạp chất - hãy đổ bỏ toàn bộ nước chần, rửa lại xương và cọ sạch nồi trước khi ninh chính thức. Bỏ qua bước này, không có cách nào cứu được nồi nước dùng đục về sau.

## Nguyên tắc 2: Ninh lửa nhỏ, không sôi bùng

Cho xương vào nước lạnh mới, đun sôi rồi hạ lửa xuống mức chỉ sôi lăn tăn. Sôi bùng mạnh làm mỡ và tạp chất nhũ hóa vào nước, khiến nước đục trắng như sữa và không thể trong lại. Ninh liu riu cũng giúp vị ngọt từ xương tiết ra từ từ, nước dùng ngọt sâu hơn.

## Nguyên tắc 3: Hớt bọt kiên trì, không khuấy

Trong 20-30 phút đầu, bọt sẽ liên tục nổi lên - hớt sạch bằng muôi, nhúng muôi qua tô nước sạch để không mang bọt trở lại. Hạn chế khuấy đảo nồi trong lúc ninh vì động tác này khuấy tung cặn lắng ở đáy. Nếu cần thêm nước, thêm nước nóng để không làm "sốc nhiệt" nồi dùng.

## Nguyên tắc 4: Rau củ thơm nướng lên trước

Hành tây, hành tím và gừng nướng cháy xém vỏ rồi mới cho vào nồi sẽ cho mùi thơm sâu, màu nước dùng vàng nhẹ đẹp mắt, khác hẳn cho sống. Các gia vị khô như hồi, quế, thảo quả cần rang thơm và cho vào túi vải để dễ vớt ra, tránh vụn gia vị làm đục nước và vị đắng nếu ninh quá lâu.

## Nguyên tắc 5: Nêm muối sớm, nước mắm muộn

Muối có thể cho từ đầu để vị ngọt xương hài hòa, nhưng nước mắm nên nêm gần cuối vì nấu lâu sẽ làm nước dùng chua và sậm màu. Sau khi ninh xong, lọc nước dùng qua rây lót khăn mỏng, để nguội và hớt lớp mỡ đông trên mặt nếu muốn nước dùng thanh nhẹ. Nước dùng đạt chuẩn: trong veo nhìn thấy đáy muôi, thơm dịu, ngọt hậu tự nhiên.

## Bảo quản nước dùng thừa

Chia nước dùng vào hộp nhỏ vừa bữa, cấp đông dùng được 1 tháng. Đây là "vũ khí bí mật" giúp bạn có tô phở, nồi lẩu hay cháo ngon chỉ trong 15 phút vào những ngày bận rộn.', 'https://images.unsplash.com/photo-1555126634-323283e090fa?w=800', 'Kỹ thuật', 'a1000000-0000-0000-0000-000000000001', 'xuat_ban', 0
where not exists (select 1 from bai_viet where slug = 'bi-quyet-nuoc-dung-trong-veo');

insert into bai_viet (tieu_de, slug, tom_tat, noi_dung, anh_dai_dien, danh_muc, tac_gia_id, trang_thai, luot_xem)
select 'Ướp thịt nướng thơm mềm, không khô: tỉ lệ vàng cần nhớ', 'uop-thit-nuong-thom-mem', 'Thịt nướng bị khô, dai hoặc cháy ngoài sống trong thường do ướp sai cách. Công thức tỉ lệ mặn - ngọt - béo - thơm và ba kỹ thuật làm mềm thịt giúp món nướng nào cũng thành công.', '## Ướp thịt nướng là một ''công thức'' chứ không phải tùy hứng

Nhiều người ướp thịt theo thói quen "nhắm chừng" nên bữa ngon bữa dở. Đầu bếp chuyên nghiệp luôn tuân theo tỉ lệ nền: với 500g thịt, cần khoảng 1 thìa canh thành phần mặn (nước mắm hoặc nước tương), 1 thìa canh thành phần ngọt (đường, mật ong hoặc sữa đặc), 1 thìa canh dầu ăn hoặc mỡ, cùng nhóm thơm (sả, tỏi, hành tím băm). Từ tỉ lệ nền này, bạn tùy biến cho từng món mà không sợ lệch vị.

## Thành phần ngọt tạo màu và giữ ẩm

Đường và mật ong không chỉ tạo vị mà còn giúp bề mặt thịt lên màu nâu bóng đẹp nhờ phản ứng caramel khi gặp nhiệt. Tuy nhiên chúng cũng dễ cháy: khi nướng thịt ướp nhiều đường, hãy để lửa vừa và trở mặt thường xuyên, hoặc quét lớp mật ong vào 5 phút cuối thay vì ướp từ đầu.

## Dầu ăn: bước ướp cuối cùng thường bị quên

Sau khi trộn thịt với gia vị, hãy thêm một lớp dầu ăn mỏng tráng ngoài sau cùng. Dầu khóa ẩm giúp thịt không bị khô khi nướng, đồng thời ngăn gia vị bị lửa làm cháy đắng. Với thịt nạc như ức gà hay thăn heo, có thể thay một phần dầu bằng sữa tươi hoặc sữa chua không đường - axit nhẹ giúp thịt mềm rõ rệt.

## Ba kỹ thuật làm mềm thịt tự nhiên

Thứ nhất, dần nhẹ thịt bằng sống dao hoặc búa dần cho thớ thịt mở ra, thấm ướp đều. Thứ hai, ướp kèm nước ép thơm (dứa) hoặc đu đủ xanh - enzyme trong các quả này phân giải protein làm thịt mềm, nhưng chỉ ướp 15-20 phút vì lâu quá thịt sẽ bở nát. Thứ ba, một chút bột bắp hoặc lòng trắng trứng trong nước ướp tạo lớp áo giữ nước cho thịt khi nướng lửa lớn.

## Thời gian ướp bao nhiêu là đủ?

Thịt thái mỏng cần tối thiểu 30 phút; thịt miếng lớn, gà nguyên con cần 2-4 giờ hoặc qua đêm trong ngăn mát. Đưa thịt ra khỏi tủ lạnh 20-30 phút trước khi nướng để thịt về gần nhiệt độ phòng, giúp chín đều từ ngoài vào trong, tránh cảnh ngoài cháy trong sống.

## Lỗi thường gặp cần tránh

Cho muối quá sớm và quá nhiều vào thịt thái mỏng làm thịt ra nước, khô dai (với thịt mỏng, hãy nêm muối sau khi ướp các gia vị khác). Nướng thịt còn ướt bề mặt khiến thịt bị "luộc" thay vì xém cạnh - hãy để thịt ráo nước ướp trước khi lên vỉ. Và quan trọng nhất: để thịt nghỉ 5 phút sau khi nướng rồi mới cắt, nước thịt sẽ ở lại trong miếng thịt thay vì chảy hết ra thớt.', 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800', 'Mẹo vặt', 'a1000000-0000-0000-0000-000000000001', 'xuat_ban', 0
where not exists (select 1 from bai_viet where slug = 'uop-thit-nuong-thom-mem');

insert into bai_viet (tieu_de, slug, tom_tat, noi_dung, anh_dai_dien, danh_muc, tac_gia_id, trang_thai, luot_xem)
select 'Meal prep cho người bận rộn: nấu một lần, ăn ngon cả tuần', 'meal-prep-cho-nguoi-ban-ron', 'Dành 2 giờ cuối tuần chuẩn bị sẵn nguyên liệu và món ăn, bạn sẽ có những bữa cơm nhà ngon, đủ chất suốt tuần mà mỗi tối chỉ mất 15 phút. Hướng dẫn meal prep thực tế cho người Việt bận rộn.', '## Meal prep không có nghĩa là ăn một món suốt 7 ngày

Hiểu lầm lớn nhất về meal prep là hình ảnh những hộp cơm giống hệt nhau ăn cả tuần đến ngán. Cách làm thông minh hơn là chuẩn bị theo "linh kiện": nấu sẵn vài loại đạm, vài loại rau củ, một loại tinh bột và vài loại sốt - đến bữa chỉ việc kết hợp lại theo cách khác nhau, mỗi ngày một món mà không tốn công nấu mới.

## Bước 1: Lên thực đơn và danh sách đi chợ

Chọn 2-3 nguồn đạm cho cả tuần (ví dụ ức gà, thịt bò xay, cá hồi), 3-4 loại rau củ bền (bông cải, cà rốt, đậu que, bí đỏ) và 1-2 loại tinh bột (gạo lứt, khoai lang). Viết danh sách đi chợ theo nhóm để mua một lần đủ dùng, tránh mua dư gây hỏng phí.

## Bước 2: Hai giờ chuẩn bị cuối tuần

Vo và nấu một nồi lớn cơm gạo lứt. Ướp và nướng/ap chảo toàn bộ phần đạm, chia ra: một phần ăn ngay đầu tuần, phần còn lại để nguyên miếng chưa nêm sốt để biến tấu sau. Rau củ cứng hấp hoặc nướng sơ chín 70%, rau ăn lá rửa sạch, quay ráo, cất hộp lót giấy. Pha 2-3 loại sốt để tủ lạnh: sốt sữa chua, nước mắm chua ngọt, sốt mè rang - sốt chính là thứ biến "linh kiện" giống nhau thành những bữa ăn khác hẳn nhau.

## Bước 3: Bảo quản an toàn là điều kiện bắt buộc

Đồ ăn nấu chín để ngăn mát tối đa 3-4 ngày, phần cho cuối tuần nên cấp đông ngay sau khi nấu và nguội. Chia đồ ăn vào hộp nhỏ vừa bữa, đậy kín khi đã nguội hẳn (đậy lúc còn nóng gây đọng hơi nước, nhanh hỏng). Ghi nhãn ngày nấu lên hộp; hâm nóng lại phải đạt sôi đều, và đồ đã rã đông thì không cấp đông lại.

## Bước 4: Biến tấu để không ngán

Cùng phần ức gà nướng: thứ hai ăn cơm gạo lứt sốt mè, thứ ba xé nhỏ trộn salad sữa chua, thứ tư cắt lát kẹp bánh mì sandwich, thứ năm thái sợi xào rau củ với nước tương. Cùng phần cơm gạo lứt: ăn với cá hồi áp chảo, chiên cơm với trứng và rau củ, hoặc nấu cháo nhanh với nước dùng để sẵn. Tư duy "linh kiện + sốt" giúp bạn không bao giờ thấy chán.

## Bắt đầu nhỏ thôi

Đừng cố chuẩn bị 21 bữa ngay tuần đầu. Hãy bắt đầu với việc nấu sẵn đạm và cơm cho 3 ngày trưa đi làm - thành công nhỏ này tạo động lực để bạn mở rộng dần. Meal prep giỏi không phải là nấu nhiều, mà là duy trì được đều đặn nhiều tháng mà không mệt.', 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=800', 'Kiến thức', 'a1000000-0000-0000-0000-000000000001', 'xuat_ban', 0
where not exists (select 1 from bai_viet where slug = 'meal-prep-cho-nguoi-ban-ron');

insert into bai_viet (tieu_de, slug, tom_tat, noi_dung, anh_dai_dien, danh_muc, tac_gia_id, trang_thai, luot_xem)
select 'Bắt đầu eat-clean: 7 nguyên tắc đơn giản cho người mới', 'bat-dau-eat-clean-don-gian', 'Eat-clean không phải ăn kiêng kham khổ mà là quay về với thực phẩm nguyên bản, ít chế biến sẵn. Bảy nguyên tắc dễ áp dụng giúp bạn bắt đầu ăn sạch mà vẫn ngon miệng, không áp lực.', '## Eat-clean thực chất là gì?

Eat-clean (ăn sạch) là cách ăn ưu tiên thực phẩm ở dạng nguyên bản nhất: rau củ quả tươi, thịt cá tươi, ngũ cốc nguyên hạt, và hạn chế tối đa thực phẩm chế biến sẵn nhiều đường, muối, chất béo xấu và phụ gia. Nó không phải chế độ ăn kiêng ngắn hạn để ép cân, mà là thói quen ăn uống duy trì lâu dài.

## Nguyên tắc 1: Nấu ăn tại nhà là nền tảng

Khi tự nấu, bạn kiểm soát được lượng dầu, muối, đường - ba thứ bị lạm dụng nhiều nhất trong đồ ăn ngoài hàng. Chỉ cần tự nấu 5-6 ngày mỗi tuần, bạn đã cắt giảm đáng kể lượng calo rỗng mà không cần thay đổi món ăn yêu thích: món kho vẫn kho, chỉ ít đường hơn một chút; món xào vẫn xào, chỉ dùng chảo chống dính để cần ít dầu hơn.

## Nguyên tắc 2: Đĩa ăn cân bằng 2-1-1

Một mẹo ghi nhớ đơn giản cho mỗi bữa: 2 phần rau củ, 1 phần đạm (thịt, cá, trứng, đậu), 1 phần tinh bột (ưu tiên gạo lứt, khoai lang, yến mạch thay cho một phần gạo trắng). Cách chia này giúp bạn no lâu, đủ chất mà không cần cân đo calo phức tạp trong những ngày đầu.

## Nguyên tắc 3: Đọc nhãn trước khi mua

Thực phẩm đóng gói cần xem ba chỉ số: đường, muối (natri) và danh sách thành phần. Thành phần nào đứng đầu danh sách là chiếm tỉ lệ nhiều nhất; nếu đường đứng đầu trong một món "ăn kiêng", đó là tín hiệu cần cân nhắc. Ưu tiên sản phẩm có danh sách thành phần ngắn và toàn những cái tên bạn nhận ra được.

## Nguyên tắc 4: Thay thế dần, không cắt bỏ đột ngột

Thay mayonnaise bằng sốt sữa chua Hy Lạp, thay nước ngọt bằng nước chanh hoặc trà không đường, thay đồ chiên ngập dầu bằng nồi chiên không dầu hoặc áp chảo. Những thay đổi nhỏ duy trì được lâu dài hơn hẳn việc cắt bỏ mọi món yêu thích trong một tuần rồi bỏ cuộc.

## Nguyên tắc 5: Uống đủ nước và ngủ đủ giấc

Thiếu nước thường bị nhầm với đói, khiến bạn ăn vặt nhiều hơn. Hãy uống nước đều trong ngày, khoảng 1,5-2 lít tùy vận động. Giấc ngủ thiếu cũng làm tăng hormone gây thèm đồ ngọt - ăn sạch bắt đầu từ cả lối sống, không chỉ đĩa ăn.

## Nguyên tắc 6 và 7: Linh hoạt 80/20 và kiên nhẫn

Áp dụng quy tắc 80/20: 80% thời gian ăn sạch, 20% còn lại thoải mái với tiệc tùng, món khoái khẩu cùng gia đình. Eat-clean bền vững là eat-clean có chỗ cho niềm vui. Và hãy kiên nhẫn: cơ thể cần 3-4 tuần để vị giác "reset", sau đó bạn sẽ thấy món ăn ít đường, ít muối ngon lên rõ rệt.', 'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=800', 'Dinh dưỡng', 'a1000000-0000-0000-0000-000000000001', 'xuat_ban', 0
where not exists (select 1 from bai_viet where slug = 'bat-dau-eat-clean-don-gian');

insert into bai_viet (tieu_de, slug, tom_tat, noi_dung, anh_dai_dien, danh_muc, tac_gia_id, trang_thai, luot_xem)
select 'Cách đọc nhãn dinh dưỡng trên thực phẩm đóng gói', 'cach-doc-nhan-dinh-duong', 'Bảng thành phần dinh dưỡng in nhỏ trên bao bì chứa mọi thông tin bạn cần để không bị ''lừa'' bởi quảng cáo ''ít béo'', ''không đường''. Hướng dẫn đọc nhãn trong 60 giây cho mọi sản phẩm.', '## Vì sao phải đọc nhãn thay vì tin quảng cáo?

Mặt trước bao bì là quảng cáo: "ít béo", "giàu chất xơ", "không thêm đường" đều là những tuyên bố được chọn lọc để bán hàng. Mặt sau - bảng thành phần dinh dưỡng và danh sách nguyên liệu - mới là sự thật. Chỉ cần 60 giây đọc đúng chỗ, bạn sẽ chọn thực phẩm sáng suốt hơn hẳn.

## Bước 1: Kiểm tra khẩu phần (serving size)

Đây là cái bẫy phổ biến nhất. Bảng dinh dưỡng thường tính theo một khẩu phần nhỏ hơn nhiều so với lượng bạn thực ăn: một chai nước ngọt 500ml có thể ghi dinh dưỡng cho khẩu phần 200ml, khiến con số đường trông "ít" hơn 2,5 lần thực tế. Luôn nhân các chỉ số với số khẩu phần bạn sẽ dùng hết.

## Bước 2: Nhìn tổng năng lượng và ba chất chính

Quan tâm nhất đến: đường (càng ít càng tốt, đặc biệt ở đồ uống và sữa chua), chất béo bão hòa (hạn chế), chất xơ và đạm (càng cao càng có lợi). Một người trưởng thành trung bình cần khoảng 2.000 kcal/ngày - một món ăn vặt 400 kcal chiếm tới 1/5 nhu cầu ngày, đó là thông tin đáng để cân nhắc trước khi mua.

## Bước 3: Để ý muối (natri/sodium)

Natri ghi trên nhãn tính bằng mg; lượng khuyến nghị tối đa khoảng 2.000mg natri mỗi ngày (tương đương 5g muối). Mì gói, xúc xích, đồ hộp và nước chấm là những "ổ muối" ẩn: một gói mì có thể chứa gần trọn nhu cầu muối cả ngày.

## Bước 4: Đọc danh sách thành phần theo thứ tự

Thành phần được liệt kê theo tỉ lệ giảm dần: thứ đứng đầu chiếm nhiều nhất. Đường có nhiều "bí danh": sucrose, glucose, fructose, siro ngô, mật ong, nước ép cô đặc. Nếu các tên này xuất hiện ở 2-3 vị trí đầu, sản phẩm đó nhiều đường hơn bạn tưởng, kể cả khi mặt trước ghi "từ trái cây tự nhiên".

## Bước 5: Nhận diện chất béo chuyển hóa và phụ gia

Chất béo chuyển hóa (trans fat) trong dầu hydro hóa một phần là loại cần tránh nhất. Với phụ gia (ký hiệu E), đa số được phép dùng ở liều quy định là an toàn, nhưng danh sách thành phần càng ngắn, càng ít chất bạn không nhận ra, sản phẩm càng gần với thực phẩm nguyên bản.

## Thực hành: so sánh hai hộp sữa chua

Sữa chua "có đường vị trái cây": 15g đường/khẩu phần, 0g xơ. Sữa chua không đường: 4-5g đường tự nhiên từ sữa, đạm cao hơn. Chọn loại không đường rồi tự thêm trái cây tươi, bạn vừa kiểm soát được độ ngọt, vừa thêm được chất xơ thật. Đó chính là sức mạnh của việc đọc nhãn.', 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=800', 'Dinh dưỡng', 'a1000000-0000-0000-0000-000000000001', 'xuat_ban', 0
where not exists (select 1 from bai_viet where slug = 'cach-doc-nhan-dinh-duong');

insert into bai_viet (tieu_de, slug, tom_tat, noi_dung, anh_dai_dien, danh_muc, tac_gia_id, trang_thai, luot_xem)
select 'Giảm muối trong bữa ăn Việt mà món ăn vẫn đậm đà', 'giam-muoi-ma-van-dam-da', 'Người Việt ăn muối gần gấp đôi mức khuyến nghị, phần lớn đến từ nước mắm và hạt nêm. Năm chiến lược giảm muối từ từ giúp vị giác thích nghi, món ăn vẫn ngon mà sức khỏe được lợi lớn.', '## Người Việt đang ăn bao nhiêu muối?

Tổ chức Y tế Thế giới khuyến nghị mỗi người trưởng thành ăn dưới 5g muối mỗi ngày, trong khi mức tiêu thụ trung bình ở Việt Nam gần 9-10g - chủ yếu đến từ nước mắm, nước tương, hạt nêm và thói quen chấm thêm khi ăn. Thừa muối lâu dài liên quan đến tăng huyết áp và bệnh tim mạch, thận. Giảm muối là thay đổi nhỏ mang lại lợi ích sức khỏe lớn bậc nhất.

## Vì sao không nên cắt muối đột ngột?

Vị giác cần thời gian thích nghi: giảm khoảng 10-15% lượng muối mỗi 2 tuần, bạn gần như không nhận ra sự khác biệt, và sau 1-2 tháng, khẩu vị sẽ tự "chuẩn hóa" - lúc này ăn lại món mặn cũ sẽ thấy gắt. Cắt đột ngột khiến món ăn nhạt nhẽo, cả nhà chán ăn và bạn bỏ cuộc nhanh chóng.

## Chiến lược 1: Bù vị bằng chua và thơm

Khi giảm mặn, hãy tăng chua (chanh, giấm, me) và tăng thơm (hành tỏi phi, sả, rau thơm, tiêu, gừng). Vị chua và hương thơm đánh lừa vị giác rất hiệu quả: món ăn có chiều sâu hương vị sẽ không còn cảm giác "thiếu muối" dù lượng muối thực tế ít hơn hẳn.

## Chiến lược 2: Nêm muộn và nêm tập trung

Muối và nước mắm cho vào cuối quá trình nấu sẽ "đánh" vào vị giác mạnh hơn cùng một lượng so với cho từ đầu (vì gia vị chưa bị pha loãng và bay hơi). Với món canh, nêm khi canh đã sôi và gần tắt bếp. Với món xào, rưới nước mắm quanh thành chảo nóng ở giây cuối để dậy mùi thơm đặc trưng.

## Chiến lược 3: Cắt muối ẩn trong gia vị chế biến sẵn

Hạt nêm, bột canh, sốt đóng chai đều chứa nhiều muối. Nếu đã dùng hạt nêm thì giảm phần muối và nước mắm tương ứng, đừng cộng dồn cả ba. Nước chấm pha nên pha loãng hơn (tăng nước lọc và chanh, giảm nước mắm nguyên chất) và dùng chén chấm nhỏ để kiểm soát lượng chấm theo thói quen.

## Chiến lược 4: Tăng kali từ rau củ quả

Kali trong rau xanh, chuối, khoai, đậu giúp cơ thể cân bằng natri tốt hơn. Tăng rau trong bữa ăn vì thế vừa giảm cảm giác cần ăn mặn (vì đã no), vừa hỗ trợ trực tiếp cho huyết áp. Đây là lý do các khuyến nghị luôn đi cặp: giảm muối - tăng rau.

## Chiến lược 5: Đọc nhãn và chọn sản phẩm ít natri

Khi mua nước mắm, nước tương, đồ hộp, hãy so sánh chỉ số natri giữa các nhãn hiệu - chênh lệch có thể tới 30-40% cho cùng một loại sản phẩm. Ưu tiên phiên bản "giảm muối" nếu có. Tại nhà, một chiếc thìa cà phê đong muối chuẩn giúp bạn biết chính xác mình đang dùng bao nhiêu thay vì rắc tay ước lượng.', 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800', 'Dinh dưỡng', 'a1000000-0000-0000-0000-000000000001', 'xuat_ban', 0
where not exists (select 1 from bai_viet where slug = 'giam-muoi-ma-van-dam-da');

insert into bai_viet (tieu_de, slug, tom_tat, noi_dung, anh_dai_dien, danh_muc, tac_gia_id, trang_thai, luot_xem)
select 'Chọn nồi chảo cho bếp gia đình: gang, inox hay chống dính?', 'chon-noi-chao-cho-bep-gia-dinh', 'Không cần mua cả bộ nồi đắt tiền, một căn bếp gia đình chỉ cần 3-4 chiếc nồi chảo đúng chất liệu cho từng việc. So sánh ưu nhược điểm của gang, inox, chống dính và gợi ý bộ tối thiểu nên đầu tư.', '## Sai lầm phổ biến: mua nguyên bộ nồi theo quảng cáo

Các bộ nồi 10-12 món trông hoành tráng nhưng thực tế bạn chỉ dùng thường xuyên 3-4 chiếc, số còn lại chiếm chỗ tủ bếp. Cách mua thông minh là chọn từng chiếc theo đúng việc nấu hằng ngày và đầu tư chất lượng tốt cho những chiếc dùng nhiều nhất: một chảo xào/áp chảo, một nồi canh trung, một nồi nhỏ và một chảo chống dính cho trứng và cá.

## Chảo gang: giữ nhiệt vô địch, cần biết chăm sóc

Gang giữ nhiệt cực tốt và tạo lớp xém mặt (sear) đẹp nhất cho bít tết, gà áp chảo, bánh xèo. Chảo gang càng dùng càng chống dính tự nhiên nhờ lớp dầu "tôi" (seasoning) tích lũy. Nhược điểm: nặng, không hợp món chua lâu (canh chua, kho cà làm mòn lớp tôi), cần lau khô và thoa dầu mỏng sau khi rửa để không gỉ. Nếu chăm đúng, một chiếc chảo gang dùng được vài chục năm.

## Nồi chảo inox: bền, đa năng, hợp món nước

Inox (tốt nhất là loại đáy 3 lớp có lõi nhôm/đồng) dẫn nhiệt đều, không phản ứng với thực phẩm chua, chà rửa thoải mái và bền gần như vĩnh viễn. Inox hợp cho nồi canh, nồi luộc, kho và các món cần nấu lâu. Khi áp chảo bằng inox, cần làm nóng chảo đúng mức trước khi cho dầu và thực phẩm (hiệu ứng Leidenfrost: giọt nước lăn như hạt bi là đạt) để thực phẩm không dính.

## Chảo chống dính: tiện nhưng có tuổi thọ

Chống dính là lựa chọn tốt nhất cho trứng, cá phi lê, bánh flan chảo và các món cần ít dầu. Tuy nhiên lớp phủ sẽ mòn sau 2-3 năm sử dụng; không nên đun chảo trống ở lửa lớn quá lâu, không dùng dụng cụ kim loại cào xước, và nên thay khi lớp phủ bong tróc nhiều. Hãy coi chảo chống dính là vật tiêu hao cần thay định kỳ, đừng mua loại quá đắt.

## Bộ tối thiểu gợi ý cho gia đình 3-4 người

Một chảo sâu lòng (wok) 30-32cm bằng thép carbon hoặc gang cho mọi món xào chiên; một nồi inox 24cm cho canh, lẩu, luộc; một nồi nhỏ 18cm cho nấu cháo, hâm sữa, nấu mì; một chảo chống dính 24cm cho trứng và cá. Thêm một nồi áp suất nếu thường ninh xương, hầm đậu. Bộ 4-5 chiếc này nấu được 95% món ăn gia đình.

## Mẹo kéo dài tuổi thọ nồi chảo

Không sốc nhiệt: đừng dội nước lạnh vào chảo đang nóng rực (dễ cong vênh đáy). Ngâm chảo dính bẩn trong nước ấm thay vì cào mạnh. Với đáy nồi cháy, đun nước pha baking soda 10 phút sẽ bong gần hết. Treo hoặc xếp nồi chảo có lót khăn giữa các lớp để tránh trầy xước lẫn nhau.', 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=800', 'Dụng cụ', 'a1000000-0000-0000-0000-000000000001', 'xuat_ban', 0
where not exists (select 1 from bai_viet where slug = 'chon-noi-chao-cho-bep-gia-dinh');

insert into bai_viet (tieu_de, slug, tom_tat, noi_dung, anh_dai_dien, danh_muc, tac_gia_id, trang_thai, luot_xem)
select 'An toàn vệ sinh thực phẩm tại nhà: 10 quy tắc không thể quên', 'an-toan-ve-sinh-thuc-pham-tai-nha', 'Phần lớn vụ ngộ độc thực phẩm xảy ra ngay trong bếp gia đình vì những thói quen tưởng vô hại: rửa thịt gà, dùng chung thớt, để cơm ngoài quá lâu. Mười quy tắc an toàn cơ bản mà mọi người nấu ăn cần thuộc.', '## Ngộ độc thực phẩm thường bắt đầu từ thói quen nhỏ

Vi khuẩn gây bệnh như Salmonella, E. coli không làm thực phẩm đổi mùi hay đổi vị ở giai đoạn đầu, nên "ngửi thấy vẫn thơm" không có nghĩa là an toàn. Bảo vệ gia đình không cần thiết bị gì đặc biệt, chỉ cần làm đúng 10 quy tắc cơ bản sau một cách nhất quán.

## Nhóm quy tắc vệ sinh

Một, rửa tay bằng xà phòng ít nhất 20 giây trước khi nấu, sau khi chạm vào thịt sống, trứng sống và sau khi đi vệ sinh. Hai, dùng thớt và dao riêng cho thực phẩm sống và chín; nếu chỉ có một thớt, hãy chế biến đồ chín trước, đồ sống sau và rửa thớt bằng nước nóng xà phòng giữa hai lần. Ba, lau mặt bếp và tay cầm tủ lạnh thường xuyên - đây là những điểm tay bẩn chạm vào nhiều nhất.

## Nhóm quy tắc về thịt sống

Bốn, không rửa thịt gà sống dưới vòi nước: tia nước bắn mang vi khuẩn văng xa tới 1 mét quanh bồn rửa; thay vào đó, cho thịt trực tiếp vào nồi hoặc thấm khô bằng giấy dùng một lần. Năm, thịt cá sống để ở ngăn dưới cùng của tủ lạnh trong hộp kín, tránh nước thịt rỉ xuống thực phẩm khác. Sáu, rã đông trong ngăn mát, trong lò vi sóng hoặc ngâm túi kín trong nước lạnh - tuyệt đối không rã đông bằng cách để ngoài bàn bếp nhiều giờ.

## Nhóm quy tắc về nhiệt độ

Bảy, nấu chín kỹ: thịt xay và gia cầm cần chín hoàn toàn (nhiệt độ tâm từ 74°C), không còn màu hồng ở phần dày nhất. Tám, thực phẩm đã nấu không để ở nhiệt độ phòng quá 2 giờ (trời nóng trên 32°C chỉ 1 giờ) - cơm nguội để qua trưa là môi trường lý tưởng cho vi khuẩn Bacillus cereus sinh độc tố mà hâm nóng lại cũng không phá hủy hết. Chín, đồ ăn thừa cho vào hộp nông, làm nguội nhanh rồi cất tủ lạnh, dùng trong 3-4 ngày; hâm lại phải sôi kỹ và chỉ hâm một lần.

## Nhóm quy tắc bảo quản

Mười, giữ tủ lạnh ở mức 4°C hoặc thấp hơn và tủ đông ở -18°C; không nhồi tủ quá đầy khiến khí lạnh không lưu thông. Trứng để nguyên trong hộp giấy ở ngăn giữa thay vì cánh cửa (nơi nhiệt độ dao động nhất). Mọi thực phẩm không rõ nguồn gốc, quá hạn hoặc có dấu hiệu lạ - nhớ mốc, nhớt, mùi chua, hộp phồng - cần bỏ đi dứt khoát, đừng tiếc.

## Khi có trẻ nhỏ và người già trong nhà

Trẻ em, người già và phụ nữ mang thai có sức đề kháng yếu hơn, cần thận trọng thêm: tránh trứng lòng đào, thịt tái và sữa chưa tiệt trùng cho nhóm này. An toàn thực phẩm tốt không làm bữa ăn kém vui - nó giúp mọi bữa ăn đều trọn vẹn.', 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=800', 'An toàn thực phẩm', 'a1000000-0000-0000-0000-000000000001', 'xuat_ban', 0
where not exists (select 1 from bai_viet where slug = 'an-toan-ve-sinh-thuc-pham-tai-nha');

insert into bai_viet (tieu_de, slug, tom_tat, noi_dung, anh_dai_dien, danh_muc, tac_gia_id, trang_thai, luot_xem)
select 'Thay thế nguyên liệu khi thiếu: cứu nguy cho mọi công thức', 'thay-the-nguyen-lieu-khi-thieu', 'Đang nấu dở mà phát hiện thiếu bột bắp, hết sữa tươi hay không có bơ? Bảng thay thế nguyên liệu thông minh giúp bạn xử lý ngay mà hương vị món ăn gần như không thay đổi.', '## Đừng bỏ dở món ăn chỉ vì thiếu một thứ

Tình huống ai nấu ăn cũng gặp: cân đo xong xuôi mới phát hiện hết trứng, thiếu bột nở, nhà không có bơ. Thay vì chạy ra chợ lúc đang dở tay, hãy nhớ rằng đa số nguyên liệu đều có phương án thay thế chấp nhận được nếu hiểu vai trò của chúng trong món ăn: tạo sánh, tạo xốp, tạo chua, tạo béo.

## Nhóm bột và chất tạo sánh

Thiếu bột bắp khi cần làm sánh sốt: thay bằng bột năng với lượng tương đương (sốt sẽ trong và dai hơn một chút) hoặc bột mì gấp rưỡi lượng, nhưng cần nấu kỹ hơn để hết vị bột sống. Hết bột nở (baking powder): dùng 1/4 lượng đó baking soda cộng thêm một thành phần chua như sữa chua hoặc vài giọt chanh để kích hoạt. Ngược lại, thiếu baking soda thì tăng bột nở lên 3 lần lượng yêu cầu và bỏ bớt thành phần chua trong công thức.

## Nhóm sữa và bơ

Hết sữa tươi: pha sữa bột, dùng nước cốt dừa (cho món Á rất hợp) hoặc nước pha chút sữa đặc. Thiếu bơ trong món xào, áp chảo: dầu ăn chịu nhiệt tốt thay thế được về mặt chất béo, chỉ khác mùi thơm; trong làm bánh, có thể thay bơ bằng dầu dừa hoặc dầu ăn tỷ lệ 80% lượng bơ (vì bơ chứa khoảng 20% nước). Thiếu kem tươi (whipping cream) cho sốt: dùng sữa tươi pha 1 thìa cà phê bột bắp đun sánh nhẹ, vị sẽ thanh hơn nhưng vẫn tròn vị.

## Nhóm chua và gia vị

Hết chanh: giấm gạo hoặc giấm táo dùng lượng bằng 2/3 lượng nước chanh, cho vị chua gắt hơn nên nêm từ từ. Thiếu nước mắm trong món kho: dùng nước tương pha chút muối, vị sẽ khác nhẹ nhưng vẫn tròn vị mặn; ngược lại thiếu nước tương có thể dùng nước mắm loãng. Ớt tươi hết thì ớt bột hoặc tương ớt cứu nguy tốt, cho vào cuối để giữ vị cay tươi.

## Nhóm nguyên liệu tươi

Hết trứng khi làm bánh: 1 quả trứng tương đương 3 thìa canh sốt táo, hoặc 1/2 quả chuối nghiền, hoặc 3 thìa canh sữa chua cho các loại bánh muffin, bánh mì ngọt (bánh sẽ đặc hơn một chút). Thiếu hành tỏi tươi: bột hành, bột tỏi dùng được với tỉ lệ 1 thìa cà phê bột tương đương 1 củ hành nhỏ hoặc 2 tép tỏi, cho vào sau để không cháy. Thiếu rau thơm trang trí: hành lá phần xanh luôn là phương án an toàn cho hầu hết món Việt.

## Nguyên tắc vàng khi thay thế

Thay thế chỉ cứu được món ăn khi tỉ lệ hợp lý và bạn nêm nếm lại sau cùng. Với món làm bánh cần độ chính xác cao như bánh bông lan, macaron, tốt nhất vẫn nên dùng đúng nguyên liệu. Còn với nấu ăn hằng ngày - kho, xào, canh, sốt - hãy tự tin ứng biến: nấu ăn giỏi là biết xử lý tình huống, không phải thuộc lòng công thức.', 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?w=800', 'Mẹo vặt', 'a1000000-0000-0000-0000-000000000001', 'xuat_ban', 0
where not exists (select 1 from bai_viet where slug = 'thay-the-nguyen-lieu-khi-thieu');

insert into bai_viet (tieu_de, slug, tom_tat, noi_dung, anh_dai_dien, danh_muc, tac_gia_id, trang_thai, luot_xem)
select 'Mâm cơm Việt chuẩn vị: cách kết hợp món mặn, canh, xào và rau', 'mam-com-viet-chuan-vi', 'Một mâm cơm Việt ngon không nằm ở nhiều món cầu kỳ mà ở sự kết hợp hài hòa: món mặn đậm, canh thanh, rau xào giòn và đồ chua cân bằng. Công thức ''lên mâm'' cho bữa cơm gia đình mỗi ngày.', '## Triết lý của mâm cơm Việt

Mâm cơm Việt truyền thống là một hệ thống cân bằng hoàn chỉnh: cơm trắng trung tính làm nền, món mặn đậm đà để "đưa cơm", bát canh thanh mát để dễ nuốt và làm dịu vị, món xào hoặc rau luộc bổ sung chất xơ, thêm chén nước mắm ớt và ít đồ chua. Mỗi món ăn một mình có thể đơn giản, nhưng đặt cạnh nhau trên mâm, chúng nâng đỡ nhau thành bữa ăn trọn vẹn.

## Công thức lên mâm cơ bản: 1 mặn - 1 canh - 1 rau

Món mặn (kho, rim, chiên, nướng) là "nhân vật chính" mang vị đậm nhất. Món canh nên đi ngược tính chất với món mặn: mặn là món khô đậm (thịt kho trứng) thì canh nên thanh nhẹ (canh rau ngót, canh bí); mặn là món nhiều nước (cá kho) thì giảm canh lớn, thay bằng rau luộc chấm kho quẹt cũng hợp. Món rau (xào tỏi, luộc, gỏi) chọn loại rau theo mùa, nấu nhanh để giữ màu xanh và độ giòn.

## Cân bằng vị trong cả mâm

Tránh để cả mâm cùng một vị: đã có cá kho cay thì đừng thêm canh chua cay; món mặn nhiều dầu mỡ (ba chỉ kho, gà chiên) cần đồ chua đi kèm như dưa cải, cà pháo, kim chi để chống ngán. Mùa hè ưu tiên canh chua, rau luộc, món hấp; mùa lạnh hợp món kho, rim, canh nóng nhiều gừng tiêu. Đây là cách người xưa "ăn theo mùa" mà không cần ghi chép.

## Ví dụ 3 mâm cơm dễ áp dụng

Mâm 1 (kinh điển miền Bắc): thịt kho trứng, canh rau ngót nấu tôm, đậu que xào tỏi, cà pháo mắm tôm, cơm trắng. Mâm 2 (miền Nam): cá lóc kho tộ, canh chua cá hoặc canh khổ qua, rau muống xào tỏi, dưa leo. Mâm 3 (nhanh gọn 30 phút): trứng chiên thịt bằm, canh cải nấu nấm, su su luộc chấm nước mắm trứng, thêm chén kim chi.

## Phân bổ thời gian nấu cho hợp lý

Nấu theo thứ tự ngược thời gian hoàn thành: món kho và cơm nấu trước vì để chờ được; canh nấu giữa lúc kho đang riu lửa; món xào và rau luộc làm sau cùng, ngay trước khi ăn để còn xanh giòn, nóng hổi. Cơm dọn ra khi món xào vừa tắt bếp là cả mâm cùng đạt điểm ngon nhất.

## Mâm cơm ngon cũng là mâm cơm vừa đủ

Nấu lượng vừa ăn cho bữa đó, hạn chế đồ thừa hâm lại nhiều lần vừa mất ngon vừa giảm dinh dưỡng. Một mâm cơm 3 món nấu vừa đủ, ăn hết trong bữa với rau xanh tươi luôn ngon hơn mâm 5 món cầu kỳ mà thừa mứa. Đó cũng là tinh thần bền vững của bữa cơm Việt: ngon, cân bằng và trân trọng thực phẩm.', 'https://images.unsplash.com/photo-1592861956120-e524fc739696?w=800', 'Kiến thức', 'a1000000-0000-0000-0000-000000000001', 'xuat_ban', 0
where not exists (select 1 from bai_viet where slug = 'mam-com-viet-chuan-vi');
