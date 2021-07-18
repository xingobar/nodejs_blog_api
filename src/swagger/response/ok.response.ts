import { ApiModel, ApiModelProperty, SwaggerDefinitionConstant } from "swagger-express-ts";

@ApiModel({
  name: "OkResponse",
  description: "OK Response",
})
export default class OkResponse {
  @ApiModelProperty({
    type: SwaggerDefinitionConstant.Response.Type.STRING,
    example: "ok",
  })
  ok: string;
}
