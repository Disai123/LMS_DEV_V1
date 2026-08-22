const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { User } = require('../models');
const logger = require('../utils/logger');

const googleOAuthEnabled = Boolean(
  process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
);

if (googleOAuthEnabled) {
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL || '/api/auth/google/callback'
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      const { id: googleId, displayName, emails, photos } = profile;
      const email = emails[0].value;
      const avatar = photos[0]?.value;

      let user = await User.findByGoogleId(googleId);
      let isNewUser = false;

      if (user) {
        if (!user.is_active) {
          logger.warn(`Inactive user ${user.email} attempted Google OAuth login`);
          return done(new Error('Account is deactivated. Please contact an administrator.'), null);
        }

        await user.update({
          name: displayName,
          email: email,
          avatar: avatar,
          last_login: new Date()
        });
      } else {
        user = await User.findByEmail(email);

        if (user) {
          if (!user.is_active) {
            logger.warn(`Inactive user ${user.email} attempted Google OAuth login`);
            return done(new Error('Account is deactivated. Please contact an administrator.'), null);
          }

          await user.update({
            google_id: googleId,
            avatar: avatar,
            last_login: new Date()
          });
        } else {
          user = await User.create({
            google_id: googleId,
            name: displayName,
            email: email,
            avatar: avatar,
            role: 'student',
            is_active: true,
            last_login: new Date()
          });
          isNewUser = true;
        }
      }

      return done(null, { user, isNewUser });
    } catch (error) {
      logger.error('Google OAuth strategy error:', error);
      return done(error, null);
    }
  }));

  logger.info('Google OAuth strategy enabled');
} else {
  logger.warn('Google OAuth disabled — set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET to enable');
}

passport.serializeUser((user, done) => {
  done(null, user.user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findByPk(id);
    done(null, user);
  } catch (error) {
    logger.error('Passport deserialize error:', error);
    done(error, null);
  }
});

module.exports = passport;
module.exports.googleOAuthEnabled = googleOAuthEnabled;
