import jwt from "jsonwebtoken";
import fs from "fs";
import path from "path";

const privateKeyPath = path.resolve(process.cwd(), "/src/keys/private.pem");
const privateKey = fs.readFileSync(privateKeyPath, "utf8");

const publicKeyPath = path.resolve(process.cwd(), "/src/keys/public.pem");
const publicKey = fs.readFileSync(publicKeyPath, "utf8");

export function signToken(payload: object): string {
    return jwt.sign(payload, privateKey, { algorithm: "RS256", expiresIn: "7d" });
}

export function verifyToken(token: string): any {
    try {
        return jwt.verify(token, publicKey, { algorithms: ["RS256"] });
    } catch (error) {
        return null;
    }
}