import { ApiModel, ApiModelProperty, SwaggerDefinitionConstant } from "swagger-express-ts";
import UserResponse from "swagger/response/user.response";

@ApiModel({
  name: "PostResponse",
  description: "文章回傳值",
})
export default class PostResponse {
  @ApiModelProperty({
    type: SwaggerDefinitionConstant.Response.Type.INTEGER,
    example: 1,
    description: "文章編號",
  })
  id: number;

  @ApiModelProperty({
    type: SwaggerDefinitionConstant.Response.Type.STRING,
    example: "demo",
    description: "文章標題",
  })
  title: string;

  @ApiModelProperty({
    type: SwaggerDefinitionConstant.Response.Type.STRING,
    example: "body",
    description: "內容",
  })
  body: string;

  @ApiModelProperty({
    type: SwaggerDefinitionConstant.Response.Type.INTEGER,
    example: 0,
    description: "喜歡數量",
  })
  likeCount: number;

  @ApiModelProperty({
    type: SwaggerDefinitionConstant.Response.Type.INTEGER,
    example: 0,
    description: "收藏數量",
  })
  bookmarkCount: number;

  @ApiModelProperty({
    type: SwaggerDefinitionConstant.Response.Type.INTEGER,
    example: 0,
    description: "觀看次數",
  })
  viewCount: number;

  @ApiModelProperty({
    type: SwaggerDefinitionConstant.Response.Type.NUMBER,
    example: 4.0,
    description: "評論分數",
  })
  feedbackScore: number;

  @ApiModelProperty({
    type: SwaggerDefinitionConstant.Response.Type.STRING,
    example: "2020-12-12 12:00:00",
    description: "新增時間",
  })
  createdAt: string;

  @ApiModelProperty({
    type: SwaggerDefinitionConstant.Response.Type.STRING,
    example: "2020-12-12 12:00:00",
    description: "更新時間",
  })
  updatedAt: string;

  @ApiModelProperty({
    type: SwaggerDefinitionConstant.Response.Type.OBJECT,
    model: "UserResponse",
    description: "文章作者",
  })
  owner: UserResponse;
}
