import mongoose from 'mongoose';

const marketingSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    subtitle: {
      type: String,
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
    sections: [
      {
        title: String,
        description: String,
        icon: String,
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Marketing || mongoose.model('Marketing', marketingSchema);
