import os
import resend
from dotenv import load_dotenv

load_dotenv()

resend.api_key = os.getenv("RESEND_API_KEY")


async def send_otp_email(email: str, otp: int):
    resend.Emails.send({
        "from": "SmartShop <onboarding@resend.dev>",
        "to": [email],
        "subject": "Your SmartShop Signup OTP",
        "html": f"""
        <div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto; padding: 24px; border: 1px solid #e5e7eb; border-radius: 8px;">
            <h2 style="color: #4f46e5;">SmartShop — Verify Your Email</h2>
            <p style="font-size: 16px; color: #374151;">Use the OTP below to complete your registration. It expires in <strong>5 minutes</strong>.</p>
            <div style="text-align: center; margin: 32px 0;">
                <span style="font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #4f46e5;">{otp}</span>
            </div>
            <p style="font-size: 13px; color: #9ca3af;">If you did not request this, please ignore this email.</p>
        </div>
        """,
    })
