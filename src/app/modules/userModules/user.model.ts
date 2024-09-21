import { model, Schema } from 'mongoose'
import User, { IUserModel } from './user.interface'
import bcrypt from 'bcrypt'
import config from '../../config'

export const userSchema = new Schema<User, IUserModel>(
    {
        id: { type: String, unique: true, required: true },
        name: { type: String, trim: true, required: true },
        email: { type: String, trim: true, required: true },
        imageUrl: { type: String },
        password: { type: String, required: true },
        role: {
            type: String, // Define the type of the field
            enum: {
                values: ['admin', 'editor', 'author'], // Allowed values for this field
                message: '{VALUE} is not a valid role', // Error message if the value is not valid
            },
            // required: true,  // Makes the field required
            default: 'author', // Sets the default value if not provided
        },
    },
    {
        timestamps: true,
    }
)

// post hookd to hide some field in response
userSchema.post('save', function (doc, next) {
    doc.password = ''
    doc.role = ''
    next()
})

// pre hook for hassing password
userSchema.pre('findOneAndUpdate', async function (next) {
    const update = this.getUpdate()
    if (update.password) {
        const hashedPassword = await bcrypt.hash(
            update.password,
            Number(config.salt_rounds)
        )
        this.setUpdate({ ...update, password: hashedPassword })
    }
    return next()
})

userSchema.static('isUserExists', async function (id: string) {
    const existingUser = User.findOne({ id: id })
    return existingUser
})
export const User = model<User, IUserModel>('user', userSchema)
