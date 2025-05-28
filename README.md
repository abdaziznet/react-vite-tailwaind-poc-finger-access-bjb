### :rocket: POC BJB FINGERPRINT ACCESS

---

#### run development
    1. git clone https://github.com/abdaziznet/react-vite-tailwaind-poc-finger-access-bjb.git
    2. npm install
    3. npm run dev
   

#### :bulb: how to deploy with docker

    1. npm run build
    2. docker build -t poc-finger-access-app:v1.4.20250528 .
    3. docker run -d -p 8060:80 poc-finger-access-app:v1.4.20250528

