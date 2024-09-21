import Nodemailer from 'nodemailer';
import { MailtrapTransport ,MailtrapClient} from 'mailtrap'
import dotenv from 'dotenv/config';
// import { config } from 'dotenv';
// config();
let TOKEN = process.env.MAILTRAP_TOKEN;
TOKEN="ed49f569a089d06febc0e344d34f1d32";
let ENDPOINT = process.env.MAILTRAP_ENDPOINT;
ENDPOINT="https://send.api.mailtrap.io/"
export const mailtrapClient=new MailtrapClient({
  token:TOKEN,
  endpoint: ENDPOINT
});
export const sender = {
  // email: "bahubali1903@gmail.com",
  email: "hello@demomailtrap.com",
  name: "namit testing mail",
};
// const recipients = [
//   {
//     email: "mrhimachal1903@gmail.com",
//   }
// ];

// mailtrapClient
//   .send({
//     from: sender,
//     to: recipients,
//     subject: "You are awesome!",
//     text: "Congrats for sending test email with Mailtrap!",
//     category: "Integration Test",
//   })
//   .then(console.log, console.error);