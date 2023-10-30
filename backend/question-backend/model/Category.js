import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true, 
        required: true // field required for document to be valid
    }
});

const Category = mongoose.model("category", categorySchema);
export default Category;