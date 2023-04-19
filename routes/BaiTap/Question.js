const express = require("express");
const router = express.Router();
const {
  Category,
  Product,
  Customer,
  Employee,
  Order,
  Supplier,
} = require("../../models");

// QUESTIONS 1a http://localhost:9000/Question/1a?discount=10
// Hiển thị tất cả các mặt hàng có giảm giá <= 10%

router.get("/1a", async (req, res, next) => {
  try {
    const params = req.query.discount;
    // const { discount } = req.query; //đây là cách 2(destructủring), nếu dùng cách 2 thì thay { $lte: params } bằng { $lte: discount }
    const query = { discount: { $lte: params } }; //discount ở đây là thuộc tính của Product
    Product.find(query)
      .then((result) => {
        res.send(result);
      })
      .catch((err) => {
        res.status(400).send({ message: err.message });
      });
  } catch {
    (err) => {
      res.status(500).send({ message: err.message });
    };
  }
});

//QUESTION 1b http://localhost:9000/Question/1b?discount=10
//Hiển thị tất cả các mặt hàng có giảm giá <= 10%, và chi tiết danh mục, nhà cung cấp

router.get("/1b", (req, res, next) => {
  try {
    const { discount } = req.query;
    const query = { discount: { $lte: discount } };
    Product.find(query)
      .populate("category")
      .populate("supplier")
      .then((result) => {
        res.send({ total: result.length, payload: result });
      })
      .catch((err) => {
        res.sendStatus(400).send({ message: err.message });
      });
  } catch {
    (err) => {
      res.sendStatus(500).send({ message: err.message });
    };
  }
});

//QUESTION 2a: http://localhost:9000/Question/2a?stock=100
//Hiển thị tất cả các mặt hàng có tồn kho <= 100

router.get("/2a", async (req, res, next) => {
  try {
    const { stock } = req.query;
    const query = { stock: { $lte: stock } };
    Product.find(query)
      .then((result) => {
        res.send({ total: result.length, payload: result });
      })
      .catch((err) => {
        res.status(400).send({ message: err.message });
      });
  } catch {
    (err) => {
      res.status(500).send({ message: err.message });
    };
  }
});

//QUESTION 2b: http://localhost:9000/Question/2b?stock=100
//Hiển thị tất cả các mặt hàng có tồn kho <= 100

router.get("/2b", async (req, res, next) => {
  try {
    const params = req.query.stock;
    let query = { stock: { $lte: params } };
    Product.find(query)
      .lean({ virtuals: true })
      .populate("category")
      .populate("supplier")
      .then((result) => {
        res.send({
          payload: result,
          total: result.lenth,
        });
      })
      .catch((err) => {
        res.status(400).send({ message: err.message });
      });
  } catch {
    (err) => {
      res.status(500).send({ message: err.message });
    };
  }
});

//QUESTION 3: Hiển thị tất cả các mặt hàng có Giá bán sau khi đã tính giảm giá <= 100
//http://localhost:9000/Question/3?price=100

//$subtract(-)
//$multiply(*)
//$divide(/)

/////////////
router.get("/3", async (req, res, nexr) => {
  try {
    const params = req.query.price;
    //(100-10)*price/100
    const s = { $subtract: [100, "$discount"] };
    const m = { $multiply: ["$price", s] };
    const d = { $divide: [m, 100] };
    const query = { $expr: { $lte: [d, parseFloat(params)] } };
    Product.find(query).then((result) => {
      try {
        res.send({ total: result.length, payload: result });
      } catch {
        (err) => {
          res.status(400);
        };
      }
    });
  } catch {
    (err) => {
      res.status(500);
    };
  }
});

//Question 4: Hiển thị tất cả các khách hàng có địa chỉ ở Quận Hải Châu
//http://localhost:9000/Question/4?address=UK

// router.get("/4", async (req, res, next) => {
//   try {
//     const { address } = req.query;
//     let query = { Address: new RegExp(`${address}`) };
//     Customer.find(query)
//       .then((result) => {
//         res.send({
//           total: result.length,
//           payload: result,
//         });
//       })
//       .catch((err) => {
//         res.status(400).send({ message: err.message });
//       });
//   } catch {
//     (err) => {
//       res.sendStatus(500);
//     };
//   }
// });

//Question 5: http://localhost:9000/Question/5?year=1990
//Hiển thị tất cả các khách hàng có năm sinh 1990
//tham khao: // https://www.mongodb.com/docs/v6.0/reference/operator/aggregation/year/

// router.get("/5", async (req, res, next) => {
//   try {
//     const { year } = req.query;
//     let query = { $expr: { $eq: [{ $year: "$Birthday" }, year] } }; // muốn lấy năm ra sử dụng thì phải phải dùng $year
//     Customer.find(query)
//       .then((result) => {
//         res.send({
//           total: result.length,
//           payload: result,
//         });
//       })
//       .catch((err) => {
//         res.status(400).send({ message: err.message });
//       });
//   } catch {
//     (err) => {
//       res.sendStatus(500);
//     };
//   }
// });

//Question 6: Hiển thị tất cả các khách hàng có sinh nhật là hôm nay
//localhost:9000/Question/6?date=6&month=4

// http: router.get("/6", async (req, res, next) => {
//   try {
//     const { date } = req.query;
//     const { month } = req.query;
//     const eqday = {
//       $eq: [{ $dayOfMonth: "$Birthday" }, date],
//     };
//     const eqMonth = { $eq: [{ $month: "$Birthday" }, month] };
//     const query = { $expr: { $and: [eqday, eqMonth] } };
//     Customer.find(query)
//       .then((result) => {
//         res.send({ total: result.length, payload: result });
//       })
//       .catch((err) => {
//         res.status(400);
//       });
//   } catch {
//     (err) => {
//       res.status(500);
//     };
//   }
// });

//Question 6: Hiển thị tất cả các khách hàng có sinh nhật là hôm nay
// http://localhost:9000/questions/6?date=1990-02-01

router.get("/6", async (req, res, next) => {
  try {
    const { date } = req.query;
    const today = new Date(date);
    const eqDay = {
      $eq: [{ $dayOfMonth: "$Birthday" }, { $dayOfMonth: today }],
    };
    const eqMonth = { $eq: [{ $month: "$Birthday" }, { $month: today }] };
    const query = { $expr: { $and: [eqDay, eqMonth] } };

    Customer.find(query)
      .then((result) => {
        res.send({
          total: result.length,
          payload: result,
        });
      })
      .catch((err) => {
        res.status(400).send({ message: err.message });
      });
  } catch {
    (err) => {
      res.sendStatus(500);
    };
  }
});
//Question 7: Hiển thị tất cả các đơn hàng có trạng thái là COMPLETED
//http://localhost:9000/Question/7?status=WAITING

//Cách 1:
// router.get("/7", async (req, res, next) => {
//   try {
//     const { status } = req.query;
//     let query = { status: new RegExp(`${status}`) };
//     Order.find(query)
//       .then((result) => {
//         res.send({
//           total: result.length,
//           payload: result,
//         });
//       })
//       .catch((err) => {
//         res.status(400).send({ message: err.message });
//       });
//   } catch {
//     () => {
//       res.sendStatus(500);
//     };
//   }
// });

//Cách 2:

// router.get("/7", async (req, res, next) => {
//   try {
//     const { status } = req.query;
//     const query = { status: status };
//     Order.find(query)
//       .populate({ path: "customer", select: "FirstName LastName" })
//       .populate("employeeSell")
//       .populate("orderDetails.product")
//       .then((result) => {
//         res.send({ total: result.length, payload: result });
//       })
//       .catch((err) => {
//         res.status(400).json({ message: err.message });
//       });
//   } catch {
//     (err) => {
//       res.status(500);
//     };
//   }
// });

//question 8a: Hiển thị tất cả các đơn hàng có trạng thái là COMPLETED trong ngày hôm nay
//http://localhost:9000/Question/8a?status=COMPLETED&date=2023-04-06

router.get("/8a", async (req, res, next) => {
  try {
    const { status } = req.query;
    const { date } = req.query;
    const fromDate = new Date(date);
    fromDate.setHours(0, 0, 0, 0);
    const finishDate = new Date(new Date().setDate(fromDate.getDate() + 1));
    finishDate.setHours(0, 0, 0, 0);
    const eqStatus = { $eq: ["$status", status] };
    const eqfromDate = { $gte: ["$createdDate", fromDate] };
    const eqFinisthDate = { $lte: ["$createdDate", finishDate] };
    const query = { $expr: { $and: [eqfromDate, eqFinisthDate, eqStatus] } };
    Order.find(query)
      .then((result) => {
        res.send({ total: result.length, payload: result });
      })
      .catch((err) => {
        res.status(400).send({ message: err.message });
      });
  } catch {
    (err) => {
      res.status(500);
    };
  }
});

//Question 8b:Hiển thị tất cả các đơn hàng có trạng thái là <status> có ngày tạo trong khoảng <fromDate> và <toDate>
//http://localhost:9000/Question/8a?status=COMPLETED&fromDate=2023-03-06&toDate=2023-04-06

router.get("/8b", (req, res, next) => {
  try {
    let { fromDate, toDate, status } = req.query; // tại sao let được mà cónst ko đc???
    fromDate = new Date(fromDate);
    fromDate.setHours(0, 0, 0, 0);
    const tmpToDate = new Date(toDate);
    toDate = new Date(tmpToDate.setDate(tmpToDate.getDate() + 1)); // là do đây lấy biến đó gán cho 1 giá trị khác:))
    toDate.setHours(0, 0, 0, 0);

    const eqStatus = { $eq: ["$status", status] };
    const eqFromDate = { $gte: ["$createdDate", fromDate] };
    const eqToDate = { $lt: ["$createdDate", toDate] };
    const query = { $expr: { $and: [eqStatus, eqFromDate, eqToDate] } };

    Order.find(query)
      .then((result) => {
        res.send({ total: res.length, payload: result });
      })
      .catch((err) => {
        res.status(400).send({ message: err.message });
      });
  } catch {
    (err) => {
      res.srtatus(500);
    };
  }
});

// Cả 2 bài giải dưới đây còn bị lỗi
// router.get("/8b", (req, res, next) => {
//   try {
//     const { status, from, to } = req.query;
//     const fromDate = new Date(from);
//     fromDate.setHours(0, 0, 0, 0);
//     const getToDate = new Date(to);
//     const toDate = new Date(new Date().setDate(getToDate.getDate() + 1));
//     const eqfromDate = {
//       $gte: ["$createdDate", fromDate],
//     };
//     const eqToDate = { $lte: ["$createdDate", toDate] };
//     const eqStatus = { $eq: ["$status", status] };
//     const query = { $expr: { $and: [eqfromDate, eqToDate, eqStatus] } };
//     Order.find(query)
//       .then((result) => {
//         res.send({ total: result.length, payload: result });
//       })
//       .catch((err) => {
//         res.status(400).send({ message: err.message });
//       });
//   } catch {
//     (err) => {
//       res.status(500);
//     };
//   }
// });

// router.get("/8b", function (req, res, next) {
//   try {
//     let { status, fromDate, toDate } = req.query;

//     fromDate = new Date(fromDate);

//     const tmpToDate = new Date(toDate);
//     toDate = new Date(tmpToDate.setDate(tmpToDate.getDate() + 1));

//     const compareStatus = { $eq: ["$status", status] };
//     const compareFromDate = { $gte: ["$createdDate", fromDate] };
//     const compareToDate = { $lt: ["$createdDate", toDate] };

//     const query = {
//       $expr: { $and: [compareStatus, compareFromDate, compareToDate] },
//     };

//     Order.find(query)
//       .populate("orderDetails.product")
//       .populate("customer")
//       .populate("employee")
//       .then((result) => {
//         res.send(result);
//       })
//       .catch((err) => {
//         res.status(400).send({ message: err.message });
//       });
//   } catch (err) {
//     console.log(err);
//     res.sendStatus(500);
//   }
// });

//Question 9:Hiển thị tất cả các đơn hàng có trạng thái là CANCELED

router.get("/9", (req, res, next) => {
  try {
    const { status } = req.query;
    const query = { $expr: { $eq: ["$status", status] } };
    Order.find(query)
      .then((result) => {
        res.send({
          total: result.length,
          payload: result,
        });
      })
      .catch((err) => {
        res.status(400).send({ message: err.message });
      });
  } catch {
    (err) => {
      res.status(500);
    };
  }
});

//Question 10: Hiển thị tất cả các đơn hàng có trạng thái là CANCELED trong ngày hôm nay
router.get("/10", (req, res, next) => {
  try {
    let { status, date } = req.query;
    const fromDate = new Date(date);
    console.log(fromDate);
    fromDate.setHours(0, 0, 0, 0);
    const toDate = new Date(new Date().setDate(fromDate.getDate() + 1));
    toDate.setHours(0, 0, 0, 0);
    console.log(toDate);
    const compareFromDate = { $gte: ["$createdDate", fromDate] };
    const compareToDate = { $lt: ["$createdDate", toDate] };
    const compareStatus = { $eq: ["$status", status] };
    const query = {
      $expr: { $and: [compareFromDate, compareToDate, compareStatus] },
    };
    Order.find(query)
      .then((result) => {
        res.send({ total: result.length, payload: result });
      })
      .catch((err) => {
        res.status(400).send({ message: err.message });
      });
  } catch {
    (err) => {
      res.status(500);
    };
  }
});

//Question 11: Hiển thị tất cả các đơn hàng có hình thức thanh toán là CASH

router.get("/11", (req, res, next) => {
  try {
    const { paymentType } = req.query;
    const query = { $expr: { $eq: ["$paymentType", paymentType] } };
    Order.find(query)
      .populate({
        path: "orderDetails.product",
        select: "name",
      })
      .populate({ path: "employeeSell", select: { firstName: 1, lastName: 1 } })
      .then((result) => {
        res.send({
          total: result.length,
          payload: result,
        });
      })
      .catch((err) => {
        res.status(400).send({ message: err.message });
      });
  } catch {
    (err) => {
      res.status(500);
    };
  }
});

//Question 12: Hiển thị tất cả các đơn hàng có hình thức thanh toán là CREADIT CARD
router.get("/12", (req, res, next) => {
  try {
    const { paymentType } = req.query;
    const query = { $expr: { $eq: ["$paymentType", paymentType] } };
    Order.find(query)
      .populate({ path: "orderDetails.product", select: "name" })
      .populate({ path: "employeeSell", select: "firstName, lastName" })
      .then((result) => {
        res.send({
          total: result.length,
          payload: result,
        });
      })
      .catch((err) => {
        res.status(400);
      });
  } catch {
    (err) => {
      res.status(500);
    };
  }
});

//Question 13: Hiển thị tất cả các đơn hàng có địa chỉ giao hàng là Hà Nội
router.get("/13", function (req, res, next) {
  try {
    let { address } = req.query;

    Order.aggregate()
      .lookup({
        from: "customers", // colection to join
        localField: "customerId",
        foreignField: "_id",
        as: "customer",
      })
      .unwind("customer")
      .match({
        "customer.Address": new RegExp(`${address}`),
      })
      .project({
        customerId: 0,
      })
      .then((result) => {
        res.send(result);
      })
      .catch((err) => {
        res.status(400).send({ message: err.message });
      });
  } catch (err) {
    res.sendStatus(500);
  }
});

//Question 14: Hiển thị tất cả các nhân viên có sinh nhật là hôm nay

router.get("/14", async (req, res, next) => {
  try {
    const { date } = req.query;
    const today = new Date(date);
    const eqDay = {
      $eq: [{ $dayOfMonth: "$birthDay" }, { $dayOfMonth: today }],
    };
    const eqMonth = { $eq: [{ $month: "$birthDay" }, { $month: today }] };
    const query = { $expr: { $and: [eqDay, eqMonth] } };

    Employee.find(query)
      .then((result) => {
        res.send({
          total: result.length,
          payload: result,
        });
      })
      .catch((err) => {
        res.status(400).send({ message: err.message });
      });
  } catch {
    (err) => {
      res.sendStatus(500);
    };
  }
});

//Question 15: Hiển thị tất cả các nhà cung cấp có tên là: (SONY, SAMSUNG, TOSHIBA, APPLE)

router.get("/15", (req, res, next) => {
  try {
    const { supplierName } = req.query;
    const query = { $expr: { $in: ["$name", supplierName] } };
    Supplier.find(query)
      .then((result) => {
        res.send({ total: result.length, payload: result });
      })
      .catch((err) => {
        res.status(400).send({ message: err.message });
      });
  } catch {
    (err) => {
      res.status(500);
    };
  }
});

//Question 16: Hiển thị tất cả các đơn hàng cùng với thông tin chi tiết khách hàng (Customer)

router.get("/16", (req, res, next) => {
  try {
    Order.find()
      .populate("order")
      .then((result) => {
        res.send({
          total: result.length,
          payload: result,
        });
      })
      .catch((err) => {
        res.status(400).send({ message: err.message });
      });
  } catch {
    (err) => {
      res.status(500).send({ message: err.message });
    };
  }
});

//////////Bai 17:Hiển thị tất cả các mặt hàng cùng với thông tin chi tiết của Category và Supplier
//http://localhost:9000/Question/17

router.get("/17", (req, res, next) => {
  try {
    Product.find()
      .populate("category")
      .populate("supplier")
      .then((result) => {
        res.send({
          total: result.length,
          payload: result,
        });
      })
      .catch(res.status(400).send({ message: err.send }));
  } catch {
    (err) => {
      res.statusCode(500);
    };
  }
});

//Question 18: Hiển thị tất cả danh mục (Categories) với số lượng hàng hóa trong mỗi danh mục

router.get("/18", async (req, res, next) => {
  try {
    const response = await Category.aggregate()
      .lookup({
        from: "products",
        localField: "_id",
        foreignField: "categoryId",
        as: "stock_product",
      })
      .unwind("stock_product") // biến mảng lookup tu colection khác thành object
      .group({
        // nhóm các thành phần muốn hiển thị
        _id: "$_id",
        name: { $first: "$name" }, //hiển thị tên category
        description: { $first: "$description" }, // description của category đó
        totalProduct: {
          $sum: "$stock_product.stock",
        },
      })
      .sort({
        totalProduct: -1,
        name: 1,
      });

    if (!response) {
      return res.status(400).send({ message: "Not found" });
    }
    res.send(response);
  } catch {}
});

//Question 19: Hiển thị tất cả nhà cung cấp (Suppliers) với số lượng hàng hóa mỗi nhà cung cấp

router.get("/19", async (req, res, next) => {
  try {
    let response = await Supplier.aggregate()
      .lookup({
        from: "products",
        localField: "_id",
        foreignField: "supplierId",
        as: "product",
      })
      .unwind("product")
      .group({
        _id: "$_id",
        name: { $first: "$name" },
        address: { $first: "$address" },
        totalProduct: {
          $sum: "$product.stock",
        },
      });
    if (!response) {
      return res.status(400);
    }
    res.send({ total: response.length, payload: response });
  } catch {
    () => {
      res.status(500);
    };
  }
});

//Question 20: Hiển thị tất cả các mặt hàng được bán trong khoảng từ ngày, đến ngày
router.get("/20", async (req, res, next) => {
  try {
    let { from, to } = req.query;
    let fromDate = new Date(from);
    const tmpToDate = new Date(to);

    let toDate = new Date(tmpToDate.setDate(tmpToDate.getDate()));

    const eqfrom = { $gte: ["$createdDate", fromDate] };
    const eqto = { $lt: ["$createdDate", toDate] };
    const query = { $expr: { $and: [eqfrom, eqto] } };
    console.log(fromDate);
    console.log(toDate);
    let response = await Order.aggregate()
      .match(query)
      .lookup({
        from: "products",
        localField: "orderDetails.ProductId",
        foreignField: "_id",
        as: "product_list",
      })
      .unwind("product_list")
      .group({
        _id: "$_id",
        name: { $first: "$product_list.name" },
        createDay: { $first: "$createdDate" },
      })
      .project({
        _id: 0,
      });
    if (!response) {
      return res.status(400);
    }

    res.send({ payload: response });
  } catch {}
});

//Question 21: Hiển thị tất cả các khách hàng mua hàng trong khoảng từ ngày, đến ngày

router.get("/21", async (req, res, next) => {
  try {
    let { from, to } = req.query;
    let fromDate = new Date(from);
    let tmpToDate = new Date(to);
    let toDate = new Date(tmpToDate.setDate(tmpToDate.getDate()));
    console.log(fromDate);
    console.log(toDate);
    const compareFromDate = { $gte: ["$createdDate", fromDate] };
    const compareToDate = { $lt: ["$createDate", toDate] };
    const query = { $expr: { $and: [compareFromDate, compareToDate] } };
    let response = await Order.aggregate()
      .match(query)
      .lookup({
        from: "customers",
        localField: "customerId",
        foreignField: "_id",
        as: "customer_in4",
      })
      .unwind("customer_in4")
      .group({
        _id: "$_id",
        FirstName: { $first: "$customer_in4.FirstName" },
        LastName: { $first: "$customer_in4.LastName" },
        Address: { $first: "$customer_in4.Address" },
      });
    if (!response) {
      return res.status(400);
    }
    res.send(response);
  } catch {
    (err) => {
      res.sendStatus(500);
    };
  }
});

//Question 22: Hiển thị tất cả các khách hàng mua hàng (với tổng số tiền) trong khoảng từ ngày, đến ngày

router.get("/22", async (req, res, next) => {
  try {
    let { from, to } = req.query;
    let fromDate = new Date(from);
    let tmpToDate = new Date(to);
    let toDate = new Date(tmpToDate.setDate(tmpToDate.getDate() + 1));
    const compareFromDate = { $gte: ["$createdDate", fromDate] };
    const compareToDate = { $lt: ["$createdDate", toDate] };
    let response = await Order.aggregate()
      .match({ $expr: { $and: [compareFromDate, compareToDate] } })
      .lookup({
        from: "customers",
        localField: "customerId",
        foreignField: "_id",
        as: "customers_in4",
      })
      .lookup({
        from: "products",
        localField: "orderDetails.ProductId",
        foreignField: "_id",
        as: "products_in4",
      })
      .unwind("customers_in4", "products_in4")
      .unwind("orderDetails")
      .addFields({
        originalPrice: {
          $divide: [
            {
              $multiply: [
                "$orderDetails.Price",
                { $subtract: [100, "$orderDetails.Discount"] },
              ],
            },
            100,
          ],
        },
      })
      .group({
        _id: "$_id",
        FirstName: { $first: "$customers_in4.FirstName" },
        LastName: { $first: "$customers_in4.LastName" },
        nameProduct: { $first: "$products_in4.name" },
        price: { $first: "$products_in4.price" },
        // originalPrice: { $first: "$originalPrice" },
        total: {
          $sum: { $multiply: ["$originalPrice", "$orderDetails.Quantity"] }, // tổng của tất cả các mật hàng mà một khách hàng đã mua
        },
      });

    if (!response) {
      return res.status(400);
    }
    res.send({ total: response.length, response });
  } catch {}
});

//Question 23: Hiển thị tất cả đơn hàng với tổng số tiền

router.get("/23", async (req, res, next) => {
  try {
    let response = await Order.aggregate()
      .lookup({
        from: "products",
        localField: "orderDetails.ProductId",
        foreignField: "_id",
        as: "product_in4",
      })
      .unwind("orderDetails")
      .unwind("product_in4")
      .addFields({
        originalPrice: {
          $divide: [
            {
              $multiply: [
                { $subtract: [100, "$product_in4.discount"] },
                "$product_in4.price",
              ],
            },
            100,
          ],
        },
      })
      .group({
        _id: "$_id",
        createDay: { $first: "$createdDate" },
        name: { $first: "$product_in4.name" },
        total: {
          $sum: { $multiply: ["$originalPrice", "$orderDetails.Quantity"] },
        },
      });
    if (!response) {
      return res.status(400);
    }
    res.send(response);
  } catch {}
});

//Question 24: Hiển thị tất cả các nhân viên bán hàng với tổng số tiền bán được

router.get("/24", async (req, res, next) => {
  try {
    let response = await Order.aggregate()
      .lookup({
        from: "employees",
        localField: "employeeId",
        foreignField: "_id",
        as: "employee_in4",
      })
      .unwind("orderDetails")
      .lookup({
        from: "products",
        localField: "orderDetails.ProductId",
        foreignField: "_id",
        as: "products_in4",
      })
      .unwind("employee_in4")
      .unwind("products_in4")
      .addFields({
        originalPrice: {
          $divide: [
            {
              $multiply: [
                { $subtract: [100, "$orderDetails.Discount"] },
                "$orderDetails.Price",
              ],
            },
            100,
          ],
        },
      })
      .group({
        _id: "$employee_in4._id",
        firstName: { $first: "$employee_in4.firstName" },
        lastName: { $first: "$employee_in4.lastName" },
        totalSell: {
          $sum: {
            $multiply: ["$originalPrice", "$orderDetails.Quantity"],
          },
        },
      });
    if (!response) {
      return res.status(400).send({ message: "Not found" });
    }
    res.send(response);
  } catch (err) {
    res.sendStatus(500);
  }
});

//
//Question 25:  Hiển thị tất cả các mặt hàng không bán được
//bài này ta query ngược, nghĩa là để lấy được các mặt hàng không bán được, ta xét đến mục product, nhưng mà mục product
//không có phần số lượng sản phẩm đã bán, nên chỉ có cách là ta lại query phần Order, trong mục orderDetail có quantity(số lượng)
//rồi ta xử lý nó

router.get("/25", async (req, res, next) => {
  try {
    const option = [
      {
        //$lookup dùng để tìm kiếm, nó trả về array
        $lookup: {
          from: "orders", // lấy từ colections nào trong mongoDB
          localField: "_id", //lấy _id từ mục order
          foreignField: "orderDetails.ProductId", //lấy cái productId cần xét lấy từ mục order
          as: "orders", //kết quả trả ra thì ta lưu nó vào biến tên là order
        },
      },
      {
        //$match dùng để tìm kiếm điều kiện
        $match: {
          orders: { $size: 0 }, // tìm kiếm cái orders nào đó rỗng(orders là cái được tạo ra từ field as trong lookup)
        },
      },
      {
        //$ trong agregate thì ta dùng $project để lọc dữ liệu ra
        $project: {
          id: 1,
          name: 1,
          price: 1,
          stock: 1,
          categoryId: 1,
        },
      },
    ];

    Product.aggregate(option)
      .then((result) => {
        res.send({
          total: result.length,
          payload: result,
        });
      })
      .catch((err) => {
        res.status(400).send({ message: err.message });
      });
  } catch (error) {
    res.sendStatus(500);
  }
});
//với bài 25 này còn có một kiểu(phong cách) thao tác với agregate khác

router.get("/25b", async (req, res, next) => {
  try {
    Product.aggregate()
      .lookup({
        from: "orders",
        localField: "_id",
        foreignField: "orderDetails.ProductId",
        as: "orders",
      })
      .match({
        orders: { $size: 0 },
      })
      .project({
        id: 1,
        name: 1,
        price: 1,
        stock: 1,
      })
      .then((result) => {
        res.send({
          payload: result,
          total: result.length,
        });
      })
      .catch((err) => {
        res.status(400).send({ message: err.message });
      });
  } catch (error) {
    res.sendStatus(500);
  }
});
// với cách viết này thì nó sẽ ngắn gọn hơn cách trên

//Question 26: Hiển thị tất cả các nhà cung cấp không bán được (nâng cao: trong khoảng từ ngày, đến ngày)

router.get("/26a", async (req, res, next) => {
  try {
    Product.aggregate()
      .lookup({
        from: "orders",
        localField: "_id",
        foreignField: "orderDetails.productId",
        as: "orders",
      })
      .match({ orders: { $size: 0 } })
      .lookup({
        from: "suppliers",
        localField: "supplierId",
        foreignField: "_id",
        as: "suppliers",
      })
      .project({
        _id: 0,
        suppliers: 1,
      })
      .unwind({
        // làm phẳng mảng, biến phần tử array thành object
        path: "$suppliers",
        preserveNullAndEmptyArrays: true, // phần tử nếu bằng null thì vẫn convert sang object
      })
      .project({
        _id: "$suppliers._id",
        name: "$suppliers.name",
        email: "$suppliers.email",
        phoneNumber: "$suppliers.phoneNumber",
        address: "$suppliers.address",
      })
      .group({
        _id: "$_id",
        name: { $first: "$name" },
        phoneNumber: { $first: "$phoneNumber" },
        email: { $first: "$email" },
        address: { $first: "$address" },
      })

      .then((result) => {
        res.send(result);
      })
      .catch((err) => {
        res.status(400).send({ message: err.message });
      });
  } catch (error) {
    res.sendStatus(500);
  }
});

module.exports = router; // sai

// question20: Hiển thị tất cả các mặt hàng được bán trong khoảng từ ngày, đến ngày

//middleware:

// const express = require('express')
// const app = express()

// const myLogger = function (req, res, next) {
//   console.log('LOGGED')
//   next()
// }

// app.use(myLogger)

// app.get('/', (req, res) => {
//   res.send('Hello World!')
// })

// app.listen(3000)

//Kết quả sẽ là xuất hiện Mylogger trên terminal cùng với Hello World
