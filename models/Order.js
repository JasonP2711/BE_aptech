const mongoose = require("mongoose");
const { Schema, model } = mongoose;
const mongooseLeanVirtuals = require("mongoose-lean-virtuals");

const OrderDetailSchema = new Schema(
  {
    ProductId: { type: Schema.Types.ObjectId, required: true },
    Quantity: { type: Number, required: true, min: 0 },
    Price: { type: Number, required: true, min: 0, default: 0 },
    Discount: { type: Number, min: 0, default: 0 },
  },
  {
    versionKey: false,
  }
);

// Virtual with Populate
OrderDetailSchema.virtual("product", {
  ref: "Product",
  localField: "ProductId",
  foreignField: "_id",
  justOne: true,
});

// Virtuals in console.log()
OrderDetailSchema.set("toObject", { virtuals: true });
// Virtuals in JSON
OrderDetailSchema.set("toJSON", { virtuals: true });
const orderSchema = new Schema(
  {
    createdDate: {
      type: Date,
      required: true,
      default: Date.now,
    },

    shippedDate: {
      type: Date,
      validate: {
        validator: function (value) {
          if (!value) return true;

          if (value < this.createdDate) {
            return false;
          }

          return true;
        },
        message: `Shipped date: {VALUE} is invalid!`,
      },
    },

    paymentType: {
      type: String,
      required: true,
      default: "CASH",
      validate: {
        validator: (value) => {
          if (["CASH", "CREDIT CARD"].includes(value.toUpperCase())) {
            return true;
          }
          return false;
        },
        message: `Payment type: {VALUE} is invalid!`,
      },
    },

    status: {
      type: String,
      required: true,
      default: "WAITING",
      validate: {
        validator: (value) => {
          if (["WAITING", "COMPLETED", "CANCELED"].includes(value)) {
            return true;
          }
          return false;
        },
        message: `Status: {VALUE} is invalid!`,
      },
    },

    customerId: {
      type: Schema.Types.ObjectId,
      required: false,
    },
    employeeId: {
      type: Schema.Types.ObjectId,
      required: false,
    },

    // Array
    orderDetails: [OrderDetailSchema],
  },
  {
    versionKey: false,
  }
);

orderSchema.virtual("order", {
  ref: "Customer",
  localField: "customerId",
  foreignField: "_id",
  justOne: true,
});

orderSchema.virtual("employeeSell", {
  ref: "Employee",
  localField: "employeeId",
  foreignField: "_id",
  justOne: true,
});

orderSchema.virtual("customer", {
  ref: "Customer",
  localField: "customerId",
  foreignField: "_id",
  justOne: true,
});

// orderSchema.virtual("product", {
//   ref: "Products",
//   localField: "orderDetails.productId",
//   foreignField: "_id",
//   justOne: true,
// });

orderSchema.set("toJSON", { virtuals: true });
orderSchema.set("toObject", { virtuals: true });
orderSchema.plugin(mongooseLeanVirtuals);
const Order = model("Order", orderSchema);
module.exports = Order;
