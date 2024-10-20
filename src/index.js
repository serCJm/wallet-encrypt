import { createReadStream, createWriteStream } from "fs";
import path from "path";
import readline from "readline";
import { fileURLToPath } from "url";
import { decrypt, encrypt } from "./cryptoUtils.js";
import { getPassword } from "./userInput.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const isEncrypt = process.env.npm_lifecycle_event === "encrypt";

/**
 * Resolves the input and output file paths based on the encryption/decryption mode.
 *
 * @param {string} [inputArg] - Optional input file path argument.
 * @param {string} [outputArg] - Optional output file path argument.
 * @returns {{inputFilePath: string, outputFilePath: string}} - An object containing the resolved input and output file paths.
 */
function resolveFilePaths(inputArg, outputArg) {
	const inputFile = isEncrypt
		? "seed_phrases.txt"
		: "encrypted_seed_phrases.txt";
	const outputFile = isEncrypt
		? "encrypted_seed_phrases.txt"
		: "decrypted_seed_phrases.txt";

	const inputFilePath =
		inputArg || path.join(__dirname, "..", "data", inputFile);
	const outputFilePath =
		outputArg || path.join(__dirname, "..", "data", outputFile);
	return { inputFilePath, outputFilePath };
}

/**
 * Processes the input file line by line, either encrypting or decrypting each line.
 *
 * @param {string} inputPath - The path to the input file.
 * @param {string} outputPath - The path to the output file.
 * @param {string} password - The password to use for encryption or decryption.
 * @returns {Promise<void>} - A Promise that resolves when the file processing is complete.
 */
async function processFile(inputPath, outputPath, password) {
	const readStream = createReadStream(inputPath, "utf-8");
	const writeStream = createWriteStream(outputPath);
	const rl = readline.createInterface({
		input: readStream,
		crlfDelay: Infinity,
	});

	for await (const line of rl) {
		if (line.trim()) {
			try {
				const processedLine = isEncrypt
					? await encrypt(line, password)
					: await decrypt(line, password);
				writeStream.write(processedLine + "\n");
			} catch (error) {
				console.error(`Error processing line "${line}":`, error);
			}
		}

		writeStream.end();
	}
}

/**
 * Main function that handles the encryption/decryption process.
 *
 * @returns {Promise<void>} - A Promise that resolves when the process is complete.
 */
async function main() {
	const { inputFilePath, outputFilePath } = resolveFilePaths(
		process.argv[2],
		process.argv[3]
	);

	try {
		const password = await getPassword();
		if (!password) {
			console.error("Password not provided.");
			process.exit(1);
		}

		const method = isEncrypt ? "En" : "De";
		await processFile(inputFilePath, outputFilePath, password);
		console.log(`${method}cryption complete.`);
	} catch (error) {
		console.error("An error occurred:", error);
		process.exit(1);
	}
}

main();
