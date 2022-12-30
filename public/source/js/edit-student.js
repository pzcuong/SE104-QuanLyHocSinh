UploadImage.onchange = (evt) => {
  const [file] = UploadImage.files;
  if (file) {
    avatar.src = URL.createObjectURL(file);
  }
};

async function XoaHocSinh(MaHS) {
  let response = await fetch('/admin/XoaHocSinh', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({MaHS: MaHS}),
          json: true
  })

  let text = await response.json(); 
  console.log(text)
  alert(text.message);
  if(text.redirect)
    window.location.href = text.redirect;
  
  // delete the row
    var row = document.getElementById(MaHS);
    row.parentNode.removeChild(row);
}

async function LayThongTinHocSinh() {
  //Disable button
  //- document.getElementById("GetData").disabled = true;
  //- document.getElementById("GetData").innerHTML = "Đang tải...";

  data = {
    HocKy: document.getElementById("HocKy").value,
    NamHoc: document.getElementById("NamHoc").value,
    MaLop: document.getElementById("LopHoc").value
  }
  
  let url = window.location.href;

  let response = await fetch('/admin/DanhSachHocSinh', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
    json: true
  })

  let result = await response.json();

  console.log(result)

  //Enable button
  //- document.getElementById("GetData").disabled = false;
  //- document.getElementById("GetData").innerHTML = "Lấy thông tin";

  if(data.NamHoc == null || data.NamHoc == "") {
    let SelectNamHoc = document.getElementById("NamHoc");
    for (let i = 0; i < result.result.length; i++) {
      let option = document.createElement("option");
      option.text = `${result.result[i].Nam1} - ${result.result[i].Nam2}` ;
      option.value = result.result[i].Nam2;
      SelectNamHoc.add(option);
    }
    return false;
  }

  if(data.MaLop == null || data.MaLop == "") {
    let SelectMonHoc = document.getElementById("LopHoc");
    for (let i = 0; i < result.result.length; i++) {
      let option = document.createElement("option");
      option.text = result.result[i].TenMH;
      option.value = result.result[i].MaMH;
      SelectMonHoc.add(option);
    }
    return false;
  }

  // let button = document.getElementById("btnSave");
  // button.hidden = false;

  // console.log(result.result)
  // data = []

  // for(let i = 0; i < result.result.length; i++) {
  //   data.push({
  //     "MSHS": result.result[i].MaHS, 
  //     "HoTen": result.result[i].HoTen, 
  //     "DM": result.result[i].DM, 
  //     "KT15P": result.result[i].KT15P, 
  //     "KT1T": result.result[i].KT1T, 
  //     "KTGK": result.result[i].KTGK, 
  //     "KTCK": result.result[i].KTCK,
  //   })
  // }

  // console.log(data)
  var container = document.getElementById('employee');
  var hot = new Handsontable(container, {
    data: data,
    rowHeaders: true,
    colHeaders: false,
    colHeaders: ["MSHS", "Họ và tên", "Lớp ", "TB Học Kỳ "],
    columnSorting: true,
    sortIndicator: true
  });
}