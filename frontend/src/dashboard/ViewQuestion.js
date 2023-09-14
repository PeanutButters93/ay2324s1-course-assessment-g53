import Title from './Title';

const ViewQuestion = (props) => {
    const question = props.question;
    return (
        <div>
            <Title>Question {question.id}</Title>
            <Title>{question.title}</Title>
            <div>Categories: {question.category}</div>
            <div>Complexity: {question.complexity}</div>
            <div>{question.description}</div>
        </div>
    )
};

export default ViewQuestion;