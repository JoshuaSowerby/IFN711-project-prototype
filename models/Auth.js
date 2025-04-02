const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const validator = require('validator');
const jwt = require("jsonwebtoken");

const authSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,// this may be pointless as it looks like MongoDB already gives us an id using _id
        index: true,
        required: true,
        auto: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        validate: {
            validator: function (value) {
                return validator.isEmail(value);
            },
            message: "Invalid Email Address"
        }
    },
    // both the validator error messages are broken
    password: {
        type: String,
        required: true,
        //"minLength: 8, minLowercase: 1, minUppercase:1, minNumbers:1, minSymbols:1"
        validate: {
            validator: function (value) {
                return validator.isStrongPassword(value);
            },
            message: "weak password"
        }
    },

    tokens: [{ token: { type: String, required: true } }]
});

// Hash password before saving
authSchema.pre("save", async function (next) {// think this cant be arrow because of this.password
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);//what does the 10 do again?
    next();
});

// login
authSchema.statics.findWithLogin = async (email, password) => {
    const user = await Auth.findOne({email});
    if(!user){
        throw new Error({error: "invalid login"});
    }
    const doesPasswordMatch = await bcrypt.compare(password, user.password)
    if(!doesPasswordMatch){
        throw new Error({error: "invalid login"});
    }
    return user;
}

// OAuth was recommended as being simpler
// Generate JWT, json web token
// should this be stored in userSchema or locally?
authSchema.methods.generateJWT = async function () {
    const token = jwt.sign({ userId: this.userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
    this.tokens.push({ token });
    await this.save();
    return token;
  };

  const Auth = mongoose.model('Auth', authSchema);

  module.exports = Auth;