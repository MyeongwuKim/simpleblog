import { db } from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { Profile } from "@prisma/client";
import { revalidatePath } from "next/cache";

export const GET = async () => {
  try {
    const profile = await db.profile.findFirst();

    if (!profile) {
      return NextResponse.json({
        ok: true,
        data: null, // 아직 프로필 없음
      });
    }

    return NextResponse.json({
      ok: true,
      data: profile,
    });
  } catch (e: unknown) {
    if (e instanceof Error) {
      return NextResponse.json(
        { ok: false, error: e.message },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { ok: false, error: "Unknown error" },
      { status: 500 }
    );
  }
};

export const POST = async (req: NextRequest) => {
  try {
    const {
      title,
      content,
      introduce,
      profileImg,
      form,
      github,
      instagram,
      notion,
    } = (await req.json()) as Profile & {
      form: "profileimg" | "intro" | "social" | "content";
    };

    let profile = await db.profile.findFirst();

    if (!profile) {
      profile = await db.profile.create({
        data: {
          title: title ?? "",
          content: content ?? "",
          introduce: introduce ?? "",
          profileImg: profileImg ?? null,
          github: github ?? null,
          instagram: instagram ?? null,
          notion: notion ?? null,
        },
      });
    }

    const updateData: Partial<Profile> = {};

    switch (form) {
      case "profileimg":
        updateData.profileImg = profileImg ?? null;
        break;
      case "intro":
        if (title !== undefined) updateData.title = title;
        if (introduce !== undefined) updateData.introduce = introduce;
        break;
      case "social":
        if (github !== undefined) updateData.github = github;
        if (instagram !== undefined) updateData.instagram = instagram;
        if (notion !== undefined) updateData.notion = notion;
        break;
      case "content":
        if (content !== undefined) updateData.content = content;
        break;
      default:
        return NextResponse.json(
          { ok: false, error: "잘못된 form 값입니다." },
          { status: 400 }
        );
    }

    const updated = await db.profile.update({
      where: { id: profile.id },
      data: updateData,
    });

    revalidatePath("/profile");

    return NextResponse.json({ ok: true, data: updated });
  } catch (e: unknown) {
    if (e instanceof Error) {
      return NextResponse.json(
        { ok: false, error: e.message },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { ok: false, error: "Unknown error" },
      { status: 500 }
    );
  }
};
