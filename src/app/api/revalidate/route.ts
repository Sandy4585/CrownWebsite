import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { secret, paths } = body;

    if (secret !== process.env.REVALIDATION_SECRET) {
      return NextResponse.json(
        { revalidated: false, message: "Invalid secret" },
        { status: 401 }
      );
    }

    revalidatePath("/");
    revalidatePath("/products");
    revalidatePath("/gallery");

    if (paths && Array.isArray(paths)) {
      for (const path of paths) {
        revalidatePath(path);
      }
    }

    return NextResponse.json({ revalidated: true });
  } catch (error) {
    console.error("Revalidation error:", error);
    return NextResponse.json(
      { revalidated: false, message: "Error revalidating" },
      { status: 500 }
    );
  }
}
