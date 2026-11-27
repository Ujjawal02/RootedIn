require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../src/models/user.model");
const { exist } = require("joi");

const run = async () => {
    const {DBURL, ACCOUNT_EMAIL, ACCOUNT_PASSWORD, ACCOUNT_NAME} = process.env;
    const role = process.env.ACCOUNT_ROLE || "admin";

     if (!DBURL || !ACCOUNT_EMAIL || !ACCOUNT_PASSWORD) {
        console.error("Set DBURL, ACCOUNT_EMAIL and ACCOUNT_PASSWORD first.");
        process.exit(1);
    }
    if(!["admin", "farmer"].includes(role)){
        console.error("ACCOUNT_ROLE must be admin or farmer.");
        process.exit(1);
    }

    if (ACCOUNT_PASSWORD.length < 8) {
        console.error("Use a password of at least 8 characters.");
        process.exit(1);
    }

    await mongoose.connect(DBURL);
    const email = ACCOUNT_EMAIL.toLowerCase();

    const existing = await User.findOne({email});


    if(existing){
        existing.role = role;
        await existing.save();
        console.log(`${email} already existed and is now a ${role}.`);
    }else{
        await User.create({
            name: { firstname: ACCOUNT_NAME || role },
            email,
            phone: "0000000000",
            password: ACCOUNT_PASSWORD,
            role,
        });

        console.log(`${role} account created for ${email}.`);
    }
     await mongoose.disconnect();
}

run().catch((error) => {
    console.error(error);
    process.exit(1);
})