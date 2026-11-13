import { Injectable } from '@nestjs/common';
import { LoggerService } from '../logger/logger.service';

export interface User {
    id: number,
    name: string;
}

@Injectable()
export class UserService {
    private readonly users: User[] = [
        {id: 1, name: "gio"},
        {id: 2, name: "gogala"}
    ];

    constructor (private readonly logger: LoggerService){}

    findById(id: number): User | undefined {
        const user = this.users.find((u) => u.id === id);
        this.logger.log("UserService", `findById(${id}) -> ${user ? user.name : 'user not found'}`);
        return user;
    }
}
