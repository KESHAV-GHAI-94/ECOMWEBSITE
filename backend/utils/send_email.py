import os
import smtplib
import asyncio
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from dotenv import load_dotenv

load_dotenv()

GMAIL_USER = os.getenv("MAIL_USERNAME")
GMAIL_APP_PASSWORD = os.getenv("MAIL_PASSWORD")


def _send_smtp(to_email: str, otp: int):
    """Blocking SMTP call — runs in a thread executor."""
    html = f"""
    <div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto;
                padding: 24px; border: 1px solid #e5e7eb; border-radius: 8px;">
        <h2 style="color: #4f46e5;">SmartShop — Verify Your Email</h2>
        <p style="font-size: 16px; color: #374151;">
            Use the OTP below to complete your registration.
            It expires in <strong>5 minutes</strong>.
        </p>
        <div style="text-align: center; margin: 32px 0;">
            <span style="font-size: 36px; font-weight: bold;
                         letter-spacing: 8px; color: #4f46e5;">{otp}</span>
        </div>
        <p style="font-size: 13px; color: #9ca3af;">
            If you did not request this, please ignore this email.
        </p>
    </div>
    """
    msg = MIMEMultipart("alternative")
    msg["Subject"] = "Your SmartShop Signup OTP"
    msg["From"] = f"SmartShop <{GMAIL_USER}>"
    msg["To"] = to_email
    msg.attach(MIMEText(html, "html"))

    with smtplib.SMTP("smtp.gmail.com", 587) as server:
        server.ehlo()
        server.starttls()
        server.ehlo()
        server.login(GMAIL_USER, GMAIL_APP_PASSWORD)
        server.send_message(msg)


async def send_otp_email(email: str, otp: int):
    loop = asyncio.get_event_loop()
    await loop.run_in_executor(None, _send_smtp, email, otp)
