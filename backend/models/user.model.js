import { Schema, model } from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';


const userSchema = new Schema({
    // name: {
    //     type: String,
    //     required: true
    // },
    email: {
        type: String,
        required: true,
        unique: true,
        trim:true,
        lowercase: true,
        minlength: [6, "Email must be at least 6 characters long"],
        maxlength: [50, "Email must not be at least 50 characters "]
    },
    password: {
        type: String,
        select:false,
        required: true
    }
});

userSchema.statics.hashPassword = async (password) => {
    return await bcrypt.hash(password, 10);
}
userSchema.methods.isValidPassword = async function (password) {
    return await bcrypt.compare(password, this.password);
}
userSchema.methods.generateJwt = function () {
    return jwt.sign({ email : this.email }, process.env.JWT_SECRET, {
        expiresIn: '24h'
    });
}
const User = model('user', userSchema);

export default User;

