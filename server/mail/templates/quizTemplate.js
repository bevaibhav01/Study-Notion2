exports.quizScoreEmail = (courseName, name, score) => {
    return `<!DOCTYPE html>
    <html>
    
    <head>
        <meta charset="UTF-8">
        <title>Quiz Score Notification</title>
        <style>
            body {
                background-color: #ffffff;
                font-family: Arial, sans-serif;
                font-size: 16px;
                line-height: 1.4;
                color: #333333;
                margin: 0;
                padding: 0;
            }
    
            .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                text-align: center;
            }
    
            .logo {
                max-width: 200px;
                margin-bottom: 20px;
            }
    
            .message {
                font-size: 18px;
                font-weight: bold;
                margin-bottom: 20px;
            }
    
            .body {
                font-size: 16px;
                margin-bottom: 20px;
            }
    
            .highlight {
                font-weight: bold;
            }
    
            .support {
                font-size: 14px;
                color: #999999;
                margin-top: 20px;
            }
        </style>
    
    </head>
    
    <body>
        <div class="container">
            <a href="https://studynotion-edtech-project.vercel.app"><img class="logo" src="https://i.ibb.co/7Xyj3PC/logo.png"
                    alt="StudyNotion Logo"></a>
            <div class="message">Your Quiz Score</div>
            <div class="body">
                <p>Dear ${name},</p>
                <p>We are pleased to inform you that you have completed the quiz for the course <span class="highlight">"${courseName}"</span>.</p>
                <p>Your score: <span class="highlight">${score}</span></p>
                <p>Keep up the great work and continue your learning journey!</p>
                <p>If you have any questions or need further assistance, don't hesitate to reach out to us.</p>
            </div>
            <div class="support">For support, please contact us at <a href="mailto:info@studynotion.com">info@studynotion.com</a>.</div>
        </div>
    </body>
    
    </html>`;
};
