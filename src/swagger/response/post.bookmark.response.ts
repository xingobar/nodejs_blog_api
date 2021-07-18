import { ApiModel, ApiModelProperty, SwaggerDefinitionConstant } from "swagger-express-ts";

@ApiModel({
  name: "PostBookmarkResponse",
  description: "收藏文章 response",
})
export default class PostBookmarkResponse {
  @ApiModelProperty({
    type: SwaggerDefinitionConstant.Response.Type.BOOLEAN,
    description: "是否收藏了文章",
    example: false,
  })
  status: boolean;
}
