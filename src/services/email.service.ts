import nodeMailer from 'nodemailer';
import Mailgen from 'mailgen';
import { SendEmail } from '../use_cases/obj/email.case';

async function emailTransport() {
    const email = process.env.EMAIL || '';
    const pass = process.env.PASS || '';
    try {
        const config = {
            service: 'gmail',
            auth: {
                user: email,
                pass: pass
            }
        }
        const transporter = nodeMailer.createTransport(config);

        return transporter
    } catch (error) {
        return error as Error;
    }
}

async function sendEmail(mailInfo: SendEmail) {
    let mailGenerator = new Mailgen({
        theme: "default",
        product: {
            name: "TestEmail",
            link: "https://linkedin.com"
        }
    })

    const response = {
        body: {
            name: mailInfo.name,
            intro: mailInfo.intro,
            outro: mailInfo.outro
        }
    }

    let mail = mailGenerator.generate(response)
    
}

async function sendBulkEmail(email:string[]) {
    
}