import { ApiModelProperty, ApiModel, SwaggerDefinitionConstant } from "swagger-express-ts";

@ApiModel({
  name: "AccessDeniedException",
  description: "沒有權限",
})
export default class AccessDeniedException {
  @ApiModelProperty({
    type: SwaggerDefinitionConstant.Response.Type.STRING,
    description: "沒有權限",
    example: "沒有權限",
  })
  message: string;
}
