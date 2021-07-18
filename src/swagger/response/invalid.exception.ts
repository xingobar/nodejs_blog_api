import { ApiModel, ApiModelProperty, SwaggerDefinitionConstant } from "swagger-express-ts";

@ApiModel({
  name: "InvalidRequestException",
  description: "驗證失敗的 response schema",
})
export default class InvalidRequestException {
  @ApiModelProperty({
    description: "錯誤資訊",
    type: SwaggerDefinitionConstant.STRING,
    example: "發生錯誤",
  })
  message: string;
}
