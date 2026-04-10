import mongoose from 'mongoose';

const MonthlyDuesSchema = new mongoose.Schema(
  {
    month: {
      type: Number,
      required: true,
      min: 1,
      max: 12,
    },
    year: {
      type: Number,
      required: true,
    },
    dues: [
      {
        day: {
          type: Number,
          required: true,
          min: 1,
          max: 31,
        },
        items: [
          {
            title: {
              type: String,
              required: true,
            },
            description: {
              type: String,
              default: '',
            },
            priority: {
              type: String,
              enum: ['low', 'medium', 'high'],
              default: 'medium',
            },
            category: {
              type: String,
              default: '',
            },
            completed: {
              type: Boolean,
              default: false,
            },
          },
        ],
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.models.MonthlyDues || mongoose.model('MonthlyDues', MonthlyDuesSchema);
