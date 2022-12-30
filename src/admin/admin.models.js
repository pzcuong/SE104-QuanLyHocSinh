const sql = require("mssql");
var fs = require('fs');
var json2html = require('json2html');
const { config } = require('dotenv');
require('dotenv').config();

const configUser = {
    user: process.env.user,
    password: process.env.password,
    server: process.env.server,
    database: process.env.database,
    port: 1433
}

async function TruyVan(TypeUser, SQLQuery) {
    try {
        if (TypeUser == 'Admin') {
            let pool = await new sql.ConnectionPool(configUser);
            let result = await pool.connect();
            let queryResult = await result.query(SQLQuery);
            await pool.close();
            return {
                statusCode: 200,
                user: 'Admin',
                message: "Thành công",
                result: queryResult
            };
        }
    } catch (err) {
        console.log("Lỗi TruyVan (admin.models)", SQLQuery, err);  
        return {
            statusCode: 500,
            message: 'Lỗi truy vấn SQL!'
        };
    }
}

async function getClass(malop) {
    try {
        if (!malop || malop.indexOf(' ') > -1 || malop.indexOf('@') > -1 || malop.indexOf('.') > -1)
            return ({
                statusCode: 400,
                message: 'Lớp không hợp lệ!',
                alert: 'Lớp không hợp lệ!'
            });
        else {
            let result = await TruyVan("Admin", `select * from LOP where MaLop = '${malop}'`);
            if (result.statusCode == 200 && result.result.recordset.length > 0)
                return ({
                    statusCode: 200,
                    message: 'Thành công',
                    result: result.result.recordset[0]
                });
            else
                return ({
                    statusCode: 404,
                    message: 'Không tìm thấy lớp',
                    alert: 'Không tìm thấy lớp'
                });
        }
    } catch (err) {
        console.log("Lỗi getClass (admin.models)", err);
        return ({
            statusCode: 500,
            message: 'Lỗi hệ thống!',
            alert: 'Lỗi hệ thống'
        });
    }
}

async function ThemLopHoc(data) {
    try {
        let SQLQuery = `
            INSERT INTO LOP (MaLop, TenLop, MaKhoiLop) 
            VALUES (N'${data.MaLop}', N'${data.TenLop}', N'${data.MaKhoiLop}');

            UPDATE LOP SET MaHocKy = (
                SELECT HK.MaHocKy FROM dbo.HOCKY HK INNER JOIN dbo.NAMHOC NH ON HK.MaNam = NH.MaNamHoc
                WHERE HK.HocKy = '${data.HocKy}' AND HK.MaNam = '${data.MaNamHoc}'
            ) WHERE MaLop = '${data.MaLop}';
        `;
        console.log(SQLQuery);
        let result = await TruyVan("Admin", SQLQuery);
        console.log(result);
        return ({
            statusCode: 200,
            message: 'Thành công',
            result: result.result.recordsets
        })
    }
    catch (err) {
        console.log("Lỗi createClass (admin.models)", err);
        return ({
            statusCode: 500,
            message: 'Lỗi hệ thống!',
            alert: 'Lỗi hệ thống'
        });
    }
}

async function DanhSachHocSinh() {
    try {
            let SQLQuery = `SELECT DISTINCT HS.MaHS, HS.HoTen, HS.GioiTinh,HS.NgSinh,L.TenLop, HS.Email, HS.DiaChi
            FROM HOCSINH HS, LOP L, HOCSINH_LOP HS_L
            WHERE HS.MaHS = HS_L.MaHS AND HS_L.MaLop = L.MaLop 
            ORDER BY HS.MaHS`;

            let result = await TruyVan("Admin", SQLQuery);
            let class_data = result.result.recordset[0];
            console.log(result);
            return result;

    } catch (err) {
        console.log("Lỗi DanhSachHocSinh (admin.models)", err);
        return ({
            statusCode: 500,
            message: 'Lỗi hệ thống!',
            alert: 'Lỗi hệ thống'
        });
    }
}

async function DanhSachGiaoVien() {
    try {
            let SQLQuery = `SELECT * FROM GIAOVIEN`;

            let result = await TruyVan("Admin", SQLQuery);
            let class_data = result.result.recordset[0];
            console.log(result);
            return result;

    } catch (err) {
        console.log("Lỗi DanhSachGiaoVien (admin.models)", err);
        return ({
            statusCode: 500,
            message: 'Lỗi hệ thống!',
            alert: 'Lỗi hệ thống'
        });
    }
}

async function DanhSachBaiDang() {
    try {
            let SQLQuery = `SELECT * FROM BAIDANG ORDER BY MaBaiDang DESC`;

            let result = await TruyVan("Admin", SQLQuery);
            let class_data = result.result.recordset[0];
            console.log(result);
            return result;

    } catch (err) {
        console.log("Lỗi DanhSachGiaoVien (admin.models)", err);
        return ({
            statusCode: 500,
            message: 'Lỗi hệ thống!',
            alert: 'Lỗi hệ thống'
        });
    }
}

async function ThemHocSinhVaoLop(MaHS, MaLop) {
    try {
        let SQLQuery = `insert into HOCSINH_LOP (MaHS, MaLop) values ('${MaHS}', '${MaLop}')`;
        let result = await TruyVan("Admin", SQLQuery);
        console.log("Thêm học sinh vào lớp", result);
        return result;
    } catch(err) {
        console.log(err);
        return ({ 
            statusCode: 400,
            message: 'Lỗi truy vấn SQL!',
            alert: 'Kiểm tra lại câu lệnh SQL!'
        });
    }
}

async function ThemGiaoVienVaoLop(MaGV, MaLop, MaMH) {
    try {
        let SQLQuery = `insert into LOP_MONHOC (MaLop, MaMH, MaGV) values ('${MaLop}', '${MaMH}','${MaGV}' )`;
        let result = await TruyVan("Admin", SQLQuery);
        return result;
    } catch(err) {
        console.log(err);
        return ({ 
            statusCode: 400,
            message: 'Lỗi truy vấn SQL!',
            alert: 'Kiểm tra lại câu lệnh SQL!'
        });
    }
}

async function ThemBaiDang(data) {
    try {
        let SQLQuery = `set dateformat dmy; insert into BaiDang 
        (NoiDung, NgayDang, TieuDe) 
        values (N'${data.NoiDung}', N'${data.NgayDang}', N'${data.TieuDe}')`;

        let result = await TruyVan("Admin", SQLQuery);
        console.log(result);
        return ({
            statusCode: 200,
            message: 'Thành công',
            result: result.result.recordsets
        })
    } catch (err) {
        console.log("Lỗi ThemBaiDang (admin.models)", err);
        return ({
            statusCode: 500,
            message: 'Lỗi hệ thống!',
            alert: 'Lỗi hệ thống'
        });
    }
}

async function ThayDoiThongTin(data, table) {
    try {
        let SQLQuery;
        if (table == "HocSinh")
            SQLQuery = `update ${table} set HoTen = N'${data.HoTen}', GioiTinh = N'Nam', NgSinh = N'${data.NgSinh}', Email = N'${data.Email}', DiaChi = N'${data.DiaChi}' where MaHS = N'${data.MaHS}'`;
        else
            SQLQuery = `update ${table} set HoTen = N'${data.HoTen}', GioiTinh = N'Nam', NgSinh = N'${data.NgSinh}', Email = N'${data.Email}', DiaChi = N'${data.DiaChi}' where MaGV = N'${data.MaHS}'`;

        let result = await TruyVan("Admin", SQLQuery);
        console.log(result);
        return ({
            statusCode: 200,
            message: 'Thành công',
            result: result.result.recordsets
        })
    } catch (err) {
        console.log("Lỗi ThayDoiThongTin (admin.models)", err);
        return ({
            statusCode: 500,
            message: 'Lỗi hệ thống!',
            alert: 'Lỗi hệ thống'
        });
    }
}

async function DanhSachLopHoc() {
    try {
            let SQLQuery = `SELECT * FROM LOP`;

            let result = await TruyVan("Admin", SQLQuery);
            let class_data = result.result.recordset[0];
            console.log(result);
            return result;

    } catch (err) {
        console.log("Lỗi DanhSachLopHoc (admin.models)", err);
        return ({
            statusCode: 500,
            message: 'Lỗi hệ thống!',
            alert: 'Lỗi hệ thống'
        });
    }
}

async function DanhSachVaiTro() {
    try {
            let SQLQuery = `SELECT * FROM VAITRO`;

            let result = await TruyVan("Admin", SQLQuery);
            let class_data = result.result.recordset[0];
            console.log(result);
            return result;

    } catch (err) {
        console.log("Lỗi DanhSachVaiTro (admin.models)", err);
        return ({
            statusCode: 500,
            message: 'Lỗi hệ thống!',
            alert: 'Lỗi hệ thống'
        });
    }
}

async function XoaBaiDang(MaBD) {
    try {
        let SQLQuery = `delete from BaiDang where MaBaiDang = N'${MaBD}'`;
        let result = await TruyVan("Admin", SQLQuery);
        console.log("Xóa bài đăng", result);
        return result;
    } catch(err) {
        console.log(err);
        return ({ 
            statusCode: 400,
            message: 'Lỗi truy vấn SQL!',
            alert: 'Kiểm tra lại câu lệnh SQL!'
        });
    }
}

async function XoaHocSinh(MaHS) {
    try {

        let SQLQuery = `delete from HOCSINH where MaHS = N'${MaHS}'`;
        let result = await TruyVan("Admin", SQLQuery);
        // let SQLQuery_XT = `delete from XacThuc where MaND = N'${MaHS}'`;
        // let result_XT = await TruyVan("Admin", SQLQuery_XT);
        console.log("Xóa học sinh", result);
        return result;
    } catch(err) {
        console.log(err);
        return ({ 
            statusCode: 400,
            message: 'Lỗi truy vấn SQL!',
            alert: 'Kiểm tra lại câu lệnh SQL!'
        });
    }
}

async function XoaGiaoVien(MaGV) {
    try {

        let SQLQuery = `delete from GIAOVIEN where MaGV = N'${MaGV}'`;
        let result = await TruyVan("Admin", SQLQuery);
        // let SQLQuery_XT = `delete from XacThuc where MaND = N'${MaGV}'`;
        // let result_XT = await TruyVan("Admin", SQLQuery_XT);
        console.log("Xóa giáo viên", result);
        return result;
    } catch(err) {
        console.log(err);
        return ({ 
            statusCode: 400,
            message: 'Lỗi truy vấn SQL!',
            alert: 'Kiểm tra lại câu lệnh SQL!'
        });
    }
}

async function XoaLopHoc(MaLop) {
    try {

        let SQLQuery = `delete from LOP where MaLop = N'${MaLop}'`;
        let result = await TruyVan("Admin", SQLQuery);
        console.log("Xóa lớp học", result);
        return result;
    } catch(err) {
        console.log(err);
        return ({ 
            statusCode: 400,
            message: 'Lỗi truy vấn SQL!',
            alert: 'Kiểm tra lại câu lệnh SQL!'
        });
    }
}

async function DanhSachMonHoc() {
    try {
            let SQLQuery = `SELECT DISTINCT MaMH, TenMH, MoTa, HeSo
            FROM MONHOC MH
            ORDER BY MH.MaMH`;

            let result = await TruyVan("Admin", SQLQuery);
            let subject_data = result.result.recordset[0];
            console.log(result);
            return result;

    } catch (err) {
        console.log("Lỗi DanhSachMonHoc (admin.models)", err);
        return ({
            statusCode: 500,
            message: 'Lỗi hệ thống!',
            alert: 'Lỗi hệ thống'
        });
    }
}

async function XoaMonHoc(MaMH) {
    try {

        let SQLQuery = `delete from MONHOC where MaMH = N'${MaMH}'`;
        let result = await TruyVan("Admin", SQLQuery);
        // let SQLQuery_XT = `delete from XacThuc where MaND = N'${MaHS}'`;
        // let result_XT = await TruyVan("Admin", SQLQuery_XT);
        console.log("Xóa môn học", result);
        return result;
    } catch(err) {
        console.log(err);
        return ({ 
            statusCode: 400,
            message: 'Lỗi truy vấn SQL!',
            alert: 'Kiểm tra lại câu lệnh SQL!'
        });
    }
}

async function ThongTinMonHoc(MaMH) {
    try {

        let SQLQuery = `select * from MONHOC where MaMH = N'${MaMH}'`;
        let result = await TruyVan("Admin", SQLQuery);
        // let SQLQuery_XT = `delete from XacThuc where MaND = N'${MaHS}'`;
        // let result_XT = await TruyVan("Admin", SQLQuery_XT);
        console.log("Xem thông tin môn học", result);
        return result;
    } catch(err) {
        console.log(err);
        return ({ 
            statusCode: 400,
            message: 'Lỗi truy vấn SQL!',
            alert: 'Kiểm tra lại câu lệnh SQL!'
        });
    }
}

exports.ThongTinMonHoc = ThongTinMonHoc;
exports.XoaLopHoc = XoaLopHoc;
exports.XoaGiaoVien = XoaGiaoVien;
exports.XoaHocSinh = XoaHocSinh;
exports.DanhSachMonHoc = DanhSachMonHoc;
exports.ThemGiaoVienVaoLop = ThemGiaoVienVaoLop;
exports.ThemHocSinhVaoLop = ThemHocSinhVaoLop;
exports.DanhSachHocSinh = DanhSachHocSinh;
exports.getClass = getClass;
exports.ThemLopHoc = ThemLopHoc;
exports.TruyVan = TruyVan;
exports.ThemBaiDang = ThemBaiDang;
exports.ThayDoiThongTin = ThayDoiThongTin;
exports.DanhSachLopHoc = DanhSachLopHoc;
exports.DanhSachGiaoVien = DanhSachGiaoVien;
exports.DanhSachBaiDang = DanhSachBaiDang;
exports.XoaBaiDang = XoaBaiDang;
exports.DanhSachVaiTro = DanhSachVaiTro;
exports.XoaMonHoc = XoaMonHoc;

async function ThemVaiTro(data) {
    try {
        let SQLQuery = `insert into VAITRO(TenVaiTro, HocSinh, Lop, MonHoc, GiaoVien, ThongBao, QuyDinh, BaoCao, ThemVaiTro) 
        values (N'${data.TenVaiTro}', N'${data.HocSinh}', N'${data.Lop}', N'${data.MonHoc}', N'${data.GiaoVien}', N'${data.ThongBao}', N'${data.QuyDinh}', N'${data.BaoCao}', N'${data.ThemVaiTro}')`;
        let result = await TruyVan("Admin", SQLQuery);
        console.log(result);
        return result;
    } catch(err) {
        console.log(err);
        return ({ 
            statusCode: 400,
            message: 'Lỗi truy vấn SQL!',
            alert: 'Kiểm tra lại câu lệnh SQL!'
        });
    }
}

async function XemQuyDinh() {
    try {
        let SQLQuery = `select * from THAMSO`;
        let result = await TruyVan("Admin", SQLQuery);
        console.log(result);
        return result;
    } catch(err) {
        console.log(err);
        return ({ 
            statusCode: 400,
            message: 'Lỗi truy vấn SQL!',
            alert: 'Kiểm tra lại câu lệnh SQL!'
        });
    }
}

async function ThayDoiQuyDinh(data) {
    try {
        let SQLQuery = `update THAMSO set GiaTri = N'${data.GiaTri}' where TenThamSo = N'${data.TenThamSo}'`;
        let result = await TruyVan("Admin", SQLQuery);
        console.log(result);
        return result;
    } catch(err) {
        console.log(err);
        return ({ 
            statusCode: 400,
            message: 'Lỗi truy vấn SQL!',
            alert: 'Kiểm tra lại câu lệnh SQL!'
        });
    }
}

async function DanhSachHocSinhTrongLopTheoMaLop(MaLop) {
    try {
        let SQLQuery = `SELECT DISTINCT TenLop, SiSo, HOCSINH.MaHS, HoTen, GioiTinh, NgSinh, DiaChi, (DiemTBHK + DiemTBHK2*2)/3 AS DTBNam
        FROM LOP 
            INNER JOIN dbo.HOCSINH_LOP ON HOCSINH_LOP.MaLop = LOP.MaLop 
            INNER JOIN dbo.HOCSINH ON HOCSINH.MaHS = HOCSINH_LOP.MaHS
        WHERE LOP.MaLop = '${MaLop}'`;

        let result = await TruyVan("Admin", SQLQuery);
        console.log("Danh sách các học sinh trong lớp theo mã lớp", result);
        return result;
    } catch (err) {
        console.log(err);
        return ({
            statusCode: 400,
            message: 'Lỗi truy vấn SQL!',
            alert: 'Kiểm tra lại câu lệnh SQL!'
        });
    }
}

async function DanhSachMonHocTrongLopTheoMaLop(MaLop) {
    try {
        let SQLQuery = `SELECT DISTINCT LOP_MONHOC.MaMH, TenMH, MoTa, HeSo, LOP.MaLop, TenLop, MaGV
        FROM dbo.MONHOC 
            FULL JOIN dbo.LOP_MONHOC ON LOP_MONHOC.MaMH = MONHOC.MaMH
            INNER JOIN dbo.LOP ON LOP.MaLop = LOP_MONHOC.MaLop
        WHERE LOP.MaLop = '${MaLop}'`;

        let result = await TruyVan("Admin", SQLQuery);
        console.log("Danh sách các môn học trong lớp theo mã lớp", result);

        let SQLQuery2 = `SELECT DISTINCT MONHOC.MaMH, TenMH, MoTa, HeSo, MaGV
        FROM dbo.MONHOC 
            LEFT JOIN dbo.LOP_MONHOC ON LOP_MONHOC.MaMH = MONHOC.MaMH
        WHERE MaLop = '${MaLop}' OR MaLop IS NULL
        ORDER BY MONHOC.MaMH`;

        let result2 = await TruyVan("Admin", SQLQuery2);
        console.log("Danh sách các môn học", result2);

        let SQLQuery3 = `SELECT DISTINCT * FROM GIAOVIEN`;
        let result3 = await TruyVan("Admin", SQLQuery3);

        return {
            DanhSachMonHoc: result2,
            DanhSachMonHocTrongLop: result,
            DanhSachGiaoVien: result3
        };
    } catch (err) {
        console.log(err);
        return ({
            statusCode: 400,
            message: 'Lỗi truy vấn SQL!',
            alert: 'Kiểm tra lại câu lệnh SQL!'
        });
    }
}

async function ThemMonHocVaoLop(MaLop, MaMH) {
    try {
        let SQLQuery = `insert into LOP_MONHOC (MaLop, MaMH) values ('${MaLop}', '${MaMH}')`;
        let result = await TruyVan("Admin", SQLQuery);
        console.log("Thêm môn học vào lớp", result);
        return result;
    } catch(err) {
        console.log(err);
        return ({ 
            statusCode: 400,
            message: 'Lỗi truy vấn SQL!',
            alert: 'Kiểm tra lại câu lệnh SQL!'
        });
    }
}


exports.XemQuyDinh = XemQuyDinh;
exports.ThayDoiQuyDinh = ThayDoiQuyDinh;
exports.ThemVaiTro = ThemVaiTro;
exports.DanhSachHocSinhTrongLopTheoMaLop = DanhSachHocSinhTrongLopTheoMaLop;
exports.DanhSachMonHocTrongLopTheoMaLop = DanhSachMonHocTrongLopTheoMaLop;
exports.ThemMonHocVaoLop = ThemMonHocVaoLop;