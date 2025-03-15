// MVC 중 M(Model) 부분
// 데이터를 저장하고 읽고 쓰기에 관한 부분을 담당.
import { sequelize } from "../db/database.js";
import SQ from "sequelize";
import { User } from "./auth.js";
const DataTypes = SQ.DataTypes;
const Sequelize = SQ.Sequelize;

// Create a Tweet model using Sequelize
const Tweet = sequelize.define("tweet", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  text: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
});
Tweet.belongsTo(User);

const INCLUDE_USER = {
  attributes: [
    "id",
    "text",
    "createdAt",
    "userId",
    // This flattens user information and includes it in the queried object.
    [Sequelize.col("user.name"), "name"],
    [Sequelize.col("user.username"), "username"],
    [Sequelize.col("user.url"), "url"],
  ],
  include: { model: User, attributes: [] },
};
const ORDER_DESC = { order: [["createdAt", "DESC"]] };

export async function getAll() {
  return Tweet.findAll({
    ...INCLUDE_USER,
    ...ORDER_DESC,
  });
}

export async function getAllByUsername(username) {
  return Tweet.findAll({
    ...INCLUDE_USER,
    ...ORDER_DESC,
    include: { ...INCLUDE_USER.include, where: { username } },
  });
}

export async function getById(id) {
  return Tweet.findOne({
    ...INCLUDE_USER,
    include: { ...INCLUDE_USER.include, where: { id } },
  });
}

export async function create(text, userId) {
  return Tweet.create({ text, userId }).then((data) =>
    this.getById(data.dataValues.id)
  );
}

export async function update(id, text) {
  return Tweet.findByPk(id, INCLUDE_USER).then((tweet) => {
    tweet.text = text;
    return tweet.save();
  });
}

export async function remove(id) {
  return Tweet.findByPk(id).then((tweet) => {
    tweet.destroy();
  });
}
