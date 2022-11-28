{
    console.log('working')
    let resetPassword = function() {
        let newPostForm = $('#reset-password-form');
        console.log(newPostForm);

        newPostForm.submit((e) => {
            e.preventDefault();
            $.ajax({
                type:'post',
                url:'/user/password-reset',
                data:newPostForm.serialize(),
                success:(data) => {
                    console.log(data);
                    if(data.data.user){
                        callNotification(data.success,null);
                    }else{
                        callNotification(null,data.error);
                    }
                    
                },
                error:(error) => {
                    console.log(error,'error')
                    callNotification(null,error.responseText);
                }
            });
        })
    }


    let callNotification = function(success,error) {
        console.log('in call notification')
        if(success && success.length > 0) { 
            new Noty({
                theme:'relax',
                text: success,
                type:'success',
                layout:'topRight',
                timeout:1500
            }).show();
        }
        
        if(error && error.length > 0) { 
            new Noty({
                theme:'relax',
                text: error,
                type:'error',
                layout:'topRight',
                timeout:1500
            }).show();
        }
    }

    resetPassword();
}