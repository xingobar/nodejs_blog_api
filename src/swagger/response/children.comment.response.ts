import { ApiModel, ApiModelProperty, SwaggerDefinitionConstant } from "swagger-express-ts";
import UserResponse from "swagger/response/user.response";

@ApiModel({
  name: "ChildrenCommentResponse",
  description: "子留言資料結構",
})
export default class ChildrenCommentResponse {
  @ApiModelProperty({
    type: SwaggerDefinitionConstant.Response.Type.INTEGER,
    description: "父曾評論編號",
  })
  id: number;

  @ApiModelProperty({
    type: SwaggerDefinitionConstant.Response.Type.STRING,
    description: "評論內容",
  })
  body: string;

  @ApiModelProperty({
    type: SwaggerDefinitionConstant.Response.Type.STRING,
    description: "新增時間",
  })
  createdAt: string;

  @ApiModelProperty({
    type: SwaggerDefinitionConstant.Response.Type.STRING,
    description: "更新時間",
  })
  updatedAt: string;

  @ApiModelProperty({
    type: SwaggerDefinitionConstant.Response.Type.OBJECT,
    model: "UserResponse",
    description: "評論者資料",
  })
  user: UserResponse;
}
