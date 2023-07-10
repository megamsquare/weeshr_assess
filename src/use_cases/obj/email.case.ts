export interface SendEmail {
    body: {
        name: string;
        intro: string;
        outro: string;
    };
    email: string
    
}