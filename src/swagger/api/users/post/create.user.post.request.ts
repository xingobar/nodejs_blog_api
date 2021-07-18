import { ApiModel, ApiModelProperty, SwaggerDefinitionConstant } from "swagger-express-ts";

@ApiModel({
  name: "CreateUserPostRequest",
  description: "使用者新增文章",
})
export default class CreateUserPostRequest {
  @ApiModelProperty({
    type: SwaggerDefinitionConstant.STRING,
    description: "文章標題",
    example: "demo",
    required: true,
  })
  title: string;

  @ApiModelProperty({
    type: SwaggerDefinitionConstant.STRING,
    description: "文章內容",
    example: "demo",
    required: true,
  })
  body: string;

  @ApiModelProperty({
    type: SwaggerDefinitionConstant.STRING,
    description: "文章狀態",
    example: "PUBLISH",
    enum: ["PUBLISH", "DRAFT", "OFFLINE"],
  })
  status: string;
}
