import { FlatCompat } from "@eslint/eslintrc";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
	baseDirectory: __dirname,
});

const eslintConfig = [
	...compat.extends("next/core-web-vitals", "next/typescript"),
	{
		rules: {
			"@typescript-eslint/no-non-null-asserted-optional-chain": "off",
			"@typescript-eslint/no-explicit-any": "off",
			"react-hooks/exhaustive-deps": "off",
			"no-unused-vars": "warn",
			"unused-imports/no-unused-imports": "error",
			"unused-imports/no-unused-vars": ["off"],
		},
	},
];

export default eslintConfig;
