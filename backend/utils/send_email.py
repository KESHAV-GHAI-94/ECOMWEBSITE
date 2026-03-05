from fastapi_mail import FastMail, MessageSchema
from config.email_config import conf


async def send_otp_email(email: str, otp: int):
    message = MessageSchema(
        subject="Signup Registeration OTP",
        recipients=[email],
        body=f"Your OTP is {otp}. It will expire in 5 minutes.",
        subtype="plain",
    )

    fm = FastMail(conf)
    await fm.send_message(message)
