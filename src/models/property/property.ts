  import mongoose from "mongoose";
  import slugify from "slugify";

  const PropertySchema = new mongoose.Schema(
    {
      name: { type: String, required: true, trim: true },
      // NEW: Optional Dealer ID
      dealerId: { type: String, required: false, index: true }, 
      title: { type: String, required: true, trim: true },
      slug: { type: String, unique: true },
      description: { type: String, required: false },
      price: { type: Number, required: true, index: true },
      type: { type: String, enum: ["for sale", "for rent"], required: true, index: true },
      bedrooms: { type: Number, required: false },
      bathrooms: { type: Number, required: false },
      area: { type: Number, required: true },
      builtYear: { type: Number, required: false },
      address: { type: String, required: true },
    
      city: { type: String, required: true, index: true },
      images: [{ type: String }],
      front: { type: String, required: false },
      frontRoadWidth: { type: String, required: false },
      
      // STATUS COMPLETELY REMOVED HERE

      amenities: [{ type: String }],
    },
    { timestamps: true }
  );

PropertySchema.pre("validate", function (next) {
  // Only generate slug if it doesn't exist but a title does
  if (!this.slug && this.title) {
    
    // 1. Setup the prefix: "3bhk-house" or just "property" if bedrooms aren't provided
    const bhkPart = this.bedrooms ? `${this.bedrooms}bhk-house` : "property";

    // 2. Build the raw string: "3bhk-house-for sale-in-mission compound-saharanpur"
    // We use this.address to grab the locality they type in the form
    const rawSlugString = `${bhkPart}-${this.type}-in-${this.address}-${this.city}`;

    // 3. Pass it through slugify to format spaces and remove special characters
    const baseSlug = slugify(rawSlugString, { 
      lower: true, 
      strict: true 
    });

    // 4. Generate the unique suffix: e.g., "p251"
    // Using +100 ensures the number is always at least 3 digits
    const uniqueSuffix = `p${Math.floor(Math.random() * 1000) + 100}`;

    // 5. Set the final slug
    this.slug = `${baseSlug}-${uniqueSuffix}`;
  }
  next();
});
  export const Properties =
    mongoose.models.Properties || mongoose.model("Properties", PropertySchema);