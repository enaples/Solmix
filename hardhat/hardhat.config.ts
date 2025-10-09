import { HardhatUserConfig, task } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import path from "path";
import fs from "fs";
import {parse} from "solidity-antlr4";

task("ast", "Prints the AST of a Solidity file")
    .addParam("file", "The Solidity file to parse")
    .setAction(async (taskArgs, hre) => {
        const filePath = path.resolve(hre.config.paths.sources, taskArgs.file);
        if (!fs.existsSync(filePath)) {
            console.error(`File ${filePath} does not exist`);
            return;
        }
        const source = fs.readFileSync(filePath, "utf8");
        try {
            const ast = parse(source);
            console.log(JSON.stringify(ast, null, 2));
        } catch (e) {
            console.error(`Error parsing file ${filePath}:`, e);
        }
    });


const config: HardhatUserConfig = {
    solidity: {
        version: "0.8.27",
        settings: {
            optimizer: {
                enabled: true,
                runs: 200,
            },
            evmVersion: "prague",
            outputSelection: {
                "*": {
                    "*": ["abi", "evm.bytecode", "evm.deployedBytecode", "ast"],
                },
            },
        },
    },
    paths: {
        sources: "./contracts",
        tests: "./test",
        cache: "./cache",
        artifacts: "./artifacts",
    },
};

export default config;
