# assesement

# Env Variables
Create a .env file in then root and add the following

NODE_ENV = development

PORT = 5000

MONGO_URI = your mongodb uri

JWT_SECRET = 'abc123'

PAYPAL_CLIENT_ID = your paypal client id

SMTP_HOST=smtp.mailtrap.io

SMTP_PORT=2525

SMTP_EMAIL=

SMTP_PASSWORD=

FROM_EMAIL=noreply@gmail.com

FROM_NAME=

PAYSTACK_SECRET_KEY=

# Install Dependencies
npm install

# Run
npm run server

# Seed Database
## Import data
npm run data:import

## Destroy data
npm run data:destroy

# Paystack test cards

https://docs-v1.paystack.com/docs/test-cards
