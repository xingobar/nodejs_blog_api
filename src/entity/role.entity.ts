import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from "typeorm";
import { User } from "entity/user.entity";
@Entity("roles")
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    name: "name",
    comment: "角色名稱",
  })
  name: string;

  @ManyToMany(() => User, (user) => user.roles)
  users: User[];
}
