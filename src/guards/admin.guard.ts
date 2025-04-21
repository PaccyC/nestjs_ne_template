import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Observable } from "rxjs";
import { PrismaService } from "src/modules/prisma/prisma.service";

@Injectable()
export class AdminGuard implements CanActivate {
    constructor(
        private jwtService: JwtService,
        private prismaService: PrismaService
    ){}

    async canActivate(context: ExecutionContext):  Promise<boolean> {
        const request= context.switchToHttp().getRequest();
        const authHeader= request.headers.authorization;
        if(authHeader !=null && authHeader.startsWith("Bearer")){
           const tokenValue= authHeader.substring(7);

         try {
            
            const decodedToken= await this.jwtService.verify(tokenValue,{
                secret: process.env.JWT_SECRET_KEY
            });
            const user = await this.prismaService.user.findUnique({
                where: {
                    id: decodedToken.id
                }
            })
            if(!user) return false;
            switch(user.role){
                case 'USER':
                    return false
                case 'ADMIN':
                    request.user= user
                    return true;
                default: 
                  return false
                  
            }
         } 
         catch (error) {
             return false
         }
        }

        return false
    }
}