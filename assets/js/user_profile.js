{
    let img = document.getElementById('profile_pic');
    let imgInp = document.getElementById('avatar');
    if(img && imgInp){
        imgInp.onchange = evt => {
            console.log('changed')
            const [file] = imgInp.files
            console.log(imgInp.files)
            if (file) {
              img.src = URL.createObjectURL(file)
            }
          }
    }
}