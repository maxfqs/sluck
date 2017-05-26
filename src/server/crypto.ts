import * as crypto from "crypto"

const algorithm = "aes192";
const secret: string = require("../../config/sluck.json").cryptoSecret;

export function encrypt(text: string): string {
    let cipher = crypto.createCipher(algorithm, secret);
    let crypted = cipher.update(text, "utf8", "hex");
    crypted += cipher.final("hex");
    return crypted;
}

export function decrypt(text: string): string {
    let decipher = crypto.createDecipher(algorithm, secret);
    let decrypted = decipher.update(text, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
}
