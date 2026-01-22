// // import { NextResponse } from "next/server";
// // import { connectDB } from "@/lib/db";
// // import User from "@/models/User";
// // import { verifyToken } from "@/lib/jwt";

// // export async function PUT(req) {
// //   try {
// //     const token = req.cookies.get("token")?.value;
// //     if (!token) {
// //       return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
// //     }

// //     const decoded = verifyToken(token);
// //     await connectDB();

// //     const body = await req.json();

// //     const user = await User.findByIdAndUpdate(
// //       decoded.id,
// //       {
// //         name: body.name,
// //         abilities: body.abilities,
// //         learnSkills: body.learnSkills,
// //         education: body.education,
// //         hobbies: body.hobbies,
// //         experience: body.experience,
// //         rating: body.rating
// //       },
// //       { new: true }
// //     );

// //     return NextResponse.json({ user });
// //   } catch (err) {
// //     return NextResponse.json({ message: "Update failed" }, { status: 500 });
// //   }
// // }




// import { NextResponse } from "next/server";
// import { connectDB } from "@/lib/db";
// import User from "@/models/User";
// import { verifyToken } from "@/lib/jwt";
// import fs from "fs";
// import path from "path";

// export async function PUT(req) {
//   try {
//     const token = req.cookies.get("token")?.value;
//     if (!token) {
//       return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
//     }

//     const decoded = verifyToken(token);
//     await connectDB();


//     const formData = await req.formData();

//     const updateData = {
//        email: formData.get("email"), 
//       name: formData.get("name"),
//       education: formData.get("education"),
//       experience: formData.get("experience"),
//       rating: Number(formData.get("rating")),
//       abilities: JSON.parse(formData.get("abilities")),
//       learnSkills: JSON.parse(formData.get("learnSkills")),
//       hobbies: JSON.parse(formData.get("hobbies"))
//     };

//     const image = formData.get("image");

//     if (image && image.name) {
//       const bytes = await image.arrayBuffer();
//       const buffer = Buffer.from(bytes);

//       const uploadDir = path.join(process.cwd(), "public/uploads");
//       if (!fs.existsSync(uploadDir)) {
//         fs.mkdirSync(uploadDir);
//       }

//       const fileName = `user_${decoded.id}${path.extname(image.name)}`;
//       const filePath = path.join(uploadDir, fileName);

//       fs.writeFileSync(filePath, buffer);

//       updateData.image = `/uploads/${fileName}`;
//     }

//     const user = await User.findByIdAndUpdate(decoded.id, updateData, {
//       new: true
//     });

//     return NextResponse.json({ user });
//   } catch (err) {
//     console.error(err);
//     return NextResponse.json({ message: "Update failed" }, { status: 500 });
//   }
// }




// import { NextResponse } from "next/server";
// import { connectDB } from "@/lib/db";
// import User from "@/models/User";
// import { verifyToken } from "@/lib/jwt";
// import fs from "fs";
// import path from "path";

// export async function PUT(req) {
//   try {
//     const token = req.cookies.get("token")?.value;
//     if (!token) {
//       return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
//     }

//     const decoded = verifyToken(token);
//     await connectDB();

//     // ✅ FIRST: formData banaya
//     const formData = await req.formData();

//     // ✅ THEN: email nikala
//     const newEmail = formData.get("email");

//     // ✅ DUPLICATE EMAIL CHECK
//     if (newEmail) {
//       const exists = await User.findOne({
//         email: newEmail,
//         _id: { $ne: decoded.id }
//       });

//       if (exists) {
//         return NextResponse.json(
//           { message: "Email already in use" },
//           { status: 400 }
//         );
//       }
//     }

//     // ✅ UPDATE DATA
//     const updateData = {
//       email: newEmail,
//       name: formData.get("name"),
//       education: formData.get("education"),
//       experience: formData.get("experience"),
//       // rating: Number(formData.get("rating")),
//       abilities: JSON.parse(formData.get("abilities")),
//       learnSkills: JSON.parse(formData.get("learnSkills")),
//       hobbies: JSON.parse(formData.get("hobbies"))
//     };

//     // ✅ IMAGE HANDLE
//     const image = formData.get("image");

//     if (image && image.name) {
//       const bytes = await image.arrayBuffer();
//       const buffer = Buffer.from(bytes);

//       const uploadDir = path.join(process.cwd(), "public/uploads");
//       if (!fs.existsSync(uploadDir)) {
//         fs.mkdirSync(uploadDir);
//       }

//       const fileName = `user_${decoded.id}${path.extname(image.name)}`;
//       const filePath = path.join(uploadDir, fileName);

//       fs.writeFileSync(filePath, buffer);
//       updateData.image = `/uploads/${fileName}`;
//     }

//     const user = await User.findByIdAndUpdate(decoded.id, updateData, {
//       new: true
//     });

//     return NextResponse.json({ user });

//   } catch (err) {
//     console.error("UPDATE ERROR:", err);
//     return NextResponse.json(
//       { message: "Update failed" },
//       { status: 500 }
//     );
//   }
// }




import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { verifyToken } from "@/lib/jwt";
import cloudinary from "@/lib/cloudinary";

export async function PUT(req) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const decoded = verifyToken(token);
    await connectDB();

    const formData = await req.formData();

    /* ---------------- BASIC FIELDS ---------------- */
    const email = formData.get("email");
    const name = formData.get("name");
    const education = formData.get("education");
    const experience = formData.get("experience");

    const abilities = JSON.parse(formData.get("abilities") || "[]");
    const learnSkills = JSON.parse(formData.get("learnSkills") || "[]");
    const hobbies = JSON.parse(formData.get("hobbies") || "[]");

    /* ---------------- DUPLICATE EMAIL CHECK ---------------- */
    if (email) {
      const exists = await User.findOne({
        email,
        _id: { $ne: decoded.id }
      });

      if (exists) {
        return NextResponse.json(
          { message: "Email already in use" },
          { status: 400 }
        );
      }
    }

    /* ---------------- UPDATE OBJECT ---------------- */
    const updateData = {
      email,
      name,
      education,
      experience,
      abilities,
      learnSkills,
      hobbies
    };

    /* ---------------- IMAGE (CLOUDINARY) ---------------- */
    const image = formData.get("image");

    if (image && image.name) {
      const bytes = await image.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const base64 = `data:${image.type};base64,${buffer.toString("base64")}`;

      const uploadRes = await cloudinary.uploader.upload(base64, {
        folder: "skillswap/users",
        public_id: `user_${decoded.id}`,
        overwrite: true
      });

      updateData.image = uploadRes.secure_url;
    }

    /* ---------------- DB UPDATE ---------------- */
    const user = await User.findByIdAndUpdate(
      decoded.id,
      updateData,
      { new: true }
    );

    return NextResponse.json({ user });

  } catch (err) {
    console.error("UPDATE ERROR:", err);
    return NextResponse.json(
      { message: "Update failed" },
      { status: 500 }
    );
  }
}
