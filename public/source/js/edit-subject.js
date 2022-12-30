async function XoaMonHoc(MaMH) {
    let response = await fetch('/admin/XoaMonHoc', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({MaMH: MaMH}),
            json: true
    })
  
    let text = await response.json(); 
    console.log(text)
    alert(text.message);
    if(text.redirect)
      window.location.href = text.redirect;
    
    // delete the row
    if(text.statusCode == 200)
    {
      const row = document.getElementById(MaMH);
      row.parentNode.removeChild(row);
    }
  }

async function LayThongTin(MaMH) {
    // show modal 
    showModal();
    // blur modal when data is loading
    document.querySelector(".modal.js-modal").classList.add("blur");
    form = document.querySelector("#edit-student-form");
  
    form.querySelector("input[id=MaMH]").value = "Loading...";
    form.querySelector("input[id=TenMH]").value = "Loading...";
    form.querySelector("input[id=MoTa]").value = "Loading...";
    form.querySelector("input[id=HeSo]").value = "Loading...";
  
  
    let response = await fetch('/admin/ThongTinMonHoc', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        MaMH: MaMH,
      }),
      json: true
    })
  
    let text = await response.json();
    console.log(text.data.HoTen)
    //append data to modal content
  
    form.querySelector("input[id=MaMH]").value = text.data.MaMH;
    form.querySelector("input[id=TenMH]").value = text.data.TenMH;
    form.querySelector("input[id=MoTa]").value = text.data.MoTa;
    form.querySelector("input[id=HeSo]").value = text.data.HeSo;
  
    // set hidden input
    form.querySelector("input[id=MaMH]").value = MaMH;
  
    // remove blur background
    document.querySelector(".modal.js-modal").classList.remove("blur");
  }