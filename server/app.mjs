import express from "express";
import connectionPool from "./utils/db.mjs";

const app = express();
const port = 4001;
app.use(express.json());

app.get("/users", async (req, res) => {
  try {
    //ดึงข้อมูลจาก db
    const { rows } = await connectionPool.query("SELECT * FROM users");

    //db to sever with json
    res.status(200).json(rows);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Server could not read assignment because database connection",
    });
  }
});

app.get("/assignments", async (req, res) => {
  try {
    //ดึงข้อมูลจาก db
    const { rows } = await connectionPool.query("SELECT * FROM assignments");

    //db to sever with json
    res.status(200).json({ data: rows });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Server could not read assignment because database connection",
    });
  }
});

app.get("/assignments/:assignmentId", async (req, res) => {
  const { assignmentId } = req.params;
  try {
    //ดึงข้อมูลจาก db
    const { rows } = await connectionPool.query(
      "SELECT * FROM assignments WHERE assignment_id = $1",
      [assignmentId]
    );

    //db to sever with json
    if (rows.length === 0) {
      return res
        .status(404)
        .json({ message: "Server could not find a requested assignment" });
    }
    res.status(200).json({ data: rows });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Server could not read assignment because database connection",
    });
  }
});

app.put("/assignments/:assignmentId", async (req, res) => {
  const { assignmentId } = req.params; // ดึง ID จาก url
  const { title, content, category } = req.body; //ดึงข้อมูลที่จะ update (body)
  try {
    //ดึงข้อมูลจาก db
    const { rowCount } = await connectionPool.query(
      "SELECT * FROM assignments WHERE assignment_id = $1",
      [assignmentId]
    );

    if (rowCount === 0) {
      return res
        .status(404)
        .json({ message: "Server could not find a requested assignment" });
    }

    await connectionPool.query(
      "UPDATE assignments SET title = $1, content= $2, category = $3 WHERE assignment_id = $4",
      [title, content, category, assignmentId]
    );

    res.status(200).json({ message: "Updated assignment sucessfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Server could not read assignment because database connection",
    });
  }
});

app.delete("/assignments/:assignmentId", async (req, res) => {
  const { assignmentId } = req.params;
  try {
    const { rowCount } = await connectionPool.query(
      "DELETE FROM assignments WHERE assignment_id = $1",
      [assignmentId]
    );

    if (rowCount === 0) {
      return res.status(404).json({
        message: "Server could not find a requested assignment to delete",
      });
    }

    res.status(200).json({ message: "Deleted assignment sucessfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Server could not delete assignment because database connection",
    });
  }
});

app.listen(port, () => {
  console.log(`Server is running at ${port}`);
});
