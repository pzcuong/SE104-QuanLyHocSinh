
async function XoaLopHoc(MaLop) {
    let response = await fetch('/admin/XoaLopHoc', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({MaLop: MaLop}),
            json: true
    })
  
    let text = await response.json(); 
    console.log(text)
    alert(text.message);
    if(text.redirect)
      window.location.href = text.redirect;
    
    // delete the row
      var row = document.getElementById(MaLop);
      row.parentNode.removeChild(row);
  }