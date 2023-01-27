import chalk from "chalk";
import dotenv from "dotenv";
import express from "express";
import http from "http";
import mongoose from "mongoose";

dotenv.config();

const statusEnum = ["Pending", "Working", "Completed", "Deleted"];

const todoSchema = new mongoose.Schema(
  {
    task: { type: String, index: true },
    status: { type: String, enum: statusEnum },
  },
  {
    timestamps: true,
  }
);

const Todo = mongoose.model("todos", todoSchema);

(async () => {
  mongoose.set("strictQuery", false);
  await mongoose.connect(process.env.MONGO_URL);

  const app = express();

  app.use(express.json())

  app.get("/todo", async (req, res) => {
    res.json(await Todo.find().exec());
  });

  app.post("/todo", async (req, res) => {
    const todo = new Todo({
      task: req.body.task,
      status: "Pending",
    });
    await todo.save();
    res.status(201).json({
      message: "Todo created.",
    });
  });

  app.put("/todo/:status/:id", async (req, res) => {
    const updatedDoc = await Todo.findByIdAndUpdate(
      req.params.id,
      { status: req.params.status },
      { new: true }
    ).exec();
    res.status(200).json({
      updated_data: updatedDoc,
    });
  });

  app.delete("/todo/:id", async (req, res) => {
    const updatedDoc = await Todo.findByIdAndRemove(req.params.id).exec();
    res.status(200).json({
      message: "Todo deleted.",
    });
  });

  const server = http.createServer(app);

  server.listen(process.env.PORT, () => {
    console.info(chalk.green(`App is listening at port ${process.env.PORT}`));
  });
})();
