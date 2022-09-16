<p align="center">
  <a href="https://www.infoobjects.com/" target="blank"><img src="screenshots/logo.png" width="150" alt="InfoObjects Logo" /></a>
</p>
<p align="center">Infoobjects is a consulting company that helps enterprises transform how and where they run applications and infrastructure.</p>

## Embulk yaml config generator

[![license](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

Embulk yaml config generator will help you to generate Embulk yaml code from UI. It has simple ui inertface where from you can choose plugin options(CSV, MySql, Postgres, Jdbc, sqlserver, etc) to genrate yaml code. This application has been built with NestJs(server/api) and NextJs(UI).

<img src="screenshots/screenshot1.png" style=" width:100%; " />

## Quick start

Server setup

```bash
cd server
npm install
npm run start
```
UI setup
```bash
cd UI
npm install
npm run dev
```

## Server Configuration

Change default port number 
```bash
//Goto file location /server/src/main.ts and find the line
await app.listen(3200); 
//in bootstrap function you can change nestJs port number from here.
```
whitelist url's 
```bash
//There maybe CORS issue when you use server api on UI app.
//Goto file location /server/src/main.ts and find the line 
const whitelist = ['http://localhost:3000', 'http://localhost:3200'];
//in bootstrap function, from here you update the domain name to avoid CORS issue.
```


## UI Configuration

Change default api endpoint 
```bash
//Goto file location /UI/utils/api.ts and find the line 
const endpoint = "http://localhost:3200/";
//and from here you can change api endpoint.
```
## Screenshots

<img src="screenshots/screenshot1.png" style=" width:100%; " />

<img src="screenshots/screenshot3.png" style=" width:100%; " />

<img src="screenshots/screenshot2.png" style=" width:100%; " />

## Useful Links

- [NestJs](https://nestjs.com)
- [NodeJs](https://nodejs.org)
- [NextJs](https://nextjs.org)
- [ReactJs](https://reactjs.org)
- [React Bootstrap](https://react-bootstrap.github.io)
- [Embulk](https://www.embulk.org)

## Licensing

InfoObjects [license](LICENSE) (MIT License)