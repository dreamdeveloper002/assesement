# assesement

# Env Variables
Create a .env file in then root and add the following

NODE_ENV=development

PORT=5000

MONGO_URI=*your mongodb uri*

JWT_SECRET=

PAYPAL_CLIENT_ID=<your paypal client id>

SMTP_HOST=smtp.mailtrap.io

SMTP_PORT=

SMTP_EMAIL=

SMTP_PASSWORD=

FROM_EMAIL=

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

