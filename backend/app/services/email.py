import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from app.core.config import settings


def send_email(to_email: str, subject: str, body: str, is_html: bool = False):
    """Send email using SMTP"""
    try:
        # Create message
        msg = MIMEMultipart()
        msg['From'] = settings.MAIL_FROM
        msg['To'] = to_email
        msg['Subject'] = subject
        
        # Add body
        msg.attach(MIMEText(body, 'html' if is_html else 'plain'))
        
        # Connect to server and send email
        server = smtplib.SMTP(settings.MAIL_SERVER, settings.MAIL_PORT)
        server.starttls()
        server.login(settings.MAIL_USERNAME, settings.MAIL_PASSWORD)
        
        text = msg.as_string()
        server.sendmail(settings.MAIL_FROM, to_email, text)
        server.quit()
        
        return True
    except Exception as e:
        print(f"Failed to send email: {e}")
        return False


def send_password_reset_email(email: str, reset_token: str):
    """Send password reset email"""
    reset_url = f"http://localhost:3000/reset-password?token={reset_token}"
    
    subject = "Password Reset - SkillGlide"
    body = f"""
    <html>
        <body>
            <h2>Password Reset Request</h2>
            <p>You have requested to reset your password for your SkillGlide account.</p>
            <p>Click the link below to reset your password:</p>
            <a href="{reset_url}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Reset Password</a>
            <p>This link will expire in 1 hour.</p>
            <p>If you didn't request this, please ignore this email.</p>
            <br>
            <p>Best regards,<br>The SkillGlide Team</p>
        </body>
    </html>
    """
    
    return send_email(email, subject, body, is_html=True)


def send_welcome_email(email: str, name: str):
    """Send welcome email to new users"""
    subject = "Welcome to SkillGlide!"
    body = f"""
    <html>
        <body>
            <h2>Welcome to SkillGlide, {name}!</h2>
            <p>Thank you for joining SkillGlide, the AI-powered job portal.</p>
            <p>You can now:</p>
            <ul>
                <li>Create and customize your professional resume</li>
                <li>Search for jobs that match your skills</li>
                <li>Get AI-powered job recommendations</li>
                <li>Connect with top employers</li>
            </ul>
            <p>Get started by completing your profile and uploading your resume.</p>
            <a href="http://localhost:3000/profile" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Complete Profile</a>
            <br><br>
            <p>Best regards,<br>The SkillGlide Team</p>
        </body>
    </html>
    """
    
    return send_email(email, subject, body, is_html=True)