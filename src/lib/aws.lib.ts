import AWS from "aws-sdk";
import config from "config/index";
import fs from "fs";
import path from "path";
import { Service } from "typedi";

@Service()
export default class AwsLib {
  private s3: AWS.S3;

  constructor() {
    AWS.config.update({
      accessKeyId: config.aws.accessKey,
      secretAccessKey: config.aws.secretKey,
      region: config.aws.region,
    });

    this.s3 = new AWS.S3();
  }

  /**
   *
   * @param param
   * @param {string} param.bucket - bucket 名稱
   * @param {string} param.filePath - 檔案路徑
   * @param {string} param.folder 資料夾
   * @param {function} param.callback - callback method
   */
  public upload({
    bucket = config.aws.bucket,
    filePath,
    folder = config.aws.folder,
    callback,
  }: {
    bucket?: string;
    filePath: string;
    folder?: string;
    callback: (err: any, data: any) => void;
  }) {
    // key => 資料夾/時間_圖片檔名
    const params = {
      Bucket: bucket,
      Body: fs.createReadStream(filePath),
      Key: `${folder}${Date.now()}_${path.basename(filePath)}`,
    };

    this.s3.upload(params, (err: any, data: any) => {
      callback(err, data);
    });
  }
}
