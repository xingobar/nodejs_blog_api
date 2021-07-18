import { ApiModel, ApiModelProperty, SwaggerDefinitionConstant } from "swagger-express-ts";
import PostResponse from "swagger/response/post.response";

@ApiModel({
  name: "PostPaginationResponse",
  description: "PostPaginationResponse",
})
export default class PostPaginationResponse {
  @ApiModelProperty({
    description: "分頁資料",
    type: SwaggerDefinitionConstant.Response.Type.ARRAY,
    model: "PostResponse",
  })
  data: PostResponse[];

  @ApiModelProperty({
    description: "從第幾頁開始",
    type: SwaggerDefinitionConstant.Response.Type.INTEGER,
    example: 1,
  })
  from: number;

  @ApiModelProperty({
    description: "到第幾頁",
    type: SwaggerDefinitionConstant.Response.Type.INTEGER,
    example: 10,
  })
  to: number;

  @ApiModelProperty({
    description: "每頁幾筆資料",
    type: SwaggerDefinitionConstant.Response.Type.INTEGER,
    example: 10,
  })
  per_page: number;

  @ApiModelProperty({
    description: "目前頁碼",
    type: SwaggerDefinitionConstant.Response.Type.INTEGER,
    example: 1,
  })
  current_page: number;
}
