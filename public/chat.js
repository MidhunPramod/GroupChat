const socket = io.connect('https://fathomless-basin-99256.herokuapp.com',{query:window.location.search.substr(1)});

//const socket = io.connect('http://localhost:4000',{query:window.location.search.substr(1)});

const ul_users = document.querySelector('.users');
const send_button = document.querySelector('#send-button');
const send_content = document.querySelector('#send-content');
const ul_messages = document.querySelector('.chat-box');

send_button.addEventListener('click',()=>{

    const content = send_content.value.split(' ');
    const send_to_users = []

    for(let i=0;i<content.length;i++){
        if(content[i].charAt(0) == '@'){
            send_to_users.push(content[i].substring(1));
        }
    }

    socket.emit('chat',{
        message: send_content.value,
        socket_id: socket.id,
        send_to: send_to_users
    })

    send_content.value = '';
})

socket.on('right-chat',(data)=>{
    ul_messages.innerHTML+=`
    <li class="chat-right">
    <div class="chat-text">${data.message}</div>
    <div class="chat-avatar">
        <img src="user.png" alt="Retail Admin">
        <div class="chat-name">${data.username}</div>
    </div>
    </li>
    `
})

socket.on('left-chat',(data)=>{
    ul_messages.innerHTML+=`
    <li class="chat-left">
        <div class="chat-avatar">
            <img src="user.png" alt="Retail Admin">
        <div class="chat-name">${data.username}</div>
        </div>
        <div class="chat-text">${data.message}</div>
        </li>
    `
})

socket.on('add-user',(data)=>{
    ul_users.innerHTML = ``;
    for(key in data){
        ul_users.innerHTML+= `
        <li class="person" data-chat="person1">
        <div class="user">
            <img src="user.png" alt="Retail Admin">
        </div>
        <p class="name-time">
            <span class="name">${data[key]}</span>
        </p>
    </li>  
        `;
    }
})