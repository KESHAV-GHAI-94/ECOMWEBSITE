import os
import requests
from dotenv import load_dotenv

load_dotenv()

BREVO_API_KEY = os.getenv("BREVO_API_KEY")
SENDER_EMAIL = os.getenv("MAIL_USERNAME", "keshavghai94@gmail.com")
SENDER_NAME = "SmartShop"


async def send_otp_email(email: str, otp: int):
    url = "https://api.brevo.com/v3/smtp/email"
    headers = {
        "accept": "application/json",
        "api-key": BREVO_API_KEY,
        "content-type": "application/json",
    }
    payload = {
        "sender": {"name": SENDER_NAME, "email": SENDER_EMAIL},
        "to": [{"email": email}],
        "subject": "Your SmartShop Signup OTP",
        "htmlContent": f"""
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
        """,
    }
    response = requests.post(url, json=payload, headers=headers)
    if response.status_code not in (200, 201):
        raise Exception(f"Email send failed: {response.text}")
