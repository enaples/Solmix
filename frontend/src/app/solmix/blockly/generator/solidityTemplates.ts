import * as Blockly from "blockly";

export const solidityTemplateGenerator = new Blockly.Generator("SolidityTemplate");

// # Code generator for ERC20 template
solidityTemplateGenerator.forBlock["erc20"] = function (block, generator) {
    const name = block.getFieldValue("NAME");
    const mintable = block.getFieldValue("Mintable");
    const burnable = block.getFieldValue("Burnable");
    const pausable = block.getFieldValue("Pausable");
    const callback = block.getFieldValue("Callback");
    const permit = block.getFieldValue("Permit");
    const flash_Minting = block.getFieldValue("Flash_Minting");
    const imports = [];

    // Import base
    imports.push(
        'import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";'
    );

    // Condizionali
    if (mintable === "TYPE_YES") {
        imports.push(
            'import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";'
        );
    }

    if (burnable === "TYPE_YES") {
        imports.push(
            'import {ERC20Burnable} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";'
        );
    }

    if (permit === "TYPE_YES") {
        imports.push(
            'import {ERC20Permit} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";'
        );
    }

    if (pausable === "TYPE_YES") {
        if (mintable === "TYPE_NOT") {
            imports.push(
                'import {ERC20Pausable} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Pausable.sol";\n import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";'
            );
        } else {
            imports.push(
                'import {ERC20Pausable} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Pausable.sol";'
            );
        }
    }

    if (flash_Minting === "TYPE_YES") {
        imports.push(
            'import {ERC20FlashMint} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20FlashMint.sol";'
        );
    }

    if (callback === "TYPE_YES") {
        imports.push(
            'import {ERC1363} from "@openzeppelin/contracts/token/ERC20/extensions/ERC1363.sol";'
        );
    }

    var constructor = "";
    if (mintable === "TYPE_YES" || pausable === "TYPE_YES") {
        constructor =
            'constructor(address initialOwner)\n ERC20("MyToken", "MTK")\n ERC20Permit("MyToken")\n Ownable(initialOwner)\n  {}\n';
    } else {
        constructor =
            'constructor() ERC20("MyToken", "MTK") ERC20Permit("MyToken") {}';
    }

    const methods = [];
    if (mintable === "TYPE_YES") {
        methods.push(
            "function mint(address to, uint256 amount) public onlyOwner {\n _mint(to, amount);\n}\n\n"
        );
    }
    if (pausable === "TYPE_YES") {
        methods.push(
            "function pause() public onlyOwner{\n _pause();\n }\n\n function unpause() public onlyOwner {\n _unpause();\n }\n\n function _update(address from, address to, uint256 value)\n internal\n override(ERC20, ERC20Pausable)\n {\n super._update(from, to, value);\n}\n\n"
        );
    }

    const contract_is = [];
    contract_is.push("is ERC20, ERC20Permit");
    if (mintable === "TYPE_NOT") {
        contract_is.push("Ownable");
    }
    if (pausable === "TYPE_YES") {
        if (mintable === "TYPE_NOT") {
            contract_is.push("ERC20Pausable, Ownable");
        } else {
            contract_is.push("ERC20Pausable");
        }
    }
    if (burnable === "TYPE_YES") {
        contract_is.push("ERC20Burnable");
    }
    /*if (permit === 'TYPE_YES') {
    contract_is.push('ERC20Pausable');
  }*/
    if (flash_Minting === "TYPE_YES") {
        contract_is.push("ERC20FlashMint");
    }
    if (callback === "TYPE_YES") {
        contract_is.push("ERC1363");
    }

    // Generazione finale del codice
    const code = `pragma solidity ^0.8.27;\n\n${imports.join(
        "\n"
    )}\n\n contract ${name} ${contract_is.join(
        ", "
    )} {\n\n ${constructor}\n ${methods.join("\n")}\n}`;
    return code;
};

// # Code generator for Governor template
solidityTemplateGenerator.forBlock["Governor"] = function (block, generator) {
    const name = block.getFieldValue("NAME");
    const delay = block.getFieldValue("voting_delay");
    const voting_period = block.getFieldValue("voting_period");
    const quorum = block.getFieldValue("quorum");
    const methods = generator.statementToCode(block, "METHODS");
    const proposal_threshold = block.getFieldValue("proposal_threshold");

    const imports =
        'import {Governor} from "@openzeppelin/contracts/governance/Governor.sol";\n' +
        'import {GovernorCountingSimple} from "@openzeppelin/contracts/governance/extensions/GovernorCountingSimple.sol";\n' +
        'import {GovernorSettings} from "@openzeppelin/contracts/governance/extensions/GovernorSettings.sol";\n' +
        'import {GovernorTimelockControl} from "@openzeppelin/contracts/governance/extensions/GovernorTimelockControl.sol";\n' +
        'import {GovernorVotes} from "@openzeppelin/contracts/governance/extensions/GovernorVotes.sol";\n' +
        'import {GovernorVotesQuorumFraction} from "@openzeppelin/contracts/governance/extensions/GovernorVotesQuorumFraction.sol";\n' +
        'import {IVotes} from "@openzeppelin/contracts/governance/utils/IVotes.sol";\n' +
        'import {TimelockController} from "@openzeppelin/contracts/governance/TimelockController.sol";\n';

    const internalMthod1 =
        "function _queueOperations(uint256 proposalId, address[] memory targets, uint256[] memory values, bytes[] memory calldatas, bytes32 descriptionHash)\n" +
        "internal\n" +
        "override(Governor, GovernorTimelockControl)\n" +
        "returns (uint48)\n" +
        "{\n" +
        "return super._queueOperations(proposalId, targets, values, calldatas, descriptionHash);\n" +
        "}\n";

    const internalMethod2 =
        "function _executeOperations(uint256 proposalId, address[] memory targets, uint256[] memory values, bytes[] memory calldatas, bytes32 descriptionHash)\n" +
        "internal\n" +
        "override(Governor, GovernorTimelockControl)\n" +
        "{\n" +
        "return super._executeOperations(proposalId, targets, values, calldatas, descriptionHash);\n" +
        "}\n";

    const internalMethod3 =
        "function _cancel(address[] memory targets, uint256[] memory values, bytes[] memory calldatas, bytes32 descriptionHash)\n" +
        "internal\n" +
        "override(Governor, GovernorTimelockControl)\n" +
        "returns (uint256)\n" +
        "{\n" +
        "return super._cancel(targets, values, calldatas, descriptionHash);\n" +
        "}\n";

    const internalMethod4 =
        "function _executor()\n" +
        "internal\n" +
        "view" +
        "override(Governor, GovernorTimelockControl)\n" +
        "returns (address)\n" +
        "{\n" +
        "return super._executor();\n" +
        "}\n";

    const code =
        "pragma solidity ^0.8.27;\n\n" +
        imports +
        "\n\n" +
        "contract" +
        name +
        "is Governor, GovernorSettings, GovernorCountingSimple, GovernorVotes, GovernorVotesQuorumFraction, GovernorTimelockControl" +
        " {\n\n" +
        "constructor(IVotes _token, TimelockController _timelock)\n" +
        'Governor(" ' +
        name +
        ' ")\n' +
        "GovernorSettings(" +
        delay +
        ", " +
        voting_period +
        ", " +
        proposal_threshold +
        ")\n" /*7200 /* 1 day */ /*, 50400 /* 1 week */ /*, 0)'*/ +
        "GovernorVotes(_token)\n" +
        "GovernorVotesQuorumFraction( " +
        quorum +
        ")\n" +
        "GovernorTimelockControl(_timelock)\n" +
        "{}\n\n" +
        methods +
        "\n\n" +
        internalMthod1 +
        "\n\n" +
        internalMethod2 +
        "\n\n" +
        internalMethod3 +
        "\n\n" +
        internalMethod4 +
        "\n\n" +
        "}\n";

    return code;
};

solidityTemplateGenerator.forBlock["state"] = function (block, generator) {
    const code =
        "function state(uint256 proposalId)\n" +
        "public\n" +
        "view\n" +
        "override(Governor, GovernorTimelockControl)\n" +
        "returns (ProposalState)\n" +
        "{\n" +
        "return super.state(proposalId);\n" +
        "}\n";
    return code;
};

// # Code generator for proposalNeedsQueuing
solidityTemplateGenerator.forBlock["proposalNeedsQueuing"] = function (
    block,
    generator
) {
    const code =
        "function proposalNeedsQueuing(uint256 proposalId)\n" +
        "public\n" +
        "view\n" +
        "override(Governor, GovernorTimelockControl)\n" +
        "returns (bool)\n" +
        "{\n" +
        "return super.proposalNeedsQueuing(proposalId);\n" +
        "}\n";
    return code;
};

// # Code generator for proposalThreshold
solidityTemplateGenerator.forBlock["proposalThreshold"] = function (block, generator) {
    const code =
        "function proposalThreshold()\n" +
        "public\n" +
        "view\n" +
        "override(Governor, GovernorTimelockControl)\n" +
        "returns (uint256)\n" +
        "{\n" +
        "return super.proposalThreshold();\n" +
        "}\n";
    return code;
};