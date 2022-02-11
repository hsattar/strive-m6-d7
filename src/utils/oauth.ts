import passport from "passport"
import GoogleStrategy from "passport-google-oauth20"
import UsersModel from "../db-models/userSchema"
import { createNewTokens } from "./jwt"
import { IGoogleProfile } from "../types/googleProfileInterface"

const { GOOGLE_OAUTH_ID, GOOGLE_OUATH_SECRET, BE_URL } = process.env

const googleStrategy = new GoogleStrategy({
    clientID: GOOGLE_OAUTH_ID,
    clientSecret: GOOGLE_OUATH_SECRET,
    callbackURL: `${BE_URL}/users/googleRedirect`,
  }, async (accessToken: string, refreshToken: string, profile: IGoogleProfile, passportNext: any) => {
    try {
      console.log("PROFILE: ", profile)
      const user = await UsersModel.findOne({ googleId: profile.id })
      if (user) {
        const tokens = await createNewTokens(user)
        passportNext(null, { tokens })
      } else {
        const newUser = new UsersModel({
          firstName: profile.name.givenName,
          lastName: profile.name.familyName,
          email: profile.emails[0].value,
          googleId: profile.id,
        })
        const savedUser = await newUser.save()
        const tokens = await createNewTokens(savedUser)
        passportNext(null, { tokens })
      }
    } catch (error) {
      passportNext(error)
    }
  }
)

passport.serializeUser(function (data, passportNext) {
  passportNext(null, data)
})

export default googleStrategy
