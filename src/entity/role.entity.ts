import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("roles")
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    name: "name",
    comment: "角色名稱",
  })
  name: string;
}
