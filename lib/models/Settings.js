import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema(
  {
    siteName: {
      type: String,
      default: 'ATAMA',
    },
    navbarSubtitle: {
      type: String,
      default: 'Investment Group',
    },
    footerDescription: {
      type: String,
      default: 'Building sustainable futures through strategic investments in healthcare, agriculture, and market solutions.',
    },
    footerEmail: {
      type: String,
      default: 'info@atama.com',
    },
    footerPhone: {
      type: String,
      default: '+234 XXX XXX XXXX',
    },
    footerLocation: {
      type: String,
      default: 'Nigeria',
    },
  },
  { timestamps: true }
);

export default mongoose.models.Settings || mongoose.model('Settings', settingsSchema);
