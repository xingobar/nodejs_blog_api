import { ApiModelProperty, ApiModel, SwaggerDefinitionConstant } from "swagger-express-ts";

@ApiModel({
  name: "CreateProfileRequest",
  description: "新增 or 更新個人資料 request",
})
export default class CreateProfileRequest {
  @ApiModelProperty({
    type: SwaggerDefinitionConstant.STRING,
    description: "手機號碼",
    example: "123456",
  })
  phone: string;

  @ApiModelProperty({
    type: SwaggerDefinitionConstant.STRING,
    description: "性別",
    example: "MALE",
    enum: ["MALE", "FEMALE"],
  })
  gender: string;
}
