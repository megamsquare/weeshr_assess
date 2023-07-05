import nodeMailer from 'nodemailer'

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

async function sendEmail(email:string) {
    
}

async function sendBulkEmail(email:string[]) {
    
}