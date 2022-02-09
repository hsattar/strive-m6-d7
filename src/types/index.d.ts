import { IUser, IUserDoc } from "./userInterface"

declare global {
    namespace Express {
        interface Request {
            user: IUser
        }
    }
}