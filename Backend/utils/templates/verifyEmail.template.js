module.exports.verificationEmailTemplate = (verificationLink, userName = 'User') => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Verify Your Email</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background-color: #6a0dad;
          margin: 0;
          padding: 20px;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          background: #ffffff;
          padding: 40px;
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.15);
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
        }
        .logo {
          color: #6a0dad;
          font-size: 24px;
          font-weight: bold;
          margin-bottom: 10px;
        }
        h2 {
          color: #333;
          text-align: center;
          margin-bottom: 25px;
          font-size: 28px;
        }
        p {
          font-size: 16px;
          line-height: 1.6;
          color: #555;
          margin-bottom: 20px;
          text-align: center;
        }
        .button-container {
          text-align: center;
          margin: 30px 0;
        }
        .button {
          display: inline-block;
          padding: 14px 30px;
          font-size: 16px;
          font-weight: 600;
          background-color: #6a0dad;
          color: white;
          text-decoration: none;
          border-radius: 30px;
          transition: all 0.3s ease;
        }
        .button:hover {
          background-color: #5a0b9d;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(106, 13, 173, 0.3);
        }
        .link-text {
          word-break: break-all;
          background: #f8f8f8;
          padding: 15px;
          border-radius: 8px;
          font-size: 14px;
          text-align: center;
        }
        .footer {
          margin-top: 40px;
          font-size: 13px;
          color: #999;
          text-align: center;
          border-top: 1px solid #eee;
          padding-top: 20px;
        }
        .highlight {
          color: #6a0dad;
          font-weight: 600;
        }
        .button a {
        color: white !important;
        text-decoration: none;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">Taskaty</div>
          <h2>Verify Your Email Address</h2>
        </div>
        
        <p>Hello <span class="highlight">${userName}</span>,</p>
        <p>Welcome to Taskaty! We're excited to have you on board.</p>
        <p>To complete your registration, please verify your email address by clicking the button below:</p>
        
        <div class="button-container">
          <a href="${verificationLink}" class="button" target="_blank">Verify Email</a>
        </div>
        
        <p>If the button doesn't work, copy and paste this link into your browser:</p>
        <p class="link-text"><a href="${verificationLink}" target="_blank">${verificationLink}</a></p>
        
        <div class="footer">
          <p>This verification link will expire in <span class="highlight">1 hour</span>.</p>
          <p>If you didn't create an account with Taskaty, please ignore this email.</p>
          <p>© ${new Date().getFullYear()} Taskaty. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}