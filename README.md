# chat-app
This is a web application that allows you to create conversations with other users and chat with them in real-time. You can also create group chats with your contacts.

## Features
- Create a new conversation by entering a user's email address.
- Chat in real-time.
- Create a group chat by selecting contacts from previous conversations.
- Update profile photo and user name.

## Technologies Used
- Node.js
- React
- MongoDB
- Socket.io

## Installation
> 🚧 To run this application on your machine, you need to have [Node.js](https://nodejs.org/en/) and [MongoDB](https://www.mongodb.com) installed. Here are the steps:

1. Clone this repository to your local machine using
```
git clone https://github.com/ahmettancisoy/chat-app.git.
```

2. Install the dependencies in the both client and server folders.
```
npm install
```

3. Add `.env` files to both client and server directories.
- Server
```
PORT=4000
DB_URL=mongodb://127.0.0.1:27017/chatApp
APP_URL=http://localhost:3000
ACCESS_TOKEN_SECRET=accessSecret
REFRESH_TOKEN_SECRET=refreshSecret
```
- Client
```
REACT_APP_SERVER_URL=http://localhost:4000
```

## Running
1. Run server
```
npm start
```

2. Run client
```
nodemon server
```

3. Navigate your web browser to
```
http://localhost:3000
```

<b>“You’re all set!”</b>
