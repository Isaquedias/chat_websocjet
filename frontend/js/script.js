(function () {
    'use strict'

    //LOGIN
    const login = document.querySelector('.login');
    const loginForm = document.querySelector('.login__form');
    const loginInput = document.querySelector('.login__input');

    //CHAT
    const chat = document.querySelector('.chat');
    const chatForm = document.querySelector('.chat__form');
    const chatInput = document.querySelector('.chat__input');
    const chatMessages = document.querySelector('.chat_messages');

    const color = [
        '#e74c3c',
        '#8e44ad',
        '#3498db',
        '#e67e22',
        '#2ecc71',
        '#f1c40f',
        '#1abc9c',
        '#2c3e50',
        '#7f8c8d'
    ]

    const user = {
        id: "",
        color: ''
    }

    let websocket = null;

    const createMessageSelfElement = (content) => {
        const message = document.createElement('div');
        message.classList.add('message--self');
        message.innerHTML = content;
        return message;
    }

    const createMessageElementOther = (content, sender, senderColor) => {
        const div = document.createElement('div');
        const span = document.createElement('span');

        div.classList.add('message--other');
        span.classList.add('message--sender');
        span.innerHTML = sender;
        span.style.color = senderColor;

        div.appendChild(span);
        div.innerHTML += content;

        return div;
    }


    const processMessage = ({ data }) => {
        const { userName, userColor, userId, content } = JSON.parse(data);

        // const selfElement = createMessageSelfElement(content);

        const selfElement = userId === user.id ?
            createMessageSelfElement(content) :
            createMessageElementOther(content, userName, userColor);

        chatMessages.appendChild(selfElement);
        scrollScreen();
    }

    const scrollScreen = () => {
        window.scrollTo({
            top: document.body.scrollHeight,
            behavior: 'smooth'
        });
    }

    const getRandomColor = () => {
        return color[Math.floor(Math.random() * color.length)];
    }

    const handleLogin = (e) => {
        e.preventDefault();
        user.name = loginInput.value;
        user.id = crypto.randomUUID();
        user.color = getRandomColor();

        login.style.display = 'none';
        chat.style.display = 'flex';

        websocket = new WebSocket("ws://localhost:8080");

        websocket.onmessage = processMessage;



        console.log(websocket);
        console.log(user);

    }

    const sendMessage = (e) => {
        e.preventDefault();

        const message = {
            userId: user.id,
            userName: user.name,
            userColor: user.color,
            content: chatInput.value
        }

        websocket.send(JSON.stringify(message));

        chatInput.value = '';
       
    }


    loginForm.addEventListener('submit', handleLogin);
    chatForm.addEventListener('submit', sendMessage);

})();