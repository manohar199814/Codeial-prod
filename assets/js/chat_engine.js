class ChatEngine{
    constructor(chatBoxId,userEmail){
        this.chatBox = $(`#${chatBoxId}`);
        this.userEmail = userEmail;

        this.socket = io.connect('http://localhost:5000');

        if(this.userEmail){
            this.connectionHandler();
            this.toggleChat();
        }
    }

    connectionHandler() {
        console.log('in connection handler');
        this.socket.on('connect',() => {
            console.log('connection established using sockets..!');

            this.socket.emit('join_room',{
                user_email:this.userEmail,
                chatroom:'codeial'
            });

            this.socket.on('user_joined',function(data) {
                console.log('user joined',data);
            });

            $('#send-message').click(() => {
                let msg = $('#chat-message-input').val();
                $('#chat-message-input').val('');
                if(msg != ''){
                    this.socket.emit('send_message',{
                        message:msg,
                        user_email:this.userEmail,
                        chatroom:'codeial'
                    })
                }
            })

            this.socket.on('receive_message',(data) => {
                console.log('message received',data);
                let newMessage = $('<li>');

                let messageType = 'other-message';

                if(data.user_email == this.userEmail){
                    messageType = 'self-message';
                }

                newMessage.append($('<span>',{
                    'html':data.message
                }));

                newMessage.append($('<sub>',{
                    'html':data.user_email
                }));

                newMessage.addClass(messageType);
                $('#chat-messages-list').append(newMessage);
            })
        })
    }

    toggleChat(){
        $('.fa-sharp').click(() => {
            console.log('clicked');
            this.chatBox.hide();
        })

        $('.fa-comments').click(() => {
            console.log('clicked');
            this.chatBox.show();
        })
    }
}