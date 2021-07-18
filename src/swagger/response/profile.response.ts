import { ApiModel, ApiModelProperty, SwaggerDefinitionConstant } from "swagger-express-ts";

@ApiModel({
  name: "ProfileResponse",
  description: "個人資料 response schema",
})
export default class ProfileResponse {
  @ApiModelProperty({
    required: true,
    type: SwaggerDefinitionConstant.STRING,
    description: "手機號碼",
    example: "123456",
  })
  phone: string;

  @ApiModelProperty({
    required: true,
    type: SwaggerDefinitionConstant.STRING,
    enum: ["MALE", "GENDER"],
    example: "MALE",
  })
  gender: string;
}
