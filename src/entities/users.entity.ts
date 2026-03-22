import { Entity, Column } from 'typeorm';
import AbstractEntity from './abstract.entity.js';

@Entity()
class User extends AbstractEntity {
    @Column()
    name: string;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;
}

export default User;