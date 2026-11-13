import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';

@Injectable()
export class AuditService {
    constructor(private readonly userService: UserService){}

    record(userId: number, action: string){
        const user = this.userService.findById(userId);

        if(!user){
            return {success: false, message: `User ${userId} not found`}
        }
        return {
            success: true,
            entry: `${user.name} performed "${action}"`
        }
    }
}
