export enum UserStatus {
  NEW = 0,
  VERIFIED = 1,
  LOCKED = 2,
  BANNED = 3,
}

export type VehicleDto = {
  id: number,
  fullname: string,
  cylinderCapacity: string,
  status: string,
  type: string,
  images: string[],
}

export type UserDto = {
  fullname: string,
  id: number,
  birthday: string,
  status: UserStatus,
  vehicles: VehicleDto[],
  profileImages: string[],
  bio: string,
  interests: string[],
}

export type PersonalInformation = {
  userId?: number,
  fullname?: string,
  birthday?: Date | undefined,
  gender?: string,
  firebaseId: string,
  accessToken?: string
};