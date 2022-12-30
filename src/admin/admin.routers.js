const express = require('express');
const pug = require('pug');
const router = express.Router();
var path = require("path");
const usersModel = require('../users/users.models');
const authMiddleware = require('../auth/auth.middlewares');
const authController = require('../auth/auth.controller');
const isAuth = authMiddleware.isAuth;
const isAuthAdmin = authMiddleware.isAuthAdmin;
const adminController = require('../admin/admin.controller');


router.route('/ThemTaiKhoan')
	.get(isAuthAdmin, (req, res) => {
		// console.log(req.user);
		let html = pug.renderFile('public/admin/ThemTaiKhoan.pug', {
			user: req.user.result,
			image: req.image,
			role: req.user.role
		});
		res.send(html);
	})
	.post(isAuthAdmin, adminController.ThemTaiKhoan)

router.route('/ThemLopHoc')
	.get(isAuthAdmin, (req, res) => {
		let html = pug.renderFile('public/admin/ThemLopHoc.pug', {
			user: req.user.result,
			image: req.image,
			role: req.user.role
		});
		res.send(html);
	})
	.post(isAuthAdmin, adminController.ThemLopHoc)


router.route('/DanhSachHocSinh')
	.get(isAuthAdmin, adminController.DanhSachHocSinh);

router.route('/DanhSachGiaoVien')
	.get(authMiddleware.isAuthAdmin, adminController.DanhSachGiaoVien);

router.route('/DanhSachBaiDang')
	.get(authMiddleware.isAuthAdmin, adminController.DanhSachBaiDang);

router.route('/ThemHocSinh')
	.get(isAuthAdmin, (req, res) => {
		let html = pug.renderFile('public/admin/ThemHocSinhVaoLop.pug');
		res.send(html)
	})
	.post(isAuthAdmin, adminController.ThemHocSinhVaoLop);

router.route('/ThemGiaoVien')
	.get(isAuthAdmin, (req, res) => {
		let html = pug.renderFile('public/admin/ThemGiaoVienVaoLop.pug');
		res.send(html)
	})
	.post(isAuthAdmin, adminController.ThemGiaoVienVaoLop);

router.route('/ThemBaiDang')
	.get(isAuthAdmin, (req, res) => {
		let html = pug.renderFile('public/admin/ThemBaiDang.pug', {
			user: req.user.result,
			image: req.image,
			role: req.user.role
		});
		res.send(html);
	})
	.post(isAuthAdmin, adminController.ThemBaiDang)

router.route('/XoaBaiDang')
	.post(isAuthAdmin, adminController.XoaBaiDang)

router.post('/ThongTinNguoiDung', isAuthAdmin, adminController.ThongTinNguoiDung);

router.post('/ThayDoiThongTin', isAuthAdmin, adminController.ThayDoiThongTin);

router.get('/Dashboard', isAuthAdmin, (req, res) => {
	let html = pug.renderFile('public/admin/Dashboard.pug', {
		user: req.user.result,
		image: req.image,
		role: req.user.role
	});
	res.send(html);
});

router.route('/DanhSachLopHoc')
	.get(isAuthAdmin, adminController.XemDanhSachLop)
	.post(isAuthAdmin, adminController.XemThongTinLop);

router.route('/XoaHocSinh')
	.post(isAuthAdmin, adminController.XoaHocSinh)

router.route('/XoaLopHoc')
	.post(isAuthAdmin, adminController.XoaLopHoc)

router.route('/XoaGiaoVien')
	.post(isAuthAdmin, adminController.XoaGiaoVien)

router.route('/QuyDinh')
	.get(isAuthAdmin, adminController.XemQuyDinh)
	.post(isAuthAdmin, adminController.ThayDoiQuyDinh)

router.route('/ThemVaiTro')
	.get(isAuthAdmin, (req, res) => {
		let html = pug.renderFile('public/admin/ThemVaiTro.pug', {
			user: req.user.result,
			image: req.image,
			role: req.user.role
		});
		res.send(html);
	})
	.post(isAuthAdmin, adminController.ThemVaiTro)

router.route('/DanhSachVaiTro')
	.get(isAuthAdmin, adminController.DanhSachVaiTro)

router.route('/ThemHocSinhLenLop/:MaLop')
	.get(isAuthAdmin, adminController.DanhSachHocSinhTrongLopTheoMaLop)	
	.post(isAuthAdmin, adminController.DanhSachHocSinhTrongLopTheoMaLop)

router.route('/XoaMonHoc')
	.post(isAuthAdmin, adminController.XoaMonHoc)

router.route('/ThemMonHoc')
	.get(isAuthAdmin, (req, res) => {
		let html = pug.renderFile('public/admin/ThemMonHoc.pug', {
			user: req.user.result,
			image: req.image,
			role: req.user.role
		});
		res.send(html);
	})
	.post(isAuthAdmin, adminController.ThemMonHoc)

router.route('/DanhSachMonHoc')
	.get(isAuthAdmin, adminController.DanhSachMonHoc);

router.route('/ThongTinMonHoc')
	.post(isAuthAdmin, adminController.ThongTinMonHoc);

router.route('/ThemMonHocVaoLop/:MaLop')
	.get(isAuthAdmin, adminController.DanhSachMonHocTrongLopTheoMaLop)	
	.post(isAuthAdmin, adminController.DanhSachMonHocTrongLopTheoMaLop)

router.get('/profile/:MaHS', isAuthAdmin, async (req, res) => {
	let DSLop = await usersModel.XemDanhSachLopHocSinh(req.params.MaHS);
	let user_info = await usersModel.getInfoUser(req.params.MaHS);
	console.log(user_info)
	console.log(DSLop)

	let html = pug.renderFile('public/user/Profile.pug', {
		DanhSachLop: DSLop.result.recordset,       
		user: user_info.result,        
		image: req.image,
		role: req.user.role
	});
	res.send(html);
});

module.exports = router;