export const variableTypes: Record<
    string,
    {
        colour: string;
        tooltip: string;
        validator: (value: string) => string | null;
    }
> = {
    boolean: {
        colour: "#FF6666",
        tooltip: "Boolean value (true or false)",
        validator: (value: string) => {
            return /^(true|false)$/i.test(value) ? value : null;
        },
    },
    address: {
        colour: "#7FFF00",
        tooltip: "Ethereum address (20 bytes)",
        validator: (value: string) => {
            // Check for valid Ethereum address format (0x followed by 40 hex chars)
            return /^0x[0-9a-fA-F]{40}$/.test(value) ? value : null;
        },
    },
    string: {
        colour: "#008B8B",
        tooltip: "Dynamic string value",
        validator: (value: string) => {
            // Strings can be anything, but should be properly quoted
            return value;
        },
    },
    int8: {
        colour: "#66B2FF",
        tooltip: "8-bit signed integer (-128 to 127)",
        validator: (value: string) => {
            const num = parseInt(value);
            return !isNaN(num) && num >= -128 && num <= 127 ? value : null;
        },
    },
    int16: {
        colour: "#66FF66",
        tooltip: "16-bit signed integer (-32,768 to 32,767)",
        validator: (value: string) => {
            const num = parseInt(value);
            return !isNaN(num) && num >= -32768 && num <= 32767 ? value : null;
        },
    },
    int32: {
        colour: "#FFB266",
        tooltip: "32-bit signed integer (-2,147,483,648 to 2,147,483,647)",
        validator: (value: string) => {
            const num = parseInt(value);
            return !isNaN(num) && num >= -2147483648 && num <= 2147483647
                ? value
                : null;
        },
    },
    int64: {
        colour: "#FF66FF",
        tooltip:
            "64-bit signed integer (-9,223,372,036,854,775,808 to 9,223,372,036,854,775,807)",
        validator: (value: string) => {
            try {
                // Using BigInt for 64-bit integers
                const num = BigInt(value);
                return num >= BigInt("-9223372036854775808") &&
                    num <= BigInt("9223372036854775807")
                    ? value
                    : null;
            } catch {
                return null;
            }
        },
    },
    int128: {
        colour: "#B266FF",
        tooltip: "128-bit signed integer",
        validator: (value: string) => {
            try {
                BigInt(value); // Just check if it's a valid integer
                return value; // For int128, we don't check ranges as JS BigInt can handle it but would be verbose
            } catch {
                return null;
            }
        },
    },
    int256: {
        colour: "#66FFFF",
        tooltip: "256-bit signed integer",
        validator: (value: string) => {
            try {
                BigInt(value); // Check if it's a valid integer
                return value;
            } catch {
                return null;
            }
        },
    },
    uint8: {
        colour: "#FFFF66",
        tooltip: "8-bit unsigned integer (0 to 255)",
        validator: (value: string) => {
            const num = parseInt(value);
            return !isNaN(num) && num >= 0 && num <= 255 ? value : null;
        },
    },
    uint16: {
        colour: "#FF8000",
        tooltip: "16-bit unsigned integer (0 to 65,535)",
        validator: (value: string) => {
            const num = parseInt(value);
            return !isNaN(num) && num >= 0 && num <= 65535 ? value : null;
        },
    },
    uint32: {
        colour: "#00FF80",
        tooltip: "32-bit unsigned integer (0 to 4,294,967,295)",
        validator: (value: string) => {
            const num = parseInt(value);
            return !isNaN(num) && num >= 0 && num <= 4294967295 ? value : null;
        },
    },
    uint64: {
        colour: "#8000FF",
        tooltip: "64-bit unsigned integer (0 to 18,446,744,073,709,551,615)",
        validator: (value: string) => {
            try {
                const num = BigInt(value);
                return num >= BigInt(0) && num <= BigInt("18446744073709551615")
                    ? value
                    : null;
            } catch {
                return null;
            }
        },
    },
    uint128: {
        colour: "#FFCC99",
        tooltip: "128-bit unsigned integer",
        validator: (value: string) => {
            try {
                const num = BigInt(value);
                return num >= BigInt(0) ? value : null; // Just check if it's non-negative
            } catch {
                return null;
            }
        },
    },
    uint256: {
        colour: "#99FFCC",
        tooltip: "256-bit unsigned integer",
        validator: (value: string) => {
            try {
                const num = BigInt(value);
                return num >= BigInt(0) ? value : null; // Just check if it's non-negative
            } catch {
                return null;
            }
        },
    },
};
