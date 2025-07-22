import { parse } from "solidity-antlr4";
import { Request, Response } from "express";

/*
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

*/



export const parseSolidity = async (req: Request, res: Response) => {
  
  try {
    const { solidityCode } = req.body;

    // Validate input
    if (!solidityCode) {
      res.status(400).json({
        success: false,
        error: 'Missing required field: solidityCode'
      });
      return;
    }

    if (typeof solidityCode !== 'string') {
      res.status(400).json({
        success: false,
        error: 'solidityCode must be a string'
      });
      return;
    }

    if (solidityCode.trim().length === 0) {
      res.status(400).json({
        success: false,
        error: 'solidityCode cannot be empty'
      });
      return;
    }

    /*
    Interface ParseRequestBody {
  solidityCode: string;
}

app.post("/parse-solidity", (req: Request<{}, {}, ParseRequestBody>, res: Response) => {
  console.log("Richiesta ricevuta:", req.body);

  const { solidityCode } = req.body;

  if (typeof solidityCode !== "string" || solidityCode.trim() === "") {
    return res.status(400).json({ error: "Codice Solidity mancante" });
  }*/

  try {
    const ast = parse(solidityCode);
    res.json(ast);
  } catch (error) {
    console.error("Errore nel parsing Solidity:", error);
    res.status(400).json({ error: "Errore nel parsing Solidity" });
  }
//});
    

    /*
    // Basic Solidity syntax validation
    const trimmedCode = solidityCode.trim();
    if (!trimmedCode.includes('pragma solidity') && !trimmedCode.includes('contract') && !trimmedCode.includes('library') && !trimmedCode.includes('interface')) {
      res.status(400).json({
        success: false,
        error: 'Invalid Solidity code: must contain pragma, contract, library, or interface declaration'
      });
      return;
    }

    // Parse the Solidity code with additional error context
    console.log('Parsing Solidity contract...');
    console.log('Code preview:', solidityCode.substring(0, 100) + (solidityCode.length > 100 ? '...' : ''));
    
    let ast;
    try {
      ast = parse(solidityCode);
    } catch (parseError) {
      console.error('ANTLR4 parsing error:', parseError);
      
      // Provide more specific error messages
      let errorMessage = 'Solidity parsing failed';
      if (parseError instanceof Error) {
        if (parseError.message.includes('Missing parameter name')) {
          errorMessage = 'Syntax error: Missing parameter name in function definition. Ensure all function parameters have names.';
        } else if (parseError.message.includes('mismatched input')) {
          errorMessage = 'Syntax error: Invalid Solidity syntax detected. Please check your contract code.';
        } else {
          errorMessage = `Parsing error: ${parseError.message}`;
        }
      }
      
      res.status(400).json({
        success: false,
        error: errorMessage
      });
      return;
    }

    // Return the AST
    res.json({
      success: true,
      ast,
      message: 'Solidity contract parsed successfully'
    });
    */

  } catch (error) {
    console.error('Unexpected error parsing Solidity contract:', error);
    
    // Handle unexpected errors
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown parsing error occurred'
    });
    
  }
}