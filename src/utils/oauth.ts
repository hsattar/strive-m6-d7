import passport from "passport"
import GoogleStrategy from 'passport-google-oauth20'
import UserModal from "../db-models/userSchema"
import { createNewTokens } from '../utils/jwt'

const { GOOGLE_OAUTH_CLIENT, GOOGLE_OAUTH_SECRET, BE_URL } = process.env

const googleStrategy = new GoogleStrategy({
    clientID: GOOGLE_OAUTH_CLIENT,
    clientSecret: GOOGLE_OAUTH_SECRET,
    callbackURL: `${BE_URL}/users/googleRedirect`,
  }, async (accessToken: string, refreshToken: string, profile: any, passportNext: any) => {
    try {
        console.log(profile)
        const user = await UserModal.findOne({ googleId: profile.id })
        if (user) {
            const tokens = await createNewTokens(user)
            passportNext(null, { tokens })
        } else {
            const newUser = new UserModal({
                firstName: profile.name.givenName,
                lastName: profile.name.familyName,
                email: profile.emails[0].value,
                googleId: profile.id
            })
            const savedUser = await newUser.save()
            const tokens = await createNewTokens(savedUser)
            passportNext(null, { tokens })
        }
    } catch (error) {
        passportNext(error)
    }
})

passport.serializeUser((data, passportNext) => {
    passportNext(null, data)
})

export default googleStrategy