import express from "express";
import path from "path";
import LogUtil from "./logutil";
import render from "./render";
import { getExperienceList } from "./api/experienceApi";
import { getSkillList } from "./api/skillApi";
import { getProjectList, getProjectInfo } from "./api/projectApi";
import { downloadHomePDF } from "./api/pdfApi";

LogUtil.init();

const app = express();
const PORT = process.env.PORT || 8080;

app.use(
    "/",
    express.static(path.join(__dirname, "../build"), {
        index: false,
    })
);
// app.use(express.static(path.join(__dirname, "../build")));

app.use(express.json());

// api
app.get("/api/experiences", getExperienceList);
app.get("/api/skills", getSkillList);
app.get("/api/projects", getProjectList);
app.get("/api/projects/:id", getProjectInfo);
app.post("/api/pdf/downloadHomePDF", downloadHomePDF);

// render
app.get("*", render);

// app.get("*", (req, res) => {
//     res.sendFile(path.join(__dirname, "../build/index.html"));
// });

app.listen(PORT, LogUtil.log(`App listening on port ${PORT}!`));
