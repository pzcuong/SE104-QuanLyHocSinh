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