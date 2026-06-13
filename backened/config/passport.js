import passport from "passport"
import { Strategy as GoogleStrategy } from "passport-google-oauth20"
import User from "../modules/auth/auth.model.js"

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLEAUTHCLIENT_ID,
            clientSecret: process.env.GOOGLEAUTHCLIENT_SECRET,
            callbackURL: process.env.GOOGLE_CALLBACK_URL,
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                let user = await User.findOne({ googleId: profile.id })

                if (!user) {
                    user = await User.findOne({ email: profile.emails[0].value })

                    if (user) {
                        user.googleId = profile.id
                        user.authProvider = "google"
                        user.isVerified = true
                        await user.save()
                    } else {
                        user = await User.create({
                            name: profile.displayName,
                            email: profile.emails[0].value,
                            googleId: profile.id,
                            authProvider: "google",
                            isVerified: true,
                        })
                    }
                }

                return done(null, user)
            } catch (error) {
                return done(error, null)
            }
        }
    )
)

export default passport