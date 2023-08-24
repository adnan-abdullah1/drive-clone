
const nodemailer = require('nodemailer');
require('dotenv').config({ path: '../env/variables.env' })
const { MAIL, MAIL_PASSWORD } = process.env
const htmlTemplate = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Account Created</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f2f2f2;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: white;
            border-radius: 10px;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
            animation: fade-in 1s ease-in-out;
        }
        .header {
            background-color: #007bff;
            color: white;
            padding: 10px;
            text-align: center;
            border-top-left-radius: 10px;
            border-top-right-radius: 10px;
        }
        .content {
            padding: 20px;
        }
        .message {
            font-size: 18px;
            margin-bottom: 20px;
        }
        .button {
            display: inline-block;
            padding: 10px 20px;
            background-color: #007bff;
            color: white;
            text-decoration: none;
            border-radius: 5px;
        }
        @keyframes fade-in {
            0% {
                opacity: 0;
            }
            100% {
                opacity: 1;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Account Created</h1>
        </div>
        <div class="content">
            <p class="message">Dear user,</p>
            <p class="message">A file has been shared with you</p>
            <p class="message">Thank you for choosing us!</p>
            <p class="message">Best regards,</p>
            <p class="message">The XYZ Team</p>
            <a class="button" href="#">Log In</a>
        </div>
    </div>
</body>
</html>

 `
const fileSharedHtmlTemplate = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Account Created</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f2f2f2;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: white;
            border-radius: 10px;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
            animation: fade-in 1s ease-in-out;
        }
        .header {
            background-color: #007bff;
            color: white;
            padding: 10px;
            text-align: center;
            border-top-left-radius: 10px;
            border-top-right-radius: 10px;
        }
        .content {
            padding: 20px;
        }
        .message {
            font-size: 18px;
            margin-bottom: 20px;
        }
        .button {
            display: inline-block;
            padding: 10px 20px;
            background-color: #007bff;
            color: white;
            text-decoration: none;
            border-radius: 5px;
        }
        @keyframes fade-in {
            0% {
                opacity: 0;
            }
            100% {
                opacity: 1;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Account Created</h1>
        </div>
        <div class="content">
            <p class="message">Dear user,</p>
            <p class="message">File has been shared with you</p>
            <p class="message">Best regards,</p>
            <p class="message">The DRIVE Team</p>
        </div>
    </div>
</body>
</html>

 `
let transporter = nodemailer.createTransport({
    service: 'gmail',
    host: "smtp.gmail.com",
    port: 587,
    tls:{
        rejectUnauthorized : false
    },
    auth: {
        user: MAIL,
        pass: MAIL_PASSWORD
    }
})


exports.SendMail = (to)=>{
    const message = {
        from: 'adshe886@gmail.com',
        to: to,
        subject: 'Drive Account Created',
        html: htmlTemplate
    }
    transporter.sendMail(message, (err, info) => {
        if (err) {
            console.log('*** unable to send mail***',err)
        }
        else {
            console.log('*** Successfully sent mail***' )
        }
    })
}
exports.SendFilesSharedMail = (to)=>{
    console.log(to)
    const message = {
        from: 'adshe886@gmail.com',
        to: to,
        subject: 'File has been shared',
        html: fileSharedHtmlTemplate
    }
    transporter.sendMail(message, (err, info) => {
        if (err) {
            console.log('*** unable to send mail***',err)
        }
        else {
            console.log('*** Successfully sent mail***' )
        }
    })
}


