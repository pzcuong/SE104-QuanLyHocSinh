const pug = require('pug');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs'); 
var randToken = require('rand-token');
const adminModel = require('../admin/admin.models');
const userModel = require('../users/users.models');
const authMiddleware = require('../auth/auth.middlewares');
const authController = require('../auth/auth.controller');
const authMethod = require('../auth/auth.methods');

const SALT_ROUNDS = 10;

async function ThemTaiKhoan(req, res, next) {
    const username = req.body.MaND;
    const role = req.body.Role;

    if(!username || !role || !req.body.HoTen || !req.body.Email) 
        return res
            .status(400)
            .send({
                statusCode: 400,
                message: 'Vui lòng nhập đầy đủ thông tin.',
                alert: 'Vui lòng nhập đầy đủ thông tin.',
            });

    const user = await userModel.getUser(username);
    console.log(username);
    if(user.statusCode == 400 || user.statusCode == 500)
        return res
            .status(user.statusCode)
            .send({
                statusCode: 500,
                message: "lỗi truy vấn SQL",
                alert: "Tài khoản đã tồn tại"
            });

    else if(user.statusCode == 404) {
        const newUser = await userModel.createUser(req.body, req.body.Role);

        if(newUser.statusCode === 200 ) 
            return res
                .status(200)
                .send({
                    statusCode: 200,
                    message: 'Tạo tài khoản thành công',
                    username: username,
                    redirect: '/admin/ThemTaiKhoan'
                });
        else
            return res
                .status(400)
                .send({
                    statusCode: 400,
                    message: newUser.error,
                    alert: "Tạo tài khoản không thành công",
                    redirect: '/admin/ThemTaiKhoan'
                });
    }
    else
        return res
            .status(400)
            .send({
                statusCode: 400,
                message: "Username đã tồn tại",
                alert: "Username đã tồn tại",
                redirect: '/admin/ThemTaiKhoan'
            });
}

async function ThemLopHoc(req, res, next) {
    const MaLop = req.body.MaLop;
    const TenLop = req.body.TenLop;
    const MaKhoiLop = req.body.MaKhoiLop;
    const HocKy = req.body.HocKy;
    const MaNamHoc = req.body.MaNamHoc;

    if (!MaNamHoc) {
        DanhSachNamHoc = await userModel.DanhSachNamHoc();
        req.body.NamHoc = DanhSachNamHoc.result.recordsets[0][0].NamHoc;
        return res.json({
            statusCode: 200,
            message: 'Lấy danh sách năm học thành công',
            result: DanhSachNamHoc.result.recordsets[0]
        });
    }

    if( !MaLop || !TenLop || !MaKhoiLop || !HocKy)   
        return res
            .status(400)
            .send({
                statusCode: 400,
                message: 'Vui lòng nhập đầy đủ thông tin.',
                alert: 'Vui lòng nhập đầy đủ thông tin.',
            });

    const Class = await adminModel.getClass(MaLop);
    if(Class.statusCode == 400 || Class.statusCode == 500)
        return res
                .status(Class.statusCode)
                .send({
                        statusCode: Class.statusCode,
                        message: Class.message,
                        alert: Class.alert
                });
        
    else if(Class.statusCode == 404) {
        const data = {
            MaLop: MaLop,
            TenLop: TenLop,
            MaKhoiLop: MaKhoiLop,
            HocKy: HocKy,
            MaNamHoc: MaNamHoc
        };
            
        const newClass = await adminModel.ThemLopHoc(data);
        
        if(newClass.statusCode === 200 ) 
            return res
                .status(200)
                .send({
                    statusCode: 200,
                    message: 'Tạo lớp thành công',
                    malop: data.MaLop,
                    redirect: '/admin/DanhSachLopHoc'
                });
        else
            return res
                    .status(400)
                    .send({
                            statusCode: 400,
                            message: "Tạo lớp không thành công",
                            alert: "Tạo lớp không thành công",
                            redirect: '/admin/ThemLopHoc'
                    });
    }
    else
        return res
            .status(400)
            .send({
                    statusCode: 400,
                    message: "Lớp học đã tồn tại",
                    alert: "Lớp học đã tồn tại",
                    redirect: '/admin/ThemLopHoc'
            });
}


async function DanhSachHocSinh(req, res) { 
    let result = await adminModel.DanhSachHocSinh();
    if(result.statusCode === 200) {
        let html = pug.renderFile('public/admin/DanhSachHocSinh.pug',{
            ClassDataList:  result.result.recordsets[0],
            user: {
                HoTen: req.user.result.HoTen,
            }, role: req.user.role
        });
        res.send(html);
    } else {
        let html = pug.renderFile('public/404.pug', { 
            message: result.message,
            redirect: 'public/Home.pug'
        });
        res.send(html);
    }
}

async function DanhSachGiaoVien(req, res) { 
    let result = await adminModel.DanhSachGiaoVien();
    if(result.statusCode === 200) {
        let html = pug.renderFile('public/admin/DanhSachGiaoVien.pug',{
            ClassDataList:  result.result.recordset,
            user: {
                HoTen: req.user.result.HoTen,
            }, role: req.user.role
        });
        res.send(html);
    } else {
        let html = pug.renderFile('public/404.pug', { 
            message: result.message,
            redirect: 'public/Home.pug'
        });
        res.send(html);
    }
}

async function DanhSachBaiDang(req, res) { 
    let result = await adminModel.DanhSachBaiDang();
    console.log(result.result.recordset)
    if(result.statusCode === 200) {
        let html = pug.renderFile('public/admin/DanhSachBaiDang.pug',{
            ThongTin:  result.result.recordset,
            user: {
                HoTen: req.user.result.HoTen,
            }, role: req.user.role
        });
        res.send(html);
    } else {
        let html = pug.renderFile('public/404.pug', { 
            message: result.message,
            redirect: 'public/Home.pug'
        });
        res.send(html);
    }
}

async function ThemHocSinhVaoLop(req, res) {
    try {

        const data = req.body;
        if(!data.malop || !data.mahs)
            return res
                .status(400)
                .send({
                    statusCode: 400,
                    message: 'Vui lòng nhập đầy đủ thông tin',
                    alert: "Vui lòng nhập đầy đủ thông tin",
                    redirect: '/admin/ThemHocSinh'
                });
        let result_user = await  userModel.getUser(data.mahs);
        if (result_user.statusCode == 200 ){
            let result_class = await adminModel.getClass(data.malop)
            if (result_class.statusCode == 200 ){
                const result = await adminModel.ThemHocSinhVaoLop(data.mahs, data.malop);
                console.log(result);
                return res
                    .status(200)
                    .send({
                        statusCode: 200,
                        message: 'Thêm học sinh vào lớp thành công',
                        alert: "Thêm học sinh vào lớp thành công",
                        redirect: '/admin/ThemHocSinh'
                    });
            }else {
                return res
                        .status(400)
                        .send({
                            statusCode: 400,
                            message: 'Không tìm thấy lớp',
                            alert: "Không tìm thấy lớp",
                            redirect: '/admin/ThemHocSinh'
                    });
            }

        }else{
            return res
                .status(400)
                .send({
                    statusCode: 400,
                    message: 'Không tìm thấy học sinh',
                    alert: "Không tìm thấy học sinh",
                    redirect: '/admin/ThemHocSinh'
            });
        }
    } catch (error) {
        console.log(error);
        return res
        .status(400)
        .send({
            statusCode: 400,
            message: 'Thêm học sinh vào lớp không thành công',
            alert: "Thêm học sinh vào lớp không thành công thành công",
            redirect: '/admin/ThemHocSinh'
        });
    }
}

async function ThemGiaoVienVaoLop(req, res) {
    try {

        const data = req.body;
        console.log(data.magv)
        if(!data.malop || !data.mamh || data.magv)
            return res
                    .status(400)
                    .send({
                        statusCode: 400,
                        message: 'Vui lòng nhập đầy đủ thông tin!',
                        alert: "Vui lòng nhập đầy đủ thông tin!",
                        redirect: '/admin/ThemGiaoVien'
                    });
        let result_class = await adminModel.getClass(data.malop);
        if (result_class.statusCode == 200 ){
            let result_monhoc = await userModel.getMonHoc(data.mamh);
            if (result_monhoc.statusCode == 200){
                let result_giaovien = await userModel.getUser(data.magv);
                if(result_giaovien.statusCode == 200){
                    const result = await adminModel.ThemGiaoVienVaoLop(data.malop, data.mamh, data.magv);
                    console.log(result);
                    return res
                        .status(200)
                        .send({
                            statusCode: 200,
                            message: 'Thêm giáo viên vào lớp thành công',
                            alert: "Thêm giáo viên vào lớp thành công",
                            redirect: '/admin/ThemGiaoVien'
                        });
                }else{
                        return res
                            .status(400)
                            .send({
                                statusCode: 400,
                                message: 'Không tìm thấy giáo viên',
                                alert: "Không tìm thấy giáo viên",
                                redirect: '/admin/ThemGiaoVien'
                        });
                }
            }else{
                    return res
                    .status(400)
                    .send({
                        statusCode: 400,
                        message: 'Không tìm thấy môn học',
                        alert: "Không tìm thấy môn học",
                        redirect: '/admin/ThemGiaoVien'
                });
            }
        }else{
                return res
                .status(400)
                .send({
                    statusCode: 400,
                    message: 'Không tìm thấy lớp',
                    alert: "Không tìm thấy lớp",
                    redirect: '/admin/ThemGiaoVien'
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(400)
                .send({
                    statusCode: 400,
                    message: 'Thêm giáo viên vào lớp không thành công',
                    alert: "Thêm giáo viên vào lớp không thành công thành công",
                    redirect: '/admin/ThemGiaoVien'
                });
    }
}

async function ThemBaiDang(req, res) {
    // Get day, month, year from date
    const date = new Date();
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const NgayDang = day + '/' + month + '/' + year;

    const TieuDe = req.body.TieuDe;
    const NoiDung = req.body.NoiDung;

    if(!TieuDe || !NoiDung)
        return res
            .status(400)
            .send({
                statusCode: 400,
                message: 'Vui lòng nhập đầy đủ thông tin.',
                alert: 'Vui lòng nhập đầy đủ thông tin.',
            });

    const BaiDang = await adminModel.ThemBaiDang({
        TieuDe: TieuDe,
        NoiDung: NoiDung,
        NgayDang: NgayDang
    })

    if(BaiDang.statusCode === 200)
        return res
            .status(200)
            .send({
                statusCode: 200,
                message: 'Thêm bài đăng thành công',
                redirect: '/admin/ThemBaiDang'
            });
    else
        return res
            .status(400)
            .send({
                statusCode: 400,
                message: 'Thêm bài đăng không thành công',
                alert: 'Thêm bài đăng không thành công',
                redirect: '/admin/ThemBaiDang'
            });
}

async function ThongTinNguoiDung(req, res) {
    try {
        const data = req.body;
        //convert to string
        let username = data.username.toString();
        
        const result = await userModel.getInfoUser(username);
        if(result.statusCode === 200)
            return res
                .status(200)
                .send({
                    statusCode: 200,
                    message: 'Lấy thông tin người dùng thành công',
                    data: result.result
                });
        else
            return res
                .status(400)
                .send({
                    statusCode: 400,
                    message: 'Lấy thông tin người dùng không thành công',
                });
    } catch (error) {
        console.log(error);
        return res.status(500)
                .send({
                    statusCode: 500,
                    message: 'Lấy thông tin người dùng không thành công',
                });
    }

}

async function ThongTinMonHoc(req, res) {
    try {
        const data = req.body;
        //convert to string
        let MaMH = data.MaMH;
        
        const result = await adminModel.ThongTinMonHoc(MaMH);
        if(result.statusCode === 200)
            return res
                .status(200)
                .send({
                    statusCode: 200,
                    message: 'Lấy thông tin môn học thành công',
                    data: result.result.recordset[0]
                });
        else
            return res
                .status(400)
                .send({
                    statusCode: 400,
                    message: 'Lấy thông tin môn học không thành công',
                });
    } catch (error) {
        console.log(error);
        return res.status(500)
                .send({
                    statusCode: 500,
                    message: 'Lấy thông tin môn học không thành công',
                });
    }
}

async function ThayDoiThongTin(req, res) {
    const data = req.body;
    console.log("data")
    console.log(data)
    //convert to string
    if(!data.MaHS || !data.HoTen || !data.DiaChi || !data.Email || !data.NgSinh)
        return res
            .status(400)
            .send({
                statusCode: 400,
                message: 'Vui lòng nhập đầy đủ thông tin.',
                alert: 'Vui lòng nhập đầy đủ thông tin.',
            });
    
    let Role = await userModel.getUser(data.MaHS);
    Role = Role.result.Role;
    const result = await adminModel.ThayDoiThongTin(
        data,
        Role
    )
    if(result.statusCode === 200)
        return res
            .status(200)
            .send({
                statusCode: 200,
                message: 'Thay đổi thông tin thành công',
                redirect: '/admin/ThongTinNguoiDung'
            });
    else
        return res
            .status(400)
            .send({
                statusCode: 400,
                message: 'Thay đổi thông tin không thành công',
                alert: 'Thay đổi thông tin không thành công',
                redirect: '/admin/ThongTinNguoiDung'
            });
}

async function DanhSachLopHoc(req, res) {
    const result = await adminModel.DanhSachLopHoc();
    if(result.statusCode === 200)
        return res
            .status(200)
            .send({
                statusCode: 200,
                message: 'Lấy danh sách lớp học thành công',
                data: result.result
            });
    else
        return res
            .status(400)
            .send({
                statusCode: 400,
                message: 'Lấy danh sách lớp học không thành công',
            });
}

async function XemDanhSachLop(req, res) { 
    let result = await adminModel.DanhSachLopHoc();
    if(result.statusCode === 200) {
        let html = pug.renderFile('public/admin/DanhSachLopHoc.pug',{
            ClassDataList:  result.result.recordset,
            user: {
                HoTen: req.user.result.HoTen,
            }, role: req.user.role
        });
        res.send(html);
    } else {
        let html = pug.renderFile('public/404.pug', { 
            message: result.message,
            redirect: 'public/Home.pug'
        });
        res.send(html);
    }
}

async function XemThongTinLop(req, res) {
    let result = await userModel.XemThongTinLop(req.body.MaLop);
    if(result.statusCode === 200) {
        return res
            .status(200)
            .send({
                statusCode: 200,
                message: 'Lấy thông tin lớp học thành công',
                data: result.result
            });
    } else {
        return res
            .status(400)
            .send({
                statusCode: 400,
                message: 'Lấy thông tin lớp học không thành công',
            });
    }       
}

async function XoaBaiDang(req, res) {
    const result = await adminModel.XoaBaiDang(req.body.MaBaiDang);
    if(result.statusCode === 200)
        return res
            .status(200)
            .send({
                statusCode: 200,
                message: 'Xóa bài đăng thành công',
                data: result.result
            });
    else
        return res
            .status(400)
            .send({
                statusCode: 400,
                message: 'Xóa bài đăng không thành công',
            });
}

async function XoaHocSinh(req, res) {
    const result = await adminModel.XoaHocSinh(req.body.MaHS);
    if(result.statusCode === 200)
        return res
            .status(200)
            .send({
                statusCode: 200,
                message: 'Xóa học sinh thành công',
                data: result.result
            });
    else
        return res
            .status(400)
            .send({
                statusCode: 400,
                message: 'Xóa học sinh không thành công',
            });
}

async function XoaGiaoVien(req, res) {
    const result = await adminModel.XoaGiaoVien(req.body.MaGV);
    if(result.statusCode === 200)
        return res
            .status(200)
            .send({
                statusCode: 200,
                message: 'Xóa giáo viên thành công',
                data: result.result
            });
    else
        return res
            .status(400)
            .send({
                statusCode: 400,
                message: 'Xóa giáo viên không thành công',
            });
}

async function XoaLopHoc(req, res) {
    const result = await adminModel.XoaLopHoc(req.body.MaLop);
    if(result.statusCode === 200)
        return res
            .status(200)
            .send({
                statusCode: 200,
                message: 'Xóa lớp học thành công',
                data: result.result
            });
    else
        return res
            .status(400)
            .send({
                statusCode: 400,
                message: 'Xóa lớp học không thành công',
            });
}

exports.XoaLopHoc = XoaLopHoc;
exports.XoaGiaoVien = XoaGiaoVien;
exports.XoaHocSinh = XoaHocSinh;

exports.XemThongTinLop = XemThongTinLop;
exports.ThemGiaoVienVaoLop = ThemGiaoVienVaoLop;
exports.ThemHocSinhVaoLop = ThemHocSinhVaoLop;
exports.DanhSachHocSinh = DanhSachHocSinh;
exports.ThemLopHoc = ThemLopHoc;
exports.ThemTaiKhoan = ThemTaiKhoan;
exports.ThemBaiDang = ThemBaiDang;
exports.ThongTinNguoiDung = ThongTinNguoiDung;
exports.ThayDoiThongTin = ThayDoiThongTin;
exports.DanhSachLopHoc = DanhSachLopHoc;
exports.DanhSachGiaoVien = DanhSachGiaoVien;
exports.DanhSachBaiDang = DanhSachBaiDang;
exports.XemDanhSachLop = XemDanhSachLop;
exports.XoaBaiDang = XoaBaiDang;


async function XemQuyDinh(req, res) { 
    let result = await adminModel.XemQuyDinh();
    if(result.statusCode === 200) {
        console.log(result.result.recordset)
        let html = pug.renderFile('public/admin/QuyDinh.pug',{
            ClassDataList:  result.result.recordset,
            user: {
                HoTen: req.user.result.HoTen,
            }, role: req.user.role
        });
        res.send(html);
    } else {
        let html = pug.renderFile('public/404.pug', { 
            message: result.message,
            redirect: 'public/Home.pug'
        });
        res.send(html);
    }
}

async function ThayDoiQuyDinh(req, res) {
    let result = await adminModel.ThayDoiQuyDinh(req.body);
    if(result.statusCode === 200) {
        return res
            .status(200)
            .send({
                statusCode: 200,
                message: 'Thay đổi quy định thành công',
                data: result.result
            });
    } else {
        return res
            .status(400)
            .send({
                statusCode: 400,
                message: 'Thay đổi quy định không thành công',
            });
    }
}

exports.XemQuyDinh = XemQuyDinh;
exports.ThayDoiQuyDinh = ThayDoiQuyDinh;

async function DanhSachVaiTro(req, res) { 
    let result = await adminModel.DanhSachVaiTro();
    if(result.statusCode === 200) {
        let html = pug.renderFile('public/admin/DanhSachVaiTro.pug',{
            RoleDataList:  result.result.recordset,
            user: {
                HoTen: req.user.result.HoTen,
            }, role: req.user.role
        });
        res.send(html);
    } else {
        let html = pug.renderFile('public/404.pug', { 
            message: result.message,
            redirect: 'public/Home.pug'
        });
        res.send(html);
    }
}

async function ThemVaiTro(req, res) {
    let result = await adminModel.ThemVaiTro(req.body);
    if(result.statusCode === 200) 
        return res
            .status(200)
            .send({
                statusCode: 200,
                message: 'Thêm vai trò thành công',
                data: result.result
            });
    else 
        return res
            .status(400)
            .send({
                statusCode: 400,
                message: 'Thêm vai trò không thành công',
            });
}

async function DanhSachHocSinhTrongLopTheoMaLop(req, res) {
    req.MaLop = req.params.MaLop;

    if(req.method === 'GET') {
        let result = await adminModel.DanhSachHocSinhTrongLopTheoMaLop(req.MaLop);
        console.log(result.result.recordsets)
        if(result.statusCode === 200) {
            let html = pug.renderFile('public/admin/ThemHocSinhLenLop.pug',{
                ClassDataList:  result.result.recordset,
                user: {
                    HoTen: req.user.result.HoTen,
                }, role: req.user.role
            });
            res.send(html);
        } else {
            let html = pug.renderFile('public/404.pug', { 
                message: result.message,
                redirect: 'public/Home.pug'
            });
            res.send(html);
        }
    } else if (req.method === 'POST') {
        let DanhSachNamHoc;
        console.log(req.body)
        req.MaLop = req.params.MaLop;

        if(!req.body.NamHoc) {
            DanhSachNamHoc = await userModel.DanhSachNamHoc();
            req.body.NamHoc = DanhSachNamHoc.result.recordsets[0][0].NamHoc;
            return res.json({
                statusCode: 200,
                message: 'Lấy danh sách năm học thành công',
                result: DanhSachNamHoc.result.recordsets[0]
            });
        }

        if(!req.body.MaLop) {
            DanhSachLop = await adminModel.DanhSachLopHoc()
            // req.body.MaLop = DanhSachLop.result.recordsets[0][0].NamHoc;
            return res.json({
                statusCode: 200,
                message: 'Lấy danh sách lớp học thành công',
                result: DanhSachLop.result
            });
        }

        for(let i = 0; i < req.body.DanhSachHocSinh.length; i++) {
            let result = await adminModel.ThemHocSinhVaoLop(req.body.DanhSachHocSinh[i], req.body.MaLop);
            if (result.statusCode !== 200) 
                return res.json({
                    statusCode: 400,
                    message: 'Thêm học sinh vào lớp không thành công',
                    error: result.error
                });
        }

        return res.json({
            statusCode: 200,
            message: 'Thêm học sinh vào lớp thành công',
        });

    }
}

async function DanhSachMonHocTrongLopTheoMaLop(req, res) {
    req.MaLop = req.params.MaLop;

    if(req.method === 'GET') {
        let result = await adminModel.DanhSachMonHocTrongLopTheoMaLop(req.MaLop);
        console.log(result.DanhSachMonHocTrongLop.result.recordset)
        if(result.DanhSachMonHoc.statusCode === 200) {
            let html = pug.renderFile('public/admin/ThemMonHocVaoLop.pug',{
                DanhSachMonHoc:  result.DanhSachMonHoc.result.recordset,
                DanhSachMonHocTrongLop: result.DanhSachMonHocTrongLop.result.recordset,
                DanhSachGiaoVien: result.DanhSachGiaoVien.result.recordset,
                user: {
                    HoTen: req.user.result.HoTen,
                }, role: req.user.role
            });
            res.send(html);
        } else {
            let html = pug.renderFile('public/404.pug', { 
                message: result.message,
                redirect: 'public/Home.pug'
            });
            res.send(html);
        }
    } else if (req.method === 'POST') {
        let DanhSachNamHoc;
        console.log(req.body)
        req.MaLop = req.params.MaLop;

        for(let i = 0; i < req.body.DanhSachMonHoc.length; i++) {
            let result = await adminModel.ThemMonHocVaoLop(req.MaLop, req.body.DanhSachMonHoc[i]);
            if (result.statusCode !== 200) 
                return res.json({
                    statusCode: 400,
                    message: 'Thêm môn học vào lớp không thành công',
                    error: result.error
                });
        }

        return res.json({
            statusCode: 200,
            message: 'Thêm môn học vào lớp thành công',
        });

    }
}

exports.DanhSachVaiTro = DanhSachVaiTro;
exports.ThemVaiTro = ThemVaiTro;
exports.DanhSachHocSinhTrongLopTheoMaLop = DanhSachHocSinhTrongLopTheoMaLop;
exports.DanhSachMonHocTrongLopTheoMaLop = DanhSachMonHocTrongLopTheoMaLop;

async function XoaMonHoc(req, res) {
    const result = await adminModel.XoaMonHoc(req.body.MaMH);
    if(result.statusCode === 200){
        return res
            .status(200)
            .send({
                statusCode: 200,
                message: 'Xóa môn học thành công',
                data: result.result,
               
            });
    }else
        return res
            .status(400)
            .send({
                statusCode: 400,
                message: 'Môn học đang được giảng dạy, Không thể xóa!',
            });
}

async function ThemMonHoc(req, res) {
    try {

        const data = req.body;
        if(!data.MaMH || !data.MoTa || !data.HeSo || !data.TenMH)
            return res
                .status(400)
                .send({
                    statusCode: 400,
                    message: 'Vui lòng nhập đầy đủ thông tin',
                    alert: "Vui lòng nhập đầy đủ thông tin",
                    redirect: '/admin/ThemMonHoc'
                });

                    let SQLQuery = `insert into MONHOC (MaMH,TenMH,MoTa,HeSo) values ( '${data.MaMH}',N'${data.TenMH}',N'${data.MoTa}','${data.HeSo}')`;
                    let result_subject = await adminModel.TruyVan("Admin", SQLQuery);
                    console.log(result_subject);
                    if (result_subject.statusCode == 200){
                        return res
                            .status(200)
                            .send({
                                statusCode: 400,
                                message: 'Thêm môn học thành công',
                                alert: "Thêm môn học thành công",
                                redirect: '/admin/ThemMonHoc'
                            });
                    }else{
                        return res
                            .status(400)
                            .send({
                                statusCode: 400,
                                message: 'Môn học đã tồn tại,thêm không thành công!',
                                alert: "Môn học đã tồn tại,thêm không thành công!",
                                redirect: '/admin/ThemMonHoc'
                            });
                    }
    } catch (error) {
        console.log(error);
        return res
        .status(400)
        .send({
            statusCode: 400,
            message: 'Thêm môn học vào lớp không thành công',
            alert: "Thêm môn học không thành công",
            redirect: '/admin/ThemMonHoc'
        });
    }
}

async function DanhSachMonHoc(req, res) { 
    let result = await adminModel.DanhSachMonHoc();
    if(result.statusCode === 200) {
        let html = pug.renderFile('public/admin/DanhSachMonHoc.pug',{
            SubjectDataList:  result.result.recordsets[0],
            user: {
                HoTen: req.user.result.HoTen,
            }, role: req.user.role
        });
        res.send(html);
    } else {
        let html = pug.renderFile('public/404.pug', { 
            message: result.message,
            redirect: 'public/Home.pug'
        });
        res.send(html);
    }
}

exports.XoaMonHoc = XoaMonHoc;
exports.ThemMonHoc = ThemMonHoc;
exports.DanhSachMonHoc = DanhSachMonHoc;
exports.ThongTinMonHoc = ThongTinMonHoc;