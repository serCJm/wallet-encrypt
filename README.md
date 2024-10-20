# 🔒 Seed Phrase Encryption/Decryption Tool

This project is a command-line tool designed to **encrypt** and **decrypt seed phrases** using a password. It processes text files line by line, either encrypting or decrypting the content depending on the mode (encryption or decryption). The tool uses Node.js's file system module (`fs`), path handling, and stream processing to ensure efficient file operations.

## 🚀 Features

-   **Encryption and Decryption**: Encrypt or decrypt seed phrases line by line.
-   **Password Protection**: Secures seed phrases using a user-provided password.
-   **File Streaming**: Processes files using streams to handle large files efficiently.
-   **Customizable Input and Output**: Users can specify input and output file paths.

## 🛠️ Installation

1. Clone the repository:

    ```bash
    git clone <repository-url>
    cd <repository-directory>

    ```

2. Install dependencies:
    ```bash
    npm install
    ```

## 📖 Usage

The tool supports both encryption and decryption modes. The mode is determined by the npm script used.

## 🔐 Encrypting Seed Phrases

To encrypt a list of seed phrases from a file, run the following command:

```bash
npm run encrypt <input-file> <output-file>
```

    •	inputFilePath (optional): Path to the file containing the seed phrases (default: ../data/seed_phrases.txt).
    •	outputFilePath (optional): Path to the file where the encrypted seed phrases will be saved (default: ../data/encrypted_seed_phrases.txt).

You will be prompted to enter a password that will be used to encrypt the seed phrases.

🔓 Decrypting Seed Phrases

To decrypt a list of encrypted seed phrases, run the following command:

```bash
npm run decrypt <input-file> <output-file>
```

    •	inputFilePath (optional): Path to the file containing the encrypted seed phrases (default: ../data/encrypted_seed_phrases.txt).
    •	outputFilePath (optional): Path to the file where the decrypted seed phrases will be saved (default: ../data/decrypted_seed_phrases.txt).

You will be prompted to enter the password that was used for encryption.

## 📁 File Structure

    •	data/ - The directory where default input and output files are stored.
    •	src/cryptoUtils.js - Contains utility functions for encrypting and decrypting the seed phrases.
    •	src/userInput.js - Manages user input for getting the password securely.
    •	src/index.js - The main entry point of the tool that coordinates file reading, writing, and encryption/decryption processes.

## 📄 License

This project is licensed under the MIT License.

⚠️ Note: By using this tool, you ensure your seed phrases are securely stored and accessible only with the correct password. Remember to keep your password safe!
