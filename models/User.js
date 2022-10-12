const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true,
    },
    lastname: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    },
    about: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        default: 'customer',
        enum: ['admin', 'customer']
    },
    state: {
        type: String,
        default: 'active',
        enum: ['active', 'block']
    },
    // createdAt: {
    //     type: Date,
    //     default: Date.now,
    //     // default: function() { return Date.now() }
    // }
}, { timestamps: true });

// fire a function after doc saved to db
// userSchema.post('save', function(doc, next) {
//     console.log('New user was created & saved', doc);
//     next();
// })

// fire a function before saved to db;
userSchema.pre('save', async function(next) {
    const salt = await bcrypt.genSalt();
    // console.log(this.password);
    this.password = await bcrypt.hash(this.password, salt)
        // console.log('user is about to be created & saved', this);
    next();
});
// userSchema.post('findOneAndUpdate', async function(doc,next) {
//     const salt = await bcrypt.genSalt();
//     this.password = await bcrypt.hash(this.password, salt)
//     this.model.update({},{

//     })

//     console.log(this.password);


//     console.log('user is updated & saved', this);
//     next();
// });


//static method to login User
userSchema.statics.login = async function(email, password) {
    const user = await this.findOne({ email });
    if (user) {
        const auth = await bcrypt.compare(password, user.password);
        if (auth) {
            return user;
        }
        throw Error('incorrect Password');
    }
    throw Error('incorrect Email')
}
const User = mongoose.model('user', userSchema);
module.exports = User;