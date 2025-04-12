import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Subscription Name is required"],
      trim: true,
      minlength: [3, "Subscription Name must be at least 3 characters long"],
      maxlength: [100, "Subscription Name must be at most 100 characters long"],
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price must be a positive number"],
    },
    currency: {
      type: String,
      max: [10000, "Price must be less than 10000"],
      enum: ["USD", "EUR", "GBP"],
      default: "USD",
    },
    frequency: {
      type: String,
      enum: ["daily", "weekly", "monthly", "yearly"],
    },
    category: {
      type: String,
      enum: ["basic", "premium", "enterprise"],
      required: true,
    },
    paymentMethod: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["active", "cancelled", "expired"],
      default: "active",
    },
    startDate: {
      type: Date,
      required: true,
      validate: {
        validator: function (v) {
          return v <= new Date();
        },
        message: (props) => `${props.value} is not a valid start date!`,
      },
    },

    renewalDate: {
      type: Date,
      validate: {
        validator: function (v) {
          return v > this.startDate;
        },
        message: (props) => `${props.value} must be after the start date`,
      },
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);

subscriptionSchema.pre("save", function (next) {
  if (!this.renewalDate) {
    const renewalPeriods = {
      daily: 1,
      weekly: 7,
      monthly: 30,
      yearly: 365,
    };

    this.renewalDate = new Date(this.startDate);
    this.renewalDate.setDate(
      this.renewalDate.getDate() + renewalPeriods[this.frequency]
    );
  }

  // auto update the status if renewal date has passed
  if (this.renewalDate < new Date()) {
    this.status = "expired";
  }

  next();
});
const Subscription = mongoose.model("Subscription", subscriptionSchema);

export default Subscription;
