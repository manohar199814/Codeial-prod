{
    //Send ajax request to create DOM
    let createComment = function(){
        $('.new-comment-form').submit(function (e) {
            e.preventDefault()
            $.ajax({
                type:'post',
                url:'/comment/create',
                data:$(this).serialize(),
                success:(data) => {
                    let newComment = newCommentDom(data.data.comment);
                    $(this)[0][0].value = '';
                    $(`#post-comments-${data.data.comment.post}`).prepend(newComment);
                    deleteComment($(' .delete-comment-button',newComment));
                    callNotification(data.success,null);
                },
                error:(error) => {
                    callNotification(null,error.responseText);
                }
            }); 
        })                
    }

    //method to create comment in DOM
    let newCommentDom = function(comment){
        return $(`<li id="comment-${comment._id}">
        <p>
            <small>
                <a class="delete-comment-button" href="/comment/destroy/${comment._id}">X</a>
            </small>   
            ${comment.content}
            <br>
            <small>
                ${comment.user.name}
            </small>
        </p>
        </li>`)
    }


    let deleteComment = function(deleteLink) {
        $(deleteLink).click((e) => {
            e.preventDefault();

            $.ajax({
                type:'get',
                url:$(deleteLink).attr('href'),
                success:(data) => {
                    $(`#comment-${data.data.comment_id}`).remove();
                    callNotification(data.success,null);
                },
                error:(error) => {
                    callNotification(null,error.responseText);
                }
            })
        })
    }


    let DeleteCommentsHandler = function(){
        let deleteLinks = $('.delete-comment-button');
        for(deleteLink of deleteLinks){
            deleteComment(deleteLink);
        }
    }

    let callNotification = function(success,error) {
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
   
    DeleteCommentsHandler();
    createComment();

}


