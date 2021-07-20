import { ApiModel, ApiModelProperty, SwaggerDefinitionConstant } from "swagger-express-ts";

@ApiModel({
  name: "NotFoundException",
  description: "找不到資料",
})
export default class NotFoundException {
  @ApiModelProperty({
    type: SwaggerDefinitionConstant.Response.Type.STRING,
    description: "訊息",
    example: "找不到資料",
  })
  message: string;
}
