import { NextResponse } from "next/server";
import { enquirySchema } from "@/lib/validations";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { sendEnquiryEmail } from "@/lib/resend";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = enquirySchema.parse(body);

    const supabase = createServiceRoleClient();

    const { error: dbError } = await supabase.from("enquiries").insert({
      type: validated.type,
      name: validated.name,
      email: validated.email,
      phone: validated.phone,
      company: validated.company || null,
      product_interest: validated.product_interest || null,
      product_id: validated.product_id || null,
      message: validated.message,
      source_page: validated.source_page,
    });

    if (dbError) {
      console.error("Supabase insert error:", dbError);
      return NextResponse.json(
        { success: false, message: "Failed to save enquiry" },
        { status: 500 }
      );
    }

    try {
      await sendEnquiryEmail({
        type: validated.type,
        name: validated.name,
        email: validated.email,
        phone: validated.phone,
        company: validated.company,
        product_interest: validated.product_interest,
        message: validated.message,
        source_page: validated.source_page,
      });
    } catch (emailError) {
      console.error("Email send error:", emailError);
    }

    return NextResponse.json({
      success: true,
      message: "Enquiry submitted successfully",
    });
  } catch (error) {
    console.error("Enquiry API error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to submit enquiry" },
      { status: 400 }
    );
  }
}
