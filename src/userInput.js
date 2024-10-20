import prompts from "prompts";
/**
 * Prompts the user for a password, masking the input.
 * @returns {Promise<string>} A promise that resolves with the user-provided password.
 */
export async function getPassword() {
	const response = await prompts({
		type: "password",
		name: "password",
		message: "Enter password:",
		style: "password",
	});
	return response.password;
}
