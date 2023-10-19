import Category from "../model/Category.js";

export async function deleteCategory(req, res) {
    const _id = req.params._id
    console.log(`Deleting category ${_id}`);
    try {
        await Category.deleteOne({ _id: _id })
        res.send("Success");
    } catch (error) {
        console.log(error);
        res.status(400).send(error);
    }
}