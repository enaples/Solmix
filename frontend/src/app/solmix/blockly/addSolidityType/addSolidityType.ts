import * as Blockly from "blockly";
import type {SolidityVariable, SolidityAccess} from '../dropdown/dropdown';
import {solidityAddressVariables, solidityAddressConstantsVariables, solidityAddressImmutablesVariables } from "../dropdown/dropdown";
import {solidityBoolVariables, solidityBoolConstantsVariables, solidityBoolImmutablesVariables } from "../dropdown/dropdown";
import {solidityStringVariables, solidityStringConstantsVariables, solidityStringImmutablesVariables } from "../dropdown/dropdown";
import {solidityUintVariables, solidityUintConstantsVariables, solidityUintImmutablesVariables, solidityUint256Variables, solidityUint256ConstantsVariables, solidityUint256ImmutablesVariables, solidityUint8Variables, solidityUint8ConstantsVariables, solidityUint8ImmutablesVariables } from "../dropdown/dropdown";
import {solidityIntVariables, solidityIntConstantsVariables, solidityIntImmutablesVariables } from "../dropdown/dropdown";
import {solidityBytesVariables, solidityBytesConstantsVariables, solidityBytesImmutablesVariables } from "../dropdown/dropdown";
import {solidityBytes32Variables, solidityBytes32ConstantsVariables, solidityBytes32ImmutablesVariables} from "../dropdown/dropdown";

export type VariableScope = 'normal' | 'constant' | 'immutable';

interface VariableEntry {
  name: string;
  type: string;
  access: string;
  payable?: 'yes' | "doesn't matter";
  constant?: boolean;
  immutable?: boolean;
}


type RegistrySet = {
  base: SolidityVariable[];
  constants: SolidityVariable[];
  immutables: SolidityVariable[];
  updateBase: () => void;
  updateConstants: () => void;
  updateImmutables: () => void;
};

const registryMap: Record<string, RegistrySet> = {
  string: {
    base: solidityStringVariables,
    constants: solidityStringConstantsVariables,
    immutables: solidityStringImmutablesVariables,
    updateBase: updateVariableDropdownString,
    updateConstants: updateVariableDropdownStringConstants,
    updateImmutables: updateVariableDropdownStringImmutables,
  },
  address: {
    base: solidityAddressVariables,
    constants: solidityAddressConstantsVariables,
    immutables: solidityAddressImmutablesVariables,
    updateBase: updateVariableDropdownAddress,
    updateConstants: updateVariableDropdownAddressConstants,
    updateImmutables: updateVariableDropdownAddressImmutables,
  },
  uint: {
    base: solidityUintVariables,
    constants: solidityUintConstantsVariables,
    immutables: solidityUintImmutablesVariables,
    updateBase: updateVariableDropdownUint,
    updateConstants: updateVariableDropdownUintConstants,
    updateImmutables: updateVariableDropdownUintImmutables,
  },
  
  uint256: {
    base: solidityUint256Variables,
    constants: solidityUint256ConstantsVariables,
    immutables: solidityUint256ImmutablesVariables,
    updateBase: updateVariableDropdownUint256,
    updateConstants: updateVariableDropdownUint256Constants,
    updateImmutables: updateVariableDropdownUint256Immutables,
  },
  
  uint8: {
    base: solidityUint8Variables,
    constants: solidityUint8ConstantsVariables,
    immutables: solidityUint8ImmutablesVariables,
    updateBase: updateVariableDropdownUint8,
    updateConstants: updateVariableDropdownUint8Constants,
    updateImmutables: updateVariableDropdownUint8Immutables,
  },
  
  int: {
    base: solidityIntVariables,
    constants: solidityIntConstantsVariables,
    immutables: solidityIntImmutablesVariables,
    updateBase: updateVariableDropdownInt,
    updateConstants: updateVariableDropdownIntConstants,
    updateImmutables: updateVariableDropdownIntImmutables,
  },
  
  bool: {
    base: solidityBoolVariables,
    constants: solidityBoolConstantsVariables,
    immutables: solidityBoolImmutablesVariables,
    updateBase: updateVariableDropdownBool,
    updateConstants: updateVariableDropdownBoolConstants,
    updateImmutables: updateVariableDropdownBoolImmutables,
  },
  
  bytes: {
    base: solidityBytesVariables,
    constants: solidityBytesConstantsVariables,
    immutables: solidityBytesImmutablesVariables,
    updateBase: updateVariableDropdownBytes,
    updateConstants: updateVariableDropdownBytesConstants,
    updateImmutables: updateVariableDropdownBytesImmutables,
  },
  bytes32: {
    base: solidityBytes32Variables,
    constants: solidityBytes32ConstantsVariables,
    immutables: solidityBytes32ImmutablesVariables,
    updateBase: updateVariableDropdownBytes32,
    updateConstants: updateVariableDropdownBytes32Constants,
    updateImmutables: updateVariableDropdownBytes32Immutables,
  },
};

export function addSolidityVariable(
  name: string,
  type: string,
  access: SolidityAccess,
  payable?: 'yes' | "doesn't matter",
  varConstant?: string,
  varImmutable?: string
): void {
  const registry = registryMap[type];
  if (!registry) {
    console.warn(`❌ Tipo di variabile non supportato: ${type}`);
    return;
  }

  const variable: SolidityVariable = { name, type, access, payable, constant: varConstant === 'yes',
    immutable: varImmutable === 'yes' };

  // Costanti
  if (varConstant === "yes") {
    console.log("🔄 CONSTANTS STRING UPDATE:", solidityStringImmutablesVariables);

    if (!registry.constants.some(v => v.name === name)) {
      registry.constants.push(variable);
      registry.updateConstants();
      console.log("🔄 CONSTANTS STRING UPDATE:", solidityStringImmutablesVariables);

    } else {
      console.log("⚠️ Constant Variable already exists:", name);
    }
  }

  // Immutabili
  if (varImmutable === "yes") {
    console.log("🔄 IMMUTABLES STRING UPDATE:", solidityStringImmutablesVariables);

    if (!registry.immutables.some(v => v.name === name)) {
      registry.immutables.push(variable);
      registry.updateImmutables();
      console.log("🔄 IMMUTABLES STRING UPDATE:", solidityStringImmutablesVariables);

    } else {
      console.log("⚠️ Immutable Variable already exists:", name);
    }
  }

  // Base
  if (!registry.base.some(v => v.name === name)) {
    registry.base.push(variable);
    registry.updateBase();
  } else {
    console.log("⚠️ Variable already exists:", name);
  }
}

// Funzione generica di aggiornamento dei dropdown
function updateVariableDropdownByType(
  blockTypePrefixes: string[],
  variableList: VariableEntry[],
  expectedBlockTypes: string[]
) {
  const workspace = Blockly.getMainWorkspace();
  const variableNames = variableList.map((v) => v.name);
  const menu = variableList.length ? variableList.map((v) => [v.name, v.name]) : [['', '']];

  workspace.getAllBlocks().forEach((block) => {
    if (expectedBlockTypes.includes(block.type)) {
      const field = block.getField('VAR');
      if (field) {
        (field as any).menuGenerator_ = menu;
        const currentVal = field.getValue();
        field.setValue(variableNames.includes(currentVal) ? currentVal : '');
      }
    }
  });
}

// Funzioni specifiche per il tipo string
export function updateVariableDropdownString() {
  updateVariableDropdownByType(
    ['variables_get_string', 'variables_set_string'],
    solidityStringVariables,
    ['variables_get_string', 'variables_set_string']
  );
}

export function updateVariableDropdownStringConstants() {
  updateVariableDropdownByType(
    ['variables_get_string_constants'],
    solidityStringConstantsVariables,
    ['variables_get_string_constants']
  );
}

export function updateVariableDropdownStringImmutables() {
  updateVariableDropdownByType(
    ['variables_get_string_immutables'],
    solidityStringImmutablesVariables,
    ['variables_get_string_immutables']
  );
}

// Funzioni specifiche per il tipo address
export function updateVariableDropdownAddress() {
  updateVariableDropdownByType(
    ['variables_get_address', 'variables_set_address'],
    solidityAddressVariables,
    ['variables_get_address', 'variables_set_address']
  );
}

export function updateVariableDropdownAddressConstants() {
  updateVariableDropdownByType(
    ['variables_get_address_constants'],
    solidityAddressConstantsVariables,
    ['variables_get_address_constants']
  );
}

export function updateVariableDropdownAddressImmutables() {
  updateVariableDropdownByType(
    ['variables_get_address_immutables'],
    solidityAddressImmutablesVariables,
    ['variables_get_address_immutables']
  );
}

// Funzioni specifiche per il tipo uint
export function updateVariableDropdownUint() {
  updateVariableDropdownByType(
    ['variables_get_uint', 'variables_set_uint'],
    solidityUintVariables,
    ['variables_get_uint', 'variables_set_uint']
  );
}

export function updateVariableDropdownUintConstants() {
  updateVariableDropdownByType(
    ['variables_get_uint_constants'],
    solidityUintConstantsVariables,
    ['variables_get_uint_constants']
  );
}

export function updateVariableDropdownUintImmutables() {
  updateVariableDropdownByType(
    ['variables_get_uint_immutables'],
    solidityUintImmutablesVariables,
    ['variables_get_uint_immutables']
  );
}

// Funzioni specifiche per il tipo uint256
export function updateVariableDropdownUint256() {
  updateVariableDropdownByType(
    ['variables_get_uint256', 'variables_set_uint256'],
    solidityUint256Variables,
    ['variables_get_uint256', 'variables_set_uint256']
  );
}

export function updateVariableDropdownUint256Constants() {
  updateVariableDropdownByType(
    ['variables_get_uint256_constants'],
    solidityUint256ConstantsVariables,
    ['variables_get_uint256_constants']
  );
}

export function updateVariableDropdownUint256Immutables() {
  updateVariableDropdownByType(
    ['variables_get_uint256_immutables'],
    solidityUint256ImmutablesVariables,
    ['variables_get_uint256_immutables']
  );
}

// Funzioni specifiche per il tipo uint8
export function updateVariableDropdownUint8() {
  updateVariableDropdownByType(
    ['variables_get_uint8', 'variables_set_uint8'],
    solidityUint8Variables,
    ['variables_get_uint8', 'variables_set_uint8']
  );
}

export function updateVariableDropdownUint8Constants() {
  updateVariableDropdownByType(
    ['variables_get_uint8_constants'],
    solidityUint8ConstantsVariables,
    ['variables_get_uint8_constants']
  );
}

export function updateVariableDropdownUint8Immutables() {
  updateVariableDropdownByType(
    ['variables_get_uint8_immutables'],
    solidityUint8ImmutablesVariables,
    ['variables_get_uint8_immutables']
  );
}

// Funzioni specifiche per il tipo Int
export function updateVariableDropdownInt() {
  updateVariableDropdownByType(
    ['variables_get_int', 'variables_set_int'],
    solidityIntVariables,
    ['variables_get_int', 'variables_set_int']
  );
}

export function updateVariableDropdownIntConstants() {
  updateVariableDropdownByType(
    ['variables_get_int_constants'],
    solidityIntConstantsVariables,
    ['variables_get_int_constants']
  );
}

export function updateVariableDropdownIntImmutables() {
  updateVariableDropdownByType(
    ['variables_get_int_immutables'],
    solidityIntImmutablesVariables,
    ['variables_get_int_immutables']
  );
}

// Funzioni specifiche per il tipo Bool
export function updateVariableDropdownBool() {
  updateVariableDropdownByType(
    ['variables_get_bool', 'variables_set_bool'],
    solidityBoolVariables,
    ['variables_get_bool', 'variables_set_bool']
  );
}

export function updateVariableDropdownBoolConstants() {
  updateVariableDropdownByType(
    ['variables_get_bool_constants'],
    solidityBoolConstantsVariables,
    ['variables_get_bool_constants']
  );
}

export function updateVariableDropdownBoolImmutables() {
  updateVariableDropdownByType(
    ['variables_get_bool_immutables'],
    solidityBoolImmutablesVariables,
    ['variables_get_bool_immutables']
  );
}

// Funzioni specifiche per il tipo Bytes
export function updateVariableDropdownBytes() {
  updateVariableDropdownByType(
    ['variables_get_bytes', 'variables_set_bytes'],
    solidityBytesVariables,
    ['variables_get_bytes', 'variables_set_bytes']
  );
}

export function updateVariableDropdownBytesConstants() {
  updateVariableDropdownByType(
    ['variables_get_bytes_constants'],
    solidityBytesConstantsVariables,
    ['variables_get_bytes_constants']
  );
}

export function updateVariableDropdownBytesImmutables() {
  updateVariableDropdownByType(
    ['variables_get_bytes_immutables'],
    solidityBytesImmutablesVariables,
    ['variables_get_bytes_immutables']
  );
}

// Funzioni specifiche per il tipo Bytes32
export function updateVariableDropdownBytes32() {
  updateVariableDropdownByType(
    ['variables_get_bytes32', 'variables_set_bytes32'],
    solidityBytes32Variables,
    ['variables_get_bytes32', 'variables_set_bytes32']
  );
}

export function updateVariableDropdownBytes32Constants() {
  updateVariableDropdownByType(
    ['variables_get_bytes32_constants'],
    solidityBytes32ConstantsVariables,
    ['variables_get_bytes32_constants']
  );
}

export function updateVariableDropdownBytes32Immutables() {
  updateVariableDropdownByType(
    ['variables_get_bytes32_immutables'],
    solidityBytes32ImmutablesVariables,
    ['variables_get_bytes32_immutables']
  );
}