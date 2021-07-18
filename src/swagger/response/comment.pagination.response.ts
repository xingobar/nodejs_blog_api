import { ApiModel, ApiModelProperty, SwaggerDefinitionConstant } from "swagger-express-ts";
import ParentCommentResponse from "swagger/response/parent.comment.response";

@ApiModel({
  name: "CommentPaginationResponse",
  description: "評論分頁資料",
})
export default class CommentPaginationResponse {
  @ApiModelProperty({
    type: SwaggerDefinitionConstant.Response.Type.INTEGER,
    description: "從第幾頁開始",
    example: 1,
  })
  from: number;

  @ApiModelProperty({
    type: SwaggerDefinitionConstant.Response.Type.INTEGER,
    description: "到第幾頁",
    example: 10,
  })
  to: number;

  @ApiModelProperty({
    type: SwaggerDefinitionConstant.Response.Type.INTEGER,
    description: "每頁幾筆資料",
    example: 10,
  })
  per_page: number;

  @ApiModelProperty({
    type: SwaggerDefinitionConstant.Response.Type.INTEGER,
    description: "目前第幾頁",
    example: 1,
  })
  current_page: number;

  @ApiModelProperty({
    type: SwaggerDefinitionConstant.Response.Type.ARRAY,
    model: "ParentCommentResponse",
    description: "評論資料",
  })
  data: ParentCommentResponse[];
}
