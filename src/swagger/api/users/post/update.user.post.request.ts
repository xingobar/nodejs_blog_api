import { ApiModel, ApiModelProperty, SwaggerDefinitionConstant } from "swagger-express-ts";

@ApiModel({
  name: "UpdateUserPostRequest",
  description: "更新使用者文章請求",
})
export default class UpdateUserPostRequest {
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
