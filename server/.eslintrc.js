module.exports = {
	env: {
		node: true,
		es2021: true,
	},
	extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
	parser: "@typescript-eslint/parser",
	parserOptions: {
		ecmaVersion: 12,
		sourceType: "module",
	},
	plugins: ["@typescript-eslint"],
	rules: {
		"no-empty": "error",
		"default-case": "error",
		"default-case-last": "error",
		eqeqeq: ["error", "always"],
	},
	ignorePatterns: ["dist", "lambda"],
};
