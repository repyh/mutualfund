import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { rateLimited, rsaUtils } from "@/lib";
import * as db from '@/database/';

export async function GET(req: Request) {
    const ip = req.headers.get("x-forwarded-for") || req.headers.get("cf-connecting-ip") || "unknown";

    if (rateLimited(ip)) {
        return NextResponse.json({ error: "Too many requests, please try again later" }, { status: 429 });
    }

    const authHeader = req.headers.get("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return NextResponse.json({ error: "Unauthorized: Missing token" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const decoded = rsaUtils.verifyToken(token);

    if (!decoded) {
        return NextResponse.json({ error: "Invalid token" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);

    const id = searchParams.get("id");
    const email = searchParams.get("email");
    const username = searchParams.get("username");

    const selector = {
        ...(id && { id }),
        ...(email && { email }),
        ...(username && { username }),
    }

    try {
        if (id || email || username) {
            const data = await db.User.findOne(selector);
            if (!data) {
                return NextResponse.json({ error: "Data not found" }, { status: 404 });
            }

            delete data.password;
            return NextResponse.json(data);
        } else {
            return NextResponse.json(await db.User.find({}));
        }
    } catch(error) {
        return NextResponse.json({ error }, { status: 400 });
    }
}

export async function POST(req: Request) {
    const ip = req.headers.get("x-forwarded-for") || req.headers.get("cf-connecting-ip") || "unknown";

    if (rateLimited(ip)) {
        return NextResponse.json({ error: "Too many requests, please try again later" }, { status: 429 });
    }

    const data = await req.json();

    try {
        if(data.password) {
            const saltRounds = 10;
            data.password = await bcrypt.hash(data.password, saltRounds);
        }

        return NextResponse.json(await db.User.create(data));
    } catch(error) {
        return NextResponse.json({ error }, { status: 400 });
    }
}

export async function PUT(req: Request) {
    const ip = req.headers.get("x-forwarded-for") || req.headers.get("cf-connecting-ip") || "unknown";

    if (rateLimited(ip)) {
        return NextResponse.json({ error: "Too many requests, please try again later" }, { status: 429 });
    }

    const authHeader = req.headers.get("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return NextResponse.json({ error: "Unauthorized: Missing token" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const decoded = rsaUtils.verifyToken(token);

    if (!decoded) {
        return NextResponse.json({ error: "Invalid token" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const data = await req.json();

    const id = searchParams.get("id");
    const email = searchParams.get("email");
    const username = searchParams.get("username");

    const selector = {
        ...(id && { id }),
        ...(email && { email }),
        ...(username && { username }),
    }

    try {
        const doc = await db.User.findOne(selector);

        if(!doc) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        if(decoded.email !== doc.email && decoded.id !== doc.id) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        if(data.password) {
            const saltRounds = 10;
            data.password = await bcrypt.hash(data.password, saltRounds);
        }

        let updatedUser;

        if(id || email || username) {
            updatedUser = await db.User.findOneAndUpdate(selector, data);
        } else {
            updatedUser = await db.User.findOneAndUpdate({ id: data.id }, data);
        }

        if (!updatedUser) {
            return NextResponse.json({ error: "User not found or update failed" }, { status: 404 });
        }

        return NextResponse.json(updatedUser);
    } catch(error) {
        return NextResponse.json({ error }, { status: 400 });
    }
}

export async function DELETE(req: Request) {
    const ip = req.headers.get("x-forwarded-for") || req.headers.get("cf-connecting-ip") || "unknown";

    if (rateLimited(ip)) {
        return NextResponse.json({ error: "Too many requests, please try again later" }, { status: 429 });
    }

    const authHeader = req.headers.get("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return NextResponse.json({ error: "Unauthorized: Missing token" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const decoded = rsaUtils.verifyToken(token);

    if (!decoded) {
        return NextResponse.json({ error: "Invalid token" }, { status: 403 });
    }
    
    const { searchParams } = new URL(req.url);

    const id = searchParams.get("id");
    const email = searchParams.get("email");
    const username = searchParams.get("username");

    const selector = {
        ...(id && { id }),
        ...(email && { email }),
        ...(username && { username }),
    }

    try {
        const doc = await db.User.findOne(selector);

        if(!doc) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        if(decoded.email !== doc.email && decoded.id !== doc.id) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        return NextResponse.json(await db.User.deleteOne(selector));
    } catch(error) {
        return NextResponse.json({ error }, { status: 400 });
    }
}