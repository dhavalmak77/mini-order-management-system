import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
	email: {
		type: String,
		required: true,
		unique: true,
		lowercase: true,
		trim: true
	},
	password: {
		type: String,
		minlength: 6,
		required: true
	}
}, {
	timestamps: true
});

// Encrypt password
userSchema.pre('save', async function () {
	if (this.isModified('password')) {
		this.password = await bcrypt.hash(this.password, 12);
	}
});

const User = mongoose.model('User', userSchema);

export { User };