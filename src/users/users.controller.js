const usersModel = require('../users/users.models');
var pug = require('pug');

async function getAllClass(req, res) { 
    let result = await usersModel.getAllClass();
    if(result.statusCode === 200) {
        let html = pug.renderFile('public/user/LopHoc.pug',{
            classlist:  result.result.recordset 
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
    let result = await usersModel.DanhSachBaiDang();

    if(result.statusCode === 200) {
        let html = pug.renderFile('public/user/XemThongBao.pug', {
            user: req.user.result,        
			image: req.image,
			role: req.user.role,
            DanhSachThongBao: result.result.recordsets[0]
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

async function XemNoiDungBaiDang(req, res) {
    let result = await usersModel.NoiDungBaiDang(req.params.MaBaiDang);

    if(result.statusCode === 200) {
        let html = pug.renderFile('public/user/NoiDungBaiDang.pug', {
            user: req.user.result,        
			image: req.image,
			role: req.user.role,
            NoiDung: result.result.recordsets[0]
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

async function DanhSachHocSinhTrongLop(req, res) {
    let DanhSachNamHoc;
    req.MaLop = req.params.MaLop;

    if(!req.body.NamHoc) {
        DanhSachNamHoc = await usersModel.DanhSachNamHoc();
        req.body.NamHoc = DanhSachNamHoc.result.recordsets[0][0].NamHoc;
        return res.json({
            statusCode: 200,
            message: 'L???y danh s??ch n??m h???c th??nh c??ng',
            result: DanhSachNamHoc.result.recordsets[0]
        });
    }

    let result = await usersModel.DanhSachHocSinhTrongLop(req.MaLop, req.body.HocKy, req.body.NamHoc);
    console.log(result.result.recordsets)
    if(result.statusCode === 200) {
        return res.json({
            statusCode: 200,
            message: 'L???y danh s??ch h???c sinh trong l???p th??nh c??ng',
            result: result.result.recordsets[0]
        });
    } else {
        let html = pug.renderFile('public/404.pug', { 
            message: result.message,
            redirect: 'public/Home.pug'
        });
        res.send(html);
    }
}

async function NhapDiem(req, res) {
    console.log("Nhap diem")
    // console.log(req.body);
    let MaMH = req.body.MaMH;
    let MaLop = req.params.MaLop;

    let result = await usersModel.NhapDiem(MaMH, req.body.Diem, req.body.HocKy);
    if(result.statusCode === 200) {
        return res.json({
            statusCode: 200,
            message: 'Nh???p ??i???m th??nh c??ng',
        });
    } else {
        return res.json({
            statusCode: 500,
            message: 'Nh???p ??i???m th???t b???i',
            // result: result.result.recordsets[0]
        });
    }
}

exports.DanhSachBaiDang = DanhSachBaiDang;
exports.getAllClass = getAllClass;
exports.DanhSachHocSinhTrongLop = DanhSachHocSinhTrongLop;
exports.NhapDiem = NhapDiem;

async function DanhSachDiem (req, res) {
    let DanhSachNamHoc;
    console.log(req.body)
    req.MaLop = req.params.MaLop;
    let MaLop = req.params.MaLop;

    if(!req.body.NamHoc) {
        DanhSachNamHoc = await usersModel.DanhSachNamHoc();
        req.body.NamHoc = DanhSachNamHoc.result.recordsets[0][0].NamHoc;
        return res.json({
            statusCode: 200,
            message: 'L???y danh s??ch n??m h???c th??nh c??ng',
            result: DanhSachNamHoc.result.recordsets[0]
        });
    }

    if(!req.body.MaLop) {
        DanhSachLop = await usersModel.DanhSachLopHocTheoGV(req.user.result.MaGV);
        // req.body.MaLop = DanhSachLop.result.recordsets[0][0].NamHoc;
        return res.json({
            statusCode: 200,
            message: 'L???y danh s??ch l???p h???c th??nh c??ng',
            result: DanhSachLop.result
        });
    }

    if(!req.body.MaMH) {
        console.log(req.user)
        let Role = req.user.role;
        console.log(req.user)
        let result = await usersModel.DanhSachMHDoGVDay(Role, req.body.MaLop, req.user.result.MaGV, req.body.HocKy, req.body.NamHoc);
        console.log(result.result)
        return res.json({
            statusCode: 200,
            message: 'L???y danh s??ch m??n h???c th??nh c??ng',
            result: result.result
        });
    }

    let MaMH = req.body.MaMH;
    let result = await usersModel.DanhSachDiemTheoLHKT(MaMH, req.body.MaLop, req.body.HocKy, req.body.NamHoc, req.body.MaLHKT);
    console.log("Danh sach diem")
    console.log(result.result)
    console.log(result.result.length)

    let kq = [];
    let index = 0;
    for (let i = 0, j = 0; i < result.result.length; i++) {        
        // if( || kq[index].MaHS != result.result[i].MaHS)
        try {
            if(kq[index-1].MaHS != result.result[i].MaHS) 
                kq[index++] = {
                    MaHS: result.result[i].MaHS,
                    HoTen: result.result[i].HoTen,
                    DM: '',
                    KT15P: '',
                    KT1T: '',
                    KTGK: '',
                    KTCK: '',
                    DiemTB: result.result[i].DiemTBMon,
                }
        } catch (error) {
            kq[index++] = {
                MaHS: result.result[i].MaHS,
                HoTen: result.result[i].HoTen,
                DM: '',
                KT15P: '',
                KT1T: '',
                KTGK: '',
                KTCK: '',
                DiemTB: result.result[i].DiemTBMon,
            }
        }
        
        for (j = i; j < result.result.length; j++) {
            if (result.result[i].MaHS === result.result[j].MaHS && result.result[j].MaLHKT != null)
                kq[index - 1][`${result.result[j].MaLHKT}`] = result.result[j].Diem;
            else 
                break;
        }
        // i = j;
    }
    
    // if(result.statusCode === 200) {
    //     return res.json({
    //         statusCode: 200,
    //         message: 'L???y danh s??ch h???c sinh trong l???p v?? ??i???m th??nh c??ng',

    //     });
    // console.log(results)
    // console.log(kq)
    return res.json({
        statusCode: 200,
        message: 'L???y danh s??ch h???c sinh trong l???p v?? ??i???m th??nh c??ng',
        result: kq
    });
}

exports.DanhSachDiem = DanhSachDiem;
exports.XemNoiDungBaiDang = XemNoiDungBaiDang;

async function DanhSachHocSinhTheoMaHS(req, res) {
    console.log(req.user.result)
    let MaHS = req.user.result.MaHS;
    if(!MaHS) 
        MaHS = "20521150"
    
    let result = await usersModel.DanhSachHocSinhTheoMaHS(MaHS);
    console.log("Danh sach hoc sinh theo ma hs")
    console.log(result.result)
    if(result.statusCode === 200) {
        let html = pug.renderFile('public/user/DanhSachHocSinh.pug',{
            ClassDataList:  result.result,
            user: {
                HoTen: req.user.result.HoTen,
            }, role: req.user.role
        });
        res.send(html);
    } else {
        return res.json({
            statusCode: 500,
            message: 'L???y danh s??ch h???c sinh theo m?? h???c sinh th???t b???i',
        })
    }
}

async function TinhDiemTrungBinh(req, res) {
    let MaLop = req.params.MaLop;
    let result = await usersModel.TinhDiemTrungBinh(MaLop);
    console.log("Tinh diem trung binh")
    console.log(result.result)
    if(result.statusCode === 200) {
        return res.json({
            statusCode: 200,
            message: 'T??nh ??i???m trung b??nh th??nh c??ng',
            result: result.result
        });
    } else {
        return res.json({
            statusCode: 500,
            message: 'T??nh ??i???m trung b??nh th???t b???i',
        })
    }
}

async function DanhSachLopHocTheoGV(req, res) {
    console.log(req.user.result)
    let result = await usersModel.DanhSachLopHocTheoGV(req.user.result.MaGV);
    console.log("Danh sach lop hoc")
    console.log(result.result)
    if(result.statusCode === 200) {
        let html = pug.renderFile('public/user/DanhSachLopHoc.pug',{
            ClassDataList:  result.result,
            user: {
                HoTen: req.user.result.HoTen,
            }, role: req.user.role
        });
        res.send(html);
    } else {
        return res.json({
            statusCode: 500,
            message: 'L???y danh s??ch l???p h???c th???t b???i',
        })
    }
}

async function DanhSachLopHocTheoGVDeNhapDiem(req, res) {
    console.log(req.user.result)
    let result = await usersModel.DanhSachLopHocTheoGV(req.user.result.MaGV);
    console.log("Danh sach lop hoc")
    console.log(result.result)
    if(result.statusCode === 200) {
        let html = pug.renderFile('public/giaovien/DanhSachLopHoc.pug',{
            ClassDataList:  result.result,
            user: {
                HoTen: req.user.result.HoTen,
            }, role: req.user.role
        });
        res.send(html);
    } else {
        return res.json({
            statusCode: 500,
            message: 'L???y danh s??ch l???p h???c th???t b???i',
        })
    }
}

exports.DanhSachHocSinhTheoMaHS = DanhSachHocSinhTheoMaHS;
exports.TinhDiemTrungBinh = TinhDiemTrungBinh;
exports.DanhSachLopHocTheoGV = DanhSachLopHocTheoGV;


async function BaoCaoMonHoc(req, res) {
    let DanhSachNamHoc;
    console.log(req.body)
    req.MaLop = req.params.MaLop;

    if(!req.body.NamHoc) {
        DanhSachNamHoc = await usersModel.DanhSachNamHoc();
        req.body.NamHoc = DanhSachNamHoc.result.recordsets[0][0].NamHoc;
        return res.json({
            statusCode: 200,
            message: 'L???y danh s??ch n??m h???c th??nh c??ng',
            result: DanhSachNamHoc.result.recordsets[0]
        });
    }

    if(!req.body.MaMH) {
        console.log(req.user)
        let Role = req.user.role;
        console.log(Role);
        let result = await usersModel.XemBaoCaoDanhSachMH(Role, req.user.result.MaGV, req.body.HocKy, req.body.NamHoc);
        console.log(result.result)
        return res.json({
            statusCode: 200,
            message: 'L???y danh s??ch m??n h???c th??nh c??ng',
            result: result.result
        });
    }

    let MaMH = req.body.MaMH;
    let MaLop = req.params.MaLop;
    let data = {
        MaGV: req.user.result.MaGV,
        MaMH: MaMH,
        HocKy: req.body.HocKy,
        NamHoc: req.body.NamHoc
    }
    let result = await usersModel.BaoCaoMonHoc(req.user.role, data);
    console.log(result.result)
    if(result.statusCode === 200) {
        return res.json({
            statusCode: 200,
            message: 'L???y b??o c??o th??nh c??ng',
            result: result.result.recordsets
        });
    } else {
        return res.json({
            statusCode: 500,
            message: 'L???y b??o c??o th???t b???i',
        })
    }

}

async function DanhSachHocSinhTrongLopTheoMaLop(req, res) {
    req.MaLop = req.params.MaLop;

    let result = await usersModel.DanhSachHocSinhTrongLopTheoMaLop(req.MaLop);
    console.log(result.result.recordsets)
    if(result.statusCode === 200) {
        let html = pug.renderFile('public/user/DanhSachHocSinhTrongLop.pug',{
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

async function BaoCaoHocKy(req, res) {
    let DanhSachNamHoc;
    console.log(req.body)
    req.MaLop = req.params.MaLop;

    if(!req.body.NamHoc) {
        DanhSachNamHoc = await usersModel.DanhSachNamHoc();
        req.body.NamHoc = DanhSachNamHoc.result.recordsets[0][0].NamHoc;
        return res.json({
            statusCode: 200,
            message: 'L???y danh s??ch n??m h???c th??nh c??ng',
            result: DanhSachNamHoc.result.recordsets[0]
        });
    }

    let MaMH = req.body.MaMH;
    let data = {
        MaGV: req.user.result.MaGV,
        HocKy: req.body.HocKy,
        NamHoc: req.body.NamHoc
    }

    let result = await usersModel.BaoCaoHocKy(MaMH, data);
    console.log(result.result)
    if(result.statusCode === 200) {
        return res.json({
            statusCode: 200,
            message: 'L???y b??o c??o th??nh c??ng',
            result: result.result.recordsets
        });
    } else {
        return res.json({
            statusCode: 500,
            message: 'L???y b??o c??o th???t b???i',
        })
    }

}

exports.BaoCaoHocKy = BaoCaoHocKy;
exports.BaoCaoMonHoc = BaoCaoMonHoc;
exports.DanhSachHocSinhTrongLopTheoMaLop = DanhSachHocSinhTrongLopTheoMaLop;
exports.DanhSachLopHocTheoGVDeNhapDiem = DanhSachLopHocTheoGVDeNhapDiem;

async function DanhSachDiemHocSinh(req, res) {
    let result = await usersModel.DanhSachDiemHocSinh();

    if(result.statusCode === 200) {
        let html = pug.renderFile('public/giaovien/DanhSachDiemHocSinh.pug',{
            ClassDataList:  result.result,
            user: {
                HoTen: req.user.result.HoTen,
            }, role: req.user.role
        });
        res.send(html);
    } else {
        return res.json({
            statusCode: 500,
            message: 'L???y danh s??ch h???c sinh theo m?? h???c sinh th???t b???i',
        })
    }
}

exports.DanhSachDiemHocSinh = DanhSachDiemHocSinh;
