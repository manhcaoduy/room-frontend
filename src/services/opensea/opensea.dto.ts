import { Expose } from "class-transformer";

export class Asset {
  @Expose({ name: "image_url" })
  imageUrl: string | null;
}
