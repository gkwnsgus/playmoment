const path = require('path');

const express = require('express');
const morgan = require('morgan');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const http = require('http');
const socketIO = require('socket.io');

const nunjucks = require('nunjucks');
const { sequelize } = require('./models');

const passport = require('passport');
const passportConfig = require('./passport');

const authRouter = require('./routes/auth');
const userRouter = require('./routes/user');
const indexRouter = require('./routes');

dotenv.config();
passportConfig();

const app = express();
const server = http.createServer(app);
const io = socketIO(server);
app.set('port', process.env.PORT || 3000);

app.set('view engine', 'html');
nunjucks.configure(path.join(__dirname, 'views'), {
    express: app,
    watch: true,
});

sequelize.sync({ force: false })
  .then(() => console.log('데이터베이스 연결 성공'))
  .catch(err => console.error(err));

app.use(
    morgan('dev'),
    express.static(path.join(__dirname, 'views')),
    express.json(),
    express.urlencoded({ extended: false }),
    cookieParser(process.env.SECRET),
    session({
        resave: false,
        saveUninitialized: false,
        secret: process.env.SECRET,
        cookie: {
            httpOnly: true,
            secure: false
        },
        name: 'session-cookie'
    })
);

app.use(express.static(__dirname + '/views'));

app.use(passport.initialize());
app.use(passport.session());

app.use('/auth', authRouter);
app.use('/user', userRouter);
app.use('/', indexRouter);

app.get('/index', (req, res, next) => {
    res.locals.title = require('./package.json').name;
    res.locals.port = app.get('port');
    res.locals.user = req.user;
    res.render('index');
});

app.get('/login', (req, res, next) => {
    res.locals.title = require('./package.json').name;
    res.locals.port = app.get('port');
    res.locals.user = req.user;
    res.render('login');
});

app.get('/about', (req, res, next) => {
    res.locals.title = require('./package.json').name;
    res.locals.port = app.get('port');
    res.locals.user = req.user;
    res.render('about');
});

app.get('/freeboard', (req, res, next) => {
    res.locals.title = require('./package.json').name;
    res.locals.port = app.get('port');
    res.locals.user = req.user;
    res.render('freeboard');
});

app.get('/friendmatch', (req, res, next) => {
    res.locals.title = require('./package.json').name;
    res.locals.port = app.get('port');
    res.locals.user = req.user;
    res.render('friendmatch');
});

app.get('/infoboard', (req, res, next) => {
    res.locals.title = require('./package.json').name;
    res.locals.port = app.get('port');
    res.locals.user = req.user;
    res.render('infoboard');
});

app.get('/petcarematch_apply', (req, res, next) => {
    res.locals.title = require('./package.json').name;
    res.locals.port = app.get('port');
    res.locals.user = req.user;
    res.render('petcarematch_apply');
});

app.get('/petcarematch_reg', (req, res, next) => {
    res.locals.title = require('./package.json').name;
    res.locals.port = app.get('port');
    res.locals.user = req.user;
    res.render('petcarematch_reg');
});

app.get('/questboard', (req, res, next) => {
    res.locals.title = require('./package.json').name;
    res.locals.port = app.get('port');
    res.locals.user = req.user;
    res.render('questboard');
});

app.get('/reviewboard', (req, res, next) => {
    res.locals.title = require('./package.json').name;
    res.locals.port = app.get('port');
    res.locals.user = req.user;
    res.render('reviewboard');
});

app.get('/single', (req, res, next) => {
    res.locals.title = require('./package.json').name;
    res.locals.port = app.get('port');
    res.locals.user = req.user;
    res.render('single');
});

app.get('/single2', (req, res, next) => {
    res.locals.title = require('./package.json').name;
    res.locals.port = app.get('port');
    res.locals.user = req.user;
    res.render('single2');
});

app.get('/single3', (req, res, next) => {
    res.locals.title = require('./package.json').name;
    res.locals.port = app.get('port');
    res.locals.user = req.user;
    res.render('single3');
});

app.get('/single4', (req, res, next) => {
    res.locals.title = require('./package.json').name;
    res.locals.port = app.get('port');
    res.locals.user = req.user;
    res.render('single4');
});

app.get('/single5', (req, res, next) => {
    res.locals.title = require('./package.json').name;
    res.locals.port = app.get('port');
    res.locals.user = req.user;
    res.render('single5');
});

app.get('/single6', (req, res, next) => {
    res.locals.title = require('./package.json').name;
    res.locals.port = app.get('port');
    res.locals.user = req.user;
    res.render('single6');
});

app.get('/chat', (req, res) => {
    res.sendFile(__dirname + '/views/chat.html');
  });
  
  // 클라이언트와의 소켓 통신
  io.on('connection', (socket) => {
    console.log('새로운 사용자가 연결되었습니다.');
  
    // 클라이언트로부터 채팅 메시지 수신
    socket.on('chat message', (message) => {
      console.log('수신한 메시지:', message);
      // 메시지를 보낸 클라이언트에게만 메시지 전송
      socket.emit('chat message', { message, isMine: true });
      // 나를 제외한 다른 모든 클라이언트에게 메시지 전송
      socket.broadcast.emit('chat message', { message, isMine: false });
    });
  
    // 연결 해제 시 처리
    socket.on('disconnect', () => {
      console.log('사용자가 연결을 해제하였습니다.');
    });
});

app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).send(err);
});

server.listen(app.get('port'), () => {
    console.log(app.get('port'), '번 포트에서 대기 중');
});
