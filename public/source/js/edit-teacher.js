UploadImage.onchange = (evt) => {
  const [file] = UploadImage.files;
  if (file) {
    avatar.src = URL.createObjectURL(file);
  }
};

async function XoaGiaoVien(MaGV) {
  let response = await fetch('/admin/XoaGiaoVien', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({MaGV: MaGV}),
          json: true
  })

  let text = await response.json(); 
  console.log(text)
  alert(text.message);
  if(text.redirect)
    window.location.href = text.redirect;
  
  // delete the row
    var row = document.getElementById(MaGV);
    row.parentNode.removeChild(row);
}