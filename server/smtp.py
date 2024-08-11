import os
import base64
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request

# Define the scopes and credentials file
SCOPES = ['https://www.googleapis.com/auth/gmail.send']

CLIENT_SECRET_FILE = "path_to_json_credencials"

def get_oauth2_credentials():
    creds = None
    if os.path.exists('token.json'):
        creds = Credentials.from_authorized_user_file('token.json', SCOPES)
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file(CLIENT_SECRET_FILE, SCOPES)
            creds = flow.run_local_server(port=0)
        with open('token.json', 'w') as token:
            token.write(creds.to_json())
    return creds

def create_oauth2_string(username, credentials):
    auth_string = 'user={}\1auth=Bearer {}\1\1'.format(username, credentials.token)
    return base64.b64encode(auth_string.encode()).decode()

def send_email():
    # Get OAuth2 credentials
    credentials = get_oauth2_credentials()
    auth_string = create_oauth2_string('youremail@gmail.com', credentials)

    # Email details
    sender_email = 'sender@gmail.com'
    recipient_email = 'recipient_email@gmail.com'
    subject = 'subject'
    body = 'body goes here'

    # Create the email
    message = MIMEMultipart()
    message['From'] = sender_email
    message['To'] = recipient_email
    message['Subject'] = subject
    message.attach(MIMEText(body, 'plain'))

    # Connect to Gmail SMTP server
    try:
        server = smtplib.SMTP('smtp.gmail.com', 587)
        server.ehlo()
        server.starttls()
        server.ehlo()
        server.docmd('AUTH', 'XOAUTH2 ' + auth_string)

        # Send the email
        server.sendmail(sender_email, recipient_email, message.as_string())
        server.quit()

        print("Email sent successfully!")

    except Exception as e:
        print(f"Error: {e}")

if __name__ == '__main__':
    send_email()
