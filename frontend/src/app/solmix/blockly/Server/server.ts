import express, { Request, Response } from "express";
import cors from "cors";
import { parse } from "solidity-antlr4";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

interface ParseRequestBody {
  solidityCode: string;
}

app.post("/parse-solidity", (req: Request<{}, {}, ParseRequestBody>, res: Response) => {
  console.log("Richiesta ricevuta:", req.body);

  const { solidityCode } = req.body;

  if (typeof solidityCode !== "string" || solidityCode.trim() === "") {
    return res.status(400).json({ error: "Codice Solidity mancante" });
  }

  try {
    const ast = parse(solidityCode);
    res.json(ast);
  } catch (error) {
    console.error("Errore nel parsing Solidity:", error);
    res.status(400).json({ error: "Errore nel parsing Solidity" });
  }
});

const PORT = 4000;
app.listen(PORT, () => {
    //console.log("👋 Il server sta per avviarsi...");

  console.log(`✅ Server in ascolto su http://localhost:${PORT}`);
});
