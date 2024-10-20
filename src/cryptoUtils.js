import argon2 from "argon2";
import crypto from "crypto";

/**
 * Encrypts data using AES-256-GCM with a password, salt, and IV, utilizing Argon2 for key derivation.
 * @param {string} data - The plaintext data to encrypt.
 * @param {string} password - The password to derive the encryption key.
 * @returns {Promise<string>} - The encrypted data in JSON format.
 */
export async function encrypt(data, password) {
	try {
		const salt = crypto.randomBytes(16); // 16 bytes salt
		const iv = crypto.randomBytes(12); // 12 bytes IV for GCM

		// Derive the key using Argon2
		const key = await argon2.hash(password, {
			salt,
			type: argon2.argon2id, // Argon2id for a balance between performance and security
			memoryCost: 2 ** 16, // Adjust these parameters based on your security and performance needs
			timeCost: 4,
			parallelism: 1,
			hashLength: 32,
			raw: true, // We need the raw key, not encoded in base64
		});

		const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);

		let encrypted = cipher.update(data, "utf8", "hex");
		encrypted += cipher.final("hex");

		const authTag = cipher.getAuthTag().toString("hex");

		// No need to zero out key since Argon2 memory hardens the key
		return JSON.stringify({
			encryptedData: encrypted,
			iv: iv.toString("hex"),
			salt: salt.toString("hex"),
			authTag: authTag,
		});
	} catch (error) {
		console.error("Encryption failed:", error);
		throw error;
	}
}

/**
 * Decrypts the encrypted data using AES-256-GCM with a password, salt, and IV, utilizing Argon2 for key derivation.
 * @param {string} encryptedData - The encrypted data (in JSON format).
 * @param {string} password - The password to derive the decryption key.
 * @returns {Promise<string>} - The decrypted plaintext.
 */
export async function decrypt(encryptedData, password) {
	try {
		// Parse the encrypted data JSON
		const parsedData = JSON.parse(encryptedData);
		const { encryptedData: data, iv, salt, authTag } = parsedData;

		// Derive the key using Argon2 with the same parameters and salt
		const key = await argon2.hash(password, {
			salt: Buffer.from(salt, "hex"),
			type: argon2.argon2id,
			memoryCost: 2 ** 16,
			timeCost: 4,
			parallelism: 1,
			hashLength: 32,
			raw: true,
		});

		// Create AES-256-GCM decipher
		const decipher = crypto.createDecipheriv(
			"aes-256-gcm",
			key,
			Buffer.from(iv, "hex")
		);

		// Set the authentication tag
		decipher.setAuthTag(Buffer.from(authTag, "hex"));

		// Decrypt the data
		let decrypted = decipher.update(data, "hex", "utf8");
		decrypted += decipher.final("utf8");

		return decrypted;
	} catch (error) {
		console.error("Decryption failed:", error);
		throw error;
	}
}
