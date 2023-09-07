import "./QuestionForm.css";

const QuestionForm = () => {
    return (
        <form>
            <h2>Question Form</h2>
            <div>
                <label htmlFor="title">Title: </label>
                <input type="text" id="title" />
            </div>
            <div>
                <label htmlFor="description">Description: </label>
                <textarea id="description" />
            </div>
            <div>
                <label htmlFor="category">Category: </label>
                <input type="text" id="category" />
            </div>
            <div>
                <label htmlFor="complexity">Complexity: </label>
                <select id="complexity">
                    <option value="EASY">Easy</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HARD">Hard</option>
                </select>
            </div>
            <button type="submit">Submit</button>
        </form>
    )
}

export default QuestionForm;