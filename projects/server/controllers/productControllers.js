const db = require("../models");
const { sequelize } = require("../models");
const product = db.Products;
const stocks = db.Stocks;
const stockmovement = db.StockMovement;
const stockhistory = db.StockHistory;
const transactionItem = db.TransactionItem;
const transaction = db.Transaction;
const warehouse = db.Warehouse;
const user = db.User;

module.exports = {
  getAllProduct: async (req, res) => {
    let page = parseInt(req.query.page);
    const search = req.query.search || "";
    const order = req.query.order;
    const sort = req.query.sort;
    const category = req.query.category || 1;
    const limit = 9;
    const where = {
      product_name: {
        [db.Sequelize.Op.like]: `%${search}%`,
      },
      id_category: category,
    };

    const SORT = [[order, sort]];
    console.log(SORT);

    if (search) page = 0;

    let result;
    const { count: allCount, rows: allSort } = await product.findAndCountAll({
      where,
    });

    const totalPage = Math.ceil(allCount / limit);

    if (page > totalPage - 1) {
      page = 0;
    }

    const { count: updatedCount, rows: updatedRows } =
      await product.findAndCountAll({
        where,
        order: SORT,
        limit: limit,
        offset: page * limit,
      });

    console.log(page);
    result = { data: updatedRows, totalProduct: updatedCount, totalPage };
    res.send({ message: "success", ...result });
  },

  getOneProduct: async (req, res) => {
    try {
      const { idP } = req.body;

      const productById = await product.findOne({
        where: {
          id: idP,
        },
        include: [stocks],
      });

      const stock = productById.Stocks.reduce((acc, curr) => {
        return acc + curr.stock;
      }, 0);

      res.status(200).send({
        message: "success",
        productById,
        stock,
      });
    } catch (error) {
      res.status(400).send(error);
    }
  },
  manualMutation: async (req, res) => {
    try {
      const { id, warehouse_sender_id, warehouse_receive_id, qty, status } =
        req.body;
      const getStockMovement = await stocks.findOne({
        where: {
          id_warehouse: warehouse_sender_id,
          id_product: id,
        },
      });
      if (getStockMovement.dataValues.stock < 1) {
        throw new Error("stock is unavailable!");
      }

      if (getStockMovement.dataValues.stock < qty) {
        throw new Error({
          message: "stock is too man!",
          title: "Error!",
          icon: "error",
        });
      }

      const currentTime = new Date();
      let request_number = currentTime.getTime();
      request_number = request_number.toString();
      request_number = request_number.substring(0, 5);
      request_number = parseInt(request_number);

      const result = await stockmovement.create({
        id_product: parseInt(id),
        warehouse_sender_id,
        warehouse_receive_id,
        quantity: qty,
        status,
        request_number,
      });

      res.status(200).send({
        result,
      });
    } catch (error) {
      console.log(error);

      res.status(400).send({
        message: error.message,
      });
    }
  },
  getAllMutation: async (req, res) => {
    try {
      let { sort, role, idUser } = req.query;
      let dataUser = [];
      let idWarehouse = null;
      console.log(req.query);
      if (role == "adminWarehouse") {
        dataUser = await user.findOne({
          where: {
            role,
            id: idUser,
          },
          include: [stocks],
        });

        idWarehouse = dataUser.Stocks[0].id_warehouse;
      }

      if (idWarehouse) sort = idWarehouse;

      const result = await stockmovement.findAll({
        order: [["createdAt", "DESC"]],
        include: [
          {
            model: warehouse,
            as: "senderWarehouse",
            where: {
              id: parseInt(sort),
            },
          },
          {
            model: warehouse,
            as: "receiverWarehouse",
          },
          product,
        ],
      });

      res.status(200).send({
        result,
        idWarehouse,
      });
    } catch (error) {
      console.log(error);
    }
  },
};
