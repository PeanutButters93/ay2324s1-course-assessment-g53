import Title from './Title';
import Chip from '@mui/material/Chip';

const ViewQuestion = (props) => {
    const question = props.question;
    return (
        <div>
            <Title>Question {question.id}</Title>
            <Title>{question.title}</Title>
            <div>Categories: {question.categories.map((category, index) => (
                    <Chip key = {category} label = {category} style={{ marginRight: '8px', marginBottom: '8px' }} />
                ))}
            </div>
            <div>Complexity: {question.complexity}</div>
            <div>{question.desc}</div>
            {console.log("End of ViewQuestion.js")}
        </div>
    )
};

export default ViewQuestion;