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
  /*uint: {
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
  address: {
    base: solidityAddressVariables,
    constants: solidityAddressConstantsVariables,
    immutables: solidityAddressImmutablesVariables,
    updateBase: updateVariableDropdownAddress,
    updateConstants: updateVariableDropdownAddressConstants,
    updateImmutables: updateVariableDropdownAddressImmutables,
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
  },*/
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
    immutable: varImmutable === 'yes', };

  // Costanti
  if (varConstant === "yes") {
    if (!registry.constants.some(v => v.name === name)) {
      registry.constants.push(variable);
      registry.updateConstants();
    } else {
      console.log("⚠️ Constant Variable already exists:", name);
    }
  }

  // Immutabili
  if (varImmutable === "yes") {
    if (!registry.immutables.some(v => v.name === name)) {
      registry.immutables.push(variable);
      registry.updateImmutables();
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


