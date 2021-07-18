import { ApiModelProperty, ApiModel, SwaggerDefinitionConstant } from "swagger-express-ts";

@ApiModel({
  name: "PostLikeResponse",
  description: "喜歡文章的 response",
})
export default class PostLikeResponse {
  @ApiModelProperty({
    type: SwaggerDefinitionConstant.Response.Type.BOOLEAN,
    example: false,
    description: "是否為喜歡文章了",
  })
  status: boolean;
}
