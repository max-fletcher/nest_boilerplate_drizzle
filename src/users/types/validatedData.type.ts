import { StoreUserWithPostAndImageFileDto } from "../dto/createUserWithPostWithFile.dto";
import { UpdateUserDto } from "../dto/update-user.dto";

export type TValdiatedUserWithPostAndImage = Omit<StoreUserWithPostAndImageFileDto, 'avatar'> & { avatar?: string }

export type TValdiatedUser = Omit<UpdateUserDto, 'avatar'> & { avatar?: string }