import { NextRequest, NextResponse } from "next/server";

export function middleware(request:NextRequest){
    return NextResponse.redirect(new URL("/home", request.url))
}

export const congif ={
    matcher:['/', '/signin', '/signup', '/verify', '/dashboard']
}