// Modal 1
const EditBtn = document.querySelector(".js-edit-student");
const modal = document.querySelector(".js-modal");
const modalClose = document.querySelector(".js-modal-close");
const modalContent = document.querySelector(".js-modal-content");

function hideModal() {
  modal.classList.remove("open");
}
function showModal() {
  modal.classList.add("open");
}

EditBtn.addEventListener("click", showModal);

modalClose.addEventListener("click", hideModal);
modal.addEventListener("click", hideModal);
modalContent.addEventListener("click", function (event) {
  event.stopPropagation();
});

// Modal 2
const EditBtn2 = document.querySelector(".js-edit-student2");
const modal2 = document.querySelector(".js-modal2");
const modalClose2 = document.querySelector(".js-modal-close2");
const modalContent2 = document.querySelector(".js-modal-content2");

function hideModal2() {
  modal2.classList.remove("open");
}
function showModal2() {
  modal2.classList.add("open");
}

EditBtn2.addEventListener("click", showModal2);
modalClose2.addEventListener("click", hideModal2);
modal2.addEventListener("click", hideModal2);
modalContent2.addEventListener("click", function (event) {
  event.stopPropagation();
});

// Modal 3
const EditBtn3 = document.querySelector(".js-edit-student3");
const modal3 = document.querySelector(".js-modal3");
const modalClose3 = document.querySelector(".js-modal-close3");
const modalContent3 = document.querySelector(".js-modal-content3");

function hideModal3() {
  modal3.classList.remove("open");
}
function showModal3() {
  modal3.classList.add("open");
}

EditBtn3.addEventListener("click", showModal3);
modalClose3.addEventListener("click", hideModal3);
modal3.addEventListener("click", hideModal3);
modalContent3.addEventListener("click", function (event) {
  event.stopPropagation();
});

// Modal 4
const EditBtn4 = document.querySelector(".js-edit-student4");
const modal4 = document.querySelector(".js-modal4");
const modalClose4 = document.querySelector(".js-modal-close4");
const modalContent4 = document.querySelector(".js-modal-content4");

function hideModal4() {
  modal4.classList.remove("open");
}
function showModal4() {
  modal4.classList.add("open");
}

EditBtn4.addEventListener("click", showModal4);
modalClose4.addEventListener("click", hideModal4);
modal4.addEventListener("click", hideModal4);
modalContent4.addEventListener("click", function (event) {
  event.stopPropagation();
});

async function ThayDoiTuoi() {
  // set block button
  document.getElementById("submit-button").disabled = true;
  document.getElementById("submit-button").innerHTML = "Đang lưu...";
  // blur body background

  form = document.querySelector("#edit-tuoi");

  if(form.elements["TuoiToiThieu"].value > form.elements["TuoiToiDa"].value) {
    alert("Tuổi tối thiểu phải nhỏ hơn tuổi tối đa");
    document.getElementById("submit-button").disabled = false;
    document.getElementById("submit-button").innerHTML = "Xác nhận";
    return;
  }

  if(form.elements["TuoiToiThieu"].value < 0 || form.elements["TuoiToiDa"].value < 0) {
    alert("Tuổi không được nhỏ hơn 0");
    document.getElementById("submit-button").disabled = false;
    document.getElementById("submit-button").innerHTML = "Xác nhận";
    return;
  }

  let response = await fetch('/admin/QuyDinh', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      TenThamSo: "TuoiToiThieu",
      GiaTri: form.elements["TuoiToiThieu"].value,
    }),
    json: true
  })

  let response2 = await fetch('/admin/QuyDinh', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      TenThamSo: "TuoiToiDa",
      GiaTri: form.elements["TuoiToiDa"].value,
    }),
    json: true
  })

  let text = await response.json();
  let text2 = await response2.json();

  alert(text.message);

  document.getElementById("submit-button").disabled = false;
  document.getElementById("submit-button").innerHTML = "Xác nhận";
}

async function ThayDoiSiSo() {
  // set block button
  document.getElementById("submit-button").disabled = true;
  document.getElementById("submit-button").innerHTML = "Đang lưu...";
  // blur body background

  form = document.querySelector("#edit-siso");

  if(form.elements["SiSoToiDa"].value < 0) {
    alert("Sĩ số không được nhỏ hơn 0");
    document.getElementById("submit-button").disabled = false;
    document.getElementById("submit-button").innerHTML = "Xác nhận";
    return;
  }

  let response = await fetch('/admin/QuyDinh', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      TenThamSo: "SiSoToiDa",
      GiaTri: form.elements["SiSoToiDa"].value,
    }),
    json: true
  })

  let text = await response.json();
  alert(text.message);
}

async function ThayDoiDiemToiThieuToiDa() {
  // set block button
  document.getElementById("submit-button").disabled = true;
  document.getElementById("submit-button").innerHTML = "Đang lưu...";
  // blur body background

  form = document.querySelector("#edit-diem");

  if(form.elements["DiemToiThieu"].value > form.elements["DiemToiDa"].value) {
    alert("Điểm tối thiểu phải nhỏ hơn điểm tối đa");
    document.getElementById("submit-button").disabled = false;
    document.getElementById("submit-button").innerHTML = "Xác nhận";
    return;
  }

  if(form.elements["DiemToiThieu"].value < 0 || form.elements["DiemToiDa"].value < 0) {
    alert("Điểm không được nhỏ hơn 0");
    document.getElementById("submit-button").disabled = false;
    document.getElementById("submit-button").innerHTML = "Xác nhận";
    return;
  }

  let response = await fetch('/admin/QuyDinh', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      TenThamSo: "DiemToiThieu",
      GiaTri: form.elements["DiemToiThieu"].value,
    }),
    json: true
  })

  let response2 = await fetch('/admin/QuyDinh', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      TenThamSo: "DiemToiDa",
      GiaTri: form.elements["DiemToiDa"].value,
    }),
    json: true
  })

  let text = await response.json();
  let text2 = await response2.json();

  alert(text.message);
  document.getElementById("submit-button").disabled = false;
  document.getElementById("submit-button").innerHTML = "Xác nhận";
}

async function ThayDoiDiemDat() {
  // set block button
  document.getElementById("submit-button").disabled = true;
  document.getElementById("submit-button").innerHTML = "Đang lưu...";
  // blur body background

  form = document.querySelector("#edit-diemdat");

  if(form.elements["DiemDat"].value < 0) {
    alert("Điểm không được nhỏ hơn 0");
    document.getElementById("submit-button").disabled = false;
    document.getElementById("submit-button").innerHTML = "Xác nhận";
    return;
  }

  let response = await fetch('/admin/QuyDinh', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      TenThamSo: "DiemDat",
      GiaTri: form.elements["DiemDat"].value,
    }),
    json: true
  })

  let response1 = await fetch('/admin/QuyDinh', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      TenThamSo: "DiemDatMon",
      GiaTri: form.elements["DiemDatMon"].value,
    }),
    json: true
  })

  let text = await response.json();
  let text2 = await response1.json();

  alert(text.message);
  document.getElementById("submit-button").disabled = false;
  document.getElementById("submit-button").innerHTML = "Xác nhận";
}