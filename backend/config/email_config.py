from fastapi_mail import ConnectionConfig

conf = ConnectionConfig(
    MAIL_USERNAME="keshavghai94@gmail.com",
    MAIL_PASSWORD="lvpegssjgiczvkaq",
    MAIL_FROM="keshavghai94@gmail.com",
    MAIL_FROM_NAME="SmartShop",
    MAIL_PORT=587,
    MAIL_SERVER="smtp.gmail.com",
    MAIL_STARTTLS=True,
    MAIL_SSL_TLS=False,
    USE_CREDENTIALS=True,
)
