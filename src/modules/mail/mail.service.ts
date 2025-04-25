import { HttpException, Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {

    constructor(private readonly mailerService: MailerService){}

    async sendInitiateAccountVerificationEmail({toEmail,names, verificationCode}:{toEmail: string,verificationCode: string,names: string}){
        const url= process.env.CLIENT_URL
        try {
            await this.mailerService.sendMail({
                to:toEmail,
                subject: "Verify Your Account",
                template: "./initiate-account-verification",
                context:{
                    url,
                    verificationCode,
                    names
                }
            })
            console.log("Email sent successfully to "+ toEmail);
        } catch (error) {
            console.error(error)
            throw new HttpException(error,500);
        }
    }

    async sendAccountVerifiedEmail({toEmail,names}:{toEmail: string,names: string}){
        try {
            await this.mailerService.sendMail({
                to:toEmail,
                subject:"Account Verified Successfully",
                template: "./account-verification-successfull",
                context:{
                    names
                }
            })
            console.log("Account Successfully verified email has been sent")
            
        } catch (error) {
            console.error(error)
            throw new HttpException(error,500)
        }

    }

    async sendInitiatePasswordResetEmail({toEmail,token,names}:{toEmail: string, token: string, names: string}){
        
        const url= process.env.CLIENT_URL

        try {
          
            await this.mailerService.sendMail({
                to:toEmail,
                subject: "Reset Password Request",
                template: "./initiate-password-reset",
                context:{
                    token,
                    names,
                    url
                }
            })
            console.log("Password reset initiation email has been successfully sent")
        } catch (error) {
            console.error("error",error)
            throw new HttpException(error, 500);
        }
    }

    async sendPasswordResetSuccessfullEmail({toEmail,names}:{toEmail: string, names: string}){
        const url= process.env.CLIENT_URL

        try {
          
            await this.mailerService.sendMail({
                to:toEmail,
                subject: "Reset Password Request",
                template: "./password-reset-successfull",
                context:{
                    
                    names,
                    url
                }
            })
            console.log("Password reset successfully email has been sent");
            
        } catch (error) {
            console.error("error",error)
            throw new HttpException(error, 500);
        }
    }
}
