import mogoose from 'mongoose';

const userSchema = new mogoose.Schema({

    email:{
        type: String,
        required: true,
        unique: true,
    },
    fullname:{
        firstname:{
            type: String,
            required: true,
        },
        lastname:{
            type: String,
            required: true,
        }
    },
    googleId:{
        type: String,
    },
    password:{
        type: String,
        required: function() { return !this.googleId; } ,
    },
    role:{
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
    }    
},{ timestamps: true });

const UserModel = mogoose.model('User', userSchema);

export default UserModel;