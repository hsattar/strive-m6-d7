import { TokenDetails } from "./userInterface"

declare global {
    namespace Express {
        interface Request {
            user: TokenDetails
        }
    }
}