import mongoose from 'mongoose';

const BASE_URL = process.env.BASE_URL || 'http://';
const AccessSchema = new mongoose.Schema({
  count: { type: Number, default: 0 },
  lastAccessed: { type: [Date], default: [] },
});

const URLSchema = new mongoose.Schema(
  {
    originalUrl: {
      type: String,
      unique: true,
      required: true,
      set(value) {
        // If no protocol is provided, prepend http://
        if (!/^https?:\/\//i.test(value))
          value = `https://${value}`;
        return value;
      },
    },
    shortenUrl: {
      type: String,
      unique: true,
      required: true,
    },
    alias: {
      type: String,
      unique: true,
      sparse: true,
    },
    accesses: {
      type: AccessSchema,
      default: () => ({
        count: 0,
        lastAccessed: [new Date()],
      }),
    },
    expirationDate: {
      type: Date,
      default: undefined
    },
    scheduledDate: {
      type: Date,
      default: null
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

// TTL index on expirationDate, expires after the date specified in the field
URLSchema.index({ expirationDate: 1 }, { expireAfterSeconds: 0 });

URLSchema.index({ originalUrl: 1 });
URLSchema.index({ shortenUrl: 1 });

URLSchema.pre('save', function (next) {
  const TWO_YEARS = 2 * 365 * 24 * 60 * 60 * 1000; // Milliseconds
  const now = new Date();

  console.log("Pre-save hook triggered");
  console.log("Document being saved:", this);

  if (this.expirationDate) {
    if (this.expirationDate <= now) {
      console.log('Expiration date in past');
      this.expirationDate = now;
    }
    if (this.expirationDate > new Date(now.getTime() + TWO_YEARS)) {
      console.log('Expiration date too far');
      this.expirationDate = new Date(now.getTime() + TWO_YEARS);
    }
  }

  if (this.scheduledDate) {
    if (this.scheduledDate <= now) {
      console.log('Scheduled date in past');
      this.scheduledDate = now;
      this.isActive = false;
    }
  } else {
    this.isActive = true;
  }

  console.log('Active status:', this.isActive);
  next();
});

export default mongoose.models.Url || mongoose.model('Url', URLSchema);
