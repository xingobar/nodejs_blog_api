import { ApiModel, ApiModelProperty } from "swagger-express-ts";

@ApiModel({
  description: "User Response",
  name: "UserResponse",
})
export default class UserResponse {
  @ApiModelProperty({
    description: "會員編號",
    example: 1,
    required: true,
  })
  id: number;

  @ApiModelProperty({
    description: "帳號",
    example: "account",
    required: true,
  })
  account: string;

  @ApiModelProperty({
    description: "信箱",
    example: "garyng@gmail.com",
    required: true,
  })
  email: string;
}
