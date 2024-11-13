import { HttpException, HttpStatus } from "@nestjs/common";
import { validate } from "uuid";

export const checkUUID: checkUUID = (uuid: string) => {
  if (!validate(uuid)) {
      throw new HttpException('Invalid ID format', HttpStatus.BAD_REQUEST);
  }
}

type checkUUID = (uuid: string) => void