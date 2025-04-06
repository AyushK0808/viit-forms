import mongoose, { Schema, Document } from 'mongoose';

interface IMember extends Document {
  name: string;
  phoneNumber: string;
  email: string;
  regNo: string;
  gender: 'Male' | 'Female' | 'Other';
  birthdate: Date;
  quirkyDetail: string;
  createdAt?: Date;
}

const MemberSchema = new Schema<IMember>({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    maxlength: [60, 'Name cannot be more than 60 characters'],
  },
  phoneNumber: {
    type: String,
    required: [true, 'Please provide a phone number'],
    match: [/^[6789]\d{9}$/, 'Phone number must be 10 digits and start with 6, 7, 8, or 9'],
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
  },
  regNo: {
    type: String,
    required: [true, 'Please provide a registration number'],
    unique: true,
    match: [/^2\d[A-Z]{3}\d{4}$/, 'Registration number must be in the format 2XYYYXXXX'],
  },
  gender: {
    type: String,
    required: [true, 'Please select a gender'],
    enum: ['Male', 'Female', 'Other'],
  },
  birthdate: {
    type: Date,
    required: [true, 'Please provide a birthdate'],
  },
  quirkyDetail: {
    type: String,
    required: [true, 'Please provide a quirky detail'],
    maxlength: [200, 'Quirky detail cannot be more than 200 characters'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Member || mongoose.model<IMember>('Member', MemberSchema);
